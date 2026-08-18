import { QueryDto } from './query.dto';
import { IsOptional, IsString } from 'class-validator';

export class SearchQueryDto extends QueryDto {
  @IsOptional()
  @IsString()
  search?: string;
}
