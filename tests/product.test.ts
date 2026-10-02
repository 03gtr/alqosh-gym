import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { analytics, company, product, splash, storage } from '../src/config/product';
import { gym } from '../src/config/gym';
import { exercises, getExercise } from '../src/data/exercises';
import { DIFFICULTY } from '../src/data/taxonomy';
import { CURATED_SLUGS, POWERLIFTING_GROUPS, programsFor, isHomeBodyweight, isHomeFriendly } from '../src/data/programs';
import { toLite } from '../src/utils/exercise-index';
import { emptyFilters, matchesFilters } from '../src/scripts/filters';
import {
  addRecent, daysBetween, emptyState, exportState, importState, isCompletedOn, isFavorite, LIMITS, markCompleted,
  parseStored, recordWorkout, savePlan, SCHEMA_VERSION, setPrefs, STORAGE_KEY, streak, summarize, toggleFavorite, unmarkCompleted,
} from '../src/utils/progress';
import { daysLabel, MESSAGES, motivationFor } from '../src/utils/motivation';
import { createAnalytics, getPublicStats, noopProvider, suppressSmallGroups, type AnalyticsEvent } from '../src/utils/analytics';
import { buildHomeSession, HOME_DURATIONS, HOME_GEAR, HOME_GOALS, type HomeInput } from '../src/utils/home-workout';
import { buildPlan } from '../src/utils/workout';

const index = exercises.map(toLite);
const GYM = gym.id;

/* ------------------------------------------------------------------ brand architecture */

describe('product vs gym configuration', () => {
  it('defines IQ GYM as the product, made by IQ Group', () => {
    expect(product.id).toBe('iq-gym');
    expect(product.name).toBe('IQ GYM');
    // Exactly as supplied by IQ Group, Syriac script only.
    expect(product.syriacName).toBe('ܒܹܝܬ݂ ܕܲܪܵܫܘܼܬ݂ܵܐ');
    expect([...product.syriacName].every((c) => c === ' ' || (c.codePointAt(0)! >= 0x700 && c.codePointAt(0)! <= 0x74f))).toBe(true);
    expect(company.name).toBe('IQ Group');
    expect(company.url).toBe('https://iq-group.app');
  });

  it('keeps Alqosh Gym as the first, fully populated gym instance', () => {
    expect(gym.id).toBe('alqosh-gym');
    expect(gym.productId).toBe(product.id);
    expect(gym.name).toEqual({ en: 'ALQOSH GYM', ar: 'قاعة القوش جم' });
    expect(gym.brand.wordmark).toEqual({ lead: 'ALQOSH', accent: 'GYM' });
    expect(gym.hours.men.ranges.map((r) => [r.from, r.to])).toEqual([['05:00', '01:00']]);
    expect(gym.hours.women.ranges.map((r) => [r.from, r.to])).toEqual([['08:00', '10:00'], ['16:00', '18:00']]);
    expect(gym.benefits.map((b) => b.id)).toEqual(['therapeutic', 'security', 'alqosh-employees', 'limited-income']);
    expect(gym.coaches.map((c) => c.name.ar)).toEqual(['الكابتن راني اسمرو', 'الكابتن عذراء قس يونان']);
  });

  it('keeps product config free of gym-specific facts', () => {
    const text = JSON.stringify({ product, company, splash, storage, analytics });
    for (const gymFact of ['القوش', 'Alqosh', '0750', 'maps.app', 'facebook', 'راني', 'عذراء']) {
      expect(text.includes(gymFact), gymFact).toBe(false);
    }
  });

  it('does not hard-code the gym name in reusable components and views', () => {
    const files = ['src/components', 'src/views', 'src/layouts'].flatMap((dir) =>
      readdirSync(dir).map((f) => join(dir, f)).filter((f) => statSync(f).isFile()),
    );
    for (const f of files) {
      const src = readFileSync(f, 'utf8');
      expect(/ALQOSH|Alqosh|القوش/.test(src), f).toBe(false);
    }
  });

  it('configures a fast, once-per-session splash', () => {
    expect(splash.enabled).toBe(true);
    expect(splash.durationMs).toBeLessThanOrEqual(1000);
    const layout = readFileSync('src/layouts/BaseLayout.astro', 'utf8');
    expect(layout).toContain('sessionStorage');
    expect(layout).toContain('prefers-reduced-motion');
    // QR landing pages (exercise pages) skip it.
    expect(readFileSync('src/views/ExerciseDetailView.astro', 'utf8')).toContain('splash={false}');
  });
});

/* ------------------------------------------------------------------ discovery metadata */

describe('experience levels and pathways', () => {
  it('keeps all 199 exercises, each with a level shown in words (not colour)', () => {
    expect(exercises.length).toBe(199);
    for (const e of exercises) expect(Object.keys(DIFFICULTY), e.slug).toContain(e.difficulty);
    expect(DIFFICULTY.beginner.card.ar).toBe('مناسب للمبتدئين');
    expect(DIFFICULTY.intermediate.card.ar).toBe('متوسط');
    expect(DIFFICULTY.advanced.card.ar).toBe('متقدم');
  });

  it('curates powerlifting only from existing exercises, led by the three lifts', () => {
    for (const s of CURATED_SLUGS) expect(getExercise(s), s).toBeTruthy();
    expect(POWERLIFTING_GROUPS.slice(0, 3).map((g) => g.slugs[0])).toEqual(['back-squat', 'barbell-bench-press', 'deadlift']);
  });

  it('filters the one library by pathway', () => {
    const pick = (program: string) => index.filter((e) => matchesFilters(e, { ...emptyFilters(), program: [program] }));
    const pl = pick('powerlifting').map((e) => e.slug);
    expect(pl).toEqual(expect.arrayContaining(['back-squat', 'barbell-bench-press', 'deadlift']));
    expect(pick('conditioning').map((e) => e.slug)).toEqual(expect.arrayContaining(['burpee', 'jump-rope', 'kettlebell-swing']));
    for (const e of pick('home-bodyweight')) expect(e.equipment.every((q) => q === 'bodyweight'), e.slug).toBe(true);
    for (const e of pick('home-equipment')) {
      expect(e.equipment.some((q) => q !== 'bodyweight'), e.slug).toBe(true);
      expect(e.equipment.every((q) => ['bodyweight', 'dumbbell', 'band', 'kettlebell', 'jump-rope', 'foam-roller'].includes(q)), e.slug).toBe(true);
    }
    expect(pick('home-bodyweight').length).toBeGreaterThan(20);
    // No machine or barbell exercise is ever labelled "home".
    for (const e of exercises) {
      if (e.equipment.some((q) => ['barbell', 'machine', 'cable', 'smith-machine'].includes(q))) {
        expect(isHomeFriendly(e) || isHomeBodyweight(e), e.slug).toBe(false);
      }
    }
  });

  it('adds pathways without changing anatomy, slugs or levels', () => {
    for (const e of exercises) {
      const lite = toLite(e);
      expect(lite.slug).toBe(e.slug);
      expect(lite.primary).toEqual(e.primaryMuscles);
      expect(lite.difficulty).toBe(e.difficulty);
      expect(lite.programs).toEqual(programsFor(e));
    }
  });
});

/* ------------------------------------------------------------------ local progress */

describe('local progress', () => {
  const d1 = '2026-10-01';
  const d2 = '2026-10-02';

  it('uses a versioned storage key and starts empty', () => {
    expect(STORAGE_KEY).toBe(`iqGymLocal.v${SCHEMA_VERSION}`);
    const s = emptyState(GYM);
    expect(s.gymId).toBe('alqosh-gym');
    expect(s.prefs).toEqual({ goal: null, level: null, beginnerMode: false, motivation: true });
  });

  it('stores no personal data, secrets or gender', () => {
    const keys = JSON.stringify(Object.keys(emptyState(GYM))) + JSON.stringify(Object.keys(emptyState(GYM).prefs));
    for (const banned of ['name', 'email', 'phone', 'password', 'token', 'gender', 'sex', 'weight', 'age']) {
      expect(keys.toLowerCase().includes(banned), banned).toBe(false);
    }
  });

  it('toggles favourites', () => {
    let s = toggleFavorite(emptyState(GYM), 'deadlift');
    expect(isFavorite(s, 'deadlift')).toBe(true);
    s = toggleFavorite(s, 'deadlift');
    expect(isFavorite(s, 'deadlift')).toBe(false);
    expect(toggleFavorite(s, '<script>').favorites).toEqual([]);
  });

  it('records completion once per exercise per day, and can undo it', () => {
    let s = markCompleted(emptyState(GYM), 'plank', d1);
    s = markCompleted(s, 'plank', d1);
    expect(s.completed).toHaveLength(1);
    expect(s.activity).toEqual([d1]);
    expect(isCompletedOn(s, 'plank', d1)).toBe(true);
    s = unmarkCompleted(s, 'plank', d1);
    expect(s.completed).toHaveLength(0);
    expect(s.activity).toEqual([]);
  });

  it('keeps recent exercises unique and short', () => {
    let s = emptyState(GYM);
    for (const e of exercises.slice(0, 20)) s = addRecent(s, e.slug);
    s = addRecent(s, exercises[0].slug);
    expect(s.recent).toHaveLength(LIMITS.recent);
    expect(s.recent[0]).toBe(exercises[0].slug);
  });

  it('counts a streak only from recorded days, without breaking before today is over', () => {
    expect(streak([], d2)).toBe(0);
    expect(streak(['2026-09-29', '2026-09-30', d1], d2)).toBe(3); // yesterday still counts
    expect(streak(['2026-09-30', d1, d2], d2)).toBe(3);
    expect(streak(['2026-09-28', '2026-09-30'], d2)).toBe(0);
    expect(streak(['2026-02-28', '2026-03-01'], '2026-03-01')).toBe(2); // month boundary
    expect(daysBetween('2026-09-30', d2)).toBe(2);
    const sum = summarize(recordWorkout(emptyState(GYM), 'Full body A', '2026-09-01'), d2);
    expect(sum.streak).toBe(0);
    expect(sum.restart).toBe(true);
  });

  it('never crashes on malformed storage: repairs or resets', () => {
    expect(parseStored(null, GYM).status).toBe('empty');
    expect(parseStored('{not json', GYM).status).toBe('reset');
    expect(parseStored(JSON.stringify({ version: 99 }), GYM).status).toBe('reset');
    expect(parseStored('"text"', GYM).status).toBe('reset');
    const bad = { ...emptyState(GYM), favorites: ['deadlift', 42, '../x'], activity: ['2026-10-01', 'yesterday'], prefs: { goal: 'fly', level: 'pro' } };
    const res = parseStored(JSON.stringify(bad), GYM);
    expect(res.status).toBe('repaired');
    expect(res.state.favorites).toEqual(['deadlift']);
    expect(res.state.activity).toEqual(['2026-10-01']);
    expect(res.state.prefs.goal).toBeNull();
    expect(res.state.prefs.level).toBeNull();
    const good = setPrefs(markCompleted(emptyState(GYM), 'plank', d1), { goal: 'powerlifting', beginnerMode: true });
    expect(parseStored(JSON.stringify(good), GYM)).toEqual({ state: good, status: 'ok' });
  });

  it('exports and re-imports a backup, rejecting anything else', () => {
    const s = savePlan(toggleFavorite(markCompleted(emptyState(GYM), 'plank', d1), 'deadlift'), {
      goal: 'powerlifting', experience: 'intermediate', days: 3, equipment: ['barbell'], focus: [], location: 'gym', label: 'Powerlifting ×3', savedAt: d1,
    });
    const file = exportState(s, '2026-10-02T10:00:00.000Z');
    const back = importState(file, GYM);
    expect(back.ok && back.state).toEqual(s);
    expect(importState('nope', GYM)).toEqual({ ok: false, error: 'invalid-json' });
    expect(importState('{"hello":1}', GYM)).toEqual({ ok: false, error: 'wrong-file' });
    const future = JSON.parse(file);
    future.schema = 2;
    expect(importState(JSON.stringify(future), GYM)).toEqual({ ok: false, error: 'unsupported-version' });
    expect(importState('x'.repeat(2_000_001), GYM)).toEqual({ ok: false, error: 'too-large' });
  });

  it('reset leaves nothing behind (fresh state)', () => {
    expect(parseStored('', GYM)).toEqual({ state: emptyState(GYM), status: 'empty' });
  });
});

/* ------------------------------------------------------------------ motivation */

describe('motivation messages', () => {
  const today = '2026-10-02';

  it('is respectful: no shaming or comparison', () => {
    const text = JSON.stringify(MESSAGES).toLowerCase();
    for (const banned of ['lazy', 'behind', 'everyone else', 'excuse', 'كسول', 'متأخر', 'الكل', 'عيب', 'فاشل']) {
      expect(text.includes(banned), banned).toBe(false);
    }
  });

  it('uses correct Arabic number agreement for days', () => {
    expect([0, 1, 2, 3, 10, 11, 30, 100].map((n) => daysLabel(n, 'ar'))).toEqual([
      '0 أيام', 'يوم واحد', 'يومان', '3 أيام', '10 أيام', '11 يوماً', '30 يوماً', '100 يوم',
    ]);
    expect([1, 4].map((n) => daysLabel(n, 'en'))).toEqual(['1 day', '4 days']);
  });

  it('speaks at meaningful moments and respects the off switch', () => {
    const before = emptyState(GYM);
    const after = markCompleted(before, 'plank', today);
    expect(motivationFor(before, after, 'exercise-complete', today)).toEqual(MESSAGES.exercise);
    expect(motivationFor(before, recordWorkout(before, 'x', today), 'workout-complete', today)).toEqual(MESSAGES.workout);
    // Coming back after a break.
    const old = markCompleted(emptyState(GYM), 'plank', '2026-09-20');
    expect(motivationFor(old, markCompleted(old, 'plank', today), 'exercise-complete', today)).toEqual(MESSAGES.comeback);
    // A three-day streak milestone.
    let s = markCompleted(markCompleted(emptyState(GYM), 'plank', '2026-09-30'), 'plank', '2026-10-01');
    expect(motivationFor(s, markCompleted(s, 'plank', today), 'exercise-complete', today)?.ar).toContain('3');
    // Off switch.
    s = setPrefs(emptyState(GYM), { motivation: false });
    expect(motivationFor(s, markCompleted(s, 'plank', today), 'exercise-complete', today)).toBeNull();
  });
});

/* ------------------------------------------------------------------ analytics boundary */

describe('analytics and privacy boundary', () => {
  it('collects nothing and shows no statistics without a real source', () => {
    expect(analytics.provider).toBe('none');
    const a = createAnalytics();
    expect(a).toBe(noopProvider);
    const event: AnalyticsEvent = { type: 'exercise_view', gymId: GYM, lang: 'ar', slug: 'deadlift' };
    expect(() => a.track(event)).not.toThrow();
    expect(getPublicStats()).toBeNull();
  });

  it('never models or infers gender in events or local data', () => {
    const src = readFileSync('src/utils/analytics.ts', 'utf8');
    const eventBlock = src.slice(src.indexOf('export interface AnalyticsEvent'), src.indexOf('export interface AnalyticsProvider'));
    expect(/gender|sex/i.test(eventBlock.replace(/\/\*[\s\S]*?\*\//g, ''))).toBe(false);
    for (const f of ['src/utils/progress.ts', 'src/scripts/progress-store.ts']) {
      const code = readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
      expect(/gender|sex\b/i.test(code), f).toBe(false);
    }
  });

  it('suppresses small groups in future aggregates', () => {
    expect(analytics.minGroupSize).toBeGreaterThanOrEqual(10);
    expect(suppressSmallGroups([{ k: 'a', count: 3 }, { k: 'b', count: 25 }])).toEqual([{ k: 'b', count: 25 }]);
  });

  it('puts no fake visitor counters in the pages', () => {
    const views = readdirSync('src/views').map((f) => readFileSync(join('src/views', f), 'utf8')).join('\n');
    expect(/visitors today|زوار اليوم|عدد الزوار/i.test(views)).toBe(false);
  });
});

/* ------------------------------------------------------------------ generators */

describe('home workout generator', () => {
  const base: HomeInput = { minutes: 20, equipment: [], goal: 'fat-loss', experience: 'intermediate', seed: 0 };

  it('builds every duration × goal from available, non-duplicated exercises', () => {
    for (const minutes of HOME_DURATIONS) {
      for (const goal of HOME_GOALS) {
        for (const equipment of [[], HOME_GEAR]) {
          const s = buildHomeSession({ ...base, minutes, goal, equipment }, index);
          const slugs = s.blocks.flatMap((b) => b.items.map((i) => i.exercise.slug));
          expect(new Set(slugs).size, `${minutes}/${goal}`).toBe(slugs.length);
          expect(s.blocks.find((b) => b.key === 'main')!.items.length, `${minutes}/${goal}`).toBeGreaterThanOrEqual(3);
          expect(s.minutes, `${minutes}/${goal}`).toBeLessThanOrEqual(minutes + 1);
          expect(s.minutes, `${minutes}/${goal}`).toBeGreaterThanOrEqual(Math.floor(minutes * 0.8));
          for (const it of s.blocks.flatMap((b) => b.items)) {
            expect(it.exercise.equipment.every((q) => q === 'bodyweight' || (equipment as string[]).includes(q)), it.exercise.slug).toBe(true);
          }
        }
      }
    }
  });

  it('keeps the beginner session to beginner-friendly exercises', () => {
    const s = buildHomeSession({ ...base, goal: 'beginner', experience: 'advanced', equipment: HOME_GEAR }, index);
    for (const it of s.blocks.flatMap((b) => b.items)) expect(it.exercise.difficulty, it.exercise.slug).toBe('beginner');
  });
});

describe('powerlifting builder', () => {
  const all = [...new Set(exercises.flatMap((e) => e.equipment))];

  it('plans the three lifts for an advanced lifter', () => {
    const plan = buildPlan({ goal: 'powerlifting', experience: 'advanced', days: 3, equipment: all, focus: [], seed: 0 }, index);
    const slugs = plan.week.flatMap((d) => d.session?.items.map((i) => i.exercise?.slug) ?? []);
    expect(slugs).toEqual(expect.arrayContaining(['back-squat', 'barbell-bench-press', 'deadlift']));
    expect(plan.week.filter((d) => d.session).length).toBe(3);
  });

  it('respects the experience level of each lift (beginners get easier variations)', () => {
    const plan = buildPlan({ goal: 'powerlifting', experience: 'beginner', days: 2, equipment: all, focus: [], seed: 0 }, index);
    for (const it of plan.week.flatMap((d) => d.session?.items ?? [])) {
      if (it.exercise) expect(it.exercise.difficulty, it.exercise.slug).toBe('beginner');
    }
  });
});
