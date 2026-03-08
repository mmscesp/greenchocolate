import {
  addAdminMembershipNoteAction,
  advanceApplicationStageAction,
  getAdminMembershipQueue,
  getAdminMembershipRequestDetail,
  rejectApplicationAction,
} from '@/app/actions/applications';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

interface AdminRequestsPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{
    status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL';
    query?: string;
    clubId?: string;
    requestId?: string;
  }>;
}

function buildReturnPath(lang: string, search: AdminRequestsPageProps['searchParams'] extends Promise<infer T> ? T : never) {
  const params = new URLSearchParams();
  if (search.status) params.set('status', search.status);
  if (search.query) params.set('query', search.query);
  if (search.clubId) params.set('clubId', search.clubId);
  if (search.requestId) params.set('requestId', search.requestId);

  const query = params.toString();
  return `/${lang}/admin/requests${query ? `?${query}` : ''}`;
}

function badgeVariant(status: string) {
  if (status === 'APPROVED') return 'default';
  if (status === 'REJECTED') return 'destructive';
  return 'secondary';
}

export default async function AdminRequestsPage({
  params,
  searchParams,
}: AdminRequestsPageProps) {
  const { lang } = await params;
  const search = await searchParams;
  const queue = await getAdminMembershipQueue({
    status: search.status || 'ALL',
    query: search.query,
    clubId: search.clubId,
  });
  const selectedRequest = search.requestId
    ? await getAdminMembershipRequestDetail(search.requestId)
    : null;
  const returnPath = buildReturnPath(lang, search);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Membership Requests</h1>
        <p className="mt-1 text-muted-foreground">
          Admin-owned intake queue for applicant review, decisioning, and manual club handoff.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-3xl font-bold">{queue.counts.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-3xl font-bold">{queue.counts.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Approved</p>
            <p className="text-3xl font-bold">{queue.counts.approved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Rejected</p>
            <p className="text-3xl font-bold">{queue.counts.rejected}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-4">
            <input type="hidden" name="requestId" value={search.requestId || ''} />
            <input
              name="query"
              defaultValue={search.query || ''}
              placeholder="Search by applicant or club"
              className="rounded-xl border border-border px-4 py-2"
            />
            <select
              name="status"
              defaultValue={search.status || 'ALL'}
              className="rounded-xl border border-border px-4 py-2"
            >
              <option value="ALL">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <select
              name="clubId"
              defaultValue={search.clubId || ''}
              className="rounded-xl border border-border px-4 py-2"
            >
              <option value="">All clubs</option>
              {queue.clubs.map((club) => (
                <option key={club.id} value={club.id}>
                  {club.name}
                </option>
              ))}
            </select>
            <button type="submit" className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white">
              Apply filters
            </button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {queue.items.length === 0 ? (
              <p className="text-sm text-muted-foreground">No requests match the current filters.</p>
            ) : (
              queue.items.map((item) => {
                const nextUrl = buildReturnPath(lang, { ...search, requestId: item.id });
                return (
                  <a
                    key={item.id}
                    href={nextUrl}
                    className={`block rounded-2xl border p-4 transition ${
                      search.requestId === item.id ? 'border-slate-900 bg-slate-50' : 'border-border hover:bg-muted/40'
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{item.user.displayName || item.user.email}</p>
                      <Badge variant={badgeVariant(item.status)}>{item.status}</Badge>
                      <Badge variant="secondary">{item.stage}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.club.name} · {new Date(item.createdAt).toLocaleString()}
                    </p>
                    {item.message ? (
                      <p className="mt-2 text-sm text-slate-700 line-clamp-2">{item.message}</p>
                    ) : null}
                  </a>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request Detail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!selectedRequest ? (
              <p className="text-sm text-muted-foreground">Select a request to inspect details and record a decision.</p>
            ) : (
              <>
                <div className="space-y-2">
                  <p className="text-lg font-semibold">{selectedRequest.user.displayName || selectedRequest.user.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedRequest.user.email}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={badgeVariant(selectedRequest.applicationStatus)}>
                      {selectedRequest.applicationStatus}
                    </Badge>
                    <Badge variant="secondary">{selectedRequest.currentStage}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Club: {selectedRequest.club.name} · {selectedRequest.club.neighborhood}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Club contact for manual handoff: {selectedRequest.club.contactEmail}
                  </p>
                </div>

                <div className="space-y-2 rounded-2xl border border-border p-4">
                  <p className="text-sm font-semibold">Applicant message</p>
                  <p className="text-sm text-slate-700">{selectedRequest.message || 'No applicant message.'}</p>
                </div>

                <div className="space-y-2 rounded-2xl border border-border p-4">
                  <p className="text-sm font-semibold">Eligibility answers</p>
                  {Object.keys(selectedRequest.eligibilityAnswers).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No extra eligibility answers captured.</p>
                  ) : (
                    <dl className="space-y-2 text-sm">
                      {Object.entries(selectedRequest.eligibilityAnswers).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-[140px_1fr] gap-3">
                          <dt className="font-medium text-slate-600">{key}</dt>
                          <dd className="text-slate-800">{String(value)}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>

                <div className="grid gap-4">
                  <form action={advanceApplicationStageAction} className="space-y-3 rounded-2xl border border-border p-4">
                    <input type="hidden" name="requestId" value={selectedRequest.id} />
                    <input type="hidden" name="returnPath" value={returnPath} />
                    <p className="text-sm font-semibold">Advance stage / approve</p>
                    <select name="toStage" defaultValue={selectedRequest.currentStage} className="w-full rounded-xl border border-border px-4 py-2">
                      <option value="DOCUMENT_VERIFICATION">DOCUMENT_VERIFICATION</option>
                      <option value="BACKGROUND_CHECK">BACKGROUND_CHECK</option>
                      <option value="FINAL_APPROVAL">FINAL_APPROVAL</option>
                    </select>
                    <textarea
                      name="notes"
                      rows={3}
                      placeholder="Optional internal/admin-facing notes included in the applicant update."
                      className="w-full rounded-xl border border-border px-4 py-3"
                      defaultValue={selectedRequest.appointmentNotes || ''}
                    />
                    <button type="submit" className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white">
                      Save stage decision
                    </button>
                  </form>

                  <form action={rejectApplicationAction} className="space-y-3 rounded-2xl border border-red-200 p-4">
                    <input type="hidden" name="requestId" value={selectedRequest.id} />
                    <input type="hidden" name="returnPath" value={returnPath} />
                    <p className="text-sm font-semibold text-red-900">Reject application</p>
                    <textarea
                      name="reason"
                      rows={3}
                      required
                      placeholder="Required rejection reason sent to the applicant."
                      className="w-full rounded-xl border border-red-200 px-4 py-3"
                    />
                    <button type="submit" className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white">
                      Reject request
                    </button>
                  </form>

                  <form action={addAdminMembershipNoteAction} className="space-y-3 rounded-2xl border border-border p-4">
                    <input type="hidden" name="requestId" value={selectedRequest.id} />
                    <input type="hidden" name="returnPath" value={returnPath} />
                    <p className="text-sm font-semibold">Internal note</p>
                    <textarea
                      name="body"
                      rows={3}
                      required
                      placeholder="Add a note for the admin team. This is not emailed automatically."
                      className="w-full rounded-xl border border-border px-4 py-3"
                    />
                    <button type="submit" className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-900">
                      Add note
                    </button>
                  </form>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold">Stage history</p>
                    <div className="mt-2 space-y-2">
                      {selectedRequest.stageHistory.map((entry) => (
                        <div key={entry.id} className="rounded-xl border border-border p-3 text-sm">
                          <p className="font-medium">{entry.stage}</p>
                          <p className="text-muted-foreground">{entry.changedAt.toLocaleString()}</p>
                          {entry.notes ? <p className="mt-1 text-slate-700">{entry.notes}</p> : null}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold">Internal notes</p>
                    <div className="mt-2 space-y-2">
                      {selectedRequest.notes.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No notes yet.</p>
                      ) : (
                        selectedRequest.notes.map((note) => (
                          <div key={note.id} className="rounded-xl border border-border p-3 text-sm">
                            <p className="font-medium">{note.authorName}</p>
                            <p className="text-muted-foreground">{new Date(note.createdAt).toLocaleString()}</p>
                            <p className="mt-1 text-slate-700">{note.body}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
