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
      title: 'Verified Cannabis Social Club Profiles | SocialClubsMaps',
      description:
        'Browse the live verified profile layer SCM publishes today, starting with Barcelona and the trust signals we can stand behind.',
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

export default function ClubsPage() {
  return <ClubsPageWrapper />;
}
