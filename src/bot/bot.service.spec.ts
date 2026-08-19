import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BotService } from './bot.service';
import { PrismaService } from '../prisma/prisma.service';
import { BotStrategyFactory } from './bot-strategy.factory';
import { BotDifficulty } from './types/enum/bot-difficulty.enum';
import { BotStrategy } from './types/interfaces/bot-strategy.interface';

type PrismaMock = {
  room: { findUnique: jest.Mock; update: jest.Mock };
  player: { createMany: jest.Mock; findMany: jest.Mock; deleteMany: jest.Mock };
};

type StrategyMock = { decideCardChoice: jest.Mock; decideRowChoice: jest.Mock };
type BotStrategyFactoryMock = { getStrategy: jest.Mock };

const ROOM_ID = 'ROOM_ID';

interface RoomPlayerFixture {
  position: number;
  isBot: boolean;
  botName: string | null;
}

describe('BotService', () => {
  let service: BotService;
  let prisma: PrismaMock;
  let strategyFactory: BotStrategyFactoryMock;
  let strategy: StrategyMock;

  beforeEach(() => {
    prisma = {
      room: { findUnique: jest.fn(), update: jest.fn() },
      player: { createMany: jest.fn(), findMany: jest.fn(), deleteMany: jest.fn() },
    };

    strategy = { decideCardChoice: jest.fn(), decideRowChoice: jest.fn() };
    strategyFactory = { getStrategy: jest.fn().mockReturnValue(strategy) };

    service = new BotService(prisma as unknown as PrismaService, strategyFactory as unknown as BotStrategyFactory);
  });

  describe('fillRoomWithBots', () => {
    it('throws 404 when the room does not exist', async () => {
      prisma.room.findUnique.mockResolvedValue(null);

      await expect(service.fillRoomWithBots(ROOM_ID)).rejects.toThrow(NotFoundException);
    });

    it('throws 400 when the room has already started', async () => {
      prisma.room.findUnique.mockResolvedValue({ status: 'IN_PROGRESS', maxPlayers: 4, players: [] });

      await expect(service.fillRoomWithBots(ROOM_ID)).rejects.toThrow(BadRequestException);
    });

    it('does nothing when there are no empty slots', async () => {
      const players: RoomPlayerFixture[] = [
        { position: 0, isBot: false, botName: null },
        { position: 1, isBot: false, botName: null },
      ];
      prisma.room.findUnique.mockResolvedValue({ status: 'WAITING', maxPlayers: 2, players });

      await service.fillRoomWithBots(ROOM_ID);

      expect(prisma.player.createMany).not.toHaveBeenCalled();
      expect(prisma.room.update).not.toHaveBeenCalled();
    });

    it('fills empty slots at free positions with unique bot names', async () => {
      const players: RoomPlayerFixture[] = [
        { position: 0, isBot: false, botName: null },
        { position: 2, isBot: true, botName: '__Bot__' },
      ];
      prisma.room.findUnique.mockResolvedValue({ status: 'WAITING', maxPlayers: 4, players });
      prisma.player.createMany.mockResolvedValue({ count: 2 });
      prisma.room.update.mockResolvedValue({});

      await service.fillRoomWithBots(ROOM_ID);

      const call = prisma.player.createMany.mock.calls[0][0] as { data: Prisma.PlayerCreateManyInput[] };
      const createdBots = call.data;

      expect(createdBots).toHaveLength(2);

      const positions = createdBots.map((bot) => bot.position);
      expect(new Set(positions).size).toBe(positions.length);
      expect(positions).not.toContain(0);
      expect(positions).not.toContain(2);

      const names = createdBots.map((bot) => bot.botName);
      expect(new Set(names).size).toBe(names.length);
      expect(names).not.toContain('__Bot__');

      expect(prisma.room.update).toHaveBeenCalledWith({
        where: { id: ROOM_ID },
        data: { currentPlayers: players.length + 2 },
      });
    });

    it('falls back to a "Bot <random>" name once every predefined name is taken', async () => {
      const takenNames = [
        '__James Goat__',
        '__Dart Vader__',
        '__R2-D2__',
        '__Spider Man__',
        '__T-Rex__',
        '__Zoe Kravitz',
        '__Bot__',
        '__Martin__',
      ];
      const players: RoomPlayerFixture[] = takenNames.map((botName, i) => ({ position: i, isBot: true, botName }));
      prisma.room.findUnique.mockResolvedValue({ status: 'WAITING', maxPlayers: 9, players });
      prisma.player.createMany.mockResolvedValue({ count: 1 });
      prisma.room.update.mockResolvedValue({});

      await service.fillRoomWithBots(ROOM_ID);

      const call = prisma.player.createMany.mock.calls[0][0] as { data: Prisma.PlayerCreateManyInput[] };
      const createdBot = call.data[0];

      expect(createdBot.botName).toMatch(/^Bot \d+$/);
    });
  });

  describe('decideCardChoice', () => {
    it('delegates to the strategy resolved for the given difficulty', () => {
      const hand = [{ number: 5, penalty: 2 }];
      const rows = [[{ number: 10, penalty: 3 }]];
      const chosenCard = hand[0];
      strategy.decideCardChoice.mockReturnValue(chosenCard);

      const result = service.decideCardChoice(hand, rows, 0, BotDifficulty.HARD);

      expect(strategyFactory.getStrategy).toHaveBeenCalledWith(BotDifficulty.HARD);
      expect(strategy.decideCardChoice).toHaveBeenCalledWith({ hand, rows, currentPenalty: 0 });
      expect(result).toBe(chosenCard);
    });
  });

  describe('decideRowChoice', () => {
    it('delegates to the strategy resolved for the given difficulty', () => {
      const rows = [[{ number: 10, penalty: 3 }], [{ number: 20, penalty: 5 }]];
      strategy.decideRowChoice.mockReturnValue(1);

      const result = service.decideRowChoice(rows, 4, null);

      expect(strategyFactory.getStrategy).toHaveBeenCalledWith(null);
      expect(strategy.decideRowChoice).toHaveBeenCalledWith({ rows, currentPenalty: 4 });
      expect(result).toBe(1);
    });
  });

  describe('removeBotsFromRoom', () => {
    it('does nothing when there are no bots in the room', async () => {
      prisma.player.findMany.mockResolvedValue([]);

      await service.removeBotsFromRoom(ROOM_ID);

      expect(prisma.player.deleteMany).not.toHaveBeenCalled();
      expect(prisma.room.update).not.toHaveBeenCalled();
    });

    it('deletes bots and decrements currentPlayers by the removed count', async () => {
      prisma.player.findMany.mockResolvedValue([{ id: 'bot-1' }, { id: 'bot-2' }]);
      prisma.player.deleteMany.mockResolvedValue({ count: 2 });
      prisma.room.update.mockResolvedValue({});

      await service.removeBotsFromRoom(ROOM_ID);

      expect(prisma.player.deleteMany).toHaveBeenCalledWith({ where: { roomId: ROOM_ID, isBot: true } });
      expect(prisma.room.update).toHaveBeenCalledWith({
        where: { id: ROOM_ID },
        data: { currentPlayers: { decrement: 2 } },
      });
    });
  });
});
