'use server';

import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

type ContentType = 'CLUB_DETAILS' | 'CONTACT_INFO' | 'MEMBER_DIRECTORY';
type AccessLevel = 'NONE' | 'BASIC' | 'FULL';

async function getCurrentProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return prisma.profile.findUnique({
    where: { authId: user.id },
    select: {
      id: true,
      isVerified: true,
      role: true,
    },
  });
}

function inferAccessLevel(hasApprovedMembership: boolean, isVerified: boolean): AccessLevel {
  if (hasApprovedMembership) return 'FULL';
  if (isVerified) return 'BASIC';
  return 'NONE';
}

export async function checkContentAccess(
  userId: string,
  contentType: ContentType
): Promise<{
  hasAccess: boolean;
  accessLevel: AccessLevel;
  requiredAction?: 'VERIFY_EMAIL' | 'COMPLETE_PROFILE' | 'SUBMIT_APPLICATION' | 'WAIT_APPROVAL';
  message: string;
}> {
  const profile = await prisma.profile.findUnique({
    where: { id: userId },
    select: { id: true, isVerified: true },
  });

  if (!profile) {
    return {
      hasAccess: false,
      accessLevel: 'NONE',
      requiredAction: 'VERIFY_EMAIL',
      message: 'Please sign in to continue.',
    };
  }

  const membership = await prisma.membershipRequest.findFirst({
    where: {
      userId,
      status: 'APPROVED',
    },
    orderBy: { reviewedAt: 'desc' },
  });

  const accessLevel = inferAccessLevel(Boolean(membership), profile.isVerified);

  if (accessLevel === 'FULL') {
    return {
      hasAccess: true,
      accessLevel,
      message: 'Access granted.',
    };
  }

  if (accessLevel === 'BASIC') {
    const basicAllowed = contentType === 'CLUB_DETAILS';
    return {
      hasAccess: basicAllowed,
      accessLevel,
      requiredAction: basicAllowed ? undefined : 'SUBMIT_APPLICATION',
      message: basicAllowed
        ? 'Limited access granted.'
        : 'Submit a membership request to unlock this section.',
    };
  }

  return {
    hasAccess: false,
    accessLevel,
    requiredAction: 'COMPLETE_PROFILE',
    message: 'Complete verification to access member content.',
  };
}

export async function getClubDetailsWithAccess(
  clubId: string,
  userId?: string
): Promise<{
  club: {
    id: string;
    name: string;
    slug: string;
    description: string;
    neighborhood: string;
    contactEmail?: string | null;
    phoneNumber?: string | null;
  } | null;
  accessLevel: AccessLevel;
  visibleFields: string[];
}> {
  const club = await prisma.club.findUnique({
    where: { id: clubId },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      neighborhood: true,
      contactEmail: true,
      phoneNumber: true,
    },
  });

  if (!club) {
    return {
      club: null,
      accessLevel: 'NONE',
      visibleFields: [],
    };
  }

  const targetUserId = userId || (await getCurrentProfile())?.id;
  if (!targetUserId) {
    return {
      club: {
        id: club.id,
        name: club.name,
        slug: club.slug,
        description: club.description,
        neighborhood: club.neighborhood,
      },
      accessLevel: 'NONE',
      visibleFields: ['id', 'name', 'slug', 'description', 'neighborhood'],
    };
  }

  const access = await checkContentAccess(targetUserId, 'CONTACT_INFO');

  if (access.accessLevel === 'FULL') {
    return {
      club,
      accessLevel: 'FULL',
      visibleFields: ['id', 'name', 'slug', 'description', 'neighborhood', 'contactEmail', 'phoneNumber'],
    };
  }

  return {
    club: {
      id: club.id,
      name: club.name,
      slug: club.slug,
      description: club.description,
      neighborhood: club.neighborhood,
    },
    accessLevel: access.accessLevel,
    visibleFields: ['id', 'name', 'slug', 'description', 'neighborhood'],
  };
}
