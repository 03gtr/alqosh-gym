import { describe, expect, it } from 'vitest';
import { allowedMeals, meals, portionsFor, slotsFor } from '../src/data/meals';

const bool = [false, true];

describe('meal planner', () => {
  it('has unique ids and complete bilingual text', () => {
    expect(new Set(meals.map((m) => m.id)).size).toBe(meals.length);
    for (const m of meals) {
      expect(m.name.ar.trim() && m.name.en.trim(), m.id).toBeTruthy();
      expect(m.items.ar.length, m.id).toBe(m.items.en.length);
      expect(m.items.ar.length, m.id).toBeGreaterThan(0);
    }
  });

  it('every filter combination still offers a meal for every slot (no dead ends)', () => {
    for (const noMeat of bool) for (const noFish of bool) for (const noDairy of bool) {
      const allowed = allowedMeals({ noMeat, noFish, noDairy });
      for (const count of [3, 4, 5]) {
        for (const slot of slotsFor(count)) {
          expect(allowed.some((m) => m.slot === slot), `${slot} meat:${noMeat} fish:${noFish} dairy:${noDairy}`).toBe(true);
        }
      }
    }
  });

  it('filters really exclude what they promise', () => {
    expect(allowedMeals({ noMeat: true, noFish: false, noDairy: false }).some((m) => m.contains.includes('meat') || m.contains.includes('fish'))).toBe(false);
    expect(allowedMeals({ noMeat: false, noFish: true, noDairy: false }).some((m) => m.contains.includes('fish'))).toBe(false);
    expect(allowedMeals({ noMeat: false, noFish: false, noDairy: true }).some((m) => m.contains.includes('dairy'))).toBe(false);
  });

  it('hand portions are positive and finite for every option', () => {
    for (const count of [3, 4, 5]) for (const sex of ['male', 'female'] as const) for (const goal of ['loss', 'maintain', 'gain'] as const) {
      expect(slotsFor(count).length).toBe(count);
      for (const slot of slotsFor(count)) {
        const p = portionsFor(slot, count, sex, goal);
        for (const v of Object.values(p)) {
          expect(Number.isFinite(v)).toBe(true);
          expect(v, `${count} ${sex} ${goal} ${slot}`).toBeGreaterThan(0);
        }
      }
    }
  });
});
