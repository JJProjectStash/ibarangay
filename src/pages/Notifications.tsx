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

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      info: "bg-blue-500/20 text-blue-300 border-blue-400/50",
      success: "bg-green-500/20 text-green-300 border-green-400/50",
      warning: "bg-yellow-500/20 text-yellow-300 border-yellow-400/50",
      error: "bg-red-500/20 text-red-300 border-red-400/50",
    };
    return colors[type] || colors.info;
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
    <div className="min-h-screen relative">
      {/* Unified Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div
          className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-3xl animate-pulse"
          style={{ animationDuration: "10s", animationDelay: "2s" }}
        />
        <div
          className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-pink-500/15 to-purple-500/15 blur-3xl animate-pulse"
          style={{ animationDuration: "12s", animationDelay: "4s" }}
        />
      </div>

      <div className="relative z-10 p-6 page-transition">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="animate-in slide-in-from-top-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <p className="text-white/80">
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
                  className="bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:bg-white/20 hover:border-white/40 text-white transition-all duration-300"
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
                    className="bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:bg-white/20 hover:border-white/40 text-white transition-all duration-300"
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
              {notifications.map((notification, index) => (
                <Card
                  key={notification._id}
                  className={`bg-white/10 backdrop-blur-xl border-2 ${
                    !notification.isRead
                      ? "border-purple-400/50 bg-purple-500/10"
                      : "border-white/20"
                  } hover:border-white/40 shadow-2xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-[1.01] animate-in slide-in-from-bottom-4`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              notification.isRead
                                ? "bg-white/40"
                                : "bg-purple-400 animate-pulse"
                            }`}
                          />
                          <h3 className="text-lg font-semibold text-white">
                            {notification.title}
                          </h3>
                          <Badge
                            className={`${getTypeColor(
                              notification.type
                            )} border backdrop-blur-sm font-semibold`}
                          >
                            {notification.type.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-white/85 leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-sm text-white/70">
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
                            className="hover:bg-purple-500/20 hover:text-purple-300 text-white"
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(notification._id)}
                          className="hover:bg-red-500/20 hover:text-red-300 text-white"
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
    </div>
  );
};

export default Notifications;
