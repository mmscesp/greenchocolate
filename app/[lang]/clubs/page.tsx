import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { buildNoIndexFollowMetadata } from '@/lib/seo';
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

  return {
    title: 'Barcelona Club Directory | SocialClubsMaps',
    description: 'Redirecting to the canonical Barcelona cannabis social club directory.',
    ...buildNoIndexFollowMetadata(),
  };
}

export default async function ClubsPage({ params }: ClubsPageProps) {
  const { lang } = await params;
  redirect(`/${lang}/spain/barcelona/clubs`);
}
