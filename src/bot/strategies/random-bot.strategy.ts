import { Injectable } from '@nestjs/common';
import { BotStrategy, CardChoiceContext, RowChoiceContext } from '../types/interfaces/bot-strategy.interface';

@Injectable()
export class RandomBotStrategy implements BotStrategy {
  decideCardChoice({ hand }: CardChoiceContext) {
    return hand[Math.floor(Math.random() * hand.length)];
  }

  decideRowChoice({ rows }: RowChoiceContext) {
    return Math.floor(Math.random() * rows.length);
  }
}
