import { redirect } from 'next/navigation';

interface LegacyLearnPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function toQueryString(searchParams: Record<string, string | string[] | undefined>) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === 'string') {
      query.set(key, value);
    } else if (Array.isArray(value)) {
      for (const item of value) {
        query.append(key, item);
      }
    }
  }

  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
}

export default async function LegacyLearnPage({ params, searchParams }: LegacyLearnPageProps) {
  const { lang } = await params;
  const resolvedSearchParams = await searchParams;
  const queryString = toQueryString(resolvedSearchParams);

  redirect(`/${lang}/editorial${queryString}`);
}
