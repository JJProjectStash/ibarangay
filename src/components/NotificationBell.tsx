import React, { useState, useEffect, useRef } from "react";
import { Bell, X, Check, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import api from "../services/apiExtensions";
import socketService from "../services/socket";

interface Notification {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: string; // Added for routing
}

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
      const notificationData = response.data?.data ?? response.data ?? {};
      const notifs = Array.isArray(notificationData.notifications)
        ? notificationData.notifications.slice(0, 5) // Only show latest 5 in dropdown
        : [];
      setNotifications(notifs);
      setUnreadCount(notificationData.unreadCount || 0);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
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

  const handleViewAll = () => {
    setIsOpen(false);
    navigate("/notifications");
  };

  // NEW: Function to determine the route based on notification type
  const getNotificationRoute = (notification: Notification): string => {
    const { type, relatedId } = notification;

    // Map notification types to their respective routes
    switch (type) {
      case "complaint":
        return relatedId ? `/complaints/${relatedId}` : "/complaints";
      case "event":
        return relatedId ? `/events/${relatedId}` : "/events";
      case "service":
        return relatedId ? `/services/${relatedId}` : "/services";
      case "announcement":
        return relatedId ? `/announcements/${relatedId}` : "/announcements";
      case "system":
        return "/notifications";
      default:
        return "/notifications";
    }
  };

  // NEW: Handle notification click to navigate and mark as read
  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if unread
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }

    // Close dropdown
    setIsOpen(false);

    // Navigate to the respective page
    const route = getNotificationRoute(notification);
    navigate(route);
  };

  const getNotificationIcon = (type: string) => {
    const iconMap: Record<string, { icon: string; color: string; bg: string }> =
      {
        complaint: {
          icon: "💬",
          color: "#ef4444",
          bg: "rgba(239, 68, 68, 0.1)",
        },
        event: { icon: "📅", color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" },
        service: {
          icon: "🔧",
          color: "#f59e0b",
          bg: "rgba(245, 158, 11, 0.1)",
        },
        announcement: {
          icon: "📢",
          color: "#3b82f6",
          bg: "rgba(59, 130, 246, 0.1)",
        },
        system: { icon: "ℹ️", color: "#6366f1", bg: "rgba(99, 102, 241, 0.1)" },
      };
    return (
      iconMap[type] || {
        icon: "🔔",
        color: "#6366f1",
        bg: "rgba(99, 102, 241, 0.1)",
      }
    );
  };

  return (
    <div style={styles.container} ref={dropdownRef}>
      <button
          id="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...styles.bellButton,
          ...(isOpen ? styles.bellButtonActive : {}),
        }}
        className="notification-bell-btn"
        aria-label={`Notifications${unreadCount > 0 ? `: ${unreadCount} unread` : ''}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <Bell size={18} strokeWidth={2.2} aria-hidden={true} focusable={false} />
        {unreadCount > 0 && (
          <span style={styles.badge} className="notification-badge">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div id="notification-dropdown" style={styles.dropdown} className="notification-dropdown" role="menu" aria-labelledby="notification-bell" >
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <Bell size={18} strokeWidth={2.5} style={{ color: "#1E3A8A" }} aria-hidden={true} focusable={false} />
              <h3 style={styles.headerTitle}>Notifications</h3>
              {unreadCount > 0 && (
                <span style={styles.headerBadge}>{unreadCount}</span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={styles.closeButton}
              className="notification-close-btn"
              aria-label="Close notifications"
            >
              <X size={18} strokeWidth={2} />
            </button>
          </div>

          {/* Actions Bar */}
          {unreadCount > 0 && (
            <div style={styles.actionsBar}>
              <button
                onClick={markAllAsRead}
                style={styles.markAllButton}
                className="mark-all-btn"
              >
                <Check size={14} strokeWidth={2.5} aria-hidden={true} focusable={false} />
                <span>Mark all as read</span>
              </button>
            </div>
          )}

          {/* Notifications List */}
          <div style={styles.notificationsList}>
              {isLoading ? (
              <div style={styles.emptyState}>
                <div style={styles.loader} className="notification-loader" />
                <p style={styles.emptyText}>Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>
                  <Bell size={48} strokeWidth={1.5} />
                </div>
                <p style={styles.emptyTitle}>No notifications yet</p>
                <p style={styles.emptySubtext}>
                  We'll notify you when something arrives
                </p>
              </div>
              ) : (
              notifications.map((notification) => {
                const iconData = getNotificationIcon(notification.type);
                return (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    role="menuitem"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleNotificationClick(notification);
                      }
                    }}
                    style={{
                      ...styles.notificationItem,
                      ...(notification.isRead
                        ? {}
                        : styles.notificationItemUnread),
                    }}
                    className="notification-item"
                  >
                    <div
                      style={{
                        ...styles.notificationIcon,
                        background: iconData.bg,
                      }}
                    >
                      <span style={{ fontSize: "1.25rem" }}>
                        {iconData.icon}
                      </span>
                    </div>
                    <div style={styles.notificationContent}>
                      <div style={styles.notificationHeader}>
                        <p
                          style={{
                            ...styles.notificationTitle,
                            fontWeight: notification.isRead ? "500" : "600",
                          }}
                        >
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <span style={styles.unreadDot} />
                        )}
                      </div>
                      <p style={styles.notificationMessage}>
                        {notification.message}
                      </p>
                      <p style={styles.notificationTime}>
                        {format(
                          new Date(notification.createdAt),
                          "MMM dd, yyyy 'at' h:mm a"
                        )}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div style={styles.footer}>
              <button
                onClick={handleViewAll}
                style={styles.viewAllButton}
                className="view-all-btn"
              >
                <span>View all notifications</span>
                <ArrowRight size={16} strokeWidth={2.5} aria-hidden={true} focusable={false} />
              </button>
            </div>
          )}
        </div>
      )}
      {/* Visually hidden region for screen readers to announce unread count updates */}
      <span id="notification-unread-count" className="sr-only" aria-live="polite" aria-atomic="true">
        {unreadCount > 0 ? `${unreadCount} unread notifications` : 'No unread notifications'}
      </span>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: "relative",
  },
  bellButton: {
    position: "relative",
    padding: "0.5rem",
    background: "rgba(255, 255, 255, 0.12)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.25)",
    borderRadius: "8px",
    cursor: "pointer",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    width: "40px",
    height: "40px",
  },
  bellButtonActive: {
    background: "rgba(255, 255, 255, 0.2)",
    borderColor: "rgba(255, 255, 255, 0.35)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  badge: {
    position: "absolute",
    top: "-4px",
    right: "-4px",
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    color: "white",
    borderRadius: "10px",
    minWidth: "20px",
    height: "20px",
    fontSize: "0.625rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    padding: "0 0.375rem",
    border: "2px solid rgba(30, 58, 138, 0.8)",
    boxShadow: "0 2px 8px rgba(239, 68, 68, 0.4)",
    letterSpacing: "-0.02em",
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 0.5rem)",
    right: 0,
    width: "min(400px, calc(100vw - 2rem))",
    maxHeight: "min(600px, calc(100vh - 120px))",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2), 0 0 1px rgba(0, 0, 0, 0.1)",
    zIndex: 1001,
    overflow: "hidden",
    border: "1px solid rgba(0, 0, 0, 0.06)",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 1.25rem",
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
    flexShrink: 0,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "0.625rem",
    minWidth: 0,
    flex: 1,
  },
  headerTitle: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#1F2937",
    margin: 0,
    letterSpacing: "-0.01em",
    whiteSpace: "nowrap",
  },
  headerBadge: {
    background: "linear-gradient(135deg, #1E3A8A, #2563eb)",
    color: "white",
    borderRadius: "10px",
    padding: "0.125rem 0.5rem",
    fontSize: "0.6875rem",
    fontWeight: "700",
    letterSpacing: "0.02em",
    flexShrink: 0,
  },
  closeButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#6B7280",
    padding: "0.25rem",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    flexShrink: 0,
  },
  actionsBar: {
    padding: "0.75rem 1.25rem",
    background: "rgba(30, 58, 138, 0.03)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
    flexShrink: 0,
  },
  markAllButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    background: "transparent",
    border: "none",
    color: "#1E3A8A",
    fontSize: "0.8125rem",
    fontWeight: "600",
    cursor: "pointer",
    padding: "0.375rem 0.75rem",
    borderRadius: "6px",
    transition: "all 0.2s ease",
  },
  notificationsList: {
    overflowY: "auto",
    overflowX: "hidden",
    flex: 1,
    minHeight: 0,
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "3rem 2rem",
    textAlign: "center",
  },
  emptyIcon: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, rgba(30, 58, 138, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1.25rem",
    color: "#94a3b8",
  },
  emptyTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: "0.5rem",
  },
  emptyText: {
    fontSize: "0.875rem",
    color: "#6B7280",
    margin: 0,
  },
  emptySubtext: {
    fontSize: "0.8125rem",
    color: "#9CA3AF",
    margin: 0,
  },
  loader: {
    width: "40px",
    height: "40px",
    border: "3px solid rgba(30, 58, 138, 0.1)",
    borderTop: "3px solid #1E3A8A",
    borderRadius: "50%",
    marginBottom: "1rem",
  },
  notificationItem: {
    display: "flex",
    gap: "0.875rem",
    padding: "1rem 1.25rem",
    borderBottom: "1px solid rgba(0, 0, 0, 0.04)",
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    background: "white",
  },
  notificationItemUnread: {
    background: "rgba(30, 58, 138, 0.03)",
  },
  notificationIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    border: "1px solid rgba(0, 0, 0, 0.05)",
  },
  notificationContent: {
    flex: 1,
    minWidth: 0,
    overflow: "hidden",
  },
  notificationHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    marginBottom: "0.375rem",
    gap: "0.5rem",
  },
  notificationTitle: {
    fontSize: "0.875rem",
    color: "#1F2937",
    margin: 0,
    lineHeight: 1.4,
    letterSpacing: "-0.01em",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  unreadDot: {
    width: "8px",
    height: "8px",
    background: "linear-gradient(135deg, #1E3A8A, #2563eb)",
    borderRadius: "50%",
    flexShrink: 0,
    marginTop: "0.25rem",
    boxShadow: "0 0 0 3px rgba(30, 58, 138, 0.15)",
  },
  notificationMessage: {
    fontSize: "0.8125rem",
    color: "#6B7280",
    margin: "0 0 0.5rem 0",
    lineHeight: 1.5,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    wordBreak: "break-word",
  },
  notificationTime: {
    fontSize: "0.6875rem",
    color: "#9CA3AF",
    margin: 0,
    fontWeight: "500",
  },
  footer: {
    padding: "0.875rem 1.25rem",
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    borderTop: "1px solid rgba(0, 0, 0, 0.06)",
    flexShrink: 0,
  },
  viewAllButton: {
    width: "100%",
    padding: "0.625rem",
    background: "transparent",
    border: "1px solid rgba(30, 58, 138, 0.2)",
    borderRadius: "8px",
    color: "#1E3A8A",
    fontSize: "0.8125rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
  },
};

// Enhanced animations and hover effects
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes notification-fade-in {
    from {
      opacity: 0;
      transform: translateY(-12px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes notification-badge-pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

  @keyframes notification-loader {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .notification-dropdown {
    animation: notification-fade-in 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .notification-badge {
    animation: notification-badge-pulse 2s ease-in-out infinite;
  }

  .notification-loader {
    animation: notification-loader 1s linear infinite;
  }

  .notification-bell-btn:hover {
    background: rgba(255, 255, 255, 0.2) !important;
    border-color: rgba(255, 255, 255, 0.35) !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  }

  .notification-close-btn:hover {
    background: rgba(0, 0, 0, 0.05) !important;
    color: #1F2937 !important;
  }

  .mark-all-btn:hover {
    background: rgba(30, 58, 138, 0.08) !important;
  }

  .notification-item:hover {
    background: rgba(30, 58, 138, 0.05) !important;
  }

  .view-all-btn:hover {
    background: rgba(30, 58, 138, 0.05) !important;
    border-color: rgba(30, 58, 138, 0.3) !important;
    transform: translateX(2px);
  }

  /* Custom scrollbar for notifications list */
  .notification-dropdown > div:nth-child(3)::-webkit-scrollbar {
    width: 6px;
  }

  .notification-dropdown > div:nth-child(3)::-webkit-scrollbar-track {
    background: transparent;
  }

  .notification-dropdown > div:nth-child(3)::-webkit-scrollbar-thumb {
    background: rgba(30, 58, 138, 0.2);
    border-radius: 3px;
  }

  .notification-dropdown > div:nth-child(3)::-webkit-scrollbar-thumb:hover {
    background: rgba(30, 58, 138, 0.3);
  }

  /* Firefox scrollbar */
  .notification-dropdown > div:nth-child(3) {
    scrollbar-width: thin;
    scrollbar-color: rgba(30, 58, 138, 0.2) transparent;
  }

  /* Responsive adjustments */
  @media (max-width: 480px) {
    .notification-dropdown {
      width: calc(100vw - 1rem) !important;
      right: -0.5rem;
    }
  }
`;
document.head.appendChild(styleSheet);

export default NotificationBell;
