
import { useQuery } from '@tanstack/react-query';

type Notification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  date: string;
};

export function useNotifications() {
  const { data, isLoading, error, refetch } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await fetch('/api/notifications', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      
      return response.json();
    },
    // Refresh notifications data every 30 seconds
    refetchInterval: 30000,
  });

  const unreadCount = data?.filter(notification => !notification.read).length || 0;

  return {
    notifications: data || [],
    unreadCount,
    isLoading,
    error,
    refetch,
  };
}
