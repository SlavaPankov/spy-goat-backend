import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class NotificationCreateDto {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;
}
