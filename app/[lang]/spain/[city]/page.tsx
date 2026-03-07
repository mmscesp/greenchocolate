import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getClubs } from '@/app/actions/clubs';
import { getCityBySlug } from '@/app/actions/cities';
import CityPageClient from './CityPageClient';

const LIVE_CITY_SLUG = 'barcelona';
const CITY_LABELS: Record<string, string> = {
  barcelona: 'Barcelona',
  madrid: 'Madrid',
  valencia: 'Valencia',
  tenerife: 'Tenerife',
  sevilla: 'Seville',
  malaga: 'Malaga',
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string; city: string }> }): Promise<Metadata> {
  const { lang, city } = await params;
  const citySlug = city.toLowerCase();

  const cityNames: Record<string, Record<string, string>> = {
    barcelona: { es: 'Barcelona', en: 'Barcelona', fr: 'Barcelone', de: 'Barcelona', it: 'Barcellona', pl: 'Barcelona', ru: 'Барселона', pt: 'Barcelona' },
    madrid: { es: 'Madrid', en: 'Madrid', fr: 'Madrid', de: 'Madrid', it: 'Madrid', pl: 'Madryt', ru: 'Мадрид', pt: 'Madrid' },
    valencia: { es: 'Valencia', en: 'Valencia', fr: 'Valence', de: 'Valencia', it: 'Valencia', pl: 'Walencja', ru: 'Валенсия', pt: 'Valência' },
    sevilla: { es: 'Sevilla', en: 'Seville', fr: 'Séville', de: 'Sevilla', it: 'Siviglia', pl: 'Sewilla', ru: 'Севилья', pt: 'Sevilha' },
    malaga: { es: 'Málaga', en: 'Málaga', fr: 'Málaga', de: 'Málaga', it: 'Malaga', pl: 'Malaga', ru: 'Малага', pt: 'Málaga' },
  };

  const cityName = cityNames[citySlug]?.[lang] || cityNames[citySlug]?.en || citySlug;

  const titles: Record<string, string> = {
    es: `Cannabis Social Clubs en ${cityName} | Directorio Verificado | SocialClubsMaps`,
    en: `Cannabis Social Clubs in ${cityName} | Verified Directory | SocialClubsMaps`,
    fr: `Clubs Sociaux Cannabis à ${cityName} | Annuaire Vérifié | SocialClubsMaps`,
    de: `Cannabis Social Clubs in ${cityName} | Verifiziertes Verzeichnis | SocialClubsMaps`,
    it: `Club Sociali Cannabis a ${cityName} | Directory Verificato | SocialClubsMaps`,
    pl: `Społecznościowe Kluby Konopi w ${cityName} | Zweryfikowany Katalog | SocialClubsMaps`,
    ru: `Социальные Клубы Конопли в ${cityName} | Проверенный Каталог | SocialClubsMaps`,
    pt: `Clubes Sociais de Cânhamo em ${cityName} | Diretório Verificado | SocialClubsMaps`,
  };

  const descriptions: Record<string, string> = {
    es: `Explora cannabis social clubs en ${cityName}. Directorio verificado con clubes verificados, vecindarios y guías locales. Pre-regístrate para membresía.`,
    en: `Explore cannabis social clubs in ${cityName}. Verified directory with verified clubs, neighborhoods, and local guides. Pre-register for membership.`,
    fr: `Explorez les clubs sociaux cannabis à ${cityName}. Annuaire vérifié avec clubs, quartiers et guides locaux. Pré-inscription au membership.`,
    de: `Erkunden Sie Cannabis-Social-Clubs in ${cityName}. Verifiziertes Verzeichnis mit Clubs, Vierteln und lokalen Leitfäden. Vorregistrierung für Mitgliedschaft.`,
    it: `Esplora club sociali cannabis a ${cityName}. Directory verificato con club, quartieri e guide locali. Pre-registrazione per membership.`,
    pl: `Odkryj społecznościowe kluby konopi w ${cityName}. Zweryfikowany katalog z klubami, dzielnicami i lokalnymi przewodnikami. Przedrejestracja do członkostwa.`,
    ru: `Изучите социальные клубы конопли в ${cityName}. Проверенный каталог с клубами, районами и местными гидами. Предварительная регистрация для членства.`,
    pt: `Explore clubes sociais de cânhamo em ${cityName}. Diretório verificado com clubes, bairros e guias locais. Pré-cadastro para inúmera.`,
  };

  return {
    title: titles[lang] || titles.en,
    description: descriptions[lang] || descriptions.en,
    keywords: [`cannabis social clubs ${cityName}`, `${cityName} cannabis clubs`, 'cannabis Spain', 'marijuana clubs', 'cannabis directory'],
    openGraph: {
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en,
      type: 'website',
      locale: lang === 'es' ? 'es_ES' : lang === 'en' ? 'en_US' : `${lang}_${lang.toUpperCase()}`,
      url: `https://socialclubsmaps.com/${lang}/spain/${citySlug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en,
    },
    alternates: {
      canonical: `https://socialclubsmaps.com/${lang}/spain/${citySlug}`,
    },
  };
}

interface CityPageProps {
  params: Promise<{ lang: string; city: string }>;
}

export default async function CityPage({ params }: CityPageProps) {
  const { lang, city } = await params;
  const citySlug = city.toLowerCase();

  if (citySlug === LIVE_CITY_SLUG) {
    const [cityDetail, clubs] = await Promise.all([
      getCityBySlug(citySlug),
      getClubs({ citySlug, isVerified: true }),
    ]);

    if (!cityDetail) {
      notFound();
    }

    return (
      <CityPageClient
        lang={lang}
        city={citySlug}
        cityName={cityDetail.name}
        country={cityDetail.country}
        description={cityDetail.description}
        clubs={clubs}
      />
    );
  }

  return (
    <CityPageClient
      lang={lang}
      city={citySlug}
      cityName={CITY_LABELS[citySlug] || citySlug}
      country="Spain"
      description={null}
      clubs={[]}
      isComingSoon
    />
  );
}
