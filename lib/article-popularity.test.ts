import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    articleView: {
      groupBy: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { mergeFeaturedArticles } from '@/lib/article-popularity';

const baseArticle = {
  excerpt: 'Excerpt',
  category: 'Legal',
  tags: ['legal'],
  heroImage: null,
  authorName: 'Editorial Team',
  authorAvatar: null,
  publishedAt: '2026-04-01T00:00:00.000Z',
  readTime: 8,
  cityName: null,
  citySlug: null,
};

describe('mergeFeaturedArticles', () => {
  it('keeps manually featured articles first and fills remaining slots with popular articles', () => {
    const result = mergeFeaturedArticles({
      allArticles: [
        { ...baseArticle, id: 'manual-2', slug: 'manual-2', title: 'Manual 2', featuredOrder: 2 },
        { ...baseArticle, id: 'popular-1', slug: 'popular-1', title: 'Popular 1', featuredOrder: 0 },
        { ...baseArticle, id: 'manual-1', slug: 'manual-1', title: 'Manual 1', featuredOrder: 1 },
        { ...baseArticle, id: 'popular-2', slug: 'popular-2', title: 'Popular 2', featuredOrder: 0 },
      ],
      popularityBySlug: new Map([
        ['popular-2', 18],
        ['popular-1', 31],
        ['manual-1', 999],
      ]),
      limit: 3,
    });

    expect(result.map((article) => article.slug)).toEqual(['manual-1', 'manual-2', 'popular-1']);
  });

  it('falls back to most recent articles when there is not enough popularity data', () => {
    const result = mergeFeaturedArticles({
      allArticles: [
        { ...baseArticle, id: 'recent-1', slug: 'recent-1', title: 'Recent 1', featuredOrder: 0, publishedAt: '2026-04-04T00:00:00.000Z' },
        { ...baseArticle, id: 'recent-2', slug: 'recent-2', title: 'Recent 2', featuredOrder: 0, publishedAt: '2026-04-03T00:00:00.000Z' },
        { ...baseArticle, id: 'recent-3', slug: 'recent-3', title: 'Recent 3', featuredOrder: 0, publishedAt: '2026-04-02T00:00:00.000Z' },
      ],
      popularityBySlug: new Map(),
      limit: 2,
    });

    expect(result.map((article) => article.slug)).toEqual(['recent-1', 'recent-2']);
  });
});
