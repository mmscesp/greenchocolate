import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Club } from '@/lib/types';
import { getClubPrimaryMediaImage, type ClubMediaItem } from '@/lib/club-media';
import { getProfileLocationLabel, sanitizePublicClubCopy, sanitizePublicLocationText } from '@/lib/public-club-safety';
import { Shield, MapPin, AlertTriangle, ClipboardCheck, ArrowRight } from '@/lib/icons';

interface UnverifiedClubProfileContentProps {
  club: Club;
  mediaItems: ClubMediaItem[];
  lang: string;
}

type SupportedLocale = 'en' | 'es' | 'fr' | 'de';

interface UnverifiedClubCopy {
  pendingReview: string;
  heroAlt: string;
  cityName: string;
  publicListingLabel: string;
  publicListingDescription: string;
  heroIntro: string;
  whatScmKnowsTitle: string;
  whatScmKnowsBody: string;
  neighborhoodLabel: string;
  publicDataReviewedLabel: string;
  whatScmHasNotVerifiedTitle: string;
  whatScmHasNotVerifiedBody: string;
  safetyAndLegalContextTitle: string;
  safetyAndLegalContextBody: string;
  legalDisclaimer: string;
  startSafelyTitle: string;
  startSafelyBody: string;
  openSafetyKit: string;
  trustSpineTitle: string;
  barcelonaGuide: string;
  legalGuides: string;
  howScmVerifies: string;
  requestCorrectionTitle: string;
  requestCorrectionBody: string;
  correctThisListing: string;
}

const localeMap: Record<SupportedLocale, string> = {
  en: 'en-GB',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
};

const copy: Record<SupportedLocale, UnverifiedClubCopy> = {
  en: {
    pendingReview: 'Pending editorial review',
    heroAlt: 'Editorial illustration for {{neighborhood}}, Barcelona',
    cityName: 'Barcelona',
    publicListingLabel: 'Public Listing',
    publicListingDescription:
      'A public research listing that has not completed SCM’s on-site verification review. Use it as a starting point, not as a recommendation or promise of access.',
    heroIntro:
      '{{clubName}} appears in SCM as a public profile for {{location}}. This page helps you understand what is publicly known, what remains unchecked, and which safety context to read before you rely on any club listing.',
    whatScmKnowsTitle: 'What SCM knows',
    whatScmKnowsBody:
      'Use this profile to separate basic public signals from verified trust signals. SCM may know the club name, the Barcelona area, and a public map reference when one is available. That helps orientation, but it does not confirm association status, current operations, or member onboarding quality.',
    neighborhoodLabel: 'Neighborhood',
    publicDataReviewedLabel: 'Public data reviewed',
    whatScmHasNotVerifiedTitle: 'What SCM has not verified',
    whatScmHasNotVerifiedBody:
      'SCM has not completed an on-site verification review for this listing. We have not confirmed its association registry status, house rules, controlled-access posture, onboarding process, or current operating conditions.',
    safetyAndLegalContextTitle: 'Safety and legal context',
    safetyAndLegalContextBody:
      'Cannabis social clubs in Spain operate in a complex legal environment. Public possession or consumption can carry administrative fines, and clubs that behave like public retail venues face materially higher scrutiny. Treat any public listing as a starting point for research, not as a promise of access or legal certainty.',
    legalDisclaimer:
      'SCM provides information, not legal advice. The legal landscape for cannabis social clubs in Spain is complex and evolving. Always verify club status independently and consult local legal resources if in doubt.',
    startSafelyTitle: 'Start safely',
    startSafelyBody: 'Before relying on any listing, read the public safety and legal context first.',
    openSafetyKit: 'Open Safety Kit',
    trustSpineTitle: 'Trust spine',
    barcelonaGuide: 'Barcelona guide',
    legalGuides: 'Legal guides',
    howScmVerifies: 'How SCM verifies',
    requestCorrectionTitle: 'Request a correction',
    requestCorrectionBody:
      'Operators or readers can request a correction, review, or removal. SCM reviews listing issues as a priority.',
    correctThisListing: 'Correct this listing',
  },
  es: {
    pendingReview: 'Revisión editorial pendiente',
    heroAlt: 'Ilustración editorial de {{neighborhood}}, Barcelona',
    cityName: 'Barcelona',
    publicListingLabel: 'Listado público',
    publicListingDescription:
      'Un listado público de investigación que aún no ha completado la revisión presencial de SCM. Úsalo como punto de partida, no como recomendación ni promesa de acceso.',
    heroIntro:
      '{{clubName}} aparece en SCM como perfil público de {{location}}. Esta página te ayuda a distinguir qué se sabe públicamente, qué queda sin comprobar y qué contexto de seguridad conviene leer antes de confiar en cualquier listado.',
    whatScmKnowsTitle: 'Lo que SCM sabe',
    whatScmKnowsBody:
      'Usa este perfil para separar señales públicas básicas de señales de confianza verificadas. SCM puede conocer el nombre del club, la zona de Barcelona y una referencia pública de mapa cuando existe. Eso orienta, pero no confirma el estado asociativo, la actividad actual ni la calidad del proceso de admisión.',
    neighborhoodLabel: 'Barrio',
    publicDataReviewedLabel: 'Datos públicos revisados',
    whatScmHasNotVerifiedTitle: 'Lo que SCM no ha verificado',
    whatScmHasNotVerifiedBody:
      'SCM no ha completado una revisión de verificación presencial para este listado. No hemos confirmado su estado en el registro de asociaciones, normas internas, postura de acceso controlado, proceso de admisión ni condiciones operativas actuales.',
    safetyAndLegalContextTitle: 'Contexto legal y de seguridad',
    safetyAndLegalContextBody:
      'Los cannabis social clubs en España operan en un entorno legal complejo. La posesión o el consumo en espacios públicos pueden conllevar multas administrativas, y los clubes que se comportan como locales de venta abierta afrontan un nivel de escrutinio significativamente mayor. Trata cualquier listado público como un punto de partida para investigar, no como una promesa de acceso o certeza legal.',
    legalDisclaimer:
      'SCM ofrece información, no asesoramiento legal. El marco legal de los cannabis social clubs en España es complejo y evoluciona constantemente. Verifica siempre el estado del club por tu cuenta y consulta recursos legales locales si tienes dudas.',
    startSafelyTitle: 'Empieza con seguridad',
    startSafelyBody: 'Antes de confiar en cualquier listado, revisa primero el contexto público de seguridad y legalidad.',
    openSafetyKit: 'Abrir Safety Kit',
    trustSpineTitle: 'Base de confianza',
    barcelonaGuide: 'Guía de Barcelona',
    legalGuides: 'Guías legales',
    howScmVerifies: 'Cómo verifica SCM',
    requestCorrectionTitle: 'Solicitar una corrección',
    requestCorrectionBody:
      'Operadores o lectores pueden solicitar una corrección, revisión o eliminación. SCM prioriza la revisión de incidencias en listados.',
    correctThisListing: 'Corregir este listado',
  },
  fr: {
    pendingReview: 'Revue éditoriale en attente',
    heroAlt: 'Illustration éditoriale pour {{neighborhood}}, Barcelone',
    cityName: 'Barcelone',
    publicListingLabel: 'Listing public',
    publicListingDescription:
      'Un listing public de recherche qui n’a pas encore terminé la vérification sur site de SCM. Utilisez-le comme point de départ, pas comme recommandation ni promesse d’accès.',
    heroIntro:
      '{{clubName}} apparaît sur SCM comme profil public pour {{location}}. Cette page vous aide à distinguer les informations publiques connues, les points non vérifiés et le contexte de sécurité à lire avant de vous fier à un listing.',
    whatScmKnowsTitle: 'Ce que SCM sait',
    whatScmKnowsBody:
      'Utilisez ce profil pour séparer les signaux publics de base des vrais signaux de confiance vérifiés. SCM peut connaître le nom du club, la zone de Barcelone et une référence cartographique publique lorsqu’elle existe. Cela aide à s’orienter, mais ne confirme ni le statut associatif, ni l’activité actuelle, ni la qualité du processus d’admission.',
    neighborhoodLabel: 'Quartier',
    publicDataReviewedLabel: 'Données publiques vérifiées',
    whatScmHasNotVerifiedTitle: 'Ce que SCM n\'a pas vérifié',
    whatScmHasNotVerifiedBody:
      'SCM n\'a pas encore terminé une vérification sur site pour cette fiche. Nous n\'avons pas confirmé son statut au registre des associations, son règlement interne, sa posture d\'accès contrôlé, son processus d\'onboarding ni ses conditions d\'exploitation actuelles.',
    safetyAndLegalContextTitle: 'Contexte juridique et sécurité',
    safetyAndLegalContextBody:
      'Les cannabis social clubs en Espagne évoluent dans un cadre juridique complexe. La possession ou la consommation en public peut entraîner des amendes administratives, et les clubs qui se comportent comme des commerces ouverts font face à un niveau de contrôle sensiblement plus élevé. Considérez tout listing public comme un point de départ pour vos recherches, pas comme une promesse d accès ou de certitude juridique.',
    legalDisclaimer:
      'SCM fournit des informations, pas des conseils juridiques. Le cadre légal des cannabis social clubs en Espagne est complexe et en évolution. Vérifiez toujours le statut du club de façon indépendante et consultez des ressources juridiques locales en cas de doute.',
    startSafelyTitle: 'Commencez en sécurité',
    startSafelyBody: 'Avant de vous fier à un listing, lisez d\'abord le contexte public de sécurité et de droit.',
    openSafetyKit: 'Ouvrir le Safety Kit',
    trustSpineTitle: 'Socle de confiance',
    barcelonaGuide: 'Guide de Barcelone',
    legalGuides: 'Guides juridiques',
    howScmVerifies: 'Comment SCM vérifie',
    requestCorrectionTitle: 'Demander une correction',
    requestCorrectionBody:
      'Les opérateurs comme les lecteurs peuvent demander une correction, une revue ou un retrait. SCM traite les problèmes de listing en priorité.',
    correctThisListing: 'Corriger cette fiche',
  },
  de: {
    pendingReview: 'Redaktionelle Prüfung ausstehend',
    heroAlt: 'Redaktionelle Illustration für {{neighborhood}}, Barcelona',
    cityName: 'Barcelona',
    publicListingLabel: 'Öffentliches Listing',
    publicListingDescription:
      'Ein öffentliches Recherche-Listing ohne abgeschlossene SCM-Prüfung vor Ort. Nutze es als Ausgangspunkt, nicht als Empfehlung oder Zugangsversprechen.',
    heroIntro:
      '{{clubName}} erscheint bei SCM als öffentliches Profil für {{location}}. Diese Seite hilft dir zu verstehen, was öffentlich bekannt ist, was ungeprüft bleibt und welchen Sicherheitskontext du lesen solltest, bevor du dich auf ein Listing verlässt.',
    whatScmKnowsTitle: 'Was SCM weiß',
    whatScmKnowsBody:
      'Nutze dieses Profil, um einfache öffentliche Signale von verifizierten Vertrauenssignalen zu trennen. SCM kennt möglicherweise den Clubnamen, den Bereich in Barcelona und - falls vorhanden - einen öffentlichen Kartenverweis. Das hilft bei der Orientierung, bestätigt aber weder Vereinsstatus, aktuellen Betrieb noch Qualität des Aufnahmeprozesses.',
    neighborhoodLabel: 'Viertel',
    publicDataReviewedLabel: 'Öffentliche Daten geprüft',
    whatScmHasNotVerifiedTitle: 'Was SCM nicht verifiziert hat',
    whatScmHasNotVerifiedBody:
      'SCM hat für diesen Eintrag noch keine Vor-Ort-Verifizierungsprüfung abgeschlossen. Wir haben weder den Status im Vereinsregister, noch Hausregeln, Zugangskontrollen, Aufnahmeprozess oder aktuelle Betriebsbedingungen bestätigt.',
    safetyAndLegalContextTitle: 'Sicherheits- und Rechtskontext',
    safetyAndLegalContextBody:
      'Cannabis Social Clubs in Spanien bewegen sich in einem komplexen rechtlichen Umfeld. Öffentlicher Besitz oder Konsum kann zu Verwaltungsstrafen führen, und Clubs mit offenem Verkaufscharakter stehen unter deutlich höherer Kontrolle. Behandle jedes öffentliche Profil als Ausgangspunkt für eigene Recherche, nicht als Zugangsversprechen oder rechtliche Sicherheit.',
    legalDisclaimer:
      'SCM stellt Informationen bereit, keine Rechtsberatung. Die Rechtslage zu Cannabis Social Clubs in Spanien ist komplex und verändert sich. Prüfe den Clubstatus immer eigenständig und ziehe bei Unsicherheit lokale Rechtsquellen hinzu.',
    startSafelyTitle: 'Sicher starten',
    startSafelyBody: 'Bevor du dich auf ein Profil verlässt, lies zuerst den öffentlichen Sicherheits- und Rechtskontext.',
    openSafetyKit: 'Safety Kit öffnen',
    trustSpineTitle: 'Vertrauensbasis',
    barcelonaGuide: 'Barcelona-Leitfaden',
    legalGuides: 'Rechtsleitfäden',
    howScmVerifies: 'Wie SCM verifiziert',
    requestCorrectionTitle: 'Korrektur anfordern',
    requestCorrectionBody:
      'Betreiber oder Leser können eine Korrektur, Überprüfung oder Entfernung anfordern. SCM priorisiert die Prüfung von Listing-Problemen.',
    correctThisListing: 'Dieses Profil korrigieren',
  },
};

const resolveLocale = (lang: string): SupportedLocale => {
  if (lang === 'es' || lang === 'fr' || lang === 'de') {
    return lang;
  }
  return 'en';
};

export default function UnverifiedClubProfileContent({
  club,
  mediaItems,
  lang,
}: UnverifiedClubProfileContentProps) {
  const locale = resolveLocale(lang);
  const c = copy[locale];
  const heroImage = getClubPrimaryMediaImage(mediaItems);
  const statusLabel = c.publicListingLabel;
  const statusDescription = c.publicListingDescription;
  const safeNeighborhood = sanitizePublicLocationText(club.neighborhood);
  const safeDistrict = sanitizePublicLocationText(club.district);
  const profileLocation = getProfileLocationLabel({ neighborhood: club.neighborhood, cityName: c.cityName });
  const profileDescription = sanitizePublicClubCopy(
    c.heroIntro
      .replace('{{clubName}}', club.name)
      .replace('{{location}}', profileLocation),
    safeNeighborhood ?? c.cityName
  );
  const reviewedAt = club.publicDataReviewedAt
    ? new Intl.DateTimeFormat(localeMap[locale], { month: 'long', year: 'numeric' }).format(club.publicDataReviewedAt)
    : c.pendingReview;

  return (
    <main className="min-h-screen bg-bg-base text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={c.heroAlt.replace('{{neighborhood}}', safeNeighborhood ?? c.cityName)}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/65 to-bg-base/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.18),transparent_40%)]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pt-36">
          <div className="max-w-3xl">
            <Badge className="mb-5 border-amber-400/30 bg-amber-400/10 text-amber-100 hover:bg-amber-400/10">
              {statusLabel}
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">{club.name}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-zinc-300">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand" />
                {profileLocation}
              </span>
              {safeDistrict ? <span className="text-zinc-500">/ {safeDistrict}</span> : null}
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-amber-100/80">
              {statusDescription}
            </p>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              {profileDescription}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <div className="space-y-6">
          <article className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur md:p-8">
            <div className="mb-4 flex items-center gap-3">
              <ClipboardCheck className="h-5 w-5 text-brand" />
              <h2 className="text-xl font-semibold">{c.whatScmKnowsTitle}</h2>
            </div>
            <p className="leading-7 text-zinc-300">
              {c.whatScmKnowsBody}
            </p>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-bg-base/60 p-4">
                <dt className="text-xs uppercase tracking-[0.18em] text-zinc-500">{c.neighborhoodLabel}</dt>
                <dd className="mt-2 font-medium text-white">{safeNeighborhood ?? profileLocation}</dd>
              </div>
              <div className="rounded-2xl border border-white/10 bg-bg-base/60 p-4">
                <dt className="text-xs uppercase tracking-[0.18em] text-zinc-500">{c.publicDataReviewedLabel}</dt>
                <dd className="mt-2 font-medium text-white">{reviewedAt}</dd>
              </div>
            </dl>
          </article>

          <article className="rounded-[2rem] border border-amber-400/20 bg-amber-400/[0.06] p-6 md:p-8">
            <div className="mb-4 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-200" />
              <h2 className="text-xl font-semibold">{c.whatScmHasNotVerifiedTitle}</h2>
            </div>
            <p className="leading-7 text-amber-50/85">{c.whatScmHasNotVerifiedBody}</p>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 md:p-8">
            <h2 className="text-xl font-semibold">{c.safetyAndLegalContextTitle}</h2>
            <p className="mt-4 leading-7 text-zinc-300">{c.safetyAndLegalContextBody}</p>
            <p className="mt-4 text-sm leading-6 text-zinc-500">{c.legalDisclaimer}</p>
          </article>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[2rem] border border-brand/25 bg-brand/10 p-6">
            <Shield className="mb-4 h-7 w-7 text-brand" />
            <h2 className="text-lg font-semibold">{c.startSafelyTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300">{c.startSafelyBody}</p>
            <Button asChild className="mt-5 w-full rounded-full">
              <Link href={`/${lang}/safety-kit`}>
                {c.openSafetyKit}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
            <h2 className="text-lg font-semibold">{c.trustSpineTitle}</h2>
            <div className="mt-4 grid gap-2">
              <Button asChild variant="secondary" className="justify-start rounded-full">
                <Link href={`/${lang}/spain/barcelona`}>{c.barcelonaGuide}</Link>
              </Button>
              <Button asChild variant="secondary" className="justify-start rounded-full">
                <Link href={`/${lang}/editorial/legal`}>{c.legalGuides}</Link>
              </Button>
              <Button asChild variant="secondary" className="justify-start rounded-full">
                <Link href={`/${lang}/verification`}>{c.howScmVerifies}</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
            <h2 className="text-lg font-semibold">{c.requestCorrectionTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{c.requestCorrectionBody}</p>
            <Button asChild variant="secondary" className="mt-5 w-full rounded-full">
              <Link href={`/${lang}/contact?category=listing-correction&club=${club.slug}`}>
                {c.correctThisListing}
              </Link>
            </Button>
          </div>
        </aside>
      </section>
    </main>
  );
}
