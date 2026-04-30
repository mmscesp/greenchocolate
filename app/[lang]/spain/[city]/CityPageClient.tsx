'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import type { ClubCard as CityClub } from '@/app/actions/clubs';
import ClubCard from '@/components/ClubCard';
import { LogoIcon } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { EditorialHeading } from '@/components/landing/editorial-concierge/typography/EditorialHeading';
import { ConciergeLabel } from '@/components/landing/editorial-concierge/typography/ConciergeLabel';
import { useLanguage } from '@/hooks/useLanguage';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  FileSearch,
  Map,
  MapPin,
  Shield,
  Star,
} from '@/lib/icons';
import { H2, H3, Text } from '@/components/typography';
import { isVerifiedClubStatus } from '@/lib/club-verification';

interface CityPageClientProps {
  lang: string;
  city: string;
  cityName: string;
  country: string;
  description: string | null;
  clubs: CityClub[];
  isComingSoon?: boolean;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const heroStats = [
  { icon: Building2, labelKey: 'city.barcelona.hero.stats.public_profiles', valueKey: null },
  { icon: Shield, labelKey: 'city.barcelona.hero.stats.private_model', valueKey: 'city.barcelona.hero.stats.private_value' },
  { icon: Clock, labelKey: 'city.barcelona.hero.stats.live_now', valueKey: 'city.barcelona.hero.stats.live_value' },
];

const guideSteps = [
  {
    number: '01',
    icon: Shield,
    titleKey: 'city.barcelona.steps.start.title',
    bodyKey: 'city.barcelona.steps.start.body',
  },
  {
    number: '02',
    icon: Map,
    titleKey: 'city.barcelona.steps.reality.title',
    bodyKey: 'city.barcelona.steps.reality.body',
  },
  {
    number: '03',
    icon: FileSearch,
    titleKey: 'city.barcelona.steps.status.title',
    bodyKey: 'city.barcelona.steps.status.body',
  },
  {
    number: '04',
    icon: CheckCircle2,
    titleKey: 'city.barcelona.steps.verify.title',
    bodyKey: 'city.barcelona.steps.verify.body',
  },
];

const editorialGuides = [
  {
    href: '/editorial/barcelona-club-reality-what-most-people-get-wrong',
    labelKey: 'city.barcelona.reading.reality.label',
    titleKey: 'city.barcelona.reading.reality.title',
    image: '/images/editorial/barcelona-vs-amsterdam.webp',
  },
  {
    href: '/editorial/barcelona-club-red-flags',
    labelKey: 'city.barcelona.reading.red_flags.label',
    titleKey: 'city.barcelona.reading.red_flags.title',
    image: '/images/editorial/scam-alert.webp',
  },
  {
    href: '/editorial/barcelona-membership-rules-2026',
    labelKey: 'city.barcelona.reading.membership.label',
    titleKey: 'city.barcelona.reading.membership.title',
    image: '/images/editorial/barcelo-gothic-quarter.webp',
  },
  {
    href: '/editorial/why-barcelona-clubs-are-under-pressure-2026',
    labelKey: 'city.barcelona.reading.pressure.label',
    titleKey: 'city.barcelona.reading.pressure.title',
    image: '/images/editorial/barcelona-plaza-espana.webp',
  },
];

export default function CityPageClient({
  lang,
  city,
  cityName,
  country,
  description,
  clubs,
  isComingSoon = false,
}: CityPageClientProps) {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const safeDescription =
    description ||
    (isComingSoon
      ? t('city.coming_soon.description_fallback')
          .replace('{{city}}', cityName)
          .replace('{{brand}}', t('brand.name'))
      : t('city.description_fallback').replace('{{city}}', cityName));
  const verifiedClubs = clubs.filter((club) => club.isVerified || isVerifiedClubStatus(club.verificationStatus));
  const publicListings = clubs.filter((club) => !club.isVerified && !isVerifiedClubStatus(club.verificationStatus));
  const publicPreview = publicListings.slice(0, 6);
  const motionProps = shouldReduceMotion
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 } }
    : { initial: 'hidden', whileInView: 'visible', variants: fadeUp };

  if (!isComingSoon && city === 'barcelona') {
    return (
      <main className="min-h-screen overflow-hidden bg-bg-base text-white">
        <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden border-b border-white/10 pt-24 md:pt-28">
          <div className="absolute inset-0">
            <Image
              src="/images/BarcelonaMapBG.webp"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-88 saturate-125 contrast-110"
              style={{ objectPosition: 'center center' }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_32%,rgba(0,203,204,0.28),transparent_30%),linear-gradient(90deg,hsl(var(--bg-base))_0%,rgba(2,10,14,0.84)_36%,rgba(2,10,14,0.42)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,10,14,0.04)_0%,rgba(2,10,14,0.28)_52%,hsl(var(--bg-base))_100%)]" />
          </div>

          <div className="relative mx-auto flex min-h-[calc(100svh-7rem)] max-w-7xl items-center px-4 pb-14 sm:px-6 lg:px-8">
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 28 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-[46rem]"
            >
              <div className="mb-6 flex items-center gap-3 text-brand">
                <MapPin className="h-4 w-4" />
                <ConciergeLabel className="text-brand">{t('city.barcelona.hero.eyebrow')}</ConciergeLabel>
              </div>

              <h1 className="font-serif text-[clamp(3.35rem,7vw,7.1rem)] font-black leading-[0.92] tracking-normal text-white">
                <span className="block">Cannabis</span>
                <span className="block">Clubs in</span>
                <span className="block text-brand">Barcelona</span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-7 text-white/68 md:text-lg">
                {t('city.barcelona.hero.body')}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full bg-brand px-7 text-sm font-black uppercase tracking-[0.14em] text-bg-base hover:bg-brand-dark">
                  <Link href={`/${lang}/safety-kit`}>
                    {t('city.barcelona.hero.cta_safety')} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="rounded-full border-white/15 bg-white/5 px-7 text-sm font-bold text-white hover:border-brand/50 hover:bg-white/10"
                >
                  <Link href={`/${lang}/spain/${city}/clubs`}>{t('city.barcelona.hero.cta_profiles')}</Link>
                </Button>
              </div>

              <div className="mt-10 grid gap-5 border-t border-white/10 pt-7 sm:grid-cols-3">
                {heroStats.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.labelKey} className="flex items-start gap-3 border-white/10 sm:border-r sm:pr-5 last:border-r-0">
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                      <div>
                        <div className="font-serif text-3xl font-bold leading-none text-white">
                          {index === 0 ? clubs.length : item.valueKey ? t(item.valueKey) : ''}
                        </div>
                        <p className="mt-1 text-xs leading-5 text-white/52">{t(item.labelKey)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-bg-surface/30">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-20">
            <motion.div {...motionProps} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.6 }}>
              <div className="mb-8 flex items-center gap-4">
                <span className="h-px w-10 bg-brand" />
                <EditorialHeading as="h2" size="lg" className="max-w-3xl text-white">
                  {t('city.barcelona.steps.title')}
                </EditorialHeading>
              </div>
              <div className="grid gap-px overflow-hidden border-y border-white/10 bg-white/10 md:grid-cols-2">
                {guideSteps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.number} className="group relative min-h-[13rem] bg-bg-base/95 p-6 transition duration-300 hover:bg-bg-surface/70">
                      <div className="mb-6 flex items-center justify-between">
                        <ConciergeLabel className="text-brand">{step.number}</ConciergeLabel>
                        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-brand/25 bg-brand/5 text-brand transition group-hover:border-brand/50 group-hover:bg-brand/10">
                          <Icon className="h-6 w-6" />
                        </span>
                      </div>
                      <h3 className="max-w-[11rem] font-serif text-2xl font-bold leading-tight text-white">{t(step.titleKey)}</h3>
                      <p className="mt-4 max-w-[18rem] text-sm leading-6 text-white/58">{t(step.bodyKey)}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              {...motionProps}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative min-h-[26rem] overflow-hidden border border-brand/30 bg-bg-base"
            >
              <Image
                src="/images/editorial/barcelona-gaudi-house.webp"
                alt=""
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover opacity-42"
              />
              <div className="absolute inset-0 bg-bg-base/45" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/72 to-bg-base/40" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(2,10,14,0.1),rgba(2,10,14,0.72)_72%)]" />
              <div className="relative flex h-full min-h-[26rem] flex-col items-center justify-center p-8 text-center">
                <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-full border border-brand/35 bg-bg-base/45 shadow-[0_0_34px_rgba(0,203,204,0.22)] backdrop-blur-md">
                  <LogoIcon size="xl" className="h-12 w-12" />
                </div>
                <EditorialHeading as="h2" size="lg" className="max-w-md text-white">
                  {t('city.barcelona.safety.title')}
                </EditorialHeading>
                <p className="mt-5 max-w-sm text-sm leading-6 text-white/62">
                  {t('city.barcelona.safety.body')}
                </p>
                <Button asChild size="lg" className="mt-8 rounded-xl bg-brand px-8 text-bg-base hover:bg-brand-dark">
                  <Link href={`/${lang}/safety-kit`}>
                    {t('city.barcelona.safety.cta')} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <p className="mt-5 text-xs font-semibold text-white/45">{t('city.barcelona.safety.note')}</p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <motion.div {...motionProps} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.6 }} className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <ConciergeLabel className="mb-4 block text-brand">{t('city.barcelona.profiles.eyebrow')}</ConciergeLabel>
              <EditorialHeading as="h2" size="lg" className="text-white">
                {t('city.barcelona.profiles.title')}
              </EditorialHeading>
              <p className="mt-5 text-base leading-7 text-white/58">
                {t('city.barcelona.profiles.body')}
              </p>
            </div>
            <Button
              asChild
              variant="secondary"
              className="rounded-full border-white/15 bg-white/5 text-white hover:border-brand/50 hover:bg-white/10"
            >
              <Link href={`/${lang}/spain/${city}/clubs`}>{t('city.barcelona.profiles.cta')}</Link>
            </Button>
          </motion.div>

          {verifiedClubs.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {verifiedClubs.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-white/15 p-8 text-center">
              <Text variant="muted">{t('city.empty')}</Text>
            </div>
          )}
        </section>

        {publicPreview.length > 0 ? (
          <section className="border-y border-white/10 bg-bg-surface/25">
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
              <div className="mb-10 max-w-3xl">
                <ConciergeLabel className="mb-4 block text-amber-200/80">{t('city.barcelona.public.eyebrow')}</ConciergeLabel>
                <EditorialHeading as="h2" size="lg" className="text-white">
                  {t('city.barcelona.public.title')}
                </EditorialHeading>
                <p className="mt-5 text-base leading-7 text-white/58">
                  {t('city.barcelona.public.body')}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {publicPreview.map((club) => (
                  <ClubCard key={club.id} club={club} />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mb-12 max-w-3xl">
            <ConciergeLabel className="mb-4 block text-brand">{t('city.barcelona.reading.eyebrow')}</ConciergeLabel>
            <EditorialHeading as="h2" size="lg" className="text-white">
              {t('city.barcelona.reading.title')}
            </EditorialHeading>
            <p className="mt-5 text-base leading-7 text-white/58">
              {t('city.barcelona.reading.body')}
            </p>
          </div>
          <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2">
            {editorialGuides.map((guide, index) => (
              <Link key={guide.href} href={`/${lang}${guide.href}`} className="group relative min-h-[18rem] overflow-hidden bg-bg-base p-7">
                <Image
                  src={guide.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover opacity-20 transition duration-700 group-hover:scale-105 group-hover:opacity-32"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/75 to-bg-base/25" />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <ConciergeLabel className="text-brand">{String(index + 1).padStart(2, '0')}</ConciergeLabel>
                    <ArrowRight className="h-5 w-5 text-white/45 transition group-hover:translate-x-1 group-hover:text-brand" />
                  </div>
                  <div>
                    <ConciergeLabel className="mb-3 block text-white/45">{t(guide.labelKey)}</ConciergeLabel>
                    <h3 className="max-w-md font-serif text-2xl font-bold leading-tight text-white">{t(guide.titleKey)}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 bg-bg-surface/30">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 text-sm leading-6 text-white/52 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <p className="max-w-3xl">
              {t('city.barcelona.disclaimer')}
            </p>
            <Link href={`/${lang}/verification`} className="inline-flex shrink-0 items-center gap-2 font-bold uppercase tracking-[0.14em] text-brand">
              {t('city.barcelona.verification_link')} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 h-[500px] w-full bg-gradient-to-b from-primary/5 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 md:pt-32 lg:px-8">
        <motion.section
          className="mb-12 rounded-3xl border bg-card p-8 shadow-lg shadow-primary/5 md:p-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold text-primary">
              {country}
            </span>
            {isComingSoon ? (
              <span className="rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-xs font-bold text-brand">
                {t('common.coming_soon')}
              </span>
            ) : null}
          </div>

          <H2 className="mb-6">
            {t('city.title_prefix')} <span className="text-primary">{cityName}</span>
          </H2>

          <Text variant="muted" className="mb-8 max-w-3xl text-lg leading-8">
            {safeDescription}
          </Text>
        </motion.section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-foreground">{t('city.cards.directory.title')}</h2>
            <Text size="sm" variant="muted">
              {t('city.coming_soon.cards.directory_description').replace('{{city}}', cityName)}
            </Text>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <H3 className="mb-2">{t('city.coming_soon.cards.explore_title')}</H3>
            <Text size="sm" variant="muted" className="mb-6">
              {t('city.coming_soon.cards.explore_description')}
            </Text>
            <Button asChild className="rounded-xl">
              <Link href={`/${lang}/spain/barcelona`}>
                {t('city.coming_soon.cards.explore_button')} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
