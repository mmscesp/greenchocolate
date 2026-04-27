import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Club } from '@/lib/types';
import { getClubPrimaryMediaImage, type ClubMediaItem } from '@/lib/club-media';
import { getClubStatusDescription, getClubStatusLabel } from '@/lib/club-verification';
import { Shield, MapPin, AlertTriangle, ClipboardCheck, ArrowRight } from '@/lib/icons';

interface UnverifiedClubProfileContentProps {
  club: Club;
  mediaItems: ClubMediaItem[];
  lang: string;
}

export default function UnverifiedClubProfileContent({
  club,
  mediaItems,
  lang,
}: UnverifiedClubProfileContentProps) {
  const heroImage = getClubPrimaryMediaImage(mediaItems);
  const statusLabel = getClubStatusLabel(club.verificationStatus);
  const statusDescription = getClubStatusDescription(club.verificationStatus);
  const reviewedAt = club.publicDataReviewedAt
    ? new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(club.publicDataReviewedAt)
    : 'Pending editorial review';

  return (
    <main className="min-h-screen bg-bg-base text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={`Editorial illustration for ${club.neighborhood}, Barcelona`}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/65 to-bg-base/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.18),transparent_40%)]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pt-36">
          <div className="max-w-3xl">
            <Badge className="mb-5 border-amber-400/30 bg-amber-400/10 text-amber-100 hover:bg-amber-400/10">
              {statusLabel}
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">{club.name}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-zinc-300">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand" />
                {club.neighborhood}, Barcelona
              </span>
              {club.district ? <span className="text-zinc-500">/ {club.district}</span> : null}
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-amber-100/80">
              {statusDescription}
            </p>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              {club.shortDescription || club.description}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <div className="space-y-6">
          <article className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur md:p-8">
            <div className="mb-4 flex items-center gap-3">
              <ClipboardCheck className="h-5 w-5 text-brand" />
              <h2 className="text-xl font-semibold">What SCM knows</h2>
            </div>
            <p className="leading-7 text-zinc-300">
              SCM has identified this as a public Barcelona club listing from public source data.
              The known public signals include its name, Barcelona neighborhood, and public map reference
              where available. This is not the same as SCM verification.
            </p>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-bg-base/60 p-4">
                <dt className="text-xs uppercase tracking-[0.18em] text-zinc-500">Neighborhood</dt>
                <dd className="mt-2 font-medium text-white">{club.neighborhood}</dd>
              </div>
              <div className="rounded-2xl border border-white/10 bg-bg-base/60 p-4">
                <dt className="text-xs uppercase tracking-[0.18em] text-zinc-500">Public data reviewed</dt>
                <dd className="mt-2 font-medium text-white">{reviewedAt}</dd>
              </div>
            </dl>
          </article>

          <article className="rounded-[2rem] border border-amber-400/20 bg-amber-400/[0.06] p-6 md:p-8">
            <div className="mb-4 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-200" />
              <h2 className="text-xl font-semibold">What SCM has not verified</h2>
            </div>
            <p className="leading-7 text-amber-50/85">
              SCM has not completed an on-site verification review for this listing. We have not
              confirmed its association registry status, house rules, controlled-access posture,
              onboarding process, or current operating conditions.
            </p>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 md:p-8">
            <h2 className="text-xl font-semibold">Safety and legal context</h2>
            <p className="mt-4 leading-7 text-zinc-300">
              Cannabis social clubs in Spain operate in a complex legal environment. Public possession
              or consumption can carry administrative fines, and clubs that behave like public retail
              venues face materially higher scrutiny. Treat any public listing as a starting point for
              research, not as a promise of access or legal certainty.
            </p>
            <p className="mt-4 text-sm leading-6 text-zinc-500">
              SCM provides information, not legal advice. The legal landscape for cannabis social clubs
              in Spain is complex and evolving. Always verify club status independently and consult
              local legal resources if in doubt.
            </p>
          </article>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[2rem] border border-brand/25 bg-brand/10 p-6">
            <Shield className="mb-4 h-7 w-7 text-brand" />
            <h2 className="text-lg font-semibold">Start safely</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Before relying on any listing, read the public safety and legal context first.
            </p>
            <Button asChild className="mt-5 w-full rounded-full">
              <Link href={`/${lang}/safety-kit`}>
                Open Safety Kit
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
            <h2 className="text-lg font-semibold">Trust spine</h2>
            <div className="mt-4 grid gap-2">
              <Button asChild variant="secondary" className="justify-start rounded-full">
                <Link href={`/${lang}/spain/barcelona`}>Barcelona guide</Link>
              </Button>
              <Button asChild variant="secondary" className="justify-start rounded-full">
                <Link href={`/${lang}/editorial/legal`}>Legal guides</Link>
              </Button>
              <Button asChild variant="secondary" className="justify-start rounded-full">
                <Link href={`/${lang}/verification`}>How SCM verifies</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
            <h2 className="text-lg font-semibold">Request a correction</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Operators or readers can request a correction, review, or removal. SCM reviews listing
              issues as a priority.
            </p>
            <Button asChild variant="secondary" className="mt-5 w-full rounded-full">
              <Link href={`/${lang}/contact?category=listing-correction&club=${club.slug}`}>
                Correct this listing
              </Link>
            </Button>
          </div>
        </aside>
      </section>
    </main>
  );
}
