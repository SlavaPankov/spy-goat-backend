import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatisticsService } from '../statistics/statistics.service';
import { EErrorMessages } from '../types/enums/errorMessage';
import { Prisma } from '@prisma/client';
import { BotService } from '../bot/bot.service';
import { Card } from './interfaces/card.interface';
import { BotDifficulty } from '../bot/types/enum/bot-difficulty.enum';

export interface TurnAction {
  playerId: string;
  actionType: 'place' | 'take_row' | 'choose_row';
  rowIndex?: number;
  takenCards?: Card[];
}

interface PlayerCard {
  playerId: string;
  card: Card;
}

export interface GameState {
  gameId: string;
  roomId: string;
  currentRound: number;
  currentTurn: number;
  rows: Card[][];
  players: {
    id: string;
    userId: string | null;
    username: string;
    hand: Card[];
    totalPenalty: number;
    isBot: boolean;
    penaltyCard: Card[];
    selectedCard: Card;
    isSelectedCardConfirmed: boolean;
    roundPenalty: number;
    roundPenaltyCard: Card[];
    isWinner: boolean;
  }[];
  status: string;
  waitingForRowChoice?: boolean;
  currentChoosingPlayer?: string;
  currentAction?: TurnAction;
  allPlayersReady?: boolean;
  revealedCards?: { playerId: string; card: Card }[];
}

export type StepCallback = (step: {
  gameState: GameState;
  action: TurnAction;
  phase: 'row-chosen' | 'applied';
}) => Promise<void>;

export interface RoundFinishedData {
  gameState: GameState;
  roundNumber: number;
  playerRoundScores: {
    playerId: string;
    username: string;
    roundPenalty: number;
    roundPenaltyCards: Card[];
    totalPenalty: number;
  }[];
}

@Injectable()
export class GameService {
  private readonly pendingPlayers: Map<string, PlayerCard[]> = new Map();
  private readonly currentProcessingPlayer: Map<string, PlayerCard> = new Map();
  private readonly currentAction: Map<string, TurnAction> = new Map();
  private readonly handSize = 10;
  private readonly minGameScore = 66;
  private readonly confirmLocks: Set<string> = new Set();

  constructor(
    private readonly statisticsService: StatisticsService,
    private readonly prismaService: PrismaService,
    private readonly botService: BotService
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

    for (let i = 0; i < this.handSize; i += 1) {
      for (let p = 0; p < playerCount; p++) {
        playerHands[p].push(deck[index]);

        index += 1;
      }
    }

    for (let i = 0; i < 4; i += 1) {
      tableRows[i].push(deck[index]);

      index += 1;
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

  calculateActionForPlayer(playerCard: PlayerCard, rows: Card[][]): TurnAction {
    const rowIndex = this.findRowForCard(playerCard.card, rows);

    if (rowIndex === -1) {
      return {
        playerId: playerCard.playerId,
        actionType: 'choose_row',
      };
    }

    const targetRow = rows[rowIndex];

    if (targetRow.length === 5) {
      return {
        playerId: playerCard.playerId,
        actionType: 'take_row',
        rowIndex,
        takenCards: [...targetRow],
      };
    }

    return {
      playerId: playerCard.playerId,
      actionType: 'place',
      rowIndex,
    };
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

    const allPlayersReady = game.players.every((p) => p.isSelectedCardConfirmed);

    const currentPlayer = this.currentProcessingPlayer.get(gameId);
    const currentAction = this.currentAction.get(gameId);

    return {
      gameId: game.id,
      roomId: game.roomId,
      currentRound: game.currentRound,
      currentTurn: game.currentTurn,
      rows,
      players: game.players.map((player) => ({
        id: player.id,
        userId: player.userId,
        username: player.isBot ? (player.botName ?? 'Bot') : (player.user?.username ?? 'Unknown'),
        hand: this.parseJsonArray<Card>(player.hand),
        totalPenalty: player.totalPenalty,
        isBot: player.isBot,
        penaltyCard: this.parseJsonArray<Card>(player.penaltyCard),
        selectedCard: this.parseJson<Card>(player.selectedCard),
        roundPenalty: player.roundPenalty,
        roundPenaltyCard: this.parseJsonArray<Card>(player.roundPenaltyCard),
        isSelectedCardConfirmed: player.isSelectedCardConfirmed,
        isWinner: player.isWinner,
      })),
      status: game.status,
      revealedCards: this.parseJsonArray<PlayerCard>(game.currentTurnCards),
      allPlayersReady,
      waitingForRowChoice: currentAction?.actionType === 'choose_row',
      currentChoosingPlayer: currentPlayer?.playerId,
      currentAction,
    };
  }

  async autoSelectCardsForBots(gameId: string): Promise<void> {
    const game = await this.prismaService.game.findUnique({ where: { id: gameId } });

    if (!game) {
      return;
    }

    const rows = this.parseJsonArray<Card[]>(game.rows);
    const bots = await this.prismaService.player.findMany({
      where: { gameId, isBot: true },
    });

    for (const bot of bots) {
      const hand = this.parseJsonArray<Card>(bot.hand);
      if (hand.length === 0) continue;

      const card = this.botService.decideCardChoice(hand, rows, bot.totalPenalty, BotDifficulty.HARD);

      await this.selectCard(bot.id, card);
      await this.confirmCardChoice(bot.id);
    }
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

    if (room.players.length < 2 && !room.withBots) {
      throw new BadRequestException(EErrorMessages.NOT_ENOUGH_PLAYERS);
    }

    if (room.players.length < room.maxPlayers && room.withBots) {
      await this.botService.fillRoomWithBots(roomId);
    }
    const fullRoom = await this.prismaService.room.findUnique({
      where: { id: roomId },
      include: { players: true },
    });

    const deck = this.createDeck();
    const shuffled = this.shuffleDeck(deck);
    const { playerHands, tableRows } = this.dealCards(shuffled, fullRoom!.players.length);

    const game = await this.prismaService.game.create({
      data: {
        roomId,
        rows: tableRows as unknown as Prisma.JsonArray,
        currentRound: 1,
        currentTurn: 1,
        status: 'IN_PROGRESS',
      },
    });

    for (let i = 0; i < fullRoom!.players.length; i += 1) {
      await this.prismaService.player.update({
        where: { id: fullRoom!.players[i].id },
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
      data: { status: 'IN_PROGRESS' },
    });

    await this.autoSelectCardsForBots(game.id);

    return this.getGameState(game.id);
  }

  async selectCard(playerId: string, card: Card) {
    const player = await this.prismaService.player.findUnique({
      where: { id: playerId },
    });

    if (!player) {
      throw new NotFoundException(EErrorMessages.PLAYER_NOT_FOUND);
    }

    const hand = this.parseJsonArray<Card>(player.hand);
    const cardExists = hand.some((c) => c.number === card.number);

    if (!cardExists) {
      throw new BadRequestException(EErrorMessages.CARD_NOT_IN_HAND);
    }

    await this.prismaService.player.update({
      where: { id: playerId },
      data: {
        selectedCard: card as unknown as Prisma.JsonObject,
        isSelectedCardConfirmed: false,
      },
    });
  }

  async confirmCardChoice(playerId: string): Promise<{ allReady: boolean; gameId: string }> {
    const player = await this.prismaService.player.findUnique({ where: { id: playerId } });

    if (!player?.gameId) {
      throw new NotFoundException(EErrorMessages.PLAYER_NOT_FOUND);
    }

    if (!player.selectedCard) {
      throw new BadRequestException('No card selected');
    }

    const selectedCard = this.parseJson<Card>(player.selectedCard);
    const hand = this.parseJsonArray<Card>(player.hand);
    const cardIndex = hand.findIndex((c) => c.number === selectedCard.number);

    if (cardIndex === -1) {
      throw new BadRequestException(EErrorMessages.CARD_NOT_IN_HAND);
    }

    hand.splice(cardIndex, 1);

    await this.prismaService.player.update({
      where: { id: playerId },
      data: {
        hand: hand as unknown as Prisma.JsonArray,
        isSelectedCardConfirmed: true,
      },
    });

    const gameId = player.gameId;

    while (this.confirmLocks.has(gameId)) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    this.confirmLocks.add(gameId);

    try {
      const updatedGame = await this.prismaService.game.findUnique({
        where: { id: gameId },
        include: { players: true },
      });

      const allReady = updatedGame!.players.every((p) => p.isSelectedCardConfirmed);

      if (allReady) {
        const currentTurnCards = this.parseJsonArray<PlayerCard>(updatedGame!.currentTurnCards);

        if (currentTurnCards.length === 0) {
          for (const p of updatedGame!.players) {
            if (p.selectedCard) {
              currentTurnCards.push({ playerId: p.id, card: this.parseJson<Card>(p.selectedCard) });
            }
          }

          await this.prismaService.game.update({
            where: { id: gameId },
            data: { currentTurnCards: currentTurnCards as unknown as Prisma.JsonArray },
          });
        }
      }

      return { allReady, gameId };
    } finally {
      this.confirmLocks.delete(gameId);
    }
  }

  async declineCardChoice(playerId: string): Promise<{ gameId: string }> {
    const player = await this.prismaService.player.findUnique({
      where: { id: playerId },
      include: {
        game: {
          include: { players: true },
        },
      },
    });

    if (!player?.game) {
      throw new NotFoundException(EErrorMessages.PLAYER_NOT_FOUND);
    }

    if (!player.isSelectedCardConfirmed) {
      throw new BadRequestException('Card is not confirmed');
    }

    const allReady = player.game.players.every((p) => p.isSelectedCardConfirmed);

    if (allReady) {
      throw new BadRequestException('Cannot decline after all players have confirmed');
    }

    const selectedCard = this.parseJson<Card>(player.selectedCard);
    const hand = this.parseJsonArray<Card>(player.hand);

    hand.push(selectedCard);

    await this.prismaService.player.update({
      where: { id: playerId },
      data: {
        hand: hand as unknown as Prisma.JsonArray,
        isSelectedCardConfirmed: false,
        selectedCard: Prisma.JsonNull,
      },
    });

    return { gameId: player.gameId! };
  }

  async revealCards(gameId: string): Promise<Array<{ playerId: string; card: Card }>> {
    const game = await this.prismaService.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      throw new NotFoundException(EErrorMessages.GAME_NOT_FOUND);
    }

    return this.parseJsonArray<PlayerCard>(game.currentTurnCards);
  }

  async startTurnProcessing(
    gameId: string,
    onStep?: StepCallback
  ): Promise<GameState & { action: TurnAction; isRoundFinished?: boolean; roundData?: RoundFinishedData }> {
    const existingPending = this.pendingPlayers.get(gameId);

    if (existingPending && existingPending.length > 0) {
      const gameState = await this.getGameState(gameId);
      const currentAction = this.currentAction.get(gameId);

      return {
        ...gameState,
        action: currentAction ?? { playerId: '', actionType: 'place' },
      };
    }

    const game = await this.prismaService.game.findUnique({
      where: { id: gameId },
      include: { players: true },
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const currentTurnCards = this.parseJsonArray<PlayerCard>(game.currentTurnCards);

    const sortedPlayers = currentTurnCards
      .map((pc) => ({ playerId: pc.playerId, card: pc.card }))
      .sort((a, b) => a.card.number - b.card.number);

    this.pendingPlayers.set(gameId, sortedPlayers);

    return this.processNextPlayer(gameId, onStep);
  }

  async processNextPlayer(
    gameId: string,
    onStep?: StepCallback
  ): Promise<
    GameState & {
      action: TurnAction;
      isRoundFinished?: boolean;
      roundData?: RoundFinishedData;
      isGameEnded?: boolean;
    }
  > {
    const pending = this.pendingPlayers.get(gameId);

    if (!pending || pending.length === 0) {
      this.pendingPlayers.delete(gameId);

      const { isRoundFinished, roundData, isGameEnded } = await this.finishRound(gameId);
      const gameState = await this.getGameState(gameId);

      if (isGameEnded) {
        await this.botService.removeBotsFromRoom(gameState.roomId);
      }

      return {
        ...gameState,
        action: { playerId: '', actionType: 'place' },
        isRoundFinished,
        roundData,
        isGameEnded,
      };
    }

    const game = await this.prismaService.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const rows = this.parseJsonArray<Card[]>(game.rows);

    const currentPlayer = pending[0];
    this.currentProcessingPlayer.set(gameId, currentPlayer);

    const action = this.calculateActionForPlayer(currentPlayer, rows);
    this.currentAction.set(gameId, action);

    if (action.actionType === 'place' || action.actionType === 'take_row') {
      pending.shift();
      this.pendingPlayers.set(gameId, pending);

      if (action.actionType === 'take_row' && onStep) {
        await onStep({ gameState: await this.getGameState(gameId), action, phase: 'row-chosen' });
      }

      await this.applyAction(gameId, action);

      if (onStep) {
        await onStep({ gameState: await this.getGameState(gameId), action, phase: 'applied' });
      }

      return this.processNextPlayer(gameId, onStep);
    }

    const player = await this.prismaService.player.findUnique({
      where: { id: action.playerId },
    });

    if (player?.isBot) {
      const rowIndex = this.botService.decideRowChoice(rows, player.totalPenalty, BotDifficulty.HARD);

      return this.chooseRow(gameId, action.playerId, rowIndex, onStep);
    }

    const gameState = await this.getGameState(gameId);
    return { ...gameState, action };
  }

  private async applyAction(gameId: string, action: TurnAction): Promise<void> {
    const game = await this.prismaService.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const rows = this.parseJsonArray<Card[]>(game.rows);
    const player = await this.prismaService.player.findUnique({
      where: { id: action.playerId },
    });

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    if (action.actionType === 'place' && action.rowIndex !== undefined) {
      const selectedCard = this.parseJson<Card>(player.selectedCard);
      rows[action.rowIndex].push(selectedCard);

      await this.prismaService.game.update({
        where: { id: gameId },
        data: {
          rows: rows as unknown as Prisma.JsonArray,
        },
      });

      await this.prismaService.player.update({
        where: { id: action.playerId },
        data: {
          selectedCard: Prisma.JsonNull,
        },
      });
    } else if (action.actionType === 'take_row' && action.rowIndex !== undefined && action.takenCards) {
      const selectedCard = this.parseJson<Card>(player.selectedCard);

      const penaltyCards = this.parseJsonArray<Card>(player.penaltyCard);
      const roundPenaltyCards = this.parseJsonArray<Card>(player.roundPenaltyCard);
      const newPenaltyCards = [...penaltyCards, ...action.takenCards];
      const newRoundPenaltyCards = [...roundPenaltyCards, ...action.takenCards];

      const penalty = action.takenCards.reduce((sum, card) => sum + card.penalty, 0);

      rows[action.rowIndex] = [selectedCard];

      await this.prismaService.game.update({
        where: { id: gameId },
        data: {
          rows: rows as unknown as Prisma.JsonArray,
        },
      });

      await this.prismaService.player.update({
        where: { id: action.playerId },
        data: {
          penaltyCard: newPenaltyCards as unknown as Prisma.JsonArray,
          roundPenaltyCard: newRoundPenaltyCards as unknown as Prisma.JsonArray,
          totalPenalty: { increment: penalty },
          roundPenalty: { increment: penalty },
          selectedCard: Prisma.JsonNull,
        },
      });
    }
  }

  async chooseRow(
    gameId: string,
    playerId: string,
    rowIndex: number,
    onStep?: StepCallback
  ): Promise<
    GameState & {
      action: TurnAction;
      isRoundFinished?: boolean;
      roundData?: RoundFinishedData;
    }
  > {
    const currentPlayer = this.currentProcessingPlayer.get(gameId);
    const currentAction = this.currentAction.get(gameId);

    if (currentPlayer?.playerId !== playerId) {
      throw new BadRequestException('It is not your turn to choose a row');
    }

    if (currentAction?.actionType !== 'choose_row') {
      throw new BadRequestException('You are not supposed to choose a row right now');
    }

    this.currentProcessingPlayer.delete(gameId);
    this.currentAction.delete(gameId);

    const pending = this.pendingPlayers.get(gameId);
    if (pending) {
      pending.shift();
      this.pendingPlayers.set(gameId, pending);
    }

    const game = await this.prismaService.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const rows = this.parseJsonArray<Card[]>(game.rows);

    if (rowIndex < 0 || rowIndex >= rows.length) {
      throw new BadRequestException('Invalid row index');
    }

    const player = await this.prismaService.player.findUnique({
      where: { id: playerId },
    });

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    const selectedCard = this.parseJson<Card>(player.selectedCard);

    const takenRow = rows[rowIndex];
    const penalty = takenRow.reduce((sum, card) => sum + card.penalty, 0);

    const penaltyCards = this.parseJsonArray<Card>(player.penaltyCard);
    const roundPenaltyCards = this.parseJsonArray<Card>(player.roundPenaltyCard);
    const newPenaltyCards = [...penaltyCards, ...takenRow];
    const newRoundPenaltyCards = [...roundPenaltyCards, ...takenRow];

    rows[rowIndex] = [selectedCard];

    await this.prismaService.game.update({
      where: { id: gameId },
      data: {
        rows: rows as unknown as Prisma.JsonArray,
      },
    });

    await this.prismaService.player.update({
      where: { id: playerId },
      data: {
        penaltyCard: newPenaltyCards as unknown as Prisma.JsonArray,
        roundPenaltyCard: newRoundPenaltyCards as unknown as Prisma.JsonArray,
        totalPenalty: { increment: penalty },
        roundPenalty: { increment: penalty },
        selectedCard: Prisma.JsonNull,
      },
    });

    return this.processNextPlayer(gameId, onStep);
  }

  private async finishRound(gameId: string): Promise<{
    isGameEnded: boolean;
    isRoundFinished: boolean;
    roundData?: RoundFinishedData;
  }> {
    const game = await this.prismaService.game.findUnique({
      where: { id: gameId },
      include: { players: true },
    });

    if (!game) {
      return { isGameEnded: false, isRoundFinished: false };
    }

    this.pendingPlayers.delete(gameId);
    this.currentProcessingPlayer.delete(gameId);
    this.currentAction.delete(gameId);

    await this.resetPlayersReady(gameId);

    await this.prismaService.game.update({
      where: { id: gameId },
      data: {
        currentTurnCards: [] as unknown as Prisma.JsonArray,
        currentTurn: game.currentTurn + 1,
      },
    });

    const playersWithCards = await this.prismaService.player.findMany({
      where: { gameId },
    });

    const allHandsEmpty = playersWithCards.every((p) => {
      const hand = this.parseJsonArray<Card>(p.hand);
      return hand.length === 0;
    });

    if (allHandsEmpty) {
      const roundData = await this.getRoundFinishedData(gameId);
      const isGameEnded = await this.checkGameEnd(gameId);

      if (!isGameEnded) {
        await this.autoSelectCardsForBots(gameId);
      }

      return {
        isGameEnded,
        isRoundFinished: !isGameEnded,
        roundData: isGameEnded ? undefined : roundData,
      };
    }

    await this.autoSelectCardsForBots(gameId);

    return { isGameEnded: false, isRoundFinished: false };
  }

  async checkGameEnd(gameId: string): Promise<boolean> {
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

    const loser = game.players.some((player) => player.totalPenalty >= this.minGameScore);

    if (loser) {
      await this.finishGame(gameId);

      return true;
    } else {
      const deck = this.createDeck();
      const shuffled = this.shuffleDeck(deck);
      const { playerHands, tableRows } = this.dealCards(shuffled, game.players.length);

      for (let i = 0; i < game.players.length; i++) {
        await this.prismaService.player.update({
          where: { id: game.players[i].id },
          data: {
            hand: playerHands[i] as unknown as Prisma.JsonArray,
            roundPenalty: 0,
            roundPenaltyCard: [] as unknown as Prisma.JsonArray,
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

      return false;
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

    await this.prismaService.roomStats.upsert({
      where: { roomId: game.roomId },
      create: {
        roomId: game.roomId,
        totalGames: 1,
        completedGames: 1,
      },
      update: {
        totalGames: { increment: 1 },
        completedGames: { increment: 1 },
      },
    });

    const sortedPlayers = [...game.players].sort((a, b) => a.totalPenalty - b.totalPenalty);

    const winnerId = sortedPlayers[0].id;

    for (const player of game.players) {
      await this.prismaService.player.update({
        where: { id: player.id },
        data: {
          isWinner: player.id === winnerId,
          finalPosition: sortedPlayers.findIndex((p) => p.id === player.id) + 1,
          isReady: false,
        },
      });

      if (!player.isBot && player.userId) {
        await this.statisticsService.updateStatsAfterGame(player.userId, {
          isWinner: player.id === winnerId,
          penalty: player.totalPenalty,
        });

        const existingStats = await this.prismaService.playerRoomStats.findUnique({
          where: {
            userId_roomId: {
              userId: player.userId,
              roomId: game.roomId,
            },
          },
        });

        const isWinner = player.id === winnerId;

        await this.prismaService.playerRoomStats.upsert({
          where: {
            userId_roomId: {
              userId: player.userId,
              roomId: game.roomId,
            },
          },
          create: {
            userId: player.userId,
            roomId: game.roomId,
            gamesPlayed: 1,
            gamesWon: isWinner ? 1 : 0,
            totalPenalty: player.totalPenalty,
            bestScore: player.totalPenalty,
          },
          update: {
            gamesPlayed: { increment: 1 },
            gamesWon: isWinner ? { increment: 1 } : undefined,
            totalPenalty: { increment: player.totalPenalty },
            bestScore: {
              set:
                existingStats?.bestScore != null
                  ? Math.min(player.totalPenalty, existingStats.bestScore)
                  : player.totalPenalty,
            },
            lastPlayedAt: new Date(),
          },
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
        status: 'WAITING',
      },
    });
  }

  async setIsReady(playerId: string, roomId: string, isReady: boolean) {
    const currentPlayer = await this.prismaService.player.findFirst({ where: { id: playerId, roomId } });

    if (!currentPlayer) {
      throw new NotFoundException(EErrorMessages.PLAYER_NOT_FOUND);
    }

    return this.prismaService.player.update({
      where: { id: playerId },
      data: {
        isReady,
      },
    });
  }

  async resetPlayersReady(gameId: string): Promise<void> {
    await this.prismaService.player.updateMany({
      where: { gameId },
      data: {
        isSelectedCardConfirmed: false,
      },
    });
  }

  async getRoundFinishedData(gameId: string): Promise<RoundFinishedData> {
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
      throw new NotFoundException('Game not found');
    }

    const gameState = await this.getGameState(gameId);

    const playersRoundScores = game.players
      .map((player) => ({
        playerId: player.id,
        username: player.isBot ? (player.botName ?? 'Bot') : (player.user?.username ?? 'Unknown'),
        roundPenalty: player.roundPenalty,
        roundPenaltyCards: this.parseJsonArray<Card>(player.roundPenaltyCard),
        totalPenalty: player.totalPenalty,
      }))
      .sort((playerA, playerB) => playerA.totalPenalty - playerB.totalPenalty);

    return {
      gameState,
      roundNumber: game.currentRound,
      playerRoundScores: playersRoundScores,
    };
  }
}
