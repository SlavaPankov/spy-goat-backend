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
import { GameService } from './game.service';

interface JoinRoomPayload {
  roomId: string;
  userId: string;
}

interface StartGamePayload {
  roomId: string;
}

interface PlayCardPayload {
  gameId: string;
  playerId: string;
  cardNumber: number;
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

  constructor(private readonly gameService: GameService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Обработать отключение игрока
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: JoinRoomPayload): Promise<Response> {
    try {
      await client.join(data.roomId);

      this.server.to(data.roomId).emit('playerJoined', {
        userId: data.userId,
      });

      return { success: true, message: 'Joined room' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  @SubscribeMessage('startGame')
  async handleStartGame(@ConnectedSocket() client: Socket, @MessageBody() data: StartGamePayload): Promise<Response> {
    try {
      const gameState = await this.gameService.startGame(data.roomId);
      this.server.to(data.roomId).emit('gameStarted', gameState);

      return { success: true, data: gameState };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  @SubscribeMessage('playCard')
  async handlePlayCard(@ConnectedSocket() client: Socket, @MessageBody() data: PlayCardPayload): Promise<Response> {
    try {
      await this.gameService.playCard(data.gameId, data.playerId, data.cardNumber);

      const gameState = await this.gameService.getGameState(data.gameId);
      this.server.to(gameState.roomId).emit('cardPlayed', {
        playerId: data.playerId,
        cardNumber: data.cardNumber,
      });

      const allPlayed = await this.gameService.checkAllPlayersPlayed(data.gameId);

      if (allPlayed) {
        const turnResult = await this.gameService.processTurn(data.gameId);
        this.server.to(turnResult.roomId).emit('turnProcessed', turnResult);
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  @SubscribeMessage('chooseRow')
  async handleChooseRow(@ConnectedSocket() client: Socket, @MessageBody() data: ChooseRowPayload): Promise<Response> {
    try {
      await this.gameService.chooseRow(data.gameId, data.playerId, data.rowIndex);

      const gameState = await this.gameService.getGameState(data.gameId);
      this.server.to(gameState.roomId).emit('rowChosen', {
        playerId: data.playerId,
        rowIndex: data.rowIndex,
        gameState,
      });

      return { success: true, data: gameState };
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
