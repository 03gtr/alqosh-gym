/**
 * Lightweight exercise index shipped to the browser (search, filters, workout
 * builder). Full coaching text stays in the static exercise pages.
 */
import type { Exercise } from '../data/exercises/types';
import type {
  Category, Difficulty, Equipment, Era, ExerciseType, Goal, MovementPattern, Muscle,
} from '../data/taxonomy';
import {
  CATEGORIES, DIFFICULTY, EQUIPMENT, ERAS, EXERCISE_TYPES, GOALS, MUSCLES, PATTERNS,
} from '../data/taxonomy';
import { goalsFor, primaryGroups } from '../data/exercises';
import { PROGRAMS, programsFor, type ProgramId } from '../data/programs';
import { buildSearchDoc, type SearchDoc } from './search';

export interface ExerciseLite {
  slug: string;
  name: string;
  ar: string;
  category: Category;
  groups: Category[];
  primary: Muscle[];
  equipment: Equipment[];
  difficulty: Difficulty;
  pattern?: MovementPattern;
  type: ExerciseType;
  era?: Era;
  goals: Goal[];
  /** Discovery pathways (powerlifting, conditioning, home). */
  programs: ProgramId[];
  doc: SearchDoc;
}

type Termish = { label: { ar: string; en: string }; search?: readonly string[] };
const terms = (t: Termish | undefined): string[] => (t ? [t.label.ar, t.label.en, ...(t.search ?? [])] : []);

export function toLite(e: Exercise): ExerciseLite {
  const goals = goalsFor(e);
  const groups = primaryGroups(e);
  const programs = programsFor(e);
  const meta: string[] = [
    ...groups.flatMap((g) => terms(CATEGORIES[g])),
    ...e.primaryMuscles.flatMap((m) => terms(MUSCLES[m])),
    ...e.secondaryMuscles.map((m) => MUSCLES[m].label.en),
    ...e.equipment.flatMap((q) => terms(EQUIPMENT[q])),
    ...terms(DIFFICULTY[e.difficulty]),
    ...terms(EXERCISE_TYPES[e.exerciseType]),
    ...(e.movementPattern ? terms(PATTERNS[e.movementPattern]) : []),
    ...(e.era ? terms(ERAS[e.era]) : []),
    ...goals.flatMap((g) => terms(GOALS[g])),
    ...programs.flatMap((p) => terms(PROGRAMS[p])),
    ...e.tags,
  ];
  return {
    slug: e.slug,
    name: e.name,
    ar: e.arabicName,
    category: e.category,
    groups,
    primary: e.primaryMuscles,
    equipment: e.equipment,
    difficulty: e.difficulty,
    pattern: e.movementPattern,
    type: e.exerciseType,
    era: e.era,
    goals,
    programs,
    doc: buildSearchDoc({
      names: [e.name, e.arabicName],
      aliases: [
        ...e.aliases, ...e.arabicAliases, ...(e.oldSchoolNames ?? []), ...(e.modernNames ?? []), e.slug.replace(/-/g, ' '),
      ],
      meta,
      focus: [...terms(CATEGORIES[e.category]), ...e.primaryMuscles.flatMap((m) => terms(MUSCLES[m]))],
    }),
  };
}
