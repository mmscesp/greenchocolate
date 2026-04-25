import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getBlogArticleBySlug } from '@/lib/blog-content';
import { recordArticleView } from '@/lib/article-popularity';
import { isLocale, type Locale } from '@/lib/i18n-config';

const articleViewSchema = z.object({
  slug: z.string().min(1).max(200),
  locale: z.string().min(2).max(5),
  sessionId: z.string().min(8).max(200),
});

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const parsed = articleViewSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const locale = isLocale(parsed.data.locale) ? (parsed.data.locale as Locale) : 'en';
    const article = await getBlogArticleBySlug(parsed.data.slug, locale);

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const result = await recordArticleView({
      slug: parsed.data.slug,
      locale,
      sessionId: parsed.data.sessionId,
    });

    return NextResponse.json({ ok: true, recorded: result.recorded });
  } catch (error) {
    console.error('Article view tracking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
