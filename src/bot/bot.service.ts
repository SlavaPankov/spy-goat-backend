import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EErrorMessages } from '../types/enums/errorMessage';
import { Card } from '../game/interfaces/card.interface';
import { BotDifficulty } from './types/enum/bot-difficulty.enum';
import { BotStrategyFactory } from './bot-strategy.factory';

@Injectable()
export class BotService {
  private readonly botNames = [
    '__James Goat__',
    '__Dart Vader__',
    '__R2-D2__',
    '__Spider Man__',
    '__T-Rex__',
    '__Zoe Kravitz',
    '__Bot__',
    '__Martin__',
  ];

  constructor(
    private readonly prismaService: PrismaService,
    private readonly strategyFactory: BotStrategyFactory
  ) {}

  /**
   * Добирает пустые места в комнате ботами.
   */
  async fillRoomWithBots(roomId: string): Promise<void> {
    const room = await this.prismaService.room.findUnique({
      where: { id: roomId },
      include: { players: true },
    });

    if (!room) {
      throw new NotFoundException(EErrorMessages.ROOM_NOT_FOUND);
    }

    if (room.status !== 'WAITING') {
      throw new BadRequestException(EErrorMessages.ROOM_ALREADY_STARTED);
    }

    const emptySlots = room.maxPlayers - room.players.length;
    if (emptySlots <= 0) return;

    const usedPositions = room.players.map((p) => p.position);
    const usedNames = room.players.filter((p) => p.isBot).map((p) => p.botName!);

    let nextPosition = 0;
    const botsData: Prisma.PlayerCreateManyInput[] = [];

    for (let i = 0; i < emptySlots; i += 1) {
      while (usedPositions.includes(nextPosition)) nextPosition += 1;
      usedPositions.push(nextPosition);

      const name = this.generateBotName(usedNames);
      usedNames.push(name);

      botsData.push({
        roomId,
        isBot: true,
        botName: name,
        position: nextPosition,
        isReady: true,
        hand: [] as unknown as Prisma.JsonArray,
        penaltyCard: [] as unknown as Prisma.JsonArray,
        roundPenaltyCard: [] as unknown as Prisma.JsonArray,
      });

      nextPosition += 1;
    }

    await this.prismaService.player.createMany({ data: botsData });

    await this.prismaService.room.update({
      where: { id: roomId },
      data: { currentPlayers: room.players.length + emptySlots },
    });
  }

  /**
   * Решение бота при выборе карты из руки.
   */
  decideCardChoice(hand: Card[], rows: Card[][], currentPenalty: number, difficulty: BotDifficulty | null): Card {
    const strategy = this.strategyFactory.getStrategy(difficulty);

    return strategy.decideCardChoice({ hand, rows, currentPenalty });
  }

  /**
   * Решение бота при выборе ряда, когда карта не подходит ни под один ряд.
   * Сейчас — минимизация штрафных очков в ряду.
   */
  decideRowChoice(rows: Card[][], currentPenalty: number, difficulty: BotDifficulty | null): number {
    const strategy = this.strategyFactory.getStrategy(difficulty);

    return strategy.decideRowChoice({ rows, currentPenalty });
  }

  private generateBotName(usedNames: string[]): string {
    const available = this.botNames.filter((n) => !usedNames.includes(n));
    if (available.length > 0) {
      return available[Math.floor(Math.random() * available.length)];
    }
    return `Bot ${Math.floor(Math.random() * 10000)}`;
  }

  /**
   * Удаляет ботов из комнаты
   * */
  async removeBotsFromRoom(roomId: string): Promise<void> {
    const bots = await this.prismaService.player.findMany({
      where: { roomId, isBot: true },
      select: { id: true },
    });

    if (bots.length === 0) return;

    await this.prismaService.player.deleteMany({
      where: { roomId, isBot: true },
    });

    await this.prismaService.room.update({
      where: { id: roomId },
      data: { currentPlayers: { decrement: bots.length } },
    });
  }
}
