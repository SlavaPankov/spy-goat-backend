import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { DirectMessageService } from './direct-message.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { DirectMessageEditDto, DirectMessageSendDto } from './dto/direct-message-send.dto';
import { QueryDto } from '../common/dto/query.dto';
import { CursorQueryDto } from '../common/dto/cursor-query.dto';
import { SearchQueryDto } from '../common/dto/search-query.dto';

@Controller('direct-message')
@UseInterceptors(ClassSerializerInterceptor)
export class DirectMessageController {
  constructor(private readonly directMessageService: DirectMessageService) {}

  @Get('conversations')
  async getConversationsList(
    @CurrentUser('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Query() queryDto: SearchQueryDto
  ) {
    return this.directMessageService.getConversationsList(userId, queryDto);
  }

  @Get('conversations/:conversationId/history')
  async getHistory(
    @CurrentUser('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Param('conversationId', new ParseUUIDPipe({ version: '4' })) conversationId: string,
    @Query() { cursor, limit }: CursorQueryDto
  ) {
    return this.directMessageService.getHistory(userId, conversationId, cursor, limit);
  }

  @Get('conversations/:conversationId/unread-count')
  async getConversationsUnreadCount(
    @CurrentUser('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Param('conversationId', new ParseUUIDPipe({ version: '4' })) conversationId: string
  ) {
    return this.directMessageService.getConversationUnreadCount(userId, conversationId);
  }

  @Get('unread-count')
  async getTotalUnreadCount(@CurrentUser('userId', new ParseUUIDPipe({ version: '4' })) userId: string) {
    return this.directMessageService.getTotalUnreadCount(userId);
  }

  @Get('with/:otherUserId')
  async resolveConversation(
    @CurrentUser('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Param('otherUserId', new ParseUUIDPipe({ version: '4' })) otherUserId: string
  ) {
    return this.directMessageService.resolveConversation(userId, otherUserId);
  }

  @Post()
  async sendMessage(
    @CurrentUser('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Body() dto: DirectMessageSendDto
  ) {
    return this.directMessageService.sendMessage(userId, dto.recipientId, dto.content, dto.replyToId);
  }

  @Post('conversations/:conversationId/messages/:messageId/read')
  async markRead(
    @CurrentUser('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Param('conversationId', new ParseUUIDPipe({ version: '4' })) conversationId: string,
    @Param('messageId', new ParseUUIDPipe({ version: '4' })) messageId: string
  ) {
    return this.directMessageService.markRead(userId, conversationId, messageId);
  }

  @Patch(':messageId')
  async editMessage(
    @CurrentUser('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Param('messageId', new ParseUUIDPipe({ version: '4' })) messageId: string,
    @Body() { content }: DirectMessageEditDto
  ) {
    return this.directMessageService.editMessage(userId, messageId, content);
  }

  @Delete(':messageId')
  async deleteMessage(
    @CurrentUser('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Param('messageId', new ParseUUIDPipe({ version: '4' })) messageId: string
  ) {
    return this.directMessageService.deleteMessage(userId, messageId);
  }

  @Patch('conversations/:conversationId/read-all')
  async markAllReadByConversationId(
    @CurrentUser('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Param('conversationId', new ParseUUIDPipe({ version: '4' })) conversationId: string
  ) {
    return this.directMessageService.markAllReadByConversationId(userId, conversationId);
  }

  @Delete('conversations/:conversationId')
  async deleteConversation(
    @CurrentUser('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Param('conversationId', new ParseUUIDPipe({ version: '4' })) conversationId: string
  ) {
    return this.directMessageService.deleteConversation(userId, conversationId);
  }
}
