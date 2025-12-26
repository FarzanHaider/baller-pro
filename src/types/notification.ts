export type NotificationType = 'reminder' | 'message' | 'mention' | 'milestone';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  image?: string;
}
