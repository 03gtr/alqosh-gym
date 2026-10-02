/**
 * Gym instance configuration — ALQOSH GYM, the first gym running on IQ GYM.
 *
 * Everything specific to one gym lives here (identity, theme, hours, benefits,
 * coaches, contact, gym-specific copy). Product-wide settings live in
 * ./product.ts. Reusable components read these values instead of hard-coding
 * the gym's name, so another gym can later supply its own configuration.
 *
 * Source: the gym's official promotional material and official statement.
 * Do NOT invent or change hours, benefits, discounts, coach details or contact
 * information. Anything not officially provided stays `null` / empty and is
 * simply not rendered.
 */
import type { Localized } from '../i18n/types';
import { product } from './product';

export interface TimeRange {
  /** 24h "HH:MM" */
  from: string;
  /** 24h "HH:MM" — may be past midnight (e.g. 01:00) */
  to: string;
  label: Localized;
}

export interface ContactNumber {
  /** As published by the gym (local format). */
  display: string;
  /** International format, e.g. "+9647502183800". */
  e164: string;
}

export interface Benefit {
  id: string;
  title: Localized;
  detail: Localized;
  /** Permanent benefit, never a temporary promotion. */
  permanent: true;
}

export interface Coach {
  id: 'men' | 'women';
  /** Which members the coach trains (matches the official hours groups). */
  group: Localized;
  /** Name exactly as officially provided; `en` is null when no official English spelling was given. */
  name: { ar: string; en: string | null };
  /** Verified qualifications only — none have been provided. */
  credentials: Localized[];
  /** Official photo path — none provided, so a typographic card is shown. */
  photo: string | null;
}

export const gym = {
  /** Stable instance id (future analytics, content overrides, multi-gym). */
  id: 'alqosh-gym',
  /** The product this gym runs on. */
  productId: product.id,
  name: { en: 'ALQOSH GYM', ar: 'قاعة القوش جم' },
  altName: { en: 'Alqosh Sports Club', ar: 'نادي القوش الرياضي' },

  /** Visual identity of this gym (the site theme). */
  brand: {
    /** Latin wordmark, split so the second word can take the accent colour. */
    wordmark: { lead: 'ALQOSH', accent: 'GYM' },
    /** Used for copyright and file names. */
    shortName: 'Alqosh Gym',
    slug: 'alqosh-gym',
    /** Theme tokens mirrored in src/styles/global.css (black / white / red). */
    colors: { background: '#070708', accent: '#e10600', text: '#ffffff' },
  },

  /** Supported languages; the first is the default (served at the root). */
  languages: ['ar', 'en'] as const,

  /** Gym-specific copy (kept here, not in the shared UI strings). */
  copy: {
    description: {
      ar: 'قاعة القوش جم — موسوعة تمارين مع شرح التقنية الصحيحة، حاسبة سعرات، تغذية، ومعلومات القاعة وأوقات الدوام.',
      en: 'ALQOSH GYM — exercise encyclopedia with correct technique, calorie calculator, nutrition guides, and official gym hours and benefits.',
    },
    identity: {
      ar: 'قاعة القوش جم ليست مجرد غرفة مليئة بالأجهزة؛ هي مكان للتمرين والتعلّم والتطور والاستشفاء، لفهم الجسم وبناء عادات صحية. هذا الموقع امتداد تعليمي لهذه البيئة.',
      en: 'ALQOSH GYM is not simply a room full of machines. It is a place to train, learn, improve and recover — to understand your body and build healthy habits. This website is an educational extension of that environment.',
    },
    aboutIntro: {
      ar: 'موقع قاعة القوش جم الرسمي: معلومات القاعة، موسوعة تمارين، وأدوات تغذية ولياقة تعليمية.',
      en: 'The official ALQOSH GYM website: gym information, an exercise encyclopedia and educational nutrition & fitness tools.',
    },
    developerNote: {
      ar: 'هذا المشروع جزء من أعمال IQ Group الرقمية، وتم تطويره لدعم التجربة الرقمية لقاعة القوش جم.',
      en: "This project is part of IQ Group's digital work, developed to support Alqosh Gym's digital experience.",
    },
  } satisfies Record<string, Localized>,

  /** Optional sections this gym shows (all officially provided for Alqosh Gym). */
  sections: { womenPathway: true, coaches: true, benefits: true },

  hours: {
    men: {
      title: { ar: 'الرجال', en: 'Men' },
      ranges: [
        {
          from: '05:00',
          to: '01:00',
          label: { ar: 'من 5 صباحاً إلى 1 ليلاً', en: '5:00 AM – 1:00 AM' },
        },
      ] satisfies TimeRange[],
    },
    women: {
      title: { ar: 'السيدات', en: 'Women' },
      ranges: [
        {
          from: '08:00',
          to: '10:00',
          label: { ar: 'صباحاً: 8:00 – 10:00', en: 'Morning: 8:00 AM – 10:00 AM' },
        },
        {
          from: '16:00',
          to: '18:00',
          label: { ar: 'مساءً: 4:00 – 6:00', en: 'Evening: 4:00 PM – 6:00 PM' },
        },
      ] satisfies TimeRange[],
    },
  },

  benefits: [
    {
      id: 'therapeutic',
      title: { ar: 'تمارين علاجية', en: 'Therapeutic exercises' },
      detail: { ar: 'مجانية', en: 'Free' },
      permanent: true,
    },
    {
      id: 'security',
      title: { ar: 'الأجهزة الأمنية', en: 'Security personnel' },
      detail: { ar: 'خصومات خاصة', en: 'Special discounts' },
      permanent: true,
    },
    {
      id: 'alqosh-employees',
      title: {
        ar: 'موظفو القوش من القرى المجاورة',
        en: 'Alqosh employees from neighboring villages',
      },
      detail: { ar: 'خصومات خاصة', en: 'Special discounts' },
      permanent: true,
    },
    {
      id: 'limited-income',
      title: { ar: 'ذوو الدخل المحدود', en: 'People with limited income' },
      detail: { ar: 'خصومات خاصة', en: 'Special discounts' },
      permanent: true,
    },
  ] satisfies Benefit[],

  discountPolicy: {
    headline: {
      ar: 'الخصومات مستمرة وليست عرضاً مؤقتاً',
      en: 'Our discounts are permanent — not a temporary offer',
    },
    statement: {
      ar: 'الخصومات المذكورة معتمدة منذ اليوم الأول من افتتاح قاعة القوش جم، وليست عرضاً مؤقتاً، بل مستمرة بشكل دائم حرصاً منا على دعم وخدمة جميع المشتركين وتوفير بيئة رياضية مناسبة للجميع.',
      en: 'The listed discounts have been in place since the first day Alqosh Gym opened. They are not a temporary offer — they continue permanently, out of our commitment to supporting and serving all members and providing a suitable sporting environment for everyone.',
    },
  },

  /** Coaching team (official names only — no invented credentials, photos or bios). */
  coaches: [
    {
      id: 'men',
      group: { ar: 'الرجال', en: 'Men' },
      name: { ar: 'الكابتن راني اسمرو', en: 'Coach Rani Asmaro' },
      credentials: [],
      photo: null,
    },
    {
      id: 'women',
      group: { ar: 'السيدات', en: 'Women' },
      name: { ar: 'الكابتن عذراء قس يونان', en: null },
      credentials: [],
      photo: null,
    },
  ] satisfies Coach[] as Coach[],

  /**
   * Official contact details (supplied by the gym). The phone number is also
   * the WhatsApp number. `e164` is the same number in international format
   * (Iraq +964, leading 0 dropped) for tel: and wa.me links.
   * No street address has been provided — the Google Maps link is the
   * official location. Anything left null is simply not rendered.
   */
  contact: {
    phone: { display: '0750 218 3800', e164: '+9647502183800' } as ContactNumber | null,
    whatsapp: { display: '0750 218 3800', e164: '+9647502183800' } as ContactNumber | null,
    address: null as Localized | null,
    mapUrl: 'https://maps.app.goo.gl/CoY85ebkDbvYP2EQ6?g_st=ac' as string | null,
    socials: [{ id: 'facebook', url: 'https://facebook.com/share/19o136kGJc' }] as { id: 'facebook'; url: string }[],
  },
} as const;

export const COPYRIGHT_YEAR = 2026;
