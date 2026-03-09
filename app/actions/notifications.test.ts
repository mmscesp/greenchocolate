import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    notification: {
      create: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      updateMany: vi.fn(),
    },
    profile: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import {
  queueNotification,
  markNotificationsAsRead,
  getUnreadNotificationCount,
  getUserNotifications,
} from '@/app/actions/notifications';

describe('Notification Actions', () => {
  const mockUser = { id: 'user-123', email: 'test@example.com' };
  const mockProfile = {
    id: 'profile-123',
    authId: 'user-123',
    email: 'test@example.com',
    displayName: 'Test User',
    role: 'USER',
    tier: 'novice',
    bio: null,
    avatarUrl: null,
    isVerified: false,
    hasCompletedOnboarding: true,
    lastActiveAt: null,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    managedClubId: null,
    preferences: null,
    stats: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (createClient as any).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
    });
    (prisma.profile.findUnique as any).mockResolvedValue(mockProfile);
    (prisma.profile.update as any).mockResolvedValue(mockProfile);
  });

  describe('queueNotification', () => {
    it('should create notification successfully', async () => {
      (prisma.notification.create as any).mockResolvedValue({ id: 'notif-123' });

      const result = await queueNotification({
        userId: 'user-456',
        type: 'APPLICATION_APPROVED',
        title: 'Application Approved',
        message: 'Your application has been approved',
        metadata: { applicationId: 'app-123' },
      });

      expect(result.success).toBe(true);
      expect(result.notificationId).toBe('notif-123');
      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user-456',
          type: 'APPLICATION_APPROVED',
          title: 'Application Approved',
          message: 'Your application has been approved',
        }),
        select: { id: true },
      });
    });

    it('should handle database errors gracefully', async () => {
      (prisma.notification.create as any).mockRejectedValue(new Error('DB Error'));

      const result = await queueNotification({
        userId: 'user-456',
        type: 'SYSTEM_ALERT',
        title: 'Alert',
        message: 'Test alert',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to queue notification');
    });
  });

  describe('getUnreadNotificationCount', () => {
    it('should return 0 when user is not authenticated', async () => {
      (createClient as any).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
        },
      });

      const result = await getUnreadNotificationCount();

      expect(result).toBe(0);
    });

    it('should return count of unread notifications', async () => {
      (prisma.notification.count as any).mockResolvedValue(5);

      const result = await getUnreadNotificationCount();

      expect(result).toBe(5);
      expect(prisma.notification.count).toHaveBeenCalledWith({
        where: {
          userId: mockProfile.id,
          isRead: false,
        },
      });
    });

    it('should accept explicit userId parameter', async () => {
      (prisma.notification.count as any).mockResolvedValue(3);

      const result = await getUnreadNotificationCount('explicit-user-id');

      expect(result).toBe(3);
      expect(prisma.notification.count).toHaveBeenCalledWith({
        where: {
          userId: 'explicit-user-id',
          isRead: false,
        },
      });
    });
  });

  describe('markNotificationsAsRead', () => {
    it('should do nothing when user is not authenticated', async () => {
      (createClient as any).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
        },
      });

      await markNotificationsAsRead(['notif-1', 'notif-2']);

      expect(prisma.notification.updateMany).not.toHaveBeenCalled();
    });

    it('should do nothing when notificationIds is empty', async () => {
      await markNotificationsAsRead([]);

      expect(prisma.notification.updateMany).not.toHaveBeenCalled();
    });

    it('should update notifications as read', async () => {
      (prisma.notification.updateMany as any).mockResolvedValue({ count: 2 });

      await markNotificationsAsRead(['notif-1', 'notif-2']);

      expect(prisma.notification.updateMany).toHaveBeenCalledWith({
        where: {
          id: { in: ['notif-1', 'notif-2'] },
          userId: mockProfile.id,
        },
        data: {
          isRead: true,
        },
      });
    });
  });

  describe('getUserNotifications', () => {
    it('should return empty array when user is not authenticated', async () => {
      (createClient as any).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
        },
      });

      const result = await getUserNotifications();

      expect(result).toEqual([]);
    });

    it('should return notifications sorted by createdAt desc', async () => {
      const mockNotifications = [
        {
          id: 'notif-1',
          type: 'APPLICATION_APPROVED',
          title: 'Approved',
          message: 'Your app was approved',
          isRead: false,
          createdAt: new Date('2026-01-02'),
          data: { applicationId: 'app-1' },
        },
        {
          id: 'notif-2',
          type: 'SYSTEM_ALERT',
          title: 'Alert',
          message: 'System update',
          isRead: true,
          createdAt: new Date('2026-01-01'),
          data: null,
        },
      ];

      (prisma.notification.findMany as any).mockResolvedValue(mockNotifications);

      const result = await getUserNotifications();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('notif-1');
      expect(result[1].id).toBe('notif-2');
      expect(result[0].isRead).toBe(false);
      expect(result[1].isRead).toBe(true);
    });

    it('should respect limit parameter', async () => {
      (prisma.notification.findMany as any).mockResolvedValue([]);

      await getUserNotifications(10);

      expect(prisma.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10,
        })
      );
    });

    it('should clamp limit between 1 and 200', async () => {
      (prisma.notification.findMany as any).mockResolvedValue([]);

      await getUserNotifications(0);
      expect(prisma.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 1,
        })
      );

      vi.clearAllMocks();
      (prisma.notification.findMany as any).mockResolvedValue([]);

      await getUserNotifications(500);
      expect(prisma.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 200,
        })
      );
    });
  });
});
