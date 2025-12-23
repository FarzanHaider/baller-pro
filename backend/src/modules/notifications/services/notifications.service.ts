import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNotificationDto, NotificationFilterDto, RegisterDeviceDto, SendPushDto } from '../dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private prisma: PrismaService) {}

  // Get user's notifications
  async findAll(userId: string, filters: NotificationFilterDto) {
    const { type, unreadOnly, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (type) {
      where.type = type;
    }

    if (unreadOnly) {
      where.isRead = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return {
      items: notifications.map((n) => this.formatNotification(n)),
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Create notification
  async create(dto: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: dto.userId,
        type: dto.type,
        title: dto.title,
        description: dto.description,
        data: dto.data,
        imageUrl: dto.imageUrl,
      },
    });

    // TODO: Send push notification via FCM
    // await this.sendPush(dto.userId, dto.title, dto.description || '');

    this.logger.log(`Notification created for user ${dto.userId}`);

    return this.formatNotification(notification);
  }

  // Mark notification as read
  async markAsRead(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    const updated = await this.prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return this.formatNotification(updated);
  }

  // Mark all notifications as read
  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return { success: true };
  }

  // Delete notification
  async remove(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    await this.prisma.notification.delete({ where: { id: notificationId } });

    return { deleted: true };
  }

  // Get unread count
  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });

    return { count };
  }

  // Register device for push notifications
  async registerDevice(userId: string, dto: RegisterDeviceDto) {
    // Check if device already exists
    const existing = await this.prisma.userDevice.findFirst({
      where: { userId, fcmToken: dto.token },
    });

    if (existing) {
      // Update existing device
      await this.prisma.userDevice.update({
        where: { id: existing.id },
        data: {
          platform: dto.platform,
          isActive: true,
        },
      });
    } else {
      // Create new device
      await this.prisma.userDevice.create({
        data: {
          userId,
          fcmToken: dto.token,
          platform: dto.platform,
        },
      });
    }

    this.logger.log(`Device registered for user ${userId}`);

    return { registered: true };
  }

  // Unregister device
  async unregisterDevice(userId: string, token: string) {
    await this.prisma.userDevice.updateMany({
      where: { userId, fcmToken: token },
      data: { isActive: false },
    });

    return { unregistered: true };
  }

  // Send push notification to users (admin/system)
  async sendPushNotification(dto: SendPushDto) {
    // Get device tokens for users
    const devices = await this.prisma.userDevice.findMany({
      where: {
        userId: { in: dto.userIds },
        isActive: true,
      },
    });

    if (devices.length === 0) {
      return { sent: 0 };
    }

    // TODO: Integrate with Firebase Cloud Messaging
    // For now, just log
    this.logger.log(`Push notification would be sent to ${devices.length} devices`);

    // Create in-app notifications
    for (const userId of dto.userIds) {
      await this.prisma.notification.create({
        data: {
          userId,
          type: 'system',
          title: dto.title,
          description: dto.body,
          data: dto.data,
        },
      });
    }

    return { sent: devices.length };
  }

  // Send notification to all users (broadcast)
  async broadcast(title: string, body: string, data?: Record<string, any>) {
    const users = await this.prisma.user.findMany({
      select: { id: true },
    });

    const userIds = users.map((u) => u.id);

    return this.sendPushNotification({
      userIds,
      title,
      body,
      data,
    });
  }

  private formatNotification(notification: any) {
    return {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      description: notification.description,
      data: notification.data,
      image: notification.imageUrl,
      isRead: notification.isRead,
      readAt: notification.readAt?.toISOString(),
      createdAt: notification.createdAt.toISOString(),
    };
  }
}
