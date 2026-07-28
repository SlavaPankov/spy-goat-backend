import { Card } from '../../game/interfaces/card.interface';

export abstract class BaseBotStrategy {
  protected readonly dangerThreshold = 66;
  protected readonly cautionBuffer = 15;
  protected readonly forcedPenaltyBase = 10000;

  protected findRowForCard(card: Card, rows: Card[][]): number {
    let bestRow = -1;
    let minDiff = Infinity;

    for (let i = 0; i < rows.length; i += 1) {
      const lastCard = rows[i].at(-1);

      if (lastCard && card.number > lastCard.number) {
        const diff = card.number - lastCard.number;

        if (diff < minDiff) {
          minDiff = diff;
          bestRow = i;
        }
      }
    }

    return bestRow;
  }

  protected rowPenalty(row: Card[]): number {
    return row.reduce((sum, c) => sum + c.penalty, 0);
  }

  protected isInDanger(currentPenalty: number): boolean {
    return currentPenalty >= this.dangerThreshold - this.cautionBuffer;
  }
}
