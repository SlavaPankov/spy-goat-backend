import { Expose, Type } from 'class-transformer';
import { UserDto } from '../../users/dto/user.dto';
import { IsoDate } from '../../common/decorators/iso-date.decorator';

export class RoomPlayersStats {
  @Expose()
  id: string;

  @Expose()
  bestScore: number;

  @Expose()
  gamesPlayed: number;

  @Expose()
  gamesWon: number;

  @Expose()
  @IsoDate()
  lastPlayedAt: Date;

  @Expose()
  totalPenalty: number;

  @Expose()
  @IsoDate()
  updatedAt: Date;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;
}
