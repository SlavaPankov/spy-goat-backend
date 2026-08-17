import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class DirectMessageSendDto {
  @IsUUID()
  recipientId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;

  @IsOptional()
  @IsUUID()
  replyToId: string;
}

export class DirectMessageEditDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;
}
