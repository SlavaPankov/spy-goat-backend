import { UserStats } from '@prisma/client';

export class UserStatsResponseDto {
  id: string;
  userId: string;
  gamesPlayed: number;
  gamesWon: number;
  totalPenalty: number;
  bestScore: number | null;
  winRate: number;
  averagePenalty: number;
  updatedAt: Date;

  static fromStats(stats: UserStats): UserStatsResponseDto {
    const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;

    const averagePenalty = stats.gamesPlayed > 0 ? Math.round(stats.totalPenalty / stats.gamesPlayed) : 0;

    return {
      id: stats.id,
      userId: stats.userId,
      gamesPlayed: stats.gamesPlayed,
      gamesWon: stats.gamesWon,
      totalPenalty: stats.totalPenalty,
      bestScore: stats.bestScore,
      winRate,
      averagePenalty,
      updatedAt: stats.updatedAt,
    };
  }
}
