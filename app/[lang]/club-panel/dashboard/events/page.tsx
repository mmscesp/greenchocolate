'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getManagedClubPanelOverview, type ClubPanelEventItem } from '@/app/actions/clubs';
import { useLanguage } from '@/hooks/useLanguage';
import { Calendar, ExternalLink, Loader2, MapPin, Shield, Users } from '@/lib/icons';

const clubEventsCopy = {
  en: {
    loading: 'Loading events...',
    noClubTitle: 'No managed club assigned',
    noClubDescription: 'This account is not currently linked to a club profile.',
    operationsTitle: 'Publishing workflow',
    operationsDescription:
      'Club events are visible here in real time. Publication and operational approval still flow through the platform admin team.',
    visibility: 'Visibility',
    published: 'Published',
    draft: 'Draft',
    publicPage: 'Public page',
    noUpcoming: 'No upcoming events are linked to this club yet.',
    noPast: 'No past events are recorded for this club yet.',
  },
  es: {
    loading: 'Cargando eventos...',
    noClubTitle: 'No hay un club asignado',
    noClubDescription: 'La cuenta no está vinculada a un perfil de club en este momento.',
    operationsTitle: 'Flujo de publicación',
    operationsDescription:
      'Aquí ves los eventos del club en tiempo real. La publicación y la aprobación operativa siguen pasando por el equipo admin de plataforma.',
    visibility: 'Visibilidad',
    published: 'Publicado',
    draft: 'Borrador',
    publicPage: 'Página pública',
    noUpcoming: 'Todavía no hay próximos eventos vinculados a este club.',
    noPast: 'Todavía no hay eventos pasados registrados para este club.',
  },
  fr: {
    loading: 'Chargement des evenements...',
    noClubTitle: 'Aucun club gere assigne',
    noClubDescription: 'Ce compte n est pas relie a un profil club pour le moment.',
    operationsTitle: 'Flux de publication',
    operationsDescription:
      'Les evenements du club apparaissent ici en temps reel. La publication et la validation operationnelle restent gerees par l equipe admin plateforme.',
    visibility: 'Visibilite',
    published: 'Publie',
    draft: 'Brouillon',
    publicPage: 'Page publique',
    noUpcoming: 'Aucun evenement a venir n est encore rattache a ce club.',
    noPast: 'Aucun evenement passe n est encore enregistre pour ce club.',
  },
  de: {
    loading: 'Events werden geladen...',
    noClubTitle: 'Kein verwalteter Club zugewiesen',
    noClubDescription: 'Dieses Konto ist aktuell keinem Clubprofil zugeordnet.',
    operationsTitle: 'Freigabeprozess',
    operationsDescription:
      'Hier siehst du die Club-Events in Echtzeit. Veroeffentlichung und operative Freigabe laufen weiterhin ueber das Plattform-Admin-Team.',
    visibility: 'Sichtbarkeit',
    published: 'Veroeffentlicht',
    draft: 'Entwurf',
    publicPage: 'Oeffentliche Seite',
    noUpcoming: 'Diesem Club sind noch keine kommenden Events zugeordnet.',
    noPast: 'Fuer diesen Club sind noch keine vergangenen Events erfasst.',
  },
} as const;

function EventSection({
  emptyMessage,
  events,
  language,
  label,
  visibilityLabel,
  draftLabel,
  publishedLabel,
  publicPageLabel,
}: {
  emptyMessage: string;
  events: ClubPanelEventItem[];
  language: string;
  label: string;
  visibilityLabel: string;
  draftLabel: string;
  publishedLabel: string;
  publicPageLabel: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="rounded-2xl border border-border p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{event.name}</h3>
                    <Badge variant={event.isPublished ? 'success' : 'secondary'}>
                      {event.isPublished ? publishedLabel : draftLabel}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.startDate).toLocaleString(language, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{visibilityLabel}</Badge>
                  {event.isPublished ? (
                    <Link href={`/${language}/events/${event.slug}`}>
                      <Button variant="secondary" size="sm">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {publicPageLabel}
                      </Button>
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default function EventsPage() {
  const { language, t } = useLanguage();
  const copy = clubEventsCopy[language as keyof typeof clubEventsCopy] ?? clubEventsCopy.en;
  const [overview, setOverview] = useState<Awaited<ReturnType<typeof getManagedClubPanelOverview>>>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadOverview = async () => {
      try {
        const result = await getManagedClubPanelOverview();

        if (!isMounted) {
          return;
        }

        setOverview(result);
      } catch (error) {
        console.error('Failed to load club events overview:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadOverview();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>{copy.loading}</span>
      </div>
    );
  }

  if (!overview) {
    return (
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{copy.noClubTitle}</CardTitle>
          <CardDescription>{copy.noClubDescription}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('club_panel.events.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('club_panel.events.subtitle')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">{t('club_panel.events.stats.upcoming_events')}</p>
              <p className="text-2xl font-semibold">{overview.stats.upcomingEvents}</p>
            </div>
            <Calendar className="h-6 w-6 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">{t('club_panel.events.stats.past_events')}</p>
              <p className="text-2xl font-semibold">{overview.pastEvents.length}</p>
            </div>
            <Calendar className="h-6 w-6 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">{copy.visibility}</p>
              <p className="text-2xl font-semibold">{overview.stats.publishedEvents}</p>
            </div>
            <Shield className="h-6 w-6 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">{t('club_panel.analytics.stats.total_requests')}</p>
              <p className="text-2xl font-semibold">{overview.stats.totalRequests}</p>
            </div>
            <Users className="h-6 w-6 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>{copy.operationsTitle}</CardTitle>
          <CardDescription>{copy.operationsDescription}</CardDescription>
        </CardHeader>
      </Card>

      <EventSection
        emptyMessage={copy.noUpcoming}
        events={overview.upcomingEvents}
        language={language}
        label={t('club_panel.events.sections.upcoming')}
        visibilityLabel={copy.visibility}
        draftLabel={copy.draft}
        publishedLabel={copy.published}
        publicPageLabel={copy.publicPage}
      />

      <EventSection
        emptyMessage={copy.noPast}
        events={overview.pastEvents}
        language={language}
        label={t('club_panel.events.sections.past')}
        visibilityLabel={copy.visibility}
        draftLabel={copy.draft}
        publishedLabel={copy.published}
        publicPageLabel={copy.publicPage}
      />
    </div>
  );
}
