import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EErrorMessages } from '../types/enums/errorMessage';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomEntity } from './entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.room.findMany();
  }

  async findOne(id: string) {
    const currentRoom = await this.prismaService.room.findUnique({
      where: { id },
      include: {
        creator: true,
        players: {
          omit: {
            userId: true,
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
    });

    if (!currentRoom) {
      throw new NotFoundException(EErrorMessages.ROOM_NOT_FOUND);
    }

    return currentRoom;
  }

  async create(dto: CreateRoomDto, creatorId: string) {
    const { name, code, maxPlayers, isPrivate } = dto;

    const existingRoom = await this.prismaService.room.findUnique({
      where: { code },
    });

    if (existingRoom) {
      throw new BadRequestException(EErrorMessages.ROOM_ALREADY_EXISTS);
    }

    const createdRoom = await this.prismaService.room.create({
      data: {
        name,
        code,
        maxPlayers,
        isPrivate,
        creator: {
          connect: { id: creatorId },
        },
      },
    });

    return new RoomEntity(createdRoom);
  }

  async join(roomId: string, userId: string) {
    return this.prismaService.$transaction(async (tx) => {
      // 1. Проверяем комнату
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

      // 2. Проверяем, что пользователь ещё не в комнате
      const alreadyPlayer = room.players.find((p) => p.userId === userId);

      if (alreadyPlayer) {
        throw new BadRequestException(EErrorMessages.ALREADY_IN_ROOM);
      }

      // 3. Проверяем лимит игроков
      if (room.players.length >= room.maxPlayers) {
        throw new BadRequestException(EErrorMessages.ROOM_IS_FULL);
      }

      // 4. Определяем позицию
      const position = room.players.length + 1;

      // 5. Создаём Player

      return tx.player.create({
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

      // 5. Перенумеровываем позиции оставшихся игроков
      const remainingPlayers = room.players.filter((p) => p.id !== player.id).sort((a, b) => a.position - b.position);

      for (let i = 0; i < remainingPlayers.length; i++) {
        await tx.player.update({
          where: { id: remainingPlayers[i].id },
          data: { position: i + 1 },
        });
      }

      // 6. Если создатель вышел и есть другие игроки - передать права
      if (room.creatorId === userId && remainingPlayers.length > 0) {
        await tx.room.update({
          where: { id: roomId },
          data: {
            creatorId: remainingPlayers[0].userId as string,
          },
        });
      }

      // 7. Если комната пустая - удалить её
      if (remainingPlayers.length === 0) {
        await tx.room.delete({
          where: { id: roomId },
        });

        return { deleted: true, message: 'Room deleted (empty)' };
      }

      return { success: true, message: 'Successfully left the room' };
    });
  }
}
