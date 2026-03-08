import { getArticles } from '@/app/actions/articles';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';
import { Scale } from '@/lib/icons';
import CategoryArticlePage from '@/app/[lang]/editorial/_components/CategoryArticlePage';

interface LegalPageProps {
  params: Promise<{ lang: string }>;
}

export const revalidate = 3600;

export default async function LegalPage({ params }: LegalPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string): string => (typeof dictionary[key] === 'string' ? dictionary[key] : key);
  const articles = await getArticles({ category: 'Legal', locale: lang as Locale });

  return (
    <CategoryArticlePage
      lang={lang}
      t={t}
      backToVaultKey="editorial.legal.back_to_vault"
      badgeKey="editorial.legal.badge"
      titlePrefixKey="editorial.legal.title_prefix"
      titleHighlightKey="editorial.legal.title_highlight"
      leadKey="editorial.legal.lead"
      guidesTitleKey="editorial.legal.guides_title"
      featuredKey="editorial.legal.featured"
      badgeIcon={<Scale className="w-4 h-4" />}
      articles={articles}
    />
  );
}
