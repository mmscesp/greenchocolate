import { getArticles } from '@/app/actions/articles';
import type { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';
import { Scale } from '@/lib/icons';
import CategoryArticlePage from '@/app/[lang]/editorial/_components/CategoryArticlePage';
import { buildLocalizedMetadata, isLocale } from '@/lib/seo';

interface LegalPageProps {
  params: Promise<{ lang: string }>;
}

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: LegalPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) {
    return {};
  }

  const byLocale: Record<string, { title: string; description: string }> = {
    es: {
      title: 'Guías Legales de Cannabis Social Clubs en España | SocialClubsMaps',
      description:
        'Entiende el marco legal de cannabis social clubs en España con guías prácticas y actualizadas.',
    },
    en: {
      title: 'Legal Guides for Cannabis Social Clubs in Spain | SocialClubsMaps',
      description:
        'Understand the legal framework for cannabis social clubs in Spain with practical, up-to-date guides.',
    },
    fr: {
      title: 'Guides Juridiques des Clubs Sociaux Cannabis en Espagne | SocialClubsMaps',
      description:
        'Comprenez le cadre juridique des clubs sociaux cannabis en Espagne grâce à des guides pratiques et à jour.',
    },
    de: {
      title: 'Rechtsleitfäden für Cannabis Social Clubs in Spanien | SocialClubsMaps',
      description:
        'Verstehe den rechtlichen Rahmen von Cannabis Social Clubs in Spanien mit praxisnahen, aktuellen Guides.',
    },
  };

  const localized = byLocale[lang] ?? byLocale.en;
  return buildLocalizedMetadata({
    lang,
    path: '/editorial/legal',
    title: localized.title,
    description: localized.description,
  });
}

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
