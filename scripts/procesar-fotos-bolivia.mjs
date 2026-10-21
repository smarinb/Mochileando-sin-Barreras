// Convierte fotos originales de Bolivia (JPG de cámara, ~5 MB) a webp ligeros para los posts.
// Uso (desde la raíz del repo):
//   node scripts/procesar-fotos-bolivia.mjs
// Origen: Bolivia/ (carpeta local, fuera de git). Destino: src/assets/images/.
// `.rotate()` aplica la orientación EXIF: sin él las fotos verticales salen giradas.
import sharp from 'sharp';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const ORIGEN = 'Bolivia';
const DESTINO = 'src/assets/images';

// [carpeta, número DSC, nombre de salida]. La portada se recorta a 16:9; el resto conserva proporción.
const fotos = [
  // Portadas: siempre fotos reales de los viajeros, con las caras visibles.
  ['Salar de uyuni', 5173, 'uyuni-cover', { w: 1536, h: 864 }],
  ['altiplano', 4901, 'uyuni-desierto-manos'],
  ['altiplano', 4944, 'uyuni-altura-cover', { w: 1536, h: 864 }],
  ['Salar de uyuni', 5126, 'uyuni-llevar-cover', { w: 1536, h: 864 }],
  ['Salar de uyuni', 5099, 'uyuni-amanecer-siluetas'],
  // Foto vertical de cámara 360: se recorta el cielo para que el grupo ocupe el encuadre.
  ['altiplano', 'IMG_20260504_112917_00_095', 'uyuni-cuatro-laguna-volcanes', { recorteSuperior: 0.3, ancho: 900 }],
  // San Pedro de Atacama (fotos de cámara 360, verticales; se recorta el rótulo de la parte baja).
  ['san-pedro', 'sp-03.jpeg', 'san-pedro-coche-cover', { recorte: { left: 0, top: 0.16, width: 1, height: 0.35 }, ancho: 1500, ampliar: true }],
  ['san-pedro', 'sp-02.jpeg', 'san-pedro-valle-de-la-luna', { recorte: { left: 0, top: 0.2, width: 1, height: 0.72 }, ancho: 800 }],
  ['san-pedro', 'sp-09.jpeg', 'san-pedro-laguna-cejar', { recorte: { left: 0, top: 0.2, width: 1, height: 0.56 }, ancho: 1200 }],
  ['san-pedro', 'sp-11.jpeg', 'san-pedro-pozon', { recorte: { left: 0, top: 0.25, width: 1, height: 0.68 }, ancho: 800 }],
  ['altiplano', 4908, 'uyuni-4x4-altiplano'],
  ['altiplano', 4889, 'uyuni-laguna-volcan'],
  ['altiplano', 4897, 'uyuni-zorro-andino'],
  ['altiplano', 4913, 'uyuni-vicuna-laguna'],
  ['altiplano', 4936, 'uyuni-sol-de-manana'],
  ['altiplano', 4946, 'uyuni-laguna-colorada'],
  ['altiplano', 4952, 'uyuni-flamencos'],
  ['altiplano', 5038, 'uyuni-arco-roca'],
  ['altiplano', 5068, 'uyuni-4x4-formaciones'],
  ['altiplano', 5080, 'uyuni-mirador-canon'],
  ['Salar de uyuni', 5126, 'uyuni-salar-espejo-grupo'],
  ['Salar de uyuni', 5197, 'uyuni-4x4-salar-reflejo'],
  ['Salar de uyuni', 5225, 'uyuni-cementerio-trenes'],
];

for (const [carpeta, num, nombre, caja] of fotos) {
  const archivo = typeof num === 'number' ? `DSC0${num}.JPG` : (num.includes('.') ? num : `${num}.JPG`);
  const src = join(ORIGEN, carpeta, archivo);
  if (!existsSync(src)) {
    console.error(`No existe ${src}`);
    continue;
  }
  let img = sharp(src).rotate();
  if (caja?.recorteSuperior || caja?.recorte) {
    // `recorte` son fracciones (0-1) de la imagen ya orientada: sirve para quitar el rótulo de la cámara 360.
    const r = caja.recorte ?? { left: 0, top: caja.recorteSuperior, width: 1, height: 1 - caja.recorteSuperior };
    const orientada = await img.toBuffer();
    const { width, height } = await sharp(orientada).metadata();
    img = sharp(orientada).extract({
      left: Math.round(r.left * width),
      top: Math.round(r.top * height),
      width: Math.round(r.width * width),
      height: Math.round(r.height * height),
    });
  }
  const out = join(DESTINO, `${nombre}.webp`);
  const info = await (caja?.w
    ? img.resize(caja.w, caja.h, { fit: 'cover' })
    : img.resize({ width: caja?.ancho ?? 1200, withoutEnlargement: !caja?.ampliar })
  )
    .webp({ quality: 78 })
    .toFile(out);
  console.log(`${nombre}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}
