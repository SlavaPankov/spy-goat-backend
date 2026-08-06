import { Expose } from 'class-transformer';
import { IsoDate } from '../../common/decorators/iso-date.decorator';

export class FriendUserDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  isOnline: boolean;

  @Expose()
  @IsoDate()
  lastSeenAt: Date | null;
}
