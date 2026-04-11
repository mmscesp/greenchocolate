import { getArticles } from '@/app/actions/articles';
import { i18n } from '@/lib/i18n-config';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function GET(): Promise<Response> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://socialclubsmaps.com';
  const publicStaticPaths = [
    '',
    '/clubs',
    '/spain',
    '/editorial',
    '/editorial/legal',
    '/editorial/etiquette',
    '/editorial/culture',
    '/editorial/safety',
    '/safety-kit',
    '/safety',
    '/events',
    '/mission',
    '/contact',
    '/privacy',
    '/terms',
    '/cookies',
  ];

  const localeSections = await Promise.all(
    i18n.locales.map(async (locale) => {
      const articles = await getArticles({ locale });
      const staticUrls = publicStaticPaths.map((path) => `${baseUrl}/${locale}${path}`);
      const markdownUrls = articles.map(
        (article) => `${baseUrl}/${locale}/editorial/${article.slug}/markdown`
      );

      return {
        locale,
        staticUrls,
        markdownUrls,
      };
    })
  );

  const lines: string[] = [
    'site: SocialClubsMaps',
    `generated_at: ${new Date().toISOString()}`,
    '',
    'sitemap:',
    `- ${baseUrl}/sitemap.xml`,
    '',
  ];

  for (const section of localeSections) {
    lines.push(`[locale:${section.locale}]`);
    lines.push('public_pages:');
    lines.push(...section.staticUrls.map((url) => `- ${url}`));
    lines.push('editorial_markdown_mirrors:');
    lines.push(...section.markdownUrls.map((url) => `- ${url}`));
    lines.push('');
  }

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
