import { describe, expect, it } from 'vitest';
import { exercises } from '../src/data/exercises';
import { MUSCLES, type Muscle } from '../src/data/taxonomy';
import { ALL_MUSCLES, mappable, muscleVars } from '../src/visual/anatomy';
import { checkVisual, drawableMuscles, VISUAL_ASSIGNMENTS, visualFor } from '../src/visual/assign';
import { TEMPLATES } from '../src/visual/library';
import { propMarkup } from '../src/visual/props';
import { stillMarkup, visualMarkup, viewBoxFor } from '../src/visual/render';
import { ANTERIOR_MUSCLES, POSTERIOR_MUSCLES } from '../src/visual/shapes';
import { duration, sample, solve, trackPath, type Template } from '../src/visual/timeline';

const templates = Object.entries(TEMPLATES) as [string, Template][];
const bySlug = new Map(exercises.map((e) => [e.slug, e]));

const finite = (v: unknown): boolean => JSON.stringify(v) !== undefined && !/null|NaN|Infinity/.test(JSON.stringify(v));

describe('muscle mapping (GREEN = target muscle)', () => {
  it('every taxonomy muscle has a region on the anatomical body map', () => {
    for (const m of Object.keys(MUSCLES) as Muscle[]) {
      expect(ANTERIOR_MUSCLES.has(m) || POSTERIOR_MUSCLES.has(m), m).toBe(true);
    }
    expect(mappable(ALL_MUSCLES)).toBe(true);
  });

  it('every exercise primary muscle can be highlighted', () => {
    for (const e of exercises) expect(mappable(e.primaryMuscles), e.slug).toBe(true);
  });

  it('primary muscles are green and secondary muscles grey, primary wins on overlap', () => {
    const css = muscleVars(['chest'], ['triceps', 'chest']);
    expect(css).toContain('--m-chest:var(--mus-primary)');
    expect(css).toContain('--m-triceps:var(--mus-secondary)');
    expect(css).not.toContain('--m-chest:var(--mus-secondary)');
  });
});

describe('movement templates', () => {
  for (const [id, t] of templates) {
    it(`${id} solves to finite geometry and renders`, () => {
      expect(t.frames.length).toBeGreaterThan(0);
      expect(t.targets.length).toBeGreaterThan(0);
      const total = duration(t);
      for (let i = 0; i <= 40; i++) {
        const s = sample(t, (total * i) / 40);
        const frame = solve(t, s.pose);
        expect(finite(frame.pts), `${id} pts @${i}`).toBe(true);
        expect(finite(frame.segs), `${id} segs @${i}`).toBe(true);
        for (const p of t.props ?? []) {
          for (const v of Object.values(p)) {
            if (typeof v === 'string' && v !== p.k && !['pad', 'metal', 'wood'].includes(v)) {
              expect(frame.pts[v], `${id} prop ${p.k} references unknown point "${v}"`).toBeDefined();
            }
          }
          const out = propMarkup(p, frame, i / 40);
          expect(out, `${id} prop ${p.k}`).not.toMatch(/NaN|undefined/);
        }
      }
      if (t.track && t.mode !== 'hold' && t.mode !== 'cycle') {
        expect(trackPath(t).length, `${id} track point "${t.track}"`).toBeGreaterThan(2);
      }
      expect(visualMarkup(t)).not.toMatch(/NaN|undefined/);
      t.frames.forEach((_, i) => expect(stillMarkup(t, i)).not.toMatch(/NaN|undefined/));
      expect(viewBoxFor(t)).toMatch(/^-?[\d.]+ -?[\d.]+ [\d.]+ [\d.]+$/);
    });
  }

  it('each template shows at least one of its targets in its own view', () => {
    for (const [id, t] of templates) {
      const drawable = drawableMuscles(t);
      expect(t.targets.some((m) => drawable.has(m)), id).toBe(true);
    }
  });
});

describe('exercise ↔ template assignment (quality gate)', () => {
  it('every assignment points to a real exercise and passes QC', () => {
    for (const [slug, id] of Object.entries(VISUAL_ASSIGNMENTS)) {
      const e = bySlug.get(slug);
      expect(e, `unknown exercise ${slug}`).toBeDefined();
      const check = checkVisual(e!, id);
      expect(check.ok, `${slug} → ${id}: ${check.reason}`).toBe(true);
    }
  });

  it('assigned primary muscles intersect the template targets', () => {
    for (const [slug, id] of Object.entries(VISUAL_ASSIGNMENTS)) {
      const t = TEMPLATES[id!] as Template;
      expect(bySlug.get(slug)!.primaryMuscles.some((m) => t.targets.includes(m)), slug).toBe(true);
    }
  });

  it('unassigned exercises fall back to the static illustration', () => {
    const unassigned = exercises.filter((e) => !VISUAL_ASSIGNMENTS[e.slug]);
    expect(unassigned.length).toBeGreaterThan(0);
    for (const e of unassigned) expect(visualFor(e), e.slug).toBeNull();
  });

  it('a mismatched template is rejected instead of highlighting the wrong muscle', () => {
    const curl = bySlug.get('dumbbell-curl')!;
    expect(checkVisual(curl, 'squat-back').ok).toBe(false);
  });
});
