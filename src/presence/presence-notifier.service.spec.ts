import { PresenceNotifier } from './presence-notifier.service';
import { SocketServerService } from '../socket/socket-server.service';

type SocketServerServiceMock = { getServer: jest.Mock };

describe('PresenceNotifier', () => {
  let notifier: PresenceNotifier;
  let socketServer: SocketServerServiceMock;
  let emit: jest.Mock;
  let to: jest.Mock;

  beforeEach(() => {
    emit = jest.fn();
    to = jest.fn().mockReturnValue({ emit });
    socketServer = { getServer: jest.fn().mockReturnValue({ to }) };

    notifier = new PresenceNotifier(socketServer as unknown as SocketServerService);
  });

  describe('handlePresenceChanged', () => {
    it('broadcasts the presence change to the user-specific presence room', () => {
      const payload = { userId: 'user-1', isOnline: true, lastSeenAt: null };

      notifier.handlePresenceChanged(payload);

      expect(to).toHaveBeenCalledWith('presence:user-1');
      expect(emit).toHaveBeenCalledWith('presence:changed', payload);
    });
  });
});
