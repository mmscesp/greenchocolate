import { AdminActionNotice } from '@/components/admin/AdminActionNotice';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  getAdminCommunicationsOverview,
  processAdminPendingCommunications,
  replayAdminCommunicationOutboxItem,
} from '@/app/actions/admin-communications';

export const dynamic = 'force-dynamic';

interface AdminCommunicationsPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getString(value: string | string[] | undefined, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function getBadgeVariant(status: string) {
  if (status === 'FAILED' || status === 'UNSUBSCRIBED') {
    return 'destructive' as const;
  }

  if (status === 'SENT' || status === 'SUBSCRIBED') {
    return 'default' as const;
  }

  return 'secondary' as const;
}

function formatDate(value: string | Date | null | undefined) {
  if (!value) {
    return 'Not yet';
  }

  return new Date(value).toLocaleString();
}

export default async function AdminCommunicationsPage({
  params,
  searchParams,
}: AdminCommunicationsPageProps) {
  const { lang } = await params;
  const query = await searchParams;
  const statusMessage = getString(query.message);
  const status = getString(query.status);
  const search = getString(query.search);
  const audience = getString(query.audience, 'ALL') as 'ALL' | 'TRANSACTIONAL' | 'MARKETING';
  const eventStatus = getString(query.eventStatus, 'ALL') as 'ALL' | 'PENDING' | 'SENT' | 'SKIPPED' | 'FAILED';
  const outboxStatus = getString(query.outboxStatus, 'ALL') as 'ALL' | 'PENDING' | 'PROCESSING' | 'SENT' | 'SKIPPED' | 'FAILED';

  const data = await getAdminCommunicationsOverview({
    search,
    audience,
    status: eventStatus,
    outboxStatus,
  });

  if (!data) {
    return null;
  }

  const readinessItems = [
    { label: 'Resend transactional API', ready: data.readiness.resendApi },
    { label: 'Resend webhook verification', ready: data.readiness.resendWebhook },
    { label: 'Brevo marketing API', ready: data.readiness.brevoApi },
    { label: 'Brevo webhook verification', ready: data.readiness.brevoWebhook },
    { label: 'Outbox processing secret', ready: data.readiness.cronSecret },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Communications</h1>
          <p className="mt-1 text-muted-foreground">
            Delivery health, queue backlog, unsubscribe state, and webhook reconciliation across transactional and marketing email.
          </p>
        </div>

        <form action={processAdminPendingCommunications} className="flex items-center gap-3">
          <input type="hidden" name="returnPath" value={`/${lang}/admin/communications`} />
          <input type="hidden" name="limit" value="25" />
          <Button type="submit">Process Pending Outbox</Button>
        </form>
      </div>

      <AdminActionNotice message={statusMessage} status={status} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>24h delivery</CardTitle>
            <CardDescription>What the system successfully handed off vs what failed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-md border px-3 py-2">
              <span>Sent / handed off</span>
              <span className="font-semibold">{data.summary.sentLast24Hours}</span>
            </div>
            <div className="flex items-center justify-between rounded-md border px-3 py-2">
              <span>Failed</span>
              <span className="font-semibold">{data.summary.failedLast24Hours}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Queue health</CardTitle>
            <CardDescription>Ready backlog and items needing retry.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-md border px-3 py-2">
              <span>Pending / processing</span>
              <span className="font-semibold">{data.summary.pendingOutbox}</span>
            </div>
            <div className="flex items-center justify-between rounded-md border px-3 py-2">
              <span>Failed awaiting retry</span>
              <span className="font-semibold">{data.summary.failedOutbox}</span>
            </div>
            <div className="flex items-center justify-between rounded-md border px-3 py-2">
              <span>Oldest ready item age</span>
              <span className="font-semibold">
                {data.summary.oldestReadyOutboxAgeMinutes === null
                  ? 'Queue clear'
                  : `${data.summary.oldestReadyOutboxAgeMinutes} min`}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance</CardTitle>
            <CardDescription>Marketing preference and webhook integrity signals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-md border px-3 py-2">
              <span>Unsubscribed contacts</span>
              <span className="font-semibold">{data.summary.unsubscribedCount}</span>
            </div>
            <div className="flex items-center justify-between rounded-md border px-3 py-2">
              <span>Invalid webhook signatures (7d)</span>
              <span className="font-semibold">{data.summary.invalidWebhooks7d}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Readiness</CardTitle>
          <CardDescription>
            In-app implementation is ready. Any missing item here is a platform configuration task outside the repo.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {readinessItems.map((item) => (
            <div key={item.label} className="rounded-md border px-3 py-3 text-sm">
              <div className="font-medium">{item.label}</div>
              <div className="mt-2">
                <Badge variant={item.ready ? 'default' : 'secondary'}>
                  {item.ready ? 'Ready' : 'Needs config'}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filter recent events</CardTitle>
          <CardDescription>Search by email, type, subject, or provider.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px_auto] lg:items-center">
            <Input name="search" defaultValue={search} placeholder="Search email, type, provider" />
            <select
              name="audience"
              defaultValue={audience}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="ALL">All audiences</option>
              <option value="TRANSACTIONAL">Transactional</option>
              <option value="MARKETING">Marketing</option>
            </select>
            <select
              name="eventStatus"
              defaultValue={eventStatus}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="ALL">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="SENT">Sent</option>
              <option value="SKIPPED">Skipped</option>
              <option value="FAILED">Failed</option>
            </select>
            <Button type="submit">Apply</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent communication events</CardTitle>
            <CardDescription>{data.recentEvents.length} records from the unified event ledger.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentEvents.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                No communications match the current filters.
              </div>
            ) : (
              data.recentEvents.map((event) => (
                <div key={event.id} className="rounded-md border p-3">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={getBadgeVariant(event.status)}>{event.status}</Badge>
                      <Badge variant="secondary">{event.audience}</Badge>
                      <span className="font-medium">{event.type}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(event.createdAt)}</span>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {event.recipientEmail || 'No recipient email'} {event.provider ? `• ${event.provider}` : ''}
                  </div>
                  {event.subject ? <div className="mt-2 text-sm">{event.subject}</div> : null}
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
            <CardTitle>Outbox backlog</CardTitle>
            <CardDescription>Persistence, retries, dead-letter style triage, and replay access for queued email work.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <form className="grid gap-3 lg:grid-cols-[180px_auto] lg:items-center">
              <input type="hidden" name="search" value={search} />
              <input type="hidden" name="audience" value={audience} />
              <input type="hidden" name="eventStatus" value={eventStatus} />
              <select
                name="outboxStatus"
                defaultValue={outboxStatus}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="ALL">All queue states</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SENT">Sent</option>
                <option value="SKIPPED">Skipped</option>
                <option value="FAILED">Failed</option>
              </select>
              <Button type="submit" variant="secondary">Filter backlog</Button>
            </form>
            {data.recentOutbox.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                No queued email work has been recorded yet.
              </div>
            ) : (
              data.recentOutbox.map((item) => (
                <div key={item.id} className="rounded-md border p-3">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={getBadgeVariant(item.status)}>{item.status}</Badge>
                      <Badge variant="secondary">{item.route}</Badge>
                      <span className="font-medium">{item.communicationEvent?.type || 'EMAIL_OUTBOX'}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(item.updatedAt)}</span>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {item.communicationEvent?.recipientEmail || 'No recipient email'} {item.provider ? `• ${item.provider}` : ''}
                  </div>
                  {item.relatedRequestId ? (
                    <div className="mt-2 text-xs text-muted-foreground">Request {item.relatedRequestId}</div>
                  ) : null}
                  <div className="mt-2 text-sm">
                    Attempts {item.attempts}/{item.maxAttempts} • Available {formatDate(item.availableAt)}
                  </div>
                  {item.lastError ? (
                    <div className="mt-2 text-sm text-red-600 dark:text-red-400">{item.lastError}</div>
                  ) : null}
                  {['FAILED', 'SKIPPED'].includes(item.status) ? (
                    <form action={replayAdminCommunicationOutboxItem} className="mt-3">
                      <input type="hidden" name="outboxId" value={item.id} />
                      <input
                        type="hidden"
                        name="returnPath"
                        value={`/${lang}/admin/communications?search=${encodeURIComponent(search)}&audience=${encodeURIComponent(audience)}&eventStatus=${encodeURIComponent(eventStatus)}&outboxStatus=${encodeURIComponent(outboxStatus)}`}
                      />
                      <Button type="submit" size="sm" variant="secondary">
                        Replay queued email
                      </Button>
                    </form>
                  ) : null}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Email subscriptions</CardTitle>
            <CardDescription>Local consent state and last-send timestamps per email address.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentSubscriptions.map((subscription) => (
              <div key={subscription.id} className="rounded-md border p-3">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={getBadgeVariant(subscription.status)}>{subscription.status}</Badge>
                    {subscription.locale ? <Badge variant="secondary">{subscription.locale}</Badge> : null}
                    <span className="font-medium">{subscription.email}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(subscription.updatedAt)}</span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Source {subscription.source || 'unknown'} {subscription.provider ? `• ${subscription.provider}` : ''}
                </div>
                <div className="mt-2 text-sm">
                  Last marketing send: {formatDate(subscription.lastMarketingEmailAt)}
                </div>
                <div className="mt-1 text-sm">
                  Last transactional send: {formatDate(subscription.lastTransactionalEmailAt)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Provider webhooks</CardTitle>
            <CardDescription>Recent webhook reconciliation activity from Resend and Brevo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentWebhooks.map((event) => (
              <div key={event.id} className="rounded-md border p-3">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={event.signatureValid ? 'default' : 'destructive'}>
                      {event.signatureValid ? 'Verified' : 'Invalid signature'}
                    </Badge>
                    <Badge variant="secondary">{event.provider}</Badge>
                    <span className="font-medium">{event.eventType}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(event.createdAt)}</span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {event.recipientEmail || 'No recipient email'} {event.externalId ? `• ${event.externalId}` : ''}
                </div>
                {event.errorMessage ? (
                  <div className="mt-2 text-sm text-red-600 dark:text-red-400">{event.errorMessage}</div>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
