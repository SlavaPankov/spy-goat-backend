import { LookaheadBotStrategy } from './lookahead-bot.strategy';
import { Card } from '../../game/interfaces/card.interface';

type LookaheadPrivates = {
  simulatePlacement: (card: Card, rows: Card[][], currentPenalty: number) => { cost: number; rowsAfter: Card[][] };
  estimateFutureCost: (remainingHand: Card[], rowsAfter: Card[][], currentPenalty: number) => number;
};

const getPrivates = (s: LookaheadBotStrategy) => s as unknown as LookaheadPrivates;

describe('LookaheadBotStrategy', () => {
  let strategy: LookaheadBotStrategy;

  beforeEach(() => {
    strategy = new LookaheadBotStrategy();
  });

  describe('simulatePlacement (private)', () => {
    it('appends the card to the row it fits, at the diff cost', () => {
      const rows: Card[][] = [[{ number: 10, penalty: 1 }], []];

      const { cost, rowsAfter } = getPrivates(strategy).simulatePlacement({ number: 15, penalty: 1 }, rows, 0);

      expect(cost).toBe(5);
      expect(rowsAfter).toEqual([
        [
          { number: 10, penalty: 1 },
          { number: 15, penalty: 1 },
        ],
        [],
      ]);
    });

    it('takes the full row at a forced cost and resets it to just the new card', () => {
      const fullRow = [10, 20, 30, 40, 50].map((n) => ({ number: n, penalty: 1 }));
      const rows: Card[][] = [fullRow, []];

      const { cost, rowsAfter } = getPrivates(strategy).simulatePlacement({ number: 60, penalty: 1 }, rows, 0);

      expect(cost).toBe(10000 + 5);
      expect(rowsAfter[0]).toEqual([{ number: 60, penalty: 1 }]);
    });

    it('forces onto the lowest-penalty row when the card fits nowhere', () => {
      const rows: Card[][] = [[{ number: 50, penalty: 5 }], [{ number: 60, penalty: 1 }]];

      const { cost, rowsAfter } = getPrivates(strategy).simulatePlacement({ number: 1, penalty: 1 }, rows, 0);

      expect(cost).toBe(10000 + 1);
      expect(rowsAfter[1]).toEqual([{ number: 1, penalty: 1 }]);
      expect(rowsAfter[0]).toEqual([{ number: 50, penalty: 5 }]);
    });

    it('triples the forced cost when the player is in the danger zone', () => {
      const fullRow = [10, 20, 30, 40, 50].map((n) => ({ number: n, penalty: 1 }));
      const rows: Card[][] = [fullRow];

      const { cost } = getPrivates(strategy).simulatePlacement({ number: 60, penalty: 1 }, rows, 60);

      expect(cost).toBe((10000 + 5) * 3);
    });
  });

  describe('estimateFutureCost (private)', () => {
    it('returns 0 when there is no remaining hand', () => {
      const cost = getPrivates(strategy).estimateFutureCost([], [[{ number: 10, penalty: 1 }]], 0);

      expect(cost).toBe(0);
    });

    it('averages the simulated cost of every remaining card', () => {
      const rows: Card[][] = [[{ number: 10, penalty: 1 }]];
      const remainingHand: Card[] = [
        { number: 15, penalty: 1 },
        { number: 20, penalty: 1 },
      ];

      const cost = getPrivates(strategy).estimateFutureCost(remainingHand, rows, 0);

      expect(cost).toBe(7.5);
    });
  });

  describe('decideCardChoice', () => {
    it('picks the only card available', () => {
      const rows: Card[][] = [[{ number: 10, penalty: 1 }], [], [], []];
      const hand: Card[] = [{ number: 15, penalty: 1 }];

      const result = strategy.decideCardChoice({ hand, rows, currentPenalty: 0 });

      expect(result).toEqual({ number: 15, penalty: 1 });
    });
  });

  describe('decideRowChoice', () => {
    it('breaks equal-penalty ties by preferring the row ending on the smaller card', () => {
      const rows: Card[][] = [[{ number: 90, penalty: 5 }], [{ number: 10, penalty: 5 }]];

      const result = strategy.decideRowChoice({ rows, currentPenalty: 0 });

      expect(result).toBe(1);
    });

    it('otherwise picks the row with the lowest total penalty', () => {
      const rows: Card[][] = [[{ number: 10, penalty: 10 }], [{ number: 90, penalty: 1 }]];

      const result = strategy.decideRowChoice({ rows, currentPenalty: 0 });

      expect(result).toBe(1);
    });

    it('treats an empty row as having no tie-break offset', () => {
      const rows: Card[][] = [[{ number: 10, penalty: 5 }], []];

      const result = strategy.decideRowChoice({ rows, currentPenalty: 0 });

      expect(result).toBe(1);
    });
  });
});
