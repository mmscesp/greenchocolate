import Link from 'next/link';
import type { Metadata } from 'next';
import { EditorialFAQ } from '@/components/landing/editorial-concierge/blocks/EditorialFAQ';
import { FeaturedVault } from '@/components/landing/editorial-concierge/blocks/FeaturedVault';
import { ContactInquiryForm } from '@/components/contact/ContactInquiryForm';
import { contactInquiryCategoryOptions } from '@/lib/contact-inquiries';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';
import { buildLocalizedMetadata, isLocale } from '@/lib/seo';

interface ContactPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) {
    return {};
  }

  const byLocale: Record<string, { title: string; description: string }> = {
    es: {
      title: 'Contacto | SocialClubsMaps',
      description:
        'Contacta con el equipo de SocialClubsMaps para soporte, correcciones de listados y consultas editoriales.',
    },
    en: {
      title: 'Contact | SocialClubsMaps',
      description:
        'Contact the SocialClubsMaps team for support, listing corrections, and editorial questions.',
    },
    fr: {
      title: 'Contact | SocialClubsMaps',
      description:
        'Contactez l équipe SocialClubsMaps pour le support, les corrections de fiches et les questions éditoriales.',
    },
    de: {
      title: 'Kontakt | SocialClubsMaps',
      description:
        'Kontaktiere das SocialClubsMaps-Team für Support, Korrekturen von Einträgen und redaktionelle Fragen.',
    },
  };

  const localized = byLocale[lang] ?? byLocale.en;
  return buildLocalizedMetadata({
    lang,
    path: '/contact',
    title: localized.title,
    description: localized.description,
  });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string): string => (typeof dictionary[key] === 'string' ? dictionary[key] : key);
  const supportEmail = t('contact.email');

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.10),transparent_32%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--muted)/0.35))]">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 lg:px-8 md:pt-32">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Founder operations</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            {t('contact.title')}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            {t('contact.lead')}
          </p>
        </div>

        <div className="mt-10">
          <ContactInquiryForm
            lang={lang}
            supportEmail={supportEmail}
            categoryOptions={contactInquiryCategoryOptions}
          />
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-border/70 bg-card/95 p-6 md:p-8">
          <h2 className="text-lg font-semibold text-foreground">{t('contact.operator_support.title')}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{t('contact.operator_support.description')}</p>
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          {t('contact.guides_prefix')}{' '}
          <Link href={`/${lang}/editorial`} className="text-primary hover:underline">
            {t('contact.guides_link')}
          </Link>
          .
        </div>
      </div>

      <FeaturedVault />
      <EditorialFAQ />
    </div>
  );
}
