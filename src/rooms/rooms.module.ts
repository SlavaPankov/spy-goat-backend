import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [RoomsService],
  controllers: [RoomsController],
  imports: [PrismaModule],
  exports: [RoomsService],
})
export class RoomsModule {}
