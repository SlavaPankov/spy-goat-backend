import { DirectMessageService } from './direct-message.service';
import { FriendService } from '../friend/friend.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';

type PrismaMock = {
  conversation: {
    findUnique: jest.Mock;
    findMany: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    count: jest.Mock;
  };
  directMessage: {
    findUnique: jest.Mock;
    findMany: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    updateMany: jest.Mock;
    count: jest.Mock;
    groupBy: jest.Mock;
  };
  $transaction: jest.Mock;
};

interface PublicUserShape {
  id: string;
  username: string;
  isOnline: boolean;
  lastSeenAt: Date | null;
}

interface FlatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  content: string | null;
  iv: string | null;
  replyToId: string | null;
  readAt: Date | null;
  editedAt: Date | null;
  deletedAt: Date | null;
  createdAt: Date;
}

interface SelectedMessage {
  id: string;
  conversationId: string;
  sender: PublicUserShape;
  recipient: PublicUserShape;
  content: string | null;
  iv: string | null;
  replyTo: { id: string; content: string | null; iv: string | null; sender: PublicUserShape } | null;
  createdAt: Date;
  editedAt: Date | null;
  deletedAt: Date | null;
  readAt: Date | null;
}

jest.mock('../utils/crypto.utils', () => ({
  encrypt: jest.fn((plaintext: string) => ({ content: `enc:${plaintext}`, iv: 'test-iv' })),
  decrypt: jest.fn((content: string) => content.replace(/^enc:/, '')),
}));

const SENDER_ID = 'SENDER_ID';
const RECIPIENT_ID = 'RECIPIENT_ID';
const CONVERSATION_ID = 'CONVERSATION_ID';

const buildFlatMessage = (overrides: Partial<FlatMessage> = {}): FlatMessage => ({
  id: 'msg-1',
  conversationId: CONVERSATION_ID,
  senderId: SENDER_ID,
  recipientId: RECIPIENT_ID,
  content: 'enc:hello',
  iv: 'test-iv',
  replyToId: null,
  readAt: null,
  editedAt: null,
  deletedAt: null,
  createdAt: new Date('2026-01-01T00:00:00Z'),
  ...overrides,
});

const buildSelectedMessage = (overrides: Partial<SelectedMessage> = {}): SelectedMessage => ({
  id: 'msg-1',
  conversationId: CONVERSATION_ID,
  sender: { id: SENDER_ID, username: 'sender', isOnline: true, lastSeenAt: null },
  recipient: { id: RECIPIENT_ID, username: 'recipient', isOnline: true, lastSeenAt: null },
  content: 'enc:hello',
  iv: 'test-iv',
  replyTo: null,
  createdAt: new Date('2026-01-01T00:00:00Z'),
  editedAt: null,
  deletedAt: null,
  readAt: null,
  ...overrides,
});

describe('DirectMessageService', () => {
  let service: DirectMessageService;
  let prisma: PrismaMock;
  let friendService: jest.Mocked<Partial<FriendService>>;
  let eventEmitter: jest.Mocked<Partial<EventEmitter2>>;

  beforeEach(() => {
    prisma = {
      conversation: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
      directMessage: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        count: jest.fn(),
        groupBy: jest.fn(),
      },
      $transaction: jest.fn((ops: Promise<unknown>[]) => Promise.all(ops)),
    };

    friendService = { getStatusWith: jest.fn() };
    eventEmitter = { emit: jest.fn() };

    service = new DirectMessageService(
      prisma as unknown as PrismaService,
      friendService as FriendService,
      eventEmitter as EventEmitter2
    );
  });

  describe('sendMessage', () => {
    it('throws 400 when sender and recipient are the same user', async () => {
      await expect(service.sendMessage(SENDER_ID, SENDER_ID, 'hello')).rejects.toThrow(BadRequestException);
      expect(friendService.getStatusWith).not.toHaveBeenCalled();
    });

    it('throws 403 when recipient is not a friend', async () => {
      (friendService.getStatusWith as jest.Mock).mockResolvedValue({ status: 'NONE' });

      await expect(service.sendMessage(SENDER_ID, RECIPIENT_ID, 'hello')).rejects.toThrow(ForbiddenException);
    });

    it('throws 400 when content is empty after trim', async () => {
      (friendService.getStatusWith as jest.Mock).mockResolvedValue({ status: 'FRIENDS' });

      await expect(service.sendMessage(SENDER_ID, RECIPIENT_ID, '   ')).rejects.toThrow(BadRequestException);
    });

    it('throws 400 when replyToId does not exist or belongs to a different conversation', async () => {
      (friendService.getStatusWith as jest.Mock).mockResolvedValue({ status: 'FRIENDS' });
      prisma.conversation.findUnique.mockResolvedValue({ id: CONVERSATION_ID });
      prisma.directMessage.findUnique.mockResolvedValue(null);

      await expect(service.sendMessage(SENDER_ID, RECIPIENT_ID, 'hello', 'foreign-message-id')).rejects.toThrow(
        BadRequestException
      );
    });

    it('accepts a valid replyToId from the same conversation', async () => {
      (friendService.getStatusWith as jest.Mock).mockResolvedValue({ status: 'FRIENDS' });
      prisma.conversation.findUnique.mockResolvedValue({ id: CONVERSATION_ID });
      prisma.directMessage.findUnique.mockResolvedValue(buildFlatMessage({ id: 'reply-target' }));
      prisma.directMessage.create.mockResolvedValue(
        buildSelectedMessage({
          replyTo: {
            id: 'reply-target',
            content: 'enc:original',
            iv: 'test-iv',
            sender: { id: RECIPIENT_ID, username: 'recipient', isOnline: true, lastSeenAt: null },
          },
        })
      );
      prisma.conversation.update.mockResolvedValue({});

      const result = await service.sendMessage(SENDER_ID, RECIPIENT_ID, 'hello', 'reply-target');

      expect(prisma.directMessage.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ replyToId: 'reply-target' }) })
      );
      expect(result.replyTo?.content).toBe('original');
    });

    it('creates a message and emits dm.create', async () => {
      (friendService.getStatusWith as jest.Mock).mockResolvedValue({ status: 'FRIENDS' });
      prisma.conversation.findUnique.mockResolvedValue({ id: CONVERSATION_ID });
      prisma.directMessage.create.mockResolvedValue(buildSelectedMessage());
      prisma.conversation.update.mockResolvedValue({});

      const result = await service.sendMessage(SENDER_ID, RECIPIENT_ID, 'hello');

      expect(result.content).toBe('hello');
      expect(eventEmitter.emit).toHaveBeenCalledWith('dm.create', {
        message: expect.objectContaining({ id: 'msg-1' }),
      });
    });

    it('throws 400 after exceeding the rate limit within the time window', async () => {
      (friendService.getStatusWith as jest.Mock).mockResolvedValue({ status: 'FRIENDS' });
      prisma.conversation.findUnique.mockResolvedValue({ id: CONVERSATION_ID });
      prisma.directMessage.create.mockResolvedValue(buildSelectedMessage());
      prisma.conversation.update.mockResolvedValue({});

      for (let i = 0; i < 5; i += 1) {
        await service.sendMessage(SENDER_ID, RECIPIENT_ID, `message ${i}`);
      }

      await expect(service.sendMessage(SENDER_ID, RECIPIENT_ID, 'one too many')).rejects.toThrow(
        'Too many messages. Slow down.'
      );
    });

    it('creates a brand new conversation when none exists yet for this pair', async () => {
      (friendService.getStatusWith as jest.Mock).mockResolvedValue({ status: 'FRIENDS' });
      prisma.conversation.findUnique.mockResolvedValue(null);
      prisma.conversation.create.mockResolvedValue({ id: 'new-conversation-id' });
      prisma.directMessage.create.mockResolvedValue(buildSelectedMessage({ conversationId: 'new-conversation-id' }));
      prisma.conversation.update.mockResolvedValue({});

      await service.sendMessage(SENDER_ID, RECIPIENT_ID, 'hello');

      expect(prisma.conversation.create).toHaveBeenCalled();
      expect(prisma.directMessage.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ conversationId: 'new-conversation-id' }) })
      );
    });

    it('nulls out the replyTo content when the replied-to message has no content or iv', async () => {
      (friendService.getStatusWith as jest.Mock).mockResolvedValue({ status: 'FRIENDS' });
      prisma.conversation.findUnique.mockResolvedValue({ id: CONVERSATION_ID });
      prisma.directMessage.findUnique.mockResolvedValue(buildFlatMessage({ id: 'reply-target' }));
      prisma.directMessage.create.mockResolvedValue(
        buildSelectedMessage({
          replyTo: {
            id: 'reply-target',
            content: null,
            iv: null,
            sender: { id: RECIPIENT_ID, username: 'recipient', isOnline: true, lastSeenAt: null },
          },
        })
      );
      prisma.conversation.update.mockResolvedValue({});

      const result = await service.sendMessage(SENDER_ID, RECIPIENT_ID, 'hello', 'reply-target');

      expect(result.replyTo?.content).toBeNull();
    });
  });

  describe('getHistory', () => {
    it('throws 404 for a non-participant', async () => {
      prisma.conversation.findUnique.mockResolvedValue({ id: CONVERSATION_ID, userAId: 'other-a', userBId: 'other-b' });

      await expect(service.getHistory(SENDER_ID, CONVERSATION_ID)).rejects.toThrow(NotFoundException);
    });

    it('returns decrypted messages, with null content for deleted ones', async () => {
      prisma.conversation.findUnique.mockResolvedValue({
        id: CONVERSATION_ID,
        userAId: SENDER_ID,
        userBId: RECIPIENT_ID,
      });
      prisma.directMessage.findMany.mockResolvedValue([
        buildSelectedMessage({ id: 'msg-1', content: 'enc:hello' }),
        buildSelectedMessage({ id: 'msg-2', content: null, iv: null, deletedAt: new Date() }),
      ]);

      const result = await service.getHistory(SENDER_ID, CONVERSATION_ID);

      expect(result[0].content).toBe('hello');
      expect(result[1].content).toBeNull();
    });

    it('passes a cursor through to the findMany query when paginating', async () => {
      prisma.conversation.findUnique.mockResolvedValue({
        id: CONVERSATION_ID,
        userAId: SENDER_ID,
        userBId: RECIPIENT_ID,
      });
      prisma.directMessage.findMany.mockResolvedValue([]);

      await service.getHistory(SENDER_ID, CONVERSATION_ID, 'msg-1');

      expect(prisma.directMessage.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 1, cursor: { id: 'msg-1' } })
      );
    });
  });

  describe('markRead', () => {
    it('throws 404 when the conversation does not exist', async () => {
      prisma.conversation.findUnique.mockResolvedValue(null);

      await expect(service.markRead(SENDER_ID, CONVERSATION_ID, 'msg-1')).rejects.toThrow(NotFoundException);
    });

    it('throws 404 when the message does not exist or the caller is not the recipient', async () => {
      prisma.conversation.findUnique.mockResolvedValue({ id: CONVERSATION_ID });
      prisma.directMessage.findUnique.mockResolvedValue(null);

      await expect(service.markRead(SENDER_ID, CONVERSATION_ID, 'msg-1')).rejects.toThrow(NotFoundException);

      expect(prisma.directMessage.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ recipientId: SENDER_ID }) })
      );
    });

    it('marks the message as read and emits dm.read', async () => {
      prisma.conversation.findUnique.mockResolvedValue({ id: CONVERSATION_ID });
      prisma.directMessage.findUnique.mockResolvedValue(buildFlatMessage({ recipientId: RECIPIENT_ID }));
      prisma.directMessage.update.mockResolvedValue(buildSelectedMessage({ readAt: new Date() }));

      const result = await service.markRead(RECIPIENT_ID, CONVERSATION_ID, 'msg-1');

      expect(result.readAt).not.toBeNull();
      expect(eventEmitter.emit).toHaveBeenCalledWith('dm.read', { message: expect.objectContaining({ id: 'msg-1' }) });
    });
  });

  describe('editMessage', () => {
    it('throws 400 when the caller is not the message sender', async () => {
      prisma.directMessage.findUnique.mockResolvedValue(buildFlatMessage({ senderId: RECIPIENT_ID }));

      await expect(service.editMessage(SENDER_ID, 'msg-1', 'new content')).rejects.toThrow(BadRequestException);
    });

    it('throws 400 when the message is already deleted', async () => {
      prisma.directMessage.findUnique.mockResolvedValue(
        buildFlatMessage({ senderId: SENDER_ID, deletedAt: new Date() })
      );

      await expect(service.editMessage(SENDER_ID, 'msg-1', 'new content')).rejects.toThrow(BadRequestException);
    });

    it('throws 400 when the new content is empty', async () => {
      prisma.directMessage.findUnique.mockResolvedValue(buildFlatMessage({ senderId: SENDER_ID }));

      await expect(service.editMessage(SENDER_ID, 'msg-1', '   ')).rejects.toThrow(BadRequestException);
    });

    it('updates the content and emits dm.update', async () => {
      prisma.directMessage.findUnique.mockResolvedValue(buildFlatMessage({ senderId: SENDER_ID }));
      prisma.directMessage.update.mockResolvedValue(
        buildSelectedMessage({ content: 'enc:edited', editedAt: new Date() })
      );

      const result = await service.editMessage(SENDER_ID, 'msg-1', 'edited');

      expect(result.content).toBe('edited');
      expect(eventEmitter.emit).toHaveBeenCalledWith('dm.update', {
        message: expect.objectContaining({ id: 'msg-1' }),
      });
    });
  });

  describe('deleteMessage', () => {
    it('throws 400 when the caller is not the message sender', async () => {
      prisma.directMessage.findUnique.mockResolvedValue(buildFlatMessage({ senderId: RECIPIENT_ID }));

      await expect(service.deleteMessage(SENDER_ID, 'msg-1')).rejects.toThrow(BadRequestException);
    });

    it('soft-deletes the message and emits dm.delete', async () => {
      prisma.directMessage.findUnique.mockResolvedValue(buildFlatMessage({ senderId: SENDER_ID }));
      prisma.directMessage.update.mockResolvedValue(
        buildSelectedMessage({ content: null, iv: null, deletedAt: new Date() })
      );

      const result = await service.deleteMessage(SENDER_ID, 'msg-1');

      expect(result.content).toBeNull();
      expect(prisma.directMessage.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ content: null, iv: null }) })
      );
      expect(eventEmitter.emit).toHaveBeenCalledWith('dm.delete', {
        message: expect.objectContaining({ id: 'msg-1' }),
      });
    });
  });

  describe('getTotalUnreadCount', () => {
    it('counts unread, non-deleted messages addressed to the user', async () => {
      prisma.directMessage.count.mockResolvedValue(7);

      const result = await service.getTotalUnreadCount(RECIPIENT_ID);

      expect(prisma.directMessage.count).toHaveBeenCalledWith({
        where: { recipientId: RECIPIENT_ID, deletedAt: null, readAt: null },
      });
      expect(result).toEqual({ count: 7 });
    });
  });

  describe('getConversationUnreadCount', () => {
    it('does not 404 for an actual conversation participant', async () => {
      prisma.conversation.findUnique.mockResolvedValue({
        id: CONVERSATION_ID,
        userAId: SENDER_ID,
        userBId: RECIPIENT_ID,
      });
      prisma.directMessage.count.mockResolvedValue(3);

      const result = await service.getConversationUnreadCount(SENDER_ID, CONVERSATION_ID);

      expect(result).toEqual({ count: 3 });
    });

    it('throws 404 for a non-participant', async () => {
      prisma.conversation.findUnique.mockResolvedValue({
        id: CONVERSATION_ID,
        userAId: 'other-a',
        userBId: 'other-b',
      });

      await expect(service.getConversationUnreadCount(SENDER_ID, CONVERSATION_ID)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getConversationsList', () => {
    const otherUser = { id: RECIPIENT_ID, username: 'other', isOnline: true, lastSeenAt: null };
    const selfUser = { id: SENDER_ID, username: 'self', isOnline: true, lastSeenAt: null };

    it('resolves otherUser from userB when the caller is userA', async () => {
      prisma.conversation.findMany.mockResolvedValue([
        {
          id: CONVERSATION_ID,
          userAId: SENDER_ID,
          userBId: RECIPIENT_ID,
          userA: selfUser,
          userB: otherUser,
          messages: [],
          lastMessageAt: null,
        },
      ]);
      prisma.conversation.count.mockResolvedValue(1);
      prisma.directMessage.groupBy.mockResolvedValue([]);

      const result = await service.getConversationsList(SENDER_ID, { limit: 20, offset: 0 });

      expect(result.conversations[0].otherUser.id).toBe(RECIPIENT_ID);
    });

    it('resolves otherUser from userA when the caller is userB', async () => {
      prisma.conversation.findMany.mockResolvedValue([
        {
          id: CONVERSATION_ID,
          userAId: RECIPIENT_ID,
          userBId: SENDER_ID,
          userA: otherUser,
          userB: selfUser,
          messages: [],
          lastMessageAt: null,
        },
      ]);
      prisma.conversation.count.mockResolvedValue(1);
      prisma.directMessage.groupBy.mockResolvedValue([]);

      const result = await service.getConversationsList(SENDER_ID, { limit: 20, offset: 0 });

      expect(result.conversations[0].otherUser.id).toBe(RECIPIENT_ID);
    });

    it('defaults unreadCount to 0 when there is no matching unread group', async () => {
      prisma.conversation.findMany.mockResolvedValue([
        {
          id: CONVERSATION_ID,
          userAId: SENDER_ID,
          userBId: RECIPIENT_ID,
          userA: selfUser,
          userB: otherUser,
          messages: [],
          lastMessageAt: null,
        },
      ]);
      prisma.conversation.count.mockResolvedValue(1);
      prisma.directMessage.groupBy.mockResolvedValue([]);

      const result = await service.getConversationsList(SENDER_ID, { limit: 20, offset: 0 });

      expect(result.conversations[0].unreadCount).toBe(0);
    });

    it('picks up the unread count from groupBy for the matching conversation', async () => {
      prisma.conversation.findMany.mockResolvedValue([
        {
          id: CONVERSATION_ID,
          userAId: SENDER_ID,
          userBId: RECIPIENT_ID,
          userA: selfUser,
          userB: otherUser,
          messages: [],
          lastMessageAt: null,
        },
      ]);
      prisma.conversation.count.mockResolvedValue(1);
      prisma.directMessage.groupBy.mockResolvedValue([{ conversationId: CONVERSATION_ID, _count: 4 }]);

      const result = await service.getConversationsList(SENDER_ID, { limit: 20, offset: 0 });

      expect(result.conversations[0].unreadCount).toBe(4);
    });

    it('returns a null lastMessage when the conversation has no messages', async () => {
      prisma.conversation.findMany.mockResolvedValue([
        {
          id: CONVERSATION_ID,
          userAId: SENDER_ID,
          userBId: RECIPIENT_ID,
          userA: selfUser,
          userB: otherUser,
          messages: [],
          lastMessageAt: null,
        },
      ]);
      prisma.conversation.count.mockResolvedValue(1);
      prisma.directMessage.groupBy.mockResolvedValue([]);

      const result = await service.getConversationsList(SENDER_ID, { limit: 20, offset: 0 });

      expect(result.conversations[0].lastMessage).toBeNull();
    });

    it('decrypts the lastMessage when the conversation has one', async () => {
      prisma.conversation.findMany.mockResolvedValue([
        {
          id: CONVERSATION_ID,
          userAId: SENDER_ID,
          userBId: RECIPIENT_ID,
          userA: selfUser,
          userB: otherUser,
          messages: [buildSelectedMessage({ content: 'enc:latest' })],
          lastMessageAt: new Date('2026-01-01T00:00:00Z'),
        },
      ]);
      prisma.conversation.count.mockResolvedValue(1);
      prisma.directMessage.groupBy.mockResolvedValue([]);

      const result = await service.getConversationsList(SENDER_ID, { limit: 20, offset: 0 });

      expect(result.conversations[0].lastMessage?.content).toBe('latest');
    });

    it('scopes the username search to the other participant, not the caller', async () => {
      prisma.conversation.findMany.mockResolvedValue([]);
      prisma.conversation.count.mockResolvedValue(0);
      prisma.directMessage.groupBy.mockResolvedValue([]);

      await service.getConversationsList(SENDER_ID, { limit: 20, offset: 0, search: 'alice' });

      expect(prisma.conversation.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { userAId: SENDER_ID, userB: { username: { contains: 'alice', mode: 'insensitive' } } },
              { userBId: SENDER_ID, userA: { username: { contains: 'alice', mode: 'insensitive' } } },
            ],
          },
        })
      );
    });
  });

  describe('markAllReadByConversationId', () => {
    it('throws 404 for a non-participant', async () => {
      prisma.conversation.findUnique.mockResolvedValue({ id: CONVERSATION_ID, userAId: 'other-a', userBId: 'other-b' });

      await expect(service.markAllReadByConversationId(SENDER_ID, CONVERSATION_ID)).rejects.toThrow(NotFoundException);
    });

    it('marks messages as read and emits dm.readAll when there is something to update', async () => {
      prisma.conversation.findUnique.mockResolvedValue({
        id: CONVERSATION_ID,
        userAId: SENDER_ID,
        userBId: RECIPIENT_ID,
      });
      prisma.directMessage.updateMany.mockResolvedValue({ count: 3 });

      const result = await service.markAllReadByConversationId(SENDER_ID, CONVERSATION_ID);

      expect(result).toEqual({ updated: 3 });
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'dm.readAll',
        expect.objectContaining({ conversationId: CONVERSATION_ID, readerId: SENDER_ID, otherUserId: RECIPIENT_ID })
      );
    });

    it('does not emit dm.readAll when nothing was unread', async () => {
      prisma.conversation.findUnique.mockResolvedValue({
        id: CONVERSATION_ID,
        userAId: SENDER_ID,
        userBId: RECIPIENT_ID,
      });
      prisma.directMessage.updateMany.mockResolvedValue({ count: 0 });

      const result = await service.markAllReadByConversationId(SENDER_ID, CONVERSATION_ID);

      expect(result).toEqual({ updated: 0 });
      expect(eventEmitter.emit).not.toHaveBeenCalled();
    });

    it('resolves otherUserId as userA when the caller is userB', async () => {
      prisma.conversation.findUnique.mockResolvedValue({
        id: CONVERSATION_ID,
        userAId: RECIPIENT_ID,
        userBId: SENDER_ID,
      });
      prisma.directMessage.updateMany.mockResolvedValue({ count: 1 });

      await service.markAllReadByConversationId(SENDER_ID, CONVERSATION_ID);

      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'dm.readAll',
        expect.objectContaining({ otherUserId: RECIPIENT_ID })
      );
    });
  });

  describe('deleteConversation', () => {
    it('throws 404 for a non-participant', async () => {
      prisma.conversation.findUnique.mockResolvedValue({ id: CONVERSATION_ID, userAId: 'other-a', userBId: 'other-b' });

      await expect(service.deleteConversation(SENDER_ID, CONVERSATION_ID)).rejects.toThrow(NotFoundException);
    });

    it('deletes the conversation and emits dm.deleteConversation', async () => {
      prisma.conversation.findUnique.mockResolvedValue({
        id: CONVERSATION_ID,
        userAId: SENDER_ID,
        userBId: RECIPIENT_ID,
      });
      prisma.conversation.delete.mockResolvedValue({ id: CONVERSATION_ID });

      await service.deleteConversation(SENDER_ID, CONVERSATION_ID);

      expect(prisma.conversation.delete).toHaveBeenCalledWith({ where: { id: CONVERSATION_ID } });
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'dm.deleteConversation',
        expect.objectContaining({ conversationId: CONVERSATION_ID, readerId: SENDER_ID, otherUserId: RECIPIENT_ID })
      );
    });

    it('resolves otherUserId as userA when the caller is userB', async () => {
      prisma.conversation.findUnique.mockResolvedValue({
        id: CONVERSATION_ID,
        userAId: RECIPIENT_ID,
        userBId: SENDER_ID,
      });
      prisma.conversation.delete.mockResolvedValue({ id: CONVERSATION_ID });

      await service.deleteConversation(SENDER_ID, CONVERSATION_ID);

      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'dm.deleteConversation',
        expect.objectContaining({ otherUserId: RECIPIENT_ID })
      );
    });
  });

  describe('resolveConversation', () => {
    it('throws 400 when resolving a conversation with yourself', async () => {
      await expect(service.resolveConversation(SENDER_ID, SENDER_ID)).rejects.toThrow(BadRequestException);
    });

    it('returns null when no conversation exists yet', async () => {
      prisma.conversation.findUnique.mockResolvedValue(null);

      const result = await service.resolveConversation(SENDER_ID, RECIPIENT_ID);

      expect(result).toEqual({ conversationId: null });
    });

    it('returns the existing conversationId when one already exists', async () => {
      prisma.conversation.findUnique.mockResolvedValue({ id: CONVERSATION_ID });

      const result = await service.resolveConversation(SENDER_ID, RECIPIENT_ID);

      expect(result).toEqual({ conversationId: CONVERSATION_ID });
    });
  });
});
