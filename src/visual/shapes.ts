/**
 * Anatomical shape library — ONE set of simplified muscle regions reused by
 * every exercise visual (animated figures, static body maps, card thumbnails).
 *
 * Each shape is drawn in its segment's local frame (joint at the origin, the
 * segment running along +y, "front"/"outward" = +x). Muscle regions carry the
 * muscle id; their colour comes ONLY from CSS custom properties set from the
 * exercise's primaryMuscles / secondaryMuscles (see anatomy.ts), never per page.
 */
import type { Muscle } from '../data/taxonomy';
import type { Vec } from './geometry';

export type ShapeKind = 'base' | 'muscle' | 'overlay' | 'line' | 'detail';

export interface Shape {
  kind: ShapeKind;
  d: string;
  /** Muscle id for muscle / overlay regions. */
  muscle?: Muscle;
}

/* ------------------------------------------------------------------ helpers */

const f = (n: number) => Math.round(n * 100) / 100;

/** Closed smooth path through points (Catmull-Rom → cubic Bézier). */
export function smooth(pts: Vec[]): string {
  const n = pts.length;
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1: Vec = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Vec = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return `${d}Z`;
}

/** Closed straight-edged path. */
export function poly(pts: Vec[]): string {
  return `M${pts.map((p) => `${f(p[0])} ${f(p[1])}`).join('L')}Z`;
}

const circle = (cx: number, cy: number, r: number) =>
  `M${f(cx - r)} ${f(cy)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`;

const heart = (cx: number, cy: number, s: number) =>
  `M${f(cx)} ${f(cy + 2.6 * s)}C${f(cx - 3.4 * s)} ${f(cy)} ${f(cx - 3 * s)} ${f(cy - 2.6 * s)} ${f(cx - 1.2 * s)} ${f(cy - 2.6 * s)}C${f(cx - 0.4 * s)} ${f(cy - 2.6 * s)} ${f(cx)} ${f(cy - 2 * s)} ${f(cx)} ${f(cy - 1.4 * s)}C${f(cx)} ${f(cy - 2 * s)} ${f(cx + 0.4 * s)} ${f(cy - 2.6 * s)} ${f(cx + 1.2 * s)} ${f(cy - 2.6 * s)}C${f(cx + 3 * s)} ${f(cy - 2.6 * s)} ${f(cx + 3.4 * s)} ${f(cy)} ${f(cx)} ${f(cy + 2.6 * s)}Z`;

const base = (d: string): Shape => ({ kind: 'base', d });
const m = (muscle: Muscle, d: string): Shape => ({ kind: 'muscle', d, muscle });
const o = (muscle: Muscle, d: string): Shape => ({ kind: 'overlay', d, muscle });
const line = (d: string): Shape => ({ kind: 'line', d });

/* ================================================================== SIDE RIG
 * Profile view, facing +x. Lower torso (hip → spine joint) and upper torso
 * (spine joint → neck) are separate so the spine can flex.
 */

export const SIDE_LEN = {
  lowerTorso: 24,
  upperTorso: 26,
  shoulder: [-1, -22] as Vec, // on the upper torso
  upperArm: 29,
  forearm: 25,
  grip: 3.6, // wrist → grip centre
  thigh: 40,
  shin: 38,
  toe: [11, 3] as Vec, // on the foot (ball of foot)
  heel: [-3, 3.6] as Vec,
};

export const SIDE_SHAPES: Record<string, Shape[]> = {
  lowerTorso: [
    base(smooth([[-9, 7], [-13, -2], [-12.4, -14], [-11.6, -27], [9.4, -27], [9.6, -14], [9, -4], [8, 6]])),
    m('lower-back', smooth([[-11.6, -26], [-4, -26], [-4, -2], [-10, 0], [-12.6, -13]])),
    m('obliques', poly([[-3.6, -27], [3, -27], [3, -3], [-4, -5]])),
    m('abs', poly([[3, -27], [9.4, -27], [9.4, -14], [9, -3], [3, -3]])),
    o('deep-core', poly([[-3.6, -14], [9.4, -14], [9, -3], [-4, -5]])),
    m('glutes', smooth([[-9, -4], [-14.2, 1], [-13, 10], [-6, 13.4], [-1, 8], [-1.4, 0]])),
    m('hip-flexors', smooth([[3, -3], [9, -3], [8, 5], [3.4, 4]])),
    line('M3 -20H9.4M3 -11H9.3'),
  ],
  upperTorso: [
    base(smooth([[-11, 3], [-12.2, -10], [-11.6, -21], [-6, -27], [2, -28], [9, -26], [12.6, -19], [12, -12], [9.6, -4], [9.4, 3]])),
    m('lats', smooth([[-11.8, -17], [-12.2, -8], [-10.6, 2], [-3, 0], [-4, -16]])),
    m('upper-back', poly([[-11.4, -21.5], [-4, -23], [-4, -16], [-11.8, -16]])),
    m('traps', smooth([[2, -28], [-6, -27.2], [-11.4, -21.5], [-4, -23], [0, -25]])),
    m('obliques', poly([[-3, -7], [3, -8], [3, 3], [-3.6, 3]])),
    m('abs', poly([[3, -8], [9.4, -8], [9.4, 3], [3, 3]])),
    m('chest', smooth([[2, -23], [8, -24], [12.2, -19], [12, -13], [7, -10], [2, -10.4]])),
    o('upper-chest', poly([[2, -23], [8, -24], [12.2, -19], [12, -16.5], [2, -16.5]])),
    o('lower-chest', poly([[2, -14], [12, -14.5], [11, -11], [7, -9.8], [2, -10.4]])),
    o('cardio-system', heart(6.4, -15.5, 1.5)),
    line('M3 -2H9.4'),
  ],
  head: [
    m('neck', poly([[-3.6, 2.5], [3.6, 2.5], [3.2, -7], [-3, -7]])),
    base(circle(1, -15, 9.4)),
    { kind: 'detail', d: circle(6.2, -16.4, 0.9) },
    base('M9.6 -17.5L11.6 -14L9.4 -13Z'),
  ],
  upperArm: [
    base(smooth([[-5, -4], [0, -7.4], [5, -4], [5.6, 6], [4.6, 18], [3.7, 29.5], [-3.7, 29.5], [-4.9, 18], [-5.8, 6]])),
    m('triceps', smooth([[-0.8, 10.5], [-5.4, 13], [-5.2, 21], [-3.4, 28.6], [-0.8, 28.6]])),
    m('biceps', smooth([[0.8, 11], [4.7, 13], [4.8, 21], [3.3, 27.6], [0.8, 27.6]])),
    o('brachialis', poly([[1, 21.5], [4.3, 22.5], [3.4, 28.4], [1, 28.4]])),
    m('front-delts', smooth([[0.3, -6.8], [4.6, -4.2], [5.7, 3], [4, 10.2], [0.5, 11]])),
    m('rear-delts', smooth([[-0.3, -6.8], [-4.6, -4.2], [-5.7, 3], [-4, 10.2], [-0.5, 11]])),
    m('side-delts', poly([[-1.6, -7], [1.6, -7], [1.4, 10.6], [-1.4, 10.6]])),
  ],
  forearm: [
    base(smooth([[-3.8, -1.4], [3.8, -1.4], [4.5, 7], [3, 18], [2.4, 25.4], [-2.4, 25.4], [-3.2, 16], [-4.1, 6]])),
    m('forearms', smooth([[-3, 0.6], [3.2, 0.6], [3.7, 7], [2.4, 17], [1.8, 23], [-1.8, 23], [-2.4, 15], [-3.3, 6]])),
  ],
  hand: [base(smooth([[-3, -0.6], [3, -0.6], [3.9, 4], [2.6, 7.6], [-2.4, 7.6], [-3.8, 4]]))],
  thigh: [
    base(smooth([[-7.6, -2.4], [7.6, -3], [8.1, 10], [6.6, 26], [4.7, 40.4], [-4.7, 40.4], [-7.1, 26], [-8.6, 10]])),
    m('hamstrings', smooth([[-0.5, 6], [-7.6, 10.4], [-6.7, 26], [-4.2, 38.4], [-0.5, 38.4]])),
    m('quads', smooth([[0.5, 1], [7.1, 2.4], [7.5, 12], [6.1, 26], [4.2, 38.4], [0.5, 38.4]])),
  ],
  shin: [
    base(smooth([[-4.7, -1.4], [4.5, -1.4], [4.3, 10], [3, 26], [2.4, 38.4], [-2.4, 38.4], [-3.6, 26], [-6.1, 10]])),
    m('calves', smooth([[-0.5, 2], [-5.9, 8], [-5.1, 18], [-2.6, 28.4], [-0.5, 28.4]])),
    m('tibialis', smooth([[0.8, 2], [3.8, 4], [3.3, 18], [2.2, 32], [0.8, 32]])),
  ],
  foot: [base(smooth([[-4.4, -1.6], [3.2, -2.4], [12.6, 0.6], [13.8, 3.2], [12, 4.4], [-3.6, 4.4]]))],
};

/* ================================================================= FRONT RIG
 * Facing the viewer (anterior) or seen from behind (posterior). Shapes are
 * authored for the figure's RIGHT side on screen (+x = outward) and mirrored
 * for the left side; torso regions are mirrored about x = 0.
 */

export const FRONT_LEN = {
  shoulder: [13, -42] as Vec, // on the torso
  hip: [6.5, 2] as Vec, // on the pelvis
  neck: [0, -51] as Vec,
  upperArm: 28,
  forearm: 24,
  grip: 3.4,
  thigh: 40,
  shin: 38,
};

/** Mirror half-shape points (x → -x) and return both halves. */
function both(pts: Vec[], make: (p: Vec[]) => string): string[] {
  return [make(pts), make(pts.map(([x, y]) => [-x, y] as Vec))];
}
function sym(muscle: Muscle | null, pts: Vec[], kind: ShapeKind = 'muscle', make = smooth): Shape[] {
  return both(pts, make).map((d) => (muscle ? { kind, d, muscle } : { kind, d }));
}
/** Symmetric outline from right-side points listed top → bottom (x ≥ 0). */
function outline(right: Vec[]): string {
  const left = right.slice().reverse().map(([x, y]) => [-x, y] as Vec);
  return smooth([...right, ...left]);
}

const TORSO_OUTLINE = outline([[0, -51.5], [6, -50.6], [11.5, -48], [14.2, -44.6], [13.6, -37], [12, -30], [11.1, -22], [11.6, -12], [12.7, -2], [12, 6], [6, 9.5], [0.1, 8]]);

export type Facing = 'anterior' | 'posterior';

export const FRONT_SHAPES: Record<Facing, Record<string, Shape[]>> = {
  anterior: {
    torso: [
      base(TORSO_OUTLINE),
      ...sym('obliques', [[6.6, -30], [11.3, -28.4], [11.5, -14], [12.2, -3], [6.6, -1]]),
      ...sym('abs', [[0.7, -30], [6, -30.6], [6, -1], [0.7, -1]], 'muscle', poly),
      ...sym('deep-core', [[0.7, -13], [11.5, -13], [12.2, -3], [6.6, 0], [0.7, -1]], 'overlay', poly),
      ...sym('chest', [[1, -45.6], [7, -46.4], [12.6, -43.4], [13.2, -37.2], [10, -32], [4, -31.6], [1, -33]]),
      ...sym('upper-chest', [[1, -45.6], [7, -46.4], [12.6, -43.4], [12.9, -40.2], [1, -40.2]], 'overlay', poly),
      ...sym('lower-chest', [[1, -35.6], [13.1, -36.6], [10, -32], [4, -31.6], [1, -33]], 'overlay', poly),
      ...sym('traps', [[2.4, -51], [7, -49.8], [12, -47.4], [8.6, -46.6], [2.8, -48.4]]),
      ...sym('hip-flexors', [[2, 0.4], [7.6, -1], [6.4, 6], [3, 5.2]]),
      ...sym('glute-med', [[10.8, -6], [13, -2], [12.5, 5], [10, 1]]),
      o('cardio-system', heart(5.4, -38.6, 1.6)),
      line('M0 -30V-1M-6 -21.5H6M-6 -12.5H6'),
    ],
    head: [
      m('neck', poly([[-3.6, 1.5], [3.6, 1.5], [3.1, -6.5], [-3.1, -6.5]])),
      base(circle(0, -15.5, 9.4)),
    ],
    upperArm: [
      base(smooth([[-4.2, -4.2], [0.5, -6.8], [5.1, -4], [6.1, 5], [5, 16], [3.6, 28.4], [-3.3, 28.4], [-4.7, 16], [-4.9, 5]])),
      m('biceps', smooth([[-3.6, 10], [2.6, 10.6], [3.4, 19], [1.6, 26.6], [-2.4, 26]])),
      o('brachialis', poly([[2.8, 17], [4.7, 20], [3.4, 27], [1.6, 26.6]])),
      m('front-delts', smooth([[-3.9, -3.6], [0, -6.4], [1.6, -5.6], [1, 9], [-3, 8]])),
      m('side-delts', smooth([[1.6, -5.6], [5, -3.6], [5.9, 4], [4, 10], [1, 9]])),
    ],
    forearm: [
      base(smooth([[-3.6, -1.2], [3.8, -1.2], [4.5, 6], [3, 17], [2.4, 24.4], [-2.4, 24.4], [-3.2, 16], [-4.1, 6]])),
      m('forearms', smooth([[-2.8, 0.6], [3, 0.6], [3.6, 6], [2.4, 16], [1.8, 22.4], [-1.8, 22.4], [-2.4, 15], [-3.2, 6]])),
    ],
    hand: [base(smooth([[-3, -0.6], [3, -0.6], [3.7, 4], [2.4, 7.4], [-2.4, 7.4], [-3.7, 4]]))],
    thigh: [
      base(smooth([[-6.2, -2.4], [7.2, -4.4], [8.7, 10], [7.1, 26], [4.9, 40.4], [-4.3, 40.4], [-6.1, 26], [-6.9, 10]])),
      m('quads', smooth([[-3, 3], [6.6, 0.6], [7.9, 12], [6.1, 27], [3.8, 38.4], [-1.5, 38.4], [-3.6, 22]])),
      m('adductors', smooth([[-6.6, 0.6], [-3, 3], [-3.6, 18], [-5.4, 16]])),
    ],
    shin: [
      base(smooth([[-4.5, -1.4], [5.1, -1.4], [5.5, 9], [3.7, 25], [2.6, 38.4], [-2.4, 38.4], [-3.4, 25], [-5.1, 9]])),
      m('calves', smooth([[-4.5, 3], [-1.6, 3], [-1.8, 18], [-3.7, 14]])),
      m('tibialis', smooth([[1, 2], [4.3, 4], [3.8, 16], [2.4, 30], [1, 30]])),
    ],
    foot: [base(smooth([[-3, -0.6], [3.6, -0.6], [5.2, 5], [-3.2, 5]]))],
  },
  posterior: {
    torso: [
      base(TORSO_OUTLINE),
      ...sym('lower-back', [[0.7, -18], [4.3, -17], [4.6, -1], [0.7, -1]], 'muscle', poly),
      ...sym('lats', [[6.8, -33], [12.7, -35], [12.3, -26], [10.6, -13], [4, -9.4], [1, -16], [5, -24]]),
      ...sym('traps', [[0.2, -51.4], [4, -50.4], [12.2, -46.8], [6.6, -40], [0.7, -28]]),
      ...sym('upper-back', [[0.7, -41], [5.6, -39.6], [6.6, -33], [0.7, -30]]),
      ...sym('rotator-cuff', [[6.6, -40], [11.6, -43], [12.6, -36], [8.6, -32.6]]),
      ...sym('glutes', [[0.7, -1], [8, -3.4], [12.6, 3], [10.6, 11], [3, 11.6], [0.7, 8]]),
      ...sym('glute-med', [[8.6, -6.2], [12.6, -4], [12.5, 2], [9, -2]]),
      line('M0 -51V9'),
    ],
    head: [
      m('neck', poly([[-3.6, 1.5], [3.6, 1.5], [3.1, -6.5], [-3.1, -6.5]])),
      base(circle(0, -15.5, 9.4)),
    ],
    upperArm: [
      base(smooth([[-4.2, -4.2], [0.5, -6.8], [5.1, -4], [6.1, 5], [5, 16], [3.6, 28.4], [-3.3, 28.4], [-4.7, 16], [-4.9, 5]])),
      m('triceps', smooth([[-3.8, 9], [3, 9.6], [4, 19], [1.6, 27.6], [-2.8, 27]])),
      m('rear-delts', smooth([[-3.9, -3.6], [0, -6.4], [1.6, -5.6], [1, 9], [-3, 8]])),
      m('side-delts', smooth([[1.6, -5.6], [5, -3.6], [5.9, 4], [4, 10], [1, 9]])),
    ],
    forearm: [
      base(smooth([[-3.6, -1.2], [3.8, -1.2], [4.5, 6], [3, 17], [2.4, 24.4], [-2.4, 24.4], [-3.2, 16], [-4.1, 6]])),
      m('forearms', smooth([[-2.8, 0.6], [3, 0.6], [3.6, 6], [2.4, 16], [1.8, 22.4], [-1.8, 22.4], [-2.4, 15], [-3.2, 6]])),
    ],
    hand: [base(smooth([[-3, -0.6], [3, -0.6], [3.7, 4], [2.4, 7.4], [-2.4, 7.4], [-3.7, 4]]))],
    thigh: [
      base(smooth([[-6.2, -2.4], [7.2, -4.4], [8.7, 10], [7.1, 26], [4.9, 40.4], [-4.3, 40.4], [-6.1, 26], [-6.9, 10]])),
      m('hamstrings', smooth([[-4, 5], [6.9, 3.6], [7.3, 14], [5.7, 27], [3.6, 38.4], [-2, 38.4], [-4.4, 22]])),
      m('adductors', smooth([[-6.6, 0.6], [-4, 5], [-4.4, 16], [-5.9, 14]])),
    ],
    shin: [
      base(smooth([[-4.5, -1.4], [5.1, -1.4], [5.5, 9], [3.7, 25], [2.6, 38.4], [-2.4, 38.4], [-3.4, 25], [-5.1, 9]])),
      m('calves', smooth([[-4.7, 2], [4.7, 2], [5.5, 10], [3, 22], [-2, 22], [-4.7, 10]])),
    ],
    foot: [base(smooth([[-3, -0.6], [3.6, -0.6], [5.2, 5], [-3.2, 5]]))],
  },
};

/** Muscles that have a visible region in a given figure. */
export function musclesIn(shapes: Record<string, Shape[]>): Set<Muscle> {
  const out = new Set<Muscle>();
  for (const list of Object.values(shapes)) for (const s of list) if (s.muscle) out.add(s.muscle);
  return out;
}

export const SIDE_MUSCLES = musclesIn(SIDE_SHAPES);
export const ANTERIOR_MUSCLES = musclesIn(FRONT_SHAPES.anterior);
export const POSTERIOR_MUSCLES = musclesIn(FRONT_SHAPES.posterior);
