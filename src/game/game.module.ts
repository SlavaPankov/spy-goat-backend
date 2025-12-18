import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { StatisticsModule } from '../statistics/statistics.module';

@Module({
  providers: [GameService, GameGateway],
  imports: [PrismaModule, StatisticsModule],
  exports: [GameService],
})
export class GameModule {}
