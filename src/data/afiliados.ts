/**
 * Enlaces de afiliado centralizados (barra lateral y barra móvil de los posts comerciales).
 * Se escriben una sola vez aquí para que un cambio de enlace no obligue a tocar posts.
 * Todos se renderizan con rel="nofollow sponsored noopener" y se abren en pestaña nueva.
 */
export interface Afiliado {
  key: string;
  /** Slug del clúster comercial al que pertenece (clusters.ts). */
  cluster: string;
  name: string;
  /** Beneficio verificable (sin prometer más de lo que dicen nuestros artículos). */
  benefit: string;
  cta: string;
  href: string;
  /** Página de reseña/guía propia a la que enlazar desde la tarjeta. */
  review?: { href: string; text: string };
}

export const afiliados: Afiliado[] = [
  {
    key: 'heymondo',
    cluster: 'seguros-de-viaje',
    name: 'Heymondo',
    benefit: '5% de descuento automático al entrar desde nuestro enlace, sin códigos.',
    cta: 'Ver mi precio',
    href: 'https://heymondo.es/?utm_medium=Afiliado&utm_source=MOCHILEANDOSINBARRERAS&utm_campaign=PRINCIPAL&cod_descuento=MOCHILEANDOSINBARRERAS&ag_campaign=ENTRADA&agencia=a5108849b9020a8d726cf95f432afb343ac8',
    review: { href: '/heymondo-opiniones', text: 'Nuestra opinión' },
  },
  {
    key: 'iati',
    cluster: 'seguros-de-viaje',
    name: 'IATI Seguros',
    benefit: '5% de descuento permanente desde nuestro enlace de colaborador.',
    cta: 'Calcular mi precio',
    href: 'https://www.iatiseguros.com/?r=46316725090598',
    review: { href: '/iati-seguros-opiniones', text: 'Nuestra opinión' },
  },
  {
    key: 'holafly',
    cluster: 'esim-para-viajar',
    name: 'Holafly',
    benefit: 'eSIM con datos ilimitados y descuento desde nuestro enlace.',
    cta: 'Ver planes',
    href: 'https://holafly.sjv.io/xLR7K5',
    review: { href: '/esim-holafly-opiniones', text: 'Nuestra opinión' },
  },
  {
    key: 'n26',
    cluster: 'tarjetas-para-viajar',
    name: 'N26',
    benefit: 'Tarjeta para pagar y sacar dinero en el extranjero sin comisiones de cambio.',
    cta: 'Abrir cuenta',
    href: 'https://n26.com/r/sergiom9699',
    review: { href: '/tarjeta-n26', text: 'Nuestra reseña' },
  },
  {
    key: 'discovercars',
    cluster: 'alquiler-de-coches',
    name: 'DiscoverCars',
    benefit: 'Compara precios y condiciones de varias compañías antes de reservar.',
    cta: 'Comparar coches',
    href: 'https://www.discovercars.com/es?a_aid=smarinb87',
    review: { href: '/discovercars-opiniones', text: 'Nuestra opinión' },
  },
];

/** Tarjetas ordenadas: primero las del clúster del post y después el resto (máx. `max`). */
export const afiliadosPara = (cluster?: string, max = 4): Afiliado[] => {
  const first = afiliados.filter((a) => a.cluster === cluster);
  const rest = afiliados.filter((a) => a.cluster !== cluster);
  return [...first, ...rest].slice(0, max);
};
