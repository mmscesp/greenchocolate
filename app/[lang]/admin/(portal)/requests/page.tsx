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
    advanceStage: 'Advance stage / approve',
    advancePlaceholder: 'Optional internal/admin-facing notes included in the applicant update.',
    saveDecision: 'Save stage decision',
    rejectTitle: 'Reject application',
    rejectPlaceholder: 'Required rejection reason sent to the applicant.',
    rejectButton: 'Reject request',
    internalNote: 'Internal note',
    internalPlaceholder: 'Add a note for the admin team. This is not emailed automatically.',
    addNote: 'Add note',
    stageHistory: 'Stage history',
    internalNotes: 'Internal notes',
    noNotes: 'No notes yet.',
    stageDocumentVerification: 'Document verification',
    stageBackgroundCheck: 'Background check',
    stageFinalApproval: 'Final approval',
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
    advanceStage: 'Avanzar etapa / aprobar',
    advancePlaceholder: 'Notas internas opcionales incluidas en la actualizacion enviada al solicitante.',
    saveDecision: 'Guardar decision de etapa',
    rejectTitle: 'Rechazar solicitud',
    rejectPlaceholder: 'Motivo obligatorio enviado al solicitante.',
    rejectButton: 'Rechazar solicitud',
    internalNote: 'Nota interna',
    internalPlaceholder: 'Anade una nota para el equipo admin. No se envia por correo automaticamente.',
    addNote: 'Anadir nota',
    stageHistory: 'Historial de etapas',
    internalNotes: 'Notas internas',
    noNotes: 'Aun no hay notas.',
    stageDocumentVerification: 'Verificacion documental',
    stageBackgroundCheck: 'Revision de antecedentes',
    stageFinalApproval: 'Aprobacion final',
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
    advanceStage: 'Avancer l etape / approuver',
    advancePlaceholder: 'Notes internes facultatives incluses dans la mise a jour envoyee au candidat.',
    saveDecision: 'Enregistrer la decision',
    rejectTitle: 'Rejeter la demande',
    rejectPlaceholder: 'Motif obligatoire envoye au candidat.',
    rejectButton: 'Rejeter la demande',
    internalNote: 'Note interne',
    internalPlaceholder: 'Ajoutez une note pour l equipe admin. Elle n est pas envoyee automatiquement par email.',
    addNote: 'Ajouter la note',
    stageHistory: 'Historique des etapes',
    internalNotes: 'Notes internes',
    noNotes: 'Pas encore de notes.',
    stageDocumentVerification: 'Verification des documents',
    stageBackgroundCheck: 'Verification des antecedents',
    stageFinalApproval: 'Approbation finale',
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
    advanceStage: 'Stufe vorziehen / genehmigen',
    advancePlaceholder: 'Optionale interne Hinweise, die in das Bewerber-Update aufgenommen werden.',
    saveDecision: 'Stufenentscheidung speichern',
    rejectTitle: 'Anfrage ablehnen',
    rejectPlaceholder: 'Pflichtgrund, der an den Bewerber gesendet wird.',
    rejectButton: 'Anfrage ablehnen',
    internalNote: 'Interne Notiz',
    internalPlaceholder: 'Fuge eine Notiz fur das Admin-Team hinzu. Sie wird nicht automatisch per E-Mail gesendet.',
    addNote: 'Notiz hinzufugen',
    stageHistory: 'Stufenverlauf',
    internalNotes: 'Interne Notizen',
    noNotes: 'Noch keine Notizen.',
    stageDocumentVerification: 'Dokumentenprufung',
    stageBackgroundCheck: 'Hintergrundprufung',
    stageFinalApproval: 'Endgultige Freigabe',
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

function getStageLabel(stage: string, copy: (typeof adminRequestsCopy)[keyof typeof adminRequestsCopy]) {
  if (stage === 'DOCUMENT_VERIFICATION') return copy.stageDocumentVerification;
  if (stage === 'BACKGROUND_CHECK') return copy.stageBackgroundCheck;
  if (stage === 'FINAL_APPROVAL') return copy.stageFinalApproval;

  return stage;
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
                      <Badge variant="secondary">{getStageLabel(item.stage, copy)}</Badge>
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
                    <Badge variant={badgeVariant(selectedRequest.applicationStatus)}>
                      {getStatusLabel(selectedRequest.applicationStatus, copy)}
                    </Badge>
                    <Badge variant="secondary">{getStageLabel(selectedRequest.currentStage, copy)}</Badge>
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
                  <form action={advanceApplicationStageAction} className="space-y-3 rounded-2xl border border-border p-4">
                    <input type="hidden" name="requestId" value={selectedRequest.id} />
                    <input type="hidden" name="returnPath" value={returnPath} />
                    <p className="text-sm font-semibold">{copy.advanceStage}</p>
                    <select name="toStage" defaultValue={selectedRequest.currentStage} className="w-full rounded-xl border border-border px-4 py-2">
                      <option value="DOCUMENT_VERIFICATION">{copy.stageDocumentVerification}</option>
                      <option value="BACKGROUND_CHECK">{copy.stageBackgroundCheck}</option>
                      <option value="FINAL_APPROVAL">{copy.stageFinalApproval}</option>
                    </select>
                    <textarea
                      name="notes"
                      rows={3}
                      placeholder={copy.advancePlaceholder}
                      className="w-full rounded-xl border border-border px-4 py-3"
                      defaultValue={selectedRequest.appointmentNotes || ''}
                    />
                    <button type="submit" className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white">
                      {copy.saveDecision}
                    </button>
                  </form>

                  <form action={rejectApplicationAction} className="space-y-3 rounded-2xl border border-red-200 p-4">
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

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold">{copy.stageHistory}</p>
                    <div className="mt-2 space-y-2">
                      {selectedRequest.stageHistory.map((entry) => (
                        <div key={entry.id} className="rounded-xl border border-border p-3 text-sm">
                          <p className="font-medium">{getStageLabel(entry.stage, copy)}</p>
                          <p className="text-muted-foreground">{entry.changedAt.toLocaleString()}</p>
                          {entry.notes ? <p className="mt-1 text-slate-700">{entry.notes}</p> : null}
                        </div>
                      ))}
                    </div>
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
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
