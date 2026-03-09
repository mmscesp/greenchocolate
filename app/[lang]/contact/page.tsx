import Link from 'next/link';
import { Mail } from '@/lib/icons';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';

interface ContactPageProps {
  params: Promise<{ lang: string }>;
}

const operatorSupportCopy = {
  en: {
    title: 'Club operators',
    description:
      'Club onboarding, application operations, and operator support are currently handled directly by SocialClubsMaps. Reach out here and we will route the request.',
  },
  es: {
    title: 'Operadores de clubs',
    description:
      'El onboarding de clubs, la gestion de solicitudes y el soporte operativo se coordinan directamente con SocialClubsMaps por ahora. Escribenos y lo canalizamos.',
  },
  fr: {
    title: 'Operateurs de club',
    description:
      'L onboarding club, les operations de demandes et le support operateur sont actuellement geres directement par SocialClubsMaps. Ecrivez-nous et nous orienterons la demande.',
  },
  de: {
    title: 'Club-Betreiber',
    description:
      'Club-Onboarding, Antragsprozesse und Betreiber-Support werden derzeit direkt durch SocialClubsMaps koordiniert. Schreib uns, und wir leiten dein Anliegen passend weiter.',
  },
} as const;

export default async function ContactPage({ params }: ContactPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const operatorSupport =
    operatorSupportCopy[lang as keyof typeof operatorSupportCopy] ?? operatorSupportCopy.en;
  const t = (key: string): string => (typeof dictionary[key] === 'string' ? dictionary[key] : key);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-16">
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">{t('contact.title')}</h1>
        <p className="text-muted-foreground text-lg mb-8">
          {t('contact.lead')}
        </p>

        <div className="rounded-2xl border bg-card p-6 md:p-8 space-y-4">
          <div className="inline-flex items-center gap-2 text-primary font-semibold">
            <Mail className="h-4 w-4" />
            {t('contact.email')}
          </div>
          <p className="text-sm text-muted-foreground">
            {t('contact.urgent_note')}
          </p>
          <a
            href={`mailto:${t('contact.email')}`}
            className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {t('contact.email_cta')}
          </a>
        </div>

        <div className="mt-6 rounded-2xl border bg-card p-6 md:p-8 space-y-3">
          <h2 className="text-lg font-semibold text-foreground">{operatorSupport.title}</h2>
          <p className="text-sm text-muted-foreground">{operatorSupport.description}</p>
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          {t('contact.guides_prefix')}{' '}
          <Link href={`/${lang}/editorial`} className="text-primary hover:underline">
            {t('contact.guides_link')}
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
