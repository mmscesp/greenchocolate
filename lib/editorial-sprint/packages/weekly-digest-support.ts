import type { Locale } from '@/lib/i18n-config';

type SupportedLocale = Extract<Locale, 'en' | 'es' | 'fr' | 'de'>;

type LocalizedStringMap = Record<SupportedLocale, string>;

interface WeeklyDigestLeadBlock {
  subjectLine: string;
  preheader: string;
  eyebrow: string;
  headline: string;
  intro: string;
  sectionIntro: string;
  closingTitle: string;
  closingBody: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
}

interface DigestCoverImagePromptBundle {
  masterPrompt: string;
  negativePrompt: string[];
  variantGuidance: string;
  bestUseNote: string;
  cropNote: string;
}

interface WeeklyDigestSupportPackage {
  digestId: 'scm-weekly-intelligence';
  supportedLocales: SupportedLocale[];
  packageOrder: ['reality', 'membership', 'red-flags', 'pressure', 'verification'];
  lead: Record<SupportedLocale, WeeklyDigestLeadBlock>;
  moduleLabels: {
    readMore: LocalizedStringMap;
    safetyKit: LocalizedStringMap;
    editorialVault: LocalizedStringMap;
  };
  digestCoverImage: DigestCoverImagePromptBundle;
}

export const WEEKLY_DIGEST_SUPPORT_PACKAGE: WeeklyDigestSupportPackage = {
  digestId: 'scm-weekly-intelligence',
  supportedLocales: ['en', 'es', 'fr', 'de'],
  packageOrder: ['reality', 'membership', 'red-flags', 'pressure', 'verification'],
  lead: {
    en: {
      subjectLine: 'SCM Weekly Intelligence | Barcelona club reality, risk, and standards',
      preheader:
        'Five new public-safe reads on club reality, membership nuance, red flags, pressure, and verification.',
      eyebrow: 'SCM Weekly Intelligence',
      headline: 'Five sharper ways to understand Barcelona club reality this week.',
      intro:
        'This issue brings together the public-safe side of the category: what people still misunderstand, where policy and practice diverge, what weak signals to avoid, why Barcelona remains under pressure, and what a credible verification standard should actually look like.',
      sectionIntro:
        'Read the package in order if you want the full picture. Each piece is designed to make the next one easier to read with more context and less noise.',
      closingTitle: 'Do it right, not fast.',
      closingBody:
        'Use the Safety Kit if you want the clearest public starting point for risk, etiquette, and verification-first navigation. SCM provides information, not legal advice, and the category remains sensitive.',
      primaryCtaLabel: 'Open the Safety Kit',
      primaryCtaHref: '/en/safety-kit',
      secondaryCtaLabel: 'See the mission and verification standard',
      secondaryCtaHref: '/en/mission#verification-standard',
    },
    es: {
      subjectLine: 'SCM Weekly Intelligence | Realidad, riesgo y estándares de clubes en Barcelona',
      preheader:
        'Cinco nuevas piezas public-safe sobre realidad del sector, matices de membresía, red flags, presión y verificación.',
      eyebrow: 'SCM Weekly Intelligence',
      headline: 'Cinco maneras más precisas de entender esta semana la realidad de los clubes en Barcelona.',
      intro:
        'Esta edición reúne la capa pública y segura de la categoría: lo que todavía se malinterpreta, dónde divergen política y práctica, qué señales débiles conviene evitar, por qué Barcelona sigue bajo presión y qué debería incluir un estándar de verificación creíble.',
      sectionIntro:
        'Léelo en orden si quieres la imagen completa. Cada pieza está pensada para que la siguiente se entienda con más contexto y menos ruido.',
      closingTitle: 'Hazlo bien, no rápido.',
      closingBody:
        'Usa la Safety Kit si quieres el punto de partida público más claro sobre riesgo, etiqueta y navegación verification-first. SCM ofrece información, no asesoramiento jurídico, y la categoría sigue siendo sensible.',
      primaryCtaLabel: 'Abrir la Safety Kit',
      primaryCtaHref: '/es/safety-kit',
      secondaryCtaLabel: 'Ver misión y estándar de verificación',
      secondaryCtaHref: '/es/mission#verification-standard',
    },
    fr: {
      subjectLine: 'SCM Weekly Intelligence | Réalité, risque et standards des clubs à Barcelone',
      preheader:
        'Cinq nouvelles lectures public-safe sur la réalité des clubs, les nuances d’adhésion, les signaux faibles, la pression civique et la vérification.',
      eyebrow: 'SCM Weekly Intelligence',
      headline: 'Cinq façons plus nettes de comprendre la réalité des clubs à Barcelone cette semaine.',
      intro:
        'Cette édition rassemble la couche publique et prudente de la catégorie : ce qui reste mal compris, là où politique interne et pratique locale divergent, les signaux faibles à éviter, les raisons de la pression sur Barcelone, et ce qu’un standard de vérification crédible devrait contenir.',
      sectionIntro:
        'Lisez le dossier dans l’ordre si vous voulez l’ensemble du tableau. Chaque pièce prépare la suivante avec plus de contexte et moins de bruit.',
      closingTitle: 'Faire les choses correctement, pas rapidement.',
      closingBody:
        'Utilisez la Safety Kit si vous voulez le point de départ public le plus clair sur le risque, l’étiquette et une navigation guidée par la vérification. SCM fournit de l’information, pas un conseil juridique, et la catégorie reste sensible.',
      primaryCtaLabel: 'Ouvrir la Safety Kit',
      primaryCtaHref: '/fr/safety-kit',
      secondaryCtaLabel: 'Voir la mission et la norme de vérification',
      secondaryCtaHref: '/fr/mission#verification-standard',
    },
    de: {
      subjectLine: 'SCM Weekly Intelligence | Club-Realitaet, Risiko und Standards in Barcelona',
      preheader:
        'Fuenf neue public-safe Texte zu Club-Realitaet, Mitgliedschaftsnuancen, Red Flags, Drucklagen und Verifizierung.',
      eyebrow: 'SCM Weekly Intelligence',
      headline: 'Fuenf schaerfere Wege, um Barcelonas Club-Realitaet in dieser Woche zu verstehen.',
      intro:
        'Diese Ausgabe buendelt die public-safe Seite der Kategorie: was weiterhin missverstanden wird, wo Clubpolitik und lokale Praxis auseinanderlaufen, welche schwachen Signale man meiden sollte, warum Barcelona unter Druck bleibt und wie ein glaubwuerdiger Verifizierungsstandard aussehen sollte.',
      sectionIntro:
        'Am besten in dieser Reihenfolge lesen, wenn Sie das Gesamtbild wollen. Jeder Baustein bereitet den naechsten mit mehr Kontext und weniger Rauschen vor.',
      closingTitle: 'Richtig vorgehen, nicht schnell.',
      closingBody:
        'Nutzen Sie die Safety Kit, wenn Sie den klarsten oeffentlichen Einstieg in Risiko, Etikette und verification-first Navigation wollen. SCM bietet Informationen, keine Rechtsberatung, und die Kategorie bleibt sensibel.',
      primaryCtaLabel: 'Safety Kit oeffnen',
      primaryCtaHref: '/de/safety-kit',
      secondaryCtaLabel: 'Mission und Verifizierungsstandard ansehen',
      secondaryCtaHref: '/de/mission#verification-standard',
    },
  },
  moduleLabels: {
    readMore: {
      en: 'Read more',
      es: 'Leer más',
      fr: 'Lire la suite',
      de: 'Mehr lesen',
    },
    safetyKit: {
      en: 'Safety Kit',
      es: 'Safety Kit',
      fr: 'Safety Kit',
      de: 'Safety Kit',
    },
    editorialVault: {
      en: 'Editorial Vault',
      es: 'Archivo editorial',
      fr: 'Voûte éditoriale',
      de: 'Editorial Vault',
    },
  },
  digestCoverImage: {
    masterPrompt:
      'Create a premium digest-cover image for a weekly intelligence email about Barcelona cannabis club reality. The image should feel like a European editorial cover, not a campaign ad. Show a layered Barcelona streetscape at blue hour with subtle private-association cues, muted signage, quiet stone facades, and one restrained visual motif suggesting analysis or review, such as pinned notes, a folded map edge, or marked-up documents partially visible in frame. The mood should communicate intelligence, caution, and urban complexity. Composition: wide horizontal 16:9 with clear headline-safe negative space in the upper-left quadrant, strong middle-ground depth, and no visual clutter. Palette: deep navy, charcoal, old stone, muted gold, olive-grey. Realism: high-end magazine photography with cinematic restraint. Avoid obvious cannabis iconography and avoid travel-poster energy.',
    negativePrompt: [
      'no cannabis leaves or buds',
      'no smoke or consumption',
      'no tourist crowds taking selfies',
      'no nightclub, party, or festival cues',
      'no retail storefront, menu board, or checkout counter',
      'no bright tropical travel colors',
    ],
    variantGuidance:
      'Variant A can be more architectural and city-intelligence driven. Variant B can include subtle paper-analysis cues for a newsroom feel.',
    bestUseNote:
      'Best for the digest hero, newsletter header image, or editorial landing page modules that summarize the five-package sprint.',
    cropNote:
      'Preserve strong negative space in the upper-left and keep the main architectural focal point centered so the image can crop to 3:2 and 1:1 without losing the intelligence tone.',
  },
};

export type { WeeklyDigestSupportPackage, WeeklyDigestLeadBlock, DigestCoverImagePromptBundle };
