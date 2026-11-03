// Portada estilo «Intermundial» (fondo verde azulado, círculos, logo). Uso:
//   node scripts/portada-intermundial.mjs <salida.webp> "<kicker>" "<título línea 1>" "<título línea 2>" "<píldora>"
// El logo se recorta de una portada existente (src/assets/images/intermundial-totaltravel-annual.webp).
import sharp from 'sharp';

const [out, kicker, t1, t2 = '', pill = ''] = process.argv.slice(2);
const W = 1536, H = 864;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const font = 'Segoe UI, Montserrat, Arial, sans-serif';
const base = 'src/assets/images/intermundial-totaltravel-annual.webp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs><linearGradient id="f" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3f9c9b"/><stop offset="1" stop-color="#53a9ac"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#f)"/>
  <circle cx="1410" cy="90" r="260" fill="#ffffff" fill-opacity="0.18"/>
  <circle cx="1435" cy="420" r="160" fill="#ffffff" fill-opacity="0.14"/>
  <rect x="1075" y="602" width="390" height="202" rx="28" fill="#ffffff"/>
  <text x="96" y="195" font-family="${font}" font-size="40" font-weight="700" letter-spacing="8" fill="#e3f4f5">${esc(kicker.toUpperCase())}</text>
  <text x="96" y="370" font-family="${font}" font-size="104" font-weight="800" fill="#ffffff">${esc(t1)}</text>
  <text x="96" y="490" font-family="${font}" font-size="104" font-weight="800" fill="#ffffff">${esc(t2)}</text>
  ${pill ? `<rect x="96" y="528" width="${pill.length * 23 + 90}" height="90" rx="45" fill="#D87068"/>
  <text x="141" y="587" font-family="${font}" font-size="38" font-weight="700" fill="#ffffff">${esc(pill)}</text>` : ''}
</svg>`;

const logo = await sharp(base).extract({ left: 1100, top: 625, width: 340, height: 155 }).toBuffer();
await sharp(Buffer.from(svg)).composite([{ input: logo, left: 1100, top: 625 }]).webp({ quality: 88 }).toFile(out);
console.log('Portada escrita en', out);
