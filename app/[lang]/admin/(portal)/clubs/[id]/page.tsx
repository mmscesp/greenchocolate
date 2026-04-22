import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AdminActionNotice } from '@/components/admin/AdminActionNotice';
import { ArrowLeft, Building2, Users, Calendar, ClipboardList } from '@/lib/icons';
import { getAdminClubById, updateClubFlags } from '@/app/actions/admin-clubs';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';

interface ClubDetailPageProps {
  params: Promise<{ lang: string; id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getString(value: string | string[] | undefined, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

export default async function AdminClubDetailPage({ params, searchParams }: ClubDetailPageProps) {
  const { lang, id } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string): string => (typeof dictionary[key] === 'string' ? dictionary[key] : key);
  const query = await searchParams;
  const status = getString(query.status);
  const message = getString(query.message);
  const club = await getAdminClubById(id);

  if (!club) {
    notFound();
  }

  type AdminRow = (typeof club.admins)[number];
  type MembershipRequestRow = (typeof club.membershipRequests)[number];
  type EventRow = (typeof club.events)[number];

  return (
    <div className="space-y-6">
      <AdminActionNotice status={status} message={message} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('admin.clubs.details.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('admin.clubs.details.subtitle')}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="w-full sm:w-auto">
            <Link href={`/${lang}/admin/clubs/${club.id}/edit`}>Edit club</Link>
          </Button>
          <Link href={`/${lang}/admin/clubs`}>
            <Button variant="secondary" className="w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('admin.clubs.details.back_to_clubs')}
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{club.name}</CardTitle>
          <CardDescription>/{club.slug} · {club.city.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Badge variant={club.isVerified ? 'default' : 'secondary'}>
              {club.isVerified ? t('admin.common.verified') : t('admin.clubs.pending_verification')}
            </Badge>
            <Badge variant={club.isActive ? 'default' : 'destructive'}>
              {club.isActive ? t('admin.common.active') : t('admin.common.inactive')}
            </Badge>
            <Badge variant="secondary">{t('admin.clubs.founded')} {club.foundedYear}</Badge>
            <Badge variant="secondary">{t('admin.clubs.capacity')} {club.capacity}</Badge>
          </div>

          <p className="text-sm text-muted-foreground">{club.description}</p>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-border p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contact</p>
              <p className="mt-1 text-sm font-medium">{club.contactEmail}</p>
            </div>
            <div className="rounded-xl border border-border p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Route</p>
              <p className="mt-1 text-sm font-medium">/{club.slug}</p>
            </div>
            <div className="rounded-xl border border-border p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Requests</p>
              <p className="mt-1 text-sm font-medium">{club._count.membershipRequests}</p>
            </div>
            <div className="rounded-xl border border-border p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Reviews / favorites</p>
              <p className="mt-1 text-sm font-medium">{club._count.reviews} / {club._count.favorites}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild variant="secondary">
              <Link href={`/${lang}/clubs/${club.slug}`}>Open public profile</Link>
            </Button>
            <form action={updateClubFlags}>
              <input type="hidden" name="clubId" value={club.id} />
              <input type="hidden" name="isVerified" value={String(!club.isVerified)} />
              <input type="hidden" name="returnPath" value={`/${lang}/admin/clubs/${club.id}`} />
              <Button type="submit" variant="secondary">
                {club.isVerified ? t('admin.clubs.unverify_club') : t('admin.clubs.verify_club')}
              </Button>
            </form>

            <form action={updateClubFlags}>
              <input type="hidden" name="clubId" value={club.id} />
              <input type="hidden" name="isActive" value={String(!club.isActive)} />
              <input type="hidden" name="returnPath" value={`/${lang}/admin/clubs/${club.id}`} />
              <Button type="submit" variant="secondary">
                {club.isActive ? t('admin.clubs.deactivate_club') : t('admin.clubs.activate_club')}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              {t('admin.clubs.assigned_admins')} ({club.admins.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {club.admins.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('admin.clubs.no_assigned_admins')}</p>
            ) : (
              club.admins.map((admin: AdminRow) => (
                <div key={admin.id} className="border rounded-md p-2 text-sm">
                  <div className="font-medium">{admin.displayName || t('admin.clubs.unnamed_admin')}</div>
                  <div className="text-muted-foreground">{admin.email}</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardList className="h-4 w-4" />
              {t('admin.clubs.membership_requests')} ({club._count.membershipRequests})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {club.membershipRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('admin.clubs.no_recent_requests')}</p>
            ) : (
              club.membershipRequests.map((request: MembershipRequestRow) => (
                <div key={request.id} className="border rounded-md p-2 text-sm">
                  <div className="font-medium">{request.user.displayName || request.user.email}</div>
                  <div className="text-muted-foreground">{request.status}</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4" />
              {t('admin.clubs.events')} ({club._count.events})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {club.events.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('admin.clubs.no_events')}</p>
            ) : (
              club.events.map((event: EventRow) => (
                <div key={event.id} className="border rounded-md p-2 text-sm">
                  <div className="font-medium">{event.name}</div>
                  <div className="text-muted-foreground">
                    {new Date(event.startDate).toLocaleDateString()} · {event.isPublished ? t('admin.common.published') : t('admin.common.draft')}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
