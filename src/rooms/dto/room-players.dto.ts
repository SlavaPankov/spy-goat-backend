import { Expose, Type } from 'class-transformer';
import { PlayerDto } from '../../common/dto/player.dto';

export class RoomPlayersDto {
  @Expose()
  maxPlayers: number;

  @Expose()
  creatorId: string;

  @Expose()
  @Type(() => PlayerDto)
  players: PlayerDto[];
}
