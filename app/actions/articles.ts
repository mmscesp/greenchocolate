'use server';

// Article Data Access Layer
// Server Actions for fetching articles

import { prisma } from '@/lib/prisma';

// ==========================================
// TYPES
// ==========================================

interface ArticleWithRelations {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  heroImage: string | null;
  heroImageAlt: string | null;
  authorName: string;
  authorAvatar: string | null;
  authorBio: string | null;
  publishedAt: Date | null;
  readTime: number;
  isPublished: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  city: { name: string | null; slug: string | null } | null;
}

interface ArticleCategoryCount {
  category: string;
  _count: { id: number };
}

export interface ArticleCard {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  heroImage: string | null;
  authorName: string;
  authorAvatar: string | null;
  publishedAt: string | null;
  readTime: number;
  cityName: string | null;
  citySlug: string | null;
}

export interface ArticleDetail extends ArticleCard {
  content: string;
  heroImageAlt: string | null;
  authorBio: string | null;
  isPublished: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
}

// ==========================================
// ACTIONS
// ==========================================

/**
 * Get All Published Articles
 */
export async function getArticles(filters?: {
  category?: string;
  citySlug?: string;
  limit?: number;
  offset?: number;
}): Promise<ArticleCard[]> {
  const where: Record<string, unknown> = {
    isPublished: true,
  };

  if (filters?.category) {
    where.category = filters.category;
  }

  if (filters?.citySlug) {
    const city = await prisma.city.findUnique({
      where: { slug: filters.citySlug },
      select: { id: true },
    });
    if (city) {
      where.cityId = city.id;
    }
  }

  const articles = await prisma.article.findMany({
    where,
    include: {
      city: {
        select: { name: true, slug: true },
      },
    },
    orderBy: { publishedAt: 'desc' },
    take: filters?.limit,
    skip: filters?.offset || 0,
  });

  return articles.map((article: ArticleWithRelations) => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    category: article.category,
    tags: article.tags,
    heroImage: article.heroImage,
    authorName: article.authorName,
    authorAvatar: article.authorAvatar,
    publishedAt: article.publishedAt?.toISOString() || null,
    readTime: article.readTime,
    cityName: article.city?.name || null,
    citySlug: article.city?.slug || null,
  }));
}

/**
 * Get Article by Slug
 */
export async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  const article = await prisma.article.findUnique({
    where: { slug, isPublished: true },
    include: {
      city: {
        select: { name: true, slug: true },
      },
      club: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  if (!article) {
    return null;
  }

  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    category: article.category,
    tags: article.tags,
    heroImage: article.heroImage,
    heroImageAlt: article.heroImageAlt,
    authorName: article.authorName,
    authorAvatar: article.authorAvatar,
    authorBio: article.authorBio,
    publishedAt: article.publishedAt?.toISOString() || null,
    readTime: article.readTime,
    cityName: article.city?.name || null,
    citySlug: article.city?.slug || null,
    isPublished: article.isPublished,
    metaTitle: article.metaTitle,
    metaDescription: article.metaDescription,
  };
}

/**
 * Get Featured Articles
 */
export async function getFeaturedArticles(limit = 3): Promise<ArticleCard[]> {
  const articles = await prisma.article.findMany({
    where: {
      isPublished: true,
      featuredOrder: { gt: 0 },
    },
    include: {
      city: {
        select: { name: true, slug: true },
      },
    },
    orderBy: { featuredOrder: 'asc' },
    take: limit,
  });

  return articles.map((article: ArticleWithRelations) => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    category: article.category,
    tags: article.tags,
    heroImage: article.heroImage,
    authorName: article.authorName,
    authorAvatar: article.authorAvatar,
    publishedAt: article.publishedAt?.toISOString() || null,
    readTime: article.readTime,
    cityName: article.city?.name || null,
    citySlug: article.city?.slug || null,
  }));
}

/**
 * Get Related Articles
 */
export async function getRelatedArticles(
  articleId: string,
  limit = 3
): Promise<ArticleCard[]> {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { category: true, cityId: true },
  });

  if (!article) {
    return [];
  }

  const articles = await prisma.article.findMany({
    where: {
      isPublished: true,
      id: { not: articleId },
      OR: [
        { category: article.category },
        { cityId: article.cityId },
      ],
    },
    include: {
      city: {
        select: { name: true, slug: true },
      },
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
  });

  return articles.map((art: ArticleWithRelations) => ({
    id: art.id,
    title: art.title,
    slug: art.slug,
    excerpt: art.excerpt,
    category: art.category,
    tags: art.tags,
    heroImage: art.heroImage,
    authorName: art.authorName,
    authorAvatar: art.authorAvatar,
    publishedAt: art.publishedAt?.toISOString() || null,
    readTime: art.readTime,
    cityName: art.city?.name || null,
    citySlug: art.city?.slug || null,
  }));
}

/**
 * Get Article Categories with Counts
 */
export async function getCategoriesWithCounts() {
  const categories = await prisma.article.groupBy({
    by: ['category'],
    where: { isPublished: true },
    _count: { id: true },
    orderBy: { category: 'asc' },
  });

  return categories.map((cat: ArticleCategoryCount) => ({
    name: cat.category,
    count: cat._count.id,
  }));
}
