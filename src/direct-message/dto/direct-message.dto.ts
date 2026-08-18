import { Expose, Type } from 'class-transformer';
import { PublicUserDto } from '../../common/dto/public-user.dto';
import { IsoDate } from '../../common/decorators/iso-date.decorator';

export class DirectMessageReplyPreviewDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => PublicUserDto)
  sender: PublicUserDto;

  @Expose()
  content: string;
}

export class DirectMessageDto {
  @Expose()
  id: string;

  @Expose()
  conversationId: string;

  @Expose()
  @Type(() => PublicUserDto)
  sender: PublicUserDto;

  @Expose()
  @Type(() => PublicUserDto)
  recipient: PublicUserDto;

  @Expose()
  content: string | null;

  @Expose()
  @Type(() => DirectMessageReplyPreviewDto)
  replyTo: DirectMessageReplyPreviewDto;

  @Expose()
  @IsoDate()
  readAt: Date | null;

  @Expose()
  @IsoDate()
  editedAt: Date | null;

  @Expose()
  @IsoDate()
  createdAt: Date;

  @Expose()
  @IsoDate()
  deletedAt: Date | null;
}
