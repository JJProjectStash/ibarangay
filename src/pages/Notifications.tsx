import React, { useState, useEffect } from "react";
import { Bell, Check, Trash2, RefreshCw } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "../services/api";
import socketService from "../services/socket";
import { Notification } from "../types";
import { format } from "date-fns";
import { showSuccessToast, showErrorToast } from "../components/Toast";
import { getErrorMessage } from "../utils/errorHandler";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    fetchNotifications();

    // Connect socket and listen for real-time notifications
    if (token) {
      socketService.connect(token);

      socketService.onNotification((data) => {
        setNotifications((prev) => [data.notification, ...prev]);
        showSuccessToast(data.notification.title);
      });

      return () => {
        socketService.offNotification();
      };
    }
  }, [token]);

  const fetchNotifications = async (showLoader = true) => {
    try {
      if (showLoader) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      const response = await api.getNotifications();
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      showErrorToast(getErrorMessage(error));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      showSuccessToast("Notification marked as read");
    } catch (error) {
      console.error("Failed to mark as read:", error);
      showErrorToast(getErrorMessage(error));
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      showSuccessToast("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      showErrorToast(getErrorMessage(error));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) {
      return;
    }

    try {
      await api.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      showSuccessToast("Notification deleted");
    } catch (error) {
      console.error("Failed to delete notification:", error);
      showErrorToast(getErrorMessage(error));
    }
  };

  const handleRefresh = () => {
    fetchNotifications(false);
  };

  const getTypeVariant = (type: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      info: "default",
      success: "default",
      warning: "secondary",
      error: "destructive",
    };
    return variants[type] || "default";
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6 page-transition">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="animate-in slide-in-from-top-4 duration-500">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <p className="text-muted-foreground">
                  {unreadCount} unread notification
                  {unreadCount !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="hover-lift"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  onClick={handleMarkAllAsRead}
                  className="hover-lift"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Mark All as Read
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications"
            description="You're all caught up! Check back later for updates."
          />
        ) : (
          <div className="space-y-4 animate-in fade-in duration-700 delay-100">
            {notifications.map((notification) => (
              <Card
                key={notification._id}
                className={`glass-card card-hover overflow-hidden group transition-all duration-300 ${
                  !notification.isRead
                    ? "border-l-4 border-l-primary bg-primary/5"
                    : "opacity-75"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            notification.isRead
                              ? "bg-muted"
                              : "bg-primary animate-pulse"
                          }`}
                        />
                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                          {notification.title}
                        </h3>
                        <Badge variant={getTypeVariant(notification.type)}>
                          {notification.type.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(
                          new Date(notification.createdAt),
                          "MMM dd, yyyy - h:mm a"
                        )}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="hover:bg-primary/10 hover:text-primary"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(notification._id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
