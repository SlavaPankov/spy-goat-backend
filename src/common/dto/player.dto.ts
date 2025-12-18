import { Expose, Type } from 'class-transformer';
import { IsoDate } from '../decorators/iso-date.decorator';
import { UserDto } from '../../users/dto/user.dto';

export class PlayerDto {
  @Expose()
  id: string;

  @Expose()
  roomId: string;

  @Expose()
  isBot: boolean;

  @Expose()
  position: number;

  @Expose()
  handle: string[];

  @Expose()
  penalty: string[];

  @Expose()
  totalPenalty: number;

  @Expose()
  selectedCard: string;

  @Expose()
  isWinner: boolean;

  @Expose()
  finalPosition: number;

  @Expose()
  @IsoDate()
  createdAt: Date;

  @Expose()
  @IsoDate()
  updatedAt: Date;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;
}
