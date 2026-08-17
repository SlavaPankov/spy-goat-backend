import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { decrypt, encrypt } from '../utils/crypto.utils';
import { EErrorMessages } from '../types/enums/errorMessage';

interface RawPlayer {
  id: string;
  user: { username: string } | null;
}

interface RawReplyTo {
  id: string;
  content: string;
  iv: string;
  deletedAt: Date | null;
  player: RawPlayer; // user теперь nullable
}

interface RawMessageInput {
  id: string;
  content: string;
  iv: string;
  createdAt?: Date;
  editedAt?: Date | null;
  deletedAt?: Date | null;
  updatedAt?: Date | null;
  roomId?: string;
  replyTo?: RawReplyTo | null;
  player?: RawPlayer;
}

interface DecryptedReplyTo {
  id: string;
  content: string | null;
  deletedAt: Date | null;
  player: RawPlayer;
}

interface DecryptedMessage {
  id: string;
  content: string;
  createdAt?: Date;
  editedAt?: Date | null;
  deletedAt?: Date | null;
  updatedAt?: Date | null;
  roomId?: string;
  replyTo?: DecryptedReplyTo | null;
  player?: RawPlayer;
}

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

  private decryptMessage(message: RawMessageInput): DecryptedMessage {
    const { iv, content, replyTo, ...rest } = message;

    return {
      ...rest,
      content: iv ? decrypt(content, iv) : '',
      ...(replyTo !== undefined && {
        replyTo: replyTo
          ? {
              id: replyTo.id,
              deletedAt: replyTo.deletedAt,
              player: replyTo.player,
              content: replyTo.deletedAt ? null : decrypt(replyTo.content, replyTo.iv),
            }
          : null,
      }),
    };
  }

  private async getMessageById(messageId: string, playerId: string) {
    const message = await this.prismaService.message.findUnique({
      where: { id: messageId },
      select: { playerId: true, createdAt: true, deletedAt: true, roomId: true },
    });

    if (!message) {
      throw new NotFoundException(EErrorMessages.MESSAGE_NOT_FOUND);
    }
    if (message.playerId !== playerId) {
      throw new ForbiddenException(EErrorMessages.MESSAGE_FORBIDDEN);
    }
    if (message.deletedAt) {
      throw new BadRequestException(EErrorMessages.MESSAGE_FORBIDDEN_DELETED);
    }

    return message;
  }

  async sendMessage(roomId: string, playerId: string, rawContent: string, replyToId?: string) {
    this.checkRateLimit(playerId);

    const player = await this.prismaService.player.findFirst({
      where: { id: playerId, roomId },
    });

    if (!player) {
      throw new BadRequestException(EErrorMessages.PLAYER_IS_NOT_IN_ROOM);
    }

    if (replyToId) {
      const replyTo = await this.prismaService.message.findUnique({ where: { id: replyToId } });

      if (replyTo?.roomId !== roomId) {
        throw new BadRequestException(EErrorMessages.INVALID_PLAYER_TARGET);
      }
    }

    const { content, iv } = encrypt(rawContent.trim());

    const message = await this.prismaService.message.create({
      data: { content, iv, roomId, playerId, ...(replyToId && { replyToId }) },
      select: {
        id: true,
        content: true,
        iv: true,
        createdAt: true,
        updatedAt: true,
        replyTo: {
          select: {
            id: true,
            content: true,
            iv: true,
            deletedAt: true,
            player: { select: { id: true, user: { select: { username: true } } } },
          },
        },
        player: { select: { id: true, user: { select: { username: true } } } },
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

    if (!message) {
      return null;
    }

    return {
      messageId,
      readCount,
      roomId: message.roomId,
      senderId: message.playerId,
    };
  }

  async getHistory(roomId: string, playerId: string, cursor?: string, limit = 15) {
    const [messages, unreadCount] = await Promise.all([
      this.prismaService.message.findMany({
        where: { roomId, deletedAt: null },
        take: limit,
        ...(cursor && { skip: 1, cursor: { id: cursor } }),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          content: true,
          iv: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          _count: { select: { reads: true } },
          replyTo: {
            select: {
              id: true,
              content: true,
              iv: true,
              deletedAt: true,
              player: { select: { id: true, user: { select: { username: true } } } },
            },
          },
          player: {
            select: { id: true, user: { select: { username: true } } },
          },
        },
      }),
      this.prismaService.message.count({
        where: {
          roomId,
          playerId: { not: playerId },
          reads: { none: { playerId } },
        },
      }),
    ]);

    return {
      messages: messages.toReversed().map(({ _count, ...message }) => ({
        ...this.decryptMessage(message),
        readCount: _count.reads,
      })),
      unreadCount,
    };
  }

  async editMessage(messageId: string, playerId: string, rawContent: string) {
    await this.getMessageById(messageId, playerId);

    const { content, iv } = encrypt(rawContent.trim());

    const updated = await this.prismaService.message.update({
      where: { id: messageId },
      data: { content, iv, updatedAt: new Date() },
      select: {
        id: true,
        content: true,
        iv: true,
        createdAt: true,
        updatedAt: true,
        replyTo: {
          select: {
            id: true,
            content: true,
            iv: true,
            deletedAt: true,
            player: { select: { id: true, user: { select: { username: true } } } },
          },
        },
        player: { select: { id: true, user: { select: { username: true } } } },
      },
    });

    return this.decryptMessage(updated);
  }

  async deleteMessage(messageId: string, playerId: string) {
    const message = await this.getMessageById(messageId, playerId);

    await this.prismaService.message.update({
      where: { id: messageId },
      data: {
        deletedAt: new Date().toISOString(),
        content: '',
        iv: '',
      },
    });

    return { messageId, roomId: message.roomId };
  }
}
