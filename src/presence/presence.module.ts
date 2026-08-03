import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SocketModule } from '../socket/socket.module';
import { PresenceService } from './presence.service';
import { PresenceNotifier } from './presence-notifier.service';
import { PresenceGateway } from '../socket/gateways/presence.gateway';

@Module({
  imports: [PrismaModule, forwardRef(() => SocketModule)],
  providers: [PresenceService, PresenceGateway, PresenceNotifier],
  exports: [PresenceService],
})
export class PresenceModule {}
