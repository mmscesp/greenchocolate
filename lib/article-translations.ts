import type { Locale } from '@/lib/i18n-config';

export interface LocalizedArticleFields {
  title: string;
  excerpt: string;
  content: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  tags?: string[];
}

type LocalizedArticleMap = Partial<Record<string, LocalizedArticleFields>>;

export const ARTICLE_TRANSLATIONS: Partial<Record<Locale, LocalizedArticleMap>> = {
  es: {
    'barcelona-vs-amsterdam-cannabis': {
      title: 'Barcelona vs. Amsterdam: dos ciudades, dos sistemas, dos realidades muy distintas',
      excerpt: 'Si crees que un club de Barcelona funciona como un coffeeshop de Amsterdam, empiezas tu viaje con la idea equivocada.',
      content: `## La confusion que mete a la gente en problemas

Muchos visitantes aterrizan en Barcelona esperando acceso abierto, listados publicos y entrada inmediata. Ese marco mental no encaja con la realidad local.

---

## Amsterdam: modelo coffeeshop

En Amsterdam, los coffeeshops son visibles y publicos dentro de un marco de tolerancia.

- Entras con tu documento
- Ves un menu
- Compras y consumes segun las reglas locales

El turista forma parte natural del sistema.

---

## España: modelo club social

En España, un CSC es una asociacion privada.

- No hay walk-in real
- La membresia es obligatoria
- No funcionan como locales publicos
- Las reglas cambian segun el club

El visitante no es el publico por defecto.

---

## Comparacion rapida

| | Amsterdam Coffeeshop | España CSC |
|---|---|---|
| Acceso directo | Si | No |
| Membresia | No | Si |
| Visibilidad publica | Si | No |
| Enfoque turistico | Central | Variable |
| Riesgo por conducta publica | Menor en contexto | Alto |

---

## Que deberias hacer

- Lee [The Safety Kit](/en/editorial/safety-kit-visitors-spain)
- Lee [Spain's Cannabis Laws](/en/editorial/spain-cannabis-laws-tourists)
- Usa [the directory](/en/clubs/) antes de viajar`,
      tags: ['Cultura', 'Barcelona', 'Amsterdam'],
    },
    'cannabis-europa-london-2026': {
      title: 'Cannabis Europa London 2026: donde se cruzan politica e industria',
      excerpt: 'Un briefing practico sobre Cannabis Europa London para leer señales regulatorias y preparar mejor la asistencia.',
      content: `## Resumen del evento

Cannabis Europa conecta politica publica, industria e inversores en un mismo espacio.

## Por que importa

Sirve para entender la direccion regulatoria y como se posicionan los actores del mercado europeo.

## Como prepararte

Define antes que sesiones te interesan, a quien necesitas ver y que seguimiento haras despues.`,
      tags: ['Eventos', 'Cannabis Europa', 'Londres'],
    },
    'cannabis-social-club-history-spain': {
      title: 'Como empezaron los clubes sociales de cannabis en España',
      excerpt: 'Una cronologia practica sobre la evolucion de las asociaciones cannabicas en España.',
      content: `## Un modelo comunitario

Los clubes sociales de cannabis nacieron como asociaciones privadas y sin animo de lucro.

## Por que crecieron

Ofrecian un entorno mas seguro que la calle y una cultura mas centrada en normas internas, privacidad y reduccion de riesgos.

## Lo que sigue siendo importante

La claridad legal sigue siendo limitada. La posesion y el consumo en publico siguen siendo sancionables.

## Lo que un visitante debe entender

- No son coffeeshops
- Los controles de acceso son parte del cumplimiento
- El comportamiento fuera del local importa`,
      tags: ['Cultura', 'Historia', 'España'],
    },
    'icbc-berlin-2026': {
      title: 'ICBC Berlin 2026: la conferencia europea de negocio cannabico',
      excerpt: 'Una guia breve sobre ICBC Berlin y su valor para perfiles de negocio, policy y mercado.',
      content: `## Resumen del evento

ICBC se centra en politica, negocio y desarrollo de mercado dentro de marcos regulados.

## A quien le sirve

Especialmente a operadores, equipos regulatorios y personas que siguen la evolucion del mercado europeo.

## Preparacion

Cierra reuniones pronto, vigila los canales oficiales y selecciona sesiones segun tu rol.`,
      tags: ['Eventos', 'ICBC', 'Berlin'],
    },
    'spannabis-bilbao-2026': {
      title: 'Spannabis Bilbao 2026: lo que debes saber antes de ir',
      excerpt: 'Un brief practico sobre fechas, contexto del lugar y planificacion previa al viaje.',
      content: `## Resumen del evento

Spannabis sigue siendo una referencia clave del ecosistema cannabico europeo.

## Planificacion

Reserva transporte y alojamiento con antelacion y comprueba siempre las actualizaciones oficiales.

## En el recinto

No confundas las reglas del evento con la normativa local. Cada ciudad y cada sede exigen contexto.`,
      tags: ['Eventos', 'Spannabis', 'Bilbao'],
    },
    'what-are-cannabis-social-clubs-spain': {
      title: 'Que son realmente los clubes sociales de cannabis en España y por que importa para tu viaje',
      excerpt: 'Los CSC en España no son coffeeshops ni dispensarios. Esta guia explica que son de verdad y por que entenderlo cambia todo.',
      metaTitle: 'Que son realmente los clubes sociales de cannabis en España y por que importa para tu viaje',
      metaDescription: 'Guia practica sobre que son realmente los CSC en España, como funcionan y por que entender su logica reduce riesgos para cualquier visitante.',
      content: `## La version en una frase

Un club social de cannabis es una asociacion privada, sin animo de lucro y solo para miembros, donde personas registradas organizan acceso y consumo en un entorno cerrado y privado.

---

## Que son

Los CSC existen dentro de la logica del derecho de asociacion. No son negocios abiertos al publico ni tienen una licencia comercial como una tienda.

Los miembros aportan cuota y contribuciones para sostener el funcionamiento colectivo del club y acceder dentro del espacio privado.

---

## Como funcionan

Cada club opera de forma independiente, pero hay patrones claros:

**La membresia es obligatoria.**

**Muchos clubes piden referencia previa.**

**Existe una cuota de alta o de renovacion.**

**El lenguaje no es el de una compra retail.**

**La conducta mas segura es asumir que nada debe salir del local.**

---

## Quien puede entrar

No existe una regla universal.

**Residentes en España** suelen tener el camino mas sencillo.

**Visitantes internacionales** encuentran mas variacion: algunos clubes aceptan pasaporte y solicitud previa; otros siguen siendo solo para locales.

**La edad minima** suele ser 18+ y muchas veces 21+.

**El tiempo importa.** Llegar hoy y pretender entrar hoy mismo no siempre es realista.

---

## Lo que no son

**No son coffeeshops.**

**No son dispensarios.**

**No son bares de acceso libre.**

**No son todos iguales.** Seguridad, profesionalidad y criterios de admision cambian mucho.

---

## La realidad legal, en corto

No existe una ley estatal que legalice de forma clara a los CSC.

**El consumo privado en espacio privado** se trata de forma distinta a la actividad publica.

**La posesion o el consumo en publico** pueden acabar en multa.

**La zona gris es real.**

---

## Por que esto importa para tu viaje

No es teoria. Es la diferencia entre una visita tranquila y una situacion que termina en estafa, multa o problema de seguridad.

---

## Que leer despues

- [The Safety Kit](/en/editorial/safety-kit-visitors-spain)
- [Barcelona vs. Amsterdam](/en/editorial/barcelona-vs-amsterdam-cannabis)
- [Your First Time in a Barcelona Cannabis Club](/en/editorial/first-time-barcelona-cannabis-club)
- [Spain's Cannabis Laws](/en/editorial/spain-cannabis-laws-tourists)
- [the directory](/en/clubs/)`,
      tags: ['Guia esencial', 'CSC', 'España'],
    },
    '5-mistakes-tourists-make': {
      title: '5 errores que cometen los turistas en los clubes de cannabis de Barcelona',
      excerpt: 'Aprende la etiqueta local para moverte con mas respeto y menos riesgo dentro y fuera del club.',
      content: `[!INFO] Resumen rapido
Los clubes de Barcelona son comunidades privadas, no tiendas. Los errores mas comunes son tratar al personal como vendedores, intentar regatear y sacar el movil para hacer fotos.

## Error 1: tratarlo como una tienda

En un club eres **miembro de una asociacion**.

- No digas: "Cuanto cuesta esto?"
- Mejor di: "Cual es la aportacion para esta variedad?"

## Error 2: hacer fotos

La privacidad es central.

- Nada de fotos del interior, menu o miembros
- Te pueden expulsar de inmediato

[!WARNING] Privacidad primero
Las fotos exponen a otros miembros y al propio club.

## Error 3: pedirlo como takeaway

Ese lenguaje suena a retail o distribucion, no a un espacio privado.

## Error 4: hacer ruido fuera

Muchos problemas nacen de las quejas vecinales.

- No te quedes en la puerta
- No fumes justo al salir
- Baja la voz

## Error 5: intentar negociar

Regatear hace parecer que entiendes el club como mercado negro.

## Checklist del buen miembro

- No hare fotos ni video dentro
- Mantendre un tono bajo al entrar y salir
- Respetare al personal y a otros miembros
- No compartire con no miembros
- Hablare de aportacion, no de precio`,
      tags: ['Etiqueta', 'Cultura', 'Consejos'],
    },
    'first-time-barcelona-cannabis-club': {
      title: 'Tu primera vez en un club de cannabis de Barcelona: la forma respetuosa de entrar',
      excerpt: 'Una guia realista para preparar tu primera visita a un CSC en Barcelona con expectativas correctas.',
      metaDescription: 'Una guia realista para preparar tu primera visita a un CSC en Barcelona con expectativas correctas y enfoque respetuoso.',
      content: `## Antes de empezar

No es un proceso rapido. No esta garantizado. El respeto no es opcional.

---

## Paso 1: investiga antes de volar

- Identifica clubes que acepten visitantes internacionales
- Revisa requisitos y tiempos de respuesta
- Confirma idioma y soporte
- Ten alternativas

Empieza por [the directory](/en/clubs/).

---

## Paso 2: solicitud

Usa solo canales verificados. Nada de promotores callejeros ni mensajes aleatorios.

---

## Paso 3: preparacion

Lleva:

- Documento valido
- Confirmacion de membresia
- Efectivo si hace falta

---

## Paso 4: llegada

Sigue exactamente las instrucciones de acceso y lee las normas internas.

---

## Paso 5: dentro

Respeta la privacidad, guarda el telefono y sigue la indicacion del personal.

---

## Paso 6: al salir

- Nada de consumo publico
- Nada de compartir ubicacion
- Nada de publicar detalles del club

---

## Errores comunes

- Ir sin membresia confirmada
- Seguir a desconocidos para entrar
- Hacer fotos dentro
- Consumir en publico despues

Lee [Barcelona vs. Amsterdam](/en/editorial/barcelona-vs-amsterdam-cannabis) y [The Safety Kit](/en/editorial/safety-kit-visitors-spain).`,
      tags: ['Primera vez', 'Barcelona', 'Etiqueta'],
    },
    'edibles-safety-guide': {
      title: 'Guia de seguridad de comestibles: dosis, tiempos y riesgos',
      excerpt: 'Aprende a dosificar con mas seguridad y a evitar el error clasico de redosificar demasiado pronto.',
      content: `[!INFO] TL;DR
Los comestibles pasan por el higado y pueden sentirse mas potentes y duraderos que fumar. **Empieza bajo (5-10 mg)** y **espera al menos 90 minutos** antes de repetir.

## El efecto retardado

- **Inicio:** 30 minutos a 2 horas
- **Pico:** 2 a 4 horas
- **Duracion:** 4 a 8 o mas horas

La trampa clasica es pensar que no funciona, tomar mas y recibir luego ambas dosis juntas.

## Guia de dosis

- **1-2.5 mg:** microdosis
- **5 mg:** dosis baja estandar
- **10 mg:** puede ser fuerte para principiantes
- **20 mg o mas:** riesgo mayor de ansiedad o sedacion

[!WARNING] Etiquetado
En mercados grises o poco regulados, las etiquetas no siempre son fiables. Asume que puede pegar mas de lo esperado.

## Y si me paso?

1. No entres en panico
2. Bebe agua
3. Descansa en un lugar seguro
4. Si puedes, duerme

## Reglas basicas

- Empieza con 5 mg o menos si tienes poca experiencia
- Espera 90 minutos antes de redosificar
- No mezcles con alcohol
- Consume en un sitio seguro
- Mantenlo lejos de niños y mascotas`,
      tags: ['Seguridad', 'Comestibles', 'Salud'],
    },
    'emergency-resources': {
      title: 'Recursos de emergencia: que hacer si necesitas ayuda',
      excerpt: 'Referencias practicas para una emergencia medica, una mala reaccion o un encuentro con la policia.',
      content: `[!INFO] TL;DR
En una emergencia medica, **llama al 112 inmediatamente**. Si hay policia, mantente calmado, identifica lo necesario y no declares mas de lo imprescindible.

## Emergencias medicas

Llama al **112** o acude a urgencias si hay:

- Dolor en el pecho
- Panico fuerte que no baja
- Vomitos persistentes
- Dificultad para respirar

**Energy Control Barcelona**

- C/ de l'Aurora, 27, 08001 Barcelona
- Consulta horarios oficiales
- Ofrece apoyo e informacion de reduccion de riesgos

## Encuentro con la policia

1. Mantente calmado
2. Enseña documentacion si la piden
3. Usa tu derecho a guardar silencio
4. Guarda cualquier multa o documento
5. No firmes nada que no entiendas

[!WARNING] Nunca hagas esto
- No intentes sobornar
- No salgas corriendo
- No aceptes nada que no comprendas

## Contactos utiles

- **EE. UU.:** +34 91 587 2200
- **Reino Unido:** +34 91 714 6300
- **Canada:** +34 91 382 8400
- **Australia:** +34 91 353 6600`,
      tags: ['Seguridad', 'Emergencia', 'Recursos'],
    },
    'safety-kit-visitors-spain': {
      title: 'The Safety Kit: lo que todo visitante debe saber antes de entrar en un club',
      excerpt: 'Una guia de seguridad practica sobre estafas, lineas legales, privacidad y comportamientos que reducen riesgo.',
      metaDescription: 'Guia de seguridad practica para visitantes de clubes en España: estafas, limites legales, privacidad y pasos concretos para moverte con menos riesgo.',
      content: `## Por que existe esta guia

La escena de clubes en España tiene un vacio de informacion, y ese vacio favorece errores y estafas.

---

## Antes de salir del hotel

- Investiga los clubes con antelacion
- Lleva el documento correcto
- Conoce los requisitos concretos del club
- Guarda los detalles offline

---

## Como llegar

**Nunca sigas a un promotor callejero.**

No aceptes flyers ni invitaciones de extraños y usa tu propia navegacion.

---

## En la puerta

Di la verdad sobre quien eres, menciona tu membresia o referencia y acepta la espera o un rechazo con calma.

---

## Dentro del club

- Nada de fotos o videos
- Respeta la privacidad de otros miembros
- Sigue las normas internas y al personal

---

## Lineas rojas

- No saques nada fuera del club
- No consumas en publico
- No compartas tu membresia
- No publiques la ubicacion del club

---

## Señales rojas

- No hay proceso de alta
- No hay documentacion
- Piden dinero antes de explicar nada
- El lugar es ambiguo o improvisado
- Te dicen que ignores las reglas

---

## Si algo va mal

Mantente calmado. Sal si no te sientes seguro. En España, el numero de emergencias es **112**.

---

## Checklist final

Antes:
- Club verificado
- Solicitud o membresia confirmada
- Documento listo
- Datos guardados

Durante:
- Telefono guardado
- Sin fotos
- Respeto total

Despues:
- Sin consumo publico
- Sin compartir ubicacion
- Sin detalles del club en redes`,
      tags: ['Seguridad', 'Visitantes', 'Checklist'],
    },
    'is-weed-legal': {
      title: 'Es legal la hierba en Barcelona en 2026? Reglas reales, multas y zonas grises',
      excerpt: 'Barcelona no es Amsterdam. Entender la diferencia entre tolerancia privada e ilegalidad publica sigue siendo clave.',
      content: `[!INFO] TL;DR
**No, el cannabis no es estrictamente legal en Barcelona.** Existe tolerancia en espacios privados, pero la posesion y el consumo en publico siguen siendo sancionables.

## La zona gris explicada

Todo gira alrededor de la diferencia entre espacio **publico** y **privado**.

### 1. Espacio publico = riesgo alto

- **Multa:** de **601 EUR a 30.000 EUR**
- **Naturaleza:** normalmente administrativa
- **Control:** la policia tiene margen de actuacion amplio

### 2. Espacio privado = tolerancia

El consumo en un espacio realmente privado se trata de forma distinta, y esa es la base sobre la que intentan funcionar los clubes.

## Que es un club social de cannabis?

Son **asociaciones sin animo de lucro**, no negocios abiertos.

- Los miembros sostienen el modelo colectivamente
- No funcionan como una tienda normal
- Solo entran miembros

[!WARNING] Trampas para turistas
Los clubes serios **no** captan a pie de calle. Evita a cualquiera que prometa acceso facil en la calle.

## Actualizacion 2026

1. Mas inspecciones administrativas
2. Mas atencion a cannabinoides semisinteticos

## Como reducir riesgo

- No consumas en publico
- No compres a promotores o dealers
- Usa asociaciones verificables
- Lleva la documentacion necesaria`,
      tags: ['Legal', 'Multas', 'Policia', 'Guia para turistas'],
    },
    'scams-red-flags': {
      title: 'Estafas de cannabis en Barcelona: DMs, promotores y señales rojas',
      excerpt: 'Como detectar lo falso y protegerte de las trampas mas comunes dirigidas a turistas.',
      content: `[!INFO] TL;DR
La mayoria de las ofertas no solicitadas son estafas. Si alguien te ofrece acceso rapido por DM o en la calle, parte de la base de que quiere tu dinero.

## La estafa del DM

El patron suele ser simple:

1. Pagas
2. Te bloquean
3. No hay acceso real

## El promotor callejero

En zonas turisticas aparecen ofertas de "weed" o "club" a pie de calle.

[!WARNING] Zona de riesgo
Si parece un trato callejero, sal de ahi. No es como operan los clubes serios.

## El falso menu por Telegram

Cuentas falsas prometen menu y entrega. Eso no encaja con una operativa legitima de club.

## Señales rojas

- Contacto iniciado por ellos
- Pago por adelantado
- Pedidos por Telegram o WhatsApp
- Lenguaje de delivery
- Cita en espacio publico
- Zona claramente turistica

## Como protegerte

1. Usa canales oficiales
2. Busca referencias serias
3. Ve tu mismo a una direccion verificada`,
      tags: ['Estafas', 'Seguridad', 'Señales rojas'],
    },
    'spain-cannabis-laws-tourists': {
      title: 'Leyes del cannabis en España: lo que un turista realmente necesita saber',
      excerpt: 'Una guia breve sobre tolerancia privada, multas publicas y la persistente zona gris de los CSC.',
      content: `## Version corta

España no tiene un sistema publico de venta legal de cannabis. La posesion y el consumo en publico pueden acabar en sancion administrativa.

## Publico vs. privado

La diferencia decisiva es el lugar donde ocurre la conducta. El espacio publico implica mucho mas riesgo.

## Contexto de los CSC

Los CSC operan en una zona gris basada en la logica de asociacion privada. No equivalen a un modelo retail abierto.

## Regla simple para visitantes

Asume siempre que la aplicacion puede variar segun la ciudad, el momento y el contexto.`,
      tags: ['Legal', 'Turistas', 'España'],
    },
  },
  fr: {
    'barcelona-vs-amsterdam-cannabis': {
      title: 'Barcelone vs Amsterdam : deux villes, deux systemes, deux realites tres differentes',
      excerpt: 'Si vous pensez qu un club de Barcelone fonctionne comme un coffeeshop d Amsterdam, vous partez avec la mauvaise attente.',
      content: `## La confusion de depart

Beaucoup de voyageurs arrivent a Barcelone avec une logique Amsterdam : lieux visibles, acces direct et service immediat. Ce n est pas le bon cadre.

---

## Amsterdam : le modele coffeeshop

- Entree avec piece d identite
- Menu visible
- Achat et consommation selon les regles locales

Le touriste fait partie du systeme.

---

## Espagne : le modele club social

- Pas de vrai walk-in
- Adhesion obligatoire
- Pas de fonctionnement de commerce public
- Regles variables selon le club

Le visiteur n est pas le public par defaut.

---

## Comparaison rapide

| | Coffeeshop d Amsterdam | CSC en Espagne |
|---|---|---|
| Acces direct | Oui | Non |
| Adhesion | Non | Oui |
| Visibilite publique | Oui | Non |
| Logique touristique | Centrale | Variable |
| Risque dans l espace public | Plus faible en contexte | Plus eleve |

---

## A lire ensuite

- [The Safety Kit](/en/editorial/safety-kit-visitors-spain)
- [Spain's Cannabis Laws](/en/editorial/spain-cannabis-laws-tourists)
- [the directory](/en/clubs/)`,
      tags: ['Culture', 'Barcelone', 'Amsterdam'],
    },
    'cannabis-europa-london-2026': {
      title: 'Cannabis Europa London 2026 : quand politique et industrie se rencontrent',
      excerpt: 'Un briefing pratique pour lire les signaux politiques et mieux preparer votre presence a Cannabis Europa.',
      content: `## Apercu de l evenement

Cannabis Europa rassemble acteurs publics, industrie et investisseurs.

## Pourquoi c est utile

L evenement aide a comprendre les tendances reglementaires et les mouvements strategiques du marche europeen.

## Preparation

Choisissez vos sessions a l avance, vos contacts prioritaires et le suivi a faire apres.`,
      tags: ['Evenements', 'Cannabis Europa', 'Londres'],
    },
    'cannabis-social-club-history-spain': {
      title: 'Comment les clubs sociaux de cannabis ont commence en Espagne',
      excerpt: 'Une chronologie pratique de l evolution des associations cannabiques espagnoles.',
      content: `## Un modele communautaire

Les clubs sociaux de cannabis sont nes comme des associations privees a but non lucratif.

## Pourquoi le modele s est developpe

Ils offraient un cadre plus sur que la rue, avec plus de regles internes, de discretion et de reduction des risques.

## Ce qui reste important

La clarte juridique reste limitee et les comportements en public peuvent toujours etre sanctionnes.

## Ce qu un visiteur doit retenir

- Ce ne sont pas des coffeeshops
- Les controles d acces font partie du cadre
- Le comportement a l exterieur compte`,
      tags: ['Culture', 'Histoire', 'Espagne'],
    },
    'icbc-berlin-2026': {
      title: 'ICBC Berlin 2026 : la conference business cannabis en Europe',
      excerpt: 'Une guide breve sur ICBC Berlin et sa valeur pour les profils business, policy et marche.',
      content: `## Apercu de l evenement

ICBC se concentre sur la politique, le business et le developpement de marche.

## Pour qui c est pertinent

Surtout pour les operateurs, les equipes reglementaires et ceux qui suivent le marche europeen.

## Preparation

Planifiez vos rendez-vous tot et surveillez les canaux officiels.`,
      tags: ['Evenements', 'ICBC', 'Berlin'],
    },
    'spannabis-bilbao-2026': {
      title: 'Spannabis Bilbao 2026 : ce qu il faut savoir avant de partir',
      excerpt: 'Un brief pratique sur les dates, le lieu et la preparation avant voyage.',
      content: `## Apercu de l evenement

Spannabis reste un point de reference du cannabis en Europe.

## Planification

Bloquez transport et hebergement en avance et verifiez toujours les mises a jour officielles.

## Sur place

Ne confondez pas les regles du salon et la reglementation locale.`,
      tags: ['Evenements', 'Spannabis', 'Bilbao'],
    },
    'what-are-cannabis-social-clubs-spain': {
      title: 'Ce que sont vraiment les clubs sociaux de cannabis en Espagne et pourquoi cela compte pour votre voyage',
      excerpt: 'Les CSC en Espagne ne sont ni des coffeeshops ni des dispensaires. Cette guide explique ce qu ils sont reellement et pourquoi bien le comprendre change tout.',
      metaTitle: 'Ce que sont vraiment les clubs sociaux de cannabis en Espagne et pourquoi cela compte pour votre voyage',
      metaDescription: 'Guide pratique sur ce que sont reellement les CSC en Espagne, comment ils fonctionnent et pourquoi cette distinction compte pour un visiteur.',
      content: `## La version en une phrase

Un club social de cannabis est une association privee, reservee a ses membres et a but non lucratif, ou des personnes enregistrees organisent l acces et la consommation dans un cadre prive.

---

## Ce qu ils sont

Les CSC reposent sur la logique du droit d association. Ce ne sont pas des commerces ouverts au public.

Les membres paient une adhesion et contribuent au fonctionnement collectif du club pour acceder dans le cadre prive.

---

## Comment ils fonctionnent

**L adhesion est obligatoire.**

**Une recommandation ou une validation prealable est souvent necessaire.**

**Une cotisation existe.**

**Le langage n est pas celui du retail.**

**L approche la plus sure est de ne rien sortir.**

---

## Qui peut entrer

Il n existe pas de regle unique.

**Les residents en Espagne** ont souvent le parcours le plus simple.

**Les visiteurs internationaux** rencontrent plus de variations entre clubs.

**L age minimum** est generalement de 18 ans minimum, souvent 21 plus.

**Le delai compte.** Arriver aujourd hui et vouloir entrer ce soir n est pas toujours realiste.

---

## Ce qu ils ne sont pas

- Pas des coffeeshops
- Pas des dispensaires
- Pas des bars ouverts au public
- Pas tous equivalents en qualite ou securite

---

## La realite legale en bref

Il n existe pas de loi nationale qui legalise clairement les CSC.

**Le prive** et **le public** ne sont pas traites de la meme facon.

**La possession ou la consommation en public** peuvent conduire a une amende.

**La zone grise reste reelle.**

---

## Pourquoi cela compte pour votre voyage

Ce n est pas de la theorie. Bien comprendre ce cadre peut vous eviter une arnaque, une amende ou une mauvaise situation.

---

## Que lire ensuite

- [The Safety Kit](/en/editorial/safety-kit-visitors-spain)
- [Barcelona vs. Amsterdam](/en/editorial/barcelona-vs-amsterdam-cannabis)
- [Your First Time in a Barcelona Cannabis Club](/en/editorial/first-time-barcelona-cannabis-club)
- [Spain's Cannabis Laws](/en/editorial/spain-cannabis-laws-tourists)
- [the directory](/en/clubs/)`,
      tags: ['Guide essentiel', 'CSC', 'Espagne'],
    },
    '5-mistakes-tourists-make': {
      title: '5 erreurs que les touristes commettent dans les clubs de cannabis de Barcelone',
      excerpt: 'Les bases d etiquette a connaitre pour rester respectueux et eviter les erreurs les plus visibles.',
      content: `[!INFO] Resume rapide
Les clubs de Barcelone sont des communautes privees, pas des magasins. Les erreurs classiques : traiter le staff comme des vendeurs, negocier et prendre des photos.

## Erreur 1 : le traiter comme une boutique

Dans un club, vous etes **membre d une association**.

- Evitez : "Combien ca coute ?"
- Preferez : "Quelle est la contribution pour cette variete ?"

## Erreur 2 : prendre des photos

La discretion est centrale.

- Pas de photos de l interieur, du menu ou des membres
- Une exclusion immediate est possible

[!WARNING] La vie privee avant tout
Les photos exposent les membres et le club.

## Erreur 3 : demander du takeaway

Ce langage ressemble a du retail et non a un espace prive.

## Erreur 4 : etre bruyant dehors

Les plaintes du voisinage comptent beaucoup.

## Erreur 5 : vouloir negocier

Marchander donne une image de deal de rue.

## Checklist du bon membre

- Pas de photos ni de videos
- Discretion en entrant et en sortant
- Respect du staff et des membres
- Pas de partage avec des non-membres
- Parler de contribution, pas de prix`,
      tags: ['Etiquette', 'Culture', 'Conseils'],
    },
    'first-time-barcelona-cannabis-club': {
      title: 'Premiere visite dans un club de cannabis a Barcelone : la bonne maniere d entrer',
      excerpt: 'Une guide realiste pour preparer une premiere visite dans un CSC a Barcelone avec le bon etat d esprit.',
      metaDescription: 'Une guide realiste pour preparer une premiere visite dans un CSC a Barcelone avec le bon etat d esprit.',
      content: `## Avant de commencer

Ce n est ni rapide ni garanti. Le respect reste obligatoire.

---

## Etape 1 : faire ses recherches

- Identifier les clubs qui acceptent des visiteurs internationaux
- Verifier les delais et les conditions
- Confirmer le support linguistique
- Garder des options de secours

Commencez par [the directory](/en/clubs/).

---

## Etape 2 : la demande

Passez uniquement par des canaux verifies. Jamais par des rabatteurs ou des DM douteux.

---

## Etape 3 : preparer la visite

- Piece d identite valide
- Confirmation d adhesion
- Argent liquide si necessaire

---

## Etape 4 : arrivee et accueil

Suivez exactement les instructions et lisez les regles internes.

---

## Etape 5 : a l interieur

Respectez la vie privee, gardez le telephone range et suivez les consignes du personnel.

---

## Etape 6 : au depart

- Pas de consommation publique
- Pas de partage de localisation
- Pas de details du club sur les reseaux

---

## Erreurs frequentes

- Arriver sans adhesion confirmee
- Suivre des inconnus
- Prendre des photos
- Consommer en public apres la sortie`,
      tags: ['Premiere fois', 'Barcelone', 'Etiquette'],
    },
    'edibles-safety-guide': {
      title: 'Guide de securite des comestibles : dosage, delais et risques',
      excerpt: 'Comment doser avec plus de prudence et eviter la redose trop rapide.',
      content: `[!INFO] TL;DR
Les comestibles passent par le foie et peuvent se ressentir plus fortement et plus longtemps. **Commencez bas (5-10 mg)** et **attendez au moins 90 minutes** avant de reprendre.

## Effet retarde

- **Debut :** 30 minutes a 2 heures
- **Pic :** 2 a 4 heures
- **Duree :** 4 a 8 heures ou plus

Le piege classique est de penser que rien ne se passe et de reprendre trop tot.

## Reperes de dosage

- **1-2.5 mg :** microdose
- **5 mg :** dose basse standard
- **10 mg :** deja fort pour beaucoup de debutants
- **20 mg et plus :** risque plus eleve d anxiete ou de sedation

[!WARNING] Etiquetage
Dans des marches peu reguliers, les etiquettes peuvent etre inexactes.

## Que faire si c est trop fort ?

1. Ne paniquez pas
2. Buvez de l eau
3. Reposez-vous dans un endroit calme
4. Dormez si possible`,
      tags: ['Securite', 'Comestibles', 'Sante'],
    },
    'emergency-resources': {
      title: 'Ressources d urgence : que faire si vous avez besoin d aide',
      excerpt: 'Points utiles pour une urgence medicale, une mauvaise reaction ou un contact avec la police.',
      content: `[!INFO] TL;DR
En cas d urgence medicale, **appelez le 112 immediatement**. En cas de controle, restez calme et ne dites pas plus que necessaire.

## Urgences medicales

Appelez le **112** ou allez aux urgences en cas de :

- Douleur thoracique
- Panique intense
- Vomissements persistants
- Difficultes respiratoires

**Energy Control Barcelona**

- C/ de l Aurora, 27, 08001 Barcelona
- Verifier les horaires officiels
- Information et soutien de reduction des risques

## Police

1. Rester calme
2. Montrer ses papiers si demandes
3. Utiliser son droit au silence
4. Garder les documents remis
5. Ne rien signer sans comprendre

[!WARNING] A ne jamais faire
- Ne pas tenter de corrompre
- Ne pas fuir
- Ne rien accepter sans comprendre`,
      tags: ['Securite', 'Urgence', 'Ressources'],
    },
    'safety-kit-visitors-spain': {
      title: 'The Safety Kit : ce que tout visiteur doit savoir avant d entrer dans un club',
      excerpt: 'Une guide de securite pratique sur les arnaques, les lignes legales, la vie privee et les comportements a adopter.',
      metaDescription: 'Guide de securite pratique pour les visiteurs de clubs en Espagne : arnaques, limites legales, discretion et gestes concrets pour reduire le risque.',
      content: `## Pourquoi cette guide existe

La scene des clubs en Espagne souffre d un manque d information, et ce vide favorise les erreurs et les arnaques.

---

## Avant de quitter l hotel

- Faire ses recherches a l avance
- Prendre le bon document
- Connaitre les exigences du club
- Garder les details hors ligne

---

## Pour y aller

**Ne suivez jamais un rabatteur de rue.**

N acceptez pas de flyers ni d invitations d inconnus.

---

## A la porte

Dites clairement qui vous etes, mentionnez votre adhesion ou votre reference et acceptez l attente avec calme.

---

## A l interieur

- Pas de photos ni de videos
- Respect de la vie privee des autres membres
- Respect des regles internes

---

## Lignes rouges

- Ne rien sortir du club
- Ne pas consommer en public
- Ne pas partager son adhesion
- Ne pas publier la localisation du club

---

## Signaux d alerte

- Pas de vrai processus d adhesion
- Pas de documentation
- Paiement avant toute explication
- Lieu flou ou improvise
- On vous dit d ignorer les regles

---

## Si quelque chose tourne mal

Restez calme. Sortez si vous ne vous sentez pas en securite. Le numero d urgence est **112**.`,
      tags: ['Securite', 'Visiteurs', 'Checklist'],
    },
    'is-weed-legal': {
      title: 'Le cannabis est-il legal a Barcelone en 2026 ? Regles reelles, amendes et zones grises',
      excerpt: 'Barcelone n est pas Amsterdam. Comprendre la difference entre tolerance privee et illegalite publique reste essentiel.',
      content: `[!INFO] TL;DR
**Non, le cannabis n est pas strictement legal a Barcelone.** Il existe une tolerance dans l espace prive, mais la possession et la consommation en public restent sanctionnables.

## La zone grise

La cle est la distinction entre espace **public** et **prive**.

### 1. Espace public = risque eleve

- **Amende :** de **601 EUR a 30.000 EUR**
- **Nature :** administrative dans la plupart des cas
- **Controle :** marge importante pour la police

### 2. Espace prive = tolerance

Le fonctionnement des clubs repose sur cette difference.

## Qu est-ce qu un CSC ?

Ce sont **des associations a but non lucratif**, pas des commerces.

[!WARNING] Pieges touristiques
Les clubs serieux **ne** recrutent pas dans la rue.`,
      tags: ['Legal', 'Amendes', 'Police', 'Guide touriste'],
    },
    'scams-red-flags': {
      title: 'Arnaques cannabis a Barcelone : DM, rabatteurs et signaux rouges',
      excerpt: 'Comment reperer les faux plans et se proteger des pieges les plus courants pour les touristes.',
      content: `[!INFO] TL;DR
La plupart des offres non sollicitees sont des arnaques. Si quelqu un vous promet un acces rapide par message ou dans la rue, partez du principe qu il veut votre argent.

## Le DM frauduleux

1. Vous payez
2. La personne disparait
3. Il n y a aucun acces reel

## Le rabatteur de rue

[!WARNING] Si cela ressemble a un deal de rue, partez.

## Faux menus Telegram

Les comptes qui promettent livraison et menus ne ressemblent pas a une logique de club serieux.

## Signaux rouges

- Ils vous contactent en premier
- Paiement d avance
- Telegram ou WhatsApp pour commander
- Langage de livraison
- Rendez-vous en lieu public`,
      tags: ['Arnaques', 'Securite', 'Signaux rouges'],
    },
    'spain-cannabis-laws-tourists': {
      title: 'Lois sur le cannabis en Espagne : ce qu un touriste doit vraiment savoir',
      excerpt: 'Une synthese pratique sur la tolerance privee, les amendes publiques et la zone grise des CSC.',
      content: `## Version courte

L Espagne n a pas de systeme public de vente legale de cannabis. La possession et la consommation en public peuvent toujours mener a une sanction administrative.

## Public vs prive

Le point central est le lieu ou le comportement se produit. Le risque augmente fortement dans l espace public.

## Contexte des CSC

Les CSC operent dans une zone grise fondee sur la logique d association privee.

## Regle simple

Partir du principe que l application peut varier selon la ville et le contexte.`,
      tags: ['Legal', 'Touristes', 'Espagne'],
    },
  },
  de: {
    'barcelona-vs-amsterdam-cannabis': {
      title: 'Barcelona vs. Amsterdam: zwei Stadte, zwei Systeme, zwei sehr unterschiedliche Realitaten',
      excerpt: 'Wer glaubt, dass ein Club in Barcelona wie ein Coffeeshop in Amsterdam funktioniert, startet mit der falschen Erwartung.',
      content: `## Die Ausgangsverwechslung

Viele Reisende kommen nach Barcelona und erwarten Sichtbarkeit, spontanen Zugang und sofortigen Service wie in Amsterdam. Genau das passt nicht zum lokalen Modell.

---

## Amsterdam: das Coffeeshop-Modell

- Mit Ausweis hinein
- Karte ansehen
- Nach lokalen Regeln kaufen und konsumieren

Touristen sind Teil des Systems.

---

## Spanien: das Club-Modell

- Kein echter Walk-in
- Mitgliedschaft ist Pflicht
- Kein offener Ladenbetrieb
- Regeln unterscheiden sich je nach Club

Besucher sind nicht automatisch die Hauptzielgruppe.

---

## Kurzvergleich

| | Amsterdam Coffeeshop | Spanien CSC |
|---|---|---|
| Direkter Zutritt | Ja | Nein |
| Mitgliedschaft | Nein | Ja |
| Offentliche Sichtbarkeit | Ja | Nein |
| Tourismus-Logik | Zentral | Variabel |
| Risiko im offentlichen Raum | Geringer im Kontext | Hoher |

---

## Sinnvolle Nachlekture

- [The Safety Kit](/en/editorial/safety-kit-visitors-spain)
- [Spain's Cannabis Laws](/en/editorial/spain-cannabis-laws-tourists)
- [the directory](/en/clubs/)`,
      tags: ['Kultur', 'Barcelona', 'Amsterdam'],
    },
    'cannabis-europa-london-2026': {
      title: 'Cannabis Europa London 2026: wo Politik und Branche zusammenkommen',
      excerpt: 'Ein praktisches Briefing, um regulatorische Signale zu lesen und den Besuch besser vorzubereiten.',
      content: `## Event-Uberblick

Cannabis Europa bringt Politik, Industrie und Investoren zusammen.

## Warum das relevant ist

Die Veranstaltung hilft dabei, regulatorische Richtung und strategische Marktbewegungen besser einzuordnen.

## Vorbereitung

Vorab Sessions, Kontakte und Follow-up-Ziele festlegen.`,
      tags: ['Events', 'Cannabis Europa', 'London'],
    },
    'cannabis-social-club-history-spain': {
      title: 'Wie Cannabis Social Clubs in Spanien entstanden sind',
      excerpt: 'Eine praktische Zeitleiste zur Entwicklung spanischer Cannabis-Vereine.',
      content: `## Ein gemeinschaftliches Modell

Cannabis Social Clubs entstanden als private, nicht gewinnorientierte Vereine.

## Warum das Modell wuchs

Clubs galten als sicherer als Strassenkauf und verbanden das oft mit Hausregeln, Diskretion und Harm Reduction.

## Was weiter wichtig bleibt

Rechtliche Klarheit ist begrenzt, und Verhalten im offentlichen Raum kann weiter sanktioniert werden.

## Was Besucher verstehen sollten

- Keine Coffeeshops
- Zugangskontrollen gehoren dazu
- Verhalten ausserhalb des Clubs zahlt`,
      tags: ['Kultur', 'Geschichte', 'Spanien'],
    },
    'icbc-berlin-2026': {
      title: 'ICBC Berlin 2026: Europas Cannabis-Business-Konferenz',
      excerpt: 'Ein kurzer Guide zu ICBC Berlin und seinem Nutzen fur Business-, Policy- und Marktprofile.',
      content: `## Event-Uberblick

ICBC fokussiert Politik, Business und Marktentwicklung.

## Fur wen es sinnvoll ist

Vor allem fur Betreiber, regulatorische Teams und Marktbeobachter in Europa.

## Vorbereitung

Fruh Termine planen und offizielle Kanale im Blick behalten.`,
      tags: ['Events', 'ICBC', 'Berlin'],
    },
    'spannabis-bilbao-2026': {
      title: 'Spannabis Bilbao 2026: was du vorher wissen solltest',
      excerpt: 'Ein kurzes Briefing zu Terminen, Ort und Reisevorbereitung.',
      content: `## Event-Uberblick

Spannabis bleibt ein wichtiger Bezugspunkt im europaischen Cannabis-Okosystem.

## Planung

Reise und Unterkunft fruh buchen und offizielle Updates laufend prufen.

## Vor Ort

Messe-Regeln und lokales Recht sind nicht dasselbe.`,
      tags: ['Events', 'Spannabis', 'Bilbao'],
    },
    'what-are-cannabis-social-clubs-spain': {
      title: 'Was Cannabis Social Clubs in Spanien wirklich sind und warum das fur deine Reise wichtig ist',
      excerpt: 'CSC in Spanien sind weder Coffeeshops noch Dispensaries. Dieser Guide erklart, was sie wirklich sind und warum das fur Besucher entscheidend ist.',
      metaTitle: 'Was Cannabis Social Clubs in Spanien wirklich sind und warum das fur deine Reise wichtig ist',
      metaDescription: 'Praktischer Guide dazu, was CSC in Spanien wirklich sind, wie sie funktionieren und warum diese Unterscheidung fur Reisende wichtig ist.',
      content: `## Die Ein-Satz-Version

Ein Cannabis Social Club ist ein privater, nicht gewinnorientierter Mitgliederverein, in dem registrierte Mitglieder Zugang und Konsum in einem geschlossenen privaten Rahmen organisieren.

---

## Was sie sind

CSC beruhen auf Vereinslogik und nicht auf offenem Ladenverkauf. Sie sind keine offentlichen Geschafte.

Mitglieder zahlen Beitrage und tragen das Modell kollektiv mit.

---

## Wie sie funktionieren

**Mitgliedschaft ist Pflicht.**

**Oft gibt es eine Vorprufung oder Referenz.**

**Es existiert ein Mitgliedsbeitrag.**

**Die Sprache ist nicht die eines Retail-Shops.**

**Der sicherste Ansatz ist, nichts hinauszutragen.**

---

## Wer hinein kann

Es gibt keine einheitliche Regel.

**Menschen mit Wohnsitz in Spanien** haben oft den einfacheren Weg.

**Internationale Besucher** erleben mehr Unterschiede je nach Club.

**Mindestalter** ist relevant, oft 18 oder 21 plus.

**Zeit ist ein Faktor.** Heute ankommen und heute reinwollen klappt nicht immer.

---

## Was sie nicht sind

- Keine Coffeeshops
- Keine Dispensaries
- Keine offen zuganglichen Bars
- Nicht alle gleich bei Sicherheit oder Professionalitat

---

## Die rechtliche Realitat in kurz

Es gibt kein klares nationales Gesetz, das CSC eindeutig legalisiert.

**Privater Raum** und **offentlicher Raum** werden nicht gleich behandelt.

**Besitz oder Konsum in der Offentlichkeit** konnen Bussgelder auslosen.

**Die Grauzone bleibt real.**

---

## Warum das fur deine Reise wichtig ist

Das ist keine Theorie. Wer das Modell falsch versteht, erhoht das Risiko fur Betrug, Bussgelder und unnötigen Stress.

---

## Was du als Nachstes lesen solltest

- [The Safety Kit](/en/editorial/safety-kit-visitors-spain)
- [Barcelona vs. Amsterdam](/en/editorial/barcelona-vs-amsterdam-cannabis)
- [Your First Time in a Barcelona Cannabis Club](/en/editorial/first-time-barcelona-cannabis-club)
- [Spain's Cannabis Laws](/en/editorial/spain-cannabis-laws-tourists)
- [the directory](/en/clubs/)`,
      tags: ['Essenzieller Guide', 'CSC', 'Spanien'],
    },
    '5-mistakes-tourists-make': {
      title: '5 Fehler, die Touristen in Barcelonas Cannabis-Clubs machen',
      excerpt: 'Die wichtigsten Verhaltensregeln, um respektvoller und sicherer im Club-Kontext aufzutreten.',
      content: `[!INFO] Kurzfassung
Clubs in Barcelona sind private Gemeinschaften, keine Laden. Die haufigsten Fehler sind: Staff wie Verkaufspersonal behandeln, handeln wollen und Fotos machen.

## Fehler 1: den Club wie ein Geschaft behandeln

Du bist **Mitglied eines Vereins**, nicht Kunde in einem Shop.

- Nicht sagen: "Was kostet das?"
- Besser sagen: "Welche Contribution gilt fur diese Sorte?"

## Fehler 2: Fotos machen

Diskretion ist zentral.

- Keine Fotos vom Innenraum, Menu oder anderen Mitgliedern
- Ein Rauswurf ist moglich

[!WARNING] Privatsphare zuerst
Fotos setzen Mitglieder und Club unnotig Sichtbarkeit aus.

## Fehler 3: nach takeaway fragen

Das klingt nach Retail und nicht nach privatem Vereinsrahmen.

## Fehler 4: draussen laut sein

Nachbarschaftsbeschwerden zahlen.

## Fehler 5: handeln wollen

Feilschen wirkt wie Schwarzmarkt-Logik.

## Gute-Mitglied-Checkliste

- Keine Fotos oder Videos
- Leise beim Kommen und Gehen
- Respekt fur Staff und Mitglieder
- Kein Teilen mit Nicht-Mitgliedern
- Von Contribution statt Preis sprechen`,
      tags: ['Etikette', 'Kultur', 'Tipps'],
    },
    'first-time-barcelona-cannabis-club': {
      title: 'Dein erstes Mal in einem Cannabis-Club in Barcelona: der respektvolle Weg hinein',
      excerpt: 'Ein realistischer Leitfaden fur den ersten Besuch in einem CSC in Barcelona mit den richtigen Erwartungen.',
      metaDescription: 'Ein realistischer Leitfaden fur den ersten Besuch in einem CSC in Barcelona mit den richtigen Erwartungen.',
      content: `## Bevor es losgeht

Es ist kein schneller Prozess. Nichts ist garantiert. Respekt ist Pflicht.

---

## Schritt 1: vor dem Flug recherchieren

- Clubs finden, die internationale Besucher akzeptieren
- Anforderungen und Antwortzeiten prufen
- Sprachsupport bestatigen
- Alternativen bereithalten

Starte mit [the directory](/en/clubs/).

---

## Schritt 2: Antrag

Nur verifizierte Kanale nutzen. Keine Strassenpromoter und keine dubiosen Nachrichten.

---

## Schritt 3: Vorbereitung

- Gultigen Ausweis mitnehmen
- Mitgliedschaftsbestatigung bereithalten
- Bargeld nur wenn notig

---

## Schritt 4: Ankunft

Den Anweisungen genau folgen und Hausregeln lesen.

---

## Schritt 5: drinnen

Privatsphare respektieren, Telefon weg und Staff folgen.

---

## Schritt 6: beim Verlassen

- Nicht offentlich konsumieren
- Standort nicht teilen
- Keine Clubdetails posten

---

## Typische Fehler

- Ohne bestatigte Mitgliedschaft auftauchen
- Fremden fur Zugang folgen
- Fotos machen
- Danach offentlich konsumieren`,
      tags: ['Erstes Mal', 'Barcelona', 'Etikette'],
    },
    'edibles-safety-guide': {
      title: 'Sicherheitsleitfaden fur Edibles: Dosierung, Timing und Risiken',
      excerpt: 'Wie man vorsichtiger dosiert und den klassischen Fehler des zu fruhen Nachlegens vermeidet.',
      content: `[!INFO] TL;DR
Edibles werden uber die Leber verarbeitet und konnen starker und langer wirken. **Niedrig anfangen (5-10 mg)** und **mindestens 90 Minuten warten**, bevor du nachlegst.

## Der verzogerte Effekt

- **Beginn:** 30 Minuten bis 2 Stunden
- **Peak:** 2 bis 4 Stunden
- **Dauer:** 4 bis 8 Stunden oder langer

Der klassische Fehler ist, zu fruh nachzunehmen.

## Dosierungsorientierung

- **1-2.5 mg:** Mikro-Dosis
- **5 mg:** niedrige Standard-Dosis
- **10 mg:** fur viele Anfanger schon deutlich
- **20 mg+:** hoheres Risiko fur Angst oder Sedierung

[!WARNING] Kennzeichnung
In grauen oder schwach regulierten Markten sind Labels nicht immer zuverlassig.

## Wenn es zu viel wird

1. Nicht in Panik geraten
2. Wasser trinken
3. Ruhig hinsetzen oder hinlegen
4. Schlafen, wenn moglich`,
      tags: ['Sicherheit', 'Edibles', 'Gesundheit'],
    },
    'emergency-resources': {
      title: 'Notfallressourcen: was tun, wenn du Hilfe brauchst',
      excerpt: 'Praktische Hinweise fur medizinische Notfalle, schlechte Reaktionen oder Polizeikontakt.',
      content: `[!INFO] TL;DR
Bei einem medizinischen Notfall **sofort 112 anrufen**. Bei Polizeikontakt ruhig bleiben und nicht mehr sagen als notig.

## Medizinische Notfalle

112 anrufen oder in die Notaufnahme gehen bei:

- Brustschmerz
- Starker Panik
- Anhaltendem Erbrechen
- Atemproblemen

**Energy Control Barcelona**

- C/ de l Aurora, 27, 08001 Barcelona
- Offizielle Zeiten prufen
- Harm-Reduction-Information und Unterstutzung

## Polizei

1. Ruhig bleiben
2. Dokumente zeigen, wenn verlangt
3. Schweigerecht nutzen
4. Unterlagen aufbewahren
5. Nichts unterschreiben, was du nicht verstehst`,
      tags: ['Sicherheit', 'Notfall', 'Ressourcen'],
    },
    'safety-kit-visitors-spain': {
      title: 'The Safety Kit: was jeder Besucher wissen sollte, bevor er einen Club betritt',
      excerpt: 'Ein praktischer Sicherheitsleitfaden zu Betrug, rechtlichen Linien, Privatsphare und risikoarmerem Verhalten.',
      metaDescription: 'Praktischer Sicherheitsleitfaden fur Club-Besucher in Spanien: Betrug, rechtliche Grenzen, Diskretion und konkrete Schritte zur Risikoreduktion.',
      content: `## Warum dieser Guide existiert

Die Club-Szene in Spanien hat ein Informationsproblem, und genau das macht Besucher angreifbar.

---

## Bevor du das Hotel verlasst

- Clubs vorher recherchieren
- Den richtigen Ausweis mitnehmen
- Anforderungen des Clubs kennen
- Details offline speichern

---

## Der Weg zum Club

**Niemals Strassenpromotern folgen.**

Keine Flyer oder Einladungen von Fremden annehmen.

---

## An der Tur

Ehrlich sagen, wer du bist, Mitgliedschaft oder Referenz klar nennen und Wartezeit oder Ablehnung ruhig akzeptieren.

---

## Im Club

- Keine Fotos oder Videos
- Privatsphare anderer respektieren
- Hausregeln befolgen

---

## Rote Linien

- Nichts aus dem Club mitnehmen
- Nicht offentlich konsumieren
- Mitgliedschaft nicht teilen
- Clubstandort nicht online teilen

---

## Warnzeichen

- Kein echter Aufnahmeprozess
- Keine Dokumentation
- Geldforderung vor jeder Klarung
- Unklarer oder improvisierter Ort
- Man sagt dir, Regeln seien unwichtig

---

## Wenn etwas schieflauft

Ruhig bleiben. Gehen, wenn es sich unsicher anfuhlt. In Spanien gilt **112** als Notruf.`,
      tags: ['Sicherheit', 'Besucher', 'Checkliste'],
    },
    'is-weed-legal': {
      title: 'Ist Weed in Barcelona 2026 legal? Reale Regeln, Bussgelder und Grauzonen',
      excerpt: 'Barcelona ist nicht Amsterdam. Wer private Toleranz und offentliche Illegalitat verwechselt, erhoht sein Risiko.',
      content: `[!INFO] TL;DR
**Nein, Cannabis ist in Barcelona nicht einfach legal.** Im privaten Raum gibt es Toleranz, im offentlichen Raum bleiben Besitz und Konsum sanktionierbar.

## Die Grauzone

Die Schlusselfrage ist der Unterschied zwischen **offentlichem** und **privatem** Raum.

### 1. Offentlicher Raum = hohes Risiko

- **Bussgeld:** von **601 EUR bis 30.000 EUR**
- **Art:** meist Verwaltungsverstoss
- **Kontrolle:** Polizei hat grossen Ermessensspielraum

### 2. Privater Raum = Toleranz

Auf dieser Unterscheidung baut das Club-Modell auf.

## Was ist ein CSC?

Ein **nicht gewinnorientierter Verein**, kein offenes Geschaft.

[!WARNING] Touristenfallen
Seriose Clubs **werben nicht auf der Strasse**.`,
      tags: ['Recht', 'Bussgelder', 'Polizei', 'Touristen-Guide'],
    },
    'scams-red-flags': {
      title: 'Cannabis-Betrug in Barcelona: DMs, Promoter und Warnzeichen',
      excerpt: 'Wie du falsche Angebote erkennst und dich vor den haufigsten Touristenfallen schutzt.',
      content: `[!INFO] TL;DR
Die meisten unaufgeforderten Angebote sind Betrug. Wenn dir jemand in DMs oder auf der Strasse schnellen Zugang verspricht, geht es meist um dein Geld.

## Die DM-Masche

1. Du zahlst
2. Die Person verschwindet
3. Es gibt keinen realen Zugang

## Der Strassenpromoter

[!WARNING] Wenn es wie ein Strassendeal wirkt, geh weg.

## Falsche Telegram-Menues

Accounts mit Menus und Lieferzusagen passen nicht zu einem serioesen Club-Modell.

## Warnzeichen

- Kontakt wurde von ihnen gestartet
- Vorkasse
- Bestellung uber Telegram oder WhatsApp
- Delivery-Sprache
- Treffpunkt im offentlichen Raum`,
      tags: ['Betrug', 'Sicherheit', 'Warnzeichen'],
    },
    'spain-cannabis-laws-tourists': {
      title: 'Cannabis-Gesetze in Spanien: was Touristen wirklich wissen mussen',
      excerpt: 'Eine kurze Einordnung von privater Toleranz, offentlichen Bussgeldern und der Grauzone der CSC.',
      content: `## Kurzfassung

Spanien hat kein offentliches legales Cannabis-Einzelhandelssystem. Besitz und Konsum im offentlichen Raum konnen weiterhin zu Verwaltungsstrafen fuhren.

## Offentlich vs. privat

Der entscheidende Punkt ist der Ort des Verhaltens. Im offentlichen Raum steigt das Risiko deutlich.

## CSC-Kontext

CSC arbeiten in einer Grauzone auf Basis privater Vereinslogik.

## Einfache Regel

Immer davon ausgehen, dass Durchsetzung je nach Stadt und Kontext variieren kann.`,
      tags: ['Recht', 'Touristen', 'Spanien'],
    },
  },
};
