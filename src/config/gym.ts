/**
 * Official ALQOSH GYM facts.
 *
 * Source: the gym's official promotional material and official statement.
 * Do NOT invent or change hours, benefits, discounts, coach details or contact
 * information. Anything not officially provided stays `null` / empty and is
 * simply not rendered.
 */
import type { Localized } from '../i18n/types';

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
  icon: string;
  title: Localized;
  detail: Localized;
  /** Permanent benefit, never a temporary promotion. */
  permanent: true;
}

export const gym = {
  name: { en: 'ALQOSH GYM', ar: 'قاعة القوش جم' },
  altName: { en: 'Alqosh Sports Club', ar: 'نادي القوش الرياضي' },

  hours: {
    men: {
      title: { ar: 'الرجال', en: 'Men' },
      icon: '👨',
      ranges: [
        {
          from: '05:00',
          to: '01:00',
          label: { ar: 'من 5 صباحاً إلى 1 ليلاً', en: '5:00 AM – 1:00 AM' },
        },
      ] satisfies TimeRange[],
    },
    women: {
      title: { ar: 'البنات', en: 'Women' },
      icon: '👩',
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
      icon: '🩺',
      title: { ar: 'تمارين علاجية', en: 'Therapeutic exercises' },
      detail: { ar: 'مجانية', en: 'Free' },
      permanent: true,
    },
    {
      id: 'security',
      icon: '🛡️',
      title: { ar: 'الأجهزة الأمنية', en: 'Security personnel' },
      detail: { ar: 'خصومات خاصة', en: 'Special discounts' },
      permanent: true,
    },
    {
      id: 'alqosh-employees',
      icon: '🏢',
      title: {
        ar: 'موظفو القوش من القرى المجاورة',
        en: 'Alqosh employees from neighboring villages',
      },
      detail: { ar: 'خصومات خاصة', en: 'Special discounts' },
      permanent: true,
    },
    {
      id: 'limited-income',
      icon: '🤝',
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

  coach: {
    name: { ar: 'راني اسمرو', en: 'Rani Asmaro' },
    title: { ar: 'الكابتن', en: 'Coach' },
    display: { ar: 'الكابتن راني اسمرو', en: 'Coach Rani Asmaro' },
    /**
     * Intentionally empty: no qualifications, certificates, experience or
     * achievements have been officially provided. Add verified items only.
     */
    credentials: [] as Localized[],
    photo: null as string | null,
  },

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

export const developer = {
  name: 'IQ Group',
  credit: { ar: 'بدعم وتطوير IQ Group', en: 'Supported & Developed by IQ Group' },
  about: {
    ar: 'هذا المشروع جزء من أعمال IQ Group الرقمية، وتم تطويره لدعم التجربة الرقمية لقاعة القوش جم.',
    en: "This project is part of IQ Group's digital work, developed to support Alqosh Gym's digital experience.",
  },
  url: null as string | null,
} as const;

export const COPYRIGHT_YEAR = 2026;
