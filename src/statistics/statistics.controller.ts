import {
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { LeaderboardSortBy, StatisticsService } from './statistics.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('statistics')
@UseInterceptors(ClassSerializerInterceptor)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('me')
  async getMyStats(@CurrentUser('userId') userId: string) {
    return this.statisticsService.getUserStats(userId);
  }

  @Get('user/:userId')
  async getUserStats(@Param('userId') userId: string) {
    return this.statisticsService.getUserStats(userId);
  }

  @Get('leaderboard')
  async getLeaderboard(
    @Query('sortBy', new DefaultValuePipe(LeaderboardSortBy.GAMES_WON))
    sortBy: LeaderboardSortBy,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number
  ) {
    return this.statisticsService.getLeaderboard(sortBy, limit, offset);
  }

  /**
   * Get your rank
   * */
  @Get('rank')
  async getMyRank(
    @CurrentUser() user: { userId: string },
    @Query('sortBy', new DefaultValuePipe(LeaderboardSortBy.GAMES_WON))
    sortBy: LeaderboardSortBy
  ) {
    return this.statisticsService.getUserRank(user.userId, sortBy);
  }

  @Get('global')
  async getGlobalStats() {
    return this.statisticsService.getGlobalStats();
  }

  // Only for tests
  @Delete('me/reset')
  async resetMyStats(@CurrentUser() user: { userId: string }) {
    await this.statisticsService.resetUserStats(user.userId);
    return { message: 'Statistics reset successfully' };
  }
}
