import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CursorQueryDto {
  @IsOptional()
  cursor: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit: number;
}
