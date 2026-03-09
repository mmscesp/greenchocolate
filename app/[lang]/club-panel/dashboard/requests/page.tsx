import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getClubApplications } from '@/app/actions/applications';

export const dynamic = 'force-dynamic';

const clubPanelRequestsCopy = {
  en: {
    title: 'Membership Requests',
    subtitle:
      'This queue is now admin-managed. Club accounts can review request status, but approvals and rejections happen from the platform admin portal.',
    cardTitle: 'Read-only request view',
    empty: 'No applicant requests are currently visible for this club.',
    anonymousApplicant: 'Applicant',
  },
  es: {
    title: 'Solicitudes de membresia',
    subtitle:
      'Esta cola ahora esta gestionada por admins de plataforma. Las cuentas del club pueden revisar el estado, pero las aprobaciones y rechazos se hacen desde el portal admin.',
    cardTitle: 'Vista de solicitudes en solo lectura',
    empty: 'Ahora mismo no hay solicitudes visibles para este club.',
    anonymousApplicant: 'Solicitante',
  },
  fr: {
    title: 'Demandes d adhesion',
    subtitle:
      'Cette file est desormais geree par les admins de la plateforme. Les comptes club peuvent consulter le statut, mais les approbations et rejets se font depuis le portail admin.',
    cardTitle: 'Vue en lecture seule des demandes',
    empty: 'Aucune demande visible pour ce club pour le moment.',
    anonymousApplicant: 'Candidat',
  },
  de: {
    title: 'Mitgliedschaftsanfragen',
    subtitle:
      'Diese Warteschlange wird jetzt zentral von Plattform-Admins verwaltet. Club-Konten konnen den Status sehen, Freigaben und Ablehnungen laufen aber uber das Admin-Portal.',
    cardTitle: 'Schreibgeschutzte Anfragenansicht',
    empty: 'Aktuell sind fur diesen Club keine Anfragen sichtbar.',
    anonymousApplicant: 'Antragsteller',
  },
} as const;

export default async function ClubRequestsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const copy = clubPanelRequestsCopy[lang as keyof typeof clubPanelRequestsCopy] ?? clubPanelRequestsCopy.en;
  const requests = await getClubApplications();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{copy.title}</h1>
        <p className="mt-2 text-muted-foreground">
          {copy.subtitle}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{copy.cardTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {requests.length === 0 ? (
            <p className="text-sm text-muted-foreground">{copy.empty}</p>
          ) : (
            requests.map((request) => (
              <div key={request.id} className="rounded-2xl border border-border p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{request.user.displayName || copy.anonymousApplicant}</p>
                  <Badge variant="secondary">{request.status}</Badge>
                  <Badge variant="secondary">{request.stage}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {request.club.name} · {new Date(request.createdAt).toLocaleString()}
                </p>
                {request.message ? (
                  <p className="mt-2 text-sm text-slate-700">{request.message}</p>
                ) : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
