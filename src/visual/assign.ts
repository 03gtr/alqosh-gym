/**
 * Which movement template animates which exercise — plus the automatic quality
 * gate. An exercise only gets a generated animation when:
 *   1. it is assigned a template below,
 *   2. the template's movement targets overlap the exercise's primaryMuscles,
 *   3. every primary muscle has a visible region in that figure view
 *      (so the GREEN highlight is guaranteed to land on the right muscle),
 *   4. (optional) a coach has approved it — see REVIEW.
 * Otherwise the page shows the static anatomical illustration instead, which
 * always highlights the correct muscles because it is driven by the data alone.
 */
import type { Exercise } from '../data/exercises/types';
import type { Muscle } from '../data/taxonomy';
import { TEMPLATES, type TemplateId } from './library';
import { ANTERIOR_MUSCLES, POSTERIOR_MUSCLES, SIDE_MUSCLES } from './shapes';
import type { Template } from './timeline';

/**
 * Coach review gate. Set `requireApproval` to true to publish ONLY the
 * animations whose slugs are listed in `approved` (all others fall back to the
 * static illustration). Review them at /visuals-review/.
 */
export const REVIEW = {
  requireApproval: false,
  approved: [] as string[],
};

/**
 * Exercise slug → movement template. Exercises left out on purpose (their
 * movement can't be shown faithfully by a simple template, e.g. rotations
 * across planes, complex lifts, holds without motion) use the static
 * anatomical illustration: assisted-pull-up, meadows-row, arnold-press,
 * jm-press, reverse-wrist-curl, plate-pinch, dead-hang, lateral-lunge,
 * sumo-deadlift (adductors not visible in profile), bicycle-crunch,
 * cable-woodchop, power-clean, turkish-get-up, interval-training,
 * general-warm-up, scapular-push-up, worlds-greatest-stretch, hip-90-90,
 * thoracic-open-book, deep-squat-hold, figure-four-glute-stretch,
 * doorway-chest-stretch, diaphragmatic-breathing, foam-rolling,
 * supine-spinal-twist.
 */
export const VISUAL_ASSIGNMENTS: Partial<Record<string, TemplateId>> = {
  /* chest */
  'barbell-bench-press': 'press-supine-barbell',
  'incline-barbell-bench-press': 'press-incline-barbell',
  'decline-barbell-bench-press': 'press-decline-barbell',
  'dumbbell-bench-press': 'press-supine-dumbbell',
  'incline-dumbbell-press': 'press-incline-dumbbell',
  'decline-dumbbell-press': 'press-decline-dumbbell',
  'smith-machine-bench-press': 'press-smith',
  'machine-chest-press': 'press-machine-chest',
  'floor-press': 'press-floor',
  'dumbbell-fly': 'fly-dumbbell',
  'incline-dumbbell-fly': 'fly-dumbbell',
  'cable-fly': 'fly-cable-mid',
  'cable-crossover': 'fly-cable-high',
  'low-to-high-cable-fly': 'fly-cable-low',
  'pec-deck': 'fly-machine',
  'push-up': 'pushup',
  'wide-push-up': 'pushup',
  'close-grip-push-up': 'pushup',
  'incline-push-up': 'pushup-incline',
  'decline-push-up': 'pushup-decline',
  'dips': 'dips',
  'svend-press': 'press-svend',
  'dumbbell-pullover': 'pullover',
  /* back */
  'pull-up': 'pullup-wide',
  'chin-up': 'chinup',
  'lat-pulldown': 'pulldown-wide',
  'close-grip-lat-pulldown': 'pulldown-close',
  'reverse-grip-lat-pulldown': 'pulldown-close',
  'straight-arm-pulldown': 'straight-arm-pulldown',
  'barbell-row': 'row-barbell',
  'pendlay-row': 'row-pendlay',
  'one-arm-dumbbell-row': 'row-one-arm',
  'bent-over-dumbbell-row': 'row-dumbbell-bent',
  'seated-cable-row': 'row-seated-cable',
  't-bar-row': 'row-tbar',
  'chest-supported-row': 'row-chest-supported',
  'machine-row': 'row-machine',
  'inverted-row': 'row-inverted',
  'deadlift': 'deadlift',
  'trap-bar-deadlift': 'deadlift-trap-bar',
  'rack-pull': 'rack-pull',
  'back-extension': 'back-extension',
  'barbell-shrug': 'shrug-barbell',
  'dumbbell-shrug': 'shrug-dumbbell',
  /* shoulders */
  'overhead-press': 'press-overhead',
  'push-press': 'push-press',
  'dumbbell-shoulder-press': 'press-shoulder-dumbbell',
  'machine-shoulder-press': 'press-shoulder-machine',
  'landmine-press': 'press-landmine',
  'dumbbell-lateral-raise': 'raise-lateral',
  'cable-lateral-raise': 'raise-lateral-cable',
  'machine-lateral-raise': 'raise-lateral-machine',
  'front-raise': 'raise-front',
  'rear-delt-fly': 'reverse-fly-bent',
  'reverse-pec-deck': 'reverse-fly-machine',
  'face-pull': 'face-pull',
  'upright-row': 'upright-row',
  'incline-y-raise': 'raise-y',
  'cable-external-rotation': 'external-rotation',
  /* arms */
  'barbell-curl': 'curl-barbell',
  'ez-bar-curl': 'curl-barbell',
  'dumbbell-curl': 'curl-dumbbell',
  'alternating-dumbbell-curl': 'curl-alternating',
  'hammer-curl': 'curl-dumbbell',
  'incline-dumbbell-curl': 'curl-incline',
  'preacher-curl': 'curl-preacher',
  'machine-preacher-curl': 'curl-preacher-machine',
  'concentration-curl': 'curl-concentration',
  'cable-curl': 'curl-cable',
  'bayesian-curl': 'curl-bayesian',
  'spider-curl': 'curl-spider',
  'drag-curl': 'curl-drag',
  'reverse-curl': 'curl-barbell',
  'straight-bar-pushdown': 'pushdown',
  'rope-pushdown': 'pushdown',
  'reverse-grip-pushdown': 'pushdown',
  'overhead-cable-extension': 'extension-overhead-cable',
  'dumbbell-overhead-extension': 'extension-overhead-dumbbell',
  'ez-bar-overhead-extension': 'extension-overhead-ez',
  'skull-crusher': 'skull-crusher',
  'close-grip-bench-press': 'press-supine-barbell',
  'bench-dip': 'bench-dip',
  'dumbbell-kickback': 'kickback-dumbbell',
  'cable-triceps-kickback': 'kickback-cable',
  'wrist-curl': 'wrist-curl',
  'wrist-roller': 'wrist-roller',
  'farmers-carry': 'carry-farmers',
  /* legs */
  'back-squat': 'squat-back',
  'front-squat': 'squat-front',
  'goblet-squat': 'squat-goblet',
  'hack-squat': 'hack-squat',
  'smith-machine-squat': 'squat-smith',
  'leg-press': 'leg-press',
  'bulgarian-split-squat': 'lunge-bulgarian',
  'split-squat': 'lunge-split',
  'walking-lunge': 'lunge-forward',
  'forward-lunge': 'lunge-forward',
  'reverse-lunge': 'lunge-reverse',
  'step-up': 'step-up',
  'leg-extension': 'leg-extension',
  'lying-leg-curl': 'leg-curl-lying',
  'seated-leg-curl': 'leg-curl-seated',
  'romanian-deadlift': 'rdl',
  'stiff-leg-deadlift': 'stiff-leg-deadlift',
  'good-morning': 'good-morning',
  'nordic-hamstring-curl': 'nordic-curl',
  'hip-adduction-machine': 'hip-adduction',
  'sissy-squat': 'sissy-squat',
  'wall-sit': 'wall-sit',
  /* glutes */
  'hip-thrust': 'hip-thrust',
  'glute-bridge': 'glute-bridge',
  'single-leg-glute-bridge': 'glute-bridge-single',
  'cable-glute-kickback': 'glute-kickback',
  'hip-abduction-machine': 'hip-abduction',
  'banded-lateral-walk': 'lateral-band-walk',
  'cable-pull-through': 'pull-through',
  /* calves */
  'standing-calf-raise': 'calf-raise-standing',
  'seated-calf-raise': 'calf-raise-seated',
  'donkey-calf-raise': 'calf-raise-donkey',
  'leg-press-calf-raise': 'leg-press-calf',
  'single-leg-calf-raise': 'calf-raise-single',
  'tibialis-raise': 'tibialis-raise',
  /* core */
  'crunch': 'crunch',
  'reverse-crunch': 'reverse-crunch',
  'sit-up': 'sit-up',
  'lying-leg-raise': 'leg-raise-lying',
  'hanging-leg-raise': 'leg-raise-hanging',
  'hanging-knee-raise': 'knee-raise-hanging',
  'cable-crunch': 'cable-crunch',
  'plank': 'plank',
  'side-plank': 'side-plank',
  'ab-wheel-rollout': 'ab-wheel',
  'dead-bug': 'dead-bug',
  'bird-dog': 'bird-dog',
  'mountain-climber': 'mountain-climber',
  'russian-twist': 'russian-twist',
  'pallof-press': 'pallof-press',
  'hollow-body-hold': 'hollow-hold',
  /* full body */
  'kettlebell-swing': 'kettlebell-swing',
  'burpee': 'burpee',
  'dumbbell-thruster': 'thruster',
  'box-jump': 'box-jump',
  'medicine-ball-slam': 'ball-slam',
  'battle-rope-waves': 'battle-ropes',
  /* cardio */
  'walking': 'walk',
  'cool-down-walk': 'walk',
  'running': 'run',
  'treadmill': 'walk-treadmill',
  'cycling': 'bike',
  'stationary-bike': 'bike-stationary',
  'elliptical': 'elliptical',
  'rowing-machine': 'rowing-machine',
  'stair-climber': 'stair-climber',
  'jump-rope': 'jump-rope',
  'high-knees': 'high-knees',
  'jumping-jacks': 'jumping-jacks',
  /* warm-up, mobility, stretching */
  'arm-circles': 'arm-circles',
  'leg-swings': 'leg-swings',
  'band-pull-apart': 'band-pull-apart',
  'inchworm': 'inchworm',
  'bodyweight-squat': 'squat-bodyweight',
  'cat-cow': 'cat-cow',
  'ankle-knee-to-wall': 'knee-to-wall',
  'band-shoulder-pass-through': 'pass-through',
  'wall-slide': 'wall-slide',
  'standing-hamstring-stretch': 'stretch-hamstring',
  'standing-quad-stretch': 'stretch-quad',
  'half-kneeling-hip-flexor-stretch': 'stretch-hip-flexor',
  'cross-body-shoulder-stretch': 'stretch-cross-body',
  'overhead-triceps-stretch': 'stretch-overhead-triceps',
  'wall-calf-stretch': 'stretch-calf-wall',
  'childs-pose': 'childs-pose',
  'kneeling-lat-stretch': 'stretch-lat-kneeling',
  'butterfly-stretch': 'stretch-butterfly',
};

export function drawableMuscles(t: Template): Set<Muscle> {
  if (t.rig === 'side') return SIDE_MUSCLES;
  return t.facing === 'posterior' ? POSTERIOR_MUSCLES : ANTERIOR_MUSCLES;
}

export interface VisualCheck {
  ok: boolean;
  reason?: string;
}

/** Quality gate for one exercise ↔ template pairing. */
export function checkVisual(e: Exercise, id: TemplateId | undefined): VisualCheck {
  if (!id) return { ok: false, reason: 'no template assigned' };
  const t = TEMPLATES[id] as Template | undefined;
  if (!t) return { ok: false, reason: `unknown template ${id}` };
  const drawable = drawableMuscles(t);
  const hidden = e.primaryMuscles.filter((m) => !drawable.has(m));
  if (hidden.length) return { ok: false, reason: `primary muscle not visible in this view: ${hidden.join(', ')}` };
  if (!e.primaryMuscles.some((m) => t.targets.includes(m))) {
    return { ok: false, reason: `template targets (${t.targets.join(', ')}) do not match primary muscles (${e.primaryMuscles.join(', ')})` };
  }
  if (REVIEW.requireApproval && !REVIEW.approved.includes(e.slug)) return { ok: false, reason: 'awaiting coach approval' };
  return { ok: true };
}

/** The template to animate this exercise with, or null for the static fallback. */
export function visualFor(e: Exercise): { id: TemplateId; template: Template } | null {
  const id = VISUAL_ASSIGNMENTS[e.slug];
  if (!id || !checkVisual(e, id).ok) return null;
  return { id, template: TEMPLATES[id] as Template };
}
