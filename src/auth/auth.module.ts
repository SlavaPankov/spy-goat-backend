import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SessionJwtStrategy } from './security/session-jwt.strategy';
import { UserLoginStrategy } from './security/user-login.strategy';
import { jwtConfigFactory } from './factory/jwt-config.factory';
import { RefreshGuard } from './guards/refresh.guard';
import { RefreshJwtStrategy } from './security/refresh-jwt.strategy';
import { PresenceModule } from '../presence/presence.module';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: jwtConfigFactory,
    }),
    PrismaModule,
    UserModule,
    SocketModule,
    forwardRef(() => PresenceModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserLoginStrategy, SessionJwtStrategy, RefreshGuard, RefreshJwtStrategy],
})
export class AuthModule {}
