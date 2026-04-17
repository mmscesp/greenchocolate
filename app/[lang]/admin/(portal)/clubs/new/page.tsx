import Link from 'next/link';
import { AdminClubEditorForm } from '@/components/admin/AdminClubEditorForm';
import { Button } from '@/components/ui/button';
import {
  createAdminClub,
  createEmptyAdminClubFormValues,
  getAdminClubEditorOptions,
} from '@/app/actions/admin-clubs';
import { ArrowLeft } from '@/lib/icons';

interface AdminClubCreatePageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getString(value: string | string[] | undefined, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

export default async function AdminClubCreatePage({
  params,
  searchParams,
}: AdminClubCreatePageProps) {
  const { lang } = await params;
  const query = await searchParams;
  const { cities, adminCandidates } = await getAdminClubEditorOptions();
  const values = await createEmptyAdminClubFormValues(cities[0]?.id ?? '');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Admin clubs
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Create a new club
          </h1>
        </div>
        <Button asChild variant="secondary">
          <Link href={`/${lang}/admin/clubs`}>
            <ArrowLeft className="h-4 w-4" />
            Back to clubs
          </Link>
        </Button>
      </div>

      <AdminClubEditorForm
        action={createAdminClub}
        adminCandidates={adminCandidates}
        cities={cities}
        lang={lang}
        mode="create"
        message={getString(query.message)}
        status={getString(query.status)}
        values={values}
      />
    </div>
  );
}
