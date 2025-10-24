import { apiClient } from '@/lib/apiClient';

export interface Notification {
  _id: string;
  user: string;
  type: string;
  message: string;
  isRead: boolean;
  sender?: string;
  priority: string;
  deliveryMethod: string;
  createdAt: string;
}

export const notificationsAPI = {
  // Get all notifications for a user
  async getAll(userId: string) {
    return apiClient.get<Notification[]>(`/notifications/${userId}`);
  },

  // Mark notification as read
  async markAsRead(userId: string, notificationId: string) {
    return apiClient.patch(`/notifications/${userId}/read`, { notificationId });
  },

  // Get unread notification count
  async getUnreadCount(userId: string) {
    return apiClient.get<{ count: number }>(`/notifications/${userId}/unread-count`);
  },
};
