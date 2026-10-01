/**
 * Exercise animation player: drives the server-rendered SVG figure.
 * Play / pause, replay, 0.5× slow motion; phase strip kept in sync;
 * respects prefers-reduced-motion and pauses while off-screen.
 */
import { duration, sample, solve, type Template } from '../visual/timeline';
import { isDynamic, propMarkup } from '../visual/props';
import { toSvg } from '../visual/geometry';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

for (const root of document.querySelectorAll<HTMLElement>('[data-visual]')) {
  const json = root.querySelector('script[data-template]')?.textContent;
  let t: Template | undefined;
  try {
    t = json ? (JSON.parse(json) as Template) : undefined;
  } catch {
    t = undefined; // the static SVG keeps showing the start pose
  }
  const svg = root.querySelector<SVGSVGElement>('svg.fig[data-anim]');
  if (!t || !svg) continue;

  const segs = new Map<string, SVGGElement>();
  for (const g of svg.querySelectorAll<SVGGElement>('[data-seg]')) segs.set(g.dataset.seg!, g);
  const xsegs = new Map<string, SVGGElement>();
  for (const g of svg.querySelectorAll<SVGGElement>('[data-xseg]')) xsegs.set(g.dataset.xseg!, g);
  const live = svg.querySelector<SVGGElement>('[data-live]');
  const propsG = svg.querySelector<SVGGElement>('[data-props]');
  const dynProps = (t.props ?? []).filter(isDynamic);
  const phases = [...root.querySelectorAll<HTMLElement>('[data-phase]')];
  const playBtn = root.querySelector<HTMLButtonElement>('[data-play]');
  const replayBtn = root.querySelector<HTMLButtonElement>('[data-replay]');
  const slowBtn = root.querySelector<HTMLButtonElement>('[data-slow]');

  let time = 0;
  let speed = 1;
  let playing = !reduceMotion && t.mode !== 'hold';
  let visible = true;
  let last = 0;
  let lastPhase = -1;

  if (t.mode === 'hold') svg.classList.add('is-hold');
  if (t.mode === 'cycle') svg.classList.add('is-cycle');

  const draw = () => {
    const s = sample(t, time);
    const frame = solve(t, s.pose);
    for (const [k, g] of segs) {
      const m = frame.segs[k];
      if (m) g.setAttribute('transform', toSvg(m));
    }
    for (const [k, g] of xsegs) {
      const m = frame.segs[k];
      if (m) g.setAttribute('transform', toSvg(m));
    }
    if (propsG) propsG.innerHTML = dynProps.map((p) => propMarkup(p, frame, time)).join('');
    if (live) live.style.opacity = String(s.alpha);
    if (propsG) propsG.style.opacity = String(s.alpha);
    if (s.phase !== lastPhase) {
      lastPhase = s.phase;
      svg.classList.toggle('is-return', s.phase === 3);
      const active = t.mode === 'cycle' ? -1 : s.phase;
      phases.forEach((el, i) => el.classList.toggle('is-active', i === active));
    }
  };

  let raf = 0;
  const tick = (now: number) => {
    if (!playing || !visible) {
      raf = 0;
      return;
    }
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
    last = now;
    time = (time + dt * speed) % duration(t);
    draw();
    raf = requestAnimationFrame(tick);
  };
  /** Start the loop once (never stacks a second loop). */
  const start = () => {
    if (raf) return;
    last = 0;
    raf = requestAnimationFrame(tick);
  };

  const syncButtons = () => {
    if (playBtn) {
      playBtn.setAttribute('aria-pressed', String(playing));
      playBtn.querySelector<HTMLElement>('[data-label-play]')!.hidden = playing;
      playBtn.querySelector<HTMLElement>('[data-label-pause]')!.hidden = !playing;
    }
    slowBtn?.setAttribute('aria-pressed', String(speed !== 1));
  };

  playBtn?.addEventListener('click', () => {
    playing = !playing;
    syncButtons();
    if (playing) start();
  });
  replayBtn?.addEventListener('click', () => {
    time = 0;
    playing = true;
    syncButtons();
    draw();
    start();
  });
  slowBtn?.addEventListener('click', () => {
    speed = speed === 1 ? 0.5 : 1;
    syncButtons();
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      for (const e of entries) {
        const was = visible;
        visible = e.isIntersecting;
        if (visible && !was && playing) start();
      }
    }, { threshold: 0.15 }).observe(svg);
  }

  root.classList.add('is-ready');
  syncButtons();
  draw();
  if (playing) start();
}
