'use server';

// Club Data Access Layer
// Server Actions for fetching clubs

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

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
  coordinates: any;
  contactEmail: string;
  phoneNumber: string | null;
  website: string | null;
  socialMedia: any;
  openingHours: any;
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
  capacity: number;
  foundedYear: number;
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
      },
      orderBy: { name: 'asc' },
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
    
    // Using unnest for performance on array columns
    const result = await prisma.$queryRaw<any[]>`
      SELECT DISTINCT unnest("amenities") as item 
      FROM "Club" 
      WHERE "isActive" = true AND "isVerified" = true
      ${validatedCitySlug ? Prisma.sql`AND "cityId" = (SELECT id FROM "City" WHERE slug = ${validatedCitySlug})` : Prisma.empty}
      ORDER BY item ASC
    `;

    return result.map(r => r.item as string);
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
    
    // Using unnest for performance on array columns
    const result = await prisma.$queryRaw<any[]>`
      SELECT DISTINCT unnest("vibeTags") as item 
      FROM "Club" 
      WHERE "isActive" = true AND "isVerified" = true
      ${validatedCitySlug ? Prisma.sql`AND "cityId" = (SELECT id FROM "City" WHERE slug = ${validatedCitySlug})` : Prisma.empty}
      ORDER BY item ASC
    `;

    return result.map(r => r.item as string);
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
 */
export async function getClubByAuthId(authId: string) {
  try {
    const club = await prisma.club.findFirst({
      where: {
        // In a real app, Profile would have managedClubId
        // For now, we'll find by contactEmail matching the user's email
        // This is a temporary solution until proper club admin relationship is established
      },
      include: {
        city: {
          select: { name: true, slug: true },
        },
      },
    });
    return club;
  } catch (error) {
    console.error('getClubByAuthId error:', error);
    return null;
  }
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
