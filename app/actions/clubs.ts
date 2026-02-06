'use server';

// Club Data Access Layer
// Server Actions for fetching clubs

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
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
      coordinates: club.coordinates as { lat: number; lng: number },
      contactEmail: club.contactEmail,
      phoneNumber: club.phoneNumber,
      website: club.website,
      socialMedia: club.socialMedia as Record<string, string> | null,
      openingHours: club.openingHours as Record<string, string>,
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
