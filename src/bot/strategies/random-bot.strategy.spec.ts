import { RandomBotStrategy } from './random-bot.strategy';
import { Card } from '../../game/interfaces/card.interface';

describe('RandomBotStrategy', () => {
  let strategy: RandomBotStrategy;

  beforeEach(() => {
    strategy = new RandomBotStrategy();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('decideCardChoice', () => {
    it('picks the first card when Math.random resolves to 0', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0);
      const hand: Card[] = [
        { number: 1, penalty: 1 },
        { number: 2, penalty: 1 },
        { number: 3, penalty: 1 },
      ];

      expect(strategy.decideCardChoice({ hand, rows: [], currentPenalty: 0 })).toEqual({ number: 1, penalty: 1 });
    });

    it('picks the last card when Math.random resolves just under 1', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.999);
      const hand: Card[] = [
        { number: 1, penalty: 1 },
        { number: 2, penalty: 1 },
        { number: 3, penalty: 1 },
      ];

      expect(strategy.decideCardChoice({ hand, rows: [], currentPenalty: 0 })).toEqual({ number: 3, penalty: 1 });
    });
  });

  describe('decideRowChoice', () => {
    it('picks a row index proportional to Math.random', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.5);
      const rows: Card[][] = [[], [], [], []];

      expect(strategy.decideRowChoice({ rows, currentPenalty: 0 })).toBe(2);
    });
  });
});
