# Auditoría Heymondo · Oleada 1 (documentación oficial completa)

_7 de octubre de 2026. Base: `heymondo.es/` (261 páginas oficiales en markdown, `pages.jsonl`, `pages.csv`, `all.md`) contrastada con las 15 piezas propias sobre Heymondo (~38.000 palabras), el pilar `/mejor-seguro-de-viaje` y las menciones en otros ~100 posts. Sustituye al análisis del plan anterior (`plan-contenidos-heymondo.md`), que se hizo con solo 26 páginas._

## 1. Qué es el corpus oficial y qué límites tiene

| Bloque | Páginas | Utilidad |
|---|---|---|
| Legales (condiciones, información previa, desistimiento, advertencias, accesibilidad, privacidad, cookies, transparencia) | ~12 | Muy alta: son los únicos textos contractuales. |
| Producto (anual, larga estancia, temporal, cancelación, familiar, grupos, Salas VIP, AirHelp, app, descuentos, opiniones, contacto) | ~20 | Alta, pero **recortada**: tablas y acordeones llegaron vacíos. |
| Páginas de país `/seguro-de-viaje/<país>` | ~120 | Plantilla casi idéntica (330–500 palabras). Útil por el consejo oficial (Exteriores, pago por adelantado, visados). |
| Blog oficial `/blog/*` | ~105 | Mezcla de guías de destino y de seguros. Contiene **cifras antiguas**. |

**Cuatro cautelas antes de citar nada:**

1. **Es marketing de la propia marca.** Dato oficial ≠ dato neutral. Siempre «según Heymondo» y con nuestra experiencia separada.
2. **Sin fecha.** Los blogs mezclan épocas: uno habla de «hasta 10 millones» de gastos médicos, otro de «ilimitados»; el anual aparece «por 304 €» en un título y a 315,06 € en otra página.
3. **Recortes del rastreo.** Faltan las 47 causas completas de cancelación, la tabla de AirHelp y las tarifas por plan. Para esos datos seguimos dependiendo de nuestras simulaciones y de nuestra póliza.
4. **Errores en origen.** `/seguro-de-viaje/eslovenia/` contiene el texto de **Argentina** (título, H1 y FAQ). No usarla como fuente.

## 2. Ficha de datos oficiales (lo que sí podemos afirmar)

| Dato | Valor oficial | Fuente (heymondo.es) |
|---|---|---|
| Quién es | Marca comercial de SMART INSURANCE CORREDURÍA DE SEGUROS, S.L.; NIF B66843798; DGSFP clave J-3422; Barcelona | `/informacion-previa-contratacion` |
| Remuneración | Comisión pagada por la aseguradora; sin participaciones cruzadas con aseguradoras | ídem |
| Desistimiento | 14 días naturales; **no aplica a seguros de viaje de menos de un mes** ni con siniestro cubierto; reembolso ≤30 días | `/condiciones-contratacion` (modif. 15/04/2026) |
| Garantía comercial | 100% si el viaje no ha empezado y se pide ≤1 mes tras la compra | `/blog/preguntas-frecuentes-seguro-de-viaje` |
| Mediación | Adherida a Confianza Online | `/condiciones-contratacion` |
| Queja → DGSFP | SAC resuelve en 1 mes; luego Servicio de Reclamaciones DGSFP | `/informacion-previa-contratacion` |
| Pago | Visa, Mastercard, American Express; seguros exentos de IVA; edad mínima 18 | `/condiciones-contratacion` |
| Cancelación | «Hasta 47 causas», hasta 6.000 €/viajero, **contratable en cualquier momento**, carencia 72 h; cruceros incluidos en Premium | `/seguro-cancelacion-viaje`, `/blog/iati-vs-heymondo` |
| Anual multiviaje | Viajes de hasta 90 días cada uno; cobertura mundial siempre | `/opiniones`, `/blog/iati-vs-heymondo` |
| Larga estancia | Se contrata por 90 días y se renueva | `/opiniones` |
| Salas VIP | Opcional; retraso ≥2 h 30; sala o 50 €; temporales, origen España, <32 días; contratar ≥72 h antes y registrar vuelos ≥24 h antes | `/salas-vip` |
| AirHelp Plus | Temporales con origen España y <30 días + anual Premium; hasta 600 €; **no** aplica descuento | `/reclamacion-vuelos`, `/descuentos` |
| Descuentos automáticos | Familia 15% (≥3 convivientes, alguno <22); grupo 5% (≥5) y 15% (≥10); cancelación grupo +10% (≥5); franquicia 100 € = 15%; **acumulables, hasta 30%** | `/descuentos`, `/seguro-de-viaje/familiar|grupos` |
| Black Friday 2025 | 18 nov–1 dic; **10%** de campaña; **máximo acumulado 40%** | `/blog/codigo-descuento-black-friday` |
| Contacto | Asistencia 24/7 (app o teléfono de la póliza); comercial: WhatsApp **solo texto** +34 600 404 606, chat, L–V 9–18 h | `/contacto-heymondo` |
| Reputación (autodeclarada) | Trustpilot 4,5–4,6 (10.000–13.000 opiniones); App Store 4,5 (470); Google Play 4 (591) | blogs oficiales |
| Accesibilidad web | Parcialmente conforme WCAG 2.1 AA; próxima revisión 31/12/2026 | `/declaracion-de-accesibilidad` |
| Deportes | Lista por defecto (trekking <3.000 m, snorkel, kayak…) y ampliación (rafting, buceo <20 m, trekking ≤5.000 m…) | `/seguro-viaje-anual`, `/seguro-de-viaje-temporal` |
| Afiliados | Cookie de 30 días; enlaces únicos hacia la web oficial | `/programa-de-afiliados`, `/advertencias` |

## 3. Discrepancias entre lo oficial y lo nuestro

### 3.1 Corregidas en esta oleada

| # | Pieza | Error | Corrección |
|---|---|---|---|
| 1 | `heymondo-vs-chapka` | Decía que Heymondo exige contratar la cancelación en los 7 días posteriores y que «Chapka es la única opción viable» si compraste hace tiempo. Cambiaba el veredicto de la sección. | Cancelación contratable en cualquier momento (carencia 72 h). Veredicto: «Heymondo, por poco» (72 h frente a 5 días). Carencia si ya estás de viaje: 72 h (antes «suele ser más corta»). |
| 2 | `seguro-cancelacion-heymondo` | Contradecía a `descuento-heymondo` y a la web: hablaba de «idealmente 7 días» y de una opción Premium sin restricción. | Reescrito: sin límite de días, carencia 72 h si no es el mismo día, sin recargo desde julio de 2026. |
| 3 | `heymondo-o-iati` | «Salas VIP / AirHelp solo hasta 31 días». | Salas VIP <32 días y AirHelp <30 días, origen España, con nota sobre nuestra simulación de 31 días. |
| 4 | `heymondo-vs-intermundial`, `heymondo-vs-chapka`, pilar `mejor-seguro-de-viaje` | Salas VIP presentadas como «te regala» y «diferencial brutal en viajes largos». Es opcional, de pago y solo <32 días. | Matizado en 9 pasajes. |
| 5 | `heymondo-es-fiable` | La garantía del 100% era un «matiz» de simulación. | Confirmada por su FAQ oficial; explicado el cruce con la exclusión del desistimiento (<1 mes). Añadida mediación Confianza Online. |
| 6 | `heymondo-opiniones` | Sin reputación pública ni canales de contacto (había demanda sin respuesta: «teléfono heymondo»). | Secciones de valoraciones (atribuidas) y de contacto; 2 FAQ nuevas. |

### 3.2 Pendientes: necesitan una decisión vuestra

| # | Tema | Qué dice lo nuestro | Qué dice lo oficial | Riesgo |
|---|---|---|---|---|
| A | **«Hasta 45%»** (descuento, Black Friday, pilar, HeymondoGuias, 4 posts más) | 15% BF + 15% familia/grupo + 15% franquicia = 45%. En `descuento-heymondo` se dice «en cascada», en `black-friday-heymondo` se suma. | Máximo **30%** sin campaña y **40%** en Black Friday. BF = **10%**. Tres descuentos del 15% en cascada dan **38,6%**, no 45%. | **Alto.** Afirmación numérica que la marca desmiente y titular de la página que más impresiones tiene (9.838). |
| B | «5% todo el año / 15% en campañas» por enlace de afiliado | Se presenta como condición de Heymondo. | No aparece en ninguna página oficial; el único descuento de campaña documentado es el 10%. | Medio. Puede ser un acuerdo comercial vuestro; si es así, hay que decirlo como tal y confirmar vigencia. |
| C | Premium «ilimitado también en Europa» | Sí (cambio de julio de 2026). | La tabla oficial lo confirma, pero el texto de la misma página dice que en Europa baja a 3 M€ y **en España a 150.000 €**. | Medio. Nunca avisamos del límite dentro de España. |
| D | Equipamiento electrónico 1.750 € (Top) / 2.000 € (Premium) | Tabla de cotizador. | Blog oficial: hasta el 100% de 3.000 € (Top) y 4.000 € (Premium). | Medio. Probablemente son coberturas distintas («equipaje electrónico» vs «equipamiento electrónico» opcional): verificar. |
| E | «No contratable para mayores de 74 años» | Dato de simulación. | Ninguna página oficial lo menciona. | Bajo. Citarlo como «en nuestro cotizador». |
| F | Black Friday 2026 | Texto de 2025 (18/11–1/12). | El blog oficial lleva «2026» en el título pero las fechas son de 2025. | Bajo. Actualizar cuando Heymondo publique fechas. |

**Decisión recomendada para A y B:** hacer una simulación en el cotizador con familia de 3 + franquicia, entrando desde el enlace, y capturar el precio. Con eso se fija el máximo real, se corrige la cascada y se elimina la contradicción entre las dos páginas.

## 4. Mapa semántico: qué nos falta rodeando «heymondo»

Las 15 piezas actuales cubren **marca, descuento, fiabilidad, cancelación, anual/larga estancia, vuelos, exclusiones, reclamación, sordos y 3 comparativas**. Lo que el corpus oficial permite y aún no existe:

| Prioridad | URL propuesta | Intención | Datos disponibles | Necesita de vosotros |
|---|---|---|---|---|
| P1 | `/heymondo-top-o-premium` | «heymondo top o premium» (GSC: pos. 1–4, sin página) | Tabla de planes + 31 simulaciones nuestras (7 días: 56,42 € vs 66,61 €; 31 días: 131,46 € vs 174,10 €) | Nada |
| P1 | `/heymondo-deportes-aventura` | «heymondo cubre rafting / buceo / trekking / snorkel» | Las dos listas oficiales completas y límites (5.000 m, 20 m) | Nada |
| P1 | `/cuanto-cuesta-heymondo` | «precio heymondo», «cuánto cuesta» | Nuestras 31 simulaciones + tabla oficial (7 y 15 días, Europa/Mundo) | Nada |
| P1 | `/app-heymondo` | «app heymondo», «llamada gratuita», «chat médico» | Página oficial de app + valoraciones + nuestra experiencia | Capturas de la app (opcional) |
| P2 | `/heymondo-telefono-contacto` | «teléfono heymondo» (GSC) | Contacto oficial completo | Nada. Hoy está resumido en `/heymondo-opiniones`: valorar si merece URL propia |
| P2 | `/seguro-de-viaje-familiar-heymondo` y `/seguro-de-viaje-grupos-heymondo` | Familia (15% auto, pediatra, menores) y grupos | Páginas oficiales | Un caso real de familia |
| P2 | `/seguro-de-viaje-obligatorio-por-pais` | «seguro obligatorio para viajar a…» | Textos de país (verificar uno a uno) | Nada, pero requiere revisión manual de ~120 páginas |
| P3 | Destinos con puente comercial (Patagonia, India, Tailandia, Uzbekistán, Antártida…) | «seguro de viaje para X» | Consejo oficial por país | Experiencia propia por destino |
| P3 | `/heymondo-seguro-mascotas` | Seguro con mascota | Blog oficial + garantías 2026 | Verificar importes por plan |
| Bloqueado | Exclusiones de anual y temporal | «qué no cubre el anual» | No están en el corpus | **PDF de condiciones generales** del anual/temporal |

**Reglas para no canibalizar:** una intención = una URL. `/heymondo-opiniones` sigue siendo la reseña general; las nuevas piezas la enlazan en contexto, y todas mandan a `/descuento-heymondo` con anchors distintos (ver `plan-contenidos-heymondo.md` §4).

## 5. Requisito técnico a tener en cuenta

Cada post exige `image` e `imageAlt` (portada `.webp` en `~/assets/images/`). Sin portadas no se pueden publicar las páginas nuevas. Hay que prepararlas (formato de las existentes: texto sobre fondo verde azulado con el logo).

## 6. Criterios editoriales que se mantienen

- Dato oficial siempre con «según Heymondo» y página de origen; nuestra experiencia separada y sin inflar («no hemos reclamado equipaje»).
- No afirmar nada del producto que solo conozcamos de simulaciones sin decirlo.
- Revisar cada dato en el cotizador antes de publicar cifras de precio.
- Fecha de consulta visible: el corpus es de 7 de octubre de 2026.

## 7. Actualización (7 de octubre, tras la captura del cotizador)

### Resuelto
| Punto | Resolución |
|---|---|
| **A. «Hasta 45%»** | Medido con una simulación real (España-Mundo, 3 viajeros, 25 días): el 15% de familia viene incluido en el precio y el 5% del enlace se aplica **encima** (cascada). La franquicia da entre 14,7% y 17,4%, no un 15% exacto. Tres descuentos del 15% encadenados dan 38,6%; con franquicia del 17%, ~40%. Coincide con el máximo del 40% que documenta Heymondo. Sustituido «45%» por «~40%» en 8 archivos; tablas de `descuento-heymondo` y `black-friday-heymondo` recalculadas en cascada. |
| **D. Electrónica** | El cotizador confirma 500 / 1.000 / 1.750 / 2.000 €: nuestra tabla era correcta; el blog oficial (3.000/4.000 €) es la cifra que no cuadra. |
| **E. Edad máxima** | No era 74 años para todos: **Esencial y Top, 69; Tranquilidad y Premium, 74** (bebés <90 días no admitidos en Esencial y Top). Corregido en 3 piezas. |
| Franquicia | No existe en Esencial. Añadido en `descuento-heymondo`. |

### Sigue pendiente
- **B.** El «5% todo el año» está confirmado por el cotizador (banner «5% de descuento gracias a Mochileando sin Barreras»). El **15% de campaña** no se ha podido simular: está marcado como estimación en las tablas.
- **C.** El cotizador confirma Premium «Ilimitado» en Europa; sigue sin avisarse del tope de 150.000 € dentro de España (lo menciona ya `heymondo-top-o-premium`; falta en el resto).
- **F.** Actualizar Black Friday 2026 cuando Heymondo publique fechas. La portada de `black-friday-heymondo.webp` aún dice «-45%»: regenerarla.
- Hay `condiciones-generales.pdf` y `condiciones-particulares.pdf` en la raíz: son de la larga estancia. Faltan las del anual/temporal para ampliar `/que-no-cubre-heymondo`.

### Publicado en esta oleada (P1 del mapa)
`/heymondo-top-o-premium`, `/heymondo-deportes-aventura`, `/cuanto-cuesta-heymondo`, `/app-heymondo`, con portadas generadas en el mismo estilo y enlaces desde `HeymondoGuias`, `heymondo-opiniones` y `descuento-heymondo`.

Supuesto a confirmar: las cifras «con franquicia» de `/cuanto-cuesta-heymondo` salen de la segunda cotización pegada, que identificamos como el mismo viaje con la franquicia activada (los precios tachados y finales cuadran con una rebaja del 14,7–17,4% y Esencial no cambia).

## 8. Actualización: condiciones generales v26.1 de Tranquilidad, Top y Premium (7 de octubre)

Tres PDF nuevos en la raíz: `CCGG_Viaje_Tranquilidad_Sin_Anulacion_IMA_IN_ES_v26.1.pdf`, `CCGG_Viaje_Top_IRIS_ES_v26.1.pdf` y `CCGG_Viaje_Premium_Sin_Anulacion_IMA_IN_ES_v26.1.pdf` (~52.000 palabras). Son **condiciones generales**: los topes del Top y los de Esencial no están en ellas (van en el certificado).

### Hallazgos que cambian lo publicado
| Hallazgo | Fuente | Acción |
|---|---|---|
| **Cada plan lo asegura una compañía distinta**: Tranquilidad y Premium, IMA Ibérica (E0258, supervisada por la ACPR francesa); Top, **IRIS Global**. | Cabeceras de los PDF | `heymondo-es-fiable`, `que-no-cubre-heymondo`, `top-o-premium` actualizados. |
| El Top **nombra los «aparatos de sordera»** entre lo no cubierto (prótesis y dispositivos). Tranquilidad y Premium: «prótesis y ortesis» en genérico. | Top, exclusión g) | `seguro-de-viaje-para-sordos` y `que-no-cubre-heymondo` corregidos (antes: «no se nombran»). |
| **Tranquilidad: viajes de hasta 90 días; Europa 500.000 €, España 50.000 €, mundo 1.500.000 €.** | DIP Tranquilidad | `heymondo-opiniones` (matiz bajo la tabla). |
| **Tranquilidad excluye la aventura** (rafting, buceo, barranquismo, quads, salto elástico…) y todo lo que pase de 3.000 m. El cotizador solo pone «Básico». | Tranquilidad §5 | `heymondo-deportes-aventura` reescrito por plan. |
| **Bungee/salto elástico:** incluido en Top y Premium; excluido en nuestra larga estancia. No era una contradicción: son productos distintos. | Top y Premium | Caja corregida. |
| **Esquí:** Premium y Tranquilidad lo excluyen; el Top solo excluye heliesquí y esquí fuera de pista (el esquí en pista ni está excluido ni incluido). | Los tres | Explicado en deportes y top-o-premium. |
| **Voluntariado en ONG excluido** (lesiones) y profesiones manuales, solo en el Top. | Top, exclusión ñ) | `heymondo-opiniones` (nota sobre Argelia) y deportes. |
| «Indemnización adicional por accidente» del cotizador (30.000/50.000 €) es la de **transporte público**; el accidente 24 h del Premium es de 25.000 € y del Tranquilidad, 6.000 €. | DIP Premium y Tranquilidad | `top-o-premium` corregido. |
| Premium: topes por garantía (rescate 15.000, secuestro 3.000, óptica por accidente de **tráfico** 1.000, atentado 1.500, silla de ruedas 800…). El Top **tiene las mismas cláusulas** sin límites publicados: no se puede decir «solo del Premium». | DIP Premium y Top | `top-o-premium` (tabla y aviso). |
| Teléfonos de asistencia (IMA): **91 353 63 23** (asistencia 24 h) y **91 353 63 24** (reembolsos); portal `siniestros.imaiberica.es`. El Top no los publica. | Premium y Tranquilidad §8 | `heymondo-opiniones` y `como-reclamar-seguro-heymondo` (antes: «no es público»). |
| Cancelación del Top: **42 causas numeradas**; excluye lo recuperable por tarjeta/PayPal, «no show» y pandemias; 72 h de carencia. Nuestro listado incluía causas que no figuran en el del Top («cambio de vacaciones por la empresa», «estado de alarma»). | Top §66 | `seguro-cancelacion-heymondo` (sección nueva). |
| **Equipaje en coche o camper cerrado:** 500 € (Tranquilidad), 1.000 € (Top), 1.500 € (Premium); de noche solo en aparcamiento cerrado y vigilado. Franquicia de coche de alquiler: no vale para autocaravanas. | Los tres | `que-no-cubre-heymondo`. |
| «Servicio de intérprete»: es de **idiomas**, para «una primera intervención»; no menciona lengua de signos. | Los tres | `seguro-de-viaje-para-sordos`. |
| El Top deja de cubrir el día que cumples 70 años (salvo que contrataras con menos); Tranquilidad y Premium, a los 75. | §6 / §2 | Edad ya corregida. |

### Oportunidades que abren estos PDF (para la siguiente oleada)
- **Heymondo y furgoneta/camper:** hay datos reales (equipaje en vehículo, acampada libre, coche de alquiler excluye autocaravanas). Nuestro texto decía «no tiene producto para furgoneta»; sigue siendo cierto, pero ahora se puede escribir una pieza con lo que sí cubre y lo que no.
- **Heymondo con mascota:** requisitos (perros y gatos de 3 meses a 9 años, con microchip) y tabla completa del Premium.
- **Diferencias Tranquilidad vs Top** (equivalente a `top-o-premium`): ya hay datos suficientes.
- **Todavía faltan:** las condiciones del **Esencial**, del **anual** y de la **cancelación como producto independiente** (IMA), y los **certificados particulares del Top** para poner topes.

## 9. Actualización: Esencial, anual y cancelación (7 de octubre, tarde)

Cinco PDF más: `CCGG_Viaje_Esencial_IRIS_ES_v26.1.pdf`, `CCGG_Anual_Multiviaje_IRIS_ES_v26.1.pdf`, `CCGG_Anual_Multiviaje_Premium_IRIS_ES_v26.1.pdf`, `CCGG_Anulacion_Top_IMA_IN_ES_v26.1.pdf` y `CCGG_Anulacion_Plus_IMA_IN_ES_v26.1.pdf`.

| Hallazgo | Detalle |
|---|---|
| **El PDF del Esencial es idéntico byte a byte al del Top** | Mismo contrato (IRIS Global); lo que cambia entre planes son los límites del certificado. |
| **Los dos PDF de anual tienen el mismo texto** | Solo difiere el binario (metadatos). Anual = IRIS, misma plantilla que el Top, pero con aventura como suplemento, esquí excluido y **sin** mascotas ni óptica. Cesa a los 70 años. |
| **La cancelación son tres condicionados** | IRIS integrado (42 causas, 72 h de carencia si se contrata tarde); IMA Top (38 causas) e IMA Plus (44), ambos **solo si se contratan el mismo día de la reserva o en los 7 días siguientes**, vigentes desde las 24:00, tope 6.000 € + 10% de gestión, interrupción hasta 6.000 €. |
| **Recuento de causas** | El cotizador cuenta 42 (Top) y 48 (Plus) porque separa causas que el PDF agrupa (38 y 44); IRIS enumera 42. «Hasta 47» de la web ≈ las 48 del Plus, con toda probabilidad. |
| **Discrepancia web ↔ condicionado** | La web dice «sin límite de días». El condicionado de IMA dice ≤7 días. El de IRIS permite contratar después con 72 h. |
| **Plus vs Top (IMA)** | El Plus añade 6 causas: retirada del carnet, mascota, cancelación de evento/concierto, estado de alarma por COVID, atentado en destino y robo del vehículo 48 h antes. |

### Simulación de cancelación recibida (`cancelacionSimulacion.png`)
España-Mundo, 7–27 oct 2026 (20 días), 1 viajero, 250 € asegurados, «7 días o menos»: **Cancelación Top 7,17 €** (7,55 € sin 5%) y **Cancelación Plus 15,55 €** (16,37 € sin 5%). Ambas «no contratables mayores de 74 años». El Top tiene un guion en 6 causas (alarma COVID, evento/concierto, carnet, mascota, atentado, robo del vehículo): son las 6 que el PDF atribuía solo al Plus. El Plus cuesta +117%.

### Simulación «más de 7 días» recibida (`7diasomas.png`)
Mismo viaje (España-Mundo, 20 días, 1 viajero, 250 €). El cotizador **no ofrece Top ni Plus**: ofrece un único producto, **«Cancelación Premium»**, con «Sin límite de días». **15,13 € → 14,37 €** (con 5%). Tabla de **31 causas** (frente a 42 del Top y 48 del Plus) y **sin la fila de «reembolso de vacaciones por interrupción»**. No aparecen: cuarentena médica, recomendación del gobierno de no viajar, estado de alarma, evento/concierto, mascota, boda, ESTA/ETA, carnet, cambio de vacaciones de la empresa. Edad hasta 74 años. **Resuelve la discrepancia**: «sin límite de días» es cierto solo para este producto, que cubre menos.

### Todavía pendiente
- El **PDF de condiciones de la Cancelación Premium** (enlace «Condiciones generales» de esa pantalla): falta para saber su carencia, su límite máximo y su aseguradora.
- Hasta entonces, las afirmaciones sobre «72 h de carencia» solo se atribuyen al condicionado de IRIS (Top, Esencial y anual).

### (Texto anterior)
El cotizador pregunta «¿lo contratas en los 7 días o después de 7 días?» y la cantidad. Pusisteis «≤7 días, 250 € por viajero», pero **no tengo el precio ni qué producto (Top o Plus, IMA o IRIS) os mostró**. Hacen falta: (1) captura de la pantalla de resultados con el ≤7 días; (2) la misma simulación con «más de 7 días»: así sabemos qué producto y aseguradora aplica en cada caso, y se resuelve la discrepancia.

## 10. Actualización: PDF de la Cancelación Premium (7 de octubre, tarde)

`CCGG_Anulacion_Premium_Caser_ES_v26.1.pdf`. **Aseguradora: Caser** (Caja de Seguros Reunidos, clave C0031), tercera compañía tras IMA e IRIS. Corrige lo que se dedujo de la captura:

| Dato | Lo dicho antes | Lo que dice el PDF |
|---|---|---|
| Aseguradora | «No la sabemos» | **Caser** |
| Interrupción del viaje | «No aparece» (por la tabla del cotizador) | **Sí: hasta 6.000 €** (cláusula 6.4) |
| Carencia | Solo atribuida a IRIS | **72 h** si no se contrata el mismo día de la reserva; cobertura desde las 00:00 del día siguiente |
| Causas | 31 (cotizador) | 29 en el PDF (mismo contenido, otro recuento) |
| Exclusión nueva | — | Enfermedades o accidentes tratados en los **30 días previos** a la reserva y a la inclusión en el seguro |
| Comunicación del siniestro | — | **«Directa y exclusivamente por teléfono»** (+34 915 909 692, 24 h, cobro revertido): barrera para personas sordas |
| Otras | — | Una sola anulación o cambio de fechas; solo viajes desde/hacia España; pandemias, salud mental <4 días de ingreso, cuidar a un familiar, tasas y gastos de gestión excluidos; incluye COVID y «agravamiento de enfermedad previa o crónica» como causa |

### Mapa final de cancelación en el cotizador (7 oct 2026, 250 €, 20 días)
≤7 días: **Cancelación Top** (IMA, 42 causas, 7,17 €) y **Plus** (IMA, 48 causas, 15,55 €). >7 días: **Cancelación Premium** (Caser, 31 causas, 14,37 €). Integrada en Top/Esencial/anual: IRIS (42 causas, 72 h). Todo está en `/seguro-cancelacion-heymondo`.

### Pendiente
Nada bloqueante en cancelación. Faltan solo los certificados particulares (topes del Top y del Esencial) y la simulación de las pólizas a partir de 75 años (no contratables).
