import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

/**
 * Menú principal organizado por clústeres (ver src/data/clusters.ts).
 * Cada desplegable abre con la PÁGINA PILAR (la que concentra la autoridad) y
 * termina con la categoría del blog con todas las guías del tema.
 *
 * Pendiente de activar cuando exista el contenido:
 *   - Destinos:  { text: 'Destinos', href: getPermalink('/destinos') }
 */
export const headerData = {
  links: [
    {
      text: 'Seguros',
      links: [
        { text: 'Mejor seguro de viaje 2026', href: getPermalink('/mejor-seguro-de-viaje') },
        { text: 'Opiniones Heymondo', href: getPermalink('/heymondo-opiniones') },
        { text: 'Opiniones IATI', href: getPermalink('/iati-seguros-opiniones') },
        { text: 'Heymondo o IATI', href: getPermalink('/heymondo-o-iati') },
        { text: 'Descuento Heymondo', href: getPermalink('/descuento-heymondo') },
        { text: 'Descuento IATI', href: getPermalink('/descuento-iati') },
        { text: 'Todas las guías de seguros →', href: getPermalink('seguros-de-viaje', 'category') },
      ],
    },
    {
      text: 'Tarjetas',
      links: [
        { text: 'Mejor tarjeta para viajar', href: getPermalink('/mejor-tarjeta-para-viajar') },
        { text: 'N26 para viajar', href: getPermalink('/tarjeta-n26') },
        { text: 'Revolut para viajar', href: getPermalink('/tarjeta-revolut') },
        { text: 'Wise para viajar', href: getPermalink('/tarjeta-wise') },
        { text: 'N26 vs Revolut', href: getPermalink('/n26-vs-revolut') },
        { text: 'Todas las guías de tarjetas →', href: getPermalink('tarjetas-para-viajar', 'category') },
      ],
    },
    {
      text: 'eSIM',
      links: [
        { text: 'Mejor eSIM para viajar', href: getPermalink('/mejor-esim-para-viajar') },
        { text: 'Holafly vs Airalo', href: getPermalink('/holafly-vs-airalo') },
        { text: 'Opiniones Holafly', href: getPermalink('/esim-holafly-opiniones') },
        { text: 'Opiniones Airalo', href: getPermalink('/esim-airalo-opiniones') },
        { text: 'Opiniones eSIMFLAG', href: getPermalink('/esimflag-opiniones') },
        { text: 'Todas las guías de eSIM →', href: getPermalink('esim-para-viajar', 'category') },
      ],
    },
    {
      text: 'Coches',
      links: [
        { text: 'Mejor alquiler de coches', href: getPermalink('/mejor-alquiler-de-coches') },
        { text: 'Opiniones Discover Cars', href: getPermalink('/discovercars-opiniones') },
        { text: 'Opiniones Rentalcars', href: getPermalink('/rentalcars-opiniones') },
        { text: 'DiscoverCars vs Rentalcars', href: getPermalink('/discovercars-vs-rentalcars') },
        { text: 'Opiniones Sixt', href: getPermalink('/sixt-opiniones') },
        { text: 'Opiniones Auto Europe', href: getPermalink('/auto-europe-opiniones') },
        { text: 'Opiniones Goldcar', href: getPermalink('/goldcar-opiniones') },
        { text: 'Todas las guías de alquiler →', href: getPermalink('alquiler-de-coches', 'category') },
      ],
    },
    {
      text: 'Destinos',
      links: [
        { text: 'Guía de la Patagonia', href: getPermalink('/guia-patagonia') },
        { text: 'Qué ver en Eslovenia', href: getPermalink('/que-ver-y-hacer-en-eslovenia') },
        { text: 'Guía completa de Siberia', href: getPermalink('/guia-siberia') },
        { text: 'Guía de Kazajistán', href: getPermalink('/guia-kazajistan') },
        { text: 'Guía de Uzbekistán', href: getPermalink('/guia-uzbekistan') },
        { text: 'Guía de India', href: getPermalink('/guia-india') },
        { text: 'Todos los destinos →', href: getPermalink('/destinos') },
      ],
    },
    {
      text: 'Viaje sordo',
      links: [
        { text: 'Guía para viajar siendo sordo', href: getPermalink('/viajar-siendo-sordo') },
        { text: 'Asistencia en el aeropuerto', href: getPermalink('/asistencia-aeropuerto-discapacidad-auditiva') },
        { text: 'Audífonos e implantes en el equipaje', href: getPermalink('/audifonos-e-implantes-viajando') },
        { text: 'Sordomundo', href: getPermalink('/sordomundo') },
        { text: 'Todas las guías de viaje sordo →', href: getPermalink('viajar-siendo-sordo', 'category') },
      ],
    },
    {
      text: 'Acerca de',
      links: [
        { text: 'Quiénes somos', href: getPermalink('/acerca-de') },
        { text: 'Libro de Cris', href: 'https://a.co/d/0j4iAifK' },
        { text: 'Trabajemos juntos', href: getPermalink('/trabajemos') },
      ],
    },
  ],
  actions: [
    {
      text: 'Contacto',
      icon: 'tabler:mail',
      href: getPermalink('/contacto'),
    },
  ],
};

export const footerData = {
  links: [
    {
      title: 'Guías para preparar tu viaje',
      links: [
        { text: 'Mejor seguro de viaje', href: getPermalink('/mejor-seguro-de-viaje') },
        { text: 'Mejor tarjeta para viajar', href: getPermalink('/mejor-tarjeta-para-viajar') },
        { text: 'Mejor eSIM para viajar', href: getPermalink('/mejor-esim-para-viajar') },
        { text: 'Viajar siendo sordo', href: getPermalink('/viajar-siendo-sordo') },
        { text: 'Vuelta al mundo y camper', href: getPermalink('/como-vivir-viajando-por-el-mundo') },
        { text: 'Destinos', href: getPermalink('/destinos') },
        { text: 'Descuento Heymondo', href: getPermalink('/descuento-heymondo') },
        { text: 'Descuento IATI', href: getPermalink('/descuento-iati') },
      ],
    },
    {
      title: 'Comparativas populares',
      links: [
        { text: 'Heymondo o IATI', href: getPermalink('/heymondo-o-iati') },
        { text: 'N26 vs Revolut', href: getPermalink('/n26-vs-revolut') },
        { text: 'Holafly vs Airalo', href: getPermalink('/holafly-vs-airalo') },
        { text: 'IATI vs Chapka', href: getPermalink('/iati-vs-chapka') },
        { text: 'Revolut vs Wise', href: getPermalink('/revolut-vs-wise') },
      ],
    },
    {
      title: 'El Proyecto',
      links: [
        { text: 'Acerca de nosotros', href: getPermalink('/acerca-de') },
        { text: 'El Libro', href: 'https://a.co/d/0j4iAifK' },
        { text: 'Blog', href: getBlogPermalink() },
        { text: 'Trabajemos juntos', href: getPermalink('/trabajemos') },
        { text: 'Contacto', href: getPermalink('/contacto') },
      ],
    },
    {
      title: 'Legal',
      links: [
        { text: 'Aviso Legal', href: getPermalink('/aviso-legal') },
        { text: 'Privacidad', href: getPermalink('/privacidad') },
        { text: 'Cookies', href: getPermalink('/cookies') },
        { text: 'Configurar cookies', href: '#configurar-cookies' },
      ],
    },
  ],
  secondaryLinks: [],
  socialLinks: [
    { ariaLabel: 'YouTube', icon: 'tabler:brand-youtube', href: 'https://www.youtube.com/@Mochileandosinbarreras' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: 'https://www.instagram.com/mochileandosinbarreras/' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
    © ${new Date().getFullYear()} Mochileando sin Barreras · Todos los derechos reservados.
  `,
};
