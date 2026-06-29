// socket/gateways/room.gateway.ts
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Socket } from 'socket.io';
import { RoomsService } from '../../rooms/rooms.service';
import { SocketServerService } from '../socket-server.service';
import { SocketEvent } from '../types/socket-event-enum.types';
import { SocketResponseBuilder } from '../types/socket-response.types';
import { GameService } from '../../game/game.service';
import { WsJwtGuard } from '../guards/ws-jwt.guard';

@WebSocketGateway(8082, { cors: true })
export class RoomGateway {
  constructor(
    private readonly roomService: RoomsService,
    private readonly gameService: GameService,
    private readonly socketServer: SocketServerService
  ) {}

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(SocketEvent.ROOM_SUBSCRIBE)
  async handleSubscribe(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string; gameId?: string }) {
    try {
      await client.join(data.roomId);
      (client.data as Record<string, string>).roomId = data.roomId;

      client.emit(
        SocketEvent.ROOM_SUBSCRIBED,
        SocketResponseBuilder.success({
          roomId: data.roomId,
        })
      );

      if (data.gameId) {
        const gameState = await this.gameService.getGameState(data.gameId);
        this.socketServer.emitToRoom(data.roomId, SocketEvent.GAME_STATE_CHANGED, { gameState });
      }
    } catch (error) {
      this.socketServer.emitError(client, SocketEvent.ROOM_SUBSCRIBED, error);
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(SocketEvent.ROOM_JOIN)
  async handleJoin(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string; userId: string }) {
    try {
      await this.roomService.join(data.roomId, data.userId);

      const [roomDetails, roomPlayers, currentPlayer, roomStats] = await Promise.all([
        this.roomService.findOneDetails(data.roomId),
        this.roomService.findRoomPlayers(data.roomId),
        this.roomService.findPlayerByUserId(data.roomId, data.userId),
        this.roomService.findRoomStats(data.roomId),
      ]);

      this.socketServer.emitToRoom(data.roomId, SocketEvent.ROOM_PLAYER_JOINED, { roomDetails, roomPlayers });
      this.socketServer.emitToRoom(data.roomId, SocketEvent.ROOM_STATS_UPDATED, { roomStats });

      client.emit(SocketEvent.ROOM_PLAYER_UPDATED, SocketResponseBuilder.success({ currentPlayer }));
    } catch (error) {
      this.socketServer.emitError(client, SocketEvent.ROOM_PLAYER_JOINED_ERROR, error);
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(SocketEvent.ROOM_EXIT)
  async handleExit(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string; userId: string }) {
    try {
      const result = await this.roomService.exit(data.roomId, data.userId);

      console.log(result);

      if (!result.deleted) {
        const [roomDetails, roomPlayers, roomStats] = await Promise.all([
          this.roomService.findOneDetails(data.roomId),
          this.roomService.findRoomPlayers(data.roomId),
          this.roomService.findRoomStats(data.roomId),
        ]);

        this.socketServer.emitToRoom(data.roomId, SocketEvent.ROOM_PLAYER_LEAVE, { roomDetails, roomPlayers });
        this.socketServer.emitToRoom(data.roomId, SocketEvent.ROOM_STATS_UPDATED, { roomStats });
      }

      client.emit(SocketEvent.ROOM_YOU_LEAVE, SocketResponseBuilder.success({}));
    } catch (error) {
      this.socketServer.emitError(client, SocketEvent.ROOM_PLAYER_LEAVE_ERROR, error);
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(SocketEvent.ROOM_READY)
  async handleReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; playerId: string; isReady: boolean }
  ) {
    try {
      await this.gameService.setIsReady(data.playerId, data.roomId, data.isReady);

      const [roomDetails, roomPlayers, currentPlayer] = await Promise.all([
        this.roomService.findOneDetails(data.roomId),
        this.roomService.findRoomPlayers(data.roomId),
        this.roomService.findPlayerById(data.playerId),
      ]);

      this.socketServer.emitToRoom(data.roomId, SocketEvent.ROOM_PLAYER_READY, { roomDetails, roomPlayers });

      client.emit(SocketEvent.ROOM_PLAYER_UPDATED, SocketResponseBuilder.success({ currentPlayer }));
    } catch (error) {
      this.socketServer.emitError(client, SocketEvent.ROOM_PLAYER_READY_ERROR, error);
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(SocketEvent.GAME_START)
  async handleStartGame(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string }) {
    try {
      const gameState = await this.gameService.startGame(data.roomId);
      this.socketServer.emitToRoom(data.roomId, SocketEvent.GAME_STARTED, gameState);
    } catch (error) {
      this.socketServer.emitError(client, SocketEvent.GAME_STARTED_ERROR, error);
    }
  }
}
