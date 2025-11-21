import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { format } from "date-fns";
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
      const notifs = response.data || [];
      setNotifications(notifs);
      setUnreadCount(notifs.filter((n: Notification) => !n.isRead).length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
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
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "relative",
          padding: "0.5rem",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "var(--text)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "0.25rem",
              right: "0.25rem",
              background: "#ef4444",
              color: "white",
              borderRadius: "50%",
              width: "18px",
              height: "18px",
              fontSize: "0.7rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 0.5rem)",
            right: 0,
            width: "360px",
            maxHeight: "500px",
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            zIndex: 1000,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "1rem",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ fontSize: "1rem", fontWeight: "600" }}>
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  fontSize: "0.75rem",
                  color: "var(--accent)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div style={{ overflowY: "auto", maxHeight: "400px" }}>
            {isLoading ? (
              <div style={{ padding: "2rem", textAlign: "center" }}>
                <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center" }}>
                <Bell
                  size={48}
                  style={{
                    margin: "0 auto 1rem",
                    color: "var(--text-secondary)",
                  }}
                />
                <p style={{ color: "var(--text-secondary)" }}>
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
                  style={{
                    padding: "1rem",
                    borderBottom: "1px solid var(--border)",
                    cursor: notification.isRead ? "default" : "pointer",
                    background: notification.isRead
                      ? "transparent"
                      : "rgba(99, 102, 241, 0.05)",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!notification.isRead) {
                      e.currentTarget.style.background =
                        "rgba(99, 102, 241, 0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!notification.isRead) {
                      e.currentTarget.style.background =
                        "rgba(99, 102, 241, 0.05)";
                    }
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "start",
                    }}
                  >
                    <span style={{ fontSize: "1.5rem" }}>
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "start",
                          marginBottom: "0.25rem",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: notification.isRead ? "400" : "600",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              background: "var(--accent)",
                              borderRadius: "50%",
                              flexShrink: 0,
                              marginTop: "0.25rem",
                            }}
                          />
                        )}
                      </div>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-secondary)",
                          marginBottom: "0.5rem",
                          lineHeight: "1.4",
                        }}
                      >
                        {notification.message}
                      </p>
                      <p
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--text-secondary)",
                        }}
                      >
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
