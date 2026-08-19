import { NotFoundException } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

type PrismaMock = {
  notification: {
    create: jest.Mock;
    findMany: jest.Mock;
    count: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
    updateMany: jest.Mock;
  };
  $transaction: jest.Mock;
};

type EventEmitterMock = { emit: jest.Mock };

const USER_ID = 'USER_ID';

interface NotificationFixture {
  id: string;
  userId: string;
  type: string;
  payload: Record<string, unknown> | null;
  readAt: Date | null;
  createdAt: Date;
}

const buildNotification = (overrides: Partial<NotificationFixture> = {}): NotificationFixture => ({
  id: 'notification-1',
  userId: USER_ID,
  type: 'FRIEND_REQUEST',
  payload: { foo: 'bar' },
  readAt: null,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  ...overrides,
});

describe('NotificationService', () => {
  let service: NotificationService;
  let prisma: PrismaMock;
  let eventEmitter: EventEmitterMock;

  beforeEach(() => {
    prisma = {
      notification: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    eventEmitter = { emit: jest.fn() };

    service = new NotificationService(prisma as unknown as PrismaService, eventEmitter as unknown as EventEmitter2);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('create', () => {
    it('creates the notification, marks it unread, and emits notification.create', async () => {
      prisma.notification.create.mockResolvedValue(buildNotification({ id: 'n1', readAt: null }));

      const result = await service.create(USER_ID, 'FRIEND_REQUEST', { friendshipId: 'f1' });

      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: { userId: USER_ID, type: 'FRIEND_REQUEST', payload: { friendshipId: 'f1' } },
      });
      expect(result).toEqual(expect.objectContaining({ id: 'n1', isRead: false }));
      expect(eventEmitter.emit).toHaveBeenCalledWith('notification.create', {
        userId: USER_ID,
        notification: expect.objectContaining({ id: 'n1', isRead: false }),
      });
    });

    it('works without a payload', async () => {
      prisma.notification.create.mockResolvedValue(buildNotification({ id: 'n1', payload: null }));

      await service.create(USER_ID, 'SYSTEM');

      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: { userId: USER_ID, type: 'SYSTEM', payload: undefined },
      });
    });
  });

  describe('list', () => {
    it('lists all notifications for the user with the total count', async () => {
      const items = [
        buildNotification({ id: 'n1', readAt: null }),
        buildNotification({ id: 'n2', readAt: new Date() }),
      ];
      prisma.$transaction.mockResolvedValue([items, 2]);

      const result = await service.list(USER_ID, { limit: 10, offset: 0, unreadOnly: false });

      expect(prisma.notification.findMany).toHaveBeenCalledWith({
        where: { userId: USER_ID },
        take: 10,
        skip: 0,
        orderBy: { createdAt: 'desc' },
      });
      expect(result.total).toBe(2);
      expect(result.notifications).toHaveLength(2);
      expect(result.notifications[0]).toEqual(expect.objectContaining({ id: 'n1', isRead: false }));
      expect(result.notifications[1]).toEqual(expect.objectContaining({ id: 'n2', isRead: true }));
    });

    it('filters to unread notifications when unreadOnly is true', async () => {
      prisma.$transaction.mockResolvedValue([[], 0]);

      await service.list(USER_ID, { limit: 10, offset: 0, unreadOnly: true });

      expect(prisma.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: USER_ID, readAt: null } })
      );
      expect(prisma.notification.count).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: USER_ID, readAt: null } })
      );
    });
  });

  describe('getUnreadCount', () => {
    it('returns the count of unread notifications', async () => {
      prisma.notification.count.mockResolvedValue(7);

      const result = await service.getUnreadCount(USER_ID);

      expect(prisma.notification.count).toHaveBeenCalledWith({ where: { userId: USER_ID, readAt: null } });
      expect(result).toEqual({ count: 7 });
    });
  });

  describe('markAsRead', () => {
    it('throws 404 when the notification does not exist', async () => {
      prisma.notification.findUnique.mockResolvedValue(null);

      await expect(service.markAsRead(USER_ID, 'n1')).rejects.toThrow(NotFoundException);
    });

    it('throws 404 when the notification belongs to someone else', async () => {
      prisma.notification.findUnique.mockResolvedValue(buildNotification({ userId: 'someone-else' }));

      await expect(service.markAsRead(USER_ID, 'n1')).rejects.toThrow(NotFoundException);
    });

    it('returns the notification as-is without emitting when it is already read', async () => {
      prisma.notification.findUnique.mockResolvedValue(buildNotification({ readAt: new Date('2024-02-01T00:00:00Z') }));

      const result = await service.markAsRead(USER_ID, 'notification-1');

      expect(prisma.notification.update).not.toHaveBeenCalled();
      expect(eventEmitter.emit).not.toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({ isRead: true }));
    });

    it('marks the notification as read and emits notification.read', async () => {
      prisma.notification.findUnique.mockResolvedValue(buildNotification({ readAt: null }));
      prisma.notification.update.mockResolvedValue(buildNotification({ readAt: new Date('2024-03-01T00:00:00Z') }));

      const result = await service.markAsRead(USER_ID, 'notification-1');

      expect(prisma.notification.update).toHaveBeenCalledWith({
        where: { id: 'notification-1' },
        data: { readAt: expect.any(Date) },
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith('notification.read', {
        userId: USER_ID,
        notificationId: 'notification-1',
      });
      expect(result).toEqual(expect.objectContaining({ isRead: true }));
    });
  });

  describe('markAllRead', () => {
    it('marks every unread notification as read and emits notification.allRead', async () => {
      prisma.notification.updateMany.mockResolvedValue({ count: 5 });

      const result = await service.markAllRead(USER_ID);

      expect(prisma.notification.updateMany).toHaveBeenCalledWith({
        where: { userId: USER_ID, readAt: null },
        data: { readAt: expect.any(Date) },
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith('notification.allRead', { userId: USER_ID });
      expect(result).toEqual({ updated: 5 });
    });
  });
});
