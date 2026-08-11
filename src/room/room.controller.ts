import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseInterceptors,
  Query,
  UseGuards,
  BadRequestException,
  Put,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { RoomStatus } from '@prisma/client';
import JwtAuthGuard from '../auth/guards/jwt-auth.guard';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller('rooms')
@UseInterceptors(ClassSerializerInterceptor)
export class RoomController {
  constructor(private readonly roomsService: RoomService) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('size') size?: number,
    @Query('status') status?: RoomStatus,
    @Query('privacy') privacy?: string,
    @CurrentUser() user?: JwtPayload
  ) {
    return this.roomsService.findAll({ search, page, status, privacy, size, userId: user?.userId });
  }

  @Get('my-room')
  async findRoomByUserId(@CurrentUser() user: JwtPayload) {
    return this.roomsService.findRoomByUserId(user.userId);
  }

  @Get(':id/details')
  async findOneDetails(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.roomsService.findOneDetails(id);
  }

  @Get(':id/players')
  findRoomPlayers(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.roomsService.findRoomPlayers(id);
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

  @Get(':id/user/:userId/player')
  findPlayerByUserId(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string
  ) {
    return this.roomsService.findPlayerByUserId(id, userId);
  }

  @Post(':id/verify-password')
  @UseGuards(JwtAuthGuard)
  async verifyPassword(
    @Param('id', new ParseUUIDPipe({ version: '4' })) roomId: string,
    @Body() dto: { password: string },
    @CurrentUser() user: JwtPayload
  ) {
    const isValid = await this.roomsService.verifyRoomPassword(roomId, dto.password, user.userId);

    if (!isValid) {
      throw new BadRequestException('Incorrect password');
    }

    return {
      success: true,
      message: 'Password verified',
      roomId,
    };
  }

  @Get(':id/has-access')
  checkIsPrivateRoom(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @CurrentUser() user: JwtPayload) {
    return this.roomsService.checkHasAccess(id, user.userId);
  }

  @Put(':id')
  updateRoom(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() user: JwtPayload,
    @Body() data: UpdateRoomDto
  ) {
    return this.roomsService.updateRoom(id, user.userId, data);
  }
}
