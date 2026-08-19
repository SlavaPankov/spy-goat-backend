import { forwardRef, Module } from '@nestjs/common';
import { SocketServerService } from './socket-server.service';
import { ConnectionGateway } from './gateways/connection.gateway';
import { RoomGateway } from './gateways/room.gateway';
import { ChatGateway } from './gateways/chat.gateway';
import { GameGateway } from './gateways/game.gateway';
import { RoomModule } from '../room/room.module';
import { ChatModule } from '../chat/chat.module';
import { GameModule } from '../game/game.module';
import { PresenceModule } from '../presence/presence.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PresenceGateway } from './gateways/presence.gateway';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    RoomModule,
    GameModule,
    ChatModule,
    forwardRef(() => PresenceModule),
    forwardRef(() => NotificationModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
    }),
  ],
  providers: [SocketServerService, ConnectionGateway, RoomGateway, GameGateway, ChatGateway, PresenceGateway],
  exports: [SocketServerService],
})
export class SocketModule {}
