import { getDictionary } from '@/lib/dictionary';
import { i18n, type Locale } from '@/lib/i18n-config';
import { LanguageProvider } from '@/hooks/useLanguage';
import { notFound } from 'next/navigation';
import { AuthProvider } from '@/components/auth/AuthProvider';
import MotionProvider from '@/components/MotionProvider';
import RouteTransition from '@/components/motion/RouteTransition';
import ScrollRestoration from '@/components/ScrollRestoration';
import Navbar from '@/components/layout/Navbar';
import ConditionalFooter from '@/components/layout/ConditionalFooter';
import PlatformBackground from '@/components/layout/PlatformBackground';
import LegalDisclaimerModal from '@/components/trust/LegalDisclaimerModal';
import LanguageUpdater from '@/components/LanguageUpdater';

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps) {
  const { lang } = await params;
  if (!i18n.locales.includes(lang as Locale)) {
    notFound();
  }
  const dictionary = await getDictionary(lang as Locale);

  return (
    <LanguageProvider locale={lang as Locale} dictionary={dictionary}>
      <LanguageUpdater />
      <AuthProvider>
        <MotionProvider>
          <ScrollRestoration />
          <div className="min-h-screen flex flex-col">
            <LegalDisclaimerModal />
            <Navbar />
            <PlatformBackground />
            <main className="flex-1">
              <RouteTransition>{children}</RouteTransition>
            </main>
            <ConditionalFooter />
          </div>
        </MotionProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
