/**
 * Equipment drawn around the figure. Static props (benches, pads, bars) are
 * drawn once; dynamic props follow named points of the solved frame (the
 * grip, the ankle…) and are redrawn every animation frame.
 */
import type { Frame } from './rig';
import type { Vec } from './geometry';

type P = string; // a named frame point, e.g. 'hand', 'farHand', 'R:hand', 'ankle'
type Pt = Vec | P;

export type Prop =
  /* static */
  | { k: 'block'; pts: Vec[]; tone?: 'pad' | 'metal' | 'wood' } // bench, seat, pad, box, platform
  | { k: 'post'; from: Vec; to: Vec } // rails, frames, uprights
  | { k: 'wall'; x: number }
  | { k: 'pulley'; at: Vec }
  /* dynamic (attached to frame points) */
  | { k: 'barbell'; at: Pt; r?: number }
  | { k: 'dumbbell'; at: Pt }
  | { k: 'kettlebell'; at: Pt }
  | { k: 'plate'; at: Pt; r?: number }
  | { k: 'ball'; at: Pt; r?: number }
  | { k: 'bar'; from: Pt; to: Pt } // handle / bar between two points (front views)
  | { k: 'cable'; from: Pt; to: Pt }
  | { k: 'band'; from: Pt; to: Pt }
  | { k: 'lever'; pivot: Vec; at: Pt; pad?: boolean } // machine arm ending at a point
  | { k: 'roller'; at: Pt } // leg-machine roller pad
  | { k: 'sled'; at: Pt; angle: number; len?: number } // a plate/platform centred on a point (leg press sled)
  | { k: 'crank'; center: Vec; at: Pt } // bike crank to the pedal
  | { k: 'wave'; from: Pt; to: Vec; phase: number } // battle rope
  | { k: 'rope'; from: Pt; to: Pt; center: Vec; radius: [number, number] }; // jump rope swinging around the body

const r1 = (n: number) => Math.round(n * 10) / 10;
const pt = (frame: Frame, p: Pt): Vec => (typeof p === 'string' ? frame.pts[p] ?? [0, 0] : p);

const TONES = { pad: 'prop-pad', metal: 'prop-metal', wood: 'prop-wood' } as const;

export function isDynamic(p: Prop): boolean {
  return !['block', 'post', 'wall', 'pulley'].includes(p.k);
}

/** SVG markup for one prop at the given frame; `t` (seconds) drives rope motion. */
export function propMarkup(p: Prop, frame: Frame, t = 0): string {
  switch (p.k) {
    case 'block':
      return `<path class="${TONES[p.tone ?? 'pad']}" d="M${p.pts.map((q) => `${r1(q[0])} ${r1(q[1])}`).join('L')}Z"/>`;
    case 'post':
      return `<line class="prop-frame" x1="${p.from[0]}" y1="${p.from[1]}" x2="${p.to[0]}" y2="${p.to[1]}"/>`;
    case 'wall':
      return `<rect class="prop-wall" x="${p.x}" y="0" width="8" height="194"/>`;
    case 'pulley':
      return `<circle class="prop-metal" cx="${p.at[0]}" cy="${p.at[1]}" r="4.5"/><circle class="prop-hole" cx="${p.at[0]}" cy="${p.at[1]}" r="1.4"/>`;
    case 'barbell': {
      const [x, y] = pt(frame, p.at);
      const r = p.r ?? 11;
      return `<circle class="prop-plate" cx="${r1(x)}" cy="${r1(y)}" r="${r}"/><circle class="prop-plate-in" cx="${r1(x)}" cy="${r1(y)}" r="${r * 0.55}"/><circle class="prop-metal" cx="${r1(x)}" cy="${r1(y)}" r="2"/>`;
    }
    case 'plate': {
      const [x, y] = pt(frame, p.at);
      const r = p.r ?? 8;
      return `<circle class="prop-plate" cx="${r1(x)}" cy="${r1(y)}" r="${r}"/><circle class="prop-hole" cx="${r1(x)}" cy="${r1(y)}" r="1.6"/>`;
    }
    case 'dumbbell': {
      const [x, y] = pt(frame, p.at);
      return `<rect class="prop-metal" x="${r1(x - 5.5)}" y="${r1(y - 1.4)}" width="11" height="2.8" rx="1"/><rect class="prop-plate" x="${r1(x - 7.5)}" y="${r1(y - 4.5)}" width="4" height="9" rx="1.4"/><rect class="prop-plate" x="${r1(x + 3.5)}" y="${r1(y - 4.5)}" width="4" height="9" rx="1.4"/>`;
    }
    case 'kettlebell': {
      const [x, y] = pt(frame, p.at);
      return `<path class="prop-plate" d="M${r1(x - 3)} ${r1(y)}a3 3 0 0 1 6 0M${r1(x - 6.5)} ${r1(y + 8)}a6.5 6.5 0 1 0 13 0a6.5 6.5 0 1 0 -13 0Z"/><path class="prop-handle" d="M${r1(x - 3.5)} ${r1(y + 3)}Q${r1(x)} ${r1(y - 4)} ${r1(x + 3.5)} ${r1(y + 3)}"/>`;
    }
    case 'ball': {
      const [x, y] = pt(frame, p.at);
      const r = p.r ?? 8;
      return `<circle class="prop-ball" cx="${r1(x)}" cy="${r1(y)}" r="${r}"/><path class="prop-seam" d="M${r1(x - r)} ${r1(y)}Q${r1(x)} ${r1(y + r * 0.6)} ${r1(x + r)} ${r1(y)}"/>`;
    }
    case 'bar': {
      const a = pt(frame, p.from);
      const b = pt(frame, p.to);
      return `<line class="prop-bar" x1="${r1(a[0])}" y1="${r1(a[1])}" x2="${r1(b[0])}" y2="${r1(b[1])}"/>`;
    }
    case 'cable': {
      const a = pt(frame, p.from);
      const b = pt(frame, p.to);
      return `<line class="prop-cable" x1="${r1(a[0])}" y1="${r1(a[1])}" x2="${r1(b[0])}" y2="${r1(b[1])}"/>`;
    }
    case 'band': {
      const a = pt(frame, p.from);
      const b = pt(frame, p.to);
      return `<line class="prop-band" x1="${r1(a[0])}" y1="${r1(a[1])}" x2="${r1(b[0])}" y2="${r1(b[1])}"/>`;
    }
    case 'lever': {
      const b = pt(frame, p.at);
      return `<line class="prop-lever" x1="${p.pivot[0]}" y1="${p.pivot[1]}" x2="${r1(b[0])}" y2="${r1(b[1])}"/><circle class="prop-metal" cx="${p.pivot[0]}" cy="${p.pivot[1]}" r="3.4"/>${p.pad ? `<circle class="prop-pad" cx="${r1(b[0])}" cy="${r1(b[1])}" r="4"/>` : ''}`;
    }
    case 'roller': {
      const [x, y] = pt(frame, p.at);
      return `<circle class="prop-pad" cx="${r1(x)}" cy="${r1(y)}" r="5"/>`;
    }
    case 'sled': {
      const [x, y] = pt(frame, p.at);
      const len = p.len ?? 26;
      return `<rect class="prop-metal" x="${r1(x - 2.5)}" y="${r1(y - len / 2)}" width="5" height="${len}" rx="1.5" transform="rotate(${p.angle} ${r1(x)} ${r1(y)})"/>`;
    }
    case 'crank': {
      const b = pt(frame, p.at);
      return `<line class="prop-lever" x1="${p.center[0]}" y1="${p.center[1]}" x2="${r1(b[0])}" y2="${r1(b[1])}"/><circle class="prop-metal" cx="${p.center[0]}" cy="${p.center[1]}" r="5"/>`;
    }
    case 'wave': {
      const a = pt(frame, p.from);
      const n = 5;
      let d = `M${r1(a[0])} ${r1(a[1])}`;
      for (let i = 1; i <= n * 4; i++) {
        const u = i / (n * 4);
        const x = a[0] + (p.to[0] - a[0]) * u;
        const yBase = a[1] + (p.to[1] - a[1]) * u;
        const amp = 7 * (1 - u) + 1.5;
        d += `L${r1(x)} ${r1(yBase + Math.sin(u * n * Math.PI * 2 - p.phase - t * 9) * amp)}`;
      }
      return `<path class="prop-rope" d="${d}"/>`;
    }
    case 'rope': {
      const a = pt(frame, p.from);
      const b = pt(frame, p.to);
      // The rope's far point circles the body (side view: an ellipse in the sagittal plane).
      const ang = t * Math.PI * 2 * 1.6;
      const via: Vec = [p.center[0] + Math.sin(ang) * p.radius[0], p.center[1] + Math.cos(ang) * p.radius[1]];
      return `<path class="prop-rope" d="M${r1(a[0])} ${r1(a[1])}Q${r1(via[0])} ${r1(via[1])} ${r1(b[0])} ${r1(b[1])}"/>`;
    }
  }
}
