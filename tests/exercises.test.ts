import { describe, expect, it } from 'vitest';
import { exercises, getExercise } from '../src/data/exercises';
import {
  CATEGORIES, DIFFICULTY, EQUIPMENT, ERAS, EXERCISE_TYPES, GOALS, MUSCLES, PATTERNS,
} from '../src/data/taxonomy';
import { LANGS } from '../src/i18n/types';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ARABIC = /\p{Script=Arabic}/u;
const RESISTANCE = new Set(['compound', 'isolation', 'isometric', 'plyometric']);

describe('exercise database integrity', () => {
  it('has exercises', () => {
    expect(exercises.length).toBeGreaterThan(0);
  });

  it('has unique, URL-safe slugs', () => {
    const seen = new Set<string>();
    for (const e of exercises) {
      expect(e.slug, e.slug).toMatch(SLUG);
      expect(seen.has(e.slug), `duplicate slug ${e.slug}`).toBe(false);
      seen.add(e.slug);
    }
  });

  it('has unique canonical names (aliases must not duplicate another exercise name)', () => {
    const names = new Map<string, string>();
    for (const e of exercises) {
      const key = e.name.toLowerCase();
      expect(names.has(key), `duplicate name ${e.name}`).toBe(false);
      names.set(key, e.slug);
    }
    for (const e of exercises) {
      for (const a of e.aliases) {
        const owner = names.get(a.toLowerCase());
        expect(owner === undefined || owner === e.slug, `${e.slug}: alias "${a}" is the name of ${owner}`).toBe(true);
      }
    }
  });

  it('uses only known taxonomy values', () => {
    for (const e of exercises) {
      expect(CATEGORIES, e.slug).toHaveProperty([e.category]);
      expect(DIFFICULTY, e.slug).toHaveProperty([e.difficulty]);
      expect(EXERCISE_TYPES, e.slug).toHaveProperty([e.exerciseType]);
      if (e.movementPattern) expect(PATTERNS, e.slug).toHaveProperty([e.movementPattern]);
      if (e.era) expect(ERAS, e.slug).toHaveProperty([e.era]);
      for (const m of [...e.primaryMuscles, ...e.secondaryMuscles]) expect(MUSCLES, `${e.slug}: ${m}`).toHaveProperty([m]);
      for (const q of e.equipment) expect(EQUIPMENT, `${e.slug}: ${q}`).toHaveProperty([q]);
      for (const g of e.goals ?? []) expect(GOALS, `${e.slug}: ${g}`).toHaveProperty([g]);
    }
  });

  it('has primary muscles and equipment, and no muscle listed twice', () => {
    for (const e of exercises) {
      expect(e.primaryMuscles.length, e.slug).toBeGreaterThan(0);
      expect(e.equipment.length, e.slug).toBeGreaterThan(0);
      const overlap = e.primaryMuscles.filter((m) => e.secondaryMuscles.includes(m));
      expect(overlap, e.slug).toEqual([]);
    }
  });

  it('resistance exercises declare an era', () => {
    for (const e of exercises) {
      if (RESISTANCE.has(e.exerciseType)) expect(e.era, `${e.slug} needs era`).toBeDefined();
    }
  });

  it('alternatives point to existing, different exercises', () => {
    for (const e of exercises) {
      for (const alt of e.alternatives) {
        expect(alt, e.slug).not.toBe(e.slug);
        expect(getExercise(alt), `${e.slug} → missing alternative "${alt}"`).toBeDefined();
      }
    }
  });

  it('has complete bilingual coaching content', () => {
    for (const e of exercises) {
      expect(e.arabicName, e.slug).toMatch(ARABIC);
      for (const lang of LANGS) {
        const c = e.content[lang];
        const where = `${e.slug} [${lang}]`;
        expect(c, where).toBeDefined();
        expect(c.setup.length, `${where} setup`).toBeGreaterThanOrEqual(1);
        expect(c.steps.length, `${where} steps`).toBeGreaterThanOrEqual(3);
        expect(c.steps.length, `${where} steps`).toBeLessThanOrEqual(6);
        expect(c.breathing.trim().length, `${where} breathing`).toBeGreaterThan(0);
        expect(c.mistakes.length, `${where} mistakes`).toBeGreaterThanOrEqual(2);
        expect(c.tips.length, `${where} tips`).toBeGreaterThanOrEqual(1);
        const all = [...c.setup, ...c.steps, c.breathing, ...c.mistakes, ...c.tips];
        for (const s of all) expect(s.trim().length, where).toBeGreaterThan(0);
        if (lang === 'ar') for (const s of all) expect(s, `${where} must be Arabic`).toMatch(ARABIC);
      }
    }
  });

  it('media entries carry a credit (no anonymous / fake media)', () => {
    for (const e of exercises) {
      if (e.media && Object.keys(e.media).some((k) => k !== 'credit')) {
        expect(e.media.credit, `${e.slug} media needs credit`).toBeTruthy();
      }
    }
  });
});
