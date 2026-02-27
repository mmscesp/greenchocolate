'use server';

// City Data Access Layer
// Server Actions for fetching cities

import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const slugSchema = z.string().min(1);
const limitSchema = z.number().int().min(1).max(100).optional();

// ==========================================
// TYPES
// ==========================================

interface CityWithCount {
  id: string;
  name: string;
  slug: string;
  country: string;
  region: string | null;
  description: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  latitude: number | null;
  longitude: number | null;
  _count: { clubs: number };
}

export interface CityCard {
  id: string;
  name: string;
  slug: string;
  country: string;
  region: string | null;
  description: string | null;
  clubCount: number;
}

export interface CityDetail extends CityCard {
  metaTitle: string | null;
  metaDescription: string | null;
  latitude: number | null;
  longitude: number | null;
}

// ==========================================
// ACTIONS
// ==========================================

/**
 * Get All Cities
 */
export async function getCities(): Promise<CityCard[]> {
  try {
    const cities = await prisma.city.findMany({
      include: {
        _count: {
          select: { clubs: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return cities.map((city: CityWithCount) => ({
      id: city.id,
      name: city.name,
      slug: city.slug,
      country: city.country,
      region: city.region,
      description: city.description,
      clubCount: city._count.clubs,
    }));
  } catch (error) {
    console.error('getCities error:', error);
    return [];
  }
}

/**
 * Get City by Slug with Club Count
 */
export async function getCityBySlug(slug: string): Promise<CityDetail | null> {
  try {
    const validatedSlug = slugSchema.parse(slug);
    const city = await prisma.city.findUnique({
      where: { slug: validatedSlug },
      include: {
        _count: {
          select: { clubs: true },
        },
      },
    });

    if (!city) {
      return null;
    }

    return {
      id: city.id,
      name: city.name,
      slug: city.slug,
      country: city.country,
      region: city.region,
      description: city.description,
      clubCount: city._count.clubs,
      metaTitle: city.metaTitle,
      metaDescription: city.metaDescription,
      latitude: city.latitude,
      longitude: city.longitude,
    };
  } catch (error) {
    console.error('getCityBySlug error:', error);
    return null;
  }
}

/**
 * Get Cities with Active Clubs
 */
export async function getCitiesWithClubs(): Promise<CityCard[]> {
  try {
    const cities = await prisma.city.findMany({
      include: {
        _count: {
          select: {
            clubs: {
              where: {
                isActive: true,
                isVerified: true,
              },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return cities
      .filter((city: CityWithCount) => city._count.clubs > 0)
      .map((city: CityWithCount) => ({
        id: city.id,
        name: city.name,
        slug: city.slug,
        country: city.country,
        region: city.region,
        description: city.description,
        clubCount: city._count.clubs,
      }));
  } catch (error) {
    console.error('getCitiesWithClubs error:', error);
    return [];
  }
}

/**
 * Get Popular Cities (by club count)
 */
export async function getPopularCities(limit = 5): Promise<CityCard[]> {
  try {
    const validatedLimit = limitSchema.parse(limit);
    const cities = await prisma.city.findMany({
      include: {
        _count: {
          select: { clubs: true },
        },
      },
      orderBy: {
        clubs: {
          _count: 'desc',
        },
      },
      take: validatedLimit,
    });

    return cities.map((city: CityWithCount) => ({
      id: city.id,
      name: city.name,
      slug: city.slug,
      country: city.country,
      region: city.region,
      description: city.description,
      clubCount: city._count.clubs,
    }));
  } catch (error) {
    console.error('getPopularCities error:', error);
    return [];
  }
}
