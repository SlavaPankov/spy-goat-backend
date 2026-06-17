import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { GameModule } from './game/game.module';
import { LobbyModule } from './lobby/lobby.module';
import { StatisticsModule } from './statistics/statistics.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import JwtAuthGuard from './auth/guards/jwtAuth.guard';
import { CustomHttpExceptionFilter } from './utils/filters/customHttpException.filter';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
    ConfigModule,
    RoomsModule,
    GameModule,
    LobbyModule,
    StatisticsModule,
    JwtModule,
    ChatModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: CustomHttpExceptionFilter,
    },
  ],
})
export class AppModule {}
