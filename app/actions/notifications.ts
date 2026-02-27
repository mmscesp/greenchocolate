'use server';

import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { Prisma } from '@prisma/client';

export type NotificationType =
  | 'APPLICATION_SUBMITTED'
  | 'APPLICATION_STAGE_CHANGED'
  | 'APPLICATION_APPROVED'
  | 'APPLICATION_REJECTED'
  | 'PASS_RENEWED'
  | 'SYSTEM_ALERT';

export interface NotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
}

async function getCurrentProfileId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await prisma.profile.findUnique({
    where: { authId: user.id },
    select: { id: true },
  });

  return profile?.id || null;
}

export async function queueNotification(input: NotificationInput): Promise<{
  success: boolean;
  notificationId?: string;
  error?: string;
}> {
  try {
    const created = await prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: input.title,
        message: input.message,
        data: input.metadata as unknown as Prisma.InputJsonValue,
      },
      select: { id: true },
    });

    return {
      success: true,
      notificationId: created.id,
    };
  } catch (error) {
    console.error('queueNotification error:', error);
    return { success: false, error: 'Failed to queue notification' };
  }
}

export async function markNotificationsAsRead(notificationIds: string[]): Promise<void> {
  const profileId = await getCurrentProfileId();

  if (!profileId || notificationIds.length === 0) {
    return;
  }

  await prisma.notification.updateMany({
    where: {
      id: { in: notificationIds },
      userId: profileId,
    },
    data: {
      isRead: true,
    },
  });
}

export async function getUnreadNotificationCount(userId?: string): Promise<number> {
  const resolvedUserId = userId || (await getCurrentProfileId());

  if (!resolvedUserId) {
    return 0;
  }

  return prisma.notification.count({
    where: {
      userId: resolvedUserId,
      isRead: false,
    },
  });
}

export async function getUserNotifications(limit = 50): Promise<NotificationItem[]> {
  const profileId = await getCurrentProfileId();

  if (!profileId) {
    return [];
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: profileId },
    orderBy: { createdAt: 'desc' },
    take: Math.max(1, Math.min(limit, 200)),
  });

  return notifications.map((item) => ({
    id: item.id,
    type: item.type,
    title: item.title,
    message: item.message,
    isRead: item.isRead,
    createdAt: item.createdAt.toISOString(),
    data: (item.data as Record<string, unknown> | null) || undefined,
  }));
}
