import { PresenceGateway } from './presence.gateway';
import { PresenceService } from '../../presence/presence.service';
import { Socket } from 'socket.io';

type PresenceServiceMock = { getBulkStatus: jest.Mock };

const buildClient = (data: Record<string, unknown> = {}) =>
  ({
    join: jest.fn(),
    leave: jest.fn(),
    data,
  }) as unknown as Socket & { join: jest.Mock; leave: jest.Mock };

describe('PresenceGateway', () => {
  let gateway: PresenceGateway;
  let presenceService: PresenceServiceMock;

  beforeEach(() => {
    presenceService = { getBulkStatus: jest.fn() };
    gateway = new PresenceGateway(presenceService as unknown as PresenceService);
  });

  describe('handleSubscribe', () => {
    it('joins a presence room for each requested user and returns their bulk status', async () => {
      const client = buildClient();
      presenceService.getBulkStatus.mockResolvedValue({
        u1: { isOnline: true, lastSeenAt: null },
        u2: { isOnline: false, lastSeenAt: new Date('2024-01-01') },
      });

      const result = await gateway.handleSubscribe(client, ['u1', 'u2']);

      expect(client.join).toHaveBeenCalledWith('presence:u1');
      expect(client.join).toHaveBeenCalledWith('presence:u2');
      expect(presenceService.getBulkStatus).toHaveBeenCalledWith(['u1', 'u2']);
      expect(result).toEqual({
        u1: { isOnline: true, lastSeenAt: null },
        u2: { isOnline: false, lastSeenAt: new Date('2024-01-01') },
      });
    });

    it('caps the batch at 50 user ids', async () => {
      const client = buildClient();
      const ids = Array.from({ length: 60 }, (_, i) => `u${i}`);
      presenceService.getBulkStatus.mockResolvedValue({});

      await gateway.handleSubscribe(client, ids);

      expect(client.join).toHaveBeenCalledTimes(50);
      expect(presenceService.getBulkStatus).toHaveBeenCalledWith(ids.slice(0, 50));
    });

    it("forces the caller's own entry to online, overriding whatever the service returned", async () => {
      const client = buildClient({ userId: 'me' });
      presenceService.getBulkStatus.mockResolvedValue({ me: { isOnline: false, lastSeenAt: new Date('2024-01-01') } });

      const result = await gateway.handleSubscribe(client, ['me', 'other']);

      expect(result.me).toEqual({ isOnline: true, lastSeenAt: null });
    });

    it("leaves other entries untouched when the caller's own id was not requested", async () => {
      const client = buildClient({ userId: 'me' });
      presenceService.getBulkStatus.mockResolvedValue({ other: { isOnline: false, lastSeenAt: null } });

      const result = await gateway.handleSubscribe(client, ['other']);

      expect(result).toEqual({ other: { isOnline: false, lastSeenAt: null } });
    });
  });

  describe('handleUnsubscribe', () => {
    it('leaves a presence room for each requested user id', () => {
      const client = buildClient();

      gateway.handleUnsubscribe(client, ['u1', 'u2']);

      expect(client.leave).toHaveBeenCalledWith('presence:u1');
      expect(client.leave).toHaveBeenCalledWith('presence:u2');
    });
  });
});
