import React from 'react';
import { Metadata } from 'next';
import { H1, Lead } from '@/components/typography';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string) => dictionary[key] || key;

  const title = t('about.meta.title');
  const description = t('about.meta.description');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: lang === 'es' ? 'es_ES' : lang === 'en' ? 'en_US' : `${lang}_${lang.toUpperCase()}`,
      url: `https://socialclubsmaps.com/${lang}/about`,
    },
    alternates: {
      canonical: `https://socialclubsmaps.com/${lang}/about`,
    },
  };
}

interface AboutPageProps {
  params: Promise<{ lang: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string) => dictionary[key] || key;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-12">
      <H1 className="mb-4">{t('about.title')}</H1>
      <Lead>{t('about.lead')}</Lead>
    </div>
  );
}
