import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SendFriendRequestDto } from './dto/send-friend-request.dto';

@Controller('friend')
@UseInterceptors(ClassSerializerInterceptor)
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Post('send-request')
  sendRequest(@CurrentUser('userId') userId: string, @Body() { addresseeId }: SendFriendRequestDto) {
    return this.friendService.sendRequest(userId, addresseeId);
  }

  @Post(':id/accept')
  acceptRequest(@CurrentUser('userId') userId: string, @Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.friendService.acceptRequest(userId, id);
  }

  @Post(':id/decline')
  declineRequest(@CurrentUser('userId') userId: string, @Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.friendService.declineRequest(userId, id);
  }

  @Delete(':id')
  removeFriend(@CurrentUser('userId') userId: string, @Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.friendService.removeFriend(userId, id);
  }

  @Get()
  getFriendsList(@CurrentUser('userId') userId: string) {
    return this.friendService.listFriends(userId);
  }

  @Get('incoming')
  getIncomingList(@CurrentUser('userId') userId: string) {
    return this.friendService.listIncoming(userId);
  }

  @Get('outgoing')
  getOutgoingList(@CurrentUser('userId') userId: string) {
    return this.friendService.listOutgoing(userId);
  }
}
