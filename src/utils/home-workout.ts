/**
 * Home workout generator ("ما كدرت تروح للجم اليوم؟").
 *
 * One session for a chosen duration, equipment and goal, built from the SAME
 * exercise index as the library and the weekly builder (no exercise is
 * duplicated or invented). Educational structure, not individual treatment.
 * Pure and deterministic for a given seed.
 */
import type { Localized } from '../i18n/types';
import type { Difficulty, Equipment } from '../data/taxonomy';
import type { ExerciseLite } from './exercise-index';
import { isAvailable, rng } from './workout';

export const HOME_DURATIONS = [10, 20, 30, 45] as const;
export type HomeDuration = (typeof HOME_DURATIONS)[number];
export const HOME_GOALS = ['fat-loss', 'conditioning', 'strength', 'mobility', 'beginner'] as const;
export type HomeGoal = (typeof HOME_GOALS)[number];
/** Simple equipment a person may have at home (bodyweight is always available). */
export const HOME_GEAR: Equipment[] = ['dumbbell', 'band', 'kettlebell', 'jump-rope'];

export interface HomeInput {
  minutes: HomeDuration;
  equipment: Equipment[];
  goal: HomeGoal;
  experience: Difficulty;
  seed: number;
}

export interface HomeItem {
  slot: Localized;
  exercise: ExerciseLite;
  dose: Localized;
}

export interface HomeBlock {
  key: 'warmup' | 'main' | 'cooldown';
  title: Localized;
  rounds: number;
  /** How to run the block (e.g. "40 s work / 20 s rest"). */
  format: Localized;
  items: HomeItem[];
  minutes: number;
}

export interface HomeSession {
  minutes: number;
  blocks: HomeBlock[];
}

/* ------------------------------------------------------------------ slots */

interface HomeSlot {
  id: string;
  label: Localized;
  test: (e: ExerciseLite) => boolean;
  prefer: string[];
}

const PREP = ['warm-up', 'mobility', 'stretching', 'cool-down'];
const main = (e: ExerciseLite) => !PREP.includes(e.category);
/** Outdoor / machine cardio is not a circuit station. */
const NOT_STATION = ['walking', 'running', 'cycling', 'treadmill', 'stationary-bike', 'elliptical', 'rowing-machine', 'stair-climber', 'interval-training', 'turkish-get-up'];

const SLOTS = {
  lower: {
    id: 'lower', label: { ar: 'أرجل', en: 'Legs' },
    test: (e) => main(e) && (e.pattern === 'squat' || e.pattern === 'lunge') && e.type !== 'isometric' && e.groups.some((g) => g === 'legs' || g === 'glutes'),
    prefer: ['goblet-squat', 'bodyweight-squat', 'reverse-lunge', 'split-squat', 'forward-lunge', 'lateral-lunge', 'walking-lunge', 'dumbbell-thruster'],
  },
  push: {
    id: 'push', label: { ar: 'دفع (صدر وأكتاف)', en: 'Push (chest & shoulders)' },
    test: (e) => main(e) && e.pattern === 'push' && e.groups.some((g) => g === 'chest' || g === 'shoulders' || g === 'triceps'),
    prefer: ['push-up', 'wide-push-up', 'close-grip-push-up'],
  },
  pull: {
    id: 'pull', label: { ar: 'سحب (ظهر)', en: 'Pull (back)' },
    test: (e) => e.pattern === 'pull' && e.groups.some((g) => g === 'back' || g === 'shoulders'),
    prefer: ['bent-over-dumbbell-row', 'band-pull-apart', 'rear-delt-fly'],
  },
  hinge: {
    id: 'hinge', label: { ar: 'الورك والألوية', en: 'Hips & glutes' },
    test: (e) => main(e) && (e.pattern === 'hinge' || e.groups.includes('glutes')),
    prefer: ['glute-bridge', 'kettlebell-swing', 'single-leg-glute-bridge', 'banded-lateral-walk'],
  },
  core: {
    id: 'core', label: { ar: 'بطن / جذع', en: 'Core' },
    test: (e) => e.category === 'abs',
    prefer: ['plank', 'dead-bug', 'bird-dog', 'side-plank', 'reverse-crunch', 'bicycle-crunch', 'hollow-body-hold'],
  },
  cardio: {
    id: 'cardio', label: { ar: 'لياقة (كارديو)', en: 'Conditioning' },
    test: (e) => e.programs.includes('conditioning') && !NOT_STATION.includes(e.slug),
    prefer: ['jumping-jacks', 'high-knees', 'mountain-climber', 'jump-rope', 'burpee', 'kettlebell-swing', 'dumbbell-thruster'],
  },
  mobility: {
    id: 'mobility', label: { ar: 'مرونة حركية', en: 'Mobility' },
    test: (e) => e.category === 'mobility',
    prefer: ['cat-cow', 'worlds-greatest-stretch', 'thoracic-open-book', 'hip-90-90', 'deep-squat-hold', 'ankle-knee-to-wall', 'wall-slide'],
  },
  stretch: {
    id: 'stretch', label: { ar: 'إطالة', en: 'Stretch' },
    test: (e) => e.category === 'stretching' || e.category === 'cool-down',
    prefer: ['childs-pose', 'standing-hamstring-stretch', 'half-kneeling-hip-flexor-stretch', 'figure-four-glute-stretch', 'doorway-chest-stretch', 'supine-spinal-twist', 'diaphragmatic-breathing'],
  },
  warmup: {
    id: 'warmup', label: { ar: 'إحماء', en: 'Warm-up' },
    test: (e) => e.category === 'warm-up',
    prefer: ['jumping-jacks', 'arm-circles', 'leg-swings', 'bodyweight-squat', 'inchworm', 'high-knees'],
  },
} satisfies Record<string, HomeSlot>;

/** Station order per goal; the first N are used for the chosen duration. */
const STATIONS: Record<Exclude<HomeGoal, 'mobility'>, HomeSlot[]> = {
  'fat-loss': [SLOTS.lower, SLOTS.push, SLOTS.cardio, SLOTS.core, SLOTS.hinge, SLOTS.pull, SLOTS.cardio, SLOTS.lower],
  conditioning: [SLOTS.cardio, SLOTS.lower, SLOTS.push, SLOTS.cardio, SLOTS.core, SLOTS.hinge, SLOTS.pull, SLOTS.cardio],
  strength: [SLOTS.lower, SLOTS.push, SLOTS.pull, SLOTS.hinge, SLOTS.core, SLOTS.lower, SLOTS.push],
  beginner: [SLOTS.lower, SLOTS.push, SLOTS.core, SLOTS.hinge, SLOTS.pull, SLOTS.cardio],
};

/* ------------------------------------------------------------------ timing */

const secs = (s: number): Localized => ({ ar: `${s} ثانية`, en: `${s} s` });

/** Warm-up and cool-down minutes for a session length. */
function frame(minutes: HomeDuration): { warm: number; cool: number } {
  if (minutes <= 10) return { warm: 2, cool: 1 };
  if (minutes <= 20) return { warm: 3, cool: 2 };
  if (minutes <= 30) return { warm: 5, cool: 3 };
  return { warm: 6, cool: 5 };
}

const STATION_COUNT: Record<HomeDuration, number> = { 10: 4, 20: 5, 30: 6, 45: 6 };
const ROUNDS: Record<HomeDuration, number> = { 10: 2, 20: 3, 30: 3, 45: 4 };
const STRENGTH: Record<HomeDuration, { stations: number; rounds: number }> = {
  10: { stations: 3, rounds: 2 }, 20: { stations: 4, rounds: 2 }, 30: { stations: 4, rounds: 3 }, 45: { stations: 5, rounds: 3 },
};
const ROUND_REST = 60;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const round5 = (v: number) => Math.round(v / 5) * 5;

/** Seconds per station so that rounds × stations (+ rests between rounds) fill the main block. */
function stationSeconds(mainSec: number, stations: number, rounds: number): number {
  return (mainSec - (rounds - 1) * ROUND_REST) / (rounds * Math.max(1, stations));
}

/* ------------------------------------------------------------------ build */

const RANK: Record<Difficulty, number> = { beginner: 0, intermediate: 1, advanced: 2 };

export function homePool(pool: ExerciseLite[], input: Pick<HomeInput, 'equipment' | 'experience' | 'goal'>): ExerciseLite[] {
  const gear = input.equipment.filter((q) => HOME_GEAR.includes(q));
  const max = input.goal === 'beginner' ? 0 : RANK[input.experience];
  return pool.filter((e) => isAvailable(e, gear) && RANK[e.difficulty] <= max);
}

function pick(slot: HomeSlot, pool: ExerciseLite[], used: Set<string>, random: () => number, shuffle: boolean): ExerciseLite | null {
  const cands = pool
    .filter((e) => !used.has(e.slug) && slot.test(e))
    .sort((a, b) => rank(a) - rank(b) || a.slug.localeCompare(b.slug));
  function rank(e: ExerciseLite) {
    const i = slot.prefer.indexOf(e.slug);
    return i === -1 ? 100 + RANK[e.difficulty] : i;
  }
  if (!cands.length) return null;
  if (!shuffle) return cands[0];
  const top = cands.slice(0, Math.min(3, cands.length));
  return top[Math.floor(random() * top.length)];
}

function fill(slots: HomeSlot[], count: number, pool: ExerciseLite[], used: Set<string>, random: () => number, shuffle: boolean, dose: (e: ExerciseLite) => Localized): HomeItem[] {
  const items: HomeItem[] = [];
  for (const slot of slots) {
    if (items.length >= count) break;
    const ex = pick(slot, pool, used, random, shuffle);
    if (!ex) continue; // e.g. no pulling exercise without equipment — skip the station
    used.add(ex.slug);
    items.push({ slot: slot.label, exercise: ex, dose: dose(ex) });
  }
  return items;
}

const holdOrReps = (e: ExerciseLite, reps: string): Localized =>
  e.type === 'isometric' ? { ar: '20–40 ثانية', en: '20–40 s' } : e.type === 'cardio' || e.type === 'plyometric' ? { ar: '30–40 ثانية', en: '30–40 s' } : { ar: `${reps} تكرار`, en: `${reps} reps` };

export function buildHomeSession(input: HomeInput, pool: ExerciseLite[]): HomeSession {
  const random = rng(input.seed || 1);
  const shuffle = input.seed !== 0;
  const available = homePool(pool, input);
  const used = new Set<string>();
  const { warm, cool } = frame(input.minutes);
  const mainSec = (input.minutes - warm - cool) * 60;

  // Warm-up: 2–4 gentle moves.
  const warmCount = warm >= 5 ? 4 : warm >= 3 ? 3 : 2;
  const warmEach = Math.round((warm * 60) / warmCount / 5) * 5;
  const warmItems = fill(Array(warmCount).fill(SLOTS.warmup), warmCount, available, used, random, shuffle, () => secs(warmEach));

  let mainBlock: HomeBlock;
  if (input.goal === 'mobility') {
    const count = Math.min(10, Math.max(3, Math.floor(mainSec / 60)));
    const slots = Array.from({ length: count }, (_, i) => (i % 2 === 0 ? SLOTS.mobility : SLOTS.stretch));
    const picked = fill(slots, count, available, used, random, shuffle, () => secs(0));
    const rounds = clamp(Math.round(mainSec / (Math.max(1, picked.length) * 60)), 1, 3);
    const hold = clamp(round5(mainSec / (Math.max(1, picked.length) * rounds)), 40, 90);
    const items = picked.map((it) => ({ ...it, dose: { ar: `${hold} ثانية بهدوء`, en: `${hold} s, slow and easy` } }));
    mainBlock = {
      key: 'main', title: { ar: 'تدفق المرونة', en: 'Mobility flow' }, rounds, items,
      format: { ar: 'تحرّك ببطء ضمن مدى مريح، وتنفّس بعمق', en: 'Move slowly within a comfortable range and breathe deeply' },
      minutes: Math.round((rounds * items.length * hold) / 60),
    };
  } else if (input.goal === 'strength') {
    const { stations, rounds } = STRENGTH[input.minutes];
    const reps = input.experience === 'beginner' ? '8–12' : '8–15';
    const items = fill(STATIONS.strength, stations, available, used, random, shuffle, (e) => holdOrReps(e, reps));
    // A set takes roughly 40 s; the rest of each station's time is recovery.
    const station = stationSeconds(mainSec, items.length, rounds);
    const rest = clamp(round5(station - 40), 20, 90);
    const roundSec = items.length * (40 + rest) + ROUND_REST;
    mainBlock = {
      key: 'main', title: { ar: 'دائرة قوة', en: 'Strength circuit' }, rounds, items,
      format: {
        ar: `نفّذ كل تمرين ثم ارتح ${rest} ثانية. اترك 2–3 تكرارات احتياط في كل مجموعة، وارتح دقيقة بين الجولات`,
        en: `Do each exercise, then rest ${rest} s. Stop 2–3 reps before failure; rest a minute between rounds`,
      },
      minutes: Math.round((rounds * roundSec - ROUND_REST) / 60),
    };
  } else {
    const easy = input.goal === 'beginner' || input.experience === 'beginner';
    const count = input.goal === 'beginner' ? Math.min(5, STATION_COUNT[input.minutes]) : STATION_COUNT[input.minutes];
    const rounds = ROUNDS[input.minutes];
    // Pick the exercises first (some stations may be skipped without equipment),
    // then size work/rest so the circuit fills the chosen time.
    const picked = fill(STATIONS[input.goal], count, available, used, random, shuffle, () => secs(0));
    const station = stationSeconds(mainSec, picked.length, rounds);
    const work = clamp(round5(station * (easy ? 0.5 : 0.67)), 20, 50);
    const rest = clamp(round5(station - work), 10, 45);
    const items = picked.map((it) => ({ ...it, dose: secs(work) }));
    const roundSec = items.length * (work + rest) + ROUND_REST;
    mainBlock = {
      key: 'main', title: { ar: 'الدائرة الرئيسية', en: 'Main circuit' }, rounds, items,
      format: {
        ar: `${work} ثانية تمرين / ${rest} ثانية راحة لكل تمرين، ودقيقة راحة بين الجولات. خفّف السرعة متى ما احتجت`,
        en: `${work} s work / ${rest} s rest per exercise, a minute between rounds. Slow down whenever you need to`,
      },
      minutes: Math.round((rounds * roundSec - ROUND_REST) / 60),
    };
  }

  // Cool-down: easy stretches.
  const coolCount = cool >= 4 ? 3 : cool >= 2 ? 2 : 1;
  const coolItems = fill(Array(coolCount).fill(SLOTS.stretch), coolCount, available, used, random, shuffle, () => ({ ar: '30–45 ثانية', en: '30–45 s' }));

  const blocks: HomeBlock[] = [
    { key: 'warmup', title: { ar: 'إحماء', en: 'Warm-up' }, rounds: 1, items: warmItems, minutes: warm, format: { ar: 'حركة خفيفة لرفع الحرارة', en: 'Easy movement to warm up' } },
    mainBlock,
    { key: 'cooldown', title: { ar: 'تهدئة', en: 'Cool-down' }, rounds: 1, items: coolItems, minutes: cool, format: { ar: 'إطالة هادئة وتنفّس', en: 'Gentle stretching and breathing' } },
  ];
  return { minutes: blocks.reduce((t, b) => t + b.minutes, 0), blocks };
}

