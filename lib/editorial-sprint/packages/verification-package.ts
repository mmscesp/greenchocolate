import type { Locale } from '@/lib/i18n-config';

type SupportedLocale = Extract<Locale, 'en' | 'es' | 'fr' | 'de'>;

type LocalizedStringMap = Record<SupportedLocale, string>;

interface ArticleLocaleContent {
  title: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  body: string;
}

interface CarouselSlide {
  id: string;
  visualIntent: string;
  headline: LocalizedStringMap;
  body: LocalizedStringMap;
}

interface DigestCardCopy {
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
}

interface ImagePromptAsset {
  masterPrompt: string;
  negativePrompt: string[];
  variantGuidance: string;
  bestUseNote: string;
  cropNote: string;
}

interface VerificationContentPackage {
  pillar: 'Verification';
  canonicalSlug: string;
  canonicalTitle: string;
  canonicalLocale: 'en';
  locales: Record<SupportedLocale, ArticleLocaleContent>;
  carouselTemplate: 'spotlight';
  carouselFallbackTemplate: 'single-post';
  carouselSlides: CarouselSlide[];
  teaserShort: LocalizedStringMap;
  teaserMedium: LocalizedStringMap;
  digestCardCopy: Record<SupportedLocale, DigestCardCopy>;
  ctaPrimary: {
    label: LocalizedStringMap;
    href: string;
  };
  ctaSecondary: {
    label: LocalizedStringMap;
    href: string;
  };
  internalLinkSpine: string[];
  legalAnchors: string[];
  disclaimerRequired: boolean;
  disclaimerText: string;
  imageAssets: {
    hero: ImagePromptAsset;
    carouselSupport: ImagePromptAsset;
    teaserBanner: ImagePromptAsset;
  };
  legalReview: {
    riskClassification: 'LOW' | 'MEDIUM' | 'HIGH';
    disclaimerStatus: 'REQUIRED';
    finalStatus: 'PASS';
    notes: string[];
  };
}

const DISCLAIMER_TEXT =
  'SCM provides information, not legal advice. The legal landscape for cannabis social clubs in Spain is complex and evolving. Always verify club status independently and consult local legal resources if in doubt.';

const INTERNAL_LINK_SPINE = [
  '/en/editorial/what-are-cannabis-social-clubs-spain',
  '/en/editorial/spain-cannabis-laws-tourists',
  '/en/editorial/safety-kit-visitors-spain',
  '/en/editorial/scams-red-flags',
  '/en/editorial/first-time-barcelona-cannabis-club',
  '/en/mission#verification-standard',
] as const;

const LEGAL_ANCHORS = [
  'Spain distinguishes private association activity from public possession and consumption, which are commonly cited as carrying administrative fines in the EUR601-EUR30000 range.',
  'Barcelona club risk is shaped by more than black-letter law: commercial appearance, neighborhood friction, police scrutiny, and municipal posture all matter.',
  'Recent court and enforcement trends have increased pressure on clubs that look tourist-facing, highly visible, or commercially organized rather than member-led.',
  'SCM can explain a verification standard, but it cannot certify legal outcomes or guarantee that any club will remain open, compliant, or suitable for a given person.',
] as const;

const HERO_NEGATIVE_PROMPT = [
  'no cannabis leaves as hero motif',
  'no smoke clouds or glamorized consumption',
  'no dispensary counters or retail checkout visuals',
  'no neon stoner aesthetics',
  'no party-tourism imagery',
  'no explicit exchange of money, passes, or products',
];

const locales: Record<SupportedLocale, ArticleLocaleContent> = {
  en: {
    title: 'How SCM Thinks About Verification: What a Credible Club Guide Should Actually Check',
    excerpt:
      'A useful club guide is not the one with the biggest list. It is the one with a defensible standard, a smaller verified set, and the discipline to say no.',
    metaTitle:
      'SCM Verification Standard | What a Credible Barcelona Club Guide Should Check',
    metaDescription:
      'SCM explains the verification standard behind a smaller, safer club set in Barcelona and Spain: registry status, house rules, premises posture, and member onboarding.',
    body: `## Legal reality first

Barcelona is not a category where bigger automatically means better. Cannabis social clubs sit inside a fragile legal and civic environment, and that means a public guide has to be judged by the quality of its filters, not by how many names it can publish.

That is why SCM does not treat verification like a decorative badge. We treat it like a public-safety discipline. A club can exist online, appear active, or attract attention and still fail the credibility test that matters to a careful member.

SCM provides information, not legal advice, and it does not guarantee outcomes. What it can do is explain what a credible guide should actually verify before presenting a club as trustworthy.

## Why a smaller verified set matters

The easiest directory model is to publish everything, sort later, and let volume look like authority. That model is weak for Barcelona.

A city under pressure rewards restraint. When the category already faces scrutiny around commercialization, visibility, and neighborhood impact, a guide that publishes indiscriminately does not create clarity. It creates noise.

That is why SCM starts from a simple principle: a small verified set beats a giant unvetted list.

The goal is not to imply that every unlisted club is bad or that every listed club is risk-free. The goal is to make the public layer more useful by applying a visible standard and by refusing hype language that sounds like a marketplace.

## The four checks behind the standard

### 1. Association registry status

The first question is basic but non-negotiable: does the club appear to operate as an actual association rather than as a vague commercial shell? Registry status alone is not enough, but it is the beginning of any serious review.

### 2. Statutes and house-rule alignment

A credible club should look like it understands the private association model. That includes whether its rules, language, and member expectations align with a controlled private setting rather than an entertainment business.

### 3. Physical premises and controlled-access posture

The premises matter. A club that looks built for visibility, retail-style discovery, or loose walk-in behavior creates a different risk profile from one that clearly behaves like a private, controlled-access space.

### 4. Safe member onboarding process

A credible onboarding flow is careful, not chaotic. That does not mean there is one universal format. It means the process should signal discretion, consistency, and respect for the fact that club policy, local practice, and legal interpretation are not the same thing.

## What verification does not mean

Verification is not ownership. It is not sponsorship. It is not a promise that every experience will be smooth, and it is not a declaration that a club is fully legal or risk-free.

SCM's job on the public layer is narrower and more disciplined:

- explain the standard
- reduce obvious weak signals
- help readers separate club marketing from club credibility
- keep the conversation grounded in the private association model

That is also why SCM avoids "best weed clubs" framing. In Barcelona, that language is not just lazy. It pushes the category toward the exact commercial appearance that has made the city more exposed.

## Why this matters more in Barcelona

Barcelona has lived through a collision of tourism pressure, neighborhood frustration, club commercialization, and political scrutiny. In that environment, verification is not a luxury feature. It is one of the few ways to keep a guide useful without becoming part of the problem.

Many public misunderstandings come from treating clubs like public retail venues. A credible guide has to do the opposite. It should clarify the difference between legal text, police assumptions, club policy, and common myths. It should also be willing to say that not every visible club posture deserves trust.

## What a careful reader should expect from any guide

If a guide wants your trust, ask:

- Does it explain what it checks?
- Does it separate information from legal advice?
- Does it sound like a directory, or like a seller?
- Does it acknowledge Barcelona's civic pressure instead of flattening the city into a lifestyle product?
- Does it present a verification logic that could still make sense if the list stays intentionally small?

Those questions matter more than list size.

## Final take

SCM's view is straightforward: clubs should be selected, never bought. A guide earns trust by showing its standard, not by publishing the longest catalogue in the market.

If you want to understand the public-safe side of Spain's club landscape, start with the standard. Then use the Safety Kit and the wider editorial layer to understand risk, etiquette, and why Barcelona requires more care than generic cannabis travel content suggests.

## FAQ

### Does verification mean a club is guaranteed to be legal or safe?

No. Verification is a credibility screen, not a legal guarantee or a promise of outcome.

### Why not just list every club and let readers decide?

Because in a sensitive category, a giant unfiltered list often creates more confusion than value. A smaller verified set is easier to defend and safer to navigate.

### Is verification just a marketing label?

It should not be. If a guide cannot explain what it checks, the label is not doing much work.

### Why does Barcelona need a stricter standard than a generic city guide?

Because the city sits under unusual pressure from commercialization, visibility, neighborhood tension, and political scrutiny. That changes the risk context for both clubs and public-facing guides.`,
  },
  es: {
    title:
      'Cómo entiende SCM la verificación: qué debería comprobar de verdad una guía creíble de clubes',
    excerpt:
      'Una guía útil no es la que publica la lista más larga. Es la que tiene un criterio defendible, un conjunto verificado más pequeño y la disciplina de decir que no.',
    metaTitle:
      'Estándar de verificación de SCM | Qué debe comprobar una guía creíble de clubes en Barcelona',
    metaDescription:
      'SCM explica el estándar de verificación detrás de una selección más pequeña y segura en Barcelona y España: registro asociativo, normas internas, local y proceso de incorporación.',
    body: `## Primero, la realidad legal

Barcelona no es una categoría en la que "más" signifique automáticamente "mejor". Los clubes sociales de cannabis operan dentro de un entorno legal y cívico frágil, y eso significa que una guía pública debe medirse por la calidad de sus filtros, no por la cantidad de nombres que consigue publicar.

Por eso SCM no trata la verificación como una insignia decorativa. La tratamos como una disciplina de seguridad pública. Un club puede existir online, parecer activo o llamar la atención y aun así no superar la prueba de credibilidad que importa para una persona prudente.

SCM ofrece información, no asesoramiento jurídico, y no garantiza resultados. Lo que sí puede hacer es explicar qué debería comprobar realmente una guía creíble antes de presentar un club como fiable.

## Por qué importa más un conjunto verificado pequeño

El modelo de directorio más fácil es publicarlo todo, ordenar después y dejar que el volumen parezca autoridad. Ese modelo es débil para Barcelona.

Una ciudad bajo presión premia la contención. Cuando la categoría ya afronta escrutinio por comercialización, visibilidad e impacto vecinal, una guía que publica sin criterio no aporta claridad. Aporta ruido.

Por eso SCM parte de una idea simple: un conjunto verificado pequeño vale más que una lista gigante sin filtrar.

El objetivo no es insinuar que todo club no listado sea malo ni que todo club listado esté libre de riesgo. El objetivo es hacer más útil la capa pública aplicando un estándar visible y evitando el lenguaje de hype que suena a marketplace.

## Las cuatro comprobaciones del estándar

### 1. Situación registral de la asociación

La primera pregunta es básica, pero no negociable: ¿el club parece operar como una asociación real y no como una carcasa comercial ambigua? El registro, por sí solo, no basta, pero es el inicio de cualquier revisión seria.

### 2. Coherencia entre estatutos y normas internas

Un club creíble debería parecer entender el modelo de asociación privada. Eso incluye si sus reglas, lenguaje y expectativas para miembros encajan con un entorno privado y controlado, y no con un negocio de entretenimiento.

### 3. Local físico y postura de acceso controlado

El espacio importa. Un club diseñado para la visibilidad, el descubrimiento tipo retail o un comportamiento de entrada demasiado suelto presenta un perfil de riesgo distinto al de un espacio claramente privado y de acceso controlado.

### 4. Proceso seguro de incorporación de miembros

Un proceso de incorporación creíble es cuidadoso, no caótico. Eso no significa que exista un formato universal. Significa que el proceso debe transmitir discreción, consistencia y respeto por el hecho de que la política del club, la práctica local y la interpretación jurídica no son lo mismo.

## Lo que la verificación no significa

La verificación no es propiedad. No es patrocinio. No es una promesa de que todo vaya a salir bien, y no es una declaración de que un club sea plenamente legal o libre de riesgo.

La labor de SCM en la capa pública es más limitada y más disciplinada:

- explicar el estándar
- reducir señales débiles evidentes
- ayudar a separar marketing del club y credibilidad del club
- mantener la conversación anclada en el modelo de asociación privada

Por eso SCM evita el enfoque de "mejores clubes de weed". En Barcelona ese lenguaje no es solo perezoso. Empuja a la categoría hacia la misma apariencia comercial que ha hecho a la ciudad más expuesta.

## Por qué esto importa más en Barcelona

Barcelona ha vivido la colisión entre presión turística, frustración vecinal, comercialización de clubes y escrutinio político. En ese entorno, la verificación no es un extra. Es una de las pocas formas de mantener útil una guía sin convertirse en parte del problema.

Muchos malentendidos públicos nacen de tratar los clubes como si fueran locales de venta abiertos al público. Una guía creíble debe hacer lo contrario. Debe aclarar la diferencia entre texto legal, supuestos policiales, política del club y mitos comunes. También debe estar dispuesta a decir que no toda postura visible merece confianza.

## Qué debería esperar una persona cuidadosa de cualquier guía

Si una guía quiere tu confianza, pregúntate:

- ¿Explica qué comprueba?
- ¿Separa la información del asesoramiento jurídico?
- ¿Suena a directorio o a vendedor?
- ¿Reconoce la presión cívica de Barcelona en lugar de convertir la ciudad en un producto lifestyle?
- ¿Presenta una lógica de verificación que siga teniendo sentido aunque la lista sea deliberadamente pequeña?

Esas preguntas importan más que el tamaño del listado.

## Conclusión

La postura de SCM es clara: los clubes se seleccionan, no se compran. Una guía se gana la confianza mostrando su estándar, no publicando el catálogo más largo del mercado.

Si quieres entender la capa pública y segura del panorama de clubes en España, empieza por el estándar. Después usa la Safety Kit y el resto de la capa editorial para entender riesgo, etiqueta y por qué Barcelona exige más cuidado del que sugieren los contenidos genéricos de cannabis y viajes.

## FAQ

### ¿La verificación significa que un club está garantizado como legal o seguro?

No. La verificación es un filtro de credibilidad, no una garantía legal ni una promesa de resultado.

### ¿Por qué no listar todos los clubes y dejar que la gente decida?

Porque en una categoría sensible, una lista gigante sin filtrar suele generar más confusión que valor. Un conjunto verificado pequeño es más defendible y más seguro de navegar.

### ¿La verificación es solo una etiqueta de marketing?

No debería serlo. Si una guía no puede explicar qué comprueba, la etiqueta sirve de poco.

### ¿Por qué Barcelona necesita un estándar más estricto que una guía genérica de ciudad?

Porque la ciudad vive bajo una presión poco habitual por comercialización, visibilidad, tensión vecinal y escrutinio político. Eso cambia el contexto de riesgo tanto para los clubes como para las guías públicas.`,
  },
  fr: {
    title:
      "Comment SCM pense la vérification : ce qu'un guide crédible des clubs devrait réellement contrôler",
    excerpt:
      "Un guide utile n'est pas celui qui affiche la liste la plus longue. C'est celui qui applique une norme défendable, un ensemble vérifié plus restreint, et la discipline de dire non.",
    metaTitle:
      'Norme de vérification SCM | Ce qu’un guide crédible des clubs à Barcelone devrait contrôler',
    metaDescription:
      "SCM explique la norme de vérification derrière une sélection plus restreinte et plus sûre à Barcelone et en Espagne : statut associatif, règles internes, lieu physique et intégration des membres.",
    body: `## Commencer par la réalité juridique

À Barcelone, plus grand ne veut pas dire meilleur. Les clubs sociaux cannabiques évoluent dans un environnement juridique et civique fragile. Un guide public doit donc être jugé sur la qualité de ses filtres, pas sur la quantité de noms qu'il publie.

C'est pour cela que SCM ne traite pas la vérification comme un badge décoratif. Nous la traitons comme une discipline de sécurité publique. Un club peut exister en ligne, sembler actif, ou attirer l'attention, tout en échouant au test de crédibilité qui compte pour une personne prudente.

SCM fournit de l'information, pas un conseil juridique, et ne garantit aucun résultat. En revanche, SCM peut expliquer ce qu'un guide crédible devrait réellement vérifier avant de présenter un club comme digne de confiance.

## Pourquoi un ensemble vérifié plus restreint a plus de valeur

Le modèle d'annuaire le plus simple consiste à tout publier, trier ensuite, et laisser le volume ressembler à de l'autorité. Ce modèle est faible pour Barcelone.

Une ville sous pression récompense la retenue. Quand la catégorie fait déjà l'objet d'un examen attentif autour de la commercialisation, de la visibilité et de l'impact sur les quartiers, un guide qui publie sans discernement ne crée pas de clarté. Il crée du bruit.

SCM part donc d'un principe simple : un ensemble vérifié plus restreint vaut mieux qu'une liste géante non filtrée.

L'objectif n'est pas de suggérer que tout club non listé est mauvais, ni que tout club listé est sans risque. L'objectif est de rendre la couche publique plus utile en appliquant une norme visible et en refusant le langage de hype qui ressemble à une marketplace.

## Les quatre contrôles derrière la norme

### 1. Le statut associatif

La première question est élémentaire mais non négociable : le club semble-t-il fonctionner comme une véritable association, et non comme une simple coque commerciale ? Le registre ne suffit pas à lui seul, mais c'est le point de départ de toute évaluation sérieuse.

### 2. La cohérence entre statuts et règlement interne

Un club crédible doit montrer qu'il comprend le modèle de l'association privée. Cela inclut la cohérence entre ses règles, son langage, et les attentes adressées aux membres, dans un cadre privé et contrôlé plutôt que dans une logique de divertissement commercial.

### 3. Le lieu physique et la posture d'accès contrôlé

Le lieu compte. Un club conçu pour la visibilité, la découverte façon retail, ou les entrées trop libres n'a pas le même profil de risque qu'un espace qui se comporte clairement comme un lieu privé à accès contrôlé.

### 4. Un processus d'intégration des membres sûr

Une intégration crédible est soigneuse, pas chaotique. Cela ne veut pas dire qu'il existe un format universel. Cela signifie que le processus doit signaler de la discrétion, de la cohérence, et le respect du fait que la politique du club, la pratique locale, et l'interprétation du droit ne sont pas la même chose.

## Ce que la vérification ne veut pas dire

La vérification n'est ni propriété, ni sponsoring, ni promesse que tout se passera bien. Ce n'est pas non plus une déclaration selon laquelle un club serait pleinement légal ou sans risque.

Le rôle de SCM sur la couche publique est plus étroit et plus discipliné :

- expliquer la norme
- réduire les signaux faibles évidents
- aider à distinguer le marketing d'un club de sa crédibilité réelle
- maintenir la conversation ancrée dans le modèle de l'association privée

SCM évite aussi la logique "meilleurs clubs weed". À Barcelone, ce langage n'est pas seulement paresseux. Il pousse la catégorie vers l'apparence commerciale qui rend déjà la ville plus exposée.

## Pourquoi c'est encore plus important à Barcelone

Barcelone vit à l'intersection de la pression touristique, de la frustration de quartier, de la commercialisation des clubs et du contrôle politique. Dans ce contexte, la vérification n'est pas un luxe. C'est l'un des rares moyens de garder un guide utile sans devenir une partie du problème.

Beaucoup de malentendus publics viennent du fait que les clubs sont pris pour des lieux de vente ouverts au public. Un guide crédible doit faire l'inverse. Il doit clarifier la différence entre texte juridique, hypothèses policières, politique interne du club et mythes courants. Il doit aussi être capable de dire que toute posture visible ne mérite pas automatiquement la confiance.

## Ce qu'un lecteur prudent devrait attendre d'un guide

Si un guide veut votre confiance, demandez-vous :

- Explique-t-il ce qu'il vérifie ?
- Sépare-t-il l'information du conseil juridique ?
- Ressemble-t-il à un annuaire ou à un vendeur ?
- Reconnaît-il la pression civique de Barcelone au lieu de réduire la ville à un produit lifestyle ?
- Présente-t-il une logique de vérification qui tient encore debout si la liste reste volontairement restreinte ?

Ces questions comptent davantage que la taille de la liste.

## Conclusion

La position de SCM est simple : les clubs sont sélectionnés, jamais achetés. Un guide mérite la confiance en montrant sa norme, pas en publiant le catalogue le plus long du marché.

Si vous voulez comprendre la couche publique et prudente du paysage des clubs en Espagne, commencez par la norme. Ensuite, utilisez la Safety Kit et le reste de la couche éditoriale pour comprendre le risque, l'étiquette et les raisons pour lesquelles Barcelone exige plus de nuance que les contenus génériques sur le cannabis et le voyage.

## FAQ

### La vérification garantit-elle qu'un club est légal ou sûr ?

Non. La vérification est un filtre de crédibilité, pas une garantie juridique ni une promesse de résultat.

### Pourquoi ne pas simplement lister tous les clubs et laisser les lecteurs décider ?

Parce que dans une catégorie sensible, une liste géante non filtrée crée souvent plus de confusion que de valeur. Un ensemble vérifié plus restreint est plus défendable et plus sûr à parcourir.

### La vérification n'est-elle qu'une étiquette marketing ?

Elle ne devrait pas l'être. Si un guide n'est pas capable d'expliquer ce qu'il contrôle, l'étiquette ne fait pas grand-chose.

### Pourquoi Barcelone a-t-elle besoin d'une norme plus stricte qu'un guide de ville générique ?

Parce que la ville subit une pression inhabituelle liée à la commercialisation, à la visibilité, aux tensions de quartier et au contrôle politique. Cela change le contexte de risque pour les clubs comme pour les guides publics.`,
  },
  de: {
    title:
      'Wie SCM Verifizierung versteht: Was ein glaubwuerdiger Club-Guide wirklich pruefen sollte',
    excerpt:
      'Ein nuetzlicher Guide ist nicht der mit der laengsten Liste. Es ist der mit einem belastbaren Standard, einer kleineren verifizierten Auswahl und der Disziplin, nein zu sagen.',
    metaTitle:
      'SCM-Verifizierungsstandard | Was ein glaubwuerdiger Club-Guide in Barcelona pruefen sollte',
    metaDescription:
      'SCM erklaert den Verifizierungsstandard hinter einer kleineren, sichereren Club-Auswahl in Barcelona und Spanien: Vereinsstatus, Hausregeln, Raumpraesenz und Mitgliederaufnahme.',
    body: `## Zuerst die rechtliche Realitaet

Barcelona ist keine Kategorie, in der groesser automatisch besser bedeutet. Cannabis Social Clubs bewegen sich in einem fragilen rechtlichen und gesellschaftlichen Umfeld. Deshalb muss ein oeffentlicher Guide nach der Qualitaet seiner Filter bewertet werden, nicht nach der Zahl der veroeffentlichten Namen.

Darum behandelt SCM Verifizierung nicht wie ein dekoratives Label. Wir behandeln sie wie eine Disziplin der oeffentlichen Vorsicht. Ein Club kann online sichtbar sein, aktiv wirken oder Aufmerksamkeit erzeugen und trotzdem den Glaubwuerdigkeitstest nicht bestehen, der fuer vorsichtige Menschen wirklich zaehlt.

SCM stellt Informationen bereit, keine Rechtsberatung, und garantiert keine Ergebnisse. Was SCM tun kann, ist zu erklaeren, was ein glaubwuerdiger Guide tatsaechlich pruefen sollte, bevor er einen Club als vertrauenswuerdig darstellt.

## Warum eine kleinere verifizierte Auswahl mehr wert ist

Das einfachste Verzeichnis-Modell ist, alles zu veroeffentlichen, spaeter zu sortieren und Menge wie Autoritaet aussehen zu lassen. Fuer Barcelona ist dieses Modell schwach.

Eine Stadt unter Druck belohnt Zurueckhaltung. Wenn die Kategorie ohnehin wegen Kommerzialisierung, Sichtbarkeit und Nachbarschaftskonflikten unter Beobachtung steht, schafft ein Guide ohne klare Auswahl nicht mehr Klarheit. Er schafft mehr Rauschen.

Deshalb startet SCM von einem einfachen Prinzip: Eine kleine verifizierte Auswahl ist besser als eine riesige ungepruefte Liste.

Das Ziel ist nicht zu behaupten, dass jeder nicht gelistete Club schlecht ist oder jeder gelistete Club risikofrei waere. Das Ziel ist, die oeffentliche Ebene nuetzlicher zu machen, indem ein sichtbarer Standard angewendet und Hype-Sprache vermieden wird, die wie ein Marktplatz klingt.

## Die vier Prueffelder hinter dem Standard

### 1. Vereins- und Registerstatus

Die erste Frage ist einfach, aber nicht verhandelbar: Wirkt der Club wie eine echte Vereinigung und nicht wie eine unklare kommerzielle Huelle? Ein Registereintrag allein reicht nicht aus, ist aber der Ausgangspunkt jeder ernsthaften Pruefung.

### 2. Stimmigkeit von Satzung und Hausregeln

Ein glaubwuerdiger Club sollte zeigen, dass er das Modell der privaten Vereinigung versteht. Dazu gehoert, ob Regeln, Sprache und Erwartungen eher zu einem kontrollierten privaten Rahmen passen als zu einem kommerziellen Unterhaltungsbetrieb.

### 3. Raeumliche Praesenz und kontrollierter Zugang

Die Raeumlichkeiten zaehlen. Ein Club, der auf Sichtbarkeit, retailartige Entdeckung oder lockeres Walk-in-Verhalten ausgerichtet wirkt, hat ein anderes Risikoprofil als ein Ort, der sich klar als privater Raum mit kontrolliertem Zugang verhaelt.

### 4. Sorgfaeltige Mitgliederaufnahme

Ein glaubwuerdiger Aufnahmeprozess ist sorgfaeltig, nicht chaotisch. Das bedeutet nicht, dass es ein universelles Format gibt. Es bedeutet, dass der Prozess Diskretion, Konsistenz und Respekt dafuer zeigen sollte, dass Clubpolitik, lokale Praxis und rechtliche Auslegung nicht dasselbe sind.

## Was Verifizierung nicht bedeutet

Verifizierung bedeutet weder Eigentum noch Sponsoring. Sie ist kein Versprechen fuer einen reibungslosen Ablauf und keine Aussage, dass ein Club vollstaendig legal oder risikofrei sei.

Die Aufgabe von SCM auf der oeffentlichen Ebene ist enger und disziplinierter:

- den Standard erklaeren
- offensichtliche schwache Signale reduzieren
- helfen, Clubmarketing von echter Glaubwuerdigkeit zu trennen
- das Gespraech im Modell der privaten Vereinigung verankern

Deshalb vermeidet SCM auch "beste Weed-Clubs"-Framing. In Barcelona ist diese Sprache nicht nur schwach. Sie schiebt die Kategorie in genau jene kommerzielle Aussenwirkung, die die Stadt anfaelliger gemacht hat.

## Warum das in Barcelona besonders wichtig ist

Barcelona steht unter gleichzeitigen Spannungen aus Besucherdruck, Nachbarschaftsfrust, Club-Kommerzialisierung und politischer Kontrolle. In diesem Umfeld ist Verifizierung kein Luxus. Sie ist eine der wenigen Moeglichkeiten, einen Guide nuetzlich zu halten, ohne selbst Teil des Problems zu werden.

Viele Missverstaendnisse entstehen, weil Clubs wie oeffentliche Verkaufsorte gelesen werden. Ein glaubwuerdiger Guide muss das Gegenteil leisten. Er sollte den Unterschied zwischen Gesetzestext, polizeilichen Annahmen, Clubpolitik und gaengigen Mythen klaeren. Und er sollte bereit sein zu sagen, dass nicht jede sichtbare Clubhaltung Vertrauen verdient.

## Was vorsichtige Leserinnen und Leser von jedem Guide erwarten sollten

Wenn ein Guide Vertrauen will, sollte man fragen:

- Erklaert er, was geprueft wird?
- Trennt er Information von Rechtsberatung?
- Klingt er wie ein Verzeichnis oder wie ein Verkaeufer?
- Erkennt er Barcelonas gesellschaftlichen Druck an, statt die Stadt zu einem Lifestyle-Produkt zu reduzieren?
- Zeigt er eine Verifizierungslogik, die auch dann Sinn ergibt, wenn die Liste bewusst klein bleibt?

Diese Fragen sind wichtiger als die Groesse der Liste.

## Schlussgedanke

Die Haltung von SCM ist klar: Clubs werden ausgewaehlt, nicht gekauft. Ein Guide verdient Vertrauen, indem er seinen Standard zeigt, nicht indem er den laengsten Katalog des Marktes veroeffentlicht.

Wenn Sie die oeffentliche, vorsichtige Ebene der Club-Landschaft in Spanien verstehen wollen, beginnen Sie mit dem Standard. Nutzen Sie danach die Safety Kit und die weitere redaktionelle Ebene, um Risiko, Etikette und die besondere Sensibilitaet Barcelonas besser einzuordnen.

## FAQ

### Bedeutet Verifizierung, dass ein Club garantiert legal oder sicher ist?

Nein. Verifizierung ist ein Glaubwuerdigkeitsfilter, keine rechtliche Garantie und kein Versprechen fuer ein bestimmtes Ergebnis.

### Warum nicht einfach jeden Club listen und die Leser entscheiden lassen?

Weil eine riesige ungefilterte Liste in einer sensiblen Kategorie oft mehr Verwirrung als Wert schafft. Eine kleinere verifizierte Auswahl ist besser vertretbar und sicherer zu nutzen.

### Ist Verifizierung nur ein Marketing-Label?

Das sollte sie nicht sein. Wenn ein Guide nicht erklaeren kann, was er prueft, leistet das Label wenig.

### Warum braucht Barcelona einen strengeren Standard als ein generischer City-Guide?

Weil die Stadt unter ungewoehnlichem Druck durch Kommerzialisierung, Sichtbarkeit, Nachbarschaftsspannung und politische Kontrolle steht. Das veraendert den Risikokontext fuer Clubs und fuer oeffentliche Guides.`,
  },
};

export const VERIFICATION_CONTENT_PACKAGE: VerificationContentPackage = {
  pillar: 'Verification',
  canonicalSlug: 'how-scm-thinks-about-verification',
  canonicalTitle: locales.en.title,
  canonicalLocale: 'en',
  locales,
  carouselTemplate: 'spotlight',
  carouselFallbackTemplate: 'single-post',
  carouselSlides: [
    {
      id: 'verification-standard',
      visualIntent: 'Open with the trust thesis and the selected-not-bought positioning.',
      headline: {
        en: 'A small verified set beats a giant unvetted list.',
        es: 'Un conjunto verificado pequeño vale más que una lista gigante sin filtrar.',
        fr: 'Un ensemble vérifié plus restreint vaut mieux qu’une liste géante non filtrée.',
        de: 'Eine kleine verifizierte Auswahl ist besser als eine riesige ungepruefte Liste.',
      },
      body: {
        en: 'Verification is not list size. It is a standard you can explain and defend in public.',
        es: 'La verificación no es tamaño de listado. Es un estándar que puedes explicar y defender en público.',
        fr: "La vérification ne dépend pas de la taille de la liste. C'est une norme que l'on peut expliquer et défendre publiquement.",
        de: 'Verifizierung ist keine Listenlaenge. Sie ist ein Standard, den man oeffentlich erklaeren und vertreten kann.',
      },
    },
    {
      id: 'four-checks',
      visualIntent: 'Frame the four-pillar verification standard as a precise editorial method.',
      headline: {
        en: 'SCM checks four things before trust enters the conversation.',
        es: 'SCM comprueba cuatro cosas antes de hablar de confianza.',
        fr: 'SCM vérifie quatre éléments avant de parler de confiance.',
        de: 'SCM prueft vier Dinge, bevor Vertrauen ueberhaupt Thema wird.',
      },
      body: {
        en: 'Association status, house-rule alignment, controlled-access premises, and a careful onboarding posture.',
        es: 'Situación asociativa, coherencia normativa, local de acceso controlado y un proceso de incorporación cuidadoso.',
        fr: "Statut associatif, cohérence des règles, lieu à accès contrôlé, et intégration des membres menée avec prudence.",
        de: 'Vereinsstatus, stimmige Hausregeln, kontrollierter Zugang und eine sorgfaeltige Mitgliederaufnahme.',
      },
    },
    {
      id: 'what-it-does-not-mean',
      visualIntent: 'Protect the legal-safe frame and kill common misreadings.',
      headline: {
        en: 'Verification is not ownership, sponsorship, or a legal guarantee.',
        es: 'La verificación no es propiedad, patrocinio ni garantía legal.',
        fr: "La vérification n'est ni propriété, ni sponsoring, ni garantie juridique.",
        de: 'Verifizierung bedeutet weder Eigentum noch Sponsoring noch eine rechtliche Garantie.',
      },
      body: {
        en: 'It is a public-safe credibility screen designed to reduce noise, weak signals, and lazy marketplace framing.',
        es: 'Es un filtro de credibilidad public-safe pensado para reducir ruido, señales débiles y lenguaje de marketplace.',
        fr: 'C’est un filtre de crédibilité public-safe conçu pour réduire le bruit, les signaux faibles et le langage de marketplace.',
        de: 'Sie ist ein public-safe Glaubwuerdigkeitsfilter, der Rauschen, schwache Signale und Marktplatz-Sprache reduziert.',
      },
    },
  ],
  teaserShort: {
    en: 'Why SCM would rather show a smaller verified set than publish everything.',
    es: 'Por qué SCM prefiere mostrar un conjunto verificado pequeño antes que publicarlo todo.',
    fr: 'Pourquoi SCM préfère une sélection vérifiée plus restreinte à une publication massive.',
    de: 'Warum SCM lieber eine kleinere verifizierte Auswahl zeigt, statt alles zu veroeffentlichen.',
  },
  teaserMedium: {
    en: 'A credible guide is defined by the standard behind the list. SCM explains the four checks that matter in Barcelona.',
    es: 'Una guía creíble se define por el estándar detrás del listado. SCM explica las cuatro comprobaciones que importan en Barcelona.',
    fr: 'Un guide crédible se définit par la norme qui se cache derrière la liste. SCM explique les quatre contrôles qui comptent à Barcelone.',
    de: 'Ein glaubwuerdiger Guide wird durch den Standard hinter der Liste bestimmt. SCM erklaert die vier Prueffelder, die in Barcelona zaehlen.',
  },
  digestCardCopy: {
    en: {
      eyebrow: 'Verification',
      title: 'What a credible club guide should actually check',
      body: 'SCM lays out the four-pillar standard behind a smaller, safer set: registry status, rules, premises posture, and member onboarding.',
      ctaLabel: 'Read the standard',
    },
    es: {
      eyebrow: 'Verificación',
      title: 'Qué debería comprobar de verdad una guía creíble',
      body: 'SCM explica el estándar de cuatro pilares detrás de una selección más pequeña y más segura: registro, normas, local y proceso de incorporación.',
      ctaLabel: 'Leer el estándar',
    },
    fr: {
      eyebrow: 'Vérification',
      title: "Ce qu'un guide crédible devrait réellement contrôler",
      body: "SCM expose la norme à quatre piliers derrière une sélection plus restreinte et plus sûre : statut, règles, lieu et intégration des membres.",
      ctaLabel: 'Lire la norme',
    },
    de: {
      eyebrow: 'Verifizierung',
      title: 'Was ein glaubwuerdiger Club-Guide wirklich pruefen sollte',
      body: 'SCM erklaert den Vier-Saeulen-Standard hinter einer kleineren, sichereren Auswahl: Status, Regeln, Raeume und Mitgliederaufnahme.',
      ctaLabel: 'Standard lesen',
    },
  },
  ctaPrimary: {
    label: {
      en: 'Open the Safety Kit',
      es: 'Abrir la Safety Kit',
      fr: 'Ouvrir la Safety Kit',
      de: 'Safety Kit oeffnen',
    },
    href: '/en/safety-kit',
  },
  ctaSecondary: {
    label: {
      en: 'See the verification standard',
      es: 'Ver el estándar de verificación',
      fr: 'Voir la norme de vérification',
      de: 'Verifizierungsstandard ansehen',
    },
    href: '/en/mission#verification-standard',
  },
  internalLinkSpine: [...INTERNAL_LINK_SPINE],
  legalAnchors: [...LEGAL_ANCHORS],
  disclaimerRequired: true,
  disclaimerText: DISCLAIMER_TEXT,
  imageAssets: {
    hero: {
      masterPrompt:
        'Create a premium editorial hero image for an article about club verification in Barcelona. Show a restrained, cinematic interior threshold of a private association space in Barcelona at dusk: textured stone entry, discreet frosted glass, soft tungsten light, one subtle checklist card or clipboard held by an unseen staff figure, and a calm sense of precision rather than secrecy. The image should communicate trust, standards, and careful selection, not access hype. Barcelona should feel real through architecture and atmosphere, not through postcard clichés. Composition: landscape 16:9 with strong negative space on the right for headline placement, foreground texture on the left, focal hierarchy on doorway, checklist object, and controlled light spill. Color direction: charcoal, warm amber, muted olive, stone grey. Lighting: soft cinematic contrast, low glare, high detail, realistic editorial photography. Realism level: high-end magazine realism. Exclude any direct product, explicit consumption, money exchange, neon signage, tourist party energy, or dispensary cues.',
      negativePrompt: HERO_NEGATIVE_PROMPT,
      variantGuidance:
        'Variant A emphasizes the checklist object and controlled doorway. Variant B emphasizes the stone facade and quiet private-association atmosphere.',
      bestUseNote:
        'Best for the article hero and any featured editorial slot that introduces the verification standard.',
      cropNote:
        'Keep doorway and checklist inside the center 60 percent so the image can crop cleanly to 1:1, 4:5, and 16:9 without losing the verification signal.',
    },
    carouselSupport: {
      masterPrompt:
        'Create a square editorial support visual for a social carousel about verification standards for cannabis social clubs in Barcelona. Use a sophisticated flat-lay or over-shoulder scene with four refined signal objects representing the standard: association papers, house rules, controlled-access entry detail, and a simple onboarding form. Style it like a premium investigative editorial layout, not a promotional club ad. Add subtle Barcelona cues through material culture and architecture details only. Composition: square 1:1 with four clear zones or one elegant cluster, readable at mobile size, strong shape contrast, no clutter. Tone: precise, calm, protective, high-trust. Color palette: dark mineral tones, off-white paper, muted bronze, deep green-grey. Realism: polished editorial realism with minimal stylization.',
      negativePrompt: [
        'no cannabis buds, joints, grinders, or leaf logos',
        'no dispensary packaging',
        'no loud infographics or clip-art arrows',
        'no nightclub, DJ, or party cues',
        'no passports, boarding passes, or travel-checklist clichés',
      ],
      variantGuidance:
        'One variant can use a top-down document arrangement. Another can use an over-shoulder desk scene with the four proof points visible.',
      bestUseNote:
        'Best for the spotlight carousel and for static social tiles that explain the four-pillar standard.',
      cropNote:
        'Design the focal cluster within a centered square safe area so it remains legible in 1080x1080 and can extend to 4:5 with top and bottom breathing room.',
    },
    teaserBanner: {
      masterPrompt:
        'Create a horizontal teaser banner for a premium editorial module about verification standards in Barcelona cannabis club guidance. Show a restrained urban Barcelona facade detail with one controlled-access cue and one subtle signal of review or inspection, such as a neat checklist mark, annotated notes, or a hand reviewing printed house rules. The mood should feel intelligent, selective, and composed. Composition: wide landscape 3:2 with headline-safe negative space, shallow depth of field, strong texture, and no visual noise. Color palette should align with a dark editorial brand: ink black, weathered stone, deep olive, muted gold highlights. Realism should feel like a magazine feature photo, not an ad.',
      negativePrompt: [
        'no explicit smoking or vaping',
        'no storefront retail energy',
        'no smiling tourist groups',
        'no cannabis leaf as central icon',
        'no bright vacation colors or tropical lighting',
      ],
      variantGuidance:
        'Variant A can skew architectural and minimal. Variant B can include a subtle human review gesture for warmth.',
      bestUseNote:
        'Best for homepage teasers, digest cards, and mission-support modules tied to verification.',
      cropNote:
        'Keep the controlled-access cue near the left-center and leave clean negative space on the upper-right for teaser text overlays.',
    },
  },
  legalReview: {
    riskClassification: 'LOW',
    disclaimerStatus: 'REQUIRED',
    finalStatus: 'PASS',
    notes: [
      'No ownership, sponsorship, or guarantee language is used.',
      'Verification is framed as a credibility screen, not legal certification.',
      'Barcelona pressure is described with civic nuance rather than tourism-hype framing.',
      'Disclaimer is required because the package discusses club trust, suitability, and risk.',
    ],
  },
};

export type { VerificationContentPackage, DigestCardCopy, CarouselSlide, ImagePromptAsset };
