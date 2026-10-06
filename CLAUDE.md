# 🌍 Proyecto: Mochileando sin Barreras (Migración Astro)

## 📌 Contexto del Proyecto
Migración del blog de viajes "Mochileando sin Barreras" (Viajera Sorda) desde WordPress hacia una arquitectura moderna, rápida y estática utilizando **Astro (Tema AstroWind)** y **MDX**. 
El objetivo principal es maximizar el rendimiento (Core Web Vitals), optimizar la conversión (CTAs unificados) y mantener una estructura SEO impecable de Clústeres/Pilar.

## 🎨 Manual de Marca y Estilo Visual
Toda la interfaz debe respetar el Manual de Marca oficial. No inventar colores ni fuentes fuera de esta lista.

### 🖌️ Paleta de Colores Oficiales
*   **Rojos/Naranjas (Énfasis y Conversión):**
    *   Primario cálido: `#D87068` (C:12 M:66 Y:63 K:0 | R:216 G:112 B:96)
    *   Secundarios cálidos: `#E58760` / `#E5AB5F`
*   **Verdes/Teal (Confianza, Estructura y CTAs principales):**
    *   Primario frío: `#36A09F` (C:74 M:15 Y:40 K:1 | R:54 G:160 B:159)
    *   Secundarios fríos: `#61B4BA` / `#A5CFD2`

### 🔤 Tipografías
*   **Titulares / Logos:** `Richardson Script` y `EASTMAN`.
*   **Textos / RRSS (Canva):** `Breathing` y `MONTSERRAT`.

### 🛡️ Reglas del Logotipo
*   Mantener siempre un **área de protección** limpia (libre de otros elementos) alrededor del logo.
*   Prohibido modificar colores, estirar, condensar o rotar el logotipo.
*   Asegurar un alto contraste si se aplica sobre fotografías de fondo.

---

## 🏗️ Arquitectura de Contenido y SEO (Google Best Practices)

1.  **Páginas Pilar (Clústeres):** 
    *   Deben ir en `src/pages/` (ej. `mejor-esim-para-viajar.astro`).
    *   Utilizan el layout `<Layout>` de página estática para evitar que AstroWind fuerce la imagen de cabecera típica de los posts.
2.  **Artículos / Reseñas (Nodos):** 
    *   Deben ir en `src/data/post/` como archivos `.mdx`.
    *   Deben apuntar y enlazar a las páginas pilar para transferir autoridad (Link Juice).
3.  **URLs Limpias:** 
    *   **ESTRICTO:** Todos los enlaces internos deben ir **SIN la barra final (`/`)** para evitar redirecciones 301 innecesarias y errores 404 (ej. `href="/esim-holafly-opiniones"`).
4.  **Schema Markup (Datos Estructurados):**
    *   Incluir esquemas JSON-LD en el *frontmatter* YAML de los MDX. Usar `@type: "TechArticle"` o `Article` y siempre anidar preguntas frecuentes con `@type: "FAQPage"`.
5.  **Estructura de Encabezados (H1-H6):**
    *   Solo un `H1` por página. Mantener una jerarquía semántica lógica, sin saltos de nivel.

---

## 🧩 Componentes y UI/UX (Llamadas a la Acción)

Hemos unificado todos los CTAs para evitar los "botones gigantes". Usamos un diseño de caja horizontal, sutil, con barra de acento lateral usando el color corporativo `#36A09F`.

**Componente Principal:** `src/components/mdx/BotonAfiliado.astro`
```astro
---
const { href, text } = Astro.props;
---
<div class="not-prose bg-teal-50 dark:bg-slate-800 border-l-4 border-[#36A09F] p-4 rounded-r-xl my-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
  <span class="text-slate-800 dark:text-slate-200 font-medium text-sm md:text-base">¿Quieres consultar las tarifas para tu destino?</span>
  <a 
    href={href} 
    target="_blank" 
    rel="nofollow sponsored noopener" 
    class="bg-[#36A09F] hover:bg-[#2c8584] text-white text-sm font-bold px-5 py-2.5 rounded-lg shadow transition whitespace-nowrap text-center w-full sm:w-auto no-underline"
  >
    {text}
  </a>
</div>
```
*Instrucción para IA:* Utilizar `<BotonAfiliado href="..." text="..." />` en todos los archivos `.mdx` que requieran conversión.

---

## ♿ Accesibilidad Web (a11y)

1.  **Contraste de Color:** Asegurar un ratio de contraste mínimo de 4.5:1 (AA) para textos normales. El blanco `#FFFFFF` sobre el verde `#36A09F` o el rojo `#D87068` está permitido.
2.  **Atributos ARIA y Semántica:**
    *   Los botones que abren modales o menús deben usar `aria-expanded` y `aria-controls`.
    *   Los enlaces que abren en nueva pestaña (`target="_blank"`) deben llevar siempre `rel="noopener noreferrer"`.
3.  **Imágenes (`alt`):** Toda imagen (`<img>` o componente `<Image />` de Astro) debe tener texto alternativo descriptivo. Si es meramente decorativa, usar `alt=""`.

---

## 🤖 Comandos y Reglas de Comportamiento para Claude Code

*   **No destruir contenido en refactorizaciones:** Al pasar un texto de WordPress a Astro/MDX, **JAMÁS** resumas ni elimines párrafos. El contenido largo (3000+ palabras) es vital para el SEO. Mantén el texto intacto.
*   **Rutas relativas seguras:** Usar el alias `~/` para apuntar a assets o componentes (ej. `import BotonAfiliado from '~/components/mdx/BotonAfiliado.astro';`).
*   **Frontmatter Limpio:** Mantén estricta la indentación YAML en los metadatos y esquemas.
*   **Respetar Tailwind:** Usar las clases utilitarias de Tailwind CSS existentes en el proyecto. No crear CSS en línea (`style="..."`) a menos que sea estrictamente necesario para variables dinámicas.
---

## 🧭 Arquitectura de clústeres e interlinking (hub & spoke)

La web se organiza en **clústeres temáticos** definidos en `src/data/clusters.ts` (Seguros de viaje, Tarjetas para viajar, eSIM para viajar; próximamente Destinos y Alquiler de coches).

*   **Cada clúster = 1 página pilar** (`src/pages/mejor-*.astro`) **+ N posts** (`src/data/post/*.mdx`) **+ 1 categoría** (`/category/<slug>`).
*   **`category` en el frontmatter de un post debe ser EXACTAMENTE el `category` del clúster** (p. ej. `category: Tarjetas para viajar`). No usar categorías genéricas como «Recursos viajeros».
*   El enlazado entre hermanos lo hace **automáticamente** `ClusterLinks.astro` (píldora «Guía de…» arriba + bloque con pilar, reseñas, comparativas y pilares de otros clústeres abajo). Los enlaces manuales dentro del texto siguen siendo bienvenidos, pero no sustituyen al bloque automático.
*   **Nuevo clúster:** añadir entrada en `clusters.ts` → crear su página pilar con `<ClusterLinks variant="pillar" cluster={...} />` y `Breadcrumbs` → poner el `category` en los posts → activar su desplegable en `src/navigation.ts` (Destinos y Alquiler de coches están comentados ahí, listos).
*   **Canonical:** NO definir `metadata.canonical` en los posts (el sitio lo calcula **sin barra final**, coherente con `trailingSlash: false`). Copiar el canonical del WordPress (con `/`) provoca canonical ≠ URL real.
*   **Título SEO:** definir `metadata.title` ≤ 62 caracteres; la plantilla global ya NO añade el sufijo de marca. `excerpt` ≈ 150 caracteres (se usa como meta description).
*   **Enlaces internos:** siempre relativos, sin barra final y sin dominio (`/tarjeta-n26`, no `https://mochileandosinbarreras.com/tarjeta-n26/`).
*   **Sitemap:** excluye `/tag/*` y paginación. Las páginas de paginación son `noindex`.
*   **Botones de afiliado:** `BotonAfiliado` con subtítulo propio (el texto por defecto habla de «tarifas para tu destino» y solo vale para seguros).
*   **Clúster sin pilar todavía:** en `clusters.ts` el campo `pillar` es opcional (caso actual de *Alquiler de coches*). Al crear `/mejor-alquiler-de-coches.astro`, descomentar `pillar` en su entrada y añadir la guía como primer elemento del desplegable «Coches» en `navigation.ts`.
*   **Menú principal:** máximo ~7 elementos (se solapa por debajo de 1100 px). «Contacto» está en el desplegable «Acerca de» (junto a Quiénes somos y Trabajemos juntos) y en el pie.

---

## 🗺️ Arquitectura de Destinos, Accesibilidad y Vuelta al mundo

El plan completo (datos de Search Console, pilares, interlinking, redirecciones 301 y orden de migración por oleadas) está en `docs/arquitectura-destinos.md`. Reglas clave:

*   **Mantener los slugs planos de WordPress** (`/que-ver-y-hacer-en-los-altares-chubut`). No cambiar URLs que ya posicionan; redirigir solo lo que se retira.
*   **Pilar = mejor post existente** cuando el clúster tiene menos de ~5 posts (p. ej. `/que-ver-y-hacer-en-eslovenia`, `/guia-siberia`). Página pilar nueva solo donde haya contenido de sobra (`/guia-patagonia`).
*   **Cada región/tema = un clúster** en `clusters.ts`, con `category` exacta en los posts. No usar categorías jerárquicas de WordPress.
*   **Interlinking mínimo por post:** pilar (automático), 2 enlaces laterales con anchor descriptivo y un puente comercial en contexto (alquiler, eSIM o seguro según la intención).
*   **Migrar siempre con el HTML íntegro de la API REST de WordPress** (`/wp-json/wp/v2/posts?slug=...`), nunca con resúmenes: no se resume ni elimina contenido.
