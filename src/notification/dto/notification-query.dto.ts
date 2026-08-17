import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { QueryDto } from '../../common/dto/query.dto';

export class NotificationQueryDto extends QueryDto {
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  unreadOnly: boolean = false;
}
