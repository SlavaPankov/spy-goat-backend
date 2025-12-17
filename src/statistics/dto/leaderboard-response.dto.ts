export class LeaderboardEntryDto {
  userId: string;
  username: string;
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  bestScore: number | null;
  totalPenalty: number;
}

export class LeaderboardResponseDto {
  entries: LeaderboardEntryDto[];
  total: number;
}
