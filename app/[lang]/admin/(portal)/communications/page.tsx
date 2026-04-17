import { AdminActionNotice } from '@/components/admin/AdminActionNotice';
import { updateContactInquiryStatusAction } from '@/app/actions/contact-inquiries';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  getAdminCommunicationsOverview,
  processAdminPendingCommunications,
  replayAdminCommunicationOutboxBatch,
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
  if (status === 'FAILED' || status === 'UNSUBSCRIBED' || status === 'SPAM') {
    return 'destructive' as const;
  }

  if (status === 'SENT' || status === 'SUBSCRIBED' || status === 'RESOLVED') {
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

function controlLabel(enabled: boolean) {
  return enabled ? 'Live' : 'Paused';
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
  const activeTab = getString(query.tab, 'intake');

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

  const deliveryReturnPath = `/${lang}/admin/communications?tab=delivery&search=${encodeURIComponent(search)}&audience=${encodeURIComponent(audience)}&eventStatus=${encodeURIComponent(eventStatus)}&outboxStatus=${encodeURIComponent(outboxStatus)}`;
  const intakeReturnPath = `/${lang}/admin/communications?tab=intake`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Operations center</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Communications</h1>
          <p className="mt-1 max-w-3xl text-muted-foreground">
            Central intake for founder operations: contact inquiries, Safety Kit and newsletter leads, membership lead signals,
            queue health, delivery retries, subscriptions, and webhook integrity.
          </p>
        </div>

        <form action={processAdminPendingCommunications} className="flex items-center gap-3">
          <input type="hidden" name="returnPath" value={deliveryReturnPath} />
          <input type="hidden" name="limit" value="25" />
          <Button type="submit">Process Pending Outbox</Button>
        </form>
      </div>

      <AdminActionNotice message={statusMessage} status={status} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Open inquiries</CardTitle>
            <CardDescription>Contact messages still needing founder or admin action.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{data.summary.openContactInquiries}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Leads captured (7d)</CardTitle>
            <CardDescription>Recent Safety Kit, newsletter, and opt-in growth signals.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{data.summary.marketingLeads7d}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Pending membership leads</CardTitle>
            <CardDescription>Guest pre-application leads not yet finalized into live requests.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{data.summary.pendingMembershipLeads}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Outbox backlog</CardTitle>
            <CardDescription>Pending or processing email work in the queue.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{data.summary.pendingOutbox}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">24h failures</CardTitle>
            <CardDescription>Failures across communications that need review.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{data.summary.failedLast24Hours}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={activeTab} className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="intake">Intake</TabsTrigger>
          <TabsTrigger value="delivery">Delivery Ops</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions + Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="intake" className="space-y-6">
          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <Card>
              <CardHeader>
                <CardTitle>Operational intake posture</CardTitle>
                <CardDescription>These controls come from the admin control plane and affect live capture flows.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border p-4">
                  <div className="text-sm font-medium">Contact inquiries</div>
                  <div className="mt-3">
                    <Badge variant={data.controls.contactInquiryIntakeEnabled ? 'default' : 'secondary'}>
                      {controlLabel(data.controls.contactInquiryIntakeEnabled)}
                    </Badge>
                  </div>
                </div>
                <div className="rounded-2xl border p-4">
                  <div className="text-sm font-medium">Marketing lead capture</div>
                  <div className="mt-3">
                    <Badge variant={data.controls.marketingLeadCaptureEnabled ? 'default' : 'secondary'}>
                      {controlLabel(data.controls.marketingLeadCaptureEnabled)}
                    </Badge>
                  </div>
                </div>
                <div className="rounded-2xl border p-4">
                  <div className="text-sm font-medium">Membership intake</div>
                  <div className="mt-3">
                    <Badge variant={data.controls.membershipIntakeEnabled ? 'default' : 'secondary'}>
                      {controlLabel(data.controls.membershipIntakeEnabled)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>New inbound volume</CardTitle>
                <CardDescription>Fast read on what entered the business in the last week.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl border px-4 py-3">
                  <span>Contact inquiries (7d)</span>
                  <span className="font-semibold">{data.summary.newContactInquiries7d}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border px-4 py-3">
                  <span>Lead captures (7d)</span>
                  <span className="font-semibold">{data.summary.marketingLeads7d}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border px-4 py-3">
                  <span>Pending guest membership leads</span>
                  <span className="font-semibold">{data.summary.pendingMembershipLeads}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Contact inquiry inbox</CardTitle>
                <CardDescription>Public contact submissions with admin triage controls and internal notes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.recentContactInquiries.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                    No contact inquiries have been captured yet.
                  </div>
                ) : (
                  data.recentContactInquiries.map((inquiry) => (
                    <div key={inquiry.id} className="rounded-2xl border p-4">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={getBadgeVariant(inquiry.status)}>{inquiry.status}</Badge>
                          <Badge variant="secondary">{inquiry.category}</Badge>
                          <span className="font-medium">{inquiry.subject}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatDate(inquiry.updatedAt)}</span>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        {inquiry.name} • {inquiry.email}
                        {inquiry.assignedAdmin
                          ? ` • ${inquiry.assignedAdmin.displayName || inquiry.assignedAdmin.email}`
                          : ''}
                      </div>
                      <p className="mt-3 text-sm leading-6 text-foreground/90">{inquiry.message}</p>
                      {inquiry.resolvedAt ? (
                        <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                          Closed {formatDate(inquiry.resolvedAt)}
                        </p>
                      ) : null}
                      <form action={updateContactInquiryStatusAction} className="mt-4 space-y-3">
                        <input type="hidden" name="inquiryId" value={inquiry.id} />
                        <input type="hidden" name="returnPath" value={intakeReturnPath} />
                        <div className="grid gap-3 md:grid-cols-[220px_minmax(0,1fr)_auto]">
                          <select
                            name="status"
                            defaultValue={inquiry.status}
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                          >
                            <option value="NEW">New</option>
                            <option value="IN_PROGRESS">In progress</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="SPAM">Spam</option>
                          </select>
                          <Textarea
                            name="adminNotes"
                            rows={2}
                            defaultValue={inquiry.adminNotes || ''}
                            placeholder="Internal notes, follow-up plan, or resolution context"
                          />
                          <Button type="submit" variant="secondary">Save triage</Button>
                        </div>
                      </form>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent lead capture emails</CardTitle>
                  <CardDescription>Emails collected from Safety Kit, newsletter, and explicit inquiry opt-in flows.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.recentLeadSubscriptions.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                      No lead capture records are available yet.
                    </div>
                  ) : (
                    data.recentLeadSubscriptions.map((subscription) => (
                      <div key={subscription.id} className="rounded-2xl border p-4">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={getBadgeVariant(subscription.status)}>{subscription.status}</Badge>
                            {subscription.locale ? <Badge variant="secondary">{subscription.locale}</Badge> : null}
                            <span className="font-medium">{subscription.email}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{formatDate(subscription.updatedAt)}</span>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          Source {subscription.source || 'unknown'}
                        </div>
                        <div className="mt-2 text-sm">
                          Marketing consent {formatDate(subscription.marketingConsentAt)}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Last marketing send {formatDate(subscription.lastMarketingEmailAt)}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Membership lead signals</CardTitle>
                  <CardDescription>Guest pre-application traffic before a user signs in and finalizes a request.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.recentMembershipLeads.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                      No guest membership leads are currently on record.
                    </div>
                  ) : (
                    data.recentMembershipLeads.map((lead) => (
                      <div key={lead.id} className="rounded-2xl border p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={lead.consumedAt ? 'default' : 'secondary'}>
                            {lead.consumedAt ? 'Finalized' : 'Pending'}
                          </Badge>
                          <Badge variant="secondary">{lead.riskLevel}</Badge>
                          <Badge variant="secondary">{lead.challengeStatus}</Badge>
                        </div>
                        <div className="mt-2 text-sm font-medium">{lead.club.name}</div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          Captured {formatDate(lead.createdAt)} • Expires {formatDate(lead.expiresAt)}
                        </div>
                        {lead.countryCode ? (
                          <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                            Country {lead.countryCode}
                          </div>
                        ) : null}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="delivery" className="space-y-6">
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
                  <span>Dead-letter review</span>
                  <span className="font-semibold">{data.summary.deadLetterOutbox}</span>
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
                <CardTitle>Failure rate trend</CardTitle>
                <CardDescription>Share of failed delivery events across recent windows.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between rounded-md border px-3 py-2">
                  <span>7 days</span>
                  <span className="font-semibold">{data.analytics.failureRate7d}%</span>
                </div>
                <div className="flex items-center justify-between rounded-md border px-3 py-2">
                  <span>30 days</span>
                  <span className="font-semibold">{data.analytics.failureRate30d}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Filter recent events</CardTitle>
              <CardDescription>Search by email, type, subject, or provider.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px_auto] lg:items-center">
                <input type="hidden" name="tab" value="delivery" />
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
                <CardDescription>{data.recentEvents.length} records from the unified delivery ledger.</CardDescription>
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
                <CardDescription>Persistence, retries, dead-letter triage, and replay access for queued email work.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <form className="grid gap-3 lg:grid-cols-[180px_auto] lg:items-center">
                  <input type="hidden" name="tab" value="delivery" />
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
                <form action={replayAdminCommunicationOutboxBatch} className="flex items-center gap-3">
                  <input type="hidden" name="search" value={search} />
                  <input type="hidden" name="audience" value={audience} />
                  <input type="hidden" name="eventStatus" value={eventStatus} />
                  <input type="hidden" name="outboxStatus" value={outboxStatus} />
                  <input type="hidden" name="limit" value="25" />
                  <input type="hidden" name="returnPath" value={deliveryReturnPath} />
                  <Button type="submit">Replay Filtered Backlog</Button>
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
                          {item.status === 'SKIPPED' || item.attempts >= item.maxAttempts ? (
                            <Badge variant="destructive">Dead letter</Badge>
                          ) : null}
                          <Badge variant="secondary">{item.route}</Badge>
                          <span className="font-medium">{item.communicationEvent?.type || 'EMAIL_OUTBOX'}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatDate(item.updatedAt)}</span>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        {item.communicationEvent?.recipientEmail || 'No recipient email'} {item.provider ? `• ${item.provider}` : ''}
                      </div>
                      {item.relatedRequestId ? (
                        <div className="mt-2 text-xs text-muted-foreground">Related record {item.relatedRequestId}</div>
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
                          <input type="hidden" name="returnPath" value={deliveryReturnPath} />
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
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                  <span>Invalid webhook signatures (30d)</span>
                  <span className="font-semibold">{data.analytics.invalidWebhooks30d}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Backlog trend</CardTitle>
                <CardDescription>Outbox items created recently across rolling windows.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between rounded-md border px-3 py-2">
                  <span>24 hours</span>
                  <span className="font-semibold">{data.analytics.backlogCreated24Hours}</span>
                </div>
                <div className="flex items-center justify-between rounded-md border px-3 py-2">
                  <span>7 days</span>
                  <span className="font-semibold">{data.analytics.backlogCreated7Days}</span>
                </div>
                <div className="flex items-center justify-between rounded-md border px-3 py-2">
                  <span>30 days</span>
                  <span className="font-semibold">{data.analytics.backlogCreated30Days}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Readiness</CardTitle>
                <CardDescription>Missing items here are environment and platform config gaps.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {readinessItems.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-md border px-3 py-2">
                    <span>{item.label}</span>
                    <Badge variant={item.ready ? 'default' : 'secondary'}>
                      {item.ready ? 'Ready' : 'Needs config'}
                    </Badge>
                  </div>
                ))}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
