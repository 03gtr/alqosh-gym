/**
 * Analytics boundary (contract only — no backend in this phase).
 *
 * A static site cannot truthfully count visitors across devices, so:
 *  - the active provider is "none": track() does nothing — no storage, no
 *    network requests, no cookies;
 *  - getPublicStats() returns null, and the UI hides statistics entirely
 *    rather than showing invented numbers.
 *
 * When a real analytics service is added later it must implement
 * AnalyticsProvider, tag every event with the gymId, be disclosed to users
 * with appropriate consent, and only ever publish aggregated numbers.
 *
 * Gender: never inferred — not from names, devices, behaviour, IP, browser or
 * language. If it is ever collected it must be a voluntary, optional answer
 * (VoluntaryGender) that is never required to use the site, and statistics
 * for small groups are suppressed (suppressSmallGroups).
 */
import type { Lang } from '../i18n/types';
import { analytics as config } from '../config/product';

export type AnalyticsEventType =
  | 'page_view'
  | 'exercise_view'
  | 'qr_scan'
  | 'goal_select'
  | 'search'
  | 'workout_complete';

/**
 * One anonymous event. Deliberately has no user id, no name, no gender, no
 * IP address and no device fingerprint.
 */
export interface AnalyticsEvent {
  type: AnalyticsEventType;
  gymId: string;
  lang: Lang;
  path?: string;
  /** Exercise slug, for exercise_view / qr_scan. */
  slug?: string;
  /** Goal id, for goal_select. */
  goal?: string;
  /** Normalised search text, for search. */
  query?: string;
}

export interface AnalyticsProvider {
  readonly name: string;
  track(event: AnalyticsEvent): void;
}

/** The only provider in this phase: collects nothing. */
export const noopProvider: AnalyticsProvider = Object.freeze({
  name: 'none',
  track: () => undefined,
});

export function createAnalytics(provider: typeof config.provider = config.provider): AnalyticsProvider {
  switch (provider) {
    case 'none':
    default:
      return noopProvider;
  }
}

/** Aggregated, verified statistics a gym may one day display publicly. */
export interface PublicStats {
  gymId: string;
  /** Where the numbers come from (must be a real analytics source). */
  source: string;
  period: { from: string; to: string };
  visitors: number;
  exerciseViews: { slug: string; count: number }[];
  goalSelections: { goal: string; count: number }[];
}

/** No real analytics source exists, so there are no statistics to show. */
export function getPublicStats(): PublicStats | null {
  return null;
}

/** Optional self-reported answer — future use only, never inferred, never required. */
export type VoluntaryGender = 'man' | 'woman' | 'prefer-not-to-say';

/** Drop groups too small to publish without risking identifying someone. */
export function suppressSmallGroups<T extends { count: number }>(rows: T[], min: number = config.minGroupSize): T[] {
  return rows.filter((r) => r.count >= min);
}
