import { BotStrategyFactory } from './bot-strategy.factory';
import { RandomBotStrategy } from './strategies/random-bot.strategy';
import { BalancedBotStrategy } from './strategies/balanced-bot.strategy';
import { LookaheadBotStrategy } from './strategies/lookahead-bot.strategy';
import { BotDifficulty } from './types/enum/bot-difficulty.enum';

describe('BotStrategyFactory', () => {
  let factory: BotStrategyFactory;
  let randomStrategy: RandomBotStrategy;
  let balancedStrategy: BalancedBotStrategy;
  let lookaheadStrategy: LookaheadBotStrategy;

  beforeEach(() => {
    randomStrategy = {} as RandomBotStrategy;
    balancedStrategy = {} as BalancedBotStrategy;
    lookaheadStrategy = {} as LookaheadBotStrategy;

    factory = new BotStrategyFactory(randomStrategy, balancedStrategy, lookaheadStrategy);
  });

  it('returns the random strategy for EASY', () => {
    expect(factory.getStrategy(BotDifficulty.EASY)).toBe(randomStrategy);
  });

  it('returns the lookahead strategy for HARD', () => {
    expect(factory.getStrategy(BotDifficulty.HARD)).toBe(lookaheadStrategy);
  });

  it('returns the balanced strategy for MEDIUM', () => {
    expect(factory.getStrategy(BotDifficulty.MEDIUM)).toBe(balancedStrategy);
  });

  it('falls back to the balanced strategy for an unrecognized/null difficulty', () => {
    expect(factory.getStrategy(null)).toBe(balancedStrategy);
  });
});
