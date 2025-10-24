import { useQuery, useMutation } from '@tanstack/react-query';
import { Loader2, Bell, Check, Trash2 } from 'lucide-react';
import { notificationsAPI } from '@/api/notifications';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const NotificationsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch notifications
  const { data: notificationsResponse, isLoading, error } = useQuery({
    queryKey: ['notifications', user?._id],
    queryFn: () => notificationsAPI.getAll(user!._id),
    enabled: !!user,
  });
  const notifications = notificationsResponse?.data || [];

  // Fetch unread count
  const { data: unreadCountResponse } = useQuery({
    queryKey: ['notifications-unread', user?._id],
    queryFn: () => notificationsAPI.getUnreadCount(user!._id),
    enabled: !!user,
  });
  const unreadCount = unreadCountResponse?.data?.count || 0;

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      notificationsAPI.markAsRead(user!._id, notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?._id] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread', user?._id] });
      toast({ title: 'Marked as read' });
    },
  });

  if (!user) {
    return (
      <div className="container mx-auto pt-24 pb-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in to view notifications</h1>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) return <div className="text-center py-12">Error loading notifications.</div>;

  return (
    <div className="container mx-auto pt-24 pb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Bell className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification: any) => (
            <div
              key={notification._id}
              className={`p-4 rounded-lg border flex items-start justify-between ${
                notification.isRead ? 'bg-card' : 'bg-primary/5 border-primary/20'
              }`}
            >
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{notification.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
              {!notification.isRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markAsReadMutation.mutate(notification._id)}
                  className="ml-4"
                >
                  <Check className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
