import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('rooms')
@UseInterceptors(ClassSerializerInterceptor)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.roomsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateRoomDto, @CurrentUser('userId') userId: string) {
    return this.roomsService.create(dto, userId);
  }

  @Post(':id/join')
  join(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @CurrentUser('userId') userId: string) {
    return this.roomsService.join(id, userId);
  }

  @Post(':id/exit')
  exit(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @CurrentUser('userId') userId: string) {
    return this.roomsService.exit(id, userId);
  }

  @Get(':id/games/active')
  findActiveGame(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.roomsService.findActiveGame(id);
  }

  @Get(':id/stats')
  findRoomStats(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.roomsService.findRoomStats(id);
  }
}
