import Link from 'next/link';
import type { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';
import { buildLocalizedMetadata, isLocale } from '@/lib/seo';

interface TermsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: TermsPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) {
    return {};
  }

  const byLocale: Record<string, { title: string; description: string }> = {
    es: {
      title: 'Términos y Condiciones | SocialClubsMaps',
      description:
        'Lee los términos de uso de SocialClubsMaps, responsabilidades de usuarios y alcance informativo del servicio.',
    },
    en: {
      title: 'Terms and Conditions | SocialClubsMaps',
      description:
        'Read SocialClubsMaps terms of use, user responsibilities, and the informational scope of the platform.',
    },
    fr: {
      title: 'Conditions d Utilisation | SocialClubsMaps',
      description:
        'Consultez les conditions d utilisation de SocialClubsMaps et les responsabilités des utilisateurs.',
    },
    de: {
      title: 'Nutzungsbedingungen | SocialClubsMaps',
      description:
        'Lies die Nutzungsbedingungen von SocialClubsMaps, Nutzerpflichten und den Informationsrahmen des Dienstes.',
    },
  };

  const localized = byLocale[lang] ?? byLocale.en;
  return buildLocalizedMetadata({
    lang,
    path: '/terms',
    title: localized.title,
    description: localized.description,
  });
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string): string => (typeof dictionary[key] === 'string' ? dictionary[key] : key);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-16">
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">{t('legal.terms.title')}</h1>
        <p className="text-muted-foreground text-lg mb-10">
          {t('legal.terms.intro')}
        </p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">{t('legal.terms.educational.title')}</h2>
            <p>
              {t('legal.terms.educational.body')}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">{t('legal.terms.responsibility.title')}</h2>
            <p>
              {t('legal.terms.responsibility.body')}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">{t('legal.terms.no_transactions.title')}</h2>
            <p>
              {t('legal.terms.no_transactions.body')}
            </p>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link href={`/${lang}/privacy`} className="text-primary hover:underline font-medium">
            {t('legal.privacy.title')}
          </Link>
          <Link href={`/${lang}/cookies`} className="text-primary hover:underline font-medium">
            {t('legal.cookies.title')}
          </Link>
        </div>
      </div>
    </div>
  );
}
