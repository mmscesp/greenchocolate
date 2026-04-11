import { MetadataRoute } from 'next';
import { getCities } from '@/app/actions/cities';
import { getClubs } from '@/app/actions/clubs';
import { getArticles } from '@/app/actions/articles';
import { getEvents } from '@/app/actions/events';
import { i18n } from '@/lib/i18n-config';
import { getBaseUrl } from '@/lib/seo';

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const now = new Date();
  const staticPageConfigs: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority: number;
  }> = [
    { path: '', changeFrequency: 'daily', priority: 1.0 },
    { path: '/clubs', changeFrequency: 'daily', priority: 0.9 },
    { path: '/spain', changeFrequency: 'weekly', priority: 0.85 },
    { path: '/editorial', changeFrequency: 'weekly', priority: 0.85 },
    { path: '/editorial/legal', changeFrequency: 'weekly', priority: 0.75 },
    { path: '/editorial/etiquette', changeFrequency: 'weekly', priority: 0.75 },
    { path: '/editorial/culture', changeFrequency: 'weekly', priority: 0.75 },
    { path: '/editorial/safety', changeFrequency: 'weekly', priority: 0.75 },
    { path: '/safety-kit', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/safety', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/events', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/mission', changeFrequency: 'monthly', priority: 0.6 },
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
  let events: Awaited<ReturnType<typeof getEvents>> = [];
  const articlesByLocale: Record<string, Awaited<ReturnType<typeof getArticles>>> = Object.fromEntries(
    i18n.locales.map((locale) => [locale, []])
  );

  try {
    const [resolvedCities, resolvedClubs, resolvedEvents, ...localizedArticles] = await Promise.all([
      getCities(),
      getClubs({ isVerified: true }),
      getEvents(500),
      ...i18n.locales.map((locale) => getArticles({ locale })),
    ]);
    cities = resolvedCities;
    clubs = resolvedClubs;
    events = resolvedEvents;
    i18n.locales.forEach((locale, index) => {
      articlesByLocale[locale] = localizedArticles[index] || [];
    });
  } catch (error) {
    console.warn('Failed to fetch dynamic data for sitemap:', error);
  }

  const staticRoutes: MetadataRoute.Sitemap = staticPageConfigs.flatMap((page) =>
    toLocalizedEntries(page.path, page.changeFrequency, page.priority)
  );

  const cityRoutes: MetadataRoute.Sitemap = cities.flatMap((city) =>
    toLocalizedEntries(`/spain/${city.slug}`, 'weekly', 0.8)
  );

  const cityGuidesIndexRoutes: MetadataRoute.Sitemap = cities.flatMap((city) =>
    toLocalizedEntries(`/spain/${city.slug}/guides`, 'weekly', 0.65)
  );

  const cityClubsIndexRoutes: MetadataRoute.Sitemap = cities.flatMap((city) =>
    toLocalizedEntries(`/spain/${city.slug}/clubs`, 'weekly', 0.65)
  );

  const clubRoutes: MetadataRoute.Sitemap = clubs.flatMap((club) =>
    toLocalizedEntries(`/clubs/${club.slug}`, 'weekly', 0.7)
  );

  const articleRoutes: MetadataRoute.Sitemap = i18n.locales.flatMap((locale) =>
    (articlesByLocale[locale] || []).map((article) => ({
      url: `${baseUrl}/${locale}/editorial/${article.slug}`,
      lastModified: article.publishedAt ? new Date(article.publishedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  );

  const eventRoutes: MetadataRoute.Sitemap = events.flatMap((event) =>
    toLocalizedEntries(
      `/events/${event.slug}`,
      'weekly',
      0.6,
      event.startDate ? new Date(event.startDate) : now
    )
  );

  const allEntries = [
    ...staticRoutes,
    ...cityRoutes,
    ...cityGuidesIndexRoutes,
    ...cityClubsIndexRoutes,
    ...clubRoutes,
    ...articleRoutes,
    ...eventRoutes,
  ];

  const dedupedEntries = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const entry of allEntries) {
    const existing = dedupedEntries.get(entry.url);
    if (!existing) {
      dedupedEntries.set(entry.url, entry);
      continue;
    }

    const existingLastModified = existing.lastModified ? new Date(existing.lastModified).getTime() : 0;
    const candidateLastModified = entry.lastModified ? new Date(entry.lastModified).getTime() : 0;
    if (candidateLastModified > existingLastModified) {
      dedupedEntries.set(entry.url, entry);
    }
  }

  return Array.from(dedupedEntries.values());
}
