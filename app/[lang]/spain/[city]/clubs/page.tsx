import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityBySlug } from '@/app/actions/cities';
import { getClubs } from '@/app/actions/clubs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heading, H1, H2, H3, H4, Label, Eyebrow, Text, Lead } from '@/components/typography';

interface PageProps {
  params: Promise<{ lang: string; city: string }>;
}

export default async function CityClubsPage({ params }: PageProps) {
  const { lang, city } = await params;

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
        <H1 className="mb-3">{cityDetail.name} Club Directory</H1>
        <Text variant="muted" className="max-w-3xl">
          Public profiles show trust, safety, and context. Sensitive operational details remain available only after login and club-side acceptance.
        </Text>
      </section>

      <section className="grid gap-4">
        {clubs.length > 0 ? clubs.map((club) => (
          <article key={club.id} className="rounded-xl border bg-card p-5">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <H3>{club.name}</H3>
              {club.isVerified && <Badge>Verified</Badge>}
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
                <Link href={`/${lang}/spain/${city}/clubs/${club.slug}`}>View Public Profile</Link>
              </Button>
            </div>
          </article>
        )) : (
          <div className="rounded-xl border border-dashed p-6">
            <Text variant="muted">No verified clubs are currently listed for {cityDetail.name}.</Text>
          </div>
        )}
      </section>
    </div>
  );
}
