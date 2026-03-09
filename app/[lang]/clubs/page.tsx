import ClubsPageWrapper from './ClubsPageWrapper';
import { Metadata } from 'next';

// ISR: Revalidate every hour
export const revalidate = 3600;

const OG_LOCALE_BY_LANG: Record<string, string> = {
  es: 'es_ES',
  en: 'en_US',
  fr: 'fr_FR',
  de: 'de_DE',
};

interface ClubsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: ClubsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const metadataByLocale: Record<string, { title: string; description: string; ogTitle: string; ogDescription: string; twitterTitle: string; twitterDescription: string }> = {
    es: {
      title: 'Directorio de Cannabis Social Clubs | Encuentra CSC en Espana | SocialClubsMaps',
      description:
        'Explora cannabis social clubs verificados en Madrid, Barcelona y toda Espana. Filtra por barrio, servicios y ambiente.',
      ogTitle: 'Directorio de Cannabis Social Clubs | SocialClubsMaps',
      ogDescription: 'Explora cannabis social clubs verificados en Madrid, Barcelona y toda Espana.',
      twitterTitle: 'Directorio de Cannabis Social Clubs | SocialClubsMaps',
      twitterDescription: 'Explora cannabis social clubs verificados en Espana.',
    },
    en: {
      title: 'Cannabis Social Clubs Directory | Find CSCs in Spain | SocialClubsMaps',
      description:
        'Browse verified cannabis social clubs in Madrid, Barcelona, and across Spain. Filter by neighborhood, amenities, and vibe.',
      ogTitle: 'Cannabis Social Clubs Directory | SocialClubsMaps',
      ogDescription: 'Browse verified cannabis social clubs in Madrid, Barcelona, and across Spain.',
      twitterTitle: 'Cannabis Social Clubs Directory | SocialClubsMaps',
      twitterDescription: 'Browse verified cannabis social clubs in Spain.',
    },
    fr: {
      title: 'Annuaire des Cannabis Social Clubs | Trouver des CSC en Espagne | SocialClubsMaps',
      description:
        'Parcourez des cannabis social clubs verifies a Madrid, Barcelone et dans toute l Espagne. Filtrez par quartier, services et ambiance.',
      ogTitle: 'Annuaire des Cannabis Social Clubs | SocialClubsMaps',
      ogDescription: 'Parcourez des cannabis social clubs verifies a Madrid, Barcelone et dans toute l Espagne.',
      twitterTitle: 'Annuaire des Cannabis Social Clubs | SocialClubsMaps',
      twitterDescription: 'Parcourez des cannabis social clubs verifies en Espagne.',
    },
    de: {
      title: 'Verzeichnis der Cannabis Social Clubs | CSCs in Spanien finden | SocialClubsMaps',
      description:
        'Entdecke verifizierte Cannabis Social Clubs in Madrid, Barcelona und ganz Spanien. Filtere nach Viertel, Ausstattung und Stimmung.',
      ogTitle: 'Verzeichnis der Cannabis Social Clubs | SocialClubsMaps',
      ogDescription: 'Entdecke verifizierte Cannabis Social Clubs in Madrid, Barcelona und ganz Spanien.',
      twitterTitle: 'Verzeichnis der Cannabis Social Clubs | SocialClubsMaps',
      twitterDescription: 'Entdecke verifizierte Cannabis Social Clubs in Spanien.',
    },
  };
  const metadata = metadataByLocale[lang] ?? metadataByLocale.en;

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: 'cannabis social clubs directory, CSC Spain, Madrid cannabis clubs, Barcelona cannabis clubs, find cannabis clubs, marijuana clubs Spain',
    openGraph: {
      title: metadata.ogTitle,
      description: metadata.ogDescription,
      type: 'website',
      locale: OG_LOCALE_BY_LANG[lang] || 'es_ES',
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.twitterTitle,
      description: metadata.twitterDescription,
    },
    alternates: {
      canonical: `https://socialclubsmaps.com/${lang}/clubs`,
    },
  };
}

export default function ClubsPage() {
  return <ClubsPageWrapper />;
}
