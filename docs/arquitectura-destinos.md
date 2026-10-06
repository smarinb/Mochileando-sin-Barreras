# Arquitectura SEO de Destinos, Accesibilidad y Vuelta al mundo

Plan para migrar los ~126 posts de WordPress que aún no están en Astro, ordenado por tráfico real (Search Console, últimos 6 meses, exportado el 2026-10-06) y por encaje comercial con los clústeres que ya monetizan (seguros, tarjetas, eSIM, alquiler de coches).

## 1. Qué dicen los datos

De 10.248 clics en 6 meses, el 85 % ya está migrado. Quedan 1.528 clics en 292 URLs, pero **solo ~60 URLs tienen algún clic y 13 pasan de 20**. El resto del inventario (≈225 URLs, ~47.000 impresiones, casi todo eSIM por ancla) puede esperar.

Tráfico pendiente por tema (clics aprox. en 6 meses):

| Tema | Posts sin migrar | Clics | Comentario |
|---|---|---|---|
| Patagonia (Chubut, Valdés, Calafate, Punta Arenas, Carretera Austral…) | ~12 | ~370 | El mayor bloque. Búsquedas de «los altares chubut» (2.600 imp., pos. 10) |
| Eslovenia (Liubliana + país) | 2 | ~122 | Pos. 13–15 en «que ver en liubliana/eslovenia»: es el mayor margen de mejora |
| Siberia y Rusia | ~14 | ~110 | `guia-siberia`, ropa de invierno, Transiberiano, Baikal |
| Vuelta al mundo + camper | ~21 | ~90 | Excedencia, cómo vivir viajando, ahorrar, camper |
| Asia Central (Kazajistán, Uzbekistán) | ~35 | ~65 | Muchísimo contenido, casi sin tráfico aún |
| Viajar siendo sordo (accesibilidad) | ~21 | ~65 | Poco tráfico, pero es vuestra diferenciación y E-E-A-T |
| India nordeste | ~15 | ~40 | Solo `guwahati` mueve algo |
| Nueva Zelanda, Tailandia, Líbano | ~15 | ~35 | Tráfico residual |

Consultas con margen claro (impresiones altas, posición 8–15, CTR bajo): `los altares chubut`, `que ver en liubliana`, `que ver en eslovenia`, `que ver en punta arenas`, `ruta 25 chubut`, `ballenas argentina/chile`, `siberia en invierno`, `mejor esim para chile` (125 imp., pos. 11, **no existe contenido**).

## 2. Principios

1. **Seguir el tráfico, no la geografía.** No se crea una página por país por orden alfabético: solo hay pilar donde hay contenido y demanda.
2. **No crear pilares finos.** Con menos de ~5 posts, el pilar es el mejor post existente ampliado (p. ej. `que-ver-y-hacer-en-eslovenia`), no una página nueva vacía.
3. **No cambiar URLs que ya posicionan.** Se mantienen los slugs planos de WordPress (`/que-ver-y-hacer-en-los-altares-chubut`). Solo se redirige lo que se retira.
4. **Cada destino empuja a un clúster que monetiza.** Un lector de Patagonia necesita coche, eSIM y seguro; ahí está la conversión.
5. **Un tema = una URL.** Se evita la canibalización asignando una intención a cada post (ver §5).

## 3. Arquitectura propuesta

```
Home
├─ Dinero (ya existe)
│  ├─ /mejor-seguro-de-viaje
│  ├─ /mejor-tarjeta-para-viajar
│  ├─ /mejor-esim-para-viajar
│  └─ /mejor-alquiler-de-coches
├─ /destinos                         ← índice (hub de navegación; no compite por keywords)
│  ├─ /guia-patagonia                ← PILAR NUEVO
│  ├─ /que-ver-y-hacer-en-eslovenia  ← pilar = post existente ampliado
│  ├─ /guia-siberia                  ← pilar = post existente (+ Rusia)
│  ├─ /guia-kazajistan, /guia-uzbekistan   ← posts guía existentes como pilares
│  ├─ /guia-india-nordeste           ← pilar nuevo (cuando haya contenido)
│  └─ (Líbano, Tailandia, Nueva Zelanda: sin pilar; solo posts + categoría)
├─ /viajar-siendo-sordo              ← PILAR NUEVO (vuestra diferenciación)
└─ /como-vivir-viajando-por-el-mundo ← pilar = post existente (vuelta al mundo + camper)
```

- **Cada región/tema = un clúster** en `clusters.ts` (`category` exacta en los posts, categoría `/category/<slug>` indexable con intro propia). Se añade el campo `group: 'destinos'` para agruparlos en `/destinos` y en el menú sin multiplicar el número de elementos del menú principal.
- **Sin categorías jerárquicas de WordPress** (`destinos/argentina/patagonia/el-calafate`): la región es el clúster y el país/ciudad va en tags, que siguen fuera del sitemap.
- **Diario mes a mes** (`2-meses-viaje` … `9-meses-de-viaje`, 15 posts, 0 tráfico): se migran los últimos, intactos y bajo el clúster «Vuelta al mundo» con una página índice «Diario de la vuelta al mundo».

### Menú principal (máximo 7)

`Seguros · Tarjetas · eSIM · Coches · Destinos ▾ · Viaje sordo ▾ · Acerca de`

El «Blog» sale de la cabecera (su índice flojo no merece un hueco): queda en el pie y dentro de cada desplegable como «Todas las guías →». «Destinos» abre con la pilar de cada región (Patagonia, Eslovenia, Siberia, Asia Central…) y termina en `/destinos`.

## 4. Interlinking

**Reglas automáticas** (se implementan en `ClusterLinks.astro`):
1. Cada spoke enlaza **al pilar de su región** arriba (píldora, ya existe) y en el bloque final.
2. Los posts de un clúster de destino muestran un bloque **«Prepara tu viaje»** con los pilares de dinero **ordenados por relevancia**: Patagonia y Eslovenia → alquiler de coches primero; Siberia y Asia Central → seguro y eSIM primero.
3. **Breadcrumb** `Inicio › Destinos › Patagonia › Post` con `BreadcrumbList` en todos.

**Reglas manuales** (se aplican al migrar cada post):
4. Mínimo **2 enlaces laterales** a posts hermanos con anchor descriptivo (p. ej. «cómo llegar a Los Altares» en vez de «aquí»).
5. **Un puente comercial en contexto** donde la intención lo pide: al hablar de moverse por Patagonia, enlazar a `/mejor-alquiler-de-coches` con `BotonAfiliado` de DiscoverCars.
6. Si el post trata accesibilidad o sordera, **enlazar a `/viajar-siendo-sordo`**, y al revés.

**Enlaces inversos (los que más suelen olvidarse):**
7. `/mejor-alquiler-de-coches` añade «Alquilar coche por destino» → Patagonia, Eslovenia. `/mejor-esim-para-viajar` amplía «eSIM por destino» con Chile y Argentina cuando existan. `/mejor-seguro-de-viaje` enlaza «seguro para viajar siendo sordo» y para destinos de riesgo (Rusia, Asia Central).
8. **Home**: bloque «Destinos» (reutilizando `ClusterShowcase`). **Acerca de** ya enlaza las guías y enlazará `/viajar-siendo-sordo`.
9. **Pie**: columna «Destinos» con las pilares.

Profundidad máxima: **3 clics desde la home** a cualquier post. Ningún post huérfano.

## 5. Canibalización: qué intención tiene cada post

| Conflicto | Decisión |
|---|---|
| `que-ver-y-hacer-en-eslovenia` vs `que-ver-y-hacer-en-liubliana` | Eslovenia = país (pilar); Liubliana = ciudad. Cada uno enlaza al otro con anchor distinto |
| `guia-siberia` vs `viajar-siberia-invierno-buena-idea` vs `vestimenta-frio-siberia-invierno` | General / decisión de ir en invierno / qué ropa llevar. Interlink cruzado |
| `kazajistan` + `entradas-kazajistan` + `guia-kazajistan` + `que-ver-kazajistan` | Pilar = `guia-kazajistan`. `kazajistan` y `entradas-kazajistan` → 301 a él. `que-ver-kazajistan` se queda como spoke solo si añade valor propio |
| `ver-ballenas-peninsula-valdes` vs `ver-ballenas-chile-patagonia` | Distintos destinos: se enlazan como «Ballenas en Argentina / en Chile» |

## 6. Redirecciones 301 (en `nginx/nginx.conf`, cuando exista el destino)

| Origen | Destino |
|---|---|
| `/home` | `/` |
| `/que-by-hacer-en-los-altares-chubut` | `/que-ver-y-hacer-en-los-altares-chubut` |
| `/entradas-kazajistan`, `/kazajistan` | `/guia-kazajistan` |
| `/entradas-rusia` | `/guia-siberia` |
| `/entradas-uzbekistan`, `/posts-uzbekistan`, `/uzbekistan` | `/guia-uzbekistan` |
| `/entradas-libano`, `/libano` | `/guia-completa-viajar-libano` |
| `/entradas-nueva-zelanda` | `/nueva-zelanda-en-coche-dormir-gratis` |
| `/entradas-turquia` | `/destinos` (sin contenido que migrar) |
| `/black-friday-heymondo` | `/descuento-heymondo` |
| `/recursos`, `/entrevistas`, `/colabora` | `/viajar-siendo-sordo` o `/contacto` según contenido |

Ya redirigidos: `/mejor-seguro-de-viaje-2026` y `/seguros-de-viaje-con-descuento`.

**Decisión pendiente vuestra, no mía:** `/producto/libro-quierete-sorda` (14 clics) y `/tienda-mochileros` (10 clics) son tienda de WordPress. Si WordPress deja de servir ese dominio, hay que mantener esas rutas (proxy a WP) o perderéis la venta del libro.

## 7. Contenido nuevo con retorno probable

Basado en consultas existentes sin página propia:
1. **«Alquilar coche en la Patagonia»**: spoke de dos clústeres (Patagonia y alquiler), con `BotonAfiliado` de DiscoverCars.
2. **«eSIM Chile» y «eSIM Argentina»**: `mejor esim para chile` ya muestra 125 impresiones en pos. 11 sin contenido.
3. **«eSIM Europa»** (la pilar de eSIM la citaba) enlazada desde Eslovenia.
4. **«Mejor época para viajar a Tailandia»**: 3.300 impresiones en pos. 35. Reescribir al migrar.
5. **NordVPN** (4.900 impresiones, CTR 0,18 %): migrar con título reescrito; encaja con el clúster eSIM como «VPN para viajar».

## 8. Orden de ejecución

| Oleada | Qué | Por qué primero |
|---|---|---|
| 1 | **Patagonia**: `los-altares-chubut`, `ver-ballenas-peninsula-valdes`, `navegacion-glaciares-el-calafate`, `ver-ballenas-chile-patagonia`, `punta-arenas`, `capillas-de-marmol`, `isla-pinguino`, `rafting-futaleufu`, `lobos-marinos-madryn` + pilar `/guia-patagonia` + «Alquilar coche en Patagonia» | ~370 clics y encaje directo con alquiler |
| 2 | **Eslovenia**: 2 posts + eSIM Europa | 122 clics, pos. 13–15 con mucho margen |
| 3 | **Siberia y Rusia** (≈10 posts) | 110 clics |
| 4 | **Viajar siendo sordo** + `/destinos` + menú | Vuestra diferenciación; cierra el interlinking de `acerca-de` |
| 5 | **Vuelta al mundo y camper** | ~90 clics, encaja con seguros y tarjetas |
| 6 | Asia Central + India nordeste | Mucho contenido, poco tráfico: migrar en bloque |
| 7 | Líbano, Tailandia, Nueva Zelanda, diario, NordVPN | Residual |

Tras cada oleada: build, comprobación de enlaces rotos, redirecciones 301 del §6 y envío de las URLs a Search Console.

## 8b. Estado de la ejecución

- **Oleada 1 (Patagonia): hecha** el 2026-10-06. 9 posts migrados con el HTML íntegro de WordPress, pilar `/guia-patagonia`, clúster `patagonia` en `clusters.ts`, desplegable «Destinos» en el menú y enlace inverso desde `/mejor-alquiler-de-coches`. Pendiente de la oleada: "Alquilar coche en Patagonia" y "eSIM Chile/Argentina" (contenido nuevo).
- **Oleada 2 (Eslovenia): hecha** el 2026-10-06. `/que-ver-y-hacer-en-eslovenia` (pilar = post existente) y `/que-ver-y-hacer-en-liubliana`, clúster `eslovenia`, enlaces cruzados entre ambos y puente al alquiler de coches. **Descartado:** «eSIM Europa» (no hay consultas con volumen en Search Console; se retoma si aparece demanda).
- **Oleada 3 (Siberia y Rusia): hecha** el 2026-10-06. 12 posts (pilar `/guia-siberia`; Irkutsk, Oljón, Baikal, visado, transiberiano, ropa de invierno, Nochevieja en Moscú y 3 posts de accesibilidad), clúster `siberia-y-rusia`, aviso «Artículo de 2019» en todos. `frontera-rusia-kazajistan` queda para la oleada de Asia Central. Enlaces pendientes de resolver con oleadas 4 y 5: `/sordomundo`, `/asistencia-aeropuerto-discapacidad-auditiva`, `/vuelta-al-mundo`.
- **Oleada 4 (Viajar siendo sordo): hecha** el 2026-10-06. 19 posts migrados (accesibilidad, entrevistas, Sordomundo), pilar `/viajar-siendo-sordo`, índice `/destinos` (se genera solo desde `clusters.ts`), clúster `viajar-siendo-sordo` (`group: 'temas'`), menú «Viaje sordo» (el «Blog» sale de la cabecera y queda en el pie) y 301 de `/entrevistas`, `/colabora` y la home antigua. Pendiente: `/vuelta-al-mundo` (oleada 5) y `/recursos` (oleada 7).
- **Oleada 5 (Vuelta al mundo y camper): hecha** el 2026-10-06. 21 posts (pilar `/como-vivir-viajando-por-el-mundo`, excedencia, ahorro, pet sitting, JGV, diario de 11 meses y 5 de camper/Nueva Zelanda), clúster `vuelta-al-mundo-y-camper` (`group: 'temas'`) y página `/vuelta-al-mundo` como índice del diario. Los emojis de 4 bytes de WordPress llegaron como «?» y se han quitado. Enlaces pendientes de resolver con las oleadas 6 y 7: `/kazajistan`, `/almaty`, `/autostop-kazajistan`, `/frontera-kazajistan-uzbekistan`, `/curiosidades-libano`, `/loei`, `/phi-ta-khon`.
- **Oleada 6 (Kazajistán, Uzbekistán, India): hecha** el 2026-10-06. 40 posts en tres clústeres (`kazajistan` y `uzbekistan` con su guía como pilar; `india` con la página nueva `/guia-india`), aviso «Artículo de 2019/2020» en todos, y 301 de las portadas antiguas (`/kazajistan`, `/uzbekistan`, `/entradas-*`, `/posts-*`). Los posts `kazajistan` y `uzbekistan` (2 KB, solo introducción y enlaces) no se migran: redirigen a la guía. Pendiente: Tailandia y Líbano (oleada 7).
- **Oleada 7 (Tailandia, Líbano y residuales): hecha** el 2026-10-06. Tailandia (5 posts, pilar `/viajar-a-tailandia`) y Líbano (10 posts, pilar `/guia-completa-viajar-libano`) como clústeres de destino; `nordvpn` queda en el clúster eSIM y `material-acampada-mochileros` en Vuelta al mundo y camper; `/trabajemos` migrada como página (colaboraciones y publicidad) y enlazada en el pie; 301 de las páginas heredadas (`/recursos`, `/tailandia`, `/libano`, `/politica`, `/youtube`…). **Fin del plan de migración de posts.** Siguen sin migrar, por decisión pendiente, la tienda de WordPress (`/tienda`, `/tienda-mochileros`, `/producto/libro-quierete-sorda`, carrito y cuenta).
- Soporte añadido: `group`/`bridges` en `Cluster`; plugin rehype `affiliateLinksRehypePlugin` (marca con `rel="nofollow sponsored noopener"` los enlaces de afiliado escritos en markdown); `ClusterLinks` no enlaza a sí mismo cuando el post es la pilar; `ClusterLinks` muestra «Más guías de …» y «Prepara tu viaje» ordenado por `bridges` en los clústeres de destino.

## 9. KPIs (revisar a 6 y 12 semanas)

- Clics e impresiones por oleada frente a la línea base de este export.
- Posición media de las consultas del §1 (objetivo: entrar en top 5 las que hoy están en 8–15).
- Clics a `BotonAfiliado` desde posts de destino.
- Páginas descubiertas y no indexadas en Search Console (debe ir a cero).

## 10. Despliegue en Cloudflare: URLs y redirecciones (verificado con `wrangler dev`)

- **Los posts conservan su URL** (slug plano). Lo único que cambia es la barra final: WordPress usa `/post/` y el sitio canónico es `/post`.
- **`wrangler.jsonc` → `html_handling: "drop-trailing-slash"`.** Sin él, Cloudflare redirige `/post` a `/post/` (307), lo contrario del canonical y del sitemap. Con él, `/post` responde 200 y `/post/` redirige a `/post`. Si se despliega en *Cloudflare Pages clásico* (no Workers Assets) esa opción no existe: habría que poner `build.format: 'file'` en `astro.config.ts`.
- **`public/_redirects` sin `!`.** Con Workers Assets la sintaxis `301!` invalida **todas** las reglas (0 válidas); sin `!` se parsean todas. Las rutas de origen no existen como fichero, así que no hace falta forzar.
- **Categorías de WordPress** (`/category/destinos/argentina/`, etc.) redirigen a la pilar o categoría equivalente. En el export de Search Console no tenían clics, solo enlaces entrantes.
- **Sitemap** (`/sitemap_index.xml` → `/sitemap-index.xml`) y **feed** (`/feed` → `/rss.xml`).
- **Pendiente de decidir:** las imágenes antiguas `/wp-content/uploads/...` dejarán de existir con el nuevo dominio. Para no perder el tráfico de Google Imágenes ni los hotlinks, se puede mantener WordPress solo como almacén de medios en un subdominio, o aceptar la pérdida.
- Tras publicar: enviar `sitemap-index.xml` a Search Console, cambiar la propiedad si cambia el dominio y revisar «Páginas con redirección» y «No encontrada (404)» durante las primeras semanas.
