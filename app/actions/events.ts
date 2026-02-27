'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const slugSchema = z.string().min(1);
const limitSchema = z.number().int().min(1).max(100).optional();

export interface EventCard {
  id: string;
  slug: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  imageUrl: string | null;
  eventUrl: string | null;
  cityName: string | null;
  citySlug: string | null;
  clubName: string | null;
  clubSlug: string | null;
}

export interface EventDetail extends EventCard {}

export async function getEvents(limit?: number): Promise<EventCard[]> {
  try {
    const validatedLimit = limitSchema.parse(limit);
    const events = await prisma.event.findMany({
      where: { isPublished: true },
      include: {
        city: {
          select: { name: true, slug: true },
        },
        club: {
          select: { name: true, slug: true },
        },
      },
      orderBy: { startDate: 'asc' },
      take: validatedLimit,
    });

    return events.map((event) => ({
      id: event.id,
      slug: event.slug,
      name: event.name,
      description: event.description,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      location: event.location,
      imageUrl: event.imageUrl,
      eventUrl: event.eventUrl,
      cityName: event.city?.name || null,
      citySlug: event.city?.slug || null,
      clubName: event.club?.name || null,
      clubSlug: event.club?.slug || null,
    }));
  } catch (error) {
    console.error('getEvents error:', error);
    return [];
  }
}

export async function getUpcomingEvents(limit = 6): Promise<EventCard[]> {
  try {
    const validatedLimit = limitSchema.parse(limit);
    const now = new Date();

    const events = await prisma.event.findMany({
      where: {
        isPublished: true,
        endDate: { gte: now },
      },
      include: {
        city: {
          select: { name: true, slug: true },
        },
        club: {
          select: { name: true, slug: true },
        },
      },
      orderBy: { startDate: 'asc' },
      take: validatedLimit,
    });

    return events.map((event) => ({
      id: event.id,
      slug: event.slug,
      name: event.name,
      description: event.description,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      location: event.location,
      imageUrl: event.imageUrl,
      eventUrl: event.eventUrl,
      cityName: event.city?.name || null,
      citySlug: event.city?.slug || null,
      clubName: event.club?.name || null,
      clubSlug: event.club?.slug || null,
    }));
  } catch (error) {
    console.error('getUpcomingEvents error:', error);
    return [];
  }
}

export async function getEventBySlug(slug: string): Promise<EventDetail | null> {
  try {
    const validatedSlug = slugSchema.parse(slug);
    const event = await prisma.event.findUnique({
      where: { slug: validatedSlug, isPublished: true },
      include: {
        city: {
          select: { name: true, slug: true },
        },
        club: {
          select: { name: true, slug: true },
        },
      },
    });

    if (!event) {
      return null;
    }

    return {
      id: event.id,
      slug: event.slug,
      name: event.name,
      description: event.description,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      location: event.location,
      imageUrl: event.imageUrl,
      eventUrl: event.eventUrl,
      cityName: event.city?.name || null,
      citySlug: event.city?.slug || null,
      clubName: event.club?.name || null,
      clubSlug: event.club?.slug || null,
    };
  } catch (error) {
    console.error('getEventBySlug error:', error);
    return null;
  }
}
