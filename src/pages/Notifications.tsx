import React, { useState, useEffect } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import api from "../services/api";
import { Notification } from "../types";
import { format } from "date-fns";

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.getNotifications();
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.markNotificationAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.markAllNotificationsAsRead();
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteNotification(id);
      fetchNotifications();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
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

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>
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
          }}
        >
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
            Notifications
          </h1>
          {notifications.some((n) => !n.isRead) && (
            <button className="btn btn-outline" onClick={handleMarkAllAsRead}>
              <Check size={18} /> Mark All as Read
            </button>
          )}
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
                    <div style={{ display: "flex", gap: "0.5rem" }}>
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
