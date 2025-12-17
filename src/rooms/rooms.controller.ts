import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';

interface UserRequestInfo {
  user: {
    userId: string;
  };
}

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
  create(@Body() dto: CreateRoomDto, @Req() req: UserRequestInfo) {
    return this.roomsService.create(dto, req.user.userId);
  }

  @Post(':id/join')
  join(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Req() req: UserRequestInfo) {
    return this.roomsService.join(id, req.user.userId);
  }

  @Post(':id/exit')
  exit(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Req() req: UserRequestInfo) {
    return this.roomsService.exit(id, req.user.userId);
  }
}
