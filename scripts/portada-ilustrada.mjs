// Genera portadas ilustradas (Andes + viñedos) con la paleta de marca. Uso:
//   node scripts/portada-ilustrada.mjs <archivo-salida.webp> "<kicker>" "<titulo línea 1>" "<titulo línea 2>" "<píldora>"
// Colores: solo los del Manual de Marca (#36A09F, #61B4BA, #A5CFD2, #D87068, #E58760, #E5AB5F).
import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const [out, kicker, t1, t2 = '', pill = ''] = process.argv.slice(2);
const W = 1536;
const H = 864;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// Filas de viñedo en perspectiva: líneas que convergen en el punto de fuga.
const vx = 760;
const vy = 560;
let rows = '';
// Cuñas alternas (hileras de vid) que convergen en el punto de fuga.
for (let i = -10; i < 10; i++) {
  const x1 = vx + i * 380;
  const x2 = vx + (i + 1) * 380;
  const fill = i % 2 === 0 ? '#2c8584' : '#61B4BA';
  rows += `<path d="M${vx + i * 16} ${vy} L${vx + (i + 1) * 16} ${vy} L${x2} ${H} L${x1} ${H} Z" fill="${fill}" opacity="${i % 2 === 0 ? 0.7 : 0.35}"/>`;
}
const bands = '';

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2c8584"/>
      <stop offset="0.55" stop-color="#36A09F"/>
      <stop offset="1" stop-color="#A5CFD2"/>
    </linearGradient>
    <linearGradient id="valle" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#36A09F"/>
      <stop offset="1" stop-color="#1f6e6d"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#cielo)"/>
  <circle cx="1230" cy="330" r="120" fill="#E5AB5F" opacity="0.95"/>
  <circle cx="1230" cy="330" r="170" fill="#E5AB5F" opacity="0.18"/>
  <!-- cordillera lejana -->
  <path d="M0 520 L150 400 L260 470 L420 330 L560 450 L700 380 L860 500 L1010 360 L1160 470 L1320 340 L1536 480 L1536 600 L0 600 Z" fill="#61B4BA" opacity="0.85"/>
  <!-- cordillera cercana con cumbres nevadas -->
  <path d="M0 560 L190 430 L330 520 L520 380 L700 520 L880 410 L1080 540 L1280 420 L1536 560 L1536 640 L0 640 Z" fill="#A5CFD2"/>
  <path d="M520 380 L478 420 L505 414 L520 436 L542 416 L566 424 Z" fill="#ffffff" opacity="0.95"/>
  <path d="M880 410 L840 450 L866 444 L884 466 L906 446 L928 452 Z" fill="#ffffff" opacity="0.95"/>
  <path d="M1280 420 L1238 462 L1264 456 L1282 478 L1304 458 L1326 464 Z" fill="#ffffff" opacity="0.95"/>
  <!-- valle y viñedos -->
  <path d="M0 585 Q 700 545 1536 590 L1536 ${H} L0 ${H} Z" fill="url(#valle)"/>
  ${bands}
  ${rows}
  <!-- álamos -->
  <g fill="#1f6e6d"><ellipse cx="90" cy="575" rx="14" ry="48"/><ellipse cx="130" cy="580" rx="12" ry="40"/><ellipse cx="1420" cy="582" rx="14" ry="46"/><ellipse cx="1460" cy="586" rx="12" ry="38"/></g>
  <!-- texto -->
  <text x="96" y="128" font-family="Segoe UI, Montserrat, Arial, sans-serif" font-size="38" font-weight="700" letter-spacing="9" fill="#ffffff">${esc(kicker.toUpperCase())}</text>
  <text x="96" y="248" font-family="Segoe UI, Montserrat, Arial, sans-serif" font-size="108" font-weight="700" fill="#ffffff">${esc(t1)}</text>
  ${t2 ? `<text x="96" y="364" font-family="Segoe UI, Montserrat, Arial, sans-serif" font-size="108" font-weight="700" fill="#ffffff">${esc(t2)}</text>` : ''}
  ${pill ? `<rect x="96" y="${t2 ? 408 : 292}" rx="45" ry="45" width="${pill.length * 22 + 100}" height="90" fill="#D87068"/><text x="${96 + (pill.length * 22 + 100) / 2}" y="${(t2 ? 408 : 292) + 59}" text-anchor="middle" font-family="Segoe UI, Montserrat, Arial, sans-serif" font-size="40" font-weight="700" fill="#ffffff">${esc(pill)}</text>` : ''}
  <rect x="1075" y="672" rx="28" ry="28" width="390" height="152" fill="#ffffff"/>
</svg>`;

const logo = await sharp(readFileSync('src/assets/images/1-Logo-Principal-RGB.svg'), { density: 40 })
  .resize({ width: 330 })
  .png()
  .toBuffer();
const logoMeta = await sharp(logo).metadata();

await sharp(Buffer.from(svg))
  .composite([{ input: logo, left: 1075 + Math.round((390 - 330) / 2), top: 672 + Math.round((152 - (logoMeta.height ?? 80)) / 2) }])
  .webp({ quality: 82 })
  .toFile(out);
console.log('OK', out);
