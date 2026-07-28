import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RandomBotStrategy } from './strategies/random-bot.strategy';
import { BalancedBotStrategy } from './strategies/balanced-bot.strategy';
import { LookaheadBotStrategy } from './strategies/lookahead-bot.strategy';
import { BotStrategyFactory } from './bot-strategy.factory';

@Module({
  imports: [PrismaModule],
  providers: [BotService, BotStrategyFactory, RandomBotStrategy, BalancedBotStrategy, LookaheadBotStrategy],
  exports: [BotService],
})
export class BotModule {}
