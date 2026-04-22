'use server';

import { prisma } from '@/lib/prisma';
import { getAllBlogArticles, getBlogArticleBySlug, type BlogArticleRecord } from '@/lib/blog-content';
import type { Locale } from '@/lib/i18n-config';
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

export interface EventDetail extends EventCard {
  articleTitle: string | null;
  articleExcerpt: string | null;
  articleContent: string | null;
  articleHeroImage: string | null;
  articleHeroImageAlt: string | null;
  articleCategory: string | null;
  articleTags: string[];
}

type ArticleBackedEvent = EventCard & {
  articleTitle: string | null;
  articleExcerpt: string | null;
  articleContent: string | null;
  articleHeroImage: string | null;
  articleHeroImageAlt: string | null;
  articleCategory: string | null;
  articleTags: string[];
};

function isEventArticle(article: BlogArticleRecord): boolean {
  return (
    article.isPublished &&
    article.tags.some((tag) => tag.toLowerCase() === 'events') &&
    Boolean(article.eventStartDate) &&
    Boolean(article.eventLocation)
  );
}

function toArticleBackedEvent(article: BlogArticleRecord): ArticleBackedEvent {
  return {
    id: `article:${article.slug}`,
    slug: article.slug,
    name: article.title,
    description: article.excerpt,
    startDate: article.eventStartDate ?? article.publishedAt ?? new Date().toISOString(),
    endDate: article.eventEndDate ?? article.eventStartDate ?? article.publishedAt ?? new Date().toISOString(),
    location: article.eventLocation ?? article.cityName ?? 'Event location to be confirmed',
    imageUrl: article.heroImage,
    eventUrl: article.eventUrl,
    cityName: article.cityName,
    citySlug: article.citySlug,
    clubName: null,
    clubSlug: null,
    articleTitle: article.title,
    articleExcerpt: article.excerpt,
    articleContent: article.content,
    articleHeroImage: article.heroImage,
    articleHeroImageAlt: article.heroImageAlt,
    articleCategory: article.category,
    articleTags: article.tags,
  };
}

function sortEventsByRelevance<T extends EventCard>(events: T[]): T[] {
  const now = Date.now();

  return [...events].sort((left, right) => {
    const leftEnd = new Date(left.endDate).getTime();
    const rightEnd = new Date(right.endDate).getTime();
    const leftStart = new Date(left.startDate).getTime();
    const rightStart = new Date(right.startDate).getTime();
    const leftUpcoming = leftEnd >= now;
    const rightUpcoming = rightEnd >= now;

    if (leftUpcoming !== rightUpcoming) {
      return leftUpcoming ? -1 : 1;
    }

    if (leftUpcoming) {
      return leftStart - rightStart;
    }

    return rightStart - leftStart;
  });
}

async function getEventArticles(locale: Locale = 'en'): Promise<ArticleBackedEvent[]> {
  const articles = await getAllBlogArticles(locale);
  return articles.filter(isEventArticle).map((article) => toArticleBackedEvent(article));
}

async function enrichEventWithArticle<T extends EventCard>(
  event: T,
  locale: Locale = 'en'
): Promise<T> {
  const article = await getBlogArticleBySlug(event.slug, locale);

  if (!article) {
    return event;
  }

  return {
    ...event,
    description: article.excerpt || event.description,
    imageUrl: article.heroImage || event.imageUrl,
    citySlug: article.citySlug || event.citySlug,
    cityName: article.cityName || event.cityName,
  };
}

function mergeEvents<T extends EventCard>(databaseEvents: T[], articleEvents: EventCard[]): T[] {
  const merged = new Map<string, T>();

  for (const event of databaseEvents) {
    merged.set(event.slug, event);
  }

  for (const articleEvent of articleEvents) {
    if (merged.has(articleEvent.slug)) {
      continue;
    }

    merged.set(articleEvent.slug, articleEvent as T);
  }

  return Array.from(merged.values());
}

export async function getEvents(limit?: number, locale: Locale = 'en'): Promise<EventCard[]> {
  try {
    const validatedLimit = limitSchema.parse(limit);
    const [events, articleEvents] = await Promise.all([
      prisma.event.findMany({
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
      }),
      getEventArticles(locale),
    ]);

    const mappedEvents = events.map((event) => ({
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

    const enrichedEvents = await Promise.all(mappedEvents.map((event) => enrichEventWithArticle(event, locale)));
    const mergedEvents = mergeEvents(enrichedEvents, articleEvents);
    const sortedEvents = sortEventsByRelevance(mergedEvents);

    return validatedLimit ? sortedEvents.slice(0, validatedLimit) : sortedEvents;
  } catch (error) {
    console.error('getEvents error:', error);
    return [];
  }
}

export async function getUpcomingEvents(limit = 6, locale: Locale = 'en'): Promise<EventCard[]> {
  try {
    const validatedLimit = limitSchema.parse(limit);
    const now = new Date();

    const events = await getEvents(undefined, locale);
    return events
      .filter((event) => new Date(event.endDate) >= now)
      .slice(0, validatedLimit);
  } catch (error) {
    console.error('getUpcomingEvents error:', error);
    return [];
  }
}

export async function getEventBySlug(slug: string, locale: Locale = 'en'): Promise<EventDetail | null> {
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
      const article = await getBlogArticleBySlug(validatedSlug, locale);

      if (!article || !isEventArticle(article)) {
        return null;
      }

      const articleEvent = toArticleBackedEvent(article);

      return {
        ...articleEvent,
        articleTitle: article.title,
        articleExcerpt: article.excerpt,
        articleContent: article.content,
        articleHeroImage: article.heroImage,
        articleHeroImageAlt: article.heroImageAlt,
        articleCategory: article.category,
        articleTags: article.tags,
      };
    }

    const article = await getBlogArticleBySlug(event.slug, locale);

    return {
      id: event.id,
      slug: event.slug,
      name: event.name,
      description: article?.excerpt || event.description,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      location: event.location,
      imageUrl: article?.heroImage || event.imageUrl,
      eventUrl: event.eventUrl,
      cityName: article?.cityName || event.city?.name || null,
      citySlug: article?.citySlug || event.city?.slug || null,
      clubName: event.club?.name || null,
      clubSlug: event.club?.slug || null,
      articleTitle: article?.title || null,
      articleExcerpt: article?.excerpt || null,
      articleContent: article?.content || null,
      articleHeroImage: article?.heroImage || null,
      articleHeroImageAlt: article?.heroImageAlt || null,
      articleCategory: article?.category || null,
      articleTags: article?.tags || [],
    };
  } catch (error) {
    console.error('getEventBySlug error:', error);
    return null;
  }
}
