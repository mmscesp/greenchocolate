import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getClubBySlug } from '@/app/actions/clubs';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';

interface PageProps {
  params: Promise<{ lang: string; city: string; slug: string }>;
}

export default async function CityClubDetailPage({ params }: PageProps) {
  const { lang, city, slug } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string) => dictionary[key] || key;
  const format = (key: string, vars: Record<string, string>) => {
    const template = t(key);
    return Object.entries(vars).reduce(
      (acc, [name, value]) => acc.replaceAll(`{{${name}}}`, value),
      template
    );
  };
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
          {club.isVerified && <Badge>{t('city_club_detail.verified')}</Badge>}
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
          <h2 className="font-semibold mb-2">{t('city_club_detail.safety_title')}</h2>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>{format('city_club_detail.neighborhood', { neighborhood: club.neighborhood })}</li>
            <li>{format('city_club_detail.capacity', { capacity: String(club.capacity) })}</li>
            <li>{format('city_club_detail.founded', { year: String(club.foundedYear) })}</li>
            <li>{t('city_club_detail.public_consumption_warning')}</li>
          </ul>
        </article>
        <article className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold mb-2">{t('city_club_detail.access_policy_title')}</h2>
          {user ? (
            <p className="text-sm text-muted-foreground">
              {t('city_club_detail.access_logged_in')}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t('city_club_detail.access_logged_out')}
            </p>
          )}
        </article>
      </section>

      <section className="rounded-xl border bg-muted/30 p-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold">{t('city_club_detail.continue_title')}</h3>
          <p className="text-sm text-muted-foreground">{t('city_club_detail.continue_description')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/${lang}/spain/${city}/clubs`}>{t('city_club_detail.back_to_city_clubs')}</Link>
          </Button>
          <Button asChild>
            <Link href={user ? `/${lang}/clubs/${club.slug}` : `/${lang}/account/login?redirect=/${lang}/clubs/${club.slug}`}>
              {user ? t('city_club_detail.open_full_profile') : t('city_club_detail.login_to_continue')}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
