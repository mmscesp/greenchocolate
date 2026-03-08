'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { ClubCard as CityClub } from '@/app/actions/clubs';
import ClubCard from '@/components/ClubCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { MapPin, Building2, Shield, ArrowRight, Star, Clock } from '@/lib/icons';
import { H1, H2, H3, Text, Lead } from '@/components/typography';

interface CityPageClientProps {
  lang: string;
  city: string;
  cityName: string;
  country: string;
  description: string | null;
  clubs: CityClub[];
  isComingSoon?: boolean;
}

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
  const safeDescription =
    description ||
    (isComingSoon
      ? t('city.coming_soon.description_fallback')
          .replace('{{city}}', cityName)
          .replace('{{brand}}', t('brand.name'))
      : t('city.description_fallback').replace('{{city}}', cityName));

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-12 relative">
        <motion.section
          className="rounded-3xl border bg-card shadow-lg shadow-primary/5 p-8 md:p-12 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <Badge variant="secondary" className="border-primary/20 text-primary bg-primary/5">
              {country}
            </Badge>
            {isComingSoon ? (
              <Badge variant="secondary" className="border-brand/20 text-brand bg-brand/5">
                {t('common.coming_soon')}
              </Badge>
            ) : null}
          </div>

          <H1 className="mb-6">
            {t('city.title_prefix')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-primary/80">
              {cityName}
            </span>
          </H1>

          <Lead className="max-w-3xl mb-8">{safeDescription}</Lead>

          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground bg-muted px-4 py-2 rounded-full">
              <Building2 className="h-4 w-4 text-primary" />
              <span className="font-bold text-foreground">{clubs.length}</span>
              <span>{t('city.verified_clubs')}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground bg-muted px-4 py-2 rounded-full">
              <Shield className="h-4 w-4 text-primary" />
              <span>{t('city.private_model')}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground bg-muted px-4 py-2 rounded-full">
              <Clock className="h-4 w-4 text-primary" />
              <span>{isComingSoon ? t('common.coming_soon') : t('city.status.live_now')}</span>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {isComingSoon ? (
            <>
              <div className="rounded-2xl border bg-card p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">{t('city.cards.directory.title')}</h2>
                <Text size="sm" variant="muted">
                  {t('city.coming_soon.cards.directory_description').replace('{{city}}', cityName)}
                </Text>
              </div>

              <div className="rounded-2xl border bg-card p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">{t('city.coming_soon.cards.explore_title')}</h2>
                <Text size="sm" variant="muted" className="mb-6">
                  {t('city.coming_soon.cards.explore_description')}
                </Text>
                <Button asChild className="rounded-xl">
                  <Link href={`/${lang}/spain/barcelona`}>
                    {t('city.coming_soon.cards.explore_button')} <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link
                href={`/${lang}/spain/${city}/clubs`}
                className="group relative rounded-2xl border bg-card p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{t('city.cards.directory.title')}</h2>
                <Text size="sm" variant="muted">{t('city.cards.directory.description')}</Text>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-primary rounded-full group-hover:w-1/4 transition-all duration-300" />
              </Link>

              <Link
                href={`/${lang}/spain/${city}/guides`}
                className="group relative rounded-2xl border bg-card p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{t('city.cards.guides.title')}</h2>
                <Text size="sm" variant="muted">{t('city.cards.guides.description')}</Text>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-primary rounded-full group-hover:w-1/4 transition-all duration-300" />
              </Link>
            </>
          )}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
                <Star className="h-5 w-5 text-brand" />
              </div>
              <H2>{isComingSoon ? `${cityName} roadmap` : t('city.featured.title')}</H2>
            </div>
            {!isComingSoon ? (
              <Button
                variant="secondary"
                asChild
                className="border-border text-foreground hover:bg-muted hover:text-foreground rounded-xl"
              >
                <Link href={`/${lang}/spain/${city}/clubs`}>{t('city.featured.view_all')}</Link>
              </Button>
            ) : null}
          </div>

          {isComingSoon ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <H3 className="mb-3">{t('city.coming_soon.not_published').replace('{{city}}', cityName)}</H3>
              <Text variant="muted" className="max-w-2xl mx-auto">
                {t('city.coming_soon.notice')}
              </Text>
            </div>
          ) : clubs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {clubs.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <Text variant="muted">{t('city.empty')}</Text>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
