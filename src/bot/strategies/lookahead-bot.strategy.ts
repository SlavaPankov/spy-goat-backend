import { Injectable } from '@nestjs/common';
import { BotStrategy, CardChoiceContext, RowChoiceContext } from '../types/interfaces/bot-strategy.interface';
import { Card } from '../../game/interfaces/card.interface';
import { BaseBotStrategy } from './base-bot.strategy';

@Injectable()
export class LookaheadBotStrategy extends BaseBotStrategy implements BotStrategy {
  private readonly futureWeight = 0.35;

  private simulatePlacement(card: Card, rows: Card[][], currentPenalty: number): { cost: number; rowsAfter: Card[][] } {
    const riskMultiplier = this.isInDanger(currentPenalty) ? 3 : 1;
    const rowIndex = this.findRowForCard(card, rows);

    if (rowIndex === -1) {
      const rowPenalties = rows.map((row) => this.rowPenalty(row));
      const minRowPenalty = Math.min(...rowPenalties);
      const minRowIndex = rowPenalties.indexOf(minRowPenalty);

      const rowsAfter = rows.map((row, i) => (i === minRowIndex ? [card] : row));

      return { cost: (this.forcedPenaltyBase + minRowPenalty) * riskMultiplier, rowsAfter };
    }

    const targetRow = rows[rowIndex];

    if (targetRow.length === 5) {
      const cost = (this.forcedPenaltyBase + this.rowPenalty(targetRow)) * riskMultiplier;
      const rowsAfter = rows.map((row, i) => (i === rowIndex ? [card] : row));

      return { cost, rowsAfter };
    }

    const cost = card.number - targetRow.at(-1)!.number;
    const rowsAfter = rows.map((row, i) => (i === rowIndex ? [...row, card] : row));

    return { cost, rowsAfter };
  }

  private estimateFutureCost(remainingHand: Card[], rowsAfter: Card[][], currentPenalty: number): number {
    if (remainingHand.length === 0) {
      return 0;
    }

    const costs = remainingHand.map((card) => this.simulatePlacement(card, rowsAfter, currentPenalty).cost);

    return costs.reduce((sum, c) => sum + c, 0) / costs.length;
  }

  decideCardChoice({ hand, rows, currentPenalty }: CardChoiceContext): Card {
    let bestCard = hand[0];
    let bestTotal = Infinity;

    for (const card of hand) {
      const { cost: immediateCost, rowsAfter } = this.simulatePlacement(card, rows, currentPenalty);
      const remainingHand = hand.filter((c) => c !== card);
      const futureCost = this.estimateFutureCost(remainingHand, rowsAfter, currentPenalty);

      const total = immediateCost + this.futureWeight * futureCost;

      if (total < bestTotal) {
        bestTotal = total;
        bestCard = card;
      }
    }

    return bestCard;
  }

  decideRowChoice({ rows }: RowChoiceContext): number {
    let bestIndex = 0;
    let bestScore = Infinity;

    for (let i = 0; i < rows.length; i += 1) {
      const penalty = this.rowPenalty(rows[i]);
      const lastCard = rows[i].at(-1);
      const tieBreak = lastCard ? lastCard.number / 1000 : 0;
      const score = penalty + tieBreak;

      if (score < bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }

    return bestIndex;
  }
}
