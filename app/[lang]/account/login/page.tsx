import { Suspense } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';

interface LoginPageProps {
  params: Promise<{ lang: string }>;
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string): string => {
    const resolvedValue = key
      .split('.')
      .reduce<unknown>((current, segment) => {
        if (!current || typeof current !== 'object' || !(segment in current)) {
          return undefined;
        }

        return (current as Record<string, unknown>)[segment];
      }, dictionary);

    return typeof resolvedValue === 'string' ? resolvedValue : key;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-16 flex flex-col items-center justify-center min-h-[60vh]">
      <Suspense fallback={<div>{t('common.loading')}</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
