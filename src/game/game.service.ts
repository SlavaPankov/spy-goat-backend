import { Injectable } from '@nestjs/common';

export interface Card {
  number: number;
  penalty: number;
}

export interface TurnAction {
  playerId: string;
  actionType: 'place' | 'take_row' | 'choose_row';
  rowIndex?: number;
  takenCards?: Card[];
}

@Injectable()
export class GameService {
  createDesk(): Card[] {
    const desk: Card[] = [];

    for (let i = 1; i <= 104; i++) {
      let penalty = 1;

      if (i === 55) {
        penalty = 7;
      } else if (i % 11 === 0) {
        penalty = 5;
      } else if (i % 10 === 0) {
        penalty = 3;
      } else if (i % 5 === 0) {
        penalty = 2;
      }

      desk.push({ number: i, penalty: penalty });
    }

    return desk;
  }

  shuffleDesk(desk: Card[]): Card[] {
    const shuffled = [...desk];

    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));

      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  dealCards(
    deck: Card[],
    playerCount: number
  ): {
    playerHands: Card[][];
    tableRows: Card[][];
    remainingDeck: Card[];
  } {
    const playerHands: Card[][] = new Array(playerCount).fill(null).map(() => []);
    const tableRows: Card[][] = [[], [], [], []];

    let index = 0;

    for (let i = 0; i < 10; i += 1) {
      for (let p = 0; p < playerCount; p++) {
        index += 1;

        playerHands[p].push(deck[index]);
      }
    }

    for (let i = 0; i < 4; i += 1) {
      index += 1;

      tableRows[i].push(deck[index]);
    }

    return {
      playerHands,
      tableRows,
      remainingDeck: deck.slice(index),
    };
  }

  findRowForCard(card: Card, rows: Card[][]): number {
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

  processTurn(
    playedCards: { playerId: string; card: Card }[],
    rows: Card[][]
  ): {
    actions: TurnAction[];
    updatedRows: Card[][];
  } {
    const sortedPlays = [...playedCards].sort((a, b) => a.card.number - b.card.number);
    const actions: TurnAction[] = [];
    const updatedRows = rows.map((row) => [...row]);

    for (const play of sortedPlays) {
      const rowIndex = this.findRowForCard(play.card, updatedRows);

      if (rowIndex === -1) {
        actions.push({
          playerId: play.playerId,
          actionType: 'choose_row',
        });
      } else {
        const targetRow = updatedRows[rowIndex];

        if (targetRow.length === 5) {
          actions.push({
            playerId: play.playerId,
            actionType: 'take_row',
            rowIndex,
            takenCards: [...targetRow],
          });

          updatedRows[rowIndex] = [play.card];
        } else {
          updatedRows[rowIndex].push(play.card);
          actions.push({
            playerId: play.playerId,
            actionType: 'place',
            rowIndex,
          });
        }
      }
    }

    return { actions, updatedRows };
  }
}
