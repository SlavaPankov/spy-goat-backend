import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AuthService, User } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SocketServerService } from '../socket/socket-server.service';
import { compare } from 'bcryptjs';
import { CreateUserDto } from '../user/dto/create-user.dto';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

type PrismaMock = {
  user: { findUnique: jest.Mock };
  token: { findUnique: jest.Mock; delete: jest.Mock; upsert: jest.Mock };
};

type UserServiceMock = { create: jest.Mock; findOne: jest.Mock };
type JwtServiceMock = { signAsync: jest.Mock };
type ConfigServiceMock = { get: jest.Mock };

const USER_ID = 'USER_ID';
const USERNAME = 'test_user';

const CONFIG_MAP: Record<string, string> = {
  JWT_SECRET_KEY: 'access-secret',
  TOKEN_EXPIRE_TIME: '15m',
  JWT_SECRET_REFRESH_KEY: 'refresh-secret',
  TOKEN_REFRESH_EXPIRE_TIME: '7d',
};

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaMock;
  let userService: UserServiceMock;
  let jwtService: JwtServiceMock;
  let configService: ConfigServiceMock;
  let disconnectSockets: jest.Mock;
  let inRoom: jest.Mock;
  let getServer: jest.Mock;

  beforeEach(() => {
    prisma = {
      user: { findUnique: jest.fn() },
      token: { findUnique: jest.fn(), delete: jest.fn(), upsert: jest.fn() },
    };

    userService = { create: jest.fn(), findOne: jest.fn() };

    jwtService = {
      signAsync: jest.fn((_payload: unknown, options: { secret: string }) =>
        Promise.resolve(options.secret === CONFIG_MAP.JWT_SECRET_KEY ? 'access-token' : 'refresh-token')
      ),
    };

    configService = { get: jest.fn((key: string) => CONFIG_MAP[key]) };

    disconnectSockets = jest.fn();
    inRoom = jest.fn().mockReturnValue({ disconnectSockets });
    getServer = jest.fn().mockReturnValue({ in: inRoom });

    service = new AuthService(
      prisma as unknown as PrismaService,
      userService as unknown as UserService,
      jwtService as unknown as JwtService,
      configService as unknown as ConfigService,
      { getServer } as unknown as SocketServerService
    );
  });

  describe('loginUser', () => {
    it('signs access/refresh tokens with different secrets and persists the refresh token', async () => {
      const user: User = { id: USER_ID, username: USERNAME, password: 'hashed' };

      const result = await service.loginUser(user);

      expect(result).toEqual({
        userId: USER_ID,
        username: USERNAME,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(prisma.token.upsert).toHaveBeenCalledWith({
        where: { userId: USER_ID },
        update: { refreshToken: 'refresh-token' },
        create: { userId: USER_ID, refreshToken: 'refresh-token' },
      });
    });
  });

  describe('registerUser', () => {
    it('delegates to UserService.create', async () => {
      const dto: CreateUserDto = {
        username: USERNAME,
        password: 'password123',
        confirmPassword: 'password123',
      };
      const createdUser = { id: USER_ID };
      userService.create.mockResolvedValue(createdUser);

      const result = await service.registerUser(dto);

      expect(userService.create).toHaveBeenCalledWith(dto);
      expect(result).toBe(createdUser);
    });
  });

  describe('verifyUserCredentials', () => {
    it('returns null when the user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await service.verifyUserCredentials({ username: USERNAME, password: 'password123' });

      expect(result).toBeNull();
      expect(compare).not.toHaveBeenCalled();
    });

    it('returns null when the password does not match', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: USER_ID, username: USERNAME, password: 'hashed' });
      (compare as jest.Mock).mockResolvedValue(false);

      const result = await service.verifyUserCredentials({ username: USERNAME, password: 'wrong-password' });

      expect(result).toBeNull();
    });

    it('returns the user when the password matches', async () => {
      const storedUser = { id: USER_ID, username: USERNAME, password: 'hashed' };
      prisma.user.findUnique.mockResolvedValue(storedUser);
      (compare as jest.Mock).mockResolvedValue(true);

      const result = await service.verifyUserCredentials({ username: USERNAME, password: 'password123' });

      expect(result).toBe(storedUser);
    });
  });

  describe('refreshToken', () => {
    it('throws 403 when the refresh token does not exist', async () => {
      prisma.token.findUnique.mockResolvedValue(null);

      await expect(service.refreshToken('unknown-token')).rejects.toThrow(ForbiddenException);
    });

    it('rotates the refresh token and issues new tokens', async () => {
      prisma.token.findUnique.mockResolvedValue({ userId: USER_ID, refreshToken: 'old-refresh-token' });
      userService.findOne.mockResolvedValue({ id: USER_ID, username: USERNAME });
      prisma.token.delete.mockResolvedValue({});

      const result = await service.refreshToken('old-refresh-token');

      expect(prisma.token.delete).toHaveBeenCalledWith({ where: { userId: USER_ID } });
      expect(result).toEqual({
        userId: USER_ID,
        username: USERNAME,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
      expect(prisma.token.upsert).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: USER_ID } }));
    });
  });

  describe('logout', () => {
    it('throws 401 when no refresh token is provided', async () => {
      await expect(service.logout(USER_ID, undefined)).rejects.toThrow(UnauthorizedException);
      expect(prisma.token.delete).not.toHaveBeenCalled();
    });

    it('deletes the token and force-disconnects the user sockets', async () => {
      prisma.token.delete.mockResolvedValue({});

      await service.logout(USER_ID, 'refresh-token');

      expect(prisma.token.delete).toHaveBeenCalledWith({
        where: { userId: USER_ID, refreshToken: 'refresh-token' },
      });
      expect(getServer).toHaveBeenCalled();
      expect(inRoom).toHaveBeenCalledWith(`user:${USER_ID}`);
      expect(disconnectSockets).toHaveBeenCalledWith(true);
    });
  });
});
