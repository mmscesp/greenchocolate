import { AdminActionNotice } from '@/components/admin/AdminActionNotice';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getAdminSettingsOverview,
  updatePlatformControlSettingAction,
} from '@/app/actions/admin-settings';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n-config';

interface AdminSettingsPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getString(value: string | string[] | undefined, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

export default async function AdminSettingsPage({
  params,
  searchParams,
}: AdminSettingsPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const query = await searchParams;
  const status = getString(query.status);
  const statusMessage = getString(query.message);
  const t = (key: string): string => (typeof dictionary[key] === 'string' ? dictionary[key] : key);

  const data = await getAdminSettingsOverview();
  if (!data) {
    return null;
  }

  const returnPath = `/${lang}/admin/settings`;
  const readinessItems = [
    { label: 'Resend API', ready: data.readiness.resendApi },
    { label: 'Resend webhook secret', ready: data.readiness.resendWebhook },
    { label: 'Brevo API', ready: data.readiness.brevoApi },
    { label: 'Brevo webhook secret', ready: data.readiness.brevoWebhook },
    { label: 'Communications cron secret', ready: data.readiness.cronSecret },
    { label: 'Turnstile challenge', ready: data.readiness.turnstile },
    { label: 'Bootstrap secret configured', ready: data.readiness.bootstrapSecret },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Control plane</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{t('admin.settings.title')}</h1>
        <p className="mt-1 max-w-3xl text-muted-foreground">
          Live operational controls, provider readiness, and security posture for the founder desk.
        </p>
      </div>

      <AdminActionNotice message={statusMessage} status={status} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Platform admins</CardTitle>
            <CardDescription>Protect the final admin account from accidental removal.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{data.summary.adminCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Audit records</CardTitle>
            <CardDescription>Enterprise posture depends on a durable admin trail.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{data.summary.auditEvents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Open inquiries</CardTitle>
            <CardDescription>Inbound contact queue that still needs founder or admin action.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{data.summary.openContactInquiries}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">New leads (7d)</CardTitle>
            <CardDescription>Marketing capture volume across recent lead workflows.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{data.summary.newLeads7d}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live intake controls</CardTitle>
          <CardDescription>
            These switches are connected to the real platform flows. Use them when you need to pause intake without redeploying.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 xl:grid-cols-3">
          {data.controls.map((control) => (
            <div key={control.key} className="rounded-[1.5rem] border p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{control.label}</div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{control.description}</p>
                </div>
                <Badge variant={control.enabled ? 'default' : 'secondary'}>
                  {control.enabled ? 'Enabled' : 'Paused'}
                </Badge>
              </div>
              <form action={updatePlatformControlSettingAction} className="mt-5">
                <input type="hidden" name="returnPath" value={returnPath} />
                <input type="hidden" name="key" value={control.key} />
                <input type="hidden" name="enabled" value={control.enabled ? 'false' : 'true'} />
                <Button type="submit" variant={control.enabled ? 'secondary' : 'primary'}>
                  {control.enabled ? 'Pause intake' : 'Resume intake'}
                </Button>
              </form>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Security and intake policy</CardTitle>
            <CardDescription>Current rate limits and lead time windows active in production code.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 text-sm">
            <div className="rounded-2xl border px-4 py-3">
              <div className="text-muted-foreground">Guest soft limit</div>
              <div className="mt-2 text-2xl font-semibold">{data.membershipSecurity.guestSoftLimit}</div>
            </div>
            <div className="rounded-2xl border px-4 py-3">
              <div className="text-muted-foreground">Guest hard limit</div>
              <div className="mt-2 text-2xl font-semibold">{data.membershipSecurity.guestHardLimit}</div>
            </div>
            <div className="rounded-2xl border px-4 py-3">
              <div className="text-muted-foreground">Authenticated soft limit</div>
              <div className="mt-2 text-2xl font-semibold">{data.membershipSecurity.authSoftLimit}</div>
            </div>
            <div className="rounded-2xl border px-4 py-3">
              <div className="text-muted-foreground">Authenticated hard limit</div>
              <div className="mt-2 text-2xl font-semibold">{data.membershipSecurity.authHardLimit}</div>
            </div>
            <div className="rounded-2xl border px-4 py-3">
              <div className="text-muted-foreground">Rate-limit window</div>
              <div className="mt-2 text-2xl font-semibold">{data.membershipSecurity.windowMinutes}m</div>
            </div>
            <div className="rounded-2xl border px-4 py-3">
              <div className="text-muted-foreground">Lead TTL</div>
              <div className="mt-2 text-2xl font-semibold">{data.membershipSecurity.leadTtlHours}h</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Provider readiness</CardTitle>
            <CardDescription>These are the config dependencies the operations center relies on.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {readinessItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl border px-4 py-3 text-sm">
                <span>{item.label}</span>
                <Badge variant={item.ready ? 'default' : 'secondary'}>
                  {item.ready ? 'Ready' : 'Needs config'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Operational readiness</CardTitle>
          <CardDescription>Queues and trust signals that should stay near zero before scale.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-xl border p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pending club verification</p>
            <p className="mt-2 text-3xl font-bold">{data.summary.pendingVerifications}</p>
          </div>
          <div className="rounded-xl border p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pending membership requests</p>
            <p className="mt-2 text-3xl font-bold">{data.summary.pendingRequests}</p>
          </div>
          <div className="rounded-xl border p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pending bookings</p>
            <p className="mt-2 text-3xl font-bold">{data.summary.pendingBookings}</p>
          </div>
          <div className="rounded-xl border p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Safety pass expirations (14d)</p>
            <p className="mt-2 text-3xl font-bold">{data.summary.expiringSafetyPasses}</p>
          </div>
          <div className="rounded-xl border p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Open contact inquiries</p>
            <p className="mt-2 text-3xl font-bold">{data.summary.openContactInquiries}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
