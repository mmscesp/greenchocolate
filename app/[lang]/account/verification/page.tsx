import React from 'react';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';

interface VerificationPageProps {
  params: Promise<{ lang: string }>;
}

export default async function VerificationPage({ params }: VerificationPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string) => dictionary[key] || key;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-10">
      <h1 className="text-4xl font-bold mb-4">{t('account.verification.title')}</h1>
      <p className="text-lg text-muted-foreground">{t('account.verification.subtitle')}</p>
    </div>
  );
}
