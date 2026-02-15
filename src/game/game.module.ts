import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { StatisticsModule } from '../statistics/statistics.module';
import { RoomsModule } from '../rooms/rooms.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtConfigFactory } from '../auth/factory/JwtConfigFactory';

@Module({
  providers: [GameService, GameGateway],
  imports: [
    PrismaModule,
    StatisticsModule,
    RoomsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: jwtConfigFactory,
    }),
  ],
  exports: [GameService],
})
export class GameModule {}
