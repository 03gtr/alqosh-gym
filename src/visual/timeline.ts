/**
 * Movement templates and their timeline: time → pose + phase.
 *
 * Phases (shared with the page's phase strip):
 *   0 = start position, 1 = movement, 2 = end position, 3 = return.
 */
import type { Muscle } from '../data/taxonomy';
import type { Facing } from './shapes';
import type { Prop } from './props';
import { ease } from './geometry';
import { interpolate, solveFront, solveSide, type Frame, type FrontPose, type SidePose } from './rig';

export type Mode =
  | 'reps' // start → movement → end → return (reverse)
  | 'hold' // isometric: one position held
  | 'cycle' // continuous loop through all frames (cardio, gait)
  | 'sequence'; // forward through frames, then reset (e.g. box jump)

interface Base {
  mode: Mode;
  /** Frame point that the direction arrow follows (e.g. 'hand', 'hip'). */
  track?: string;
  props?: Prop[];
  timing?: Partial<Timing>;
  /** Muscles the movement is designed to show — QC: an exercise's primary muscles must overlap. */
  targets: Muscle[];
  /** Draw the floor line (default true). */
  floor?: boolean;
}
export interface SideTemplate extends Base { rig: 'side'; frames: SidePose[] }
export interface FrontTemplate extends Base { rig: 'front'; facing: Facing; frames: FrontPose[] }
export type Template = SideTemplate | FrontTemplate;

export interface Timing { start: number; move: number; end: number; ret: number; step: number }
const DEFAULT_TIMING: Timing = { start: 0.7, move: 1.5, end: 0.6, ret: 1.5, step: 0.42 };

export function timingOf(t: Template): Timing {
  return { ...DEFAULT_TIMING, ...t.timing };
}

export function duration(t: Template): number {
  const tm = timingOf(t);
  if (t.mode === 'cycle') return tm.step * t.frames.length;
  if (t.mode === 'hold') return 4;
  return tm.start + tm.move + tm.end + tm.ret;
}

export function solve(t: Template, pose: SidePose | FrontPose): Frame {
  return t.rig === 'side' ? solveSide(pose as SidePose) : solveFront(pose as FrontPose);
}

function along(frames: object[], u: number, eased = true): object {
  // u ∈ [0,1] across all segments of the frame list.
  const n = frames.length - 1;
  if (n <= 0) return frames[0];
  const x = Math.min(0.999999, Math.max(0, u)) * n;
  const i = Math.floor(x);
  const local = x - i;
  return interpolate(frames[i], frames[i + 1], eased ? ease(local) : local);
}

export interface Sample {
  pose: SidePose | FrontPose;
  phase: 0 | 1 | 2 | 3;
  /** 0..1 opacity (used by 'sequence' resets). */
  alpha: number;
}

/** Pose and phase at time `s` (seconds, any value — the timeline loops). */
export function sample(t: Template, s: number): Sample {
  const tm = timingOf(t);
  const total = duration(t);
  const time = ((s % total) + total) % total;
  const frames = t.frames as object[];
  if (t.mode === 'hold') return { pose: frames[0] as SidePose, phase: 2, alpha: 1 };
  if (t.mode === 'cycle') {
    const n = frames.length;
    const x = time / tm.step;
    const i = Math.floor(x) % n;
    const pose = interpolate(frames[i], frames[(i + 1) % n], x - Math.floor(x)) as SidePose;
    return { pose, phase: 1, alpha: 1 };
  }
  if (time < tm.start) return { pose: frames[0] as SidePose, phase: 0, alpha: 1 };
  if (time < tm.start + tm.move) {
    return { pose: along(frames, ease((time - tm.start) / tm.move), false) as SidePose, phase: 1, alpha: 1 };
  }
  if (time < tm.start + tm.move + tm.end) return { pose: frames[frames.length - 1] as SidePose, phase: 2, alpha: 1 };
  const r = (time - tm.start - tm.move - tm.end) / tm.ret;
  if (t.mode === 'sequence') {
    // Fade out at the end position, fade back in at the start (no fake "reverse" movement).
    const half = r < 0.5;
    return { pose: (half ? frames[frames.length - 1] : frames[0]) as SidePose, phase: 3, alpha: half ? 1 - r * 2 : (r - 0.5) * 2 };
  }
  return { pose: along(frames.slice().reverse(), ease(r), false) as SidePose, phase: 3, alpha: 1 };
}

/** Points of the tracked joint along the movement (for the direction arrow). */
export function trackPath(t: Template, steps = 16): [number, number][] {
  if (!t.track || t.mode === 'hold' || t.mode === 'cycle') return [];
  const out: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const pose = along(t.frames as object[], i / steps, false) as SidePose;
    const p = solve(t, pose).pts[t.track];
    if (p) out.push(p);
  }
  return out;
}
