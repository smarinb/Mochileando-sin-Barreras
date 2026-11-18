/**
 * Campañas puntuales de los afiliados (Black Friday, etc.). Fuente única de fechas y textos.
 * Web estática: la ventana desde/hasta (AAAA-MM-DD, hora de Madrid, ambos incluidos) se comprueba
 * en el navegador (ver CampanasActivas.astro), así que no hace falta redeploy al empezar ni al acabar.
 * Solo se listan campañas CONFIRMADAS por la marca. Tras el fin, borrar la entrada.
 */
export interface Campana {
  /** `key` del afiliado en afiliados.ts (para cambiar su texto en barra lateral y barra móvil). */
  key: string;
  nombre: string;
  /** Etiqueta corta para la franja superior (p. ej. «-15 %»). */
  descuento: string;
  desde: string;
  hasta: string;
  /** Guía interna con el detalle (sin barra final). */
  guia: string;
  /** Texto de la tarjeta de la barra lateral mientras dura la campaña. */
  benefit: string;
  cta: string;
  /** Texto del botón de la barra móvil mientras dura la campaña. */
  mobileDiscount?: string;
}

export const campanas: Campana[] = [
  {
    key: 'heymondo',
    nombre: 'Heymondo',
    descuento: '-15 %',
    desde: '2026-11-19',
    hasta: '2026-11-30',
    guia: '/black-friday-heymondo',
    benefit: 'Black Friday: 15% de descuento automático hasta el 30/11 desde nuestro enlace, acumulable con familia, grupo y franquicia.',
    cta: 'Ver mi precio con -15 %',
    mobileDiscount: '15% dto.',
  },
  {
    key: 'intermundial',
    nombre: 'Intermundial',
    descuento: '-15 %',
    desde: '2026-11-20',
    hasta: '2026-11-30',
    guia: '/descuento-intermundial',
    benefit: 'Black Friday: 15% de descuento del 20 al 30/11 desde nuestro enlace (cupón SINBARRERAS), con hasta 10 millones de cobertura médica en el plan Premium.',
    cta: 'Ver mi precio con -15 %',
    mobileDiscount: '15% dto.',
  },
  {
    key: 'esimflag',
    nombre: 'eSIMFLAG',
    descuento: '-30 %',
    desde: '2026-11-18',
    hasta: '2026-11-30',
    guia: '/codigo-descuento-esimflag',
    benefit: 'Black Friday: 30% de descuento en todos los destinos hasta el 30/11 desde nuestro enlace.',
    cta: 'Ver el 30% de Black Friday',
  },
];

export const campanaDe = (key: string): Campana | undefined => campanas.find((c) => c.key === key);
