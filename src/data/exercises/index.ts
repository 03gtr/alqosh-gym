/**
 * Exercise encyclopedia — single source of truth.
 *
 * To add an exercise: append an object to the matching category file.
 * Pages, search, filters, muscle pages, the workout builder, the sitemap and
 * QR codes all pick it up automatically. See docs/ADDING_CONTENT.md.
 */
import type { Exercise } from './types';
import type { Category, Goal, Muscle } from '../taxonomy';
import { MUSCLES } from '../taxonomy';
import { chest } from './chest';
import { back } from './back';
import { shoulders } from './shoulders';
import { biceps } from './biceps';
import { triceps } from './triceps';
import { forearms } from './forearms';
import { legs } from './legs';
import { glutes } from './glutes';
import { calves } from './calves';
import { abs } from './abs';
import { fullBody } from './full-body';
import { cardio } from './cardio';
import { warmUp } from './warm-up';
import { mobility } from './mobility';
import { stretching } from './stretching';
import { coolDown } from './cool-down';

export type { Exercise, ExerciseText, ExerciseMedia } from './types';

export const exercises: Exercise[] = [
  ...chest, ...back, ...shoulders, ...biceps, ...triceps, ...forearms,
  ...legs, ...glutes, ...calves, ...abs, ...fullBody,
  ...cardio, ...warmUp, ...mobility, ...stretching, ...coolDown,
];

const bySlug = new Map(exercises.map((e) => [e.slug, e]));

export function getExercise(slug: string): Exercise | undefined {
  return bySlug.get(slug);
}

/** Muscle groups (categories) an exercise trains as a primary mover. */
export function primaryGroups(e: Exercise): Category[] {
  const groups = new Set<Category>([e.category]);
  for (const m of e.primaryMuscles) groups.add(MUSCLES[m].group);
  return [...groups];
}

/** Exercises that belong to a category (primary category or primary muscle group). */
export function exercisesForCategory(category: Category): Exercise[] {
  return exercises.filter((e) => primaryGroups(e).includes(category));
}

/** Exercises that train the category only as a secondary muscle. */
export function secondaryExercisesForCategory(category: Category): Exercise[] {
  return exercises.filter(
    (e) =>
      !primaryGroups(e).includes(category) &&
      e.secondaryMuscles.some((m: Muscle) => MUSCLES[m].group === category),
  );
}

/** Goals an exercise suits — explicit `goals` win, otherwise derived. */
export function goalsFor(e: Exercise): Goal[] {
  if (e.goals?.length) return e.goals;
  switch (e.exerciseType) {
    case 'compound':
      return ['strength', 'muscle-gain', 'general-fitness', 'fat-loss'];
    case 'isolation':
      return ['muscle-gain', 'general-fitness'];
    case 'isometric':
      return ['general-fitness', 'strength'];
    case 'plyometric':
      return ['athletic', 'conditioning'];
    case 'cardio':
      return ['conditioning', 'fat-loss', 'general-fitness'];
    case 'mobility':
    case 'stretch':
      return ['mobility', 'general-fitness'];
  }
}

/**
 * Related exercises: same category & pattern first, then shared primary
 * muscles. Alternatives are excluded (they get their own section).
 */
export function relatedExercises(e: Exercise, limit = 6): Exercise[] {
  const exclude = new Set([e.slug, ...e.alternatives]);
  const scored = exercises
    .filter((x) => !exclude.has(x.slug))
    .map((x) => {
      let score = 0;
      if (x.category === e.category) score += 3;
      if (x.movementPattern && x.movementPattern === e.movementPattern) score += 2;
      score += x.primaryMuscles.filter((m) => e.primaryMuscles.includes(m)).length * 2;
      score += x.equipment.filter((q) => e.equipment.includes(q)).length * 0.5;
      return { x, score };
    })
    .filter((s) => s.score >= 3)
    .sort((a, b) => b.score - a.score || a.x.name.localeCompare(b.x.name));
  return scored.slice(0, limit).map((s) => s.x);
}
