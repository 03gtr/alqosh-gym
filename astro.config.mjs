// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';

/**
 * Deployment target.
 *  - SITE_URL:  public origin, e.g. https://03gtr.github.io or https://alqoshgym.com
 *  - BASE_PATH: sub-path the site is served from, e.g. /alqosh-gym (GitHub project pages) or /
 * The GitHub Pages workflow sets both automatically. Printed QR codes encode
 * SITE_URL + BASE_PATH, so keep them stable once QR codes are in the gym.
 */
const site = process.env.SITE_URL || 'https://03gtr.github.io';
const rawBase = process.env.BASE_PATH ?? '/';
const base = rawBase === '/' ? '/' : `/${rawBase.replace(/^\/+|\/+$/g, '')}/`;

/**
 * Markdown content uses root-relative links ("/calculator/"). Prefix them with
 * the deployment base path and mark external links.
 * @type {import('satteri').HastPluginEntry}
 */
const linkPlugin = {
  name: 'alqosh-links',
  element: {
    filter: ['a'],
    visit(node, ctx) {
      const href = node.properties?.href;
      if (typeof href !== 'string') return;
      if (href.startsWith('/') && !href.startsWith('//') && base !== '/') {
        ctx.setProperty(node, 'href', base + href.slice(1));
      } else if (/^https?:\/\//.test(href)) {
        ctx.setProperty(node, 'target', '_blank');
        ctx.setProperty(node, 'rel', 'noopener noreferrer');
      }
    },
  },
};

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: true,
  markdown: {
    processor: satteri({ hastPlugins: [linkPlugin] }),
  },
  // Dev only: polling avoids native file-watcher EBUSY crashes on Windows.
  vite: { server: { watch: { usePolling: true, interval: 400 } } },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'ar', locales: { ar: 'ar', en: 'en' } },
      // QR alias redirects and the internal visual QC sheet are not indexable pages.
      filter: (page) => !/\/exercise\/[^/]+\/$/.test(page) && !page.includes('/visuals-review/'),
    }),
  ],
});
