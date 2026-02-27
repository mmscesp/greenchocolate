'use server';

import { z } from 'zod';
import {
  type BlogArticleRecord,
  getAllBlogArticles,
  getBlogArticleBySlug,
} from '@/lib/blog-content';

const articleFiltersSchema = z.object({
  category: z.string().optional(),
  citySlug: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(0).optional(),
});

const slugSchema = z.string().min(1);
const limitSchema = z.number().int().min(1).max(100).optional();
const idSchema = z.string().min(1);

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

function toArticleCard(article: BlogArticleRecord): ArticleCard {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    category: article.category,
    tags: article.tags,
    heroImage: article.heroImage,
    authorName: article.authorName,
    authorAvatar: article.authorAvatar,
    publishedAt: article.publishedAt,
    readTime: article.readTime,
    cityName: article.cityName,
    citySlug: article.citySlug,
  };
}

export async function getArticles(filters?: {
  category?: string;
  citySlug?: string;
  limit?: number;
  offset?: number;
}): Promise<ArticleCard[]> {
  try {
    const validatedFilters = filters ? articleFiltersSchema.parse(filters) : undefined;
    const all = await getAllBlogArticles();

    const filtered = all.filter((article) => {
      if (validatedFilters?.category && article.category !== validatedFilters.category) {
        return false;
      }

      if (validatedFilters?.citySlug && article.citySlug !== validatedFilters.citySlug) {
        return false;
      }

      return true;
    });

    const offset = validatedFilters?.offset ?? 0;
    const limit = validatedFilters?.limit;
    const paged = limit ? filtered.slice(offset, offset + limit) : filtered.slice(offset);
    return paged.map((article) => toArticleCard(article));
  } catch (error) {
    console.error('getArticles error:', error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  try {
    const validatedSlug = slugSchema.parse(slug);
    const article = await getBlogArticleBySlug(validatedSlug);

    if (!article) {
      return null;
    }

    return {
      ...toArticleCard(article),
      content: article.content,
      heroImageAlt: article.heroImageAlt,
      authorBio: article.authorBio,
      isPublished: article.isPublished,
      metaTitle: article.metaTitle,
      metaDescription: article.metaDescription,
    };
  } catch (error) {
    console.error('getArticleBySlug error:', error);
    return null;
  }
}

export async function getFeaturedArticles(limit = 3): Promise<ArticleCard[]> {
  try {
    const validatedLimit = limitSchema.parse(limit) ?? 3;
    const all = await getAllBlogArticles();

    const featured = all
      .filter((article) => article.featuredOrder > 0)
      .sort((a, b) => a.featuredOrder - b.featuredOrder)
      .slice(0, validatedLimit);

    if (featured.length >= validatedLimit) {
      return featured.map((article) => toArticleCard(article));
    }

    const excluded = new Set(featured.map((article) => article.id));
    const fallback = all
      .filter((article) => !excluded.has(article.id))
      .slice(0, Math.max(0, validatedLimit - featured.length));

    return [...featured, ...fallback].map((article) => toArticleCard(article));
  } catch (error) {
    console.error('getFeaturedArticles error:', error);
    return [];
  }
}

export async function getRelatedArticles(articleId: string, limit = 3): Promise<ArticleCard[]> {
  try {
    const validatedId = idSchema.parse(articleId);
    const validatedLimit = limitSchema.parse(limit) ?? 3;
    const all = await getAllBlogArticles();
    const reference = all.find((article) => article.id === validatedId);

    if (!reference) {
      return [];
    }

    const related = all
      .filter((article) => article.id !== reference.id)
      .filter((article) => {
        if (article.category === reference.category) {
          return true;
        }

        if (reference.citySlug && article.citySlug === reference.citySlug) {
          return true;
        }

        return false;
      })
      .slice(0, validatedLimit);

    return related.map((article) => toArticleCard(article));
  } catch (error) {
    console.error('getRelatedArticles error:', error);
    return [];
  }
}

export async function getCategoriesWithCounts(): Promise<{ name: string; count: number }[]> {
  try {
    const all = await getAllBlogArticles();
    const counts = new Map<string, number>();

    for (const article of all) {
      const current = counts.get(article.category) ?? 0;
      counts.set(article.category, current + 1);
    }

    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('getCategoriesWithCounts error:', error);
    return [];
  }
}
