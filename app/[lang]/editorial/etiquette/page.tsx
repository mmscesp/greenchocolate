import { getArticles } from '@/app/actions/articles';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';
import { Heart } from '@/lib/icons';
import CategoryArticlePage from '@/app/[lang]/editorial/_components/CategoryArticlePage';

interface EtiquettePageProps {
  params: Promise<{ lang: string }>;
}

export const revalidate = 3600;

export default async function EtiquettePage({ params }: EtiquettePageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string) => dictionary[key] || key;
  const articles = await getArticles({ category: 'Etiquette' });

  return (
    <CategoryArticlePage
      lang={lang}
      t={t}
      backToVaultKey="editorial.etiquette.back_to_vault"
      badgeKey="editorial.etiquette.badge"
      titlePrefixKey="editorial.etiquette.title_prefix"
      titleHighlightKey="editorial.etiquette.title_highlight"
      leadKey="editorial.etiquette.lead"
      guidesTitleKey="editorial.etiquette.guides_title"
      featuredKey="editorial.etiquette.featured"
      badgeIcon={<Heart className="w-4 h-4" />}
      articles={articles}
    />
  );
}
