// Post "Holafly eSIM opiniones" migrado de WordPress + BotonAfiliado con contenido propio.
//
// Uso (desde la raíz del proyecto, donde está package.json):
//   node scripts/aplicar-holafly.mjs
//
// Qué hace:
//  1. Crea src/data/post/esim-holafly-opiniones.mdx (URL /esim-holafly-opiniones/, igual que en WordPress).
//  2. Amplía src/components/mdx/BotonAfiliado.astro para aceptar texto propio en cada botón
//     (si no se le pasa, sigue mostrando "¿Quieres consultar las tarifas para tu destino?": no cambia nada en los otros posts).
//
// Requisito: la imagen destacada debe estar en src/assets/images/holafly.webp
//
// Seguridad: todo o nada, copia en .backup-holafly/, idempotente, conserva CRLF/LF y NO sobrescribe el post si ya existe y es distinto.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.cwd();
const HERE = path.dirname(fileURLToPath(import.meta.url));
const BACKUP = path.join(ROOT, '.backup-holafly');
const abs = (rel) => path.join(ROOT, rel);

if (!fs.existsSync(path.join(ROOT, 'package.json')) || !fs.existsSync(path.join(ROOT, 'src', 'content.config.ts'))) {
  console.error('ERROR: ejecútalo desde la raíz del proyecto (mochileando-blog/).');
  process.exit(1);
}

const pending = new Map();
const errors = [];
const notes = [];
const eolOf = (t) => (t.includes('\r\n') ? '\r\n' : '\n');
const lf = (t) => t.replace(/\r\n/g, '\n');

// 0. Imagen destacada
const IMG = 'src/assets/images/holafly.webp';
if (!fs.existsSync(abs(IMG))) {
  errors.push(`${IMG}: no existe. Copia la imagen destacada con ese nombre exacto a src/assets/images/ y reejecuta.`);
}

// 1. El post
const POST = 'src/data/post/esim-holafly-opiniones.mdx';
const freshPost = fs.readFileSync(path.join(HERE, 'holafly-archivos', 'esim-holafly-opiniones.mdx'));
if (fs.existsSync(abs(POST))) {
  if (lf(fs.readFileSync(abs(POST), 'utf8')) === lf(freshPost.toString('utf8'))) notes.push(`= ${POST}: ya existe y es idéntico`);
  else errors.push(`${POST}: ya existe y es distinto; no lo sobrescribo para no perder tus cambios`);
} else {
  pending.set(POST, { data: freshPost });
  notes.push(`+ ${POST}: nuevo`);
}

// 2. BotonAfiliado: contenido propio por botón (slot) con el texto actual como valor por defecto
const BTN = 'src/components/mdx/BotonAfiliado.astro';
if (!fs.existsSync(abs(BTN))) {
  errors.push(`${BTN}: no existe`);
} else {
  const text = fs.readFileSync(abs(BTN), 'utf8');
  const eol = eolOf(text);
  const oldStr =
    '  <span class="text-slate-800 dark:text-slate-200 font-medium text-sm md:text-base">¿Quieres consultar las tarifas para tu destino?</span>';
  const newStr =
    '  <div class="text-slate-800 dark:text-slate-200 font-medium text-sm md:text-base [&>p+p]:mt-2">\n' +
    '    <slot>¿Quieres consultar las tarifas para tu destino?</slot>\n' +
    '  </div>';
  const o = oldStr.replace(/\n/g, eol);
  const n = newStr.replace(/\n/g, eol);
  if (text.includes(n)) notes.push(`= ${BTN}: ya aplicado`);
  else if (text.split(o).length - 1 === 1) {
    pending.set(BTN, { data: text.replace(o, () => n) });
    notes.push(`+ ${BTN}: ahora acepta contenido propio`);
  } else {
    errors.push(`${BTN}: no encuentro la línea esperada; ¿la has modificado? Pásame el archivo y lo adapto.`);
  }
}

// 3. Escritura (todo o nada)
for (const n of notes) console.log(n);
if (errors.length) {
  console.error('\nNO SE HA ESCRITO NADA. Problemas encontrados:');
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
if (!pending.size) {
  console.log('\nNada que hacer: ya estaba aplicado.');
  process.exit(0);
}
for (const [rel, op] of pending) {
  if (fs.existsSync(abs(rel))) {
    const dest = path.join(BACKUP, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    if (!fs.existsSync(dest)) fs.copyFileSync(abs(rel), dest);
  }
  fs.mkdirSync(path.dirname(abs(rel)), { recursive: true });
  fs.writeFileSync(abs(rel), op.data);
}
console.log(`\nOK: ${pending.size} archivo(s) tocados. Copias en .backup-holafly/`);
console.log('Siguiente paso: npm run build   (la página queda en /esim-holafly-opiniones/)');
