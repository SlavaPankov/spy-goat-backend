import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatisticsService } from '../statistics/statistics.service';
import { EErrorMessages } from '../types/enums/errorMessage';
import { Prisma } from '@prisma/client';

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

interface GameState {
  gameId: string;
  roomId: string;
  currentRound: number;
  currentTurn: number;
  rows: Card[][];
  players: Array<{
    id: string;
    userId: string | null;
    username: string;
    hand: Card[];
    totalPenalty: number;
    isBot: boolean;
  }>;
  status: string;
}

interface PlayedCard {
  playerId: string;
  card: Card;
}

@Injectable()
export class GameService {
  constructor(
    private readonly statisticsService: StatisticsService,
    private readonly prismaService: PrismaService
  ) {}

  private parseJsonArray<T>(json: unknown): T[] {
    if (Array.isArray(json)) {
      return json as T[];
    }
    return [];
  }

  private parseJson<T>(json: unknown): T {
    return json as T;
  }

  createDeck(): Card[] {
    const deck: Card[] = [];

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

      deck.push({ number: i, penalty: penalty });
    }

    return deck;
  }

  shuffleDeck(deck: Card[]): Card[] {
    const shuffled = [...deck];

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

  processTurnLogic(
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

  async getGameState(gameId: string): Promise<GameState> {
    const game = await this.prismaService.game.findUnique({
      where: { id: gameId },
      include: {
        room: true,
        players: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const rows = this.parseJsonArray<Card[]>(game.rows);

    return {
      gameId: game.id,
      roomId: game.roomId,
      currentRound: game.currentRound,
      currentTurn: game.currentTurn,
      rows,
      players: game.players.map((p) => ({
        id: p.id,
        userId: p.userId,
        username: p.isBot ? (p.botName ?? 'Bot') : (p.user?.username ?? 'Unknown'),
        hand: this.parseJsonArray<Card>(p.hand),
        totalPenalty: p.totalPenalty,
        isBot: p.isBot,
      })),
      status: game.status,
    };
  }

  async startGame(roomId: string): Promise<GameState> {
    const room = await this.prismaService.room.findUnique({
      where: { id: roomId },
      include: {
        players: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!room) {
      throw new NotFoundException(EErrorMessages.ROOM_NOT_FOUND);
    }

    if (room.status !== 'WAITING') {
      throw new BadRequestException(EErrorMessages.ROOM_ALREADY_STARTED);
    }

    if (room.players.length < 2) {
      throw new BadRequestException(EErrorMessages.NOT_ENOUGH_PLAYERS);
    }

    const deck = this.createDeck();
    const shuffled = this.shuffleDeck(deck);
    const { playerHands, tableRows } = this.dealCards(shuffled, room.players.length);

    const game = await this.prismaService.game.create({
      data: {
        roomId,
        rows: tableRows as unknown as Prisma.JsonArray,
        currentRound: 1,
        currentTurn: 1,
        status: 'IN_PROGRESS',
      },
    });

    for (let i = 0; i < room.players.length; i += 1) {
      await this.prismaService.player.update({
        where: { id: room.players[i].id },
        data: {
          gameId: game.id,
          hand: playerHands[i] as unknown as Prisma.JsonArray,
          penaltyCard: [] as unknown as Prisma.JsonArray,
          totalPenalty: 0,
        },
      });
    }

    await this.prismaService.room.update({
      where: { id: roomId },
      data: {
        status: 'IN_PROGRESS',
      },
    });

    return this.getGameState(game.id);
  }

  async playCard(gameId: string, playerId: string, cardNumber: number) {
    const player = await this.prismaService.player.findUnique({
      where: { id: playerId },
    });

    if (player?.gameId !== gameId) {
      throw new NotFoundException(EErrorMessages.PLAYER_NOT_FOUND_IN_GAME);
    }

    const hand = this.parseJsonArray<Card>(player.hand);
    const cardIndex = hand.findIndex((card) => card.number === cardNumber);

    if (cardIndex === -1) {
      throw new BadRequestException(EErrorMessages.CARD_NOT_IN_HAND);
    }

    const card = hand[cardIndex];
    hand.splice(cardIndex, 1);

    await this.prismaService.player.update({
      where: { id: playerId },
      data: {
        hand: hand as unknown as Prisma.JsonArray,
        selectedCard: card as unknown as Prisma.JsonArray,
      },
    });

    const game = await this.prismaService.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      throw new BadRequestException(EErrorMessages.GAME_NOT_FOUND);
    }

    const currentTurnCards = this.parseJsonArray<PlayedCard>(game.currentTurnCards);

    currentTurnCards.push({ playerId, card });

    await this.prismaService.game.update({
      where: { id: gameId },
      data: {
        currentTurnCards: currentTurnCards as unknown as Prisma.JsonArray,
      },
    });
  }

  async checkAllPlayersPlayed(gameId: string): Promise<boolean> {
    const game = await this.prismaService.game.findUnique({
      where: { id: gameId },
      include: {
        players: true,
      },
    });

    if (!game) {
      throw new NotFoundException(EErrorMessages.GAME_NOT_FOUND);
    }

    const currentTernCards = this.parseJsonArray<PlayedCard>(game.currentTurnCards);

    return currentTernCards.length === game.players.length;
  }

  async processTurn(gameId: string): Promise<GameState & { actions: TurnAction[] }> {
    const game = await this.prismaService.game.findUnique({
      where: { id: gameId },
      include: {
        players: true,
      },
    });

    if (!game) {
      throw new NotFoundException(EErrorMessages.GAME_NOT_FOUND);
    }

    const currentTurnCards = this.parseJsonArray<PlayedCard>(game.currentTurnCards);
    const rows = this.parseJsonArray<Card[]>(game.rows);

    const { actions, updatedRows } = this.processTurnLogic(currentTurnCards, rows);

    for (const action of actions) {
      if (action.actionType === 'take_row' && action.takenCards) {
        const player = await this.prismaService.player.findUnique({
          where: { id: action.playerId },
        });

        if (player) {
          const penaltyCard = this.parseJsonArray<Card>(player.penaltyCard);
          const newPenaltyCard = [...penaltyCard, ...action.takenCards];
          const penalty = action.takenCards.reduce((sum, card) => sum + card.penalty, 0);

          await this.prismaService.player.update({
            where: { id: action.playerId },
            data: {
              penaltyCard: newPenaltyCard as unknown as Prisma.JsonArray,
              totalPenalty: player.totalPenalty + penalty,
              selectedCard: Prisma.JsonNull,
            },
          });
        } else {
          await this.prismaService.player.update({
            where: { id: action.playerId },
            data: {
              selectedCard: Prisma.JsonNull,
            },
          });
        }
      }
    }

    await this.prismaService.game.update({
      where: { id: gameId },
      data: {
        rows: updatedRows as unknown as Prisma.JsonArray,
        currentTurnCards: [] as unknown as Prisma.JsonArray,
        currentTurn: { increment: 1 },
      },
    });

    const playersWithCards = await this.prismaService.player.findMany({
      where: { gameId },
    });

    const allHandsEmpty = playersWithCards.every((player) => {
      const hand = this.parseJsonArray<Card>(player.hand);
      return hand.length === 0;
    });

    if (allHandsEmpty) {
      await this.checkGameEnd(gameId);
    }

    const gameState = await this.getGameState(gameId);

    return {
      ...gameState,
      actions,
    };
  }

  async chooseRow(gameId: string, playerId: string, rowIndex: number): Promise<void> {
    const game = await this.prismaService.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      throw new NotFoundException(EErrorMessages.GAME_NOT_FOUND);
    }

    const player = await this.prismaService.player.findUnique({
      where: { id: playerId },
    });

    if (!player) {
      throw new NotFoundException(EErrorMessages.PLAYER_NOT_FOUND);
    }

    const rows = this.parseJsonArray<Card[]>(game.rows);

    if (rowIndex < 0 || rowIndex >= rows.length) {
      throw new BadRequestException(EErrorMessages.INVALID_ROW_CHOSEN);
    }

    if (!player.selectedCard) {
      throw new BadRequestException(EErrorMessages.NO_CARD_SELECTED);
    }

    const selectedCard = this.parseJson<Card>(player.selectedCard);

    const takenRow = rows[rowIndex];
    const penalty = takenRow.reduce((sum, card) => sum + card.penalty, 0);

    const penaltyCards = this.parseJsonArray<Card>(player.penaltyCard);
    const newPenaltyCards = [...penaltyCards, ...takenRow];

    await this.prismaService.player.update({
      where: { id: playerId },
      data: {
        penaltyCard: newPenaltyCards as unknown as Prisma.JsonArray,
        totalPenalty: player.totalPenalty + penalty,
        selectedCard: Prisma.JsonNull,
      },
    });

    const updatedRows = [...rows];
    updatedRows[rowIndex] = [selectedCard];

    await this.prismaService.game.update({
      where: { id: gameId },
      data: {
        rows: updatedRows as unknown as Prisma.JsonArray,
      },
    });
  }

  async checkGameEnd(gameId: string): Promise<void> {
    const game = await this.prismaService.game.findUnique({
      where: { id: gameId },
      include: {
        players: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!game) {
      throw new NotFoundException(EErrorMessages.GAME_NOT_FOUND);
    }

    const loser = game.players.find((player) => player.totalPenalty >= 66);

    if (loser) {
      await this.finishGame(gameId);
    } else {
      const deck = this.createDeck();
      const shuffled = this.shuffleDeck(deck);
      const { playerHands, tableRows } = this.dealCards(shuffled, game.players.length);

      for (let i = 0; i < game.players.length; i++) {
        await this.prismaService.player.update({
          where: { id: game.players[i].id },
          data: {
            hand: playerHands[i] as unknown as Prisma.JsonArray,
          },
        });
      }

      await this.prismaService.game.update({
        where: { id: gameId },
        data: {
          rows: tableRows as unknown as Prisma.JsonArray,
          currentRound: game.currentRound + 1,
          currentTurn: 1,
        },
      });
    }
  }

  async finishGame(gameId: string): Promise<void> {
    const game = await this.prismaService.game.findUnique({
      where: { id: gameId },
      include: {
        players: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!game) {
      throw new NotFoundException(EErrorMessages.GAME_NOT_FOUND);
    }

    const sortedPlayers = [...game.players].sort((a, b) => a.totalPenalty - b.totalPenalty);

    const winnerId = sortedPlayers[0].id;

    for (const player of game.players) {
      await this.prismaService.player.update({
        where: { id: player.id },
        data: {
          isWinner: player.id === winnerId,
          finalPosition: sortedPlayers.findIndex((p) => p.id === player.id) + 1,
        },
      });

      if (!player.isBot && player.userId) {
        await this.statisticsService.updateStatsAfterGame(player.userId, {
          isWinner: player.id === winnerId,
          penalty: player.totalPenalty,
        });
      }
    }

    await this.prismaService.game.update({
      where: { id: gameId },
      data: {
        status: 'FINISHED',
        finishedAt: new Date(),
      },
    });

    await this.prismaService.room.update({
      where: { id: game.roomId },
      data: {
        status: 'FINISHED',
      },
    });
  }
}
