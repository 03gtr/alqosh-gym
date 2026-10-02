import type { APIRoute } from 'astro';
import { webManifest } from '../utils/manifest';

/**
 * Web app manifest (home-screen installation and branding only).
 * No service worker and no offline caching: the installed app always loads
 * the current site from the network.
 */
export const GET: APIRoute = () =>
  new Response(JSON.stringify(webManifest(), null, 2), {
    headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
  });
