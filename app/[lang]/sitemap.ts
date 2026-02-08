import { MetadataRoute } from 'next';
import { getCities } from '@/app/actions/cities';
import { getClubs } from '@/app/actions/clubs';
import { getArticles } from '@/app/actions/articles';

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://socialclubsmaps.com';

  // Fetch dynamic data with error handling
  let cities: Awaited<ReturnType<typeof getCities>> = [];
  let clubs: Awaited<ReturnType<typeof getClubs>> = [];
  let articles: Awaited<ReturnType<typeof getArticles>> = [];

  try {
    [cities, clubs, articles] = await Promise.all([
      getCities(),
      getClubs({ isVerified: true }),
      getArticles(),
    ]);
  } catch (error) {
    console.warn('Failed to fetch dynamic data for sitemap:', error);
  }

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/clubs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/club-panel`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // City pages
  const cityRoutes: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${baseUrl}/clubs/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Club pages
  const clubRoutes: MetadataRoute.Sitemap = clubs.map((club) => ({
    url: `${baseUrl}/clubs/${club.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Article pages
  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: article.publishedAt ? new Date(article.publishedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...cityRoutes, ...clubRoutes, ...articleRoutes];
}
