import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityBySlug } from '@/app/actions/cities';
import { getNeighborhoods, getClubs } from '@/app/actions/clubs';

interface PageProps {
  params: Promise<{ lang: string; city: string }>;
}

export default async function NeighborhoodsPage({ params }: PageProps) {
  const { lang, city } = await params;
  const [cityDetail, neighborhoods, clubs] = await Promise.all([
    getCityBySlug(city),
    getNeighborhoods(city),
    getClubs({ citySlug: city, isVerified: true }),
  ]);

  if (!cityDetail) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <section className="rounded-2xl border bg-card p-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{cityDetail.name} Neighborhoods</h1>
        <p className="text-muted-foreground">Browse local zones with verified club coverage and context.</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {neighborhoods.length > 0 ? neighborhoods.map((neighborhood) => {
          const sampleClub = clubs.find((club) => club.neighborhood === neighborhood.name);
          return (
            <Link
              key={neighborhood.name}
              href={`/${lang}/spain/${city}/neighborhoods/${encodeURIComponent(neighborhood.name)}`}
              className="rounded-xl border bg-card p-5 hover:border-primary/50 transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2">{neighborhood.name}</h2>
              <p className="text-sm text-muted-foreground mb-3">{neighborhood.count} verified clubs listed in this area.</p>
              {sampleClub && <p className="text-sm text-muted-foreground">Example vibe: {sampleClub.vibeTags.slice(0, 2).join(', ') || 'varied'}.</p>}
            </Link>
          );
        }) : (
          <div className="col-span-full rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
            No neighborhoods available for this city yet.
          </div>
        )}
      </section>
    </div>
  );
}
