/**
 * Movement template library.
 *
 * Coordinates are in a 260×200 world (floor at y = 194; a standing ankle sits
 * at y = 190). Poses use joint angles or inverse kinematics targets, so hands
 * and feet follow physically consistent paths. Every template lists the
 * muscles it is designed to show (`targets`); the assignment gate in
 * assign.ts only uses a template for exercises whose primary muscles overlap.
 *
 * Templates are educational simplifications — review them at /visuals-review/.
 */
import type { Vec } from './geometry';
import { solveSide, type FrontPose, type SidePose } from './rig';
import type { Prop } from './props';
import type { FrontTemplate, SideTemplate, Template } from './timeline';

/* ================================================================ helpers */

const A = 190; // ankle height when standing on the floor
const STAND: SidePose = { root: [118, 113], foot: [122, A] };
const FRONT_STAND: Pick<FrontPose, 'root' | 'thigh' | 'shin'> = { root: [130, 113], thigh: { e: 4, a: 0 }, shin: { e: 2, a: 0 } };

const pt = (pose: SidePose, name: string): Vec => solveSide(pose).pts[name];
const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1]];

const side = (t: Omit<SideTemplate, 'rig'>): SideTemplate => ({ rig: 'side', ...t });
const front = (t: Omit<FrontTemplate, 'rig'>): FrontTemplate => ({ rig: 'front', ...t });

/* ---------------------------------------------------------------- props */

const block = (x1: number, y1: number, x2: number, y2: number, tone: 'pad' | 'metal' | 'wood' = 'pad'): Prop => ({
  k: 'block', tone, pts: [[x1, y1], [x2, y1], [x2, y2], [x1, y2]],
});
const post = (x1: number, y1: number, x2: number, y2: number): Prop => ({ k: 'post', from: [x1, y1], to: [x2, y2] });
/** Flat bench with two legs. */
const bench = (x1: number, x2: number, top: number): Prop[] => [
  block(x1, top, x2, top + 6), post(x1 + 8, top + 6, x1 + 8, 194), post(x2 - 8, top + 6, x2 - 8, 194),
];
/** Seat block on a single post. */
const seat = (x1: number, x2: number, top: number): Prop[] => [block(x1, top, x2, top + 7), post((x1 + x2) / 2, top + 7, (x1 + x2) / 2, 194)];
/** A pad lying along the body between two frame points, on its back (+1) or front (−1) side. */
function padAlong(pose: SidePose, a: string, b: string, sideSign: 1 | -1 = 1, gap = 12.5, thick = 6, extend = 4): Prop {
  const p = pt(pose, a);
  const q = pt(pose, b);
  const len = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1;
  const d: Vec = [(q[0] - p[0]) / len, (q[1] - p[1]) / len];
  const n: Vec = [d[1] * sideSign, -d[0] * sideSign];
  const s: Vec = [p[0] - d[0] * extend, p[1] - d[1] * extend];
  const e: Vec = [q[0] + d[0] * extend, q[1] + d[1] * extend];
  const o = (v: Vec, k: number): Vec => [v[0] + n[0] * k, v[1] + n[1] * k];
  return { k: 'block', pts: [o(s, gap), o(e, gap), o(e, gap + thick), o(s, gap + thick)] };
}

/** Chest-supported incline bench: lean forward on a pad, feet on the floor behind. */
const PRONE_INCLINE: SidePose = { root: [120, 124], rot: 42, foot: [88, A], footAngle: 20 };
function inclinePadProps(pose: SidePose): Prop[] {
  const pad = padAlong(pose, 'hip', 'neck', -1, 12.5, 6, 6) as Extract<Prop, { k: 'block' }>;
  const [a, , c] = pad.pts;
  const mid: Vec = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2];
  return [pad, post(mid[0], mid[1], mid[0] + 6, 194)];
}

/* ======================================================== PUSH — lying */

function supinePress(o: { implement: 'barbell' | 'dumbbell'; incline?: number; floor?: boolean; smith?: boolean }): SideTemplate {
  const incline = o.incline ?? 0;
  const floor = o.floor ?? false;
  const root: Vec = floor ? [150, 182] : incline > 0 ? [154, 140] : incline < 0 ? [146, 116] : [150, 122];
  const footTarget: Vec = floor ? [176, A] : incline < 0 ? [186, 152] : [186, A];
  const base: SidePose = { root, rot: -90 + incline, foot: footTarget, kneeBend: 1 };
  const sh = pt(base, 'shoulder');
  const low = incline > 0 ? pt(base, 'rack') : pt(base, 'chest');
  const bottom = floor ? add(sh, [6, -30]) : add(low, [incline > 0 ? 2 : -1, -5]);
  const props: Prop[] = [];
  if (!floor) {
    props.push(padAlong(base, 'hip', 'neck', 1, 12.5, 6, 8));
    props.push(post(root[0] + (incline > 0 ? 4 : -4), root[1] + 20, root[0] + (incline > 0 ? 4 : -4), 194));
  }
  if (incline < 0) props.push({ k: 'roller', at: 'ankle' });
  if (o.smith) props.push(post(bottom[0] - 2, 8, bottom[0] - 2, 194));
  props.push({ k: o.implement, at: 'hand' });
  return side({
    mode: 'reps', track: 'hand',
    targets: ['chest', 'upper-chest', 'lower-chest', 'triceps', 'front-delts'],
    props,
    frames: [{ ...base, hand: add(sh, [2, -56]) }, { ...base, hand: bottom }],
  });
}

/** Lying triceps extension (skull crusher): upper arm stays near vertical, elbow bends. */
const skullCrusher = side({
  mode: 'reps', track: 'hand', targets: ['triceps'],
  props: [padAlong({ root: [150, 122], rot: -90 }, 'hip', 'neck', 1, 12.5, 6, 8), post(146, 142, 146, 194), { k: 'barbell', at: 'hand', r: 8 }],
  frames: [
    { root: [150, 122], rot: -90, foot: [186, A], shoulder: -80, elbow: -6 },
    { root: [150, 122], rot: -90, foot: [186, A], shoulder: -72, elbow: -125 },
  ],
});

/** Dumbbell pullover: arms arc from over the chest to behind the head. */
const pullover = side({
  mode: 'reps', track: 'hand', targets: ['chest', 'lats'],
  props: [padAlong({ root: [150, 122], rot: -90 }, 'hip', 'neck', 1, 12.5, 6, 8), post(146, 142, 146, 194), { k: 'dumbbell', at: 'hand' }],
  frames: [
    { root: [150, 122], rot: -90, foot: [186, A], shoulder: -88, elbow: -14 },
    { root: [150, 122], rot: -90, foot: [186, A], shoulder: -168, elbow: -24 },
  ],
});

/* ===================================================== PUSH — push-ups */

function pushUp(o: { hands: 'floor' | 'box'; feet: 'floor' | 'box' }): SideTemplate {
  const toeAt: Vec = o.feet === 'box' ? [36, 156] : [44, 192];
  const handY = o.hands === 'box' ? 152 : 190;
  const topRot = o.hands === 'box' ? 52 : o.feet === 'box' ? 84 : 66;
  const botRot = o.hands === 'box' ? 68 : o.feet === 'box' ? 98 : 84;
  const mk = (rot: number): SidePose => ({ root: [0, 0], rot, footAngle: 75, anchor: { point: 'toe', at: toeAt } });
  const shTop = pt(mk(topRot), 'shoulder');
  const hand: Vec = [shTop[0] + 2, handY];
  const props: Prop[] = [];
  if (o.hands === 'box') props.push(block(hand[0] - 16, handY + 4, hand[0] + 16, 194, 'wood'));
  if (o.feet === 'box') props.push(block(18, 160, 60, 194, 'wood'));
  return side({
    mode: 'reps', track: 'shoulder',
    targets: ['chest', 'upper-chest', 'triceps', 'front-delts'],
    props,
    frames: [{ ...mk(topRot), hand, elbowBend: 1 }, { ...mk(botRot), hand, elbowBend: 1 }],
  });
}

const dips = side({
  mode: 'reps', track: 'shoulder', targets: ['chest', 'triceps', 'lower-chest'],
  props: [block(108, 92, 150, 97, 'metal'), post(144, 97, 144, 194)],
  frames: [
    { root: [0, 0], trunk: 14, shoulder: -18, elbow: -4, hip: -24, knee: 85, anchor: { point: 'hand', at: [130, 92] } },
    { root: [0, 0], trunk: 22, shoulder: 52, elbow: -100, hip: -24, knee: 85, anchor: { point: 'hand', at: [130, 92] } },
  ],
});

const benchDip = side({
  mode: 'reps', track: 'hip', targets: ['triceps'],
  props: bench(30, 92, 138),
  frames: [
    { root: [0, 0], shoulder: 22, elbow: -2, anchor: { point: 'hand', at: [86, 137] }, foot: [176, A], kneeBend: 1 },
    { root: [0, 0], shoulder: 62, elbow: -92, anchor: { point: 'hand', at: [86, 137] }, foot: [176, A], kneeBend: 1 },
  ],
});

/* ================================================== PUSH — standing/seated */

const SEATED_BACK: SidePose = { root: [104, 150], foot: [150, A] };
const seatedProps = (withBack = true): Prop[] => [
  ...seat(80, 128, 160),
  ...(withBack ? [padAlong({ ...SEATED_BACK }, 'hip', 'neck', 1, 12, 6, 2)] : []),
];

function overheadPress(o: { seated: boolean; implement: 'barbell' | 'dumbbell'; machine?: boolean; landmine?: boolean }): SideTemplate {
  const base: SidePose = o.seated ? { ...SEATED_BACK } : { ...STAND };
  const sh = pt(base, 'shoulder');
  const rack = pt(base, 'rack');
  const start: Vec = o.landmine ? add(rack, [7, 2]) : o.implement === 'dumbbell' ? add(sh, [3, -10]) : add(rack, [5, -4]);
  const end: Vec = o.landmine ? add(sh, [40, -40]) : add(sh, [3, -57]);
  const props: Prop[] = o.seated ? seatedProps(true) : [];
  if (o.machine) props.push({ k: 'lever', pivot: [sh[0] - 30, sh[1] + 6], at: 'hand' });
  if (o.landmine) props.push({ k: 'lever', pivot: [22, 190], at: 'hand' }, { k: 'plate', at: 'hand', r: 7 });
  else if (!o.machine) props.push({ k: o.implement, at: 'hand' });
  return side({
    mode: 'reps', track: 'hand', targets: ['front-delts', 'side-delts', 'triceps', 'upper-chest'], props,
    frames: [{ ...base, hand: start, elbowBend: -1 }, { ...base, hand: end, elbowBend: -1 }],
  });
}

const pushPress = (() => {
  const dip: SidePose = { root: [112, 124], foot: [122, A], trunk: 2 };
  const rack = pt(STAND, 'rack');
  const dipRack = pt(dip, 'rack');
  const top = add(pt(STAND, 'shoulder'), [3, -57]);
  return side({
    mode: 'reps', track: 'hand', targets: ['front-delts', 'side-delts', 'triceps'],
    props: [{ k: 'barbell', at: 'hand' }],
    frames: [
      { ...STAND, hand: add(rack, [5, -4]) },
      { ...dip, hand: add(dipRack, [5, -4]) },
      { ...STAND, hand: top },
    ],
  });
})();

const chestPressMachine = (() => {
  const sh = pt(SEATED_BACK, 'shoulder');
  const chest = pt(SEATED_BACK, 'chest');
  return side({
    mode: 'reps', track: 'hand', targets: ['chest', 'triceps', 'front-delts'],
    props: [...seatedProps(true), { k: 'lever', pivot: [sh[0] + 20, sh[1] - 44], at: 'hand' }],
    frames: [{ ...SEATED_BACK, hand: add(chest, [4, 2]), elbowBend: -1 }, { ...SEATED_BACK, hand: add(sh, [55, 6]), elbowBend: -1 }],
  });
})();

const svendPress = (() => {
  const sh = pt(STAND, 'shoulder');
  const st = pt(STAND, 'sternum');
  return side({
    mode: 'reps', track: 'hand', targets: ['chest', 'front-delts'],
    props: [{ k: 'plate', at: 'hand', r: 9 }],
    frames: [{ ...STAND, hand: add(st, [5, 0]), elbowBend: -1 }, { ...STAND, hand: add(sh, [54, 10]), elbowBend: -1 }],
  });
})();

const frontRaise = side({
  mode: 'reps', track: 'hand', targets: ['front-delts'],
  props: [{ k: 'dumbbell', at: 'hand' }],
  frames: [{ ...STAND, shoulder: -4, elbow: -6 }, { ...STAND, shoulder: -92, elbow: -6 }],
});

const yRaise = side({
  mode: 'reps', track: 'hand', targets: ['side-delts', 'rear-delts', 'traps', 'upper-back'],
  props: [...inclinePadProps(PRONE_INCLINE), { k: 'dumbbell', at: 'hand' }],
  frames: [
    { ...PRONE_INCLINE, shoulder: -42, elbow: -4 },
    { ...PRONE_INCLINE, shoulder: -172, elbow: -4 },
  ],
});

/* ============================================================ PULL */

const SEATED_PULL: SidePose = { root: [104, 150], foot: [150, A] };

function pulldownSide(): SideTemplate {
  const sh = pt(SEATED_PULL, 'shoulder');
  const rack = pt(SEATED_PULL, 'rack');
  return side({
    mode: 'reps', track: 'hand', targets: ['lats', 'upper-back', 'biceps'],
    props: [...seat(80, 128, 160), { k: 'roller', at: [146, 142] }, { k: 'pulley', at: [sh[0] + 6, 6] }, { k: 'cable', from: [sh[0] + 6, 6], to: 'hand' }],
    frames: [{ ...SEATED_PULL, hand: add(sh, [6, -55]), elbowBend: 1 }, { ...SEATED_PULL, trunk: -8, hand: add(rack, [6, 2]), elbowBend: 1 }],
  });
}

const chinUp = side({
  mode: 'reps', track: 'shoulder', targets: ['lats', 'biceps', 'upper-back'], floor: false,
  props: [block(108, 20, 152, 24, 'metal')],
  frames: [
    { root: [0, 0], shoulder: -178, elbow: -4, hip: -10, knee: 60, footAngle: 60, anchor: { point: 'hand', at: [130, 22] } },
    { root: [0, 0], shoulder: -32, elbow: -128, hip: -14, knee: 64, footAngle: 60, anchor: { point: 'hand', at: [130, 22] } },
  ],
});

const straightArmPulldown = side({
  mode: 'reps', track: 'hand', targets: ['lats'],
  props: [{ k: 'pulley', at: [196, 14] }, { k: 'cable', from: [196, 14], to: 'hand' }],
  frames: [
    { root: [112, 114], foot: [122, A], trunk: 22, shoulder: -158, elbow: -10 },
    { root: [112, 114], foot: [122, A], trunk: 22, shoulder: -28, elbow: -8 },
  ],
});

const rowSeatedCable = (() => {
  const base: SidePose = { root: [96, 182], foot: [170, 178], kneeBend: 1, footAngle: -70 };
  const sh = pt(base, 'shoulder');
  const belly = pt(base, 'belly');
  return side({
    mode: 'reps', track: 'hand', targets: ['upper-back', 'lats', 'rear-delts', 'biceps'],
    props: [block(176, 160, 186, 194, 'metal'), { k: 'pulley', at: [232, 172] }, { k: 'cable', from: [232, 172], to: 'hand' }],
    frames: [
      { ...base, trunk: 14, hand: add(sh, [58, 18]), elbowBend: 1 },
      { ...base, trunk: -6, hand: add(belly, [2, -6]), elbowBend: 1 },
    ],
  });
})();

const rowMachine = (() => {
  const base: SidePose = { root: [104, 150], foot: [150, A] };
  const sh = pt(base, 'shoulder');
  const belly = pt(base, 'belly');
  return side({
    mode: 'reps', track: 'hand', targets: ['upper-back', 'lats', 'rear-delts'],
    props: [...seat(80, 128, 160), padAlong(base, 'belly', 'chest', -1, 13, 5, 2), { k: 'lever', pivot: [sh[0] + 52, sh[1] + 48], at: 'hand' }],
    frames: [{ ...base, hand: add(sh, [52, 12]), elbowBend: 1 }, { ...base, hand: add(belly, [4, -8]), elbowBend: 1 }],
  });
})();

function bentRow(o: { trunk: number; root: Vec; implement: 'barbell' | 'dumbbell' | 'tbar'; fromFloor?: boolean }): SideTemplate {
  const base: SidePose = { root: o.root, foot: [124, A], trunk: o.trunk };
  const sh = pt(base, 'shoulder');
  const belly = pt(base, 'belly');
  const start: Vec = o.fromFloor ? [sh[0] + 2, 182] : add(sh, [2, 54]);
  const props: Prop[] = o.implement === 'tbar'
    ? [{ k: 'lever', pivot: [24, 190], at: 'hand' }, { k: 'plate', at: 'hand', r: 9 }]
    : [{ k: o.implement, at: 'hand' }];
  return side({
    mode: 'reps', track: 'hand', targets: ['upper-back', 'lats', 'rear-delts', 'biceps'], props,
    frames: [{ ...base, hand: start, elbowBend: 1 }, { ...base, hand: add(belly, [0, 4]), elbowBend: 1 }],
  });
}

const rowOneArm = (() => {
  const base: SidePose = { root: [104, 116], foot: [108, A], trunk: 72, farFoot: [66, 154], farKneeBend: 1, farHand: [150, 154] };
  const sh = pt(base, 'shoulder');
  return side({
    mode: 'reps', track: 'hand', targets: ['lats', 'upper-back', 'rear-delts'],
    props: [...bench(54, 172, 158), { k: 'dumbbell', at: 'hand' }],
    frames: [{ ...base, hand: add(sh, [1, 54]), elbowBend: 1 }, { ...base, hand: add(sh, [-20, 18]), elbowBend: 1 }],
  });
})();

const rowChestSupported = (() => {
  const base: SidePose = PRONE_INCLINE;
  const sh = pt(base, 'shoulder');
  return side({
    mode: 'reps', track: 'hand', targets: ['upper-back', 'lats', 'rear-delts'],
    props: [...inclinePadProps(base), { k: 'dumbbell', at: 'hand' }],
    frames: [{ ...base, hand: add(sh, [0, 54]), elbowBend: 1 }, { ...base, hand: add(sh, [-14, 24]), elbowBend: 1 }],
  });
})();

const rowInverted = (() => {
  const mk = (rot: number): SidePose => ({ root: [0, 0], rot, footAngle: -70, anchor: { point: 'heel', at: [214, 193] } });
  const bar: Vec = [112, 106];
  return side({
    mode: 'reps', track: 'chest', targets: ['upper-back', 'lats', 'rear-delts', 'biceps'],
    props: [block(92, 104, 132, 108, 'metal'), post(96, 108, 96, 194)],
    frames: [{ ...mk(-75), hand: bar, elbowBend: 1 }, { ...mk(-58), hand: bar, elbowBend: 1 }],
  });
})();

const facePull = front({
  facing: 'posterior', mode: 'reps', track: 'hand', targets: ['rear-delts', 'upper-back', 'traps'],
  props: [{ k: 'bar', from: 'L:hand', to: 'R:hand' }],
  frames: [
    { ...FRONT_STAND, arm: { e: 92, a: 84 }, fore: { e: 92, a: 84 } },
    { ...FRONT_STAND, arm: { e: 92, a: -8 }, fore: { e: 168, a: 0 } },
  ],
});

function reverseFly(o: { bent?: boolean; seated?: boolean; band?: boolean }): FrontTemplate {
  const root: Vec = o.seated ? [130, 150] : [130, 113];
  const legs = o.seated ? { thigh: { e: 90, a: 90 }, shin: { e: 2, a: 0 } } : { thigh: FRONT_STAND.thigh, shin: FRONT_STAND.shin };
  const torso = o.bent ? { torsoF: 0.58 } : {};
  const startArm = o.bent ? { e: 4, a: 0 } : { e: 92, a: 86 };
  const props: Prop[] = [];
  if (o.seated) props.push(...seat(104, 156, 156));
  if (o.band) props.push({ k: 'band', from: 'L:hand', to: 'R:hand' });
  else if (!o.seated) props.push({ k: 'dumbbell', at: 'R:hand' }, { k: 'dumbbell', at: 'L:hand' });
  return front({
    facing: 'posterior', mode: 'reps', track: 'hand', targets: ['rear-delts', 'upper-back', 'traps'], props,
    frames: [
      { root, ...legs, ...torso, arm: startArm, fore: startArm },
      { root, ...legs, ...torso, arm: { e: 86, a: -6 }, fore: { e: 88, a: -6 } },
    ],
  });
}

const pullUpWide = front({
  facing: 'posterior', mode: 'reps', track: 'hip', targets: ['lats', 'upper-back', 'biceps'], floor: false,
  props: [block(60, 16, 200, 20, 'metal')],
  frames: [
    { root: [130, 100], arm: { e: 164, a: 0 }, fore: { e: 166, a: 0 }, thigh: { e: 6, a: 0 }, shin: { e: 4, a: 0 }, anchor: { point: 'hand', at: [168, 18] } },
    { root: [130, 100], arm: { e: 48, a: -6 }, fore: { e: 170, a: 0 }, thigh: { e: 10, a: 0 }, shin: { e: 6, a: 0 }, anchor: { point: 'hand', at: [168, 18] } },
  ],
});

const pulldownWide = front({
  facing: 'posterior', mode: 'reps', track: 'hand', targets: ['lats', 'upper-back'],
  props: [...seat(100, 160, 156), { k: 'pulley', at: [130, 6] }, { k: 'cable', from: [130, 6], to: 'handsMid' }, { k: 'bar', from: 'L:hand', to: 'R:hand' }],
  frames: [
    { root: [130, 150], arm: { e: 158, a: 0 }, fore: { e: 162, a: 0 }, thigh: { e: 90, a: 90 }, shin: { e: 2, a: 0 } },
    { root: [130, 150], arm: { e: 42, a: -8 }, fore: { e: 172, a: 0 }, thigh: { e: 90, a: 90 }, shin: { e: 2, a: 0 } },
  ],
});

const shrug = (facing: 'anterior' | 'posterior', implement: 'barbell' | 'dumbbell'): FrontTemplate => front({
  facing, mode: 'reps', track: 'neck', targets: ['traps'],
  props: implement === 'barbell'
    ? [{ k: 'bar', from: 'L:hand', to: 'R:hand' }]
    : [{ k: 'dumbbell', at: 'R:hand' }, { k: 'dumbbell', at: 'L:hand' }],
  frames: [
    { ...FRONT_STAND, arm: { e: 6, a: 0 }, fore: { e: 6, a: 0 } },
    { ...FRONT_STAND, shrug: -7, arm: { e: 6, a: 0 }, fore: { e: 6, a: 0 } },
  ],
});

const uprightRow = front({
  facing: 'anterior', mode: 'reps', track: 'hand', targets: ['side-delts', 'traps'],
  props: [{ k: 'bar', from: 'L:hand', to: 'R:hand' }],
  frames: [
    { ...FRONT_STAND, arm: { e: 8, a: 0 }, fore: { e: 4, a: 180 } },
    { ...FRONT_STAND, arm: { e: 80, a: 0 }, fore: { e: 148, a: 180 } },
  ],
});

function lateralRaise(o: { implement: 'dumbbell' | 'cable' | 'machine' }): FrontTemplate {
  const seated = o.implement === 'machine';
  const base: Pick<FrontPose, 'root' | 'thigh' | 'shin'> = seated ? { root: [130, 150], thigh: { e: 90, a: 90 }, shin: { e: 2, a: 0 } } : FRONT_STAND;
  const props: Prop[] = [];
  if (seated) props.push(...seat(104, 156, 156), { k: 'roller', at: 'R:elbow' }, { k: 'roller', at: 'L:elbow' });
  if (o.implement === 'dumbbell') props.push({ k: 'dumbbell', at: 'R:hand' }, { k: 'dumbbell', at: 'L:hand' });
  if (o.implement === 'cable') props.push({ k: 'pulley', at: [44, 188] }, { k: 'cable', from: [44, 188], to: 'R:hand' });
  const left = o.implement === 'cable' ? { armL: { e: 12, a: 20 }, foreL: { e: 30, a: 150 } } : {};
  return front({
    facing: 'anterior', mode: 'reps', track: 'hand', targets: ['side-delts'], props,
    frames: [
      { ...base, ...left, arm: { e: 10, a: 6 }, fore: { e: 12, a: 6 } },
      { ...base, ...left, arm: { e: 86, a: 6 }, fore: { e: 90, a: 6 } },
    ],
  });
}

function fly(o: { kind: 'dumbbell' | 'cable-mid' | 'cable-high' | 'cable-low' | 'machine' }): FrontTemplate {
  const seated = o.kind === 'machine';
  const lying = o.kind === 'dumbbell';
  const base: Pick<FrontPose, 'root' | 'thigh' | 'shin'> = seated
    ? { root: [130, 150], thigh: { e: 90, a: 90 }, shin: { e: 2, a: 0 } }
    : FRONT_STAND;
  const props: Prop[] = [];
  let from = { e: 90, a: -6 };
  let to = { e: 90, a: 80 };
  if (lying) props.push(block(114, 62, 146, 132, 'pad'));
  if (o.kind === 'cable-high') { from = { e: 128, a: -2 }; to = { e: 52, a: 74 }; }
  if (o.kind === 'cable-low') { from = { e: 40, a: -2 }; to = { e: 116, a: 74 }; }
  if (o.kind.startsWith('cable')) {
    const y = o.kind === 'cable-high' ? 14 : o.kind === 'cable-low' ? 186 : 70;
    props.push({ k: 'pulley', at: [24, y] }, { k: 'pulley', at: [236, y] }, { k: 'cable', from: [236, y], to: 'R:hand' }, { k: 'cable', from: [24, y], to: 'L:hand' });
  }
  if (lying) props.push({ k: 'dumbbell', at: 'R:hand' }, { k: 'dumbbell', at: 'L:hand' });
  if (seated) props.push(...seat(104, 156, 156), { k: 'roller', at: 'R:elbow' }, { k: 'roller', at: 'L:elbow' });
  const fore = seated ? { e: 172, a: 0 } : undefined;
  return front({
    facing: 'anterior', mode: 'reps', track: 'hand', targets: ['chest', 'upper-chest', 'lower-chest', 'front-delts'], props,
    ...(lying ? { floor: false } : {}),
    frames: [
      { ...base, arm: from, fore: fore ?? { e: from.e, a: from.a + 8 } },
      { ...base, arm: to, fore: fore ? { e: 172, a: 60 } : { e: to.e, a: to.a + 8 } },
    ],
  });
}

const externalRotation = front({
  facing: 'posterior', mode: 'reps', track: 'hand', targets: ['rotator-cuff', 'rear-delts'],
  props: [{ k: 'pulley', at: [30, 98] }, { k: 'cable', from: [30, 98], to: 'R:hand' }],
  frames: [
    { ...FRONT_STAND, arm: { e: 8, a: 0 }, fore: { e: 90, a: 116 }, armL: { e: 6, a: 0 }, foreL: { e: 8, a: 0 } },
    { ...FRONT_STAND, arm: { e: 8, a: 0 }, fore: { e: 90, a: -18 }, armL: { e: 6, a: 0 }, foreL: { e: 8, a: 0 } },
  ],
});

/* ============================================================ ARMS */

function curl(o: { implement: 'dumbbell' | 'barbell' | 'cable'; alternate?: boolean }): SideTemplate {
  const props: Prop[] = o.implement === 'cable'
    ? [{ k: 'pulley', at: [170, 188] }, { k: 'cable', from: [170, 188], to: 'hand' }]
    : [{ k: o.implement, at: 'hand', ...(o.implement === 'barbell' ? { r: 9 } : {}) }];
  const far = o.alternate ? { farShoulder: 0, farElbow: -6 } : {};
  return side({
    mode: 'reps', track: 'hand', targets: ['biceps', 'brachialis', 'forearms'], props,
    frames: [{ ...STAND, ...far, shoulder: 0, elbow: -6 }, { ...STAND, ...far, shoulder: -12, elbow: -140 }],
  });
}

const preacherCurl = (machine: boolean): SideTemplate => {
  const base: SidePose = { root: [104, 150], foot: [150, A], trunk: 10 };
  const pre: SidePose = { ...base, shoulder: -48, elbow: 0 };
  const pad = padAlong(pre, 'shoulder', 'elbow', -1, 5, 6, 2);
  return side({
    mode: 'reps', track: 'hand', targets: ['biceps', 'brachialis'],
    props: [...seat(80, 128, 160), pad, machine ? { k: 'lever', pivot: pt(pre, 'elbow'), at: 'hand' } : { k: 'barbell', at: 'hand', r: 8 }],
    frames: [{ ...base, shoulder: -48, elbow: -14 }, { ...base, shoulder: -48, elbow: -122 }],
  });
};

const inclineCurl = (() => {
  const base: SidePose = { root: [112, 150], rot: -30, foot: [154, A] };
  return side({
    mode: 'reps', track: 'hand', targets: ['biceps'],
    props: [...seat(88, 134, 160), padAlong(base, 'hip', 'neck', 1, 12.5, 6, 4), { k: 'dumbbell', at: 'hand' }],
    frames: [{ ...base, shoulder: 30, elbow: -4 }, { ...base, shoulder: 26, elbow: -132 }],
  });
})();

const concentrationCurl = (() => {
  const base: SidePose = { root: [104, 150], foot: [150, A], trunk: 42 };
  return side({
    mode: 'reps', track: 'hand', targets: ['biceps', 'brachialis'],
    props: [...seat(80, 128, 160), { k: 'dumbbell', at: 'hand' }],
    frames: [{ ...base, shoulder: -36, elbow: -4 }, { ...base, shoulder: -36, elbow: -130 }],
  });
})();

const spiderCurl = (() => {
  const base: SidePose = PRONE_INCLINE;
  return side({
    mode: 'reps', track: 'hand', targets: ['biceps', 'brachialis'],
    props: [...inclinePadProps(base), { k: 'dumbbell', at: 'hand' }],
    frames: [{ ...base, shoulder: -42, elbow: -4 }, { ...base, shoulder: -42, elbow: -132 }],
  });
})();

const bayesianCurl = side({
  mode: 'reps', track: 'hand', targets: ['biceps'],
  props: [{ k: 'pulley', at: [40, 186] }, { k: 'cable', from: [40, 186], to: 'hand' }],
  frames: [{ ...STAND, root: [122, 113], foot: [126, A], shoulder: 26, elbow: -6 }, { ...STAND, root: [122, 113], foot: [126, A], shoulder: 22, elbow: -128 }],
});

const dragCurl = (() => {
  const hip = pt(STAND, 'hipFront');
  const st = pt(STAND, 'sternum');
  return side({
    mode: 'reps', track: 'hand', targets: ['biceps', 'brachialis'],
    props: [{ k: 'barbell', at: 'hand', r: 9 }],
    frames: [{ ...STAND, hand: add(hip, [3, 2]), elbowBend: 1 }, { ...STAND, hand: add(st, [3, 2]), elbowBend: 1 }],
  });
})();

const wristCurl = side({
  mode: 'reps', track: 'hand', targets: ['forearms'],
  props: [...seat(80, 128, 160), block(130, 140, 176, 146), post(160, 146, 160, 194), { k: 'dumbbell', at: 'hand' }],
  frames: [
    { root: [104, 150], foot: [150, A], trunk: 30, shoulder: -48, elbow: -70, wrist: 42 },
    { root: [104, 150], foot: [150, A], trunk: 30, shoulder: -48, elbow: -70, wrist: -40 },
  ],
});

const wristRoller = side({
  mode: 'cycle', targets: ['forearms'],
  props: [{ k: 'cable', from: 'hand', to: [172, 172] }, { k: 'plate', at: [172, 176], r: 7 }],
  timing: { step: 0.5 },
  frames: [
    { ...STAND, shoulder: -88, elbow: -4, wrist: 30 },
    { ...STAND, shoulder: -88, elbow: -4, wrist: -30 },
  ],
});

function pushdown(): SideTemplate {
  return side({
    mode: 'reps', track: 'hand', targets: ['triceps'],
    props: [{ k: 'pulley', at: [170, 10] }, { k: 'cable', from: [170, 10], to: 'hand' }],
    frames: [
      { ...STAND, trunk: 10, shoulder: -16, elbow: -108 },
      { ...STAND, trunk: 10, shoulder: -12, elbow: -4 },
    ],
  });
}

function overheadExtension(o: { implement: 'dumbbell' | 'ez' | 'cable' }): SideTemplate {
  if (o.implement === 'cable') {
    return side({
      mode: 'reps', track: 'hand', targets: ['triceps'],
      props: [{ k: 'pulley', at: [40, 26] }, { k: 'cable', from: [40, 26], to: 'hand' }],
      frames: [
        { root: [116, 116], foot: [126, A], farFoot: [100, A], trunk: 30, shoulder: -150, elbow: -138 },
        { root: [116, 116], foot: [126, A], farFoot: [100, A], trunk: 30, shoulder: -150, elbow: -6 },
      ],
    });
  }
  return side({
    mode: 'reps', track: 'hand', targets: ['triceps'],
    props: [...seatedProps(true), o.implement === 'dumbbell' ? { k: 'dumbbell', at: 'hand' } : { k: 'barbell', at: 'hand', r: 8 }],
    frames: [{ ...SEATED_BACK, shoulder: -166, elbow: -148 }, { ...SEATED_BACK, shoulder: -170, elbow: -6 }],
  });
}

const kickback = (cable: boolean): SideTemplate => side({
  mode: 'reps', track: 'hand', targets: ['triceps'],
  props: cable
    ? [{ k: 'pulley', at: [176, 186] }, { k: 'cable', from: [176, 186], to: 'hand' }]
    : [...bench(150, 214, 150), { k: 'dumbbell', at: 'hand' }],
  frames: [
    { root: [104, 118], foot: [110, A], farFoot: [86, A], trunk: 66, shoulder: 24, elbow: -92, farHand: cable ? undefined : [160, 148] },
    { root: [104, 118], foot: [110, A], farFoot: [86, A], trunk: 66, shoulder: 24, elbow: -4, farHand: cable ? undefined : [160, 148] },
  ],
});

/* ============================================================ LEGS */

function squat(o: { load: 'back' | 'front' | 'goblet' | 'bodyweight' | 'smith'; mode?: 'reps' | 'hold' }): SideTemplate {
  const top: SidePose = { root: [118, 113], foot: [122, A] };
  const bottomRoot: Vec = o.load === 'front' || o.load === 'goblet' ? [100, 148] : [96, 147];
  const trunkTop = o.load === 'front' || o.load === 'goblet' ? 2 : 6;
  const trunkBot = o.load === 'front' ? 22 : o.load === 'goblet' ? 26 : o.load === 'bodyweight' ? 34 : 40;
  const arms = (trunk: number): Partial<SidePose> => {
    if (o.load === 'back' || o.load === 'smith') return { hand: 'back', elbowBend: -1 };
    if (o.load === 'front') return { hand: 'rack', elbowBend: -1 };
    if (o.load === 'goblet') return { shoulder: -18, elbow: -146 };
    return { shoulder: -90 - trunk, elbow: -4 };
  };
  const props: Prop[] = [];
  if (o.load === 'back' || o.load === 'front' || o.load === 'smith') props.push({ k: 'barbell', at: 'hand' });
  if (o.load === 'goblet') props.push({ k: 'dumbbell', at: 'hand' });
  if (o.load === 'smith') props.push(post(84, 10, 84, 194));
  const bottom: SidePose = { root: bottomRoot, foot: [122, A], trunk: trunkBot, ...arms(trunkBot) };
  if (o.mode === 'hold') {
    return side({ mode: 'hold', targets: ['quads', 'glutes', 'adductors'], props, frames: [bottom] });
  }
  return side({
    mode: 'reps', track: 'hip', targets: ['quads', 'glutes', 'adductors'], props,
    frames: [{ ...top, trunk: trunkTop, ...arms(trunkTop) }, bottom],
  });
}

const wallSit = side({
  mode: 'hold', targets: ['quads', 'glutes'],
  props: [{ k: 'wall', x: 80 }],
  frames: [{ root: [100, 152], foot: [140, A], trunk: 0, shoulder: -8, elbow: -10 }],
});

const hackSquat = (() => {
  const top: SidePose = { root: [118, 114], foot: [130, 182], rot: -16, footAngle: -10, shoulder: -40, elbow: -110 };
  const bot: SidePose = { root: [94, 150], foot: [130, 182], rot: -16, footAngle: -10, shoulder: -40, elbow: -110 };
  return side({
    mode: 'reps', track: 'hip', targets: ['quads', 'glutes'],
    // The back pad rides on the sled with the body; the rail shows its path.
    props: [post(64, 194, 116, 14), block(116, 186, 160, 194, 'metal'), { k: 'sled', at: 'back', angle: -16, len: 44 }],
    frames: [top, bot],
  });
})();

const legPress = (() => {
  const base: SidePose = { root: [92, 150], rot: -50, footAngle: -45 };
  return side({
    mode: 'reps', track: 'ankle', targets: ['quads', 'glutes', 'hamstrings'],
    props: [padAlong(base, 'hip', 'neck', 1, 12.5, 6, 4), block(64, 164, 110, 172), post(86, 172, 86, 194), { k: 'sled', at: 'toe', angle: -45, len: 30 }],
    frames: [{ ...base, foot: [128, 112] }, { ...base, foot: [148, 96] }],
  });
})();

const legPressCalf = (() => {
  const base: SidePose = { root: [92, 150], rot: -50, foot: [146, 98] };
  return side({
    mode: 'reps', track: 'toe', targets: ['calves'],
    props: [padAlong(base, 'hip', 'neck', 1, 12.5, 6, 4), block(64, 164, 110, 172), post(86, 172, 86, 194), { k: 'sled', at: 'toe', angle: -45, len: 30 }],
    frames: [{ ...base, footAngle: -58 }, { ...base, footAngle: -18 }],
  });
})();

function lunge(o: { kind: 'split' | 'forward' | 'reverse' | 'bulgarian' }): SideTemplate {
  const frontFoot: Vec = [152, A];
  const backToe: Vec = o.kind === 'bulgarian' ? [74, 150] : [78, 192];
  const backAngle = o.kind === 'bulgarian' ? 110 : 52;
  const props: Prop[] = o.kind === 'bulgarian' ? bench(30, 84, 154) : [];
  const split = (root: Vec, trunk: number): SidePose => ({
    root, trunk, foot: frontFoot, farFoot: backToe, farToe: true, farFootAngle: backAngle, shoulder: 0, elbow: -6,
  });
  const top = split(o.kind === 'bulgarian' ? [114, 116] : [116, 120], 4);
  const bottom = split(o.kind === 'bulgarian' ? [110, 146] : [112, 150], 10);
  if (o.kind === 'split' || o.kind === 'bulgarian') {
    return side({ mode: 'reps', track: 'hip', targets: ['quads', 'glutes', 'hamstrings'], props, frames: [top, bottom] });
  }
  const stand: SidePose = { root: [116, 113], foot: o.kind === 'forward' ? [118, A] : frontFoot, farFoot: o.kind === 'forward' ? [116, A] : [150, A], shoulder: 0, elbow: -6 };
  if (o.kind === 'reverse') stand.root = [148, 113];
  const mid: SidePose = o.kind === 'forward'
    ? { root: [122, 116], foot: [140, 176], farFoot: [116, A], shoulder: 0, elbow: -6 }
    : { root: [136, 116], foot: frontFoot, farFoot: [104, 176], shoulder: 0, elbow: -6 };
  const end: SidePose = o.kind === 'forward' ? bottom : { ...bottom, root: [130, 150], foot: frontFoot, farFoot: [96, 192], farToe: true };
  return side({ mode: 'reps', track: 'hip', targets: ['quads', 'glutes', 'hamstrings'], props, frames: [stand, mid, end] });
}

const stepUp = side({
  mode: 'reps', track: 'hip', targets: ['quads', 'glutes'],
  props: [block(130, 158, 196, 194, 'wood')],
  frames: [
    { root: [124, 118], foot: [152, 154], farFoot: [112, A], trunk: 14, shoulder: 0, elbow: -6 },
    { root: [148, 80], foot: [152, 154], farFoot: [150, 150], trunk: 2, shoulder: 0, elbow: -6 },
  ],
});

const legExtension = side({
  mode: 'reps', track: 'ankle', targets: ['quads'],
  props: [...seat(78, 132, 156), padAlong({ root: [104, 146], rot: -8 }, 'hip', 'neck', 1, 12, 6, 2), { k: 'roller', at: 'ankle' }],
  frames: [
    { root: [104, 146], rot: -8, hip: -82, knee: 92, shoulder: 6, elbow: -20 },
    { root: [104, 146], rot: -8, hip: -82, knee: 6, shoulder: 6, elbow: -20 },
  ],
});

const legCurlLying = side({
  mode: 'reps', track: 'ankle', targets: ['hamstrings'],
  props: [...bench(60, 182, 140), { k: 'roller', at: 'ankle' }],
  frames: [
    { root: [118, 128], rot: 90, hip: 0, knee: 0, footAngle: 80, shoulder: -120, elbow: -70 },
    { root: [118, 128], rot: 90, hip: 0, knee: 112, footAngle: -20, shoulder: -120, elbow: -70 },
  ],
});

const legCurlSeated = side({
  mode: 'reps', track: 'ankle', targets: ['hamstrings'],
  props: [...seat(78, 132, 156), padAlong({ root: [104, 146], rot: -8 }, 'hip', 'neck', 1, 12, 6, 2), { k: 'roller', at: 'ankle' }],
  frames: [
    { root: [104, 146], rot: -8, hip: -84, knee: 4, shoulder: 6, elbow: -20 },
    { root: [104, 146], rot: -8, hip: -84, knee: 100, shoulder: 6, elbow: -20 },
  ],
});

const nordicCurl = side({
  mode: 'reps', track: 'head', targets: ['hamstrings'],
  props: [block(40, 186, 120, 194), { k: 'roller', at: 'ankle' }],
  frames: [
    { root: [0, 0], rot: 0, hip: 0, knee: 90, footAngle: 170, shoulder: -40, elbow: -60, anchor: { point: 'knee', at: [110, 184] } },
    { root: [0, 0], rot: 62, hip: 0, knee: 28, footAngle: 170, shoulder: -90, elbow: -40, anchor: { point: 'knee', at: [110, 184] } },
  ],
});

const sissySquat = side({
  mode: 'reps', track: 'knee', targets: ['quads'],
  props: [post(166, 70, 166, 194)],
  frames: [
    { root: [0, 0], rot: 0, hip: 0, knee: 0, footAngle: 25, farHand: [166, 104], shoulder: -40, elbow: -40, anchor: { point: 'toe', at: [130, 192] } },
    { root: [0, 0], rot: -40, hip: 0, knee: 112, footAngle: 40, farHand: [166, 104], shoulder: -60, elbow: -40, anchor: { point: 'toe', at: [130, 192] } },
  ],
});

/* ============================================================ HINGE */

function hinge(o: { kind: 'rdl' | 'stiff' | 'deadlift' | 'sumo' | 'trap' | 'rack' | 'goodmorning' }): SideTemplate {
  const stand: SidePose = { root: [118, 113], foot: [124, A] };
  const ends: Record<typeof o.kind, { root: Vec; trunk: number }> = {
    rdl: { root: [102, 118], trunk: 72 },
    stiff: { root: [108, 114], trunk: 80 },
    goodmorning: { root: [102, 118], trunk: 70 },
    deadlift: { root: [100, 138], trunk: 58 },
    sumo: { root: [106, 142], trunk: 38 },
    trap: { root: [104, 140], trunk: 42 },
    rack: { root: [108, 122], trunk: 40 },
  };
  const e = ends[o.kind];
  const arms = (trunk: number): Partial<SidePose> => (o.kind === 'goodmorning'
    ? { hand: 'back', elbowBend: -1 }
    : { shoulder: -trunk, elbow: 0 });
  const props: Prop[] = [{ k: 'barbell', at: 'hand', ...(o.kind === 'trap' ? { r: 9 } : {}) }];
  if (o.kind === 'rack') props.unshift(block(124, 150, 140, 194, 'metal'));
  const fromFloor = o.kind === 'deadlift' || o.kind === 'sumo' || o.kind === 'trap' || o.kind === 'rack';
  const startEnd = fromFloor
    ? [{ ...stand, foot: [124, A] as Vec, root: e.root, trunk: e.trunk, ...arms(e.trunk) }, { ...stand, trunk: 2, ...arms(2) }]
    : [{ ...stand, trunk: 2, ...arms(2) }, { ...stand, root: e.root, trunk: e.trunk, ...arms(e.trunk) }];
  return side({
    mode: 'reps', track: o.kind === 'goodmorning' ? 'head' : 'hand',
    targets: ['hamstrings', 'glutes', 'lower-back'], props, frames: startEnd,
  });
}

const backExtension = side({
  mode: 'reps', track: 'head', targets: ['lower-back', 'glutes', 'hamstrings'],
  props: [block(134, 120, 152, 138), post(140, 138, 120, 194), { k: 'roller', at: 'ankle' }],
  frames: [
    { root: [136, 116], rot: 45, trunk: 72, foot: undefined, hip: 0, knee: 0, footAngle: 135, shoulder: -60, elbow: -110 },
    { root: [136, 116], rot: 45, trunk: 0, hip: 0, knee: 0, footAngle: 135, shoulder: -60, elbow: -110 },
  ],
});

const pullThrough = side({
  mode: 'reps', track: 'hip', targets: ['glutes', 'hamstrings'],
  props: [{ k: 'pulley', at: [34, 188] }, { k: 'cable', from: [34, 188], to: 'hand' }],
  frames: [
    { root: [118, 120], foot: [126, A], trunk: 68, hand: [116, 176], elbowBend: -1 },
    { root: [120, 113], foot: [126, A], trunk: 2, hand: [130, 128], elbowBend: -1 },
  ],
});

const kbSwing = side({
  mode: 'reps', track: 'hand', targets: ['glutes', 'hamstrings', 'lower-back'],
  props: [{ k: 'kettlebell', at: 'hand' }],
  frames: [
    { root: [106, 122], foot: [124, A], trunk: 68, shoulder: -38, elbow: 0 },
    { root: [118, 113], foot: [124, A], trunk: 0, shoulder: -92, elbow: 0 },
  ],
});

/* ============================================================ GLUTES */

function hipThrust(o: { bench: boolean; singleLeg?: boolean }): SideTemplate {
  const anchorAt: Vec = o.bench ? [84, 147] : [76, 184];
  const low = o.bench ? -52 : -90;
  const high = o.bench ? -86 : -114;
  const far = o.singleLeg ? { farHip: -34, farKnee: 4 } : {};
  const props: Prop[] = o.bench ? bench(26, 88, 150) : [];
  if (o.bench) props.push({ k: 'barbell', at: 'hand' });
  return side({
    mode: 'reps', track: 'hip', targets: ['glutes', 'hamstrings'], props,
    frames: [
      { root: [0, 0], rot: low, foot: [168, A], ...far, ...(o.bench ? { hand: 'hipFront', elbowBend: 1 as const } : { shoulder: 20, elbow: -4 }), anchor: { point: 'back', at: anchorAt } },
      { root: [0, 0], rot: high, foot: [168, A], ...far, ...(o.bench ? { hand: 'hipFront', elbowBend: 1 as const } : { shoulder: 20, elbow: -4 }), anchor: { point: 'back', at: anchorAt } },
    ],
  });
}

const gluteKickback = side({
  mode: 'reps', track: 'ankle', targets: ['glutes'],
  props: [post(176, 40, 176, 194), { k: 'pulley', at: [170, 188] }, { k: 'cable', from: [170, 188], to: 'ankle' }],
  frames: [
    { root: [118, 114], farFoot: [124, A], trunk: 30, hip: -10, knee: 18, footAngle: 30, hand: [172, 92], farHand: [172, 96] },
    { root: [118, 114], farFoot: [124, A], trunk: 30, hip: 42, knee: 10, footAngle: 60, hand: [172, 92], farHand: [172, 96] },
  ],
});

const hipAbduction = (adduct: boolean): FrontTemplate => {
  const open = { e: 90, a: 54 };
  const closed = { e: 90, a: 88 };
  return front({
    facing: 'anterior', mode: 'reps', track: 'R:knee', targets: adduct ? ['adductors'] : ['glute-med', 'glutes'],
    props: [...seat(104, 156, 156), { k: 'roller', at: 'R:knee' }, { k: 'roller', at: 'L:knee' }],
    frames: [
      { root: [130, 150], arm: { e: 20, a: 30 }, fore: { e: 30, a: 60 }, thigh: adduct ? open : closed, shin: { e: 2, a: 0 } },
      { root: [130, 150], arm: { e: 20, a: 30 }, fore: { e: 30, a: 60 }, thigh: adduct ? closed : open, shin: { e: 2, a: 0 } },
    ],
  });
};

const lateralWalk = front({
  facing: 'anterior', mode: 'cycle', targets: ['glute-med', 'glutes'],
  timing: { step: 0.5 },
  props: [{ k: 'band', from: 'L:knee', to: 'R:knee' }],
  frames: [
    { root: [130, 124], thigh: { e: 26, a: 70 }, shin: { e: 8, a: 0 }, arm: { e: 20, a: 60 }, fore: { e: 40, a: 120 } },
    { root: [136, 124], thigh: { e: 34, a: 40 }, shin: { e: 6, a: -10 }, thighL: { e: 26, a: 70 }, shinL: { e: 8, a: 0 }, arm: { e: 20, a: 60 }, fore: { e: 40, a: 120 } },
  ],
});

/* ============================================================ CALVES */

function calfRaise(o: { kind: 'standing' | 'single' | 'donkey' }): SideTemplate {
  const trunk = o.kind === 'donkey' ? 82 : 0;
  const far = o.kind === 'single' ? { farHip: 0, farKnee: 70, farAnkle: 0 } : {};
  const arms: Partial<SidePose> = o.kind === 'donkey' ? { shoulder: -70, elbow: -60 } : { shoulder: 0, elbow: -6 };
  const props: Prop[] = [block(116, 186, 150, 194, 'wood')];
  if (o.kind === 'single') props.push({ k: 'dumbbell', at: 'hand' });
  if (o.kind === 'donkey') props.push(block(170, 116, 196, 122), post(184, 122, 184, 194));
  return side({
    mode: 'reps', track: 'heel', targets: ['calves'], props,
    frames: [
      { root: [0, 0], trunk, ...far, ...arms, footAngle: -14, anchor: { point: 'toe', at: [132, 186] } },
      { root: [0, 0], trunk, ...far, ...arms, footAngle: 32, anchor: { point: 'toe', at: [132, 186] } },
    ],
  });
}

const calfRaiseSeated = side({
  mode: 'reps', track: 'knee', targets: ['calves'],
  props: [...seat(80, 128, 160), block(140, 186, 168, 194, 'wood'), { k: 'roller', at: 'knee' }],
  frames: [
    { root: [104, 150], foot: [158, 186], toe: true, footAngle: -14, shoulder: -40, elbow: -60 },
    { root: [104, 150], foot: [158, 186], toe: true, footAngle: 30, shoulder: -40, elbow: -60 },
  ],
});

const tibialisRaise = side({
  mode: 'reps', track: 'toe', targets: ['tibialis'],
  props: [{ k: 'wall', x: 84 }],
  frames: [
    { root: [0, 0], rot: -12, footAngle: 0, shoulder: 4, elbow: -4, anchor: { point: 'heel', at: [128, 193] } },
    { root: [0, 0], rot: -12, footAngle: -30, shoulder: 4, elbow: -4, anchor: { point: 'heel', at: [128, 193] } },
  ],
});

/* ============================================================ CORE */

const SUPINE: SidePose = { root: [138, 182], rot: -90, foot: [176, A] };

const crunch = side({
  mode: 'reps', track: 'head', targets: ['abs', 'obliques'],
  frames: [{ ...SUPINE, spine: 0, shoulder: -30, elbow: -120 }, { ...SUPINE, spine: 34, neck: 10, shoulder: -30, elbow: -120 }],
});

const sitUp = side({
  mode: 'reps', track: 'head', targets: ['abs', 'hip-flexors', 'obliques'],
  frames: [{ ...SUPINE, trunk: 0, spine: 0, shoulder: -30, elbow: -120 }, { ...SUPINE, trunk: 52, spine: 22, shoulder: -30, elbow: -120 }],
});

const reverseCrunch = side({
  mode: 'reps', track: 'knee', targets: ['abs'],
  frames: [
    { root: [0, 0], rot: -90, hip: -88, knee: 92, shoulder: 18, elbow: -4, anchor: { point: 'back', at: [104, 186] } },
    { root: [0, 0], rot: -112, trunk: 22, hip: -112, knee: 96, shoulder: 18, elbow: -4, anchor: { point: 'back', at: [104, 186] } },
  ],
});

const legRaiseLying = side({
  mode: 'reps', track: 'ankle', targets: ['abs', 'hip-flexors'],
  frames: [
    { root: [146, 182], rot: -90, hip: -4, knee: 2, footAngle: -40, shoulder: 18, elbow: -4 },
    { root: [146, 182], rot: -90, hip: -82, knee: 2, footAngle: -40, shoulder: 18, elbow: -4 },
  ],
});

function hangingRaise(knees: boolean): SideTemplate {
  return side({
    mode: 'reps', track: 'knee', targets: ['abs', 'hip-flexors', 'obliques'], floor: false,
    props: [block(108, 16, 152, 20, 'metal')],
    frames: [
      { root: [0, 0], shoulder: -178, elbow: -2, hip: 0, knee: 4, anchor: { point: 'hand', at: [130, 18] } },
      { root: [0, 0], shoulder: -178, elbow: -2, hip: knees ? -104 : -88, knee: knees ? 110 : 4, anchor: { point: 'hand', at: [130, 18] } },
    ],
  });
}

const cableCrunch = side({
  mode: 'reps', track: 'head', targets: ['abs'],
  props: [{ k: 'pulley', at: [178, 10] }, { k: 'cable', from: [178, 10], to: 'hand' }],
  frames: [
    { root: [0, 0], hip: 0, knee: 90, footAngle: 175, trunk: 20, spine: 8, shoulder: -150, elbow: -120, anchor: { point: 'knee', at: [118, 186] } },
    { root: [0, 0], hip: 0, knee: 90, footAngle: 175, trunk: 52, spine: 42, neck: 12, shoulder: -150, elbow: -120, anchor: { point: 'knee', at: [118, 186] } },
  ],
});

const plank = side({
  mode: 'hold', targets: ['abs', 'deep-core', 'obliques'],
  frames: [{ root: [0, 0], rot: 78, footAngle: 78, shoulder: -82, elbow: -92, anchor: { point: 'toe', at: [40, 193] } }],
});

const abWheel = side({
  mode: 'reps', track: 'hand', targets: ['abs', 'deep-core'],
  frames: [
    { root: [0, 0], rot: 14, hip: 0, knee: 76, footAngle: 175, trunk: 56, hand: [132, 186], elbowBend: -1, anchor: { point: 'knee', at: [96, 186] } },
    { root: [0, 0], rot: 54, hip: 0, knee: 36, footAngle: 175, trunk: 24, hand: [186, 186], elbowBend: -1, anchor: { point: 'knee', at: [96, 186] } },
  ],
  props: [{ k: 'plate', at: 'hand', r: 6 }],
});

const deadBug = side({
  mode: 'reps', track: 'ankle', targets: ['deep-core', 'abs'],
  frames: [
    { root: [138, 182], rot: -90, shoulder: -90, elbow: -4, farShoulder: -90, farElbow: -4, hip: -90, knee: 90, farHip: -90, farKnee: 90 },
    { root: [138, 182], rot: -90, shoulder: -90, elbow: -4, farShoulder: -168, farElbow: -4, hip: -16, knee: 10, farHip: -90, farKnee: 90 },
  ],
});

const birdDog = side({
  mode: 'reps', track: 'hand', targets: ['lower-back', 'glutes', 'deep-core'],
  frames: [
    { root: [104, 148], rot: 72, shoulder: -72, elbow: -4, farShoulder: -72, farElbow: -4, hip: -72, knee: 90, farHip: -72, farKnee: 90, footAngle: 170, farFootAngle: 170 },
    { root: [104, 148], rot: 72, shoulder: -162, elbow: -4, farShoulder: -72, farElbow: -4, hip: -72, knee: 90, farHip: 8, farKnee: 6, footAngle: 170, farFootAngle: 100 },
  ],
});

const mountainClimber = side({
  mode: 'cycle', targets: ['abs', 'hip-flexors', 'cardio-system'], timing: { step: 0.32 },
  frames: [
    { root: [0, 0], rot: 74, shoulder: -74, elbow: 0, hip: -96, knee: 112, farHip: 0, farKnee: 0, footAngle: 80, anchor: { point: 'hand', at: [160, 190] } },
    { root: [0, 0], rot: 74, shoulder: -74, elbow: 0, hip: 0, knee: 0, farHip: -96, farKnee: 112, footAngle: 80, anchor: { point: 'hand', at: [160, 190] } },
  ],
});

const hollowHold = side({
  mode: 'hold', targets: ['abs', 'deep-core'],
  frames: [{ root: [138, 182], rot: -90, spine: 22, shoulder: -170, elbow: -4, hip: -26, knee: 2, footAngle: -60 }],
});

const sidePlank = front({
  facing: 'anterior', mode: 'hold', targets: ['obliques', 'deep-core', 'glute-med'],
  // Body tilted 75° (head right): the lower (right) upper arm points straight down to the
  // floor (e = 75 in the body frame), forearm on the floor toward the viewer; top arm reaches up.
  frames: [{ root: [130, 150], rot: 75, arm: { e: 75, a: 0 }, fore: { e: 90, a: 80 }, armL: { e: 105, a: 0 }, foreL: { e: 105, a: 0 }, thigh: { e: 2, a: 0 }, shin: { e: 2, a: 0 }, thighL: { e: 2, a: 0 }, shinL: { e: 2, a: 0 }, anchor: { point: 'R:elbow', at: [178, 189] } }],
});

const russianTwist = front({
  facing: 'anterior', mode: 'cycle', targets: ['obliques', 'abs'], timing: { step: 0.7 },
  props: [{ k: 'ball', at: 'handsMid', r: 7 }],
  frames: [
    { root: [130, 160], twist: 32, arm: { e: 60, a: 60 }, fore: { e: 70, a: 120 }, thigh: { e: 70, a: 88 }, shin: { e: 30, a: 88 } },
    { root: [130, 160], twist: -32, arm: { e: 60, a: 60 }, fore: { e: 70, a: 120 }, thigh: { e: 70, a: 88 }, shin: { e: 30, a: 88 } },
  ],
});

const pallofPress = front({
  facing: 'anterior', mode: 'reps', track: 'hand', targets: ['obliques', 'deep-core', 'abs'],
  timing: { end: 1.6 },
  props: [{ k: 'pulley', at: [250, 92] }, { k: 'cable', from: [250, 92], to: 'handsMid' }],
  frames: [
    { ...FRONT_STAND, arm: { e: 32, a: 90 }, fore: { e: 100, a: 150 } },
    { ...FRONT_STAND, arm: { e: 82, a: 84 }, fore: { e: 82, a: 96 } },
  ],
});

/* ======================================================= FULL BODY */

const burpee = (() => {
  const stand: SidePose = { root: [118, 113], foot: [122, A], hand: [128, 124], elbowBend: -1 };
  const squatDown: SidePose = { root: [104, 150], foot: [122, A], trunk: 50, hand: [148, 189], elbowBend: -1 };
  const plankUp: SidePose = { root: [96, 158], foot: [52, 184], footAngle: 70, rot: 72, hand: [148, 189], elbowBend: -1 };
  const jump: SidePose = { root: [118, 98], foot: [122, 176], footAngle: 20, hand: [126, 6], elbowBend: -1 };
  return side({ mode: 'cycle', targets: ['quads', 'chest', 'cardio-system', 'glutes'], timing: { step: 0.55 }, frames: [stand, squatDown, plankUp, squatDown, jump] });
})();

const thruster = (() => {
  const top: SidePose = { root: [118, 113], foot: [122, A], trunk: 2 };
  const bot: SidePose = { root: [100, 148], foot: [122, A], trunk: 24 };
  const sh = pt(top, 'shoulder');
  return side({
    mode: 'reps', track: 'hand', targets: ['quads', 'glutes', 'front-delts', 'triceps'],
    props: [{ k: 'dumbbell', at: 'hand' }],
    frames: [
      { ...bot, hand: add(pt(bot, 'rack'), [6, -4]), elbowBend: -1 },
      { ...top, hand: add(pt(top, 'rack'), [6, -4]), elbowBend: -1 },
      { ...top, hand: add(sh, [3, -57]), elbowBend: -1 },
    ],
  });
})();

const boxJump = side({
  mode: 'sequence', targets: ['quads', 'glutes', 'calves'], timing: { move: 1.6 },
  props: [block(150, 150, 214, 194, 'wood')],
  frames: [
    { root: [104, 113], foot: [108, A], shoulder: 0, elbow: -6 },
    { root: [92, 138], foot: [108, A], trunk: 40, shoulder: 50, elbow: -6 },
    { root: [140, 92], foot: [150, 140], footAngle: 30, trunk: 20, shoulder: -120, elbow: -20 },
    { root: [170, 122], foot: [180, 146], trunk: 34, shoulder: -60, elbow: -30 },
    { root: [176, 69], foot: [180, 146], shoulder: 0, elbow: -6 },
  ],
});

const ballSlam = side({
  mode: 'reps', track: 'hand', targets: ['lats', 'abs', 'triceps', 'cardio-system'],
  props: [{ k: 'ball', at: 'hand', r: 8 }],
  frames: [
    { root: [118, 110], foot: [122, A], footAngle: 18, hand: [128, 8], elbowBend: -1 },
    { root: [100, 140], foot: [122, A], trunk: 58, hand: [148, 180], elbowBend: -1 },
  ],
});

const battleRopes = side({
  mode: 'cycle', targets: ['front-delts', 'forearms', 'cardio-system', 'abs'], timing: { step: 0.32 },
  props: [{ k: 'wave', from: 'hand', to: [256, 184], phase: 0 }, { k: 'wave', from: 'farHand', to: [256, 186], phase: 2 }],
  frames: [
    { root: [112, 128], foot: [124, A], trunk: 26, shoulder: -96, elbow: -22, farShoulder: -40, farElbow: -22 },
    { root: [112, 128], foot: [124, A], trunk: 26, shoulder: -40, elbow: -22, farShoulder: -96, farElbow: -22 },
  ],
});

/* ============================================================ CARDIO */

interface GaitOpts { stride: number; lift: number; rootY: number; bob: number; trunk: number; elbow: number; swing: number; cx?: number; steps?: number; flight?: boolean }
function gaitFrames(o: GaitOpts): SidePose[] {
  const n = o.steps ?? 8;
  const cx = o.cx ?? 122;
  const out: SidePose[] = [];
  const foot = (ph: number): Vec => {
    // ph ∈ [0,1): first half = stance (foot slides back on the ground), second half = swing (lifted, forward)
    if (ph < 0.5) return [cx + o.stride * (1 - ph * 4), A];
    const s = (ph - 0.5) * 2;
    return [cx - o.stride + 2 * o.stride * s, A - o.lift * Math.sin(Math.PI * s)];
  };
  for (let i = 0; i < n; i++) {
    const ph = i / n;
    const fp = (ph + 0.5) % 1;
    const bob = o.flight ? -Math.abs(Math.sin(ph * Math.PI * 2)) * o.bob : Math.cos(ph * Math.PI * 4) * o.bob;
    const swing = Math.cos(ph * Math.PI * 2) * o.swing;
    out.push({
      root: [cx - 4, o.rootY + bob], trunk: o.trunk,
      foot: foot(ph), farFoot: foot(fp), footAngle: ph < 0.5 ? 0 : 10, farFootAngle: fp < 0.5 ? 0 : 10,
      shoulder: swing - o.trunk, elbow: o.elbow, farShoulder: -swing - o.trunk, farElbow: o.elbow,
    });
  }
  return out;
}

const walking = (props: Prop[] = [], extra: Partial<GaitOpts> = {}, armLoad?: 'dumbbell'): SideTemplate => side({
  mode: 'cycle', targets: ['cardio-system', 'quads', 'glutes', 'calves', 'hamstrings', 'forearms', 'traps'],
  timing: { step: 0.16 },
  props: [...props, ...(armLoad ? [{ k: armLoad, at: 'hand' } as Prop, { k: armLoad, at: 'farHand' } as Prop] : [])],
  frames: gaitFrames({ stride: 20, lift: 8, rootY: 115, bob: 1.2, trunk: 2, elbow: -12, swing: armLoad ? 2 : 20, ...extra }),
});

const running = side({
  mode: 'cycle', targets: ['cardio-system', 'quads', 'glutes', 'calves', 'hamstrings'], timing: { step: 0.1 },
  frames: gaitFrames({ stride: 30, lift: 26, rootY: 118, bob: 6, trunk: 10, elbow: -96, swing: 40, flight: true }),
});

const highKnees = side({
  mode: 'cycle', targets: ['hip-flexors', 'quads', 'cardio-system'], timing: { step: 0.1 },
  frames: gaitFrames({ stride: 3, lift: 46, rootY: 114, bob: 4, trunk: 2, elbow: -96, swing: 30, flight: true }),
});

function bike(stationary: boolean): SideTemplate {
  const hip: Vec = [110, 126];
  const crank: Vec = [140, 168];
  const r = 14;
  const frames: SidePose[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const p: Vec = [crank[0] + Math.cos(a) * r, crank[1] + Math.sin(a) * r];
    const q: Vec = [crank[0] - Math.cos(a) * r, crank[1] - Math.sin(a) * r];
    frames.push({ root: hip, trunk: 38, foot: [p[0] - 6, p[1] - 3], farFoot: [q[0] - 6, q[1] - 3], footAngle: 10, hand: [172, 106], elbowBend: -1 });
  }
  const frame: Prop[] = stationary
    ? [block(90, 128, 122, 134), post(106, 134, 132, 186), post(132, 186, 140, 168), post(140, 168, 170, 112), block(160, 104, 182, 110, 'metal'), block(80, 186, 200, 194, 'metal')]
    : [block(92, 128, 124, 134), post(108, 134, 140, 168), post(140, 168, 170, 110), post(108, 134, 170, 120), block(162, 104, 182, 110, 'metal'), { k: 'plate', at: [80, 172], r: 22 }, { k: 'plate', at: [196, 172], r: 22 }];
  return side({
    mode: 'cycle', targets: ['cardio-system', 'quads', 'glutes', 'hamstrings', 'calves'], timing: { step: 0.11 },
    props: [...frame, { k: 'crank', center: crank, at: 'ankle' }, { k: 'crank', center: crank, at: 'farAnkle' }],
    frames,
  });
}

const elliptical = (() => {
  const frames: SidePose[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const p: Vec = [126 + Math.cos(a) * 22, 166 + Math.sin(a) * 8];
    const q: Vec = [126 - Math.cos(a) * 22, 166 - Math.sin(a) * 8];
    frames.push({
      root: [118, 98 + Math.sin(a * 2) * 1.5], trunk: 4, foot: p, farFoot: q, footAngle: 0,
      hand: [150 - Math.cos(a) * 14, 90], farHand: [150 + Math.cos(a) * 14, 90], elbowBend: -1,
    });
  }
  return side({
    mode: 'cycle', targets: ['cardio-system', 'quads', 'glutes', 'hamstrings'], timing: { step: 0.14 },
    props: [block(80, 186, 210, 194, 'metal'), post(196, 186, 176, 80), { k: 'lever', pivot: [168, 150], at: 'hand' }],
    frames,
  });
})();

const rowing = side({
  mode: 'cycle', targets: ['cardio-system', 'upper-back', 'lats', 'quads', 'glutes'], timing: { step: 0.42 },
  props: [block(50, 184, 214, 190, 'metal'), block(178, 158, 186, 184, 'metal'), { k: 'plate', at: [212, 160], r: 14 }, { k: 'cable', from: [204, 160], to: 'hand' }],
  frames: [
    { root: [112, 176], trunk: 28, foot: [172, 166], footAngle: -60, hand: [184, 158], elbowBend: 1 },
    { root: [134, 176], trunk: 6, foot: [172, 166], footAngle: -60, hand: [186, 160], elbowBend: 1 },
    { root: [146, 176], trunk: -22, foot: [172, 166], footAngle: -60, hand: [158, 156], elbowBend: 1 },
    { root: [130, 176], trunk: 10, foot: [172, 166], footAngle: -60, hand: [182, 160], elbowBend: 1 },
  ],
});

const stairClimber = side({
  mode: 'cycle', targets: ['cardio-system', 'glutes', 'quads', 'calves'], timing: { step: 0.4 },
  props: [block(126, 170, 190, 178, 'metal'), block(140, 152, 200, 160, 'metal'), post(190, 60, 200, 194), block(176, 84, 196, 90, 'metal')],
  frames: [
    { root: [118, 108], trunk: 10, foot: [152, 148], farFoot: [138, 166], hand: [184, 88], elbowBend: -1 },
    { root: [124, 92], trunk: 8, foot: [152, 148], farFoot: [150, 132], hand: [184, 88], elbowBend: -1 },
  ],
});

const jumpRope = side({
  mode: 'cycle', targets: ['calves', 'cardio-system', 'forearms'], timing: { step: 0.2 },
  props: [{ k: 'rope', from: 'hand', to: 'farHand', center: [120, 110], radius: [26, 86] }],
  frames: [
    { root: [118, 113], foot: [122, A], footAngle: 20, shoulder: -18, elbow: -62 },
    { root: [118, 105], foot: [122, 182], footAngle: 28, shoulder: -18, elbow: -62 },
  ],
});

/* ================================================== WARM-UP & MOBILITY */

const jumpingJacks = front({
  facing: 'anterior', mode: 'cycle', targets: ['cardio-system', 'side-delts', 'glute-med', 'calves'], timing: { step: 0.42 },
  frames: [
    { root: [130, 113], arm: { e: 10, a: 0 }, fore: { e: 10, a: 0 }, thigh: { e: 3, a: 0 }, shin: { e: 2, a: 0 } },
    { root: [130, 106], arm: { e: 168, a: 0 }, fore: { e: 172, a: 0 }, thigh: { e: 16, a: 0 }, shin: { e: 14, a: 0 } },
  ],
});

const armCircles = front({
  facing: 'anterior', mode: 'cycle', targets: ['side-delts', 'front-delts', 'rear-delts'], timing: { step: 0.24 },
  frames: [0, 1, 2, 3].map((i) => {
    const a = (i / 4) * Math.PI * 2;
    const dir = { e: 88 + Math.sin(a) * 10, a: Math.cos(a) * 12 };
    return { ...FRONT_STAND, arm: dir, fore: dir };
  }),
});

const legSwings = side({
  mode: 'reps', track: 'ankle', targets: ['hip-flexors', 'hamstrings', 'glutes'],
  props: [{ k: 'wall', x: 186 }],
  timing: { start: 0.2, end: 0.2, move: 0.8, ret: 0.8 },
  frames: [
    { root: [118, 113], farFoot: [122, A], hip: 28, knee: 4, footAngle: 10, farHand: [184, 96], shoulder: -20 },
    { root: [118, 113], farFoot: [122, A], hip: -72, knee: 4, footAngle: -10, farHand: [184, 96], shoulder: -20 },
  ],
});

const inchworm = side({
  mode: 'reps', track: 'hand', targets: ['hamstrings', 'abs', 'chest'],
  frames: [
    { root: [118, 113], foot: [122, A], hand: [126, 126], elbowBend: -1 },
    { root: [112, 114], foot: [122, A], trunk: 88, spine: 20, hand: [150, 190], elbowBend: -1 },
    { root: [0, 0], rot: 70, footAngle: 75, hand: [196, 190], elbowBend: 1, anchor: { point: 'toe', at: [130, 192] } },
  ],
});

const catCow = side({
  mode: 'cycle', targets: ['lower-back', 'abs', 'upper-back'], timing: { step: 1.3 },
  frames: [
    { root: [104, 148], rot: 72, trunk: -14, spine: 32, neck: 30, hand: [152, 190], hip: -72, knee: 90, footAngle: 170 },
    { root: [104, 148], rot: 72, trunk: 12, spine: -24, neck: -28, hand: [152, 190], hip: -72, knee: 90, footAngle: 170 },
  ],
});

const kneeToWall = side({
  mode: 'reps', track: 'knee', targets: ['calves', 'tibialis'],
  props: [{ k: 'wall', x: 170 }],
  frames: [
    { root: [116, 122], foot: [154, A], farFoot: [86, 192], farToe: true, farFootAngle: 50, hand: [168, 100], elbowBend: -1 },
    { root: [132, 128], foot: [154, A], farFoot: [86, 192], farToe: true, farFootAngle: 50, hand: [168, 100], elbowBend: -1 },
  ],
});

const passThrough = side({
  mode: 'reps', track: 'hand', targets: ['front-delts', 'rotator-cuff', 'chest'],
  frames: [
    { ...STAND, shoulder: -14, elbow: 0 },
    { ...STAND, shoulder: -100, elbow: 0 },
    { ...STAND, shoulder: -180, elbow: 0 },
    { ...STAND, shoulder: -258, elbow: 0 },
  ],
});

const wallSlide = front({
  facing: 'posterior', mode: 'reps', track: 'hand', targets: ['upper-back', 'rotator-cuff', 'traps'],
  frames: [
    { ...FRONT_STAND, arm: { e: 84, a: 0 }, fore: { e: 176, a: 0 } },
    { ...FRONT_STAND, arm: { e: 156, a: 0 }, fore: { e: 164, a: 0 } },
  ],
});

/* ============================================================ STRETCHES */

const STRETCH_TIMING = { start: 0.6, move: 1.6, end: 2.4, ret: 1.4 };

const hamstringStretch = side({
  mode: 'reps', track: 'head', targets: ['hamstrings', 'calves'], timing: STRETCH_TIMING,
  props: [block(142, 170, 196, 194, 'wood')],
  frames: [
    { root: [118, 113], foot: [160, 164], footAngle: -50, farFoot: [118, A], kneeBend: 1, trunk: 2, shoulder: -10, elbow: -10 },
    { root: [112, 116], foot: [160, 164], footAngle: -50, farFoot: [118, A], kneeBend: 1, trunk: 40, spine: 10, shoulder: -40, elbow: -10 },
  ],
});

const quadStretch = side({
  mode: 'hold', targets: ['quads', 'hip-flexors'],
  props: [{ k: 'wall', x: 182 }],
  frames: [{ root: [118, 113], farFoot: [122, A], hip: 6, knee: 150, footAngle: 170, hand: 'ankle', elbowBend: 1, farHand: [180, 96] }],
});

const hipFlexorStretch = side({
  mode: 'reps', track: 'hip', targets: ['hip-flexors', 'quads'], timing: STRETCH_TIMING,
  frames: [
    { root: [106, 144], foot: [152, A], farFoot: [62, 188], farFootAngle: 170, farKneeBend: 1, shoulder: -10, elbow: -60 },
    { root: [118, 150], foot: [152, A], farFoot: [62, 188], farFootAngle: 170, farKneeBend: 1, trunk: -4, shoulder: -10, elbow: -60 },
  ],
});

const calfStretchWall = side({
  mode: 'reps', track: 'hip', targets: ['calves'], timing: STRETCH_TIMING,
  props: [{ k: 'wall', x: 172 }],
  frames: [
    { root: [110, 116], foot: [140, A], farFoot: [74, A], hand: [170, 92], elbowBend: -1 },
    { root: [124, 122], trunk: 8, foot: [140, A], farFoot: [74, A], hand: [170, 92], elbowBend: -1 },
  ],
});

const childsPose = side({
  mode: 'reps', track: 'hip', targets: ['lats', 'lower-back', 'glutes'], timing: STRETCH_TIMING,
  frames: [
    { root: [104, 148], rot: 72, hip: -72, knee: 90, footAngle: 170, hand: [156, 190] },
    { root: [74, 174], rot: 88, trunk: 0, spine: 10, foot: [52, 188], footAngle: 172, kneeBend: -1, hand: [166, 190] },
  ],
});

const kneelingLatStretch = side({
  mode: 'reps', track: 'hip', targets: ['lats'], timing: STRETCH_TIMING,
  props: [block(160, 150, 214, 194, 'wood')],
  frames: [
    { root: [104, 148], rot: 50, hip: -50, knee: 90, footAngle: 170, hand: [166, 148] },
    { root: [84, 166], rot: 80, hip: -80, knee: 110, footAngle: 172, spine: 6, hand: [176, 148] },
  ],
});

const crossBodyStretch = front({
  facing: 'posterior', mode: 'hold', targets: ['rear-delts', 'side-delts'],
  frames: [{ ...FRONT_STAND, arm: { e: 92, a: 152 }, fore: { e: 92, a: 152 }, armL: { e: 30, a: 90 }, foreL: { e: 90, a: 170 } }],
});

const overheadTricepsStretch = front({
  facing: 'posterior', mode: 'hold', targets: ['triceps', 'lats'],
  frames: [{ ...FRONT_STAND, arm: { e: 172, a: 0 }, fore: { e: 20, a: 180 }, armL: { e: 150, a: 150 }, foreL: { e: 150, a: 180 } }],
});

const butterflyStretch = front({
  facing: 'anterior', mode: 'hold', targets: ['adductors'],
  frames: [{ root: [130, 168], arm: { e: 20, a: 80 }, fore: { e: 30, a: 150 }, thigh: { e: 80, a: 26 }, shin: { e: 96, a: 172 } }],
});

/* ================================================================ export */

export const TEMPLATES = {
  /* chest */
  'press-supine-barbell': supinePress({ implement: 'barbell' }),
  'press-supine-dumbbell': supinePress({ implement: 'dumbbell' }),
  'press-incline-barbell': supinePress({ implement: 'barbell', incline: 40 }),
  'press-incline-dumbbell': supinePress({ implement: 'dumbbell', incline: 40 }),
  'press-decline-barbell': supinePress({ implement: 'barbell', incline: -18 }),
  'press-decline-dumbbell': supinePress({ implement: 'dumbbell', incline: -18 }),
  'press-smith': supinePress({ implement: 'barbell', smith: true }),
  'press-floor': supinePress({ implement: 'barbell', floor: true }),
  'press-machine-chest': chestPressMachine,
  'press-svend': svendPress,
  'fly-dumbbell': fly({ kind: 'dumbbell' }),
  'fly-cable-mid': fly({ kind: 'cable-mid' }),
  'fly-cable-high': fly({ kind: 'cable-high' }),
  'fly-cable-low': fly({ kind: 'cable-low' }),
  'fly-machine': fly({ kind: 'machine' }),
  'pushup': pushUp({ hands: 'floor', feet: 'floor' }),
  'pushup-incline': pushUp({ hands: 'box', feet: 'floor' }),
  'pushup-decline': pushUp({ hands: 'floor', feet: 'box' }),
  'dips': dips,
  'pullover': pullover,
  /* back */
  'pullup-wide': pullUpWide,
  'chinup': chinUp,
  'pulldown-wide': pulldownWide,
  'pulldown-close': pulldownSide(),
  'straight-arm-pulldown': straightArmPulldown,
  'row-seated-cable': rowSeatedCable,
  'row-machine': rowMachine,
  'row-barbell': bentRow({ trunk: 62, root: [104, 118], implement: 'barbell' }),
  'row-pendlay': bentRow({ trunk: 84, root: [100, 122], implement: 'barbell', fromFloor: true }),
  'row-dumbbell-bent': bentRow({ trunk: 62, root: [104, 118], implement: 'dumbbell' }),
  'row-tbar': bentRow({ trunk: 52, root: [104, 122], implement: 'tbar' }),
  'row-one-arm': rowOneArm,
  'row-chest-supported': rowChestSupported,
  'row-inverted': rowInverted,
  'deadlift': hinge({ kind: 'deadlift' }),
  'deadlift-trap-bar': hinge({ kind: 'trap' }),
  'deadlift-sumo': hinge({ kind: 'sumo' }),
  'rack-pull': hinge({ kind: 'rack' }),
  'back-extension': backExtension,
  'shrug-barbell': shrug('anterior', 'barbell'),
  'shrug-dumbbell': shrug('posterior', 'dumbbell'),
  /* shoulders */
  'press-overhead': overheadPress({ seated: false, implement: 'barbell' }),
  'push-press': pushPress,
  'press-shoulder-dumbbell': overheadPress({ seated: true, implement: 'dumbbell' }),
  'press-shoulder-machine': overheadPress({ seated: true, implement: 'dumbbell', machine: true }),
  'press-landmine': overheadPress({ seated: false, implement: 'barbell', landmine: true }),
  'raise-lateral': lateralRaise({ implement: 'dumbbell' }),
  'raise-lateral-cable': lateralRaise({ implement: 'cable' }),
  'raise-lateral-machine': lateralRaise({ implement: 'machine' }),
  'raise-front': frontRaise,
  'raise-y': yRaise,
  'reverse-fly-bent': reverseFly({ bent: true }),
  'reverse-fly-machine': reverseFly({ seated: true }),
  'band-pull-apart': reverseFly({ band: true }),
  'face-pull': facePull,
  'upright-row': uprightRow,
  'external-rotation': externalRotation,
  /* arms */
  'curl-dumbbell': curl({ implement: 'dumbbell' }),
  'curl-alternating': curl({ implement: 'dumbbell', alternate: true }),
  'curl-barbell': curl({ implement: 'barbell' }),
  'curl-cable': curl({ implement: 'cable' }),
  'curl-preacher': preacherCurl(false),
  'curl-preacher-machine': preacherCurl(true),
  'curl-incline': inclineCurl,
  'curl-concentration': concentrationCurl,
  'curl-spider': spiderCurl,
  'curl-bayesian': bayesianCurl,
  'curl-drag': dragCurl,
  'wrist-curl': wristCurl,
  'wrist-roller': wristRoller,
  'pushdown': pushdown(),
  'extension-overhead-dumbbell': overheadExtension({ implement: 'dumbbell' }),
  'extension-overhead-ez': overheadExtension({ implement: 'ez' }),
  'extension-overhead-cable': overheadExtension({ implement: 'cable' }),
  'skull-crusher': skullCrusher,
  'kickback-dumbbell': kickback(false),
  'kickback-cable': kickback(true),
  'bench-dip': benchDip,
  /* legs */
  'squat-back': squat({ load: 'back' }),
  'squat-front': squat({ load: 'front' }),
  'squat-goblet': squat({ load: 'goblet' }),
  'squat-smith': squat({ load: 'smith' }),
  'squat-bodyweight': squat({ load: 'bodyweight' }),
  'squat-hold': squat({ load: 'bodyweight', mode: 'hold' }),
  'wall-sit': wallSit,
  'hack-squat': hackSquat,
  'leg-press': legPress,
  'leg-press-calf': legPressCalf,
  'lunge-split': lunge({ kind: 'split' }),
  'lunge-bulgarian': lunge({ kind: 'bulgarian' }),
  'lunge-forward': lunge({ kind: 'forward' }),
  'lunge-reverse': lunge({ kind: 'reverse' }),
  'step-up': stepUp,
  'leg-extension': legExtension,
  'leg-curl-lying': legCurlLying,
  'leg-curl-seated': legCurlSeated,
  'nordic-curl': nordicCurl,
  'sissy-squat': sissySquat,
  'rdl': hinge({ kind: 'rdl' }),
  'stiff-leg-deadlift': hinge({ kind: 'stiff' }),
  'good-morning': hinge({ kind: 'goodmorning' }),
  'hip-adduction': hipAbduction(true),
  /* glutes */
  'hip-thrust': hipThrust({ bench: true }),
  'glute-bridge': hipThrust({ bench: false }),
  'glute-bridge-single': hipThrust({ bench: false, singleLeg: true }),
  'glute-kickback': gluteKickback,
  'hip-abduction': hipAbduction(false),
  'lateral-band-walk': lateralWalk,
  'pull-through': pullThrough,
  /* calves */
  'calf-raise-standing': calfRaise({ kind: 'standing' }),
  'calf-raise-single': calfRaise({ kind: 'single' }),
  'calf-raise-donkey': calfRaise({ kind: 'donkey' }),
  'calf-raise-seated': calfRaiseSeated,
  'tibialis-raise': tibialisRaise,
  /* core */
  'crunch': crunch,
  'sit-up': sitUp,
  'reverse-crunch': reverseCrunch,
  'leg-raise-lying': legRaiseLying,
  'leg-raise-hanging': hangingRaise(false),
  'knee-raise-hanging': hangingRaise(true),
  'cable-crunch': cableCrunch,
  'plank': plank,
  'side-plank': sidePlank,
  'ab-wheel': abWheel,
  'dead-bug': deadBug,
  'bird-dog': birdDog,
  'mountain-climber': mountainClimber,
  'hollow-hold': hollowHold,
  'russian-twist': russianTwist,
  'pallof-press': pallofPress,
  /* full body */
  'kettlebell-swing': kbSwing,
  'burpee': burpee,
  'thruster': thruster,
  'box-jump': boxJump,
  'ball-slam': ballSlam,
  'battle-ropes': battleRopes,
  /* cardio */
  'walk': walking(),
  'walk-treadmill': walking([block(60, 184, 200, 192, 'metal'), post(186, 184, 196, 92), block(184, 88, 206, 94, 'metal')]),
  'carry-farmers': walking([], { stride: 16, lift: 6 }, 'dumbbell'),
  'run': running,
  'high-knees': highKnees,
  'bike': bike(false),
  'bike-stationary': bike(true),
  'elliptical': elliptical,
  'rowing-machine': rowing,
  'stair-climber': stairClimber,
  'jump-rope': jumpRope,
  /* warm-up, mobility, stretching */
  'jumping-jacks': jumpingJacks,
  'arm-circles': armCircles,
  'leg-swings': legSwings,
  'inchworm': inchworm,
  'cat-cow': catCow,
  'knee-to-wall': kneeToWall,
  'pass-through': passThrough,
  'wall-slide': wallSlide,
  'stretch-hamstring': hamstringStretch,
  'stretch-quad': quadStretch,
  'stretch-hip-flexor': hipFlexorStretch,
  'stretch-calf-wall': calfStretchWall,
  'childs-pose': childsPose,
  'stretch-lat-kneeling': kneelingLatStretch,
  'stretch-cross-body': crossBodyStretch,
  'stretch-overhead-triceps': overheadTricepsStretch,
  'stretch-butterfly': butterflyStretch,
} satisfies Record<string, Template>;

export type TemplateId = keyof typeof TEMPLATES;

