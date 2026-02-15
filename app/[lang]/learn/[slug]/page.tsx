import { redirect } from 'next/navigation';

interface LegacyLearnArticlePageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export default async function LegacyLearnArticlePage({ params }: LegacyLearnArticlePageProps) {
  const { lang, slug } = await params;
  redirect(`/${lang}/editorial/${slug}`);
}
