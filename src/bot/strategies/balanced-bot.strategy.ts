import { Injectable } from '@nestjs/common';
import { BotStrategy, CardChoiceContext, RowChoiceContext } from '../types/interfaces/bot-strategy.interface';
import { Card } from 'src/game/interfaces/card.interface';
import { BaseBotStrategy } from './base-bot.strategy';

@Injectable()
export class BalancedBotStrategy extends BaseBotStrategy implements BotStrategy {
  private scoreCard(card: Card, rows: Card[][], currentPenalty: number): number {
    const riskMultiplier = this.isInDanger(currentPenalty) ? 3 : 1;
    const rowIndex = this.findRowForCard(card, rows);

    if (rowIndex === -1) {
      const minRowPenalty = Math.min(...rows.map((row) => this.rowPenalty(row)));
      return (this.forcedPenaltyBase + minRowPenalty) * riskMultiplier;
    }

    const targetRow = rows[rowIndex];

    if (targetRow.length === 5) {
      return (this.forcedPenaltyBase + this.rowPenalty(targetRow)) * riskMultiplier;
    }

    return card.number - targetRow.at(-1)!.number;
  }

  decideCardChoice({ rows, currentPenalty, hand }: CardChoiceContext) {
    let bestCard = hand[0];
    let bestScore = Infinity;

    for (const card of hand) {
      const score = this.scoreCard(card, rows, currentPenalty);

      if (score < bestScore) {
        bestScore = score;
        bestCard = card;
      }
    }

    return bestCard;
  }

  decideRowChoice({ rows }: RowChoiceContext): number {
    let bestIndex = 0;
    let bestPenalty = Infinity;

    for (let i = 0; i < rows.length; i += 1) {
      const penalty = this.rowPenalty(rows[i]);

      if (penalty < bestPenalty) {
        bestPenalty = penalty;
        bestIndex = i;
      }
    }

    return bestIndex;
  }
}
