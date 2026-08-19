import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';
import { GameModule } from './game/game.module';
import { StatisticsModule } from './statistics/statistics.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import JwtAuthGuard from './auth/guards/jwt-auth.guard';
import { CustomHttpExceptionFilter } from './utils/filters/customHttpException.filter';
import { ChatModule } from './chat/chat.module';
import { SocketModule } from './socket/socket.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PresenceModule } from './presence/presence.module';
import { NotificationModule } from './notification/notification.module';
import { FriendModule } from './friend/friend.module';
import { RoomInviteModule } from './room-invite/room-invite.module';
import { DirectMessageModule } from './direct-message/direct-message.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    ConfigModule,
    RoomModule,
    GameModule,
    StatisticsModule,
    JwtModule,
    ChatModule,
    SocketModule,
    PresenceModule,
    NotificationModule,
    FriendModule,
    RoomInviteModule,
    DirectMessageModule,
    EventEmitterModule.forRoot(),
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
