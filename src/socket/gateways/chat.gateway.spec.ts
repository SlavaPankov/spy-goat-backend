import { ChatGateway } from './chat.gateway';
import { ChatService } from '../../chat/chat.service';
import { SocketServerService } from '../socket-server.service';
import { SocketEvent } from '../types/socket-event-enum.types';
import { Socket } from 'socket.io';
import { SendMessageDto } from '../../chat/dto/send-message.dto';

type ChatServiceMock = {
  sendMessage: jest.Mock;
  markRead: jest.Mock;
  editMessage: jest.Mock;
  deleteMessage: jest.Mock;
  getHistory: jest.Mock;
};
type SocketServerServiceMock = { emitToRoom: jest.Mock; emitError: jest.Mock };

const ROOM_ID = 'ROOM_ID';
const PLAYER_ID = 'PLAYER_ID';

const buildClient = () => ({ emit: jest.fn() }) as unknown as Socket & { emit: jest.Mock };

const SEND_DATA: SendMessageDto = {
  roomId: ROOM_ID,
  playerId: PLAYER_ID,
  tempId: 'temp-1',
  content: 'hello',
  replyToId: undefined as unknown as string,
  eventId: 'event-1',
};

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let chatService: ChatServiceMock;
  let socketServer: SocketServerServiceMock;

  beforeEach(() => {
    chatService = {
      sendMessage: jest.fn(),
      markRead: jest.fn(),
      editMessage: jest.fn(),
      deleteMessage: jest.fn(),
      getHistory: jest.fn(),
    };
    socketServer = { emitToRoom: jest.fn(), emitError: jest.fn() };

    gateway = new ChatGateway(chatService as unknown as ChatService, socketServer as unknown as SocketServerService);
  });

  describe('handleSend', () => {
    it('sends the message and broadcasts it to the room with the tempId attached', async () => {
      const client = buildClient();
      chatService.sendMessage.mockResolvedValue({ id: 'msg-1', content: 'hello' });

      await gateway.handleSend(client, SEND_DATA);

      expect(chatService.sendMessage).toHaveBeenCalledWith(ROOM_ID, PLAYER_ID, 'hello', undefined);
      expect(socketServer.emitToRoom).toHaveBeenCalledWith(
        ROOM_ID,
        SocketEvent.CHAT_NEW_MESSAGE,
        { id: 'msg-1', content: 'hello', tempId: 'temp-1' },
        'event-1'
      );
    });

    it('emits a chat error with the tempId and eventId when sending fails', async () => {
      const client = buildClient();
      const error = new Error('send failed');
      chatService.sendMessage.mockRejectedValue(error);

      await gateway.handleSend(client, SEND_DATA);

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.CHAT_MESSAGE_ERROR, error, {
        tempId: 'temp-1',
        eventId: 'event-1',
      });
    });

    it('omits eventId from the error payload when none was provided', async () => {
      const client = buildClient();
      chatService.sendMessage.mockRejectedValue(new Error('send failed'));

      await gateway.handleSend(client, { ...SEND_DATA, eventId: undefined as unknown as string });

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.CHAT_MESSAGE_ERROR, expect.any(Error), {
        tempId: 'temp-1',
      });
    });
  });

  describe('handleMarkRead', () => {
    it('broadcasts the read receipt to the message room', async () => {
      const client = buildClient();
      chatService.markRead.mockResolvedValue({ messageId: 'msg-1', roomId: ROOM_ID, readCount: 3 });

      await gateway.handleMarkRead(client, { messageId: 'msg-1', playerId: PLAYER_ID, eventId: 'event-1' });

      expect(socketServer.emitToRoom).toHaveBeenCalledWith(
        ROOM_ID,
        SocketEvent.CHAT_MESSAGE_READ,
        { messageId: 'msg-1', playerId: PLAYER_ID, readCount: 3 },
        'event-1'
      );
    });

    it('does nothing when the message no longer exists', async () => {
      const client = buildClient();
      chatService.markRead.mockResolvedValue(null);

      await gateway.handleMarkRead(client, { messageId: 'msg-1', playerId: PLAYER_ID });

      expect(socketServer.emitToRoom).not.toHaveBeenCalled();
      expect(socketServer.emitError).not.toHaveBeenCalled();
    });

    it('emits an error when marking as read fails', async () => {
      const client = buildClient();
      const error = new Error('boom');
      chatService.markRead.mockRejectedValue(error);

      await gateway.handleMarkRead(client, { messageId: 'msg-1', playerId: PLAYER_ID });

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.CHAT_MESSAGE_READ, error, {});
    });

    it('includes the eventId in the error payload when one was provided', async () => {
      const client = buildClient();
      const error = new Error('boom');
      chatService.markRead.mockRejectedValue(error);

      await gateway.handleMarkRead(client, { messageId: 'msg-1', playerId: PLAYER_ID, eventId: 'event-1' });

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.CHAT_MESSAGE_READ, error, {
        eventId: 'event-1',
      });
    });
  });

  describe('handleEdit', () => {
    it('broadcasts the edited message to the room', async () => {
      const client = buildClient();
      chatService.editMessage.mockResolvedValue({ id: 'msg-1', content: 'edited' });

      await gateway.handleEdit(client, { messageId: 'msg-1', playerId: PLAYER_ID, content: 'edited', roomId: ROOM_ID });

      expect(chatService.editMessage).toHaveBeenCalledWith('msg-1', PLAYER_ID, 'edited');
      expect(socketServer.emitToRoom).toHaveBeenCalledWith(
        ROOM_ID,
        SocketEvent.CHAT_MESSAGE_EDITED,
        { id: 'msg-1', content: 'edited' },
        undefined
      );
    });

    it('emits an error when editing fails', async () => {
      const client = buildClient();
      const error = new Error('forbidden');
      chatService.editMessage.mockRejectedValue(error);

      await gateway.handleEdit(client, { messageId: 'msg-1', playerId: PLAYER_ID, content: 'edited', roomId: ROOM_ID });

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.CHAT_MESSAGE_EDITED, error, {});
    });

    it('includes the eventId in the error payload when one was provided', async () => {
      const client = buildClient();
      const error = new Error('forbidden');
      chatService.editMessage.mockRejectedValue(error);

      await gateway.handleEdit(client, {
        messageId: 'msg-1',
        playerId: PLAYER_ID,
        content: 'edited',
        roomId: ROOM_ID,
        eventId: 'event-1',
      });

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.CHAT_MESSAGE_EDITED, error, {
        eventId: 'event-1',
      });
    });
  });

  describe('handleDelete', () => {
    it('broadcasts the deleted message to its room', async () => {
      const client = buildClient();
      chatService.deleteMessage.mockResolvedValue({ messageId: 'msg-1', roomId: ROOM_ID });

      await gateway.handleDelete(client, { messageId: 'msg-1', playerId: PLAYER_ID });

      expect(socketServer.emitToRoom).toHaveBeenCalledWith(
        ROOM_ID,
        SocketEvent.CHAT_MESSAGE_DELETED,
        { messageId: 'msg-1', roomId: ROOM_ID },
        undefined
      );
    });

    it('emits an error when deletion fails', async () => {
      const client = buildClient();
      const error = new Error('not found');
      chatService.deleteMessage.mockRejectedValue(error);

      await gateway.handleDelete(client, { messageId: 'msg-1', playerId: PLAYER_ID });

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.CHAT_MESSAGE_DELETED, error, {});
    });

    it('includes the eventId in the error payload when one was provided', async () => {
      const client = buildClient();
      const error = new Error('not found');
      chatService.deleteMessage.mockRejectedValue(error);

      await gateway.handleDelete(client, { messageId: 'msg-1', playerId: PLAYER_ID, eventId: 'event-1' });

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.CHAT_MESSAGE_DELETED, error, {
        eventId: 'event-1',
      });
    });
  });

  describe('handleGetHistory', () => {
    it('sends the chat history directly back to the caller', async () => {
      const client = buildClient();
      const history = { messages: [], unreadCount: 0 };
      chatService.getHistory.mockResolvedValue(history);

      await gateway.handleGetHistory(client, { roomId: ROOM_ID, playerId: PLAYER_ID, eventId: 'event-1' });

      expect(chatService.getHistory).toHaveBeenCalledWith(ROOM_ID, PLAYER_ID, undefined);
      expect(client.emit).toHaveBeenCalledWith(
        SocketEvent.CHAT_HISTORY,
        expect.objectContaining({ success: true, message: history, eventId: 'event-1' })
      );
    });

    it('emits an error when history fetching fails', async () => {
      const client = buildClient();
      const error = new Error('boom');
      chatService.getHistory.mockRejectedValue(error);

      await gateway.handleGetHistory(client, { roomId: ROOM_ID, playerId: PLAYER_ID });

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.CHAT_HISTORY, error, {});
    });

    it('includes the eventId in the error payload when one was provided', async () => {
      const client = buildClient();
      const error = new Error('boom');
      chatService.getHistory.mockRejectedValue(error);

      await gateway.handleGetHistory(client, { roomId: ROOM_ID, playerId: PLAYER_ID, eventId: 'event-1' });

      expect(socketServer.emitError).toHaveBeenCalledWith(client, SocketEvent.CHAT_HISTORY, error, {
        eventId: 'event-1',
      });
    });
  });
});
