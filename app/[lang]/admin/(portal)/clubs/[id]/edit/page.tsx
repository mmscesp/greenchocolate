import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AdminClubEditorForm } from '@/components/admin/AdminClubEditorForm';
import { Button } from '@/components/ui/button';
import {
  getAdminClubById,
  getAdminClubEditorOptions,
  getAdminClubFormValues,
  updateAdminClub,
} from '@/app/actions/admin-clubs';
import { ArrowLeft } from '@/lib/icons';

interface AdminClubEditPageProps {
  params: Promise<{ lang: string; id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getString(value: string | string[] | undefined, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

export default async function AdminClubEditPage({
  params,
  searchParams,
}: AdminClubEditPageProps) {
  const { lang, id } = await params;
  const query = await searchParams;

  const [club, values, options] = await Promise.all([
    getAdminClubById(id),
    getAdminClubFormValues(id),
    getAdminClubEditorOptions(),
  ]);

  if (!club || !values) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Admin clubs
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Edit {club.name}
          </h1>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="secondary">
            <Link href={`/${lang}/admin/clubs/${club.id}`}>
              <ArrowLeft className="h-4 w-4" />
              Open detail view
            </Link>
          </Button>
        </div>
      </div>

      <AdminClubEditorForm
        action={updateAdminClub}
        adminCandidates={options.adminCandidates}
        cities={options.cities}
        lang={lang}
        meta={{
          id: club.id,
          slug: club.slug,
          citySlug: club.city.slug,
          updatedAt: club.updatedAt.toISOString(),
          metrics: {
            admins: club.admins.length,
            requests: club._count.membershipRequests,
            events: club._count.events,
            reviews: club._count.reviews,
          },
        }}
        mode="edit"
        message={getString(query.message)}
        status={getString(query.status)}
        values={values}
      />
    </div>
  );
}
