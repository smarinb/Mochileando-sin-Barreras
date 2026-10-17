// Genera la portada del post de Starlink (cordillera + órbita de satélites + antena) con la paleta de marca. Uso:
//   node scripts/portada-starlink.mjs <archivo-salida.webp> "<kicker>" "<titulo línea 1>" "<titulo línea 2>" "<píldora>"
// Colores: solo los del Manual de Marca (#36A09F, #61B4BA, #A5CFD2, #D87068, #E58760, #E5AB5F).
import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const [out, kicker, t1, t2 = '', pill = ''] = process.argv.slice(2);
const W = 1536;
const H = 864;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const font = 'Segoe UI, Montserrat, Arial, sans-serif';

// Satélite: cuerpo central con dos paneles solares, girado.
const satelite = (x, y, giro, escala = 1) => `
  <g transform="translate(${x} ${y}) rotate(${giro}) scale(${escala})">
    <rect x="-9" y="-6" width="18" height="12" rx="3" fill="#ffffff"/>
    <rect x="-46" y="-5" width="32" height="10" rx="2" fill="#A5CFD2"/>
    <rect x="14" y="-5" width="32" height="10" rx="2" fill="#A5CFD2"/>
  </g>`;

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
  <!-- órbitas -->
  <g fill="none" stroke="#ffffff" stroke-width="3" stroke-dasharray="4 14" stroke-linecap="round" opacity="0.7">
    <path d="M820 400 Q 1180 40 1560 250"/>
    <path d="M900 470 Q 1200 150 1560 360"/>
  </g>
  ${satelite(1015, 205, -32, 1.1)}
  ${satelite(1305, 120, 22, 0.9)}
  ${satelite(1195, 300, -12, 0.8)}
  <!-- cordillera lejana -->
  <path d="M0 520 L150 400 L260 470 L420 330 L560 450 L700 380 L860 500 L1010 360 L1160 470 L1320 340 L1536 480 L1536 600 L0 600 Z" fill="#61B4BA" opacity="0.85"/>
  <!-- cordillera cercana con cumbres nevadas -->
  <path d="M0 560 L190 430 L330 520 L520 380 L700 520 L880 410 L1080 540 L1280 420 L1536 560 L1536 640 L0 640 Z" fill="#A5CFD2"/>
  <path d="M520 380 L478 420 L505 414 L520 436 L542 416 L566 424 Z" fill="#ffffff" opacity="0.95"/>
  <path d="M880 410 L840 450 L866 444 L884 466 L906 446 L928 452 Z" fill="#ffffff" opacity="0.95"/>
  <path d="M1280 420 L1238 462 L1264 456 L1282 478 L1304 458 L1326 464 Z" fill="#ffffff" opacity="0.95"/>
  <!-- valle -->
  <path d="M0 585 Q 700 545 1536 590 L1536 ${H} L0 ${H} Z" fill="url(#valle)"/>
  <!-- antena Starlink Mini sobre un soporte, con ondas hacia el cielo -->
  <g transform="translate(1230 585)">
    <rect x="-4" y="-6" width="8" height="46" rx="3" fill="#1f6e6d"/>
    <g transform="rotate(-18) translate(0 -52)">
      <rect x="-52" y="-34" width="104" height="68" rx="12" fill="#ffffff"/>
      <rect x="-40" y="-22" width="80" height="44" rx="7" fill="#A5CFD2"/>
      <circle cx="0" cy="0" r="6" fill="#D87068"/>
    </g>
    <g fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.85">
      <path d="M-34 -138 Q 0 -168 34 -138" transform="rotate(-18)"/>
      <path d="M-58 -158 Q 0 -208 58 -158" transform="rotate(-18)" opacity="0.7"/>
      <path d="M-82 -178 Q 0 -248 82 -178" transform="rotate(-18)" opacity="0.5"/>
    </g>
  </g>
  <!-- álamos -->
  <g fill="#1f6e6d"><ellipse cx="90" cy="575" rx="14" ry="48"/><ellipse cx="130" cy="580" rx="12" ry="40"/><ellipse cx="1420" cy="650" rx="14" ry="46"/><ellipse cx="1460" cy="654" rx="12" ry="38"/></g>
  <!-- texto -->
  <text x="96" y="128" font-family="${font}" font-size="38" font-weight="700" letter-spacing="9" fill="#ffffff">${esc(kicker.toUpperCase())}</text>
  <text x="96" y="248" font-family="${font}" font-size="108" font-weight="700" fill="#ffffff">${esc(t1)}</text>
  ${t2 ? `<text x="96" y="364" font-family="${font}" font-size="108" font-weight="700" fill="#ffffff">${esc(t2)}</text>` : ''}
  ${pill ? `<rect x="96" y="${t2 ? 408 : 292}" rx="45" ry="45" width="${pill.length * 22 + 100}" height="90" fill="#D87068"/><text x="${96 + (pill.length * 22 + 100) / 2}" y="${(t2 ? 408 : 292) + 59}" text-anchor="middle" font-family="${font}" font-size="40" font-weight="700" fill="#ffffff">${esc(pill)}</text>` : ''}
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
