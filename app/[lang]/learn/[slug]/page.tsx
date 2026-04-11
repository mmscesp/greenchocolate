import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { buildNoIndexMetadata } from '@/lib/seo';

interface LegacyLearnArticlePageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export const metadata: Metadata = buildNoIndexMetadata();

export default async function LegacyLearnArticlePage({ params }: LegacyLearnArticlePageProps) {
  const { lang, slug } = await params;
  redirect(`/${lang}/editorial/${slug}`);
}
