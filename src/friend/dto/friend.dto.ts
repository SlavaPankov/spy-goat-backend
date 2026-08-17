import { Expose, Type } from 'class-transformer';
import { IsoDate } from '../../common/decorators/iso-date.decorator';
import { FriendshipStatus } from '@prisma/client';
import { PublicUserDto } from '../../common/dto/public-user.dto';

export class FriendDto {
  @Expose()
  id: string;

  @Expose()
  @IsoDate()
  createdAt: Date;

  @Expose()
  @Type(() => PublicUserDto)
  friend: PublicUserDto;
}

export class IncomingFriendRequestDto {
  @Expose()
  id: string;

  @Expose()
  @IsoDate()
  createdAt: Date;

  @Expose()
  @Type(() => PublicUserDto)
  fromUser: PublicUserDto;
}

export class OutgoingFriendRequestDto {
  @Expose()
  id: string;

  @Expose()
  @IsoDate()
  createdAt: Date;

  @Expose()
  @Type(() => PublicUserDto)
  toUser: PublicUserDto;
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
  @Type(() => PublicUserDto)
  otherUser: PublicUserDto;
}
