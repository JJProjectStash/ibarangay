import React from 'react';
import { render, screen, waitFor, fireEvent, cleanup } from '@testing-library/react';
import { expect, vi, describe, it, afterEach } from 'vitest';
// Not using jest-dom to avoid global expect timing issues in Vitest setup
import NotificationBell from '../NotificationBell';
import { MemoryRouter } from 'react-router-dom';

// Mock apiExtensions and socket service
const mockGetNotifications = vi.fn();
const mockMarkNotificationAsRead = vi.fn();
let socketCallback: ((n: any) => void) | null = null;

vi.mock('../../services/apiExtensions', () => ({
  default: {
    getNotifications: () => mockGetNotifications(),
    markNotificationAsRead: (id: string) => mockMarkNotificationAsRead(id),
  },
}));

vi.mock('../../services/socket', () => ({
  default: {
    onNotification: (cb: (n: any) => void) => {
      socketCallback = cb;
    },
    offNotification: vi.fn(),
  },
}));

describe('NotificationBell', () => {
  afterEach(() => {
    vi.clearAllMocks();
    socketCallback = null;
    cleanup();
  });

  it('renders unread count in aria-label when API returns unreadCount', async () => {
    mockGetNotifications.mockResolvedValueOnce({ data: { notifications: [{ _id: '1', isRead: false, title: 'T1', message: 'Hello', createdAt: new Date().toISOString() }], unreadCount: 1 } });

    render(
      <MemoryRouter>
        <NotificationBell />
      </MemoryRouter>
    );

    // Wait for the aria-label to be updated
    await waitFor(() => {
      const buttons = screen.getAllByRole('button', { name: /notifications/i });
      expect(buttons.some((b) => (b.getAttribute('aria-label') || '').includes('1 unread'))).toBe(true);
    });
  });

  it('updates unread count when a socket notification arrives', async () => {
    mockGetNotifications.mockResolvedValueOnce({ data: { notifications: [{ _id: '1', isRead: false, title: 'T1', message: 'Hello', createdAt: new Date().toISOString() }], unreadCount: 1 } });

    render(
      <MemoryRouter>
        <NotificationBell />
      </MemoryRouter>
    );

    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      expect(buttons.some((b) => (b.getAttribute('aria-label') || '').includes('1 unread'))).toBe(true);
    });

    // Simulate socket receiving a new notification
    const newNotif = { _id: '2', isRead: false, title: 'T2', message: 'World', createdAt: new Date().toISOString() };
    if (socketCallback) {
      socketCallback(newNotif);
    }

    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      expect(buttons.some((b) => (b.getAttribute('aria-label') || '').includes('2 unread'))).toBe(true);
    });
  });

  it('marks a notification as read when clicked and updates the aria-label', async () => {
    // Setup initial notifications with 1 unread
    mockGetNotifications.mockResolvedValueOnce({ data: { notifications: [{ _id: '1', isRead: false, title: 'T1', message: 'Hello', createdAt: new Date().toISOString() }], unreadCount: 1 } });
    // Mock marking as read
    mockMarkNotificationAsRead.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <NotificationBell />
      </MemoryRouter>
    );

    // Wait for the aria-label to show 1 unread
    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      expect(buttons.some((b) => (b.getAttribute('aria-label') || '').includes('1 unread'))).toBe(true);
    });

    // Open the dropdown
    const bellBtn = screen.getAllByRole('button', { name: /notifications/i })[0];
    fireEvent.click(bellBtn);

    // Click the notification item
    const item = await screen.findByText('T1');
    fireEvent.click(item);

    // Expect API mark-as-read to be called
    expect(mockMarkNotificationAsRead).toHaveBeenCalled();

    // After clicking and marking as read, expect the unread notifier to update (No unread notifications label in sr-only region)
    await waitFor(() => {
      screen.getByText('No unread notifications');
    });
  });
});
