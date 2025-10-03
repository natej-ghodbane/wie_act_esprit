import React, { useState, useEffect } from 'react';
import { Bell, X, Check, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { toast } from 'react-hot-toast';
import { notificationsAPI } from '@/utils/api';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'low_stock' | 'out_of_stock' | 'restock' | 'general';
  priority: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  createdAt: string;
  productId?: {
    _id: string;
    title: string;
  };
}

interface NotificationCenterProps {
  onClose: () => void;
  isOpen: boolean;
}

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
    case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
    default: return <Info className="w-4 h-4 text-blue-500" />;
  }
};

const getPriorityBgColor = (priority: string) => {
  switch (priority) {
    case 'error': return 'bg-red-50 border-red-200';
    case 'warning': return 'bg-amber-50 border-amber-200';
    case 'success': return 'bg-green-50 border-green-200';
    default: return 'bg-blue-50 border-blue-200';
  }
};

export default function NotificationCenter({ onClose, isOpen }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await notificationsAPI.getAll();
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await notificationsAPI.delete(notificationId);
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60">
      {/* Subtle backdrop to keep dashboard visible */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      {/* Panel */}
      <div className="absolute top-20 right-4 w-[92vw] sm:w-[28rem] md:w-[32rem] max-h-[75vh] overflow-hidden rounded-2xl backdrop-blur-xl border shadow-xl
        bg-white/80 border-purple-200/50 dark:bg-purple-900/40 dark:border-purple-700/50">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-purple-200/50 dark:border-purple-700/50">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-pink-500" />
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Notifications</h2>
            <span className="bg-pink-100 text-pink-800 dark:bg-pink-500/20 dark:text-pink-300 text-xs px-2 py-0.5 rounded-full">
              {notifications.filter(n => !n.isRead).length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {notifications.some(n => !n.isRead) && (
              <Button size="sm" variant="outline" onClick={markAllAsRead} className="text-xs">
                <Check className="w-4 h-4 mr-1" />
                Mark all read
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
              <p className="mt-2 text-gray-600 dark:text-purple-200">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-400 dark:text-purple-300 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-purple-200">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-purple-200/60 dark:divide-purple-700/40">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`px-5 py-4 transition-colors ${
                    !notification.isRead 
                      ? 'bg-purple-50/60 dark:bg-purple-800/20' 
                      : 'bg-transparent'
                  } hover:bg-purple-50/80 dark:hover:bg-purple-800/30`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getPriorityIcon(notification.priority)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium ${
                            !notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-purple-100'
                          }`}>
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-purple-100 mt-1">
                            {notification.message}
                          </p>
                          {notification.productId && (
                            <p className="text-xs text-pink-600 dark:text-pink-300 mt-1">
                              Product: {notification.productId.title}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 dark:text-purple-200 mt-2">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {!notification.isRead && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAsRead(notification._id)}
                              className="p-1.5"
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteNotification(notification._id)}
                            className="p-1.5 text-red-600 hover:text-red-700"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-purple-200/50 dark:border-purple-700/50 bg-white/60 dark:bg-purple-900/30">
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-sm"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}