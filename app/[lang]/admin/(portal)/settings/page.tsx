import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';

interface AdminSettingsPageProps {
  params: Promise<{ lang: string }>;
}

export default async function AdminSettingsPage({ params }: AdminSettingsPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = (key: string): string => (typeof dictionary[key] === 'string' ? dictionary[key] : key);
  const now = new Date();
  const next14Days = new Date(now);
  next14Days.setDate(next14Days.getDate() + 14);

  const [adminCount, auditEvents, pendingVerifications, pendingRequests, pendingBookings, expiringSafetyPasses] = await Promise.all([
    prisma.profile.count({ where: { role: 'ADMIN' } }),
    prisma.auditLog.count(),
    prisma.club.count({ where: { isVerified: false } }),
    prisma.membershipRequest.count({ where: { status: 'PENDING' } }),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.safetyPass.count({
      where: {
        status: 'ACTIVE',
        expiresAt: {
          gt: now,
          lte: next14Days,
        },
      },
    }),
  ]);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('admin.settings.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('admin.settings.subtitle')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System controls</CardTitle>
          <CardDescription>Operational state for this release. These controls are intentionally read-only in the UI until each workflow is fully productized.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div>
              <p className="font-medium">{t('admin.settings.strict_verification')}</p>
              <p className="text-xs text-muted-foreground">{t('admin.settings.strict_verification_desc')}</p>
            </div>
            <Badge>Enabled</Badge>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div>
              <p className="font-medium">{t('admin.settings.audit_logging')}</p>
              <p className="text-xs text-muted-foreground">{t('admin.settings.audit_logging_desc')}</p>
            </div>
            <Badge>{auditEvents} records</Badge>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div>
              <p className="font-medium">{t('admin.settings.emergency_freeze')}</p>
              <p className="text-xs text-muted-foreground">{t('admin.settings.emergency_freeze_desc')}</p>
            </div>
            <Badge variant="secondary">Not armed</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Operational readiness</CardTitle>
          <CardDescription>Backlog and trust signals that should stay near zero before launch.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Platform admins</p>
            <p className="mt-2 text-3xl font-bold">{adminCount}</p>
            <p className="mt-1 text-sm text-muted-foreground">Protect the final admin account from accidental removal.</p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pending club verification</p>
            <p className="mt-2 text-3xl font-bold">{pendingVerifications}</p>
            <p className="mt-1 text-sm text-muted-foreground">Operational queue for trust and discovery quality.</p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pending membership requests</p>
            <p className="mt-2 text-3xl font-bold">{pendingRequests}</p>
            <p className="mt-1 text-sm text-muted-foreground">Admin-owned intake queue awaiting review.</p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pending bookings</p>
            <p className="mt-2 text-3xl font-bold">{pendingBookings}</p>
            <p className="mt-1 text-sm text-muted-foreground">Visits and events that still need operational confirmation.</p>
          </div>
          <div className="rounded-xl border border-border p-4 md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Safety pass expirations (14 days)</p>
            <p className="mt-2 text-3xl font-bold">{expiringSafetyPasses}</p>
            <p className="mt-1 text-sm text-muted-foreground">Use this as a renewal watchlist before member support issues surface.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Release notes</CardTitle>
          <CardDescription>Explicit boundaries keep the admin surface trustworthy.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Club-admin assignment is deferred to a future release and is intentionally excluded from the admin UI in this release.</p>
          <p>Brevo setup is intentionally left for final manual validation and is not part of this review pass.</p>
          <p>Settings remain read-only until each control has a complete authorization, audit, and rollback story.</p>
        </CardContent>
      </Card>
    </div>
  );
}
