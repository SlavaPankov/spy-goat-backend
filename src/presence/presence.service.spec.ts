import { PresenceService } from './presence.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

type PrismaMock = {
  user: { findMany: jest.Mock; update: jest.Mock };
};

type EventEmitterMock = { emit: jest.Mock };

type PresenceServiceInternals = { connections: Map<string, Set<string>> };

const getInternals = (svc: PresenceService) => svc as unknown as PresenceServiceInternals;

const USER_ID = 'USER_ID';

describe('PresenceService', () => {
  let service: PresenceService;
  let prisma: PrismaMock;
  let eventEmitter: EventEmitterMock;

  beforeEach(() => {
    prisma = {
      user: { findMany: jest.fn(), update: jest.fn() },
    };

    eventEmitter = { emit: jest.fn() };

    service = new PresenceService(prisma as unknown as PrismaService, eventEmitter as unknown as EventEmitter2);
  });

  describe('isOnline', () => {
    it('returns false when the user has no connections', () => {
      expect(service.isOnline(USER_ID)).toBe(false);
    });

    it('returns true once a socket is registered', () => {
      getInternals(service).connections.set(USER_ID, new Set(['socket-1']));

      expect(service.isOnline(USER_ID)).toBe(true);
    });

    it('returns false when the connection set is empty', () => {
      getInternals(service).connections.set(USER_ID, new Set());

      expect(service.isOnline(USER_ID)).toBe(false);
    });
  });

  describe('getSocketIds', () => {
    it('returns an empty array when the user has no connections', () => {
      expect(service.getSocketIds(USER_ID)).toEqual([]);
    });

    it('returns all socket ids for the user', () => {
      getInternals(service).connections.set(USER_ID, new Set(['socket-1', 'socket-2']));

      expect(service.getSocketIds(USER_ID)).toEqual(['socket-1', 'socket-2']);
    });
  });

  describe('getBulkStatus', () => {
    it('maps found users to their online/lastSeenAt status, keyed by id', async () => {
      prisma.user.findMany.mockResolvedValue([
        { id: 'u1', isOnline: true, lastSeenAt: null },
        { id: 'u2', isOnline: false, lastSeenAt: new Date('2024-01-01T00:00:00Z') },
      ]);

      const result = await service.getBulkStatus(['u1', 'u2', 'u3']);

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: { id: { in: ['u1', 'u2', 'u3'] } },
        select: { id: true, isOnline: true, lastSeenAt: true },
      });
      expect(result).toEqual({
        u1: { isOnline: true, lastSeenAt: null },
        u2: { isOnline: false, lastSeenAt: new Date('2024-01-01T00:00:00Z') },
      });
    });

    it('omits ids that no longer exist in the database', async () => {
      prisma.user.findMany.mockResolvedValue([{ id: 'u1', isOnline: true, lastSeenAt: null }]);

      const result = await service.getBulkStatus(['u1', 'deleted-user']);

      expect(result).toEqual({ u1: { isOnline: true, lastSeenAt: null } });
      expect(result['deleted-user']).toBeUndefined();
    });
  });

  describe('registerConnection', () => {
    it('marks the user online and emits presence.changed on the first connection', async () => {
      prisma.user.update.mockResolvedValue({});

      await service.registerConnection(USER_ID, 'socket-1');

      expect(getInternals(service).connections.get(USER_ID)).toEqual(new Set(['socket-1']));
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: USER_ID },
        data: { isOnline: true, lastSeenAt: null },
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith('presence.changed', {
        userId: USER_ID,
        isOnline: true,
        lastSeenAt: null,
      });
    });

    it('adds an additional socket for an already-online user without touching the DB', async () => {
      getInternals(service).connections.set(USER_ID, new Set(['socket-1']));

      await service.registerConnection(USER_ID, 'socket-2');

      expect(getInternals(service).connections.get(USER_ID)).toEqual(new Set(['socket-1', 'socket-2']));
      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(eventEmitter.emit).not.toHaveBeenCalled();
    });
  });

  describe('registerDisconnection', () => {
    it('does nothing when the user has no tracked connections', async () => {
      await service.registerDisconnection(USER_ID, 'socket-1');

      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(eventEmitter.emit).not.toHaveBeenCalled();
    });

    it('removes one socket but keeps the user online while others remain', async () => {
      getInternals(service).connections.set(USER_ID, new Set(['socket-1', 'socket-2']));

      await service.registerDisconnection(USER_ID, 'socket-1');

      expect(getInternals(service).connections.get(USER_ID)).toEqual(new Set(['socket-2']));
      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(eventEmitter.emit).not.toHaveBeenCalled();
    });

    it('marks the user offline and emits presence.changed once the last socket disconnects', async () => {
      getInternals(service).connections.set(USER_ID, new Set(['socket-1']));
      prisma.user.update.mockResolvedValue({});

      await service.registerDisconnection(USER_ID, 'socket-1');

      expect(getInternals(service).connections.has(USER_ID)).toBe(false);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: USER_ID },
        data: { isOnline: false, lastSeenAt: expect.any(Date) },
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'presence.changed',
        expect.objectContaining({ userId: USER_ID, isOnline: false, lastSeenAt: expect.any(Date) })
      );
    });
  });
});
