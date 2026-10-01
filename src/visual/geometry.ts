/**
 * 2D affine geometry for the exercise rigs (shared by the build-time renderer
 * and the in-browser animation player).
 *
 * Conventions (SVG, y points down):
 *  - A segment's local axis points along +y from its joint; "front" is +x.
 *  - rotate(θ) with θ > 0 turns clockwise on screen.
 */

/** Affine matrix [a b c d e f] as used by SVG `matrix()`. */
export type Mat = [number, number, number, number, number, number];
export type Vec = [number, number];

export const IDENTITY: Mat = [1, 0, 0, 1, 0, 0];

export function mul(m: Mat, n: Mat): Mat {
  return [
    m[0] * n[0] + m[2] * n[1],
    m[1] * n[0] + m[3] * n[1],
    m[0] * n[2] + m[2] * n[3],
    m[1] * n[2] + m[3] * n[3],
    m[0] * n[4] + m[2] * n[5] + m[4],
    m[1] * n[4] + m[3] * n[5] + m[5],
  ];
}

export const translate = (x: number, y: number): Mat => [1, 0, 0, 1, x, y];

export function rotate(deg: number): Mat {
  const r = (deg * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return [c, s, -s, c, 0, 0];
}

export const scale = (sx: number, sy: number): Mat => [sx, 0, 0, sy, 0, 0];

export function apply(m: Mat, p: Vec): Vec {
  return [m[0] * p[0] + m[2] * p[1] + m[4], m[1] * p[0] + m[3] * p[1] + m[5]];
}

/** World rotation (degrees) encoded in a matrix (ignores scale/mirror sign of y). */
export function angleOf(m: Mat): number {
  return (Math.atan2(m[1], m[0]) * 180) / Math.PI;
}

/** Rotation that makes a segment's +y axis point along `v`. */
export function angleOfVector(v: Vec): number {
  return (Math.atan2(-v[0], v[1]) * 180) / Math.PI;
}

export function normDeg(a: number): number {
  let x = ((a + 180) % 360 + 360) % 360 - 180;
  if (x === -180) x = 180;
  return x;
}

const r3 = (n: number) => Math.round(n * 1000) / 1000;
export function toSvg(m: Mat): string {
  return `matrix(${m.map(r3).join(' ')})`;
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerpVec = (a: Vec, b: Vec, t: number): Vec => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];

/** Smooth ease-in-out (smootherstep). */
export function ease(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * x * (x * (x * 6 - 15) + 10);
}

/**
 * Two-link inverse kinematics.
 * Returns joint angles (relative to the parent frame, and lower-to-upper)
 * that place the end of the chain at `target` (clamped to reach).
 * `bend` chooses the solution whose lower-joint angle has that sign.
 */
export function solveTwoLink(
  base: Vec,
  target: Vec,
  l1: number,
  l2: number,
  parentWorld: number,
  bend: 1 | -1,
): { upper: number; lower: number } {
  const dx = target[0] - base[0];
  const dy = target[1] - base[1];
  const raw = Math.hypot(dx, dy);
  const d = Math.min(Math.max(raw, Math.abs(l1 - l2) + 0.01), l1 + l2 - 0.01);
  const phi0 = angleOfVector([dx, dy]);
  const cosA = (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d);
  const alpha = (Math.acos(Math.min(1, Math.max(-1, cosA))) * 180) / Math.PI;
  let best = { upper: 0, lower: 0 };
  for (const s of [1, -1]) {
    const phi1 = phi0 + s * alpha;
    const r1 = (phi1 * Math.PI) / 180;
    const elbow: Vec = [base[0] - l1 * Math.sin(r1), base[1] + l1 * Math.cos(r1)];
    const phi2 = angleOfVector([target[0] - elbow[0], target[1] - elbow[1]]);
    const lower = normDeg(phi2 - phi1);
    const cand = { upper: normDeg(phi1 - parentWorld), lower };
    if (Math.sign(lower) === bend || Math.abs(lower) < 0.5) return cand;
    best = cand;
  }
  return best;
}
