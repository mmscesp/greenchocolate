import { getDictionary } from '@/lib/dictionary';
import { i18n, type Locale } from '@/lib/i18n-config';
import { LanguageProvider } from '@/hooks/useLanguage';
import { AuthProvider } from '@/components/auth/AuthProvider';
import SmoothScroll from '@/components/SmoothScroll';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/Footer';
import LegalDisclaimerModal from '@/components/trust/LegalDisclaimerModal';

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
  const dictionary = await getDictionary(lang as Locale);

  return (
    <LanguageProvider locale={lang as Locale} dictionary={dictionary}>
      <AuthProvider>
        <SmoothScroll>
          <div className="min-h-screen flex flex-col">
            <LegalDisclaimerModal />
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </SmoothScroll>
      </AuthProvider>
    </LanguageProvider>
  );
}
