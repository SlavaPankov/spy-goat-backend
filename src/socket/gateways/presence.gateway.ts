import { SubscribeMessage, ConnectedSocket, MessageBody, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { PresenceService } from '../../presence/presence.service';

const MAX_SUBSCRIBE_BATCH = 50;

@WebSocketGateway(8082, { cors: true })
export class PresenceGateway {
  constructor(private readonly presenceService: PresenceService) {}

  @SubscribeMessage('presence:subscribe')
  async handleSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() userIds: string[]
  ): Promise<Record<string, { isOnline: boolean; lastSeenAt: Date | null }>> {
    const ids = userIds.slice(0, MAX_SUBSCRIBE_BATCH);

    ids.forEach((id) => client.join(`presence:${id}`));

    return this.presenceService.getBulkStatus(ids);
  }

  @SubscribeMessage('presence:unsubscribe')
  handleUnsubscribe(@ConnectedSocket() client: Socket, @MessageBody() userIds: string[]): void {
    userIds.forEach((id) => client.leave(`presence:${id}`));
  }
}
