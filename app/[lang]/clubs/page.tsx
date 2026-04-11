import ClubsPageWrapper from './ClubsPageWrapper';
import { Metadata } from 'next';
import { buildLocalizedMetadata } from '@/lib/seo';
import { isLocale } from '@/lib/i18n-config';

// ISR: Revalidate every hour
export const revalidate = 3600;

interface ClubsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: ClubsPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) {
    return {};
  }
  const metadataByLocale: Record<string, { title: string; description: string }> = {
    es: {
      title: 'Directorio de Cannabis Social Clubs | Encuentra CSC en Espana | SocialClubsMaps',
      description:
        'Explora cannabis social clubs verificados en Madrid, Barcelona y toda Espana. Filtra por barrio, servicios y ambiente.',
    },
    en: {
      title: 'Cannabis Social Clubs Directory | Find CSCs in Spain | SocialClubsMaps',
      description:
        'Browse verified cannabis social clubs in Madrid, Barcelona, and across Spain. Filter by neighborhood, amenities, and vibe.',
    },
    fr: {
      title: 'Annuaire des Cannabis Social Clubs | Trouver des CSC en Espagne | SocialClubsMaps',
      description:
        'Parcourez des cannabis social clubs verifies a Madrid, Barcelone et dans toute l Espagne. Filtrez par quartier, services et ambiance.',
    },
    de: {
      title: 'Verzeichnis der Cannabis Social Clubs | CSCs in Spanien finden | SocialClubsMaps',
      description:
        'Entdecke verifizierte Cannabis Social Clubs in Madrid, Barcelona und ganz Spanien. Filtere nach Viertel, Ausstattung und Stimmung.',
    },
  };
  const metadata = metadataByLocale[lang] ?? metadataByLocale.en;

  return buildLocalizedMetadata({
    lang,
    path: '/clubs',
    title: metadata.title,
    description: metadata.description,
    keywords: [
      'cannabis social clubs directory',
      'CSC Spain',
      'Madrid cannabis clubs',
      'Barcelona cannabis clubs',
      'find cannabis clubs',
      'marijuana clubs Spain',
    ],
  });
}

export default function ClubsPage() {
  return <ClubsPageWrapper />;
}
