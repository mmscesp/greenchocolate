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
    <div className="relative min-h-screen overflow-hidden bg-bg-base px-4 pt-24 pb-16 sm:px-6 md:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,205,200,0.13),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent_42%)]" />
      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-10rem)] w-full max-w-7xl items-center justify-center">
      <Suspense fallback={<div>{t('common.loading')}</div>}>
        <LoginForm />
      </Suspense>
      </div>
    </div>
  );
}
