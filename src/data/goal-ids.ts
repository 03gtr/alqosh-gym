/**
 * Goal ids only — kept separate from the journey content in ./goals.ts so
 * browser scripts (local progress) can validate a saved goal without
 * shipping every journey's text.
 */
export const GOAL_IDS = [
  'weight-loss', 'muscle-gain', 'maintain', 'fitness',
  'beginner', 'powerlifting', 'conditioning', 'home',
] as const;
export type GoalId = (typeof GOAL_IDS)[number];
