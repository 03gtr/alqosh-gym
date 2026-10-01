import { describe, expect, it } from 'vitest';
import { bmr, calculate, calorieRange, CALORIE_FLOOR, macros, tdee, validatePerson } from '../src/utils/nutrition';

describe('Mifflin-St Jeor BMR', () => {
  it('matches the published equation (male)', () => {
    // 10*80 + 6.25*180 - 5*30 + 5 = 1780
    expect(bmr({ sex: 'male', age: 30, heightCm: 180, weightKg: 80 })).toBe(1780);
  });
  it('matches the published equation (female)', () => {
    // 10*60 + 6.25*165 - 5*25 - 161 = 1345.25
    expect(bmr({ sex: 'female', age: 25, heightCm: 165, weightKg: 60 })).toBeCloseTo(1345.25, 2);
  });
});

describe('TDEE and ranges', () => {
  it('applies activity factors', () => {
    expect(tdee(1780, 'moderate')).toBeCloseTo(2759, 0);
    expect(tdee(1000, 'sedentary')).toBe(1200);
  });

  it('keeps fat-loss moderate (10–20 % below TDEE)', () => {
    const r = calorieRange(2760, 'loss', 'male');
    expect(r.min).toBe(2210);
    expect(r.max).toBe(2480);
    expect(r.floored).toBe(false);
  });

  it('never recommends below the general safety floor', () => {
    const r = calorieRange(1300, 'loss', 'female');
    expect(r.min).toBeGreaterThanOrEqual(CALORIE_FLOOR.female);
    expect(r.max).toBeGreaterThanOrEqual(r.min);
    expect(r.floored).toBe(true);
  });

  it('gain stays a small surplus', () => {
    const r = calorieRange(2500, 'gain', 'male');
    expect(r.min).toBe(2630);
    expect(r.max).toBe(2750);
  });
});

describe('macros', () => {
  it('adds up to the calorie target', () => {
    const m = macros(2500, 80, 'maintain');
    const kcal = m.protein.g * 4 + m.carbs.g * 4 + m.fat.g * 9;
    expect(Math.abs(kcal - 2500)).toBeLessThan(15);
    expect(m.protein.g).toBe(128); // 1.6 g/kg
    expect(m.fat.share).toBe(30);
  });

  it('caps protein at high body weight so carbs stay positive', () => {
    const m = macros(1500, 160, 'loss');
    expect(m.protein.capped).toBe(true);
    expect(m.carbs.g).toBeGreaterThan(0);
  });
});

describe('validation & full calculation', () => {
  it('rejects minors and out-of-range values', () => {
    expect(validatePerson({ age: 15, heightCm: 170, weightKg: 60 })).toContain('age');
    expect(validatePerson({ age: 30, heightCm: 50, weightKg: 60 })).toContain('heightCm');
    expect(validatePerson({ age: 30, heightCm: 170, weightKg: Number.NaN })).toContain('weightKg');
    expect(validatePerson({ age: 30, heightCm: 170, weightKg: 70 })).toEqual([]);
  });

  it('produces a consistent result object', () => {
    const r = calculate({ sex: 'male', age: 30, heightCm: 180, weightKg: 80 }, 'moderate', 'loss');
    expect(r.bmr).toBe(1780);
    expect(r.tdee).toBe(2759);
    expect(r.macros.kcal).toBe(r.ranges.loss.target);
    expect(r.ranges.loss.max).toBeLessThan(r.ranges.maintain.min + 1);
  });
});

describe('release calculator QA (whole input range)', () => {
  const activities = ['sedentary', 'light', 'moderate', 'high', 'veryHigh'] as const;
  const goals = ['loss', 'maintain', 'gain'] as const;

  it('produces finite, non-negative, floored and consistent numbers for every valid input', () => {
    let checked = 0;
    for (const sex of ['male', 'female'] as const)
      for (const age of [18, 35, 60, 80])
        for (const heightCm of [120, 165, 230])
          for (const weightKg of [35, 70, 140, 250])
            for (const activity of activities)
              for (const goal of goals) {
                const r = calculate({ sex, age, heightCm, weightKg }, activity, goal);
                const nums = [r.bmr, r.tdee, r.macros.kcal, r.macros.protein.g, r.macros.fat.g, r.macros.carbs.g,
                  ...goals.flatMap((g) => [r.ranges[g].min, r.ranges[g].max, r.ranges[g].target])];
                for (const n of nums) {
                  expect(Number.isFinite(n)).toBe(true);
                  expect(n).toBeGreaterThanOrEqual(0);
                }
                for (const g of goals) {
                  expect(r.ranges[g].min).toBeGreaterThanOrEqual(CALORIE_FLOOR[sex]);
                  expect(r.ranges[g].max).toBeGreaterThanOrEqual(r.ranges[g].min);
                }
                const m = r.macros;
                expect(Math.abs(m.protein.g * 4 + m.fat.g * 9 + m.carbs.g * 4 - m.kcal)).toBeLessThan(25);
                checked++;
              }
    expect(checked).toBe(2 * 4 * 3 * 4 * 5 * 3);
  });

  it('rejects empty, non-numeric, infinite and negative input instead of computing NaN', () => {
    for (const bad of [NaN, Infinity, -Infinity, -70, 0, undefined]) {
      expect(validatePerson({ sex: 'male', age: bad as number, heightCm: 175, weightKg: 70 })).toContain('age');
      expect(validatePerson({ sex: 'male', age: 30, heightCm: bad as number, weightKg: 70 })).toContain('heightCm');
      expect(validatePerson({ sex: 'male', age: 30, heightCm: 175, weightKg: bad as number })).toContain('weightKg');
    }
    expect(validatePerson({ sex: 'male', age: '30' as unknown as number, heightCm: 175, weightKg: 70 })).toContain('age');
  });
});
