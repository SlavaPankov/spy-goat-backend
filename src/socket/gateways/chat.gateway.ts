import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ChatService } from '../../chat/chat.service';
import { SendMessageDto } from '../../chat/dto/send-message.dto';
import { SocketServerService } from '../socket-server.service';
import { SocketEvent } from '../types/socket-event-enum.types';
import { SocketResponseBuilder } from '../types/socket-response.types';
import { WsJwtGuard } from '../guards/ws-jwt.guard';

@WebSocketGateway(8082, { cors: true })
export class ChatGateway {
  constructor(
    private readonly chatService: ChatService,
    private readonly socketServer: SocketServerService
  ) {}

  @UseGuards(WsJwtGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @SubscribeMessage(SocketEvent.CHAT_SEND)
  async handleSend(@ConnectedSocket() client: Socket, @MessageBody() data: SendMessageDto) {
    try {
      const message = await this.chatService.sendMessage(data.roomId, data.playerId, data.content, data.replyToId);

      this.socketServer.emitToRoom(
        data.roomId,
        SocketEvent.CHAT_NEW_MESSAGE,
        {
          ...message,
          tempId: data.tempId,
        },
        data.eventId
      );
    } catch (error) {
      this.socketServer.emitError(client, SocketEvent.CHAT_MESSAGE_ERROR, error, {
        tempId: data.tempId,
        ...(data.eventId && { eventId: data.eventId }),
      });
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(SocketEvent.CHAT_MARK_READ)
  async handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string; playerId: string; eventId?: string }
  ) {
    try {
      const result = await this.chatService.markRead(data.messageId, data.playerId);
      if (!result) return;

      this.socketServer.emitToRoom(
        result.roomId,
        SocketEvent.CHAT_MESSAGE_READ,
        {
          messageId: result.messageId,
          playerId: data.playerId,
          readCount: result.readCount,
        },
        data.eventId
      );
    } catch (error) {
      this.socketServer.emitError(client, SocketEvent.CHAT_MESSAGE_READ, error, {
        ...(data.eventId && { eventId: data.eventId }),
      });
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(SocketEvent.CHAT_EDIT)
  async handleEdit(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string; playerId: string; content: string; roomId: string; eventId?: string }
  ) {
    try {
      const result = await this.chatService.editMessage(data.messageId, data.playerId, data.content);
      this.socketServer.emitToRoom(data.roomId, SocketEvent.CHAT_MESSAGE_EDITED, result, data.eventId);
    } catch (error) {
      this.socketServer.emitError(client, SocketEvent.CHAT_MESSAGE_EDITED, error, {
        ...(data.eventId && { eventId: data.eventId }),
      });
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(SocketEvent.CHAT_DELETE)
  async handleDelete(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string; playerId: string; eventId?: string }
  ) {
    try {
      const result = await this.chatService.deleteMessage(data.messageId, data.playerId);
      this.socketServer.emitToRoom(result.roomId, SocketEvent.CHAT_MESSAGE_DELETED, result, data.eventId);
    } catch (error) {
      this.socketServer.emitError(client, SocketEvent.CHAT_MESSAGE_DELETED, error, {
        ...(data.eventId && { eventId: data.eventId }),
      });
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(SocketEvent.CHAT_GET_HISTORY)
  async handleGetHistory(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; playerId: string; cursor?: string; eventId?: string }
  ) {
    try {
      const result = await this.chatService.getHistory(data.roomId, data.playerId, data.cursor);
      client.emit(SocketEvent.CHAT_HISTORY, SocketResponseBuilder.success(result, data.eventId));
    } catch (error) {
      this.socketServer.emitError(client, SocketEvent.CHAT_HISTORY, error, {
        ...(data.eventId && { eventId: data.eventId }),
      });
    }
  }
}
