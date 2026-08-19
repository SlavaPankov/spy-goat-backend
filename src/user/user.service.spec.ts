import { HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { EErrorMessages } from '../types/enums/errorMessage';
import { UserEntity } from './entities/user.entity';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  genSalt: jest.fn(),
  hash: jest.fn(),
}));

import * as bcrypt from 'bcryptjs';

type PrismaMock = {
  user: { findMany: jest.Mock; count: jest.Mock; findUnique: jest.Mock; create: jest.Mock };
  $transaction: jest.Mock;
};

const CALLER_ID = 'CALLER_ID';

interface UserFixture {
  id: string;
  username: string;
  version: number;
  name: string | null;
  surname: string | null;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;
  isOnline: boolean;
  lastSeenAt: Date | null;
  password: string;
}

const buildUser = (overrides: Partial<UserFixture> = {}): UserFixture => ({
  id: 'user-1',
  username: 'alice',
  version: 1,
  name: null,
  surname: null,
  email: null,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-02T00:00:00Z'),
  isOnline: false,
  lastSeenAt: null,
  password: 'hashed',
  ...overrides,
});

const CREATE_USER_DTO: CreateUserDto = {
  username: 'newuser',
  password: 'password123',
  confirmPassword: 'password123',
};

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaMock;

  beforeEach(() => {
    jest.clearAllMocks();

    prisma = {
      user: { findMany: jest.fn(), count: jest.fn(), findUnique: jest.fn(), create: jest.fn() },
      $transaction: jest.fn(),
    };

    service = new UserService(prisma as unknown as PrismaService);
  });

  describe('findAll', () => {
    it('excludes the caller and returns the mapped list with count', async () => {
      prisma.$transaction.mockResolvedValue([[buildUser({ id: 'u1' })], 1]);

      const result = await service.findAll(CALLER_ID, { limit: 10, offset: 0 });

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: { not: CALLER_ID } }, skip: 0, take: 10 })
      );
      expect(result.users).toHaveLength(1);
      expect(result.count).toBe(1);
    });

    it('filters by trimmed username when a search term is provided', async () => {
      prisma.$transaction.mockResolvedValue([[], 0]);

      await service.findAll(CALLER_ID, { limit: 10, offset: 0, search: '  bob  ' });

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: { not: CALLER_ID }, username: { contains: 'bob', mode: 'insensitive' } },
        })
      );
    });

    it('ignores a whitespace-only search term', async () => {
      prisma.$transaction.mockResolvedValue([[], 0]);

      await service.findAll(CALLER_ID, { limit: 10, offset: 0, search: '   ' });

      expect(prisma.user.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { id: { not: CALLER_ID } } }));
    });
  });

  describe('findOne', () => {
    it('throws 404 when the user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toThrow(EErrorMessages.USER_NOT_FOUND);
    });

    it('returns the user entity', async () => {
      prisma.user.findUnique.mockResolvedValue(buildUser({ id: 'user-1', username: 'alice' }));

      const result = await service.findOne('user-1');

      expect(result).toBeInstanceOf(UserEntity);
      expect(result).toEqual(expect.objectContaining({ id: 'user-1', username: 'alice' }));
    });

    it('formats a present lastSeenAt as an ISO string', async () => {
      prisma.user.findUnique.mockResolvedValue(
        buildUser({ id: 'user-1', username: 'alice', lastSeenAt: new Date('2026-01-01T00:00:00Z') })
      );

      const result = await service.findOne('user-1');

      expect(result.lastSeenAt).toBe('2026-01-01T00:00:00.000Z');
    });
  });

  describe('create', () => {
    it('throws 400 when the passwords do not match', async () => {
      await expect(service.create({ ...CREATE_USER_DTO, confirmPassword: 'different' })).rejects.toThrow(HttpException);
    });

    it('throws 400 when the username is already taken', async () => {
      prisma.user.findUnique.mockResolvedValue(buildUser({ username: CREATE_USER_DTO.username }));

      await expect(service.create(CREATE_USER_DTO)).rejects.toThrow(HttpException);
    });

    it('hashes the password and creates the user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-pw');
      prisma.user.create.mockResolvedValue(buildUser({ username: 'newuser', password: 'hashed-pw' }));

      const result = await service.create(CREATE_USER_DTO);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          username: 'newuser',
          password: 'hashed-pw',
          surname: undefined,
          name: undefined,
          email: undefined,
        },
      });
      expect(result).toBeInstanceOf(UserEntity);
      expect(result).toEqual(expect.objectContaining({ username: 'newuser' }));
    });

    it('uses CRYPT_SALT from the environment when hashing the password', async () => {
      const originalSalt = process.env.CRYPT_SALT;
      process.env.CRYPT_SALT = '12';

      prisma.user.findUnique.mockResolvedValue(null);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-pw');
      prisma.user.create.mockResolvedValue(buildUser({ username: 'newuser', password: 'hashed-pw' }));

      await service.create(CREATE_USER_DTO);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(12);

      process.env.CRYPT_SALT = originalSalt;
    });
  });
});
