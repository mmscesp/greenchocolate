import { getArticles } from '@/app/actions/articles';
import type { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';
import { Shield } from '@/lib/icons';
import CategoryArticlePage from '@/app/[lang]/editorial/_components/CategoryArticlePage';
import { buildLocalizedMetadata, isLocale } from '@/lib/seo';

interface SafetyPageProps {
  params: Promise<{ lang: string }>;
}

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: SafetyPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) {
    return {};
  }

  const byLocale: Record<string, { title: string; description: string }> = {
    es: {
      title: 'Seguridad y Reducción de Riesgos en CSC | SocialClubsMaps',
      description:
        'Guías de seguridad y reducción de riesgos para consumo responsable en cannabis social clubs de España.',
    },
    en: {
      title: 'CSC Safety and Harm Reduction Guides | SocialClubsMaps',
      description:
        'Practical harm-reduction and safety guidance for responsible cannabis use in social clubs across Spain.',
    },
    fr: {
      title: 'Sécurité et Réduction des Risques en CSC | SocialClubsMaps',
      description:
        'Guides de sécurité et de réduction des risques pour un usage responsable dans les clubs sociaux cannabis.',
    },
    de: {
      title: 'Sicherheit und Harm Reduction in CSC | SocialClubsMaps',
      description:
        'Praxisnahe Sicherheits- und Harm-Reduction-Guides für verantwortungsvollen Konsum in Spaniens CSC.',
    },
  };

  const localized = byLocale[lang] ?? byLocale.en;
  return buildLocalizedMetadata({
    lang,
    path: '/editorial/safety',
    title: localized.title,
    description: localized.description,
  });
}

export default async function SafetyPage({ params }: SafetyPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string): string => (typeof dictionary[key] === 'string' ? dictionary[key] : key);
  const articles = await getArticles({ category: 'Harm Reduction', locale: lang as Locale });

  return (
    <CategoryArticlePage
      lang={lang}
      t={t}
      backToVaultKey="editorial.legal.back_to_vault"
      badgeKey="editorial.categories.safety.title"
      titlePrefixKey="editorial.safety.title_prefix"
      titleHighlightKey="editorial.safety.title_highlight"
      leadKey="editorial.safety.lead"
      guidesTitleKey="editorial.standards.items.harm_reduction.title"
      featuredKey="editorial.safety.featured"
      badgeIcon={<Shield className="w-4 h-4" />}
      categoryPath="/editorial/safety"
      articles={articles}
    />
  );
}
