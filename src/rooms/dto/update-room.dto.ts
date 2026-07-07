import { IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class UpdateRoomDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(2)
  maxPlayers: number;
}
