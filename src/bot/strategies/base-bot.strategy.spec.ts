import { BaseBotStrategy } from './base-bot.strategy';
import { Card } from '../../game/interfaces/card.interface';

class TestableBotStrategy extends BaseBotStrategy {
  public findRowForCard(card: Card, rows: Card[][]): number {
    return super.findRowForCard(card, rows);
  }
  public rowPenalty(row: Card[]): number {
    return super.rowPenalty(row);
  }
  public isInDanger(currentPenalty: number): boolean {
    return super.isInDanger(currentPenalty);
  }
}

describe('BaseBotStrategy', () => {
  let strategy: TestableBotStrategy;

  beforeEach(() => {
    strategy = new TestableBotStrategy();
  });

  describe('findRowForCard', () => {
    const rows: Card[][] = [[{ number: 5, penalty: 1 }], [{ number: 20, penalty: 1 }], []];

    it('picks the row with the smallest positive difference', () => {
      expect(strategy.findRowForCard({ number: 22, penalty: 1 }, rows)).toBe(1);
    });

    it('returns -1 when no row fits', () => {
      expect(strategy.findRowForCard({ number: 1, penalty: 1 }, rows)).toBe(-1);
    });
  });

  describe('rowPenalty', () => {
    it('sums the penalty of every card in the row', () => {
      const row: Card[] = [
        { number: 5, penalty: 2 },
        { number: 15, penalty: 3 },
      ];

      expect(strategy.rowPenalty(row)).toBe(5);
    });

    it('returns 0 for an empty row', () => {
      expect(strategy.rowPenalty([])).toBe(0);
    });
  });

  describe('isInDanger', () => {
    it('is false just below the caution threshold (66 - 15 = 51)', () => {
      expect(strategy.isInDanger(50)).toBe(false);
    });

    it('is true at exactly the caution threshold', () => {
      expect(strategy.isInDanger(51)).toBe(true);
    });

    it('is true above the threshold', () => {
      expect(strategy.isInDanger(70)).toBe(true);
    });
  });
});
