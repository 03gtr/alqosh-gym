/**
 * Short, respectful encouragement shown only at meaningful moments (a
 * recorded exercise or workout, coming back after a break, a streak
 * milestone). Never shaming, never comparing the user with others, never
 * anxiety-inducing — and the user can switch it off on "My progress".
 */
import type { Localized } from '../i18n/types';
import { lastActiveBefore, streak, daysBetween, type LocalState } from './progress';

export type MotivationEvent = 'exercise-complete' | 'workout-complete';

export const MESSAGES = {
  exercise: { ar: 'تمرين مكتمل. استمر.', en: 'Exercise done. Keep going.' },
  workout: { ar: 'اليوم محسوب.', en: 'Today counts.' },
  comeback: { ar: 'رجعت؟ ممتاز. نكمل من هنا.', en: 'You’re back — great. Let’s carry on from here.' },
  streak: { ar: 'سلسلة التزام: {days}. استمر على خطتك.', en: 'Streak: {days}. Stay with your plan.' },
  restart: { ar: 'نبدأ من جديد. خطوة اليوم محسوبة.', en: 'A fresh start. Today’s step counts.' },
} satisfies Record<string, Localized>;

/** Streak lengths worth a word of encouragement. */
export const MILESTONES = [3, 7, 14, 30, 60, 100] as const;

/** Days without activity after which a return is welcomed. */
const COMEBACK_GAP = 3;

/**
 * Message for an event, comparing the state before and after it was
 * recorded. Returns null when messages are switched off.
 */
export function motivationFor(before: LocalState, after: LocalState, event: MotivationEvent, today: string): Localized | null {
  if (!after.prefs.motivation) return null;
  const firstToday = !before.activity.includes(today) && after.activity.includes(today);
  if (firstToday) {
    const last = lastActiveBefore(before.activity, today);
    if (last && daysBetween(last, today) >= COMEBACK_GAP) return MESSAGES.comeback;
    const n = streak(after.activity, today);
    if ((MILESTONES as readonly number[]).includes(n)) return fill(MESSAGES.streak, n);
  }
  return event === 'workout-complete' ? MESSAGES.workout : MESSAGES.exercise;
}

function fill(m: Localized, n: number): Localized {
  return { ar: m.ar.replace('{days}', daysLabel(n, 'ar')), en: m.en.replace('{days}', daysLabel(n, 'en')) };
}

/** "n days" with correct Arabic number agreement (يوم واحد، يومان، 3 أيام، 11 يوماً، 100 يوم). */
export function daysLabel(n: number, lang: 'ar' | 'en'): string {
  if (lang === 'en') return n === 1 ? '1 day' : `${n} days`;
  if (n === 0) return '0 أيام';
  if (n === 1) return 'يوم واحد';
  if (n === 2) return 'يومان';
  const mod = n % 100;
  if (mod >= 3 && mod <= 10) return `${n} أيام`;
  if (mod >= 11 && mod <= 99) return `${n} يوماً`;
  return `${n} يوم`;
}
