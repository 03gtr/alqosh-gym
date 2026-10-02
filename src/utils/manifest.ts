/**
 * Web app manifest content. Paths are base-aware (e.g. /alqosh-gym/…) so the
 * same code works on GitHub Pages and on a custom domain.
 */
import { brandAssets, product } from '../config/product';
import { gym } from '../config/gym';
import { url } from '../i18n/utils';

export function webManifest() {
  const start = url('/');
  return {
    id: start,
    name: product.name,
    short_name: product.name,
    description: gym.copy.description.ar,
    lang: 'ar',
    dir: 'rtl',
    start_url: start,
    scope: start,
    display: 'standalone',
    background_color: brandAssets.background,
    theme_color: gym.brand.colors.background,
    icons: [
      { src: url(brandAssets.icon192), sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: url(brandAssets.icon512), sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: url(brandAssets.iconMaskable512), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
