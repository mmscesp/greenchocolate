import { getClubs } from '@/app/actions/clubs';
import { JsonLd } from '@/components/JsonLd';
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd, buildItemListJsonLd } from '@/lib/seo';
import { sanitizePublicLocationText } from '@/lib/public-club-safety';
import ClubsPageClient from './ClubsPageClient';

export default async function ClubsPageWrapper({ lang }: { lang: string }) {
  const clubs = await getClubs();
  const neighborhoods = Array.from(
    new Set(clubs.map((club) => sanitizePublicLocationText(club.neighborhood)).filter((value): value is string => Boolean(value)))
  ).sort((a, b) => a.localeCompare(b));
  const amenities = Array.from(new Set(clubs.flatMap((club) => club.amenities))).sort((a, b) => a.localeCompare(b));
  const vibes = Array.from(new Set(clubs.flatMap((club) => club.vibeTags))).sort((a, b) => a.localeCompare(b));
  const collectionJsonLd = buildCollectionPageJsonLd({
    name: 'Club Directory',
    description: 'Compare verified profiles and clearly labeled public listings before you make plans.',
    path: `/${lang}/spain/barcelona/clubs`,
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', path: `/${lang}` },
    { name: 'Barcelona Club Directory', path: `/${lang}/spain/barcelona/clubs` },
  ]);
  const itemListJsonLd = buildItemListJsonLd(
    clubs.slice(0, 12).map((club) => ({
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
        cityCenter={{ lat: 41.3851, lng: 2.1734 }}
      />
    </>
  );
}
