import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SocketServerService } from '../socket/socket-server.service';

@Injectable()
export class PresenceNotifier {
  constructor(
    @Inject(forwardRef(() => SocketServerService))
    private readonly socketServer: SocketServerService
  ) {}

  @OnEvent('presence.changed')
  handlePresenceChanged(payload: { userId: string; isOnline: boolean; lastSeenAt: Date | null }): void {
    this.socketServer.getServer().to(`presence:${payload.userId}`).emit('presence:changed', payload);
  }
}
