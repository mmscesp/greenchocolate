import { getClubs } from '@/app/actions/clubs';
import { JsonLd } from '@/components/JsonLd';
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd, buildItemListJsonLd } from '@/lib/seo';
import ClubsPageClient from './ClubsPageClient';

export default async function ClubsPageWrapper({ lang }: { lang: string }) {
  const clubs = await getClubs();
  const neighborhoods = Array.from(new Set(clubs.map((club) => club.neighborhood))).sort((a, b) => a.localeCompare(b));
  const amenities = Array.from(new Set(clubs.flatMap((club) => club.amenities))).sort((a, b) => a.localeCompare(b));
  const vibes = Array.from(new Set(clubs.flatMap((club) => club.vibeTags))).sort((a, b) => a.localeCompare(b));
  const collectionJsonLd = buildCollectionPageJsonLd({
    name: 'Verified Cannabis Social Clubs in Spain',
    description: 'SCM verified public club profiles with safety context and trust signals.',
    path: `/${lang}/clubs`,
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', path: `/${lang}` },
    { name: 'Verified Clubs', path: `/${lang}/clubs` },
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
      />
    </>
  );
}
