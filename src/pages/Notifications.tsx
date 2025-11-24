import React, { useState, useEffect } from "react";
import { Bell, Check, Trash2, RefreshCw } from "lucide-react";
import api from "../services/apiExtensions";
import socketService from "../services/socket";
import { Notification } from "../types";
import { format } from "date-fns";
import { showSuccessToast, showErrorToast } from "../components/Toast";
import { getErrorMessage } from "../utils/errorHandler";
import { useAuth } from "../context/AuthContext";

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

  const getTypeStyles = (type: string) => {
    const styles: Record<string, { bg: string; color: string }> = {
      info: { bg: "#DBEAFE", color: "#1E40AF" },
      success: { bg: "#D1FAE5", color: "#065F46" },
      warning: { bg: "#FEF3C7", color: "#92400E" },
      error: { bg: "#FEE2E2", color: "#991B1B" },
    };
    return styles[type] || styles.info;
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div className="spinner" />
        <p style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>
          Loading notifications...
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem 0", minHeight: "calc(100vh - 64px)" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
              Notifications
            </h1>
            {unreadCount > 0 && (
              <p
                style={{ color: "var(--text-secondary)", marginTop: "0.25rem" }}
              >
                {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              className="btn btn-outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <RefreshCw size={18} className={isRefreshing ? "spinning" : ""} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
            {unreadCount > 0 && (
              <button
                className="btn btn-outline"
                onClick={handleMarkAllAsRead}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Check size={18} /> Mark All as Read
              </button>
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {notifications.length === 0 ? (
            <div
              className="card"
              style={{ textAlign: "center", padding: "3rem" }}
            >
              <Bell
                size={48}
                style={{
                  margin: "0 auto 1rem",
                  color: "var(--text-secondary)",
                }}
              />
              <p style={{ color: "var(--text-secondary)" }}>No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const typeStyles = getTypeStyles(notification.type);
              return (
                <div
                  key={notification._id}
                  className="card"
                  style={{
                    opacity: notification.isRead ? 0.7 : 1,
                    borderLeft: `4px solid ${typeStyles.color}`,
                    transition: "opacity 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      gap: "1rem",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          marginBottom: "0.5rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: notification.isRead
                              ? "var(--border)"
                              : typeStyles.color,
                            flexShrink: 0,
                          }}
                        />
                        <h3 style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                          {notification.title}
                        </h3>
                        <span
                          style={{
                            padding: "0.25rem 0.5rem",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            fontWeight: "500",
                            background: typeStyles.bg,
                            color: typeStyles.color,
                          }}
                        >
                          {notification.type.toUpperCase()}
                        </span>
                      </div>
                      <p style={{ marginBottom: "0.75rem", lineHeight: "1.6" }}>
                        {notification.message}
                      </p>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {format(
                          new Date(notification.createdAt),
                          "MMM dd, yyyy - h:mm a"
                        )}
                      </p>
                    </div>
                    <div
                      style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}
                    >
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification._id)}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding: "0.5rem",
                            color: "var(--accent)",
                          }}
                          title="Mark as read"
                        >
                          <Check size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification._id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: "0.5rem",
                          color: "var(--error)",
                        }}
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
