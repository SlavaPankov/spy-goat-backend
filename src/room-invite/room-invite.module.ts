import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RoomModule } from '../room/room.module';
import { NotificationModule } from '../notification/notification.module';
import { RoomInviteService } from './room-invite.service';
import { RoomInviteController } from './room-invite.controller';

@Module({
  providers: [RoomInviteService],
  controllers: [RoomInviteController],
  imports: [PrismaModule, RoomModule, NotificationModule],
  exports: [RoomInviteService],
})
export class RoomInviteModule {}
