// Punto 4 — Schema FAQPage funcional.
//
// Uso (desde la raíz del proyecto, donde está package.json):
//   node scripts/aplicar-punto-4.mjs
//
// Qué hace:
//  1. Añade el campo `faqs` al esquema de contenido, al tipo Post y a la normalización de posts.
//  2. Genera el JSON-LD FAQPage en la ruta del post (src/pages/[...blog]/index.astro).
//  3. Migra las FAQ de tus posts al frontmatter (`faqs:`) y elimina el JSON-LD roto
//     (<script ... dangerouslySetInnerHTML> en el cuerpo, o `schema:` en el frontmatter).
//
// Seguridad:
//  - Trabaja sobre TUS archivos actuales (no los sobrescribe con copias mías).
//  - Es todo o nada: si algún fragmento esperado no se encuentra, no escribe NADA y te dice cuál.
//  - Guarda copia de cada archivo modificado en .backup-punto-4/
//  - Es idempotente: si ya está aplicado, no cambia nada.
//  - Conserva los saltos de línea de cada archivo (CRLF o LF).

import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const ROOT = process.cwd();
const BACKUP = path.join(ROOT, '.backup-punto-4');

if (!fs.existsSync(path.join(ROOT, 'package.json')) || !fs.existsSync(path.join(ROOT, 'src', 'content.config.ts'))) {
  console.error('ERROR: ejecútalo desde la raíz del proyecto (mochileando-blog/).');
  process.exit(1);
}

const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const eolOf = (t) => (t.includes('\r\n') ? '\r\n' : '\n');

const pending = []; // { rel, text }
const errors = [];
const notes = [];

// ───────────────────────── 1. Cambios de código ─────────────────────────
const codeEdits = [
  {
    rel: 'src/content.config.ts',
    done: 'faqs: z.array(',
    old: "    author: z.string().optional(),\n",
    neu:
      "    author: z.string().optional(),\n\n" +
      "    /**\n" +
      "     * Preguntas frecuentes del post. Se generan como schema FAQPage (JSON-LD) en la ruta del post.\n" +
      "     * Las preguntas y respuestas deben aparecer también visibles en el artículo.\n" +
      "     */\n" +
      "    faqs: z.array(z.object({ q: z.string(), a: z.string() })).optional(),\n",
  },
  {
    rel: 'src/types.d.ts',
    done: 'faqs?: Array<',
    old: "  author?: string;\n\n  metadata?: MetaData;\n\n  draft?: boolean;\n",
    neu:
      "  author?: string;\n\n" +
      "  /** Preguntas frecuentes del post (se emiten como schema FAQPage). */\n" +
      "  faqs?: Array<{ q: string; a: string }>;\n\n" +
      "  metadata?: MetaData;\n\n  draft?: boolean;\n",
  },
  {
    rel: 'src/utils/blog.ts',
    done: 'faqs: faqs,',
    steps: [
      { old: "    author,\n    draft = false,\n    metadata = {},\n  } = data;", neu: "    author,\n    faqs,\n    draft = false,\n    metadata = {},\n  } = data;" },
      { old: "    author: author,\n\n    draft: draft,", neu: "    author: author,\n    faqs: faqs,\n\n    draft: draft," },
    ],
  },
  {
    rel: 'src/pages/[...blog]/index.astro',
    done: 'const faqSchema',
    steps: [
      {
        old: "const breadcrumbs = [\n  { text: 'Inicio'",
        neu:
          "// FAQPage: solo se emite si el post define `faqs` en su frontmatter.\n" +
          "// Las preguntas deben estar también visibles en el artículo (requisito de Google).\n" +
          "const faqSchema = post.faqs?.length\n" +
          "  ? {\n" +
          "      '@context': 'https://schema.org',\n" +
          "      '@type': 'FAQPage',\n" +
          "      mainEntity: post.faqs.map(({ q, a }) => ({\n" +
          "        '@type': 'Question',\n" +
          "        name: q,\n" +
          "        acceptedAnswer: { '@type': 'Answer', text: a },\n" +
          "      })),\n" +
          "    }\n" +
          "  : null;\n\n" +
          "const breadcrumbs = [\n  { text: 'Inicio'",
      },
      {
        old: '  <StructuredData slot="head" schema={articleSchema} />',
        neu: '  <StructuredData slot="head" schema={faqSchema ? [articleSchema, faqSchema] : articleSchema} />',
      },
    ],
  },
];

for (const edit of codeEdits) {
  if (!fs.existsSync(path.join(ROOT, edit.rel))) {
    errors.push(`${edit.rel}: no existe`);
    continue;
  }
  let text = read(edit.rel);
  if (text.includes(edit.done)) {
    notes.push(`= ${edit.rel}: ya estaba aplicado`);
    continue;
  }
  const eol = eolOf(text);
  const steps = edit.steps ?? [{ old: edit.old, neu: edit.neu }];
  let ok = true;
  for (const s of steps) {
    const o = s.old.replace(/\n/g, eol);
    const n = s.neu.replace(/\n/g, eol);
    const count = text.split(o).length - 1;
    if (count !== 1) {
      errors.push(`${edit.rel}: no encuentro (o aparece ${count} veces) este fragmento:\n      ${JSON.stringify(s.old.slice(0, 80))}`);
      ok = false;
      break;
    }
    text = text.replace(o, () => n);
  }
  if (ok) pending.push({ rel: edit.rel, text });
}

// ───────────────────────── 2. Migración de FAQ de los posts ─────────────────────────
const faqsYaml = (items, eol) =>
  ['faqs:', ...items.flatMap(({ q, a }) => [`  - q: ${JSON.stringify(q)}`, `    a: ${JSON.stringify(a)}`])].join(eol) + eol;

const toItems = (mainEntity) => mainEntity.map((x) => ({ q: x.name, a: x.acceptedAnswer.text }));

const postsDir = path.join(ROOT, 'src', 'data', 'post');
const postFiles = fs.existsSync(postsDir) ? fs.readdirSync(postsDir).filter((f) => /\.mdx?$/.test(f)) : [];

for (const file of postFiles) {
  const rel = `src/data/post/${file}`;
  const text = read(rel);
  const eol = eolOf(text);

  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---(\r?\n|$)/);
  if (!m) continue;
  const fmRaw = m[1];
  const fmEnd = m[0].length - m[2].length; // índice justo tras el '---' de cierre
  let fm;
  try {
    fm = yaml.load(fmRaw) ?? {};
  } catch (e) {
    errors.push(`${rel}: el frontmatter no es YAML válido (${e.message.split('\n')[0]})`);
    continue;
  }
  if (fm.faqs) {
    notes.push(`= ${rel}: ya tiene faqs`);
    continue;
  }

  let items = null;
  let newFm = fmRaw;
  let newBody = text.slice(fmEnd);

  // Caso A: JSON-LD manual dentro del cuerpo (sintaxis de React, no funciona en MDX de Astro)
  const re = /<script type="application\/ld\+json" dangerouslySetInnerHTML=\{\{ __html: `([\s\S]*?)`\s*\}\}\s*\/>/;
  const sm = newBody.match(re);
  if (sm) {
    let data;
    try {
      data = JSON.parse(sm[1]);
    } catch (e) {
      errors.push(`${rel}: el JSON-LD del cuerpo no es JSON válido (${e.message})`);
      continue;
    }
    if (data['@type'] === 'FAQPage' && Array.isArray(data.mainEntity)) {
      items = toItems(data.mainEntity);
      const before = newBody.slice(0, sm.index).replace(/\s+$/, '');
      const after = newBody.slice(sm.index + sm[0].length).replace(/^\s+/, '');
      newBody = before + eol + (after ? eol + after : '');
    } else {
      notes.push(`! ${rel}: tiene un JSON-LD en el cuerpo que no es FAQPage; no lo toco`);
    }
  }

  // Caso B: `schema:` en el frontmatter (el esquema de contenido lo ignora)
  if (!items && fm.schema) {
    const graph = Array.isArray(fm.schema['@graph']) ? fm.schema['@graph'] : [fm.schema];
    const faq = graph.find((x) => x && x['@type'] === 'FAQPage');
    if (faq && Array.isArray(faq.mainEntity)) {
      items = toItems(faq.mainEntity);
      const lines = fmRaw.split(/\r?\n/);
      const start = lines.findIndex((l) => /^schema:\s*$/.test(l));
      if (start === -1) {
        errors.push(`${rel}: tiene schema en el frontmatter pero no localizo la línea "schema:"`);
        continue;
      }
      let end = start + 1;
      while (end < lines.length && (lines[end] === '' || /^\s/.test(lines[end]))) end++;
      newFm = [...lines.slice(0, start), ...lines.slice(end)].join(eol);
    }
  }

  if (!items) continue;

  const out = '---' + eol + newFm.replace(/\s+$/, '') + eol + faqsYaml(items, eol) + '---' + eol + newBody.replace(/^\r?\n/, '');
  // Comprobación: el resultado debe parsear y tener las mismas FAQ
  const chk = out.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const back = yaml.load(chk[1]);
  if (!back.faqs || back.faqs.length !== items.length || back.faqs.some((f, i) => f.q !== items[i].q || f.a !== items[i].a)) {
    errors.push(`${rel}: la verificación posterior de las FAQ falló; no se escribe`);
    continue;
  }
  pending.push({ rel, text: out });
  notes.push(`+ ${rel}: ${items.length} FAQ migradas`);
}

// ───────────────────────── 3. Escritura (todo o nada) ─────────────────────────
for (const n of notes) console.log(n);

if (errors.length) {
  console.error('\nNO SE HA ESCRITO NADA. Problemas encontrados:');
  for (const e of errors) console.error('  - ' + e);
  console.error('\nSi tus archivos han cambiado respecto al original, pásame el mensaje y lo adapto.');
  process.exit(1);
}

if (!pending.length) {
  console.log('\nNada que hacer: el punto 4 ya estaba aplicado.');
  process.exit(0);
}

for (const { rel, text } of pending) {
  const dest = path.join(BACKUP, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (!fs.existsSync(dest)) fs.copyFileSync(path.join(ROOT, rel), dest);
  fs.writeFileSync(path.join(ROOT, rel), text, 'utf8');
}
console.log(`\nOK: ${pending.length} archivo(s) modificados. Copias en .backup-punto-4/`);
console.log('Siguiente paso: npm run build');
