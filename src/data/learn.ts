/**
 * Education hubs served at /learn/<slug>/ (long-form guides in
 * src/content/guides/<lang>/<slug>.md). Education only — not medical advice.
 */
import type { IconName } from '../components/icons';

export const LEARN_GUIDES = [
  { slug: 'weight-loss', icon: 'flame' },
  { slug: 'muscle-gain', icon: 'dumbbell' },
  { slug: 'recovery', icon: 'heart' },
] as const satisfies readonly { slug: string; icon: IconName }[];

export type LearnSlug = (typeof LEARN_GUIDES)[number]['slug'];
