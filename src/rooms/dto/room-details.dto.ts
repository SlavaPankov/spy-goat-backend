import { Expose, Type } from 'class-transformer';
import { IsoDate } from '../../common/decorators/iso-date.decorator';
import { UserDto } from '../../users/dto/user.dto';

export class RoomDetailsDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  code: string;

  @Expose()
  maxPlayers: number;

  @Expose()
  isPrivate: boolean;

  @Expose()
  status: string;

  @Expose()
  @IsoDate()
  createdAt: Date;

  @Expose()
  @IsoDate()
  updatedAt: Date;

  @Expose()
  @Type(() => UserDto)
  creator: UserDto;
}
