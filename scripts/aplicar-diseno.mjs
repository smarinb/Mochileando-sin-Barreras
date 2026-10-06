// Contraste y diseño: tokens de color accesibles (WCAG AA), foco visible, favicons de marca,
// iconos en lugar de emojis, enlace "saltar al contenido", logo responsive, modo oscuro en
// componentes MDX y limpieza de colores de plantilla.
//
// Uso (desde la raíz del proyecto, donde está package.json):
//   node scripts/aplicar-diseno.mjs
//
// Seguridad:
//  - Edita TUS archivos actuales mediante fragmentos exactos; no los sustituye por copias mías,
//    salvo los pocos archivos de plantilla (o míos) cuyo contenido original se verifica por hash.
//  - Todo o nada: si algo no cuadra no escribe NADA y te dice qué.
//  - Copia de cada archivo tocado en .backup-diseno/
//  - Idempotente: si ya está aplicado, no cambia nada.
//  - Conserva los saltos de línea (CRLF/LF) de cada archivo de texto.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = process.cwd();
const HERE = path.dirname(fileURLToPath(import.meta.url));
const FILES = path.join(HERE, 'diseno-archivos');
const BACKUP = path.join(ROOT, '.backup-diseno');

if (!fs.existsSync(path.join(ROOT, 'package.json')) || !fs.existsSync(path.join(ROOT, 'src', 'content.config.ts'))) {
  console.error('ERROR: ejecútalo desde la raíz del proyecto (mochileando-blog/).');
  process.exit(1);
}

const abs = (rel) => path.join(ROOT, rel);
const eolOf = (t) => (t.includes('\r\n') ? '\r\n' : '\n');
const lf = (t) => t.replace(/\r\n/g, '\n');
const sha1 = (buf) => crypto.createHash('sha1').update(buf).digest('hex');
const sha1Text = (t) => sha1(Buffer.from(lf(t), 'utf8'));
const countOf = (text, s) => text.split(s).length - 1;

/** rel -> { data: string|Buffer } | { del: true } */
const pending = new Map();
const errors = [];
const notes = [];

// ───────────────────────── 1. Ediciones puntuales ─────────────────────────
const edits = {
  // ── Tokens de color y foco ──
  'src/assets/styles/tailwind.css': [
    {
      old:
        '  --aw-color-primary: #36A09F;\n  --aw-color-secondary: #61B4BA;\n  --aw-color-accent: #D87068;\n  --aw-color-text-heading: rgb(0 0 0);',
      neu:
        '  /* Marca (hex del logo): turquesa #36A09F, turquesa claro #61B4BA, terracota #D87068.\n' +
        '     Estas variantes cumplen contraste AA (WCAG 2.1) para texto y botones sobre fondo claro. */\n' +
        '  --aw-color-primary: #1f7f7e; /* relleno con texto blanco: 4.78:1 */\n' +
        '  --aw-color-primary-hover: #186867; /* hover con texto blanco: 6.53:1 */\n' +
        '  --aw-color-secondary: #61B4BA; /* solo decorativo */\n' +
        '  --aw-color-accent: #D87068; /* decorativo e iconos; con texto blanco solo en tamaño grande */\n' +
        '  --aw-color-accent-hover: #c26159;\n' +
        '  --aw-color-accent-strong: #b4524a; /* relleno con texto blanco: 4.95:1 */\n' +
        '  --aw-color-accent-soft: #f4a29b; /* texto sobre fotos oscurecidas (hero) */\n' +
        '  --aw-color-accent-text: #9a4a43; /* texto sobre fondo claro: 5.81:1 */\n' +
        '  --aw-color-link: #1f7f7e; /* enlaces sobre fondo claro: 4.54:1 */\n' +
        '  --aw-color-text-heading: rgb(0 0 0);',
    },
    {
      old:
        '  --aw-color-primary: #36A09F;\n  --aw-color-secondary: #61B4BA;\n  --aw-color-accent: #D87068;\n  --aw-color-text-heading: rgb(247 248 248);',
      neu:
        '  --aw-color-primary: #1f7f7e; /* relleno con texto blanco: 4.78:1 */\n' +
        '  --aw-color-primary-hover: #186867;\n' +
        '  --aw-color-secondary: #61B4BA;\n' +
        '  --aw-color-accent: #D87068;\n' +
        '  --aw-color-accent-hover: #c26159;\n' +
        '  --aw-color-accent-strong: #b4524a;\n' +
        '  --aw-color-accent-soft: #f4a29b;\n' +
        '  --aw-color-accent-text: #e0807a; /* texto sobre azul noche 6.41:1 y sobre tarjetas slate-800 5.25:1 */\n' +
        '  --aw-color-link: #61B4BA; /* enlaces sobre azul noche: 7.43:1 */\n' +
        '  --aw-color-text-heading: rgb(247 248 248);',
    },
    {
      old: '  --color-link: var(--aw-color-link, var(--aw-color-primary));',
      neu:
        '  --color-link: var(--aw-color-link, var(--aw-color-primary));\n' +
        '  --color-primary-hover: var(--aw-color-primary-hover);\n' +
        '  --color-accent-hover: var(--aw-color-accent-hover);\n' +
        '  --color-accent-strong: var(--aw-color-accent-strong);\n' +
        '  --color-accent-soft: var(--aw-color-accent-soft);\n' +
        '  --color-accent-text: var(--aw-color-accent-text);',
    },
    {
      // El foco de teclado pasa a la regla global :focus-visible (azul de plantilla fuera)
      old: 'duration-200 focus:ring-blue-500 focus:ring-offset-blue-200 focus:ring-2 focus:ring-offset-2 hover:bg-gray-100',
      neu: 'duration-200 hover:bg-gray-100',
    },
    {
      // El hover usaba el turquesa claro con texto blanco (2.1:1)
      old:
        'hover:bg-secondary hover:border-secondary hover:text-white dark:text-white dark:bg-primary dark:border-primary dark:hover:border-secondary dark:hover:bg-secondary',
      neu: 'hover:bg-primary-hover hover:border-primary-hover hover:text-white dark:text-white',
    },
    {
      old: '  background-color: var(--shiki-dark-bg) !important;\n}',
      neu:
        '  background-color: var(--shiki-dark-bg) !important;\n}\n\n' +
        '/* Foco de teclado visible y de marca (2px, contraste >= 3:1 sobre fondo claro y oscuro). */\n' +
        ':where(a, button, input, textarea, select, summary, [tabindex]):focus-visible {\n' +
        '  outline: 2px solid var(--aw-color-link);\n' +
        '  outline-offset: 2px;\n' +
        '}\n\n' +
        '/* Selección de texto con la marca */\n' +
        '::selection {\n' +
        '  background-color: color-mix(in srgb, #36a09f 30%, white);\n' +
        '  color: #0f172a;\n' +
        '}\n' +
        '.dark ::selection {\n' +
        '  background-color: color-mix(in srgb, #61b4ba 45%, #0f172a);\n' +
        '  color: #ffffff;\n' +
        '}',
    },
  ],

  // ── Enlaces del artículo: nada de azul de plantilla en modo oscuro ──
  'src/components/blog/SinglePost.astro': [
    { old: 'prose-a:text-primary dark:prose-a:text-blue-400', neu: 'prose-a:text-link' },
  ],
  'src/layouts/MarkdownLayout.astro': [
    { old: 'prose-a:text-primary dark:prose-a:text-blue-400', neu: 'prose-a:text-link' },
  ],

  // ── Hover de enlaces: token adaptativo (en oscuro `primary` no tiene contraste como texto) ──
  'src/components/blog/Tags.astro': [
    { old: 'hover:text-primary dark:hover:text-gray-200', neu: 'hover:text-link dark:hover:text-gray-200' },
  ],
  'src/components/common/Breadcrumbs.astro': [
    { old: 'hover:text-primary hover:underline', neu: 'hover:text-link hover:underline' },
  ],
  'src/components/ui/Button.astro': [
    { old: "link: 'cursor-pointer hover:text-primary',", neu: "link: 'cursor-pointer hover:text-link'," },
  ],
  'src/components/widgets/BlogHighlightedPosts.astro': [
    { old: 'hover:text-primary transition ease-in duration-200 block mb-6', neu: 'hover:text-link transition ease-in duration-200 block mb-6' },
  ],
  'src/components/blog/GridItem.astro': [{ old: 'hover:text-[#D87068]', neu: 'hover:text-accent-text' }],
  'src/components/blog/ListItem.astro': [{ old: 'hover:text-[#D87068]', neu: 'hover:text-accent-text' }],

  // ── Componentes que añadí yo (índice y botón de subir) ──
  'src/components/mdx/Indice.astro': [
    { old: 'class="h-6 w-6 text-[#36A09F]"', neu: 'class="h-6 w-6 text-link"' },
    { old: 'hover:text-[#D87068] dark:text-slate-200', neu: 'hover:text-accent-text dark:text-slate-200' },
    { old: 'hover:text-[#36A09F] dark:text-slate-400 dark:hover:text-[#61B4BA]', neu: 'hover:text-link dark:text-slate-400' },
  ],
  'src/components/common/ScrollToTop.astro': [
    { old: 'bg-[#D87068] p-3', neu: 'bg-accent p-3' },
    { old: 'hover:bg-[#c26159]', neu: 'hover:bg-accent-hover' },
  ],

  // ── Componentes MDX: tokens y modo oscuro ──
  'src/components/mdx/CajaAviso.astro': [
    {
      old: "info: 'bg-[#E5F5F6] border-[#36A09F] text-[#1f5c5b]',",
      neu: "info: 'bg-[#E5F5F6] border-primary text-[#1f5c5b] dark:bg-slate-800 dark:border-secondary dark:text-slate-100',",
    },
    {
      old: "alerta: 'bg-[#FDF2F0] border-[#D87068] text-[#8a3c35]',",
      neu: "alerta: 'bg-[#FDF2F0] border-accent text-[#8a3c35] dark:bg-slate-800 dark:border-accent dark:text-slate-100',",
    },
  ],
  'src/components/mdx/BotonAfiliado.astro': [
    { old: 'border-l-4 border-[#36A09F]', neu: 'border-l-4 border-primary' },
    { old: 'bg-[#36A09F] hover:bg-[#2c8584] text-white', neu: 'bg-primary hover:bg-primary-hover text-white' },
  ],

  // ── Posts: bloques HTML con colores incrustados ──
  'src/data/post/descuento-heymondo.mdx': [
    { old: 'text-[#36A09F] font-bold text-2xl mt-0 mb-2', neu: 'text-link font-bold text-2xl mt-0 mb-2' },
    {
      old: 'bg-[#D87068] text-white px-5 py-3 rounded-xl font-bold hover:bg-[#c26159]',
      neu: 'bg-accent-strong text-white px-5 py-3 rounded-xl font-bold hover:bg-accent-text',
      count: 3,
    },
  ],
  'src/data/post/esimflag-opiniones.mdx': [
    { old: 'text-[#36A09F] font-bold text-2xl mt-0 mb-2', neu: 'text-link font-bold text-2xl mt-0 mb-2' },
    {
      old: 'bg-[#D87068] text-white px-5 py-3 rounded-xl font-bold hover:bg-[#c26159]',
      neu: 'bg-accent-strong text-white px-5 py-3 rounded-xl font-bold hover:bg-accent-text',
      count: 3,
    },
  ],
  'src/data/post/esim-roamic-opiniones.mdx': [
    { old: 'border-l-4 border-[#36A09F]', neu: 'border-l-4 border-primary', count: 3 },
    { old: 'bg-[#36A09F] hover:bg-[#2c8584] text-white', neu: 'bg-primary hover:bg-primary-hover text-white', count: 3 },
  ],

  // ── Home: tokens e iconos de Tabler en lugar de emojis ──
  'src/pages/index.astro': [
    {
      old: "import heroImage from '~/assets/images/hero-image.webp';",
      neu: "import heroImage from '~/assets/images/hero-image.webp';\nimport { Icon } from 'astro-icon/components';",
    },
    { old: '<span class="text-[#D87068]">Viajar sin barreras:</span>', neu: '<span class="text-accent-soft">Viajar sin barreras:</span>' },
    {
      old: 'bg-[#36A09F] text-white border-none hover:bg-[#2c8584] shadow-xl',
      neu: 'bg-primary text-white border-none hover:bg-primary-hover shadow-xl',
    },
    {
      old: '🛡️ 5% Descuento Seguro Heymondo',
      neu: '<Icon name="tabler:shield-check" class="mr-2 h-5 w-5" aria-hidden="true" />5% Descuento Seguro Heymondo',
    },
    {
      old: '🌍 Mejor eSIM para Viajar',
      neu: '<Icon name="tabler:world" class="mr-2 h-5 w-5" aria-hidden="true" />Mejor eSIM para Viajar',
    },
    {
      old: '<div class="text-[#36A09F] text-3xl mb-4">🛡️</div>',
      neu:
        '<div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-link"><Icon name="tabler:shield-check" class="h-7 w-7" aria-hidden="true" /></div>',
    },
    {
      old: '<div class="text-[#36A09F] text-3xl mb-4">📶</div>',
      neu:
        '<div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-link"><Icon name="tabler:wifi" class="h-7 w-7" aria-hidden="true" /></div>',
    },
    {
      old: '<div class="text-[#36A09F] text-3xl mb-4">💳</div>',
      neu:
        '<div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-link"><Icon name="tabler:credit-card" class="h-7 w-7" aria-hidden="true" /></div>',
    },
    {
      old: 'btn bg-[#36A09F] text-white hover:bg-[#2c8584] text-center',
      neu: 'btn bg-primary text-white hover:bg-primary-hover text-center',
      count: 3,
    },
    {
      old: 'text-[#D87068] font-bold uppercase tracking-wider text-sm',
      neu: 'text-accent-text font-bold uppercase tracking-wider text-sm',
    },
    {
      old: 'class="text-[#D87068] font-bold hover:underline inline-flex items-center gap-2"',
      neu: 'class="text-accent-text font-bold hover:underline inline-flex items-center gap-2"',
    },
    {
      old: 'btn bg-[#2a9d8f] text-white hover:bg-[#238276] px-8 py-3 rounded-xl font-bold shadow-lg inline-block',
      neu: 'btn bg-primary text-white hover:bg-primary-hover px-8 py-3 rounded-xl font-bold shadow-lg inline-flex items-center gap-2',
    },
    {
      old: '📘 Descubrir el libro',
      neu: '<Icon name="tabler:book-2" class="h-5 w-5" aria-hidden="true" />Descubrir el libro',
    },
  ],
  'src/navigation.ts': [{ old: "'📖 Libro de Cris'", neu: "'Libro de Cris', icon: 'tabler:book-2'" }],

  // ── Logo responsive y sin salto de maquetación ──
  'src/components/Logo.astro': [
    { old: 'class="h-20 w-auto" />', neu: 'class="h-14 w-auto md:h-20" width="3986" height="1925" />' },
  ],

  // ── Accesibilidad: "Saltar al contenido" + color de la barra del navegador móvil ──
  'src/layouts/PageLayout.astro': [
    {
      old: "  {Astro.slots.has('header') ? <slot name=\"header\" /> : <Header {...headerData} isSticky showRssFeed showToggleTheme />}",
      neu:
        '  <a\n' +
        '    href="#contenido"\n' +
        '    class="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2.5 focus:font-semibold focus:text-white focus:shadow-xl"\n' +
        '  >\n' +
        '    Saltar al contenido\n' +
        '  </a>\n' +
        "  {Astro.slots.has('header') ? <slot name=\"header\" /> : <Header {...headerData} isSticky showRssFeed showToggleTheme />}",
    },
    { old: '  <main class="flex-1">', neu: '  <main id="contenido" tabindex="-1" class="flex-1 focus:outline-none">' },
  ],
  'src/components/common/CommonMeta.astro': [
    {
      old: '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
      neu:
        '<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n' +
        '<meta name="theme-color" content="#FAF9F6" media="(prefers-color-scheme: light)" />\n' +
        '<meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />',
    },
  ],
};

for (const [rel, steps] of Object.entries(edits)) {
  if (!fs.existsSync(abs(rel))) {
    errors.push(`${rel}: el archivo no existe`);
    continue;
  }
  let text = fs.readFileSync(abs(rel), 'utf8');
  const eol = eolOf(text);
  let changed = false;
  let failed = false;
  for (const s of steps) {
    const o = s.old.replace(/\n/g, eol);
    const n = s.neu.replace(/\n/g, eol);
    const expected = s.count ?? 1;
    // ya aplicado: el texto nuevo está y el viejo ya no (o el nuevo lo contiene)
    if (countOf(text, n) >= expected && countOf(text, o) === (n.includes(o) ? countOf(text, n) : 0)) continue;
    const found = countOf(text, o);
    if (found !== expected) {
      errors.push(`${rel}: esperaba ${expected} vez/veces ${JSON.stringify(s.old.slice(0, 70))} y hay ${found}`);
      failed = true;
      break;
    }
    text = text.split(o).join(n);
    changed = true;
  }
  if (failed) continue;
  if (changed) pending.set(rel, { data: text });
  else notes.push(`= ${rel}: ya aplicado`);
}

// ───────────────────────── 2. Sustituciones de archivo completo (verificadas por hash) ─────────────────────────
// text: se compara ignorando CRLF/LF. bin: byte a byte.
const replacements = [
  { rel: 'src/components/CustomStyles.astro', src: 'CustomStyles.astro', text: true, originalSha1: 'b8fe692d330ad6a6cee03e275c26c7f2742f3d52' },
  { rel: 'src/components/Favicons.astro', src: 'Favicons.astro', text: true, originalSha1: '789814ff7a41bebc599f43367563c222fa9b88a2' },
  { rel: 'src/pages/404.astro', src: '404.astro', text: true, originalSha1: '0c38e9aed4c05fac62013f43b8e8c5049ef9234a' },
  { rel: 'src/assets/favicons/favicon.ico', src: 'favicon.ico', text: false, originalSha1: 'a734c2a032451ebd3078c0f414f7544d7727a03b' },
  { rel: 'src/assets/favicons/apple-touch-icon.png', src: 'apple-touch-icon.png', text: false, originalSha1: 'ff4888adea60a48f5dfc02481473fb9acafb5408' },
];

for (const f of replacements) {
  if (!fs.existsSync(abs(f.rel))) {
    errors.push(`${f.rel}: el archivo no existe`);
    continue;
  }
  const curBuf = fs.readFileSync(abs(f.rel));
  const freshBuf = fs.readFileSync(path.join(FILES, f.src));
  const cur = f.text ? sha1Text(curBuf.toString('utf8')) : sha1(curBuf);
  const fresh = f.text ? sha1Text(freshBuf.toString('utf8')) : sha1(freshBuf);
  if (cur === fresh) {
    notes.push(`= ${f.rel}: ya aplicado`);
  } else if (cur === f.originalSha1) {
    if (f.text) {
      const eol = eolOf(curBuf.toString('utf8'));
      pending.set(f.rel, { data: lf(freshBuf.toString('utf8')).replace(/\n/g, eol) });
    } else {
      pending.set(f.rel, { data: freshBuf });
    }
    notes.push(`+ ${f.rel}: sustituido`);
  } else {
    errors.push(`${f.rel}: lo has modificado respecto al original; no lo sobrescribo para no perder tus cambios`);
  }
}

// Archivos nuevos (favicons PNG): solo se crean si no existen
for (const name of ['favicon-32.png', 'favicon-192.png']) {
  const rel = `src/assets/favicons/${name}`;
  const fresh = fs.readFileSync(path.join(FILES, name));
  if (fs.existsSync(abs(rel))) {
    if (sha1(fs.readFileSync(abs(rel))) === sha1(fresh)) notes.push(`= ${rel}: ya existe`);
    else errors.push(`${rel}: ya existe y es distinto; no lo sobrescribo`);
  } else {
    pending.set(rel, { data: fresh });
    notes.push(`+ ${rel}: nuevo`);
  }
}

// Favicon SVG de la plantilla de Astro: se elimina solo si sigue siendo el original
{
  const rel = 'src/assets/favicons/favicon.svg';
  if (fs.existsSync(abs(rel))) {
    if (sha1Text(fs.readFileSync(abs(rel), 'utf8')) === '5004b1633d48625a8718dadd1486754c1f6a39c8') {
      pending.set(rel, { del: true });
      notes.push(`- ${rel}: eliminado (era el logo de Astro)`);
    } else {
      notes.push(`! ${rel}: no es el original de la plantilla; lo dejo como está`);
    }
  }
}

// ───────────────────────── 3. Escritura (todo o nada) ─────────────────────────
for (const n of notes) console.log(n);

if (errors.length) {
  console.error('\nNO SE HA ESCRITO NADA. Problemas encontrados:');
  for (const e of errors) console.error('  - ' + e);
  console.error('\nSi tus archivos han cambiado respecto al original, pásame el mensaje y lo adapto.');
  process.exit(1);
}

if (!pending.size) {
  console.log('\nNada que hacer: el diseño ya estaba aplicado.');
  process.exit(0);
}

for (const [rel, op] of pending) {
  if (fs.existsSync(abs(rel))) {
    const dest = path.join(BACKUP, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    if (!fs.existsSync(dest)) fs.copyFileSync(abs(rel), dest);
  }
  if (op.del) fs.unlinkSync(abs(rel));
  else {
    fs.mkdirSync(path.dirname(abs(rel)), { recursive: true });
    fs.writeFileSync(abs(rel), op.data);
  }
}
console.log(`\nOK: ${pending.size} archivo(s) tocados. Copias en .backup-diseno/`);
console.log('Siguiente paso: npm run build');
