import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig, fontProviders } from 'astro/config';

import { unified } from '@astrojs/markdown-remark';

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';
import type { AstroIntegration } from 'astro';

import astrowind from './vendor/integration';

import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin, affiliateLinksRehypePlugin, consentEmbedsRehypePlugin } from './src/utils/frontmatter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Fecha de última modificación de cada post para <lastmod> en el sitemap.
 * Se toma de `updateDate` (o `publishDate`) del frontmatter: es explícita y no depende de git ni de la fecha de compilación.
 * El slug del post es el nombre del archivo (permalink '/%slug%').
 */
const lastmodBySlug = new Map<string, string>();
const postsDir = path.join(__dirname, 'src', 'data', 'post');
if (fs.existsSync(postsDir)) {
  for (const file of fs.readdirSync(postsDir)) {
    if (!/\.mdx?$/.test(file)) continue;
    const head = fs.readFileSync(path.join(postsDir, file), 'utf8').split(/^---\s*$/m)[1] ?? '';
    const fields = new Map<string, string>();
    for (const line of head.split(/\r?\n/)) {
      const m = line.match(/^(\w+):\s*["']?([^"']+?)["']?\s*$/);
      if (m) fields.set(m[1], m[2]);
    }
    const raw = fields.get('updateDate') ?? fields.get('publishDate');
    const date = raw ? new Date(raw) : undefined;
    if (date && !Number.isNaN(date.getTime())) lastmodBySlug.set(file.replace(/\.mdx?$/, ''), date.toISOString());
  }
}

const hasExternalScripts = false;
const whenExternalScripts = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

export default defineConfig({
  output: 'static',

  // Cloudflare Pages sirve /post desde post.html y redirige /post/ a /post (coherente con trailingSlash: false).
  // Con el formato por defecto (post/index.html) Pages haría lo contrario: /post -> /post/.
  build: { format: 'file' },

  // Prefetch links as they enter the viewport for snappier navigations
  // (works together with <ClientRouter />, which enables prefetch by default).
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  // Native Fonts API: self-hosts + subsets + preloads Inter and generates
  // metric-adjusted fallbacks. Injected via <Font /> in Layout.astro and
  // consumed through the `--font-inter` CSS variable in CustomStyles.astro.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
  ],

  integrations: [
    sitemap({
      // Solo URLs indexables: sin /tag/* (noindex) ni páginas de paginación.
      filter: (page) =>
        !/\/(aviso-legal|privacidad|cookies|suscripcion-confirmada|suscripcion-error)\/?$/.test(page) &&
        !/\/tag\//.test(page) &&
        !/\/(blog|category\/[^/]+)\/\d+\/?$/.test(page),
      // <lastmod> solo en los posts, con su fecha real de actualización.
      serialize: (item) => {
        const slug = new URL(item.url).pathname.replace(/^\/|\/$/g, '');
        const lastmod = lastmodBySlug.get(slug);
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
    }),
    mdx(),
    icon({
      // Local SVG icons (used as <Icon name="file-name" />) live next to the other assets.
      iconDir: 'src/assets/icons',
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),

    compress({
      // csso off on purpose: its parser doesn't understand the media range
      // syntax Tailwind v4 emits for breakpoints (`@media (width>=48rem)`) and
      // silently drops every one of those blocks — the site then renders as if
      // all `md:`/`lg:` classes were missing. lightningcss parses it correctly.
      CSS: { csso: false, lightningcss: { minify: true } },
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),

    astrowind({
      config: './src/config.yaml',
    }),
  ],

  image: {
    // Astro's default Sharp service handles local images.
    //
    // Most remote CDN images (Unsplash, Cloudinary, Imgix…) are routed by
    // src/components/common/Image.astro through `unpic`, which rewrites the
    // URL with CDN-side query parameters and serves it straight from the
    // provider — Astro never downloads it, so they don't need to be listed.
    //
    // `domains` only matters for remote URLs that fall through to Astro's
    // native <Image /> (i.e. providers Unpic can't detect, like Pixabay).
    // Listed entries are authorized to be processed by Sharp.
    // Unsplash is listed so post covers can be rendered as real 1200×626 Open Graph images.
    domains: ['cdn.pixabay.com', 'images.unsplash.com'],

    // Emit responsive styles for the native <Image layout=…> used by
    // src/components/common/Image.astro (local images). Utility classes on
    // each usage still win, since these styles use low-specificity selectors.
    responsiveStyles: true,
  },

  markdown: {
    processor: unified({
      remarkPlugins: [readingTimeRemarkPlugin],
      rehypePlugins: [responsiveTablesRehypePlugin, affiliateLinksRehypePlugin, consentEmbedsRehypePlugin],
    }),
    shikiConfig: {
      // Code blocks follow the site theme; see the `.astro-code` rules in tailwind.css.
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
