/**
 * Articulated figures ("rigs") and their pose solvers.
 *
 *  - SIDE rig: profile view (sagittal plane) with a two-part torso so the
 *    spine can flex. Limbs can be posed by joint angles or by inverse
 *    kinematics (a world-space target for the hand / ankle).
 *  - FRONT rig: frontal view (anterior or posterior). Limbs are posed with
 *    body-frame spherical angles and orthographically projected, so movements
 *    toward / away from the viewer (flyes, pull-aparts) foreshorten correctly.
 *
 * Pure functions: used at build time to draw the first frame and in the
 * browser to animate.
 */
import {
  IDENTITY, angleOf, angleOfVector, apply, lerp, lerpVec, mul, rotate, scale, solveTwoLink, translate,
  type Mat, type Vec,
} from './geometry';

/* ================================================================== SIDE */

export const SL = {
  lowerTorso: 24,
  shoulder: [-1, -22] as Vec,
  neck: [0, -26] as Vec,
  upperArm: 29,
  forearm: 25,
  grip: 3.6,
  thigh: 40,
  shin: 38,
  toe: [11, 3] as Vec,
  heel: [-3, 3.6] as Vec,
};

/** World point, or the name of a solved frame point (e.g. 'back', 'ankle'). */
type Target = Vec | string;

export interface SidePose {
  /** Hip joint (pelvis) position in the viewBox. */
  root: Vec;
  /** Whole-body rotation (0 = upright, 90 = lying face down head-forward, −90 = lying face up head-back). */
  rot?: number;
  /** Lower torso relative to pelvis (+ = forward lean). */
  trunk?: number;
  /** Upper torso relative to lower torso (+ = spinal flexion). */
  spine?: number;
  neck?: number;
  /** Arm by joint angles (relative): shoulder flexion is negative (arm forward/up), elbow flexion negative. */
  shoulder?: number;
  elbow?: number;
  wrist?: number;
  /** …or by IK: world target for the grip. */
  hand?: Target;
  elbowBend?: 1 | -1;
  farShoulder?: number;
  farElbow?: number;
  farWrist?: number;
  farHand?: Target;
  farElbowBend?: 1 | -1;
  /** Leg by joint angles: hip flexion negative (thigh forward), knee flexion positive. */
  hip?: number;
  knee?: number;
  ankle?: number;
  /** …or by IK: world target for the ankle (or the toe, see `toe`). */
  foot?: Vec;
  /** World foot angle (0 = flat pointing forward, + = toes down). */
  footAngle?: number;
  /** Treat `foot` as the ball-of-foot (toe) position instead of the ankle. */
  toe?: boolean;
  kneeBend?: 1 | -1;
  farHip?: number;
  farKnee?: number;
  farAnkle?: number;
  farFoot?: Vec;
  farFootAngle?: number;
  farToe?: boolean;
  farKneeBend?: 1 | -1;
  /** Move the whole body so this point lands on `at` (uses angle-posed limbs only). */
  anchor?: { point: AnchorPoint; at: Vec };
}

/** Any named frame point (e.g. 'toe', 'heel', 'hand', 'knee', 'back'). */
export type AnchorPoint = string;

export interface Frame {
  /** World matrix per segment id. */
  segs: Record<string, Mat>;
  /** Named world points (grip, ankle, toe, knee, shoulder, hip, head…). */
  pts: Record<string, Vec>;
}

const SIDE_LIMBS = ['upperArm', 'forearm', 'hand', 'thigh', 'shin', 'foot'] as const;
export const SIDE_DRAW_ORDER = [
  ...SIDE_LIMBS.map((s) => `far:${s}`),
  'lowerTorso', 'upperTorso', 'head',
  'thigh', 'shin', 'foot',
  'upperArm', 'forearm', 'hand',
];

function sideFk(p: Required<Pick<SidePose, 'root'>> & SideAngles): Frame {
  const root = mul(translate(p.root[0], p.root[1]), rotate(p.rot));
  const lowerTorso = mul(root, rotate(p.trunk));
  const upperTorso = mul(mul(lowerTorso, translate(0, -SL.lowerTorso)), rotate(p.spine));
  const head = mul(mul(upperTorso, translate(SL.neck[0], SL.neck[1])), rotate(p.neck));
  const arm = (sh: number, el: number, wr: number) => {
    const upperArm = mul(mul(upperTorso, translate(SL.shoulder[0], SL.shoulder[1])), rotate(sh));
    const forearm = mul(mul(upperArm, translate(0, SL.upperArm)), rotate(el));
    const hand = mul(mul(forearm, translate(0, SL.forearm)), rotate(wr));
    return { upperArm, forearm, hand };
  };
  const leg = (hp: number, kn: number, an: number) => {
    const thigh = mul(root, rotate(hp));
    const shin = mul(mul(thigh, translate(0, SL.thigh)), rotate(kn));
    const foot = mul(mul(shin, translate(0, SL.shin)), rotate(an));
    return { thigh, shin, foot };
  };
  const near = { ...arm(p.shoulder, p.elbow, p.wrist), ...leg(p.hip, p.knee, p.ankle) };
  const far = { ...arm(p.farShoulder, p.farElbow, p.farWrist), ...leg(p.farHip, p.farKnee, p.farAnkle) };
  const segs: Record<string, Mat> = { lowerTorso, upperTorso, head, ...near };
  for (const [k, v] of Object.entries(far)) segs[`far:${k}`] = v;
  const pts: Record<string, Vec> = {
    hip: apply(root, [0, 0]),
    spine: apply(upperTorso, [0, 0]),
    shoulder: apply(near.upperArm, [0, 0]),
    neck: apply(head, [0, 0]),
    head: apply(head, [1, -15]),
    chest: apply(upperTorso, [12, -16]),
    rack: apply(upperTorso, [11, -24]),
    sternum: apply(upperTorso, [13, -13]),
    back: apply(upperTorso, [-10, -25]),
    nape: apply(head, [-6, -9]),
    belly: apply(lowerTorso, [12, -12]),
    hipFront: apply(lowerTorso, [11, 0]),
    elbow: apply(near.forearm, [0, 0]),
    hand: apply(near.hand, [0, SL.grip]),
    farHand: apply(far.hand, [0, SL.grip]),
    knee: apply(near.shin, [0, 0]),
    farKnee: apply(far.shin, [0, 0]),
    ankle: apply(near.foot, [0, 0]),
    farAnkle: apply(far.foot, [0, 0]),
    toe: apply(near.foot, SL.toe),
    farToe: apply(far.foot, SL.toe),
    heel: apply(near.foot, SL.heel),
  };
  return { segs, pts };
}

interface SideAngles {
  rot: number; trunk: number; spine: number; neck: number;
  shoulder: number; elbow: number; wrist: number;
  farShoulder: number; farElbow: number; farWrist: number;
  hip: number; knee: number; ankle: number;
  farHip: number; farKnee: number; farAnkle: number;
}

/** Resolve a side pose (angles + IK targets + anchor) into a frame. */
export function solveSide(pose: SidePose): Frame {
  const a: SideAngles = {
    rot: pose.rot ?? 0, trunk: pose.trunk ?? 0, spine: pose.spine ?? 0, neck: pose.neck ?? 0,
    shoulder: pose.shoulder ?? 0, elbow: pose.elbow ?? 0, wrist: pose.wrist ?? 0,
    farShoulder: pose.farShoulder ?? pose.shoulder ?? 0,
    farElbow: pose.farElbow ?? pose.elbow ?? 0,
    farWrist: pose.farWrist ?? pose.wrist ?? 0,
    hip: pose.hip ?? 0, knee: pose.knee ?? 0, ankle: pose.ankle ?? 0,
    farHip: pose.farHip ?? pose.hip ?? 0,
    farKnee: pose.farKnee ?? pose.knee ?? 0,
    farAnkle: pose.farAnkle ?? pose.ankle ?? 0,
  };
  let root: Vec = pose.root;

  // 1) Anchor: move the body so an angle-posed point lands on its target.
  if (pose.anchor) {
    const pre = sideFk({ root, ...a, ...footAngles(pose, a) });
    const at = pre.pts[pose.anchor.point];
    root = [root[0] + pose.anchor.at[0] - at[0], root[1] + pose.anchor.at[1] - at[1]];
  }

  // 2) Legs by IK.
  const legIk = (foot: Vec | undefined, toe: boolean | undefined, footAngle: number | undefined, bend: 1 | -1, isFar: boolean) => {
    if (!foot) return;
    const fa = footAngle ?? 0;
    const ankleTarget: Vec = toe ? (() => {
      const r = rotate(fa);
      const off = apply(r, SL.toe);
      return [foot[0] - off[0], foot[1] - off[1]] as Vec;
    })() : foot;
    const s = solveTwoLink(root, ankleTarget, SL.thigh, SL.shin, a.rot, bend);
    if (isFar) { a.farHip = s.upper; a.farKnee = s.lower; a.farAnkle = fa - (a.rot + s.upper + s.lower); }
    else { a.hip = s.upper; a.knee = s.lower; a.ankle = fa - (a.rot + s.upper + s.lower); }
  };
  legIk(pose.foot, pose.toe, pose.footAngle, pose.kneeBend ?? 1, false);
  const farFoot = pose.farFoot ?? (pose.farHip === undefined && pose.farKnee === undefined ? pose.foot : undefined);
  legIk(farFoot, pose.farToe ?? pose.toe, pose.farFootAngle ?? pose.footAngle, pose.farKneeBend ?? pose.kneeBend ?? 1, true);
  if (!pose.foot && pose.footAngle !== undefined) Object.assign(a, footAngles(pose, a));

  // 3) Arms by IK (after legs so a hand can target the ankle, e.g. quad stretch).
  let frame = sideFk({ root, ...a });
  const resolve = (t: Target | undefined): Vec | undefined =>
    t === undefined ? undefined : typeof t === 'string' ? frame.pts[t] : t;
  const armIk = (t: Vec | undefined, bend: 1 | -1, isFar: boolean) => {
    if (!t) return;
    const ut = frame.segs.upperTorso;
    const base = apply(mul(ut, translate(SL.shoulder[0], SL.shoulder[1])), [0, 0]);
    const s = solveTwoLink(base, t, SL.upperArm, SL.forearm + SL.grip, angleOf(ut), bend);
    if (isFar) { a.farShoulder = s.upper; a.farElbow = s.lower; a.farWrist = 0; }
    else { a.shoulder = s.upper; a.elbow = s.lower; a.wrist = 0; }
  };
  const nearHand = resolve(pose.hand);
  const farHandT = resolve(pose.farHand ?? (pose.farShoulder === undefined && pose.farElbow === undefined ? pose.hand : undefined));
  armIk(nearHand, pose.elbowBend ?? -1, false);
  armIk(farHandT, pose.farElbowBend ?? pose.elbowBend ?? -1, true);
  frame = sideFk({ root, ...a });
  return frame;
}

function footAngles(pose: SidePose, a: SideAngles): Partial<SideAngles> {
  if (pose.footAngle === undefined || pose.foot) return {};
  const out: Partial<SideAngles> = { ankle: pose.footAngle - (a.rot + a.hip + a.knee) };
  const farFa = pose.farFootAngle ?? pose.footAngle;
  out.farAnkle = farFa - (a.rot + a.farHip + a.farKnee);
  return out;
}

/* ================================================================== FRONT */

export const FL = {
  shoulder: [13, -42] as Vec,
  hip: [6.5, 2] as Vec,
  neck: [0, -51] as Vec,
  upperArm: 28,
  forearm: 24,
  grip: 3.4,
  thigh: 40,
  shin: 38,
};

/**
 * Limb direction in the body frame: `e` = elevation from hanging straight
 * down (0) through horizontal (90) to straight up (180); `a` = azimuth
 * (0 = out to the side, 90 = toward the front, 180 = across the body).
 */
export interface Dir { e: number; a: number }

export interface FrontPose {
  root: Vec;
  rot?: number;
  /** Lateral trunk bend. */
  tilt?: number;
  /** Torso rotation (degrees) — narrows the shoulders, swings the arms. */
  twist?: number;
  /** Vertical torso foreshortening (e.g. bent-over seen from behind). */
  torsoF?: number;
  /** Shoulder elevation (negative = shrug up). */
  shrug?: number;
  arm?: Dir; fore?: Dir;
  armL?: Dir; foreL?: Dir;
  thigh?: Dir; shin?: Dir;
  thighL?: Dir; shinL?: Dir;
  anchor?: { point: AnchorPoint; at: Vec };
}

export const FRONT_DRAW_ORDER = [
  'L:thigh', 'L:shin', 'L:foot', 'R:thigh', 'R:shin', 'R:foot',
  'torso', 'head',
  'L:upperArm', 'L:forearm', 'L:hand', 'R:upperArm', 'R:forearm', 'R:hand',
];

const DEG = Math.PI / 180;
/** Projected 2D direction angle and length factor for a body-frame direction. */
function project(d: Dir, twist = 0): { ang: number; f: number } {
  const e = d.e * DEG;
  const a = (d.a + twist) * DEG;
  const v: Vec = [Math.sin(e) * Math.cos(a), Math.cos(e)];
  const f = Math.max(0.14, Math.hypot(v[0], v[1]));
  return { ang: angleOfVector(v), f };
}

export function solveFront(pose: FrontPose): Frame {
  const rot = pose.rot ?? 0;
  const tilt = pose.tilt ?? 0;
  const twist = pose.twist ?? 0;
  const tf = pose.torsoF ?? 1;
  const tw = Math.cos(twist * 0.6 * DEG);
  const build = (root: Vec) => {
    const R = mul(translate(root[0], root[1]), rotate(rot));
    const torso = mul(mul(R, rotate(tilt)), scale(tw, tf));
    const head = mul(translate(...apply(torso, FL.neck)), rotate(rot + tilt));
    const segs: Record<string, Mat> = { torso, head };
    const pts: Record<string, Vec> = { hip: apply(R, [0, 0]), neck: apply(torso, FL.neck) };
    for (const side of ['R', 'L'] as const) {
      const mir = side === 'L' ? scale(-1, 1) : IDENTITY;
      const sx = side === 'L' ? -1 : 1;
      const sw = side === 'L' ? -twist : twist;
      const armD = (side === 'L' ? pose.armL : undefined) ?? pose.arm ?? { e: 10, a: 0 };
      const foreD = (side === 'L' ? pose.foreL : undefined) ?? pose.fore ?? armD;
      const thighD = (side === 'L' ? pose.thighL : undefined) ?? pose.thigh ?? { e: 4, a: 0 };
      const shinD = (side === 'L' ? pose.shinL : undefined) ?? pose.shin ?? thighD;
      const shoulder = apply(torso, [sx * FL.shoulder[0], FL.shoulder[1] + (pose.shrug ?? 0) / tf]);
      const limb = (at: Vec, d: Dir, len: number, tw2: number) => {
        const p = project(d, tw2);
        const m = mul(mul(mul(translate(at[0], at[1]), rotate(rot + tilt)), mir), mul(rotate(p.ang), scale(1, p.f)));
        return { m, end: apply(m, [0, len]) };
      };
      const ua = limb(shoulder, armD, FL.upperArm, sw);
      const fa = limb(ua.end, foreD, FL.forearm, sw);
      const hand = mul(mul(translate(fa.end[0], fa.end[1]), rotate(rot + tilt)), mir);
      const hipPt = apply(R, [sx * FL.hip[0], FL.hip[1]]);
      const th = limb(hipPt, thighD, FL.thigh, 0);
      const sh = limb(th.end, shinD, FL.shin, 0);
      const foot = mul(mul(translate(sh.end[0], sh.end[1]), rotate(rot)), mir);
      segs[`${side}:upperArm`] = ua.m;
      segs[`${side}:forearm`] = fa.m;
      segs[`${side}:hand`] = hand;
      segs[`${side}:thigh`] = th.m;
      segs[`${side}:shin`] = sh.m;
      segs[`${side}:foot`] = foot;
      pts[`${side}:shoulder`] = shoulder;
      pts[`${side}:elbow`] = ua.end;
      pts[`${side}:hand`] = apply(hand, [0, FL.grip]);
      pts[`${side}:knee`] = th.end;
      pts[`${side}:ankle`] = sh.end;
    }
    pts.hand = pts['R:hand'];
    pts.farHand = pts['L:hand'];
    pts.ankle = pts['R:ankle'];
    pts.handsMid = lerpVec(pts['R:hand'], pts['L:hand'], 0.5);
    pts.head = apply(head, [0, -15.5]);
    return { segs, pts };
  };
  let frame = build(pose.root);
  if (pose.anchor) {
    const at = frame.pts[pose.anchor.point];
    frame = build([pose.root[0] + pose.anchor.at[0] - at[0], pose.root[1] + pose.anchor.at[1] - at[1]]);
  }
  return frame;
}

/* ============================================================ INTERPOLATION */

type AnyPose = Record<string, unknown>;

function lerpValue(a: unknown, b: unknown, t: number): unknown {
  if (typeof a === 'number' && typeof b === 'number') return lerp(a, b, t);
  if (Array.isArray(a) && Array.isArray(b) && a.length === 2 && typeof a[0] === 'number') return lerpVec(a as Vec, b as Vec, t);
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const out: AnyPose = {};
    for (const k of new Set([...Object.keys(a as AnyPose), ...Object.keys(b as AnyPose)])) {
      out[k] = lerpValue((a as AnyPose)[k], (b as AnyPose)[k], t);
    }
    return out;
  }
  return t < 0.5 ? a : b;
}

/** Interpolate two poses of the same rig (missing numeric keys fall back to the other pose). */
export function interpolate<P extends object>(a: P, b: P, t: number): P {
  const out: AnyPose = {};
  const A = a as AnyPose;
  const B = b as AnyPose;
  for (const k of new Set([...Object.keys(A), ...Object.keys(B)])) {
    const va = A[k] ?? B[k];
    const vb = B[k] ?? A[k];
    out[k] = lerpValue(va, vb, t);
  }
  return out as P;
}
