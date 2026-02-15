import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityBySlug } from '@/app/actions/cities';
import { getClubs, getNeighborhoods } from '@/app/actions/clubs';
import SafetyStickyAlert from '@/components/city/SafetyStickyAlert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Building2, Shield, ArrowRight } from 'lucide-react';

interface PageProps {
  params: Promise<{ lang: string; city: string }>;
}

export default async function CityPage({ params }: PageProps) {
  const { lang, city } = await params;

  const [cityDetail, cityClubs, neighborhoods] = await Promise.all([
    getCityBySlug(city),
    getClubs({ citySlug: city, isVerified: true }),
    getNeighborhoods(city),
  ]);

  if (!cityDetail) {
    notFound();
  }

  const featuredClubs = cityClubs.slice(0, 3);

  return (
    <>
      <SafetyStickyAlert />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <section className="rounded-2xl border bg-card p-8 md:p-10">
          <Badge variant="outline" className="mb-4">{cityDetail.country}</Badge>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Cannabis Clubs in {cityDetail.name}</h1>
          <p className="text-muted-foreground max-w-3xl mb-6">
            {cityDetail.description || `Verified navigation for ${cityDetail.name}: local etiquette, neighborhoods, and club discovery.`}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Building2 className="h-4 w-4" /> {cityClubs.length} verified clubs</span>
            <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {neighborhoods.length} neighborhoods</span>
            <span className="inline-flex items-center gap-1"><Shield className="h-4 w-4" /> Private-association model</span>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href={`/${lang}/spain/${city}/clubs`} className="rounded-xl border p-5 bg-card hover:border-primary/50 transition-colors">
            <h2 className="font-semibold mb-1">Club Directory</h2>
            <p className="text-sm text-muted-foreground">Browse verified clubs with public safety-first previews.</p>
          </Link>
          <Link href={`/${lang}/spain/${city}/neighborhoods`} className="rounded-xl border p-5 bg-card hover:border-primary/50 transition-colors">
            <h2 className="font-semibold mb-1">Neighborhoods</h2>
            <p className="text-sm text-muted-foreground">Compare local zones by activity and available club coverage.</p>
          </Link>
          <Link href={`/${lang}/spain/${city}/guides`} className="rounded-xl border p-5 bg-card hover:border-primary/50 transition-colors">
            <h2 className="font-semibold mb-1">Guides</h2>
            <p className="text-sm text-muted-foreground">Read city-specific legal, etiquette, and safety content.</p>
          </Link>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Featured Verified Clubs</h2>
            <Button variant="outline" asChild>
              <Link href={`/${lang}/spain/${city}/clubs`}>View all clubs</Link>
            </Button>
          </div>

          <div className="grid gap-4">
            {featuredClubs.length > 0 ? featuredClubs.map((club) => (
              <Link
                key={club.id}
                href={`/${lang}/spain/${city}/clubs/${club.slug}`}
                className="rounded-xl border p-5 bg-card hover:border-primary/50 transition-colors"
              >
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{club.name}</h3>
                  {club.isVerified && <Badge>Verified</Badge>}
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{club.shortDescription || club.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{club.neighborhood} - {club.priceRange}</span>
                  <span className="inline-flex items-center gap-1 text-primary font-medium">Open profile <ArrowRight className="h-4 w-4" /></span>
                </div>
              </Link>
            )) : (
              <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
                No verified clubs found for this city yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
