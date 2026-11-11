# Enlaces de afiliación

Fuente única de los enlaces en código: `src/data/afiliados.ts` (barra lateral y barra móvil). En los `.mdx` el enlace se pega en `<BotonAfiliado href="..." />`.

## Intermundial (seguros de viaje)

- **Enlace de afiliado** (comisión de afiliación a confirmar):
  `https://www.intermundial.es/afiliados/seguros-de-viaje-recomendado?utm_source=Affiliates&utm_medium=Affiliates&utm_campaign=General&utm_term=69d89eea1b111&utm_content=69d89eea1b111`
- **Cupón de afiliación:** `SINBARRERAS` (equivale al enlace; útil para ampliar semántica: «cupón Intermundial SINBARRERAS»). **Promo SINBARRERAS = 10% de descuento** para el lector (confirmado por el propio usuario).
- En código: constante `INTERMUNDIAL_URL` en `src/data/afiliados.ts`.
- Regla: nunca enlazar a `intermundial.es` a secas; siempre con este enlace y `rel="nofollow sponsored noopener"` (lo pone `BotonAfiliado`).
- Dónde está aplicado: `chapka-vs-intermundial`, `iati-vs-intermundial`, `heymondo-vs-intermundial`, pilar `mejor-seguro-de-viaje` y tarjeta de la barra lateral. En la barra móvil figura como «10% dto.» (`mobileDiscount`).

## Otros afiliados (resumen)

| Marca | Dónde está el enlace |
|---|---|
| Heymondo | `afiliados.ts` (+ variantes con `ag_campaign` por post) |
| IATI | `afiliados.ts` |
| eSIMFLAG | `afiliados.ts` |
| N26 | `afiliados.ts` |
| DiscoverCars | `afiliados.ts` |

## Chapka (seguros de viaje)

- Panel de afiliado: affiliate.chapka (carpeta local `chapka/` con enlaces, logo y banner del 7 %). El **7 % de descuento** sale del banner del panel; sin confirmar en la web pública (ver `docs/plan-contenidos-chapka.md` §5).
- Enlaces trackeados (`app=sinbarreras`), base `https://www.chapkadirect.es/index.php?action=produit&id=<id>&app=sinbarreras`:

| Producto | id |
|---|---|
| Cap Trip (Basic/Plus) | 956 |
| Cap Cancelación | 959 |
| Cap Multi-Trip anual | 960 |
| Cap Voluntariado | 929 |
| Cap Trotamundos | 958 |
| Cap Working Holiday | 957 |
| Cap Student | 968 |
| Cap Tempo Expat | 942 |
| Cap Schengen | 930 |
| Cap Europa | 931 |

- Regla: nunca enlazar a `chapkadirect.es` a secas; siempre con `app=sinbarreras` y `rel="nofollow sponsored noopener"` (`BotonAfiliado`).
- Pendiente: añadir las constantes a `src/data/afiliados.ts` cuando se publiquen las páginas.
