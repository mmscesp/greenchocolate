'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/admin/StatsCard';
import { Badge } from '@/components/ui/badge';
import { getManagedClubPanelOverview } from '@/app/actions/clubs';
import { useLanguage } from '@/hooks/useLanguage';
import {
  BarChart3,
  Calendar,
  Heart,
  Loader2,
  Shield,
  Star,
  Users,
} from '@/lib/icons';

const clubAnalyticsCopy = {
  en: {
    loading: 'Loading analytics...',
    noClubTitle: 'No managed club assigned',
    noClubDescription: 'This account is not currently linked to a club profile.',
    statusTitle: 'Operational summary',
    statusDescription:
      'These metrics are sourced from live club, membership, favorites, review, and event records. They are intended for operational QA rather than marketing vanity metrics.',
    averageRatingFallback: 'No public rating yet',
    recentRequests: 'Recent requests',
    recentEvents: 'Recent events',
    noRecentRequests: 'No membership requests are visible yet.',
    noRecentEvents: 'No events are linked to this club yet.',
    favorites: 'Favorites',
    applicant: 'Applicant',
    published: 'Published',
    draft: 'Draft',
    pendingTrend: 'pending',
    reviewsTrend: 'public reviews',
  },
  es: {
    loading: 'Cargando analítica...',
    noClubTitle: 'No hay un club asignado',
    noClubDescription: 'La cuenta no está vinculada a un perfil de club en este momento.',
    statusTitle: 'Resumen operativo',
    statusDescription:
      'Estas métricas salen de registros reales de club, membresías, favoritos, reseñas y eventos. Están pensadas para QA operativo y no para vanity metrics de marketing.',
    averageRatingFallback: 'Todavía no hay valoración pública',
    recentRequests: 'Solicitudes recientes',
    recentEvents: 'Eventos recientes',
    noRecentRequests: 'Todavía no hay solicitudes visibles.',
    noRecentEvents: 'Todavía no hay eventos vinculados a este club.',
    favorites: 'Favoritos',
    applicant: 'Solicitante',
    published: 'Publicado',
    draft: 'Borrador',
    pendingTrend: 'pendientes',
    reviewsTrend: 'reseñas públicas',
  },
  fr: {
    loading: 'Chargement de l analytique...',
    noClubTitle: 'Aucun club gere assigne',
    noClubDescription: 'Ce compte n est pas relie a un profil club pour le moment.',
    statusTitle: 'Resume operationnel',
    statusDescription:
      'Ces metriques proviennent des enregistrements reels du club, des demandes, des favoris, des avis et des evenements. Elles servent au suivi operationnel plutot qu a des vanity metrics.',
    averageRatingFallback: 'Aucune note publique pour le moment',
    recentRequests: 'Demandes recentes',
    recentEvents: 'Evenements recents',
    noRecentRequests: 'Aucune demande visible pour le moment.',
    noRecentEvents: 'Aucun evenement n est encore lie a ce club.',
    favorites: 'Favoris',
    applicant: 'Candidat',
    published: 'Publie',
    draft: 'Brouillon',
    pendingTrend: 'en attente',
    reviewsTrend: 'avis publics',
  },
  de: {
    loading: 'Analytik wird geladen...',
    noClubTitle: 'Kein verwalteter Club zugewiesen',
    noClubDescription: 'Dieses Konto ist aktuell keinem Clubprofil zugeordnet.',
    statusTitle: 'Operative Zusammenfassung',
    statusDescription:
      'Diese Kennzahlen stammen aus Live-Daten zu Club, Anfragen, Favoriten, Bewertungen und Events. Sie dienen der operativen QA und nicht als Marketing-Vanity-Metrik.',
    averageRatingFallback: 'Noch keine oeffentliche Bewertung',
    recentRequests: 'Aktuelle Anfragen',
    recentEvents: 'Aktuelle Events',
    noRecentRequests: 'Noch keine sichtbaren Mitgliedschaftsanfragen.',
    noRecentEvents: 'Diesem Club sind noch keine Events zugeordnet.',
    favorites: 'Favoriten',
    applicant: 'Antragsteller',
    published: 'Veroeffentlicht',
    draft: 'Entwurf',
    pendingTrend: 'offen',
    reviewsTrend: 'oeffentliche Bewertungen',
  },
} as const;

export default function AnalyticsPage() {
  const { language, t } = useLanguage();
  const copy = clubAnalyticsCopy[language as keyof typeof clubAnalyticsCopy] ?? clubAnalyticsCopy.en;
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
        console.error('Failed to load club analytics overview:', error);
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
        <h1 className="text-3xl font-bold tracking-tight">{t('club_panel.analytics.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('club_panel.analytics.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title={t('club_panel.analytics.stats.total_requests')}
          value={overview.stats.totalRequests}
          icon={Users}
          color="blue"
          trend={`${overview.stats.pendingRequests} ${copy.pendingTrend}`}
        />
        <StatsCard
          title={t('club_panel.analytics.stats.average_rating')}
          value={overview.stats.averageRating ?? copy.averageRatingFallback}
          icon={Star}
          color="orange"
          trend={`${overview.stats.publicReviews} ${copy.reviewsTrend}`}
        />
        <StatsCard
          title={t('club_panel.events.stats.upcoming_events')}
          value={overview.stats.upcomingEvents}
          icon={Calendar}
          color="green"
          trend={`${overview.stats.publishedEvents} published`}
        />
        <StatsCard
          title={copy.favorites}
          value={overview.stats.favoritesCount}
          icon={Heart}
          color="purple"
          trend={`${overview.club.cityName}`}
        />
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            {copy.statusTitle}
          </CardTitle>
          <CardDescription>{copy.statusDescription}</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              {copy.recentRequests}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {overview.recentRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground">{copy.noRecentRequests}</p>
            ) : (
              overview.recentRequests.map((request) => (
                <div key={request.id} className="rounded-2xl border border-border p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{request.applicantName || copy.applicant}</p>
                    <Badge variant="secondary">{request.status}</Badge>
                    <Badge variant="outline">{request.currentStage}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {new Date(request.createdAt).toLocaleString(language)}
                  </p>
                  {request.message ? (
                    <p className="mt-2 text-sm text-muted-foreground">{request.message}</p>
                  ) : null}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              {copy.recentEvents}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {overview.upcomingEvents.length === 0 && overview.pastEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">{copy.noRecentEvents}</p>
            ) : (
              [...overview.upcomingEvents, ...overview.pastEvents].slice(0, 6).map((event) => (
                <div key={event.id} className="rounded-2xl border border-border p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{event.name}</p>
                    <Badge variant={event.isPublished ? 'success' : 'secondary'}>
                      {event.isPublished ? copy.published : copy.draft}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {new Date(event.startDate).toLocaleString(language)}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{event.location}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
