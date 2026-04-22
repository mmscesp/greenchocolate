import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AdminActionNotice } from '@/components/admin/AdminActionNotice';
import { ArrowLeft, Mail, Star, ClipboardList, Heart, Shield, CalendarDays } from '@/lib/icons';
import { getAdminUserById, updateUserRole, updateUserVerification } from '@/app/actions/admin-users';
import { replayAdminCommunicationOutboxItem } from '@/app/actions/admin-communications';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';
import { getAdminSessionProfile } from '@/lib/security/admin-guard';

interface UserDetailPageProps {
  params: Promise<{ lang: string; id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getString(value: string | string[] | undefined, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

export default async function AdminUserDetailPage({ params, searchParams }: UserDetailPageProps) {
  const { lang, id } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string): string => (typeof dictionary[key] === 'string' ? dictionary[key] : key);
  const query = await searchParams;
  const status = getString(query.status);
  const message = getString(query.message);
  const [user, admin] = await Promise.all([
    getAdminUserById(id),
    getAdminSessionProfile(),
  ]);

  if (!user) {
    notFound();
  }
  const isCurrentAdmin = user.id === admin?.id;

  type MembershipRequestRow = (typeof user.membershipRequests)[number];
  type ReviewRow = (typeof user.reviews)[number];
  type FavoriteRow = (typeof user.favorites)[number];
  type BookingRow = (typeof user.bookings)[number];
  type CommunicationRow = (typeof user.communicationEvents)[number];
  type EmailSubscriptionRow = (typeof user.emailSubscriptions)[number];

  const badgeVariantForStatus = (statusLabel: string) => {
    if (statusLabel === 'FAILED' || statusLabel === 'UNSUBSCRIBED') {
      return 'destructive' as const;
    }

    if (statusLabel === 'SENT' || statusLabel === 'SUBSCRIBED') {
      return 'default' as const;
    }

    return 'secondary' as const;
  };

  return (
    <div className="space-y-6">
      <AdminActionNotice status={status} message={message} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('admin.users.details.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('admin.users.details.subtitle')}</p>
        </div>
        <Link href={`/${lang}/admin/users`}>
          <Button variant="secondary" className="w-full sm:w-auto">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('admin.users.details.back_to_users')}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{user.displayName || t('admin.users.unnamed_user')}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {user.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary">{user.role.replace('_', ' ')}</Badge>
            {isCurrentAdmin ? <Badge variant="outline">Current admin session</Badge> : null}
            <Badge variant={user.isVerified ? 'default' : 'secondary'}>
              {user.isVerified ? t('admin.common.verified') : t('admin.common.unverified')}
            </Badge>
            {user.managedClub && <Badge>{t('admin.users.manages')} {user.managedClub.name}</Badge>}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            {isCurrentAdmin ? (
              <Badge variant="outline" className="px-3 py-2">
                Verification changes are locked on the active admin session
              </Badge>
            ) : (
              <form action={updateUserVerification}>
                <input type="hidden" name="userId" value={user.id} />
                <input type="hidden" name="isVerified" value={String(!user.isVerified)} />
                <input type="hidden" name="returnPath" value={`/${lang}/admin/users/${user.id}`} />
                <Button type="submit" variant="secondary">
                  {user.isVerified ? t('admin.users.set_unverified') : t('admin.users.set_verified')}
                </Button>
              </form>
            )}

            {user.role === 'CLUB_ADMIN' ? (
              <Badge variant="outline" className="px-3 py-2">Club admin workflow ships in a later release</Badge>
            ) : isCurrentAdmin ? (
              <Badge variant="outline" className="px-3 py-2">Role changes are locked on the active admin session</Badge>
            ) : (
              <form action={updateUserRole} className="flex gap-2">
                <input type="hidden" name="userId" value={user.id} />
                <input type="hidden" name="returnPath" value={`/${lang}/admin/users/${user.id}`} />
                <select
                  name="role"
                  defaultValue={user.role}
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="USER">{t('admin.users.roles.user')}</option>
                  <option value="ADMIN">{t('admin.users.roles.admin')}</option>
                </select>
                <Button type="submit">{t('admin.users.update_role')}</Button>
              </form>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
            Club-admin assignment is intentionally excluded from this release. Use this surface for member verification and platform-admin promotion only.
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-border p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Joined</p>
              <p className="mt-1 text-sm font-medium">{new Date(user.createdAt).toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-border p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Last active</p>
              <p className="mt-1 text-sm font-medium">
                {user.lastActiveAt ? new Date(user.lastActiveAt).toLocaleString() : 'No recent activity recorded'}
              </p>
            </div>
            <div className="rounded-xl border border-border p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Notifications</p>
              <p className="mt-1 text-sm font-medium">{user._count.notifications}</p>
            </div>
            <div className="rounded-xl border border-border p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Communication events</p>
              <p className="mt-1 text-sm font-medium">{user._count.communicationEvents}</p>
            </div>
            <div className="rounded-xl border border-border p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email subscriptions</p>
              <p className="mt-1 text-sm font-medium">{user._count.emailSubscriptions}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" />
              Safety Pass
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {user.safetyPass ? (
              <>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={user.safetyPass.status === 'ACTIVE' ? 'default' : 'secondary'}>
                    {user.safetyPass.status}
                  </Badge>
                  <Badge variant="secondary">{user.safetyPass.tier}</Badge>
                </div>
                <p><span className="font-medium">Pass:</span> {user.safetyPass.passNumber}</p>
                <p><span className="font-medium">Issued:</span> {new Date(user.safetyPass.issuedAt).toLocaleDateString()}</p>
                <p><span className="font-medium">Expires:</span> {new Date(user.safetyPass.expiresAt).toLocaleDateString()}</p>
              </>
            ) : (
              <p className="text-muted-foreground">No safety pass has been issued for this user.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardList className="h-4 w-4" />
              {t('admin.users.requests')} ({user._count.membershipRequests})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {user.membershipRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('admin.users.no_requests')}</p>
            ) : (
              user.membershipRequests.map((request: MembershipRequestRow) => (
                <div key={request.id} className="text-sm border rounded-md p-2">
                  <div className="font-medium">{request.club.name}</div>
                  <div className="text-muted-foreground">{request.status}</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="h-4 w-4" />
              {t('admin.users.reviews')} ({user._count.reviews})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {user.reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('admin.users.no_reviews')}</p>
            ) : (
              user.reviews.map((review: ReviewRow) => (
                <div key={review.id} className="text-sm border rounded-md p-2">
                  <div className="font-medium">{review.club.name}</div>
                  <div className="text-muted-foreground">{review.rating}/5</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Heart className="h-4 w-4" />
              {t('admin.users.favorites')} ({user._count.favorites})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {user.favorites.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('admin.users.no_favorites')}</p>
            ) : (
              user.favorites.map((favorite: FavoriteRow) => (
                <div key={favorite.id} className="text-sm border rounded-md p-2">
                  <div className="font-medium">{favorite.club.name}</div>
                  <div className="text-muted-foreground">{favorite.club.isVerified ? t('admin.users.verified_club') : t('admin.users.unverified_club')}</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="h-4 w-4" />
              Bookings ({user._count.bookings})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {user.bookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No bookings recorded for this user.</p>
            ) : (
              user.bookings.map((booking: BookingRow) => (
                <div key={booking.id} className="text-sm border rounded-md p-2">
                  <div className="font-medium">{booking.club.name}</div>
                  <div className="text-muted-foreground">
                    {booking.type} · {booking.status} · {new Date(booking.scheduledFor).toLocaleDateString()}
                  </div>
                  {booking.event?.name ? (
                    <div className="text-muted-foreground">{booking.event.name}</div>
                  ) : null}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Communication history</CardTitle>
            <CardDescription>Recent transactional and marketing events linked to this user.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {user.communicationEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No communication history is recorded for this user yet.</p>
            ) : (
              user.communicationEvents.map((event: CommunicationRow) => (
                <div key={event.id} className="rounded-md border p-3">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={badgeVariantForStatus(event.status)}>{event.status}</Badge>
                      <Badge variant="secondary">{event.audience}</Badge>
                      <span className="font-medium">{event.type}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(event.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {event.recipientEmail || user.email} {event.provider ? `• ${event.provider}` : ''}
                  </div>
                  {event.subject ? <div className="mt-2 text-sm">{event.subject}</div> : null}
                  {event.relatedRequestId ? (
                    <div className="mt-2 text-xs text-muted-foreground">Request: {event.relatedRequestId}</div>
                  ) : null}
                  {event.emailOutbox ? (
                    <div className="mt-3 rounded-md bg-slate-50 p-3 text-sm dark:bg-slate-900/40">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={badgeVariantForStatus(event.emailOutbox.status)}>
                          {event.emailOutbox.status}
                        </Badge>
                        <Badge variant="secondary">{event.emailOutbox.route}</Badge>
                        <span>
                          Attempts {event.emailOutbox.attempts}/{event.emailOutbox.maxAttempts}
                        </span>
                      </div>
                      {event.emailOutbox.lastError ? (
                        <div className="mt-2 text-sm text-red-600 dark:text-red-400">{event.emailOutbox.lastError}</div>
                      ) : null}
                      {['FAILED', 'SKIPPED'].includes(event.emailOutbox.status) ? (
                        <form action={replayAdminCommunicationOutboxItem} className="mt-3">
                          <input type="hidden" name="outboxId" value={event.emailOutbox.id} />
                          <input type="hidden" name="returnPath" value={`/${lang}/admin/users/${user.id}`} />
                          <Button type="submit" size="sm" variant="secondary">
                            Replay queued email
                          </Button>
                        </form>
                      ) : null}
                    </div>
                  ) : null}
                  {event.errorMessage ? (
                    <div className="mt-2 text-sm text-red-600 dark:text-red-400">{event.errorMessage}</div>
                  ) : null}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email consent state</CardTitle>
            <CardDescription>Local subscription and suppression signals known for this user.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {user.emailSubscriptions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No email subscription records are linked to this user yet.</p>
            ) : (
              user.emailSubscriptions.map((subscription: EmailSubscriptionRow) => (
                <div key={subscription.id} className="rounded-md border p-3">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={badgeVariantForStatus(subscription.status)}>{subscription.status}</Badge>
                      {subscription.locale ? <Badge variant="secondary">{subscription.locale}</Badge> : null}
                      <span className="font-medium">{subscription.email}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(subscription.updatedAt).toLocaleString()}</span>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Source {subscription.source || 'unknown'} {subscription.provider ? `• ${subscription.provider}` : ''}
                  </div>
                  <div className="mt-2 text-sm">
                    Last marketing send: {subscription.lastMarketingEmailAt ? new Date(subscription.lastMarketingEmailAt).toLocaleString() : 'Not yet'}
                  </div>
                  <div className="mt-1 text-sm">
                    Last transactional send: {subscription.lastTransactionalEmailAt ? new Date(subscription.lastTransactionalEmailAt).toLocaleString() : 'Not yet'}
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
