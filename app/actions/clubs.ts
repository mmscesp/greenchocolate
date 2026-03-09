'use server';

// Club Data Access Layer
// Server Actions for fetching clubs

import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { i18n } from '@/lib/i18n-config';
import { z } from 'zod';

// Use any for JSON fields to avoid Prisma 7 type issues
type JsonValue = unknown;

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const clubFiltersSchema = z.object({
  citySlug: z.string().optional(),
  neighborhood: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  vibes: z.array(z.string()).optional(),
  priceRange: z.array(z.string()).optional(),
  isVerified: z.boolean().optional(),
});

const citySlugSchema = z.string().optional();
const slugSchema = z.string().min(1);
const limitSchema = z.number().int().min(1).max(100).optional();
const idSchema = z.string().uuid();

// JSON field validation schemas
const coordinatesSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

const socialMediaSchema = z.record(z.string()).nullable();
const openingHoursSchema = z.record(z.string());
const optionalTrimmedString = z
  .string()
  .trim()
  .optional()
  .transform((value) => {
    if (!value) {
      return undefined;
    }

    return value.length > 0 ? value : undefined;
  });

const optionalUrlSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => {
    if (!value) {
      return undefined;
    }

    return value.length > 0 ? value : undefined;
  })
  .refine((value) => !value || /^https?:\/\//i.test(value), {
    message: 'Website URL must start with http:// or https://',
  });

const managedClubProfileSchema = z.object({
  name: z.string().trim().min(2, 'Club name must be at least 2 characters').max(120),
  description: z.string().trim().min(20, 'Description must be at least 20 characters').max(5000),
  shortDescription: optionalTrimmedString,
  neighborhood: z.string().trim().min(2, 'Neighborhood is required').max(120),
  addressDisplay: z.string().trim().min(5, 'Address is required').max(240),
  contactEmail: z.string().trim().email('Invalid email address'),
  phoneNumber: optionalTrimmedString,
  website: optionalUrlSchema,
  capacity: z.coerce.number().int().min(1, 'Capacity must be at least 1').max(100000),
  foundedYear: z.coerce
    .number()
    .int()
    .min(1900, 'Founded year must be after 1900')
    .max(new Date().getFullYear(), 'Founded year cannot be in the future'),
});

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Get current user profile from Supabase auth
 */
async function getCurrentProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return prisma.profile.findUnique({
    where: { authId: user.id },
  });
}

/**
 * Verify that the current user is authorized to manage a club
 * Returns the profile if authorized, null if not
 */
async function verifyClubAdminAccess(clubId: string) {
  const profile = await getCurrentProfile();

  if (!profile) {
    return null;
  }

  // Allow if user is an admin
  if (profile.role === 'ADMIN') {
    return profile;
  }

  // Allow if user manages this specific club
  const profileWithManagedClub = profile as typeof profile & { managedClubId: string | null };
  if (profileWithManagedClub.managedClubId === clubId) {
    return profile;
  }

  return null;
}

async function getCurrentManagedClubAccess() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return null;
  }

  const profileWithManagedClub = profile as typeof profile & { managedClubId: string | null };
  if (!profileWithManagedClub.managedClubId) {
    return null;
  }

  return {
    profile,
    managedClubId: profileWithManagedClub.managedClubId,
  };
}

function toManagedClubProfile(club: {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string | null;
  neighborhood: string;
  addressDisplay: string;
  contactEmail: string;
  phoneNumber: string | null;
  website: string | null;
  capacity: number;
  foundedYear: number;
  logoUrl: string | null;
  coverImageUrl: string | null;
  isVerified: boolean;
  isActive: boolean;
  allowsPreRegistration: boolean;
  city: {
    name: string;
    slug: string;
  };
}): ManagedClubProfile {
  return {
    id: club.id,
    slug: club.slug,
    name: club.name,
    description: club.description,
    shortDescription: club.shortDescription,
    neighborhood: club.neighborhood,
    addressDisplay: club.addressDisplay,
    contactEmail: club.contactEmail,
    phoneNumber: club.phoneNumber,
    website: club.website,
    capacity: club.capacity,
    foundedYear: club.foundedYear,
    cityName: club.city.name,
    citySlug: club.city.slug,
    logoUrl: club.logoUrl,
    coverImageUrl: club.coverImageUrl,
    isVerified: club.isVerified,
    isActive: club.isActive,
    allowsPreRegistration: club.allowsPreRegistration,
  };
}

function revalidateClubPanelPaths(slug: string) {
  for (const locale of i18n.locales) {
    revalidatePath(`/${locale}/club-panel/dashboard`);
    revalidatePath(`/${locale}/club-panel/dashboard/profile`);
    revalidatePath(`/${locale}/club-panel/dashboard/events`);
    revalidatePath(`/${locale}/club-panel/dashboard/analytics`);
    revalidatePath(`/${locale}/clubs`);
    revalidatePath(`/${locale}/clubs/${slug}`);
  }
}

// ==========================================
// TYPES
// ==========================================

export interface ClubFilters {
  citySlug?: string;
  neighborhood?: string;
  amenities?: string[];
  vibes?: string[];
  priceRange?: string[];
  isVerified?: boolean;
}

interface ClubWithCity {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  neighborhood: string;
  city: { name: string; slug: string };
  images: string[];
  logoUrl: string | null;
  priceRange: string;
  amenities: string[];
  vibeTags: string[];
  isVerified: boolean;
  description: string;
  addressDisplay: string;
  coordinates: JsonValue;
  contactEmail: string;
  phoneNumber: string | null;
  website: string | null;
  socialMedia: JsonValue;
  openingHours: JsonValue;
  capacity: number;
  foundedYear: number;
}

export interface ClubCard {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string;
  neighborhood: string;
  cityName: string;
  citySlug: string;
  images: string[];
  logoUrl: string | null;
  rating: number | null;
  reviewCount: number | null;
  priceRange: string;
  amenities: string[];
  vibeTags: string[];
  isVerified: boolean;
  capacity: number;
  foundedYear: number;
}

export interface ClubDetail extends ClubCard {
  description: string;
  addressDisplay: string;
  coordinates: { lat: number; lng: number };
  contactEmail: string;
  phoneNumber: string | null;
  website: string | null;
  socialMedia: Record<string, string> | null;
  openingHours: Record<string, string>;
  allowsPreRegistration: boolean;
  capacity: number;
  foundedYear: number;
}

export interface ManagedClubProfile {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string | null;
  neighborhood: string;
  addressDisplay: string;
  contactEmail: string;
  phoneNumber: string | null;
  website: string | null;
  capacity: number;
  foundedYear: number;
  cityName: string;
  citySlug: string;
  logoUrl: string | null;
  coverImageUrl: string | null;
  isVerified: boolean;
  isActive: boolean;
  allowsPreRegistration: boolean;
}

export interface ClubPanelEventItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  imageUrl: string | null;
  eventUrl: string | null;
  isPublished: boolean;
}

export interface ClubPanelRequestItem {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SCHEDULED';
  createdAt: string;
  currentStage: string;
  applicantName: string | null;
  applicantAvatarUrl: string | null;
  message: string | null;
}

export interface ClubPanelOverview {
  club: ManagedClubProfile;
  stats: {
    totalRequests: number;
    pendingRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
    favoritesCount: number;
    publicReviews: number;
    averageRating: number | null;
    totalEvents: number;
    upcomingEvents: number;
    publishedEvents: number;
  };
  recentRequests: ClubPanelRequestItem[];
  upcomingEvents: ClubPanelEventItem[];
  pastEvents: ClubPanelEventItem[];
}

// ==========================================
// ACTIONS
// ==========================================

/**
 * Get Clubs with Filters
 */
export async function getClubs(filters?: ClubFilters): Promise<ClubCard[]> {
  try {
    const validatedFilters = filters ? clubFiltersSchema.parse(filters) : undefined;

    const where: Record<string, unknown> = {
      isActive: true,
      isVerified: validatedFilters?.isVerified ?? true,
    };

    // City filter
    if (validatedFilters?.citySlug) {
      const city = await prisma.city.findUnique({
        where: { slug: validatedFilters.citySlug },
        select: { id: true },
      });
      if (city) {
        where.cityId = city.id;
      }
    }

    // Neighborhood filter
    if (validatedFilters?.neighborhood) {
      where.neighborhood = validatedFilters.neighborhood;
    }

    // Amenities filter
    if (validatedFilters?.amenities && validatedFilters.amenities.length > 0) {
      where.amenities = {
        hasEvery: validatedFilters.amenities,
      };
    }

    // Vibes filter
    if (validatedFilters?.vibes && validatedFilters.vibes.length > 0) {
      where.vibeTags = {
        hasEvery: validatedFilters.vibes,
      };
    }

    // Price range filter
    if (validatedFilters?.priceRange && validatedFilters.priceRange.length > 0) {
      where.priceRange = { in: validatedFilters.priceRange };
    }

    const clubs = await prisma.club.findMany({
      where,
      include: {
        city: {
          select: { name: true, slug: true },
        },
        reviews: {
          where: { isPublic: true },
          select: { rating: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return clubs.map((club: ClubWithCity & { reviews: { rating: number }[] }) => {
      const ratings = club.reviews.map(r => r.rating);
      const avgRating = ratings.length > 0
        ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
        : null;
      
      return {
        id: club.id,
        name: club.name,
        slug: club.slug,
        shortDescription: club.shortDescription,
        neighborhood: club.neighborhood,
        cityName: club.city.name,
        citySlug: club.city.slug,
        images: club.images,
        logoUrl: club.logoUrl,
        rating: avgRating,
        reviewCount: ratings.length,
        priceRange: club.priceRange,
        amenities: club.amenities,
        vibeTags: club.vibeTags,
        isVerified: club.isVerified,
        description: club.description,
        capacity: club.capacity,
        foundedYear: club.foundedYear,
      };
    });
  } catch (error) {
    console.error('getClubs error:', error);
    return [];
  }
}

/**
 * Get Club by Slug
 */
export async function getClubBySlug(slug: string): Promise<ClubDetail | null> {
  try {
    const validatedSlug = slugSchema.parse(slug);
    const club = await prisma.club.findUnique({
      where: { slug: validatedSlug, isActive: true },
      include: {
        city: {
          select: { name: true, slug: true },
        },
      },
    });

    if (!club) {
      return null;
    }

    // HIGH-001: Validate JSON fields with Zod instead of unsafe casting
    const validatedCoordinates = coordinatesSchema.safeParse(club.coordinates);
    const validatedSocialMedia = socialMediaSchema.safeParse(club.socialMedia);
    const validatedOpeningHours = openingHoursSchema.safeParse(club.openingHours);

    return {
      id: club.id,
      name: club.name,
      slug: club.slug,
      shortDescription: club.shortDescription,
      neighborhood: club.neighborhood,
      cityName: club.city.name,
      citySlug: club.city.slug,
      images: club.images,
      logoUrl: club.logoUrl,
      rating: null,
      reviewCount: null,
      priceRange: club.priceRange,
      amenities: club.amenities,
      vibeTags: club.vibeTags,
      isVerified: club.isVerified,
      description: club.description,
      addressDisplay: club.addressDisplay,
      coordinates: validatedCoordinates.success ? validatedCoordinates.data : { lat: 0, lng: 0 },
      contactEmail: club.contactEmail,
      phoneNumber: club.phoneNumber,
      website: club.website,
      socialMedia: validatedSocialMedia.success ? validatedSocialMedia.data : null,
      openingHours: validatedOpeningHours.success ? validatedOpeningHours.data : {},
      allowsPreRegistration: club.allowsPreRegistration,
      capacity: club.capacity,
      foundedYear: club.foundedYear,
    };
  } catch (error) {
    console.error('getClubBySlug error:', error);
    return null;
  }
}

/**
 * Get Featured Clubs (for homepage)
 */
export async function getFeaturedClubs(limit = 6): Promise<ClubCard[]> {
  try {
    const validatedLimit = limitSchema.parse(limit);
    const clubs = await prisma.club.findMany({
      where: {
        isActive: true,
        isVerified: true,
      },
      include: {
        city: {
          select: { name: true, slug: true },
        },
      },
      orderBy: { name: 'asc' },
      take: validatedLimit,
    });

    return clubs.map((club: ClubWithCity) => ({
      id: club.id,
      name: club.name,
      slug: club.slug,
      shortDescription: club.shortDescription,
      neighborhood: club.neighborhood,
      cityName: club.city.name,
      citySlug: club.city.slug,
      images: club.images,
      logoUrl: club.logoUrl,
      rating: null,
      reviewCount: null,
      priceRange: club.priceRange,
      amenities: club.amenities,
      vibeTags: club.vibeTags,
      isVerified: club.isVerified,
      description: club.description,
      capacity: club.capacity,
      foundedYear: club.foundedYear,
    }));
  } catch (error) {
    console.error('getFeaturedClubs error:', error);
    return [];
  }
}

/**
 * Get Club Neighbors (same city)
 */
export async function getCityNeighbors(clubId: string, limit = 4): Promise<ClubCard[]> {
  try {
    const validatedId = idSchema.parse(clubId);
    const validatedLimit = limitSchema.parse(limit);
    const club = await prisma.club.findUnique({
      where: { id: validatedId },
      select: { cityId: true },
    });

    if (!club) {
      return [];
    }

    const neighbors = await prisma.club.findMany({
      where: {
        cityId: club.cityId,
        isActive: true,
        isVerified: true,
        id: { not: validatedId },
      },
      include: {
        city: {
          select: { name: true, slug: true },
        },
      },
      orderBy: { name: 'asc' },
      take: validatedLimit,
    });

    return neighbors.map((clubItem: ClubWithCity) => ({
      id: clubItem.id,
      name: clubItem.name,
      slug: clubItem.slug,
      shortDescription: clubItem.shortDescription,
      neighborhood: clubItem.neighborhood,
      cityName: clubItem.city.name,
      citySlug: clubItem.city.slug,
      images: clubItem.images,
      logoUrl: clubItem.logoUrl,
      rating: null,
      reviewCount: null,
      priceRange: clubItem.priceRange,
      amenities: clubItem.amenities,
      vibeTags: clubItem.vibeTags,
      isVerified: clubItem.isVerified,
      description: clubItem.description,
      capacity: clubItem.capacity,
      foundedYear: clubItem.foundedYear,
    }));
  } catch (error) {
    console.error('getCityNeighbors error:', error);
    return [];
  }
}

/**
 * Get All Neighborhoods
 */
export async function getNeighborhoods(citySlug?: string) {
  try {
    const validatedCitySlug = citySlugSchema.parse(citySlug);
    const where: Record<string, unknown> = {
      isActive: true,
      isVerified: true,
    };

    if (validatedCitySlug) {
      const city = await prisma.city.findUnique({
        where: { slug: validatedCitySlug },
        select: { id: true },
      });
      if (city) {
        where.cityId = city.id;
      }
    }

    const neighborhoods = await prisma.club.groupBy({
      by: ['neighborhood'],
      where,
      _count: { id: true },
      orderBy: { neighborhood: 'asc' },
    });

    return neighborhoods.map((n: { neighborhood: string; _count: { id: number } }) => ({
      name: n.neighborhood,
      count: n._count.id,
    }));
  } catch (error) {
    console.error('getNeighborhoods error:', error);
    return [];
  }
}

/**
 * Get All Amenities
 */
export async function getAllAmenities(citySlug?: string) {
  try {
    const validatedCitySlug = citySlugSchema.parse(citySlug);

    const result = validatedCitySlug
      ? await prisma.$queryRaw<{ item: string }[]>(
          Prisma.sql`
            SELECT DISTINCT unnest(c."amenities") as item
            FROM "Club" c
            JOIN "City" ci ON c."cityId" = ci.id
            WHERE c."isActive" = true
              AND c."isVerified" = true
              AND ci.slug = ${validatedCitySlug}
            ORDER BY item ASC
          `
        )
      : await prisma.$queryRaw<{ item: string }[]>(
          Prisma.sql`
            SELECT DISTINCT unnest("amenities") as item
            FROM "Club"
            WHERE "isActive" = true
              AND "isVerified" = true
            ORDER BY item ASC
          `
        );

    return result.map((r: { item: string }) => r.item);
  } catch (error) {
    console.error('getAllAmenities error:', error);
    return [];
  }
}

/**
 * Get All Vibe Tags
 */
export async function getAllVibes(citySlug?: string) {
  try {
    const validatedCitySlug = citySlugSchema.parse(citySlug);

    const result = validatedCitySlug
      ? await prisma.$queryRaw<{ item: string }[]>(
          Prisma.sql`
            SELECT DISTINCT unnest(c."vibeTags") as item
            FROM "Club" c
            JOIN "City" ci ON c."cityId" = ci.id
            WHERE c."isActive" = true
              AND c."isVerified" = true
              AND ci.slug = ${validatedCitySlug}
            ORDER BY item ASC
          `
        )
      : await prisma.$queryRaw<{ item: string }[]>(
          Prisma.sql`
            SELECT DISTINCT unnest("vibeTags") as item
            FROM "Club"
            WHERE "isActive" = true
              AND "isVerified" = true
            ORDER BY item ASC
          `
        );

    return result.map((r: { item: string }) => r.item);
  } catch (error) {
    console.error('getAllVibes error:', error);
    return [];
  }
}

// ==========================================
// CLUB ADMIN ACTIONS
// ==========================================

/**
 * Get Club by Auth ID (for Club Admin panel)
 * Now uses managedClubId via getClubForAdmin
 */
export async function getClubByAuthId(authId: string) {
  // Reuse getClubForAdmin which uses managedClubId relation
  return getClubForAdmin(authId);
}

/**
 * Get Club Stats for Dashboard
 */
export async function getClubStats(clubId: string) {
  try {
    const [totalRequests, pendingRequests, approvedRequests] = await Promise.all([
      prisma.membershipRequest.count({ where: { clubId } }),
      prisma.membershipRequest.count({ where: { clubId, status: 'PENDING' } }),
      prisma.membershipRequest.count({ where: { clubId, status: 'APPROVED' } }),
    ]);

    return {
      totalRequests,
      pendingRequests,
      approvedRequests,
      // Capacity info from club
    };
  } catch (error) {
    console.error('getClubStats error:', error);
    return null;
  }
}

export type ClubActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

/**
 * Update Club Profile
 * CRIT-001 FIX: Added authentication and authorization checks
 */
export async function updateClub(
  clubId: string,
  data: {
    name?: string;
    description?: string;
    shortDescription?: string;
    phoneNumber?: string;
    website?: string;
    socialMedia?: Record<string, string>;
    openingHours?: Record<string, string>;
    amenities?: string[];
    vibeTags?: string[];
  }
): Promise<ClubActionState> {
  // Verify user is authenticated and authorized to manage this club
  const authorizedProfile = await verifyClubAdminAccess(clubId);

  if (!authorizedProfile) {
    return {
      success: false,
      message: 'Unauthorized: You do not have permission to update this club',
    };
  }

  try {
    await prisma.club.update({
      where: { id: clubId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.shortDescription && { shortDescription: data.shortDescription }),
        ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
        ...(data.website && { website: data.website }),
        ...(data.socialMedia && { socialMedia: data.socialMedia }),
        ...(data.openingHours && { openingHours: data.openingHours }),
        ...(data.amenities && { amenities: data.amenities }),
        ...(data.vibeTags && { vibeTags: data.vibeTags }),
      },
    });

    return {
      success: true,
      message: 'Club updated successfully',
    };
  } catch (error) {
    console.error('updateClub error:', error);
    return {
      success: false,
      message: 'Failed to update club. Please try again.',
    };
  }
}

/**
 * Get Club Membership Requests (for Club Admin)
 * CRIT-002 FIX: Added authentication check
 * HIGH-005 FIX: Removed email from selection to prevent PII leak
 */
export async function getClubMembershipRequests(clubId: string) {
  // Verify user is authenticated and authorized to view this club's requests
  const authorizedProfile = await verifyClubAdminAccess(clubId);

  if (!authorizedProfile) {
    return [];
  }

  try {
    const requests = await prisma.membershipRequest.findMany({
      where: { clubId },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
            // CRIT-002: email removed - PII leak fix
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return requests;
  } catch (error) {
    console.error('getClubMembershipRequests error:', error);
    return [];
  }
}

export async function getCurrentManagedClubProfile(): Promise<ManagedClubProfile | null> {
  const access = await getCurrentManagedClubAccess();

  if (!access) {
    return null;
  }

  try {
    const club = await prisma.club.findUnique({
      where: { id: access.managedClubId },
      include: {
        city: {
          select: { name: true, slug: true },
        },
      },
    });

    if (!club) {
      return null;
    }

    return toManagedClubProfile(club);
  } catch (error) {
    console.error('getCurrentManagedClubProfile error:', error);
    return null;
  }
}

export async function updateCurrentManagedClubProfile(
  input: z.input<typeof managedClubProfileSchema>
): Promise<ClubActionState & { club?: ManagedClubProfile }> {
  const access = await getCurrentManagedClubAccess();

  if (!access) {
    return {
      success: false,
      message: 'Unauthorized: no managed club found for the current account',
    };
  }

  const validated = managedClubProfileSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: 'Please fix the errors below',
    };
  }

  try {
    const updatedClub = await prisma.club.update({
      where: { id: access.managedClubId },
      data: {
        name: validated.data.name,
        description: validated.data.description,
        shortDescription:
          validated.data.shortDescription ??
          (validated.data.description.length > 160
            ? `${validated.data.description.slice(0, 157)}...`
            : validated.data.description),
        neighborhood: validated.data.neighborhood,
        addressDisplay: validated.data.addressDisplay,
        contactEmail: validated.data.contactEmail,
        phoneNumber: validated.data.phoneNumber ?? null,
        website: validated.data.website ?? null,
        capacity: validated.data.capacity,
        foundedYear: validated.data.foundedYear,
      },
      include: {
        city: {
          select: { name: true, slug: true },
        },
      },
    });

    revalidateClubPanelPaths(updatedClub.slug);

    return {
      success: true,
      message: 'Club updated successfully',
      club: toManagedClubProfile(updatedClub),
    };
  } catch (error) {
    console.error('updateCurrentManagedClubProfile error:', error);
    return {
      success: false,
      message: 'Failed to update club. Please try again.',
    };
  }
}

export async function getManagedClubPanelOverview(): Promise<ClubPanelOverview | null> {
  const access = await getCurrentManagedClubAccess();

  if (!access) {
    return null;
  }

  try {
    const now = new Date();
    const [club, requestCounts, recentRequests, events, favoritesCount, reviewStats] = await Promise.all([
      prisma.club.findUnique({
        where: { id: access.managedClubId },
        include: {
          city: {
            select: { name: true, slug: true },
          },
        },
      }),
      prisma.membershipRequest.groupBy({
        by: ['status'],
        where: { clubId: access.managedClubId, user: { role: 'USER' } },
        _count: { _all: true },
      }),
      prisma.membershipRequest.findMany({
        where: { clubId: access.managedClubId, user: { role: 'USER' } },
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: {
          user: {
            select: {
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      }),
      prisma.event.findMany({
        where: { clubId: access.managedClubId },
        orderBy: [{ startDate: 'asc' }],
        select: {
          id: true,
          slug: true,
          name: true,
          description: true,
          location: true,
          startDate: true,
          endDate: true,
          imageUrl: true,
          eventUrl: true,
          isPublished: true,
        },
      }),
      prisma.favorite.count({ where: { clubId: access.managedClubId } }),
      prisma.review.aggregate({
        where: { clubId: access.managedClubId, isPublic: true },
        _avg: { rating: true },
        _count: { _all: true },
      }),
    ]);

    if (!club) {
      return null;
    }

    const countsByStatus = requestCounts.reduce<Record<string, number>>((accumulator, item) => {
      accumulator[item.status] = item._count._all;
      return accumulator;
    }, {});

    const eventItems = events.map((event) => ({
      id: event.id,
      slug: event.slug,
      name: event.name,
      description: event.description,
      location: event.location,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      imageUrl: event.imageUrl,
      eventUrl: event.eventUrl,
      isPublished: event.isPublished,
    }));

    const totalRequests = Object.values(countsByStatus).reduce((sum, count) => sum + count, 0);

    return {
      club: toManagedClubProfile(club),
      stats: {
        totalRequests,
        pendingRequests: countsByStatus.PENDING ?? 0,
        approvedRequests: countsByStatus.APPROVED ?? 0,
        rejectedRequests: countsByStatus.REJECTED ?? 0,
        favoritesCount,
        publicReviews: reviewStats._count._all,
        averageRating:
          typeof reviewStats._avg.rating === 'number'
            ? Math.round(reviewStats._avg.rating * 10) / 10
            : null,
        totalEvents: eventItems.length,
        upcomingEvents: eventItems.filter((event) => new Date(event.endDate) >= now).length,
        publishedEvents: eventItems.filter((event) => event.isPublished).length,
      },
      recentRequests: recentRequests.map((request) => ({
        id: request.id,
        status: request.status as 'PENDING' | 'APPROVED' | 'REJECTED' | 'SCHEDULED',
        createdAt: request.createdAt.toISOString(),
        currentStage: request.currentStage,
        applicantName: request.user.displayName,
        applicantAvatarUrl: request.user.avatarUrl,
        message: request.message,
      })),
      upcomingEvents: eventItems.filter((event) => new Date(event.endDate) >= now),
      pastEvents: eventItems.filter((event) => new Date(event.endDate) < now),
    };
  } catch (error) {
    console.error('getManagedClubPanelOverview error:', error);
    return null;
  }
}

// ==========================================
// FAVORITES & REVIEWS
// ==========================================

/**
 * Get user's favorite clubs
 */
export async function getUserFavorites(userId: string) {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        club: {
          include: {
            city: {
              select: { name: true, slug: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return favorites.map(fav => ({
      id: fav.club.id,
      name: fav.club.name,
      slug: fav.club.slug,
      shortDescription: fav.club.shortDescription,
      neighborhood: fav.club.neighborhood,
      cityName: fav.club.city.name,
      citySlug: fav.club.city.slug,
      images: fav.club.images,
      logoUrl: fav.club.logoUrl,
      rating: null,
      reviewCount: null,
      priceRange: fav.club.priceRange,
      amenities: fav.club.amenities,
      vibeTags: fav.club.vibeTags,
      isVerified: fav.club.isVerified,
      description: fav.club.description,
      capacity: fav.club.capacity,
      foundedYear: fav.club.foundedYear,
    }));
  } catch (error) {
    console.error('getUserFavorites error:', error);
    return [];
  }
}

/**
 * Add a club to favorites
 */
export async function addFavorite(userId: string, clubId: string) {
  try {
    await prisma.favorite.create({
      data: {
        userId,
        clubId,
      },
    });
    return { success: true };
  } catch (error) {
    console.error('addFavorite error:', error);
    return { success: false, message: 'Failed to add favorite' };
  }
}

/**
 * Remove a club from favorites
 */
export async function removeFavorite(userId: string, clubId: string) {
  try {
    await prisma.favorite.delete({
      where: {
        userId_clubId: {
          userId,
          clubId,
        },
      },
    });
    return { success: true };
  } catch (error) {
    console.error('removeFavorite error:', error);
    return { success: false, message: 'Failed to remove favorite' };
  }
}

/**
 * Get club reviews
 */
export async function getClubReviews(clubId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { clubId, isPublic: true },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reviews;
  } catch (error) {
    console.error('getClubReviews error:', error);
    return [];
  }
}

/**
 * Add a review to a club
 */
export async function addReview(
  userId: string,
  clubId: string,
  data: { rating: number; content?: string; isPublic?: boolean }
) {
  try {
    await prisma.review.create({
      data: {
        userId,
        clubId,
        rating: data.rating,
        content: data.content,
        isPublic: data.isPublic ?? false,
      },
    });
    return { success: true };
  } catch (error) {
    console.error('addReview error:', error);
    return { success: false, message: 'Failed to add review' };
  }
}

// ==========================================
// CLUB ADMIN
// ==========================================

/**
 * Get Club for Admin (using managedClubId)
 */
export async function getClubForAdmin(authId: string) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { authId },
      include: {
        managedClub: {
          include: {
            city: {
              select: { name: true, slug: true },
            },
          },
        },
      },
    });

    if (!profile?.managedClub) {
      return null;
    }

    const club = profile.managedClub;
    return {
      id: club.id,
      name: club.name,
      slug: club.slug,
      shortDescription: club.shortDescription,
      neighborhood: club.neighborhood,
      cityName: club.city.name,
      citySlug: club.city.slug,
      images: club.images,
      logoUrl: club.logoUrl,
      rating: null,
      reviewCount: null,
      priceRange: club.priceRange,
      amenities: club.amenities,
      vibeTags: club.vibeTags,
      isVerified: club.isVerified,
      description: club.description,
      addressDisplay: club.addressDisplay,
      coordinates: club.coordinates,
      contactEmail: club.contactEmail,
      phoneNumber: club.phoneNumber,
      website: club.website,
      socialMedia: club.socialMedia,
      openingHours: club.openingHours,
      capacity: club.capacity,
      foundedYear: club.foundedYear,
    };
  } catch (error) {
    console.error('getClubForAdmin error:', error);
    return null;
  }
}
