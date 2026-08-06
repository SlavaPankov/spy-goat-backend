import { Expose, Type } from 'class-transformer';
import { IsoDate } from '../../common/decorators/iso-date.decorator';
import { FriendUserDto } from './friend-user.dto';
import { FriendshipStatus } from '@prisma/client';

export class FriendDto {
  @Expose()
  id: string;

  @Expose()
  @IsoDate()
  createdAt: Date;

  @Expose()
  @Type(() => FriendUserDto)
  friend: FriendUserDto;
}

export class IncomingFriendRequestDto {
  @Expose()
  id: string;

  @Expose()
  @IsoDate()
  createdAt: Date;

  @Expose()
  @Type(() => FriendUserDto)
  fromUser: FriendUserDto;
}

export class OutgoingFriendRequestDto {
  @Expose()
  id: string;

  @Expose()
  @IsoDate()
  createdAt: Date;

  @Expose()
  @Type(() => FriendUserDto)
  toUser: FriendUserDto;
}

export class FriendshipActionDto {
  @Expose()
  id: string;

  @Expose()
  status: FriendshipStatus;

  @Expose()
  @IsoDate()
  createdAt: Date;

  @Expose()
  @Type(() => FriendUserDto)
  otherUser: FriendUserDto;
}
