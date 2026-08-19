import { BalancedBotStrategy } from './balanced-bot.strategy';
import { Card } from '../../game/interfaces/card.interface';

describe('BalancedBotStrategy', () => {
  let strategy: BalancedBotStrategy;

  beforeEach(() => {
    strategy = new BalancedBotStrategy();
  });

  describe('decideCardChoice', () => {
    it('prefers the smallest safe placement over filling a row or an unmatched card', () => {
      const rows: Card[][] = [
        [{ number: 10, penalty: 1 }],
        [{ number: 50, penalty: 1 }],
        [10, 20, 30, 40, 90].map((n) => ({ number: n, penalty: 1 })),
        [],
      ];
      const hand: Card[] = [
        { number: 60, penalty: 1 },
        { number: 15, penalty: 1 },
        { number: 95, penalty: 1 },
        { number: 1, penalty: 1 },
      ];

      const result = strategy.decideCardChoice({ hand, rows, currentPenalty: 0 });

      expect(result).toEqual({ number: 15, penalty: 1 });
    });

    it('triples the forced-placement penalty when the player is in the danger zone', () => {
      const fullRow = [10, 20, 30, 40, 50].map((n) => ({ number: n, penalty: 1 }));
      const rows: Card[][] = [fullRow];
      const hand: Card[] = [{ number: 1, penalty: 1 }];

      const result = strategy.decideCardChoice({ hand, rows, currentPenalty: 51 });

      expect(result).toEqual({ number: 1, penalty: 1 });
    });
  });

  describe('decideRowChoice', () => {
    it('chooses the row with the lowest total penalty', () => {
      const rows: Card[][] = [
        [
          { number: 10, penalty: 5 },
          { number: 20, penalty: 5 },
        ],
        [{ number: 30, penalty: 1 }],
        [{ number: 40, penalty: 7 }],
      ];

      const result = strategy.decideRowChoice({ rows, currentPenalty: 0 });

      expect(result).toBe(1);
    });
  });
});
