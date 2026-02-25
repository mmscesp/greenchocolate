import { getFeaturedArticles } from '@/app/actions/articles';
import { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import { AtmosphericCanvas } from '@/components/AtmosphericCanvas';
import EditorialConciergeFlow from '@/components/landing/editorial-concierge/EditorialConciergeFlow';

const OG_LOCALE_BY_LANG: Record<string, string> = {
  es: 'es_ES',
  en: 'en_US',
  fr: 'fr_FR',
  de: 'de_DE',
  it: 'it_IT',
  pl: 'pl_PL',
  ru: 'ru_RU',
  pt: 'pt_PT',
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;

  const titles: Record<string, string> = {
    es: 'Directorio de Clubs Sociales de Cannabis en España | SocialClubsMaps',
    en: 'Cannabis Social Clubs Directory Spain | SocialClubsMaps',
    fr: 'Annuaire des Clubs Sociaux Cannabis en Espagne | SocialClubsMaps',
    de: 'Cannabis Social Clubs Verzeichnis Spanien | SocialClubsMaps',
    it: 'Elenco Club Sociali Cannabis Spagna | SocialClubsMaps',
    pl: 'Katalog Społecznościowych Klubów Konopi v Hiszpanii | SocialClubsMaps',
    ru: 'Каталог Социальных Клубов Конопли в Испании | SocialClubsMaps',
    pt: 'Diretório de Clubes Sociais de Cânhamo em Espanha | SocialClubsMaps',
  };

  const descriptions: Record<string, string> = {
    es: 'Descubre y conecta con los mejores clubs sociales de cannabis en España. Barcelona, Madrid, Valencia y más. Guías expertas sobre cumplimiento legal y seguridad.',
    en: 'Discover and connect with verified cannabis social clubs in Spain. Barcelona, Madrid, Valencia and more. Expert guides on legal compliance and safety.',
    fr: 'Découvrez et connectez-vous aux clubs sociaux de cannabis vérifiés en Espagne. Barcelone, Madrid, Valence et plus. Guides experts sur la conformité légale.',
    de: 'Entdecken und verbinden Sie sich mit verifizierten Cannabis-Social-Clubs in Spanien. Barcelona, Madrid, Valencia and more. Expertenleitfäden zu rechtlicher Compliance.',
    it: 'Scopri e connettiti con club sociali cannabis verificati in Spagna. Barcellona, Madrid, Valencia e altro. Guide esperte sulla conformité legale.',
    pl: 'Odkryj i połącz się z zweryfikowanymi społecznościowymi klubami konopi w Hiszpanii. Barcelona, Walencja i więcej. Przewodniki ekspertów o zgodności prawnej.',
    ru: 'Откройте для себя проверенные социальные клубы конопли в Испании. Барселона, Валенсия и другие. Экспертные руководства по правовому соответствию.',
    pt: 'Descubra e conecte-se com clubes sociais de cannabis verificados na Espanha. Barcelona, Valência e muito más. Guias especializados em conformidade legal.',
  };

  return {
    title: titles[lang] || titles.en,
    description: descriptions[lang] || descriptions.en,
    openGraph: {
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en,
      type: 'website',
      locale: OG_LOCALE_BY_LANG[lang] || 'es_ES',
      url: `https://socialclubsmaps.com/${lang}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en,
    },
    alternates: {
      canonical: `https://socialclubsmaps.com/${lang}`,
    },
  };
}

export default async function HomePage() {
  // Fetch data for the concierge vault
  const featuredArticles = await getFeaturedArticles(6);

  return (
    <div className="relative min-h-screen">
      <HeroSection />
      <AtmosphericCanvas>
        <EditorialConciergeFlow featuredArticles={featuredArticles} />
      </AtmosphericCanvas>
    </div>
  );
}
