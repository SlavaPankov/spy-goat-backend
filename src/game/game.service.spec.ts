import { BadRequestException, NotFoundException } from '@nestjs/common';
import { GameService, RoundFinishedData, TurnAction } from './game.service';
import { PrismaService } from '../prisma/prisma.service';
import { StatisticsService } from '../statistics/statistics.service';
import { BotService } from '../bot/bot.service';
import { Card } from './interfaces/card.interface';
import { Prisma } from '@prisma/client';
import { BotDifficulty } from '../bot/types/enum/bot-difficulty.enum';

const GAME_ID = 'GAME_ID';
const PLAYER_ID = 'PLAYER_ID';
const ROOM_ID = 'ROOM_ID';

type PrismaMock = {
  player: {
    findUnique: jest.Mock;
    findFirst: jest.Mock;
    update: jest.Mock;
    findMany: jest.Mock;
    updateMany: jest.Mock;
  };
  game: { findUnique: jest.Mock; update: jest.Mock; create: jest.Mock };
  roomStats: { upsert: jest.Mock };
  playerRoomStats: { findUnique: jest.Mock; upsert: jest.Mock };
  room: { update: jest.Mock; findUnique: jest.Mock };
};

type StatisticsServiceMock = { updateStatsAfterGame: jest.Mock };

interface PlayerFixture {
  id: string;
  gameId: string | null;
  hand: Card[];
  selectedCard: Card | null;
  isSelectedCardConfirmed: boolean;
}

interface PlayerFixture {
  id: string;
  gameId: string | null;
  hand: Card[];
  selectedCard: Card | null;
  isSelectedCardConfirmed: boolean;
  penaltyCard: Card[];
  roundPenaltyCard: Card[];
}

type GameServiceInternals = {
  pendingPlayers: Map<string, { playerId: string; card: Card }[]>;
  currentProcessingPlayer: Map<string, { playerId: string; card: Card }>;
  currentAction: Map<string, TurnAction>;
};

type BotServiceMock = {
  decideCardChoice: jest.Mock;
  decideRowChoice: jest.Mock;
  fillRoomWithBots: jest.Mock;
  removeBotsFromRoom: jest.Mock;
};

interface GameServicePrivates {
  applyAction: (gameId: string, action: TurnAction) => Promise<void>;
  finishRound: (
    gameId: string
  ) => Promise<{ isGameEnded: boolean; isRoundFinished: boolean; roundData?: RoundFinishedData }>;
}

const buildPlayer = (overrides: Partial<PlayerFixture> = {}): PlayerFixture => ({
  id: PLAYER_ID,
  gameId: GAME_ID,
  hand: [{ number: 5, penalty: 1 }],
  selectedCard: null,
  isSelectedCardConfirmed: false,
  penaltyCard: [],
  roundPenaltyCard: [],
  ...overrides,
});

const getInternals = (svc: GameService) => svc as unknown as GameServiceInternals;
const getPrivates = (svc: GameService): GameServicePrivates => svc as unknown as GameServicePrivates;

describe('GameService', () => {
  let service: GameService;
  let prisma: PrismaMock;
  let botService: BotServiceMock;
  let statisticsService: StatisticsServiceMock;

  beforeEach(() => {
    prisma = {
      player: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
        updateMany: jest.fn(),
      },
      game: { findUnique: jest.fn(), update: jest.fn(), create: jest.fn() },
      roomStats: { upsert: jest.fn() },
      playerRoomStats: { findUnique: jest.fn(), upsert: jest.fn() },
      room: { update: jest.fn(), findUnique: jest.fn() },
    };

    botService = {
      decideCardChoice: jest.fn(),
      decideRowChoice: jest.fn(),
      fillRoomWithBots: jest.fn(),
      removeBotsFromRoom: jest.fn(),
    };

    statisticsService = { updateStatsAfterGame: jest.fn() };

    service = new GameService(
      statisticsService as unknown as StatisticsService,
      prisma as unknown as PrismaService,
      botService as unknown as BotService
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('parseJsonArray (private)', () => {
    it('falls back to an empty array when the stored JSON is not an array', () => {
      type Privates = { parseJsonArray: <T>(json: unknown) => T[] };

      expect((service as unknown as Privates).parseJsonArray({ not: 'an array' })).toEqual([]);
      expect((service as unknown as Privates).parseJsonArray(null)).toEqual([]);
    });
  });

  describe('createDeck', () => {
    it('creates exactly 104 unique cards numbered 1..104', () => {
      const deck = service.createDeck();

      expect(deck).toHaveLength(104);
      expect(new Set(deck.map((c) => c.number)).size).toBe(104);
      expect(Math.min(...deck.map((c) => c.number))).toBe(1);
      expect(Math.max(...deck.map((c) => c.number))).toBe(104);
    });

    it('assigns penalties per the "Take 5" rules', () => {
      const deck = service.createDeck();
      const byNumber = new Map(deck.map((c) => [c.number, c.penalty]));

      expect(byNumber.get(55)).toBe(7);
      expect(byNumber.get(11)).toBe(5);
      expect(byNumber.get(22)).toBe(5);
      expect(byNumber.get(10)).toBe(3);
      expect(byNumber.get(20)).toBe(3);
      expect(byNumber.get(5)).toBe(2);
      expect(byNumber.get(15)).toBe(2);
      expect(byNumber.get(1)).toBe(1);
      expect(byNumber.get(104)).toBe(1);
    });

    it('produces the expected penalty distribution across the whole deck', () => {
      const deck = service.createDeck();
      const counts = deck.reduce<Record<number, number>>((acc, c) => {
        acc[c.penalty] = (acc[c.penalty] ?? 0) + 1;
        return acc;
      }, {});

      expect(counts).toEqual({ 7: 1, 5: 8, 3: 10, 2: 9, 1: 76 });
    });
  });

  describe('shuffleDeck', () => {
    it('does not mutate the original deck', () => {
      const deck = service.createDeck();
      const original = [...deck];

      service.shuffleDeck(deck);

      expect(deck).toEqual(original);
    });

    it('returns the same set of cards, just reordered', () => {
      const deck = service.createDeck();

      const shuffled = service.shuffleDeck(deck);

      expect(shuffled).toHaveLength(deck.length);
      expect([...shuffled].sort((a, b) => a.number - b.number)).toEqual([...deck].sort((a, b) => a.number - b.number));
    });

    it('follows a Fisher-Yates swap-with-index-0 pattern when Math.random is pinned to 0', () => {
      const deck: Card[] = [
        { number: 1, penalty: 1 },
        { number: 2, penalty: 1 },
        { number: 3, penalty: 1 },
        { number: 4, penalty: 1 },
      ];
      const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0);

      const shuffled = service.shuffleDeck(deck);

      expect(shuffled.map((c) => c.number)).toEqual([2, 3, 4, 1]);

      randomSpy.mockRestore();
    });
  });

  describe('dealCards', () => {
    it('deals handSize cards to each player and 1 card to each of the 4 rows, with no duplicates', () => {
      const deck = service.createDeck();
      const playerCount = 4;

      const { playerHands, tableRows, remainingDeck } = service.dealCards(deck, playerCount);

      expect(playerHands).toHaveLength(playerCount);
      playerHands.forEach((hand) => expect(hand).toHaveLength(10));
      expect(tableRows).toHaveLength(4);
      tableRows.forEach((row) => expect(row).toHaveLength(1));

      const dealtNumbers = [
        ...playerHands.flat().map((c) => c.number),
        ...tableRows.flat().map((c) => c.number),
        ...remainingDeck.map((c) => c.number),
      ];

      expect(dealtNumbers).toHaveLength(deck.length);
      expect(new Set(dealtNumbers).size).toBe(deck.length);
    });

    it('deals deck[0] to the first player, not deck[1] (off-by-one regression)', () => {
      const deck = service.createDeck();

      const { playerHands } = service.dealCards(deck, 4);

      expect(playerHands[0][0]).toEqual(deck[0]);
    });

    it('consumes exactly handSize * playerCount + 4 cards from the deck', () => {
      const deck = service.createDeck();
      const playerCount = 3;

      const { remainingDeck } = service.dealCards(deck, playerCount);

      expect(remainingDeck).toHaveLength(deck.length - (10 * playerCount + 4));
    });
  });

  describe('findRowForCard', () => {
    const rows: Card[][] = [
      [{ number: 5, penalty: 1 }],
      [{ number: 20, penalty: 1 }],
      [{ number: 50, penalty: 1 }],
      [],
    ];

    it('picks the row with the smallest positive difference', () => {
      expect(service.findRowForCard({ number: 22, penalty: 1 }, rows)).toBe(1);
    });

    it('returns -1 when the card is smaller than every row end', () => {
      expect(service.findRowForCard({ number: 1, penalty: 1 }, rows)).toBe(-1);
    });

    it('ignores empty rows without crashing', () => {
      const result = service.findRowForCard({ number: 100, penalty: 1 }, rows);

      expect(result).toBe(2);
    });
  });

  describe('calculateActionForPlayer', () => {
    it('returns choose_row when no row fits', () => {
      const rows: Card[][] = [[{ number: 10, penalty: 1 }]];
      const action = service.calculateActionForPlayer({ playerId: 'p1', card: { number: 1, penalty: 1 } }, rows);

      expect(action).toEqual({ playerId: 'p1', actionType: 'choose_row' });
    });

    it('returns place when the target row has room', () => {
      const rows: Card[][] = [[{ number: 10, penalty: 1 }]];
      const action = service.calculateActionForPlayer({ playerId: 'p1', card: { number: 15, penalty: 1 } }, rows);

      expect(action).toEqual({ playerId: 'p1', actionType: 'place', rowIndex: 0 });
    });

    it('returns take_row with all 5 cards when the target row is full', () => {
      const fullRow: Card[] = [1, 2, 3, 4, 5].map((n) => ({ number: n * 10, penalty: 1 }));
      const rows: Card[][] = [fullRow];

      const action = service.calculateActionForPlayer({ playerId: 'p1', card: { number: 100, penalty: 1 } }, rows);

      expect(action).toEqual({ playerId: 'p1', actionType: 'take_row', rowIndex: 0, takenCards: fullRow });
      expect(action.takenCards).not.toBe(fullRow);
    });
  });

  describe('selectCard', () => {
    it('throws 404 when the player does not exist', async () => {
      prisma.player.findUnique.mockResolvedValue(null);

      await expect(service.selectCard(PLAYER_ID, { number: 5, penalty: 1 })).rejects.toThrow(NotFoundException);
    });

    it('throws 400 when the card is not in hand', async () => {
      prisma.player.findUnique.mockResolvedValue(buildPlayer({ hand: [{ number: 5, penalty: 1 }] }));

      await expect(service.selectCard(PLAYER_ID, { number: 99, penalty: 1 })).rejects.toThrow(BadRequestException);
    });

    it('stores the selected card and resets confirmation', async () => {
      prisma.player.findUnique.mockResolvedValue(buildPlayer({ hand: [{ number: 5, penalty: 1 }] }));
      prisma.player.update.mockResolvedValue({});

      await service.selectCard(PLAYER_ID, { number: 5, penalty: 1 });

      expect(prisma.player.update).toHaveBeenCalledWith({
        where: { id: PLAYER_ID },
        data: { selectedCard: { number: 5, penalty: 1 }, isSelectedCardConfirmed: false },
      });
    });
  });

  describe('declineCardChoice', () => {
    it('throws 404 when the player is not in a game', async () => {
      prisma.player.findUnique.mockResolvedValue({ ...buildPlayer(), game: null });

      await expect(service.declineCardChoice(PLAYER_ID)).rejects.toThrow(NotFoundException);
    });

    it('throws 400 when the card has not been confirmed yet', async () => {
      prisma.player.findUnique.mockResolvedValue({
        ...buildPlayer({ isSelectedCardConfirmed: false }),
        game: { players: [{ isSelectedCardConfirmed: false }] },
      });

      await expect(service.declineCardChoice(PLAYER_ID)).rejects.toThrow(BadRequestException);
    });

    it('throws 400 when every player has already confirmed', async () => {
      prisma.player.findUnique.mockResolvedValue({
        ...buildPlayer({ isSelectedCardConfirmed: true, selectedCard: { number: 5, penalty: 1 } }),
        game: { players: [{ isSelectedCardConfirmed: true }, { isSelectedCardConfirmed: true }] },
      });

      await expect(service.declineCardChoice(PLAYER_ID)).rejects.toThrow(BadRequestException);
    });

    it('returns the selected card to the hand and unconfirms it', async () => {
      prisma.player.findUnique.mockResolvedValue({
        ...buildPlayer({
          hand: [{ number: 10, penalty: 1 }],
          selectedCard: { number: 5, penalty: 1 },
          isSelectedCardConfirmed: true,
        }),
        game: { players: [{ isSelectedCardConfirmed: true }, { isSelectedCardConfirmed: false }] },
      });
      prisma.player.update.mockResolvedValue({});

      const result = await service.declineCardChoice(PLAYER_ID);

      expect(prisma.player.update).toHaveBeenCalledWith({
        where: { id: PLAYER_ID },
        data: {
          hand: [
            { number: 10, penalty: 1 },
            { number: 5, penalty: 1 },
          ],
          isSelectedCardConfirmed: false,
          selectedCard: Prisma.JsonNull,
        },
      });
      expect(result).toEqual({ gameId: GAME_ID });
    });
  });

  describe('setIsReady', () => {
    it('throws 404 when the player is not in the room', async () => {
      prisma.player.findFirst.mockResolvedValue(null);

      await expect(service.setIsReady(PLAYER_ID, ROOM_ID, true)).rejects.toThrow(NotFoundException);
    });

    it('updates the ready flag', async () => {
      prisma.player.findFirst.mockResolvedValue(buildPlayer());
      prisma.player.update.mockResolvedValue({ id: PLAYER_ID, isReady: true });

      const result = await service.setIsReady(PLAYER_ID, ROOM_ID, true);

      expect(prisma.player.update).toHaveBeenCalledWith({ where: { id: PLAYER_ID }, data: { isReady: true } });
      expect(result).toEqual({ id: PLAYER_ID, isReady: true });
    });
  });

  describe('confirmCardChoice', () => {
    it('throws 404 when the player does not exist or is not in a game', async () => {
      prisma.player.findUnique.mockResolvedValue(null);

      await expect(service.confirmCardChoice(PLAYER_ID)).rejects.toThrow(NotFoundException);
    });

    it('throws 400 when no card was selected', async () => {
      prisma.player.findUnique.mockResolvedValue(buildPlayer({ selectedCard: null }));

      await expect(service.confirmCardChoice(PLAYER_ID)).rejects.toThrow(BadRequestException);
    });

    it('throws 400 when the selected card is not in hand', async () => {
      prisma.player.findUnique.mockResolvedValue(
        buildPlayer({ selectedCard: { number: 99, penalty: 1 }, hand: [{ number: 5, penalty: 1 }] })
      );

      await expect(service.confirmCardChoice(PLAYER_ID)).rejects.toThrow(BadRequestException);
    });

    it('confirms the card, removes it from hand, and reports allReady=false when others are still picking', async () => {
      prisma.player.findUnique.mockResolvedValue(
        buildPlayer({ selectedCard: { number: 5, penalty: 1 }, hand: [{ number: 5, penalty: 1 }] })
      );
      prisma.player.update.mockResolvedValue({});
      prisma.game.findUnique.mockResolvedValue({
        currentTurnCards: [],
        players: [
          { id: PLAYER_ID, isSelectedCardConfirmed: true, selectedCard: { number: 5, penalty: 1 } },
          { id: 'other-player', isSelectedCardConfirmed: false, selectedCard: null },
        ],
      });

      const result = await service.confirmCardChoice(PLAYER_ID);

      expect(prisma.player.update).toHaveBeenCalledWith({
        where: { id: PLAYER_ID },
        data: { hand: [], isSelectedCardConfirmed: true },
      });
      expect(result).toEqual({ allReady: false, gameId: GAME_ID });
      expect(prisma.game.update).not.toHaveBeenCalled();
    });

    it("collects everyone's cards into currentTurnCards once all players are ready", async () => {
      prisma.player.findUnique.mockResolvedValue(
        buildPlayer({ selectedCard: { number: 5, penalty: 1 }, hand: [{ number: 5, penalty: 1 }] })
      );
      prisma.player.update.mockResolvedValue({});
      prisma.game.findUnique.mockResolvedValue({
        currentTurnCards: [],
        players: [
          { id: PLAYER_ID, isSelectedCardConfirmed: true, selectedCard: { number: 5, penalty: 1 } },
          { id: 'other-player', isSelectedCardConfirmed: true, selectedCard: { number: 8, penalty: 1 } },
        ],
      });
      prisma.game.update.mockResolvedValue({});

      const result = await service.confirmCardChoice(PLAYER_ID);

      expect(prisma.game.update).toHaveBeenCalledWith({
        where: { id: GAME_ID },
        data: {
          currentTurnCards: [
            { playerId: PLAYER_ID, card: { number: 5, penalty: 1 } },
            { playerId: 'other-player', card: { number: 8, penalty: 1 } },
          ],
        },
      });
      expect(result).toEqual({ allReady: true, gameId: GAME_ID });
    });

    it('does not re-populate currentTurnCards if it was already set (idempotent)', async () => {
      prisma.player.findUnique.mockResolvedValue(
        buildPlayer({ selectedCard: { number: 5, penalty: 1 }, hand: [{ number: 5, penalty: 1 }] })
      );
      prisma.player.update.mockResolvedValue({});
      prisma.game.findUnique.mockResolvedValue({
        currentTurnCards: [{ playerId: PLAYER_ID, card: { number: 5, penalty: 1 } }],
        players: [{ id: PLAYER_ID, isSelectedCardConfirmed: true, selectedCard: { number: 5, penalty: 1 } }],
      });

      await service.confirmCardChoice(PLAYER_ID);

      expect(prisma.game.update).not.toHaveBeenCalled();
    });

    it('waits for a concurrent confirmCardChoice call on the same game to release its lock', async () => {
      prisma.player.findUnique.mockResolvedValue(
        buildPlayer({ selectedCard: { number: 5, penalty: 1 }, hand: [{ number: 5, penalty: 1 }] })
      );
      prisma.player.update.mockResolvedValue({});
      prisma.game.findUnique.mockResolvedValue({
        currentTurnCards: [],
        players: [{ id: PLAYER_ID, isSelectedCardConfirmed: true, selectedCard: { number: 5, penalty: 1 } }],
      });

      const locks = (service as unknown as { confirmLocks: Set<string> }).confirmLocks;
      locks.add(GAME_ID);
      setTimeout(() => locks.delete(GAME_ID), 15);

      const result = await service.confirmCardChoice(PLAYER_ID);

      expect(result).toEqual({ allReady: true, gameId: GAME_ID });
      expect(locks.has(GAME_ID)).toBe(false);
    });
  });

  describe('chooseRow', () => {
    type GameServiceInternals = {
      pendingPlayers: Map<string, { playerId: string; card: Card }[]>;
      currentProcessingPlayer: Map<string, { playerId: string; card: Card }>;
      currentAction: Map<string, TurnAction>;
    };

    const getInternals = (svc: GameService) => svc as unknown as GameServiceInternals;

    it('throws when there is no active choose_row state for this game', async () => {
      await expect(service.chooseRow(GAME_ID, PLAYER_ID, 0)).rejects.toThrow(BadRequestException);
    });

    it("throws when it is not the caller's turn", async () => {
      const internals = getInternals(service);
      internals.currentProcessingPlayer.set(GAME_ID, { playerId: 'someone-else', card: { number: 1, penalty: 1 } });
      internals.currentAction.set(GAME_ID, { playerId: 'someone-else', actionType: 'choose_row' });

      await expect(service.chooseRow(GAME_ID, PLAYER_ID, 0)).rejects.toThrow(BadRequestException);
    });

    it('throws when the pending action is not choose_row', async () => {
      const internals = getInternals(service);
      internals.currentProcessingPlayer.set(GAME_ID, { playerId: PLAYER_ID, card: { number: 1, penalty: 1 } });
      internals.currentAction.set(GAME_ID, { playerId: PLAYER_ID, actionType: 'place', rowIndex: 0 });

      await expect(service.chooseRow(GAME_ID, PLAYER_ID, 0)).rejects.toThrow(BadRequestException);
    });

    it('throws 404 when the game no longer exists', async () => {
      const internals = getInternals(service);
      internals.currentProcessingPlayer.set(GAME_ID, { playerId: PLAYER_ID, card: { number: 1, penalty: 1 } });
      internals.currentAction.set(GAME_ID, { playerId: PLAYER_ID, actionType: 'choose_row' });
      prisma.game.findUnique.mockResolvedValue(null);

      await expect(service.chooseRow(GAME_ID, PLAYER_ID, 0)).rejects.toThrow(NotFoundException);
    });

    it('throws 400 for an out-of-range row index', async () => {
      const internals = getInternals(service);
      internals.currentProcessingPlayer.set(GAME_ID, { playerId: PLAYER_ID, card: { number: 1, penalty: 1 } });
      internals.currentAction.set(GAME_ID, { playerId: PLAYER_ID, actionType: 'choose_row' });
      prisma.game.findUnique.mockResolvedValue({ rows: [[], [], [], []] });

      await expect(service.chooseRow(GAME_ID, PLAYER_ID, 4)).rejects.toThrow(BadRequestException);
    });

    it('throws 404 when the player no longer exists', async () => {
      const internals = getInternals(service);
      internals.currentProcessingPlayer.set(GAME_ID, { playerId: PLAYER_ID, card: { number: 1, penalty: 1 } });
      internals.currentAction.set(GAME_ID, { playerId: PLAYER_ID, actionType: 'choose_row' });
      prisma.game.findUnique.mockResolvedValue({ rows: [[], [], [], []] });
      prisma.player.findUnique.mockResolvedValue(null);

      await expect(service.chooseRow(GAME_ID, PLAYER_ID, 0)).rejects.toThrow(NotFoundException);
    });

    it('takes the chosen row, applies its penalty, clears turn state, and hands off to processNextPlayer', async () => {
      const internals = getInternals(service);
      internals.currentProcessingPlayer.set(GAME_ID, { playerId: PLAYER_ID, card: { number: 30, penalty: 1 } });
      internals.currentAction.set(GAME_ID, { playerId: PLAYER_ID, actionType: 'choose_row' });
      internals.pendingPlayers.set(GAME_ID, [
        { playerId: PLAYER_ID, card: { number: 30, penalty: 1 } },
        { playerId: 'next-player', card: { number: 40, penalty: 1 } },
      ]);

      const fullRow = [10, 20, 25].map((n) => ({ number: n, penalty: 1 }));
      prisma.game.findUnique.mockResolvedValue({ rows: [fullRow, [], [], []] });
      prisma.player.findUnique.mockResolvedValue(buildPlayer({ selectedCard: { number: 30, penalty: 1 } }));
      prisma.game.update.mockResolvedValue({});
      prisma.player.update.mockResolvedValue({});

      const processNextPlayerSpy = jest
        .spyOn(service, 'processNextPlayer')
        .mockResolvedValue({} as unknown as Awaited<ReturnType<GameService['processNextPlayer']>>);

      await service.chooseRow(GAME_ID, PLAYER_ID, 0);

      expect(prisma.game.update).toHaveBeenCalledWith({
        where: { id: GAME_ID },
        data: { rows: [[{ number: 30, penalty: 1 }], [], [], []] },
      });
      expect(prisma.player.update).toHaveBeenCalledWith({
        where: { id: PLAYER_ID },
        data: {
          penaltyCard: fullRow,
          roundPenaltyCard: fullRow,
          totalPenalty: { increment: 3 },
          roundPenalty: { increment: 3 },
          selectedCard: Prisma.JsonNull,
        },
      });
      expect(internals.currentProcessingPlayer.has(GAME_ID)).toBe(false);
      expect(internals.currentAction.has(GAME_ID)).toBe(false);
      expect(internals.pendingPlayers.get(GAME_ID)).toEqual([
        { playerId: 'next-player', card: { number: 40, penalty: 1 } },
      ]);
      expect(processNextPlayerSpy).toHaveBeenCalledWith(GAME_ID, undefined);

      processNextPlayerSpy.mockRestore();
    });
  });

  describe('processNextPlayer', () => {
    const ROW_PLACE = [[{ number: 10, penalty: 1 }], [], [], []];
    const ROW_TAKE = [[10, 20, 30, 40, 50].map((n) => ({ number: n, penalty: 1 })), [], [], []];
    const ROW_CHOOSE = [[{ number: 10, penalty: 1 }], [], [], []];

    it('finishes the round and returns default state when there is no pending queue', async () => {
      const finishRoundSpy = jest
        .spyOn(getPrivates(service), 'finishRound')
        .mockResolvedValue({ isGameEnded: false, isRoundFinished: true, roundData: undefined });
      const fakeGameState = { gameId: GAME_ID, roomId: ROOM_ID } as unknown as Awaited<
        ReturnType<GameService['getGameState']>
      >;
      jest.spyOn(service, 'getGameState').mockResolvedValue(fakeGameState);

      const result = await service.processNextPlayer(GAME_ID);

      expect(finishRoundSpy).toHaveBeenCalledWith(GAME_ID);
      expect(botService.removeBotsFromRoom).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...fakeGameState,
        action: { playerId: '', actionType: 'place' },
        isRoundFinished: true,
        roundData: undefined,
        isGameEnded: false,
      });
    });

    it('removes bots from the room once the game has ended', async () => {
      jest
        .spyOn(getPrivates(service), 'finishRound')
        .mockResolvedValue({ isGameEnded: true, isRoundFinished: false, roundData: undefined });
      const fakeGameState = { gameId: GAME_ID, roomId: ROOM_ID } as unknown as Awaited<
        ReturnType<GameService['getGameState']>
      >;
      jest.spyOn(service, 'getGameState').mockResolvedValue(fakeGameState);

      await service.processNextPlayer(GAME_ID);

      expect(botService.removeBotsFromRoom).toHaveBeenCalledWith(ROOM_ID);
    });

    it('throws 404 when the game record disappears mid-turn', async () => {
      getInternals(service).pendingPlayers.set(GAME_ID, [{ playerId: PLAYER_ID, card: { number: 1, penalty: 1 } }]);
      prisma.game.findUnique.mockResolvedValue(null);

      await expect(service.processNextPlayer(GAME_ID)).rejects.toThrow(NotFoundException);
    });

    it('applies a "place" action, advances the queue, and recurses into itself', async () => {
      const internals = getInternals(service);
      internals.pendingPlayers.set(GAME_ID, [
        { playerId: PLAYER_ID, card: { number: 15, penalty: 1 } },
        { playerId: 'next-player', card: { number: 99, penalty: 1 } },
      ]);
      prisma.game.findUnique.mockResolvedValue({ rows: ROW_PLACE });

      const applyActionSpy = jest.spyOn(getPrivates(service), 'applyAction').mockResolvedValue(undefined);
      const fakeGameState = { gameId: GAME_ID } as unknown as Awaited<ReturnType<GameService['getGameState']>>;
      jest.spyOn(service, 'getGameState').mockResolvedValue(fakeGameState);

      const originalProcessNextPlayer = service.processNextPlayer.bind(service);
      const processNextPlayerSpy = jest.spyOn(service, 'processNextPlayer');
      processNextPlayerSpy.mockImplementationOnce(originalProcessNextPlayer);
      processNextPlayerSpy.mockResolvedValue({
        ...fakeGameState,
        action: { playerId: 'next-player', actionType: 'place' },
      } as unknown as Awaited<ReturnType<GameService['processNextPlayer']>>);

      const onStep = jest.fn();
      const expectedAction: TurnAction = { playerId: PLAYER_ID, actionType: 'place', rowIndex: 0 };

      const result = await service.processNextPlayer(GAME_ID, onStep);

      expect(applyActionSpy).toHaveBeenCalledWith(GAME_ID, expectedAction);
      expect(internals.pendingPlayers.get(GAME_ID)).toEqual([
        { playerId: 'next-player', card: { number: 99, penalty: 1 } },
      ]);
      expect(onStep).toHaveBeenCalledTimes(1);
      expect(onStep).toHaveBeenCalledWith({ gameState: fakeGameState, action: expectedAction, phase: 'applied' });
      expect(processNextPlayerSpy).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ ...fakeGameState, action: { playerId: 'next-player', actionType: 'place' } });
    });

    it('applies a "take_row" action and reports both the row-chosen and applied onStep phases', async () => {
      const internals = getInternals(service);
      internals.pendingPlayers.set(GAME_ID, [{ playerId: PLAYER_ID, card: { number: 60, penalty: 1 } }]);
      prisma.game.findUnique.mockResolvedValue({ rows: ROW_TAKE });

      jest.spyOn(getPrivates(service), 'applyAction').mockResolvedValue(undefined);
      const fakeGameState = { gameId: GAME_ID } as unknown as Awaited<ReturnType<GameService['getGameState']>>;
      jest.spyOn(service, 'getGameState').mockResolvedValue(fakeGameState);

      const originalProcessNextPlayer = service.processNextPlayer.bind(service);
      const processNextPlayerSpy = jest.spyOn(service, 'processNextPlayer');
      processNextPlayerSpy.mockImplementationOnce(originalProcessNextPlayer);
      processNextPlayerSpy.mockResolvedValue({} as unknown as Awaited<ReturnType<GameService['processNextPlayer']>>);

      const onStep = jest.fn();
      const expectedAction: TurnAction = {
        playerId: PLAYER_ID,
        actionType: 'take_row',
        rowIndex: 0,
        takenCards: ROW_TAKE[0],
      };

      await service.processNextPlayer(GAME_ID, onStep);

      expect(onStep).toHaveBeenNthCalledWith(1, {
        gameState: fakeGameState,
        action: expectedAction,
        phase: 'row-chosen',
      });
      expect(onStep).toHaveBeenNthCalledWith(2, { gameState: fakeGameState, action: expectedAction, phase: 'applied' });
    });

    it('delegates to chooseRow when a bot must pick a row', async () => {
      getInternals(service).pendingPlayers.set(GAME_ID, [{ playerId: PLAYER_ID, card: { number: 1, penalty: 1 } }]);
      prisma.game.findUnique.mockResolvedValue({ rows: ROW_CHOOSE });
      prisma.player.findUnique.mockResolvedValue({ id: PLAYER_ID, isBot: true, totalPenalty: 5 });
      botService.decideRowChoice.mockReturnValue(2);

      const chooseRowSpy = jest
        .spyOn(service, 'chooseRow')
        .mockResolvedValue({} as unknown as Awaited<ReturnType<GameService['chooseRow']>>);

      const onStep = jest.fn();
      await service.processNextPlayer(GAME_ID, onStep);

      expect(botService.decideRowChoice).toHaveBeenCalledWith(ROW_CHOOSE, 5, BotDifficulty.HARD);
      expect(chooseRowSpy).toHaveBeenCalledWith(GAME_ID, PLAYER_ID, 2, onStep);
    });

    it('returns the pending choose_row action for a human without calling chooseRow', async () => {
      getInternals(service).pendingPlayers.set(GAME_ID, [{ playerId: PLAYER_ID, card: { number: 1, penalty: 1 } }]);
      prisma.game.findUnique.mockResolvedValue({ rows: ROW_CHOOSE });
      prisma.player.findUnique.mockResolvedValue({ id: PLAYER_ID, isBot: false, totalPenalty: 5 });

      const chooseRowSpy = jest.spyOn(service, 'chooseRow');
      const fakeGameState = { gameId: GAME_ID } as unknown as Awaited<ReturnType<GameService['getGameState']>>;
      jest.spyOn(service, 'getGameState').mockResolvedValue(fakeGameState);

      const result = await service.processNextPlayer(GAME_ID);

      expect(chooseRowSpy).not.toHaveBeenCalled();
      expect(result).toEqual({ ...fakeGameState, action: { playerId: PLAYER_ID, actionType: 'choose_row' } });
    });
  });

  describe('applyAction (private)', () => {
    it('throws 404 when the game no longer exists', async () => {
      prisma.game.findUnique.mockResolvedValue(null);

      await expect(
        getPrivates(service).applyAction(GAME_ID, { playerId: PLAYER_ID, actionType: 'place', rowIndex: 0 })
      ).rejects.toThrow(NotFoundException);
    });

    it('throws 404 when the player no longer exists', async () => {
      prisma.game.findUnique.mockResolvedValue({ rows: [[], [], [], []] });
      prisma.player.findUnique.mockResolvedValue(null);

      await expect(
        getPrivates(service).applyAction(GAME_ID, { playerId: PLAYER_ID, actionType: 'place', rowIndex: 0 })
      ).rejects.toThrow(NotFoundException);
    });

    it('places the selected card onto the target row and clears it from the player', async () => {
      prisma.game.findUnique.mockResolvedValue({ rows: [[{ number: 10, penalty: 1 }], [], [], []] });
      prisma.player.findUnique.mockResolvedValue(buildPlayer({ selectedCard: { number: 15, penalty: 1 } }));
      prisma.game.update.mockResolvedValue({});
      prisma.player.update.mockResolvedValue({});

      await getPrivates(service).applyAction(GAME_ID, { playerId: PLAYER_ID, actionType: 'place', rowIndex: 0 });

      expect(prisma.game.update).toHaveBeenCalledWith({
        where: { id: GAME_ID },
        data: {
          rows: [
            [
              { number: 10, penalty: 1 },
              { number: 15, penalty: 1 },
            ],
            [],
            [],
            [],
          ],
        },
      });
      expect(prisma.player.update).toHaveBeenCalledWith({
        where: { id: PLAYER_ID },
        data: { selectedCard: Prisma.JsonNull },
      });
    });

    it('takes the row, accumulates penalty cards, and increments the penalty totals', async () => {
      const fullRow = [10, 20, 30].map((n) => ({ number: n, penalty: 1 }));
      prisma.game.findUnique.mockResolvedValue({ rows: [fullRow, [], [], []] });
      prisma.player.findUnique.mockResolvedValue(
        buildPlayer({
          selectedCard: { number: 40, penalty: 1 },
          penaltyCard: [{ number: 1, penalty: 1 }],
          roundPenaltyCard: [],
        })
      );
      prisma.game.update.mockResolvedValue({});
      prisma.player.update.mockResolvedValue({});

      await getPrivates(service).applyAction(GAME_ID, {
        playerId: PLAYER_ID,
        actionType: 'take_row',
        rowIndex: 0,
        takenCards: fullRow,
      });

      expect(prisma.game.update).toHaveBeenCalledWith({
        where: { id: GAME_ID },
        data: { rows: [[{ number: 40, penalty: 1 }], [], [], []] },
      });
      expect(prisma.player.update).toHaveBeenCalledWith({
        where: { id: PLAYER_ID },
        data: {
          penaltyCard: [{ number: 1, penalty: 1 }, ...fullRow],
          roundPenaltyCard: [...fullRow],
          totalPenalty: { increment: 3 },
          roundPenalty: { increment: 3 },
          selectedCard: Prisma.JsonNull,
        },
      });
    });

    it('does nothing for a choose_row action (defensive no-op)', async () => {
      prisma.game.findUnique.mockResolvedValue({ rows: [[], [], [], []] });
      prisma.player.findUnique.mockResolvedValue(buildPlayer());

      await getPrivates(service).applyAction(GAME_ID, { playerId: PLAYER_ID, actionType: 'choose_row' });

      expect(prisma.game.update).not.toHaveBeenCalled();
      expect(prisma.player.update).not.toHaveBeenCalled();
    });
  });

  describe('finishRound (private)', () => {
    it('returns a no-op result when the game no longer exists', async () => {
      prisma.game.findUnique.mockResolvedValue(null);
      const resetSpy = jest.spyOn(service, 'resetPlayersReady');

      const result = await getPrivates(service).finishRound(GAME_ID);

      expect(result).toEqual({ isGameEnded: false, isRoundFinished: false });
      expect(resetSpy).not.toHaveBeenCalled();
      expect(prisma.game.update).not.toHaveBeenCalled();
    });

    it('clears turn state and deals the next turn when hands are not empty yet', async () => {
      prisma.game.findUnique.mockResolvedValue({ currentTurn: 3, players: [] });
      const resetSpy = jest.spyOn(service, 'resetPlayersReady').mockResolvedValue(undefined);
      prisma.game.update.mockResolvedValue({});
      prisma.player.findMany.mockResolvedValue([buildPlayer({ hand: [{ number: 1, penalty: 1 }] })]);
      const autoSelectSpy = jest.spyOn(service, 'autoSelectCardsForBots').mockResolvedValue(undefined);

      const internals = getInternals(service);
      internals.pendingPlayers.set(GAME_ID, [{ playerId: PLAYER_ID, card: { number: 1, penalty: 1 } }]);
      internals.currentProcessingPlayer.set(GAME_ID, { playerId: PLAYER_ID, card: { number: 1, penalty: 1 } });
      internals.currentAction.set(GAME_ID, { playerId: PLAYER_ID, actionType: 'place' });

      const result = await getPrivates(service).finishRound(GAME_ID);

      expect(resetSpy).toHaveBeenCalledWith(GAME_ID);
      expect(prisma.game.update).toHaveBeenCalledWith({
        where: { id: GAME_ID },
        data: { currentTurnCards: [], currentTurn: 4 },
      });
      expect(autoSelectSpy).toHaveBeenCalledWith(GAME_ID);
      expect(internals.pendingPlayers.has(GAME_ID)).toBe(false);
      expect(internals.currentProcessingPlayer.has(GAME_ID)).toBe(false);
      expect(internals.currentAction.has(GAME_ID)).toBe(false);
      expect(result).toEqual({ isGameEnded: false, isRoundFinished: false });
    });

    it('finishes the round and deals bots for the next one when every hand is empty but the game continues', async () => {
      prisma.game.findUnique.mockResolvedValue({ currentTurn: 5, players: [] });
      jest.spyOn(service, 'resetPlayersReady').mockResolvedValue(undefined);
      prisma.game.update.mockResolvedValue({});
      prisma.player.findMany.mockResolvedValue([buildPlayer({ hand: [] })]);
      const fakeRoundData = { roundNumber: 2 } as unknown as Awaited<ReturnType<GameService['getRoundFinishedData']>>;
      jest.spyOn(service, 'getRoundFinishedData').mockResolvedValue(fakeRoundData);
      jest.spyOn(service, 'checkGameEnd').mockResolvedValue(false);
      const autoSelectSpy = jest.spyOn(service, 'autoSelectCardsForBots').mockResolvedValue(undefined);

      const result = await getPrivates(service).finishRound(GAME_ID);

      expect(autoSelectSpy).toHaveBeenCalledWith(GAME_ID);
      expect(result).toEqual({ isGameEnded: false, isRoundFinished: true, roundData: fakeRoundData });
    });

    it('ends the game without dealing another round when checkGameEnd reports a loser', async () => {
      prisma.game.findUnique.mockResolvedValue({ currentTurn: 5, players: [] });
      jest.spyOn(service, 'resetPlayersReady').mockResolvedValue(undefined);
      prisma.game.update.mockResolvedValue({});
      prisma.player.findMany.mockResolvedValue([buildPlayer({ hand: [] })]);
      jest
        .spyOn(service, 'getRoundFinishedData')
        .mockResolvedValue({} as unknown as Awaited<ReturnType<GameService['getRoundFinishedData']>>);
      jest.spyOn(service, 'checkGameEnd').mockResolvedValue(true);
      const autoSelectSpy = jest.spyOn(service, 'autoSelectCardsForBots').mockResolvedValue(undefined);

      const result = await getPrivates(service).finishRound(GAME_ID);

      expect(autoSelectSpy).not.toHaveBeenCalled();
      expect(result).toEqual({ isGameEnded: true, isRoundFinished: false, roundData: undefined });
    });
  });

  describe('revealCards', () => {
    it('throws 404 when the game does not exist', async () => {
      prisma.game.findUnique.mockResolvedValue(null);

      await expect(service.revealCards(GAME_ID)).rejects.toThrow(NotFoundException);
    });

    it('returns the current turn cards', async () => {
      prisma.game.findUnique.mockResolvedValue({
        currentTurnCards: [{ playerId: PLAYER_ID, card: { number: 5, penalty: 1 } }],
      });

      const result = await service.revealCards(GAME_ID);

      expect(result).toEqual([{ playerId: PLAYER_ID, card: { number: 5, penalty: 1 } }]);
    });
  });

  describe('resetPlayersReady', () => {
    it('unconfirms every player in the game', async () => {
      prisma.player.updateMany.mockResolvedValue({ count: 4 });

      await service.resetPlayersReady(GAME_ID);

      expect(prisma.player.updateMany).toHaveBeenCalledWith({
        where: { gameId: GAME_ID },
        data: { isSelectedCardConfirmed: false },
      });
    });
  });

  describe('getGameState', () => {
    it('throws 404 when the game does not exist', async () => {
      prisma.game.findUnique.mockResolvedValue(null);

      await expect(service.getGameState(GAME_ID)).rejects.toThrow(NotFoundException);
    });

    it('assembles the full game state, including turn/choice metadata from in-memory maps', async () => {
      prisma.game.findUnique.mockResolvedValue({
        id: GAME_ID,
        roomId: ROOM_ID,
        currentRound: 2,
        currentTurn: 3,
        rows: [[{ number: 10, penalty: 1 }], [], [], []],
        status: 'IN_PROGRESS',
        currentTurnCards: [{ playerId: PLAYER_ID, card: { number: 5, penalty: 1 } }],
        players: [
          {
            id: PLAYER_ID,
            userId: 'user-1',
            isBot: false,
            botName: null,
            user: { id: 'user-1', username: 'alice' },
            hand: [{ number: 1, penalty: 1 }],
            totalPenalty: 10,
            penaltyCard: [],
            selectedCard: { number: 5, penalty: 1 },
            roundPenalty: 3,
            roundPenaltyCard: [],
            isSelectedCardConfirmed: true,
            isWinner: false,
          },
          {
            id: 'bot-1',
            userId: null,
            isBot: true,
            botName: 'Bot Bob',
            user: null,
            hand: [],
            totalPenalty: 0,
            penaltyCard: [],
            selectedCard: null,
            roundPenalty: 0,
            roundPenaltyCard: [],
            isSelectedCardConfirmed: false,
            isWinner: false,
          },
        ],
      });

      const internals = getInternals(service);
      internals.currentProcessingPlayer.set(GAME_ID, { playerId: PLAYER_ID, card: { number: 5, penalty: 1 } });
      internals.currentAction.set(GAME_ID, { playerId: PLAYER_ID, actionType: 'choose_row' });

      const result = await service.getGameState(GAME_ID);

      expect(result).toEqual({
        gameId: GAME_ID,
        roomId: ROOM_ID,
        currentRound: 2,
        currentTurn: 3,
        rows: [[{ number: 10, penalty: 1 }], [], [], []],
        players: [
          {
            id: PLAYER_ID,
            userId: 'user-1',
            username: 'alice',
            hand: [{ number: 1, penalty: 1 }],
            totalPenalty: 10,
            isBot: false,
            penaltyCard: [],
            selectedCard: { number: 5, penalty: 1 },
            roundPenalty: 3,
            roundPenaltyCard: [],
            isSelectedCardConfirmed: true,
            isWinner: false,
          },
          {
            id: 'bot-1',
            userId: null,
            username: 'Bot Bob',
            hand: [],
            totalPenalty: 0,
            isBot: true,
            penaltyCard: [],
            selectedCard: null,
            roundPenalty: 0,
            roundPenaltyCard: [],
            isSelectedCardConfirmed: false,
            isWinner: false,
          },
        ],
        status: 'IN_PROGRESS',
        revealedCards: [{ playerId: PLAYER_ID, card: { number: 5, penalty: 1 } }],
        allPlayersReady: false,
        waitingForRowChoice: true,
        currentChoosingPlayer: PLAYER_ID,
        currentAction: { playerId: PLAYER_ID, actionType: 'choose_row' },
      });
    });

    it('falls back to default usernames when data is missing', async () => {
      prisma.game.findUnique.mockResolvedValue({
        id: GAME_ID,
        roomId: ROOM_ID,
        currentRound: 1,
        currentTurn: 1,
        rows: [],
        status: 'WAITING',
        currentTurnCards: [],
        players: [
          {
            id: 'p1',
            userId: 'u1',
            isBot: false,
            botName: null,
            user: null,
            hand: [],
            totalPenalty: 0,
            penaltyCard: [],
            selectedCard: null,
            roundPenalty: 0,
            roundPenaltyCard: [],
            isSelectedCardConfirmed: false,
            isWinner: false,
          },
          {
            id: 'p2',
            userId: null,
            isBot: true,
            botName: null,
            user: null,
            hand: [],
            totalPenalty: 0,
            penaltyCard: [],
            selectedCard: null,
            roundPenalty: 0,
            roundPenaltyCard: [],
            isSelectedCardConfirmed: false,
            isWinner: false,
          },
        ],
      });

      const result = await service.getGameState(GAME_ID);

      expect(result.players[0].username).toBe('Unknown');
      expect(result.players[1].username).toBe('Bot');
    });
  });

  describe('autoSelectCardsForBots', () => {
    it('does nothing when the game no longer exists', async () => {
      prisma.game.findUnique.mockResolvedValue(null);

      await service.autoSelectCardsForBots(GAME_ID);

      expect(prisma.player.findMany).not.toHaveBeenCalled();
    });

    it('skips bots whose hand is already empty', async () => {
      prisma.game.findUnique.mockResolvedValue({ rows: [] });
      prisma.player.findMany.mockResolvedValue([{ id: 'bot-1', hand: [], totalPenalty: 0 }]);
      const selectCardSpy = jest.spyOn(service, 'selectCard');

      await service.autoSelectCardsForBots(GAME_ID);

      expect(botService.decideCardChoice).not.toHaveBeenCalled();
      expect(selectCardSpy).not.toHaveBeenCalled();
    });

    it('selects and confirms a card for every bot with cards left', async () => {
      prisma.game.findUnique.mockResolvedValue({ rows: [[{ number: 20, penalty: 1 }], [], [], []] });
      prisma.player.findMany.mockResolvedValue([{ id: 'bot-1', hand: [{ number: 5, penalty: 1 }], totalPenalty: 12 }]);
      botService.decideCardChoice.mockReturnValue({ number: 5, penalty: 1 });
      const selectCardSpy = jest.spyOn(service, 'selectCard').mockResolvedValue(undefined);
      const confirmSpy = jest
        .spyOn(service, 'confirmCardChoice')
        .mockResolvedValue({ allReady: false, gameId: GAME_ID });

      await service.autoSelectCardsForBots(GAME_ID);

      expect(botService.decideCardChoice).toHaveBeenCalledWith(
        [{ number: 5, penalty: 1 }],
        [[{ number: 20, penalty: 1 }], [], [], []],
        12,
        BotDifficulty.HARD
      );
      expect(selectCardSpy).toHaveBeenCalledWith('bot-1', { number: 5, penalty: 1 });
      expect(confirmSpy).toHaveBeenCalledWith('bot-1');
    });
  });

  describe('checkGameEnd', () => {
    it('throws 404 when the game does not exist', async () => {
      prisma.game.findUnique.mockResolvedValue(null);

      await expect(service.checkGameEnd(GAME_ID)).rejects.toThrow(NotFoundException);
    });

    it('finishes the game once a player reaches the penalty threshold', async () => {
      prisma.game.findUnique.mockResolvedValue({
        currentRound: 1,
        players: [
          { id: PLAYER_ID, totalPenalty: 66 },
          { id: 'p2', totalPenalty: 10 },
        ],
      });
      const finishGameSpy = jest.spyOn(service, 'finishGame').mockResolvedValue(undefined);

      const result = await service.checkGameEnd(GAME_ID);

      expect(finishGameSpy).toHaveBeenCalledWith(GAME_ID);
      expect(result).toBe(true);
      expect(prisma.game.update).not.toHaveBeenCalled();
    });

    it('deals a fresh round and advances currentRound when nobody has lost yet', async () => {
      prisma.game.findUnique.mockResolvedValue({
        currentRound: 1,
        players: [
          { id: PLAYER_ID, totalPenalty: 10 },
          { id: 'p2', totalPenalty: 20 },
        ],
      });
      prisma.player.update.mockResolvedValue({});
      prisma.game.update.mockResolvedValue({});

      const result = await service.checkGameEnd(GAME_ID);

      expect(result).toBe(false);
      expect(prisma.player.update).toHaveBeenCalledTimes(2);
      expect(prisma.player.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: PLAYER_ID },
          data: expect.objectContaining({ roundPenalty: 0, roundPenaltyCard: [] }),
        })
      );

      const [firstCallArgs] = prisma.player.update.mock.calls[0] as [{ data: { hand: unknown[] } }];
      expect(firstCallArgs.data.hand).toHaveLength(10);

      expect(prisma.game.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: GAME_ID },
          data: expect.objectContaining({ currentRound: 2, currentTurn: 1 }),
        })
      );
    });
  });

  describe('getRoundFinishedData', () => {
    it('throws 404 when the game does not exist', async () => {
      prisma.game.findUnique.mockResolvedValue(null);

      await expect(service.getRoundFinishedData(GAME_ID)).rejects.toThrow(NotFoundException);
    });

    it('sorts players by total penalty and resolves bot/human usernames', async () => {
      prisma.game.findUnique.mockResolvedValue({
        currentRound: 4,
        players: [
          {
            id: 'p1',
            isBot: false,
            botName: null,
            user: { username: 'alice' },
            roundPenalty: 5,
            roundPenaltyCard: [],
            totalPenalty: 40,
          },
          {
            id: 'p2',
            isBot: true,
            botName: 'Bot Bob',
            user: null,
            roundPenalty: 0,
            roundPenaltyCard: [],
            totalPenalty: 10,
          },
        ],
      });
      const fakeGameState = { gameId: GAME_ID } as unknown as Awaited<ReturnType<GameService['getGameState']>>;
      jest.spyOn(service, 'getGameState').mockResolvedValue(fakeGameState);

      const result = await service.getRoundFinishedData(GAME_ID);

      expect(result).toEqual({
        gameState: fakeGameState,
        roundNumber: 4,
        playerRoundScores: [
          { playerId: 'p2', username: 'Bot Bob', roundPenalty: 0, roundPenaltyCards: [], totalPenalty: 10 },
          { playerId: 'p1', username: 'alice', roundPenalty: 5, roundPenaltyCards: [], totalPenalty: 40 },
        ],
      });
    });

    it('falls back to "Bot"/"Unknown" when a bot has no name or a human has no linked user', async () => {
      prisma.game.findUnique.mockResolvedValue({
        currentRound: 1,
        players: [
          {
            id: 'p1',
            isBot: true,
            botName: null,
            user: null,
            roundPenalty: 0,
            roundPenaltyCard: [],
            totalPenalty: 10,
          },
          {
            id: 'p2',
            isBot: false,
            botName: null,
            user: null,
            roundPenalty: 5,
            roundPenaltyCard: [],
            totalPenalty: 20,
          },
        ],
      });
      const fakeGameState = { gameId: GAME_ID } as unknown as Awaited<ReturnType<GameService['getGameState']>>;
      jest.spyOn(service, 'getGameState').mockResolvedValue(fakeGameState);

      const result = await service.getRoundFinishedData(GAME_ID);

      expect(result.playerRoundScores.map((p) => p.username)).toEqual(['Bot', 'Unknown']);
    });
  });

  describe('finishGame', () => {
    it('throws 404 when the game does not exist', async () => {
      prisma.game.findUnique.mockResolvedValue(null);

      await expect(service.finishGame(GAME_ID)).rejects.toThrow(NotFoundException);
    });

    it('records room stats and marks the lowest-penalty player as the winner', async () => {
      prisma.game.findUnique.mockResolvedValue({
        roomId: ROOM_ID,
        players: [
          { id: 'p1', isBot: true, userId: null, totalPenalty: 80, isWinner: false },
          { id: 'p2', isBot: true, userId: null, totalPenalty: 20, isWinner: false },
        ],
      });
      prisma.roomStats.upsert.mockResolvedValue({});
      prisma.player.update.mockResolvedValue({});
      prisma.game.update.mockResolvedValue({});
      prisma.room.update.mockResolvedValue({});

      await service.finishGame(GAME_ID);

      expect(prisma.roomStats.upsert).toHaveBeenCalledWith({
        where: { roomId: ROOM_ID },
        create: { roomId: ROOM_ID, totalGames: 1, completedGames: 1 },
        update: { totalGames: { increment: 1 }, completedGames: { increment: 1 } },
      });
      expect(prisma.player.update).toHaveBeenCalledWith({
        where: { id: 'p2' },
        data: { isWinner: true, finalPosition: 1, isReady: false },
      });
      expect(prisma.player.update).toHaveBeenCalledWith({
        where: { id: 'p1' },
        data: { isWinner: false, finalPosition: 2, isReady: false },
      });
      expect(prisma.game.update).toHaveBeenCalledWith({
        where: { id: GAME_ID },
        data: { status: 'FINISHED', finishedAt: expect.any(Date) },
      });
      expect(prisma.room.update).toHaveBeenCalledWith({ where: { id: ROOM_ID }, data: { status: 'WAITING' } });
    });

    it('skips statistics updates for bots and for human players without a userId', async () => {
      prisma.game.findUnique.mockResolvedValue({
        roomId: ROOM_ID,
        players: [
          { id: 'p1', isBot: true, userId: null, totalPenalty: 10, isWinner: false },
          { id: 'p2', isBot: false, userId: null, totalPenalty: 20, isWinner: false },
        ],
      });
      prisma.roomStats.upsert.mockResolvedValue({});
      prisma.player.update.mockResolvedValue({});
      prisma.game.update.mockResolvedValue({});
      prisma.room.update.mockResolvedValue({});

      await service.finishGame(GAME_ID);

      expect(statisticsService.updateStatsAfterGame).not.toHaveBeenCalled();
      expect(prisma.playerRoomStats.upsert).not.toHaveBeenCalled();
    });

    it('creates fresh per-room stats for a human player with no prior record', async () => {
      prisma.game.findUnique.mockResolvedValue({
        roomId: ROOM_ID,
        players: [{ id: PLAYER_ID, isBot: false, userId: 'user-1', totalPenalty: 15, isWinner: false }],
      });
      prisma.roomStats.upsert.mockResolvedValue({});
      prisma.player.update.mockResolvedValue({});
      prisma.playerRoomStats.findUnique.mockResolvedValue(null);
      prisma.playerRoomStats.upsert.mockResolvedValue({});
      prisma.game.update.mockResolvedValue({});
      prisma.room.update.mockResolvedValue({});

      await service.finishGame(GAME_ID);

      expect(statisticsService.updateStatsAfterGame).toHaveBeenCalledWith('user-1', { isWinner: true, penalty: 15 });
      expect(prisma.playerRoomStats.upsert).toHaveBeenCalledWith({
        where: { userId_roomId: { userId: 'user-1', roomId: ROOM_ID } },
        create: expect.objectContaining({
          userId: 'user-1',
          roomId: ROOM_ID,
          gamesPlayed: 1,
          totalPenalty: 15,
          bestScore: 15,
        }),
        update: expect.objectContaining({
          gamesPlayed: { increment: 1 },
          totalPenalty: { increment: 15 },
          bestScore: { set: 15 },
          lastPlayedAt: expect.any(Date),
        }),
      });
    });

    it('keeps the lower of the previous and current score as bestScore', async () => {
      prisma.game.findUnique.mockResolvedValue({
        roomId: ROOM_ID,
        players: [{ id: PLAYER_ID, isBot: false, userId: 'user-1', totalPenalty: 15, isWinner: false }],
      });
      prisma.roomStats.upsert.mockResolvedValue({});
      prisma.player.update.mockResolvedValue({});
      prisma.playerRoomStats.findUnique.mockResolvedValue({ bestScore: 8 });
      prisma.playerRoomStats.upsert.mockResolvedValue({});
      prisma.game.update.mockResolvedValue({});
      prisma.room.update.mockResolvedValue({});

      await service.finishGame(GAME_ID);

      expect(prisma.playerRoomStats.upsert).toHaveBeenCalledWith(
        expect.objectContaining({ update: expect.objectContaining({ bestScore: { set: 8 } }) })
      );
    });

    it('increments gamesWon for the player who actually won this game', async () => {
      prisma.game.findUnique.mockResolvedValue({
        roomId: ROOM_ID,
        players: [{ id: PLAYER_ID, isBot: false, userId: 'user-1', totalPenalty: 15, isWinner: false }],
      });
      prisma.roomStats.upsert.mockResolvedValue({});
      prisma.player.update.mockResolvedValue({});
      prisma.playerRoomStats.findUnique.mockResolvedValue(null);
      prisma.playerRoomStats.upsert.mockResolvedValue({});
      prisma.game.update.mockResolvedValue({});
      prisma.room.update.mockResolvedValue({});

      await service.finishGame(GAME_ID);

      expect(prisma.playerRoomStats.upsert).toHaveBeenCalledWith(
        expect.objectContaining({ create: expect.objectContaining({ gamesWon: 1 }) })
      );
    });

    it('does not credit gamesWon for a human player who lost this game', async () => {
      prisma.game.findUnique.mockResolvedValue({
        roomId: ROOM_ID,
        players: [
          { id: 'winner', isBot: false, userId: 'winner-user', totalPenalty: 5, isWinner: false },
          { id: 'loser', isBot: false, userId: 'loser-user', totalPenalty: 40, isWinner: false },
        ],
      });
      prisma.roomStats.upsert.mockResolvedValue({});
      prisma.player.update.mockResolvedValue({});
      prisma.playerRoomStats.findUnique.mockResolvedValue(null);
      prisma.playerRoomStats.upsert.mockResolvedValue({});
      prisma.game.update.mockResolvedValue({});
      prisma.room.update.mockResolvedValue({});

      await service.finishGame(GAME_ID);

      expect(prisma.playerRoomStats.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId_roomId: { userId: 'loser-user', roomId: ROOM_ID } },
          create: expect.objectContaining({ gamesWon: 0 }),
          update: expect.objectContaining({ gamesWon: undefined }),
        })
      );
    });
  });

  describe('startGame', () => {
    it('throws 404 when the room does not exist', async () => {
      prisma.room.findUnique.mockResolvedValue(null);

      await expect(service.startGame(ROOM_ID)).rejects.toThrow(NotFoundException);
    });

    it('throws 400 when the room already started', async () => {
      prisma.room.findUnique.mockResolvedValue({ status: 'IN_PROGRESS', players: [], withBots: false, maxPlayers: 4 });

      await expect(service.startGame(ROOM_ID)).rejects.toThrow(BadRequestException);
    });

    it('throws 400 when there are not enough human players and bots are disabled', async () => {
      prisma.room.findUnique.mockResolvedValue({
        status: 'WAITING',
        players: [{ id: PLAYER_ID }],
        withBots: false,
        maxPlayers: 4,
      });

      await expect(service.startGame(ROOM_ID)).rejects.toThrow(BadRequestException);
    });

    it('fills the room with bots when it is under capacity and bots are enabled', async () => {
      prisma.room.findUnique
        .mockResolvedValueOnce({ status: 'WAITING', players: [{ id: PLAYER_ID }], withBots: true, maxPlayers: 4 })
        .mockResolvedValueOnce({ players: [{ id: PLAYER_ID }, { id: 'bot-1' }] });
      prisma.game.create.mockResolvedValue({ id: GAME_ID });
      prisma.player.update.mockResolvedValue({});
      prisma.room.update.mockResolvedValue({});
      jest.spyOn(service, 'autoSelectCardsForBots').mockResolvedValue(undefined);
      jest
        .spyOn(service, 'getGameState')
        .mockResolvedValue({} as unknown as Awaited<ReturnType<GameService['getGameState']>>);

      await service.startGame(ROOM_ID);

      expect(botService.fillRoomWithBots).toHaveBeenCalledWith(ROOM_ID);
    });

    it('does not fill bots when the room is already full', async () => {
      prisma.room.findUnique
        .mockResolvedValueOnce({
          status: 'WAITING',
          players: [{ id: 'p1' }, { id: 'p2' }],
          withBots: true,
          maxPlayers: 2,
        })
        .mockResolvedValueOnce({ players: [{ id: 'p1' }, { id: 'p2' }] });
      prisma.game.create.mockResolvedValue({ id: GAME_ID });
      prisma.player.update.mockResolvedValue({});
      prisma.room.update.mockResolvedValue({});
      jest.spyOn(service, 'autoSelectCardsForBots').mockResolvedValue(undefined);
      jest
        .spyOn(service, 'getGameState')
        .mockResolvedValue({} as unknown as Awaited<ReturnType<GameService['getGameState']>>);

      await service.startGame(ROOM_ID);

      expect(botService.fillRoomWithBots).not.toHaveBeenCalled();
    });

    it('creates the game, deals hands, and starts the room', async () => {
      prisma.room.findUnique
        .mockResolvedValueOnce({
          status: 'WAITING',
          players: [{ id: 'p1' }, { id: 'p2' }],
          withBots: false,
          maxPlayers: 2,
        })
        .mockResolvedValueOnce({ players: [{ id: 'p1' }, { id: 'p2' }] });
      prisma.game.create.mockResolvedValue({ id: GAME_ID });
      prisma.player.update.mockResolvedValue({});
      prisma.room.update.mockResolvedValue({});
      const autoSelectSpy = jest.spyOn(service, 'autoSelectCardsForBots').mockResolvedValue(undefined);
      const fakeGameState = { gameId: GAME_ID } as unknown as Awaited<ReturnType<GameService['getGameState']>>;
      const getGameStateSpy = jest.spyOn(service, 'getGameState').mockResolvedValue(fakeGameState);

      const result = await service.startGame(ROOM_ID);

      expect(prisma.game.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ roomId: ROOM_ID, currentRound: 1, currentTurn: 1, status: 'IN_PROGRESS' }),
        })
      );
      const [createArgs] = prisma.game.create.mock.calls[0] as [{ data: { rows: unknown[][] } }];
      expect(createArgs.data.rows).toHaveLength(4);
      createArgs.data.rows.forEach((row) => expect(row).toHaveLength(1));

      expect(prisma.player.update).toHaveBeenCalledTimes(2);
      const [firstPlayerUpdate] = prisma.player.update.mock.calls[0] as [
        {
          where: { id: string };
          data: { gameId: string; hand: unknown[]; penaltyCard: unknown[]; totalPenalty: number };
        },
      ];
      expect(firstPlayerUpdate.where).toEqual({ id: 'p1' });
      expect(firstPlayerUpdate.data).toEqual(
        expect.objectContaining({ gameId: GAME_ID, penaltyCard: [], totalPenalty: 0 })
      );
      expect(firstPlayerUpdate.data.hand).toHaveLength(10);

      expect(prisma.room.update).toHaveBeenCalledWith({ where: { id: ROOM_ID }, data: { status: 'IN_PROGRESS' } });
      expect(autoSelectSpy).toHaveBeenCalledWith(GAME_ID);
      expect(getGameStateSpy).toHaveBeenCalledWith(GAME_ID);
      expect(result).toBe(fakeGameState);
    });
  });

  describe('startTurnProcessing', () => {
    it('returns the current state without re-sorting when a turn is already in progress', async () => {
      const internals = getInternals(service);
      internals.pendingPlayers.set(GAME_ID, [{ playerId: PLAYER_ID, card: { number: 5, penalty: 1 } }]);
      internals.currentAction.set(GAME_ID, { playerId: PLAYER_ID, actionType: 'place', rowIndex: 0 });

      const fakeGameState = { gameId: GAME_ID } as unknown as Awaited<ReturnType<GameService['getGameState']>>;
      jest.spyOn(service, 'getGameState').mockResolvedValue(fakeGameState);
      const processNextPlayerSpy = jest.spyOn(service, 'processNextPlayer');

      const result = await service.startTurnProcessing(GAME_ID);

      expect(processNextPlayerSpy).not.toHaveBeenCalled();
      expect(prisma.game.findUnique).not.toHaveBeenCalled();
      expect(result).toEqual({ ...fakeGameState, action: { playerId: PLAYER_ID, actionType: 'place', rowIndex: 0 } });
    });

    it('falls back to a default action when the queue is in progress but no action was recorded yet', async () => {
      getInternals(service).pendingPlayers.set(GAME_ID, [{ playerId: PLAYER_ID, card: { number: 5, penalty: 1 } }]);

      const fakeGameState = { gameId: GAME_ID } as unknown as Awaited<ReturnType<GameService['getGameState']>>;
      jest.spyOn(service, 'getGameState').mockResolvedValue(fakeGameState);

      const result = await service.startTurnProcessing(GAME_ID);

      expect(result).toEqual({ ...fakeGameState, action: { playerId: '', actionType: 'place' } });
    });

    it('throws 404 when the game does not exist and no turn is in progress', async () => {
      prisma.game.findUnique.mockResolvedValue(null);

      await expect(service.startTurnProcessing(GAME_ID)).rejects.toThrow(NotFoundException);
    });

    it('sorts the revealed cards by number, seeds the pending queue, and hands off to processNextPlayer', async () => {
      prisma.game.findUnique.mockResolvedValue({
        currentTurnCards: [
          { playerId: 'p2', card: { number: 40, penalty: 1 } },
          { playerId: PLAYER_ID, card: { number: 5, penalty: 1 } },
          { playerId: 'p3', card: { number: 20, penalty: 1 } },
        ],
      });

      const processNextPlayerSpy = jest
        .spyOn(service, 'processNextPlayer')
        .mockResolvedValue({} as unknown as Awaited<ReturnType<GameService['processNextPlayer']>>);
      const onStep = jest.fn();

      await service.startTurnProcessing(GAME_ID, onStep);

      expect(getInternals(service).pendingPlayers.get(GAME_ID)).toEqual([
        { playerId: PLAYER_ID, card: { number: 5, penalty: 1 } },
        { playerId: 'p3', card: { number: 20, penalty: 1 } },
        { playerId: 'p2', card: { number: 40, penalty: 1 } },
      ]);
      expect(processNextPlayerSpy).toHaveBeenCalledWith(GAME_ID, onStep);
    });
  });
});
