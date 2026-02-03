import React, { createContext, useContext, ReactNode } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationContainer } from '@/components/NotificationContainer';

type NotificationContextType = ReturnType<typeof useNotifications>;

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const notificationState = useNotifications();

  return (
    <NotificationContext.Provider value={notificationState}>
      {children}
      <NotificationContainer 
        notifications={notificationState.notifications} 
        removeNotification={notificationState.removeNotification} 
      />
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};
