import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
  IsOptional,
} from 'class-validator';

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

  @IsString()
  @ValidateIf((object: Record<string, unknown>) => object.isPrivate as boolean)
  password: string;

  @IsBoolean()
  @IsOptional()
  withBots: boolean;
}
