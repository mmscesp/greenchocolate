import Link from 'next/link';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';

interface HelpPageProps {
  params: Promise<{ lang: string }>;
}

export default async function HelpPage({ params }: HelpPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string): string => (typeof dictionary[key] === 'string' ? dictionary[key] : key);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-16">
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">{t('help.title')}</h1>
        <p className="text-muted-foreground text-lg mb-8">
          {t('help.subtitle')}
        </p>

        <div className="grid gap-4">
          <Link
            href={`/${lang}/editorial/legal`}
            className="rounded-xl border bg-card p-5 hover:border-primary/50 transition-colors"
          >
            <h2 className="text-lg font-semibold text-foreground mb-1">{t('help.cards.legal.title')}</h2>
            <p className="text-sm text-muted-foreground">{t('help.cards.legal.description')}</p>
          </Link>

          <Link
            href={`/${lang}/safety-kit`}
            className="rounded-xl border bg-card p-5 hover:border-primary/50 transition-colors"
          >
            <h2 className="text-lg font-semibold text-foreground mb-1">{t('help.cards.safety.title')}</h2>
            <p className="text-sm text-muted-foreground">{t('help.cards.safety.description')}</p>
          </Link>

          <Link
            href={`/${lang}/clubs`}
            className="rounded-xl border bg-card p-5 hover:border-primary/50 transition-colors"
          >
            <h2 className="text-lg font-semibold text-foreground mb-1">{t('help.cards.directory.title')}</h2>
            <p className="text-sm text-muted-foreground">{t('help.cards.directory.description')}</p>
          </Link>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          {t('help.footer.prefix')}{' '}
          <Link href={`/${lang}/contact`} className="text-primary hover:underline">
            {t('help.footer.link')}
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
