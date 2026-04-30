import { Metadata } from 'next';
import { redirect } from 'next/navigation';
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
      title: 'Club Directory | SocialClubsMaps',
      description:
        'Compare verified profiles and clearly labeled public listings before you make plans. Educational only; no cannabis sales, transaction brokering, or guaranteed club acceptance.',
    },
    en: {
      title: 'Club Directory | SocialClubsMaps',
      description:
        'Compare verified profiles and clearly labeled public listings before you make plans. Educational only; no cannabis sales, transaction brokering, or guaranteed club acceptance.',
    },
    fr: {
      title: 'Club Directory | SocialClubsMaps',
      description:
        'Compare verified profiles and clearly labeled public listings before you make plans. Educational only; no cannabis sales, transaction brokering, or guaranteed club acceptance.',
    },
    de: {
      title: 'Club Directory | SocialClubsMaps',
      description:
        'Compare verified profiles and clearly labeled public listings before you make plans. Educational only; no cannabis sales, transaction brokering, or guaranteed club acceptance.',
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
      'cannabis social club profiles',
      'public club listings Spain',
    ],
  });
}

export default async function ClubsPage({ params }: ClubsPageProps) {
  const { lang } = await params;
  redirect(`/${lang}/spain/barcelona/clubs`);
}
