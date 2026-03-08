import { getArticles } from '@/app/actions/articles';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';
import { History } from '@/lib/icons';
import CategoryArticlePage from '@/app/[lang]/editorial/_components/CategoryArticlePage';

interface CulturePageProps {
  params: Promise<{ lang: string }>;
}

export const revalidate = 3600;

export default async function CulturePage({ params }: CulturePageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string): string => (typeof dictionary[key] === 'string' ? dictionary[key] : key);
  const articles = await getArticles({ category: 'Culture', locale: lang as Locale });

  return (
    <CategoryArticlePage
      lang={lang}
      t={t}
      backToVaultKey="editorial.culture.back_to_vault"
      badgeKey="editorial.culture.badge"
      titlePrefixKey="editorial.culture.title_prefix"
      titleHighlightKey="editorial.culture.title_highlight"
      leadKey="editorial.culture.lead"
      guidesTitleKey="editorial.culture.guides_title"
      featuredKey="editorial.culture.featured"
      badgeIcon={<History className="w-4 h-4" />}
      articles={articles}
    />
  );
}
