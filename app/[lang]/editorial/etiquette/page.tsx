import { getArticles } from '@/app/actions/articles';
import type { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';
import { Heart } from '@/lib/icons';
import CategoryArticlePage from '@/app/[lang]/editorial/_components/CategoryArticlePage';
import { buildLocalizedMetadata, isLocale } from '@/lib/seo';

interface EtiquettePageProps {
  params: Promise<{ lang: string }>;
}

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: EtiquettePageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) {
    return {};
  }

  const byLocale: Record<string, { title: string; description: string }> = {
    es: {
      title: 'Etiqueta en Cannabis Social Clubs | SocialClubsMaps',
      description:
        'Aprende normas de respeto, convivencia y comportamiento para una primera visita segura y responsable.',
    },
    en: {
      title: 'Cannabis Social Club Etiquette Guides | SocialClubsMaps',
      description:
        'Learn respectful, practical etiquette for first visits and everyday member interactions in cannabis social clubs.',
    },
    fr: {
      title: 'Guides d Étiquette des Clubs Sociaux Cannabis | SocialClubsMaps',
      description:
        'Apprenez les règles de respect et de convivialité pour une première visite sûre et responsable.',
    },
    de: {
      title: 'Etikette-Guides für Cannabis Social Clubs | SocialClubsMaps',
      description:
        'Lerne respektvolle Verhaltensregeln für Erstbesuche und den Alltag in Cannabis Social Clubs.',
    },
  };

  const localized = byLocale[lang] ?? byLocale.en;
  return buildLocalizedMetadata({
    lang,
    path: '/editorial/etiquette',
    title: localized.title,
    description: localized.description,
  });
}

export default async function EtiquettePage({ params }: EtiquettePageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string): string => (typeof dictionary[key] === 'string' ? dictionary[key] : key);
  const articles = await getArticles({ category: 'Etiquette', locale: lang as Locale });

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
