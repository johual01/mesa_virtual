import React from 'react';
import { X, CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  onRemove: (id: string) => void;
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const styleMap = {
  success: 'bg-green-100 border-green-300 text-green-800',
  error: 'bg-red-100 border-red-300 text-red-800',
  info: 'bg-blue-100 border-blue-300 text-blue-800',
  warning: 'bg-yellow-100 border-yellow-300 text-yellow-800',
};

const iconColorMap = {
  success: 'text-green-600',
  error: 'text-red-600',
  info: 'text-blue-600',
  warning: 'text-yellow-600',
};

export const Toast: React.FC<ToastProps> = ({ id, type, title, message, onRemove }) => {
  const Icon = iconMap[type];

  return (
    <div className={`relative max-w-sm w-full border rounded-md p-4 shadow-md ${styleMap[type]} transition-all duration-300 ease-in-out`}>
      <div className="flex items-start space-x-3">
        <Icon className={`h-5 w-5 mt-0.5 ${iconColorMap[type]}`} />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold">{title}</h4>
          {message && (
            <p className="text-sm mt-1 opacity-90">{message}</p>
          )}
        </div>
        <button
          onClick={() => onRemove(id)}
          className="flex-shrink-0 ml-2 h-5 w-5 rounded-full flex items-center justify-center hover:bg-black hover:bg-opacity-10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

interface ToastContainerProps {
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message?: string;
  }>;
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ notifications, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          {...notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};
