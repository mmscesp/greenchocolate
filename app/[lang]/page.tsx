import { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import SmoothScroll from '@/components/SmoothScroll';
import EditorialConciergeShell from '@/components/landing/editorial-concierge/EditorialConciergeShell';
import { buildLocalizedMetadata } from '@/lib/seo';
import { isLocale } from '@/lib/i18n-config';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) {
    return {};
  }

  const titles: Record<string, string> = {
    es: 'Directorio de Clubs Sociales de Cannabis en España | SocialClubsMaps',
    en: 'Cannabis Social Clubs Directory Spain | SocialClubsMaps',
    fr: 'Annuaire des Clubs Sociaux Cannabis en Espagne | SocialClubsMaps',
    de: 'Cannabis Social Clubs Verzeichnis Spanien | SocialClubsMaps',
  };

  const descriptions: Record<string, string> = {
    es: 'Descubre y conecta con los mejores clubs sociales de cannabis en España. Barcelona, Madrid, Valencia y más. Guías expertas sobre cumplimiento legal y seguridad.',
    en: 'Discover and connect with verified cannabis social clubs in Spain. Barcelona, Madrid, Valencia and more. Expert guides on legal compliance and safety.',
    fr: 'Découvrez et connectez-vous aux clubs sociaux de cannabis vérifiés en Espagne. Barcelone, Madrid, Valence et plus. Guides experts sur la conformité légale.',
    de: 'Entdecken und verbinden Sie sich mit verifizierten Cannabis-Social-Clubs in Spanien. Barcelona, Madrid, Valencia and more. Expertenleitfäden zu rechtlicher Compliance.',
  };

  return buildLocalizedMetadata({
    lang,
    path: '',
    title: titles[lang] || titles.en,
    description: descriptions[lang] || descriptions.en,
  });
}

export default async function HomePage() {
  return (
    <SmoothScroll>
      <div className="relative min-h-screen">
        <HeroSection />
        <EditorialConciergeShell />
      </div>
    </SmoothScroll>
  );
}
