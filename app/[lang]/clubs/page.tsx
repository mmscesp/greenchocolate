import ClubsPageWrapper from './ClubsPageWrapper';
import { Metadata } from 'next';
import { buildLocalizedMetadata } from '@/lib/seo';
import { isLocale } from '@/lib/i18n-config';

// ISR: Revalidate every hour
export const revalidate = 3600;

interface ClubsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: ClubsPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) {
    return {};
  }
  const metadataByLocale: Record<string, { title: string; description: string }> = {
    es: {
      title: 'Perfiles Verificados de Cannabis Social Clubs | SocialClubsMaps',
      description:
        'Explora la capa pública verificada que SCM publica hoy, empezando por Barcelona y por los detalles de acceso que podemos respaldar.',
    },
    en: {
      title: 'Verified Cannabis Social Clubs in Spain | SocialClubsMaps',
      description:
        'Browse SCM’s verified public club profile layer, starting with Barcelona. Learn trust signals, safety context, and what to check before relying on a club.',
    },
    fr: {
      title: 'Profils Vérifiés de Cannabis Social Clubs | SocialClubsMaps',
      description:
        'Parcourez la couche publique vérifiée que SCM publie aujourd hui, en commençant par Barcelone et par les signaux de confiance que nous pouvons défendre.',
    },
    de: {
      title: 'Verifizierte Cannabis Social Club Profile | SocialClubsMaps',
      description:
        'Sieh dir die verifizierte öffentliche Profilebene an, die SCM heute veröffentlicht, beginnend mit Barcelona und den Vertrauenssignalen, die wir belegen können.',
    },
  };
  const metadata = metadataByLocale[lang] ?? metadataByLocale.en;

  return buildLocalizedMetadata({
    lang,
    path: '/clubs',
    title: metadata.title,
    description: metadata.description,
    keywords: [
      'cannabis social clubs directory',
      'CSC Spain',
      'Madrid cannabis clubs',
      'Barcelona cannabis clubs',
      'find cannabis clubs',
      'marijuana clubs Spain',
    ],
  });
}

export default async function ClubsPage({ params }: ClubsPageProps) {
  const { lang } = await params;
  return <ClubsPageWrapper lang={lang} />;
}
