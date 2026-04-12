import { EmailSubscriptionStatus, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function findProfileByEmail(email: string) {
  return prisma.profile.findUnique({
    where: { email: normalizeEmail(email) },
    select: { id: true, preferences: true },
  });
}

export async function subscribeMarketingEmail(input: {
  email: string;
  locale?: string | null;
  source?: string | null;
  metadata?: Record<string, unknown> | null;
}) {
  const normalizedEmail = normalizeEmail(input.email);
  const profile = await findProfileByEmail(normalizedEmail);
  const now = new Date();

  const subscription = await prisma.emailSubscription.upsert({
    where: { email: normalizedEmail },
    update: {
      profileId: profile?.id ?? undefined,
      status: EmailSubscriptionStatus.SUBSCRIBED,
      locale: input.locale ?? undefined,
      source: input.source ?? undefined,
      marketingConsentAt: now,
      unsubscribedAt: null,
      metadata: (input.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
    },
    create: {
      email: normalizedEmail,
      profileId: profile?.id ?? null,
      status: EmailSubscriptionStatus.SUBSCRIBED,
      locale: input.locale ?? null,
      source: input.source ?? null,
      marketingConsentAt: now,
      metadata: (input.metadata ?? null) as Prisma.InputJsonValue,
    },
  });

  if (profile?.id) {
    const preferences =
      profile.preferences && typeof profile.preferences === 'object' && !Array.isArray(profile.preferences)
        ? ({ ...profile.preferences } as Record<string, any>)
        : {};
    const notifications = preferences.notifications && typeof preferences.notifications === 'object'
      ? { ...preferences.notifications }
      : {};

    notifications.email = true;
    notifications.marketing = true;

    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        preferences: {
          ...preferences,
          notifications,
        } as Prisma.InputJsonValue,
      },
    });
  }

  return subscription;
}

export async function unsubscribeMarketingEmail(input: {
  email: string;
  provider?: string | null;
  metadata?: Record<string, unknown> | null;
}) {
  const normalizedEmail = normalizeEmail(input.email);
  const profile = await findProfileByEmail(normalizedEmail);
  const now = new Date();

  const subscription = await prisma.emailSubscription.upsert({
    where: { email: normalizedEmail },
    update: {
      profileId: profile?.id ?? undefined,
      status: EmailSubscriptionStatus.UNSUBSCRIBED,
      unsubscribedAt: now,
      provider: input.provider ?? undefined,
      metadata: (input.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
    },
    create: {
      email: normalizedEmail,
      profileId: profile?.id ?? null,
      status: EmailSubscriptionStatus.UNSUBSCRIBED,
      unsubscribedAt: now,
      provider: input.provider ?? null,
      metadata: (input.metadata ?? null) as Prisma.InputJsonValue,
    },
  });

  if (profile?.id) {
    const preferences =
      profile.preferences && typeof profile.preferences === 'object' && !Array.isArray(profile.preferences)
        ? ({ ...profile.preferences } as Record<string, any>)
        : {};
    const notifications = preferences.notifications && typeof preferences.notifications === 'object'
      ? { ...preferences.notifications }
      : {};

    notifications.marketing = false;

    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        preferences: {
          ...preferences,
          notifications,
        } as Prisma.InputJsonValue,
      },
    });
  }

  return subscription;
}

export async function canReceiveMarketingEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const subscription = await prisma.emailSubscription.findUnique({
    where: { email: normalizedEmail },
    select: { status: true },
  });

  return subscription?.status !== EmailSubscriptionStatus.UNSUBSCRIBED;
}

export async function markSubscriptionEmailDelivered(input: {
  email: string;
  audience: 'marketing' | 'transactional';
}) {
  const normalizedEmail = normalizeEmail(input.email);
  const field =
    input.audience === 'marketing' ? { lastMarketingEmailAt: new Date() } : { lastTransactionalEmailAt: new Date() };

  await prisma.emailSubscription.upsert({
    where: { email: normalizedEmail },
    update: field,
    create: {
      email: normalizedEmail,
      status: EmailSubscriptionStatus.SUBSCRIBED,
      ...field,
    },
  });
}
