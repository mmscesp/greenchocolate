import React from 'react';
import Link from 'next/link';
import { Shield, Info, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SafetyStickyAlert from '@/components/city/SafetyStickyAlert';
import NeighborhoodNavigation from '@/components/city/NeighborhoodNavigation';

interface PageProps {
  params: Promise<{ lang: string; city: string }>;
}

// Mock Data - In real app, fetch from DB
const CITY_DATA: Record<string, {
    name: string;
    description: string;
    heroImage: string;
    neighborhoods: Array<{ name: string; slug: string; vibe: string }>;
}> = {
  barcelona: {
    name: 'Barcelona',
    description: 'The epicenter of cannabis social club culture in Europe. Home to over 200 private associations, ranging from high-end lounges to neighborhood hangouts.',
    heroImage: '/images/barcelona-city.jpg',
    neighborhoods: [
      { name: 'Eixample', slug: 'eixample', vibe: 'Upscale & Spacious' },
      { name: 'Gràcia', slug: 'gracia', vibe: 'Bohemian & Local' },
      { name: 'Gothic Quarter', slug: 'gothic', vibe: 'Historic & Busy' },
      { name: 'Poblenou', slug: 'poblenou', vibe: 'Modern & Beachy' },
    ]
  },
  madrid: {
    name: 'Madrid',
    description: 'A more discreet but thriving scene. Clubs here are often more focused on privacy and local community than tourism.',
    heroImage: '/images/madrid-city.jpg',
    neighborhoods: [
      { name: 'Malasaña', slug: 'malasana', vibe: 'Hipster & Nightlife' },
      { name: 'Salamanca', slug: 'salamanca', vibe: 'Luxury & Exclusive' },
      { name: 'Lavapiés', slug: 'lavapies', vibe: 'Diverse & Cultural' },
    ]
  }
};

export default async function CityPage({ params }: PageProps) {
  const { lang, city } = await params;
  const cityData = CITY_DATA[city.toLowerCase()];

  if (!cityData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-4xl font-bold">City Not Found</h1>
        <p className="mt-4 text-muted-foreground">We are currently expanding to this location.</p>
        <Button className="mt-8" asChild><Link href={`/${lang}`}>Go Home</Link></Button>
      </div>
    );
  }

  return (
    <>
      <SafetyStickyAlert />
      
      {/* City Hero */}
      <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden bg-black">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-20" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 h-full flex flex-col justify-end pb-12 md:pb-20">
          <div className="flex items-center gap-2 text-white/80 text-sm font-medium mb-4 uppercase tracking-wider">
            <MapPin className="h-4 w-4" />
            Spain / {cityData.name}
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Cannabis Clubs in {cityData.name}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed">
            {cityData.description}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* SEO Text Block */}
            <section className="prose dark:prose-invert max-w-none">
              <h2>How {cityData.name}'s System Works</h2>
              <p>
                Unlike Amsterdam's coffee shops, {cityData.name}'s cannabis clubs are private, non-profit associations. 
                To enter, you must become a member. This involves a registration process, verifying your identity, 
                and often paying an annual membership fee (usually around €20).
              </p>
              <div className="my-8 p-6 bg-primary/5 border border-primary/20 rounded-xl not-prose">
                <h3 className="flex items-center gap-2 font-semibold text-primary mb-2 text-lg">
                  <Shield className="h-5 w-5" />
                  The Golden Rule
                </h3>
                <p className="text-muted-foreground">
                  Do not treat these clubs like shops. You are joining a community. Be respectful, 
                  follow the house rules (no photos!), and keep your consumption private.
                </p>
              </div>
              <p>
                Most clubs in {cityData.name} require you to be 18+ or 21+. You strictly cannot bring guests who are not members. 
                Always carry your ID and membership card.
              </p>
            </section>

            {/* Neighborhood Navigator */}
            <NeighborhoodNavigation citySlug={city} neighborhoods={cityData.neighborhoods} />

            {/* Club Directory Teaser */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Featured Clubs</h2>
                <Button variant="outline" asChild>
                  <Link href={`/${lang}/spain/${city}/clubs`}>View All Clubs</Link>
                </Button>
              </div>
              <div className="grid gap-6">
                {/* Mock Club Cards */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border bg-card rounded-xl p-6 flex flex-col md:flex-row gap-6 hover:border-primary/50 transition-colors shadow-sm">
                    <div className="w-full md:w-48 h-32 bg-muted rounded-lg shrink-0 animate-pulse" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold">Club {i}</h3>
                          <p className="text-sm text-muted-foreground">Eixample • Chill Vibe • Workspace</p>
                        </div>
                        <span className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
                          Verified
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        A high-end social lounge perfect for digital nomads. Features ergonomic seating, fiber optic wifi, and a curated menu of organic strains.
                      </p>
                      <Button size="sm" asChild>
                        <Link href={`/${lang}/spain/${city}/clubs/club-${i}`}>View Profile</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Quick Facts */}
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Quick Facts
              </h3>
              <ul className="space-y-4 text-sm">
                <li className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Public Consumption</span>
                  <span className="font-medium text-red-500">Illegal</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Club Type</span>
                  <span className="font-medium">Private Association</span>
                </li>
                 <li className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Avg. Membership</span>
                  <span className="font-medium">€20 / year</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">ID Required</span>
                  <span className="font-medium">Passport / DNI</span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-primary">Get the Safety Kit</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Don't get fined. Download our free guide to staying safe in {cityData.name}.
              </p>
              <Button className="w-full font-bold" size="lg">Download Now</Button>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
