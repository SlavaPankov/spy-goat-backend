import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [StatisticsService],
  controllers: [StatisticsController],
  imports: [PrismaModule],
  exports: [StatisticsService],
})
export class StatisticsModule {}
