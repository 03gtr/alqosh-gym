import type { APIRoute } from 'astro';

/**
 * robots.txt for the deployed base path. (On a GitHub *project* site crawlers
 * only read robots.txt at the domain root, so this takes full effect once the
 * site has its own domain; the sitemap is also linked from every page head.)
 */
export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  const sitemap = new URL(`${base}sitemap-index.xml`, site).href;
  const body = ['User-agent: *', 'Allow: /', `Disallow: ${base}visuals-review/`, '', `Sitemap: ${sitemap}`, ''].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
