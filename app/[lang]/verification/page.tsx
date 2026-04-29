import Link from 'next/link';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { H1, H2, H3, Lead, Text, Eyebrow } from '@/components/typography';
import { ArrowRight, Building2, CheckCircle2, FileSearch, LockKey, Scale, Shield } from '@/lib/icons';
import type { Locale } from '@/lib/i18n-config';
import {
  buildBreadcrumbJsonLd,
  buildLocalizedMetadata,
  isLocale,
  toAbsoluteUrl,
} from '@/lib/seo';

interface VerificationPageProps {
  params: Promise<{ lang: string }>;
}

interface VerificationPillar {
  title: string;
  body: string;
}

interface VerificationLink {
  href: string;
  label: string;
}

interface VerificationCopy {
  title: string;
  lead: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  whyTitle: string;
  whyBody: string;
  ctaPrimary: string;
  ctaSecondary: string;
  legalTitle: string;
  legalBody: string;
  linksTitle: string;
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  pillars: VerificationPillar[];
  trustLinks: VerificationLink[];
}

const copy = {
  en: {
    title: 'The SCM Verification Standard',
    lead: 'A small verified set beats a giant unvetted list. SCM evaluates public trust signals before a club belongs in the verified public layer.',
    metaTitle: 'SCM Verification Standard | How We Evaluate Cannabis Social Clubs',
    metaDescription:
      'See how SocialClubsMaps evaluates cannabis social clubs in Spain using registry, house-rule, premises, and onboarding signals.',
    eyebrow: 'Independent trust standard',
    whyTitle: 'What verification means here',
    whyBody:
      'Verification is not a legal guarantee, a promise of entry, or a commercial endorsement. It is SCM’s public method for separating stronger trust signals from weak, noisy, or public-facing club behavior.',
    ctaPrimary: 'Get the Safety Kit',
    ctaSecondary: 'Browse Directory',
    legalTitle: 'What SCM does not claim',
    legalBody:
      'SCM does not operate clubs, sell cannabis, guarantee outcomes, or replace legal advice. The goal is better public information, safer expectations, and a clearer way to understand the private association model.',
    linksTitle: 'Use the standard with the rest of the trust stack',
    breadcrumbHome: 'Home',
    breadcrumbCurrent: 'Verification Standard',
    pillars: [
      {
        title: 'Association registry status',
        body: 'Does the association structure look real, current, and documented enough to support public trust?',
      },
      {
        title: 'Statutes and house-rule alignment',
        body: 'Do the rules and public posture still fit the private association model rather than open retail behavior?',
      },
      {
        title: 'Premises and controlled access',
        body: 'Does the physical setup communicate discretion, member control, and a non-public access posture?',
      },
      {
        title: 'Safe member onboarding process',
        body: 'Does the intake process feel responsible, documented, and slow enough to avoid shortcut-driven risk?',
      },
    ],
    trustLinks: [
      { href: '/clubs', label: 'Directory' },
      { href: '/safety-kit', label: 'Safety Kit' },
      { href: '/editorial/legal', label: 'Legal Guides' },
      { href: '/mission', label: 'Mission' },
    ],
  },
  es: {
    title: 'El estándar de verificación de SCM',
    lead: 'Un conjunto pequeño y verificado vale más que una lista enorme sin revisar. SCM evalúa señales públicas de confianza antes de incluir un club en la capa pública verificada.',
    metaTitle: 'Estándar de verificación SCM | Cómo evaluamos cannabis social clubs',
    metaDescription:
      'Consulta cómo SocialClubsMaps evalúa cannabis social clubs en España usando señales de registro, normas internas, local y proceso de admisión.',
    eyebrow: 'Estándar independiente de confianza',
    whyTitle: 'Qué significa verificar aquí',
    whyBody:
      'La verificación no es una garantía legal, una promesa de entrada ni un respaldo comercial. Es el método público de SCM para separar señales de confianza sólidas de comportamientos débiles, ruidosos o demasiado públicos.',
    ctaPrimary: 'Consigue el Safety Kit',
    ctaSecondary: 'Ver directorio',
    legalTitle: 'Lo que SCM no afirma',
    legalBody:
      'SCM no opera clubes, no vende cannabis, no garantiza resultados y no sustituye el asesoramiento legal. El objetivo es ofrecer mejor información pública, expectativas más seguras y una forma más clara de entender el modelo de asociación privada.',
    linksTitle: 'Usa el estándar con el resto del sistema de confianza',
    breadcrumbHome: 'Inicio',
    breadcrumbCurrent: 'Estándar de verificación',
    pillars: [
      {
        title: 'Estado del registro de la asociación',
        body: '¿La estructura de la asociación parece real, vigente y lo bastante documentada para sostener confianza pública?',
      },
      {
        title: 'Alineación de estatutos y normas internas',
        body: '¿Las reglas y la postura pública siguen encajando con el modelo de asociación privada y no con un comportamiento de venta abierta?',
      },
      {
        title: 'Local y acceso controlado',
        body: '¿El espacio físico transmite discreción, control de miembros y una postura de acceso no público?',
      },
      {
        title: 'Proceso seguro de admisión de miembros',
        body: '¿El proceso de admisión se percibe responsable, documentado y lo bastante gradual como para evitar riesgos por atajos?',
      },
    ],
    trustLinks: [
      { href: '/clubs', label: 'Directorio' },
      { href: '/safety-kit', label: 'Safety Kit' },
      { href: '/editorial/legal', label: 'Guías legales' },
      { href: '/mission', label: 'Misión' },
    ],
  },
  fr: {
    title: 'Le standard de vérification SCM',
    lead: 'Un petit ensemble vérifié vaut mieux qu\'une grande liste non contrôlée. SCM évalue les signaux publics de confiance avant qu\'un club n\'entre dans la couche publique vérifiée.',
    metaTitle: 'Standard de vérification SCM | Comment nous évaluons les cannabis social clubs',
    metaDescription:
      'Découvrez comment SocialClubsMaps évalue les cannabis social clubs en Espagne à partir des signaux de registre, de règles internes, de locaux et d\'onboarding.',
    eyebrow: 'Standard de confiance indépendant',
    whyTitle: 'Ce que la vérification signifie ici',
    whyBody:
      'La vérification n\'est ni une garantie juridique, ni une promesse d\'entrée, ni une recommandation commerciale. C\'est la méthode publique de SCM pour distinguer les signaux de confiance solides des comportements faibles, bruyants ou trop publics.',
    ctaPrimary: 'Obtenir le Safety Kit',
    ctaSecondary: 'Voir le répertoire',
    legalTitle: 'Ce que SCM ne revendique pas',
    legalBody:
      'SCM n\'exploite pas de clubs, ne vend pas de cannabis, ne garantit pas de résultats et ne remplace pas un conseil juridique. L\'objectif est d\'offrir une meilleure information publique, des attentes plus sûres et une compréhension plus claire du modèle d\'association privée.',
    linksTitle: 'Utilisez ce standard avec le reste de la base de confiance',
    breadcrumbHome: 'Accueil',
    breadcrumbCurrent: 'Standard de vérification',
    pillars: [
      {
        title: 'Statut au registre des associations',
        body: 'La structure associative semble-t-elle réelle, à jour et suffisamment documentée pour soutenir la confiance publique ?',
      },
      {
        title: 'Alignement des statuts et du règlement interne',
        body: 'Les règles et la posture publique restent-elles alignées avec le modèle d\'association privée plutôt qu\'avec un comportement de commerce ouvert ?',
      },
      {
        title: 'Locaux et accès contrôlé',
        body: 'L\'aménagement des lieux communique-t-il discrétion, contrôle des membres et posture d\'accès non public ?',
      },
      {
        title: 'Processus d\'onboarding membre sécurisé',
        body: 'Le processus d\'entrée paraît-il responsable, documenté et suffisamment progressif pour éviter les risques liés aux raccourcis ?',
      },
    ],
    trustLinks: [
      { href: '/clubs', label: 'Répertoire' },
      { href: '/safety-kit', label: 'Safety Kit' },
      { href: '/editorial/legal', label: 'Guides juridiques' },
      { href: '/mission', label: 'Mission' },
    ],
  },
  de: {
    title: 'Der SCM-Verifizierungsstandard',
    lead: 'Eine kleine verifizierte Auswahl ist wertvoller als eine riesige ungeprüfte Liste. SCM bewertet öffentliche Vertrauenssignale, bevor ein Club in die verifizierte öffentliche Ebene aufgenommen wird.',
    metaTitle: 'SCM-Verifizierungsstandard | Wie wir Cannabis Social Clubs bewerten',
    metaDescription:
      'Erfahre, wie SocialClubsMaps Cannabis Social Clubs in Spanien anhand von Register-, Hausregel-, Standort- und Onboarding-Signalen bewertet.',
    eyebrow: 'Unabhängiger Vertrauensstandard',
    whyTitle: 'Was Verifizierung hier bedeutet',
    whyBody:
      'Verifizierung ist keine Rechtsgarantie, kein Eintrittsversprechen und keine kommerzielle Empfehlung. Sie ist die öffentliche SCM-Methode, um starke Vertrauenssignale von schwachem, lautem oder zu öffentlichem Clubverhalten zu unterscheiden.',
    ctaPrimary: 'Safety Kit holen',
    ctaSecondary: 'Verzeichnis ansehen',
    legalTitle: 'Was SCM nicht behauptet',
    legalBody:
      'SCM betreibt keine Clubs, verkauft kein Cannabis, garantiert keine Ergebnisse und ersetzt keine Rechtsberatung. Ziel sind bessere öffentliche Informationen, sicherere Erwartungen und ein klareres Verständnis des privaten Vereinsmodells.',
    linksTitle: 'Nutze den Standard mit dem restlichen Vertrauenssystem',
    breadcrumbHome: 'Startseite',
    breadcrumbCurrent: 'Verifizierungsstandard',
    pillars: [
      {
        title: 'Status im Vereinsregister',
        body: 'Wirkt die Vereinsstruktur real, aktuell und ausreichend dokumentiert, um öffentliches Vertrauen zu stützen?',
      },
      {
        title: 'Abgleich von Satzung und Hausregeln',
        body: 'Passen Regeln und öffentlicher Auftritt weiterhin zum Modell einer privaten Vereinigung statt zu offenem Verkaufsverhalten?',
      },
      {
        title: 'Räumlichkeiten und kontrollierter Zugang',
        body: 'Vermittelt das physische Setup Diskretion, Mitgliederkontrolle und eine nicht öffentliche Zugangshaltung?',
      },
      {
        title: 'Sicherer Prozess für die Mitgliederaufnahme',
        body: 'Wirkt der Aufnahmeprozess verantwortungsvoll, dokumentiert und langsam genug, um abkürzungsgetriebene Risiken zu vermeiden?',
      },
    ],
    trustLinks: [
      { href: '/clubs', label: 'Verzeichnis' },
      { href: '/safety-kit', label: 'Safety Kit' },
      { href: '/editorial/legal', label: 'Rechtsleitfäden' },
      { href: '/mission', label: 'Mission' },
    ],
  },
} satisfies Record<Locale, VerificationCopy>;

const pillarIcons = [FileSearch, Scale, Building2, LockKey];

export async function generateMetadata({ params }: VerificationPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) {
    return {};
  }

  return buildLocalizedMetadata({
    lang,
    path: '/verification',
    title: copy[lang].metaTitle,
    description: copy[lang].metaDescription,
  });
}

export default async function VerificationPage({ params }: VerificationPageProps) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : 'en';
  const c = copy[locale];
  const basePath = `/${locale}`;

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: c.breadcrumbHome, path: basePath },
    { name: c.breadcrumbCurrent, path: `${basePath}/verification` },
  ]);

  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: c.title,
    description: c.metaDescription,
    url: toAbsoluteUrl(`${basePath}/verification`),
    isPartOf: {
      '@type': 'WebSite',
      name: 'SocialClubsMaps',
      url: toAbsoluteUrl(basePath),
    },
  };

  return (
    <div className="min-h-screen bg-bg-base text-white relative overflow-hidden">
      <JsonLd data={webPageJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <div className="absolute inset-0 bg-gradient-to-b from-bg-surface/50 via-bg-base to-bg-base pointer-events-none" />
      <div className="absolute left-[10%] top-0 h-[520px] w-[520px] rounded-full bg-brand/10 blur-[140px]" />

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6 lg:px-8 md:pt-36">
        <section className="mx-auto max-w-4xl text-center">
          <Eyebrow variant="muted" className="mb-6 justify-center flex items-center gap-2 text-brand">
            <Shield className="h-4 w-4" />
            {c.eyebrow}
          </Eyebrow>
          <H1 size="xl" className="mb-6 font-serif text-white">
            {c.title}
          </H1>
          <Lead className="mx-auto max-w-3xl text-zinc-300">{c.lead}</Lead>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild className="rounded-full bg-brand px-8 py-6 font-bold text-bg-base hover:bg-brand-dark">
              <Link href={`${basePath}/safety-kit`}>
                {c.ctaPrimary} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" className="rounded-full border-white/10 px-8 py-6 text-white hover:bg-white/5">
              <Link href={`${basePath}/clubs`}>{c.ctaSecondary}</Link>
            </Button>
          </div>
        </section>

        <section className="mt-20 grid gap-6 md:grid-cols-2">
          {c.pillars.map((pillar, index) => {
            const Icon = pillarIcons[index] ?? FileSearch;
            return (
            <article key={pillar.title} className="rounded-3xl border border-white/10 bg-bg-card/80 p-8 backdrop-blur-md">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand/20 bg-brand/10 text-brand">
                  <Icon className="h-6 w-6" />
                </div>
                <Badge className="border-brand/20 bg-brand/10 text-brand">0{index + 1}</Badge>
              </div>
              <H3 className="mb-3 font-serif text-white">{pillar.title}</H3>
              <Text className="text-zinc-400">{pillar.body}</Text>
            </article>
            );
          })}
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-bg-surface/70 p-8 md:p-10">
            <H2 className="mb-4 font-serif text-white">{c.whyTitle}</H2>
            <Text className="text-zinc-300">{c.whyBody}</Text>
          </div>
          <div className="rounded-3xl border border-brand/20 bg-brand/5 p-8 md:p-10">
            <H2 className="mb-4 font-serif text-white">{c.legalTitle}</H2>
            <Text className="text-zinc-300">{c.legalBody}</Text>
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-white/10 bg-bg-card/70 p-8 md:p-10">
          <H2 className="mb-6 font-serif text-white">{c.linksTitle}</H2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {c.trustLinks.map((item) => (
              <Link
                key={item.href}
                href={`${basePath}${item.href}`}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm font-bold text-zinc-300 transition hover:border-brand/40 hover:text-white"
              >
                <CheckCircle2 className="mb-4 h-5 w-5 text-brand" />
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
