# Plan de contenidos Chapka (11 nov 2026)

Datos: DataForSEO Labs (Google España, español) + datos oficiales de chapkadirect.es (`docs/chapka-datos-oficiales.md`).
Crudos en `seo/dataforseo/chapka/` (keywords, adjacent, ranked, serp_competitors). Coste total del análisis: ≈ 1 USD.

## 1. Diagnóstico

**Demanda de marca (España, mensual):**

| Grupo | Volumen | KD | CPC |
|---|---|---|---|
| `chapka` (navegacional, mezcla con el gorro «chapka») | 2.400 | 17 | 0,9 € |
| `chapka seguros` / `chapka seguro` | 1.300 | 0 | 0,65 € |
| `chapka seguro(s) de viaje` | 480 | 0 | 0,9 € |
| `seguro(s) chapka` | 320 | 0 | 0,9 € |
| **Descuento** (`codigo descuento chapka` 260, `descuento chapka` 260, `chapka descuento` 210, + variantes) | ≈ 800 | 0 | 1,3 € |
| **Opiniones / fiable** (`chapka seguros opiniones` 140, `seguro chapka opiniones` 70, `chapka opiniones` 50…) | ≈ 350 | 0 | 1,4 € |
| **Cap Trip Plus** (`chapka cap trip plus` 140, `cap trip plus` 30, `chapka cap trip` 30) | ≈ 200 | 13 | 3 € |
| `chapka cap student` | 70 | – | 7,8 € |
| `chapka working holiday` / `chapka whv` | 20 + 20 | – | 7 € |
| `chapka telefono`, `chapka reclamar`, `cap trotamundos`, `chapka o iati` | 10-20 c/u | – | – |

Conclusiones:
- Es una marca de tamaño medio: ≈ 5.000-6.000 búsquedas/mes con solapes. **No es un nicho enorme**; el valor está en capturar casi todo el top-10 de marca (KD 0) y en los temas de producto con CPC alto (3-8 €, señal de que monetiza).
- **Las comparativas no generan búsquedas**: `heymondo vs chapka`, `iati vs chapka`, `chapka vs intermundial` tienen volumen 0-10. Valen como página de conversión (lector ya decidido entre dos), no para tráfico.
- Todas las SERP de marca llevan **AI Overview** y «La gente también pregunta». Las preguntas repetidas: «¿Qué tal es el seguro Chapka?», «¿Cuál es el teléfono de Chapka?», «¿Qué es mejor, Chapka o Heymondo?», «¿Qué cubre Cap Trip Plus?», «¿Qué seguro es mejor, Chapka o IATI?».
- **Hoy no rankeáis con ninguna URL para ninguna keyword de Chapka** (ni siquiera con las 3 comparativas). El dominio rankea solo 3 keywords con «seguro» en total (consistente con el bloqueo de Googlebot por Cloudflare ya corregido; remedir en dic).

**Quién ocupa la SERP (Labs `serp_competitors` + `ranked_keywords`):** chapkadirect.es (pos 1), planet-nomad.com, viajaresdescubrir.com, comiviajeros.com, losviajesdedomi.com, conmochila.com, soyunblogdeviajes.com, viajeros30.com, isic.es, roams.es, Trustpilot. Todos juegan con **1-2 URLs**: una de «opiniones» y una de «descuento (código)». Las páginas de descuento posicionan también el término de marca general (p. ej. conmochila `/descuento-chapka-seguros` pos 3 para `chapka seguros`). Son blogs de viajes pequeños: la barrera es baja.
La oficial tiene landing propia de código descuento (`chapkadirect.es/index.php?action=lp-codigo-descuento`), así que el tema «código» existe oficialmente; hay que verificar qué ofrece exactamente antes de prometer nada.

> Nota técnica: el SERP en vivo de DataForSEO devuelve enlaces `google.com/goto?…` (dominio oculto) en todos los modos; por eso los competidores salen de Labs, no del SERP.

## 2. Mapa anti-canibalización: una URL por intención

Regla: **cada keyword (y sus variantes seguro/seguros, orden, tildes) pertenece a una sola URL**. Las demás páginas enlazan con ancla descriptiva pero no ponen esa keyword en `title`, H1 ni H2.

| URL | Intención y keywords que posee | Notas |
|---|---|---|
| **`/chapka-opiniones`** (nueva, **hub de marca**) | `chapka`, `chapka seguros`, `chapka seguro`, `chapka seguro de viaje`, `seguro chapka`, `seguros chapka`, `chapka opiniones`, `chapka es fiable`, «qué tal es el seguro Chapka» | Reseña completa con casos propios si los hay, tabla de los 10 productos con enlace de afiliado, para quién sí / no, FAQ de PAA. Slug coherente con `heymondo-opiniones` / `intermundial-opiniones` |
| **`/descuento-chapka`** (nueva) | `descuento chapka`, `codigo descuento chapka`, `chapka descuento`, `cupon chapka` | Transaccional. Mismo patrón que `descuento-iati` / `descuento-heymondo`. Solo dato verificado (ver §5) |
| **`/chapka-cap-trip`** (nueva) | `chapka cap trip plus`, `cap trip plus`, `cap trip`, «qué cubre Chapka», Basic vs Plus, deportes, cancelación opcional | Producto estrella para viajes < 90 días |
| **`/chapka-cap-trotamundos`** (nueva) | `cap trotamundos`, `chapka larga estancia`, vuelta al mundo con Chapka | Enlaza a `/como-vivir-viajando-por-el-mundo`. Volumen bajo pero encaja con el ADN del blog (vuelta al mundo) |
| **`/chapka-telefono-contacto`** (nueva, corta) | `chapka telefono`, `chapka reclamar`, `chapka contacto`, cómo abrir un siniestro | Replica `iati-telefono-contacto`. Las PAA de teléfono aparecen en 4 SERP |
| `/seguro-de-cancelacion-de-viaje` (nueva, **genérica**) | `seguro cancelacion viaje` (1.600, KD 11), `seguro de cancelacion de viaje` (880), `por cualquier motivo/causa` (≈ 800), `seguro anulacion viaje` (480) | **No es solo Chapka**: guía comparada IATI / Heymondo / Intermundial / Chapka. Chapka (Cap Cancelación, 41 causas, contratable hasta 7 días antes de salir) entra como opción. Sin página propia de Cap Cancelación (volumen nulo). Enlaza a `iati-anulacion-premium`, `seguro-cancelacion-heymondo`, `intermundial-go-cancellation` |
| `/seguro-de-viaje-enfermedad-preexistente` (nueva) | `seguro viaje enfermedad preexistente` (≈ 230 en total, CPC 3,7-6) | Chapka Trip Plus: 10.000 € por agravamiento imprevisto; Trotamundos completo: 50.000 €. Hay que comparar con las otras 3 aseguradoras con datos oficiales |
| `/chapka-vs-intermundial`, `/heymondo-vs-chapka`, `/iati-vs-chapka` (existen) | `X vs Chapka`, «cuál elegir» | No tocar `title`/H1; **añadir botones de afiliado** y corregir datos (§4) |
| `/mejor-seguro-de-viaje` (pilar) | Genérico «mejor seguro de viaje» | Mantener; enlazar a las nuevas páginas |

**Opcionales (valorar después de medir la primera oleada):**
- `/chapka-cap-student` o `seguro erasmus` (320 + 70…, CPC 3,5-7,8): ya existe `intermundial-go-study`; solo hacerlo si encaja en vuestra audiencia, y como guía genérica, no repetir.
- `/seguro-working-holiday`: la demanda es sobre el visado, no el seguro (`seguro working holiday` = 20). Solo si lo escribís por experiencia propia.
- `/seguro-de-viaje-schengen` (≈ 1.900 sumando variantes, KD 3-8, CPC 3,8-4, el único tema grande y barato): **ojo con el encaje**: Cap Schengen / Cap Europa son para quien **reside fuera del espacio Schengen**; vuestros lectores residen en España y no lo necesitan. Es público latinoamericano. Decisión editorial vuestra.
- `seguro viaje japon` (480, KD 1) y `eeuu` (260, CPC 5): existe `seguro-de-viaje-eeuu-iati`. No crear genéricas de destino que lo canibalicen; en todo caso un post de destino aparte que enlace al IATI y a Chapka Trip Plus (5.000.000 € en EE. UU./Canadá según ficha).

## 2b. E-E-A-T sin experiencia propia (condición de todo el plan)

Sergi y Cris **no han contratado ni usado Chapka** y acaban de empezar la afiliación. Regla: **ninguna página simula experiencia propia** (ni «lo contratamos», ni casos, ni «nuestra experiencia»). Se compensa con:

1. **Transparencia explícita arriba:** «Aún no hemos usado Chapka en un viaje. Esto es un análisis de sus condiciones oficiales y de lo que cuentan usuarios reales; somos afiliados» + fecha de la revisión.
2. **Verificación documental como valor:** cifras sacadas de las condiciones generales / IPID con enlace a la fuente y fecha de consulta, tablas por producto, y lo que **no** cubre. Eso es lo que el 90 % de competidores no hace (muchos copian la ficha).
3. **Valoraciones públicas citadas con fuente y fecha**, nunca inventadas: Trustpilot 4,5/5 con 1.094 opiniones (consulta 9-11 nov 2026) y, si se quiere, extractos reales de reseñas negativas y positivas.
4. **Viajeros conocidos que usan Chapka:** solo con su permiso, con su nombre y cita textual (o entrevista corta), enlazando a su perfil. Preguntarles: producto contratado, destino, si hubo siniestro y cómo respondió asistencia. Una sola cita real vale más que cualquier párrafo nuestro.
5. **Experiencia que sí tenemos y es transferible:** viajes largos, vuelta al mundo y camper (para Trotamundos), Cris hipoacusia (solo comparar vías de contacto de asistencia: teléfono vs. chat/WhatsApp/app; sin opinar de accesibilidad sin datos), y las comparativas ya escritas.
6. **Prueba propia a corto plazo (opcional, ahorra 100 %):** simular presupuesto real de Cap Trip y Trotamundos con fechas y destinos de vuestro próximo viaje y publicar los precios con captura y fecha. Eso es dato de primera mano legítimo. Llamar al servicio de atención con una duda concreta y contar qué respondieron (horario, idioma, tiempo de espera) también lo es.
7. **Títulos honestos:** `/chapka-opiniones` → title tipo «Chapka seguros: qué cubre y qué opinan los usuarios (2026)». No prometer «probado por nosotros».
8. Con este enfoque, **las páginas de producto y de cancelación/preexistencias (análisis comparativo documentado) tienen más sentido editorial que la reseña**; la reseña de marca se publica igualmente porque es donde está la demanda, pero con las reglas anteriores.

## 3. Orden de publicación (por retorno)

1. **Oleada 1 (esta semana):** `/descuento-chapka` + `/chapka-opiniones` + botones de afiliado en las 3 comparativas y el pilar. KD 0 y ≈ 1.100-1.200 búsquedas de intención de compra directa.
2. **Oleada 2:** `/chapka-cap-trip`, `/chapka-telefono-contacto`, `/seguro-de-cancelacion-de-viaje` (el de más demanda: ≈ 4.800 de volumen con KD 11 en el clúster).
3. **Oleada 3:** `/chapka-cap-trotamundos`, `/seguro-de-viaje-enfermedad-preexistente`, opcionales.

Cada pieza (`mdx` en `src/data/post/`, `category: Seguros de viaje`, sin canonical, `metadata.title` ≤ 62, FAQPage en el frontmatter) debe llevar: enlace al pilar (automático), 2 enlaces laterales descriptivos y 1 puente comercial en contexto (CLAUDE.md).

**Enlazado interno (sin canibalizar):** `/chapka-opiniones` recibe los enlaces con ancla «opiniones de Chapka» desde las 3 comparativas y el pilar; `/descuento-chapka` recibe «descuento Chapka» solo desde opiniones y desde el botón de afiliado. Las páginas de producto enlazan hacia `/chapka-opiniones` (nunca al revés con el mismo ancla).

## 4. Correcciones obligatorias en lo ya publicado (de `docs/chapka-datos-oficiales.md`)

Hay afirmaciones del blog que **no coinciden con la web oficial**:

| Dónde | Afirmación | Dato oficial |
|---|---|---|
| Comparativas + pilar FAQ | «Chapka cubre hasta 10.000 € de preexistentes» (en general) | 10.000 € solo en Cap Trip Plus y Multi-Trip; **50.000 € en Trotamundos completo, WH y Student** |
| Comparativas + pilar | «Cap Trotamundos 2.000.000 € sin franquicia» | Solo modalidad Completa en Mundo y EE. UU./Canadá; Europa 1.000.000 € (PDF 958); Basic 500.000 € con **100 € de franquicia** |
| Pilar | «Hasta 2.500.000 €» | No aparece en ninguna fuente; el máximo oficial es 5.000.000 € |
| `chapka-vs-intermundial` | «Cap Cancelación se contrata incluso meses después» | Se contrata hasta 7 días antes de salir; carencia de 5 días si pasan más de 24 h desde la reserva |
| Comparativas | «Hasta 10 días de carencia en destino» | 10 días en Trotamundos/WH/Student; 24 h en Tempo Expat; **Cap Trip y Multi-Trip no permiten contratar ya en destino** |
| `chapka-vs-intermundial` | «Chapka depende de WiFi» (sin eSIM) | La web anuncia una **eSIM de regalo** con el seguro (condiciones sin leer) |
| Comparativas | «Pensado para cumplir los visados de Australia o Canadá» | Las fichas no lo declaran; NO VERIFICADO |

Antes de publicar cifras cerradas, reconfirmar a mano en chapkadirect.es: la lectura automática de las fichas puede equivocarse, y de 8 de los 10 productos solo hay ficha web, no PDF de condiciones.

## 5. Datos que faltan / puntos a validar

- **Descuento 7 %:** viene del banner de vuestro panel de afiliado (`chapka/990.png`), pero la web pública no lo muestra. Confirmar en el panel (a) si se aplica solo vía enlace, (b) a qué productos, (c) hasta cuándo. Sin esto no se pone en `title`.
- **Tracking por post:** los enlaces llevan `app=sinbarreras`. Mirar en «Enlaces trackeados» si se puede añadir un subid por artículo (el consejo de Chapka es medir qué artículo convierte). Mientras tanto, igual para todos.
- **eSIM de regalo:** leer las condiciones oficiales.
- **Teléfono, horarios y vía de reclamación oficiales** para la página de contacto.
- Consejos de Chapka (panel): enlaces en los artículos que mejor posicionan y en los primeros 2/3 del texto, enlace destacado (negrita/color), banners horizontales en el cuerpo y verticales en lateral, contenido específico por tipo de viaje, experiencias reales y cifras (p. ej. costes médicos), widget «¿Qué seguro necesito?». Aplicado en este plan.

## 6. Medición

- Remedir en Search Console / DataForSEO hacia el **9-23 dic** (tras la corrección de Googlebot): posición de `chapka seguros`, `descuento chapka`, `chapka opiniones`.
- Re-lanzar `python scripts/dataforseo_chapka.py keywords` en 6-8 semanas para ver nuevas búsquedas.

## 7. Estado (11 nov 2026)

**Hecho (oleada 1):** `/descuento-chapka` y `/chapka-opiniones` (portadas con `scripts/portada-chapka.mjs`, widget «¿Qué seguro necesito?» como iframe sin JS de terceros), botones de afiliado en `chapka-vs-intermundial`, `heymondo-vs-chapka`, `iati-vs-chapka` y enlaces en el pilar; 7 correcciones de datos (ver §4) y retirada de la «experiencia propia» con Chapka en `iati-vs-chapka`. Build OK (674 páginas).

**Competencia «descuento chapka»:** la oficial (`lp-codigo-descuento`) es 1.ª; conmochila (actualizada 8 nov) dice «7 % habitual, hasta 15 % en campañas» y es probable origen de nuestra cifra errónea «Cap Trip hasta 2.500.000 €» (su tabla). viajaresdescubrir, vanporelmundo y sincodigopostal bloquean lectores automáticos y navegador (verificación anti-bot): sin analizar.

**Pendiente:** confirmar con Chapka si hay campañas por encima del 7 % (el usuario preguntará); decidir si Chapka entra en `afiliados.ts` (la barra móvil pinta un botón por seguro: con 4 queda apretada); páginas de la oleada 2 (`/chapka-cap-trip`, `/chapka-telefono-contacto`, `/seguro-de-cancelacion-de-viaje`) y de la 3; Schengen se mantiene como opcional (no descartado) con el aviso de que Cap Schengen/Europa son para residentes fuera de Schengen.

**Actualización (11 nov 2026, tarde):** hecha también la oleada 2: `/chapka-cap-trip`, `/chapka-telefono-contacto` y `/seguro-de-cancelacion-de-viaje` (guía genérica de 4 aseguradoras; posee «seguro cancelación viaje» y «por cualquier causa/motivo»). Chapka entra en `src/data/afiliados.ts` (barra lateral sí; barra móvil no, vía `mobile: false`). Datos de asistencia y reembolsos sacados de los PDF 956, 958 y 959 (teléfono +34 91 390 73 43 a cobro revertido / app, portal siniestros.imaiberica.es, plazo de 40 días en Cap Cancelación). Verificado: enlaces internos sin roturas, H1 único, FAQPage, `sponsored` en todos los enlaces de afiliado.
**Siguiente (oleada 3):** `/chapka-cap-trotamundos`, `/seguro-de-viaje-enfermedad-preexistente`, y opcionales (Schengen, Working Holiday/Erasmus). Las tres campañas «>7 %» esperan respuesta de Chapka.

**Oleada 3 (11 nov 2026):** hechas `/chapka-cap-trotamundos` (Basic vs Completa, deportes incluidos/excluidos, franquicia kilométrica de 35 km, ampliaciones, comparativa de larga duración) y `/seguro-de-viaje-enfermedad-preexistente` (Chapka, IATI, Heymondo e Intermundial; «agravamiento imprevisto» vs «urgencia vital»). Enlazado interno desde opiniones, Cap Trip, descuento y cancelación. Añadido a `/chapka-telefono-contacto` el número de reembolsos (+34 91 39 07 344, cláusula 7 de Cap Trotamundos) y «otro medio que deje constancia».
**Hallazgo de verificación:** la carencia de 10 días al contratar ya en el extranjero consta en la ficha web de Trotamundos y Working Holiday, no en el PDF (donde los 10 días son para renovar tras vencer, y la cláusula 2 impide fecha de efecto posterior a la salida). Las páginas lo indican y piden confirmarlo con Chapka.
**Pendiente opcional:** `/seguro-de-viaje-schengen` (Cap Schengen/Europa; público no residente en Schengen), Working Holiday/Erasmus, y seguro de camper Zalba-Caldú (producto distinto, sin enlace trackeado).

**Schengen (11 nov 2026):** hecha `/seguro-de-viaje-schengen` (Cap Schengen y Cap Europa; requisitos de la embajada de Alemania en Ecuador; precios de ficha). **Hallazgo clave:** esa embajada «no acepta seguros con franquicia» y Cap Schengen/Europa tienen 80 € de franquicia por persona, aunque Chapka dice que su certificado lo aceptan todos los consulados: la página lo explica y pide confirmar con el consulado. Respuesta oficial de Chapka sobre reembolso si deniegan el visado: no disponible en el HTML (no se afirma nada). No se analiza AXA Schengen ni otras aseguradoras Schengen.
**Quedan:** Working Holiday / Erasmus (demanda baja) y camper Zalba-Caldú (sin enlace trackeado).
