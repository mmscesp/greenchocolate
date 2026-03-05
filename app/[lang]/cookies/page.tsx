import Link from 'next/link';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';

interface CookiesPageProps {
  params: Promise<{ lang: string }>;
}

export default async function CookiesPage({ params }: CookiesPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string): string => (typeof dictionary[key] === 'string' ? dictionary[key] : key);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-16">
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">{t('legal.cookies.title')}</h1>
        <p className="text-muted-foreground text-lg mb-10">
          {t('legal.cookies.intro')}
        </p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">{t('legal.cookies.essential.title')}</h2>
            <p>
              {t('legal.cookies.essential.body')}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">{t('legal.cookies.analytics.title')}</h2>
            <p>
              {t('legal.cookies.analytics.body')}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">{t('legal.cookies.preferences.title')}</h2>
            <p>
              {t('legal.cookies.preferences.body')}
            </p>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link href={`/${lang}/terms`} className="text-primary hover:underline font-medium">
            {t('legal.terms.title')}
          </Link>
          <Link href={`/${lang}/privacy`} className="text-primary hover:underline font-medium">
            {t('legal.privacy.title')}
          </Link>
        </div>
      </div>
    </div>
  );
}
