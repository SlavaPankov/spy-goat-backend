import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { RoomService } from './room.service';
import { PrismaService } from '../prisma/prisma.service';
import { GameService } from '../game/game.service';
import { SocketServerService } from '../socket/socket-server.service';
import { SocketEvent } from '../socket/types/socket-event-enum.types';
import { RoomStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { UpdateRoomDto } from './dto/update-room.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomEntity } from './entities/room.entity';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  genSalt: jest.fn(),
  hash: jest.fn(),
}));

type PrismaMock = {
  room: { findFirst: jest.Mock; findMany: jest.Mock; count: jest.Mock; findUnique: jest.Mock; update: jest.Mock };
  game: { findFirst: jest.Mock };
  playerRoomStats: { findMany: jest.Mock };
  player: { findFirst: jest.Mock; findUnique: jest.Mock };
  $transaction: jest.Mock;
};

type TxMock = {
  player: { findFirst: jest.Mock; create: jest.Mock; update: jest.Mock; delete: jest.Mock };
  room: { findUnique: jest.Mock; create: jest.Mock; update: jest.Mock; delete: jest.Mock };
  playerRoomStats: { create: jest.Mock; findUnique: jest.Mock; upsert: jest.Mock; delete: jest.Mock };
};

type GameServiceMock = { getGameState: jest.Mock };
type SocketServerServiceMock = { emitToRoom: jest.Mock };

const ROOM_ID = 'ROOM_ID';
const USER_ID = 'USER_ID';
const UPDATE_ROOM_DTO: UpdateRoomDto = {
  name: 'Room 1',
  maxPlayers: 4,
  withBots: true,
};
const CREATE_ROOM_DTO: CreateRoomDto = {
  name: 'Room 1',
  code: 'ABC123',
  maxPlayers: 4,
  isPrivate: false,
  password: '',
  withBots: true,
};

describe('RoomService', () => {
  let service: RoomService;
  let prisma: PrismaMock;
  let tx: TxMock;
  let gameService: GameServiceMock;
  let socketServer: SocketServerServiceMock;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma = {
      room: { findFirst: jest.fn(), findMany: jest.fn(), count: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
      game: { findFirst: jest.fn() },
      playerRoomStats: { findMany: jest.fn() },
      player: { findFirst: jest.fn(), findUnique: jest.fn() },
      $transaction: jest.fn(),
    };

    tx = {
      player: { findFirst: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
      room: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
      playerRoomStats: { create: jest.fn(), findUnique: jest.fn(), upsert: jest.fn(), delete: jest.fn() },
    };
    prisma.$transaction.mockImplementation((callback: (tx: TxMock) => unknown) => callback(tx));

    gameService = { getGameState: jest.fn() };
    socketServer = { emitToRoom: jest.fn() };

    service = new RoomService(
      prisma as unknown as PrismaService,
      gameService as unknown as GameService,
      socketServer as unknown as SocketServerService
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('findOneDetails', () => {
    it('throws 404 when the room does not exist', async () => {
      prisma.room.findUnique.mockResolvedValue(null);

      await expect(service.findOneDetails(ROOM_ID)).rejects.toThrow(NotFoundException);
    });

    it('returns the room details dto', async () => {
      prisma.room.findUnique.mockResolvedValue({
        id: ROOM_ID,
        name: 'Room 1',
        code: 'ABC123',
        maxPlayers: 4,
        isPrivate: false,
        status: 'WAITING',
        currentPlayers: 1,
        withBots: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        creator: { id: 'creator-1', username: 'alice' },
      });

      const result = await service.findOneDetails(ROOM_ID);

      expect(prisma.room.findUnique).toHaveBeenCalledWith({ where: { id: ROOM_ID }, include: { creator: true } });
      expect(result).toEqual(expect.objectContaining({ id: ROOM_ID, name: 'Room 1', code: 'ABC123' }));
    });
  });

  describe('findRoomPlayers', () => {
    it('throws 404 when the room does not exist', async () => {
      prisma.room.findUnique.mockResolvedValue(null);

      await expect(service.findRoomPlayers(ROOM_ID)).rejects.toThrow(NotFoundException);
    });

    it('queries only non-bot players ordered by position', async () => {
      prisma.room.findUnique.mockResolvedValue({ id: ROOM_ID, players: [] });

      await service.findRoomPlayers(ROOM_ID);

      expect(prisma.room.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: ROOM_ID },
          include: expect.objectContaining({
            players: expect.objectContaining({ where: { isBot: false }, orderBy: { position: 'asc' } }),
          }),
        })
      );
    });
  });

  describe('notifyPlayerJoined', () => {
    it('fetches room details/players/stats and emits both socket events', async () => {
      const fakeDetails = { id: ROOM_ID } as unknown as Awaited<ReturnType<RoomService['findOneDetails']>>;
      const fakePlayers = { id: ROOM_ID } as unknown as Awaited<ReturnType<RoomService['findRoomPlayers']>>;
      const fakeStats = [] as unknown as Awaited<ReturnType<RoomService['findRoomStats']>>;

      jest.spyOn(service, 'findOneDetails').mockResolvedValue(fakeDetails);
      jest.spyOn(service, 'findRoomPlayers').mockResolvedValue(fakePlayers);
      jest.spyOn(service, 'findRoomStats').mockResolvedValue(fakeStats);

      await service.notifyPlayerJoined(ROOM_ID, 'event-1');

      expect(socketServer.emitToRoom).toHaveBeenCalledWith(
        ROOM_ID,
        SocketEvent.ROOM_PLAYER_JOINED,
        { roomDetails: fakeDetails, roomPlayers: fakePlayers },
        'event-1'
      );
      expect(socketServer.emitToRoom).toHaveBeenCalledWith(
        ROOM_ID,
        SocketEvent.ROOM_STATS_UPDATED,
        { roomStats: fakeStats },
        'event-1'
      );
    });
  });

  describe('findActiveGame', () => {
    it('throws 404 when there is no active game in the room', async () => {
      prisma.game.findFirst.mockResolvedValue(null);

      await expect(service.findActiveGame(ROOM_ID)).rejects.toThrow(NotFoundException);
    });

    it('delegates to GameService.getGameState for the active game', async () => {
      prisma.game.findFirst.mockResolvedValue({ id: 'game-1' });
      const fakeGameState = { gameId: 'game-1' };
      gameService.getGameState.mockResolvedValue(fakeGameState);

      const result = await service.findActiveGame(ROOM_ID);

      expect(gameService.getGameState).toHaveBeenCalledWith('game-1');
      expect(result).toBe(fakeGameState);
    });
  });

  describe('findRoomStats', () => {
    it('returns the mapped stats list for the room', async () => {
      prisma.playerRoomStats.findMany.mockResolvedValue([
        {
          userId: 'u1',
          roomId: ROOM_ID,
          gamesPlayed: 3,
          gamesWon: 1,
          totalPenalty: 40,
          bestScore: 10,
          user: { username: 'alice' },
        },
      ]);

      const result = await service.findRoomStats(ROOM_ID);

      expect(prisma.playerRoomStats.findMany).toHaveBeenCalledWith({
        where: { roomId: ROOM_ID },
        include: { user: true },
        omit: { userId: true },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('findPlayerByUserId', () => {
    it('throws 404 when the player is not in the room', async () => {
      prisma.player.findFirst.mockResolvedValue(null);

      await expect(service.findPlayerByUserId(ROOM_ID, USER_ID)).rejects.toThrow(NotFoundException);
    });

    it('returns the player dto', async () => {
      prisma.player.findFirst.mockResolvedValue({
        id: 'player-1',
        roomId: ROOM_ID,
        isBot: false,
        position: 1,
        user: { username: 'alice' },
      });

      const result = await service.findPlayerByUserId(ROOM_ID, USER_ID);

      expect(prisma.player.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: USER_ID, roomId: ROOM_ID } })
      );
      expect(result).toEqual(expect.objectContaining({ id: 'player-1' }));
    });
  });

  describe('findPlayerById', () => {
    it('throws 404 when the player does not exist', async () => {
      prisma.player.findUnique.mockResolvedValue(null);

      await expect(service.findPlayerById('player-1')).rejects.toThrow(NotFoundException);
    });

    it('returns the player dto', async () => {
      prisma.player.findUnique.mockResolvedValue({ id: 'player-1', isBot: false, position: 1 });

      const result = await service.findPlayerById('player-1');

      expect(result).toEqual(expect.objectContaining({ id: 'player-1' }));
    });
  });

  describe('verifyRoomPassword', () => {
    it('throws 404 when the room does not exist', async () => {
      prisma.room.findUnique.mockResolvedValue(null);

      await expect(service.verifyRoomPassword(ROOM_ID, 'pw')).rejects.toThrow(NotFoundException);
    });

    it('grants access to the room creator without checking the password', async () => {
      prisma.room.findUnique.mockResolvedValue({
        id: ROOM_ID,
        isPrivate: true,
        password: 'hashed',
        creatorId: 'creator-1',
      });

      const result = await service.verifyRoomPassword(ROOM_ID, 'wrong', 'creator-1');

      expect(result).toBe(true);
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('grants access to any caller when the room is not private', async () => {
      prisma.room.findUnique.mockResolvedValue({
        id: ROOM_ID,
        isPrivate: false,
        password: null,
        creatorId: 'creator-1',
      });

      const result = await service.verifyRoomPassword(ROOM_ID, 'anything', 'someone-else');

      expect(result).toBe(true);
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('throws 400 when the room is private but has no password set', async () => {
      prisma.room.findUnique.mockResolvedValue({
        id: ROOM_ID,
        isPrivate: true,
        password: null,
        creatorId: 'creator-1',
      });

      await expect(service.verifyRoomPassword(ROOM_ID, 'pw', 'someone-else')).rejects.toThrow(BadRequestException);
    });

    it('compares against the stored password hash for a non-creator', async () => {
      prisma.room.findUnique.mockResolvedValue({
        id: ROOM_ID,
        isPrivate: true,
        password: 'hashed',
        creatorId: 'creator-1',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.verifyRoomPassword(ROOM_ID, 'correct-pw', 'someone-else');

      expect(bcrypt.compare).toHaveBeenCalledWith('correct-pw', 'hashed');
      expect(result).toBe(true);
    });
  });

  describe('findRoomByUserId', () => {
    it('throws 404 when the user is not in any room', async () => {
      prisma.room.findFirst.mockResolvedValue(null);

      await expect(service.findRoomByUserId(USER_ID)).rejects.toThrow(NotFoundException);
    });

    it('returns the raw room record', async () => {
      const room = { id: ROOM_ID, players: [] };
      prisma.room.findFirst.mockResolvedValue(room);

      const result = await service.findRoomByUserId(USER_ID);

      expect(prisma.room.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { players: { some: { userId: USER_ID } } } })
      );
      expect(result).toBe(room);
    });
  });

  describe('checkHasAccess', () => {
    it('throws 404 when the room does not exist', async () => {
      prisma.room.findFirst.mockResolvedValue(null);

      await expect(service.checkHasAccess(ROOM_ID, USER_ID)).rejects.toThrow(NotFoundException);
    });

    it('grants access to public rooms for anyone', async () => {
      prisma.room.findFirst.mockResolvedValue({ isPrivate: false, creatorId: 'someone-else' });

      await expect(service.checkHasAccess(ROOM_ID, USER_ID)).resolves.toBe(true);
    });

    it('grants access to a private room only for its creator', async () => {
      prisma.room.findFirst.mockResolvedValue({ isPrivate: true, creatorId: USER_ID });

      await expect(service.checkHasAccess(ROOM_ID, USER_ID)).resolves.toBe(true);
    });

    it('denies access to a private room for a non-creator', async () => {
      prisma.room.findFirst.mockResolvedValue({ isPrivate: true, creatorId: 'someone-else' });

      await expect(service.checkHasAccess(ROOM_ID, USER_ID)).resolves.toBe(false);
    });
  });

  describe('updateRoom', () => {
    it('throws 404 when the room does not exist', async () => {
      prisma.room.findUnique.mockResolvedValue(null);

      await expect(service.updateRoom(ROOM_ID, USER_ID, UPDATE_ROOM_DTO)).rejects.toThrow(NotFoundException);
    });

    it('throws 403 when the caller is not the room creator', async () => {
      prisma.room.findUnique.mockResolvedValue({ creatorId: 'someone-else', status: RoomStatus.WAITING });

      await expect(service.updateRoom(ROOM_ID, USER_ID, UPDATE_ROOM_DTO)).rejects.toThrow(ForbiddenException);
    });

    it('throws 400 when the room already started', async () => {
      prisma.room.findUnique.mockResolvedValue({ creatorId: USER_ID, status: RoomStatus.IN_PROGRESS });

      await expect(service.updateRoom(ROOM_ID, USER_ID, UPDATE_ROOM_DTO)).rejects.toThrow(BadRequestException);
    });

    it('updates the room and returns the details dto', async () => {
      prisma.room.findUnique.mockResolvedValue({ creatorId: USER_ID, status: RoomStatus.WAITING });
      prisma.room.update.mockResolvedValue({
        id: ROOM_ID,
        name: 'New name',
        code: 'ABC',
        maxPlayers: 4,
        isPrivate: false,
        status: 'WAITING',
        currentPlayers: 2,
        withBots: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        creator: { username: 'alice' },
      });

      const dto: UpdateRoomDto = { ...UPDATE_ROOM_DTO, name: 'New name' };
      const result = await service.updateRoom(ROOM_ID, USER_ID, dto);

      expect(prisma.room.update).toHaveBeenCalledWith({
        where: { id: ROOM_ID },
        data: dto,
        include: { creator: true },
      });
      expect(result).toEqual(expect.objectContaining({ id: ROOM_ID, name: 'New name' }));
    });
  });

  describe('findAll', () => {
    it('uses default paging when no page/size/userId are given', async () => {
      prisma.room.findMany.mockResolvedValue([]);
      prisma.room.count.mockResolvedValue(0);

      await service.findAll({});

      expect(prisma.room.findFirst).not.toHaveBeenCalled();
      expect(prisma.room.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: {}, skip: 0, take: 9 }));
      expect(prisma.room.count).toHaveBeenCalledWith({ where: {} });
    });

    it('builds AND/OR search clauses for name and code from a multi-word query', async () => {
      prisma.room.findMany.mockResolvedValue([]);
      prisma.room.count.mockResolvedValue(0);

      await service.findAll({ search: 'foo bar' });

      expect(prisma.room.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { name: { contains: 'foo & bar', mode: 'insensitive' } },
              { code: { contains: 'foo | bar', mode: 'insensitive' } },
            ],
          },
        })
      );
    });

    it('filters by status unless it is "all"', async () => {
      prisma.room.findMany.mockResolvedValue([]);
      prisma.room.count.mockResolvedValue(0);

      await service.findAll({ status: RoomStatus.WAITING });
      expect(prisma.room.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { status: RoomStatus.WAITING } })
      );

      prisma.room.findMany.mockClear();
      await service.findAll({ status: 'all' });
      expect(prisma.room.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: {} }));
    });

    it('filters by privacy unless it is "all"', async () => {
      prisma.room.findMany.mockResolvedValue([]);
      prisma.room.count.mockResolvedValue(0);

      await service.findAll({ privacy: 'private' });
      expect(prisma.room.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { isPrivate: true } }));

      prisma.room.findMany.mockClear();
      await service.findAll({ privacy: 'public' });
      expect(prisma.room.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { isPrivate: false } }));

      prisma.room.findMany.mockClear();
      await service.findAll({ privacy: 'all' });
      expect(prisma.room.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: {} }));
    });

    it("pins the caller's own room first, excludes it from the rest, and takes one fewer slot on page 0", async () => {
      const userRoom = { id: 'my-room' };
      prisma.room.findFirst.mockResolvedValue(userRoom);
      prisma.room.findMany.mockResolvedValue([{ id: 'other-1' }]);
      prisma.room.count.mockResolvedValue(5);

      const result = await service.findAll({ userId: USER_ID, page: 0 });

      expect(prisma.room.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { players: { some: { userId: USER_ID } } } })
      );
      expect(prisma.room.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: { not: 'my-room' } }, skip: 0, take: 8 })
      );
      expect(result.data).toEqual([userRoom, { id: 'other-1' }]);
    });

    it('uses page*size-1/size paging for the caller-room case on later pages', async () => {
      prisma.room.findFirst.mockResolvedValue({ id: 'my-room' });
      prisma.room.findMany.mockResolvedValue([]);
      prisma.room.count.mockResolvedValue(0);

      await service.findAll({ userId: USER_ID, page: 2, size: 10 });

      expect(prisma.room.findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 19, take: 10 }));
    });

    it('falls back to plain paging when the caller has no room of their own', async () => {
      prisma.room.findFirst.mockResolvedValue(null);
      prisma.room.findMany.mockResolvedValue([{ id: 'other-1' }]);
      prisma.room.count.mockResolvedValue(1);

      const result = await service.findAll({ userId: USER_ID, page: 1, size: 10 });

      expect(prisma.room.findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 10, take: 10 }));
      expect(result.data).toEqual([{ id: 'other-1' }]);
    });

    it('computes totalPages from the total count and page size', async () => {
      prisma.room.findMany.mockResolvedValue([]);
      prisma.room.count.mockResolvedValue(21);

      const result = await service.findAll({ size: 10 });

      expect(result.meta).toEqual({ total: 21, page: 0, size: 10, totalPages: 3 });
    });
  });

  describe('create', () => {
    it('throws 400 when the creator is already in an active room', async () => {
      tx.player.findFirst.mockResolvedValue({ room: { name: 'Existing Room' } });

      await expect(service.create(CREATE_ROOM_DTO, USER_ID)).rejects.toThrow(BadRequestException);
    });

    it('throws 400 when the room code is already taken', async () => {
      tx.player.findFirst.mockResolvedValue(null);
      tx.room.findUnique.mockResolvedValue({ id: 'existing-room' });

      await expect(service.create(CREATE_ROOM_DTO, USER_ID)).rejects.toThrow(BadRequestException);
    });

    it('hashes the password when the room is private', async () => {
      tx.player.findFirst.mockResolvedValue(null);
      tx.room.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce({
        id: ROOM_ID,
        name: 'Room 1',
        code: 'ABC123',
        maxPlayers: 4,
        isPrivate: true,
        creatorId: USER_ID,
        status: 'WAITING',
      });
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-pw');
      tx.room.create.mockResolvedValue({ id: ROOM_ID });
      tx.player.create.mockResolvedValue({});
      tx.playerRoomStats.create.mockResolvedValue({});

      await service.create({ ...CREATE_ROOM_DTO, isPrivate: true, password: 'secret' }, USER_ID);

      expect(bcrypt.hash).toHaveBeenCalledWith('secret', 'salt');
      const [createArgs] = tx.room.create.mock.calls[0] as [{ data: { password?: string } }];
      expect(createArgs.data.password).toBe('hashed-pw');
    });

    it('uses CRYPT_SALT from the environment when hashing a private room password', async () => {
      const originalSalt = process.env.CRYPT_SALT;
      process.env.CRYPT_SALT = '12';

      tx.player.findFirst.mockResolvedValue(null);
      tx.room.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce({
        id: ROOM_ID,
        name: 'Room 1',
        code: 'ABC123',
        maxPlayers: 4,
        isPrivate: true,
        creatorId: USER_ID,
        status: 'WAITING',
      });
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-pw');
      tx.room.create.mockResolvedValue({ id: ROOM_ID });
      tx.player.create.mockResolvedValue({});
      tx.playerRoomStats.create.mockResolvedValue({});

      await service.create({ ...CREATE_ROOM_DTO, isPrivate: true, password: 'secret' }, USER_ID);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(12);

      process.env.CRYPT_SALT = originalSalt;
    });

    it('defaults withBots to true when it is omitted from the dto', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { withBots: _withBots, ...dtoWithoutWithBots } = CREATE_ROOM_DTO;

      tx.player.findFirst.mockResolvedValue(null);
      tx.room.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce({
        id: ROOM_ID,
        name: 'Room 1',
        code: 'ABC123',
        maxPlayers: 4,
        isPrivate: false,
        creatorId: USER_ID,
        status: 'WAITING',
      });
      tx.room.create.mockResolvedValue({ id: ROOM_ID });
      tx.player.create.mockResolvedValue({});
      tx.playerRoomStats.create.mockResolvedValue({});

      await service.create(dtoWithoutWithBots as CreateRoomDto, USER_ID);

      expect(tx.room.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ withBots: true }) })
      );
    });

    it('does not hash a password for a public room', async () => {
      tx.player.findFirst.mockResolvedValue(null);
      tx.room.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce({
        id: ROOM_ID,
        name: 'Room 1',
        code: 'ABC123',
        maxPlayers: 4,
        isPrivate: false,
        creatorId: USER_ID,
        status: 'WAITING',
      });
      tx.room.create.mockResolvedValue({ id: ROOM_ID });
      tx.player.create.mockResolvedValue({});
      tx.playerRoomStats.create.mockResolvedValue({});

      await service.create(CREATE_ROOM_DTO, USER_ID);

      expect(bcrypt.hash).not.toHaveBeenCalled();
      const [createArgs] = tx.room.create.mock.calls[0] as [{ data: { password?: string } }];
      expect(createArgs.data.password).toBeUndefined();
    });

    it('creates the room, adds the creator as the first player, and seeds zeroed stats', async () => {
      tx.player.findFirst.mockResolvedValue(null);
      tx.room.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce({
        id: ROOM_ID,
        name: 'Room 1',
        code: 'ABC123',
        maxPlayers: 4,
        isPrivate: false,
        creatorId: USER_ID,
        status: 'WAITING',
      });
      tx.room.create.mockResolvedValue({ id: ROOM_ID });
      tx.player.create.mockResolvedValue({});
      tx.playerRoomStats.create.mockResolvedValue({});

      const result = await service.create(CREATE_ROOM_DTO, USER_ID);

      expect(tx.room.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: 'Room 1',
            code: 'ABC123',
            maxPlayers: 4,
            withBots: true,
            currentPlayers: 1,
            isPrivate: false,
            creator: { connect: { id: USER_ID } },
          }),
        })
      );
      expect(tx.player.create).toHaveBeenCalledWith({
        data: { room: { connect: { id: ROOM_ID } }, user: { connect: { id: USER_ID } }, position: 1 },
      });
      expect(tx.playerRoomStats.create).toHaveBeenCalledWith({
        data: { roomId: ROOM_ID, userId: USER_ID, gamesPlayed: 0, gamesWon: 0, totalPenalty: 0, bestScore: 0 },
      });
      expect(result).toBeInstanceOf(RoomEntity);
      expect(result).toEqual(expect.objectContaining({ id: ROOM_ID, name: 'Room 1' }));
    });

    it('throws 404 if the room cannot be re-fetched right after creation', async () => {
      tx.player.findFirst.mockResolvedValue(null);
      tx.room.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
      tx.room.create.mockResolvedValue({ id: ROOM_ID });
      tx.player.create.mockResolvedValue({});

      await expect(service.create(CREATE_ROOM_DTO, USER_ID)).rejects.toThrow(NotFoundException);
    });
  });

  describe('join', () => {
    it('throws 400 when the user is already in an active room', async () => {
      tx.player.findFirst.mockResolvedValue({ room: { name: 'Other Room' } });

      await expect(service.join(ROOM_ID, USER_ID)).rejects.toThrow(BadRequestException);
    });

    it('throws 404 when the room does not exist', async () => {
      tx.player.findFirst.mockResolvedValue(null);
      tx.room.findUnique.mockResolvedValue(null);

      await expect(service.join(ROOM_ID, USER_ID)).rejects.toThrow(NotFoundException);
    });

    it('throws 400 when the room already started', async () => {
      tx.player.findFirst.mockResolvedValue(null);
      tx.room.findUnique.mockResolvedValue({ status: 'IN_PROGRESS', currentPlayers: 1, maxPlayers: 4, players: [] });

      await expect(service.join(ROOM_ID, USER_ID)).rejects.toThrow(BadRequestException);
    });

    it('throws 400 when the room is full', async () => {
      tx.player.findFirst.mockResolvedValue(null);
      tx.room.findUnique.mockResolvedValue({ status: 'WAITING', currentPlayers: 4, maxPlayers: 4, players: [] });

      await expect(service.join(ROOM_ID, USER_ID)).rejects.toThrow(BadRequestException);
    });

    it('throws 400 when the user is already a player in this room', async () => {
      tx.player.findFirst.mockResolvedValue(null);
      tx.room.findUnique.mockResolvedValue({
        status: 'WAITING',
        currentPlayers: 1,
        maxPlayers: 4,
        players: [{ userId: USER_ID, position: 1 }],
      });

      await expect(service.join(ROOM_ID, USER_ID)).rejects.toThrow(BadRequestException);
    });

    it('assigns the first free position, skipping gaps', async () => {
      tx.player.findFirst.mockResolvedValue(null);
      tx.room.findUnique.mockResolvedValue({
        status: 'WAITING',
        currentPlayers: 2,
        maxPlayers: 4,
        players: [
          { userId: 'p1', position: 1 },
          { userId: 'p2', position: 3 },
        ],
      });
      tx.player.create.mockResolvedValue({ id: 'new-player', isWinner: false, totalPenalty: 0 });
      tx.room.update.mockResolvedValue({});
      tx.playerRoomStats.findUnique.mockResolvedValue(null);
      tx.playerRoomStats.upsert.mockResolvedValue({});

      await service.join(ROOM_ID, USER_ID);

      expect(tx.player.create).toHaveBeenCalledWith({
        data: { room: { connect: { id: ROOM_ID } }, user: { connect: { id: USER_ID } }, position: 2 },
      });
      expect(tx.room.update).toHaveBeenCalledWith({
        where: { id: ROOM_ID },
        data: { currentPlayers: { increment: 1 } },
      });
    });

    it('creates a fresh stats row when none exists yet', async () => {
      tx.player.findFirst.mockResolvedValue(null);
      tx.room.findUnique.mockResolvedValue({ status: 'WAITING', currentPlayers: 0, maxPlayers: 4, players: [] });
      tx.player.create.mockResolvedValue({ id: 'new-player', isWinner: false, totalPenalty: 0 });
      tx.room.update.mockResolvedValue({});
      tx.playerRoomStats.findUnique.mockResolvedValue(null);
      tx.playerRoomStats.upsert.mockResolvedValue({});

      await service.join(ROOM_ID, USER_ID);

      expect(tx.playerRoomStats.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: { userId: USER_ID, roomId: ROOM_ID, gamesPlayed: 0, gamesWon: 0, totalPenalty: 0, bestScore: 0 },
        })
      );
    });

    it('credits gamesWon when the joining player record is flagged as a winner', async () => {
      tx.player.findFirst.mockResolvedValue(null);
      tx.room.findUnique.mockResolvedValue({ status: 'WAITING', currentPlayers: 0, maxPlayers: 4, players: [] });
      tx.player.create.mockResolvedValue({ id: 'new-player', isWinner: true, totalPenalty: 0 });
      tx.room.update.mockResolvedValue({});
      tx.playerRoomStats.findUnique.mockResolvedValue(null);
      tx.playerRoomStats.upsert.mockResolvedValue({});

      await service.join(ROOM_ID, USER_ID);

      expect(tx.playerRoomStats.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({ gamesWon: 1 }),
          update: expect.objectContaining({ gamesWon: { increment: 1 } }),
        })
      );
    });

    it('keeps the lower of the previous and current bestScore when stats already exist', async () => {
      tx.player.findFirst.mockResolvedValue(null);
      tx.room.findUnique.mockResolvedValue({ status: 'WAITING', currentPlayers: 0, maxPlayers: 4, players: [] });
      tx.player.create.mockResolvedValue({ id: 'new-player', isWinner: false, totalPenalty: 15 });
      tx.room.update.mockResolvedValue({});
      tx.playerRoomStats.findUnique.mockResolvedValue({ bestScore: 8 });
      tx.playerRoomStats.upsert.mockResolvedValue({});

      await service.join(ROOM_ID, USER_ID);

      expect(tx.playerRoomStats.upsert).toHaveBeenCalledWith(
        expect.objectContaining({ update: expect.objectContaining({ bestScore: { set: 8 } }) })
      );
    });
  });

  describe('exit', () => {
    it('throws 404 when the room does not exist', async () => {
      tx.room.findUnique.mockResolvedValue(null);

      await expect(service.exit(ROOM_ID, USER_ID)).rejects.toThrow(NotFoundException);
    });

    it('throws 400 when the caller is not a player in the room', async () => {
      tx.room.findUnique.mockResolvedValue({ status: 'WAITING', creatorId: 'someone-else', players: [] });

      await expect(service.exit(ROOM_ID, USER_ID)).rejects.toThrow(BadRequestException);
    });

    it('throws 400 when the game has already started', async () => {
      tx.room.findUnique.mockResolvedValue({
        status: 'IN_PROGRESS',
        creatorId: 'someone-else',
        players: [{ id: 'p1', userId: USER_ID, position: 1 }],
      });

      await expect(service.exit(ROOM_ID, USER_ID)).rejects.toThrow(BadRequestException);
    });

    it('removes the player, decrements currentPlayers, and renumbers remaining positions sequentially', async () => {
      tx.room.findUnique.mockResolvedValue({
        status: 'WAITING',
        creatorId: 'someone-else',
        players: [
          { id: 'p1', userId: USER_ID, position: 1 },
          { id: 'p2', userId: 'other', position: 2 },
          { id: 'p3', userId: 'third', position: 4 },
        ],
      });
      tx.player.delete.mockResolvedValue({});
      tx.room.update.mockResolvedValue({});
      tx.player.update.mockResolvedValue({});
      tx.playerRoomStats.findUnique.mockResolvedValue(null);

      await service.exit(ROOM_ID, USER_ID);

      expect(tx.player.delete).toHaveBeenCalledWith({ where: { id: 'p1' } });
      expect(tx.room.update).toHaveBeenCalledWith({
        where: { id: ROOM_ID },
        data: { currentPlayers: { decrement: 1 } },
      });
      expect(tx.player.update).toHaveBeenNthCalledWith(1, { where: { id: 'p2' }, data: { position: 1 } });
      expect(tx.player.update).toHaveBeenNthCalledWith(2, { where: { id: 'p3' }, data: { position: 2 } });
    });

    it('transfers ownership to the next remaining human player when the creator leaves', async () => {
      tx.room.findUnique.mockResolvedValue({
        status: 'WAITING',
        creatorId: USER_ID,
        players: [
          { id: 'p1', userId: USER_ID, position: 1 },
          { id: 'p2', userId: 'next-owner', position: 2 },
        ],
      });
      tx.player.delete.mockResolvedValue({});
      tx.room.update.mockResolvedValue({});
      tx.player.update.mockResolvedValue({});
      tx.playerRoomStats.findUnique.mockResolvedValue(null);

      await service.exit(ROOM_ID, USER_ID);

      expect(tx.room.update).toHaveBeenCalledWith({ where: { id: ROOM_ID }, data: { creatorId: 'next-owner' } });
    });

    it('throws 400 when ownership would have to transfer to a bot', async () => {
      tx.room.findUnique.mockResolvedValue({
        status: 'WAITING',
        creatorId: USER_ID,
        players: [
          { id: 'p1', userId: USER_ID, position: 1 },
          { id: 'bot-1', userId: null, position: 2 },
        ],
      });
      tx.player.delete.mockResolvedValue({});
      tx.room.update.mockResolvedValue({});
      tx.player.update.mockResolvedValue({});

      await expect(service.exit(ROOM_ID, USER_ID)).rejects.toThrow(BadRequestException);
    });

    it('does not transfer ownership when a non-creator leaves', async () => {
      tx.room.findUnique.mockResolvedValue({
        status: 'WAITING',
        creatorId: 'the-creator',
        players: [
          { id: 'p1', userId: USER_ID, position: 1 },
          { id: 'p2', userId: 'the-creator', position: 2 },
        ],
      });
      tx.player.delete.mockResolvedValue({});
      tx.room.update.mockResolvedValue({});
      tx.player.update.mockResolvedValue({});
      tx.playerRoomStats.findUnique.mockResolvedValue(null);

      await service.exit(ROOM_ID, USER_ID);

      expect(tx.room.update).toHaveBeenCalledTimes(1);
    });

    it('deletes the leftover per-room stats row if one exists', async () => {
      tx.room.findUnique.mockResolvedValue({
        status: 'WAITING',
        creatorId: 'someone-else',
        players: [
          { id: 'p1', userId: USER_ID, position: 1 },
          { id: 'p2', userId: 'other', position: 2 },
        ],
      });
      tx.player.delete.mockResolvedValue({});
      tx.room.update.mockResolvedValue({});
      tx.player.update.mockResolvedValue({});
      tx.playerRoomStats.findUnique.mockResolvedValue({ userId: USER_ID, roomId: ROOM_ID });
      tx.playerRoomStats.delete.mockResolvedValue({});

      await service.exit(ROOM_ID, USER_ID);

      expect(tx.playerRoomStats.delete).toHaveBeenCalledWith({
        where: { userId_roomId: { userId: USER_ID, roomId: ROOM_ID } },
      });
    });

    it('skips the stats delete when no stats row exists', async () => {
      tx.room.findUnique.mockResolvedValue({
        status: 'WAITING',
        creatorId: 'someone-else',
        players: [
          { id: 'p1', userId: USER_ID, position: 1 },
          { id: 'p2', userId: 'other', position: 2 },
        ],
      });
      tx.player.delete.mockResolvedValue({});
      tx.room.update.mockResolvedValue({});
      tx.player.update.mockResolvedValue({});
      tx.playerRoomStats.findUnique.mockResolvedValue(null);

      await service.exit(ROOM_ID, USER_ID);

      expect(tx.playerRoomStats.delete).not.toHaveBeenCalled();
    });

    it('deletes the room entirely and reports it when the last player leaves', async () => {
      tx.room.findUnique.mockResolvedValue({
        status: 'WAITING',
        creatorId: USER_ID,
        players: [{ id: 'p1', userId: USER_ID, position: 1 }],
      });
      tx.player.delete.mockResolvedValue({});
      tx.room.update.mockResolvedValue({});
      tx.playerRoomStats.findUnique.mockResolvedValue(null);
      tx.room.delete.mockResolvedValue({});

      const result = await service.exit(ROOM_ID, USER_ID);

      expect(tx.room.delete).toHaveBeenCalledWith({ where: { id: ROOM_ID } });
      expect(result).toEqual({ deleted: true, message: 'Room deleted (empty)' });
    });

    it('returns a success message when other players remain', async () => {
      tx.room.findUnique.mockResolvedValue({
        status: 'WAITING',
        creatorId: 'someone-else',
        players: [
          { id: 'p1', userId: USER_ID, position: 1 },
          { id: 'p2', userId: 'other', position: 2 },
        ],
      });
      tx.player.delete.mockResolvedValue({});
      tx.room.update.mockResolvedValue({});
      tx.player.update.mockResolvedValue({});
      tx.playerRoomStats.findUnique.mockResolvedValue(null);

      const result = await service.exit(ROOM_ID, USER_ID);

      expect(tx.room.delete).not.toHaveBeenCalled();
      expect(result).toEqual({ success: true, message: 'Successfully left the room' });
    });
  });
});
