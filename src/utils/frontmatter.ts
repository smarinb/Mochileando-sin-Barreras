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
const AFFILIATE_HOSTS = ['civitatis.com', 'booking.com', 'discovercars.com', 'rentalcars.com', 'heymondo.es', 'n26.com', 'amazon.es'];
const AFFILIATE_REDIRECTORS = ['holafly.sjv.io', 'clk.tradedoubler.com', 'clk.roamic.com', 'bit.ly', 'amzn.to', 'share.bnext.es', 'go.nordvpn.net'];

const isAffiliateHref = (href: string) => {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return false;
  }
  const host = url.hostname.replace(/^www\./, '');
  if (AFFILIATE_REDIRECTORS.includes(host)) return true;
  const known = AFFILIATE_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
  return known && ['aid', 'a_aid', 'cod_descuento', 'affiliated', 'tag'].some((k) => url.searchParams.has(k));
};

export const affiliateLinksRehypePlugin: RehypePlugin = () => {
  return function (tree) {
    const walk = (node: any) => {
      if (node.type === 'element' && node.tagName === 'a' && typeof node.properties?.href === 'string') {
        if (isAffiliateHref(node.properties.href)) {
          node.properties.rel = ['nofollow', 'sponsored', 'noopener'];
          node.properties.target = '_blank';
        }
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
};
