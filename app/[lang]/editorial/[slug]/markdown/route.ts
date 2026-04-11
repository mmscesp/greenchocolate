import { getArticleBySlug } from '@/app/actions/articles';
import { isLocale } from '@/lib/i18n-config';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

interface RouteContext {
  params: Promise<{ lang: string; slug: string }>;
}

function quoteForFrontmatter(value: string): string {
  return value.replace(/"/g, '\\"');
}

export async function GET(_request: Request, context: RouteContext): Promise<Response> {
  const { lang, slug } = await context.params;

  if (!isLocale(lang)) {
    return new Response('Invalid locale', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }

  const article = await getArticleBySlug(slug, lang);
  if (!article) {
    return new Response('Article not found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://socialclubsmaps.com';
  const canonicalUrl = `${baseUrl}/${lang}/editorial/${article.slug}`;
  const markdown = [
    '---',
    `title: "${quoteForFrontmatter(article.title)}"`,
    `slug: "${article.slug}"`,
    `locale: "${lang}"`,
    `canonical: "${canonicalUrl}"`,
    article.publishedAt ? `publishedAt: "${article.publishedAt}"` : null,
    article.metaDescription
      ? `description: "${quoteForFrontmatter(article.metaDescription)}"`
      : null,
    '---',
    '',
    article.content.trim(),
    '',
  ]
    .filter((line): line is string => Boolean(line))
    .join('\n');

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      Link: `<${canonicalUrl}>; rel="canonical"`,
    },
  });
}
