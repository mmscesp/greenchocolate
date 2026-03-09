import { getSessionProfile } from '@/lib/session-profile';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const profile = await getSessionProfile({ ensure: true });

  if (!profile) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [favorites, reviews, membershipRequests, notifications, safetyPass, bookings] = await Promise.all([
    prisma.favorite.findMany({
      where: { userId: profile.id },
      orderBy: { createdAt: 'desc' },
      include: {
        club: {
          select: {
            id: true,
            name: true,
            slug: true,
            neighborhood: true,
          },
        },
      },
    }),
    prisma.review.findMany({
      where: { userId: profile.id },
      orderBy: { createdAt: 'desc' },
      include: {
        club: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    }),
    prisma.membershipRequest.findMany({
      where: { userId: profile.id },
      orderBy: { createdAt: 'desc' },
      include: {
        club: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    }),
    prisma.notification.findMany({
      where: { userId: profile.id },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.safetyPass.findUnique({
      where: { userId: profile.id },
    }),
    prisma.booking.findMany({
      where: { userId: profile.id },
      orderBy: [{ scheduledFor: 'desc' }, { createdAt: 'desc' }],
      include: {
        club: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        event: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    }),
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    profile: {
      id: profile.id,
      authId: profile.authId,
      email: profile.email,
      displayName: profile.displayName,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl,
      role: profile.role,
      tier: profile.tier,
      isVerified: profile.isVerified,
      hasCompletedOnboarding: profile.hasCompletedOnboarding,
      managedClubId: profile.managedClubId,
      preferences: profile.preferences,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      lastActiveAt: profile.lastActiveAt,
    },
    favorites,
    reviews,
    membershipRequests,
    notifications,
    safetyPass,
    bookings,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="scm-profile-export-${profile.id}.json"`,
      'Cache-Control': 'no-store',
    },
  });
}
