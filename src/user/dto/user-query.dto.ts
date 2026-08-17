import { IsOptional, IsString } from 'class-validator';
import { QueryDto } from '../../common/dto/query.dto';

export class UserQueryDto extends QueryDto {
  @IsOptional()
  @IsString()
  search?: string;
}
