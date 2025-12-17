import { IsBoolean, IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  code: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(2)
  maxPlayers: number;

  @IsBoolean()
  isPrivate: boolean;
}
