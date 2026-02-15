import ClubsPageWrapper from './ClubsPageWrapper';
import { Metadata } from 'next';

// ISR: Revalidate every hour
export const revalidate = 3600;

const OG_LOCALE_BY_LANG: Record<string, string> = {
  es: 'es_ES',
  en: 'en_US',
  fr: 'fr_FR',
  de: 'de_DE',
  it: 'it_IT',
  pl: 'pl_PL',
  ru: 'ru_RU',
  pt: 'pt_PT',
};

interface ClubsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: ClubsPageProps): Promise<Metadata> {
  const { lang } = await params;

  return {
    title: 'Cannabis Social Clubs Directory | Find CSCs in Spain | SocialClubsMaps',
    description: 'Browse verified cannabis social clubs in Madrid, Barcelona, and across Spain. Filter by neighborhood, amenities, and vibe. Pre-register for membership today.',
    keywords: 'cannabis social clubs directory, CSC Spain, Madrid cannabis clubs, Barcelona cannabis clubs, find cannabis clubs, marijuana clubs Spain',
    openGraph: {
      title: 'Cannabis Social Clubs Directory | SocialClubsMaps',
      description: 'Browse verified cannabis social clubs in Madrid, Barcelona, and across Spain.',
      type: 'website',
      locale: OG_LOCALE_BY_LANG[lang] || 'es_ES',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Cannabis Social Clubs Directory | SocialClubsMaps',
      description: 'Browse verified cannabis social clubs in Spain.',
    },
    alternates: {
      canonical: `https://socialclubsmaps.com/${lang}/clubs`,
    },
  };
}

export default function ClubsPage() {
  return <ClubsPageWrapper />;
}
