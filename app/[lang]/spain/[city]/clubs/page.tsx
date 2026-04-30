import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCityBySlug } from '@/app/actions/cities';
import { getClubs } from '@/app/actions/clubs';
import ClubsPageClient from '@/app/[lang]/clubs/ClubsPageClient';
import { JsonLd } from '@/components/JsonLd';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';
import { sanitizePublicLocationText } from '@/lib/public-club-safety';
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd, buildItemListJsonLd, buildLocalizedMetadata, isLocale } from '@/lib/seo';

interface PageProps {
  params: Promise<{ lang: string; city: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, city } = await params;
  if (!isLocale(lang)) {
    return {};
  }

  const cityDetail = await getCityBySlug(city);
  const cityName = cityDetail?.name || city;
  const dictionary = await getDictionary(lang);
  const t = (key: string): string => (typeof dictionary[key] === 'string' ? dictionary[key] : key);
  const format = (key: string, vars: Record<string, string>) => {
    const template = t(key);
    return Object.entries(vars).reduce(
      (acc, [name, value]) => acc.replaceAll(`{{${name}}}`, value),
      template
    );
  };

  return buildLocalizedMetadata({
    lang,
    path: `/spain/${city}/clubs`,
    title: format('city_clubs.meta_title', { city: cityName }),
    description: format('city_clubs.meta_description', { city: cityName }),
    keywords: [
      `${cityName} cannabis social clubs`,
      `${cityName} club directory`,
      'verified cannabis club profiles',
      'public club listings Spain',
      'SCM verification standard',
    ],
    imagePath: '/images/BarcelonaMapBG.webp',
  });
}

export default async function CityClubsPage({ params }: PageProps) {
  const { lang, city } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string): string => (typeof dictionary[key] === 'string' ? dictionary[key] : key);
  const format = (key: string, vars: Record<string, string>) => {
    const template = t(key);
    return Object.entries(vars).reduce(
      (acc, [name, value]) => acc.replaceAll(`{{${name}}}`, value),
      template
    );
  };

  const [cityDetail, clubs] = await Promise.all([
    getCityBySlug(city),
    getClubs({ citySlug: city }),
  ]);

  if (!cityDetail) {
    notFound();
  }

  const neighborhoods = Array.from(
    new Set(clubs.map((club) => sanitizePublicLocationText(club.neighborhood)).filter((value): value is string => Boolean(value)))
  ).sort((a, b) => a.localeCompare(b));
  const amenities = Array.from(new Set(clubs.flatMap((club) => club.amenities))).sort((a, b) => a.localeCompare(b));
  const vibes = Array.from(new Set(clubs.flatMap((club) => club.vibeTags))).sort((a, b) => a.localeCompare(b));

  const collectionJsonLd = buildCollectionPageJsonLd({
    name: format('city_clubs.title', { city: cityDetail.name }),
    description: format('city_clubs.lead', { city: cityDetail.name }),
    path: `/${lang}/spain/${city}/clubs`,
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', path: `/${lang}` },
    { name: 'Spain', path: `/${lang}/spain` },
    { name: cityDetail.name, path: `/${lang}/spain/${city}` },
    { name: 'Clubs', path: `/${lang}/spain/${city}/clubs` },
  ]);
  const itemListJsonLd = buildItemListJsonLd(
    clubs.map((club) => ({
      name: club.name,
      path: `/${lang}/clubs/${club.slug}`,
      description: club.shortDescription || club.description,
    }))
  );

  return (
    <>
      <JsonLd data={collectionJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={itemListJsonLd} />
      <ClubsPageClient
        initialClubs={clubs}
        neighborhoods={neighborhoods}
        amenities={amenities}
        vibes={vibes}
        cityContext={{
          cityName: cityDetail.name,
          citySlug: city,
          backHref: `/${lang}/spain/${city}`,
          backLabel: format('city_clubs.back_to_city', { city: cityDetail.name }),
          title: format('city_clubs.title', { city: cityDetail.name }),
          subtitle: format('city_clubs.lead', { city: cityDetail.name }),
        }}
      />
    </>
  );
}
