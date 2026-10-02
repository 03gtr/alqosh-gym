/**
 * IQ GYM — product-level identity and settings.
 *
 * Brand hierarchy:
 *   IQ Group (technology company)
 *     └─ IQ GYM (the fitness product — this codebase)
 *          └─ a gym instance (src/config/gym.ts) — Alqosh Gym is the first
 *
 * Everything here is shared by every gym that runs on IQ GYM. Anything that
 * belongs to one gym (name, hours, coaches, contact, benefits, theme) lives in
 * the gym configuration instead. IQ Group is the technology/product company;
 * it does not operate the gym.
 */
import type { Localized } from '../i18n/types';

export const product = {
  id: 'iq-gym',
  name: 'IQ GYM',
  /** Syriac product name, exactly as supplied by IQ Group (shown in the product wordmark). */
  syriacName: 'ܒܹܝܬ݂ ܕܲܪܵܫܘܼܬ݂ܵܐ',
  /** One-line description used on the About page. */
  about: {
    ar: 'IQ GYM منصة لياقة تعليمية تطوّرها IQ Group: موسوعة تمارين، أهداف ومسارات تدريب، أدوات تغذية، وتقدّم محلي بدون حساب. كل قاعة تستخدم IQ GYM تحتفظ بهويتها ومعلوماتها الخاصة؛ وتشغيل القاعة وإدارتها مسؤولية القاعة نفسها.',
    en: 'IQ GYM is an educational fitness platform developed by IQ Group: an exercise encyclopedia, goals and training pathways, nutrition tools and on-device progress without an account. Every gym on IQ GYM keeps its own identity and information; running and managing the gym is the gym’s own responsibility.',
  } satisfies Localized,
} as const;

/**
 * Official IQ GYM artwork (public/brand/). iq-gym-logo.jpg is the untouched
 * original supplied by IQ Group (1280×1280, black background). Every other
 * file is a scaled or cropped copy of it — never redrawn:
 *  - icon-192 / icon-512 / apple-touch-icon: the complete logo, scaled.
 *  - icon-maskable-512: the complete logo at 74 % on its own black background
 *    (fits Android's circular safe zone).
 *  - favicon-16/32, mark-96: crop of the king and ring (x 330, y 20, 600×600),
 *    because the full logo is unreadable at tab size.
 * Paths are relative to the site base (see `url()` in src/i18n/utils.ts).
 */
export const brandAssets = {
  logo: { src: '/brand/iq-gym-logo.jpg', width: 1280, height: 1280, type: 'image/jpeg' },
  logoWeb: { src: '/brand/iq-gym-logo-512.webp', width: 512, height: 512 },
  mark: { src: '/brand/iq-gym-mark-96.webp', width: 96, height: 96 },
  favicon16: '/brand/favicon-16.png',
  favicon32: '/brand/favicon-32.png',
  appleTouchIcon: '/brand/apple-touch-icon.png',
  icon192: '/brand/iq-gym-icon-192.png',
  icon512: '/brand/iq-gym-icon-512.png',
  iconMaskable512: '/brand/iq-gym-icon-maskable-512.png',
  /** Background of the artwork itself (Android launch screen). */
  background: '#000000',
} as const;

/** The technology company behind IQ GYM. Secondary to the gym in the gym experience. */
export const company = {
  name: 'IQ Group',
  credit: { ar: 'بدعم وتطوير IQ Group', en: 'Supported & Developed by IQ Group' } satisfies Localized,
  url: 'https://iq-group.app' as string | null,
} as const;

/**
 * Product splash (IQ GROUP → IQ GYM → the gym). Shown at most once per browser
 * session, never on QR landing pages, never with reduced motion, and it never
 * delays content: the page is already rendered underneath and the overlay
 * ignores pointer input while it fades away.
 */
export const splash = {
  enabled: true,
  /** sessionStorage key — "once per session". */
  sessionKey: 'iqGym.splashSeen',
  /** Total time the overlay is visible, in ms (fade included). */
  durationMs: 900,
} as const;

/**
 * On-device storage. Local progress is convenience data only — never
 * passwords, tokens or other secrets — and nothing is sent to a server.
 */
export const storage = {
  key: 'iqGymLocal',
  version: 1,
} as const;

/**
 * Analytics boundary. There is no analytics backend in this phase, so the
 * provider is "none": no events are collected, stored or sent, and no visitor
 * numbers are displayed anywhere. See src/utils/analytics.ts.
 */
export const analytics = {
  provider: 'none' as const,
  /** Future aggregate statistics hide any group smaller than this. */
  minGroupSize: 10,
} as const;
