import { Injectable } from '@nestjs/common';
import { RandomBotStrategy } from './strategies/random-bot.strategy';
import { BalancedBotStrategy } from './strategies/balanced-bot.strategy';
import { LookaheadBotStrategy } from './strategies/lookahead-bot.strategy';
import { BotStrategy } from './types/interfaces/bot-strategy.interface';
import { BotDifficulty } from './types/enum/bot-difficulty.enum';

@Injectable()
export class BotStrategyFactory {
  constructor(
    private readonly randomStrategy: RandomBotStrategy,
    private readonly balancedStrategy: BalancedBotStrategy,
    private readonly lookaheadStrategy: LookaheadBotStrategy
  ) {}

  getStrategy(difficulty: BotDifficulty | null): BotStrategy {
    switch (difficulty) {
      case BotDifficulty.EASY:
        return this.randomStrategy;
      case BotDifficulty.HARD:
        return this.lookaheadStrategy;
      case BotDifficulty.MEDIUM:
      default:
        return this.balancedStrategy;
    }
  }
}
