import type { EditorialSprintPackage } from '@/lib/editorial-sprint/types';
import { SCM_EDITORIAL_DISCLAIMER, SPRINT_INTERNAL_LINKS } from '@/lib/editorial-sprint/shared';

export const membershipPackage: EditorialSprintPackage = {
  pillar: 'membership',
  slug: 'barcelona-membership-rules-2026',
  category: 'etiquette',
  featuredOrder: 6,
  citySlug: 'barcelona',
  cityName: 'Barcelona',
  authorName: 'SCM Editorial Desk',
  authorBio:
    'SocialClubsMaps covers Spain club reality through a legal, civic, and verification-first lens.',
  publishedAt: '2026-04-25T09:15:00.000Z',
  readTime: 8,
  heroImageAlt:
    'A quiet private association entry in Barcelona with controlled access and an understated intake desk.',
  disclaimerRequired: true,
  legalAnchors: [
    'Club policy, local practice, and formal legal interpretation are not the same thing',
    'No public guarantee of entry or approval exists',
    'Public behavior still carries administrative risk commonly cited in the EUR601-EUR30000 range',
  ],
  primaryCtaHref: SPRINT_INTERNAL_LINKS.safetyKit,
  secondaryCtaHref: SPRINT_INTERNAL_LINKS.firstVisit,
  english: {
    title: 'Membership Rules in Barcelona Clubs: Club Policy, Local Practice, and What People Confuse',
    excerpt:
      'Most membership confusion starts when people turn a nuanced club process into a fake universal rule. Barcelona is more specific than that.',
    metaTitle:
      'Membership Rules in Barcelona Clubs: Club Policy, Local Practice, and What People Confuse | SocialClubsMaps',
    metaDescription:
      'A precise guide to Barcelona club membership rules in 2026, including the difference between club policy, local practice, and formal legal interpretation.',
    tags: ['Membership', 'Barcelona', 'Club Policy'],
    content: `## The first thing to understand

Most membership confusion in Barcelona comes from people asking for one simple answer to a layered question.

Can everyone join?  
Do you need a referral?  
Is residency required?  
Do clubs only want locals?

The honest answer is less satisfying than a social-media shortcut: **club policy, local practice, and formal legal interpretation are not the same thing**.

## There is no single universal membership rule

Barcelona clubs do not all operate with one identical intake model. Some clubs are more restrictive. Some are more procedural. Some are quieter and more community-shaped. Some are simply better run than others.

That means any claim like:

- “tourists can always join”
- “tourists can never join”
- “referrals are mandatory everywhere”
- “residency is legally required in every case”

is usually flattening a more nuanced reality.

## What sits underneath the process

Clubs are supposed to operate inside a private association model, not as public walk-in retail venues. That is why membership matters at all. The point of intake is not cosmetic friction. It is part of how a club signals that it is not behaving like a public business.

That still does not produce one universal black-letter formula. It produces a range of club policies shaped by:

- legal caution
- local pressure
- club culture
- operational seriousness
- who the club is trying to be

## Club policy is not always the same as law

This is where people get lost.

Some clubs may prefer residents. Some may prioritize referrals. Some may simply choose to slow down anyone they do not already understand. Those choices can reflect risk management, ethics, internal culture, or a reading of the local environment. They are not always clean statements of formal law.

That distinction matters because people often repeat club-policy outcomes as if they were universal legal rules.

## Why Barcelona makes clubs more cautious

Barcelona is unusually exposed to tourism pressure, neighborhood fatigue, and scrutiny around commercial appearance. That changes behavior.

A club may become more selective because:

- it wants to stay small and low-visibility
- it does not want to feel tourist-facing
- it wants better member fit
- it is reacting to local pressure

That does not mean the club is hostile. It usually means the club understands the environment it operates in.

## What a careful membership process tends to include

A stronger process usually looks like:

- clear identity checks
- a real membership step rather than instant entry theater
- explanation of house rules
- some sign that discretion matters
- no pressure to rush you through confusion

A weaker process often looks like the opposite: vague approval, soft rules, retail language, and convenience used as the main pitch.

## What people should stop confusing

Stop confusing:

- club policy with national law
- local practice with guaranteed outcomes
- discretion with hostility
- friction with dysfunction

In a sensitive category, careful process can be a sign of legitimacy rather than a sign that something is broken.

## The practical takeaway

If you want to read membership correctly, do not ask only, “Can I get in?”

Ask:

- What kind of club posture am I looking at?
- Is the process serious or improvised?
- Does the venue seem to respect the private association model?
- Is the friction there to protect the model, or is the whole thing just confused?

That is a much better way to understand the situation than looking for a universal shortcut.

## Where to go next

- Read [Your First Time in a Barcelona Cannabis Club](${SPRINT_INTERNAL_LINKS.firstVisit})
- Read [What Cannabis Social Clubs in Spain Actually Are](${SPRINT_INTERNAL_LINKS.clubsExplainer})
- Start with [The Safety Kit](${SPRINT_INTERNAL_LINKS.safetyKit})

## FAQ

### Is residency legally required everywhere?

No single clean rule explains every club process. Some clubs use residency preference or caution as policy. That should not be repeated as a universal legal formula without qualification.

### Are referrals always required?

Not always in the same way. Referrals can be part of club culture, member screening, or risk management, but the practice is not identical everywhere.

### Does a slower process mean a club is badly run?

Not necessarily. In Barcelona, a slower and clearer process can be a sign that the club is trying to behave like a private association rather than a fast public-access venue.

${SCM_EDITORIAL_DISCLAIMER}`,
  },
  localized: {
    es: {
      title:
        'Reglas de membresía en los clubs de Barcelona: política del club, práctica local y lo que la gente confunde',
      excerpt:
        'La mayoría de la confusión sobre membresía empieza cuando se convierte un proceso matizado en una regla falsa y universal.',
      metaTitle:
        'Reglas de membresía en los clubs de Barcelona: política del club, práctica local y lo que la gente confunde | SocialClubsMaps',
      metaDescription:
        'Guía precisa sobre las reglas de membresía en clubes de Barcelona en 2026, incluyendo la diferencia entre política interna, práctica local e interpretación jurídica.',
      tags: ['Membresía', 'Barcelona', 'Política del club'],
      content: `## Lo primero que hay que entender

Gran parte de la confusión sobre membresía en Barcelona nace de buscar una respuesta simple para una pregunta que no lo es.

¿Puede entrar cualquiera?  
¿Hace falta referral?  
¿Es obligatorio ser residente?  
¿Los clubs solo quieren locales?

La respuesta honesta es menos cómoda que el atajo de redes: **la política del club, la práctica local y la interpretación jurídica formal no son lo mismo**.

## No existe una regla universal única

Los clubs de Barcelona no funcionan todos con un mismo modelo de incorporación. Algunos son más restrictivos. Otros más procedimentales. Algunos conservan una lógica más comunitaria. Otros simplemente están mejor gestionados.

Por eso afirmaciones como:

- “los visitantes siempre pueden entrar”
- “los visitantes nunca pueden entrar”
- “el referral es obligatorio en todos”
- “la residencia es requisito legal en todos los casos”

suelen aplastar una realidad más matizada.

## Lo que hay debajo del proceso

Los clubs deberían moverse dentro de un modelo de asociación privada, no como locales públicos de acceso directo. Por eso la membresía importa. No es fricción decorativa. Forma parte de cómo un club intenta demostrar que no está operando como negocio abierto al público.

Eso sigue sin producir una fórmula única. Produce políticas distintas según:

- cautela legal
- presión local
- cultura interna
- seriedad operativa
- el tipo de club que se quiere sostener

## La política del club no siempre equivale a ley

Aquí mucha gente se pierde.

Algunos clubs pueden preferir residentes. Otros priorizar referrals. Otros simplemente frenan a quien no entienden todavía. Esas decisiones pueden reflejar prudencia, ética, cultura interna o lectura del entorno. No siempre son una traducción limpia de una norma formal.

## Por qué Barcelona vuelve a los clubs más cautos

Barcelona está especialmente expuesta a presión turística, fatiga vecinal y escrutinio sobre apariencia comercial. Eso cambia comportamientos.

Un club puede volverse más selectivo porque:

- quiere mantenerse pequeño y poco visible
- no quiere parecer orientado al visitante
- busca mejor encaje de miembros
- responde a presión local real

Eso no significa hostilidad. Normalmente significa que entiende el terreno donde opera.

## Cómo suele verse un proceso más serio

Un proceso más sólido suele incluir:

- verificación clara de identidad
- un paso real de membresía en lugar de teatro de entrada inmediata
- explicación de normas internas
- alguna señal de que la discreción importa
- ausencia de presión para decidir sin entender

Un proceso débil suele verse al revés: aprobación vaga, reglas blandas, lenguaje retail y la comodidad como pitch principal.

## Qué conviene dejar de confundir

No confundas:

- política del club con ley nacional
- práctica local con resultado garantizado
- discreción con hostilidad
- fricción con mal funcionamiento

En una categoría sensible, un proceso cuidadoso puede ser una señal de legitimidad.

- Lee [Tu primera vez en un club de cannabis en Barcelona](${SPRINT_INTERNAL_LINKS.firstVisit})
- Lee [Qué son realmente los clubes sociales de cannabis en España](${SPRINT_INTERNAL_LINKS.clubsExplainer})
- Empieza por [The Safety Kit](${SPRINT_INTERNAL_LINKS.safetyKit})

${SCM_EDITORIAL_DISCLAIMER}`,
    },
    fr: {
      title:
        "Règles d'adhésion dans les clubs de Barcelone : politique interne, pratique locale et ce que les gens confondent",
      excerpt:
        "La plupart des confusions sur l'adhésion viennent du fait qu'on transforme un processus nuancé en règle universelle fictive.",
      metaTitle:
        "Règles d'adhésion dans les clubs de Barcelone : politique interne, pratique locale et ce que les gens confondent | SocialClubsMaps",
      metaDescription:
        "Guide précis sur les règles d'adhésion aux clubs de Barcelone en 2026, y compris la différence entre politique interne, pratique locale et interprétation juridique.",
      tags: ['Adhésion', 'Barcelone', 'Politique interne'],
      content: `## Le premier point à comprendre

La plupart des confusions sur l adhésion à Barcelone viennent d une erreur simple : vouloir une réponse universelle à une question qui ne l est pas.

Peut-on entrer partout ?  
Faut-il toujours un parrainage ?  
La résidence est-elle obligatoire ?  
Les clubs veulent-ils seulement des locaux ?

La réponse honnête est moins simple qu un raccourci social : **la politique du club, la pratique locale et l interprétation juridique formelle ne sont pas la même chose**.

## Il n existe pas de règle unique pour tous

Les clubs de Barcelone n utilisent pas tous le même modèle d intégration. Certains sont plus restrictifs. D autres plus procéduraux. Certains restent très communautaires. D autres sont simplement mieux structurés.

Cela veut dire que des affirmations comme :

- “les visiteurs peuvent toujours adhérer”
- “les visiteurs ne peuvent jamais adhérer”
- “le parrainage est obligatoire partout”
- “la résidence est exigée légalement dans tous les cas”

écrasent souvent une réalité plus nuancée.

## Ce qui soutient le processus

Les clubs sont censés exister dans un modèle d association privée, pas dans un modèle de retail public. C est pour cela que l adhésion compte. Elle n est pas une friction décorative. Elle fait partie de la manière dont un club montre qu il ne fonctionne pas comme un commerce ouvert.

Cela ne produit toujours pas une formule unique. Cela produit des politiques différentes selon :

- la prudence juridique
- la pression locale
- la culture du club
- le sérieux opérationnel
- le type de communauté que le club veut préserver

## La politique du club n est pas toujours la loi

C est là que beaucoup de gens se perdent.

Certains clubs peuvent préférer des résidents. D autres peuvent privilégier le parrainage. D autres ralentissent simplement l entrée de personnes qu ils ne comprennent pas encore. Ces choix peuvent refléter la gestion du risque, une éthique interne, une culture associative ou une lecture du contexte. Ils ne sont pas toujours une déclaration de droit formel.

## Pourquoi Barcelone rend les clubs plus prudents

Barcelone subit une pression touristique forte, de la fatigue de quartier et un regard sévère sur l apparence commerciale. Cela modifie les comportements.

Un club peut devenir plus sélectif parce qu il veut :

- rester petit et peu visible
- éviter de paraître tourné vers les visiteurs
- mieux choisir ses membres
- réagir à une pression locale réelle

Cela ne signifie pas forcément de l hostilité. Cela signifie souvent que le club comprend son environnement.

- Lire [Your First Time in a Barcelona Cannabis Club](${SPRINT_INTERNAL_LINKS.firstVisit})
- Lire [What Cannabis Social Clubs in Spain Actually Are](${SPRINT_INTERNAL_LINKS.clubsExplainer})
- Commencer par [The Safety Kit](${SPRINT_INTERNAL_LINKS.safetyKit})

${SCM_EDITORIAL_DISCLAIMER}`,
    },
    de: {
      title:
        'Mitgliedschaftsregeln in Barcelonas Clubs: Clubpolitik, lokale Praxis und was viele verwechseln',
      excerpt:
        'Die meisten Missverständnisse rund um Mitgliedschaft beginnen dort, wo ein nuancierter Prozess in eine falsche Universalregel verwandelt wird.',
      metaTitle:
        'Mitgliedschaftsregeln in Barcelonas Clubs: Clubpolitik, lokale Praxis und was viele verwechseln | SocialClubsMaps',
      metaDescription:
        'Praeziser Guide zu Mitgliedschaftsregeln in Barcelonas Clubs 2026, inklusive Unterschied zwischen Clubpolitik, lokaler Praxis und rechtlicher Auslegung.',
      tags: ['Mitgliedschaft', 'Barcelona', 'Clubpolitik'],
      content: `## Der erste Punkt

Die meisten Missverständnisse rund um Mitgliedschaft in Barcelona entstehen, weil Menschen eine einfache Antwort auf eine vielschichtige Frage wollen.

Kann jeder beitreten?  
Braucht man immer eine Empfehlung?  
Ist Wohnsitz erforderlich?  
Wollen Clubs nur Einheimische?

Die ehrliche Antwort ist weniger glatt als Social-Media-Mythen: **Clubpolitik, lokale Praxis und formale rechtliche Auslegung sind nicht dasselbe**.

## Es gibt keine einzige Universalregel

Barcelonas Clubs nutzen nicht alle dasselbe Aufnahme-Modell. Manche sind restriktiver. Andere prozessualer. Manche bleiben staerker gemeinschaftsorientiert. Andere sind einfach besser organisiert.

Darum verflachen Aussagen wie:

- „Besucher koennen immer beitreten“
- „Besucher koennen nie beitreten“
- „Empfehlungen sind ueberall Pflicht“
- „Wohnsitz ist in jedem Fall gesetzlich vorgeschrieben“

oft eine deutlich differenziertere Realitaet.

## Was unter dem Prozess liegt

Clubs sollen innerhalb eines privaten Vereinsmodells funktionieren, nicht als oeffentliche Walk-in-Orte. Darum ist Mitgliedschaft ueberhaupt relevant. Sie ist keine dekorative Huerde. Sie ist Teil der Frage, ob ein Club wie ein privater Zusammenschluss und nicht wie ein offenes Geschaeft wirkt.

Das fuehrt trotzdem nicht zu einer einheitlichen Formel. Es fuehrt zu unterschiedlichen Politiken, geformt durch:

- rechtliche Vorsicht
- lokalen Druck
- Clubkultur
- operative Ernsthaftigkeit
- das Selbstverstaendnis des Clubs

## Clubpolitik ist nicht immer Gesetz

Hier geht viel durcheinander.

Manche Clubs bevorzugen Residents. Andere legen Wert auf Empfehlungen. Wieder andere bremsen Menschen, die sie noch nicht einordnen koennen. Diese Entscheidungen koennen Risikomanagement, Ethik, interne Kultur oder eine Lesart des lokalen Umfelds spiegeln. Sie sind nicht immer direkte Aussagen formalen Rechts.

## Warum Barcelona Clubs vorsichtiger macht

Barcelona steht unter Tourismusdruck, Nachbarschaftsmuedigkeit und scharfem Blick auf kommerzielle Aussenwirkung. Das veraendert Verhalten.

Ein Club kann selektiver werden, weil er:

- klein und wenig sichtbar bleiben will
- nicht touristisch wirken moechte
- besser passende Mitglieder sucht
- auf realen lokalen Druck reagiert

Das bedeutet nicht automatisch Ablehnung. Es bedeutet oft, dass der Club seine Umgebung versteht.

- Lies [Your First Time in a Barcelona Cannabis Club](${SPRINT_INTERNAL_LINKS.firstVisit})
- Lies [What Cannabis Social Clubs in Spain Actually Are](${SPRINT_INTERNAL_LINKS.clubsExplainer})
- Starte mit [The Safety Kit](${SPRINT_INTERNAL_LINKS.safetyKit})

${SCM_EDITORIAL_DISCLAIMER}`,
    },
  },
  teaser: {
    en: {
      badge: 'Membership',
      title: 'The process is nuanced because the environment is nuanced.',
      body: 'A cleaner explanation of membership rules without turning club policy into fake universal law.',
      ctaLabel: 'Read the membership guide',
    },
    es: {
      badge: 'Membership',
      title: 'El proceso es matizado porque el entorno también lo es.',
      body: 'Una explicación más limpia de la membresía sin convertir la política del club en ley universal falsa.',
      ctaLabel: 'Leer la guía de membresía',
    },
    fr: {
      badge: 'Membership',
      title: 'Le processus est nuancé parce que le contexte l’est aussi.',
      body: "Une lecture plus nette de l'adhésion sans transformer la politique du club en fausse loi universelle.",
      ctaLabel: "Lire le guide d'adhésion",
    },
    de: {
      badge: 'Membership',
      title: 'Der Prozess ist nuanciert, weil das Umfeld es auch ist.',
      body: 'Eine klarere Einordnung von Mitgliedschaft, ohne Clubpolitik in falsches Universalrecht zu verwandeln.',
      ctaLabel: 'Mitgliedschaftsguide lesen',
    },
  },
  digest: {
    en: {
      title: 'Membership',
      body: 'The useful distinction is not yes versus no. It is club policy versus local practice versus formal law.',
      ctaLabel: 'Read the membership guide',
    },
    es: {
      title: 'Membership',
      body: 'La distinción útil no es sí o no. Es política del club frente a práctica local e interpretación formal.',
      ctaLabel: 'Leer la guía de membresía',
    },
    fr: {
      title: 'Membership',
      body: "La distinction utile n'est pas oui ou non. C'est politique interne, pratique locale et lecture juridique.",
      ctaLabel: "Lire le guide d'adhésion",
    },
    de: {
      title: 'Membership',
      body: 'Die hilfreiche Unterscheidung ist nicht Ja oder Nein, sondern Clubpolitik, lokale Praxis und Rechtsauslegung.',
      ctaLabel: 'Mitgliedschaftsguide lesen',
    },
  },
  carouselTemplate: 'explainer',
  carouselSlides: {
    en: [
      {
        eyebrow: 'Membership',
        title: 'There is no single universal rule that explains every club.',
        body: [
          'Barcelona membership is shaped by club policy, local pressure, and legal caution.',
          'That is why shortcuts usually mislead.',
        ],
      },
      {
        eyebrow: 'Nuance',
        title: 'Club policy is not always the same thing as formal law.',
        body: [
          'Referral preference, resident preference, and slower intake can be club choices or risk management.',
          'They should not be repeated as one-size-fits-all legal claims.',
        ],
      },
      {
        eyebrow: 'Read it right',
        title: 'Careful process can be a legitimacy signal.',
        body: [
          'A slower, clearer, more controlled intake is not automatically friction for its own sake.',
          'In Barcelona it can be part of protecting the private association model.',
        ],
        kicker: 'Start with process clarity, then use the Safety Kit before trusting any promise of ease.',
      },
    ],
    es: [
      {
        eyebrow: 'Membership',
        title: 'No existe una regla universal única que explique todos los clubs.',
        body: [
          'La membresía en Barcelona se moldea por política del club, presión local y cautela legal.',
          'Por eso los atajos suelen engañar.',
        ],
      },
      {
        eyebrow: 'Matiz',
        title: 'La política del club no siempre es lo mismo que la ley formal.',
        body: [
          'Preferencias por referrals, residentes o un intake más lento pueden ser decisiones internas o gestión de riesgo.',
          'No deberían repetirse como reglas legales universales.',
        ],
      },
      {
        eyebrow: 'Leerlo bien',
        title: 'Un proceso cuidadoso puede ser señal de legitimidad.',
        body: [
          'Un intake más lento y claro no es automáticamente fricción inútil.',
          'En Barcelona puede formar parte de proteger el modelo asociativo privado.',
        ],
        kicker: 'Empieza por la claridad del proceso y usa la Safety Kit antes de confiar en cualquier promesa fácil.',
      },
    ],
    fr: [
      {
        eyebrow: 'Membership',
        title: "Il n'existe pas de règle unique pour expliquer tous les clubs.",
        body: [
          "L'adhésion à Barcelone se joue entre politique interne, pression locale et prudence juridique.",
          'C est pour cela que les raccourcis trompent si souvent.',
        ],
      },
      {
        eyebrow: 'Nuance',
        title: "La politique du club n'est pas toujours la loi formelle.",
        body: [
          'Préférence pour le parrainage, préférence résidentielle ou intégration plus lente peuvent relever du choix interne ou de la gestion du risque.',
          'Cela ne doit pas être répété comme une règle universelle.',
        ],
      },
      {
        eyebrow: 'Bonne lecture',
        title: 'Un processus soigneux peut signaler de la légitimité.',
        body: [
          "Une intégration plus lente et plus claire n'est pas forcément un défaut.",
          'À Barcelone, cela peut faire partie de la protection du modèle associatif privé.',
        ],
        kicker: "Commencez par comprendre le processus, puis utilisez la Safety Kit avant de croire toute promesse de facilité.",
      },
    ],
    de: [
      {
        eyebrow: 'Membership',
        title: 'Es gibt keine einzige Regel, die alle Clubs erklaert.',
        body: [
          'Mitgliedschaft in Barcelona wird durch Clubpolitik, lokalen Druck und rechtliche Vorsicht geformt.',
          'Darum fuehren Abkuerzungen so oft in die Irre.',
        ],
      },
      {
        eyebrow: 'Nuance',
        title: 'Clubpolitik ist nicht immer dasselbe wie formales Recht.',
        body: [
          'Praeferenzen fuer Empfehlungen, Residents oder langsamere Aufnahme koennen interne Entscheidungen oder Risikomanagement sein.',
          'Sie sollten nicht als universelle Rechtsregel wiederholt werden.',
        ],
      },
      {
        eyebrow: 'Richtig lesen',
        title: 'Ein sorgfaeltiger Prozess kann ein Legitimitätssignal sein.',
        body: [
          'Eine langsamere und klarere Aufnahme ist nicht automatisch sinnlose Friktion.',
          'In Barcelona kann sie Teil des Schutzes des privaten Vereinsmodells sein.',
        ],
        kicker: 'Verstehe zuerst den Prozess und nutze dann die Safety Kit, bevor du einem Versprechen der Leichtigkeit glaubst.',
      },
    ],
  },
  imageBundle: {
    hero: {
      label: 'Membership hero',
      prompt:
        'Create a premium editorial hero image for SocialClubsMaps about membership rules in Barcelona clubs. Show a discreet private-association threshold with controlled access, a calm intake desk or membership review gesture, and architecture that feels unmistakably Barcelona without postcard clichés. Tone: precise, respectful, non-transactional. Purpose: explain nuance and process, not access hype. Composition: realistic magazine-style scene with a doorway, subtle paperwork or rules sheet, one human presence implied but not dominant, and clean negative space for a headline. Lighting: warm interior restraint against cooler exterior stone tones. Color direction: charcoal, muted teal, stone, soft amber. Exclude smoking, retail counters, menu boards, cash exchange, nightlife party cues, or anything that feels like instant entry.',
      bestUse: 'Article hero and membership teaser visual.',
      cropNote: 'Keep doorway and intake gesture centered so both square and landscape crops preserve the process signal.',
    },
    carousel: {
      label: 'Membership carousel support',
      prompt:
        'Create a square editorial support visual for an Instagram explainer about membership nuance in Barcelona clubs. Show a composed intake or review moment with signals of policy, identity check, or house rules, but avoid explicit documents that feel bureaucratic or transactional. Tone: calm, intelligent, friction-with-purpose. Composition: centered square crop, layered but uncluttered, designed for mobile readability. Palette: dark editorial neutrals with muted gold and teal accents. No text in image. No cannabis clichés, no party mood, no dispensary look.',
      bestUse: 'Explainer carousel support visual.',
      cropNote: 'Preserve the rule-sheet or intake gesture within the center square with room for top text overlays.',
    },
    teaser: {
      label: 'Membership teaser banner',
      prompt:
        'Create a narrow editorial banner image about club membership nuance in Barcelona. Show a discreet doorway, a sense of pause, and a serious but welcoming intake atmosphere. Tone: composed, selective, humane, not forbidding. Purpose: homepage teaser module. Palette: stone, midnight teal, warm amber. Exclude retail cues, leaf symbols, product focus, club-party vibes, or any image that looks like a travel ad.',
      bestUse: 'Homepage teaser and concierge support card.',
      cropNote: 'Leave clean negative space on one side for teaser headlines.',
    },
    negativePrompt:
      'No cannabis leaves, no buds, no joints, no smoking, no money exchange, no check-out counter, no nightclub lighting, no passport-at-the-door cliche, no tourist-group imagery.',
    variantGuidance:
      'If the image feels too bureaucratic, regenerate toward warmer private-association realism. If it feels too lifestyle-heavy, push it back toward controlled-access editorial restraint.',
  },
};
