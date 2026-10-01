/**
 * Muscle highlighting — the single rule used site-wide:
 *   GREEN = primary target muscle · subtle grey = secondary muscles.
 *
 * Every anatomical region has class `m-<muscle>` and reads its colour from the
 * custom property `--m-<muscle>`. A visual only sets those properties from the
 * exercise's `primaryMuscles` / `secondaryMuscles`; nothing is hard-coded per page.
 */
import { MUSCLES, type Muscle } from '../data/taxonomy';
import { ANTERIOR_MUSCLES, POSTERIOR_MUSCLES, type Facing } from './shapes';

export const ALL_MUSCLES = Object.keys(MUSCLES) as Muscle[];

/** Inline style declaring which muscles are primary / secondary. */
export function muscleVars(primary: readonly Muscle[], secondary: readonly Muscle[]): string {
  const decl: string[] = [];
  for (const s of secondary) if (!primary.includes(s)) decl.push(`--m-${s}:var(--mus-secondary)`);
  for (const p of primary) decl.push(`--m-${p}:var(--mus-primary)`, `--x-${p}:var(--mus-primary)`);
  return decl.join(';');
}

/** Global CSS rules mapping each region class to its custom property. */
export function muscleCss(): string {
  return ALL_MUSCLES.map(
    (m) => `.fig .m-${m}{fill:var(--m-${m},var(--mus-neutral))}.fig .mo.m-${m}{fill:var(--m-${m},transparent)}.fig .xr.m-${m}{fill:var(--x-${m},transparent)}`,
  ).join('');
}

/** Which body-map view shows the primary muscles best (ties → front). */
export function bestFacing(primary: readonly Muscle[]): Facing {
  const front = primary.filter((m) => ANTERIOR_MUSCLES.has(m)).length;
  const back = primary.filter((m) => POSTERIOR_MUSCLES.has(m)).length;
  return back > front ? 'posterior' : 'anterior';
}

/** True when every muscle can be located on the front or back body map. */
export function mappable(muscles: readonly Muscle[]): boolean {
  return muscles.every((m) => ANTERIOR_MUSCLES.has(m) || POSTERIOR_MUSCLES.has(m));
}
