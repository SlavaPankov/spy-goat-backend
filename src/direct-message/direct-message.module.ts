import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FriendModule } from '../friend/friend.module';
import { DirectMessageService } from './direct-message.service';
import { SocketModule } from '../socket/socket.module';
import { DirectMessageNotifier } from './direct-message-notifier.service';
import { DirectMessageController } from './direct-message.controller';

@Module({
  imports: [PrismaModule, FriendModule, forwardRef(() => SocketModule)],
  providers: [DirectMessageService, DirectMessageNotifier],
  exports: [DirectMessageService],
  controllers: [DirectMessageController],
})
export class DirectMessageModule {}
