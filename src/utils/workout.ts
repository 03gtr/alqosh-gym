/**
 * General workout-structure generator (educational, not individualised
 * treatment). Pure and deterministic for a given seed — runs in the browser
 * and in unit tests.
 */
import type { Localized } from '../i18n/types';
import type { Category, Difficulty, Equipment, ExerciseType, Goal, MovementPattern, Muscle } from '../data/taxonomy';
import type { ExerciseLite } from './exercise-index';

export type Experience = Difficulty;
export type BuilderGoal = Exclude<Goal, 'mobility'>;

export interface BuilderInput {
  goal: BuilderGoal;
  experience: Experience;
  days: number; // 2–6
  equipment: Equipment[];
  focus: Category[];
  seed: number;
}

export interface SlotSpec {
  id: string;
  label: Localized;
  categories?: Category[];
  patterns?: MovementPattern[];
  types?: ExerciseType[];
  muscles?: Muscle[];
  /** Preferred slugs, best first. */
  prefer?: string[];
  /** Slugs never chosen for this slot. */
  avoid?: string[];
}

export interface Prescription {
  sets: string;
  reps: Localized;
  rest: Localized;
}

export interface PlannedExercise {
  slot: SlotSpec;
  exercise: ExerciseLite | null;
  prescription: Prescription;
}

export interface Session {
  key: string;
  title: Localized;
  items: PlannedExercise[];
  minutes: number;
}

export interface WeekDay {
  day: number; // 1–7
  session: Session | null; // null = rest
}

export interface Plan {
  split: Localized;
  week: WeekDay[];
  cardio: Localized | null;
}

/* ------------------------------------------------------------------ slots */

const S = {
  squat: { id: 'squat', label: { ar: 'قرفصاء (سكوات)', en: 'Squat' }, patterns: ['squat'], types: ['compound'], categories: ['legs', 'glutes'], prefer: ['back-squat', 'goblet-squat', 'leg-press', 'hack-squat', 'smith-machine-squat', 'front-squat'], avoid: ['sissy-squat', 'wall-sit', 'bodyweight-squat', 'deep-squat-hold'] },
  hinge: { id: 'hinge', label: { ar: 'ثني الورك', en: 'Hip hinge' }, patterns: ['hinge'], types: ['compound'], prefer: ['romanian-deadlift', 'deadlift', 'trap-bar-deadlift', 'hip-thrust', 'glute-bridge', 'cable-pull-through', 'back-extension'], avoid: ['power-clean', 'kettlebell-swing', 'rack-pull', 'good-morning'] },
  lunge: { id: 'lunge', label: { ar: 'رجل واحدة (لانج)', en: 'Single-leg' }, patterns: ['lunge'], prefer: ['reverse-lunge', 'bulgarian-split-squat', 'walking-lunge', 'split-squat', 'step-up', 'forward-lunge'] },
  hPush: { id: 'h-push', label: { ar: 'دفع أفقي (صدر)', en: 'Horizontal push (chest)' }, categories: ['chest'], patterns: ['push'], types: ['compound'], prefer: ['barbell-bench-press', 'dumbbell-bench-press', 'machine-chest-press', 'push-up', 'incline-push-up', 'smith-machine-bench-press'] },
  inclinePush: { id: 'incline-push', label: { ar: 'دفع مائل (أعلى الصدر)', en: 'Incline push' }, categories: ['chest'], patterns: ['push'], types: ['compound'], muscles: ['upper-chest'], prefer: ['incline-dumbbell-press', 'incline-barbell-bench-press', 'decline-push-up', 'machine-chest-press'] },
  hPull: { id: 'h-pull', label: { ar: 'سحب أفقي (تجديف)', en: 'Horizontal pull (row)' }, categories: ['back'], patterns: ['pull'], types: ['compound'], prefer: ['seated-cable-row', 'one-arm-dumbbell-row', 'chest-supported-row', 'machine-row', 'barbell-row', 'inverted-row'], avoid: ['deadlift', 'rack-pull'] },
  vPull: { id: 'v-pull', label: { ar: 'سحب عمودي', en: 'Vertical pull' }, categories: ['back'], patterns: ['pull'], types: ['compound'], muscles: ['lats'], prefer: ['lat-pulldown', 'pull-up', 'assisted-pull-up', 'chin-up', 'close-grip-lat-pulldown'], avoid: ['barbell-row', 'pendlay-row', 'seated-cable-row', 'one-arm-dumbbell-row', 'bent-over-dumbbell-row', 't-bar-row', 'chest-supported-row', 'machine-row', 'meadows-row', 'inverted-row'] },
  vPush: { id: 'v-push', label: { ar: 'دفع عمودي (أكتاف)', en: 'Vertical push (shoulders)' }, categories: ['shoulders'], patterns: ['push'], types: ['compound'], prefer: ['dumbbell-shoulder-press', 'machine-shoulder-press', 'overhead-press', 'landmine-press', 'arnold-press'], avoid: ['push-press'] },
  sideDelt: { id: 'side-delt', label: { ar: 'كتف جانبي', en: 'Side delts' }, muscles: ['side-delts'], types: ['isolation'], prefer: ['dumbbell-lateral-raise', 'cable-lateral-raise', 'machine-lateral-raise'] },
  rearDelt: { id: 'rear-delt', label: { ar: 'كتف خلفي', en: 'Rear delts' }, muscles: ['rear-delts'], prefer: ['face-pull', 'reverse-pec-deck', 'rear-delt-fly', 'band-pull-apart'] },
  chestIso: { id: 'chest-iso', label: { ar: 'عزل صدر', en: 'Chest isolation' }, categories: ['chest'], types: ['isolation'], prefer: ['cable-fly', 'pec-deck', 'dumbbell-fly', 'low-to-high-cable-fly'] },
  biceps: { id: 'biceps', label: { ar: 'بايسبس', en: 'Biceps' }, categories: ['biceps'], types: ['isolation'], prefer: ['dumbbell-curl', 'cable-curl', 'ez-bar-curl', 'hammer-curl', 'barbell-curl', 'preacher-curl'] },
  biceps2: { id: 'biceps-2', label: { ar: 'بايسبس (تنويع)', en: 'Biceps (variation)' }, categories: ['biceps'], types: ['isolation'], prefer: ['hammer-curl', 'incline-dumbbell-curl', 'bayesian-curl', 'preacher-curl', 'concentration-curl'] },
  triceps: { id: 'triceps', label: { ar: 'ترايسبس', en: 'Triceps' }, categories: ['triceps'], types: ['isolation'], prefer: ['rope-pushdown', 'straight-bar-pushdown', 'overhead-cable-extension', 'dumbbell-overhead-extension', 'skull-crusher'] },
  triceps2: { id: 'triceps-2', label: { ar: 'ترايسبس (تنويع)', en: 'Triceps (variation)' }, categories: ['triceps'], types: ['isolation'], prefer: ['overhead-cable-extension', 'dumbbell-overhead-extension', 'skull-crusher', 'cable-triceps-kickback'] },
  quadIso: { id: 'quad-iso', label: { ar: 'عزل فخذ أمامي', en: 'Quad isolation' }, muscles: ['quads'], types: ['isolation'], prefer: ['leg-extension', 'sissy-squat'] },
  hamIso: { id: 'ham-iso', label: { ar: 'عزل فخذ خلفي', en: 'Hamstring isolation' }, muscles: ['hamstrings'], types: ['isolation'], prefer: ['lying-leg-curl', 'seated-leg-curl', 'nordic-hamstring-curl'] },
  calves: { id: 'calves', label: { ar: 'سمانة (كالف)', en: 'Calves' }, categories: ['calves'], muscles: ['calves'], prefer: ['standing-calf-raise', 'seated-calf-raise', 'leg-press-calf-raise', 'single-leg-calf-raise'] },
  core: { id: 'core', label: { ar: 'بطن / جذع', en: 'Core' }, categories: ['abs'], prefer: ['plank', 'dead-bug', 'cable-crunch', 'hanging-knee-raise', 'pallof-press', 'side-plank', 'reverse-crunch'] },
  power: { id: 'power', label: { ar: 'قوة انفجارية', en: 'Power' }, types: ['plyometric'], prefer: ['medicine-ball-slam', 'box-jump', 'kettlebell-swing'] },
  carry: { id: 'carry', label: { ar: 'حمل ومشي', en: 'Loaded carry' }, patterns: ['carry'], prefer: ['farmers-carry'] },
  conditioning: { id: 'conditioning', label: { ar: 'تحمّل', en: 'Conditioning' }, categories: ['full-body', 'cardio'], prefer: ['kettlebell-swing', 'rowing-machine', 'burpee', 'battle-rope-waves', 'mountain-climber'] },
} satisfies Record<string, SlotSpec>;

type TemplateKey = 'fbA' | 'fbB' | 'fbC' | 'upper' | 'lower' | 'push' | 'pull' | 'legs';

const TEMPLATES: Record<TemplateKey, { title: Localized; slots: SlotSpec[] }> = {
  fbA: { title: { ar: 'جسم كامل (أ)', en: 'Full body A' }, slots: [S.squat, S.hPush, S.hPull, S.hinge, S.sideDelt, S.core] },
  fbB: { title: { ar: 'جسم كامل (ب)', en: 'Full body B' }, slots: [S.hinge, S.vPull, S.vPush, S.lunge, S.biceps, S.triceps] },
  fbC: { title: { ar: 'جسم كامل (ج)', en: 'Full body C' }, slots: [S.lunge, S.inclinePush, S.hPull, S.hamIso, S.rearDelt, S.core] },
  upper: { title: { ar: 'جزء علوي', en: 'Upper body' }, slots: [S.hPush, S.hPull, S.vPush, S.vPull, S.biceps, S.triceps] },
  lower: { title: { ar: 'جزء سفلي', en: 'Lower body' }, slots: [S.squat, S.hinge, S.lunge, S.hamIso, S.calves, S.core] },
  push: { title: { ar: 'دفع (صدر، أكتاف، ترايسبس)', en: 'Push (chest, shoulders, triceps)' }, slots: [S.hPush, S.vPush, S.inclinePush, S.chestIso, S.sideDelt, S.triceps, S.triceps2] },
  pull: { title: { ar: 'سحب (ظهر، بايسبس)', en: 'Pull (back, biceps)' }, slots: [S.vPull, S.hPull, S.rearDelt, S.biceps, S.biceps2, S.core] },
  legs: { title: { ar: 'أرجل', en: 'Legs' }, slots: [S.squat, S.hinge, S.lunge, S.quadIso, S.hamIso, S.calves] },
};

const LIGHT_DAY: Session = {
  key: 'light',
  title: { ar: 'كارديو خفيف ومرونة', en: 'Easy cardio & mobility' },
  items: [],
  minutes: 30,
};

/** Training days placed across a Monday-first 7-day week (1-based). */
const DAY_SLOTS: Record<number, number[]> = {
  2: [1, 4],
  3: [1, 3, 5],
  4: [1, 2, 4, 5],
  5: [1, 2, 3, 5, 6],
  6: [1, 2, 3, 4, 5, 6],
};

function splitFor(input: BuilderInput): { split: Localized; sessions: (TemplateKey | 'light')[] } {
  const d = Math.min(6, Math.max(2, Math.round(input.days)));
  const novice = input.experience === 'beginner' || input.goal === 'beginner-fitness';
  if (d <= 3 || (novice && d > 3)) {
    const strength = Math.min(d, 3);
    const order: TemplateKey[] = strength === 2 ? ['fbA', 'fbB'] : ['fbA', 'fbB', 'fbC'];
    const sessions: (TemplateKey | 'light')[] = [...order];
    for (let i = strength; i < d; i++) sessions.push('light');
    return {
      split: d > 3
        ? { ar: `جسم كامل ${strength} أيام + ${d - strength} أيام كارديو خفيف ومرونة`, en: `Full body ×${strength} + ${d - strength} easy cardio/mobility day(s)` }
        : { ar: `جسم كامل ×${strength}`, en: `Full body ×${strength}` },
      sessions,
    };
  }
  if (d === 4) return { split: { ar: 'علوي / سفلي', en: 'Upper / Lower' }, sessions: ['upper', 'lower', 'upper', 'lower'] };
  if (d === 5) return { split: { ar: 'علوي / سفلي + دفع / سحب / أرجل', en: 'Upper / Lower + Push / Pull / Legs' }, sessions: ['upper', 'lower', 'push', 'pull', 'legs'] };
  return { split: { ar: 'دفع / سحب / أرجل ×2', en: 'Push / Pull / Legs ×2' }, sessions: ['push', 'pull', 'legs', 'push', 'pull', 'legs'] };
}

/* ---------------------------------------------------------------- prescriptions */

/** Same text in both languages (numbers only). */
const n = (s: string): Localized => ({ ar: s, en: s });

const REST = {
  long: { ar: '2–3 دقائق', en: '2–3 min' },
  mid: { ar: '1.5–2 دقيقة', en: '1.5–2 min' },
  short: { ar: '60–90 ثانية', en: '60–90 s' },
  vshort: { ar: '45–60 ثانية', en: '45–60 s' },
} satisfies Record<string, Localized>;

function prescriptionFor(goal: BuilderGoal, experience: Experience, type: ExerciseType | undefined): Prescription {
  const heavy = type === 'compound' || type === 'plyometric';
  const novice = experience === 'beginner';
  if (type === 'isometric') return { sets: novice ? '2' : '3', reps: { ar: '20–40 ثانية', en: '20–40 s' }, rest: REST.short };
  if (type === 'cardio') return { sets: '1', reps: { ar: '5–10 دقائق', en: '5–10 min' }, rest: REST.short };
  if (type === 'plyometric') return { sets: '3', reps: n('3–5'), rest: REST.mid };
  switch (goal) {
    case 'strength':
      return heavy
        ? { sets: novice ? '3' : '3–5', reps: n(novice ? '5–8' : '3–6'), rest: REST.long }
        : { sets: '2–3', reps: n('8–12'), rest: REST.short };
    case 'muscle-gain':
      return heavy
        ? { sets: novice ? '2–3' : '3–4', reps: n('6–12'), rest: REST.mid }
        : { sets: novice ? '2–3' : '3–4', reps: n('10–15'), rest: REST.short };
    case 'athletic':
      return heavy
        ? { sets: '3–4', reps: n('4–8'), rest: REST.long }
        : { sets: '2–3', reps: n('8–12'), rest: REST.short };
    case 'conditioning':
      return heavy
        ? { sets: '2–3', reps: n('10–15'), rest: REST.vshort }
        : { sets: '2–3', reps: n('12–15'), rest: REST.vshort };
    case 'fat-loss':
    case 'general-fitness':
    case 'beginner-fitness':
    default:
      return heavy
        ? { sets: novice ? '2–3' : '3', reps: n('8–12'), rest: REST.short }
        : { sets: '2–3', reps: n('12–15'), rest: REST.short };
  }
}

const CARDIO_NOTE: Partial<Record<BuilderGoal, Localized>> = {
  'fat-loss': { ar: '20–30 دقيقة كارديو بشدة متوسطة بعد التمرين أو في أيام الراحة، مع الانتباه للتغذية.', en: '20–30 min of moderate cardio after training or on rest days, alongside your nutrition.' },
  conditioning: { ar: 'أضف 1–2 حصة تمارين متقطعة (Intervals) أسبوعياً بعد بناء أساس من الكارديو المتوسط.', en: 'Add 1–2 interval sessions per week once you have a base of moderate cardio.' },
  'general-fitness': { ar: 'استهدف مجموع نشاط هوائي متوسط 150–300 دقيقة بالأسبوع (مشي سريع مثلاً).', en: 'Aim for 150–300 minutes of moderate aerobic activity per week in total (e.g. brisk walking).' },
  'beginner-fitness': { ar: 'مشي 20–30 دقيقة في أغلب الأيام يساعد على اللياقة والاستشفاء.', en: 'A 20–30 minute walk on most days supports fitness and recovery.' },
  athletic: { ar: 'أضف تمارين سرعة وتحمل خاصة برياضتك حسب توجيه المدرب.', en: 'Add sport-specific speed and conditioning work with your coach.' },
};

/* ---------------------------------------------------------------- selection */

const DIFF_RANK: Record<Difficulty, number> = { beginner: 0, intermediate: 1, advanced: 2 };

/** Equipment that is assumed available everywhere. */
const ALWAYS: Equipment[] = ['bodyweight'];

export function isAvailable(e: ExerciseLite, equipment: Equipment[]): boolean {
  const have = new Set<Equipment>([...ALWAYS, ...equipment]);
  return e.equipment.every((q) => have.has(q));
}

function allowedDifficulty(e: ExerciseLite, exp: Experience): boolean {
  return DIFF_RANK[e.difficulty] <= DIFF_RANK[exp];
}

export function matchesSlot(e: ExerciseLite, slot: SlotSpec): boolean {
  if (slot.avoid?.includes(e.slug)) return false;
  if (['cardio', 'mobility', 'stretch'].includes(e.type) && !slot.categories?.includes('cardio')) return false;
  if (['warm-up', 'mobility', 'stretching', 'cool-down'].includes(e.category)) return false;
  if (slot.prefer?.includes(e.slug)) return true;
  if (slot.types && !slot.types.includes(e.type)) return false;
  if (slot.patterns && (!e.pattern || !slot.patterns.includes(e.pattern))) return false;
  if (slot.categories && !slot.categories.some((c) => e.groups.includes(c))) return false;
  if (slot.muscles && !slot.muscles.some((m) => e.primary.includes(m))) return false;
  return true;
}

/** Small deterministic PRNG (mulberry32). */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function candidatesFor(slot: SlotSpec, pool: ExerciseLite[], input: Pick<BuilderInput, 'equipment' | 'experience'>): ExerciseLite[] {
  const ok = pool.filter((e) => matchesSlot(e, slot) && isAvailable(e, input.equipment) && allowedDifficulty(e, input.experience));
  const rank = (e: ExerciseLite) => {
    const i = slot.prefer?.indexOf(e.slug) ?? -1;
    return i === -1 ? 100 + DIFF_RANK[e.difficulty] : i;
  };
  return ok.sort((a, b) => rank(a) - rank(b) || a.slug.localeCompare(b.slug));
}

/**
 * Pick an exercise: with seed 0 the best-ranked candidate wins; other seeds
 * pick randomly among the top few so "shuffle" gives sensible variety.
 */
/**
 * Pick one candidate. Prefers exercises not used in this session nor in an
 * earlier copy of the same template; may repeat across sessions as a last
 * resort, but never repeats an exercise within the same session.
 */
function choose(cands: ExerciseLite[], usedHere: Set<string>, usedBefore: Set<string>, random: () => number, shuffle: boolean): ExerciseLite | null {
  const notHere = cands.filter((c) => !usedHere.has(c.slug));
  const fresh = notHere.filter((c) => !usedBefore.has(c.slug));
  const list = fresh.length ? fresh : notHere;
  if (!list.length) return null;
  if (!shuffle) return list[0];
  const top = list.slice(0, Math.min(4, list.length));
  return top[Math.floor(random() * top.length)];
}

function focusSlot(cat: Category): SlotSpec {
  return { id: `focus-${cat}`, label: { ar: 'تركيز إضافي', en: 'Extra focus' }, categories: [cat] };
}

/** Which templates a focus muscle group can be added to. */
const FOCUS_FITS: Record<TemplateKey, Category[]> = {
  fbA: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms', 'legs', 'glutes', 'calves', 'abs'],
  fbB: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms', 'legs', 'glutes', 'calves', 'abs'],
  fbC: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms', 'legs', 'glutes', 'calves', 'abs'],
  upper: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms'],
  lower: ['legs', 'glutes', 'calves', 'abs'],
  push: ['chest', 'shoulders', 'triceps'],
  pull: ['back', 'biceps', 'forearms'],
  legs: ['legs', 'glutes', 'calves', 'abs'],
};

function minutesFor(items: PlannedExercise[]): number {
  const restSeconds: Record<string, number> = { '2–3 min': 150, '1.5–2 min': 105, '60–90 s': 75, '45–60 s': 52 };
  let seconds = 10 * 60; // warm-up
  for (const it of items) {
    const sets = Number(it.prescription.sets.split('–').pop()) || 3;
    seconds += sets * (40 + (restSeconds[it.prescription.rest.en] ?? 75));
  }
  return Math.round(seconds / 60 / 5) * 5;
}

export function buildPlan(input: BuilderInput, pool: ExerciseLite[]): Plan {
  const random = rng(input.seed || 1);
  const shuffle = input.seed !== 0;
  const { split, sessions } = splitFor(input);
  const focus = input.focus.slice(0, 2);
  const usedByTemplate = new Map<string, Set<string>>();
  const built = sessions.map((key, idx): Session => {
    if (key === 'light') return LIGHT_DAY;
    const tpl = TEMPLATES[key];
    const slots = [...tpl.slots];
    for (const f of focus) if (FOCUS_FITS[key].includes(f)) slots.push(focusSlot(f));
    if (input.goal === 'athletic') slots.unshift(S.power);
    if (input.goal === 'conditioning') slots.push(S.conditioning);
    if (input.goal === 'strength' || input.goal === 'athletic') {
      if (key === 'fbB' || key === 'pull') slots.push(S.carry);
    }
    // Repeated templates (e.g. upper ×2) get different picks where possible.
    const repeatKey = `${key}`;
    const usedBefore = usedByTemplate.get(repeatKey) ?? new Set<string>();
    const usedHere = new Set<string>();
    const items = slots.map((slot): PlannedExercise => {
      const cands = candidatesFor(slot, pool, input);
      const ex = choose(cands, usedHere, usedBefore, random, shuffle || usedBefore.size > 0);
      if (ex) usedHere.add(ex.slug);
      return { slot, exercise: ex, prescription: prescriptionFor(input.goal, input.experience, ex?.type) };
    });
    usedByTemplate.set(repeatKey, new Set([...usedBefore, ...usedHere]));
    return { key: `${key}-${idx}`, title: tpl.title, items, minutes: minutesFor(items) };
  });
  const days = DAY_SLOTS[built.length] ?? DAY_SLOTS[3];
  const week: WeekDay[] = Array.from({ length: 7 }, (_, i) => {
    const pos = days.indexOf(i + 1);
    return { day: i + 1, session: pos === -1 ? null : built[pos] };
  });
  return { split, week, cardio: CARDIO_NOTE[input.goal] ?? null };
}

/** Re-pick one slot (for the "swap" button), avoiding the current choice. */
export function swapExercise(item: PlannedExercise, pool: ExerciseLite[], input: BuilderInput, taken: string[]): ExerciseLite | null {
  const cands = candidatesFor(item.slot, pool, input).filter((c) => c.slug !== item.exercise?.slug);
  const fresh = cands.filter((c) => !taken.includes(c.slug));
  const list = fresh.length ? fresh : cands;
  if (!list.length) return item.exercise;
  const current = list.findIndex((c) => c.slug === item.exercise?.slug);
  return list[(current + 1) % list.length] ?? list[0];
}
