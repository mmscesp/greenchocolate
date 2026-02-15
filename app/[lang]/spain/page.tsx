import { getCitiesWithClubs, getPopularCities } from '@/app/actions/cities';
import SpainPageClient from './SpainPageClient';
import { Metadata } from 'next';

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

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;

  const titles: Record<string, string> = {
    es: 'Cannabis Social Clubs en España | Barcelona, Madrid, Valencia | SocialClubsMaps',
    en: 'Cannabis Social Clubs in Spain | Barcelona, Madrid, Valencia | SocialClubsMaps',
    fr: 'Clubs Sociaux Cannabis en Espagne | Barcelone, Madrid, Valence | SocialClubsMaps',
    de: 'Cannabis Social Clubs in Spanien | Barcelona, Madrid, Valencia | SocialClubsMaps',
    it: 'Club Sociali Cannabis in Spagna | Barcellona, Madrid, Valencia | SocialClubsMaps',
    pl: 'Społecznościowe Kluby Konopi w Hiszpanii | Barcelona, Madryt, Walencja | SocialClubsMaps',
    ru: 'Социальные Клубы Конопли в Испании | Барселона, Мадрид, Валенсия | SocialClubsMaps',
    pt: 'Clubes Sociais de Cânhamo em Espanha | Barcelona, Madrid, Valência | SocialClubsMaps',
  };

  const descriptions: Record<string, string> = {
    es: 'Explora cannabis social clubs en las principales ciudades de España. Barcelona, Madrid, Valencia, Sevilla, Málaga. Directorio verificado con información actualizada.',
    en: 'Explore cannabis social clubs in major Spanish cities. Barcelona, Madrid, Valencia, Seville, Málaga. Verified directory with up-to-date information.',
    fr: 'Explorez les clubs sociaux cannabis dans les grandes villes espagnoles. Barcelone, Madrid, Valence, Séville, Málaga. Annuaire vérifié avec informations actualisées.',
    de: 'Erkunden Sie Cannabis-Social-Clubs in großen spanischen Städten. Barcelona, Madrid, Valencia, Sevilla, Málaga. Verifiziertes Verzeichnis mit aktuellen Informationen.',
    it: 'Esplora club sociali cannabis nelle principali città spagnole. Barcellona, Madrid, Valencia, Siviglia, Malaga. Directory verificato con informazioni aggiornate.',
    pl: 'Odkryj społecznościowe kluby konopi w głównych miastach Hiszpanii. Barcelona, Madryt, Walencja, Sewilla, Malaga. Zweryfikowany katalog z aktualnymi informacjami.',
    ru: 'Изучите социальные клубы конопли в крупных городах Испании. Барселона, Мадрид, Валенсия, Севилья, Малага. Проверенный каталог с актуальной информацией.',
    pt: 'Explore clubes sociais de cânhamo nas principais cidades espanholas. Barcelona, Madrid, Valência, Sevilha, Málaga. Diretório verificado com informações atualizadas.',
  };

  return {
    title: titles[lang] || titles.en,
    description: descriptions[lang] || descriptions.en,
    keywords: ['cannabis social clubs Spain', 'Barcelona cannabis clubs', 'Madrid marijuana clubs', 'Valencia cannabis', 'Spain cannabis directory', 'cannabis tourism Spain'],
    openGraph: {
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en,
      type: 'website',
      locale: OG_LOCALE_BY_LANG[lang] || 'es_ES',
      url: `https://socialclubsmaps.com/${lang}/spain`,
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en,
    },
    alternates: {
      canonical: `https://socialclubsmaps.com/${lang}/spain`,
    },
  };
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
