import { useState } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

export const useToast = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
    
    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const success = (title: string, message?: string) => {
    return addNotification({ type: 'success', title, message });
  };

  const error = (title: string, message?: string) => {
    return addNotification({ type: 'error', title, message });
  };

  const info = (title: string, message?: string) => {
    return addNotification({ type: 'info', title, message });
  };

  const warning = (title: string, message?: string) => {
    return addNotification({ type: 'warning', title, message });
  };

  return {
    notifications,
    removeNotification,
    success,
    error,
    info,
    warning
  };
};
