import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getClubBySlug } from '@/app/actions/clubs';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PageProps {
  params: Promise<{ lang: string; city: string; slug: string }>;
}

export default async function CityClubDetailPage({ params }: PageProps) {
  const { lang, city, slug } = await params;
  const club = await getClubBySlug(slug);

  if (!club || club.citySlug !== city) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <section className="rounded-2xl border bg-card p-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <h1 className="text-3xl md:text-4xl font-bold">{club.name}</h1>
          {club.isVerified && <Badge>Verified</Badge>}
          <Badge variant="outline">{club.priceRange}</Badge>
        </div>
        <p className="text-muted-foreground mb-4">{club.shortDescription || club.description}</p>
        <div className="flex flex-wrap gap-2">
          {club.vibeTags.slice(0, 5).map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <article className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold mb-2">Public Safety Snapshot</h2>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Neighborhood: {club.neighborhood}</li>
            <li>Capacity: {club.capacity} members</li>
            <li>Founded: {club.foundedYear}</li>
            <li>Public consumption remains illegal in Spain.</li>
          </ul>
        </article>
        <article className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold mb-2">Access Policy</h2>
          {user ? (
            <p className="text-sm text-muted-foreground">
              You are logged in. Continue to the full club profile to request membership and view club-specific contact flow.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Full operational details are gated. Sign in to continue with membership-intent workflows.
            </p>
          )}
        </article>
      </section>

      <section className="rounded-xl border bg-muted/30 p-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold">Continue</h3>
          <p className="text-sm text-muted-foreground">Keep navigation safe and compliant with private-association rules.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/${lang}/spain/${city}/clubs`}>Back to City Clubs</Link>
          </Button>
          <Button asChild>
            <Link href={user ? `/${lang}/clubs/${club.slug}` : `/${lang}/account/login?redirect=/${lang}/clubs/${club.slug}`}>
              {user ? 'Open Full Profile' : 'Login to Continue'}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
