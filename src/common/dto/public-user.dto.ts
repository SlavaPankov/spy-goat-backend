import { Expose } from 'class-transformer';
import { IsoDate } from '../decorators/iso-date.decorator';

export class PublicUserDto {
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
