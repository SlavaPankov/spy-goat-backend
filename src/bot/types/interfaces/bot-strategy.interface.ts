import { Card } from '../../../game/interfaces/card.interface';

export interface CardChoiceContext {
  hand: Card[];
  rows: Card[][];
  currentPenalty: number;
}

export interface RowChoiceContext {
  rows: Card[][];
  currentPenalty: number;
}

export interface BotStrategy {
  decideCardChoice: (context: CardChoiceContext) => Card;
  decideRowChoice: (context: RowChoiceContext) => number;
}
