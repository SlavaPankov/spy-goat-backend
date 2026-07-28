import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EErrorMessages } from '../types/enums/errorMessage';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomEntity } from './entities/room.entity';
import { plainToInstance } from 'class-transformer';
import { RoomDto } from './dto/room.dto';
import * as bcrypt from 'bcryptjs';
import { GameService } from '../game/game.service';
import { Prisma, RoomStatus } from '@prisma/client';
import { PlayerDto } from '../common/dto/player.dto';
import { RoomDetailsDto } from './dto/room-details.dto';
import { RoomPlayersDto } from './dto/room-players.dto';
import { RoomPlayersStats } from './dto/room-players-stats.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => GameService))
    private readonly gameService: GameService
  ) {}

  private readonly DEFAULT_PAGE_SIZE = 9;

  async findAll({
    search,
    page,
    size,
    status,
    privacy,
    userId,
  }: {
    search?: string;
    page?: number;
    size?: number;
    status?: RoomStatus | 'all';
    privacy?: string;
    userId?: string;
  }) {
    const pageNum = page ?? 0;
    const pageSize = size ?? this.DEFAULT_PAGE_SIZE;

    const where: Prisma.RoomWhereInput = {
      ...(search
        ? {
            OR: [
              { name: { contains: search.trim().split(' ').filter(Boolean).join(' & '), mode: 'insensitive' } },
              { code: { contains: search.trim().split(' ').filter(Boolean).join(' | '), mode: 'insensitive' } },
            ],
          }
        : undefined),
      ...(status && status !== 'all' && { status }),
      ...(privacy && privacy !== 'all' && { isPrivate: privacy === 'private' }),
    };

    const includeConfig = {
      creator: true,
      players: {
        omit: { userId: true, roomId: true },
        include: {
          user: { select: { id: true, username: true } },
        },
      },
    };

    const userRoom = userId
      ? await this.prismaService.room.findFirst({
          where: { ...where, players: { some: { userId } } },
          include: includeConfig,
          omit: { creatorId: true },
          orderBy: { name: 'asc' },
        })
      : null;

    const whereOthers: Prisma.RoomWhereInput = userRoom ? { ...where, id: { not: userRoom.id } } : where;

    let skip: number;
    let take: number;

    if (userRoom) {
      if (pageNum === 0) {
        skip = 0;
        take = pageSize - 1;
      } else {
        skip = pageNum * pageSize - 1;
        take = pageSize;
      }
    } else {
      skip = pageNum * pageSize;
      take = pageSize;
    }

    const [rooms, total] = await Promise.all([
      this.prismaService.room.findMany({
        where: whereOthers,
        include: includeConfig,
        omit: { creatorId: true },
        orderBy: { name: 'asc' },
        skip,
        take,
      }),
      this.prismaService.room.count({ where }),
    ]);

    const data = userRoom ? [userRoom, ...rooms] : rooms;

    return {
      data: plainToInstance(RoomDto, data),
      meta: {
        total,
        page: pageNum,
        size: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async findOneDetails(id: string) {
    const currentRoom = await this.prismaService.room.findUnique({
      where: { id },
      include: {
        creator: true,
      },
    });

    if (!currentRoom) {
      throw new NotFoundException(EErrorMessages.ROOM_NOT_FOUND);
    }

    return plainToInstance(RoomDetailsDto, currentRoom, { excludeExtraneousValues: true });
  }

  async findRoomPlayers(id: string) {
    const currentRoom = await this.prismaService.room.findUnique({
      where: { id },
      include: {
        players: {
          where: { isBot: false },
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

    return plainToInstance(RoomPlayersDto, currentRoom, { excludeExtraneousValues: true });
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

      await tx.playerRoomStats.create({
        data: {
          roomId: createdRoom.id,
          userId: creatorId,
          gamesPlayed: 0,
          gamesWon: 0,
          totalPenalty: 0,
          bestScore: 0,
        },
      });

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
      const alreadyPlayer = room.players.some((p) => p.userId === userId);

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

      // 8. Создаем статистику игрока в комнате
      const existingStats = await tx.playerRoomStats.findUnique({
        where: {
          userId_roomId: {
            userId,
            roomId,
          },
        },
      });

      await tx.playerRoomStats.upsert({
        where: {
          userId_roomId: {
            userId,
            roomId,
          },
        },
        create: {
          userId,
          roomId,
          gamesPlayed: 0,
          gamesWon: newPlayer.isWinner ? 1 : 0,
          totalPenalty: newPlayer.totalPenalty,
          bestScore: newPlayer.totalPenalty,
        },
        update: {
          gamesPlayed: { increment: 1 },
          gamesWon: newPlayer.isWinner ? { increment: 1 } : undefined,
          totalPenalty: { increment: newPlayer.totalPenalty },
          bestScore: {
            set:
              existingStats?.bestScore != null
                ? Math.min(newPlayer.totalPenalty, existingStats.bestScore)
                : newPlayer.totalPenalty,
          },
          lastPlayedAt: new Date(),
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

      // 8. Удаляем статистику игрока в комнате
      const existingStats = await tx.playerRoomStats.findUnique({
        where: {
          userId_roomId: {
            userId,
            roomId,
          },
        },
      });

      if (existingStats) {
        await tx.playerRoomStats.delete({
          where: {
            userId_roomId: { userId, roomId },
          },
        });
      }

      // 9. Если комната пустая - удалить её
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
    const playersRoomStats = await this.prismaService.playerRoomStats.findMany({
      where: { roomId },
      include: {
        user: true,
      },
      omit: {
        userId: true,
      },
    });

    if (!playersRoomStats) {
      throw new NotFoundException(EErrorMessages.PLAYER_NOT_FOUND);
    }

    return plainToInstance(RoomPlayersStats, playersRoomStats, { excludeExtraneousValues: true });
  }

  async findPlayerByUserId(roomId: string, userId: string) {
    const player = await this.prismaService.player.findFirst({
      where: {
        userId,
        roomId,
      },
      omit: {
        finalPosition: true,
        totalPenalty: true,
        userId: true,
      },
      include: {
        user: true,
      },
    });

    if (!player) {
      throw new NotFoundException(EErrorMessages.PLAYER_NOT_FOUND);
    }

    return plainToInstance(PlayerDto, player, { excludeExtraneousValues: true });
  }

  async findPlayerById(id: string) {
    const currentPlayer = await this.prismaService.player.findUnique({
      where: { id },
    });

    if (!currentPlayer) {
      throw new NotFoundException(EErrorMessages.PLAYER_NOT_FOUND);
    }

    return plainToInstance(PlayerDto, currentPlayer, { excludeExtraneousValues: true });
  }

  async verifyRoomPassword(roomId: string, password: string, userId?: string): Promise<boolean> {
    const room = await this.prismaService.room.findUnique({
      where: { id: roomId },
      select: {
        id: true,
        isPrivate: true,
        password: true,
        creatorId: true,
      },
    });

    if (!room) {
      throw new NotFoundException(EErrorMessages.ROOM_NOT_FOUND);
    }

    if ((userId && userId === room.creatorId) || !room.isPrivate) {
      return true;
    }

    if (!room.password) {
      throw new BadRequestException(EErrorMessages.ROOM_WITHOUT_PASSWORD);
    }

    return await bcrypt.compare(password, room.password);
  }

  async findRoomByUserId(userId: string) {
    const room = await this.prismaService.room.findFirst({
      where: { players: { some: { userId } } },
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

    if (!room) {
      throw new NotFoundException(EErrorMessages.ROOM_NOT_FOUND);
    }

    return room;
  }

  async checkHasAccess(id: string, userId: string) {
    const currentRoom = await this.prismaService.room.findFirst({
      where: { id },
    });

    if (!currentRoom) {
      throw new NotFoundException(EErrorMessages.ROOM_NOT_FOUND);
    }

    if (!currentRoom.isPrivate) {
      return true;
    } else {
      return currentRoom.creatorId === userId;
    }
  }

  async updateRoom(id: string, userId: string, data: UpdateRoomDto) {
    const currentRoom = await this.prismaService.room.findUnique({
      where: {
        id,
      },
    });

    if (!currentRoom) {
      throw new NotFoundException(EErrorMessages.ROOM_NOT_FOUND);
    }

    if (currentRoom.creatorId !== userId) {
      throw new ForbiddenException(EErrorMessages.ROOM_NOT_ALLOWED);
    }

    if (currentRoom.status === RoomStatus.IN_PROGRESS) {
      throw new BadRequestException(EErrorMessages.ROOM_IS_IN_PROGRESS);
    }

    const updatedRoom = await this.prismaService.room.update({
      where: {
        id,
      },
      data,
      include: {
        creator: true,
      },
    });

    return plainToInstance(RoomDetailsDto, updatedRoom, { excludeExtraneousValues: true });
  }
}
