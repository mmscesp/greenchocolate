import { MetadataRoute } from 'next';
import { getCities } from '@/app/actions/cities';
import { getClubs } from '@/app/actions/clubs';
import { getArticles } from '@/app/actions/articles';
import { i18n } from '@/lib/i18n-config';

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://socialclubsmaps.com';
  const now = new Date();
  const staticPageConfigs: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority: number;
  }> = [
    { path: '', changeFrequency: 'daily', priority: 1.0 },
    { path: '/clubs', changeFrequency: 'daily', priority: 0.9 },
    { path: '/directory', changeFrequency: 'daily', priority: 0.9 },
    { path: '/spain', changeFrequency: 'weekly', priority: 0.85 },
    { path: '/editorial', changeFrequency: 'weekly', priority: 0.85 },
    { path: '/learn', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/safety-kit', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/safety', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/events', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/mission', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/privacy', changeFrequency: 'yearly', priority: 0.2 },
    { path: '/terms', changeFrequency: 'yearly', priority: 0.2 },
    { path: '/cookies', changeFrequency: 'yearly', priority: 0.2 },
  ];

  const toLocalizedEntries = (
    path: string,
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
    priority: number,
    lastModified: Date = now
  ): MetadataRoute.Sitemap =>
    i18n.locales.map((locale) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified,
      changeFrequency,
      priority,
    }));

  // Fetch dynamic data with error handling
  let cities: Awaited<ReturnType<typeof getCities>> = [];
  let clubs: Awaited<ReturnType<typeof getClubs>> = [];
  let articles: Awaited<ReturnType<typeof getArticles>> = [];

  try {
    [cities, clubs, articles] = await Promise.all([
      getCities(),
      getClubs({ isVerified: true }),
      getArticles({ locale: 'en' }),
    ]);
  } catch (error) {
    console.warn('Failed to fetch dynamic data for sitemap:', error);
  }

  const staticRoutes: MetadataRoute.Sitemap = staticPageConfigs.flatMap((page) =>
    toLocalizedEntries(page.path, page.changeFrequency, page.priority)
  );

  const cityRoutes: MetadataRoute.Sitemap = cities.flatMap((city) =>
    toLocalizedEntries(`/spain/${city.slug}`, 'weekly', 0.8)
  );

  const clubRoutes: MetadataRoute.Sitemap = clubs.flatMap((club) =>
    toLocalizedEntries(`/clubs/${club.slug}`, 'weekly', 0.7)
  );

  const articleRoutes: MetadataRoute.Sitemap = articles.flatMap((article) =>
    toLocalizedEntries(
      `/editorial/${article.slug}`,
      'monthly',
      0.6,
      article.publishedAt ? new Date(article.publishedAt) : now
    )
  );

  return [...staticRoutes, ...cityRoutes, ...clubRoutes, ...articleRoutes];
}
