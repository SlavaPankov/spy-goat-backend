import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserStatsResponseDto } from './dto/user-stats-response.dto';
import { LeaderboardEntryDto, LeaderboardResponseDto } from './dto/leaderboard-response.dto';
import { EErrorMessages } from '../types/enums/errorMessage';

export enum LeaderboardSortBy {
  GAMES_WON = 'gamesWon',
  WIN_RATE = 'winRate',
  BEST_SCORE = 'bestScore',
  GAMES_PLAYED = 'gamesPlayed',
}

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserStats(userId: string): Promise<UserStatsResponseDto> {
    let stats = await this.prisma.userStats.findUnique({
      where: { userId },
    });

    stats ??= await this.prisma.userStats.create({
      data: {
        userId,
      },
    });

    return UserStatsResponseDto.fromStats(stats);
  }

  async updateStatsAfterGame(userId: string, data: { isWinner: boolean; penalty: number }): Promise<void> {
    const currentStats = await this.prisma.userStats.findUnique({
      where: { userId },
    });

    if (currentStats) {
      const newBestScore =
        currentStats.bestScore === null ? data.penalty : Math.min(currentStats.bestScore, data.penalty);

      await this.prisma.userStats.update({
        where: { userId },
        data: {
          gamesPlayed: { increment: 1 },
          gamesWon: data.isWinner ? { increment: 1 } : undefined,
          totalPenalty: { increment: data.penalty },
          bestScore: newBestScore,
        },
      });
    } else {
      await this.prisma.userStats.create({
        data: {
          userId,
          gamesPlayed: 1,
          gamesWon: data.isWinner ? 1 : 0,
          totalPenalty: data.penalty,
          bestScore: data.penalty,
        },
      });
    }
  }

  async getLeaderboard(
    sortBy: LeaderboardSortBy = LeaderboardSortBy.GAMES_WON,
    limit: number = 10,
    offset: number = 0
  ): Promise<LeaderboardResponseDto> {
    const usersWithStats = await this.prisma.userStats.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      where: {
        gamesPlayed: { gt: 1 },
      },
    });

    const entries: LeaderboardEntryDto[] = usersWithStats.map((stats) => ({
      userId: stats.userId,
      username: stats.user.username,
      gamesPlayed: stats.gamesPlayed,
      gamesWon: stats.gamesWon,
      winRate: stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0,
      bestScore: stats.bestScore,
      totalPenalty: stats.totalPenalty,
    }));

    switch (sortBy) {
      case LeaderboardSortBy.GAMES_WON:
        entries.sort((a, b) => b.gamesWon - a.gamesWon);
        break;
      case LeaderboardSortBy.WIN_RATE:
        entries.sort((a, b) => b.winRate - a.winRate);
        break;
      case LeaderboardSortBy.BEST_SCORE:
        entries.sort((a, b) => {
          if (a.bestScore === null) {
            return 1;
          }

          if (b.bestScore === null) {
            return -1;
          }

          return a.bestScore - b.bestScore;
        });
        break;
      case LeaderboardSortBy.GAMES_PLAYED:
        entries.sort((a, b) => b.gamesPlayed - a.gamesPlayed);
        break;
    }

    const total = entries.length;

    return {
      entries: entries.slice(offset, offset + limit),
      total,
    };
  }

  async getUserRank(
    userId: string,
    sortBy: LeaderboardSortBy = LeaderboardSortBy.GAMES_WON
  ): Promise<{ rank: number; total: number }> {
    const leaderboard = await this.getLeaderboard(sortBy, 1000);
    const rank = leaderboard.entries.findIndex((e) => e.userId === userId);

    if (rank === -1) {
      throw new NotFoundException(EErrorMessages.USER_NOT_FOUNT_IN_LEADERBOARD);
    }

    return {
      rank: rank + 1,
      total: leaderboard.total,
    };
  }

  // Only for TESTS
  async resetUserStats(userId: string): Promise<void> {
    await this.prisma.userStats.update({
      where: { userId },
      data: {
        gamesPlayed: 0,
        gamesWon: 0,
        totalPenalty: 0,
        bestScore: null,
      },
    });
  }

  async getGlobalStats() {
    const totalUsers = await this.prisma.user.count();
    const totalGames = await this.prisma.game.count({
      where: { status: 'FINISHED' },
    });

    const stats = await this.prisma.userStats.aggregate({
      _sum: {
        gamesPlayed: true,
        gamesWon: true,
        totalPenalty: true,
      },
      _avg: {
        totalPenalty: true,
      },
    });

    return {
      totalUsers,
      totalGames,
      totalGamesPlayed: stats._sum.gamesPlayed || 0,
      totalWins: stats._sum.gamesWon || 0,
      averagePenaltyPerGame: Math.round(stats._avg.totalPenalty || 0),
    };
  }
}
