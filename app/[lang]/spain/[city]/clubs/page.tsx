import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityBySlug } from '@/app/actions/cities';
import { getClubs } from '@/app/actions/clubs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { H1, H3, Text } from '@/components/typography';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';

interface PageProps {
  params: Promise<{ lang: string; city: string }>;
}

export default async function CityClubsPage({ params }: PageProps) {
  const { lang, city } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string) => dictionary[key] || key;
  const format = (key: string, vars: Record<string, string>) => {
    const template = t(key);
    return Object.entries(vars).reduce(
      (acc, [name, value]) => acc.replaceAll(`{{${name}}}`, value),
      template
    );
  };

  const [cityDetail, clubs] = await Promise.all([
    getCityBySlug(city),
    getClubs({ citySlug: city, isVerified: true }),
  ]);

  if (!cityDetail) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <section className="rounded-2xl border bg-card p-8">
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
              <Badge variant="outline">{club.priceRange}</Badge>
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
                <Link href={`/${lang}/spain/${city}/clubs/${club.slug}`}>{t('city_clubs.view_public_profile')}</Link>
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
