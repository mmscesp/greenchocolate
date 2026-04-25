import { createHash } from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

type FeaturedArticleLike = {
  id: string;
  slug: string;
  featuredOrder: number;
  publishedAt: string | null;
};

const DEFAULT_POPULARITY_WINDOW_DAYS = 30;

function isMissingArticleViewTableError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021';
}

function getPopularityWindowStart(days: number): Date {
  const now = new Date();
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}

function getViewDateBucket(now = new Date()): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function hashSessionId(sessionId: string): string {
  return createHash('sha256').update(sessionId, 'utf8').digest('hex');
}

export function mergeFeaturedArticles<T extends FeaturedArticleLike>(params: {
  allArticles: T[];
  popularityBySlug: Map<string, number>;
  limit: number;
}): T[] {
  const { allArticles, popularityBySlug, limit } = params;

  const pinned = allArticles
    .filter((article) => article.featuredOrder > 0)
    .sort((a, b) => a.featuredOrder - b.featuredOrder);

  if (pinned.length >= limit) {
    return pinned.slice(0, limit);
  }

  const excluded = new Set(pinned.map((article) => article.id));
  const popular = allArticles
    .filter((article) => !excluded.has(article.id))
    .sort((a, b) => {
      const popularityDelta = (popularityBySlug.get(b.slug) ?? 0) - (popularityBySlug.get(a.slug) ?? 0);
      if (popularityDelta !== 0) {
        return popularityDelta;
      }

      const aPublished = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const bPublished = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return bPublished - aPublished;
    })
    .slice(0, Math.max(0, limit - pinned.length));

  return [...pinned, ...popular];
}

export async function getPopularArticleViewCounts(days = DEFAULT_POPULARITY_WINDOW_DAYS): Promise<Map<string, number>> {
  try {
    const rows = await prisma.articleView.groupBy({
      by: ['articleSlug'],
      where: {
        viewDate: {
          gte: getPopularityWindowStart(days),
        },
      },
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          articleSlug: 'desc',
        },
      },
    });

    return new Map(rows.map((row) => [row.articleSlug, row._count._all]));
  } catch (error) {
    if (isMissingArticleViewTableError(error)) {
      return new Map();
    }

    console.error('getPopularArticleViewCounts error:', error);
    return new Map();
  }
}

export async function recordArticleView(input: {
  slug: string;
  locale: string;
  sessionId: string;
}): Promise<{ recorded: boolean }> {
  const sessionHash = hashSessionId(input.sessionId);
  const viewDate = getViewDateBucket();

  try {
    await prisma.articleView.create({
      data: {
        articleSlug: input.slug,
        locale: input.locale,
        sessionHash,
        viewDate,
      },
    });

    return { recorded: true };
  } catch (error) {
    if (isMissingArticleViewTableError(error)) {
      return { recorded: false };
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { recorded: false };
    }

    throw error;
  }
}
