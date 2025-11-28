import { describe, it, expect } from 'vitest';
import {
  extractNotificationsFromResponse,
  getUnreadCountFromPayload,
} from './notificationHelpers';

describe('notificationHelpers', () => {
  it('extracts notifications array from payload variations', () => {
    expect(extractNotificationsFromResponse([])).toEqual([]);

    const resp1 = { data: { notifications: [{ id: 1 }, { id: 2 }] } };
    expect(extractNotificationsFromResponse(resp1)).toEqual([
      { id: 1 },
      { id: 2 },
    ]);

    const resp2 = { notifications: [{ id: 'a' }] };
    expect(extractNotificationsFromResponse(resp2)).toEqual([{ id: 'a' }]);

    const resp3 = { data: [{ id: 'x' }, { id: 'y' }] };
    expect(extractNotificationsFromResponse(resp3)).toEqual([{ id: 'x' }, { id: 'y' }]); // array payload returns as-is
  });

  it('returns explicit unreadCount when present', () => {
    const r1 = { data: { unreadCount: 5 } };
    expect(getUnreadCountFromPayload(r1)).toBe(5);

    const r2 = { unreadCount: 3 };
    expect(getUnreadCountFromPayload(r2)).toBe(3);
  });

  it('computes unread count from notifications array', () => {
    const payload = {
      data: {
        notifications: [
          { _id: '1', isRead: false },
          { _id: '2', isRead: true },
          { _id: '3', isRead: false },
        ],
      },
    };
    expect(getUnreadCountFromPayload(payload)).toBe(2);
  });

  it('returns 0 for empty input', () => {
    expect(getUnreadCountFromPayload(null)).toBe(0);
    expect(getUnreadCountFromPayload({})).toBe(0);
  });
});
