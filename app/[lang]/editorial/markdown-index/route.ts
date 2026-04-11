import { getArticles } from '@/app/actions/articles';
import { i18n, isLocale } from '@/lib/i18n-config';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

interface RouteContext {
  params: Promise<{ lang: string }>;
}

export async function GET(_request: Request, context: RouteContext): Promise<Response> {
  const { lang } = await context.params;
  if (!isLocale(lang)) {
    return new Response('Invalid locale', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://socialclubsmaps.com';
  const articles = await getArticles({ locale: lang });
  const lines = [
    `# SocialClubsMaps ${lang.toUpperCase()} Markdown Mirrors`,
    '',
    'Canonical sitemap:',
    `- ${baseUrl}/sitemap.xml`,
    '',
    'Markdown mirrors:',
    ...articles.map((article) => `- ${baseUrl}/${lang}/editorial/${article.slug}/markdown`),
    '',
    'Other language indexes:',
    ...i18n.locales
      .filter((locale) => locale !== lang)
      .map((locale) => `- ${baseUrl}/${locale}/editorial/markdown-index`),
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
