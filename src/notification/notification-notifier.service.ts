import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { SocketServerService } from '../socket/socket-server.service';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationDto } from './dto/notification.dto';
import { SocketEvent } from '../socket/types/socket-event-enum.types';
import { SocketResponseBuilder } from '../socket/types/socket-response.types';

@Injectable()
export class NotificationNotifier {
  constructor(
    @Inject(forwardRef(() => SocketServerService))
    private readonly socketServer: SocketServerService
  ) {}

  @OnEvent('notification.create')
  handleNotificationCreated({ userId, notification }: { userId: string; notification: NotificationDto }) {
    this.socketServer
      .getServer()
      .to(`user:${userId}`)
      .emit(SocketEvent.NOTIFICATION_NEW, SocketResponseBuilder.success({ notification }));
  }

  @OnEvent('notification.read')
  handleReadNotification({ userId, notificationId }: { userId: string; notificationId: string }) {
    this.socketServer
      .getServer()
      .to(`user:${userId}`)
      .emit(SocketEvent.NOTIFICATION_READ, SocketResponseBuilder.success({ notificationId }));
  }

  @OnEvent('notification.allRead')
  handleReadAll({ userId }: { userId: string }) {
    this.socketServer.getServer().to(`user:${userId}`).emit(SocketEvent.NOTIFICATION_ALL_READ, {});
  }
}
