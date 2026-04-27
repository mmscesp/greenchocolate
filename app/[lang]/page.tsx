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
    es: 'Guía Verificada de Cannabis Social Clubs en España | SocialClubsMaps',
    en: 'SocialClubsMaps | Verified Cannabis Social Club Guide for Spain',
    fr: 'Guide Vérifié des Cannabis Social Clubs en Espagne | SocialClubsMaps',
    de: 'Verifizierter Leitfaden für Cannabis Social Clubs in Spanien | SocialClubsMaps',
  };

  const descriptions: Record<string, string> = {
    es: 'Empieza por Barcelona con guías verificadas sobre la realidad legal, la seguridad, la etiqueta y cómo funcionan de verdad los cannabis social clubs en España.',
    en: 'Independent, legally grounded guidance for cannabis social clubs in Spain. Start with Barcelona, safety basics, verified club signals, and SCM’s verification standard.',
    fr: 'Commencez par Barcelone avec des guides vérifiés sur la réalité juridique, la sécurité, l etiquette et le fonctionnement réel des cannabis social clubs en Espagne.',
    de: 'Starte mit Barcelona anhand verifizierter Leitfäden zu Rechtslage, Sicherheit, Etikette und dazu, wie Cannabis Social Clubs in Spanien tatsächlich funktionieren.',
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
