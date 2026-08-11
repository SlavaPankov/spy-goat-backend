import { forwardRef, Module } from '@nestjs/common';
import { GameService } from './game.service';
import { PrismaModule } from '../prisma/prisma.module';
import { StatisticsModule } from '../statistics/statistics.module';
import { RoomModule } from '../room/room.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtConfigFactory } from '../auth/factory/jwt-config.factory';
import { ChatModule } from '../chat/chat.module';
import { BotModule } from '../bot/bot.module';

@Module({
  providers: [GameService],
  imports: [
    PrismaModule,
    StatisticsModule,
    BotModule,
    forwardRef(() => RoomModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: jwtConfigFactory,
    }),
    ChatModule,
  ],
  exports: [GameService],
})
export class GameModule {}
