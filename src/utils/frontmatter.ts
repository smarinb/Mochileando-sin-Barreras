import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';
import type { RehypePlugin, RemarkPlugin } from '@astrojs/markdown-remark';

export const readingTimeRemarkPlugin: RemarkPlugin = () => {
  return function (tree, file) {
    const textOnPage = toString(tree);
    const readingTime = Math.ceil(getReadingTime(textOnPage).minutes);

    if (typeof file?.data?.astro?.frontmatter !== 'undefined') {
      file.data.astro.frontmatter.readingTime = readingTime;
    }
  };
};

export const responsiveTablesRehypePlugin: RehypePlugin = () => {
  return function (tree) {
    if (!tree.children) return;

    for (let i = 0; i < tree.children.length; i++) {
      const child = tree.children[i];

      if (child.type === 'element' && child.tagName === 'table') {
        tree.children[i] = {
          type: 'element',
          tagName: 'div',
          properties: {
            style: 'overflow:auto',
          },
          children: [child],
        };

        i++;
      }
    }
  };
};

// Enlaces de afiliado escritos como markdown dentro de los posts: se marcan con rel="nofollow sponsored noopener" y se abren en pestaña nueva.
const AFFILIATE_HOSTS = [
  'civitatis.com',
  'booking.com',
  'discovercars.com',
  'rentalcars.com',
  'heymondo.es',
  'heymondo.com',
  'n26.com',
  'amazon.es',
  'agoda.com',
  '12go.asia',
  'iatiseguros.com',
  'intermundial.es',
];
const AFFILIATE_REDIRECTORS = ['holafly.sjv.io', 'clk.tradedoubler.com', 'clk.roamic.com', 'bit.ly', 'amzn.to', 'share.bnext.es', 'go.nordvpn.net'];
// Enlaces de invitación o referido (sin parámetros reconocibles): se identifican por host y ruta.
const AFFILIATE_PATHS: [string, RegExp][] = [
  ['n26.com', /^\/r\//],
  ['booking.com', /^\/s\//],
  ['airbnb.es', /^\/c\//],
  ['airbnb.com', /^\/c\//],
  ['uber.com', /^\/invite\//],
  ['revolut.com', /^\/referral/],
  ['wise.com', /^\/invite\//],
];
const AFFILIATE_PARAMS = ['aid', 'a_aid', 'cod_descuento', 'affiliated', 'tag', 'affid', 'cid', 'z', 'r'];

const parseHref = (href: string) => {
  try {
    return new URL(href);
  } catch {
    return null;
  }
};

const isAffiliateHref = (href: string) => {
  const url = parseHref(href);
  if (!url) return false;
  const host = url.hostname.replace(/^www\./, '');
  if (AFFILIATE_REDIRECTORS.includes(host)) return true;
  if (AFFILIATE_PATHS.some(([h, re]) => (host === h || host.endsWith(`.${h}`)) && re.test(url.pathname))) return true;
  const known = AFFILIATE_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
  return known && AFFILIATE_PARAMS.some((k) => url.searchParams.has(k));
};

// Donaciones y perfiles sociales/mapas: ni editoriales ni de afiliación, así que no transmiten autoridad (nofollow, sin sponsored).
const NOFOLLOW_HOSTS = ['instagram.com', 'youtube.com', 'youtu.be', 'facebook.com', 'google.com'];
const isNofollowHref = (href: string) => {
  const url = parseHref(href);
  if (!url) return false;
  const host = url.hostname.replace(/^www\./, '');
  if (/(^|\.)paypal\.com$/.test(host)) return url.pathname.startsWith('/donate');
  return NOFOLLOW_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
};

export const affiliateLinksRehypePlugin: RehypePlugin = () => {
  return function (tree) {
    const walk = (node: any) => {
      if (node.type === 'element' && node.tagName === 'a' && typeof node.properties?.href === 'string') {
        if (isAffiliateHref(node.properties.href)) {
          node.properties.rel = ['nofollow', 'sponsored', 'noopener'];
          node.properties.target = '_blank';
        } else if (isNofollowHref(node.properties.href)) {
          node.properties.rel = ['nofollow', 'noopener'];
          node.properties.target = '_blank';
        }
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
};

const THIRD_PARTY_EMBEDS: Record<string, string> = {
  'www.youtube.com': 'YouTube',
  'www.youtube-nocookie.com': 'YouTube',
  'www.google.com': 'Google Maps',
  'maps.google.com': 'Google Maps',
  'rcm-eu.amazon-adsystem.com': 'Amazon',
};

/**
 * Los iframes de terceros (YouTube, Google Maps, widgets de Amazon) instalan cookies, así que no pueden cargarse antes del consentimiento.
 * Aquí `src` pasa a `data-consent-src` y `CookieConsent.astro` lo restaura al aceptar (o muestra un enlace alternativo).
 */
export const consentEmbedsRehypePlugin: RehypePlugin = () => {
  return function (tree) {
    const walk = (node: any) => {
      const isJsx = node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement';
      if (isJsx && node.name === 'iframe' && Array.isArray(node.attributes)) {
        const src = node.attributes.find((a: any) => a.name === 'src');
        if (src && typeof src.value === 'string') {
          try {
            const label = THIRD_PARTY_EMBEDS[new URL(src.value).hostname];
            if (label) {
              src.name = 'data-consent-src';
              node.attributes.push({ type: 'mdxJsxAttribute', name: 'data-consent-label', value: label });
              node.attributes = node.attributes.filter((a: any) => a.name !== 'loading');
            }
          } catch {
            /* URL no válida: se deja tal cual */
          }
        }
      } else if (node.type === 'element' && node.tagName === 'iframe' && typeof node.properties?.src === 'string') {
        try {
          const label = THIRD_PARTY_EMBEDS[new URL(node.properties.src).hostname];
          if (label) {
            node.properties.dataConsentSrc = node.properties.src;
            node.properties.dataConsentLabel = label;
            delete node.properties.src;
          }
        } catch {
          /* URL no válida */
        }
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
};
