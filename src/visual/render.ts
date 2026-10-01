/**
 * SVG markup for figures, props, direction arrows and body maps (build time).
 * The browser player only updates segment transforms and dynamic props.
 */
import { toSvg } from './geometry';
import { FRONT_SHAPES, SIDE_SHAPES, type Facing, type Shape } from './shapes';
import { FRONT_DRAW_ORDER, SIDE_DRAW_ORDER, solveFront, type Frame } from './rig';
import { isDynamic, propMarkup } from './props';
import { duration, sample, solve, trackPath, type Template } from './timeline';

export const VIEWBOX = '0 0 260 200';
export const FLOOR_Y = 194;

/**
 * Inline-styled variant for <symbol> sprites: document CSS does not reach
 * <use> clones, but inline var() fills inherit the custom properties of the
 * <svg> that references the symbol.
 */
function shapeMarkupInline(s: Shape): string {
  switch (s.kind) {
    case 'base': return `<path style="fill:var(--fig-base);stroke:var(--fig-line);stroke-width:.6" d="${s.d}"/>`;
    case 'muscle': return `<path style="fill:var(--m-${s.muscle},var(--mus-neutral));stroke:rgb(0 0 0/.4);stroke-width:.35" d="${s.d}"/>`;
    case 'overlay': return `<path style="fill:var(--m-${s.muscle},transparent)" d="${s.d}"/>`;
    case 'line': return `<path style="fill:none;stroke:rgb(0 0 0/.38);stroke-width:.5" d="${s.d}"/>`;
    case 'detail': return `<path style="fill:var(--fig-line)" d="${s.d}"/>`;
  }
}

function shapeMarkup(s: Shape): string {
  switch (s.kind) {
    case 'base': return `<path class="b" d="${s.d}"/>`;
    case 'muscle': return `<path class="m m-${s.muscle}" d="${s.d}"/>`;
    case 'overlay': return `<path class="mo m-${s.muscle}" d="${s.d}"/>`;
    case 'line': return `<path class="ln" d="${s.d}"/>`;
    case 'detail': return `<path class="dt" d="${s.d}"/>`;
  }
}

const segKey = (id: string) => id.replace(/^(far:|R:|L:)/, '');

/** The articulated figure at a frame. `live` adds data-seg hooks for the player. */
export function figureMarkup(rig: 'side' | 'front', facing: Facing, frame: Frame, live: boolean, inline = false): string {
  const order = rig === 'side' ? SIDE_DRAW_ORDER : FRONT_DRAW_ORDER;
  const lib = rig === 'side' ? SIDE_SHAPES : FRONT_SHAPES[facing];
  const draw = inline ? shapeMarkupInline : shapeMarkup;
  return order
    .map((id) => {
      const shapes = lib[segKey(id)] ?? [];
      const cls = id.startsWith('far:') ? ' class="far"' : '';
      const hook = live ? ` data-seg="${id}"` : '';
      return `<g${hook}${cls} transform="${toSvg(frame.segs[id])}">${shapes.map(draw).join('')}</g>`;
    })
    .join('');
}

/**
 * "X-ray" layer: the PRIMARY torso muscles redrawn above the limbs at partial
 * opacity, so the green target stays visible when an arm crosses the body.
 */
export function xrayMarkup(rig: 'side' | 'front', facing: Facing, frame: Frame, live: boolean): string {
  const ids = rig === 'side' ? ['lowerTorso', 'upperTorso'] : ['torso'];
  const lib = rig === 'side' ? SIDE_SHAPES : FRONT_SHAPES[facing];
  return ids
    .map((id) => {
      const shapes = (lib[id] ?? []).filter((s) => s.muscle);
      const hook = live ? ` data-xseg="${id}"` : '';
      return `<g${hook} transform="${toSvg(frame.segs[id])}">${shapes.map((s) => `<path class="xr m-${s.muscle}" d="${s.d}"/>`).join('')}</g>`;
    })
    .join('');
}

function arrowMarkup(points: [number, number][]): string {
  if (points.length < 2) return '';
  const len = points.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - points[i][0], p[1] - points[i][1]), 0);
  if (len < 12) return '';
  const d = `M${points.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('L')}`;
  const rev = `M${points.slice().reverse().map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('L')}`;
  return `<path class="dir dir-go" d="${d}" marker-end="url(#arrowhead)"/><path class="dir dir-back" d="${rev}" marker-end="url(#arrowhead)"/>`;
}

/** Complete inner markup of an exercise animation (first frame = start position). */
export function visualMarkup(t: Template): string {
  const facing: Facing = t.rig === 'front' ? t.facing : 'anterior';
  const first = sample(t, 0);
  const frame = solve(t, first.pose);
  const props = t.props ?? [];
  const staticProps = props.filter((p) => !isDynamic(p)).map((p) => propMarkup(p, frame)).join('');
  const dynamicProps = props.filter(isDynamic).map((p) => propMarkup(p, frame)).join('');
  const endFrame = t.mode === 'reps' || t.mode === 'sequence' ? solve(t, t.frames[t.frames.length - 1]) : null;
  const ghost = endFrame ? `<g class="ghost" aria-hidden="true">${figureMarkup(t.rig, facing, endFrame, false)}</g>` : '';
  const floor = t.floor === false ? '' : `<line class="floor" x1="-300" y1="${FLOOR_Y}" x2="560" y2="${FLOOR_Y}"/>`;
  return [
    '<defs><marker id="arrowhead" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="dir-head"/></marker></defs>',
    floor,
    `<g class="props-static">${staticProps}</g>`,
    ghost,
    `<g class="dirs">${arrowMarkup(trackPath(t))}</g>`,
    `<g class="live" data-live>${figureMarkup(t.rig, facing, frame, true)}</g>`,
    `<g class="props-dyn" data-props>${dynamicProps}</g>`,
    `<g class="xray" aria-hidden="true">${xrayMarkup(t.rig, facing, frame, true)}</g>`,
  ].join('');
}

/** A still of one keyframe with its equipment (QC sheet, static fallbacks). */
export function stillMarkup(t: Template, index: number): string {
  const facing: Facing = t.rig === 'front' ? t.facing : 'anterior';
  const frame = solve(t, t.frames[Math.min(index, t.frames.length - 1)]);
  const props = t.props ?? [];
  const floor = t.floor === false ? '' : `<line class="floor" x1="-300" y1="${FLOOR_Y}" x2="560" y2="${FLOOR_Y}"/>`;
  return [
    floor,
    props.filter((p) => !isDynamic(p)).map((p) => propMarkup(p, frame)).join(''),
    figureMarkup(t.rig, facing, frame, false),
    props.filter(isDynamic).map((p) => propMarkup(p, frame)).join(''),
    `<g class="xray" aria-hidden="true">${xrayMarkup(t.rig, facing, frame, false)}</g>`,
  ].join('');
}

/* ---------------------------------------------------------------- body map */

export const BODYMAP_VIEWBOX = '-46 -88 92 180';

/** Static anatomical figure (front or back) used as the muscle map & fallback. */
export function bodyMapMarkup(facing: Facing): string {
  const frame = solveFront({
    root: [0, 0],
    arm: { e: 14, a: 0 },
    fore: { e: 10, a: 0 },
    thigh: { e: 4, a: 0 },
    shin: { e: 2, a: 0 },
  });
  return figureMarkup('front', facing, frame, false, true);
}

/* ------------------------------------------------------------- framing */

/**
 * A view box cropped to the whole movement (every sampled frame + equipment),
 * so the figure fills the stage on small screens. Aspect 13:10.
 */
export function viewBoxFor(t: Template): string {
  const xs: number[] = [];
  const ys: number[] = [];
  const add = (p: [number, number] | undefined, r = 0) => {
    if (!p) return;
    xs.push(p[0] - r, p[0] + r);
    ys.push(p[1] - r, p[1] + r);
  };
  const total = duration(t);
  for (let i = 0; i <= 24; i++) {
    const frame = solve(t, sample(t, (total * i) / 24).pose);
    for (const [k, p] of Object.entries(frame.pts)) add(p, k === 'head' ? 11 : k.includes('hand') ? 6 : 4);
    for (const p of t.props ?? []) {
      if ('at' in p && typeof p.at === 'string' && (p.k === 'barbell' || p.k === 'plate' || p.k === 'ball')) add(frame.pts[p.at], p.r ?? 11);
    }
  }
  for (const p of t.props ?? []) {
    if (p.k === 'block') p.pts.forEach((q) => add(q));
    if (p.k === 'post') { add(p.from); add(p.to); }
    if (p.k === 'pulley') add(p.at, 5);
    if (p.k === 'lever' || p.k === 'crank') add('pivot' in p ? p.pivot : p.center, 5);
    if (p.k === 'cable' && Array.isArray(p.from)) add(p.from as [number, number]);
  }
  let x0 = Math.min(...xs);
  let x1 = Math.max(...xs);
  let y0 = Math.min(...ys);
  let y1 = Math.max(...ys);
  if (t.floor !== false) y1 = Math.max(y1, FLOOR_Y + 2);
  const pad = 10;
  x0 -= pad; x1 += pad; y0 -= pad; y1 += pad;
  let w = x1 - x0;
  let h = y1 - y0;
  const ratio = 1.3;
  if (w / h < ratio) { const nw = h * ratio; x0 -= (nw - w) / 2; w = nw; } else { const nh = w / ratio; y0 -= (nh - h) / 2; h = nh; }
  return [x0, y0, w, h].map((n) => Math.round(n * 10) / 10).join(' ');
}
