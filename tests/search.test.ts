import { describe, expect, it } from 'vitest';
import { exercises } from '../src/data/exercises';
import { toLite } from '../src/utils/exercise-index';
import { normalize, scoreDoc, tokenize } from '../src/utils/search';

const index = exercises.map(toLite);

function search(q: string) {
  return index
    .map((e) => ({ e, s: scoreDoc(e.doc, q) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((r) => r.e);
}

describe('normalize', () => {
  it('unifies Arabic letter variants and removes diacritics', () => {
    expect(normalize('أَإِآ')).toBe('ااا');
    expect(normalize('تمرينة')).toBe('تمرينه');
    expect(normalize('مستوى')).toBe('مستوي');
    expect(normalize('بـــنش')).toBe('بنش');
  });
  it('lower-cases and strips punctuation', () => {
    expect(normalize("Farmer's Walk!")).toBe('farmers walk');
  });
  it('strips the Arabic definite article in tokens', () => {
    expect(tokenize('الصدر')).toEqual(['صدر']);
  });
});

describe('exercise search (spec examples)', () => {
  it('"بنش" finds the bench press first', () => {
    expect(search('بنش')[0]?.slug).toBe('barbell-bench-press');
  });

  it('"Bench Press" finds the bench press first', () => {
    expect(search('Bench Press')[0]?.slug).toBe('barbell-bench-press');
  });

  it('"صدر" shows chest exercises', () => {
    const r = search('صدر');
    expect(r.length).toBeGreaterThan(5);
    expect(r.slice(0, 5).every((e) => e.groups.includes('chest'))).toBe(true);
  });

  it('"باي" finds biceps exercises', () => {
    const r = search('باي');
    expect(r.length).toBeGreaterThan(3);
    expect(r.slice(0, 3).every((e) => e.groups.includes('biceps'))).toBe(true);
  });

  it('"سكوات" finds squat variations', () => {
    const r = search('سكوات');
    expect(r[0]?.slug).toBe('back-squat');
    expect(r.length).toBeGreaterThan(4);
    const top = r.slice(0, 5);
    expect(top.every((e) => /squat/i.test(e.name) || e.pattern === 'squat'), top.map((e) => e.slug).join()).toBe(true);
  });

  it('finds machines by equipment and aliases', () => {
    expect(search('lat pulldown')[0]?.slug).toBe('lat-pulldown');
    expect(search('cable fly')[0]?.slug).toBe('cable-fly');
    expect(search('biceps curl').some((e) => e.groups.includes('biceps'))).toBe(true);
    expect(search('military press')[0]?.slug).toBe('overhead-press');
  });

  it('returns nothing for gibberish', () => {
    expect(search('zzqxw')).toEqual([]);
  });
});

describe('release search QA (Arabic + English gym terms)', () => {
  const cases: [string, string[]][] = [
    ['صدر', ['chest']], ['chest', ['chest']],
    ['ظهر', ['back']], ['back', ['back']],
    ['باي', ['biceps']], ['biceps', ['biceps']],
    ['تراي', ['triceps']], ['triceps', ['triceps']],
    ['كتف', ['shoulders']], ['shoulder', ['shoulders']],
    ['رجل', ['legs', 'glutes', 'calves']], ['legs', ['legs', 'glutes', 'calves']],
    ['بطن', ['abs']], ['abs', ['abs']],
  ];
  for (const [q, groups] of cases) {
    it(`"${q}" leads with ${groups.join('/')} exercises`, () => {
      const r = search(q);
      expect(r.length).toBeGreaterThanOrEqual(8);
      for (const e of r.slice(0, 5)) expect(e.groups.some((g) => groups.includes(g)), `${q} → ${e.slug}`).toBe(true);
    });
  }

  it('"سكوات" and "squat" lead with squat variations', () => {
    for (const q of ['سكوات', 'squat']) {
      expect(search(q).slice(0, 5).every((e) => e.slug.includes('squat')), q).toBe(true);
    }
  });

  it('"bench press" and "بنش" put the barbell bench press first', () => {
    expect(search('bench press')[0].slug).toBe('barbell-bench-press');
    expect(search('بنش')[0].slug).toBe('barbell-bench-press');
  });

  it('every result slug is a real exercise page', () => {
    const slugs = new Set(exercises.map((e) => e.slug));
    for (const q of ['صدر', 'back', 'كتف', 'legs', 'بطن']) for (const e of search(q)) expect(slugs.has(e.slug)).toBe(true);
  });
});
