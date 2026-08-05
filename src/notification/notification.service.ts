import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EErrorMessages } from '../types/enums/errorMessage';
import { plainToInstance } from 'class-transformer';
import { NotificationDto } from './dto/notification.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async create(userId: string, type: string, payload?: Record<string, unknown>) {
    const notification = await this.prismaService.notification.create({
      data: {
        userId,
        type,
        payload: payload as Prisma.InputJsonValue,
      },
    });

    const dto = plainToInstance(
      NotificationDto,
      { ...notification, isRead: notification.readAt !== null },
      { excludeExtraneousValues: true }
    );

    this.eventEmitter.emit('notification.create', { userId, notification: dto });

    return dto;
  }

  async list(userId: string, { limit, offset, unreadOnly }: { limit: number; offset: number; unreadOnly: boolean }) {
    const where = {
      userId,
      ...(unreadOnly && { readAt: null }),
    };

    const [notifications, count] = await this.prismaService.$transaction([
      this.prismaService.notification.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.notification.count({ where }),
    ]);

    return {
      notifications: plainToInstance(
        NotificationDto,
        notifications.map((n) => ({ ...n, isRead: n.readAt !== null })),
        { excludeExtraneousValues: true }
      ),
      total: count,
    };
  }

  async getUnreadCount(userId: string) {
    const count = await this.prismaService.notification.count({ where: { userId, readAt: null } });

    return { count };
  }

  async markAsRead(userId: string, notificationId: string) {
    const notification = await this.prismaService.notification.findUnique({
      where: {
        id: notificationId,
      },
    });

    if (notification?.userId !== userId) {
      throw new NotFoundException(EErrorMessages.NOTIFICATION_NOT_FOUND);
    }

    if (notification.readAt) {
      return plainToInstance(NotificationDto, { ...notification, isRead: true }, { excludeExtraneousValues: true });
    }

    const updatedNotification = await this.prismaService.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        readAt: new Date(),
      },
    });

    this.eventEmitter.emit('notification.read', { userId, notificationId });

    return plainToInstance(
      NotificationDto,
      { ...updatedNotification, isRead: updatedNotification.readAt !== null },
      { excludeExtraneousValues: true }
    );
  }

  async markAllRead(userId: string) {
    const result = await this.prismaService.notification.updateMany({
      where: {
        userId,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    this.eventEmitter.emit('notification.allRead', { userId });

    return { updated: result.count };
  }
}
