import {
  SCM_REQUIRED_DISCLAIMER,
  type EditorialSprintPackage,
} from './types';

const NEGATIVE_PROMPTS = [
  'no cannabis leaf iconography',
  'no smoke clouds or glamorized consumption',
  'no dispensary counters or retail menus',
  'no party-tourism energy',
  'no cash handoff, QR payment, or sourcing cues',
  'no nightlife neon overload',
  'no cartoon police or crime-scene drama',
  'no hotel-room delivery vibe',
];

export const redFlagsPackage: EditorialSprintPackage = {
  pillar: 'Red Flags',
  canonicalSlug: 'barcelona-club-red-flags',
  canonicalLocale: 'en',
  category: 'Legal',
  queryClass: [
    'barcelona club red flags',
    'barcelona cannabis club scam signals',
    'how to spot risky clubs in barcelona',
  ],
  objective:
    'Teach readers how to identify weak legitimacy, poor controls, and commercialization-first behavior without drifting into facilitation.',
  audience:
    'Safety-first readers, visitors, and residents who want a credible way to judge club risk before trusting a venue or process.',
  thesis:
    'In Barcelona, risky clubs often reveal themselves through visibility, speed, weak privacy, and retail-style behavior long before anyone sees a hard legal problem.',
  template: 'audit',
  publishPriority: 3,
  legalAnchors: [
    {
      id: 'private-vs-public',
      label: 'Private-association posture matters',
      detail:
        'Spain continues to treat private conduct, public conduct, and commercial appearance differently, which is why public-retail behavior is a meaningful risk signal.',
    },
    {
      id: 'public-fines',
      label: 'Public possession and consumption can still trigger sanctions',
      detail:
        'Administrative fines are commonly cited in the EUR601 to EUR30000 range, so venues that normalize public spillover create avoidable exposure.',
    },
    {
      id: 'supreme-court-trend',
      label: 'Openly promotional or commercialization-first behavior has become harder to defend',
      detail:
        'A line of Supreme Court decisions between 2021 and 2023 increased pressure on club behavior that looks too expansive, public, or commercial.',
    },
    {
      id: 'barcelona-enforcement',
      label: 'Barcelona has already shown closure pressure',
      detail:
        'July 2024 closure action affecting around 30 clubs reinforced that visibility, weak controls, and commercial appearance are not abstract concerns.',
    },
  ],
  internalLinks: {
    en: [
      {
        href: '/en/editorial/what-are-cannabis-social-clubs-spain',
        label: 'What Cannabis Social Clubs in Spain Actually Are',
        purpose: 'Foundational club-model explainer',
      },
      {
        href: '/en/editorial/spain-cannabis-laws-tourists',
        label: "Spain's Cannabis Laws",
        purpose: 'Legal frame and public-private distinction',
      },
      {
        href: '/en/editorial/safety-kit-visitors-spain',
        label: 'The Safety Kit',
        purpose: 'Primary public CTA',
      },
      {
        href: '/en/editorial/scams-red-flags',
        label: 'Barcelona Cannabis Scams',
        purpose: 'Supporting trust-and-risk article',
      },
      {
        href: '/en/mission#verification-standard',
        label: 'Verification Standard',
        purpose: 'Trust methodology support',
      },
    ],
    es: [
      {
        href: '/es/editorial/what-are-cannabis-social-clubs-spain',
        label: 'Que son realmente los clubes sociales de cannabis en Espana',
        purpose: 'Base del modelo',
      },
      {
        href: '/es/editorial/spain-cannabis-laws-tourists',
        label: 'Leyes del cannabis en Espana',
        purpose: 'Marco legal y diferencia publico-privado',
      },
      {
        href: '/es/editorial/safety-kit-visitors-spain',
        label: 'The Safety Kit',
        purpose: 'CTA principal',
      },
      {
        href: '/es/editorial/scams-red-flags',
        label: 'Estafas y senales rojas',
        purpose: 'Capa de prevencion',
      },
      {
        href: '/es/mission#verification-standard',
        label: 'Estandar de verificacion',
        purpose: 'Soporte de confianza',
      },
    ],
    fr: [
      {
        href: '/fr/editorial/what-are-cannabis-social-clubs-spain',
        label: 'Ce que sont vraiment les clubs sociaux de cannabis en Espagne',
        purpose: 'Base du modele',
      },
      {
        href: '/fr/editorial/spain-cannabis-laws-tourists',
        label: "Les lois espagnoles sur le cannabis",
        purpose: 'Cadre legal et distinction public-prive',
      },
      {
        href: '/fr/editorial/safety-kit-visitors-spain',
        label: 'The Safety Kit',
        purpose: 'CTA principal',
      },
      {
        href: '/fr/editorial/scams-red-flags',
        label: 'Arnaques et signaux rouges',
        purpose: 'Couche prevention',
      },
      {
        href: '/fr/mission#verification-standard',
        label: 'Norme de verification',
        purpose: 'Preuve de confiance',
      },
    ],
    de: [
      {
        href: '/de/editorial/what-are-cannabis-social-clubs-spain',
        label: 'Was Cannabis Social Clubs in Spanien wirklich sind',
        purpose: 'Grundmodell erklaeren',
      },
      {
        href: '/de/editorial/spain-cannabis-laws-tourists',
        label: 'Cannabis-Gesetze in Spanien',
        purpose: 'Rechtsrahmen und Unterschied zwischen privat und oeffentlich',
      },
      {
        href: '/de/editorial/safety-kit-visitors-spain',
        label: 'The Safety Kit',
        purpose: 'Primaerer CTA',
      },
      {
        href: '/de/editorial/scams-red-flags',
        label: 'Betrug und Warnzeichen',
        purpose: 'Praeventive Folgeebene',
      },
      {
        href: '/de/mission#verification-standard',
        label: 'Verifizierungsstandard',
        purpose: 'Vertrauensbeleg',
      },
    ],
  },
  locales: {
    en: {
      title: 'Barcelona Club Red Flags: The Signals Respectful People Should Never Ignore',
      excerpt:
        'A premium safety-first guide to the signals that a Barcelona club may be operating with weak legitimacy, poor controls, or the wrong incentives.',
      metaTitle:
        'Barcelona Club Red Flags: The Signals Respectful People Should Never Ignore',
      metaDescription:
        'Learn the red flags that separate a credible Barcelona club from a risky one. Legal context first, practical warning signs second, Safety Kit next.',
      heroImageAlt:
        'Discreet Barcelona doorway scene showing the contrast between controlled access and visibility-first club behavior',
      body: `Barcelona does not reward speed, hype, or public-retail assumptions. Many of the worst club decisions begin with the same mistake: treating a sensitive private-association environment like an open commercial market.

That legal reset matters. Spain still distinguishes sharply between private conduct, public conduct, and behavior that starts to look commercial. Public possession or consumption can trigger administrative sanctions commonly cited in the EUR601 to EUR30000 range. Barcelona also treated the July 2024 closure orders affecting around 30 clubs as a clear sign that visibility, weak controls, and commercial appearance are not side issues.

That does not mean every imperfect club is fake. It means careful people should stop looking for one magic rule and start reading patterns.

## Why red flags matter more in Barcelona

Barcelona sits inside a four-way pressure system: tourism intensity, neighborhood frustration, club commercialization, and political scrutiny. In that environment, details that look cosmetic from the outside often reveal something deeper inside.

A club that behaves like a private association usually looks slower, quieter, and less eager to impress you in the first five minutes. A club that behaves like an entertainment business may feel smoother at first and riskier once you look closer.

## Red flag 1: the venue feels built for foot traffic, not discretion

If the setup depends on passing strangers, high visibility, or branding that wants to be noticed from the street, pause. The private-association model is built around controlled access, not public discovery.

## Red flag 2: someone is trying to move you fast

Pressure is information. If the process feels rushed, vague, or emotionally engineered, the operator may be optimizing for extraction rather than careful onboarding. Credible clubs usually tolerate friction. Risky ones often fear it.

## Red flag 3: membership looks improvised

Club policy, local practice, and formal legal interpretation are not the same thing. Even so, a real club should still be able to explain its intake logic with some seriousness. No clear membership step, no coherent rules, and no meaningful explanation of IDs or house norms should lower confidence quickly.

## Red flag 4: the language sounds retail from start to finish

Words reveal posture. If a place speaks like a public dispensary, it is telling you something about its risk culture. Menus as identity, product push before club norms, delivery language, and "easy access" promises all point in the wrong direction.

## Red flag 5: privacy feels optional

Privacy is not a decorative courtesy in this category. It is part of how members, staff, and venues reduce exposure. Casual filming, loud sidewalk behavior, and public clustering outside the entrance are all meaningful warning signs.

## Red flag 6: the whole vibe is entertainment packaging

Some venues lean too hard into novelty, event energy, and spectacle. Heavy party branding, nightlife-first framing, and experience packaging do not prove illegitimacy on their own, but together they can point to the wrong incentives.

## What a safer posture usually looks like

Safer does not mean glamorous. It usually means slower intake, clearer boundaries, less public visibility, more respect for privacy, and more seriousness around membership and behavior.

That is why SCM tells people to start with boring verification instead of exciting promises. Read [What Cannabis Social Clubs in Spain Actually Are](/en/editorial/what-are-cannabis-social-clubs-spain), then [The Safety Kit](/en/editorial/safety-kit-visitors-spain), then compare what you are seeing against [SCM's verification standard](/en/mission#verification-standard).

${SCM_REQUIRED_DISCLAIMER}`,
      faq: [
        {
          question: 'Are these red flags proof that a club is illegal?',
          answer:
            "No. They are pattern signals, not courtroom proof. The point is to help people read risk before trusting someone else's process.",
        },
        {
          question: 'Why does Barcelona require more caution than people expect?',
          answer:
            'Because Barcelona combines visibility, tourism pressure, neighborhood fatigue, commercialization risk, and political scrutiny all at once.',
        },
        {
          question: 'What should I do if a venue triggers several of these signs?',
          answer:
            'Slow down, leave if needed, and fall back on verified channels. If a process seems built to remove your judgment, trust that signal.',
        },
      ],
      teaserShort: {
        eyebrow: 'Red Flags',
        title: 'The wrong club usually tells on itself early.',
        body:
          'Speed, visibility, weak privacy, and retail-style language often show up before any bigger problem does.',
        ctaLabel: 'Read the guide',
      },
      teaserMedium: {
        eyebrow: 'Red Flags',
        title: 'How to read the signals before you trust the venue.',
        body:
          'Not every warning sign looks dramatic. In Barcelona, weak legitimacy often appears first in tempo, privacy, visibility, and the language of the process.',
        ctaLabel: 'Open the red flags guide',
      },
      digestCard: {
        eyebrow: 'Red Flags',
        title: 'The signals that usually appear before a bad club decision.',
        body:
          'A practical audit of the cues that point to weak controls, poor incentives, or a venue behaving more like a public business than a private association.',
        ctaLabel: 'Read the red flags guide',
      },
      carouselSlides: [
        {
          eyebrow: 'Audit',
          headline: 'A risky club usually exposes itself before you walk in.',
          body:
            'Look for speed, public visibility, and language that sounds more like a sale than a private-association process.',
        },
        {
          eyebrow: 'Signals',
          headline: 'Improvised membership and weak privacy are not small details.',
          body:
            'In Barcelona they often point to the wrong incentives, weak controls, or both.',
        },
        {
          eyebrow: 'Move',
          headline: 'Do it right, not fast.',
          body:
            'Use slow verification, verified channels, and the Safety Kit before trusting any club process that tries to rush you.',
        },
      ],
      ctaPrimaryLabel: 'Open the Safety Kit',
      ctaSecondaryLabel: 'Review the verification standard',
    },
    es: {
      title: 'Senales rojas en clubes de Barcelona: lo que una persona cuidadosa no deberia ignorar',
      excerpt:
        'Guia premium y prudente sobre las senales que suelen apuntar a legitimidad debil, malos controles o incentivos equivocados.',
      metaTitle:
        'Senales rojas en clubes de Barcelona: lo que una persona cuidadosa no deberia ignorar',
      metaDescription:
        'Aprende a leer las senales rojas de un club en Barcelona sin simplificaciones. Primero contexto legal, despues patrones practicos y Safety Kit.',
      heroImageAlt:
        'Escena urbana discreta en Barcelona que contrasta acceso controlado con visibilidad excesiva',
      body: `Barcelona no recompensa la prisa, el hype ni la mirada retail. Muchos errores empiezan cuando alguien trata un entorno sensible de asociacion privada como si fuera un mercado abierto.

Ese reset legal importa. Espana sigue separando la conducta privada, la conducta publica y la conducta que empieza a parecer comercial. La posesion o el consumo en publico pueden acabar en sanciones administrativas que suelen citarse en la franja de EUR601 a EUR30000. Barcelona tambien trato las ordenes de cierre de julio de 2024, que afectaron a alrededor de 30 clubes, como una senal clara de que visibilidad, controles debiles y apariencia comercial no son detalles menores.

Eso no significa que todo club imperfecto sea falso. Significa que conviene leer patrones.

## Por que las senales rojas pesan mas en Barcelona

Barcelona vive dentro de cuatro presiones a la vez: intensidad turistica, cansancio vecinal, comercializacion y escrutinio politico. En ese contexto, detalles que parecen esteticos muchas veces revelan algo mas profundo.

## Senal roja 1: el lugar parece hecho para trafico de paso, no para discrecion

Si todo depende de peatones, alta visibilidad o branding que quiere ser visto desde la calle, para. El modelo asociativo se apoya en acceso controlado, no en descubrimiento publico.

## Senal roja 2: alguien intenta moverte demasiado rapido

La presion tambien informa. Si el proceso se siente apresurado, vago o emocionalmente empujado, puede que el operador este optimizando extraccion y no onboarding serio.

## Senal roja 3: la membresia parece improvisada

La politica del club, la practica local y la interpretacion legal no son lo mismo. Aun asi, un club real deberia explicar su intake con cierta seriedad. Sin paso claro de membresia, sin reglas coherentes y sin explicacion de IDs o normas internas, la confianza deberia bajar rapido.

## Senal roja 4: todo el lenguaje suena a retail

Las palabras muestran postura. Si un lugar habla como dispensario publico, te esta diciendo algo sobre su cultura de riesgo. Menus como identidad, empuje de producto antes de normas y promesas de acceso facil apuntan en la direccion equivocada.

## Senal roja 5: la privacidad parece opcional

La privacidad no es decorativa. Forma parte de como miembros, staff y espacios reducen exposicion. Grabaciones casuales, ruido fuera y acumulacion visible en la puerta son malas senales.

## Senal roja 6: toda la vibra es packaging de entretenimiento

Algunos lugares empujan demasiado novedad, evento y espectaculo. Branding de fiesta, framing nightlife y experiencia tematizada no prueban nada por si solos, pero juntos pueden apuntar a incentivos equivocados.

## Como suele verse una postura mas segura

Mas segura no significa mas glamourosa. Suele significar intake mas lento, limites mas claros, menos visibilidad publica, mas respeto por privacidad y mas seriedad con membresia y conducta.

Por eso SCM insiste en verificacion aburrida antes que promesas emocionantes. Lee [What Cannabis Social Clubs in Spain Actually Are](/es/editorial/what-are-cannabis-social-clubs-spain), despues [The Safety Kit](/es/editorial/safety-kit-visitors-spain), y compara lo que ves con [el estandar de verificacion de SCM](/es/mission#verification-standard).

${SCM_REQUIRED_DISCLAIMER}`,
      faq: [
        {
          question: 'Estas senales prueban que un club es ilegal?',
          answer:
            'No. Son patrones de riesgo, no prueba judicial. La idea es ayudarte a leer fragilidad antes de confiar.',
        },
        {
          question: 'Por que Barcelona exige mas criterio?',
          answer:
            'Porque mezcla visibilidad, presion de visitantes, cansancio vecinal, comercializacion y escrutinio politico al mismo tiempo.',
        },
        {
          question: 'Que hago si un lugar activa varias senales?',
          answer:
            'Baja el ritmo, sal si hace falta y vuelve a canales verificados. Si un proceso intenta quitarte juicio, esa ya es una respuesta.',
        },
      ],
      teaserShort: {
        eyebrow: 'Senales rojas',
        title: 'El club equivocado suele delatarse pronto.',
        body:
          'Prisa, visibilidad, privacidad debil y lenguaje retail suelen aparecer antes que cualquier problema mayor.',
        ctaLabel: 'Leer la guia',
      },
      teaserMedium: {
        eyebrow: 'Senales rojas',
        title: 'Como leer las pistas antes de confiar en el lugar.',
        body:
          'No toda senal roja parece dramatica. En Barcelona, la legitimidad debil suele aparecer primero en tempo, privacidad y visibilidad.',
        ctaLabel: 'Abrir la guia',
      },
      digestCard: {
        eyebrow: 'Senales rojas',
        title: 'Las pistas que suelen aparecer antes de una mala decision.',
        body:
          'Una auditoria practica de las senales que apuntan a controles flojos, incentivos pobres o un lugar que se comporta mas como negocio que como asociacion.',
        ctaLabel: 'Leer la guia',
      },
      carouselSlides: [
        {
          eyebrow: 'Audit',
          headline: 'Un club arriesgado suele delatarse antes de que entres.',
          body:
            'Mira la prisa, la visibilidad publica y el lenguaje que suena mas a venta que a asociacion privada.',
        },
        {
          eyebrow: 'Signals',
          headline: 'Membresia improvisada y privacidad debil no son detalles pequenos.',
          body:
            'En Barcelona suelen apuntar a incentivos equivocados, controles flojos o ambas cosas.',
        },
        {
          eyebrow: 'Move',
          headline: 'Hazlo bien, no rapido.',
          body:
            'Usa verificacion lenta, canales verificados y el Safety Kit antes de confiar en un proceso que quiera acelerarte.',
        },
      ],
      ctaPrimaryLabel: 'Abrir el Safety Kit',
      ctaSecondaryLabel: 'Ver el estandar de verificacion',
    },
    fr: {
      title: 'Signaux rouges des clubs a Barcelone : ce qu une personne prudente ne devrait jamais ignorer',
      excerpt:
        'Guide premium et prudent sur les signaux qui pointent souvent vers une legitimite faible, de mauvais controles ou de mauvais incitatifs.',
      metaTitle:
        'Signaux rouges des clubs a Barcelone : ce qu une personne prudente ne devrait jamais ignorer',
      metaDescription:
        'Apprenez a lire les signaux rouges d un club a Barcelone avec contexte legal, indices pratiques et orientation Safety Kit.',
      heroImageAlt:
        'Scene urbaine discrete a Barcelone montrant la difference entre acces controle et visibilite excessive',
      body: `Barcelone ne recompense ni la vitesse ni les reflexes de retail public. Beaucoup d erreurs commencent quand quelqu un traite un environnement sensible d association privee comme un marche ouvert.

Ce recalibrage legal compte. En Espagne, conduite privee, conduite publique et comportement a apparence commerciale restent distingues. La possession ou la consommation en public peuvent entrainer des sanctions administratives souvent citees dans la fourchette EUR601 a EUR30000. Barcelone a aussi traite les fermetures de juillet 2024 visant environ 30 clubs comme un signal clair: visibilite, controles faibles et apparence commerciale ne sont pas des details.

Cela ne veut pas dire que tout club imparfait est faux. Cela veut dire qu il faut lire des motifs.

## Pourquoi ces signaux comptent davantage a Barcelone

Barcelone vit sous quatre pressions en meme temps: intensite touristique, fatigue du voisinage, commercialisation et surveillance politique. Dans ce contexte, des details en apparence esthetiques revelent souvent quelque chose de plus profond.

## Signal rouge 1: le lieu semble concu pour le passage, pas pour la discretion

Si tout repose sur les passants, la forte visibilite ou un branding qui veut etre vu depuis la rue, ralentissez. Le modele associatif repose sur l acces controle, pas sur la decouverte publique.

## Signal rouge 2: quelqu un veut vous accelerer

La pression est une information. Si le processus semble precipite, vague ou emotionnellement pousse, l operateur optimise peut-etre l extraction plutot qu une entree serieuse.

## Signal rouge 3: l adhesion parait improvisee

La politique du club, la pratique locale et l interpretation legale ne sont pas la meme chose. Pourtant un vrai club devrait pouvoir expliquer son intake avec un minimum de serieux.

## Signal rouge 4: tout le langage sonne retail

Les mots montrent la posture. Si un lieu parle comme un dispensaire public, il dit quelque chose de sa culture du risque. Menus comme identite, poussee produit avant regles et promesse d acces facile pointent toutes dans la mauvaise direction.

## Signal rouge 5: la vie privee semble optionnelle

La vie privee n est pas decorative. Elle fait partie de la reduction d exposition pour les membres, le staff et le lieu. Videos casuals, bruit devant l entree et regroupements visibles sont des mauvais signes.

## Signal rouge 6: toute l ambiance ressemble a un packaging de divertissement

Certains lieux poussent trop la nouveaute, l evenement et le spectacle. Party branding, framing nightlife et experience thematique ne prouvent rien seuls, mais ensemble ils peuvent signaler de mauvais incitatifs.

## A quoi ressemble souvent une posture plus sure

Plus sure ne veut pas dire plus glamour. Cela veut souvent dire intake plus lent, limites plus claires, moins de visibilite publique, plus de respect pour la vie privee et plus de serieux sur l adhesion et le comportement.

C est pourquoi SCM prefere la verification ennuyeuse aux promesses excitantes. Lire [What Cannabis Social Clubs in Spain Actually Are](/fr/editorial/what-are-cannabis-social-clubs-spain), puis [The Safety Kit](/fr/editorial/safety-kit-visitors-spain), puis comparer avec [la norme de verification de SCM](/fr/mission#verification-standard).

${SCM_REQUIRED_DISCLAIMER}`,
      faq: [
        {
          question: 'Ces signaux prouvent-ils qu un club est illegal?',
          answer:
            'Non. Ce sont des motifs de risque, pas des preuves judiciaires. Ils aident a lire la fragilite avant la confiance.',
        },
        {
          question: 'Pourquoi Barcelone demande-t-elle plus de prudence?',
          answer:
            'Parce que la ville combine visibilite, pression touristique, fatigue du voisinage, commercialisation et surveillance politique.',
        },
        {
          question: 'Que faire si un lieu active plusieurs signaux?',
          answer:
            'Ralentir, partir si necessaire et revenir vers des canaux verifies. Si le processus cherche a reduire votre jugement, cela compte deja beaucoup.',
        },
      ],
      teaserShort: {
        eyebrow: 'Signaux rouges',
        title: 'Le mauvais club se trahit souvent tres tot.',
        body:
          'Vitesse, visibilite, vie privee faible et langage retail apparaissent souvent avant le reste.',
        ctaLabel: 'Lire le guide',
      },
      teaserMedium: {
        eyebrow: 'Signaux rouges',
        title: 'Comment lire les indices avant de faire confiance.',
        body:
          'A Barcelone, une legitimite fragile apparait souvent d abord dans le tempo, la vie privee et la visibilite.',
        ctaLabel: 'Ouvrir le guide',
      },
      digestCard: {
        eyebrow: 'Signaux rouges',
        title: 'Les indices qui apparaissent souvent avant une mauvaise decision.',
        body:
          'Une grille pratique pour reperer les lieux avec mauvais controles, mauvais incitatifs ou posture trop proche d un commerce public.',
        ctaLabel: 'Lire le guide',
      },
      carouselSlides: [
        {
          eyebrow: 'Audit',
          headline: 'Un club risque se montre souvent avant meme votre entree.',
          body:
            'Regardez la vitesse, la visibilite publique et un langage qui sonne plus vente que club prive.',
        },
        {
          eyebrow: 'Signals',
          headline: 'Adhesion improvisee et vie privee faible ne sont pas des details.',
          body:
            'A Barcelone, ces signes pointent souvent vers de mauvais incitatifs, de mauvais controles, ou les deux.',
        },
        {
          eyebrow: 'Move',
          headline: 'Faites-le bien, pas vite.',
          body:
            'Utilisez verification lente, canaux verifies et Safety Kit avant de faire confiance a un processus qui veut vous presser.',
        },
      ],
      ctaPrimaryLabel: 'Ouvrir le Safety Kit',
      ctaSecondaryLabel: 'Voir la norme de verification',
    },
    de: {
      title: 'Warnsignale bei Clubs in Barcelona: Was vorsichtige Menschen nie ignorieren sollten',
      excerpt:
        'Praeziser, sicherheitsorientierter Guide zu den Mustern, die oft auf schwache Legitimation, schlechte Kontrollen oder falsche Anreize hindeuten.',
      metaTitle:
        'Warnsignale bei Clubs in Barcelona: Was vorsichtige Menschen nie ignorieren sollten',
      metaDescription:
        'Lerne die wichtigsten Warnsignale bei Clubs in Barcelona kennen. Erst Rechtskontext, dann praktische Muster und der Safety Kit als naechster Schritt.',
      heroImageAlt:
        'Diskrete Strassenszene in Barcelona mit Fokus auf kontrollierten Zugang statt oeffentlicher Sichtbarkeit',
      body: `Barcelona belohnt keine Eile und keine Retail-Annahmen. Viele schlechte Entscheidungen beginnen dort, wo jemand eine sensible private Vereinslogik wie einen offenen Markt liest.

Dieser rechtliche Reset ist wichtig. In Spanien werden privates Verhalten, oeffentliches Verhalten und Verhalten mit kommerziellem Anschein weiterhin deutlich unterschieden. Oeffentlicher Besitz oder Konsum koennen zu Verwaltungssanktionen fuehren, die haeufig im Bereich von EUR601 bis EUR30000 genannt werden. Barcelona behandelte auch die Schliessungsanordnungen vom Juli 2024 gegen rund 30 Clubs als klares Signal: Sichtbarkeit, schwache Kontrollen und ein zu kommerzieller Auftritt sind keine Nebensachen.

Das bedeutet nicht, dass jeder unperfekte Club falsch ist. Es bedeutet, dass man Muster lesen sollte.

## Warum Warnsignale in Barcelona besonders wichtig sind

Barcelona steht unter vier Drucklagen zugleich: touristische Intensitaet, Nachbarschaftsfrust, Kommerzialisierung und politische Kontrolle. In so einem Umfeld verraet die Oberflaeche oft etwas Tieferes.

## Warnsignal 1: der Ort ist fuer Laufkundschaft gebaut, nicht fuer Diskretion

Wenn alles auf Passanten, hohe Sichtbarkeit oder auffaelliges Branding setzt, halte inne. Das Vereinsmodell lebt von kontrolliertem Zugang, nicht von oeffentlicher Entdeckung.

## Warnsignal 2: jemand will dich zu schnell bewegen

Druck ist Information. Wenn sich der Prozess hektisch, vage oder psychologisch geschoben anfuehlt, wird moeglicherweise Extraktion statt sorgfaeltigem Onboarding optimiert.

## Warnsignal 3: Mitgliedschaft wirkt improvisiert

Club-Policy, lokale Praxis und formale Rechtsauslegung sind nicht identisch. Trotzdem sollte ein realer Club seinen Intake mit einer gewissen Ernsthaftigkeit erklaeren koennen.

## Warnsignal 4: die Sprache klingt durchgehend nach Retail

Worte zeigen Haltung. Wenn ein Ort wie ein oeffentlicher Dispensary spricht, sagt das etwas ueber seine Risikokultur. Menues als Identitaet, Produktdruck vor Regeln und Versprechen von einfachem Zugang weisen alle in die falsche Richtung.

## Warnsignal 5: Privatsphaere wirkt optional

Privatsphaere ist nicht dekorativ. Sie gehoert zur Risikoreduzierung fuer Mitglieder, Team und Ort. Lockere Video-Kultur, lautes Verhalten vor dem Eingang und sichtbare Gruppen draussen sind schlechte Zeichen.

## Warnsignal 6: die gesamte Stimmung ist Entertainment-Verpackung

Manche Orte pushen Neuheit, Event und Spektakel zu stark. Party-Branding, Nightlife-Rahmung und Erlebnisverpackung beweisen fuer sich nichts, koennen zusammen aber auf falsche Anreize hindeuten.

## Wie eine sicherere Haltung meist aussieht

Sicherer bedeutet nicht glamouroeser. Meist bedeutet es langsameren Intake, klarere Grenzen, weniger oeffentliche Sichtbarkeit, mehr Respekt fuer Privatsphaere und mehr Ernst bei Mitgliedschaft und Verhalten.

Darum bevorzugt SCM langweilige Verifikation statt aufregender Versprechen. Lies [What Cannabis Social Clubs in Spain Actually Are](/de/editorial/what-are-cannabis-social-clubs-spain), dann [The Safety Kit](/de/editorial/safety-kit-visitors-spain), dann vergleiche mit [dem SCM-Verifikationsstandard](/de/mission#verification-standard).

${SCM_REQUIRED_DISCLAIMER}`,
      faq: [
        {
          question: 'Beweisen diese Warnsignale, dass ein Club illegal ist?',
          answer:
            'Nein. Es sind Risikomuster, keine gerichtlichen Beweise. Sie helfen, Fragilitaet vor der Vertrauensentscheidung zu lesen.',
        },
        {
          question: 'Warum braucht Barcelona mehr Vorsicht als viele erwarten?',
          answer:
            'Weil die Stadt Sichtbarkeit, Tourismusdruck, Nachbarschaftsfrust, Kommerzialisierung und politische Kontrolle zugleich verbindet.',
        },
        {
          question: 'Was tun, wenn ein Ort mehrere dieser Signale zeigt?',
          answer:
            'Tempo rausnehmen, notfalls gehen und zu verifizierten Kanaelen zurueckkehren. Wenn ein Prozess dein Urteil verkleinern will, ist das selbst schon ein Signal.',
        },
      ],
      teaserShort: {
        eyebrow: 'Warnsignale',
        title: 'Der falsche Club verraet sich oft frueh.',
        body:
          'Tempo, Sichtbarkeit, schwache Privatsphaere und Retail-Sprache tauchen oft vor groesseren Problemen auf.',
        ctaLabel: 'Guide lesen',
      },
      teaserMedium: {
        eyebrow: 'Warnsignale',
        title: 'Wie man Muster liest, bevor man dem Ort vertraut.',
        body:
          'In Barcelona zeigt sich schwache Legitimation oft zuerst in Tempo, Privatsphaere und Sichtbarkeit.',
        ctaLabel: 'Warnsignal-Guide oeffnen',
      },
      digestCard: {
        eyebrow: 'Warnsignale',
        title: 'Die Muster, die oft vor einer schlechten Club-Entscheidung auftauchen.',
        body:
          'Ein praktischer Audit der Hinweise auf schwache Kontrollen, falsche Anreize oder einen Ort, der eher wie ein Geschaeft als wie ein Verein auftritt.',
        ctaLabel: 'Guide lesen',
      },
      carouselSlides: [
        {
          eyebrow: 'Audit',
          headline: 'Ein riskanter Club zeigt sich oft schon vor dem Eintritt.',
          body:
            'Achte auf Tempo, oeffentliche Sichtbarkeit und Sprache, die mehr nach Verkauf als nach Verein klingt.',
        },
        {
          eyebrow: 'Signals',
          headline: 'Improvisierte Mitgliedschaft und schwache Privatsphaere sind keine Kleinigkeiten.',
          body:
            'In Barcelona deuten sie oft auf falsche Anreize, schwache Kontrollen oder beides zugleich hin.',
        },
        {
          eyebrow: 'Move',
          headline: 'Mach es richtig, nicht schnell.',
          body:
            'Nutze langsame Verifikation, verifizierte Kanaele und den Safety Kit, bevor du einem beschleunigten Prozess vertraust.',
        },
      ],
      ctaPrimaryLabel: 'Safety Kit oeffnen',
      ctaSecondaryLabel: 'Verifikationsstandard ansehen',
    },
  },
  imagePromptBundle: {
    artDirection:
      'Premium editorial, cinematic, European, restrained, and legally grounded. Barcelona should feel real, urban, and civic rather than playful, tropical, or nightlife-hyped.',
    assets: [
      {
        id: 'red-flags-hero',
        useCase: 'hero',
        bestUse: 'Article hero and digest thumbnail for the red-flags package.',
        aspectRatio: '16:9',
        masterPrompt:
          'Create a premium editorial image set on a real-feeling Barcelona street at blue hour outside a discreet doorway that could plausibly belong to a private association, not a retail store. Show one thoughtful adult figure pausing before entry while subtle warning cues exist in the environment: over-visible branding, a flyer on the pavement, and a noisy group slightly out of focus farther down the block. The mood should feel cautious, observant, and intelligent rather than sensational. Use cinematic naturalism, Mediterranean stone, charcoal, muted amber, oxidized green, and restrained low-key lighting aligned with SCMs dark editorial look. No explicit cannabis consumption, no transaction, no police raid, no nightclub neon, no novelty props.',
        variantGuidance: [
          'Generate one version with stronger architectural emphasis.',
          'Generate one version with stronger human foreground focus while preserving the same cautious tone.',
        ],
      },
      {
        id: 'red-flags-carousel',
        useCase: 'carousel',
        bestUse: 'Square audit carousel support image and story cutdown.',
        aspectRatio: '1:1',
        masterPrompt:
          'Generate a cinematic split-scene editorial comparison about club warning signs in Barcelona. One side should feel discreet, controlled, and low-visibility. The other side should feel over-exposed, hype-driven, and commercially careless, but still realistic and restrained. The composition should look like intelligence analysis, not advertising. Use dark neutrals, concrete textures, muted amber highlights, and subtle Catalan urban cues. Keep all people adult, understated, and naturally dressed. No obvious cannabis symbols, no smoke, no retail counter, no text baked into the image.',
        variantGuidance: [
          'Prefer strong visual contrast between controlled-access posture and visibility-first posture.',
          'Leave enough negative space for editorial text overlays.',
        ],
      },
      {
        id: 'red-flags-teaser',
        useCase: 'teaser',
        bestUse: 'Homepage teaser and featured-vault support image.',
        aspectRatio: '4:5',
        masterPrompt:
          'Produce a refined editorial still-life and environmental composite for a Barcelona club red-flags story: discreet doorway details, a blurred city plaque, a folded flyer, and a phone turned face-down near a members-only buzzer plate. The tone should communicate caution, discernment, and verification. Use cinematic low-key lighting, premium magazine composition, and a restrained palette of charcoal, bronze, slate, and dark olive. No cannabis leaves, no product shots, no menu boards, no party vibe, no sourcing cues.',
        variantGuidance: [
          'Create one tighter object-led version.',
          'Create one wider doorway-led version for homepage and email flexibility.',
        ],
      },
    ],
    negativePromptList: NEGATIVE_PROMPTS,
    cropGuidance: {
      landscape:
        'Keep the doorway and primary subject slightly off-center so editorial text can sit in negative space without covering the warning cue.',
      square:
        'Preserve the main subject near the center with enough edge room to crop for IG square without losing the environmental tension.',
      portrait:
        'Leave extra headroom and foreground depth so the same image can convert into a vertical story card without cutting the focal point.',
    },
  },
  legalReview: {
    riskClassification: 'MEDIUM',
    disclaimerRequired: true,
    status: 'PASS',
    notes: [
      'Legal context appears before practical warning signs.',
      'No guaranteed outcomes or facilitation language.',
      'Barcelona pressure is described with civic nuance rather than anti-visitor rhetoric.',
      'Disclaimer included because access-risk guidance is present.',
    ],
  },
};

export default redFlagsPackage;
