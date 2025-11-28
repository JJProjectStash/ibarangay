// Helper utilities for notifications
export function extractNotificationsFromResponse(resp: any): any[] {
  if (!resp) return [];
  const payload = resp?.data ?? resp;

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.notifications)) return payload.notifications;
  if (Array.isArray(payload.data?.notifications)) return payload.data.notifications;
  if (Array.isArray(resp?.data?.notifications)) return resp.data.notifications;
  return [];
}

export function getUnreadCountFromPayload(resp: any): number {
  if (!resp) return 0;
  const payload = resp?.data ?? resp;

  // Prefer an explicit unreadCount if present
  if (typeof payload.unreadCount === "number") return payload.unreadCount;
  if (typeof resp?.data?.unreadCount === "number") return resp.data.unreadCount;

  // Otherwise compute from notifications array
  const notifications = extractNotificationsFromResponse(resp);
  if (Array.isArray(notifications)) {
    return notifications.filter((n) => !n.isRead).length;
  }

  return 0;
}

export default getUnreadCountFromPayload;
