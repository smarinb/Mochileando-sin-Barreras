// Arreglos de bugs: índice de contenidos, botón "volver arriba", textos en inglés,
// atributos alt de imágenes y typo de la guía pilar.
//
// Uso (desde la raíz del proyecto, donde está package.json):
//   node scripts/aplicar-bugs.mjs
//
// Seguridad:
//  - Trabaja sobre TUS archivos actuales; no los sustituye por copias mías salvo Indice.astro
//    y ScrollToTop.astro, y solo si están exactamente como en el proyecto original.
//  - Todo o nada: si algo no cuadra no escribe NADA y te dice qué es.
//  - Copia de cada archivo modificado en .backup-bugs/
//  - Idempotente: si ya está aplicado, no cambia nada.
//  - Conserva los saltos de línea (CRLF/LF) de cada archivo.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const ROOT = process.cwd();
const HERE = path.dirname(fileURLToPath(import.meta.url));
const BACKUP = path.join(ROOT, '.backup-bugs');

if (!fs.existsSync(path.join(ROOT, 'package.json')) || !fs.existsSync(path.join(ROOT, 'src', 'content.config.ts'))) {
  console.error('ERROR: ejecútalo desde la raíz del proyecto (mochileando-blog/).');
  process.exit(1);
}

const abs = (rel) => path.join(ROOT, rel);
const read = (rel) => fs.readFileSync(abs(rel), 'utf8');
const eolOf = (t) => (t.includes('\r\n') ? '\r\n' : '\n');
const lf = (t) => t.replace(/\r\n/g, '\n');
const sha1 = (t) => crypto.createHash('sha1').update(lf(t)).digest('hex');
const countOf = (text, s) => text.split(s).length - 1;

const pending = new Map(); // rel -> texto nuevo
const errors = [];
const notes = [];

// ───────────────────────── 1. Ediciones puntuales (con anclaje) ─────────────────────────
// `count` = veces que debe aparecer el fragmento (por defecto 1).
const edits = {
  'src/components/blog/SinglePost.astro': [
    { old: 'Updated <time datetime', neu: 'Actualizado el <time datetime' },
    { old: '<span>{post.readingTime}</span> min read', neu: '<span>{post.readingTime}</span> min de lectura' },
  ],
  'src/components/widgets/BlogLatestPosts.astro': [
    { old: "linkText = 'View all posts',", neu: "linkText = 'Ver todos los artículos'," },
  ],
  'src/components/widgets/BlogHighlightedPosts.astro': [
    { old: "linkText = 'View all posts',", neu: "linkText = 'Ver todos los artículos'," },
  ],
  'src/components/blog/RelatedPosts.astro': [
    { old: 'title="Related Posts"', neu: 'title="Artículos relacionados"' },
    { old: 'linkText="View All Posts"', neu: 'linkText="Ver todos los artículos"' },
  ],
  'src/components/blog/ToBlogLink.astro': [{ old: '} Back to Blog', neu: '} Volver al blog' }],
  'src/components/blog/Pagination.astro': [
    {
      old: "prevText = 'Newer posts', nextText = 'Older posts'",
      neu: "prevText = 'Artículos más recientes', nextText = 'Artículos anteriores'",
    },
  ],
  'src/components/common/ToggleMenu.astro': [{ old: "label = 'Toggle Menu',", neu: "label = 'Abrir o cerrar el menú'," }],
  'src/components/common/ToggleTheme.astro': [
    { old: "label = 'Toggle between Dark and Light mode',", neu: "label = 'Cambiar entre modo claro y oscuro'," },
  ],
  'src/components/widgets/Header.astro': [
    { old: 'aria-label="Main navigation"', neu: 'aria-label="Navegación principal"' },
    { old: 'aria-label="RSS Feed"', neu: 'aria-label="Suscribirse por RSS"' },
  ],
  'src/components/common/Breadcrumbs.astro': [{ old: 'aria-label="Breadcrumb"', neu: 'aria-label="Ruta de navegación"' }],
  'src/components/common/SocialShare.astro': [
    { old: '"Twitter Share"', neu: '"Compartir en Twitter"', count: 2 },
    { old: '"Facebook Share"', neu: '"Compartir en Facebook"', count: 2 },
    { old: '"Linkedin Share"', neu: '"Compartir en LinkedIn"', count: 2 },
    { old: '"Whatsapp Share"', neu: '"Compartir en WhatsApp"', count: 2 },
    { old: '"Email Share"', neu: '"Compartir por correo"', count: 2 },
  ],
  'src/pages/mejor-esim-para-viajar.astro': [{ old: 'Si não quieres', neu: 'Si no quieres' }],
  // Miniaturas: el enlace del título ya describe el destino; la imagen es decorativa
  // (evita que un lector de pantalla lea el título dos veces).
  'src/components/blog/GridItem.astro': [
    { old: 'alt={post.title}', neu: 'alt=""', count: 2 },
    { old: '<a href={link} class="block w-full h-full">', neu: '<a href={link} class="block w-full h-full" tabindex="-1" aria-hidden="true">' },
  ],
  'src/components/blog/ListItem.astro': [
    { old: 'alt={post.title}', neu: 'alt=""' },
    { old: '<a href={link} class="block w-full h-full">', neu: '<a href={link} class="block w-full h-full" tabindex="-1" aria-hidden="true">' },
  ],

  // Fontanería del índice de contenidos: headings del post -> Astro.locals.headings
  'src/utils/blog.ts': [
    {
      old: 'const { Content, remarkPluginFrontmatter } = await render(post);',
      neu: 'const { Content, headings, remarkPluginFrontmatter } = await render(post);',
    },
    {
      old: '    readingTime: remarkPluginFrontmatter?.readingTime,',
      neu: '    headings: headings,\n\n    readingTime: remarkPluginFrontmatter?.readingTime,',
    },
  ],
  'src/types.d.ts': [
    {
      old: '  /** Estimated reading time in minutes. */',
      neu:
        '  /** Encabezados del artículo (h1-h6), usados por el índice de contenidos. */\n' +
        '  headings?: Array<{ depth: number; slug: string; text: string }>;\n\n' +
        '  /** Estimated reading time in minutes. */',
    },
  ],
  'src/env.d.ts': [
    {
      old: '/// <reference types="../vendor/integration/types.d.ts" />',
      neu:
        '/// <reference types="../vendor/integration/types.d.ts" />\n\n' +
        'declare namespace App {\n' +
        '  interface Locals {\n' +
        '    /** Encabezados del post que se está renderizando; los lee el componente <Indice />. */\n' +
        '    headings?: Array<{ depth: number; slug: string; text: string }>;\n' +
        '  }\n' +
        '}',
    },
  ],
  'src/pages/[...blog]/index.astro': [
    {
      old: 'const { post } = Astro.props as Props;',
      neu:
        'const { post } = Astro.props as Props;\n\n' +
        '// El <Indice /> del MDX lee los encabezados del post desde aquí (se rellena antes de renderizar el contenido).\n' +
        'Astro.locals.headings = post.headings;',
    },
  ],
};

for (const [rel, steps] of Object.entries(edits)) {
  if (!fs.existsSync(abs(rel))) {
    errors.push(`${rel}: el archivo no existe`);
    continue;
  }
  let text = read(rel);
  const eol = eolOf(text);
  let changed = false;
  let applied = 0;
  for (const s of steps) {
    const o = s.old.replace(/\n/g, eol);
    const n = s.neu.replace(/\n/g, eol);
    const expected = s.count ?? 1;
    if (countOf(text, n) >= expected && countOf(text, o) === (n.includes(o) ? countOf(text, n) : 0)) {
      continue; // ya aplicado
    }
    const found = countOf(text, o);
    if (found !== expected) {
      errors.push(`${rel}: esperaba ${expected} vez/veces ${JSON.stringify(s.old.slice(0, 70))} y hay ${found}`);
      changed = false;
      applied = -1;
      break;
    }
    text = text.split(o).join(n);
    changed = true;
    applied++;
  }
  if (applied === -1) continue;
  if (changed) pending.set(rel, text);
  else notes.push(`= ${rel}: ya aplicado`);
}

// ───────────────────────── 2. Sustituciones de archivo completo (con verificación) ─────────────────────────
const fullReplacements = [
  { rel: 'src/components/mdx/Indice.astro', src: 'Indice.astro', originalSha1: 'b38aabb936af647739758f5c5c29886b98928f23' },
  { rel: 'src/components/common/ScrollToTop.astro', src: 'ScrollToTop.astro', originalSha1: '4e862a5668a8332b3547a882f8ab8d00ff20aa38' },
];

for (const f of fullReplacements) {
  if (!fs.existsSync(abs(f.rel))) {
    errors.push(`${f.rel}: el archivo no existe`);
    continue;
  }
  const current = read(f.rel);
  const fresh = fs.readFileSync(path.join(HERE, 'bugs-archivos', f.src), 'utf8');
  if (sha1(current) === sha1(fresh)) {
    notes.push(`= ${f.rel}: ya aplicado`);
  } else if (sha1(current) === f.originalSha1) {
    const eol = eolOf(current);
    pending.set(f.rel, lf(fresh).replace(/\n/g, eol));
    notes.push(`+ ${f.rel}: reescrito`);
  } else {
    errors.push(`${f.rel}: lo has modificado respecto al original; no lo sobrescribo para no perder tus cambios`);
  }
}

// ───────────────────────── 3. imageAlt en las portadas de los posts ─────────────────────────
const altByImage = {
  'opiniones-heymondo.webp':
    'Mapa de carreteras con el texto «Cómo ahorrar en tu seguro de viaje con Heymondo» y el logo de Mochileando sin Barreras',
  'esimflag-opiniones.webp':
    'Viajera con sombrero y mochila mirando el móvil ante una ciudad histórica, con el texto «eSIMFLAG opiniones: ¿merece la pena?»',
  'roamic.webp': 'Mano sosteniendo un móvil con la eSIM de Roamic en pantalla, con un lago de montaña al fondo',
};

const postsDir = abs('src/data/post');
const postFiles = fs.existsSync(postsDir) ? fs.readdirSync(postsDir).filter((f) => /\.mdx?$/.test(f)) : [];
for (const file of postFiles) {
  const rel = `src/data/post/${file}`;
  const text = read(rel);
  const eol = eolOf(text);
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---(\r?\n|$)/);
  if (!m) continue;
  let fm;
  try {
    fm = yaml.load(m[1]) ?? {};
  } catch (e) {
    errors.push(`${rel}: el frontmatter no es YAML válido`);
    continue;
  }
  if (fm.imageAlt !== undefined || typeof fm.image !== 'string') continue;
  const alt = altByImage[path.basename(fm.image)];
  if (!alt) {
    notes.push(`! ${rel}: portada sin alt conocido (${fm.image}); añade imageAlt a mano`);
    continue;
  }
  const lines = m[1].split(/\r?\n/);
  const at = lines.findIndex((l) => /^image:/.test(l));
  if (at === -1) {
    errors.push(`${rel}: no localizo la línea "image:"`);
    continue;
  }
  lines.splice(at + 1, 0, `imageAlt: ${JSON.stringify(alt)}`);
  const newFm = lines.join(eol);
  const out = '---' + eol + newFm + text.slice(3 + eol.length + m[1].length);
  const back = yaml.load(out.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
  if (back.imageAlt !== alt) {
    errors.push(`${rel}: la verificación de imageAlt falló`);
    continue;
  }
  pending.set(rel, out);
  notes.push(`+ ${rel}: imageAlt añadido`);
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
  console.log('\nNada que hacer: los arreglos ya estaban aplicados.');
  process.exit(0);
}

for (const [rel, text] of pending) {
  const dest = path.join(BACKUP, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (!fs.existsSync(dest)) fs.copyFileSync(abs(rel), dest);
  fs.writeFileSync(abs(rel), text, 'utf8');
}
console.log(`\nOK: ${pending.size} archivo(s) modificados. Copias en .backup-bugs/`);
console.log('Siguiente paso: npm run build');
