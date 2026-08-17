import { Expose, Type } from 'class-transformer';
import { RoomInviteStatus } from '@prisma/client';
import { IsoDate } from '../../common/decorators/iso-date.decorator';
import { PublicUserDto } from '../../common/dto/public-user.dto';

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
  @Type(() => PublicUserDto)
  otherUser: PublicUserDto;
}
