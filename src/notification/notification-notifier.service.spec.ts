import { NotificationNotifier } from './notification-notifier.service';
import { SocketServerService } from '../socket/socket-server.service';
import { SocketEvent } from '../socket/types/socket-event-enum.types';
import { NotificationDto } from './dto/notification.dto';

type SocketServerServiceMock = { getServer: jest.Mock };

const notification: NotificationDto = {
  id: 'n1',
  userId: 'user-1',
  type: 'FRIEND_REQUEST',
  payload: {},
  readAt: null,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  isRead: false,
};

describe('NotificationNotifier', () => {
  let notifier: NotificationNotifier;
  let socketServer: SocketServerServiceMock;
  let emit: jest.Mock;
  let to: jest.Mock;

  beforeEach(() => {
    emit = jest.fn();
    to = jest.fn().mockReturnValue({ emit });
    socketServer = { getServer: jest.fn().mockReturnValue({ to }) };

    notifier = new NotificationNotifier(socketServer as unknown as SocketServerService);
  });

  describe('handleNotificationCreated', () => {
    it('pushes the new notification to the recipient room', () => {
      notifier.handleNotificationCreated({ userId: 'user-1', notification });

      expect(to).toHaveBeenCalledWith('user:user-1');
      expect(emit).toHaveBeenCalledWith(
        SocketEvent.NOTIFICATION_NEW,
        expect.objectContaining({ success: true, message: { notification } })
      );
    });
  });

  describe('handleReadNotification', () => {
    it('pushes the read receipt to the recipient room', () => {
      notifier.handleReadNotification({ userId: 'user-1', notificationId: 'n1' });

      expect(to).toHaveBeenCalledWith('user:user-1');
      expect(emit).toHaveBeenCalledWith(
        SocketEvent.NOTIFICATION_READ,
        expect.objectContaining({ success: true, message: { notificationId: 'n1' } })
      );
    });
  });

  describe('handleReadAll', () => {
    it('pushes a bare all-read event to the recipient room', () => {
      notifier.handleReadAll({ userId: 'user-1' });

      expect(to).toHaveBeenCalledWith('user:user-1');
      expect(emit).toHaveBeenCalledWith(SocketEvent.NOTIFICATION_ALL_READ, {});
    });
  });
});
