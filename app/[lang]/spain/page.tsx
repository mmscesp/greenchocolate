import { getCitiesWithClubs, getPopularCities } from '@/app/actions/cities';
import SpainPageClient from './SpainPageClient';
import { Metadata } from 'next';
import { buildLocalizedMetadata, isLocale } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) {
    return {};
  }

  const titles: Record<string, string> = {
    es: 'Cannabis Social Clubs en España: guía legal y de seguridad | SocialClubsMaps',
    en: 'Cannabis Social Clubs in Spain: Legal and Safety Guide | SocialClubsMaps',
    fr: 'Cannabis Social Clubs en Espagne : guide légal et sécurité | SocialClubsMaps',
    de: 'Cannabis Social Clubs in Spanien: Rechts- und Sicherheitsguide | SocialClubsMaps',
  };

  const descriptions: Record<string, string> = {
    es: 'Entiende cómo funcionan los cannabis social clubs en España antes de hacer planes. Barcelona es la ciudad activa de SCM, con guías legales, Safety Kit y perfiles verificados.',
    en: 'Understand how cannabis social clubs in Spain work before you make plans. Barcelona is SCM’s active city layer, with legal guides, Safety Kit, and verified profile signals.',
    fr: 'Comprenez le fonctionnement des cannabis social clubs en Espagne avant de faire des plans. Barcelone est la couche ville active de SCM, avec guides légaux, Safety Kit et signaux de profils vérifiés.',
    de: 'Verstehe, wie Cannabis Social Clubs in Spanien funktionieren, bevor du Pläne machst. Barcelona ist SCMs aktive Stadtebene mit Rechtsguides, Safety Kit und verifizierten Profilsignalen.',
  };

  return buildLocalizedMetadata({
    lang,
    path: '/spain',
    title: titles[lang] || titles.en,
    description: descriptions[lang] || descriptions.en,
    keywords: [
      'cannabis social clubs Spain',
      'Barcelona cannabis clubs',
      'Spain cannabis social club legal guide',
      'private association model Spain',
      'SCM verification standard',
      'visitor safety guide Spain',
    ],
  });
}

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function SpainPage({ params }: PageProps) {
  const { lang } = await params;
  const [cities, popularCities] = await Promise.all([
    getCitiesWithClubs(),
    getPopularCities(6),
  ]);

  return (
    <SpainPageClient 
      cities={cities} 
      popularCities={popularCities} 
      lang={lang} 
    />
  );
}
