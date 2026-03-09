'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  getCurrentManagedClubProfile,
  updateCurrentManagedClubProfile,
  type ManagedClubProfile,
} from '@/app/actions/clubs';
import { useLanguage } from '@/hooks/useLanguage';
import { AlertCircle, Loader2, MapPin, Shield } from '@/lib/icons';
import { toast } from 'sonner';

type ProfileFormState = {
  name: string;
  description: string;
  shortDescription: string;
  neighborhood: string;
  addressDisplay: string;
  contactEmail: string;
  phoneNumber: string;
  website: string;
  capacity: string;
  foundedYear: string;
};

const clubProfileCopy = {
  en: {
    loading: 'Loading club profile...',
    noClubTitle: 'No managed club assigned',
    noClubDescription:
      'This account is authenticated, but it is not currently linked to a club record. Contact platform support before using the club panel.',
    saveError: 'Failed to update the club profile. Please review the form and try again.',
    publicStatus: 'Public status',
    publicStatusDescription: 'These flags are controlled by platform operations and reflect what members can currently access.',
    summaryLabel: 'Short summary',
    summaryPlaceholder: 'A short public summary for cards and search results',
    websiteLabel: 'Website',
    mediaTitle: 'Media and publishing',
    mediaDescription:
      'Brand assets and publication flags are managed centrally. Use this page for operational profile data that already powers the public listing.',
    mediaHasAssets: 'Brand assets already exist for this listing.',
    mediaNoAssets: 'No brand assets are currently attached to this listing.',
    active: 'Active',
    inactive: 'Inactive',
    verified: 'Verified',
    unverified: 'Unverified',
    preRegistrationOpen: 'Applications open',
    preRegistrationClosed: 'Applications closed',
  },
  es: {
    loading: 'Cargando perfil del club...',
    noClubTitle: 'No hay un club asignado',
    noClubDescription:
      'La cuenta está autenticada, pero ahora mismo no está vinculada a un club. Contacta con soporte de plataforma antes de usar el panel.',
    saveError: 'No se pudo actualizar el perfil del club. Revisa el formulario e inténtalo de nuevo.',
    publicStatus: 'Estado público',
    publicStatusDescription:
      'Estas banderas las gestiona el equipo de plataforma y reflejan lo que los miembros pueden ver ahora mismo.',
    summaryLabel: 'Resumen corto',
    summaryPlaceholder: 'Un resumen breve para tarjetas públicas y resultados de búsqueda',
    websiteLabel: 'Sitio web',
    mediaTitle: 'Media y publicación',
    mediaDescription:
      'Los assets de marca y las banderas de publicación se gestionan de forma centralizada. Usa esta página para los datos operativos que ya alimentan la ficha pública.',
    mediaHasAssets: 'Ya existen assets de marca para esta ficha.',
    mediaNoAssets: 'Esta ficha todavía no tiene assets de marca asociados.',
    active: 'Activo',
    inactive: 'Inactivo',
    verified: 'Verificado',
    unverified: 'Sin verificar',
    preRegistrationOpen: 'Solicitudes abiertas',
    preRegistrationClosed: 'Solicitudes cerradas',
  },
  fr: {
    loading: 'Chargement du profil du club...',
    noClubTitle: 'Aucun club gere assigne',
    noClubDescription:
      'Le compte est authentifie, mais il n est pas relie a un club pour le moment. Contactez le support plateforme avant d utiliser ce panneau.',
    saveError: 'Impossible de mettre a jour le profil du club. Verifiez le formulaire puis reessayez.',
    publicStatus: 'Statut public',
    publicStatusDescription:
      'Ces indicateurs sont geres par l equipe plateforme et refletent ce que les membres peuvent actuellement consulter.',
    summaryLabel: 'Resume court',
    summaryPlaceholder: 'Un resume bref pour les cartes publiques et les resultats de recherche',
    websiteLabel: 'Site web',
    mediaTitle: 'Media et publication',
    mediaDescription:
      'Les assets de marque et les statuts de publication sont geres centralement. Utilisez cette page pour les donnees operationnelles deja exposees publiquement.',
    mediaHasAssets: 'Des assets de marque existent deja pour cette fiche.',
    mediaNoAssets: 'Aucun asset de marque n est encore rattache a cette fiche.',
    active: 'Actif',
    inactive: 'Inactif',
    verified: 'Verifie',
    unverified: 'Non verifie',
    preRegistrationOpen: 'Demandes ouvertes',
    preRegistrationClosed: 'Demandes fermees',
  },
  de: {
    loading: 'Clubprofil wird geladen...',
    noClubTitle: 'Kein verwalteter Club zugewiesen',
    noClubDescription:
      'Dieses Konto ist angemeldet, aber aktuell keinem Club-Datensatz zugeordnet. Kontaktiere den Plattform-Support, bevor du das Club-Panel nutzt.',
    saveError: 'Das Clubprofil konnte nicht aktualisiert werden. Bitte pruefe das Formular und versuche es erneut.',
    publicStatus: 'Oeffentlicher Status',
    publicStatusDescription:
      'Diese Kennzeichen werden vom Plattform-Team gesteuert und zeigen, was Mitglieder derzeit sehen koennen.',
    summaryLabel: 'Kurzfassung',
    summaryPlaceholder: 'Eine kurze Zusammenfassung fuer Karten und Suchergebnisse',
    websiteLabel: 'Website',
    mediaTitle: 'Medien und Freigabe',
    mediaDescription:
      'Markenassets und Freigabestatus werden zentral verwaltet. Diese Seite dient fuer operative Profildaten, die bereits in der oeffentlichen Listing-Ansicht genutzt werden.',
    mediaHasAssets: 'Fuer dieses Listing sind bereits Markenassets hinterlegt.',
    mediaNoAssets: 'Diesem Listing sind aktuell keine Markenassets zugeordnet.',
    active: 'Aktiv',
    inactive: 'Inaktiv',
    verified: 'Verifiziert',
    unverified: 'Nicht verifiziert',
    preRegistrationOpen: 'Anfragen offen',
    preRegistrationClosed: 'Anfragen geschlossen',
  },
} as const;

function toFormState(club: ManagedClubProfile): ProfileFormState {
  return {
    name: club.name,
    description: club.description,
    shortDescription: club.shortDescription ?? '',
    neighborhood: club.neighborhood,
    addressDisplay: club.addressDisplay,
    contactEmail: club.contactEmail,
    phoneNumber: club.phoneNumber ?? '',
    website: club.website ?? '',
    capacity: String(club.capacity),
    foundedYear: String(club.foundedYear),
  };
}

export default function ClubProfilePage() {
  const { language, t } = useLanguage();
  const copy = clubProfileCopy[language as keyof typeof clubProfileCopy] ?? clubProfileCopy.en;
  const [club, setClub] = useState<ManagedClubProfile | null>(null);
  const [formState, setFormState] = useState<ProfileFormState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadClubProfile = async () => {
      try {
        const managedClub = await getCurrentManagedClubProfile();

        if (!isMounted) {
          return;
        }

        setClub(managedClub);
        setFormState(managedClub ? toFormState(managedClub) : null);
      } catch (error) {
        console.error('Failed to load managed club profile:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadClubProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleFieldChange = (field: keyof ProfileFormState, value: string) => {
    setFormState((previous) => (previous ? { ...previous, [field]: value } : previous));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState) {
      return;
    }

    setIsSaving(true);

    try {
      const result = await updateCurrentManagedClubProfile({
        ...formState,
        capacity: Number(formState.capacity),
        foundedYear: Number(formState.foundedYear),
      });

      if (!result.success || !result.club) {
        toast.error(result.message || copy.saveError);
        return;
      }

      setClub(result.club);
      setFormState(toFormState(result.club));
      toast.success(t('club_panel.profile.toast.updated'));
    } catch (error) {
      console.error('Failed to update club profile:', error);
      toast.error(copy.saveError);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>{copy.loading}</span>
      </div>
    );
  }

  if (!club || !formState) {
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
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('club_panel.profile.title')}</h1>
        <p className="text-muted-foreground">{t('club_panel.profile.subtitle')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            {copy.publicStatus}
          </CardTitle>
          <CardDescription>{copy.publicStatusDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Badge variant={club.isVerified ? 'success' : 'secondary'}>
            {club.isVerified ? copy.verified : copy.unverified}
          </Badge>
          <Badge variant={club.isActive ? 'secondary' : 'outline'}>
            {club.isActive ? copy.active : copy.inactive}
          </Badge>
          <Badge variant={club.allowsPreRegistration ? 'secondary' : 'outline'}>
            {club.allowsPreRegistration ? copy.preRegistrationOpen : copy.preRegistrationClosed}
          </Badge>
          <Badge variant="outline">
            <MapPin className="mr-1 h-3 w-3" />
            {club.cityName}
          </Badge>
        </CardContent>
      </Card>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>{t('club_panel.profile.general.title')}</CardTitle>
            <CardDescription>{t('club_panel.profile.general.description')}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="club-name">{t('club_panel.profile.general.club_name')}</Label>
              <Input
                id="club-name"
                value={formState.name}
                onChange={(event) => handleFieldChange('name', event.target.value)}
                disabled={isSaving}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="club-founded-year">{t('club_panel.profile.general.founded_year')}</Label>
              <Input
                id="club-founded-year"
                type="number"
                value={formState.foundedYear}
                onChange={(event) => handleFieldChange('foundedYear', event.target.value)}
                disabled={isSaving}
                min={1900}
                max={new Date().getFullYear()}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="club-description">{t('club_panel.profile.general.description_label')}</Label>
              <Textarea
                id="club-description"
                value={formState.description}
                onChange={(event) => handleFieldChange('description', event.target.value)}
                disabled={isSaving}
                rows={6}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="club-short-description">{copy.summaryLabel}</Label>
              <Textarea
                id="club-short-description"
                value={formState.shortDescription}
                onChange={(event) => handleFieldChange('shortDescription', event.target.value)}
                disabled={isSaving}
                rows={3}
                placeholder={copy.summaryPlaceholder}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="club-capacity">{t('club_panel.profile.general.member_capacity')}</Label>
              <Input
                id="club-capacity"
                type="number"
                value={formState.capacity}
                onChange={(event) => handleFieldChange('capacity', event.target.value)}
                disabled={isSaving}
                min={1}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('club_panel.profile.location.title')}</CardTitle>
            <CardDescription>{t('club_panel.profile.location.description')}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="club-address">{t('club_panel.profile.location.address')}</Label>
              <Input
                id="club-address"
                value={formState.addressDisplay}
                onChange={(event) => handleFieldChange('addressDisplay', event.target.value)}
                disabled={isSaving}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="club-neighborhood">{t('club_panel.profile.location.neighborhood')}</Label>
              <Input
                id="club-neighborhood"
                value={formState.neighborhood}
                onChange={(event) => handleFieldChange('neighborhood', event.target.value)}
                disabled={isSaving}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="club-contact-email">{t('club_panel.profile.location.contact_email')}</Label>
              <Input
                id="club-contact-email"
                type="email"
                value={formState.contactEmail}
                onChange={(event) => handleFieldChange('contactEmail', event.target.value)}
                disabled={isSaving}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="club-phone">{t('club_panel.profile.location.phone_number')}</Label>
              <Input
                id="club-phone"
                value={formState.phoneNumber}
                onChange={(event) => handleFieldChange('phoneNumber', event.target.value)}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="club-website">{copy.websiteLabel}</Label>
              <Input
                id="club-website"
                type="url"
                value={formState.website}
                onChange={(event) => handleFieldChange('website', event.target.value)}
                disabled={isSaving}
                placeholder="https://"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>{copy.mediaTitle}</CardTitle>
            <CardDescription>{copy.mediaDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex items-start gap-3 text-sm text-muted-foreground">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              {club.coverImageUrl || club.logoUrl ? copy.mediaHasAssets : copy.mediaNoAssets}
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving} className="min-w-40">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('club_panel.profile.saving')}
              </>
            ) : (
              t('common.save_changes')
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
