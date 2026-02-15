import React from 'react';
import Link from 'next/link';
import { getCitiesWithClubs, getPopularCities } from '@/app/actions/cities';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Building2, ArrowRight } from 'lucide-react';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function SpainPage({ params }: PageProps) {
  const { lang } = await params;
  const [cities, popularCities] = await Promise.all([
    getCitiesWithClubs(),
    getPopularCities(6),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <section className="rounded-2xl border bg-card p-8 md:p-10">
        <Badge variant="outline" className="mb-4">Country Hub</Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Cannabis Social Clubs in Spain</h1>
        <p className="text-muted-foreground max-w-3xl">
          Explore city-by-city guidance, neighborhood context, and verified club listings. Public pages stay educational; sensitive operational details remain gated.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Popular Cities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularCities.length > 0 ? popularCities.map((city) => (
            <Link
              key={city.id}
              href={`/${lang}/spain/${city.slug}`}
              className="rounded-xl border p-5 bg-card hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <MapPin className="h-4 w-4" /> {city.region || city.country}
              </div>
              <h3 className="text-lg font-semibold mb-2">{city.name}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{city.description || 'City-level trust and etiquette guidance.'}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Building2 className="h-4 w-4" /> {city.clubCount} clubs
                </span>
                <span className="inline-flex items-center gap-1 text-primary font-medium">Open <ArrowRight className="h-4 w-4" /></span>
              </div>
            </Link>
          )) : (
            <div className="col-span-full rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
              No cities are available yet. Publish city records to activate this hub.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border p-6 bg-muted/30">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Need broad comparison first?</h3>
            <p className="text-sm text-muted-foreground">Use the full directory to compare verified clubs across cities.</p>
          </div>
          <Button asChild>
            <Link href={`/${lang}/clubs`}>Open Full Directory</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
