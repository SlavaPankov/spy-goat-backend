import { forwardRef, Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { GameModule } from '../game/game.module';

@Module({
  providers: [RoomsService],
  controllers: [RoomsController],
  imports: [PrismaModule, forwardRef(() => GameModule)],
  exports: [RoomsService],
})
export class RoomsModule {}
