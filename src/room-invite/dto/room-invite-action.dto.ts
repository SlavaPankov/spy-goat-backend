import { Expose, Type } from 'class-transformer';
import { RoomInviteStatus } from '@prisma/client';
import { IsoDate } from '../../common/decorators/iso-date.decorator';
import { FriendUserDto } from '../../friend/dto/friend-user.dto';

export class RoomInviteActionDto {
  @Expose()
  id: string;

  @Expose()
  status: RoomInviteStatus;

  @Expose()
  @IsoDate()
  createdAt: Date;

  @Expose()
  roomId: string;

  @Expose()
  roomName: string;

  @Expose()
  @Type(() => FriendUserDto)
  otherUser: FriendUserDto;
}
