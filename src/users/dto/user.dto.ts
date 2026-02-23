import { Expose } from 'class-transformer';
import { IsoDate } from '../../common/decorators/iso-date.decorator';

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
}
