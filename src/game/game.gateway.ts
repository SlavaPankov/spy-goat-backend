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
import { Card, GameService, GameState, RoundFinishedData } from './game.service';
import { RoomsService } from '../rooms/rooms.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../common/decorators/current-user.decorator';
import { SocketResponseBuilder } from './types/socket-response.types';
import { SocketEvent } from './types/socket-event-enum.types';
import { ChatService } from '../chat/chat.service';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { SendMessageDto } from '../chat/dto/send-message.dto';

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

enum SocketConnectionError {
  NO_TOKEN = 'NO_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
}

@WebSocketGateway(8082, { cors: true })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly gameService: GameService,
    private readonly roomService: RoomsService,
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService
  ) {}

  handleConnection(client: Socket) {
    try {
      const token: string = (client.handshake.auth.token || client.handshake.headers.authorization) as string;

      if (!token) {
        console.log('❌ No token provided');

        client.emit('auth_error', {
          code: SocketConnectionError.NO_TOKEN,
          message: 'No token provided',
        });

        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify<JwtPayload>(token);

      (client.data as Record<string, string>).userId = payload.userId;

      console.log(`✅ Client connected: ${client.id}, userId: ${payload.userId}`);
    } catch (err) {
      console.error('❌ Connection error:', err);

      let errorCode = SocketConnectionError.TOKEN_INVALID;
      let errorMessage = 'Token is invalid';

      if (err instanceof Error) {
        if (err.name === 'TokenExpiredError') {
          errorCode = SocketConnectionError.TOKEN_EXPIRED;
          errorMessage = 'Token has expired';
        } else if (err.name === 'JsonWebTokenError') {
          errorCode = SocketConnectionError.TOKEN_INVALID;
        }
      }

      client.emit('auth_error', {
        code: errorCode,
        message: errorMessage,
      });

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

  private emitTurnResult(
    roomId: string,
    result: GameState & { isRoundFinished?: boolean; isGameEnded?: boolean; roundData?: RoundFinishedData }
  ): void {
    if (result.isGameEnded) {
      this.emitToRoom(roomId, SocketEvent.GAME_ENDED, { gameState: result });
      return;
    }

    if (result.isRoundFinished && result.roundData) {
      this.emitToRoom(roomId, SocketEvent.ROUND_FINISHED, result.roundData);
      return;
    }

    this.emitToRoom(roomId, SocketEvent.TURN_FINISHED, { gameState: result });
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

      const [roomDetails, roomPlayers] = await Promise.all([
        this.roomService.findOneDetails(data.roomId),
        this.roomService.findRoomPlayers(data.roomId),
      ]);

      this.emitToRoom(data.roomId, SocketEvent.PLAYER_JOINED, { roomDetails, roomPlayers });
    } catch (error) {
      this.handleError(client, SocketEvent.PLAYER_JOINED_ERROR, error);
    }
  }

  @SubscribeMessage(SocketEvent.EXIT_ROOM)
  async handleExitRoom(@ConnectedSocket() client: Socket, @MessageBody() data: JoinRoomPayload) {
    try {
      await this.roomService.exit(data.roomId, data.userId);

      const [roomDetails, roomPlayers] = await Promise.all([
        this.roomService.findOneDetails(data.roomId),
        this.roomService.findRoomPlayers(data.roomId),
      ]);

      this.emitToRoom(data.roomId, SocketEvent.PLAYER_LEAVE, { roomDetails, roomPlayers });
    } catch (error) {
      this.handleError(client, SocketEvent.PLAYER_LEAVE_ERROR, error);
    }
  }

  @SubscribeMessage(SocketEvent.READY)
  async handleSetReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; playerId: string; isReady: boolean }
  ) {
    try {
      await this.gameService.setIsReady(data.playerId, data.isReady);

      const [roomDetails, roomPlayers] = await Promise.all([
        this.roomService.findOneDetails(data.roomId),
        this.roomService.findRoomPlayers(data.roomId),
      ]);

      this.emitToRoom(data.roomId, SocketEvent.PLAYER_READY, {
        roomDetails,
        roomPlayers,
      });
    } catch (error) {
      this.handleError(client, SocketEvent.PLAYER_READY_ERROR, error);
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
  async handleSelectCard(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string; roomId: string; playerId: string; card: Card }
  ) {
    try {
      await this.gameService.selectCard(data.playerId, data.card);

      const [gameState, currentPlayer] = await Promise.all([
        this.gameService.getGameState(data.gameId),
        this.roomService.findPlayerByUserId(data.roomId, (client.data as Record<string, string>).userId),
      ]);

      client.emit(
        SocketEvent.CARD_SELECTED,
        SocketResponseBuilder.success({ card: data.card, gameState, currentPlayer })
      );
    } catch (error) {
      this.handleError(client, SocketEvent.CARD_SELECTED, error);
    }
  }

  @SubscribeMessage(SocketEvent.CONFIRM_CARD)
  async handleConfirmCard(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string; roomId: string; playerId: string }
  ) {
    try {
      const result = await this.gameService.confirmCardChoice(data.playerId);

      const [gameState, currentPlayer] = await Promise.all([
        this.gameService.getGameState(data.gameId),
        this.roomService.findPlayerByUserId(data.roomId, (client.data as Record<string, string>).userId),
      ]);

      if (!currentPlayer) {
        this.handleError(client, SocketEvent.CARD_CONFIRMED, 'player not found');

        return;
      }

      this.emitToRoom(data.roomId, SocketEvent.CARD_CONFIRMED, {
        card: currentPlayer.selectedCard,
        currentPlayer,
        gameState,
      });

      if (result.allReady) {
        const revealedCards = await this.gameService.revealCards(result.gameId);

        this.emitToRoom(data.roomId, SocketEvent.CARDS_REVEALED, { cards: revealedCards });

        setTimeout(() => {
          void (async () => {
            try {
              const turnResult = await this.gameService.startTurnProcessing(result.gameId);

              if (turnResult.action.actionType === 'choose_row') {
                this.emitToRoom(data.roomId, SocketEvent.NEED_ROW_CHOICE, {
                  currentChoosingPlayer: turnResult.currentChoosingPlayer,
                  action: turnResult.action,
                  gameState: turnResult,
                });
              } else {
                this.emitTurnResult(data.roomId, turnResult);
              }
            } catch (error) {
              console.error('Error processing turn:', error);
              this.server.to(data.roomId).emit(SocketEvent.ERROR, SocketResponseBuilder.fromError(error));
            }
          })();
        }, 3000);
      }
    } catch (error) {
      this.handleError(client, SocketEvent.CARD_CONFIRMED, error);
    }
  }

  @SubscribeMessage(SocketEvent.DECLINE_CARD)
  async handleDeclineCard(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string; roomId: string; playerId: string }
  ) {
    try {
      await this.gameService.declineCardChoice(data.playerId);

      const [gameState, currentPlayer] = await Promise.all([
        this.gameService.getGameState(data.gameId),
        this.roomService.findPlayerByUserId(data.roomId, (client.data as Record<string, string>).userId),
      ]);

      if (!currentPlayer) {
        this.handleError(client, SocketEvent.CARD_DECLINED, 'player not found');
        return;
      }

      this.emitToRoom(data.roomId, SocketEvent.CARD_DECLINED, {
        playerId: data.playerId,
        gameState,
        currentPlayer,
      });
    } catch (error) {
      this.handleError(client, SocketEvent.CARD_DECLINED, error);
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
        this.emitTurnResult(result.roomId, result);
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

  @SubscribeMessage(SocketEvent.SEND_MESSAGE)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async handleSendMessage(@ConnectedSocket() client: Socket, @MessageBody() data: SendMessageDto) {
    try {
      const message = await this.chatService.sendMessage(data.roomId, data.playerId, data.content);

      // tempId нужен чтобы клиент сопоставил pending-сообщение с реальным
      this.emitToRoom(data.roomId, SocketEvent.NEW_MESSAGE, {
        ...message,
        tempId: data.tempId,
      });
    } catch (error: unknown) {
      // возвращаем tempId чтобы клиент показал ошибку у нужного сообщения
      client.emit(SocketEvent.MESSAGE_ERROR, { tempId: data.tempId, error });
    }
  }

  @SubscribeMessage(SocketEvent.MARK_READ)
  async handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string; playerId: string }
  ) {
    try {
      const result = await this.chatService.markRead(data.messageId, data.playerId);

      if (!result) {
        return;
      }

      this.emitToRoom(result.roomId, SocketEvent.MESSAGE_READ, {
        messageId: result.messageId,
        playerId: data.playerId,
        readCount: result.readCount,
      });
    } catch (error) {
      this.handleError(client, SocketEvent.MESSAGE_READ, error);
    }
  }

  @SubscribeMessage(SocketEvent.GET_CHAT_HISTORY)
  async handleGetChatHistory(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; cursor?: string }
  ) {
    try {
      const messages = await this.chatService.getHistory(data.roomId, data.cursor);

      client.emit(SocketEvent.CHAT_HISTORY, SocketResponseBuilder.success(messages));
    } catch (error) {
      this.handleError(client, SocketEvent.CHAT_HISTORY, error);
    }
  }
}
