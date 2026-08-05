import { ClassSerializerInterceptor, Controller, Get, Param, Patch, Query, UseInterceptors } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { QueryDto } from './dto/notification-query.dto';

@Controller('notification')
@UseInterceptors(ClassSerializerInterceptor)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async findAll(@CurrentUser('userId') userId: string, @Query() queryDto: QueryDto) {
    return this.notificationService.list(userId, queryDto);
  }

  @Patch(':id/read')
  async markRead(@CurrentUser('userId') userId: string, @Param('id') notificationId: string) {
    return this.notificationService.markAsRead(userId, notificationId);
  }

  @Patch('read-all')
  async markReadAll(@CurrentUser('userId') userId: string) {
    return this.notificationService.markAllRead(userId);
  }

  @Get('unread-count')
  async unreadCount(@CurrentUser('userId') userId: string) {
    return this.notificationService.getUnreadCount(userId);
  }
}
