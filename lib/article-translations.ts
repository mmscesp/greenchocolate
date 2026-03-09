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
      excerpt: 'Si crees que un club de Barcelona funciona como un coffeeshop de Amsterdam, empiezas el viaje con la idea equivocada.',
      content: `## La idea que mete a la gente en problemas

Muchos visitantes llegan a Barcelona esperando listados publicos, acceso inmediato y un modelo parecido al de Amsterdam. Ese marco mental es justo lo que eleva el riesgo.

## Como funciona Amsterdam

Los coffeeshops de Amsterdam son locales visibles y publicos dentro de un modelo de tolerancia.

- entras con tu documento
- ves un menu
- haces una compra
- consumes segun las reglas locales

El turista forma parte normal del sistema.

## Como funciona el modelo de club en Espana

Los CSC en Espana son asociaciones privadas, no escaparates publicos.

- no hay walk-in real
- la membresia suele requerir preparacion previa
- no existe un modelo normal de publicidad
- las reglas cambian segun el club

El visitante no es el publico por defecto.

## Comparacion rapida

| | Amsterdam Coffeeshop | Espana CSC |
|---|---|---|
| Acceso directo | Si | No |
| Membresia | No | Si |
| Visibilidad publica | Si | No |
| Modelo turistico | Central | Variable |
| Riesgo por conducta publica | Menor en contexto | Alto |

## Por que esta diferencia importa

La brecha entre expectativa y realidad es donde aparecen las estafas y los errores. Si buscas, preguntas y te comportas como si Barcelona fuera Amsterdam, tu riesgo sube rapido.

## Que deberias hacer

- Lee [The Safety Kit](/en/editorial/safety-kit-visitors-spain)
- Lee [Spain's Cannabis Laws](/en/editorial/spain-cannabis-laws-tourists)
- Usa [the directory](/en/clubs/) antes de viajar`,
      tags: ['Cultura', 'Barcelona', 'Amsterdam'],
    },
    'cannabis-europa-london-2026': {
      title: 'Cannabis Europa London 2026: donde se cruzan politica e industria',
      excerpt: 'Un briefing practico para entender por que Cannabis Europa importa y como prepararte mejor para asistir.',
      content: `Cannabis Europa se mueve en el cruce entre politica, capital, regulacion y estrategia empresarial. No es un evento de cultura de consumo. Es un espacio para leer hacia donde puede ir el mercado europeo.

## Que tipo de evento es

Es una conferencia con presencia de inversores, operadores, asesores, perfiles regulatorios y personas que siguen de cerca la direccion institucional del sector.

## Por que importa

Ayuda a responder tres preguntas utiles:

- hacia donde apuntan las senales regulatorias
- que modelos de negocio parecen mas solidos
- donde se estan concentrando las prioridades de compliance y capital

## Como prepararte mejor

- elige sesiones segun tu rol real
- define a quien necesitas ver antes de llegar
- lleva pensado el seguimiento posterior

Se aprovecha mejor si lo tratas como una semana de trabajo, no como una visita pasiva.`,
      tags: ['Eventos', 'Cannabis Europa', 'Londres'],
    },
    'cannabis-social-club-history-spain': {
      title: 'Como empezaron los clubes sociales de cannabis en Espana',
      excerpt: 'Una cronologia practica sobre como las asociaciones privadas de cannabis evolucionaron hasta el modelo de club actual.',
      content: `Los clubes sociales de cannabis en Espana no nacieron como espacios para turistas ni como experimentos retail. Surgieron desde una logica de asociacion privada, cultivo colectivo y consumo lejos de la calle.

## De donde viene el modelo

El origen esta ligado al derecho de asociacion y a la diferencia juridica entre conducta privada y conducta publica. En vez de abrir tiendas, los primeros grupos se organizaron como colectivos privados.

Eso genero una logica distinta:

- miembros en lugar de clientes
- normas internas en lugar de servicio retail
- discrecion en lugar de visibilidad

## Por que el modelo crecio

Para muchas personas, el club ofrecio un entorno mas seguro y mas estable que la calle. Tambien abrio espacio para normas internas, reduccion de riesgos y cierta responsabilidad comunitaria.

## Por que la historia legal sigue importando

La historia del modelo no es solo cultural. Tambien es legal. Los clubes han vivido siempre dentro de un marco sensible donde la posesion y el consumo en publico siguen teniendo riesgo.

## Lo que un visitante deberia entender

- no nacieron para ser coffeeshops
- los controles de acceso forman parte del modelo
- la conducta fuera del local afecta a la tolerancia del entorno

Si quieres la version practica para visitantes, lee [What Cannabis Social Clubs in Spain Actually Are](/en/editorial/what-are-cannabis-social-clubs-spain).`,
      tags: ['Cultura', 'Historia', 'Espana'],
    },
    'icbc-berlin-2026': {
      title: 'ICBC Berlin 2026: la conferencia europea de negocio cannabico',
      excerpt: 'Una guia breve para entender a quien sirve ICBC Berlin y como sacarle valor si trabajas con regulacion o mercado.',
      content: `ICBC Berlin es un evento orientado al negocio. Sirve sobre todo a quienes siguen regulacion, desarrollo de mercado, alianzas y estrategia operativa.

## Que esperar

Suele reunir a operadores, inversores, equipos regulatorios, asesores y perfiles que intentan leer la siguiente fase del mercado europeo.

## A quien le encaja mejor

- operadores que buscan expansion o socios
- equipos de policy o compliance
- inversores y asesores que siguen la ejecucion del mercado

Si tu interes es puramente de cultura de consumo, no es el mejor formato.

## Como aprovecharlo

- cierra reuniones pronto
- vigila cambios en el programa oficial
- prioriza sesiones segun tu rol

La calidad del seguimiento importa mas que la cantidad de tarjetas.`,
      tags: ['Eventos', 'ICBC', 'Berlin'],
    },
    'spannabis-bilbao-2026': {
      title: 'Spannabis Bilbao 2026: lo que debes saber antes de ir',
      excerpt: 'Una guia practica sobre por que Spannabis sigue importando y como organizar el viaje con mejor criterio.',
      content: `Spannabis sigue siendo una referencia dentro del calendario europeo del cannabis. Si vas a Bilbao, conviene enfocarlo con preparacion primero y entusiasmo despues.

## Por que sigue siendo relevante

El evento mezcla visibilidad de marca, networking, cultura de producto y senales de mercado. Incluso mucha gente que no asiste sigue lo que ocurre alli.

## Como planificar bien

- reserva transporte y alojamiento pronto
- revisa siempre los canales oficiales
- confirma la logistica del recinto antes de llegar
- no confundas la planificacion del evento con la normativa local

## Conducta en el recinto y fuera

Las reglas del evento y la realidad legal de la ciudad no son lo mismo. Un ambiente permisivo dentro de una expo no convierte la conducta publica fuera en algo seguro.

Tratelo como un entorno profesional antes que como un espectaculo.`,
      tags: ['Eventos', 'Spannabis', 'Bilbao'],
    },
    'what-are-cannabis-social-clubs-spain': {
      title: 'Que son realmente los clubes sociales de cannabis en Espana y por que importa para tu viaje',
      excerpt: 'Los CSC en Espana no son coffeeshops ni dispensarios. Esta guia explica que son de verdad y por que entenderlo cambia todo.',
      metaTitle: 'Que son realmente los clubes sociales de cannabis en Espana y por que importa para tu viaje',
      metaDescription: 'Guia practica sobre que son realmente los CSC en Espana, como funcionan y por que entender su logica reduce riesgos para cualquier visitante.',
      content: `## La version en una frase

Un club social de cannabis es una asociacion privada, sin animo de lucro y solo para miembros, donde personas registradas organizan acceso y consumo en un entorno cerrado y privado.

Eso es. No es una tienda. No es un escaparate. No es un lugar para entrar por impulso.

## Que son

Los CSC existen dentro de la logica del derecho de asociacion. No son negocios abiertos al publico ni funcionan con una licencia comercial como una tienda.

Los miembros sostienen el modelo con cuota y contribuciones para acceder dentro del espacio privado.

## Como funcionan en la practica

Cada club es distinto, pero hay patrones claros:

**La membresia es obligatoria.**

**Muchos clubes piden referencia o verificacion previa.**

**Suele existir una cuota de alta o renovacion.**

**El lenguaje no es el de una compra retail.**

**La suposicion mas segura es que nada debe salir del local.**

## Quien puede entrar

No existe una regla universal.

**Los residentes en Espana** suelen tener el camino mas facil.

**Los visitantes internacionales** encuentran mas variacion: algunos clubes aceptan pasaporte y solicitud previa; otros siguen siendo solo para locales.

**La edad minima** suele ser 18+ y muchas veces 21+.

**El tiempo importa.** Llegar hoy y pretender entrar hoy mismo no siempre es realista.

## Lo que no son

**No son coffeeshops.**

**No son dispensarios.**

**No son bares de libre acceso.**

**No son todos iguales** en seguridad, profesionalidad ni criterios de admision.

## La realidad legal, en corto

No existe una ley estatal que legalice de forma clara a los CSC.

**El consumo privado en espacio privado** se trata de forma distinta a la actividad publica.

**La posesion o el consumo en publico** pueden acabar en multa.

**La zona gris es real.**

## Por que esto importa para tu viaje

No es teoria. Es la diferencia entre una visita tranquila y una situacion que termina en estafa, multa o problema de seguridad.

## Que leer despues

- [The Safety Kit](/en/editorial/safety-kit-visitors-spain)
- [Barcelona vs. Amsterdam](/en/editorial/barcelona-vs-amsterdam-cannabis)
- [Your First Time in a Barcelona Cannabis Club](/en/editorial/first-time-barcelona-cannabis-club)
- [Spain's Cannabis Laws](/en/editorial/spain-cannabis-laws-tourists)
- [the directory](/en/clubs/)`,
      tags: ['Guia esencial', 'CSC', 'Espana'],
    },
    '5-mistakes-tourists-make': {
      title: '5 errores que cometen los turistas en los clubes de cannabis de Barcelona',
      excerpt: 'Las claves de etiqueta que separan al visitante respetuoso del que genera rechazo desde el primer minuto.',
      content: `Los clubes de Barcelona no funcionan como bares, dispensarios ni coffeeshops. La forma mas rapida de quedar mal es actuar como si estuvieras en un espacio retail. La forma mas rapida de perder acceso es ignorar privacidad, normas internas o impacto vecinal.

## Error 1: tratar el club como una tienda

Dentro de un club no eres un cliente de mostrador. Eres miembro de una asociacion privada.

- no abras con "cuanto cuesta esto"
- pregunta mejor por la contribucion o por las opciones
- no exijas ritmo ni atencion como en un comercio

## Error 2: sacar el movil para hacer fotos

La privacidad no es un detalle simpatico. Es una regla de fondo. Hacer fotos del interior, del menu o de otras personas puede bastar para que te pidan salir.

- movil guardado
- nada de fotos ni videos
- nada de publicar la ubicacion o a otros miembros

## Error 3: hablar como si fuera takeaway

El lenguaje de delivery o takeaway hace sonar todo a retail o distribucion. El enfoque seguro es asumir que el espacio es privado y que las reglas de dentro mandan.

## Error 4: hacer ruido fuera

Muchas tensiones nacen de quejas vecinales.

- no te quedes en la puerta
- no fumes al salir
- baja la voz en la calle

## Error 5: intentar negociar

Regatear solo transmite que no entiendes el modelo. Si algo no te encaja, se rechaza con respeto. No se negocia como en una transaccion callejera.

## Un mejor estandar

- respeta al personal y a otros miembros
- sigue las normas cuando te las expliquen
- usa lenguaje de contribucion, no de precio
- guarda el telefono
- se discreto al entrar y salir

Para una guia completa, lee [Your First Time in a Barcelona Cannabis Club](/en/editorial/first-time-barcelona-cannabis-club).`,
      tags: ['Etiqueta', 'Cultura', 'Consejos'],
    },
    'first-time-barcelona-cannabis-club': {
      title: 'Tu primera vez en un club de cannabis de Barcelona: la forma respetuosa de entrar',
      excerpt: 'Una guia realista para preparar tu primera visita a un CSC en Barcelona con mejores expectativas y menos errores.',
      metaDescription: 'Una guia realista para preparar tu primera visita a un CSC en Barcelona con expectativas correctas y un enfoque respetuoso.',
      content: `## Ajusta primero las expectativas

La primera visita no es un paseo improvisado. Puede requerir tiempo, espera y algo de humildad. El acceso no esta garantizado.

## Paso 1: investiga antes de volar

- identifica clubes que acepten visitantes internacionales
- revisa requisitos y tiempos de respuesta
- confirma idioma y soporte
- ten alternativas

Empieza por [the directory](/en/clubs/).

## Paso 2: aplica por canales verificados

Usa solo canales oficiales o verificados. Nada de atajos por mensajes aleatorios ni promotores callejeros.

## Paso 3: preparate de verdad

Lleva lo que hace falta:

- documento oficial valido
- confirmacion de membresia o aprobacion
- efectivo si el club lo requiere

No lleves invitados extra si el club no lo permite.

## Paso 4: llega con paciencia

Deja que el proceso de intake ocurra. Puede haber espera, preguntas, normas internas y papeleo.

## Paso 5: dentro manda la discrecion

- movil guardado
- respeto a la privacidad
- escucha al personal
- no actues como si estuvieras en una tienda

## Paso 6: no conviertas una visita correcta en un error al salir

- nada de consumo publico
- nada de compartir ubicacion
- nada de publicar detalles del club

## Errores tipicos de primera vez

- ir sin membresia confirmada
- seguir a desconocidos para entrar
- hacer fotos dentro
- actuar como si Barcelona fuera Amsterdam
- consumir en publico despues

Antes de intentarlo, lee [Barcelona vs. Amsterdam](/en/editorial/barcelona-vs-amsterdam-cannabis) y [The Safety Kit](/en/editorial/safety-kit-visitors-spain).`,
      tags: ['Primera vez', 'Barcelona', 'Etiqueta'],
    },
    'edibles-safety-guide': {
      title: 'Guia de seguridad de comestibles: dosis, tiempos y riesgos',
      excerpt: 'Como dosificar con mas criterio y evitar el error clasico de redosificar demasiado pronto.',
      content: `Los comestibles se sienten distintos a fumar o vapear porque el cuerpo los procesa de otra manera. El efecto suele llegar mas tarde, durar mas y pegar mas fuerte de lo que mucha gente espera.

## Por que sorprenden

- el inicio puede tardar entre 30 minutos y 2 horas
- el pico suele llegar entre 2 y 4 horas
- la duracion total puede ir de 4 horas a bastante mas

El error clasico es tomar uno, impacientarse y volver a tomar antes de tiempo.

## Una guia practica de dosis

- 1 a 2.5 mg: arranque muy suave o microdosis
- 5 mg: dosis baja para muchas personas
- 10 mg: ya puede ser fuerte para principiantes
- 20 mg o mas: mas riesgo de ansiedad, confusion o sedacion

Si no conoces tu tolerancia, trata 5 mg como un inicio serio.

## El problema de las etiquetas

En mercados grises o poco controlados, las etiquetas pueden ser inexactas. Por eso conviene ser mas conservador, no menos.

## Si tomaste demasiado

1. No entres en panico.
2. Vete a un sitio tranquilo.
3. Bebe agua.
4. Evita alcohol y mas sustancias.
5. Si puedes dormir, duerme.

Si hay dolor en el pecho, dificultad para respirar o una reaccion que parece medica, llama al **112**.

## Reglas basicas

- empieza con 5 mg o menos si tienes poca experiencia
- espera al menos 90 minutos antes de repetir
- no mezcles con alcohol si quieres algo predecible
- usalos en un lugar seguro
- mantenlos lejos de ninos y mascotas

Para una seguridad mas completa, lee [The Safety Kit](/en/editorial/safety-kit-visitors-spain).`,
      tags: ['Seguridad', 'Comestibles', 'Salud'],
    },
    'emergency-resources': {
      title: 'Recursos de emergencia: que hacer si necesitas ayuda',
      excerpt: 'Referencias practicas para una emergencia medica, una mala reaccion o un encuentro con la policia.',
      content: `Si algo va mal, lo peor es improvisar bajo estres. La respuesta mas util es sencilla: ponte a salvo, llama al servicio correcto y evita agrandar la situacion con panico o discusiones.

## Si es una emergencia medica

En Espana, el numero general de emergencias es **112**.

Senales claras de que hay que pedir ayuda:

- dolor en el pecho o palpitaciones fuertes
- panico severo que no baja
- vomitos persistentes
- dificultad para respirar
- perdida de consciencia

Tambien puedes acudir a Urgencias.

## Si es una mala reaccion al cannabis

1. Lleva a la persona a un lugar tranquilo.
2. Ofrece agua.
3. Reduce ruido y estimulos.
4. No sumes alcohol ni otras sustancias.
5. Escala al **112** si la situacion parece seria.

## Si te para la policia

1. Manten la calma.
2. Muestra identificacion si te la piden.
3. No des explicaciones de mas.
4. Guarda toda la documentacion.
5. No firmes nada que no entiendas.

## Lo que nunca ayuda

- intentar sobornar
- salir corriendo
- convertir una multa o control en una pelea
- aceptar supuestas sanciones en efectivo de cualquiera en la calle

## Recursos utiles

Energy Control Barcelona es una referencia conocida de reduccion de riesgos.

- C/ de l'Aurora, 27, 08001 Barcelona
- consulta horarios oficiales
- puede ofrecer informacion y apoyo de reduccion de riesgos

Una farmacia 24 horas tambien puede ayudar en problemas menores.

## Embajadas

- EE. UU.: +34 91 587 2200
- Reino Unido: +34 91 714 6300
- Canada: +34 91 382 8400
- Australia: +34 91 353 6600

La embajada puede orientar. No puede borrar sanciones ni saltarse la ley espanola.`,
      tags: ['Seguridad', 'Emergencia', 'Recursos'],
    },
    'safety-kit-visitors-spain': {
      title: 'The Safety Kit: lo que todo visitante debe saber antes de entrar en un club',
      excerpt: 'Una guia practica sobre estafas, limites legales, privacidad y comportamiento para moverte con menos riesgo.',
      metaDescription: 'Guia practica para visitantes de clubes en Espana: estafas, limites legales, privacidad y pasos concretos para moverte con menos riesgo.',
      content: `## Por que existe esta guia

Hay poca informacion publica clara y ese vacio se llena con consejos viejos, expectativas falsas y estafadores. Esta guia existe para hacerte mas dificil de explotar.

## Antes de salir del hotel

- investiga clubes con antelacion
- confirma si aceptan visitantes
- revisa que identificacion piden
- guarda los datos offline

Nuestro [directory](/en/clubs/) es el mejor punto de partida.

## Como llegar

La regla principal es simple: no dejes que un desconocido cambie tu plan.

- no sigas a promotores
- no aceptes flyers como prueba de legitimidad
- usa tu propio mapa y tu direccion verificada

## En la puerta

- di quien eres
- menciona tu membresia o solicitud previa
- ten el documento preparado
- acepta con calma esperas o rechazos

## Dentro del club

- telefono guardado
- nada de fotos o videos
- respeto a la privacidad
- sigue las normas internas

## Lineas rojas

- no saques nada fuera del club si no entiendes el riesgo
- no consumas en publico
- no compartas tu membresia
- no publiques detalles del club online

## Senales para marcharte

- no hay proceso de alta claro
- no existe documentacion de membresia
- piden dinero antes de explicar nada
- el lugar parece improvisado
- te dicen que ignores las reglas

## Si algo va mal

- sal si el lugar no te da confianza
- no discutas en la calle
- llama al **112** en una emergencia real
- desconfia de cualquier exigencia de efectivo en el momento

Lee [Emergency Resources](/en/editorial/emergency-resources) si necesitas ayuda concreta.

## Checklist rapido

Antes:

- club verificado
- solicitud o membresia confirmada
- documento listo
- datos guardados offline

Durante:

- telefono guardado
- sin fotos
- respeto total a las normas

Despues:

- sin consumo publico
- sin compartir ubicacion
- sin detalles del club en redes`,
      tags: ['Seguridad', 'Visitantes', 'Checklist'],
    },
    'is-weed-legal': {
      title: 'Es legal la hierba en Barcelona en 2026? Reglas reales, multas y zonas grises',
      excerpt: 'Barcelona no es Amsterdam. Quien confunde tolerancia privada con libertad publica eleva su riesgo de forma innecesaria.',
      content: `No, la hierba no es simplemente "legal" en Barcelona. La forma correcta de entenderlo es otra: la conducta privada se trata de manera distinta a la conducta publica, y los turistas se meten en problemas cuando borran esa diferencia.

## La regla central: publico y privado no son lo mismo

Espana no tiene un sistema publico de venta legal al detalle. No puedes entrar en una tienda autorizada, comprar abiertamente y consumir donde quieras.

## El espacio publico implica riesgo real

Si te encuentran cannabis en la calle, la playa, un parque o un coche, puedes enfrentarte a sanciones administrativas.

- las multas pueden empezar en **EUR601**
- normalmente no es delito penal, pero si sancion administrativa
- la policia tiene amplio margen de actuacion

## La tolerancia se asocia al espacio privado

El consumo en un espacio realmente privado se trata de otra forma. Sobre esa diferencia se apoya buena parte de la logica de los clubes.

Eso no significa que todo este resuelto juridicamente. Significa que el modelo vive en una zona gris.

## Que es un club social de cannabis

Un CSC es una asociacion privada sin animo de lucro. No es un escaparate publico, ni un dispensario, ni una atraccion para turistas.

En la practica eso implica:

- la membresia importa
- el acceso esta controlado
- el lenguaje es de asociacion y contribucion, no de retail abierto
- cuanto mas publico se comporte un club, mas riesgo acumula

## Donde fallan muchos turistas

- seguir a promotores
- creerse los reclamos de "legal weed here"
- tratar el club como un negocio publico
- consumir o portar en publico al salir

## Un estandar sensato

- no consumas ni exhibas cannabis en publico
- no compres a dealers o promotores
- usa solo canales verificables
- lleva en orden identificacion y datos de membresia
- mueve cualquier visita con maxima discrecion

Si quieres mas contexto, lee [Spain's Cannabis Laws for Tourists](/en/editorial/spain-cannabis-laws-tourists) y [Barcelona Cannabis Scams](/en/editorial/scams-red-flags).`,
      tags: ['Legal', 'Multas', 'Policia', 'Guia para turistas'],
    },
    'scams-red-flags': {
      title: 'Estafas de cannabis en Barcelona: DMs, promotores y senales rojas',
      excerpt: 'Como detectar lo falso y protegerte de las trampas mas comunes dirigidas a turistas.',
      content: `La mayoria de las ofertas no solicitadas no son atajos. Son trampas. Si alguien te contacta primero, te promete acceso facil, te pide dinero por adelantado o habla de delivery, parte de la base de que puede ser una estafa.

## La estafa del DM

El patron es simple:

1. te piden que pagues primero
2. prometen una direccion o un contacto
3. desaparecen o te mandan a un sitio inutil

Los clubes serios no necesitan intermediarios aleatorios cobrando por mensaje privado.

## El promotor callejero

Si alguien te intenta desviar en una zona turistica, eso ya es la senal.

- locales falsos
- cobros inflados
- productos de mala calidad
- robo o intimidacion

## El menu por Telegram o WhatsApp

Si alguien ofrece menus, entrega al hotel o encuentros publicos por apps de mensajeria, no estas viendo un proceso serio de club.

Ese esquema suele acabar en:

- pagos por adelantado
- entregas callejeras
- productos dudosos o falsificados

## Como detectar lo falso rapido

- ellos te contactaron primero
- quieren pago antes de ver el lugar
- usan Telegram o WhatsApp como sistema de pedidos
- hablan como un restaurante, no como una asociacion privada
- sugieren entregas o encuentros publicos
- operan en zonas hiperturisticas

## La alternativa segura

1. Usa webs o canales oficiales.
2. Comprueba que el proceso suena a asociacion privada y no a delivery.
3. Ve solo a lugares que puedas verificar por tu cuenta.

Si te estafan, denuncialo. El cannabis puede vivir en una zona gris, pero el fraude no.`,
      tags: ['Estafas', 'Seguridad', 'Senales rojas'],
    },
    'spain-cannabis-laws-tourists': {
      title: 'Leyes del cannabis en Espana: lo que un turista realmente necesita saber',
      excerpt: 'Una guia breve sobre tolerancia privada, multas publicas y la persistente zona gris de los CSC.',
      content: `Espana no tiene un sistema publico de venta legal de cannabis para turistas. Ese es el primer punto y cambia por completo la comparacion con los mercados de retail abierto.

## Version corta

La posesion y el consumo en publico pueden dar lugar a sanciones administrativas. El espacio privado se trata de otra manera, pero eso no crea libertad total. Crea una zona gris con limites reales.

## Publico versus privado

La distincion legal mas importante es donde ocurre la conducta.

En espacio publico, el riesgo es claramente mayor. En espacio privado, la interpretacion historica ha sido diferente, y por eso discrecion y acceso controlado importan tanto.

## Donde encajan los clubes

Los CSC no son negocios de retail abierto. Funcionan desde la logica de asociacion privada, y por eso insisten en membresia, normas internas y acceso restringido.

Si un lugar se comporta como un dispensario publico, eso suele ser una mala senal.

## La regla practica para visitantes

No te guies por rumores ni por lo que hizo otro turista el verano pasado.

- evita el consumo publico
- evita la posesion publica siempre que puedas
- evita promotores, delivery y encuentros en la calle
- trata cada club como un entorno privado con sus propias reglas

Si quieres la version centrada en Barcelona, lee [Is Weed Legal in Barcelona in 2026?](/en/editorial/is-weed-legal).`,
      tags: ['Legal', 'Turistas', 'Espana'],
    },
  },
  fr: {
    'barcelona-vs-amsterdam-cannabis': {
      title: 'Barcelone vs Amsterdam : deux villes, deux systemes, deux realites tres differentes',
      excerpt: 'Penser qu un club de Barcelone fonctionne comme un coffeeshop d Amsterdam est l erreur de depart qui cree le plus de risques.',
      content: `## L idee de depart qui cree des problemes

Beaucoup de voyageurs arrivent a Barcelone en imaginant des listes publiques, des entrees immediates et un modele proche d Amsterdam. C est justement cette attente qui expose aux erreurs.

## Comment fonctionne Amsterdam

Les coffeeshops d Amsterdam sont des lieux visibles et publics dans un cadre de tolerance.

- on entre avec sa piece d identite
- on voit le menu
- on fait un achat
- on consomme selon les regles locales

Le touriste fait partie normale du modele.

## Comment fonctionne le modele des clubs en Espagne

Les CSC en Espagne sont des associations privees, pas des vitrines publiques.

- pas de vrai walk-in
- adhesion generalement preparee a l avance
- pas de publicite classique
- regles variables selon le club

Le visiteur n est pas le public par defaut.

## Comparaison rapide

| | Amsterdam Coffeeshop | Espagne CSC |
|---|---|---|
| Acces direct | Oui | Non |
| Adhesion | Non | Oui |
| Visibilite publique | Oui | Non |
| Logique touristique | Centrale | Variable |
| Risque en public | Plus faible en contexte | Eleve |

## Pourquoi cette difference compte

L ecart entre attente et realite est l endroit ou naissent les arnaques et les mauvaises decisions. Si vous cherchez, demandez et agissez comme si Barcelone etait Amsterdam, votre risque monte vite.

## Que faire a la place

- Lire [The Safety Kit](/en/editorial/safety-kit-visitors-spain)
- Lire [Spain's Cannabis Laws](/en/editorial/spain-cannabis-laws-tourists)
- Utiliser [the directory](/en/clubs/) avant le voyage`,
      tags: ['Culture', 'Barcelone', 'Amsterdam'],
    },
    'cannabis-europa-london-2026': {
      title: 'Cannabis Europa London 2026 : la ou se croisent politique et industrie',
      excerpt: 'Un briefing pratique pour comprendre l interet de Cannabis Europa et mieux preparer la participation.',
      content: `Cannabis Europa se situe au croisement de la politique, du capital, de la regulation et de la strategie. Ce n est pas un evenement grand public. C est un lieu pour lire ou peut aller le marche europeen.

## Quel type d evenement

On y trouve surtout investisseurs, operateurs, conseillers, profils reglementaires et personnes qui suivent de pres les signaux institutionnels du secteur.

## Pourquoi cela compte

L evenement aide a repondre a trois questions utiles :

- dans quelle direction vont les signaux reglementaires
- quels modeles d affaire paraissent les plus credibles
- ou se concentrent capital et priorites de compliance

## Comment bien se preparer

- choisir les sessions selon son vrai role
- savoir a l avance qui il faut rencontrer
- arriver avec une idee claire du suivi a faire

L evenement vaut surtout si on le traite comme une semaine de travail.`,
      tags: ['Evenements', 'Cannabis Europa', 'Londres'],
    },
    'cannabis-social-club-history-spain': {
      title: 'Comment les clubs sociaux de cannabis ont commence en Espagne',
      excerpt: 'Une chronologie pratique sur l evolution des associations de cannabis vers le modele de club actuel.',
      content: `Les clubs sociaux de cannabis en Espagne ne sont pas nes comme lieux touristiques ni comme experiences de retail. Ils viennent d une logique d association privee, de culture collective et de consommation hors de la rue.

## D ou vient le modele

Le modele s appuie sur le droit d association et sur la distinction entre conduite privee et conduite publique. Les premiers groupes se sont structures comme collectifs prives plutot que comme magasins.

Cela a cree une logique differente :

- des membres plutot que des clients
- des regles internes plutot qu un service public de vente
- de la discretion plutot que de la visibilite

## Pourquoi le modele s est etendu

Pour beaucoup, le club offrait un cadre plus stable et plus sur que l achat de rue. Il permettait aussi des normes communautaires, de la reduction des risques et une forme de responsabilite collective.

## Pourquoi l histoire juridique reste centrale

Cette histoire est aussi legale. Les clubs ont toujours evolue dans un cadre sensible ou possession et consommation en public restent a risque.

## Ce qu un visiteur doit retenir

- le modele n a pas ete cree comme un coffeeshop
- le controle a l entree fait partie du systeme
- le comportement hors du lieu influence la tolerance autour du club

Pour la version pratique, lire [What Cannabis Social Clubs in Spain Actually Are](/en/editorial/what-are-cannabis-social-clubs-spain).`,
      tags: ['Culture', 'Histoire', 'Espagne'],
    },
    'icbc-berlin-2026': {
      title: 'ICBC Berlin 2026 : la conference europeenne du business cannabis',
      excerpt: 'Un guide bref pour comprendre a qui sert ICBC Berlin et comment en tirer de la valeur.',
      content: `ICBC Berlin est un evenement centre sur le business. Il parle surtout a ceux qui suivent regulation, developpement de marche, partenariats et execution.

## A quoi s attendre

On y retrouve surtout operateurs, investisseurs, equipes policy, juristes et profils qui cherchent a lire la prochaine phase du marche europeen.

## Pour qui c est le plus utile

- operateurs qui cherchent expansion ou partenariats
- equipes regulation ou compliance
- investisseurs et conseillers qui suivent l execution du marche

Si votre angle est uniquement culture de consommation, ce n est pas le bon format.

## Comment bien l utiliser

- fixer les rendez-vous tot
- suivre les mises a jour officielles
- choisir les sessions selon son role

Le suivi apres l evenement compte plus que l accumulation de contacts.`,
      tags: ['Evenements', 'ICBC', 'Berlin'],
    },
    'spannabis-bilbao-2026': {
      title: 'Spannabis Bilbao 2026 : ce qu il faut savoir avant d y aller',
      excerpt: 'Un guide pratique sur la place de Spannabis dans le calendrier europeen et sur la preparation du voyage.',
      content: `Spannabis reste une reference du calendrier cannabis en Europe. Si vous allez a Bilbao, mieux vaut privilegier la preparation plutot que l enthousiasme sans cadre.

## Pourquoi l evenement attire l attention

Il melange visibilite de marque, networking, culture produit et signaux de marche. Meme ceux qui n y vont pas regardent ce qu il s y passe.

## Comment preparer le deplacement

- reserver transport et logement tot
- suivre les canaux officiels
- verifier la logistique du lieu
- ne pas confondre evenement et cadre legal local

## Conduite sur place

Les regles du salon et la realite legale de la ville ne sont pas les memes. Une ambiance permissive dans un hall n efface pas le risque d un comportement public negligent dehors.

Il faut traiter l evenement comme un environnement professionnel avant tout.`,
      tags: ['Evenements', 'Spannabis', 'Bilbao'],
    },
    'what-are-cannabis-social-clubs-spain': {
      title: 'Ce que sont vraiment les clubs sociaux de cannabis en Espagne et pourquoi cela compte pour votre voyage',
      excerpt: 'Les CSC en Espagne ne sont ni des coffeeshops ni des dispensaires. Ce guide explique ce qu ils sont vraiment et pourquoi cette difference change tout.',
      metaTitle: 'Ce que sont vraiment les clubs sociaux de cannabis en Espagne et pourquoi cela compte pour votre voyage',
      metaDescription: 'Guide pratique sur ce que sont vraiment les CSC en Espagne, sur leur fonctionnement et sur les raisons pour lesquelles cette logique compte pour les visiteurs.',
      content: `## La version en une phrase

Un club social de cannabis est une association privee, a but non lucratif et reservee aux membres, ou des personnes enregistrees organisent l acces et la consommation dans un cadre ferme et prive.

Ce n est ni une boutique, ni une vitrine, ni un lieu pour entrer sur un coup de tete.

## Ce qu ils sont

Les CSC s inscrivent dans la logique du droit d association. Ce ne sont pas des commerces ouverts au public et ils ne fonctionnent pas avec une licence commerciale classique.

Les membres financent le modele par cotisation et contributions pour acceder a l espace prive.

## Comment ils fonctionnent au quotidien

Chaque club est different, mais certains points reviennent souvent :

**L adhesion est obligatoire.**

**Beaucoup de clubs demandent une reference ou une verification prealable.**

**Il existe souvent une cotisation d entree ou de renouvellement.**

**Le langage n est pas celui d un achat retail.**

**L hypothese la plus sure est de penser que rien ne doit sortir du lieu.**

## Qui peut entrer

Il n existe pas de regle universelle.

**Les residents en Espagne** ont souvent le chemin le plus simple.

**Les visiteurs internationaux** font face a davantage de variation : certains clubs acceptent passeport et demande prealable ; d autres restent reserves aux locaux.

**L age minimum** est souvent 18+ et parfois 21+.

**Le temps compte.** Arriver aujourd hui et vouloir entrer aujourd hui n est pas toujours realiste.

## Ce qu ils ne sont pas

**Ce ne sont pas des coffeeshops.**

**Ce ne sont pas des dispensaires.**

**Ce ne sont pas des bars a acces libre.**

**Ils ne se valent pas tous** en securite, professionnalisme ou selection a l entree.

## La realite legale, en bref

Il n existe pas de loi nationale qui legalise clairement les CSC.

**La consommation privee en espace prive** est traitee differemment de l activite publique.

**La possession ou la consommation en public** peuvent conduire a une amende.

**La zone grise reste reelle.**

## Pourquoi cela compte pour votre voyage

Ce n est pas de la theorie. C est la difference entre une visite paisible et une situation qui finit en arnaque, amende ou probleme de securite.

## Que lire ensuite

- [The Safety Kit](/en/editorial/safety-kit-visitors-spain)
- [Barcelona vs. Amsterdam](/en/editorial/barcelona-vs-amsterdam-cannabis)
- [Your First Time in a Barcelona Cannabis Club](/en/editorial/first-time-barcelona-cannabis-club)
- [Spain's Cannabis Laws](/en/editorial/spain-cannabis-laws-tourists)
- [the directory](/en/clubs/)`,
      tags: ['Guide essentiel', 'CSC', 'Espagne'],
    },
    '5-mistakes-tourists-make': {
      title: '5 erreurs que font les touristes dans les clubs de cannabis de Barcelone',
      excerpt: 'Les regles d etiquette qui separent le visiteur respectueux de celui qui cree de la mefiance immediatement.',
      content: `Les clubs de Barcelone ne fonctionnent ni comme des bars, ni comme des dispensaires, ni comme des coffeeshops. Le moyen le plus rapide de mal paraitre est de se comporter comme dans un lieu retail. Le moyen le plus rapide de perdre l acces est d ignorer la vie privee, les regles internes ou l impact de voisinage.

## Erreur 1 : traiter le club comme une boutique

Dans un club, vous n etes pas un client de comptoir. Vous etes membre d une association privee.

- ne commencez pas par demander le prix comme dans un magasin
- demandez plutot la contribution ou les options
- ne forcez pas le rythme de l interaction

## Erreur 2 : sortir le telephone pour faire des photos

La vie privee n est pas un detail. C est une regle de fond. Photographier l interieur, le menu ou d autres personnes peut suffire pour etre mis dehors.

- telephone garde de cote
- aucune photo ni video
- aucune publication sur le lieu ou les membres

## Erreur 3 : parler comme si c etait du takeaway

Le langage de livraison ou takeaway donne une impression de retail ou de distribution. Le bon reflexe est de considerer que l espace est prive et que les regles du lieu priment.

## Erreur 4 : etre bruyant dehors

Beaucoup de tensions naissent des plaintes de voisinage.

- ne restez pas devant la porte
- ne fumez pas juste en sortant
- baissez la voix dans la rue

## Erreur 5 : essayer de negocier

Marchander montre surtout que vous ne comprenez pas le modele. Si quelque chose ne vous convient pas, on decline calmement.

## Un meilleur standard

- respecter le staff et les autres membres
- suivre les regles des qu elles sont expliquees
- parler de contribution plutot que de prix
- garder le telephone range
- rester discret a l entree comme a la sortie

Pour une vue d ensemble, lire [Your First Time in a Barcelona Cannabis Club](/en/editorial/first-time-barcelona-cannabis-club).`,
      tags: ['Etiquette', 'Culture', 'Conseils'],
    },
    'first-time-barcelona-cannabis-club': {
      title: 'Premiere fois dans un club de cannabis a Barcelone : la bonne facon d entrer',
      excerpt: 'Un guide realiste pour preparer une premiere visite dans un CSC a Barcelone avec de meilleures attentes et moins d erreurs.',
      metaDescription: 'Un guide realiste pour preparer une premiere visite dans un CSC a Barcelone avec les bonnes attentes et une approche respectueuse.',
      content: `## Ajuster d abord ses attentes

Une premiere visite n est pas une simple course improvisee. Elle peut demander du temps, de l attente et un peu d humilite. L acces n est jamais garanti.

## Etape 1 : faire ses recherches avant de voler

- identifier les clubs qui acceptent des visiteurs internationaux
- verifier exigences et delais de reponse
- confirmer la langue et le support
- garder des alternatives

Commencez avec [the directory](/en/clubs/).

## Etape 2 : passer par des canaux verifies

Utilisez seulement des canaux officiels ou verifies. Pas de raccourcis par message aleatoire ni de rabatteurs.

## Etape 3 : venir avec ce qu il faut

- piece d identite valide
- confirmation d adhesion ou d approbation
- espece si le club le demande

N arrivez pas avec des invites non prevus.

## Etape 4 : laisser l accueil suivre son cours

Il peut y avoir attente, questions, lecture des regles et formalites. Laissez le processus se faire.

## Etape 5 : une fois dedans, discretion

- telephone garde
- respect de la vie privee
- ecoute du staff
- pas de comportement de client de magasin

## Etape 6 : ne pas creer un nouveau risque en sortant

- pas de consommation publique
- pas de partage de localisation
- pas de publication de details du club

## Les erreurs les plus frequentes

- venir sans adhesion confirmee
- suivre des inconnus pour entrer
- faire des photos
- agir comme si Barcelone etait Amsterdam
- consommer en public en sortant

Avant la premiere tentative, lire [Barcelona vs. Amsterdam](/en/editorial/barcelona-vs-amsterdam-cannabis) et [The Safety Kit](/en/editorial/safety-kit-visitors-spain).`,
      tags: ['Premiere fois', 'Barcelone', 'Etiquette'],
    },
    'edibles-safety-guide': {
      title: 'Guide de securite des edibles : dosage, timing et risques',
      excerpt: 'Comment doser avec plus de prudence et eviter l erreur classique du redosage trop rapide.',
      content: `Les edibles se ressentent differemment du fait de fumer ou vapoter. L effet arrive souvent plus tard, dure plus longtemps et peut etre plus fort que prevu.

## Pourquoi ils surprennent

- debut possible entre 30 minutes et 2 heures
- pic souvent entre 2 et 4 heures
- duree totale de 4 heures a bien plus

L erreur classique consiste a reprendre trop vite parce qu on croit que rien ne se passe.

## Repere pratique de dosage

- 1 a 2.5 mg : depart tres leger
- 5 mg : faible dose pour beaucoup
- 10 mg : deja fort pour un debutant
- 20 mg ou plus : davantage de risque d anxiete ou de confusion

Si vous ne connaissez pas votre tolerance, traitez 5 mg comme un vrai point de depart.

## Le probleme des etiquettes

Dans les marches gris ou peu controles, l etiquetage peut etre inexact. Il faut donc etre plus prudent quand la source est mal connue.

## Si c etait trop

1. Ne paniquez pas.
2. Mettez-vous dans un lieu calme.
3. Buvez de l eau.
4. Evitez alcool et autres substances.
5. Dormez si c est possible.

En cas de douleur thoracique, de difficulte a respirer ou de reaction qui semble medicale, appelez le **112**.

## Regles de base

- commencer avec 5 mg ou moins si vous etes peu experimente
- attendre au moins 90 minutes avant d envisager plus
- ne pas melanger avec l alcool si vous voulez quelque chose de previsible
- consommer dans un lieu sur
- garder hors de portee des enfants et des animaux

Pour une vue plus large, lire [The Safety Kit](/en/editorial/safety-kit-visitors-spain).`,
      tags: ['Securite', 'Edibles', 'Sante'],
    },
    'emergency-resources': {
      title: 'Ressources d urgence : que faire si vous avez besoin d aide',
      excerpt: 'Des reperes pratiques pour une urgence medicale, une mauvaise reaction ou un contact avec la police.',
      content: `Quand quelque chose tourne mal, la pire option est d improviser sous stress. La bonne logique est simple : se mettre en securite, appeler le bon service et eviter d agrandir la situation.

## Si c est une urgence medicale

En Espagne, le numero general d urgence est **112**.

Signes qui justifient une aide rapide :

- douleur thoracique ou palpitations fortes
- panique severe qui ne retombe pas
- vomissements persistants
- difficulte a respirer
- perte de connaissance

Vous pouvez aussi aller directement aux **Urgencias**.

## Si c est une mauvaise reaction au cannabis

1. Amener la personne dans un lieu calme.
2. Donner de l eau.
3. Reduire bruit et stimulation.
4. Ne pas ajouter alcool ou autres substances.
5. Passer au **112** si la situation parait serieuse.

## Si la police vous controle

1. Rester calme.
2. Montrer son identite si on vous la demande.
3. Ne pas donner plus d explications que necessaire.
4. Conserver tous les papiers recus.
5. Ne rien signer sans comprendre.

## Ce qu il ne faut jamais faire

- tenter de soudoyer la police
- courir
- transformer un controle en confrontation
- croire a une pseudo amende en liquide dans la rue

## Ressources utiles

Energy Control Barcelona est une reference reconnue en reduction des risques.

- C/ de l'Aurora, 27, 08001 Barcelona
- verifier les horaires officiels
- informations et soutien en reduction des risques

Une pharmacie 24h peut aussi aider sur des problemes mineurs.

## Ambassades

- Etats-Unis : +34 91 587 2200
- Royaume-Uni : +34 91 714 6300
- Canada : +34 91 382 8400
- Australie : +34 91 353 6600

L ambassade peut orienter. Elle ne peut pas effacer une sanction ni contourner la loi espagnole.`,
      tags: ['Securite', 'Urgence', 'Ressources'],
    },
    'safety-kit-visitors-spain': {
      title: 'The Safety Kit : ce que tout visiteur doit savoir avant d entrer dans un club',
      excerpt: 'Un guide pratique sur les arnaques, les limites legales, la vie privee et le comportement qui reduit le risque.',
      metaDescription: 'Guide pratique pour les visiteurs de clubs en Espagne : arnaques, limites legales, vie privee et gestes concrets pour reduire le risque.',
      content: `## Pourquoi ce guide existe

Il y a tres peu d information publique claire, et ce vide se remplit d anciens conseils, de mauvaises attentes et d arnaques. Ce guide sert a vous rendre plus difficile a exploiter.

## Avant de quitter l hotel

- rechercher les clubs a l avance
- verifier s ils acceptent des visiteurs
- controler la piece d identite demandee
- garder les informations hors ligne

Le [directory](/en/clubs/) est le bon point de depart.

## Comment s y rendre

La regle principale est simple : ne laissez pas un inconnu redessiner votre plan.

- ne suivez pas un rabatteur
- n acceptez pas un flyer comme preuve
- utilisez votre propre carte et votre adresse verifiee

## A la porte

- dire clairement qui vous etes
- mentionner adhesion ou demande prealable
- garder la piece d identite prete
- accepter calmement attente ou refus

## A l interieur

- telephone range
- aucune photo ni video
- respect de la vie privee
- suivre les regles du lieu

## Lignes rouges

- ne rien sortir du club sans comprendre le risque
- ne pas consommer en public
- ne pas partager son adhesion
- ne pas publier les details du club

## Signaux pour partir

- aucun vrai processus d admission
- aucune documentation d adhesion
- demande d argent avant explication
- lieu flou ou improvise
- quelqu un vous dit d ignorer les regles

## Si quelque chose tourne mal

- partir si le lieu semble douteux
- ne pas se disputer dans la rue
- appeler le **112** en cas d urgence reelle
- se mefier de toute exigence immediate de cash

Lire [Emergency Resources](/en/editorial/emergency-resources) pour l aide pratique.

## Checklist rapide

Avant :

- club verifie
- adhesion ou demande confirmee
- piece d identite prete
- details gardes hors ligne

Pendant :

- telephone range
- pas de photos
- respect total des regles

Apres :

- pas de consommation publique
- pas de partage de localisation
- pas de details du club sur les reseaux`,
      tags: ['Securite', 'Visiteurs', 'Checklist'],
    },
    'is-weed-legal': {
      title: 'L herbe est-elle legale a Barcelone en 2026 ? Regles reelles, amendes et zones grises',
      excerpt: 'Barcelone n est pas Amsterdam. Confondre tolerance privee et liberte publique augmente inutilement le risque.',
      content: `Non, l herbe n est pas simplement "legale" a Barcelone. La bonne facon de comprendre la situation est la suivante : le comportement prive et le comportement public ne sont pas traites de la meme facon, et c est la que les visiteurs se trompent.

## Regle centrale : public et prive ne sont pas identiques

L Espagne n a pas de systeme public de vente legale au detail. On ne peut pas entrer dans une boutique autorisee, acheter librement et consommer ou l on veut.

## L espace public implique un vrai risque

En rue, sur une plage, dans un parc ou dans une voiture, possession et consommation peuvent conduire a des sanctions administratives.

- l amende peut commencer a **EUR601**
- on parle souvent d une sanction administrative plutot que penale
- la police dispose d une large marge d intervention

## La tolerance est liee a l espace prive

La consommation dans un espace vraiment prive est interpretee autrement. C est sur cette distinction que repose une partie de la logique des clubs.

Cela ne veut pas dire que tout est juridiquement clair. Cela veut dire que le modele vit dans une zone grise.

## Ce qu est un club social de cannabis

Un CSC est une association privee a but non lucratif. Ce n est ni une vitrine publique, ni un dispensaire, ni une attraction touristique.

Dans la pratique :

- l adhesion compte
- l acces est controle
- le langage est celui de l association et de la contribution
- plus un club se comporte comme un commerce public, plus il attire le risque

## Ou les touristes se trompent

- suivre des promoteurs
- croire aux slogans de type "legal weed here"
- traiter le club comme un commerce public
- consommer ou porter en public en sortant

## Un standard plus prudent

- ne pas consommer ni montrer de cannabis en public
- ne pas acheter a des dealers ou promoteurs
- utiliser uniquement des canaux verifiables
- garder identite et details d adhesion en ordre
- rester discret autour de toute visite

Pour le contexte plus large, lire [Spain's Cannabis Laws for Tourists](/en/editorial/spain-cannabis-laws-tourists) et [Barcelona Cannabis Scams](/en/editorial/scams-red-flags).`,
      tags: ['Legal', 'Amendes', 'Police', 'Guide touriste'],
    },
    'scams-red-flags': {
      title: 'Arnaques cannabis a Barcelone : DMs, rabatteurs et signaux rouges',
      excerpt: 'Comment reperer le faux et se proteger des pieges les plus frequents pour les touristes.',
      content: `La plupart des offres non sollicitees ne sont pas des raccourcis. Ce sont des pieges. Si quelqu un vous contacte d abord, promet un acces facile, demande de l argent a l avance ou parle de livraison, il faut supposer le risque.

## L arnaque par message prive

Le schema est simple :

1. on vous demande de payer d abord
2. on vous promet une adresse ou un contact
3. la personne disparait ou vous envoie vers un lieu inutile

Les clubs serieux ne passent pas par des intermediaires aleatoires en message prive.

## Le rabatteur de rue

Si quelqu un tente de vous devier dans une zone touristique, c est deja le signal.

- faux lieux
- prix gonfles
- produits douteux
- vol ou intimidation

## Le menu Telegram ou WhatsApp

Si quelqu un propose menus, livraison a l hotel ou rendez-vous publics via messagerie, vous n etes pas face a un processus de club fiable.

Ce type de schema finit souvent en :

- paiement d avance
- remise de rue
- produits inconnus ou contrefaits

## Comment reperer le faux vite

- ils vous ont contacte en premier
- ils veulent un paiement avant le lieu
- ils utilisent Telegram ou WhatsApp comme systeme de commande
- ils parlent comme un restaurant, pas comme une association
- ils proposent livraison ou rendez-vous public
- ils operent dans les zones les plus touristiques

## L alternative plus sure

1. Utiliser des sites ou canaux officiels.
2. Verifier que le processus ressemble a une association privee et pas a une livraison.
3. Aller seulement vers des lieux verifiables par soi-meme.

Si vous etes victime d une arnaque, signalez-la. Le cannabis peut vivre en zone grise. La fraude, non.`,
      tags: ['Arnaques', 'Securite', 'Signaux rouges'],
    },
    'spain-cannabis-laws-tourists': {
      title: 'Lois sur le cannabis en Espagne : ce qu un touriste doit vraiment savoir',
      excerpt: 'Une synthese pratique sur tolerance privee, amendes publiques et zone grise persistante des CSC.',
      content: `L Espagne n a pas de systeme public de vente legale de cannabis pour les touristes. C est le premier point a comprendre et il change toute comparaison avec les marches de retail ouvert.

## Version courte

La possession et la consommation en public peuvent conduire a des sanctions administratives. L espace prive est traite autrement, mais cela ne cree pas une liberte totale. Cela cree une zone grise avec de vraies limites.

## Public versus prive

La distinction legale la plus importante tient au lieu de la conduite.

En espace public, le risque est nettement plus fort. En espace prive, l interpretation historique est differente, d ou l importance de la discretion et de l acces controle.

## Ou les clubs se situent

Les CSC ne sont pas des commerces de retail ouvert. Ils fonctionnent selon une logique d association privee, ce qui explique adhesion, regles internes et acces restreint.

Si un lieu se comporte comme un dispensaire public, c est plutot un mauvais signal.

## La regle pratique pour les visiteurs

Ne vous fiez ni aux rumeurs ni a ce qu un autre touriste raconte.

- eviter la consommation publique
- eviter la possession publique autant que possible
- eviter promoteurs, livraison et rendez-vous de rue
- traiter chaque club comme un environnement prive avec ses propres regles

Pour la version centree sur Barcelone, lire [Is Weed Legal in Barcelona in 2026?](/en/editorial/is-weed-legal).`,
      tags: ['Legal', 'Touristes', 'Espagne'],
    },
  },
  de: {
    'barcelona-vs-amsterdam-cannabis': {
      title: 'Barcelona vs. Amsterdam: zwei Stadte, zwei Systeme, zwei sehr unterschiedliche Realitaten',
      excerpt: 'Wer glaubt, dass ein Club in Barcelona wie ein Coffeeshop in Amsterdam funktioniert, startet mit der falschen Erwartung.',
      content: `## Die Ausgangsidee, die Probleme schafft

Viele Reisende kommen nach Barcelona und erwarten offentliche Listen, spontanen Zugang und ein Modell wie in Amsterdam. Genau diese Erwartung macht Fehler wahrscheinlicher.

## Wie Amsterdam funktioniert

Coffeeshops in Amsterdam sind sichtbare, offentliche Orte in einem Toleranzrahmen.

- mit Ausweis hinein
- Menu ansehen
- kaufen
- nach lokalen Regeln konsumieren

Touristen sind Teil des Modells.

## Wie das Club-Modell in Spanien funktioniert

CSC in Spanien sind private Vereine und keine offentlichen Ladenlokale.

- kein echter Walk-in
- Mitgliedschaft meist im Voraus
- kein normales Werbemodell
- Regeln unterscheiden sich je nach Club

Besucher sind nicht die Standardzielgruppe.

## Kurzvergleich

| | Amsterdam Coffeeshop | Spanien CSC |
|---|---|---|
| Direkter Zugang | Ja | Nein |
| Mitgliedschaft | Nein | Ja |
| Offentliche Sichtbarkeit | Ja | Nein |
| Tourismus-Logik | Zentral | Variabel |
| Risiko im offentlichen Raum | Geringer im Kontext | Hoch |

## Warum dieser Unterschied zahlt

Die Lucke zwischen Erwartung und Realitat ist genau der Raum, in dem Betrug und Fehlverhalten entstehen. Wer Barcelona wie Amsterdam behandelt, erhoht sein Risiko schnell.

## Was du stattdessen tun solltest

- [The Safety Kit](/en/editorial/safety-kit-visitors-spain) lesen
- [Spain's Cannabis Laws](/en/editorial/spain-cannabis-laws-tourists) lesen
- vor der Reise [the directory](/en/clubs/) nutzen`,
      tags: ['Kultur', 'Barcelona', 'Amsterdam'],
    },
    'cannabis-europa-london-2026': {
      title: 'Cannabis Europa London 2026: wo Politik und Branche zusammenkommen',
      excerpt: 'Ein praktisches Briefing dazu, warum Cannabis Europa relevant ist und wie man den Besuch sinnvoll vorbereitet.',
      content: `Cannabis Europa liegt an der Schnittstelle von Politik, Kapital, Regulierung und Unternehmensstrategie. Es ist kein Konsumenten-Event, sondern ein Ort, um die Richtung des europaischen Marktes besser zu lesen.

## Was fur ein Event das ist

Dort treffen sich vor allem Investoren, Betreiber, Berater, regulatorische Profile und Menschen, die institutionelle Signale der Branche verfolgen.

## Warum das relevant ist

Die Veranstaltung hilft bei drei praktischen Fragen:

- wohin regulatorische Signale zeigen
- welche Geschaftsmodelle glaubwurdig wirken
- wo Kapital und Compliance-Prioritaten liegen

## Wie man sich gut vorbereitet

- Sessions nach der eigenen Rolle auswahlen
- vorab festlegen, wen man treffen will
- Follow-up schon vor der Anreise planen

Am meisten bringt das Event, wenn man es wie eine Arbeitswoche behandelt.`,
      tags: ['Events', 'Cannabis Europa', 'London'],
    },
    'cannabis-social-club-history-spain': {
      title: 'Wie Cannabis Social Clubs in Spanien entstanden sind',
      excerpt: 'Eine praktische Einordnung dazu, wie private Cannabis-Vereine zum heutigen Club-Modell wurden.',
      content: `Cannabis Social Clubs in Spanien entstanden nicht als Touristenorte und auch nicht als Retail-Experimente. Ihr Ursprung liegt in privater Vereinslogik, gemeinschaftlicher Kultivierung und Konsum abseits der Strasse.

## Woher das Modell kommt

Die Grundlage liegt im Vereinsrecht und in der Unterscheidung zwischen privatem und offentlichen Verhalten. Fruhe Gruppen organisierten sich als private Kollektive statt als Laden.

Dadurch entstand eine andere Logik:

- Mitglieder statt Laufkundschaft
- Hausregeln statt offener Verkaufsservice
- Diskretion statt Sichtbarkeit

## Warum das Modell wuchs

Fur viele war der Club ein sichererer und stabilerer Rahmen als Strassenkauf. Dazu kamen Community-Normen, Harm Reduction und eine gewisse gemeinsame Verantwortung.

## Warum die rechtliche Geschichte weiter zahlt

Die Geschichte ist nicht nur kulturell, sondern auch rechtlich. Clubs bewegen sich seit Beginn in einem sensiblen Rahmen, in dem Besitz und Konsum im offentlichen Raum weiter riskant bleiben.

## Was Besucher daraus mitnehmen sollten

- das Modell wurde nicht als Coffeeshop gebaut
- Zugangskontrollen gehoren dazu
- Verhalten ausserhalb des Clubs beeinflusst die Toleranz im Umfeld

Fur die heutige Besucherperspektive lies [What Cannabis Social Clubs in Spain Actually Are](/en/editorial/what-are-cannabis-social-clubs-spain).`,
      tags: ['Kultur', 'Geschichte', 'Spanien'],
    },
    'icbc-berlin-2026': {
      title: 'ICBC Berlin 2026: Europas Cannabis-Business-Konferenz',
      excerpt: 'Ein kurzer Guide dazu, fur wen ICBC Berlin relevant ist und wie man den Besuch sinnvoll nutzt.',
      content: `ICBC Berlin ist ein business-orientiertes Event. Es ist vor allem fur Menschen relevant, die Regulierung, Marktentwicklung, Partnerschaften und operative Strategie verfolgen.

## Was dich dort erwartet

Typisch sind Betreiber, Investoren, Policy-Teams, Rechtsberater und Marktbeobachter, die die nachste Phase des europaischen Cannabis-Marktes einordnen wollen.

## Fur wen das besonders sinnvoll ist

- Betreiber mit Expansions- oder Partnerschaftsinteresse
- Regulation- und Compliance-Teams
- Investoren und Berater mit Blick auf Marktumsetzung

Wenn dein Fokus rein auf Konsumkultur liegt, ist es nicht das passende Format.

## Wie man das Event gut nutzt

- Termine fruh festmachen
- offizielle Updates verfolgen
- Sessions passend zur eigenen Rolle auswahlen

Entscheidend ist am Ende die Qualitat des Follow-up, nicht die Menge der Kontakte.`,
      tags: ['Events', 'ICBC', 'Berlin'],
    },
    'spannabis-bilbao-2026': {
      title: 'Spannabis Bilbao 2026: was du vorher wissen solltest',
      excerpt: 'Ein praktischer Guide dazu, warum Spannabis wichtig bleibt und wie man die Reise besser vorbereitet.',
      content: `Spannabis bleibt eine Referenz im europaischen Cannabis-Kalender. Wer nach Bilbao fahrt, sollte zuerst an Vorbereitung denken und erst danach an den Hype.

## Warum das Event Aufmerksamkeit bekommt

Es verbindet Markensichtbarkeit, Networking, Produktkultur und Marktsignale. Auch viele Menschen, die nicht teilnehmen, beobachten genau, was dort passiert.

## Wie man die Reise sinnvoll plant

- Transport und Unterkunft fruh buchen
- offizielle Kanale regelmassig prufen
- die Logistik des Veranstaltungsorts vorab klarziehen
- Event-Planung nicht mit lokalem Recht verwechseln

## Verhalten vor Ort

Messe-Regeln und rechtliche Realitat der Stadt sind nicht dasselbe. Eine lockere Atmosphare in der Halle macht offentliches Fehlverhalten draussen nicht sicher.

Behandle das Event zuerst als professionelles Umfeld.`,
      tags: ['Events', 'Spannabis', 'Bilbao'],
    },
    'what-are-cannabis-social-clubs-spain': {
      title: 'Was Cannabis Social Clubs in Spanien wirklich sind und warum das fur deine Reise wichtig ist',
      excerpt: 'CSC in Spanien sind weder Coffeeshops noch Dispensaries. Dieser Guide erklart, was sie wirklich sind und warum diese Unterscheidung entscheidend ist.',
      metaTitle: 'Was Cannabis Social Clubs in Spanien wirklich sind und warum das fur deine Reise wichtig ist',
      metaDescription: 'Praktischer Guide dazu, was CSC in Spanien wirklich sind, wie sie funktionieren und warum diese Logik fur Besucher entscheidend ist.',
      content: `## Die Ein-Satz-Version

Ein Cannabis Social Club ist ein privater, nicht gewinnorientierter Mitgliederverein, in dem registrierte Mitglieder Zugang und Konsum in einem geschlossenen privaten Rahmen organisieren.

Das ist alles. Kein Laden. Keine offene Vitrine. Kein Ort fur spontane Walk-ins.

## Was sie sind

CSC beruhen auf Vereinslogik. Sie sind keine offentlichen Geschafte und funktionieren nicht mit einer normalen kommerziellen Lizenz.

Mitglieder tragen das Modell uber Beitrage und Contributions im privaten Raum.

## Wie sie in der Praxis funktionieren

Jeder Club ist anders, aber einige Punkte kehren immer wieder:

**Mitgliedschaft ist Pflicht.**

**Viele Clubs verlangen Referenz oder Vorprufung.**

**Oft gibt es eine Aufnahme- oder Jahresgebuhr.**

**Die Sprache ist die von Verein und Contribution, nicht von offenem Verkauf.**

**Die sicherste Annahme ist, dass nichts hinausgetragen werden sollte.**

## Wer hineinkommt

Es gibt keine einheitliche Regel.

**Menschen mit Wohnsitz in Spanien** haben oft den leichteren Weg.

**Internationale Besucher** erleben mehr Unterschiede: Manche Clubs akzeptieren Pass und Voranfrage, andere bleiben lokal.

**Mindestalter** ist oft 18+ und in vielen Fallen 21+.

**Zeit zahlt.** Heute landen und heute noch hineinwollen klappt nicht immer.

## Was sie nicht sind

**Keine Coffeeshops.**

**Keine Dispensaries.**

**Keine frei zuganglichen Bars.**

**Nicht alle gleich** in Sicherheit, Professionalitat oder Aufnahme.

## Die rechtliche Realitat in kurz

Es gibt kein klares nationales Gesetz, das CSC eindeutig legalisiert.

**Privater Konsum im privaten Raum** wird anders behandelt als offentliche Aktivitat.

**Besitz oder Konsum in der Offentlichkeit** konnen Bussgelder auslosen.

**Die Grauzone bleibt real.**

## Warum das fur deine Reise zahlt

Das ist keine Theorie. Es ist der Unterschied zwischen einer ruhigen Erfahrung und einer Lage, die in Betrug, Bussgeld oder Sicherheitsproblemen endet.

## Was du danach lesen solltest

- [The Safety Kit](/en/editorial/safety-kit-visitors-spain)
- [Barcelona vs. Amsterdam](/en/editorial/barcelona-vs-amsterdam-cannabis)
- [Your First Time in a Barcelona Cannabis Club](/en/editorial/first-time-barcelona-cannabis-club)
- [Spain's Cannabis Laws](/en/editorial/spain-cannabis-laws-tourists)
- [the directory](/en/clubs/)`,
      tags: ['Essenzieller Guide', 'CSC', 'Spanien'],
    },
    '5-mistakes-tourists-make': {
      title: '5 Fehler, die Touristen in Barcelonas Cannabis-Clubs machen',
      excerpt: 'Die wichtigsten Benimmregeln, die den respektvollen Besucher von der sofortigen roten Flagge unterscheiden.',
      content: `Clubs in Barcelona funktionieren weder wie Bars noch wie Dispensaries oder Coffeeshops. Wer sich wie in einem Retail-Ort verhalt, fallt sofort negativ auf. Wer Privatsphare, Hausregeln oder Nachbarschaft ignoriert, riskiert den Zugang.

## Fehler 1: den Club wie einen Laden behandeln

Im Club bist du kein normaler Verkaufskunde, sondern Mitglied eines privaten Vereins.

- nicht mit Preisfragen wie im Shop anfangen
- besser nach Contribution oder Optionen fragen
- kein anspruchsvolles Service-Verhalten zeigen

## Fehler 2: das Handy fur Fotos zucken

Privatsphare ist kein nettes Extra, sondern Grundregel. Fotos vom Innenraum, Menu oder anderen Personen konnen direkt zum Rauswurf fuhren.

- Handy weg
- keine Fotos oder Videos
- nichts uber Ort oder Mitglieder posten

## Fehler 3: reden wie bei Takeaway oder Delivery

Delivery- oder Takeaway-Sprache klingt nach Retail oder Verteilung. Sicherer ist die Haltung, dass der Raum privat ist und die Regeln des Clubs gelten.

## Fehler 4: draussen laut werden

Viele Spannungen entstehen durch Nachbarschaftsbeschwerden.

- nicht vor der Tur herumstehen
- nicht direkt draussen rauchen
- Stimme in der Strasse senken

## Fehler 5: verhandeln wollen

Feilschen zeigt vor allem, dass du das Modell nicht verstehst. Wenn etwas nicht passt, lehnt man ruhig ab.

## Ein besserer Standard

- Staff und andere Mitglieder respektieren
- Regeln direkt befolgen
- von Contribution statt Preis sprechen
- Handy wegstecken
- beim Kommen und Gehen diskret bleiben

Fur den Gesamtuberblick lies [Your First Time in a Barcelona Cannabis Club](/en/editorial/first-time-barcelona-cannabis-club).`,
      tags: ['Etikette', 'Kultur', 'Tipps'],
    },
    'first-time-barcelona-cannabis-club': {
      title: 'Dein erstes Mal in einem Cannabis-Club in Barcelona: der respektvolle Weg hinein',
      excerpt: 'Ein realistischer Leitfaden fur den ersten Besuch in einem CSC in Barcelona mit besseren Erwartungen und weniger Fehlern.',
      metaDescription: 'Ein realistischer Leitfaden fur den ersten Besuch in einem CSC in Barcelona mit den richtigen Erwartungen und respektvoller Haltung.',
      content: `## Erwartungen zuerst justieren

Der erste Besuch ist kein spontaner Erledigungsgang. Er kann Zeit, Warten und etwas Geduld verlangen. Zugang ist nie garantiert.

## Schritt 1: vor dem Flug recherchieren

- Clubs finden, die internationale Besucher annehmen
- Anforderungen und Antwortzeiten prufen
- Sprachsupport bestatigen
- Alternativen bereithalten

Beginne mit [the directory](/en/clubs/).

## Schritt 2: uber verifizierte Kanale gehen

Nur offizielle oder verifizierte Wege nutzen. Keine dubiosen Nachrichten und keine Strassenpromoter.

## Schritt 3: richtig vorbereitet kommen

- gultigen Ausweis mitbringen
- Mitgliedschafts- oder Bestatigungsnachweis dabeihaben
- Bargeld nur falls der Club es verlangt

Keine zusatzlichen Gaste mitbringen, wenn es nicht klar erlaubt ist.

## Schritt 4: Ankunft ohne Drama

Es kann Wartezeit, Fragen, Regeln und Formalitaten geben. Lass den Prozess zu.

## Schritt 5: drinnen gilt Diskretion

- Handy weg
- Privatsphare respektieren
- Staff zuhoren
- nicht wie im Laden auftreten

## Schritt 6: aus einer guten Visite keinen Fehler machen

- kein offentliches Konsumieren
- keinen Standort teilen
- keine Clubdetails posten

## Haufige Fehler beim ersten Mal

- ohne bestatigte Mitgliedschaft auftauchen
- Fremden fur Zugang folgen
- Fotos machen
- Barcelona wie Amsterdam behandeln
- danach offentlich konsumieren

Vor dem ersten Versuch lies [Barcelona vs. Amsterdam](/en/editorial/barcelona-vs-amsterdam-cannabis) und [The Safety Kit](/en/editorial/safety-kit-visitors-spain).`,
      tags: ['Erstes Mal', 'Barcelona', 'Etikette'],
    },
    'edibles-safety-guide': {
      title: 'Sicherheitsleitfaden fur Edibles: Dosierung, Timing und Risiken',
      excerpt: 'Wie man vorsichtiger dosiert und den klassischen Fehler des zu fruhen Nachlegens vermeidet.',
      content: `Edibles fuhlen sich anders an als Rauchen oder Vapen. Der Effekt kommt oft spater, dauert langer und kann starker sein als erwartet.

## Warum sie Menschen uberraschen

- Wirkungseintritt zwischen 30 Minuten und 2 Stunden moglich
- Peak oft nach 2 bis 4 Stunden
- Gesamtdauer von 4 Stunden bis deutlich langer

Der Klassiker ist, zu fruh nachzulegen, weil man glaubt, es wirke noch nicht.

## Praktische Dosierungsorientierung

- 1 bis 2.5 mg: sehr leichter Start
- 5 mg: niedrige Dosis fur viele
- 10 mg: fur Anfanger schon stark
- 20 mg oder mehr: deutlich hoheres Risiko fur Angst oder Verwirrung

Wenn du deine Toleranz nicht kennst, behandle 5 mg als ernsthaften Startpunkt.

## Das Problem mit Labels

In grauen oder schwach kontrollierten Markten konnen Angaben ungenau sein. Bei unbekannter Quelle ist also mehr Vorsicht sinnvoll.

## Wenn es zu viel war

1. Nicht in Panik geraten.
2. Einen ruhigen Ort suchen.
3. Wasser trinken.
4. Alkohol und andere Substanzen meiden.
5. Wenn moglich schlafen.

Bei Brustschmerz, Atemproblemen oder medizinisch ernst wirkender Reaktion den **112** rufen.

## Grundregeln

- mit 5 mg oder weniger anfangen, wenn du wenig Erfahrung hast
- mindestens 90 Minuten warten, bevor du uber mehr nachdenkst
- nicht mit Alkohol mischen, wenn du Vorhersagbarkeit willst
- an einem sicheren Ort konsumieren
- von Kindern und Haustieren fernhalten

Fur den grosseren Sicherheitsrahmen lies [The Safety Kit](/en/editorial/safety-kit-visitors-spain).`,
      tags: ['Sicherheit', 'Edibles', 'Gesundheit'],
    },
    'emergency-resources': {
      title: 'Notfallressourcen: was tun, wenn du Hilfe brauchst',
      excerpt: 'Praktische Hinweise fur medizinische Notfalle, schlechte Reaktionen oder Polizeikontakt.',
      content: `Wenn etwas schieflauft, ist Improvisation unter Stress die schlechteste Idee. Sinnvoll ist ein einfacher Ablauf: in Sicherheit gehen, den richtigen Dienst rufen und die Lage nicht durch Panik vergrosern.

## Wenn es ein medizinischer Notfall ist

In Spanien ist **112** die allgemeine Notrufnummer.

Klare Warnzeichen:

- Brustschmerz oder starke Herzrasen
- heftige Panik, die nicht abklingt
- anhaltendes Erbrechen
- Atemprobleme
- Bewusstlosigkeit

Du kannst auch direkt in die **Urgencias** gehen.

## Wenn es eine schlechte Cannabis-Reaktion ist

1. Die Person an einen ruhigen Ort bringen.
2. Wasser geben.
3. Reize reduzieren.
4. Keinen Alkohol oder weitere Substanzen hinzufugen.
5. Bei ernster Lage auf **112** gehen.

## Wenn die Polizei dich kontrolliert

1. Ruhig bleiben.
2. Ausweis zeigen, wenn verlangt.
3. Nicht mehr erklaren als notig.
4. Alle Unterlagen behalten.
5. Nichts unterschreiben, was du nicht verstehst.

## Was niemals hilft

- Bestechung versuchen
- weglaufen
- aus einem Stopp eine Konfrontation machen
- einer angeblichen Barstrafe in der Strasse glauben

## Nutzliche Ressourcen

Energy Control Barcelona ist eine bekannte Harm-Reduction-Anlaufstelle.

- C/ de l'Aurora, 27, 08001 Barcelona
- offizielle Zeiten prufen
- Informationen und Unterstutzung zur Risikoreduktion

Eine 24h-Apotheke kann bei kleineren Problemen ebenfalls helfen.

## Botschaften

- USA: +34 91 587 2200
- Vereinigtes Konigreich: +34 91 714 6300
- Kanada: +34 91 382 8400
- Australien: +34 91 353 6600

Die Botschaft kann orientieren, aber keine spanischen Sanktionen aufheben.`,
      tags: ['Sicherheit', 'Notfall', 'Ressourcen'],
    },
    'safety-kit-visitors-spain': {
      title: 'The Safety Kit: was jeder Besucher wissen sollte, bevor er einen Club betritt',
      excerpt: 'Ein praktischer Sicherheitsleitfaden zu Betrug, rechtlichen Grenzen, Privatsphare und risikoarmerem Verhalten.',
      metaDescription: 'Praktischer Sicherheitsleitfaden fur Club-Besucher in Spanien: Betrug, rechtliche Grenzen, Privatsphare und konkrete Schritte zur Risikoreduktion.',
      content: `## Warum dieser Guide existiert

Es gibt wenig klare offentliche Information. Diese Lucke wird mit alten Tipps, falschen Erwartungen und Betrug gefullt. Der Guide soll Besucher schwerer angreifbar machen.

## Bevor du das Hotel verlasst

- Clubs vorher recherchieren
- prufen, ob Besucher akzeptiert werden
- richtige Ausweisdokumente klarmachen
- Details offline speichern

Das [directory](/en/clubs/) ist der beste Startpunkt.

## Der Weg zum Club

Die wichtigste Regel ist einfach: Lass keinen Fremden deinen Plan umschreiben.

- keinen Promotern folgen
- Flyer nicht als Beweis nehmen
- mit eigener Karte und verifizierter Adresse gehen

## An der Tur

- klar sagen, wer du bist
- Mitgliedschaft oder Voranfrage nennen
- Ausweis bereithalten
- Wartezeit oder Ablehnung ruhig akzeptieren

## Im Club

- Handy weg
- keine Fotos oder Videos
- Privatsphare respektieren
- Hausregeln befolgen

## Rote Linien

- nichts mit hinausnehmen, wenn du das Risiko nicht verstehst
- nicht offentlich konsumieren
- Mitgliedschaft nicht teilen
- Clubdetails nicht online posten

## Warnzeichen, bei denen du gehst

- kein echter Aufnahmeprozess
- keine Mitgliedsdokumentation
- Geldforderung vor jeder Erklarung
- unklarer oder improvisierter Ort
- jemand sagt, Regeln seien egal

## Wenn etwas schieflauft

- gehen, wenn der Ort unsicher wirkt
- nicht in der Strasse diskutieren
- bei echter Notlage **112** rufen
- misstrauisch bei jeder sofortigen Cash-Forderung sein

Fur konkrete Hilfe lies [Emergency Resources](/en/editorial/emergency-resources).

## Kurze Checkliste

Vorher:

- Club verifiziert
- Anfrage oder Mitgliedschaft bestatigt
- Ausweis bereit
- Details offline gespeichert

Drinnen:

- Handy weg
- keine Fotos
- volle Beachtung der Regeln

Danach:

- kein offentliches Konsumieren
- keinen Standort teilen
- keine Clubdetails in sozialen Medien`,
      tags: ['Sicherheit', 'Besucher', 'Checkliste'],
    },
    'is-weed-legal': {
      title: 'Ist Weed in Barcelona 2026 legal? Reale Regeln, Bussgelder und Grauzonen',
      excerpt: 'Barcelona ist nicht Amsterdam. Wer private Toleranz mit offentlicher Freiheit verwechselt, erhoht sein Risiko unnötig.',
      content: `Nein, Weed ist in Barcelona nicht einfach "legal". Die brauchbare Erklarung lautet: Privates Verhalten und offentliches Verhalten werden unterschiedlich behandelt, und genau dort machen Besucher ihre Fehler.

## Die zentrale Regel: Offentlich und privat sind nicht dasselbe

Spanien hat kein offentliches legales Cannabis-Retail-System. Man kann nicht in einen lizenzierten Shop gehen, offen kaufen und dann konsumieren, wo man will.

## Offentlicher Raum bedeutet echtes Risiko

Auf Strassen, an Stranden, in Parks oder im Auto konnen Besitz und Konsum zu Verwaltungsstrafen fuhren.

- Bussgelder konnen bei **EUR601** beginnen
- meist geht es um Verwaltungssanktionen, nicht um Strafrecht
- die Polizei hat grossen Handlungsspielraum

## Toleranz ist an privaten Raum gekoppelt

Konsum in wirklich privatem Raum wird anders behandelt. Darauf stutzt sich ein Teil der Club-Logik.

Das heisst nicht, dass alles klar legal ist. Es heisst, dass das Modell in einer Grauzone lebt.

## Was ein Cannabis Social Club ist

Ein CSC ist ein privater, nicht gewinnorientierter Verein. Kein offentliches Schaufenster, keine Dispensary und keine Touristenattraktion.

Praktisch bedeutet das:

- Mitgliedschaft zahlt
- Zugang ist kontrolliert
- die Sprache ist die von Verein und Contribution, nicht von offenem Verkauf
- je offentlicher sich ein Club verhalt, desto grosser wird sein Risiko

## Wo Touristen falsch abbiegen

- Promotern folgen
- "legal weed here" glauben
- den Club wie ein offentliches Geschaft behandeln
- nach dem Besuch offentlich tragen oder konsumieren

## Ein sinnvoller Sicherheitsstandard

- nicht offentlich konsumieren oder zeigen
- nichts bei Strassendealern oder Promotern kaufen
- nur verifizierbare Kanale nutzen
- Ausweis und Mitgliedsdetails geordnet halten
- jeden Besuch maximal diskret behandeln

Fur den grosseren Kontext lies [Spain's Cannabis Laws for Tourists](/en/editorial/spain-cannabis-laws-tourists) und [Barcelona Cannabis Scams](/en/editorial/scams-red-flags).`,
      tags: ['Recht', 'Bussgelder', 'Polizei', 'Touristen-Guide'],
    },
    'scams-red-flags': {
      title: 'Cannabis-Betrug in Barcelona: DMs, Promoter und Warnzeichen',
      excerpt: 'Wie du falsche Angebote erkennst und dich vor den haufigsten Touristenfallen schutzt.',
      content: `Die meisten unaufgeforderten Angebote sind keine Abkurzungen, sondern Fallen. Wenn dich jemand zuerst kontaktiert, einfachen Zugang verspricht, Vorkasse will oder von Delivery spricht, solltest du von Risiko ausgehen.

## Die DM-Masche

Das Muster ist einfach:

1. zuerst sollst du zahlen
2. dann wird eine Adresse oder ein Kontakt versprochen
3. am Ende verschwindet die Person oder schickt dich ins Leere

Seriose Clubs arbeiten nicht mit zufalligen Mittelsmanner in privaten Nachrichten.

## Der Strassenpromoter

Wenn dich jemand in einer Touristenzone umlenken will, ist das selbst schon das Signal.

- fake Orte
- uberteuerte Forderungen
- fragwurdige Produkte
- Diebstahl oder Einschuchterung

## Das Telegram- oder WhatsApp-Menu

Wenn Menus, Hotel-Lieferung oder offentliche Treffpunkte uber Messenger angeboten werden, ist das kein vertrauenswurdiger Club-Prozess.

Typische Folgen:

- Vorkasse-Betrug
- Strassenubergabe
- unbekannte oder gefalschte Produkte

## Wie du Fakes schnell erkennst

- sie haben dich zuerst kontaktiert
- sie wollen Geld vor dem Ort
- sie benutzen Telegram oder WhatsApp als Bestellsystem
- sie klingen wie ein Restaurant, nicht wie ein Verein
- sie schlagen Delivery oder offentliche Treffpunkte vor
- sie sitzen in besonders touristischen Zonen

## Die sichere Alternative

1. Offizielle Websites oder bekannte Kanale nutzen.
2. Prufen, ob der Ablauf nach privatem Verein und nicht nach Lieferung klingt.
3. Nur zu Orten gehen, die du selbst verifizieren kannst.

Wenn du betrogen wirst, melde es. Cannabis mag in einer Grauzone liegen. Betrug nicht.`,
      tags: ['Betrug', 'Sicherheit', 'Warnzeichen'],
    },
    'spain-cannabis-laws-tourists': {
      title: 'Cannabis-Gesetze in Spanien: was Touristen wirklich wissen mussen',
      excerpt: 'Eine praktische Einordnung von privater Toleranz, offentlichen Bussgeldern und der anhaltenden Grauzone der CSC.',
      content: `Spanien hat kein offentliches legales Cannabis-Retail-System fur Touristen. Das ist der erste Punkt und verandert jede Vergleichsbasis mit offenen Markten.

## Kurzfassung

Besitz und Konsum im offentlichen Raum konnen zu Verwaltungssanktionen fuhren. Privater Raum wird anders behandelt, aber das schafft keine grenzenlose Freiheit. Es schafft eine Grauzone mit realen Grenzen.

## Offentlich versus privat

Die wichtigste rechtliche Unterscheidung ist der Ort des Verhaltens.

Im offentlichen Raum ist das Risiko deutlich hoher. Im privaten Raum ist die historische Behandlung anders, weshalb Diskretion und kontrollierter Zugang so wichtig sind.

## Wo Clubs hineinpassen

CSC sind keine offenen Retail-Geschafte. Sie funktionieren uber private Vereinslogik, und genau deshalb bestehen sie auf Mitgliedschaft, Hausregeln und begrenztem Zugang.

Wenn ein Ort wie eine offentliche Dispensary wirkt, ist das eher ein Warnsignal.

## Die praktische Regel fur Besucher

Verlass dich nicht auf Geruchte und nicht auf Geschichten anderer Touristen.

- offentlichen Konsum vermeiden
- offentlichen Besitz so weit moglich vermeiden
- Promoter, Delivery und Strassentreffen vermeiden
- jeden Club als privaten Ort mit eigenen Regeln behandeln

Fur die Barcelona-spezifische Version lies [Is Weed Legal in Barcelona in 2026?](/en/editorial/is-weed-legal).`,
      tags: ['Recht', 'Touristen', 'Spanien'],
    },
  },
};
