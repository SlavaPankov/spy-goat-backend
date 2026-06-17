import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class SendMessageDto {
  @IsUUID()
  roomId: string;

  @IsUUID()
  playerId: string;

  // клиент генерирует сам: crypto.randomUUID()
  @IsUUID()
  tempId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  @Transform(({ value }) => (value as string).trim())
  content: string;
}
