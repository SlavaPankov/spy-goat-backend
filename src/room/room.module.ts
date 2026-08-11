import { forwardRef, Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { GameModule } from '../game/game.module';

@Module({
  providers: [RoomService],
  controllers: [RoomController],
  imports: [PrismaModule, forwardRef(() => GameModule)],
  exports: [RoomService],
})
export class RoomModule {}
