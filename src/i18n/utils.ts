import { ui, type UIKey } from './ui';
import { DEFAULT_LANG, LANGS, type Lang, type Localized } from './types';

export { LANGS, DEFAULT_LANG, DIR } from './types';
export type { Lang, Localized } from './types';

/** Translate a UI key; `{name}` placeholders are replaced from `vars`. */
export function useT(lang: Lang) {
  return (key: UIKey, vars?: Record<string, string | number>): string => {
    let s: string = ui[lang][key] ?? ui[DEFAULT_LANG][key];
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
    return s;
  };
}

/** Pick the value for a language from a Localized object. */
export function pick<T>(value: Localized<T>, lang: Lang): T {
  return value[lang] ?? value[DEFAULT_LANG];
}

const BASE = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

/** Prefix a root-relative path with the deployment base path. */
export function url(path = '/'): string {
  const clean = path.replace(/^\/+/, '');
  return BASE + clean;
}

/**
 * Localised internal URL. Arabic (default) lives at the root, English under /en/.
 * `path` is root-relative and language-neutral, e.g. "/exercises/squat/".
 */
export function localePath(lang: Lang, path = '/'): string {
  const clean = path.replace(/^\/+/, '');
  return lang === DEFAULT_LANG ? url(clean) : url(`${lang}/${clean}`);
}

/** Absolute URL (for canonical / OpenGraph / QR codes). */
export function absoluteUrl(lang: Lang, path: string, site: URL | string | undefined): string {
  const origin = site ? new URL(String(site)).origin : '';
  return origin + localePath(lang, path);
}

export function otherLang(lang: Lang): Lang {
  return LANGS.find((l) => l !== lang) ?? DEFAULT_LANG;
}

/**
 * Locale-aware number formatting. Both languages use Western digits — the
 * norm on Iraqi gym equipment, plates and nutrition labels.
 */
export function formatNumber(n: number, lang: Lang, opts?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(lang === 'ar' ? 'ar-IQ-u-nu-latn' : 'en-US', opts).format(n);
}
