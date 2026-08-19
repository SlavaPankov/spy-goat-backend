import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FriendService } from './friend.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { Friendship, FriendshipStatus } from '@prisma/client';

type PrismaMock = {
  friendship: {
    findUnique: jest.Mock;
    findMany: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    count: jest.Mock;
  };
  notification: { findUnique: jest.Mock; findFirst: jest.Mock };
  $transaction: jest.Mock;
};

type NotificationServiceMock = { create: jest.Mock };

interface UserRef {
  id: string;
  username: string;
  isOnline: boolean;
  lastSeenAt: Date | null;
}

interface FriendshipWithUsers extends Friendship {
  requester: UserRef;
  addressee: UserRef;
}

const USER_ID = 'USER_ID';
const OTHER_USER_ID = 'OTHER_USER_ID';

const buildFriendship = (overrides: Partial<FriendshipWithUsers> = {}): FriendshipWithUsers => {
  const requesterId = overrides.requesterId ?? USER_ID;
  const addresseeId = overrides.addresseeId ?? OTHER_USER_ID;

  return {
    id: 'friendship-1',
    requesterId,
    addresseeId,
    status: FriendshipStatus.PENDING,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    requester: {
      id: requesterId,
      username: requesterId === USER_ID ? 'me' : 'other',
      isOnline: true,
      lastSeenAt: null,
    },
    addressee: {
      id: addresseeId,
      username: addresseeId === USER_ID ? 'me' : 'other',
      isOnline: true,
      lastSeenAt: null,
    },
    ...overrides,
  };
};

describe('FriendService', () => {
  let service: FriendService;
  let prisma: PrismaMock;
  let notificationService: NotificationServiceMock;

  const mockDirections = (own: FriendshipWithUsers | null, reverse: FriendshipWithUsers | null) => {
    prisma.friendship.findUnique.mockImplementation(
      ({ where }: { where: { requesterId_addresseeId: { requesterId: string; addresseeId: string } } }) => {
        const { requesterId, addresseeId } = where.requesterId_addresseeId;

        if (requesterId === USER_ID && addresseeId === OTHER_USER_ID) return Promise.resolve(own);
        if (requesterId === OTHER_USER_ID && addresseeId === USER_ID) return Promise.resolve(reverse);

        return Promise.resolve(null);
      }
    );
  };

  beforeEach(() => {
    prisma = {
      friendship: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
      notification: { findUnique: jest.fn(), findFirst: jest.fn() },
      $transaction: jest.fn((ops: Promise<unknown>[]) => Promise.all(ops)),
    };

    notificationService = { create: jest.fn() };

    service = new FriendService(
      prisma as unknown as PrismaService,
      notificationService as unknown as NotificationService
    );
  });

  describe('sendRequest', () => {
    it('throws 400 when adding yourself', async () => {
      await expect(service.sendRequest(USER_ID, USER_ID)).rejects.toThrow(BadRequestException);
      expect(prisma.friendship.findUnique).not.toHaveBeenCalled();
    });

    it('auto-accepts when the other user already sent a pending request', async () => {
      const reverse = buildFriendship({
        id: 'friendship-1',
        requesterId: OTHER_USER_ID,
        addresseeId: USER_ID,
        status: FriendshipStatus.PENDING,
      });
      mockDirections(null, reverse);
      prisma.friendship.update.mockResolvedValue({ ...reverse, status: FriendshipStatus.ACCEPTED });

      const result = await service.sendRequest(USER_ID, OTHER_USER_ID);

      expect(prisma.friendship.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'friendship-1' }, data: { status: FriendshipStatus.ACCEPTED } })
      );
      expect(notificationService.create).toHaveBeenCalledWith(
        OTHER_USER_ID,
        'FRIEND_ACCEPTED',
        expect.objectContaining({ friendshipId: 'friendship-1' })
      );
      expect(result.status).toBe(FriendshipStatus.ACCEPTED);
    });

    it('returns the existing friendship without writing when already friends', async () => {
      const own = buildFriendship({ status: FriendshipStatus.ACCEPTED });
      mockDirections(own, null);

      const result = await service.sendRequest(USER_ID, OTHER_USER_ID);

      expect(prisma.friendship.update).not.toHaveBeenCalled();
      expect(prisma.friendship.create).not.toHaveBeenCalled();
      expect(notificationService.create).not.toHaveBeenCalled();
      expect(result.status).toBe(FriendshipStatus.ACCEPTED);
    });

    it('is idempotent when a pending request already exists in the same direction', async () => {
      const own = buildFriendship({ status: FriendshipStatus.PENDING });
      mockDirections(own, null);

      const result = await service.sendRequest(USER_ID, OTHER_USER_ID);

      expect(prisma.friendship.update).not.toHaveBeenCalled();
      expect(prisma.friendship.create).not.toHaveBeenCalled();
      expect(result.status).toBe(FriendshipStatus.PENDING);
    });

    it('reopens a previously declined request', async () => {
      const own = buildFriendship({ id: 'friendship-1', status: FriendshipStatus.DECLINED });
      mockDirections(own, null);
      prisma.friendship.update.mockResolvedValue({ ...own, status: FriendshipStatus.PENDING });

      const result = await service.sendRequest(USER_ID, OTHER_USER_ID);

      expect(prisma.friendship.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'friendship-1' }, data: { status: FriendshipStatus.PENDING } })
      );
      expect(notificationService.create).toHaveBeenCalledWith(
        OTHER_USER_ID,
        'FRIEND_REQUEST',
        expect.objectContaining({ friendshipId: 'friendship-1' })
      );
      expect(result.status).toBe(FriendshipStatus.PENDING);
    });

    it('returns the reverse friendship when it is accepted and there is no direction of your own', async () => {
      const reverse = buildFriendship({
        id: 'friendship-1',
        requesterId: OTHER_USER_ID,
        addresseeId: USER_ID,
        status: FriendshipStatus.ACCEPTED,
      });
      mockDirections(null, reverse);

      const result = await service.sendRequest(USER_ID, OTHER_USER_ID);

      expect(prisma.friendship.update).not.toHaveBeenCalled();
      expect(result.status).toBe(FriendshipStatus.ACCEPTED);
    });

    it('creates a new pending request when none exists', async () => {
      mockDirections(null, null);
      const created = buildFriendship({ id: 'friendship-new', status: FriendshipStatus.PENDING });
      prisma.friendship.create.mockResolvedValue(created);

      const result = await service.sendRequest(USER_ID, OTHER_USER_ID);

      expect(prisma.friendship.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: { requesterId: USER_ID, addresseeId: OTHER_USER_ID } })
      );
      expect(notificationService.create).toHaveBeenCalledWith(
        OTHER_USER_ID,
        'FRIEND_REQUEST',
        expect.objectContaining({ friendshipId: 'friendship-new' })
      );
      expect(result.status).toBe(FriendshipStatus.PENDING);
    });
  });

  describe('acceptRequest', () => {
    it('throws 404 when the request does not belong to the caller or is not pending', async () => {
      prisma.friendship.findUnique.mockResolvedValue(
        buildFriendship({ addresseeId: 'someone-else', status: FriendshipStatus.PENDING })
      );

      await expect(service.acceptRequest(USER_ID, 'friendship-1')).rejects.toThrow(NotFoundException);
    });

    it('accepts the request and notifies the requester', async () => {
      const pending = buildFriendship({
        id: 'friendship-1',
        requesterId: OTHER_USER_ID,
        addresseeId: USER_ID,
        status: FriendshipStatus.PENDING,
      });
      prisma.friendship.findUnique.mockResolvedValue(pending);
      prisma.friendship.update.mockResolvedValue({ ...pending, status: FriendshipStatus.ACCEPTED });

      const result = await service.acceptRequest(USER_ID, 'friendship-1');

      expect(notificationService.create).toHaveBeenCalledWith(
        OTHER_USER_ID,
        'FRIEND_ACCEPTED',
        expect.objectContaining({ friendshipId: 'friendship-1' })
      );
      expect(result.status).toBe(FriendshipStatus.ACCEPTED);
    });
  });

  describe('declineRequest', () => {
    it('declines the request without sending a notification', async () => {
      const pending = buildFriendship({
        id: 'friendship-1',
        requesterId: OTHER_USER_ID,
        addresseeId: USER_ID,
        status: FriendshipStatus.PENDING,
      });
      prisma.friendship.findUnique.mockResolvedValue(pending);
      prisma.friendship.update.mockResolvedValue({ ...pending, status: FriendshipStatus.DECLINED });

      const result = await service.declineRequest(USER_ID, 'friendship-1');

      expect(notificationService.create).not.toHaveBeenCalled();
      expect(result.status).toBe(FriendshipStatus.DECLINED);
    });
  });

  describe('removeFriend', () => {
    it('throws 404 when the caller is not part of the friendship', async () => {
      prisma.friendship.findUnique.mockResolvedValue(buildFriendship({ requesterId: 'a', addresseeId: 'b' }));

      await expect(service.removeFriend(USER_ID, 'friendship-1')).rejects.toThrow(NotFoundException);
    });

    it('deletes the friendship and does not send a notification', async () => {
      const friendship = buildFriendship({ id: 'friendship-1', status: FriendshipStatus.ACCEPTED });
      prisma.friendship.findUnique.mockResolvedValue(friendship);
      prisma.friendship.delete.mockResolvedValue({});

      const result = await service.removeFriend(USER_ID, 'friendship-1');

      expect(prisma.friendship.delete).toHaveBeenCalledWith({ where: { id: 'friendship-1' } });
      expect(notificationService.create).not.toHaveBeenCalled();
      expect(result.id).toBe('friendship-1');
    });
  });

  describe('listFriends', () => {
    it('sorts results by friend username regardless of DB order and paginates in memory', async () => {
      const charlie = buildFriendship({
        id: 'f-charlie',
        addresseeId: 'u-charlie',
        addressee: { id: 'u-charlie', username: 'charlie', isOnline: true, lastSeenAt: null },
      });
      const alice = buildFriendship({
        id: 'f-alice',
        addresseeId: 'u-alice',
        addressee: { id: 'u-alice', username: 'alice', isOnline: true, lastSeenAt: null },
      });
      const bob = buildFriendship({
        id: 'f-bob',
        requesterId: 'u-bob',
        addresseeId: USER_ID,
        requester: { id: 'u-bob', username: 'bob', isOnline: true, lastSeenAt: null },
      });

      prisma.friendship.findMany.mockResolvedValue([charlie, alice, bob]);
      prisma.friendship.count.mockResolvedValue(3);

      const result = await service.listFriends(USER_ID, { limit: 20, offset: 0 });

      expect(result.friends.map((f) => f.friend.username)).toEqual(['alice', 'bob', 'charlie']);
    });

    it('scopes the username search to the friend, not the caller', async () => {
      prisma.friendship.findMany.mockResolvedValue([]);
      prisma.friendship.count.mockResolvedValue(0);

      await service.listFriends(USER_ID, { limit: 20, offset: 0, search: 'alice' });

      expect(prisma.friendship.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            status: FriendshipStatus.ACCEPTED,
            OR: [
              { requesterId: USER_ID, addressee: { username: { contains: 'alice', mode: 'insensitive' } } },
              { addresseeId: USER_ID, requester: { username: { contains: 'alice', mode: 'insensitive' } } },
            ],
          },
        })
      );
    });
  });

  describe('listIncoming', () => {
    it('maps the requester as fromUser', async () => {
      const request = buildFriendship({
        id: 'friendship-1',
        requesterId: OTHER_USER_ID,
        addresseeId: USER_ID,
        status: FriendshipStatus.PENDING,
      });

      prisma.friendship.findMany.mockResolvedValue([request]);
      prisma.friendship.count.mockResolvedValue(1);

      const result = await service.listIncoming(USER_ID, { limit: 20, offset: 0 });

      expect(result.requests[0].fromUser.id).toBe(OTHER_USER_ID);
    });

    it('scopes the username search to the requester', async () => {
      prisma.friendship.findMany.mockResolvedValue([]);
      prisma.friendship.count.mockResolvedValue(0);

      await service.listIncoming(USER_ID, { limit: 20, offset: 0, search: 'alice' });

      expect(prisma.friendship.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            requester: { username: { contains: 'alice', mode: 'insensitive' } },
          }),
        })
      );
    });
  });

  describe('listOutgoing', () => {
    it('maps the addressee as toUser', async () => {
      const request = buildFriendship({
        id: 'friendship-1',
        requesterId: USER_ID,
        addresseeId: OTHER_USER_ID,
        status: FriendshipStatus.PENDING,
      });
      prisma.friendship.findMany.mockResolvedValue([request]);
      prisma.friendship.count.mockResolvedValue(1);

      const result = await service.listOutgoing(USER_ID, { limit: 20, offset: 0 });

      expect(result.requests[0].toUser.id).toBe(OTHER_USER_ID);
    });

    it('scopes the username search to the addressee', async () => {
      prisma.friendship.findMany.mockResolvedValue([]);
      prisma.friendship.count.mockResolvedValue(0);

      await service.listOutgoing(USER_ID, { limit: 20, offset: 0, search: 'alice' });

      expect(prisma.friendship.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            addressee: { username: { contains: 'alice', mode: 'insensitive' } },
          }),
        })
      );
    });
  });

  describe('getStatusWith', () => {
    it('returns SELF when checking your own id', async () => {
      const result = await service.getStatusWith(USER_ID, USER_ID);

      expect(result).toEqual({ status: 'SELF' });
      expect(prisma.friendship.findUnique).not.toHaveBeenCalled();
    });

    it('returns NONE when there is no friendship in either direction', async () => {
      prisma.friendship.findUnique.mockResolvedValue(null);

      const result = await service.getStatusWith(USER_ID, OTHER_USER_ID);

      expect(result).toEqual({ status: 'NONE' });
    });

    it('returns FRIENDS when accepted', async () => {
      prisma.friendship.findUnique
        .mockResolvedValueOnce(buildFriendship({ id: 'friendship-1', status: FriendshipStatus.ACCEPTED }))
        .mockResolvedValueOnce(null);

      const result = await service.getStatusWith(USER_ID, OTHER_USER_ID);

      expect(result).toEqual({ status: 'FRIENDS', friendshipId: 'friendship-1' });
    });

    it('returns OUTGOING_PENDING when the caller sent the pending request', async () => {
      prisma.friendship.findUnique
        .mockResolvedValueOnce(buildFriendship({ id: 'friendship-1', status: FriendshipStatus.PENDING }))
        .mockResolvedValueOnce(null);

      const result = await service.getStatusWith(USER_ID, OTHER_USER_ID);

      expect(result).toEqual({ status: 'OUTGOING_PENDING', friendshipId: 'friendship-1' });
    });

    it('returns INCOMING_PENDING when the other user sent the pending request', async () => {
      prisma.friendship.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(buildFriendship({ id: 'friendship-1', status: FriendshipStatus.PENDING }));

      const result = await service.getStatusWith(USER_ID, OTHER_USER_ID);

      expect(result).toEqual({ status: 'INCOMING_PENDING', friendshipId: 'friendship-1' });
    });

    it('returns DECLINED when the request was declined', async () => {
      prisma.friendship.findUnique
        .mockResolvedValueOnce(buildFriendship({ id: 'friendship-1', status: FriendshipStatus.DECLINED }))
        .mockResolvedValueOnce(null);

      const result = await service.getStatusWith(USER_ID, OTHER_USER_ID);

      expect(result).toEqual({ status: 'DECLINED', friendshipId: 'friendship-1' });
    });
  });

  describe('getFriendRequestStatusForNotification', () => {
    it('returns NONE when the notification does not belong to the caller or is the wrong type', async () => {
      prisma.notification.findUnique.mockResolvedValue({
        id: 'n1',
        userId: 'someone-else',
        type: 'FRIEND_REQUEST',
        payload: {},
        createdAt: new Date(),
      });

      const result = await service.getFriendRequestStatusForNotification(USER_ID, 'n1');

      expect(result).toEqual({ status: 'NONE' });
    });

    it('returns NONE when a newer notification references the same friendship', async () => {
      prisma.notification.findUnique.mockResolvedValue({
        id: 'n1',
        userId: USER_ID,
        type: 'FRIEND_REQUEST',
        payload: { friendshipId: 'friendship-1' },
        createdAt: new Date('2024-01-01'),
      });
      prisma.notification.findFirst.mockResolvedValue({ id: 'n2' });

      const result = await service.getFriendRequestStatusForNotification(USER_ID, 'n1');

      expect(result).toEqual({ status: 'NONE' });
    });

    it('returns PENDING when the underlying request is still pending', async () => {
      prisma.notification.findUnique.mockResolvedValue({
        id: 'n1',
        userId: USER_ID,
        type: 'FRIEND_REQUEST',
        payload: { friendshipId: 'friendship-1' },
        createdAt: new Date('2024-01-01'),
      });
      prisma.notification.findFirst.mockResolvedValue(null);
      prisma.friendship.findUnique.mockResolvedValue(
        buildFriendship({ id: 'friendship-1', addresseeId: USER_ID, status: FriendshipStatus.PENDING })
      );

      const result = await service.getFriendRequestStatusForNotification(USER_ID, 'n1');

      expect(result).toEqual({ status: 'PENDING', friendshipId: 'friendship-1' });
    });

    it('returns FRIENDS when the request was already accepted', async () => {
      prisma.notification.findUnique.mockResolvedValue({
        id: 'n1',
        userId: USER_ID,
        type: 'FRIEND_REQUEST',
        payload: { friendshipId: 'friendship-1' },
        createdAt: new Date('2024-01-01'),
      });
      prisma.notification.findFirst.mockResolvedValue(null);
      prisma.friendship.findUnique.mockResolvedValue(
        buildFriendship({ id: 'friendship-1', addresseeId: USER_ID, status: FriendshipStatus.ACCEPTED })
      );

      const result = await service.getFriendRequestStatusForNotification(USER_ID, 'n1');

      expect(result).toEqual({ status: 'FRIENDS' });
    });

    it('returns NONE when the notification payload has no friendshipId', async () => {
      prisma.notification.findUnique.mockResolvedValue({
        id: 'n1',
        userId: USER_ID,
        type: 'FRIEND_REQUEST',
        payload: {},
        createdAt: new Date('2024-01-01'),
      });

      const result = await service.getFriendRequestStatusForNotification(USER_ID, 'n1');

      expect(result).toEqual({ status: 'NONE' });
      expect(prisma.notification.findFirst).not.toHaveBeenCalled();
    });

    it('returns NONE when the referenced friendship no longer belongs to the caller', async () => {
      prisma.notification.findUnique.mockResolvedValue({
        id: 'n1',
        userId: USER_ID,
        type: 'FRIEND_REQUEST',
        payload: { friendshipId: 'friendship-1' },
        createdAt: new Date('2024-01-01'),
      });
      prisma.notification.findFirst.mockResolvedValue(null);
      prisma.friendship.findUnique.mockResolvedValue(null);

      const result = await service.getFriendRequestStatusForNotification(USER_ID, 'n1');

      expect(result).toEqual({ status: 'NONE' });
    });

    it('returns NONE when the underlying request was declined', async () => {
      prisma.notification.findUnique.mockResolvedValue({
        id: 'n1',
        userId: USER_ID,
        type: 'FRIEND_REQUEST',
        payload: { friendshipId: 'friendship-1' },
        createdAt: new Date('2024-01-01'),
      });
      prisma.notification.findFirst.mockResolvedValue(null);
      prisma.friendship.findUnique.mockResolvedValue(
        buildFriendship({ id: 'friendship-1', addresseeId: USER_ID, status: FriendshipStatus.DECLINED })
      );

      const result = await service.getFriendRequestStatusForNotification(USER_ID, 'n1');

      expect(result).toEqual({ status: 'NONE' });
    });
  });
});
