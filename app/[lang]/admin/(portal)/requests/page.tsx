import {
  addAdminMembershipNoteAction,
  approveMembershipRequestAction,
  getAdminMembershipQueue,
  getAdminMembershipRequestDetail,
  rejectMembershipRequestAction,
} from '@/app/actions/applications';
import { replayAdminCommunicationOutboxItem } from '@/app/actions/admin-communications';
import { AdminActionNotice } from '@/components/admin/AdminActionNotice';
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
    actionStatus?: string;
    actionMessage?: string;
  }>;
}

const adminRequestsCopy = {
  en: {
    title: 'Membership Requests',
    subtitle: 'Admin-owned intake queue for applicant review, decisioning, and manual club handoff.',
    total: 'Total',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    filters: 'Filters',
    searchPlaceholder: 'Search by applicant or club',
    allStatuses: 'All statuses',
    allClubs: 'All clubs',
    applyFilters: 'Apply filters',
    queue: 'Queue',
    queueEmpty: 'No requests match the current filters.',
    detail: 'Request Detail',
    detailEmpty: 'Select a request to inspect details and record a decision.',
    clubLabel: 'Club',
    handoffLabel: 'Club contact for manual handoff',
    applicantMessage: 'Applicant message',
    noApplicantMessage: 'No applicant message.',
    eligibilityAnswers: 'Eligibility answers',
    noEligibilityAnswers: 'No extra eligibility answers captured.',
    riskSignals: 'Risk signals',
    noRiskSignals: 'No structured risk metadata captured.',
    approveTitle: 'Approve request',
    approvePlaceholder: 'Optional note included in the approval email and visible in the notifications timeline.',
    approveButton: 'Approve request',
    rejectTitle: 'Reject application',
    rejectPlaceholder: 'Required rejection reason shown in the in-app notification.',
    rejectButton: 'Reject request',
    internalNote: 'Internal note',
    internalPlaceholder: 'Add a note for the admin team. This is not emailed automatically.',
    addNote: 'Add note',
    reviewedAt: 'Reviewed at',
    rejectionReason: 'Rejection reason',
    decisionNote: 'Decision note',
    pendingDecision: 'This request is pending review.',
    internalNotes: 'Internal notes',
    noNotes: 'No notes yet.',
    communications: 'Communications',
    noCommunications: 'No communication events are linked to this request yet.',
    notificationsTimeline: 'Notification timeline',
    noNotifications: 'No in-app notifications were recorded for this request yet.',
    replayQueuedEmail: 'Replay queued email',
  },
  es: {
    title: 'Solicitudes de membresia',
    subtitle: 'Cola de admision gestionada por admins para revisar solicitantes, decidir y coordinar la derivacion manual con clubs.',
    total: 'Total',
    pending: 'Pendientes',
    approved: 'Aprobadas',
    rejected: 'Rechazadas',
    filters: 'Filtros',
    searchPlaceholder: 'Buscar por solicitante o club',
    allStatuses: 'Todos los estados',
    allClubs: 'Todos los clubs',
    applyFilters: 'Aplicar filtros',
    queue: 'Cola',
    queueEmpty: 'Ninguna solicitud coincide con los filtros actuales.',
    detail: 'Detalle de solicitud',
    detailEmpty: 'Selecciona una solicitud para revisar los detalles y registrar una decision.',
    clubLabel: 'Club',
    handoffLabel: 'Contacto del club para derivacion manual',
    applicantMessage: 'Mensaje del solicitante',
    noApplicantMessage: 'No hay mensaje del solicitante.',
    eligibilityAnswers: 'Respuestas de elegibilidad',
    noEligibilityAnswers: 'No se capturaron respuestas adicionales de elegibilidad.',
    riskSignals: 'Senales de riesgo',
    noRiskSignals: 'No se capturaron metadatos estructurados de riesgo.',
    approveTitle: 'Aprobar solicitud',
    approvePlaceholder: 'Nota opcional incluida en el email de aprobacion y visible en la cronologia de notificaciones.',
    approveButton: 'Aprobar solicitud',
    rejectTitle: 'Rechazar solicitud',
    rejectPlaceholder: 'Motivo obligatorio mostrado en la notificacion interna.',
    rejectButton: 'Rechazar solicitud',
    internalNote: 'Nota interna',
    internalPlaceholder: 'Anade una nota para el equipo admin. No se envia por correo automaticamente.',
    addNote: 'Anadir nota',
    reviewedAt: 'Revisada el',
    rejectionReason: 'Motivo del rechazo',
    decisionNote: 'Nota de decision',
    pendingDecision: 'Esta solicitud sigue pendiente de revision.',
    internalNotes: 'Notas internas',
    noNotes: 'Aun no hay notas.',
    communications: 'Comunicaciones',
    noCommunications: 'Todavia no hay eventos de comunicacion vinculados a esta solicitud.',
    notificationsTimeline: 'Cronologia de notificaciones',
    noNotifications: 'Todavia no hay notificaciones internas registradas para esta solicitud.',
    replayQueuedEmail: 'Reintentar email en cola',
  },
  fr: {
    title: 'Demandes d adhesion',
    subtitle: 'File d admission geree par les admins pour examiner les candidats, prendre une decision et coordonner le transfert manuel au club.',
    total: 'Total',
    pending: 'En attente',
    approved: 'Approuvees',
    rejected: 'Rejetees',
    filters: 'Filtres',
    searchPlaceholder: 'Rechercher par candidat ou club',
    allStatuses: 'Tous les statuts',
    allClubs: 'Tous les clubs',
    applyFilters: 'Appliquer les filtres',
    queue: 'File',
    queueEmpty: 'Aucune demande ne correspond aux filtres actuels.',
    detail: 'Detail de la demande',
    detailEmpty: 'Selectionnez une demande pour examiner les details et enregistrer une decision.',
    clubLabel: 'Club',
    handoffLabel: 'Contact club pour le transfert manuel',
    applicantMessage: 'Message du candidat',
    noApplicantMessage: 'Aucun message du candidat.',
    eligibilityAnswers: 'Reponses d eligibilite',
    noEligibilityAnswers: 'Aucune reponse supplementaire d eligibilite n a ete enregistree.',
    riskSignals: 'Signaux de risque',
    noRiskSignals: 'Aucune metadonnee structuree de risque n a ete capturee.',
    approveTitle: 'Approuver la demande',
    approvePlaceholder: 'Note facultative incluse dans l email d approbation et visible dans les notifications.',
    approveButton: 'Approuver la demande',
    rejectTitle: 'Rejeter la demande',
    rejectPlaceholder: 'Motif obligatoire affiche dans la notification interne.',
    rejectButton: 'Rejeter la demande',
    internalNote: 'Note interne',
    internalPlaceholder: 'Ajoutez une note pour l equipe admin. Elle n est pas envoyee automatiquement par email.',
    addNote: 'Ajouter la note',
    reviewedAt: 'Examinee le',
    rejectionReason: 'Motif du rejet',
    decisionNote: 'Note de decision',
    pendingDecision: 'Cette demande est toujours en attente de revision.',
    internalNotes: 'Notes internes',
    noNotes: 'Pas encore de notes.',
    communications: 'Communications',
    noCommunications: 'Aucun evenement de communication n est encore lie a cette demande.',
    notificationsTimeline: 'Chronologie des notifications',
    noNotifications: 'Aucune notification interne n a encore ete enregistree pour cette demande.',
    replayQueuedEmail: 'Relancer l email en file',
  },
  de: {
    title: 'Mitgliedschaftsanfragen',
    subtitle: 'Admin-gesteuerte Intake-Warteschlange zur Prufung von Bewerbern, Entscheidungen und manueller Club-Ubergabe.',
    total: 'Gesamt',
    pending: 'Ausstehend',
    approved: 'Genehmigt',
    rejected: 'Abgelehnt',
    filters: 'Filter',
    searchPlaceholder: 'Nach Bewerber oder Club suchen',
    allStatuses: 'Alle Status',
    allClubs: 'Alle Clubs',
    applyFilters: 'Filter anwenden',
    queue: 'Warteschlange',
    queueEmpty: 'Keine Anfragen passen zu den aktuellen Filtern.',
    detail: 'Anfragedetails',
    detailEmpty: 'Wahle eine Anfrage aus, um Details zu prufen und eine Entscheidung zu speichern.',
    clubLabel: 'Club',
    handoffLabel: 'Clubkontakt fur die manuelle Ubergabe',
    applicantMessage: 'Nachricht des Bewerbers',
    noApplicantMessage: 'Keine Nachricht des Bewerbers.',
    eligibilityAnswers: 'Antworten zur Eignung',
    noEligibilityAnswers: 'Es wurden keine zusatzlichen Eignungsantworten erfasst.',
    riskSignals: 'Risikohinweise',
    noRiskSignals: 'Es wurden keine strukturierten Risikometadaten erfasst.',
    approveTitle: 'Anfrage genehmigen',
    approvePlaceholder: 'Optionale Notiz, die in der Freigabe-Mail und im Benachrichtigungsverlauf erscheint.',
    approveButton: 'Anfrage genehmigen',
    rejectTitle: 'Anfrage ablehnen',
    rejectPlaceholder: 'Pflichtgrund, der in der In-App-Benachrichtigung erscheint.',
    rejectButton: 'Anfrage ablehnen',
    internalNote: 'Interne Notiz',
    internalPlaceholder: 'Fuge eine Notiz fur das Admin-Team hinzu. Sie wird nicht automatisch per E-Mail gesendet.',
    addNote: 'Notiz hinzufugen',
    reviewedAt: 'Gepruft am',
    rejectionReason: 'Ablehnungsgrund',
    decisionNote: 'Entscheidungsnotiz',
    pendingDecision: 'Diese Anfrage wartet noch auf eine Entscheidung.',
    internalNotes: 'Interne Notizen',
    noNotes: 'Noch keine Notizen.',
    communications: 'Kommunikation',
    noCommunications: 'Mit dieser Anfrage sind noch keine Kommunikationsereignisse verknupft.',
    notificationsTimeline: 'Benachrichtigungsverlauf',
    noNotifications: 'Fur diese Anfrage wurden noch keine In-App-Benachrichtigungen erfasst.',
    replayQueuedEmail: 'Warteschlangen-E-Mail erneut senden',
  },
} as const;

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

function getStatusLabel(status: string, copy: (typeof adminRequestsCopy)[keyof typeof adminRequestsCopy]) {
  if (status === 'APPROVED') return copy.approved;
  if (status === 'REJECTED') return copy.rejected;
  if (status === 'PENDING') return copy.pending;

  return status;
}

export default async function AdminRequestsPage({
  params,
  searchParams,
}: AdminRequestsPageProps) {
  const { lang } = await params;
  const copy = adminRequestsCopy[lang as keyof typeof adminRequestsCopy] ?? adminRequestsCopy.en;
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
      <AdminActionNotice status={search.actionStatus} message={search.actionMessage} />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{copy.title}</h1>
        <p className="mt-1 text-muted-foreground">
          {copy.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">{copy.total}</p>
            <p className="text-3xl font-bold">{queue.counts.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">{copy.pending}</p>
            <p className="text-3xl font-bold">{queue.counts.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">{copy.approved}</p>
            <p className="text-3xl font-bold">{queue.counts.approved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">{copy.rejected}</p>
            <p className="text-3xl font-bold">{queue.counts.rejected}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{copy.filters}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-4">
            <input type="hidden" name="requestId" value={search.requestId || ''} />
            <input
              name="query"
              defaultValue={search.query || ''}
              placeholder={copy.searchPlaceholder}
              className="rounded-xl border border-border px-4 py-2"
            />
            <select
              name="status"
              defaultValue={search.status || 'ALL'}
              className="rounded-xl border border-border px-4 py-2"
            >
              <option value="ALL">{copy.allStatuses}</option>
              <option value="PENDING">{copy.pending}</option>
              <option value="APPROVED">{copy.approved}</option>
              <option value="REJECTED">{copy.rejected}</option>
            </select>
            <select
              name="clubId"
              defaultValue={search.clubId || ''}
              className="rounded-xl border border-border px-4 py-2"
            >
              <option value="">{copy.allClubs}</option>
              {queue.clubs.map((club) => (
                <option key={club.id} value={club.id}>
                  {club.name}
                </option>
              ))}
            </select>
            <button type="submit" className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white">
              {copy.applyFilters}
            </button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>{copy.queue}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {queue.items.length === 0 ? (
              <p className="text-sm text-muted-foreground">{copy.queueEmpty}</p>
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
                      <Badge variant={badgeVariant(item.status)}>{getStatusLabel(item.status, copy)}</Badge>
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
            <CardTitle>{copy.detail}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!selectedRequest ? (
              <p className="text-sm text-muted-foreground">{copy.detailEmpty}</p>
            ) : (
              <>
                <div className="space-y-2">
                  <p className="text-lg font-semibold">{selectedRequest.user.displayName || selectedRequest.user.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedRequest.user.email}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={badgeVariant(selectedRequest.status)}>
                      {getStatusLabel(selectedRequest.status, copy)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {copy.clubLabel}: {selectedRequest.club.name} · {selectedRequest.club.neighborhood}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {copy.handoffLabel}: {selectedRequest.club.contactEmail}
                  </p>
                </div>

                <div className="space-y-2 rounded-2xl border border-border p-4">
                  <p className="text-sm font-semibold">{copy.applicantMessage}</p>
                  <p className="text-sm text-slate-700">{selectedRequest.message || copy.noApplicantMessage}</p>
                </div>

                <div className="space-y-2 rounded-2xl border border-border p-4">
                  <p className="text-sm font-semibold">{copy.eligibilityAnswers}</p>
                  {Object.keys(selectedRequest.eligibilityAnswers).length === 0 ? (
                    <p className="text-sm text-muted-foreground">{copy.noEligibilityAnswers}</p>
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

                <div className="space-y-2 rounded-2xl border border-border p-4">
                  <p className="text-sm font-semibold">{copy.riskSignals}</p>
                  {Object.keys(selectedRequest.riskSignals).length === 0 ? (
                    <p className="text-sm text-muted-foreground">{copy.noRiskSignals}</p>
                  ) : (
                    <dl className="space-y-2 text-sm">
                      {Object.entries(selectedRequest.riskSignals).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-[140px_1fr] gap-3">
                          <dt className="font-medium text-slate-600">{key}</dt>
                          <dd className="text-slate-800">{String(value)}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>

                <div className="grid gap-4">
                  {selectedRequest.status === 'PENDING' ? (
                    <>
                      <form action={approveMembershipRequestAction} className="space-y-3 rounded-2xl border border-border p-4">
                        <input type="hidden" name="requestId" value={selectedRequest.id} />
                        <input type="hidden" name="returnPath" value={returnPath} />
                        <p className="text-sm font-semibold">{copy.approveTitle}</p>
                        <textarea
                          name="note"
                          rows={3}
                          placeholder={copy.approvePlaceholder}
                          className="w-full rounded-xl border border-border px-4 py-3"
                          defaultValue={selectedRequest.appointmentNotes || ''}
                        />
                        <button type="submit" className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white">
                          {copy.approveButton}
                        </button>
                      </form>

                      <form action={rejectMembershipRequestAction} className="space-y-3 rounded-2xl border border-red-200 p-4">
                        <input type="hidden" name="requestId" value={selectedRequest.id} />
                        <input type="hidden" name="returnPath" value={returnPath} />
                        <p className="text-sm font-semibold text-red-900">{copy.rejectTitle}</p>
                        <textarea
                          name="reason"
                          rows={3}
                          required
                          placeholder={copy.rejectPlaceholder}
                          className="w-full rounded-xl border border-red-200 px-4 py-3"
                        />
                        <button type="submit" className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white">
                          {copy.rejectButton}
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="space-y-2 rounded-2xl border border-border p-4">
                      <p className="text-sm font-semibold">{copy.reviewedAt}</p>
                      <p className="text-sm text-slate-700">
                        {selectedRequest.reviewedAt ? new Date(selectedRequest.reviewedAt).toLocaleString() : copy.pendingDecision}
                      </p>
                      {selectedRequest.appointmentNotes ? (
                        <>
                          <p className="text-sm font-semibold">{copy.decisionNote}</p>
                          <p className="text-sm text-slate-700">{selectedRequest.appointmentNotes}</p>
                        </>
                      ) : null}
                      {selectedRequest.rejectionReason ? (
                        <>
                          <p className="text-sm font-semibold text-red-900">{copy.rejectionReason}</p>
                          <p className="text-sm text-red-800">{selectedRequest.rejectionReason}</p>
                        </>
                      ) : null}
                    </div>
                  )}

                  <form action={addAdminMembershipNoteAction} className="space-y-3 rounded-2xl border border-border p-4">
                    <input type="hidden" name="requestId" value={selectedRequest.id} />
                    <input type="hidden" name="returnPath" value={returnPath} />
                    <p className="text-sm font-semibold">{copy.internalNote}</p>
                    <textarea
                      name="body"
                      rows={3}
                      required
                      placeholder={copy.internalPlaceholder}
                      className="w-full rounded-xl border border-border px-4 py-3"
                    />
                    <button type="submit" className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-900">
                      {copy.addNote}
                    </button>
                  </form>
                </div>

                <div>
                  <p className="text-sm font-semibold">{copy.internalNotes}</p>
                  <div className="mt-2 space-y-2">
                    {selectedRequest.notes.length === 0 ? (
                      <p className="text-sm text-muted-foreground">{copy.noNotes}</p>
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

                <div>
                  <p className="text-sm font-semibold">{copy.communications}</p>
                  <div className="mt-2 space-y-2">
                    {selectedRequest.communicationEvents.length === 0 ? (
                      <p className="text-sm text-muted-foreground">{copy.noCommunications}</p>
                    ) : (
                      selectedRequest.communicationEvents.map((event) => (
                        <div key={event.id} className="rounded-xl border border-border p-3 text-sm">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={badgeVariant(event.status)}>{event.status}</Badge>
                            <Badge variant="secondary">{event.audience}</Badge>
                            <span className="font-medium">{event.type}</span>
                          </div>
                          <p className="mt-2 text-muted-foreground">
                            {event.recipientEmail || selectedRequest.user.email} {event.provider ? `· ${event.provider}` : ''}
                          </p>
                          {event.subject ? <p className="mt-1 text-slate-700">{event.subject}</p> : null}
                          <p className="mt-1 text-muted-foreground">{new Date(event.createdAt).toLocaleString()}</p>
                          {event.errorMessage ? <p className="mt-1 text-red-700">{event.errorMessage}</p> : null}
                          {event.outbox ? (
                            <div className="mt-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-900/40">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant={badgeVariant(event.outbox.status)}>{event.outbox.status}</Badge>
                                <Badge variant="secondary">{event.outbox.route}</Badge>
                                <span>Attempts {event.outbox.attempts}/{event.outbox.maxAttempts}</span>
                              </div>
                              {event.outbox.lastError ? <p className="mt-2 text-red-700">{event.outbox.lastError}</p> : null}
                              {['FAILED', 'SKIPPED'].includes(event.outbox.status) ? (
                                <form action={replayAdminCommunicationOutboxItem} className="mt-3">
                                  <input type="hidden" name="outboxId" value={event.outbox.id} />
                                  <input type="hidden" name="returnPath" value={returnPath} />
                                  <button type="submit" className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-900">
                                    {copy.replayQueuedEmail}
                                  </button>
                                </form>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold">{copy.notificationsTimeline}</p>
                  <div className="mt-2 space-y-2">
                    {selectedRequest.notifications.length === 0 ? (
                      <p className="text-sm text-muted-foreground">{copy.noNotifications}</p>
                    ) : (
                      selectedRequest.notifications.map((notification) => (
                        <div key={notification.id} className="rounded-xl border border-border p-3 text-sm">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={notification.isRead ? 'secondary' : 'default'}>
                              {notification.isRead ? 'Read' : 'Unread'}
                            </Badge>
                            <span className="font-medium">{notification.type}</span>
                          </div>
                          <p className="mt-2 font-medium">{notification.title}</p>
                          <p className="mt-1 text-slate-700">{notification.message}</p>
                          <p className="mt-1 text-muted-foreground">{new Date(notification.createdAt).toLocaleString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold">Stage history</p>
                  <div className="mt-2 space-y-2">
                    {selectedRequest.stageHistory.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No stage history has been recorded yet.</p>
                    ) : (
                      selectedRequest.stageHistory.map((entry) => (
                        <div key={entry.id} className="rounded-xl border border-border p-3 text-sm">
                          <p className="font-medium">{entry.stage}</p>
                          <p className="text-muted-foreground">{new Date(entry.changedAt).toLocaleString()}</p>
                          {entry.notes ? <p className="mt-1 text-slate-700">{entry.notes}</p> : null}
                        </div>
                      ))
                    )}
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
