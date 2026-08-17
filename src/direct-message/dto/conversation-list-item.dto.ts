import { Expose, Type } from 'class-transformer';
import { PublicUserDto } from '../../common/dto/public-user.dto';
import { DirectMessageDto } from './direct-message.dto';

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
  lastMessageAt: Date | null;
}
