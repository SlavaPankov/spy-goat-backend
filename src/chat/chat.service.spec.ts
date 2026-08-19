import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaService } from '../prisma/prisma.service';

jest.mock('../utils/crypto.utils', () => ({
  encrypt: jest.fn((plaintext: string) => ({ content: `enc:${plaintext}`, iv: 'test-iv' })),
  decrypt: jest.fn((content: string) => content.replace(/^enc:/, '')),
}));

type PrismaMock = {
  player: { findFirst: jest.Mock };
  message: { findUnique: jest.Mock; create: jest.Mock; update: jest.Mock; findMany: jest.Mock; count: jest.Mock };
  messageRead: { upsert: jest.Mock; count: jest.Mock };
};

interface PlayerRef {
  id: string;
  user: { username: string } | null;
}

interface ReplyToRef {
  id: string;
  content: string;
  iv: string;
  deletedAt: Date | null;
  player: PlayerRef;
}

interface MessageResult {
  id: string;
  content: string;
  iv: string;
  createdAt: Date;
  updatedAt: Date | null;
  replyTo: ReplyToRef | null;
  player: PlayerRef;
}

interface HistoryMessageResult extends MessageResult {
  deletedAt: Date | null;
  _count: { reads: number };
}

const PLAYER_ID = 'PLAYER_ID';
const OTHER_PLAYER_ID = 'OTHER_PLAYER_ID';
const ROOM_ID = 'ROOM_ID';
const MESSAGE_ID = 'MESSAGE_ID';

const player: PlayerRef = { id: PLAYER_ID, user: { username: 'me' } };
const otherPlayer: PlayerRef = { id: OTHER_PLAYER_ID, user: { username: 'other' } };

const buildMessage = (overrides: Partial<MessageResult> = {}): MessageResult => ({
  id: MESSAGE_ID,
  content: 'enc:hello',
  iv: 'test-iv',
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: null,
  replyTo: null,
  player,
  ...overrides,
});

const buildHistoryMessage = (overrides: Partial<HistoryMessageResult> = {}): HistoryMessageResult => ({
  ...buildMessage(),
  deletedAt: null,
  _count: { reads: 0 },
  ...overrides,
});

type ChatServicePrivates = {
  decryptMessage: (message: Omit<MessageResult, 'replyTo'>) => { content: string; replyTo?: unknown };
};

describe('ChatService', () => {
  let service: ChatService;
  let prisma: PrismaMock;

  beforeEach(() => {
    prisma = {
      player: { findFirst: jest.fn() },
      message: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), findMany: jest.fn(), count: jest.fn() },
      messageRead: { upsert: jest.fn(), count: jest.fn() },
    };

    service = new ChatService(prisma as unknown as PrismaService);
  });

  describe('sendMessage', () => {
    it('throws 400 when the player is not in the room', async () => {
      prisma.player.findFirst.mockResolvedValue(null);

      await expect(service.sendMessage(ROOM_ID, PLAYER_ID, 'hello')).rejects.toThrow(BadRequestException);
    });

    it('throws 400 when replyToId does not exist or belongs to a different room', async () => {
      prisma.player.findFirst.mockResolvedValue({ id: PLAYER_ID });
      prisma.message.findUnique.mockResolvedValue({ id: 'foreign-msg', roomId: 'other-room' });

      await expect(service.sendMessage(ROOM_ID, PLAYER_ID, 'hello', 'foreign-msg')).rejects.toThrow(
        BadRequestException
      );
    });

    it('sends a message and returns decrypted content', async () => {
      prisma.player.findFirst.mockResolvedValue({ id: PLAYER_ID });
      prisma.message.create.mockResolvedValue(buildMessage());

      const result = await service.sendMessage(ROOM_ID, PLAYER_ID, 'hello');

      expect(result.content).toBe('hello');
      expect(prisma.message.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ roomId: ROOM_ID, playerId: PLAYER_ID }) })
      );
    });

    it('attaches a valid replyToId from the same room', async () => {
      prisma.player.findFirst.mockResolvedValue({ id: PLAYER_ID });
      prisma.message.findUnique.mockResolvedValue({ id: 'reply-target', roomId: ROOM_ID });
      prisma.message.create.mockResolvedValue(
        buildMessage({
          replyTo: { id: 'reply-target', content: 'enc:original', iv: 'test-iv', deletedAt: null, player: otherPlayer },
        })
      );

      const result = await service.sendMessage(ROOM_ID, PLAYER_ID, 'hello', 'reply-target');

      expect(prisma.message.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ replyToId: 'reply-target' }) })
      );
      expect(result.replyTo?.content).toBe('original');
    });

    it('throws 400 after exceeding the rate limit within the time window', async () => {
      prisma.player.findFirst.mockResolvedValue({ id: PLAYER_ID });
      prisma.message.create.mockResolvedValue(buildMessage());

      for (let i = 0; i < 5; i += 1) {
        await service.sendMessage(ROOM_ID, PLAYER_ID, `message ${i}`);
      }

      await expect(service.sendMessage(ROOM_ID, PLAYER_ID, 'one too many')).rejects.toThrow(
        'Too many messages. Slow down.'
      );
    });

    it('throws 400 when replyToId points to an already-deleted message in the same room', async () => {
      prisma.player.findFirst.mockResolvedValue({ id: PLAYER_ID });
      prisma.message.findUnique.mockResolvedValue({ id: 'deleted-msg', roomId: ROOM_ID, deletedAt: new Date() });
      prisma.message.create.mockResolvedValue(buildMessage());

      await expect(service.sendMessage(ROOM_ID, PLAYER_ID, 'hello', 'deleted-msg')).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('markRead', () => {
    it('upserts the read receipt and returns the read summary', async () => {
      prisma.messageRead.upsert.mockResolvedValue({});
      prisma.messageRead.count.mockResolvedValue(2);
      prisma.message.findUnique.mockResolvedValue({ roomId: ROOM_ID, playerId: OTHER_PLAYER_ID });

      const result = await service.markRead(MESSAGE_ID, PLAYER_ID);

      expect(prisma.messageRead.upsert).toHaveBeenCalledWith({
        where: { messageId_playerId: { messageId: MESSAGE_ID, playerId: PLAYER_ID } },
        create: { messageId: MESSAGE_ID, playerId: PLAYER_ID },
        update: {},
      });
      expect(result).toEqual({ messageId: MESSAGE_ID, readCount: 2, roomId: ROOM_ID, senderId: OTHER_PLAYER_ID });
    });

    it('returns null when the message lookup comes back empty', async () => {
      prisma.messageRead.upsert.mockResolvedValue({});
      prisma.messageRead.count.mockResolvedValue(0);
      prisma.message.findUnique.mockResolvedValue(null);

      const result = await service.markRead(MESSAGE_ID, PLAYER_ID);

      expect(result).toBeNull();
    });
  });

  describe('getHistory', () => {
    it('returns messages in chronological order with decrypted content and read counts', async () => {
      prisma.message.findMany.mockResolvedValue([
        buildHistoryMessage({ id: 'msg-2', content: 'enc:second', createdAt: new Date('2024-01-02T00:00:00Z') }),
        buildHistoryMessage({
          id: 'msg-1',
          content: 'enc:first',
          createdAt: new Date('2024-01-01T00:00:00Z'),
          _count: { reads: 3 },
        }),
      ]);
      prisma.message.count.mockResolvedValue(4);

      const result = await service.getHistory(ROOM_ID, PLAYER_ID);

      expect(result.messages.map((m) => m.id)).toEqual(['msg-1', 'msg-2']);
      expect(result.messages[0].content).toBe('first');
      expect(result.messages[0].readCount).toBe(3);
      expect(result.unreadCount).toBe(4);
    });

    it('decrypts a non-deleted replyTo and nulls out a deleted one', async () => {
      prisma.message.findMany.mockResolvedValue([
        buildHistoryMessage({
          replyTo: { id: 'r1', content: 'enc:visible', iv: 'test-iv', deletedAt: null, player: otherPlayer },
        }),
      ]);
      prisma.message.count.mockResolvedValue(0);

      const result = await service.getHistory(ROOM_ID, PLAYER_ID);

      expect(result.messages[0].replyTo?.content).toBe('visible');
    });

    it('nulls out the content of a deleted replyTo instead of decrypting it', async () => {
      prisma.message.findMany.mockResolvedValue([
        buildHistoryMessage({
          replyTo: { id: 'r1', content: 'enc:secret', iv: 'test-iv', deletedAt: new Date(), player: otherPlayer },
        }),
      ]);
      prisma.message.count.mockResolvedValue(0);

      const result = await service.getHistory(ROOM_ID, PLAYER_ID);

      expect(result.messages[0].replyTo?.content).toBeNull();
    });

    it('computes unreadCount from messages not sent by the caller and not read by them', async () => {
      prisma.message.findMany.mockResolvedValue([]);
      prisma.message.count.mockResolvedValue(0);

      await service.getHistory(ROOM_ID, PLAYER_ID);

      expect(prisma.message.count).toHaveBeenCalledWith({
        where: { roomId: ROOM_ID, playerId: { not: PLAYER_ID }, reads: { none: { playerId: PLAYER_ID } } },
      });
    });

    it('passes a cursor through to the findMany query when paginating', async () => {
      prisma.message.findMany.mockResolvedValue([]);
      prisma.message.count.mockResolvedValue(0);

      await service.getHistory(ROOM_ID, PLAYER_ID, 'msg-1');

      expect(prisma.message.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 1, cursor: { id: 'msg-1' } })
      );
    });
  });

  describe('editMessage', () => {
    it('throws 404 when the message does not exist', async () => {
      prisma.message.findUnique.mockResolvedValue(null);

      await expect(service.editMessage(MESSAGE_ID, PLAYER_ID, 'edited')).rejects.toThrow(NotFoundException);
    });

    it('throws 403 when the caller is not the author', async () => {
      prisma.message.findUnique.mockResolvedValue({ playerId: OTHER_PLAYER_ID, deletedAt: null, roomId: ROOM_ID });

      await expect(service.editMessage(MESSAGE_ID, PLAYER_ID, 'edited')).rejects.toThrow(ForbiddenException);
    });

    it('throws 400 when the message is already deleted', async () => {
      prisma.message.findUnique.mockResolvedValue({ playerId: PLAYER_ID, deletedAt: new Date(), roomId: ROOM_ID });

      await expect(service.editMessage(MESSAGE_ID, PLAYER_ID, 'edited')).rejects.toThrow(BadRequestException);
    });

    it('updates the content and returns the decrypted message', async () => {
      prisma.message.findUnique.mockResolvedValue({ playerId: PLAYER_ID, deletedAt: null, roomId: ROOM_ID });
      prisma.message.update.mockResolvedValue(buildMessage({ content: 'enc:edited' }));

      const result = await service.editMessage(MESSAGE_ID, PLAYER_ID, 'edited');

      expect(result.content).toBe('edited');
    });
  });

  describe('deleteMessage', () => {
    it('throws 403 when the caller is not the author', async () => {
      prisma.message.findUnique.mockResolvedValue({ playerId: OTHER_PLAYER_ID, deletedAt: null, roomId: ROOM_ID });

      await expect(service.deleteMessage(MESSAGE_ID, PLAYER_ID)).rejects.toThrow(ForbiddenException);
    });

    it('soft-deletes the message and blanks out content/iv', async () => {
      prisma.message.findUnique.mockResolvedValue({ playerId: PLAYER_ID, deletedAt: null, roomId: ROOM_ID });
      prisma.message.update.mockResolvedValue({});

      const result = await service.deleteMessage(MESSAGE_ID, PLAYER_ID);

      expect(prisma.message.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ content: '', iv: '' }) })
      );
      expect(result).toEqual({ messageId: MESSAGE_ID, roomId: ROOM_ID });
    });
  });
});
