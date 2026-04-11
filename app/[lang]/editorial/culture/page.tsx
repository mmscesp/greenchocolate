import { getArticles } from '@/app/actions/articles';
import type { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';
import { History } from '@/lib/icons';
import CategoryArticlePage from '@/app/[lang]/editorial/_components/CategoryArticlePage';
import { buildLocalizedMetadata, isLocale } from '@/lib/seo';

interface CulturePageProps {
  params: Promise<{ lang: string }>;
}

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: CulturePageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) {
    return {};
  }

  const byLocale: Record<string, { title: string; description: string }> = {
    es: {
      title: 'Cultura Cannabis y CSC en España | SocialClubsMaps',
      description:
        'Explora historia, cultura local y contexto social de los cannabis social clubs en España.',
    },
    en: {
      title: 'Cannabis Social Club Culture in Spain | SocialClubsMaps',
      description:
        'Explore the history, social context, and local culture around cannabis social clubs in Spain.',
    },
    fr: {
      title: 'Culture des Clubs Sociaux Cannabis en Espagne | SocialClubsMaps',
      description:
        'Explorez l histoire, le contexte social et la culture locale des clubs sociaux cannabis en Espagne.',
    },
    de: {
      title: 'Cannabis-Social-Club-Kultur in Spanien | SocialClubsMaps',
      description:
        'Entdecke Geschichte, sozialen Kontext und lokale Kultur rund um Cannabis Social Clubs in Spanien.',
    },
  };

  const localized = byLocale[lang] ?? byLocale.en;
  return buildLocalizedMetadata({
    lang,
    path: '/editorial/culture',
    title: localized.title,
    description: localized.description,
  });
}

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
