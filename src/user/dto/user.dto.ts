import { Expose } from 'class-transformer';
import { IsoDate } from '../../common/decorators/iso-date.decorator';
import { IsBoolean } from 'class-validator';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  version: number;

  @Expose()
  name: string;

  @Expose()
  surname: string;

  @Expose()
  email: string;

  @Expose()
  @IsoDate()
  createdAt: Date;

  @Expose()
  @IsoDate()
  updatedAt: Date;

  @Expose()
  @IsoDate()
  lastSeenAt: Date;

  @Expose()
  @IsBoolean()
  isOnline: boolean;
}
