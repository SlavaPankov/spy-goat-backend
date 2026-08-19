import { DirectMessageNotifier } from './direct-message-notifier.service';
import { SocketServerService } from '../socket/socket-server.service';
import { SocketEvent } from '../socket/types/socket-event-enum.types';
import { DirectMessageDto } from './dto/direct-message.dto';

type SocketServerServiceMock = { emitToRoom: jest.Mock };

const buildMessage = (overrides: Partial<DirectMessageDto> = {}): DirectMessageDto =>
  ({
    id: 'msg-1',
    conversationId: 'conv-1',
    content: 'hi',
    createdAt: new Date('2024-01-01T00:00:00Z'),
    editedAt: null,
    deletedAt: null,
    readAt: null,
    sender: { id: 'sender-1', username: 'alice', isOnline: true, lastSeenAt: null },
    recipient: { id: 'recipient-1', username: 'bob', isOnline: false, lastSeenAt: null },
    ...overrides,
  }) as DirectMessageDto;

describe('DirectMessageNotifier', () => {
  let notifier: DirectMessageNotifier;
  let socketServer: SocketServerServiceMock;

  beforeEach(() => {
    socketServer = { emitToRoom: jest.fn() };
    notifier = new DirectMessageNotifier(socketServer as unknown as SocketServerService);
  });

  const cases: { method: 'handleCreate' | 'handleRead' | 'handleUpdate' | 'handleDelete'; event: SocketEvent }[] = [
    { method: 'handleCreate', event: SocketEvent.DM_NEW },
    { method: 'handleRead', event: SocketEvent.DM_READ },
    { method: 'handleUpdate', event: SocketEvent.DM_UPDATE },
    { method: 'handleDelete', event: SocketEvent.DM_DELETE },
  ];

  it.each(cases)('$method pushes the message to both sender and recipient rooms', ({ method, event }) => {
    const message = buildMessage();

    notifier[method]({ message });

    expect(socketServer.emitToRoom).toHaveBeenCalledWith(`user:${message.sender.id}`, event, message);
    expect(socketServer.emitToRoom).toHaveBeenCalledWith(`user:${message.recipient.id}`, event, message);
    expect(socketServer.emitToRoom).toHaveBeenCalledTimes(2);
  });

  describe('handleReadAll', () => {
    it('notifies both participants that the conversation was marked read', () => {
      const payload = {
        conversationId: 'conv-1',
        readerId: 'reader-1',
        otherUserId: 'other-1',
        readAt: new Date('2024-01-01T00:00:00Z'),
      };

      notifier.handleReadAll(payload);

      expect(socketServer.emitToRoom).toHaveBeenCalledWith('user:reader-1', SocketEvent.DM_READ_ALL, payload);
      expect(socketServer.emitToRoom).toHaveBeenCalledWith('user:other-1', SocketEvent.DM_READ_ALL, payload);
    });
  });

  describe('handleDeleteConversation', () => {
    it('notifies both participants with just the conversationId', () => {
      const payload = { conversationId: 'conv-1', readerId: 'reader-1', otherUserId: 'other-1' };

      notifier.handleDeleteConversation(payload);

      expect(socketServer.emitToRoom).toHaveBeenCalledWith('user:reader-1', SocketEvent.DM_DELETE_CONVERSATION, {
        conversationId: 'conv-1',
      });
      expect(socketServer.emitToRoom).toHaveBeenCalledWith('user:other-1', SocketEvent.DM_DELETE_CONVERSATION, {
        conversationId: 'conv-1',
      });
    });
  });
});
