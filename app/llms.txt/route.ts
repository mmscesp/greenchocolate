import { i18n } from '@/lib/i18n-config';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function GET(): Promise<Response> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://socialclubsmaps.com';

  const lines = [
    'site: SocialClubsMaps',
    'description: Verified cannabis social club discovery and safety-focused editorial guidance in Spain.',
    '',
    'preferred_sitemap:',
    `- ${baseUrl}/sitemap.xml`,
    '',
    'llms_full:',
    `- ${baseUrl}/llms-full.txt`,
    '',
    'markdown_indexes:',
    ...i18n.locales.map((locale) => `- ${baseUrl}/${locale}/editorial/markdown-index`),
    '',
    'scope:',
    '- Public informational pages and published editorial articles.',
    '- Private account, dashboard, club-panel, and admin routes are excluded from crawl and indexing.',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
