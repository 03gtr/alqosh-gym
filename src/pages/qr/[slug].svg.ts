import type { APIRoute, GetStaticPaths } from 'astro';
import QRCode from 'qrcode';
import { exercises } from '../../data/exercises';
import { absoluteUrl } from '../../i18n/utils';

/**
 * Print-ready QR code (SVG) for every exercise, generated at build time.
 * Encodes the permanent Arabic exercise URL; the page itself offers English.
 */
export const getStaticPaths = (() => exercises.map((e) => ({ params: { slug: e.slug } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params, site }) => {
  const target = absoluteUrl('ar', `/exercises/${params.slug}/`, site);
  const svg = await QRCode.toString(target, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' },
  });
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' } });
};
