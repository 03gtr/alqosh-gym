export const LANGS = ['ar', 'en'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'ar';

/** A value provided in every supported language. */
export type Localized<T = string> = Record<Lang, T>;

export const DIR: Record<Lang, 'rtl' | 'ltr'> = { ar: 'rtl', en: 'ltr' };
