'use server';

// Club Data Access Layer
// Server Actions for fetching clubs

import { prisma } from '@/lib/prisma';

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
  rating: number | null;
  reviewCount: number | null;
  priceRange: string;
  amenities: string[];
  vibeTags: string[];
  isVerified: boolean;
  description: string;
  addressDisplay: string;
  coordinates: Record<string, number>;
  contactEmail: string;
  phoneNumber: string | null;
  website: string | null;
  socialMedia: Record<string, string> | null;
  openingHours: Record<string, string>;
  capacity: number;
  foundedYear: number;
}

export interface ClubCard {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
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
  const where: Record<string, unknown> = {
    isActive: true,
    isVerified: filters?.isVerified ?? true,
  };

  // City filter
  if (filters?.citySlug) {
    const city = await prisma.city.findUnique({
      where: { slug: filters.citySlug },
      select: { id: true },
    });
    if (city) {
      where.cityId = city.id;
    }
  }

  // Neighborhood filter
  if (filters?.neighborhood) {
    where.neighborhood = filters.neighborhood;
  }

  // Amenities filter
  if (filters?.amenities && filters.amenities.length > 0) {
    where.amenities = {
      hasEvery: filters.amenities,
    };
  }

  // Vibes filter
  if (filters?.vibes && filters.vibes.length > 0) {
    where.vibeTags = {
      hasEvery: filters.vibes,
    };
  }

  // Price range filter
  if (filters?.priceRange && filters.priceRange.length > 0) {
    where.priceRange = { in: filters.priceRange };
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
    rating: club.rating,
    reviewCount: club.reviewCount,
    priceRange: club.priceRange,
    amenities: club.amenities,
    vibeTags: club.vibeTags,
    isVerified: club.isVerified,
  }));
}

/**
 * Get Club by Slug
 */
export async function getClubBySlug(slug: string): Promise<ClubDetail | null> {
  const club = await prisma.club.findUnique({
    where: { slug, isActive: true },
    include: {
      city: {
        select: { name: true, slug: true },
      },
    },
  });

  if (!club) {
    return null;
  }

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
    rating: club.rating,
    reviewCount: club.reviewCount,
    priceRange: club.priceRange,
    amenities: club.amenities,
    vibeTags: club.vibeTags,
    isVerified: club.isVerified,
    description: club.description,
    addressDisplay: club.addressDisplay,
    coordinates: club.coordinates as { lat: number; lng: number },
    contactEmail: club.contactEmail,
    phoneNumber: club.phoneNumber,
    website: club.website,
    socialMedia: club.socialMedia as Record<string, string> | null,
    openingHours: club.openingHours as Record<string, string>,
    capacity: club.capacity,
    foundedYear: club.foundedYear,
  };
}

/**
 * Get Featured Clubs (for homepage)
 */
export async function getFeaturedClubs(limit = 6): Promise<ClubCard[]> {
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
    orderBy: { rating: 'desc' },
    take: limit,
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
    rating: club.rating,
    reviewCount: club.reviewCount,
    priceRange: club.priceRange,
    amenities: club.amenities,
    vibeTags: club.vibeTags,
    isVerified: club.isVerified,
  }));
}

/**
 * Get Club Neighbors (same city)
 */
export async function getCityNeighbors(clubId: string, limit = 4): Promise<ClubCard[]> {
  const club = await prisma.club.findUnique({
    where: { id: clubId },
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
      id: { not: clubId },
    },
    include: {
      city: {
        select: { name: true, slug: true },
      },
    },
    orderBy: { rating: 'desc' },
    take: limit,
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
    rating: clubItem.rating,
    reviewCount: clubItem.reviewCount,
    priceRange: clubItem.priceRange,
    amenities: clubItem.amenities,
    vibeTags: clubItem.vibeTags,
    isVerified: clubItem.isVerified,
  }));
}

/**
 * Get All Neighborhoods
 */
export async function getNeighborhoods(citySlug?: string) {
  const where: Record<string, unknown> = {
    isActive: true,
    isVerified: true,
  };

  if (citySlug) {
    const city = await prisma.city.findUnique({
      where: { slug: citySlug },
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
}

/**
 * Get All Amenities
 */
export async function getAllAmenities(citySlug?: string) {
  const where: Record<string, unknown> = {
    isActive: true,
    isVerified: true,
  };

  if (citySlug) {
    const city = await prisma.city.findUnique({
      where: { slug: citySlug },
      select: { id: true },
    });
    if (city) {
      where.cityId = city.id;
    }
  }

  const clubs = await prisma.club.findMany({
    where,
    select: { amenities: true },
  });

  const allAmenities: string[] = [];
  for (const c of clubs) {
    allAmenities.push(...c.amenities);
  }
  return Array.from(new Set(allAmenities)).sort();
}

/**
 * Get All Vibe Tags
 */
export async function getAllVibes(citySlug?: string) {
  const where: Record<string, unknown> = {
    isActive: true,
    isVerified: true,
  };

  if (citySlug) {
    const city = await prisma.city.findUnique({
      where: { slug: citySlug },
      select: { id: true },
    });
    if (city) {
      where.cityId = city.id;
    }
  }

  const clubs = await prisma.club.findMany({
    where,
    select: { vibeTags: true },
  });

  const allVibes: string[] = [];
  for (const c of clubs) {
    allVibes.push(...c.vibeTags);
  }
  return Array.from(new Set(allVibes)).sort();
}
