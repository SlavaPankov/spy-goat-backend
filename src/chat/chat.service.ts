import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { decrypt, encrypt } from '../utils/crypto.utils';

@Injectable()
export class ChatService {
  private readonly rateLimitMap = new Map<string, number[]>();
  private readonly RATE_LIMIT = 5;
  private readonly RATE_WINDOW_MS = 5000;

  constructor(private readonly prismaService: PrismaService) {}

  private checkRateLimit(playerId: string): void {
    const now = Date.now();
    const timestamps = (this.rateLimitMap.get(playerId) ?? []).filter((ts) => now - ts < this.RATE_WINDOW_MS);

    if (timestamps.length >= this.RATE_LIMIT) {
      throw new BadRequestException('Too many messages. Slow down.');
    }

    timestamps.push(now);

    this.rateLimitMap.set(playerId, timestamps);
  }

  private decryptMessage(message: { id: string; content: string; iv: string; createdAt: Date; player: unknown }) {
    const { iv, content, ...rest } = message;

    return {
      ...rest,
      content: decrypt(content, iv),
    };
  }

  async sendMessage(roomId: string, playerId: string, rawContent: string) {
    this.checkRateLimit(playerId);

    const player = await this.prismaService.player.findFirst({
      where: { id: playerId, roomId },
    });

    if (!player) {
      throw new BadRequestException('Player is not in this room');
    }

    const { content, iv } = encrypt(rawContent.trim());

    const message = await this.prismaService.message.create({
      data: { content, iv, roomId, playerId },
      select: {
        id: true,
        content: true,
        iv: true,
        createdAt: true,
        player: {
          select: {
            id: true,
            user: { select: { username: true } },
          },
        },
      },
    });

    return this.decryptMessage(message);
  }

  async markRead(messageId: string, playerId: string) {
    await this.prismaService.messageRead.upsert({
      where: { messageId_playerId: { messageId, playerId } },
      create: { messageId, playerId },
      update: {},
    });

    const [readCount, message] = await Promise.all([
      this.prismaService.messageRead.count({ where: { messageId } }),
      this.prismaService.message.findUnique({
        where: { id: messageId },
        select: { roomId: true, playerId: true },
      }),
    ]);

    if (!message) return null;

    return {
      messageId,
      readCount,
      roomId: message.roomId,
      senderId: message.playerId,
    };
  }

  async getHistory(roomId: string, cursor?: string, limit = 50) {
    const messages = await this.prismaService.message.findMany({
      where: { roomId },
      take: limit,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        createdAt: true,
        iv: true,
        player: {
          select: {
            id: true,
            position: true,
            user: { select: { username: true } },
          },
        },
      },
    });

    return messages.reverse().map((message) => this.decryptMessage(message)); // возвращаем в хронологическом порядке
  }
}
