import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getClubs } from '@/app/actions/clubs';
import { getCityBySlug } from '@/app/actions/cities';
import { JsonLd } from '@/components/JsonLd';
import CityPageClient from './CityPageClient';
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildItemListJsonLd,
  buildLocalizedMetadata,
  buildNoIndexMetadata,
  isLocale,
} from '@/lib/seo';

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
  if (!isLocale(lang)) {
    return {};
  }
  const citySlug = city.toLowerCase();

  const cityNames: Record<string, Record<string, string>> = {
    barcelona: { es: 'Barcelona', en: 'Barcelona', fr: 'Barcelone', de: 'Barcelona' },
    madrid: { es: 'Madrid', en: 'Madrid', fr: 'Madrid', de: 'Madrid' },
    valencia: { es: 'Valencia', en: 'Valencia', fr: 'Valence', de: 'Valencia' },
    sevilla: { es: 'Sevilla', en: 'Seville', fr: 'Séville', de: 'Sevilla' },
    malaga: { es: 'Málaga', en: 'Málaga', fr: 'Málaga', de: 'Málaga' },
  };

  const cityName = cityNames[citySlug]?.[lang] || cityNames[citySlug]?.en || citySlug;

  if (citySlug === LIVE_CITY_SLUG) {
    return buildLocalizedMetadata({
      lang,
      path: `/spain/${citySlug}`,
      title: 'Cannabis Social Clubs in Barcelona | SocialClubsMaps Guide',
      description:
        'Understand Barcelona cannabis social clubs through legal context, safety guidance, verified profiles, public listings, and SCM’s independent verification standard.',
      keywords: [
        'cannabis social clubs Barcelona',
        'Barcelona cannabis guide',
        'cannabis social club profiles Barcelona',
        'cannabis social club legal Spain',
      ],
    });
  }

  const titles: Record<string, string> = {
    es: `Cannabis Social Clubs en ${cityName} | Directorio Verificado | SocialClubsMaps`,
    en: `Cannabis Social Clubs in ${cityName} | Club Directory | SocialClubsMaps`,
    fr: `Clubs Sociaux Cannabis à ${cityName} | Annuaire Vérifié | SocialClubsMaps`,
    de: `Cannabis Social Clubs in ${cityName} | Verifiziertes Verzeichnis | SocialClubsMaps`,
  };

  const descriptions: Record<string, string> = {
    es: `Explora cannabis social clubs en ${cityName}. Directorio verificado con clubes verificados, vecindarios y guías locales. Pre-regístrate para membresía.`,
    en: `Explore cannabis social club profiles in ${cityName}. Compare verified profiles and clearly labeled public listings before you make plans.`,
    fr: `Explorez les clubs sociaux cannabis à ${cityName}. Annuaire vérifié avec clubs, quartiers et guides locaux. Pré-inscription au membership.`,
    de: `Erkunden Sie Cannabis-Social-Clubs in ${cityName}. Verifiziertes Verzeichnis mit Clubs, Vierteln und lokalen Leitfäden. Vorregistrierung für Mitgliedschaft.`,
  };

  return {
    ...buildLocalizedMetadata({
    lang,
    path: `/spain/${citySlug}`,
    title: titles[lang] || titles.en,
    description: descriptions[lang] || descriptions.en,
    keywords: [
      `cannabis social clubs ${cityName}`,
      `${cityName} cannabis clubs`,
      'cannabis Spain',
      'marijuana clubs',
      'cannabis directory',
    ],
    }),
    ...buildNoIndexMetadata(),
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
      getClubs({ citySlug }),
    ]);

    if (!cityDetail) {
      notFound();
    }

    const collectionJsonLd = buildCollectionPageJsonLd({
      name: 'Cannabis Social Clubs in Barcelona',
      description:
        'Barcelona cannabis social club guidance with legal context, verified profiles, public listings, Safety Kit paths, and SCM verification standards.',
      path: `/${lang}/spain/barcelona`,
    });
    const breadcrumbJsonLd = buildBreadcrumbJsonLd([
      { name: 'Home', path: `/${lang}` },
      { name: 'Spain', path: `/${lang}/spain` },
      { name: 'Barcelona', path: `/${lang}/spain/barcelona` },
    ]);
    const itemListJsonLd = buildItemListJsonLd([
      ...clubs.slice(0, 8).map((club) => ({
        name: club.name,
        path: `/${lang}/clubs/${club.slug}`,
        description: club.shortDescription || club.description,
      })),
      {
        name: 'Barcelona legal guides',
        path: `/${lang}/editorial/legal`,
        description: 'Legal context for understanding cannabis social clubs in Spain.',
      },
      {
        name: 'SCM Verification Standard',
        path: `/${lang}/verification`,
        description: 'How SCM evaluates public trust signals before listing clubs.',
      },
    ]);

    return (
      <>
        <JsonLd data={collectionJsonLd} />
        <JsonLd data={breadcrumbJsonLd} />
        <JsonLd data={itemListJsonLd} />
        <CityPageClient
          lang={lang}
          city={citySlug}
          cityName={cityDetail.name}
          country={cityDetail.country}
          description={cityDetail.description}
          clubs={clubs}
        />
      </>
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
