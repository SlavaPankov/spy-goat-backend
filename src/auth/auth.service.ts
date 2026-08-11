import { ForbiddenException, forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { compare } from 'bcryptjs';

import { CreateUserDto } from '../user/dto/create-user.dto';

import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { SocketServerService } from '../socket/socket-server.service';

export interface User {
  id: string;
  username: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => SocketServerService))
    private readonly socketServer: SocketServerService
  ) {}

  private forceDisconnectUser(userId: string): void {
    this.socketServer.getServer().in(`user:${userId}`).disconnectSockets(true);
  }

  async loginUser(user: User) {
    const tokens = await this.signTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return { ...tokens };
  }

  async registerUser(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  async verifyUserCredentials(
    loginDto: Omit<CreateUserDto, 'confirmPassword' | 'surname' | 'name' | 'email'>
  ): Promise<User | null> {
    const createUser = await this.prisma.user.findUnique({
      where: { username: loginDto.username },
    });

    if (!createUser) return null;

    const passwordIsValid = await compare(loginDto.password, createUser.password);

    return passwordIsValid ? createUser : null;
  }

  async refreshToken(refreshToken: string) {
    const userToken = await this.prisma.token.findUnique({
      where: { refreshToken },
    });

    if (!userToken) {
      throw new ForbiddenException('Invalid refresh token');
    }

    const createUser = await this.userService.findOne(userToken.userId);
    await this.prisma.token.delete({ where: { userId: createUser.id } });

    const tokens = await this.signTokens(createUser.id, createUser.username);
    await this.updateRefreshToken(createUser.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string, refreshToken?: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.prisma.token.delete({ where: { userId, refreshToken } });

    this.forceDisconnectUser(userId);
  }

  private async signTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { userId, username },
        {
          secret: this.configService.get<string>('JWT_SECRET_KEY'),
          expiresIn: this.configService.get<string>('TOKEN_EXPIRE_TIME'),
        }
      ),
      this.jwtService.signAsync(
        { userId, username },
        {
          secret: this.configService.get<string>('JWT_SECRET_REFRESH_KEY'),
          expiresIn: this.configService.get<string>('TOKEN_REFRESH_EXPIRE_TIME'),
        }
      ),
    ]);

    return { userId, username, accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.prisma.token.upsert({
      where: { userId },
      update: { refreshToken },
      create: { userId, refreshToken },
    });
  }
}
