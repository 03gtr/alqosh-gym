/**
 * Discovery metadata: training programmes ("pathways") and training contexts.
 *
 * These are browsing aids layered over the ONE exercise database — no
 * exercise is duplicated, and nothing here changes anatomy, levels or slugs.
 * Membership is either curated by slug (powerlifting) or derived from the
 * existing exercise data (equipment, category, type, goals), so every new
 * exercise is picked up automatically. Being in a pathway never implies a
 * guaranteed result.
 */
import type { Localized } from '../i18n/types';
import type { Equipment } from './taxonomy';
import type { Exercise } from './exercises/types';

export type ProgramId = 'powerlifting' | 'conditioning' | 'home-bodyweight' | 'home-equipment';

export const PROGRAMS: Record<ProgramId, { label: Localized; search: string[] }> = {
  powerlifting: {
    label: { ar: 'باورلفتنك (Powerlifting)', en: 'Powerlifting' },
    search: ['powerlifting', 'power lifting', 'باورلفتنك', 'باورلفتنج', 'رفع اثقال', 'رفعات اساسية', 'big three', 'sbd'],
  },
  conditioning: {
    label: { ar: 'اللياقة والرشاقة', en: 'Fitness & conditioning' },
    search: ['conditioning', 'functional', 'circuit', 'hiit', 'لياقة', 'رشاقة', 'تحمل', 'دائري', 'فنكشنال', 'وظيفي'],
  },
  'home-bodyweight': {
    label: { ar: 'في البيت — بدون معدات', en: 'Home — no equipment' },
    search: ['home', 'no equipment', 'بيت', 'منزل', 'بدون معدات', 'منزلي'],
  },
  'home-equipment': {
    label: { ar: 'في البيت — معدات بسيطة', en: 'Home — simple equipment' },
    search: ['home', 'dumbbells at home', 'بيت', 'منزل', 'دمبل بالبيت', 'باند'],
  },
};

/* ------------------------------------------------------------ powerlifting */

export type LiftGroupId = 'squat' | 'bench' | 'deadlift' | 'support';

export interface LiftGroup {
  id: LiftGroupId;
  title: Localized;
  /** Competition lift first, then variations and accessories (all existing slugs). */
  slugs: string[];
}

/**
 * The three competition lifts and their supporting movements. Curated from
 * exercises that already exist; no specialised coaching claims are made and
 * no federation affiliation is implied.
 */
export const POWERLIFTING_GROUPS: LiftGroup[] = [
  {
    id: 'squat',
    title: { ar: 'القرفصاء (Squat)', en: 'Squat' },
    slugs: ['back-squat', 'front-squat', 'goblet-squat', 'leg-press', 'bulgarian-split-squat'],
  },
  {
    id: 'bench',
    title: { ar: 'ضغط البنش (Bench Press)', en: 'Bench press' },
    slugs: ['barbell-bench-press', 'close-grip-bench-press', 'floor-press', 'dumbbell-bench-press', 'overhead-press'],
  },
  {
    id: 'deadlift',
    title: { ar: 'الرفعة الميتة (Deadlift)', en: 'Deadlift' },
    slugs: ['deadlift', 'sumo-deadlift', 'romanian-deadlift', 'rack-pull', 'trap-bar-deadlift', 'hip-thrust'],
  },
  {
    id: 'support',
    title: { ar: 'تمارين داعمة: الظهر والجذع', en: 'Support: upper back & core' },
    slugs: ['barbell-row', 'lat-pulldown', 'back-extension', 'plank', 'farmers-carry'],
  },
];

const POWERLIFTING = new Set(POWERLIFTING_GROUPS.flatMap((g) => g.slugs));

/* ------------------------------------------------------------ home training */

/** Equipment a typical home can have. Bodyweight needs nothing. */
export const HOME_EQUIPMENT: Equipment[] = ['dumbbell', 'band', 'kettlebell', 'jump-rope', 'foam-roller'];
const HOME_OK = new Set<Equipment>(['bodyweight', ...HOME_EQUIPMENT]);

/** Can be done at home with no equipment at all. */
export function isHomeBodyweight(e: Pick<Exercise, 'equipment'>): boolean {
  return e.equipment.every((q) => q === 'bodyweight');
}

/** Can be done at home, possibly with simple equipment (dumbbells, band…). */
export function isHomeFriendly(e: Pick<Exercise, 'equipment'>): boolean {
  return e.equipment.every((q) => HOME_OK.has(q));
}

/* ------------------------------------------------------------ conditioning */

/** Cardio, full-body and power work — the conditioning / agility pathway. */
export function isConditioning(e: Pick<Exercise, 'category' | 'exerciseType' | 'slug'>): boolean {
  return (
    e.category === 'cardio' ||
    e.category === 'full-body' ||
    e.exerciseType === 'plyometric' ||
    e.exerciseType === 'cardio' ||
    CONDITIONING_EXTRA.has(e.slug)
  );
}
/** Dynamic bodyweight drills that are conditioning work despite their category. */
const CONDITIONING_EXTRA = new Set(['mountain-climber', 'jumping-jacks', 'high-knees']);

/* ------------------------------------------------------------ public helpers */

/** Every pathway an exercise belongs to. */
export function programsFor(e: Exercise): ProgramId[] {
  const out: ProgramId[] = [];
  if (POWERLIFTING.has(e.slug)) out.push('powerlifting');
  if (isConditioning(e)) out.push('conditioning');
  if (isHomeBodyweight(e)) out.push('home-bodyweight');
  else if (isHomeFriendly(e)) out.push('home-equipment');
  return out;
}

/** Slugs referenced by curated lists (validated by tests). */
export const CURATED_SLUGS = [...POWERLIFTING];
