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
    ctaSecondary: 'Browse Verified Clubs',
    legalTitle: 'What SCM does not claim',
    legalBody:
      'SCM does not operate clubs, sell cannabis, guarantee outcomes, or replace legal advice. The goal is better public information, safer expectations, and a clearer way to understand the private association model.',
    linksTitle: 'Use the standard with the rest of the trust stack',
  },
  es: {
    title: 'El estandar de verificacion de SCM',
    lead: 'Un conjunto pequeno y verificado vale mas que una lista enorme sin revisar. SCM evalua senales publicas de confianza antes de incluir un club en la capa publica verificada.',
    metaTitle: 'Estandar de verificacion SCM | Como evaluamos Cannabis Social Clubs',
    metaDescription:
      'Consulta como SocialClubsMaps evalua cannabis social clubs en Espana usando senales de registro, normas internas, local y onboarding.',
    eyebrow: 'Estandar independiente de confianza',
    whyTitle: 'Que significa verificar aqui',
    whyBody:
      'La verificacion no es una garantia legal, una promesa de entrada ni un respaldo comercial. Es el metodo publico de SCM para separar senales de confianza fuertes de comportamientos debiles, ruidosos o demasiado publicos.',
    ctaPrimary: 'Consigue el Safety Kit',
    ctaSecondary: 'Ver clubs verificados',
    legalTitle: 'Lo que SCM no afirma',
    legalBody:
      'SCM no opera clubs, no vende cannabis, no garantiza resultados y no sustituye asesoramiento legal. El objetivo es mejor informacion publica, expectativas mas seguras y una forma mas clara de entender el modelo de asociacion privada.',
    linksTitle: 'Usa el estandar con el resto del sistema de confianza',
  },
  fr: {
    title: 'Le standard de verification SCM',
    lead: 'Un petit ensemble verifie vaut mieux qu une grande liste non controlee. SCM evalue les signaux publics de confiance avant qu un club n entre dans la couche publique verifiee.',
    metaTitle: 'Standard de verification SCM | Comment nous evaluons les Cannabis Social Clubs',
    metaDescription:
      'Découvrez comment SocialClubsMaps evalue les cannabis social clubs en Espagne avec les signaux de registre, regles internes, locaux et onboarding.',
    eyebrow: 'Standard de confiance independant',
    whyTitle: 'Ce que verification signifie ici',
    whyBody:
      'La verification n est pas une garantie juridique, une promesse d entree ni une recommandation commerciale. C est la methode publique de SCM pour distinguer les signaux de confiance solides des comportements faibles, bruyants ou trop publics.',
    ctaPrimary: 'Obtenir le Safety Kit',
    ctaSecondary: 'Voir les clubs verifies',
    legalTitle: 'Ce que SCM ne pretend pas',
    legalBody:
      'SCM n exploite pas de clubs, ne vend pas de cannabis, ne garantit pas de resultats et ne remplace pas un conseil juridique. L objectif est une meilleure information publique, des attentes plus sures et une comprehension plus claire du modele d association privee.',
    linksTitle: 'Utilisez le standard avec le reste de la couche de confiance',
  },
  de: {
    title: 'Der SCM-Verifizierungsstandard',
    lead: 'Eine kleine verifizierte Auswahl ist wertvoller als eine riesige ungeprufte Liste. SCM bewertet offentliche Vertrauenssignale, bevor ein Club in die verifizierte offentliche Ebene aufgenommen wird.',
    metaTitle: 'SCM-Verifizierungsstandard | Wie wir Cannabis Social Clubs bewerten',
    metaDescription:
      'Erfahre, wie SocialClubsMaps Cannabis Social Clubs in Spanien anhand von Register-, Hausregel-, Standort- und Onboarding-Signalen bewertet.',
    eyebrow: 'Unabhangiger Vertrauensstandard',
    whyTitle: 'Was Verifizierung hier bedeutet',
    whyBody:
      'Verifizierung ist keine Rechtsgarantie, kein Eintrittsversprechen und keine kommerzielle Empfehlung. Sie ist die offentliche SCM-Methode, um starke Vertrauenssignale von schwachem, lautem oder zu offentlichem Clubverhalten zu unterscheiden.',
    ctaPrimary: 'Safety Kit holen',
    ctaSecondary: 'Verifizierte Clubs ansehen',
    legalTitle: 'Was SCM nicht behauptet',
    legalBody:
      'SCM betreibt keine Clubs, verkauft kein Cannabis, garantiert keine Ergebnisse und ersetzt keine Rechtsberatung. Ziel sind bessere offentliche Informationen, sicherere Erwartungen und ein klareres Verstandnis des privaten Vereinsmodells.',
    linksTitle: 'Nutze den Standard mit dem restlichen Vertrauenssystem',
  },
} satisfies Record<Locale, Record<string, string>>;

const pillars = [
  {
    icon: FileSearch,
    title: 'Association registry status',
    body: 'Does the association structure look real, current, and documented enough to support public trust?',
  },
  {
    icon: Scale,
    title: 'Statutes and house-rule alignment',
    body: 'Do the rules and public posture still fit the private association model rather than open retail behavior?',
  },
  {
    icon: Building2,
    title: 'Premises and controlled access',
    body: 'Does the physical setup communicate discretion, member control, and a non-public access posture?',
  },
  {
    icon: LockKey,
    title: 'Safe member onboarding process',
    body: 'Does the intake process feel responsible, documented, and slow enough to avoid shortcut-driven risk?',
  },
];

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
    { name: 'Home', path: basePath },
    { name: 'Verification Standard', path: `${basePath}/verification` },
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
          {pillars.map((pillar, index) => (
            <article key={pillar.title} className="rounded-3xl border border-white/10 bg-bg-card/80 p-8 backdrop-blur-md">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand/20 bg-brand/10 text-brand">
                  <pillar.icon className="h-6 w-6" />
                </div>
                <Badge className="border-brand/20 bg-brand/10 text-brand">0{index + 1}</Badge>
              </div>
              <H3 className="mb-3 font-serif text-white">{pillar.title}</H3>
              <Text className="text-zinc-400">{pillar.body}</Text>
            </article>
          ))}
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
            {[
              { href: '/clubs', label: 'Verified Clubs' },
              { href: '/safety-kit', label: 'Safety Kit' },
              { href: '/editorial/legal', label: 'Legal Guides' },
              { href: '/mission', label: 'Mission' },
            ].map((item) => (
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
