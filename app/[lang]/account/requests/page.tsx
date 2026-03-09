import { redirect } from 'next/navigation';

interface RequestsPageProps {
  params: Promise<{ lang: string }>;
}

export default async function RequestsPage({ params }: RequestsPageProps) {
  const { lang } = await params;

  redirect(`/${lang}/profile/requests`);
}
