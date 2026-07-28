import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EErrorMessages } from '../types/enums/errorMessage';
import { Card } from '../game/game.service';

@Injectable()
export class BotService {
  private readonly botNames = [
    'Bot Alex',
    'Bot Nika',
    'Bot Max',
    'Bot Luna',
    'Bot Rex',
    'Bot Zoe',
    'Bot Kai',
    'Bot Mia',
  ];

  constructor(private readonly prismaService: PrismaService) {}

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
   * TODO: точка расширения под сложность (RandomStrategy / GreedyStrategy / ...).
   */
  decideCardChoice(hand: Card[]): Card {
    return hand[Math.floor(Math.random() * hand.length)];
  }

  /**
   * Решение бота при выборе ряда, когда карта не подходит ни под один ряд.
   * Сейчас — минимизация штрафных очков в ряду.
   * TODO: точка расширения под сложность.
   */
  decideRowChoice(rows: Card[][]): number {
    let bestIndex = 0;
    let minPenalty = Infinity;

    for (let i = 0; i < rows.length; i += 1) {
      const penalty = rows[i].reduce((sum, c) => sum + c.penalty, 0);
      if (penalty < minPenalty) {
        minPenalty = penalty;
        bestIndex = i;
      }
    }

    return bestIndex;
  }

  private generateBotName(usedNames: string[]): string {
    const available = this.botNames.filter((n) => !usedNames.includes(n));
    if (available.length > 0) {
      return available[Math.floor(Math.random() * available.length)];
    }
    return `Bot ${Math.floor(Math.random() * 10000)}`;
  }
}
