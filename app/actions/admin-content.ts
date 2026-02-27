'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAdminSessionProfile } from '@/lib/security/admin-guard';
import { logAdminAuditEvent } from '@/lib/security/admin-audit';
import { getArticles } from '@/app/actions/articles';

export async function getAdminArticleIndex() {
  const admin = await getAdminSessionProfile();
  if (!admin) {
    return [];
  }

  const articles = await getArticles({ limit: 100, offset: 0 });

  await logAdminAuditEvent({
    tableName: 'Content',
    operation: 'ADMIN_LIST_ARTICLES',
    changedBy: admin.authId,
    recordId: 'index',
    changeData: { count: articles.length },
  });

  return articles;
}

export async function getAdminEventsIndex() {
  const admin = await getAdminSessionProfile();
  if (!admin) {
    return [];
  }

  return prisma.event.findMany({
    orderBy: { startDate: 'desc' },
    take: 100,
    include: {
      club: {
        select: {
          name: true,
          slug: true,
        },
      },
      city: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });
}

export async function toggleEventPublication(formData: FormData): Promise<void> {
  const admin = await getAdminSessionProfile();
  if (!admin) {
    return;
  }

  const eventId = String(formData.get('eventId') || '');
  const nextPublished = String(formData.get('nextPublished')) === 'true';

  if (!eventId) {
    return;
  }

  const previous = await prisma.event.findUnique({
    where: { id: eventId },
    select: { id: true, name: true, isPublished: true },
  });

  if (!previous) {
    return;
  }

  await prisma.event.update({
    where: { id: eventId },
    data: { isPublished: nextPublished },
  });

  await logAdminAuditEvent({
    tableName: 'Event',
    operation: 'ADMIN_TOGGLE_EVENT_PUBLISH',
    changedBy: admin.authId,
    recordId: previous.id,
    changeData: {
      eventName: previous.name,
      fromPublished: previous.isPublished,
      toPublished: nextPublished,
    },
  });

  revalidatePath('/');
}
