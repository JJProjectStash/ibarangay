import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import api from "../services/api";
import socketService from "../services/socket";

interface Notification {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();

    // Listen for real-time notifications
    socketService.onNotification((notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    // Click outside to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      socketService.offNotification();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await api.getNotifications();
      // Backend returns { success: true, data: { notifications: [], unreadCount: 0 } }
      const notificationData = response.data || {};
      const notifs = Array.isArray(notificationData.notifications)
        ? notificationData.notifications
        : [];
      setNotifications(notifs);
      setUnreadCount(notificationData.unreadCount || 0);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      // Set empty array on error to prevent crashes
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      complaint: "📋",
      event: "📅",
      service: "🔧",
      system: "ℹ️",
    };
    return icons[type] || "🔔";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-full hover:bg-white/20 hover-scale bg-white/10 backdrop-blur-sm border border-white/20"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center ring-2 ring-[#1e1b4b] font-semibold animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 max-h-96 bg-white/95 dark:bg-[#1e1b4b]/95 backdrop-blur-xl border-2 border-white/30 dark:border-purple-500/30 rounded-lg shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2">
          <div className="p-4 border-b border-border/50 flex justify-between items-center bg-white/50 dark:bg-white/5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs text-primary hover:text-primary/80 dark:text-purple-400 dark:hover:text-purple-300"
              >
                Mark all as read
              </Button>
            )}
          </div>

          <div className="overflow-y-auto max-h-80">
            {isLoading ? (
              <div className="p-8 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Loading...
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() =>
                    !notification.isRead && markAsRead(notification._id)
                  }
                  className={cn(
                    "p-4 border-b border-border/50 cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-white/10",
                    !notification.isRead && "bg-blue-50 dark:bg-purple-500/10"
                  )}
                >
                  <div className="flex gap-3 items-start">
                    <span className="text-lg">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p
                          className={cn(
                            "text-sm truncate",
                            notification.isRead
                              ? "font-normal text-gray-600 dark:text-gray-300"
                              : "font-medium text-gray-900 dark:text-white"
                          )}
                        >
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-primary dark:bg-purple-400 rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {format(
                          new Date(notification.createdAt),
                          "MMM dd, yyyy 'at' h:mm a"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
