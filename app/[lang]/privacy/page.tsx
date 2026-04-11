import Link from 'next/link';
import type { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';
import { buildLocalizedMetadata, isLocale } from '@/lib/seo';

interface PrivacyPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: PrivacyPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) {
    return {};
  }

  const byLocale: Record<string, { title: string; description: string }> = {
    es: {
      title: 'Política de Privacidad | SocialClubsMaps',
      description:
        'Consulta cómo SocialClubsMaps recopila, procesa y protege datos personales en la plataforma.',
    },
    en: {
      title: 'Privacy Policy | SocialClubsMaps',
      description:
        'Review how SocialClubsMaps collects, processes, and protects personal data across the platform.',
    },
    fr: {
      title: 'Politique de Confidentialité | SocialClubsMaps',
      description:
        'Consultez comment SocialClubsMaps collecte, traite et protège les données personnelles sur la plateforme.',
    },
    de: {
      title: 'Datenschutzerklärung | SocialClubsMaps',
      description:
        'Erfahre, wie SocialClubsMaps personenbezogene Daten auf der Plattform erhebt, verarbeitet und schützt.',
    },
  };

  const localized = byLocale[lang] ?? byLocale.en;
  return buildLocalizedMetadata({
    lang,
    path: '/privacy',
    title: localized.title,
    description: localized.description,
  });
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string): string => (typeof dictionary[key] === 'string' ? dictionary[key] : key);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-16">
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">{t('legal.privacy.title')}</h1>
        <p className="text-muted-foreground text-lg mb-10">
          {t('legal.privacy.intro')}
        </p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">{t('legal.privacy.collect.title')}</h2>
            <p>
              {t('legal.privacy.collect.body')}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">{t('legal.privacy.use.title')}</h2>
            <p>
              {t('legal.privacy.use.body')}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">{t('legal.privacy.controls.title')}</h2>
            <p>
              {t('legal.privacy.controls.body')}
            </p>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link href={`/${lang}/terms`} className="text-primary hover:underline font-medium">
            {t('legal.terms.title')}
          </Link>
          <Link href={`/${lang}/cookies`} className="text-primary hover:underline font-medium">
            {t('legal.cookies.title')}
          </Link>
        </div>
      </div>
    </div>
  );
}
