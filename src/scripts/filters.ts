/**
 * Pure filter logic for the exercise library (shared by the browser script
 * and unit tests). Within a group values are OR-ed; groups are AND-ed.
 */
import type { ExerciseLite } from '../utils/exercise-index';

export const FILTER_KEYS = ['category', 'equipment', 'difficulty', 'goal', 'pattern', 'type', 'era'] as const;
export type FilterKey = (typeof FILTER_KEYS)[number];
export type FilterState = Record<FilterKey, string[]>;

export function emptyFilters(): FilterState {
  return { category: [], equipment: [], difficulty: [], goal: [], pattern: [], type: [], era: [] };
}

export function filtersFromParams(params: URLSearchParams): FilterState {
  const f = emptyFilters();
  for (const key of FILTER_KEYS) {
    f[key] = params.getAll(key).flatMap((v) => v.split(',')).map((v) => v.trim()).filter(Boolean);
  }
  return f;
}

export function activeCount(f: FilterState): number {
  return FILTER_KEYS.reduce((n, k) => n + f[k].length, 0);
}

export function matchesFilters(e: ExerciseLite, f: FilterState): boolean {
  const any = (vals: string[], test: (v: string) => boolean) => vals.length === 0 || vals.some(test);
  return (
    any(f.category, (v) => e.groups.includes(v as never)) &&
    any(f.equipment, (v) => e.equipment.includes(v as never)) &&
    any(f.difficulty, (v) => e.difficulty === v) &&
    any(f.goal, (v) => e.goals.includes(v as never)) &&
    any(f.pattern, (v) => e.pattern === v) &&
    any(f.type, (v) => e.type === v) &&
    any(f.era, (v) => e.era === v)
  );
}
