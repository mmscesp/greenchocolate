'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma, UserRole } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { i18n } from '@/lib/i18n-config';
import { getAdminSessionProfile } from '@/lib/security/admin-guard';
import { logAdminAuditEvent } from '@/lib/security/admin-audit';
import {
  getSafeAdminReturnPath,
  revalidateAdminPortalPaths,
  withAdminActionStatus,
} from '@/lib/security/admin-portal';

const clubsFilterSchema = z.object({
  query: z.string().optional(),
  verification: z.enum(['ALL', 'VERIFIED', 'PENDING']).default('ALL'),
  activity: z.enum(['ALL', 'ACTIVE', 'INACTIVE']).default('ALL'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

const dayKeys = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

type DayKey = (typeof dayKeys)[number];

const priceRangeValues = ['$', '$$', '$$$', '$$$$'] as const;

const clubMutationSchema = z.object({
  clubId: z.string().uuid().optional(),
  name: z.string().trim().min(2, 'Club name must be at least 2 characters').max(120),
  slug: z
    .string()
    .trim()
    .min(2, 'Slug is required')
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must use lowercase letters, numbers, and hyphens only'),
  cityId: z.string().uuid('City is required'),
  neighborhood: z.string().trim().min(2, 'Neighborhood is required').max(120),
  addressDisplay: z.string().trim().min(5, 'Address is required').max(240),
  latitude: z.coerce.number().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90'),
  longitude: z.coerce.number().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180'),
  contactEmail: z.string().trim().email('Contact email must be valid'),
  phoneNumber: z.string().trim().max(60).optional(),
  website: z.string().trim().max(240).optional(),
  instagram: z.string().trim().max(160).optional(),
  whatsapp: z.string().trim().max(160).optional(),
  facebook: z.string().trim().max(240).optional(),
  x: z.string().trim().max(240).optional(),
  description: z.string().trim().min(20, 'Description must be at least 20 characters').max(5000),
  shortDescription: z.string().trim().max(240).optional(),
  priceRange: z.enum(priceRangeValues),
  capacity: z.coerce.number().int().min(1, 'Capacity must be at least 1').max(100000),
  foundedYear: z.coerce
    .number()
    .int()
    .min(1900, 'Founded year must be after 1900')
    .max(new Date().getFullYear(), 'Founded year cannot be in the future'),
  isVerified: z.boolean(),
  isActive: z.boolean(),
  allowsPreRegistration: z.boolean(),
  logoUrl: z.string().trim().max(320).optional(),
  coverImageUrl: z.string().trim().max(320).optional(),
  metaTitle: z.string().trim().max(180).optional(),
  metaDescription: z.string().trim().max(320).optional(),
  amenitiesInput: z.string().optional(),
  vibeTagsInput: z.string().optional(),
  imagesInput: z.string().optional(),
  mondayHours: z.string().trim().min(1, 'Monday hours are required').max(80),
  tuesdayHours: z.string().trim().min(1, 'Tuesday hours are required').max(80),
  wednesdayHours: z.string().trim().min(1, 'Wednesday hours are required').max(80),
  thursdayHours: z.string().trim().min(1, 'Thursday hours are required').max(80),
  fridayHours: z.string().trim().min(1, 'Friday hours are required').max(80),
  saturdayHours: z.string().trim().min(1, 'Saturday hours are required').max(80),
  sundayHours: z.string().trim().min(1, 'Sunday hours are required').max(80),
  assignedAdminIds: z.array(z.string().uuid()).default([]),
});

const updateClubFlagsSchema = z.object({
  clubId: z.string().uuid(),
  isVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export type AdminClubsFilterInput = z.input<typeof clubsFilterSchema>;

const adminClubInclude = Prisma.validator<Prisma.ClubInclude>()({
  city: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  admins: {
    select: {
      id: true,
      email: true,
      displayName: true,
      managedClubId: true,
    },
  },
  _count: {
    select: {
      membershipRequests: true,
      reviews: true,
      events: true,
      articles: true,
    },
  },
});

export type AdminClubRow = Prisma.ClubGetPayload<{ include: typeof adminClubInclude }>;

export type AdminClubEditorOption = {
  id: string;
  name: string;
  slug: string;
};

export type AdminClubAssignmentCandidate = {
  id: string;
  email: string;
  displayName: string | null;
  role: UserRole;
  managedClubId: string | null;
  managedClubName: string | null;
};

export type AdminClubFormValues = {
  clubId?: string;
  name: string;
  slug: string;
  cityId: string;
  neighborhood: string;
  addressDisplay: string;
  latitude: string;
  longitude: string;
  contactEmail: string;
  phoneNumber: string;
  website: string;
  instagram: string;
  whatsapp: string;
  facebook: string;
  x: string;
  description: string;
  shortDescription: string;
  priceRange: (typeof priceRangeValues)[number];
  capacity: string;
  foundedYear: string;
  isVerified: boolean;
  isActive: boolean;
  allowsPreRegistration: boolean;
  logoUrl: string;
  coverImageUrl: string;
  metaTitle: string;
  metaDescription: string;
  amenitiesInput: string;
  vibeTagsInput: string;
  imagesInput: string;
  openingHours: Record<DayKey, string>;
  assignedAdminIds: string[];
};

function normalizeDelimitedInput(value: string | undefined): string[] {
  if (!value) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .split(/\r?\n|,/)
        .map((entry) => entry.trim())
        .filter(Boolean)
    )
  );
}

function normalizeWebsite(value: string | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) {
    return null;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed.replace(/^\/+/, '')}`;
}

function normalizeAssetReference(value: string | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return null;
}

function buildSocialMedia(input: {
  instagram?: string;
  whatsapp?: string;
  facebook?: string;
  x?: string;
}): Prisma.InputJsonValue | typeof Prisma.DbNull {
  const entries = Object.entries(input).filter(([, value]) => typeof value === 'string' && value.trim().length > 0);
  if (entries.length === 0) {
    return Prisma.DbNull;
  }

  return Object.fromEntries(entries.map(([key, value]) => [key, value!.trim()]));
}

function buildOpeningHours(parsed: z.infer<typeof clubMutationSchema>): Record<DayKey, string> {
  return {
    monday: parsed.mondayHours,
    tuesday: parsed.tuesdayHours,
    wednesday: parsed.wednesdayHours,
    thursday: parsed.thursdayHours,
    friday: parsed.fridayHours,
    saturday: parsed.saturdayHours,
    sunday: parsed.sundayHours,
  };
}

function resolveVerificationStatus(input: {
  isActive: boolean;
  isVerified: boolean;
}): 'UNVERIFIED' | 'SCM_VERIFIED' | 'INACTIVE' {
  if (!input.isActive) {
    return 'INACTIVE';
  }

  return input.isVerified ? 'SCM_VERIFIED' : 'UNVERIFIED';
}

function boolFromFormData(value: FormDataEntryValue | null): boolean {
  return value === 'true' || value === 'on' || value === '1';
}

function getLastFormDataEntry(formData: FormData, key: string): FormDataEntryValue | null {
  const values = formData.getAll(key);
  return values.length > 0 ? values[values.length - 1] : null;
}

function getAdminLocalePrefix(path: string): string {
  const match = path.match(/^\/([a-z]{2})\/admin(?:\/|$)/);
  return match ? `/${match[1]}/admin` : '/en/admin';
}

function revalidatePublicClubPaths(slug: string, citySlug: string): void {
  for (const locale of i18n.locales) {
    revalidatePath(`/${locale}/clubs`);
    revalidatePath(`/${locale}/clubs/${slug}`);
    revalidatePath(`/${locale}/spain/${citySlug}/clubs/${slug}`);
  }
}

function buildClubFormValues(club: {
  id: string;
  name: string;
  slug: string;
  cityId: string;
  neighborhood: string;
  addressDisplay: string;
  coordinates: unknown;
  contactEmail: string;
  phoneNumber: string | null;
  website: string | null;
  socialMedia: unknown;
  description: string;
  shortDescription: string | null;
  priceRange: string;
  capacity: number;
  foundedYear: number;
  isVerified: boolean;
  isActive: boolean;
  allowsPreRegistration: boolean;
  logoUrl: string | null;
  coverImageUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  amenities: string[];
  vibeTags: string[];
  images: string[];
  openingHours: unknown;
  admins: Array<{ id: string }>;
}): AdminClubFormValues {
  const coordinates =
    club.coordinates && typeof club.coordinates === 'object' && !Array.isArray(club.coordinates)
      ? (club.coordinates as { lat?: number; lng?: number })
      : {};
  const socialMedia =
    club.socialMedia && typeof club.socialMedia === 'object' && !Array.isArray(club.socialMedia)
      ? (club.socialMedia as Record<string, string>)
      : {};
  const openingHours =
    club.openingHours && typeof club.openingHours === 'object' && !Array.isArray(club.openingHours)
      ? (club.openingHours as Partial<Record<DayKey, string>>)
      : {};
  const normalizedPriceRange = priceRangeValues.includes(club.priceRange as (typeof priceRangeValues)[number])
    ? (club.priceRange as (typeof priceRangeValues)[number])
    : '$$';

  return {
    clubId: club.id,
    name: club.name,
    slug: club.slug,
    cityId: club.cityId,
    neighborhood: club.neighborhood,
    addressDisplay: club.addressDisplay,
    latitude: String(coordinates.lat ?? ''),
    longitude: String(coordinates.lng ?? ''),
    contactEmail: club.contactEmail,
    phoneNumber: club.phoneNumber ?? '',
    website: club.website ?? '',
    instagram: socialMedia.instagram ?? '',
    whatsapp: socialMedia.whatsapp ?? '',
    facebook: socialMedia.facebook ?? '',
    x: socialMedia.x ?? '',
    description: club.description,
    shortDescription: club.shortDescription ?? '',
    priceRange: normalizedPriceRange,
    capacity: String(club.capacity),
    foundedYear: String(club.foundedYear),
    isVerified: club.isVerified,
    isActive: club.isActive,
    allowsPreRegistration: club.allowsPreRegistration,
    logoUrl: club.logoUrl ?? '',
    coverImageUrl: club.coverImageUrl ?? '',
    metaTitle: club.metaTitle ?? '',
    metaDescription: club.metaDescription ?? '',
    amenitiesInput: club.amenities.join('\n'),
    vibeTagsInput: club.vibeTags.join('\n'),
    imagesInput: club.images.join('\n'),
    openingHours: {
      monday: openingHours.monday ?? 'Closed',
      tuesday: openingHours.tuesday ?? 'Closed',
      wednesday: openingHours.wednesday ?? 'Closed',
      thursday: openingHours.thursday ?? 'Closed',
      friday: openingHours.friday ?? 'Closed',
      saturday: openingHours.saturday ?? 'Closed',
      sunday: openingHours.sunday ?? 'Closed',
    },
    assignedAdminIds: club.admins.map((admin) => admin.id),
  };
}

export async function createEmptyAdminClubFormValues(cityId = ''): Promise<AdminClubFormValues> {
  return {
    name: '',
    slug: '',
    cityId,
    neighborhood: '',
    addressDisplay: '',
    latitude: '',
    longitude: '',
    contactEmail: '',
    phoneNumber: '',
    website: '',
    instagram: '',
    whatsapp: '',
    facebook: '',
    x: '',
    description: '',
    shortDescription: '',
    priceRange: '$$',
    capacity: '100',
    foundedYear: String(new Date().getFullYear()),
    isVerified: false,
    isActive: true,
    allowsPreRegistration: true,
    logoUrl: '',
    coverImageUrl: '',
    metaTitle: '',
    metaDescription: '',
    amenitiesInput: '',
    vibeTagsInput: '',
    imagesInput: '',
    openingHours: {
      monday: 'Closed',
      tuesday: 'Closed',
      wednesday: 'Closed',
      thursday: 'Closed',
      friday: 'Closed',
      saturday: 'Closed',
      sunday: 'Closed',
    },
    assignedAdminIds: [],
  };
}

function parseClubMutationFormData(formData: FormData) {
  const assignedAdminIds = formData
    .getAll('assignedAdminIds')
    .map((value) => (typeof value === 'string' ? value.trim() : ''))
    .filter(Boolean);

  return clubMutationSchema.safeParse({
    clubId: getLastFormDataEntry(formData, 'clubId') || undefined,
    name: getLastFormDataEntry(formData, 'name'),
    slug: getLastFormDataEntry(formData, 'slug'),
    cityId: getLastFormDataEntry(formData, 'cityId'),
    neighborhood: getLastFormDataEntry(formData, 'neighborhood'),
    addressDisplay: getLastFormDataEntry(formData, 'addressDisplay'),
    latitude: getLastFormDataEntry(formData, 'latitude'),
    longitude: getLastFormDataEntry(formData, 'longitude'),
    contactEmail: getLastFormDataEntry(formData, 'contactEmail'),
    phoneNumber: getLastFormDataEntry(formData, 'phoneNumber') || undefined,
    website: getLastFormDataEntry(formData, 'website') || undefined,
    instagram: getLastFormDataEntry(formData, 'instagram') || undefined,
    whatsapp: getLastFormDataEntry(formData, 'whatsapp') || undefined,
    facebook: getLastFormDataEntry(formData, 'facebook') || undefined,
    x: getLastFormDataEntry(formData, 'x') || undefined,
    description: getLastFormDataEntry(formData, 'description'),
    shortDescription: getLastFormDataEntry(formData, 'shortDescription') || undefined,
    priceRange: getLastFormDataEntry(formData, 'priceRange'),
    capacity: getLastFormDataEntry(formData, 'capacity'),
    foundedYear: getLastFormDataEntry(formData, 'foundedYear'),
    isVerified: boolFromFormData(getLastFormDataEntry(formData, 'isVerified')),
    isActive: boolFromFormData(getLastFormDataEntry(formData, 'isActive')),
    allowsPreRegistration: boolFromFormData(getLastFormDataEntry(formData, 'allowsPreRegistration')),
    logoUrl: getLastFormDataEntry(formData, 'logoUrl') || undefined,
    coverImageUrl: getLastFormDataEntry(formData, 'coverImageUrl') || undefined,
    metaTitle: getLastFormDataEntry(formData, 'metaTitle') || undefined,
    metaDescription: getLastFormDataEntry(formData, 'metaDescription') || undefined,
    amenitiesInput: getLastFormDataEntry(formData, 'amenitiesInput') || undefined,
    vibeTagsInput: getLastFormDataEntry(formData, 'vibeTagsInput') || undefined,
    imagesInput: getLastFormDataEntry(formData, 'imagesInput') || undefined,
    mondayHours: getLastFormDataEntry(formData, 'mondayHours'),
    tuesdayHours: getLastFormDataEntry(formData, 'tuesdayHours'),
    wednesdayHours: getLastFormDataEntry(formData, 'wednesdayHours'),
    thursdayHours: getLastFormDataEntry(formData, 'thursdayHours'),
    fridayHours: getLastFormDataEntry(formData, 'fridayHours'),
    saturdayHours: getLastFormDataEntry(formData, 'saturdayHours'),
    sundayHours: getLastFormDataEntry(formData, 'sundayHours'),
    assignedAdminIds,
  });
}

async function getValidatedClubMutationContext(parsed: z.infer<typeof clubMutationSchema>, currentClubId?: string) {
  const [city, existingSlug, adminCandidates] = await Promise.all([
    prisma.city.findUnique({
      where: { id: parsed.cityId },
      select: { id: true, slug: true, name: true },
    }),
    prisma.club.findFirst({
      where: {
        slug: parsed.slug,
        ...(currentClubId ? { id: { not: currentClubId } } : {}),
      },
      select: { id: true },
    }),
    parsed.assignedAdminIds.length > 0
      ? prisma.profile.findMany({
          where: {
            id: { in: parsed.assignedAdminIds },
            role: { in: ['ADMIN', 'CLUB_ADMIN'] },
          },
          select: {
            id: true,
            email: true,
            managedClubId: true,
          },
        })
      : Promise.resolve([]),
  ]);

  if (!city) {
    return { error: 'Selected city was not found.' } as const;
  }

  if (existingSlug) {
    return { error: 'This slug is already in use by another club.' } as const;
  }

  if (adminCandidates.length !== parsed.assignedAdminIds.length) {
    return { error: 'One or more assigned admins are invalid.' } as const;
  }

  const conflictingAdmin = adminCandidates.find(
    (candidate) => candidate.managedClubId && candidate.managedClubId !== currentClubId
  );

  if (conflictingAdmin) {
    return {
      error: `Assigned admin ${conflictingAdmin.email} is already linked to another club.`,
    } as const;
  }

  return {
    city,
    adminCandidates,
  } as const;
}

function buildClubMutationData(parsed: z.infer<typeof clubMutationSchema>, cityId: string): Prisma.ClubUncheckedCreateInput {
  const shortDescription = parsed.shortDescription?.trim()
    ? parsed.shortDescription.trim()
    : parsed.description.length > 160
      ? `${parsed.description.slice(0, 157)}...`
      : parsed.description;

  return {
    slug: parsed.slug,
    name: parsed.name,
    description: parsed.description,
    shortDescription,
    cityId,
    neighborhood: parsed.neighborhood,
    addressDisplay: parsed.addressDisplay,
    coordinates: {
      lat: parsed.latitude,
      lng: parsed.longitude,
    },
    contactEmail: parsed.contactEmail,
    phoneNumber: parsed.phoneNumber?.trim() || null,
    website: normalizeWebsite(parsed.website),
    socialMedia: buildSocialMedia({
      instagram: parsed.instagram,
      whatsapp: parsed.whatsapp,
      facebook: parsed.facebook,
      x: parsed.x,
    }),
    isVerified: parsed.isVerified,
    verificationStatus: resolveVerificationStatus(parsed),
    listingTier: 'STANDARD',
    isActive: parsed.isActive,
    allowsPreRegistration: parsed.allowsPreRegistration,
    openingHours: buildOpeningHours(parsed),
    amenities: normalizeDelimitedInput(parsed.amenitiesInput),
    vibeTags: normalizeDelimitedInput(parsed.vibeTagsInput),
    priceRange: parsed.priceRange,
    capacity: parsed.capacity,
    foundedYear: parsed.foundedYear,
    images: normalizeDelimitedInput(parsed.imagesInput),
    logoUrl: normalizeAssetReference(parsed.logoUrl),
    coverImageUrl: normalizeAssetReference(parsed.coverImageUrl),
    metaTitle: parsed.metaTitle?.trim() || null,
    metaDescription: parsed.metaDescription?.trim() || null,
  };
}

export async function getAdminClubEditorOptions(): Promise<{
  cities: AdminClubEditorOption[];
  adminCandidates: AdminClubAssignmentCandidate[];
}> {
  const admin = await getAdminSessionProfile();
  if (!admin) {
    return { cities: [], adminCandidates: [] };
  }

  const [cities, adminCandidates] = await Promise.all([
    prisma.city.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true },
    }),
    prisma.profile.findMany({
      where: {
        role: { in: ['ADMIN', 'CLUB_ADMIN'] },
      },
      orderBy: [{ role: 'asc' }, { email: 'asc' }],
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        managedClubId: true,
        managedClub: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);

  return {
    cities,
    adminCandidates: adminCandidates.map((candidate) => ({
      id: candidate.id,
      email: candidate.email,
      displayName: candidate.displayName,
      role: candidate.role,
      managedClubId: candidate.managedClubId,
      managedClubName: candidate.managedClub?.name ?? null,
    })),
  };
}

export async function getAdminClubs(rawInput: AdminClubsFilterInput = {}): Promise<{
  clubs: AdminClubRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> {
  const admin = await getAdminSessionProfile();
  if (!admin) {
    return {
      clubs: [],
      total: 0,
      page: 1,
      pageSize: 20,
      totalPages: 0,
    };
  }

  const parsedInput = clubsFilterSchema.safeParse(rawInput);
  const input = parsedInput.success ? parsedInput.data : clubsFilterSchema.parse({});
  const skip = (input.page - 1) * input.pageSize;

  const whereClause: Prisma.ClubWhereInput = {
    ...(input.query
      ? {
          OR: [
            { name: { contains: input.query, mode: 'insensitive' as const } },
            { slug: { contains: input.query, mode: 'insensitive' as const } },
            { contactEmail: { contains: input.query, mode: 'insensitive' as const } },
          ],
        }
      : {}),
    ...(input.verification === 'VERIFIED'
      ? { verificationStatus: { in: ['SCM_VERIFIED', 'FEATURED'] as const } }
      : input.verification === 'PENDING'
        ? { verificationStatus: { in: ['UNVERIFIED', 'PENDING_REVIEW'] as const } }
        : {}),
    ...(input.activity === 'ACTIVE'
      ? { isActive: true }
      : input.activity === 'INACTIVE'
        ? { isActive: false }
        : {}),
  };

  const [clubs, total] = await Promise.all([
    prisma.club.findMany({
      where: whereClause,
      include: adminClubInclude,
      orderBy: [{ verificationStatus: 'asc' }, { updatedAt: 'desc' }],
      skip,
      take: input.pageSize,
    }),
    prisma.club.count({ where: whereClause }),
  ]);

  return {
    clubs,
    total,
    page: input.page,
    pageSize: input.pageSize,
    totalPages: Math.ceil(total / input.pageSize),
  };
}

export async function getPendingClubVerifications() {
  const admin = await getAdminSessionProfile();
  if (!admin) {
    return [];
  }

  return prisma.club.findMany({
    where: { verificationStatus: { in: ['UNVERIFIED', 'PENDING_REVIEW'] } },
    include: {
      city: { select: { name: true, slug: true } },
      admins: {
        select: {
          id: true,
          email: true,
          displayName: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          membershipRequests: true,
          reviews: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });
}

export async function getAdminClubById(clubId: string) {
  const admin = await getAdminSessionProfile();
  if (!admin) {
    return null;
  }

  const club = await prisma.club.findUnique({
    where: { id: clubId },
    include: {
      city: true,
      admins: {
        select: {
          id: true,
          email: true,
          displayName: true,
          role: true,
          isVerified: true,
          createdAt: true,
          lastActiveAt: true,
          managedClubId: true,
        },
      },
      membershipRequests: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          status: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              email: true,
              displayName: true,
            },
          },
        },
      },
      events: {
        take: 10,
        orderBy: { startDate: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          startDate: true,
          endDate: true,
          isPublished: true,
        },
      },
      _count: {
        select: {
          membershipRequests: true,
          reviews: true,
          favorites: true,
          events: true,
          articles: true,
        },
      },
    },
  });

  if (!club) {
    return null;
  }

  await logAdminAuditEvent({
    tableName: 'Club',
    operation: 'ADMIN_VIEW_CLUB',
    changedBy: admin.authId,
    recordId: club.id,
    changeData: {
      viewedBy: admin.email,
      timestamp: new Date().toISOString(),
    },
  });

  return club;
}

export async function getAdminClubFormValues(clubId: string): Promise<AdminClubFormValues | null> {
  const club = await getAdminClubById(clubId);
  if (!club) {
    return null;
  }

  return buildClubFormValues(club);
}

export async function createAdminClub(formData: FormData): Promise<void> {
  const admin = await getAdminSessionProfile();
  const returnPath = getSafeAdminReturnPath(formData.get('returnPath'), '/en/admin/clubs');
  const adminPrefix = getAdminLocalePrefix(returnPath);
  if (!admin) {
    redirect(withAdminActionStatus(returnPath, 'error', 'Admin session is required.'));
    return;
  }

  const parsed = parseClubMutationFormData(formData);
  if (!parsed.success) {
    redirect(
      withAdminActionStatus(
        returnPath,
        'error',
        parsed.error.errors[0]?.message || 'Invalid club payload.'
      )
    );
    return;
  }

  const context = await getValidatedClubMutationContext(parsed.data);
  if ('error' in context) {
    redirect(
      withAdminActionStatus(
        returnPath,
        'error',
        context.error ?? 'Unable to validate club creation request.'
      )
    );
    return;
  }

  const clubData = buildClubMutationData(parsed.data, context.city.id);

  const club = await prisma.$transaction(async (tx) => {
    const created = await tx.club.create({
      data: clubData,
      select: {
        id: true,
        name: true,
        slug: true,
        city: {
          select: {
            slug: true,
          },
        },
      },
    });

    if (parsed.data.assignedAdminIds.length > 0) {
      await tx.profile.updateMany({
        where: {
          id: {
            in: parsed.data.assignedAdminIds,
          },
        },
        data: {
          managedClubId: created.id,
        },
      });
    }

    return created;
  });

  await logAdminAuditEvent({
    tableName: 'Club',
    operation: 'ADMIN_CREATE_CLUB',
    changedBy: admin.authId,
    recordId: club.id,
    changeData: {
      clubName: club.name,
      slug: club.slug,
      citySlug: club.city.slug,
      assignedAdminIds: parsed.data.assignedAdminIds,
    },
  });

  revalidatePath('/');
  revalidateAdminPortalPaths(['/clubs', `/clubs/${club.id}`, '/clubs/new', '']);
  revalidatePublicClubPaths(club.slug, club.city.slug);
  redirect(
    withAdminActionStatus(
      `${adminPrefix}/clubs/${club.id}/edit`,
      'success',
      `Created ${club.name}.`
    )
  );
}

export async function updateAdminClub(formData: FormData): Promise<void> {
  const admin = await getAdminSessionProfile();
  const clubId = typeof formData.get('clubId') === 'string' ? String(formData.get('clubId')) : '';
  const returnPath = getSafeAdminReturnPath(
    formData.get('returnPath'),
    clubId ? `/en/admin/clubs/${clubId}/edit` : '/en/admin/clubs'
  );
  const adminPrefix = getAdminLocalePrefix(returnPath);
  if (!admin) {
    redirect(withAdminActionStatus(returnPath, 'error', 'Admin session is required.'));
    return;
  }

  const parsed = parseClubMutationFormData(formData);
  if (!parsed.success || !parsed.data.clubId) {
    redirect(
      withAdminActionStatus(
        returnPath,
        'error',
        parsed.success ? 'Club identifier is required.' : parsed.error.errors[0]?.message || 'Invalid club payload.'
      )
    );
    return;
  }

  const existingClub = await prisma.club.findUnique({
    where: { id: parsed.data.clubId },
    select: {
      id: true,
      name: true,
      slug: true,
      city: {
        select: {
          slug: true,
        },
      },
    },
  });

  if (!existingClub) {
    redirect(withAdminActionStatus(returnPath, 'error', 'Club record was not found.'));
    return;
  }

  const context = await getValidatedClubMutationContext(parsed.data, existingClub.id);
  if ('error' in context) {
    redirect(
      withAdminActionStatus(
        returnPath,
        'error',
        context.error ?? 'Unable to validate club update request.'
      )
    );
    return;
  }

  const clubData = buildClubMutationData(parsed.data, context.city.id);

  const updatedClub = await prisma.$transaction(async (tx) => {
    const updated = await tx.club.update({
      where: { id: existingClub.id },
      data: clubData,
      select: {
        id: true,
        name: true,
        slug: true,
        city: {
          select: {
            slug: true,
          },
        },
      },
    });

    await tx.profile.updateMany({
      where: {
        managedClubId: existingClub.id,
        id: {
          notIn: parsed.data.assignedAdminIds,
        },
      },
      data: {
        managedClubId: null,
      },
    });

    if (parsed.data.assignedAdminIds.length > 0) {
      await tx.profile.updateMany({
        where: {
          id: {
            in: parsed.data.assignedAdminIds,
          },
        },
        data: {
          managedClubId: existingClub.id,
        },
      });
    }

    return updated;
  });

  await logAdminAuditEvent({
    tableName: 'Club',
    operation: 'ADMIN_UPDATE_CLUB_PROFILE',
    changedBy: admin.authId,
    recordId: updatedClub.id,
    changeData: {
      previousSlug: existingClub.slug,
      nextSlug: updatedClub.slug,
      previousCitySlug: existingClub.city.slug,
      nextCitySlug: updatedClub.city.slug,
      assignedAdminIds: parsed.data.assignedAdminIds,
    },
  });

  revalidatePath('/');
  revalidateAdminPortalPaths(['/clubs', `/clubs/${updatedClub.id}`, `/clubs/${updatedClub.id}/edit`, '/clubs/verification', '']);
  revalidatePublicClubPaths(updatedClub.slug, updatedClub.city.slug);
  if (existingClub.slug !== updatedClub.slug || existingClub.city.slug !== updatedClub.city.slug) {
    revalidatePublicClubPaths(existingClub.slug, existingClub.city.slug);
  }
  redirect(
    withAdminActionStatus(
      `${adminPrefix}/clubs/${updatedClub.id}/edit`,
      'success',
      `Updated ${updatedClub.name}.`
    )
  );
}

export async function updateClubFlags(formData: FormData): Promise<void> {
  const admin = await getAdminSessionProfile();
  const returnPath = getSafeAdminReturnPath(formData.get('returnPath'), '/en/admin/clubs');
  if (!admin) {
    redirect(withAdminActionStatus(returnPath, 'error', 'Admin session is required.'));
    return;
  }

  const rawIsVerified = formData.get('isVerified');
  const rawIsActive = formData.get('isActive');

  const parsed = updateClubFlagsSchema.safeParse({
    clubId: formData.get('clubId'),
    isVerified: rawIsVerified === null ? undefined : rawIsVerified === 'true',
    isActive: rawIsActive === null ? undefined : rawIsActive === 'true',
  });

  if (!parsed.success) {
    redirect(withAdminActionStatus(returnPath, 'error', 'Invalid club update request.'));
    return;
  }

  if (parsed.data.isVerified === undefined && parsed.data.isActive === undefined) {
    redirect(withAdminActionStatus(returnPath, 'error', 'No club changes were submitted.'));
    return;
  }

  const previous = await prisma.club.findUnique({
    where: { id: parsed.data.clubId },
    select: {
      id: true,
      name: true,
      slug: true,
      isVerified: true,
      isActive: true,
      verificationStatus: true,
      city: {
        select: {
          slug: true,
        },
      },
    },
  });

  if (!previous) {
    redirect(withAdminActionStatus(returnPath, 'error', 'Club record was not found.'));
    return;
  }

  const nextIsVerified = parsed.data.isVerified ?? previous.isVerified;
  const nextIsActive = parsed.data.isActive ?? previous.isActive;
  const updated = await prisma.club.update({
    where: { id: parsed.data.clubId },
    data: {
      isVerified: nextIsVerified,
      isActive: nextIsActive,
      verificationStatus: resolveVerificationStatus({
        isVerified: nextIsVerified,
        isActive: nextIsActive,
      }),
    },
    select: {
      isVerified: true,
      isActive: true,
      verificationStatus: true,
    },
  });

  await logAdminAuditEvent({
    tableName: 'Club',
    operation: 'ADMIN_UPDATE_CLUB_FLAGS',
    changedBy: admin.authId,
    recordId: previous.id,
    changeData: {
      clubName: previous.name,
      from: {
        isVerified: previous.isVerified,
        isActive: previous.isActive,
        verificationStatus: previous.verificationStatus,
      },
      to: {
        isVerified: updated.isVerified,
        isActive: updated.isActive,
        verificationStatus: updated.verificationStatus,
      },
    },
  });

  revalidatePath('/');
  revalidateAdminPortalPaths(['/clubs', `/clubs/${previous.id}`, `/clubs/${previous.id}/edit`, '/clubs/verification', '']);
  revalidatePublicClubPaths(previous.slug, previous.city.slug);
  redirect(withAdminActionStatus(returnPath, 'success', `Updated trust flags for ${previous.name}.`));
}
