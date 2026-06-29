import { Module } from '@nestjs/common';
import { SocketServerService } from './socket-server.service';
import { ConnectionGateway } from './gateways/connection.gateway';
import { RoomGateway } from './gateways/room.gateway';
import { ChatGateway } from './gateways/chat.gateway';
import { GameGateway } from './gateways/game.gateway';
import { RoomsModule } from '../rooms/rooms.module';
import { ChatModule } from '../chat/chat.module';
import { GameModule } from '../game/game.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RoomsModule,
    GameModule,
    ChatModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
    }),
  ],
  providers: [SocketServerService, ConnectionGateway, RoomGateway, GameGateway, ChatGateway],
})
export class SocketModule {}
