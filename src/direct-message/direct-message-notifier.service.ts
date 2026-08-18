import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { SocketServerService } from '../socket/socket-server.service';
import { OnEvent } from '@nestjs/event-emitter';
import { DirectMessageDto } from './dto/direct-message.dto';
import { SocketEvent } from '../socket/types/socket-event-enum.types';

@Injectable()
export class DirectMessageNotifier {
  constructor(
    @Inject(forwardRef(() => SocketServerService))
    private readonly socketServer: SocketServerService
  ) {}

  private emitToRoom(message: DirectMessageDto, event: SocketEvent) {
    this.socketServer.emitToRoom(`user:${message.sender.id}`, event, message);
    this.socketServer.emitToRoom(`user:${message.recipient.id}`, event, message);
  }

  @OnEvent('dm.create')
  handleCreate({ message }: { message: DirectMessageDto }) {
    this.emitToRoom(message, SocketEvent.DM_NEW);
  }

  @OnEvent('dm.read')
  handleRead({ message }: { message: DirectMessageDto }) {
    this.emitToRoom(message, SocketEvent.DM_READ);
  }

  @OnEvent('dm.update')
  handleUpdate({ message }: { message: DirectMessageDto }) {
    this.emitToRoom(message, SocketEvent.DM_UPDATE);
  }

  @OnEvent('dm.delete')
  handleDelete({ message }: { message: DirectMessageDto }) {
    this.emitToRoom(message, SocketEvent.DM_DELETE);
  }

  @OnEvent('dm.readAll')
  handleReadAll(payload: { conversationId: string; readerId: string; otherUserId: string; readAt: Date }) {
    this.socketServer.emitToRoom(`user:${payload.readerId}`, SocketEvent.DM_READ_ALL, payload);
    this.socketServer.emitToRoom(`user:${payload.otherUserId}`, SocketEvent.DM_READ_ALL, payload);
  }

  @OnEvent('dm.deleteConversation')
  handleDeleteConversation(payload: { conversationId: string; readerId: string; otherUserId: string }) {
    this.socketServer.emitToRoom(`user:${payload.readerId}`, SocketEvent.DM_DELETE_CONVERSATION, {
      conversationId: payload.conversationId,
    });
    this.socketServer.emitToRoom(`user:${payload.otherUserId}`, SocketEvent.DM_DELETE_CONVERSATION, {
      conversationId: payload.conversationId,
    });
  }
}
