// game.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Card, GameService } from './game.service';
import { RoomsService } from '../rooms/rooms.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../common/decorators/current-user.decorator';

interface JoinRoomPayload {
  roomId: string;
  userId: string;
}

interface StartGamePayload {
  roomId: string;
}

interface ChooseRowPayload {
  gameId: string;
  playerId: string;
  rowIndex: number;
}

interface GetGameStatePayload {
  gameId: string;
}

interface SuccessResponse<T = unknown> {
  success: true;
  data?: T;
  message?: string;
}

interface ErrorResponse {
  success: false;
  error: string;
}

type Response<T = unknown> = SuccessResponse<T> | ErrorResponse;

@WebSocketGateway(8082, { cors: true })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly gameService: GameService,
    private readonly roomService: RoomsService,
    private readonly jwtService: JwtService
  ) {}

  handleConnection(client: Socket) {
    try {
      const token: string = (client.handshake.auth.token || client.handshake.headers.authorization) as string;

      if (!token) {
        return new Error('No token provided');
      }

      const payload = this.jwtService.verify<JwtPayload>(token);

      (client.data as Record<string, string>).userId = payload.userId;

      console.log(`Client connected: ${client.id}, userId: ${payload.userId}`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribeRoom')
  async handleSubscribeRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: Pick<JoinRoomPayload, 'roomId'> & { gameId?: string }
  ) {
    try {
      await client.join(data.roomId);
      (client.data as Record<string, string>).roomId = data.roomId;

      this.server.to(data.roomId).emit('playerSubscribed');

      if (data.gameId) {
        const gameState = await this.gameService.getGameState(data.gameId);

        client.emit('gameStateChanged', gameState);
      }

      return { success: true, message: 'Joined room' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: JoinRoomPayload): Promise<Response> {
    try {
      await this.roomService.join(data.roomId, data.userId);

      this.server.to(data.roomId).emit('playerJoined', {
        userId: data.userId,
      });

      return { success: true, message: 'Joined room' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      console.log(errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  @SubscribeMessage('exitRoom')
  async handleExitRoom(@ConnectedSocket() client: Socket, @MessageBody() data: JoinRoomPayload): Promise<Response> {
    try {
      await this.roomService.exit(data.roomId, data.userId);

      this.server.to(data.roomId).emit('playerLeave', {
        userId: data.userId,
      });

      return { success: true, message: 'Player leave' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      console.log(errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  @SubscribeMessage('ready')
  async handleSetReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; playerId: string; isReady: boolean }
  ): Promise<Response> {
    try {
      const updatedPlayer = await this.gameService.setIsReady(data.playerId, data.isReady);

      this.server.to(data.roomId).emit('playerReady', {
        playerId: updatedPlayer.id,
      });

      return { success: true, message: 'Player ready' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      console.log(errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  @SubscribeMessage('startGame')
  async handleStartGame(@ConnectedSocket() client: Socket, @MessageBody() data: StartGamePayload): Promise<void> {
    try {
      const gameState = await this.gameService.startGame(data.roomId);

      this.server.to(data.roomId).emit('gameStarted', gameState);

      client.emit('gameStarted', gameState);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      client.emit('gameStarted', { success: false, error: errorMessage });
    }
  }

  @SubscribeMessage('selectCard')
  async handleSelectCard(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { playerId: string; card: Card }
  ): Promise<Response> {
    try {
      await this.gameService.selectCard(data.playerId, data.card);

      client.emit('cardSelected', {
        success: true,
        card: data.card,
      });

      return { success: true, message: 'Card selected' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  @SubscribeMessage('confirmCard')
  async handleConfirmCard(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { playerId: string }
  ): Promise<Response> {
    try {
      const result = await this.gameService.confirmCardChoice(data.playerId);

      const player = await this.gameService['prismaService'].player.findUnique({
        where: { id: data.playerId },
        include: { room: true },
      });

      if (!player) {
        return { success: false, error: 'Player not found' };
      }

      this.server.to(player.room.id).emit('cardConfirmed', {
        playerId: data.playerId,
        card: player.selectedCard,
      });

      if (result.allReady) {
        const revealedCards = await this.gameService.revealCards(result.gameId);

        this.server.to(player.room.id).emit('cardsRevealed', {
          cards: revealedCards,
        });

        setTimeout(() => {
          void (async () => {
            try {
              const turnResult = await this.gameService.startTurnProcessing(result.gameId);

              if (turnResult.action.actionType === 'choose_row') {
                this.server.to(player.room.id).emit('needRowChoice', {
                  currentChoosingPlayer: turnResult.currentChoosingPlayer,
                  action: turnResult.action,
                  gameState: turnResult,
                });
              } else {
                // Все действия применены автоматически
                this.server.to(player.room.id).emit('roundFinished', turnResult);

                const allHandsEmpty = turnResult.players.every((p) => p.hand.length === 0);

                if (allHandsEmpty) {
                  this.server.to(player.room.id).emit('gameEnded', turnResult);
                }
              }
            } catch (error) {
              console.error('Error processing turn:', error);
              this.server.to(player.room.id).emit('error', {
                message: 'Failed to process turn',
              });
            }
          })();
        }, 3000);
      }

      return { success: true, data: result };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  @SubscribeMessage('chooseRow')
  async handleChooseRow(@ConnectedSocket() client: Socket, @MessageBody() data: ChooseRowPayload): Promise<Response> {
    try {
      const result = await this.gameService.chooseRow(data.gameId, data.playerId, data.rowIndex);

      this.server.to(result.roomId).emit('rowChosen', {
        playerId: data.playerId,
        rowIndex: data.rowIndex,
      });

      if (result.action?.actionType === 'choose_row') {
        // Следующий игрок тоже должен выбрать ряд
        this.server.to(result.roomId).emit('needRowChoice', {
          currentChoosingPlayer: result.currentChoosingPlayer,
          action: result.action,
          gameState: result,
        });
      } else {
        // Все действия применены - раунд завершен
        this.server.to(result.roomId).emit('roundFinished', result);

        const allHandsEmpty = result.players.every((p) => p.hand.length === 0);

        if (allHandsEmpty) {
          this.server.to(result.roomId).emit('gameEnded', result);
        }
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  @SubscribeMessage('getGameState')
  async handleGetGameState(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: GetGameStatePayload
  ): Promise<Response> {
    try {
      const gameState = await this.gameService.getGameState(data.gameId);
      return { success: true, data: gameState };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }
}
