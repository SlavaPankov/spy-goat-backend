import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { RoomInviteService } from './room-invite.service';
import { PrismaService } from '../prisma/prisma.service';
import { RoomService } from '../room/room.service';
import { NotificationService } from '../notification/notification.service';
import { RoomInviteStatus, RoomStatus } from '@prisma/client';

type PrismaMock = {
  room: { findUnique: jest.Mock };
  roomInvite: { upsert: jest.Mock; findUnique: jest.Mock; update: jest.Mock };
  notification: { findUnique: jest.Mock; findFirst: jest.Mock };
  player: { findFirst: jest.Mock };
};

type RoomServiceMock = { join: jest.Mock; notifyPlayerJoined: jest.Mock };
type NotificationServiceMock = { create: jest.Mock };

const ROOM_ID = 'ROOM_ID';
const INVITER_ID = 'INVITER_ID';
const INVITEE_ID = 'INVITEE_ID';

interface RoomInviteFixture {
  id: string;
  status: RoomInviteStatus;
  createdAt: Date;
  roomId: string;
  inviterId: string;
  inviteeId: string;
  room: { name: string };
  inviter: { id: string; username: string; isOnline: boolean; lastSeenAt: Date | null };
  invitee: { id: string; username: string; isOnline: boolean; lastSeenAt: Date | null };
}

const buildInvite = (overrides: Partial<RoomInviteFixture> = {}): RoomInviteFixture => {
  const inviterId = overrides.inviterId ?? INVITER_ID;
  const inviteeId = overrides.inviteeId ?? INVITEE_ID;

  return {
    id: 'invite-1',
    status: RoomInviteStatus.PENDING,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    roomId: ROOM_ID,
    inviterId,
    inviteeId,
    room: { name: 'Room 1' },
    inviter: {
      id: inviterId,
      username: inviterId === INVITER_ID ? 'inviter' : 'invitee',
      isOnline: true,
      lastSeenAt: null,
    },
    invitee: {
      id: inviteeId,
      username: inviteeId === INVITEE_ID ? 'invitee' : 'inviter',
      isOnline: true,
      lastSeenAt: null,
    },
    ...overrides,
  };
};

describe('RoomInviteService', () => {
  let service: RoomInviteService;
  let prisma: PrismaMock;
  let roomService: RoomServiceMock;
  let notificationService: NotificationServiceMock;

  beforeEach(() => {
    prisma = {
      room: { findUnique: jest.fn() },
      roomInvite: { upsert: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
      notification: { findUnique: jest.fn(), findFirst: jest.fn() },
      player: { findFirst: jest.fn() },
    };

    roomService = { join: jest.fn(), notifyPlayerJoined: jest.fn() };
    notificationService = { create: jest.fn() };

    service = new RoomInviteService(
      prisma as unknown as PrismaService,
      roomService as unknown as RoomService,
      notificationService as unknown as NotificationService
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('invite', () => {
    it('throws 400 when inviting yourself', async () => {
      await expect(service.invite(INVITER_ID, ROOM_ID, INVITER_ID)).rejects.toThrow(BadRequestException);
    });

    it('throws 404 when the room does not exist', async () => {
      prisma.room.findUnique.mockResolvedValue(null);

      await expect(service.invite(INVITER_ID, ROOM_ID, INVITEE_ID)).rejects.toThrow(NotFoundException);
    });

    it('throws 403 when the caller is not the room creator', async () => {
      prisma.room.findUnique.mockResolvedValue({
        creatorId: 'someone-else',
        status: RoomStatus.WAITING,
        currentPlayers: 1,
        maxPlayers: 4,
        players: [],
      });

      await expect(service.invite(INVITER_ID, ROOM_ID, INVITEE_ID)).rejects.toThrow(ForbiddenException);
    });

    it('throws 400 when the room already started', async () => {
      prisma.room.findUnique.mockResolvedValue({
        creatorId: INVITER_ID,
        status: RoomStatus.IN_PROGRESS,
        currentPlayers: 1,
        maxPlayers: 4,
        players: [],
      });

      await expect(service.invite(INVITER_ID, ROOM_ID, INVITEE_ID)).rejects.toThrow(BadRequestException);
    });

    it('throws 400 when the room is full', async () => {
      prisma.room.findUnique.mockResolvedValue({
        creatorId: INVITER_ID,
        status: RoomStatus.WAITING,
        currentPlayers: 4,
        maxPlayers: 4,
        players: [],
      });

      await expect(service.invite(INVITER_ID, ROOM_ID, INVITEE_ID)).rejects.toThrow(BadRequestException);
    });

    it('throws 400 when the invitee is already in the room', async () => {
      prisma.room.findUnique.mockResolvedValue({
        creatorId: INVITER_ID,
        status: RoomStatus.WAITING,
        currentPlayers: 1,
        maxPlayers: 4,
        players: [{ userId: INVITEE_ID }],
      });

      await expect(service.invite(INVITER_ID, ROOM_ID, INVITEE_ID)).rejects.toThrow(BadRequestException);
    });

    it('upserts the invite, notifies the invitee, and returns the action dto', async () => {
      prisma.room.findUnique.mockResolvedValue({
        id: ROOM_ID,
        name: 'Room 1',
        creatorId: INVITER_ID,
        status: RoomStatus.WAITING,
        currentPlayers: 1,
        maxPlayers: 4,
        players: [],
        creator: { id: INVITER_ID, username: 'inviter', isOnline: true, lastSeenAt: null },
      });
      const created = buildInvite();
      prisma.roomInvite.upsert.mockResolvedValue(created);

      const result = await service.invite(INVITER_ID, ROOM_ID, INVITEE_ID);

      expect(prisma.roomInvite.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { roomId_inviteeId: { roomId: ROOM_ID, inviteeId: INVITEE_ID } },
          update: { status: RoomInviteStatus.PENDING, inviterId: INVITER_ID },
          create: { roomId: ROOM_ID, inviterId: INVITER_ID, inviteeId: INVITEE_ID },
        })
      );
      expect(notificationService.create).toHaveBeenCalledWith(INVITEE_ID, 'ROOM_INVITE', {
        inviteId: created.id,
        roomId: ROOM_ID,
        roomName: 'Room 1',
        otherUser: { id: INVITER_ID, username: 'inviter', isOnline: true, lastSeenAt: null },
      });
      expect(result).toEqual(expect.objectContaining({ id: created.id, roomId: ROOM_ID, roomName: 'Room 1' }));
    });
  });

  describe('acceptInvite', () => {
    it('throws 404 when the invite does not exist', async () => {
      prisma.roomInvite.findUnique.mockResolvedValue(null);

      await expect(service.acceptInvite(INVITEE_ID, 'invite-1')).rejects.toThrow(NotFoundException);
    });

    it('throws 404 when the invite belongs to someone else', async () => {
      prisma.roomInvite.findUnique.mockResolvedValue(buildInvite({ inviteeId: 'someone-else' }));

      await expect(service.acceptInvite(INVITEE_ID, 'invite-1')).rejects.toThrow(NotFoundException);
    });

    it('throws 404 when the invite is no longer pending', async () => {
      prisma.roomInvite.findUnique.mockResolvedValue(buildInvite({ status: RoomInviteStatus.DECLINED }));

      await expect(service.acceptInvite(INVITEE_ID, 'invite-1')).rejects.toThrow(NotFoundException);
    });

    it('joins the room, notifies it, and marks the invite accepted', async () => {
      prisma.roomInvite.findUnique.mockResolvedValue(buildInvite({ roomId: ROOM_ID }));
      roomService.join.mockResolvedValue({});
      roomService.notifyPlayerJoined.mockResolvedValue(undefined);
      const updated = buildInvite({ status: RoomInviteStatus.ACCEPTED });
      prisma.roomInvite.update.mockResolvedValue(updated);

      const result = await service.acceptInvite(INVITEE_ID, 'invite-1');

      expect(roomService.join).toHaveBeenCalledWith(ROOM_ID, INVITEE_ID);
      expect(roomService.notifyPlayerJoined).toHaveBeenCalledWith(ROOM_ID);
      expect(prisma.roomInvite.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'invite-1' }, data: { status: RoomInviteStatus.ACCEPTED } })
      );
      expect(result).toEqual(expect.objectContaining({ status: RoomInviteStatus.ACCEPTED }));
    });
  });

  describe('declineInvite', () => {
    it('throws 404 when the invite does not exist', async () => {
      prisma.roomInvite.findUnique.mockResolvedValue(null);

      await expect(service.declineInvite(INVITEE_ID, 'invite-1')).rejects.toThrow(NotFoundException);
    });

    it('throws 404 when the invite belongs to someone else', async () => {
      prisma.roomInvite.findUnique.mockResolvedValue(buildInvite({ inviteeId: 'someone-else' }));

      await expect(service.declineInvite(INVITEE_ID, 'invite-1')).rejects.toThrow(NotFoundException);
    });

    it('marks the invite declined without touching RoomService', async () => {
      prisma.roomInvite.findUnique.mockResolvedValue(buildInvite());
      const updated = buildInvite({ status: RoomInviteStatus.DECLINED });
      prisma.roomInvite.update.mockResolvedValue(updated);

      const result = await service.declineInvite(INVITEE_ID, 'invite-1');

      expect(prisma.roomInvite.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'invite-1' }, data: { status: RoomInviteStatus.DECLINED } })
      );
      expect(roomService.join).not.toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({ status: RoomInviteStatus.DECLINED }));
    });
  });

  describe('getInviteStatusForNotification', () => {
    it('returns NONE when the notification does not exist', async () => {
      prisma.notification.findUnique.mockResolvedValue(null);

      const result = await service.getInviteStatusForNotification(INVITEE_ID, 'n1');

      expect(result).toEqual({ status: 'NONE' });
    });

    it('returns NONE when the notification does not belong to the caller', async () => {
      prisma.notification.findUnique.mockResolvedValue({ userId: 'someone-else', type: 'ROOM_INVITE', payload: {} });

      const result = await service.getInviteStatusForNotification(INVITEE_ID, 'n1');

      expect(result).toEqual({ status: 'NONE' });
    });

    it('returns NONE for a notification of a different type', async () => {
      prisma.notification.findUnique.mockResolvedValue({ userId: INVITEE_ID, type: 'FRIEND_REQUEST', payload: {} });

      const result = await service.getInviteStatusForNotification(INVITEE_ID, 'n1');

      expect(result).toEqual({ status: 'NONE' });
    });

    it('returns NONE when the payload has no inviteId', async () => {
      prisma.notification.findUnique.mockResolvedValue({ userId: INVITEE_ID, type: 'ROOM_INVITE', payload: {} });

      const result = await service.getInviteStatusForNotification(INVITEE_ID, 'n1');

      expect(result).toEqual({ status: 'NONE' });
    });

    it('returns NONE when a newer notification for the same invite exists', async () => {
      prisma.notification.findUnique.mockResolvedValue({
        userId: INVITEE_ID,
        type: 'ROOM_INVITE',
        payload: { inviteId: 'invite-1' },
        createdAt: new Date('2024-01-01'),
      });
      prisma.notification.findFirst.mockResolvedValue({ id: 'newer-notification' });

      const result = await service.getInviteStatusForNotification(INVITEE_ID, 'n1');

      expect(result).toEqual({ status: 'NONE' });
    });

    it('returns NONE when the invite no longer exists or is not pending', async () => {
      prisma.notification.findUnique.mockResolvedValue({
        userId: INVITEE_ID,
        type: 'ROOM_INVITE',
        payload: { inviteId: 'invite-1' },
        createdAt: new Date('2024-01-01'),
      });
      prisma.notification.findFirst.mockResolvedValue(null);
      prisma.roomInvite.findUnique.mockResolvedValue(buildInvite({ status: RoomInviteStatus.DECLINED }));

      const result = await service.getInviteStatusForNotification(INVITEE_ID, 'n1');

      expect(result).toEqual({ status: 'NONE' });
    });

    it('returns IN_ROOM when the invitee already joined', async () => {
      prisma.notification.findUnique.mockResolvedValue({
        userId: INVITEE_ID,
        type: 'ROOM_INVITE',
        payload: { inviteId: 'invite-1' },
        createdAt: new Date('2024-01-01'),
      });
      prisma.notification.findFirst.mockResolvedValue(null);
      prisma.roomInvite.findUnique.mockResolvedValue(buildInvite({ roomId: ROOM_ID }));
      prisma.player.findFirst.mockResolvedValue({ id: 'player-1' });

      const result = await service.getInviteStatusForNotification(INVITEE_ID, 'n1');

      expect(prisma.player.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { roomId: ROOM_ID, userId: INVITEE_ID } })
      );
      expect(result).toEqual({ status: 'IN_ROOM' });
    });

    it('returns PENDING with the invite id otherwise', async () => {
      prisma.notification.findUnique.mockResolvedValue({
        userId: INVITEE_ID,
        type: 'ROOM_INVITE',
        payload: { inviteId: 'invite-1' },
        createdAt: new Date('2024-01-01'),
      });
      prisma.notification.findFirst.mockResolvedValue(null);
      prisma.roomInvite.findUnique.mockResolvedValue(buildInvite({ id: 'invite-1' }));
      prisma.player.findFirst.mockResolvedValue(null);

      const result = await service.getInviteStatusForNotification(INVITEE_ID, 'n1');

      expect(result).toEqual({ status: 'PENDING', inviteId: 'invite-1' });
    });
  });

  describe('getInviteStatusByRoomId', () => {
    it('returns IN_ROOM when the target user is already a player', async () => {
      prisma.player.findFirst.mockResolvedValue({ id: 'player-1' });
      prisma.roomInvite.findUnique.mockResolvedValue(null);

      const result = await service.getInviteStatusByRoomId(ROOM_ID, INVITEE_ID);

      expect(result).toEqual({ status: 'IN_ROOM' });
    });

    it('returns NONE when there is no invite at all', async () => {
      prisma.player.findFirst.mockResolvedValue(null);
      prisma.roomInvite.findUnique.mockResolvedValue(null);

      const result = await service.getInviteStatusByRoomId(ROOM_ID, INVITEE_ID);

      expect(result).toEqual({ status: 'NONE' });
    });

    it('returns NONE when the invite is not pending', async () => {
      prisma.player.findFirst.mockResolvedValue(null);
      prisma.roomInvite.findUnique.mockResolvedValue(buildInvite({ status: RoomInviteStatus.ACCEPTED }));

      const result = await service.getInviteStatusByRoomId(ROOM_ID, INVITEE_ID);

      expect(result).toEqual({ status: 'NONE' });
    });

    it('returns PENDING with the invite id otherwise', async () => {
      prisma.player.findFirst.mockResolvedValue(null);
      prisma.roomInvite.findUnique.mockResolvedValue(buildInvite({ id: 'invite-2', status: RoomInviteStatus.PENDING }));

      const result = await service.getInviteStatusByRoomId(ROOM_ID, INVITEE_ID);

      expect(result).toEqual({ status: 'PENDING', inviteId: 'invite-2' });
    });
  });
});
