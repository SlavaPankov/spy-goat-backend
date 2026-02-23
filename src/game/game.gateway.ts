import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Card, GameService } from './game.service';
import { RoomsService } from '../rooms/rooms.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../common/decorators/current-user.decorator';
import { SocketResponseBuilder } from './types/socket-response.types';
import { SocketEvent } from './types/socket-event-enum.types';

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

  private handleError(client: Socket, event: SocketEvent, error: unknown): void {
    console.error(`Error in ${event}:`, error);
    client.emit(event, SocketResponseBuilder.fromError(error));
  }

  private emitToRoom<T>(roomId: string, event: SocketEvent, data: T): void {
    this.server.to(roomId).emit(event, SocketResponseBuilder.success(data));
  }

  @SubscribeMessage(SocketEvent.SUBSCRIBE_ROOM)
  async handleSubscribeRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: Pick<JoinRoomPayload, 'roomId'> & { gameId?: string }
  ) {
    try {
      await client.join(data.roomId);
      (client.data as Record<string, string>).roomId = data.roomId;

      this.emitToRoom(data.roomId, SocketEvent.PLAYER_SUBSCRIBED, { roomId: data.roomId });

      if (data.gameId) {
        const gameState = await this.gameService.getGameState(data.gameId);
        this.emitToRoom(data.roomId, SocketEvent.GAME_STATE_CHANGED, { gameState });
      }
    } catch (error) {
      this.handleError(client, SocketEvent.PLAYER_SUBSCRIBED, error);
    }
  }

  @SubscribeMessage(SocketEvent.JOIN_ROOM)
  async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: JoinRoomPayload) {
    try {
      await this.roomService.join(data.roomId, data.userId);

      this.emitToRoom(data.roomId, SocketEvent.PLAYER_JOINED, { userId: data.userId });
    } catch (error) {
      this.handleError(client, SocketEvent.PLAYER_JOINED, error);
    }
  }

  @SubscribeMessage(SocketEvent.EXIT_ROOM)
  async handleExitRoom(@ConnectedSocket() client: Socket, @MessageBody() data: JoinRoomPayload) {
    try {
      await this.roomService.exit(data.roomId, data.userId);
      this.emitToRoom(data.roomId, SocketEvent.PLAYER_LEAVE, { userId: data.userId });
    } catch (error) {
      this.handleError(client, SocketEvent.PLAYER_LEAVE, error);
    }
  }

  @SubscribeMessage(SocketEvent.READY)
  async handleSetReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; playerId: string; isReady: boolean }
  ) {
    try {
      const updatedPlayer = await this.gameService.setIsReady(data.playerId, data.isReady);
      this.emitToRoom(data.roomId, SocketEvent.PLAYER_READY, {
        playerId: updatedPlayer.id,
        isReady: updatedPlayer.isReady,
      });
    } catch (error) {
      this.handleError(client, SocketEvent.PLAYER_READY, error);
    }
  }

  @SubscribeMessage(SocketEvent.START_GAME)
  async handleStartGame(@ConnectedSocket() client: Socket, @MessageBody() data: StartGamePayload) {
    try {
      const gameState = await this.gameService.startGame(data.roomId);
      this.emitToRoom(data.roomId, SocketEvent.GAME_STARTED, gameState);
    } catch (error) {
      this.handleError(client, SocketEvent.GAME_STARTED, error);
    }
  }

  @SubscribeMessage(SocketEvent.SELECT_CARD)
  async handleSelectCard(@ConnectedSocket() client: Socket, @MessageBody() data: { playerId: string; card: Card }) {
    try {
      await this.gameService.selectCard(data.playerId, data.card);
      client.emit(SocketEvent.CARD_SELECTED, SocketResponseBuilder.success({ card: data.card }));
    } catch (error) {
      this.handleError(client, SocketEvent.CARD_SELECTED, error);
    }
  }

  @SubscribeMessage(SocketEvent.CONFIRM_CARD)
  async handleConfirmCard(@ConnectedSocket() client: Socket, @MessageBody() data: { playerId: string }) {
    try {
      const result = await this.gameService.confirmCardChoice(data.playerId);

      const player = await this.gameService['prismaService'].player.findUnique({
        where: { id: data.playerId },
        include: { room: true },
      });

      if (!player) {
        this.handleError(client, SocketEvent.CARD_CONFIRMED, 'player not found');

        return;
      }

      this.emitToRoom(player.room.id, SocketEvent.CARD_CONFIRMED, {
        playerId: data.playerId,
        card: player.selectedCard,
      });

      if (result.allReady) {
        const revealedCards = await this.gameService.revealCards(result.gameId);

        this.emitToRoom(player.room.id, SocketEvent.CARDS_REVEALED, { cards: revealedCards });

        setTimeout(() => {
          void (async () => {
            try {
              const turnResult = await this.gameService.startTurnProcessing(result.gameId);

              if (turnResult.action.actionType === 'choose_row') {
                this.emitToRoom(player.room.id, SocketEvent.NEED_ROW_CHOICE, {
                  currentChoosingPlayer: turnResult.currentChoosingPlayer,
                  action: turnResult.action,
                  gameState: turnResult,
                });
              } else {
                if (turnResult.isRoundFinished) {
                  const roundData = await this.gameService.getRoundFinishedData(result.gameId);

                  this.emitToRoom(player.room.id, SocketEvent.ROUND_FINISHED, roundData);
                } else {
                  // Обычное окончание хода
                  this.emitToRoom(player.room.id, SocketEvent.TURN_FINISHED, { gameState: turnResult });
                }

                // Проверяем, закончилась ли игра
                const allHandsEmpty = turnResult.players.every((p) => p.hand.length === 0);

                if (allHandsEmpty) {
                  // Ждём немного перед проверкой окончания игры (чтобы roundFinished успел отобразиться)
                  setTimeout(() => {
                    void (async () => {
                      const gameState = await this.gameService.getGameState(result.gameId);

                      if (gameState.status === 'FINISHED') {
                        this.emitToRoom(player.room.id, SocketEvent.GAME_ENDED, { gameState });
                      }
                    })();
                  }, 2000);
                }
              }
            } catch (error) {
              console.error('Error processing turn:', error);
              this.server.to(player.room.id).emit(SocketEvent.ERROR, SocketResponseBuilder.fromError(error));
            }
          })();
        }, 3000);
      }
    } catch (error) {
      this.handleError(client, SocketEvent.CARD_CONFIRMED, error);
    }
  }

  @SubscribeMessage(SocketEvent.CHOOSE_ROW)
  async handleChooseRow(@ConnectedSocket() client: Socket, @MessageBody() data: ChooseRowPayload) {
    try {
      const result = await this.gameService.chooseRow(data.gameId, data.playerId, data.rowIndex);

      this.emitToRoom(result.roomId, SocketEvent.ROW_CHOSEN, {
        playerId: data.playerId,
        rowIndex: data.rowIndex,
      });

      if (result.action?.actionType === 'choose_row') {
        // Следующий игрок тоже должен выбрать ряд
        this.emitToRoom(result.roomId, SocketEvent.NEED_ROW_CHOICE, {
          currentChoosingPlayer: result.currentChoosingPlayer,
          action: result.action,
          gameState: result,
        });
      } else {
        const allHandsEmpty = result.players.every((p) => p.hand.length === 0);

        if (allHandsEmpty) {
          const roundData = await this.gameService.getRoundFinishedData(data.gameId);
          this.emitToRoom(result.roomId, SocketEvent.ROUND_FINISHED, roundData);

          // Проверяем окончание игры
          setTimeout(() => {
            void (async () => {
              const gameState = await this.gameService.getGameState(data.gameId);

              if (gameState.status === 'FINISHED') {
                this.emitToRoom(result.roomId, SocketEvent.GAME_ENDED, { gameState });
              }
            })();
          }, 2000);
        } else {
          this.emitToRoom(result.roomId, SocketEvent.TURN_FINISHED, { gameState: result });
        }
      }
    } catch (error) {
      this.handleError(client, SocketEvent.CHOOSE_ROW, error);
    }
  }

  @SubscribeMessage(SocketEvent.GET_GAME_STATE)
  async handleGetGameState(@ConnectedSocket() client: Socket, @MessageBody() data: GetGameStatePayload) {
    try {
      const gameState = await this.gameService.getGameState(data.gameId);

      this.emitToRoom(gameState.roomId, SocketEvent.GAME_STATE_CHANGED, { gameState });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      console.log(errorMessage);

      return { event: 'getGameState', data: { success: false, error: errorMessage } };
    }
  }
}
