import type { Lang } from '../../i18n/types';
import type {
  Category, Difficulty, Equipment, Era, ExerciseType, Goal, MovementPattern, Muscle,
} from '../taxonomy';

/** Language-specific coaching text for one exercise. */
export interface ExerciseText {
  /** Starting position — 1 to 3 short sentences. */
  setup: string[];
  /** Step-by-step execution — 3 to 5 clear steps (start → movement → end → return). */
  steps: string[];
  /** One or two sentences on breathing. */
  breathing: string;
  /** 2 to 4 common mistakes. */
  mistakes: string[];
  /** 1 to 3 coach tips. */
  tips: string[];
  /** Optional general rep/time guidance that overrides the derived default. */
  prescription?: string;
  /** Optional safety note (e.g. "skip if…, ask a coach…"). Never a diagnosis. */
  safety?: string;
}

/**
 * Optional media. Leave undefined when no real asset exists — the UI shows an
 * honest "no animation yet" state. Files live in /public/media/exercises/ and
 * are auto-detected by slug (see utils/media.ts), so explicit paths are only
 * needed for non-standard file names.
 */
export interface ExerciseMedia {
  webp?: string;
  gif?: string;
  mp4?: string;
  webm?: string;
  poster?: string;
  /** Who created / licensed the media. Required when media is present. */
  credit?: string;
}

export interface Exercise {
  /** Stable, URL-safe id. NEVER rename after publishing — printed QR codes depend on it. */
  slug: string;
  /** Canonical English name. */
  name: string;
  /** Canonical Arabic name. */
  arabicName: string;
  /** Other English names (no separate pages are created for aliases). */
  aliases: string[];
  /** Colloquial Arabic / gym-floor names (e.g. "بنش", "سكوات"). */
  arabicAliases: string[];
  /** Traditional names, if any (e.g. "Military Press"). */
  oldSchoolNames?: string[];
  /** Newer names, if any. */
  modernNames?: string[];

  /** Primary browse category. */
  category: Category;
  primaryMuscles: Muscle[];
  secondaryMuscles: Muscle[];
  equipment: Equipment[];
  /** Contextual difficulty — a general guide, not a medical classification. */
  difficulty: Difficulty;
  movementPattern?: MovementPattern;
  exerciseType: ExerciseType;
  /** Browsing aid only. Omit for cardio / mobility / stretching. */
  era?: Era;
  /** Optional explicit goals; otherwise derived from type/category. */
  goals?: Goal[];

  /** Slugs of alternative exercises (must exist). */
  alternatives: string[];
  /** Free tags for search (any language). */
  tags: string[];

  content: Record<Lang, ExerciseText>;
  media?: ExerciseMedia;
}
