import { NotFoundException } from '@nestjs/common';
import { StatisticsService, LeaderboardSortBy } from './statistics.service';
import { PrismaService } from '../prisma/prisma.service';

type PrismaMock = {
  userStats: { findUnique: jest.Mock; create: jest.Mock; update: jest.Mock; findMany: jest.Mock; aggregate: jest.Mock };
  user: { count: jest.Mock };
  game: { count: jest.Mock };
};

const USER_ID = 'USER_ID';

interface UserStatsFixture {
  id: string;
  userId: string;
  gamesPlayed: number;
  gamesWon: number;
  totalPenalty: number;
  bestScore: number | null;
  updatedAt: Date;
}

const buildUserStats = (overrides: Partial<UserStatsFixture> = {}): UserStatsFixture => ({
  id: 'stats-1',
  userId: USER_ID,
  gamesPlayed: 10,
  gamesWon: 4,
  totalPenalty: 100,
  bestScore: 20,
  updatedAt: new Date('2024-01-01T00:00:00Z'),
  ...overrides,
});

describe('StatisticsService', () => {
  let service: StatisticsService;
  let prisma: PrismaMock;

  beforeEach(() => {
    prisma = {
      userStats: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
        aggregate: jest.fn(),
      },
      user: { count: jest.fn() },
      game: { count: jest.fn() },
    };

    service = new StatisticsService(prisma as unknown as PrismaService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getUserStats', () => {
    it('returns the mapped stats when a row already exists', async () => {
      prisma.userStats.findUnique.mockResolvedValue(
        buildUserStats({ gamesPlayed: 10, gamesWon: 5, totalPenalty: 100 })
      );

      const result = await service.getUserStats(USER_ID);

      expect(prisma.userStats.create).not.toHaveBeenCalled();
      expect(result).toEqual(
        expect.objectContaining({ gamesPlayed: 10, gamesWon: 5, winRate: 50, averagePenalty: 10 })
      );
    });

    it('creates a zeroed stats row on first access', async () => {
      prisma.userStats.findUnique.mockResolvedValue(null);
      prisma.userStats.create.mockResolvedValue(
        buildUserStats({ gamesPlayed: 0, gamesWon: 0, totalPenalty: 0, bestScore: null })
      );

      const result = await service.getUserStats(USER_ID);

      expect(prisma.userStats.create).toHaveBeenCalledWith({ data: { userId: USER_ID } });
      expect(result).toEqual(expect.objectContaining({ gamesPlayed: 0, winRate: 0, averagePenalty: 0 }));
    });
  });

  describe('updateStatsAfterGame', () => {
    it('increments games/penalty and sets bestScore on a first-time score', async () => {
      prisma.userStats.findUnique.mockResolvedValue(buildUserStats({ bestScore: null }));
      prisma.userStats.update.mockResolvedValue({});

      await service.updateStatsAfterGame(USER_ID, { isWinner: true, penalty: 15 });

      expect(prisma.userStats.update).toHaveBeenCalledWith({
        where: { userId: USER_ID },
        data: {
          gamesPlayed: { increment: 1 },
          gamesWon: { increment: 1 },
          totalPenalty: { increment: 15 },
          bestScore: 15,
        },
      });
    });

    it('keeps the lower bestScore when the new penalty is worse', async () => {
      prisma.userStats.findUnique.mockResolvedValue(buildUserStats({ bestScore: 10 }));
      prisma.userStats.update.mockResolvedValue({});

      await service.updateStatsAfterGame(USER_ID, { isWinner: false, penalty: 30 });

      expect(prisma.userStats.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ bestScore: 10, gamesWon: undefined }) })
      );
    });

    it('lowers bestScore when the new penalty is better', async () => {
      prisma.userStats.findUnique.mockResolvedValue(buildUserStats({ bestScore: 10 }));
      prisma.userStats.update.mockResolvedValue({});

      await service.updateStatsAfterGame(USER_ID, { isWinner: false, penalty: 5 });

      expect(prisma.userStats.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ bestScore: 5 }) })
      );
    });

    it('creates a fresh row when no stats exist yet', async () => {
      prisma.userStats.findUnique.mockResolvedValue(null);
      prisma.userStats.create.mockResolvedValue({});

      await service.updateStatsAfterGame(USER_ID, { isWinner: true, penalty: 8 });

      expect(prisma.userStats.create).toHaveBeenCalledWith({
        data: { userId: USER_ID, gamesPlayed: 1, gamesWon: 1, totalPenalty: 8, bestScore: 8 },
      });
    });

    it('creates a fresh row with gamesWon 0 when the player did not win', async () => {
      prisma.userStats.findUnique.mockResolvedValue(null);
      prisma.userStats.create.mockResolvedValue({});

      await service.updateStatsAfterGame(USER_ID, { isWinner: false, penalty: 8 });

      expect(prisma.userStats.create).toHaveBeenCalledWith({
        data: { userId: USER_ID, gamesPlayed: 1, gamesWon: 0, totalPenalty: 8, bestScore: 8 },
      });
    });
  });

  describe('getLeaderboard', () => {
    it('computes win rate and maps entries', async () => {
      prisma.userStats.findMany.mockResolvedValue([
        { userId: 'u1', user: { username: 'alice' }, gamesPlayed: 10, gamesWon: 5, bestScore: 20, totalPenalty: 100 },
      ]);

      const result = await service.getLeaderboard();

      expect(prisma.userStats.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { gamesPlayed: { gt: 1 } } })
      );
      expect(result.entries).toEqual([
        {
          userId: 'u1',
          username: 'alice',
          gamesPlayed: 10,
          gamesWon: 5,
          winRate: 50,
          bestScore: 20,
          totalPenalty: 100,
        },
      ]);
      expect(result.total).toBe(1);
    });

    it('reports a 0% win rate instead of dividing by zero when gamesPlayed is 0', async () => {
      prisma.userStats.findMany.mockResolvedValue([
        { userId: 'u1', user: { username: 'alice' }, gamesPlayed: 0, gamesWon: 0, bestScore: null, totalPenalty: 0 },
      ]);

      const result = await service.getLeaderboard();

      expect(result.entries[0].winRate).toBe(0);
    });

    it('sorts by gamesWon descending by default', async () => {
      prisma.userStats.findMany.mockResolvedValue([
        { userId: 'low', user: { username: 'low' }, gamesPlayed: 10, gamesWon: 1, bestScore: 20, totalPenalty: 100 },
        { userId: 'high', user: { username: 'high' }, gamesPlayed: 10, gamesWon: 9, bestScore: 20, totalPenalty: 100 },
      ]);

      const result = await service.getLeaderboard(LeaderboardSortBy.GAMES_WON);

      expect(result.entries.map((e) => e.userId)).toEqual(['high', 'low']);
    });

    it('sorts by winRate descending', async () => {
      prisma.userStats.findMany.mockResolvedValue([
        { userId: 'a', user: { username: 'a' }, gamesPlayed: 10, gamesWon: 2, bestScore: 20, totalPenalty: 100 },
        { userId: 'b', user: { username: 'b' }, gamesPlayed: 10, gamesWon: 8, bestScore: 20, totalPenalty: 100 },
      ]);

      const result = await service.getLeaderboard(LeaderboardSortBy.WIN_RATE);

      expect(result.entries.map((e) => e.userId)).toEqual(['b', 'a']);
    });

    it('sorts by gamesPlayed descending', async () => {
      prisma.userStats.findMany.mockResolvedValue([
        { userId: 'a', user: { username: 'a' }, gamesPlayed: 5, gamesWon: 1, bestScore: 20, totalPenalty: 50 },
        { userId: 'b', user: { username: 'b' }, gamesPlayed: 20, gamesWon: 1, bestScore: 20, totalPenalty: 50 },
      ]);

      const result = await service.getLeaderboard(LeaderboardSortBy.GAMES_PLAYED);

      expect(result.entries.map((e) => e.userId)).toEqual(['b', 'a']);
    });

    it('sorts by bestScore ascending, pushing entries without a score to the end', async () => {
      prisma.userStats.findMany.mockResolvedValue([
        {
          userId: 'no-score',
          user: { username: 'no-score' },
          gamesPlayed: 5,
          gamesWon: 1,
          bestScore: null,
          totalPenalty: 50,
        },
        { userId: 'high', user: { username: 'high' }, gamesPlayed: 5, gamesWon: 1, bestScore: 30, totalPenalty: 50 },
        { userId: 'low', user: { username: 'low' }, gamesPlayed: 5, gamesWon: 1, bestScore: 10, totalPenalty: 50 },
      ]);

      const result = await service.getLeaderboard(LeaderboardSortBy.BEST_SCORE);

      expect(result.entries.map((e) => e.userId)).toEqual(['low', 'high', 'no-score']);
    });

    it('sorts a missing bestScore after a real one when compared directly', async () => {
      prisma.userStats.findMany.mockResolvedValue([
        {
          userId: 'no-score',
          user: { username: 'no-score' },
          gamesPlayed: 5,
          gamesWon: 1,
          bestScore: null,
          totalPenalty: 50,
        },
        { userId: 'real', user: { username: 'real' }, gamesPlayed: 5, gamesWon: 1, bestScore: 15, totalPenalty: 50 },
      ]);

      const result = await service.getLeaderboard(LeaderboardSortBy.BEST_SCORE);

      expect(result.entries.map((e) => e.userId)).toEqual(['real', 'no-score']);
    });

    it('treats a bestScore of 0 as an actual (best possible) score, not a missing one', async () => {
      prisma.userStats.findMany.mockResolvedValue([
        {
          userId: 'perfect',
          user: { username: 'perfect' },
          gamesPlayed: 5,
          gamesWon: 1,
          bestScore: 0,
          totalPenalty: 50,
        },
        { userId: 'ok', user: { username: 'ok' }, gamesPlayed: 5, gamesWon: 1, bestScore: 10, totalPenalty: 50 },
      ]);

      const result = await service.getLeaderboard(LeaderboardSortBy.BEST_SCORE);

      expect(result.entries.map((e) => e.userId)).toEqual(['perfect', 'ok']);
    });

    it('paginates with offset/limit after sorting', async () => {
      prisma.userStats.findMany.mockResolvedValue(
        Array.from({ length: 5 }, (_, i) => ({
          userId: `u${i}`,
          user: { username: `u${i}` },
          gamesPlayed: 10,
          gamesWon: i,
          bestScore: 20,
          totalPenalty: 100,
        }))
      );

      const result = await service.getLeaderboard(LeaderboardSortBy.GAMES_WON, 2, 1);

      expect(result.entries.map((e) => e.userId)).toEqual(['u3', 'u2']);
      expect(result.total).toBe(5);
    });
  });

  describe('getUserRank', () => {
    it('throws 404 when the user is not on the leaderboard', async () => {
      jest.spyOn(service, 'getLeaderboard').mockResolvedValue({ entries: [], total: 0 });

      await expect(service.getUserRank(USER_ID)).rejects.toThrow(NotFoundException);
    });

    it('returns the 1-based rank and total', async () => {
      const getLeaderboardSpy = jest.spyOn(service, 'getLeaderboard').mockResolvedValue({
        entries: [
          {
            userId: 'other',
            username: 'other',
            gamesPlayed: 10,
            gamesWon: 5,
            winRate: 50,
            bestScore: 20,
            totalPenalty: 100,
          },
          {
            userId: USER_ID,
            username: 'me',
            gamesPlayed: 10,
            gamesWon: 3,
            winRate: 30,
            bestScore: 25,
            totalPenalty: 120,
          },
        ],
        total: 42,
      });

      const result = await service.getUserRank(USER_ID);

      expect(getLeaderboardSpy).toHaveBeenCalledWith(LeaderboardSortBy.GAMES_WON, 1000);
      expect(result).toEqual({ rank: 2, total: 42 });
    });
  });

  describe('resetUserStats', () => {
    it('zeroes out the stats row', async () => {
      prisma.userStats.update.mockResolvedValue({});

      await service.resetUserStats(USER_ID);

      expect(prisma.userStats.update).toHaveBeenCalledWith({
        where: { userId: USER_ID },
        data: { gamesPlayed: 0, gamesWon: 0, totalPenalty: 0, bestScore: null },
      });
    });
  });

  describe('getGlobalStats', () => {
    it('falls back to 0 when aggregate sums are null', async () => {
      prisma.user.count.mockResolvedValue(100);
      prisma.game.count.mockResolvedValue(50);
      prisma.userStats.aggregate.mockResolvedValue({
        _sum: { gamesPlayed: null, gamesWon: null, totalPenalty: null },
        _avg: { totalPenalty: null },
      });

      const result = await service.getGlobalStats();

      expect(prisma.game.count).toHaveBeenCalledWith({ where: { status: 'FINISHED' } });
      expect(result).toEqual({
        totalUsers: 100,
        totalGames: 50,
        totalGamesPlayed: 0,
        totalWins: 0,
        averagePenaltyPerGame: 0,
      });
    });

    it('rounds the average penalty and passes through real sums', async () => {
      prisma.user.count.mockResolvedValue(10);
      prisma.game.count.mockResolvedValue(4);
      prisma.userStats.aggregate.mockResolvedValue({
        _sum: { gamesPlayed: 40, gamesWon: 15, totalPenalty: 800 },
        _avg: { totalPenalty: 33.6 },
      });

      const result = await service.getGlobalStats();

      expect(result).toEqual({
        totalUsers: 10,
        totalGames: 4,
        totalGamesPlayed: 40,
        totalWins: 15,
        averagePenaltyPerGame: 34,
      });
    });
  });
});
