import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityBySlug } from '@/app/actions/cities';
import { getClubs } from '@/app/actions/clubs';
import { Button } from '@/components/ui/button';

interface PageProps {
  params: Promise<{ lang: string; city: string; neighborhood: string }>;
}

export default async function NeighborhoodPage({ params }: PageProps) {
  const { lang, city, neighborhood } = await params;
  const [cityDetail, cityClubs] = await Promise.all([
    getCityBySlug(city),
    getClubs({ citySlug: city, isVerified: true }),
  ]);

  if (!cityDetail) {
    notFound();
  }

  const decodedNeighborhood = decodeURIComponent(neighborhood);
  const neighborhoodClubs = cityClubs.filter((club) => club.neighborhood === decodedNeighborhood);

  if (neighborhoodClubs.length === 0) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <section className="rounded-2xl border bg-card p-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{decodedNeighborhood}</h1>
        <p className="text-muted-foreground">Neighborhood guide for {cityDetail.name}. {neighborhoodClubs.length} verified clubs listed.</p>
      </section>

      <section className="grid gap-4">
        {neighborhoodClubs.map((club) => (
          <article key={club.id} className="rounded-xl border bg-card p-5">
            <h2 className="text-xl font-semibold mb-2">{club.name}</h2>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{club.shortDescription || club.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{club.priceRange}</span>
              <Button size="sm" asChild>
                <Link href={`/${lang}/spain/${city}/clubs/${club.slug}`}>Open Public Profile</Link>
              </Button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
