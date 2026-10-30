// Portada del post IATI Estrella (estrella + órbitas) con la paleta de marca. Uso:
//   node scripts/portada-estrella.mjs <archivo-salida.webp> "<kicker>" "<titulo línea 1>" "<titulo línea 2>" "<píldora>"
// Colores: solo los del Manual de Marca (#36A09F, #61B4BA, #A5CFD2, #D87068, #E58760, #E5AB5F).
import sharp from 'sharp';

const [out, kicker, t1, t2 = '', pill = ''] = process.argv.slice(2);
const W = 1536;
const H = 864;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const font = 'Segoe UI, Montserrat, Arial, sans-serif';

// Estrella de 5 puntas centrada en (cx, cy) con radio exterior R.
const estrella = (cx, cy, R, r) => {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rad = i % 2 === 0 ? R : r;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(' ');
};

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="fondo" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2c8584"/>
      <stop offset="0.6" stop-color="#36A09F"/>
      <stop offset="1" stop-color="#61B4BA"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#fondo)"/>
  <g fill="none" stroke="#A5CFD2" stroke-opacity="0.45" stroke-width="3">
    <circle cx="1170" cy="400" r="190"/>
    <circle cx="1170" cy="400" r="290"/>
    <circle cx="1170" cy="400" r="400"/>
  </g>
  <polygon points="${estrella(1170, 410, 170, 72)}" fill="#E5AB5F"/>
  <polygon points="${estrella(1170, 410, 118, 50)}" fill="#E58760"/>
  <circle cx="930" cy="250" r="12" fill="#ffffff"/>
  <circle cx="1400" cy="640" r="9" fill="#A5CFD2"/>
  <circle cx="1020" cy="690" r="7" fill="#ffffff"/>
  <text x="96" y="250" font-family="${font}" font-size="34" font-weight="700" letter-spacing="4" fill="#A5CFD2">${esc(kicker.toUpperCase())}</text>
  <text x="96" y="370" font-family="${font}" font-size="112" font-weight="800" fill="#ffffff">${esc(t1)}</text>
  <text x="96" y="490" font-family="${font}" font-size="112" font-weight="800" fill="#ffffff">${esc(t2)}</text>
  ${pill ? `<rect x="96" y="560" width="${pill.length * 21 + 64}" height="68" rx="34" fill="#D87068"/>
  <text x="128" y="606" font-family="${font}" font-size="30" font-weight="700" fill="#ffffff">${esc(pill)}</text>` : ''}
  <text x="96" y="780" font-family="${font}" font-size="30" font-weight="600" fill="#ffffff" fill-opacity="0.9">Mochileando sin Barreras</text>
</svg>`;

await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(out);
console.log('Portada escrita en', out);
