import { Controller, Get, Post, Put, Delete, Param, Query, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getUserNotifications(@Request() req, @Query('unread') unreadOnly?: string) {
    const unread = unreadOnly === 'true';
    return this.notificationsService.getUserNotifications(req.user._id, unread);
  }

  @Get('count/unread')
  async getUnreadCount(@Request() req) {
    const count = await this.notificationsService.getUnreadCount(req.user._id);
    return { count };
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req) {
    return this.notificationsService.markAsRead(id, req.user._id);
  }

  @Put('read-all')
  async markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user._id);
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string, @Request() req): Promise<any> {
    return this.notificationsService.deleteNotification(id, req.user._id);
  }
}