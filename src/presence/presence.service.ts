import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PresenceService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  private readonly connections = new Map<string, Set<string>>();

  isOnline(userId: string) {
    return (this.connections.get(userId)?.size ?? 0) > 0;
  }

  getSocketIds(userId: string): string[] {
    return Array.from(this.connections.get(userId) ?? []);
  }

  async getBulkStatus(userIds: string[]): Promise<Record<string, { isOnline: boolean; lastSeenAt: Date | null }>> {
    const users = await this.prismaService.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, isOnline: true, lastSeenAt: true },
    });

    return Object.fromEntries(users.map((u) => [u.id, { isOnline: u.isOnline, lastSeenAt: u.lastSeenAt }]));
  }

  async registerConnection(userId: string, socketId: string): Promise<void> {
    const wasOffline = !this.isOnline(userId);

    const sockets = this.connections.get(userId) ?? new Set();
    sockets.add(socketId);
    this.connections.set(userId, sockets);

    if (wasOffline) {
      await this.prismaService.user.update({
        where: { id: userId },
        data: { isOnline: true, lastSeenAt: null },
      });

      this.eventEmitter.emit('presence.changed', { userId, isOnline: true, lastSeenAt: null });
    }
  }

  async registerDisconnection(userId: string, socketId: string): Promise<void> {
    const sockets = this.connections.get(userId);

    if (!sockets) {
      return;
    }

    sockets.delete(socketId);

    if (sockets.size === 0) {
      this.connections.delete(userId);

      const lastSeenAt = new Date();

      await this.prismaService.user.update({
        where: { id: userId },
        data: { isOnline: false, lastSeenAt },
      });

      this.eventEmitter.emit('presence.changed', { userId, isOnline: false, lastSeenAt });
    }
  }
}
