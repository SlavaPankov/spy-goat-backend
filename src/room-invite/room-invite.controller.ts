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
import { RoomInviteService } from './room-invite.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { InviteToRoomDto } from './dto/invite-to-room.dto';

@Controller('room-invite')
@UseInterceptors(ClassSerializerInterceptor)
export class RoomInviteController {
  constructor(private readonly roomInviteService: RoomInviteService) {}

  @Post()
  invite(@CurrentUser('userId') userId: string, @Body() dto: InviteToRoomDto) {
    return this.roomInviteService.invite(userId, dto.roomId, dto.inviteeId);
  }

  @Post(':id/accept')
  accept(@CurrentUser('userId') userId: string, @Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.roomInviteService.acceptInvite(userId, id);
  }

  @Post(':id/decline')
  decline(@CurrentUser('userId') userId: string, @Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.roomInviteService.declineInvite(userId, id);
  }

  @Get('user/:userId/notification/:notificationId/status')
  getInviteStatus(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Param('notificationId', new ParseUUIDPipe({ version: '4' })) notificationId: string
  ) {
    return this.roomInviteService.getInviteStatusForNotification(userId, notificationId);
  }

  @Get('room/:roomId/user/:userId/status')
  getInviteStatusByRoomId(
    @Param('roomId', new ParseUUIDPipe({ version: '4' })) roomId: string,
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string
  ) {
    return this.roomInviteService.getInviteStatusByRoomId(roomId, userId);
  }
}
