import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EErrorMessages } from '../types/enums/errorMessage';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomEntity } from './entities/room.entity';
import { plainToInstance } from 'class-transformer';
import { RoomDto } from './dto/room.dto';
import * as bcrypt from 'bcryptjs';
import { GameService } from '../game/game.service';

@Injectable()
export class RoomsService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => GameService))
    private readonly gameService: GameService
  ) {}

  async findAll() {
    const rooms = await this.prismaService.room.findMany({
      include: {
        creator: true,
        players: {
          omit: {
            userId: true,
            roomId: true,
          },
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
      omit: {
        creatorId: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return plainToInstance(RoomDto, rooms);
  }

  async findOne(id: string) {
    const currentRoom = await this.prismaService.room.findUnique({
      where: { id },
      include: {
        creator: true,
        players: {
          omit: {
            userId: true,
            roomId: true,
          },
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

    if (!currentRoom) {
      throw new NotFoundException(EErrorMessages.ROOM_NOT_FOUND);
    }

    currentRoom.players.sort((a, b) => b.position - a.position);

    return plainToInstance(RoomDto, currentRoom);
  }

  async create(dto: CreateRoomDto, creatorId: string) {
    const { name, code, maxPlayers, isPrivate, password } = dto;

    return this.prismaService.$transaction(async (tx) => {
      // 1. Проверяем, не находится ли пользователь уже в другой комнате
      const existingPlayer = await tx.player.findFirst({
        where: {
          userId: creatorId,
          room: {
            status: {
              in: ['WAITING', 'IN_PROGRESS'],
            },
          },
        },
        include: {
          room: true,
        },
      });

      if (existingPlayer) {
        throw new BadRequestException(
          `You are already in room "${existingPlayer.room.name}". Leave it first before creating a new one.`
        );
      }

      // 2. Проверяем уникальность кода комнаты
      const existingRoom = await tx.room.findUnique({
        where: { code },
      });

      if (existingRoom) {
        throw new BadRequestException(EErrorMessages.ROOM_ALREADY_EXISTS);
      }

      let hashedPassword = '';

      if (isPrivate) {
        const salt = await bcrypt.genSalt(Number.parseInt(process.env.CRYPT_SALT ?? '10'));

        hashedPassword = await bcrypt.hash(password, salt);
      }

      // 3. Создаём комнату с currentPlayers = 1
      const createdRoom = await tx.room.create({
        data: {
          name,
          code,
          maxPlayers,
          currentPlayers: 1, // ← Устанавливаем 1, так как создатель присоединяется
          isPrivate,
          ...(isPrivate && { password: hashedPassword }),
          creator: {
            connect: { id: creatorId },
          },
        },
      });

      // 4. Автоматически добавляем создателя в комнату как первого игрока
      await tx.player.create({
        data: {
          room: {
            connect: { id: createdRoom.id },
          },
          user: {
            connect: { id: creatorId },
          },
          position: 1,
        },
      });

      // 5. Возвращаем комнату с игроками
      const roomWithPlayers = await tx.room.findUnique({
        where: { id: createdRoom.id },
        include: {
          creator: true,
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

      if (!roomWithPlayers) {
        throw new NotFoundException(EErrorMessages.ROOM_NOT_FOUND);
      }

      return new RoomEntity(roomWithPlayers);
    });
  }

  async join(roomId: string, userId: string) {
    return this.prismaService.$transaction(async (tx) => {
      // 1. Проверяем, не находится ли пользователь уже в другой комнате
      const existingPlayer = await tx.player.findFirst({
        where: {
          userId: userId,
          room: {
            status: {
              in: ['WAITING', 'IN_PROGRESS'],
            },
          },
        },
        include: {
          room: true,
        },
      });

      if (existingPlayer) {
        throw new BadRequestException(
          `You are already in room "${existingPlayer.room.name}". Leave it first before joining another one.`
        );
      }

      // 2. Проверяем комнату
      const room = await tx.room.findUnique({
        where: { id: roomId },
        include: {
          players: true,
        },
      });

      if (!room) {
        throw new NotFoundException(EErrorMessages.ROOM_NOT_FOUND);
      }

      if (room.status !== 'WAITING') {
        throw new BadRequestException(EErrorMessages.ROOM_ALREADY_STARTED);
      }

      // 3. Проверяем лимит игроков
      if (room.currentPlayers >= room.maxPlayers) {
        throw new BadRequestException(EErrorMessages.ROOM_IS_FULL);
      }

      // 4. Проверяем, что пользователь ещё не в этой комнате (двойная защита)
      const alreadyPlayer = room.players.find((p) => p.userId === userId);

      if (alreadyPlayer) {
        throw new BadRequestException(EErrorMessages.ALREADY_IN_ROOM);
      }

      // 5. Определяем позицию
      const occupiedPositions = new Set(room.players.map((p) => p.position));

      let position = 1;

      while (occupiedPositions.has(position)) {
        position++;
      }

      // 6. Создаём Player
      const newPlayer = await tx.player.create({
        data: {
          room: {
            connect: { id: roomId },
          },
          user: {
            connect: { id: userId },
          },
          position,
        },
      });

      // 7. Обновляем currentPlayers
      await tx.room.update({
        where: { id: roomId },
        data: {
          currentPlayers: { increment: 1 },
        },
      });

      return newPlayer;
    });
  }

  async exit(roomId: string, userId: string) {
    return this.prismaService.$transaction(async (tx) => {
      // 1. Проверяем комнату
      const room = await tx.room.findUnique({
        where: { id: roomId },
        include: {
          players: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!room) {
        throw new NotFoundException(EErrorMessages.ROOM_NOT_FOUND);
      }

      // 2. Находим игрока в комнате
      const player = room.players.find((p) => p.userId === userId);

      if (!player) {
        throw new BadRequestException(EErrorMessages.NOT_IN_ROOM);
      }

      // 3. Нельзя выйти из начавшейся игры
      if (room.status === 'IN_PROGRESS') {
        throw new BadRequestException(EErrorMessages.CANNOT_EXIT_STARTED_GAME);
      }

      // 4. Удаляем игрока
      await tx.player.delete({
        where: { id: player.id },
      });

      // 5. Уменьшаем currentPlayers
      await tx.room.update({
        where: { id: roomId },
        data: {
          currentPlayers: { decrement: 1 },
        },
      });

      // 6. Перенумеровываем позиции оставшихся игроков
      const remainingPlayers = room.players.filter((p) => p.id !== player.id).sort((a, b) => a.position - b.position);

      for (let i = 0; i < remainingPlayers.length; i++) {
        await tx.player.update({
          where: { id: remainingPlayers[i].id },
          data: { position: i + 1 },
        });
      }

      // 7. Если создатель вышел и есть другие игроки - передать права
      if (room.creatorId === userId && remainingPlayers.length > 0) {
        const newCreatorId = remainingPlayers[0].userId;

        if (!newCreatorId) {
          throw new BadRequestException('Cannot transfer room ownership to a bot');
        }

        await tx.room.update({
          where: { id: roomId },
          data: {
            creatorId: newCreatorId,
          },
        });
      }

      // 8. Если комната пустая - удалить её
      if (remainingPlayers.length === 0) {
        await tx.room.delete({
          where: { id: roomId },
        });

        return { deleted: true, message: 'Room deleted (empty)' };
      }

      return { success: true, message: 'Successfully left the room' };
    });
  }

  async findActiveGame(roomId: string) {
    const activeGame = await this.prismaService.game.findFirst({
      where: { roomId, status: 'IN_PROGRESS' },
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
          omit: {
            roomId: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    if (!activeGame) {
      throw new NotFoundException(EErrorMessages.ACTIVE_GAME_NOT_FOUND);
    }

    return this.gameService.getGameState(activeGame.id);
  }

  async findRoomStats(roomId: string) {
    const roomStats = await this.prismaService.roomStats.findUnique({
      where: { roomId },
    });

    if (!roomStats) {
      throw new NotFoundException(EErrorMessages.PLAYER_NOT_FOUND);
    }

    return roomStats;
  }
}
