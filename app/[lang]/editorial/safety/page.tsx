import { getArticles } from '@/app/actions/articles';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';
import { Shield } from '@/lib/icons';
import CategoryArticlePage from '@/app/[lang]/editorial/_components/CategoryArticlePage';

interface SafetyPageProps {
  params: Promise<{ lang: string }>;
}

export const revalidate = 3600;

export default async function SafetyPage({ params }: SafetyPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string): string => (typeof dictionary[key] === 'string' ? dictionary[key] : key);
  const articles = await getArticles({ category: 'Harm Reduction', locale: lang as Locale });

  return (
    <CategoryArticlePage
      lang={lang}
      t={t}
      backToVaultKey="editorial.safety.back_to_vault"
      badgeKey="editorial.categories.safety.title"
      titlePrefixKey="safety.title_prefix"
      titleHighlightKey="safety.title_highlight"
      leadKey="safety.subtitle"
      guidesTitleKey="editorial.standards.items.harm_reduction.title"
      featuredKey="editorial.safety.featured"
      badgeIcon={<Shield className="w-4 h-4" />}
      articles={articles}
    />
  );
}
