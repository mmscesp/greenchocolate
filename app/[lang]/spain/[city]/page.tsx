import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getClubs } from '@/app/actions/clubs';
import { getCityBySlug } from '@/app/actions/cities';
import { JsonLd } from '@/components/JsonLd';
import CityPageClient from './CityPageClient';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildItemListJsonLd,
  buildLocalizedMetadata,
  buildNoIndexFollowMetadata,
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

function translate(dictionary: Record<string, unknown>, key: string): string {
  const value = dictionary[key];
  return typeof value === 'string' ? value : key;
}

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
    const dictionary = await getDictionary(lang);
    const t = (key: string) => translate(dictionary, key);

    return buildLocalizedMetadata({
      lang,
      path: `/spain/${citySlug}`,
      title: t('city.barcelona.meta.title'),
      description: t('city.barcelona.meta.description'),
      imagePath: '/images/BarcelonaMapBG.webp',
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
    ...buildNoIndexFollowMetadata(),
  };
}

interface CityPageProps {
  params: Promise<{ lang: string; city: string }>;
}

export default async function CityPage({ params }: CityPageProps) {
  const { lang, city } = await params;
  const citySlug = city.toLowerCase();
  const locale = isLocale(lang) ? lang : 'en';

  if (citySlug === LIVE_CITY_SLUG) {
    const [cityDetail, clubs, dictionary] = await Promise.all([
      getCityBySlug(citySlug),
      getClubs({ citySlug }),
      getDictionary(locale as Locale),
    ]);
    const t = (key: string) => translate(dictionary, key);

    if (!cityDetail) {
      notFound();
    }

    const collectionJsonLd = buildCollectionPageJsonLd({
      name: t('city.barcelona.jsonld.collection.name'),
      description: t('city.barcelona.jsonld.collection.description'),
      path: `/${lang}/spain/barcelona`,
    });
    const breadcrumbJsonLd = buildBreadcrumbJsonLd([
      { name: t('city.barcelona.jsonld.breadcrumb.home'), path: `/${lang}` },
      { name: t('city.barcelona.jsonld.breadcrumb.spain'), path: `/${lang}/spain` },
      { name: 'Barcelona', path: `/${lang}/spain/barcelona` },
    ]);
    const itemListJsonLd = buildItemListJsonLd([
      ...clubs.slice(0, 8).map((club) => ({
        name: club.name,
        path: `/${lang}/clubs/${club.slug}`,
        description: club.shortDescription || club.description,
      })),
      {
        name: t('city.barcelona.jsonld.guides.name'),
        path: `/${lang}/editorial/legal`,
        description: t('city.barcelona.jsonld.guides.description'),
      },
      {
        name: 'SCM Verification Standard',
        path: `/${lang}/verification`,
        description: t('city.barcelona.jsonld.verification.description'),
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
