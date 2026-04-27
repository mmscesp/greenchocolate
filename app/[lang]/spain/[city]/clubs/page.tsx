import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCityBySlug } from '@/app/actions/cities';
import { getClubs } from '@/app/actions/clubs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { JsonLd } from '@/components/JsonLd';
import { H1, H3, Text } from '@/components/typography';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';
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
  return buildLocalizedMetadata({
    lang,
    path: `/spain/${city}/clubs`,
    title: `${cityName} Cannabis Social Clubs | Public Profiles | SocialClubsMaps`,
    description: `Browse public cannabis social club profiles in ${cityName}, Spain with neighborhood context, safety guidance, and SCM verification signals.`,
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
  const collectionJsonLd = buildCollectionPageJsonLd({
    name: `${cityDetail.name} Cannabis Social Clubs`,
    description: `Public club profiles in ${cityDetail.name}, Spain with verification status and safety context.`,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <JsonLd data={collectionJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={itemListJsonLd} />
      <section className="rounded-2xl border bg-card p-8">
        <Button asChild variant="secondary" className="mb-6">
          <Link href={`/${lang}/spain/${city}`}>{format('city_clubs.back_to_city', { city: cityDetail.name })}</Link>
        </Button>
        <H1 className="mb-3">{format('city_clubs.title', { city: cityDetail.name })}</H1>
        <Text variant="muted" className="max-w-3xl">
          {t('city_clubs.lead')}
        </Text>
      </section>

      <section className="grid gap-4">
        {clubs.length > 0 ? clubs.map((club) => (
          <article key={club.id} className="rounded-xl border bg-card p-5">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <H3>{club.name}</H3>
              {club.isVerified && <Badge>{t('city_clubs.verified')}</Badge>}
              {!club.isVerified && <Badge variant="secondary">Unverified public listing</Badge>}
              <Badge variant="secondary">{club.priceRange}</Badge>
            </div>

            <Text variant="muted" size="sm" className="mb-3 line-clamp-2">{club.shortDescription || club.description}</Text>

            <div className="flex flex-wrap gap-2 mb-4">
              {club.vibeTags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">{club.neighborhood}</span>
              <Button asChild>
                <Link href={`/${lang}/clubs/${club.slug}`}>{t('city_clubs.view_public_profile')}</Link>
              </Button>
            </div>
          </article>
        )) : (
          <div className="rounded-xl border border-dashed p-6">
            <Text variant="muted">{format('city_clubs.empty', { city: cityDetail.name })}</Text>
          </div>
        )}
      </section>
    </div>
  );
}
