import { Expose, Type } from 'class-transformer';
import { PublicUserDto } from '../../common/dto/public-user.dto';

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
  readAt: Date | null;

  @Expose()
  editedAt: Date | null;

  @Expose()
  createdAt: Date;

  @Expose()
  deletedAt: Date | null;
}
