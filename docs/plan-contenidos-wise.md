# Plan de contenidos: autoridad temática en torno a Wise

_Elaborado el 8 de octubre de 2026 a partir de: páginas públicas de `wise.com` (versiones de España, Argentina, México, Brasil, Colombia, Chile, Perú y Uruguay, descargadas el 8 de octubre y guardadas en `wise.com/` en local, ignorado en git), artículos del centro de ayuda de Wise y Search Console del 6 de octubre._

> **Sobre la fuente.** Wise no tiene un volcado como los de N26 o Revolut. Se han leído sus páginas públicas (precios de tarjeta, tarjeta, cuenta, envío, ayuda sobre seguridad y límites) con descarga directa y se han contrastado con búsquedas. **Falta**: el detalle de las comisiones de conversión de la tarjeta por divisa (la web las calcula dinámicamente) y las condiciones legales completas. Donde no hay dato oficial, se dice.

## 1. Qué hemos visto

### Search Console (solo consultas y URLs con «wise»)
| URL | Impresiones | Clics | CTR | Posición |
|---|---|---|---|---|
| `/tarjeta-wise` | 20.513 | 126 | 0,61 % | 8,0 |
| `/revolut-vs-wise` | 14.527 | 120 | 0,83 % | 6,9 |
| `/imagin-vs-wise` | 7.530 | 18 | 0,24 % | 5,3 |
| `/n26-vs-wise` | 6.056 | 92 | 1,52 % | 6,7 |
| **Total** | **≈48.600** | **356** | | |

Consultas: **«wise opiniones» y variantes** (≈ 2.700 impresiones, posición 7-8: sin página de opiniones propia), «tarjeta wise» (994), «tarjeta wise opiniones» (372), «wise bank opiniones» (245), «tarjeta wise como funciona» (281), «tarjeta wise gratis» (168), duelos con Revolut y N26 (≈ 3.000).

### Qué dice Wise (y en qué choca con nuestros posts)
**Tarjeta en España (precios oficiales):**
- **Cuesta 7 € (pago único).** Entrega urgente opcional en 1-2 días **desde 10,40 €**. Tarjeta digital **gratis**. Sustituir la tarjeta **4 €**.
- **Cajeros: gratis hasta 250 € al mes. Superados los 250 €, 2,69 % del importe por encima de 250 €**, por cuenta y mes. Cambio vigente desde el **1 de mayo de 2026** para tarjetas europeas. **Nuestros posts dicen «200 € gratis» y «pequeña comisión»: están desfasados.**
- **«Sin comisiones por transacción en el extranjero»**, con «bajas comisiones de cambio de divisa» y tipo de cambio **medio del mercado**, y descuentos por volumen.
- **Más de 40 divisas** en la cuenta (la web también habla de pagar en 49 divisas), **150 países y territorios**.
- Pago con **Apple Pay y Google Pay**; congelar la tarjeta al instante; notificaciones por cada pago; atención en 14 idiomas.
- Wise **no cobra por las retiradas, pero el cajero puede cobrar su tasa.**
- **Límites de gasto:** Wise aplica límites mensuales y diarios por cuenta, que puedes cambiar en la app. Los valores por defecto de España no figuran en el texto que hemos leído (los encontrados en búsquedas son genéricos): **no citar cifras**.
- Cuenta Wise: **gratis, sin cuota mensual**, verificación con documento de identidad. Para residentes en España.

**Qué es y qué no es:**
- **No es un banco.** Para clientes del EEE, **Wise Europe SA**, entidad de pago **autorizada en Bélgica** (Banco Nacional de Bélgica). Wise Payments Ltd (Reino Unido) está autorizada por la FCA como entidad de dinero electrónico.
- **No hay garantía de depósitos:** Wise **no presta tu dinero**, así que no participa en esquemas como el FSCS. Lo que hace es **salvaguardar**: mantiene tu dinero **separado del suyo**, en efectivo o activos líquidos seguros (bonos del gobierno de la UE, Reino Unido y EE. UU. y fondos del mercado monetario, según su artículo de ayuda, a abril de 2024). **Nuestros posts no lo cuentan.**

**Latinoamérica (la parte que más cambia el enfoque):**
| País | Tarjeta Wise | Qué dice Wise |
|---|---|---|
| **Argentina** | **No disponible** | «Las tarjetas no están disponibles aún en tu país.» Lista de espera. |
| **México** | **No disponible** | Idem. Wise está regulado por la CNBV en México; ofrece **envío de dinero**. |
| **Colombia, Chile, Perú, Uruguay** | **No disponible** | Idem. |
| **Brasil** | **Sí** | Tarjeta gratis (digital); **1 retirada gratis al mes y 20 BRL por retirada a partir de la segunda**; sustituir, 30 BRL; Wise Brasil Instituição de Pagamento; soporte en portugués 24/7; menciona IOF del 1,1 % al convertir desde BRL con Rende+. |

Esto significa que **un lector de Argentina, México o Colombia no puede pedir la tarjeta Wise** y que los posts actuales, que se leen como si cualquiera pudiera, hay que matizarlos.

### Errores y carencias en nuestros posts (a corregir)
| Dónde | Problema | Realidad oficial |
|---|---|---|
| `tarjeta-wise`, `n26-vs-wise`, `revolut-vs-wise`, `imagin-vs-wise` | «Retiras hasta **200 €** al mes gratis» y «una pequeña comisión» | **250 €** al mes gratis; **2,69 %** del exceso (desde 1 de mayo de 2026) |
| `tarjeta-wise` | No dice **cuánto cuesta la tarjeta** | **7 €** una vez |
| `tarjeta-wise` | «Comisión desde ~0,33 %» | Wise indica «a partir del 0,2 %» en conversión y envío; en tarjeta, «bajas comisiones de cambio de divisa», sin cifra. **No citar un porcentaje fijo.** |
| Todos | No se dice que **no es un banco** ni que **no hay garantía de depósitos** | Entidad de pago belga; dinero salvaguardado |
| Todos | Dan por hecho que la tarjeta está al alcance de cualquiera | **No está disponible en Argentina, México, Colombia, Chile, Perú ni Uruguay** |
| Todos | Sin aviso de enlace de invitación | Añadir transparencia (ver decisión abajo) |

## 2. Contenido nuevo propuesto

### A. Decisión y conversión
| # | Slug | Intención | Por qué |
|---|---|---|---|
| 1 | `/wise-opiniones` | «Wise opiniones», «¿es seguro Wise?», «Wise bank» | ≈ 2.700 impresiones dispersas. Banco o no, salvaguarda, quejas, a quién encaja. |
| 2 | `/como-pedir-tarjeta-wise` | Cómo funciona y cómo se pide la tarjeta (7 €, digital gratis, entrega urgente) | «tarjeta wise como funciona», «gratis» (≈ 450 impresiones). |
| 3 | `/comisiones-wise-extranjero` | Cajeros (250 € y 2,69 %), pagos en otra divisa, conversión | El cambio de mayo de 2026 lo vuelve imprescindible. |
| 4 | `/wise-es-seguro-salvaguarda` | Si no es banco, ¿mi dinero está seguro? | Puede integrarse en `/wise-opiniones`. |

### B. Latinoamérica (prioridad por la audiencia)
| # | Slug | Intención | Por qué |
|---|---|---|---|
| 5 | `/wise-latinoamerica` | ¿Puedo usar Wise en mi país? Tarjeta disponible solo en Brasil; cuenta y envíos | La mayor sorpresa para el lector latinoamericano. |
| 6 | `/enviar-dinero-a-latinoamerica` | Wise, Revolut y otras opciones desde España | Hub de transferencias, con datos oficiales de cada una. |

### C. Estrategia
`/tarjeta-para-viajar-por-latinoamerica` (ya publicado) ganará una sección de Wise con datos oficiales.

### D. Fuera de alcance
Wise Business, Rende+/Assets e inversiones, Wise Platform y Young Explorer: no encajan con el sitio.

## 3. Interlinking mínimo
Pilar `/mejor-tarjeta-para-viajar`, hub dentro de `/tarjeta-wise` y enlaces cruzados con N26 y Revolut (comisiones de cajero, Latinoamérica).

## 4. Orden de trabajo propuesto
1. **Oleada 1 (curar):** `tarjeta-wise` y las tres comparativas con Wise: 250 € y 2,69 %, coste de la tarjeta de 7 €, no es un banco, disponibilidad por país; metadatos para CTR.
2. **Oleada 2:** `/wise-opiniones`, `/como-pedir-tarjeta-wise`, `/comisiones-wise-extranjero`.
3. **Oleada 3 (Latinoamérica):** `/wise-latinoamerica` y el hub de envíos.
4. Medir en Search Console a las 4-6 semanas.

## 4b. Hecho (8 oct 2026)
- **Oleada 1:** `tarjeta-wise` reescrita con datos oficiales (7 €, 250 € y 2,69 %, no es un banco, disponibilidad por país, tabla de países) y corregidas `n26-vs-wise`, `revolut-vs-wise`, `imagin-vs-wise` y el pilar.
- **Oleadas 2 y 3:** `wise-opiniones` (incluye la multa de la FCA de 2024 a su CEO, aclarando que no fue a la empresa), `comisiones-wise-extranjero` (con tabla frente a N26 y Revolut; Wise sale mejor hasta ≈ 680 € al mes), `como-pedir-tarjeta-wise` y `wise-latinoamerica`.
- **Enlace:** el usuario confirma que **no tiene afiliación con Wise**: se usa el enlace de invitación y se declara como tal en cada botón.

## 5. Decisiones propuestas
- **Enlace de Wise:** los posts actuales enlazan a Wise; hay que comprobar qué tipo de enlace es (invitación de amigo o afiliación) para declararlo. **No se prometen bonos.**
- **Honestidad:** decir con claridad que Wise no es un banco ni tiene garantía de depósitos; no citar porcentajes de conversión que no estén publicados.
- **Latinoamérica:** cada post de Wise debe decir en qué países hay tarjeta.

## 6. Preguntas abiertas
1. ¿Qué tipo de enlace usáis con Wise (invitación o afiliación)?
2. ¿Puedes añadir capturas del plan de comisiones de la tarjeta en la app (conversión por divisa) para citar porcentajes reales?
