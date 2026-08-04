import { Expose, Type } from 'class-transformer';
import { IsoDate } from '../decorators/iso-date.decorator';
import { UserDto } from '../../users/dto/user.dto';
import { Card } from '../../game/interfaces/card.interface';

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
  hand: string[];

  @Expose()
  penalty: string[];

  @Expose()
  isSelectedCardConfirmed: boolean;

  @Expose()
  totalPenalty: number;

  @Expose()
  selectedCard: string;

  @Expose()
  isWinner: boolean;

  @Expose()
  isReady: boolean;

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

  @Expose()
  roundPenaltyCard: Card[];
}
