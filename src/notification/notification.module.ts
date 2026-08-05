import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SocketModule } from '../socket/socket.module';
import { NotificationService } from './notification.service';
import { NotificationNotifier } from './notification-notifier.service';
import { NotificationController } from './notification.controller';

@Module({
  imports: [PrismaModule, forwardRef(() => SocketModule)],
  providers: [NotificationService, NotificationNotifier],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
