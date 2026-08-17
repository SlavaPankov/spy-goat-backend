import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FriendService } from '../friend/friend.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EErrorMessages } from '../types/enums/errorMessage';
import { decrypt, encrypt } from '../utils/crypto.utils';
import { plainToInstance } from 'class-transformer';
import { DirectMessageDto } from './dto/direct-message.dto';
import { Prisma } from '@prisma/client';
import { ConversationListItemDto } from './dto/conversation-list-item.dto';

const MESSAGE_SELECT = {
  id: true,
  conversationId: true,
  sender: {
    select: {
      id: true,
      username: true,
      isOnline: true,
      lastSeenAt: true,
    },
  },
  recipient: {
    select: {
      id: true,
      username: true,
      isOnline: true,
      lastSeenAt: true,
    },
  },
  content: true,
  iv: true,
  replyTo: {
    select: {
      id: true,
      content: true,
      iv: true,
      sender: {
        select: {
          id: true,
          username: true,
          isOnline: true,
          lastSeenAt: true,
        },
      },
    },
  },
  createdAt: true,
  editedAt: true,
  deletedAt: true,
  readAt: true,
};

@Injectable()
export class DirectMessageService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly friendService: FriendService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  private readonly rateLimitMap = new Map<string, number[]>();
  private readonly RATE_LIMIT = 5;
  private readonly RATE_WINDOW_MS = 5000;

  private readonly normalizeUserIds = (userId1: string, userId2: string) =>
    [userId1, userId2].sort((a, b) => a.localeCompare(b));

  private toDto(message: Prisma.DirectMessageGetPayload<{ select: typeof MESSAGE_SELECT }>) {
    return plainToInstance(
      DirectMessageDto,
      {
        ...message,
        content: message.content && message.iv ? decrypt(message.content, message.iv) : null,
        replyTo: message.replyTo
          ? {
              ...message.replyTo,
              content:
                message.replyTo.content && message.replyTo.iv
                  ? decrypt(message.replyTo.content, message.replyTo.iv)
                  : null,
            }
          : null,
      },
      { excludeExtraneousValues: true }
    );
  }

  private readonly findConversation = async (userAId: string, userBId: string) => {
    return await this.prismaService.conversation.findUnique({
      where: {
        userAId_userBId: { userAId, userBId },
      },
    });
  };

  private checkRateLimit(userId: string): void {
    const now = Date.now();
    const timestamps = (this.rateLimitMap.get(userId) ?? []).filter((ts) => now - ts < this.RATE_WINDOW_MS);

    if (timestamps.length >= this.RATE_LIMIT) {
      throw new BadRequestException('Too many messages. Slow down.');
    }

    timestamps.push(now);

    this.rateLimitMap.set(userId, timestamps);
  }

  private async getOrCreateConversation(userId1: string, userId2: string) {
    const [userAId, userBId] = this.normalizeUserIds(userId1, userId2);

    const conversation = await this.findConversation(userAId, userBId);

    if (!conversation) {
      return await this.prismaService.conversation.create({
        data: {
          userAId,
          userBId,
        },
      });
    }

    return conversation;
  }

  async sendMessage(senderId: string, recipientId: string, rawContent: string, replyToId?: string) {
    if (senderId === recipientId) {
      throw new BadRequestException(EErrorMessages.DIRECT_MESSAGE_SELF);
    }

    const friendStatus = await this.friendService.getStatusWith(senderId, recipientId);

    if (friendStatus.status !== 'FRIENDS') {
      throw new ForbiddenException(EErrorMessages.DIRECT_MESSAGE_RECIPIENT_FORBIDDEN);
    }

    this.checkRateLimit(senderId);

    if (!rawContent.trim()) {
      throw new BadRequestException(EErrorMessages.DIRECT_MESSAGE_EMPTY);
    }

    const conversation = await this.getOrCreateConversation(senderId, recipientId);

    if (replyToId) {
      const repliedMessage = await this.prismaService.directMessage.findUnique({
        where: {
          id: replyToId,
          conversationId: conversation?.id,
        },
      });

      if (!repliedMessage || repliedMessage.deletedAt) {
        throw new BadRequestException(EErrorMessages.DIRECT_MESSAGE_REPLY_NOT_FOUND);
      }
    }

    const { content, iv } = encrypt(rawContent.trim());

    const [message] = await this.prismaService.$transaction([
      this.prismaService.directMessage.create({
        data: {
          conversationId: conversation.id,
          senderId,
          recipientId,
          ...(replyToId && { replyToId }),
          content,
          iv,
        },
        select: MESSAGE_SELECT,
      }),
      this.prismaService.conversation.update({
        where: {
          id: conversation.id,
        },
        data: {
          lastMessageAt: new Date().toISOString(),
        },
      }),
    ]);

    const dto = this.toDto(message);

    this.eventEmitter.emit('dm.create', { message: dto });

    return dto;
  }

  async getHistory(userId: string, conversationId: string, cursor?: string, limit = 15) {
    const conversation = await this.prismaService.conversation.findUnique({
      where: {
        id: conversationId,
      },
    });

    if (conversation?.userAId !== userId && conversation?.userBId !== userId) {
      throw new NotFoundException(EErrorMessages.CONVERSATION_NOT_FOUND);
    }

    const messages = await this.prismaService.directMessage.findMany({
      where: {
        conversationId,
      },
      take: limit,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: { createdAt: 'desc' },
      select: MESSAGE_SELECT,
    });

    return messages.map((message) => this.toDto(message));
  }

  async markRead(userId: string, conversationId: string, messageId: string) {
    const conversation = await this.prismaService.conversation.findUnique({
      where: {
        id: conversationId,
      },
    });

    if (!conversation) {
      throw new NotFoundException(EErrorMessages.CONVERSATION_NOT_FOUND);
    }

    const message = await this.prismaService.directMessage.findUnique({
      where: {
        conversationId,
        id: messageId,
        recipientId: userId,
      },
    });

    if (!message) {
      throw new NotFoundException(EErrorMessages.DIRECT_MESSAGE_NOT_FOUND);
    }

    const updatedMessage = await this.prismaService.directMessage.update({
      where: {
        conversationId,
        id: messageId,
      },
      data: {
        readAt: new Date().toISOString(),
      },
      select: MESSAGE_SELECT,
    });

    const dto = this.toDto(updatedMessage);

    this.eventEmitter.emit('dm.read', { message: dto });

    return dto;
  }

  async resolveConversation(userId: string, otherUserId: string) {
    if (userId === otherUserId) {
      throw new BadRequestException(EErrorMessages.DIRECT_MESSAGE_SELF);
    }

    const [userAId, userBId] = this.normalizeUserIds(userId, otherUserId);

    const conversation = await this.findConversation(userAId, userBId);

    return { conversationId: conversation?.id ?? null };
  }

  async editMessage(userId: string, messageId: string, newContent: string) {
    const message = await this.prismaService.directMessage.findUnique({
      where: {
        id: messageId,
      },
    });

    if (message?.senderId !== userId || message.deletedAt) {
      throw new BadRequestException(EErrorMessages.DIRECT_MESSAGE_NOT_ALLOWED);
    }

    if (!newContent.trim()) {
      throw new BadRequestException(EErrorMessages.DIRECT_MESSAGE_EMPTY);
    }

    const { content, iv } = encrypt(newContent);

    const updatedMessage = await this.prismaService.directMessage.update({
      where: {
        id: messageId,
      },
      data: {
        content,
        iv,
      },
      select: MESSAGE_SELECT,
    });

    const dto = this.toDto(updatedMessage);

    this.eventEmitter.emit('dm.update', { message: dto });

    return dto;
  }

  async deleteMessage(userId: string, messageId: string) {
    const message = await this.prismaService.directMessage.findUnique({
      where: {
        id: messageId,
      },
    });

    if (message?.senderId !== userId || message.deletedAt) {
      throw new BadRequestException(EErrorMessages.DIRECT_MESSAGE_NOT_ALLOWED);
    }

    const deletedMessage = await this.prismaService.directMessage.update({
      where: {
        id: messageId,
      },
      data: {
        deletedAt: new Date().toISOString(),
        content: null,
        iv: null,
      },
      select: MESSAGE_SELECT,
    });

    const dto = this.toDto(deletedMessage);

    this.eventEmitter.emit('dm.delete', { message: dto });

    return dto;
  }

  async getTotalUnreadCount(userId: string) {
    const count = await this.prismaService.directMessage.count({
      where: {
        recipientId: userId,
        deletedAt: null,
        readAt: null,
      },
    });

    return { count };
  }

  async getConversationUnreadCount(userId: string, conversationId: string) {
    const conversation = await this.prismaService.conversation.findUnique({
      where: {
        id: conversationId,
      },
    });

    if (conversation?.userAId !== userId && conversation?.userBId !== userId) {
      throw new NotFoundException(EErrorMessages.CONVERSATION_NOT_FOUND);
    }

    const count = await this.prismaService.directMessage.count({
      where: {
        conversationId,
        readAt: null,
        deletedAt: null,
        recipientId: userId,
      },
    });

    return { count };
  }

  async getConversationsList(userId: string, { limit, offset }: { limit: number; offset: number }) {
    const where: Prisma.ConversationWhereInput = {
      OR: [
        {
          userAId: userId,
        },
        {
          userBId: userId,
        },
      ],
    };

    const [conversations, count] = await this.prismaService.$transaction([
      this.prismaService.conversation.findMany({
        where,
        orderBy: {
          lastMessageAt: 'desc',
        },
        skip: offset,
        take: limit,
        include: {
          userA: {
            select: {
              id: true,
              username: true,
              isOnline: true,
              lastSeenAt: true,
            },
          },
          userB: {
            select: {
              id: true,
              username: true,
              isOnline: true,
              lastSeenAt: true,
            },
          },
          messages: {
            select: MESSAGE_SELECT,
            take: 1,
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      }),
      this.prismaService.conversation.count({ where }),
    ]);

    const conversationIds = conversations.map((conversation) => conversation.id);

    const unreadGroups = await this.prismaService.directMessage.groupBy({
      by: ['conversationId'],
      where: {
        conversationId: { in: conversationIds },
        recipientId: userId,
        readAt: null,
        deletedAt: null,
      },
      _count: true,
    });

    const unreadByConversationId = new Map(unreadGroups.map((group) => [group.conversationId, group._count]));

    const items = conversations.map((conversation) => {
      const otherUser = conversation.userAId === userId ? conversation.userB : conversation.userA;
      const [lastMessage] = conversation.messages;

      return {
        id: conversation.id,
        otherUser,
        lastMessage: lastMessage ? this.toDto(lastMessage) : null,
        unreadCount: unreadByConversationId.get(conversation.id) ?? 0,
        lastMessageAt: conversation.lastMessageAt,
      };
    });

    return {
      conversations: plainToInstance(ConversationListItemDto, items, { excludeExtraneousValues: true }),
      count,
    };
  }
}
