import { getCitiesWithClubs, getPopularCities } from '@/app/actions/cities';
import SpainPageClient from './SpainPageClient';
import { Metadata } from 'next';
import { buildLocalizedMetadata, isLocale } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) {
    return {};
  }

  const titles: Record<string, string> = {
    es: 'Cannabis Social Clubs en España | Barcelona, Madrid, Valencia | SocialClubsMaps',
    en: 'Cannabis Social Clubs in Spain | Barcelona, Madrid, Valencia | SocialClubsMaps',
    fr: 'Clubs Sociaux Cannabis en Espagne | Barcelone, Madrid, Valence | SocialClubsMaps',
    de: 'Cannabis Social Clubs in Spanien | Barcelona, Madrid, Valencia | SocialClubsMaps',
  };

  const descriptions: Record<string, string> = {
    es: 'Explora cannabis social clubs en las principales ciudades de España. Barcelona, Madrid, Valencia, Sevilla, Málaga. Directorio verificado con información actualizada.',
    en: 'Explore cannabis social clubs in major Spanish cities. Barcelona, Madrid, Valencia, Seville, Málaga. Verified directory with up-to-date information.',
    fr: 'Explorez les clubs sociaux cannabis dans les grandes villes espagnoles. Barcelone, Madrid, Valence, Séville, Málaga. Annuaire vérifié avec informations actualisées.',
    de: 'Erkunden Sie Cannabis-Social-Clubs in großen spanischen Städten. Barcelona, Madrid, Valencia, Sevilla, Málaga. Verifiziertes Verzeichnis mit aktuellen Informationen.',
  };

  return buildLocalizedMetadata({
    lang,
    path: '/spain',
    title: titles[lang] || titles.en,
    description: descriptions[lang] || descriptions.en,
    keywords: [
      'cannabis social clubs Spain',
      'Barcelona cannabis clubs',
      'Madrid marijuana clubs',
      'Valencia cannabis',
      'Spain cannabis directory',
      'cannabis tourism Spain',
    ],
  });
}

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function SpainPage({ params }: PageProps) {
  const { lang } = await params;
  const [cities, popularCities] = await Promise.all([
    getCitiesWithClubs(),
    getPopularCities(6),
  ]);

  return (
    <SpainPageClient 
      cities={cities} 
      popularCities={popularCities} 
      lang={lang} 
    />
  );
}
