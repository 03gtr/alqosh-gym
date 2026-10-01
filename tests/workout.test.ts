import { describe, expect, it } from 'vitest';
import { exercises } from '../src/data/exercises';
import { toLite } from '../src/utils/exercise-index';
import { buildPlan, isAvailable, type BuilderInput } from '../src/utils/workout';
import type { Equipment } from '../src/data/taxonomy';

const pool = exercises.map(toLite);
const FULL_GYM: Equipment[] = ['barbell', 'ez-bar', 'dumbbell', 'cable', 'machine', 'smith-machine', 'bench', 'pull-up-bar', 'dip-station', 'plate', 'kettlebell', 'band', 'cardio-machine', 'landmine', 'trap-bar', 'medicine-ball', 'box', 'ab-wheel'];

const base: BuilderInput = { goal: 'general-fitness', experience: 'beginner', days: 3, equipment: FULL_GYM, focus: [], seed: 0 };

const trainingDays = (input: BuilderInput) => buildPlan(input, pool).week.filter((d) => d.session);

describe('workout builder', () => {
  it('beginner / 3 days = full body on day 1, 3, 5 with rest between (spec example)', () => {
    const plan = buildPlan(base, pool);
    expect(plan.week.map((d) => (d.session ? 'T' : 'R')).join('')).toBe('TRTRTRR');
    expect(plan.week[0].session?.title.en).toBe('Full body A');
  });

  it('respects the number of training days', () => {
    for (const days of [2, 3, 4, 5, 6]) {
      expect(trainingDays({ ...base, experience: 'intermediate', days })).toHaveLength(days);
    }
  });

  it('uses upper/lower for 4 days and PPL for 6 days (non-beginners)', () => {
    expect(buildPlan({ ...base, experience: 'intermediate', days: 4 }, pool).split.en).toBe('Upper / Lower');
    expect(buildPlan({ ...base, experience: 'advanced', days: 6 }, pool).split.en).toBe('Push / Pull / Legs ×2');
  });

  it('keeps beginners on at most 3 strength days', () => {
    const days = trainingDays({ ...base, days: 6 });
    expect(days.filter((d) => d.session?.items.length).length).toBe(3);
  });

  it('only picks exercises that match the available equipment', () => {
    const equipment: Equipment[] = ['dumbbell', 'bench'];
    const plan = buildPlan({ ...base, equipment }, pool);
    for (const d of plan.week) for (const it of d.session?.items ?? []) {
      if (it.exercise) expect(isAvailable(it.exercise, equipment), it.exercise.slug).toBe(true);
    }
  });

  it('never gives beginners advanced exercises', () => {
    const plan = buildPlan({ ...base, goal: 'strength', seed: 7 }, pool);
    for (const d of plan.week) for (const it of d.session?.items ?? []) {
      expect(it.exercise?.difficulty).not.toBe('advanced');
    }
  });

  it('does not repeat an exercise within a session', () => {
    const plan = buildPlan({ ...base, experience: 'advanced', days: 6, seed: 3 }, pool);
    for (const d of plan.week) {
      const slugs = (d.session?.items ?? []).map((i) => i.exercise?.slug).filter(Boolean);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });

  it('fills every slot with a full gym', () => {
    const plan = buildPlan({ ...base, experience: 'intermediate', days: 4 }, pool);
    for (const d of plan.week) for (const it of d.session?.items ?? []) {
      expect(it.exercise, `${d.session?.title.en} / ${it.slot.id}`).not.toBeNull();
    }
  });

  it('is deterministic for a given seed', () => {
    const a = buildPlan({ ...base, seed: 42 }, pool);
    const b = buildPlan({ ...base, seed: 42 }, pool);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});

describe('release workout builder QA (whole option space)', () => {
  const goals = ['muscle-gain', 'fat-loss', 'general-fitness', 'strength', 'conditioning', 'beginner-fitness', 'athletic'] as const;
  const levels = ['beginner', 'intermediate', 'advanced'] as const;
  const kits: Equipment[][] = [FULL_GYM, ['dumbbell', 'bench'], ['bodyweight' as Equipment]];

  it('every goal × experience × days × equipment builds a valid week without crashing', () => {
    const slugs = new Set(pool.map((e) => e.slug));
    for (const goal of goals) for (const experience of levels) for (const days of [2, 3, 4, 5, 6]) for (const equipment of kits) {
      const plan = buildPlan({ goal, experience, days, equipment, focus: [], seed: 7 }, pool);
      expect(plan.week).toHaveLength(7);
      const sessions = plan.week.filter((d) => d.session).map((d) => d.session!);
      expect(sessions.length).toBeGreaterThan(0);
      expect(sessions.length).toBeLessThanOrEqual(days);
      for (const s of sessions) {
        expect(s.title.ar.trim() && s.title.en.trim()).toBeTruthy();
        expect(Number.isFinite(s.minutes) && s.minutes > 0).toBe(true);
        // 'light' = the intentional easy cardio & mobility day (no strength slots).
        if (s.key === 'light') { expect(s.items).toEqual([]); continue; }
        const picked = s.items.filter((i) => i.exercise).map((i) => i.exercise!.slug);
        expect(picked.length, `${goal}/${experience}/${days} ${s.key}`).toBeGreaterThan(0);
        expect(new Set(picked).size).toBe(picked.length);
        for (const slug of picked) expect(slugs.has(slug)).toBe(true);
        for (const i of s.items) if (i.exercise) expect(isAvailable(i.exercise, equipment)).toBe(true);
      }
    }
  });
});
