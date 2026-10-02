/**
 * Local progress — "MY IQ GYM" without an account.
 *
 * Pure, framework-free logic (unit-tested); the browser wrapper in
 * src/scripts/progress-store.ts reads and writes localStorage.
 *
 * Privacy & security boundary:
 *  - Convenience data only: preferences, exercise slugs and dates. No names,
 *    no body measurements, no gender, no passwords, tokens or other secrets.
 *  - Lives only on this device. Clearing site data, private browsing or a new
 *    device starts fresh. Nothing is sent anywhere.
 *  - Versioned schema. Malformed or incompatible data never crashes the site:
 *    it is repaired where possible, otherwise reset (and the UI says so).
 *
 * Future path: local progress → account → cloud sync (not in this phase).
 */
import type { Difficulty } from '../data/taxonomy';
import { GOAL_IDS, type GoalId } from '../data/goal-ids';
import { storage } from '../config/product';

export const SCHEMA_VERSION = storage.version;
export const STORAGE_KEY = `${storage.key}.v${storage.version}`;

const LEVELS: readonly Difficulty[] = ['beginner', 'intermediate', 'advanced'];
const LOCATIONS = ['gym', 'home'] as const;
export type Location = (typeof LOCATIONS)[number];

/** Saved workout-builder settings, so "My plan" can be reopened. */
export interface SavedPlan {
  goal: string;
  experience: Difficulty;
  days: number;
  equipment: string[];
  focus: string[];
  location: Location;
  /** Short human label of the split, in the language it was built in. */
  label: string;
  savedAt: string;
}

export interface Prefs {
  goal: GoalId | null;
  level: Difficulty | null;
  beginnerMode: boolean;
  /** Show short encouragement messages at meaningful moments. */
  motivation: boolean;
}

export interface LocalState {
  version: number;
  gymId: string;
  prefs: Prefs;
  /** Saved exercise slugs, newest first. */
  favorites: string[];
  /** One entry per exercise per day the user marked it completed. */
  completed: { slug: string; date: string }[];
  /** Workout sessions the user marked completed. */
  workouts: { date: string; label: string }[];
  /** Recently viewed exercise slugs, newest first. */
  recent: string[];
  /** Days (YYYY-MM-DD, local) with at least one recorded activity, ascending. */
  activity: string[];
  plan: SavedPlan | null;
}

export type LoadStatus = 'empty' | 'ok' | 'repaired' | 'reset';

export const LIMITS = { favorites: 500, completed: 3000, workouts: 1000, recent: 8, activity: 1500 } as const;

/* ------------------------------------------------------------------ dates */

/** Local calendar date as YYYY-MM-DD. */
export function localDate(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Whole days from a to b (both YYYY-MM-DD). */
export function daysBetween(a: string, b: string): number {
  const toUtc = (s: string) => {
    const [y, m, d] = s.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((toUtc(b) - toUtc(a)) / 86_400_000);
}

/* ------------------------------------------------------------------ state */

export function emptyState(gymId: string): LocalState {
  return {
    version: SCHEMA_VERSION,
    gymId,
    prefs: { goal: null, level: null, beginnerMode: false, motivation: true },
    favorites: [],
    completed: [],
    workouts: [],
    recent: [],
    activity: [],
    plan: null,
  };
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const slugList = (v: unknown, max: number): string[] =>
  Array.isArray(v) ? [...new Set(v.filter((x): x is string => typeof x === 'string' && SLUG_RE.test(x) && x.length <= 80))].slice(0, max) : [];

/**
 * Validate an untrusted object as LocalState. Invalid fields fall back to
 * defaults and invalid list entries are dropped. Returns null when the object
 * is not a recognisable LocalState at all.
 */
export function sanitize(raw: unknown, gymId: string): { state: LocalState; repaired: boolean } | null {
  if (!isObj(raw) || raw.version !== SCHEMA_VERSION) return null;
  const base = emptyState(gymId);
  let repaired = false;
  const p = isObj(raw.prefs) ? raw.prefs : {};
  const prefs: Prefs = {
    goal: GOAL_IDS.includes(p.goal as GoalId) ? (p.goal as GoalId) : null,
    level: LEVELS.includes(p.level as Difficulty) ? (p.level as Difficulty) : null,
    beginnerMode: p.beginnerMode === true,
    motivation: p.motivation !== false,
  };
  const completed = Array.isArray(raw.completed)
    ? raw.completed.filter((c): c is { slug: string; date: string } => isObj(c) && typeof c.slug === 'string' && SLUG_RE.test(c.slug) && typeof c.date === 'string' && DATE_RE.test(c.date))
        .map((c) => ({ slug: c.slug, date: c.date }))
        .slice(-LIMITS.completed)
    : [];
  const workouts = Array.isArray(raw.workouts)
    ? raw.workouts.filter((w): w is { date: string; label: string } => isObj(w) && typeof w.date === 'string' && DATE_RE.test(w.date) && typeof w.label === 'string')
        .map((w) => ({ date: w.date, label: w.label.slice(0, 120) }))
        .slice(-LIMITS.workouts)
    : [];
  const activity = Array.isArray(raw.activity)
    ? [...new Set(raw.activity.filter((d): d is string => typeof d === 'string' && DATE_RE.test(d)))].sort().slice(-LIMITS.activity)
    : [];
  const plan = sanitizePlan(raw.plan);
  const state: LocalState = {
    ...base,
    prefs,
    favorites: slugList(raw.favorites, LIMITS.favorites),
    completed,
    workouts,
    recent: slugList(raw.recent, LIMITS.recent),
    activity,
    plan,
  };
  // Anything dropped or defaulted counts as a repair.
  const count = (v: unknown) => (Array.isArray(v) ? v.length : 0);
  if (
    count(raw.favorites) !== state.favorites.length ||
    count(raw.completed) !== completed.length ||
    count(raw.workouts) !== workouts.length ||
    count(raw.recent) !== state.recent.length ||
    count(raw.activity) !== activity.length ||
    ((raw.plan ?? null) !== null && plan === null) ||
    ((p.goal ?? null) !== null && prefs.goal === null) ||
    ((p.level ?? null) !== null && prefs.level === null)
  ) repaired = true;
  return { state, repaired };
}

function sanitizePlan(v: unknown): SavedPlan | null {
  if (!isObj(v)) return null;
  const strs = (x: unknown) => (Array.isArray(x) ? x.filter((s): s is string => typeof s === 'string' && SLUG_RE.test(s)).slice(0, 40) : []);
  const days = Number(v.days);
  if (typeof v.goal !== 'string' || !SLUG_RE.test(v.goal)) return null;
  if (!LEVELS.includes(v.experience as Difficulty)) return null;
  if (!Number.isInteger(days) || days < 2 || days > 6) return null;
  return {
    goal: v.goal,
    experience: v.experience as Difficulty,
    days,
    equipment: strs(v.equipment),
    focus: strs(v.focus),
    location: LOCATIONS.includes(v.location as Location) ? (v.location as Location) : 'gym',
    label: typeof v.label === 'string' ? v.label.slice(0, 120) : '',
    savedAt: typeof v.savedAt === 'string' && DATE_RE.test(v.savedAt) ? v.savedAt : '',
  };
}

/** Parse what localStorage holds. Never throws. */
export function parseStored(raw: string | null, gymId: string): { state: LocalState; status: LoadStatus } {
  if (raw === null || raw === '') return { state: emptyState(gymId), status: 'empty' };
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    return { state: emptyState(gymId), status: 'reset' };
  }
  const res = sanitize(obj, gymId);
  if (!res) return { state: emptyState(gymId), status: 'reset' };
  return { state: res.state, status: res.repaired ? 'repaired' : 'ok' };
}

/* ------------------------------------------------------------------ actions */

export function recordActivity(s: LocalState, date: string): LocalState {
  if (s.activity.includes(date)) return s;
  return { ...s, activity: [...s.activity, date].sort().slice(-LIMITS.activity) };
}

export function isFavorite(s: LocalState, slug: string): boolean {
  return s.favorites.includes(slug);
}

export function toggleFavorite(s: LocalState, slug: string): LocalState {
  if (!SLUG_RE.test(slug)) return s;
  return isFavorite(s, slug)
    ? { ...s, favorites: s.favorites.filter((x) => x !== slug) }
    : { ...s, favorites: [slug, ...s.favorites].slice(0, LIMITS.favorites) };
}

export function isCompletedOn(s: LocalState, slug: string, date: string): boolean {
  return s.completed.some((c) => c.slug === slug && c.date === date);
}

/** Record "I did this exercise today". Idempotent per exercise per day. */
export function markCompleted(s: LocalState, slug: string, date: string): LocalState {
  if (!SLUG_RE.test(slug) || isCompletedOn(s, slug, date)) return s;
  const next = { ...s, completed: [...s.completed, { slug, date }].slice(-LIMITS.completed) };
  return recordActivity(next, date);
}

/** Undo today's record. The day stays active only if something else was recorded. */
export function unmarkCompleted(s: LocalState, slug: string, date: string): LocalState {
  const completed = s.completed.filter((c) => !(c.slug === slug && c.date === date));
  const stillActive = completed.some((c) => c.date === date) || s.workouts.some((w) => w.date === date);
  return { ...s, completed, activity: stillActive ? s.activity : s.activity.filter((d) => d !== date) };
}

export function recordWorkout(s: LocalState, label: string, date: string): LocalState {
  const next = { ...s, workouts: [...s.workouts, { date, label: label.slice(0, 120) }].slice(-LIMITS.workouts) };
  return recordActivity(next, date);
}

export function addRecent(s: LocalState, slug: string): LocalState {
  if (!SLUG_RE.test(slug)) return s;
  return { ...s, recent: [slug, ...s.recent.filter((x) => x !== slug)].slice(0, LIMITS.recent) };
}

export function setPrefs(s: LocalState, prefs: Partial<Prefs>): LocalState {
  return { ...s, prefs: { ...s.prefs, ...prefs } };
}

export function savePlan(s: LocalState, plan: SavedPlan | null): LocalState {
  return { ...s, plan: plan ? sanitizePlan(plan) : null };
}

/* ------------------------------------------------------------------ insights */

/**
 * Consecutive days with recorded activity, ending today — or yesterday, so a
 * streak is not shown as broken before the user has had a chance to train.
 * Only days the user actually recorded count.
 */
export function streak(activity: string[], today: string): number {
  const days = new Set(activity);
  let cursor = today;
  if (!days.has(cursor)) {
    cursor = shift(today, -1);
    if (!days.has(cursor)) return 0;
  }
  let n = 0;
  while (days.has(cursor)) {
    n++;
    cursor = shift(cursor, -1);
  }
  return n;
}

function shift(date: string, by: number): string {
  const [y, m, d] = date.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + by));
  return `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, '0')}-${String(t.getUTCDate()).padStart(2, '0')}`;
}

/** Last recorded activity before `today`, if any. */
export function lastActiveBefore(activity: string[], today: string): string | null {
  const past = activity.filter((d) => d < today);
  return past.length ? past[past.length - 1] : null;
}

export interface Summary {
  completedTotal: number;
  completedExercises: number;
  workoutsTotal: number;
  favorites: number;
  activeDays: number;
  streak: number;
  /** Had activity before but the streak is 0 now. */
  restart: boolean;
}

export function summarize(s: LocalState, today: string): Summary {
  const st = streak(s.activity, today);
  return {
    completedTotal: s.completed.length,
    completedExercises: new Set(s.completed.map((c) => c.slug)).size,
    workoutsTotal: s.workouts.length,
    favorites: s.favorites.length,
    activeDays: s.activity.length,
    streak: st,
    restart: st === 0 && s.activity.length > 0,
  };
}

/* ------------------------------------------------------------------ backup */

const FILE_KIND = 'iq-gym-local-progress';

/** Portable backup file (JSON). Contains only the local progress data. */
export function exportState(s: LocalState, exportedAt: string): string {
  return JSON.stringify({ kind: FILE_KIND, schema: SCHEMA_VERSION, exportedAt, data: s }, null, 2);
}

export type ImportResult =
  | { ok: true; state: LocalState; repaired: boolean }
  | { ok: false; error: 'invalid-json' | 'wrong-file' | 'unsupported-version' | 'too-large' };

/** Validate a backup file. Malformed input is rejected, never partially trusted. */
export function importState(text: string, gymId: string): ImportResult {
  if (text.length > 2_000_000) return { ok: false, error: 'too-large' };
  let obj: unknown;
  try {
    obj = JSON.parse(text);
  } catch {
    return { ok: false, error: 'invalid-json' };
  }
  if (!isObj(obj) || obj.kind !== FILE_KIND || !isObj(obj.data)) return { ok: false, error: 'wrong-file' };
  if (obj.schema !== SCHEMA_VERSION || obj.data.version !== SCHEMA_VERSION) return { ok: false, error: 'unsupported-version' };
  const res = sanitize(obj.data, gymId);
  if (!res) return { ok: false, error: 'wrong-file' };
  return { ok: true, state: res.state, repaired: res.repaired };
}
