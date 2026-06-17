import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [ChatService, PrismaService],
  imports: [PrismaModule],
  exports: [ChatService],
})
export class ChatModule {}
