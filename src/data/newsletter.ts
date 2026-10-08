/**
 * Lista de correo (Brevo, doble confirmación). Ver docs/estrategia-leads.md.
 *
 * NEWSLETTER_ENABLED debe seguir en `false` hasta que:
 *   1. Brevo esté configurado (lista, plantilla de doble opt-in, atributos INTERES y ORIGEN),
 *   2. las variables de entorno estén en Cloudflare Pages (BREVO_API_KEY, BREVO_LIST_ID, BREVO_DOI_TEMPLATE_ID),
 *   3. la política de privacidad incluya el apartado del boletín (texto listo en docs/estrategia-leads.md).
 */
export const NEWSLETTER_ENABLED = false;

export type Interes = 'seguros' | 'tarjetas' | 'esim' | 'alquiler' | 'general';

/** Interés (segmento de Brevo) según el slug del clúster de un post o página pilar. */
export const interesDeCluster = (slug?: string): Interes => {
  switch (slug) {
    case 'seguros-de-viaje':
      return 'seguros';
    case 'tarjetas-para-viajar':
      return 'tarjetas';
    case 'esim-para-viajar':
      return 'esim';
    case 'alquiler-de-coches':
      return 'alquiler';
    default:
      return 'general';
  }
};

export const COPY: Record<Interes, { titulo: string; texto: string; boton: string }> = {
  seguros: {
    titulo: 'Avísame cuando haya descuento en seguros de viaje',
    texto:
      'Heymondo e IATI hacen campañas puntuales (Black Friday, Orange Friday, Semana Santa, verano). Te escribimos solo cuando haya una de verdad, sin spam.',
    boton: 'Quiero los avisos',
  },
  tarjetas: {
    titulo: 'Entérate si cambian las comisiones de las tarjetas para viajar',
    texto:
      'Revisamos las condiciones oficiales de N26, Revolut, Wise e imagin. Si cambian algo que te afecte al viajar, te lo contamos.',
    boton: 'Quiero los avisos',
  },
  esim: {
    titulo: 'Novedades y ofertas de eSIM para viajar',
    texto: 'Te contamos cuándo cambian los precios o aparece una oferta real en las eSIM que analizamos.',
    boton: 'Quiero los avisos',
  },
  alquiler: {
    titulo: 'Avisos sobre alquiler de coche en viajes',
    texto: 'Fianzas, tarjetas exigidas y trampas habituales: te avisamos cuando cambie algo importante.',
    boton: 'Quiero los avisos',
  },
  general: {
    titulo: 'Recibe nuestras guías y avisos de viaje',
    texto: 'Un correo útil de vez en cuando: viajes accesibles, seguros, tarjetas y trucos reales de ruta.',
    boton: 'Apuntarme',
  },
};
