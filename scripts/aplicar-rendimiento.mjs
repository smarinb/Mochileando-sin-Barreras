// Rendimiento: hero en AVIF/WebP responsive, miniaturas optimizadas, logo ligero, imágenes de WordPress
// traídas a src/assets, LCP de los posts sin depender de JavaScript, escaneo de Tailwind limitado a src/,
// prefetch menos agresivo y limpieza de imágenes de plantilla sin uso.
//
// Uso (desde la raíz del proyecto, donde está package.json):
//   node scripts/aplicar-rendimiento.mjs
//
// Necesita conexión a internet SOLO para descargar 2 imágenes de tu web actual (WordPress).
// Si no hay red, el resto se aplica igual y esas 2 imágenes se dejan como estaban; vuelve a ejecutarlo
// con red para completarlo.
//
// Seguridad:
//  - Edita TUS archivos mediante fragmentos exactos; los pocos que sustituye enteros se verifican por hash.
//  - Todo o nada para el código: si algo no cuadra no escribe NADA y te dice qué.
//  - Copia de cada archivo tocado en .backup-rendimiento/
//  - Idempotente, y conserva los saltos de línea (CRLF/LF) de cada archivo de texto.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = process.cwd();
const HERE = path.dirname(fileURLToPath(import.meta.url));
const FILES = path.join(HERE, 'rendimiento-archivos');
const BACKUP = path.join(ROOT, '.backup-rendimiento');
const IMG_DIR = 'src/assets/images';

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

/** rel -> { data } | { del: true } */
const pending = new Map();
const errors = [];
const notes = [];

// ───────────────────────── 0. Imágenes que se generan o descargan ─────────────────────────
// 0a) Logo ligero, generado a partir del SVG original del proyecto (sin red)
const LOGO_OUT = `${IMG_DIR}/logo-header.webp`;
const LOGO_SRC = `${IMG_DIR}/1-Logo-Principal-RGB.svg`;
if (!fs.existsSync(abs(LOGO_OUT))) {
  if (!fs.existsSync(abs(LOGO_SRC))) {
    errors.push(`${LOGO_SRC}: no existe; no puedo generar ${LOGO_OUT}`);
  } else {
    const buf = await sharp(fs.readFileSync(abs(LOGO_SRC)), { density: 300 })
      .resize({ height: 300 })
      .webp({ quality: 92, alphaQuality: 100, effort: 6 })
      .toBuffer();
    pending.set(LOGO_OUT, { data: buf });
    notes.push(`+ ${LOGO_OUT}: generado desde el SVG (${(buf.length / 1024).toFixed(1)} KB)`);
  }
} else {
  notes.push(`= ${LOGO_OUT}: ya existe`);
}

// 0b) Imágenes de la home que hoy se cargan desde WordPress (se descargan a src/assets)
const wpImages = [
  {
    out: `${IMG_DIR}/historia-cris-sergio.webp`,
    url: 'https://mochileandosinbarreras.com/wp-content/uploads/2022/09/GOPR2012-1024x768.jpg.webp',
  },
  {
    out: `${IMG_DIR}/libro-quierete-sorda.webp`,
    url: 'https://mochileandosinbarreras.com/wp-content/uploads/2024/04/MOckup-LIBRO-CRIS.png.webp',
  },
];
let wpOk = true;
for (const img of wpImages) {
  if (fs.existsSync(abs(img.out))) {
    notes.push(`= ${img.out}: ya existe`);
    continue;
  }
  try {
    const res = await fetch(img.url, {
      signal: AbortSignal.timeout(25000),
      // cabeceras de navegador: algunos WordPress/Cloudflare rechazan peticiones sin User-Agent
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        Accept: 'image/avif,image/webp,image/*,*/*;q=0.8',
        Referer: 'https://mochileandosinbarreras.com/',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const meta = await sharp(buf).metadata(); // lanza error si no es una imagen válida
    if (!meta.width || meta.width < 150) throw new Error('imagen demasiado pequeña');
    pending.set(img.out, { data: buf });
    notes.push(`+ ${img.out}: descargada (${meta.width}x${meta.height}, ${(buf.length / 1024).toFixed(0)} KB)`);
  } catch (e) {
    wpOk = false;
    notes.push(
      `! ${img.out}: no se pudo descargar (${e.message}). Se deja la imagen de WordPress.\n` +
        `    Alternativa manual: abre ${img.url} en el navegador, guárdala como ${img.out} y reejecuta el script.`
    );
  }
}

// ───────────────────────── 1. Ediciones puntuales ─────────────────────────
/** @typedef {{ old?: string, olds?: string[], neu: string, count?: number }} Step */

const IMPORT_FINAL = wpOk ? "import { Image, getImage } from 'astro:assets';" : "import { getImage } from 'astro:assets';";
/** @type {Step[]} */
const indexSteps = [
  {
    // acepta cualquiera de los estados previos del import
    olds: ["import { Image } from 'astro:assets';", "import { getImage } from 'astro:assets';", "import { Image, getImage } from 'astro:assets';"],
    neu: IMPORT_FINAL,
  },
  {
    // Código del hero (LCP): AVIF con WebP de reserva; en móvil solo se ve el centro de la foto (object-cover),
    // así que se sirve un recorte vertical de 750x1050 en lugar de la imagen completa.
    old: 'const metadata = {',
    neu:
      '// Hero (LCP): AVIF (calidad 45, indistinguible bajo el degradado) con WebP de reserva.\n' +
      '// En teléfonos (<= 640px) se ve el 37% central de la foto: se sirve un recorte vertical, no la imagen completa.\n' +
      'const heroWidths = [640, 960, 1280, 1600];\n' +
      "const heroSrcset = async (format: 'avif' | 'webp', quality: number) =>\n" +
      '  (\n' +
      '    await Promise.all(\n' +
      '      heroWidths.map(async (width) => `${(await getImage({ src: heroImage, width, format, quality })).src} ${width}w`)\n' +
      '    )\n' +
      "  ).join(', ');\n" +
      'const [heroAvif, heroWebp, heroFallback, phoneAvif, phoneWebp] = await Promise.all([\n' +
      "  heroSrcset('avif', 45),\n" +
      "  heroSrcset('webp', 60),\n" +
      "  getImage({ src: heroImage, width: 1280, format: 'webp', quality: 60 }),\n" +
      "  getImage({ src: heroImage, width: 750, height: 1050, fit: 'cover', format: 'avif', quality: 45 }),\n" +
      "  getImage({ src: heroImage, width: 750, height: 1050, fit: 'cover', format: 'webp', quality: 60 }),\n" +
      ']);\n\n' +
      'const metadata = {',
  },
  {
    old:
      '      <Image \n' +
      '        src={heroImage} \n' +
      '        alt="Sergio y Cris viajando en campervan de Argentina a Alaska" \n' +
      '        class="w-full h-full object-cover object-center"\n' +
      '        loading="eager"\n' +
      '      />',
    neu:
      '      <picture class="block h-full w-full">\n' +
      '        <source media="(max-width: 640px)" type="image/avif" srcset={phoneAvif.src} />\n' +
      '        <source media="(max-width: 640px)" type="image/webp" srcset={phoneWebp.src} />\n' +
      '        <source type="image/avif" srcset={heroAvif} sizes="100vw" />\n' +
      '        <source type="image/webp" srcset={heroWebp} sizes="100vw" />\n' +
      '        <img\n' +
      '          src={heroFallback.src}\n' +
      '          alt="Sergio y Cris viajando en campervan de Argentina a Alaska"\n' +
      '          width="1600"\n' +
      '          height="900"\n' +
      '          class="w-full h-full object-cover object-center"\n' +
      '          loading="eager"\n' +
      '          fetchpriority="high"\n' +
      '          decoding="async"\n' +
      '        />\n' +
      '      </picture>',
  },
];
if (wpOk) {
  indexSteps.push(
    {
      old: "import heroImage from '~/assets/images/hero-image.webp';",
      neu:
        "import heroImage from '~/assets/images/hero-image.webp';\n" +
        "import historiaImg from '~/assets/images/historia-cris-sergio.webp';\n" +
        "import libroImg from '~/assets/images/libro-quierete-sorda.webp';",
    },
    {
      old: '<img src="https://mochileandosinbarreras.com/wp-content/uploads/2022/09/GOPR2012-1024x768.jpg.webp" alt="Cristina y Sergio viajando" class="w-full h-auto object-cover" />',
      neu:
        '<Image src={historiaImg} alt="Cristina y Sergio viajando" widths={[480, 960]} sizes="(max-width: 768px) 100vw, 480px" class="w-full h-auto object-cover" loading="lazy" />',
    },
    {
      old: '<img src="https://mochileandosinbarreras.com/wp-content/uploads/2024/04/MOckup-LIBRO-CRIS.png.webp" alt="Libro Quiérete Sorda" class="max-w-[200px] mx-auto rounded-xl shadow-md" />',
      neu:
        '<Image src={libroImg} alt="Libro Quiérete Sorda" widths={[200, 400]} sizes="200px" class="max-w-[200px] mx-auto rounded-xl shadow-md" loading="lazy" />',
    }
  );
}

/** @type {Record<string, Step[]>} */
const edits = {
  'src/pages/index.astro': indexSteps,

  // Tailwind solo escanea src/ (antes también copias de seguridad, scripts y documentación)
  'src/assets/styles/tailwind.css': [
    {
      old: "@import 'tailwindcss';",
      neu:
        "/* Tailwind solo escanea src/ (antes escaneaba también copias de seguridad, scripts y documentación). */\n" +
        "@import 'tailwindcss' source('../../');",
    },
  ],

  // Prefetch bajo demanda (al pasar el ratón o tocar) en lugar de precargar todos los enlaces visibles
  'astro.config.ts': [{ old: "defaultStrategy: 'viewport',", neu: "defaultStrategy: 'hover'," }],

  // preconnect a Unsplash sin uso + contenido visible sin JavaScript
  'src/layouts/Layout.astro': [
    {
      old: '    <link rel="preconnect" href="https://images.unsplash.com" />',
      neu:
        '    <!-- Sin JavaScript no hay animaciones de entrada: que el contenido no quede oculto -->\n' +
        "    <noscript><style is:inline>[class*='md:opacity']{opacity:1!important}</style></noscript>",
    },
  ],

  // Cabecera y portada del post: visibles desde el primer pintado (LCP), sin esperar a un script
  'src/components/blog/SinglePost.astro': [
    {
      old: '<header class="intersect-once intersect-quarter motion-safe:md:opacity-0 motion-safe:md:intersect:animate-fade">',
      neu: '<header>',
    },
    { old: 'widths={[400, 900]}', neu: 'widths={[480, 800, 1200]}' },
    { old: 'sizes="(max-width: 900px) 400px, 900px"', neu: 'sizes="(max-width: 900px) 100vw, 900px"' },
    { old: 'loading="eager"', neu: 'loading="eager"\n            fetchpriority="high"' },
  ],

  // Los scripts de parche no deben fallar `npm run check`
  'eslint.config.js': [
    {
      old: "ignores: ['dist', 'node_modules', '.github', 'types.generated.d.ts', '.astro'],",
      neu: "ignores: ['dist', 'node_modules', '.github', 'types.generated.d.ts', '.astro', 'scripts', '.backup-*'],",
    },
  ],
  '.prettierignore': [{ old: '.changeset', neu: '.changeset\nscripts\n.backup-*' }],
  '.gitignore': [{ old: 'pnpm-workspace.yaml\n\n.astro', neu: 'pnpm-workspace.yaml\n\n.astro\n\n# copias de seguridad de los scripts de parche\n.backup-*/' }],
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
    const n = s.neu.replace(/\n/g, eol);
    const expected = s.count ?? 1;
    // `olds`: lista de estados previos válidos (el primero que exista se sustituye)
    let o = (s.old ?? s.olds[0]).replace(/\n/g, eol);
    if (s.olds) {
      if (text.includes(n)) continue;
      const hit = s.olds.map((x) => x.replace(/\n/g, eol)).find((x) => text.includes(x));
      if (hit) o = hit;
    }
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
const replacements = [
  { rel: 'src/components/Logo.astro', src: 'Logo.astro', originalSha1: '355d3c78954eb6d2f61999bac76ee8f5bf2c64ca' },
  { rel: 'src/components/blog/GridItem.astro', src: 'GridItem.astro', originalSha1: '921f736aa2fdcd3f0b35ac789c3979d7305864d6' },
];
for (const f of replacements) {
  if (!fs.existsSync(abs(f.rel))) {
    errors.push(`${f.rel}: el archivo no existe`);
    continue;
  }
  const cur = fs.readFileSync(abs(f.rel), 'utf8');
  const fresh = fs.readFileSync(path.join(FILES, f.src), 'utf8');
  if (sha1Text(cur) === sha1Text(fresh)) notes.push(`= ${f.rel}: ya aplicado`);
  else if (sha1Text(cur) === f.originalSha1) {
    pending.set(f.rel, { data: lf(fresh).replace(/\n/g, eolOf(cur)) });
    notes.push(`+ ${f.rel}: sustituido`);
  } else errors.push(`${f.rel}: lo has modificado respecto a la versión esperada; no lo sobrescribo para no perder tus cambios`);
}

// ───────────────────────── 3. Imágenes de plantilla sin uso (se borran solo si nadie las referencia) ─────────────────────────
const unused = [
  ['hero-image.png', 'f19730fcaceac546aa779673f5acce7c80a8c806'],
  ['default.png', 'bfc39b1ea4f622ba6c84bec6cceba8edf80eac8b'],
  ['app-store.png', 'fd27cf6f38b57c61b81f8947c7451316dbc48485'],
  ['google-play.png', '13c29612ed5c3e55bfc38c6c5c263c111088e5dd'],
];
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return d.name === 'images' && p.endsWith(path.join('assets', 'images')) ? [] : walk(p);
    return /\.(astro|ts|tsx|md|mdx|css|yaml|yml|json)$/.test(d.name) ? [p] : [];
  });
const srcFiles = walk(abs('src'));
for (const [name, expected] of unused) {
  const rel = `${IMG_DIR}/${name}`;
  if (!fs.existsSync(abs(rel))) continue;
  const refs = srcFiles.filter((f) => fs.readFileSync(f, 'utf8').includes(name));
  if (refs.length) {
    notes.push(`! ${rel}: sigue referenciado en ${path.relative(ROOT, refs[0])}; no se borra`);
  } else if (sha1(fs.readFileSync(abs(rel))) !== expected) {
    notes.push(`! ${rel}: no es el original de la plantilla; no se borra`);
  } else {
    pending.set(rel, { del: true });
    notes.push(`- ${rel}: eliminado (imagen de plantilla sin uso)`);
  }
}

// ───────────────────────── 4. Escritura (todo o nada) ─────────────────────────
for (const n of notes) console.log(n);

if (errors.length) {
  console.error('\nNO SE HA ESCRITO NADA. Problemas encontrados:');
  for (const e of errors) console.error('  - ' + e);
  console.error('\nSi tus archivos han cambiado respecto al original, pásame el mensaje y lo adapto.');
  process.exit(1);
}
if (!pending.size) {
  console.log('\nNada que hacer: el rendimiento ya estaba aplicado.');
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
console.log(`\nOK: ${pending.size} archivo(s) tocados. Copias en .backup-rendimiento/`);
if (!wpOk) console.log('AVISO: faltan por descargar imágenes de WordPress; reejecuta el script con conexión.');
console.log('Siguiente paso: npm run build');
