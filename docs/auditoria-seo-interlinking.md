# Auditoría SEO e interlinking — octubre 2026

Estado tras migrar los clústeres de **seguros, tarjetas y eSIM** (32 páginas de contenido).

## Hallazgos y correcciones aplicadas

| # | Hallazgo | Impacto | Corrección |
|---|----------|---------|------------|
| 1 | 27 posts con `metadata.canonical` copiado de WordPress **con barra final** (`/x/`) mientras el sitio sirve y enlaza **sin barra** | Canonical ≠ URL real; señal contradictoria a Google | Eliminados. Ahora el canonical se calcula sin barra (verificado en el HTML) |
| 2 | `<title>` de hasta **105 caracteres** (la plantilla añadía «\| Mochileando sin Barreras») | Títulos truncados en Google | Plantilla sin sufijo + títulos recortados. Máximo actual: 68 (pilar) y 62 el resto |
| 3 | **128 enlaces internos con barra final** + 5 URLs absolutas propias | Redirecciones/duplicados, viola la regla de URLs limpias | Normalizados a relativos sin barra |
| 4 | Todo el blog en una única categoría «Recursos viajeros» | Categoría inútil, blog «cajón de sastre» | 3 categorías = 3 clústeres; blog y categorías con chips de navegación e intro |
| 5 | Sin enlazado sistemático entre hermanos: 8 posts con ≤ 6 enlaces entrantes, varios con 0 salientes | Autoridad mal repartida | `ClusterLinks`: cada post enlaza al pilar (arriba) y a todos sus hermanos (abajo). Mínimo de entrantes: 2 → **11** |
| 6 | Menú principal plano, con 3 enlaces a páginas inexistentes (`/destinos`, `/libro`, `/acerca-de`) | 404 en el menú | Desplegables por clúster (pilar + páginas clave + «todas las guías»). `/destinos` y `/libro` retirados/redirigidos al producto |
| 7 | Sitemap con 58 URLs, incluyendo tags (noindex) y paginación | Sitemap contradictorio | Filtrado: 41 URLs, todas indexables |
| 8 | `robots.txt` sin `Sitemap:` | Descubrimiento más lento | Añadido |
| 9 | Pilares sin breadcrumb | Sin migas ni schema BreadcrumbList | Añadido: Inicio › Clúster › Pilar |
| 10 | Home: enlaces con barra final y tarjetas sin salida al clúster | — | Corregido; cada tarjeta enlaza al pilar y a la categoría |

## Pendiente (no se ha tocado: requiere contenido nuevo)

Enlaces internos que **aún apuntan a páginas sin migrar** (404 mientras no existan):

- `/esim-yesim-opiniones` y `/esim-keepgo-opiniones` — enlazados desde 3 comparativas de eSIM cada uno.
- `/esim-eeuu`, `/esim-japon`, `/esim-tailandia`, `/esim-mexico`, `/esim-europa`, `/esim-indonesia` — enlazados desde el pilar de eSIM.
- `/acerca-de` — enlazado desde el **menú principal** y la home. **Bloqueante antes de lanzar.**
- Clúster **Alquiler de coches** (`/mejor-alquiler-de-coches`) y **Destinos**: pendientes de migrar; ver `src/navigation.ts` y `src/data/clusters.ts`.

## A verificar en producción (no se puede comprobar en local)

- Qué hace el hosting con `/pagina` frente a `/pagina/`: debe servir 200 en la versión sin barra, con canonical sin barra.
- Redirecciones 301 de las URLs antiguas de WordPress (`/mejor-seguro-de-viaje-2026`, `/seguros-de-viaje-con-descuento`): ya están en `public/_redirects` y `nginx/nginx.conf`.
