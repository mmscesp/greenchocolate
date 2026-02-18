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
