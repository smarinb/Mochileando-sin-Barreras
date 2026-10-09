/**
 * Arquitectura de contenido: clústeres temáticos (hub & spoke).
 *
 * - `pillar`: página pilar en `src/pages/` (el "hub" que concentra la autoridad).
 * - `category`: título de la categoría del blog (su slug sale de aquí: /category/<slug>).
 *   Cada post del clúster debe usar EXACTAMENTE este `category` en su frontmatter.
 *
 * Para añadir un clúster nuevo (p. ej. Destinos o Alquiler de coches), añade una entrada aquí,
 * pon ese `category` en los posts y, si quieres, actívalo en `src/navigation.ts`.
 */
export interface Cluster {
  /** Slug de la categoría (debe coincidir con el slug que genera `category`). */
  slug: string;
  /** Título de la categoría tal y como va en el frontmatter de los posts. */
  category: string;
  /** Nombre corto para menús y chips. */
  label: string;
  /** Nombre para usar dentro de una frase (minúsculas salvo siglas): "seguros de viaje", "eSIM para viajar". */
  inline: string;
  /** H1 de la página de categoría. */
  h1: string;
  /** Meta title de la página de categoría. */
  metaTitle: string;
  /** Meta description de la página de categoría. */
  metaDescription: string;
  /** Texto introductorio visible en la página de categoría. */
  intro: string;
  /** Opcional: un clúster puede existir (categoría + posts) antes de tener su página pilar. */
  pillar?: { href: string; title: string; cta: string };
  icon: string;
  /** Opcional: 'destinos' agrupa los clústeres geográficos y 'temas' los temáticos no comerciales (ver docs/arquitectura-destinos.md). */
  group?: 'destinos' | 'temas';
  /** Opcional: slugs de clústeres comerciales, por orden de relevancia, para el bloque «Prepara tu viaje» de un destino. */
  bridges?: string[];
}

export const clusters: Cluster[] = [
  {
    slug: 'seguros-de-viaje',
    category: 'Seguros de viaje',
    label: 'Seguros de viaje',
    inline: 'seguros de viaje',
    h1: 'Seguros de viaje: comparativas, descuentos y cuál elegir',
    metaTitle: 'Seguros de viaje: comparativas, descuentos y cuál elegir',
    metaDescription:
      'Comparativas reales de Heymondo, IATI, Chapka e Intermundial, con descuentos verificados y simulaciones de precio. Elige el seguro que encaja contigo.',
    intro:
      'Hemos cotizado, contratado y usado estos seguros en viajes reales. Aquí tienes las comparativas cara a cara, cómo conseguir de verdad el descuento y qué póliza te conviene según tu viaje.',
    pillar: {
      href: '/mejor-seguro-de-viaje',
      title: 'Mejor seguro de viaje 2026: comparativa, ranking y descuentos',
      cta: 'Ver la guía del mejor seguro de viaje',
    },
    icon: 'tabler:shield-check',
  },
  {
    slug: 'tarjetas-para-viajar',
    category: 'Tarjetas para viajar',
    label: 'Tarjetas para viajar',
    inline: 'tarjetas para viajar',
    h1: 'Tarjetas para viajar sin comisiones: reseñas y comparativas',
    metaTitle: 'Tarjetas para viajar sin comisiones: reseñas y comparativas',
    metaDescription:
      'Reseñas y comparativas de N26, Revolut, Wise e imagin para pagar y sacar dinero en el extranjero sin comisiones. Descubre cuál te conviene según tu viaje.',
    intro:
      'Pagar en el extranjero sin comisiones ocultas depende de la tarjeta que lleves. Estas son nuestras reseñas y comparativas de N26, Revolut, Wise e imagin, con sus límites y letra pequeña.',
    pillar: {
      href: '/mejor-tarjeta-para-viajar',
      title: 'Mejor tarjeta para viajar en 2026',
      cta: 'Ver la guía de la mejor tarjeta para viajar',
    },
    icon: 'tabler:credit-card',
  },
  {
    slug: 'esim-para-viajar',
    category: 'eSIM para viajar',
    label: 'eSIM para viajar',
    inline: 'eSIM para viajar',
    h1: 'eSIM para viajar: reseñas y comparativas',
    metaTitle: 'eSIM para viajar: reseñas y comparativas (Holafly, Airalo)',
    metaDescription:
      'Opiniones y comparativas de Holafly, Airalo, Saily, Roamic, SimOptions y eSIMFLAG para tener internet en el extranjero sin pagar roaming. Elige tu eSIM.',
    intro:
      'Tener internet nada más aterrizar es de lo primero que resolvemos al viajar. Estas son nuestras reseñas y comparativas de las eSIM más populares, con precios, cobertura y límites reales.',
    pillar: {
      href: '/mejor-esim-para-viajar',
      title: 'Las mejores eSIM para viajar en 2026',
      cta: 'Ver la guía de la mejor eSIM para viajar',
    },
    icon: 'tabler:wifi',
  },
  {
    slug: 'alquiler-de-coches',
    category: 'Alquiler de coches',
    label: 'Alquiler de coches',
    inline: 'alquiler de coches',
    h1: 'Alquiler de coches: opiniones y comparativas',
    metaTitle: 'Alquiler de coches: opiniones y comparativas (Discover Cars)',
    metaDescription:
      'Opiniones y comparativas de plataformas de alquiler de coches como Discover Cars: fianza, seguros y trucos para reservar sin sustos en el mostrador.',
    intro:
      'Hemos alquilado coche en Argentina, Islandia, Eslovenia o Lanzarote. Aquí tienes nuestras opiniones y comparativas sobre fianzas, seguros y plataformas para reservar sin sorpresas.',
    pillar: {
      href: '/mejor-alquiler-de-coches',
      title: 'Mejor alquiler de coches en 2026',
      cta: 'Ver la guía del mejor alquiler de coches',
    },
    icon: 'tabler:car',
  },
  {
    slug: 'patagonia',
    category: 'Patagonia',
    label: 'Patagonia',
    inline: 'la Patagonia',
    group: 'destinos',
    bridges: ['alquiler-de-coches', 'esim-para-viajar', 'seguros-de-viaje', 'tarjetas-para-viajar'],
    h1: 'Patagonia por libre: rutas, excursiones y qué ver en Argentina y Chile',
    metaTitle: 'Patagonia por libre: rutas, excursiones y qué ver',
    metaDescription:
      'Guías reales de la Patagonia argentina y chilena: Ruta 25 y Los Altares, ballenas, glaciares de El Calafate, Punta Arenas y Carretera Austral.',
    intro:
      'Hemos recorrido la Patagonia en camper, de Chubut a Tierra del Fuego. Aquí tienes las paradas, excursiones y rutas que de verdad merecen la pena, con consejos prácticos para viajar por libre.',
    pillar: {
      href: '/guia-patagonia',
      title: 'Guía de la Patagonia por libre: qué ver y excursiones',
      cta: 'Ver la guía de la Patagonia',
    },
    icon: 'tabler:mountain',
  },
  {
    slug: 'mendoza',
    category: 'Mendoza',
    label: 'Mendoza',
    inline: 'Mendoza',
    group: 'destinos',
    bridges: ['alquiler-de-coches', 'esim-para-viajar', 'seguros-de-viaje', 'tarjetas-para-viajar'],
    h1: 'Mendoza: Valle de Uco, bodegas y qué hacer en los Andes',
    metaTitle: 'Mendoza: Valle de Uco, bodegas y qué hacer',
    metaDescription:
      'Guías de Mendoza (Argentina): Valle de Uco, bodegas para visitar, excursiones de montaña y cómo organizar el viaje con datos de fuentes oficiales.',
    intro:
      'Mendoza es vino y montaña. Aquí reunimos guías con datos contrastados en fuentes oficiales: el Valle de Uco, las bodegas que merece la pena reservar y cómo llegar sin complicarte.',
    pillar: {
      href: '/que-hacer-en-mendoza',
      title: 'Qué hacer en Mendoza capital: 1, 2 y 3 días',
      cta: 'Ver la guía de Mendoza capital',
    },
    icon: 'tabler:grape',
  },
  {
    slug: 'eslovenia',
    category: 'Eslovenia',
    label: 'Eslovenia',
    inline: 'Eslovenia',
    group: 'destinos',
    bridges: ['alquiler-de-coches', 'seguros-de-viaje', 'esim-para-viajar', 'tarjetas-para-viajar'],
    h1: 'Eslovenia: qué ver y hacer, de Liubliana al valle del Soča',
    metaTitle: 'Eslovenia: qué ver y hacer, de Liubliana al valle del Soča',
    metaDescription:
      'Guías de Eslovenia: qué ver en el país y en Liubliana, Lago Bled, Bohinj, cuevas de Postojna, Piran y el valle del Soča, con excursiones y consejos prácticos.',
    intro:
      'Eslovenia es pequeña pero cabe mucho dentro: ciudades de cuento, lagos alpinos, cuevas y ríos de color esmeralda. Estas son nuestras guías para organizar el viaje.',
    pillar: {
      href: '/que-ver-y-hacer-en-eslovenia',
      title: 'Qué ver y hacer en Eslovenia: guía completa',
      cta: 'Ver la guía de qué ver en Eslovenia',
    },
    icon: 'tabler:building-castle',
  },
  {
    slug: 'siberia-y-rusia',
    category: 'Siberia y Rusia',
    label: 'Siberia y Rusia',
    inline: 'Siberia y Rusia',
    group: 'destinos',
    bridges: ['seguros-de-viaje', 'tarjetas-para-viajar', 'esim-para-viajar', 'alquiler-de-coches'],
    h1: 'Siberia y Rusia por libre: transiberiano, Baikal y consejos',
    metaTitle: 'Siberia y Rusia por libre: transiberiano, Baikal y guías',
    metaDescription:
      'Guías de Siberia y Rusia: visado, transiberiano en 3ª clase, Irkutsk, isla de Oljón, lago Baikal, ropa para el invierno y accesibilidad para personas sordas.',
    intro:
      'Viajamos por Siberia en pleno invierno, en transiberiano y a dedo. Estas son nuestras guías de ruta, visado, ropa y accesibilidad, escritas con la experiencia de dos viajeros, una de ellos sorda.',
    pillar: {
      href: '/guia-siberia',
      title: 'Guía completa de Siberia',
      cta: 'Ver la guía completa de Siberia',
    },
    icon: 'tabler:snowflake',
  },
  {
    slug: 'viajar-siendo-sordo',
    category: 'Viajar siendo sordo',
    label: 'Viaje sordo',
    inline: 'viajar siendo sordo',
    group: 'temas',
    bridges: ['seguros-de-viaje', 'esim-para-viajar', 'tarjetas-para-viajar', 'alquiler-de-coches'],
    h1: 'Viajar siendo sordo: accesibilidad, consejos y experiencias reales',
    metaTitle: 'Viajar siendo sordo: accesibilidad, consejos y entrevistas',
    metaDescription:
      'Guías de accesibilidad para viajeros sordos o con hipoacusia: aeropuertos, audífonos e implantes, turismo accesible y entrevistas a viajeros sordos.',
    intro:
      'Cris es sorda y viaja por libre desde hace años. Aquí reunimos lo que hemos aprendido: cómo pedir asistencia, qué llevar con audífonos, qué destinos son accesibles y las historias de otros viajeros sordos.',
    pillar: {
      href: '/viajar-siendo-sordo',
      title: 'Viajar siendo sordo: guía de accesibilidad',
      cta: 'Ver la guía para viajar siendo sordo',
    },
    icon: 'tabler:ear-off',
  },
  {
    slug: 'vuelta-al-mundo-y-camper',
    category: 'Vuelta al mundo y camper',
    label: 'Vuelta al mundo',
    inline: 'la vuelta al mundo y el camper',
    group: 'temas',
    bridges: ['seguros-de-viaje', 'tarjetas-para-viajar', 'esim-para-viajar', 'alquiler-de-coches'],
    h1: 'Vuelta al mundo y camper: cómo dejarlo todo y viajar sin billete de vuelta',
    metaTitle: 'Vuelta al mundo y camper: cómo dejarlo todo y viajar',
    metaDescription:
      'Cómo dar la vuelta al mundo o vivir viajando: excedencia, ahorro, diario mes a mes con presupuesto y guías de camper (baño seco, cocina, energía y envío).',
    intro:
      'Lo dejamos todo para viajar sin billete de vuelta: primero en mochila y después en camper. Aquí tienes cómo lo planificamos, cuánto costó mes a mes y qué equipo usamos.',
    pillar: {
      href: '/como-vivir-viajando-por-el-mundo',
      title: 'Cómo dar la vuelta al mundo o vivir viajando',
      cta: 'Ver la guía de cómo vivir viajando',
    },
    icon: 'tabler:backpack',
  },
  {
    slug: 'kazajistan',
    category: 'Kazajistán',
    label: 'Kazajistán',
    inline: 'Kazajistán',
    group: 'destinos',
    bridges: ['seguros-de-viaje', 'esim-para-viajar', 'tarjetas-para-viajar', 'alquiler-de-coches'],
    h1: 'Kazajistán por libre: qué ver, autostop, fronteras y seguridad',
    metaTitle: 'Kazajistán por libre: qué ver, autostop y fronteras',
    metaDescription:
      'Guías de Kazajistán: Astaná, Almaty, el cañón Charyn, los lagos Kolsai, Turquestán, autostop, cruce de fronteras y si es seguro viajar.',
    intro:
      'Recorrimos Kazajistán de norte a sur, en invierno y haciendo autostop. Estas son nuestras guías de ruta, fronteras, seguridad y qué ver.',
    pillar: {
      href: '/guia-kazajistan',
      title: 'Guía completa para viajar a Kazajistán',
      cta: 'Ver la guía completa de Kazajistán',
    },
    icon: 'tabler:horse',
  },
  {
    slug: 'uzbekistan',
    category: 'Uzbekistán',
    label: 'Uzbekistán',
    inline: 'Uzbekistán',
    group: 'destinos',
    bridges: ['seguros-de-viaje', 'esim-para-viajar', 'tarjetas-para-viajar', 'alquiler-de-coches'],
    h1: 'Uzbekistán por libre: Samarcanda, Bujará, Khiva y consejos',
    metaTitle: 'Uzbekistán por libre: Samarcanda, Bujará, Khiva y guías',
    metaDescription:
      'Guías de Uzbekistán: Samarcanda, Bujará, Khiva, Tashkent, el mar Aral, registro del viajero, autostop y seguridad para viajar por libre.',
    intro:
      'Seguimos la Ruta de la Seda por Uzbekistán: ciudades de adobe y azulejos, el mar Aral y todo lo práctico, desde el registro del viajero hasta el autostop.',
    pillar: {
      href: '/guia-uzbekistan',
      title: 'Guía completa para viajar a Uzbekistán',
      cta: 'Ver la guía completa de Uzbekistán',
    },
    icon: 'tabler:building-mosque',
  },
  {
    slug: 'india',
    category: 'India',
    label: 'India',
    inline: 'India',
    group: 'destinos',
    bridges: ['seguros-de-viaje', 'esim-para-viajar', 'tarjetas-para-viajar', 'alquiler-de-coches'],
    h1: 'India por libre: noreste, Rajastán y consejos para viajar',
    metaTitle: 'India por libre: noreste, Rajastán y consejos prácticos',
    metaDescription:
      'Guías de India: las siete hermanas del noreste, Meghalaya, Majuli, Kaziranga, Udaipur, el Triángulo de oro, visado, transporte, apps e internet.',
    intro:
      'Pasamos dos meses en India con presupuesto mochilero. Aquí tienes el noreste desconocido, Rajastán y todo lo práctico: visado, transportes, apps e internet.',
    pillar: {
      href: '/guia-india',
      title: 'Guía de India por libre: noreste, Rajastán y consejos',
      cta: 'Ver la guía de India',
    },
    icon: 'tabler:flower',
  },
  {
    slug: 'tailandia',
    category: 'Tailandia',
    label: 'Tailandia',
    inline: 'Tailandia',
    group: 'destinos',
    bridges: ['seguros-de-viaje', 'esim-para-viajar', 'tarjetas-para-viajar', 'alquiler-de-coches'],
    h1: 'Tailandia por libre: guía, mejor época y la Tailandia desconocida',
    metaTitle: 'Tailandia por libre: guía, mejor época y rincones',
    metaDescription:
      'Guías de Tailandia: cómo viajar, mejor época y festivales, la provincia de Loei, el festival Phi Ta Khon y el mercado del tren de Bangkok.',
    intro:
      'Tailandia más allá de las islas: guía práctica, cuándo ir y los rincones que descubrimos autostopeando por el norte.',
    pillar: {
      href: '/viajar-a-tailandia',
      title: 'Guía para viajar a Tailandia',
      cta: 'Ver la guía de Tailandia',
    },
    icon: 'tabler:beach',
  },
  {
    slug: 'libano',
    category: 'Líbano',
    label: 'Líbano',
    inline: 'Líbano',
    group: 'destinos',
    bridges: ['seguros-de-viaje', 'esim-para-viajar', 'tarjetas-para-viajar', 'alquiler-de-coches'],
    h1: 'Líbano por libre: Beirut, qué ver, comer y moverse',
    metaTitle: 'Líbano por libre: Beirut, qué ver, comer y transporte',
    metaDescription:
      'Guías de Líbano: Beirut, qué ver en un itinerario de 1 a 2 semanas, comida libanesa, dónde comer, transportes y si es seguro viajar.',
    intro:
      'Líbano nos sorprendió: historia, comida y gente. Aquí tienes cómo organizar el viaje, qué ver en Beirut y en el país, qué comer y cómo moverte.',
    pillar: {
      href: '/guia-completa-viajar-libano',
      title: 'Guía completa para viajar a Líbano',
      cta: 'Ver la guía completa de Líbano',
    },
    icon: 'tabler:leaf',
  },
];

export const getClusterBySlug = (slug?: string) => clusters.find((c) => c.slug === slug);
export const getClusterByCategoryTitle = (title?: string) => clusters.find((c) => c.category === title);
export const getClusterByPillar = (href: string) => clusters.find((c) => c.pillar?.href === href);
