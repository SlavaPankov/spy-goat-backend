import { Expose } from 'class-transformer';
import { IsoDate } from '../../common/decorators/iso-date.decorator';

export class NotificationDto {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  type: string;

  @Expose()
  payload: Record<string, unknown>;

  @Expose()
  @IsoDate()
  readAt: Date | null;

  @Expose()
  @IsoDate()
  createdAt: Date;

  @Expose()
  isRead: boolean;
}
