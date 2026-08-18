import { Expose, Type } from 'class-transformer';
import { PublicUserDto } from '../../common/dto/public-user.dto';
import { DirectMessageDto } from './direct-message.dto';
import { IsoDate } from '../../common/decorators/iso-date.decorator';

export class ConversationListItemDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => PublicUserDto)
  otherUser: PublicUserDto;

  @Expose()
  @Type(() => DirectMessageDto)
  lastMessage: DirectMessageDto;

  @Expose()
  unreadCount: number;

  @Expose()
  @IsoDate()
  lastMessageAt: Date | null;
}
