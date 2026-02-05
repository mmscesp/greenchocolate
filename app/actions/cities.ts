'use server';

// City Data Access Layer
// Server Actions for fetching cities

import { prisma } from '@/lib/prisma';

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
}

/**
 * Get City by Slug with Club Count
 */
export async function getCityBySlug(slug: string): Promise<CityDetail | null> {
  const city = await prisma.city.findUnique({
    where: { slug },
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
}

/**
 * Get Cities with Active Clubs
 */
export async function getCitiesWithClubs(): Promise<CityCard[]> {
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
}

/**
 * Get Popular Cities (by club count)
 */
export async function getPopularCities(limit = 5): Promise<CityCard[]> {
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
    take: limit,
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
}
