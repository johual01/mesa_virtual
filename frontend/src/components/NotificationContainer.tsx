import React from 'react';
import { Notification } from '@/hooks/useNotifications';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationComponentProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

const NotificationComponent: React.FC<NotificationComponentProps> = ({ notification, onRemove }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className={`border rounded-lg p-4 mb-3 shadow-lg ${getBgColor()} transition-all duration-300 ease-in-out animate-in slide-in-from-right`}>
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <h4 className="font-semibold text-sm text-foreground">{notification.title}</h4>
          {notification.message && (
            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(notification.id)}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

interface NotificationContainerProps {
  notifications: Notification[];
  removeNotification: (id: string) => void;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({ 
  notifications, 
  removeNotification 
}) => {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-96 max-w-[90vw]">
      {notifications.map(notification => (
        <NotificationComponent
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};
