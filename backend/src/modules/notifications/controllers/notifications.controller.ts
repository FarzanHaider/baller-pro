import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NotificationsService } from '../services/notifications.service';
import { NotificationFilterDto, RegisterDeviceDto, SendPushDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../../common/decorators/current-user.decorator';
import { createSuccessResponse } from '../../../common/dto/api-response.dto';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get notifications' })
  @ApiResponse({ status: 200, description: 'Notifications retrieved successfully' })
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Query() filters: NotificationFilterDto,
  ) {
    const result = await this.notificationsService.findAll(user.sub, filters);
    return createSuccessResponse(result, 'Notifications retrieved successfully');
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count' })
  @ApiResponse({ status: 200, description: 'Unread count retrieved' })
  async getUnreadCount(@CurrentUser() user: JwtPayload) {
    const result = await this.notificationsService.getUnreadCount(user.sub);
    return createSuccessResponse(result, 'Unread count retrieved');
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async markAsRead(
    @CurrentUser() user: JwtPayload,
    @Param('id') notificationId: string,
  ) {
    const notification = await this.notificationsService.markAsRead(user.sub, notificationId);
    return createSuccessResponse(notification, 'Notification marked as read');
  }

  @Put('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  async markAllAsRead(@CurrentUser() user: JwtPayload) {
    const result = await this.notificationsService.markAllAsRead(user.sub);
    return createSuccessResponse(result, 'All notifications marked as read');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification' })
  @ApiResponse({ status: 200, description: 'Notification deleted' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async remove(
    @CurrentUser() user: JwtPayload,
    @Param('id') notificationId: string,
  ) {
    const result = await this.notificationsService.remove(user.sub, notificationId);
    return createSuccessResponse(result, 'Notification deleted');
  }

  @Post('device')
  @ApiOperation({ summary: 'Register device for push notifications' })
  @ApiResponse({ status: 201, description: 'Device registered successfully' })
  async registerDevice(
    @CurrentUser() user: JwtPayload,
    @Body() registerDeviceDto: RegisterDeviceDto,
  ) {
    const result = await this.notificationsService.registerDevice(user.sub, registerDeviceDto);
    return createSuccessResponse(result, 'Device registered successfully');
  }

  @Delete('device/:token')
  @ApiOperation({ summary: 'Unregister device' })
  @ApiResponse({ status: 200, description: 'Device unregistered' })
  async unregisterDevice(
    @CurrentUser() user: JwtPayload,
    @Param('token') token: string,
  ) {
    const result = await this.notificationsService.unregisterDevice(user.sub, token);
    return createSuccessResponse(result, 'Device unregistered');
  }

  @Post('send')
  @ApiOperation({ summary: 'Send push notification to users (admin)' })
  @ApiResponse({ status: 200, description: 'Push notification sent' })
  async sendPush(@Body() sendPushDto: SendPushDto) {
    const result = await this.notificationsService.sendPushNotification(sendPushDto);
    return createSuccessResponse(result, 'Push notification sent');
  }
}
