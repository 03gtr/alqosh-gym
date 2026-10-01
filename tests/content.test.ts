import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { exercises } from '../src/data/exercises';
import { toLite } from '../src/utils/exercise-index';
import { emptyFilters, filtersFromParams, matchesFilters } from '../src/scripts/filters';
import { developer, gym } from '../src/config/gym';
import { GOAL_JOURNEYS } from '../src/data/goals';
import { ui } from '../src/i18n/ui';

const CONTENT = join(process.cwd(), 'src', 'content');
const slugs = (dir: string) => readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, '')).sort();
const field = (md: string, key: string) => md.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.trim();

describe('bilingual content parity', () => {
  for (const kind of ['articles', 'guides']) {
    it(`every ${kind} entry exists in Arabic and English`, () => {
      expect(slugs(join(CONTENT, kind, 'ar'))).toEqual(slugs(join(CONTENT, kind, 'en')));
    });
  }

  it('article pairs share topics and order', () => {
    for (const slug of slugs(join(CONTENT, 'articles', 'ar'))) {
      const ar = readFileSync(join(CONTENT, 'articles', 'ar', `${slug}.md`), 'utf8');
      const en = readFileSync(join(CONTENT, 'articles', 'en', `${slug}.md`), 'utf8');
      expect(field(ar, 'topics'), slug).toBe(field(en, 'topics'));
      expect(field(ar, 'order'), slug).toBe(field(en, 'order'));
    }
  });

  it('articles never start with a top-level heading (the page renders the title)', () => {
    for (const lang of ['ar', 'en']) {
      for (const slug of slugs(join(CONTENT, 'articles', lang))) {
        const body = readFileSync(join(CONTENT, 'articles', lang, `${slug}.md`), 'utf8').split(/^---$/m).slice(2).join('---');
        expect(/^# /m.test(body), `${lang}/${slug}`).toBe(false);
      }
    }
  });

  it('every UI key has non-empty Arabic and English text', () => {
    for (const key of Object.keys(ui.ar) as (keyof typeof ui.ar)[]) {
      expect(ui.ar[key].trim(), key).not.toBe('');
      expect(ui.en[key].trim(), key).not.toBe('');
    }
  });
});

describe('official gym facts', () => {
  it('keeps the official hours exactly', () => {
    expect(gym.hours.men.ranges.map((r) => [r.from, r.to])).toEqual([['05:00', '01:00']]);
    expect(gym.hours.women.ranges.map((r) => [r.from, r.to])).toEqual([['08:00', '10:00'], ['16:00', '18:00']]);
  });

  it('lists the four permanent benefits', () => {
    expect(gym.benefits.map((b) => b.id)).toEqual(['therapeutic', 'security', 'alqosh-employees', 'limited-income']);
    expect(gym.benefits.every((b) => b.permanent)).toBe(true);
  });

  it('lists the coaching team with exact official names and nothing invented', () => {
    expect(gym.coaches.map((c) => [c.id, c.name.ar])).toEqual([
      ['men', 'الكابتن راني اسمرو'],
      ['women', 'الكابتن عذراء قس يونان'],
    ]);
    expect(gym.coaches[0].name.en).toBe('Coach Rani Asmaro');
    // No official English spelling, credentials or photos were provided.
    expect(gym.coaches[1].name.en).toBeNull();
    for (const c of gym.coaches) {
      expect(c.credentials).toEqual([]);
      expect(c.photo).toBeNull();
    }
  });

  it('credits IQ Group with a link to iq-group.app', () => {
    expect(developer.url).toBe('https://iq-group.app');
    expect(developer.credit.ar).toBe('بدعم وتطوير IQ Group');
  });

  it('never presents discounts as temporary offers', () => {
    const text = JSON.stringify(gym).toLowerCase();
    for (const banned of ['limited offer', 'seasonal', 'flash sale', 'عرض محدود', 'لفترة محدودة']) {
      expect(text.includes(banned), banned).toBe(false);
    }
  });

  it('uses exactly the official contact details and nothing invented', () => {
    expect(gym.contact.phone).toEqual({ display: '0750 218 3800', e164: '+9647502183800' });
    expect(gym.contact.whatsapp).toEqual({ display: '0750 218 3800', e164: '+9647502183800' });
    expect(gym.contact.mapUrl).toBe('https://maps.app.goo.gl/CoY85ebkDbvYP2EQ6?g_st=ac');
    expect(gym.contact.socials).toEqual([{ id: 'facebook', url: 'https://facebook.com/share/19o136kGJc' }]);
    // No street address or opening days were provided.
    expect(gym.contact.address).toBeNull();
  });
});

describe('goal journeys', () => {
  const ARTICLES = new Set(slugs(join(CONTENT, 'articles', 'ar')));
  const EN_ARTICLES = new Set(slugs(join(CONTENT, 'articles', 'en')));
  const ROUTES = ['/calculator/', '/nutrition/', '/nutrition/meals/', '/workouts/', '/exercises/', '/beginner/'];

  it('covers the four goals with bilingual text', () => {
    expect(GOAL_JOURNEYS.map((g) => g.id)).toEqual(['weight-loss', 'muscle-gain', 'maintain', 'fitness']);
    for (const g of GOAL_JOURNEYS) {
      for (const text of [g.title, g.short, g.heading, g.intro, ...g.steps.flatMap((s) => [s.title, s.text, s.cta])]) {
        expect(text.ar.trim() && text.en.trim(), g.id).toBeTruthy();
      }
      expect(g.steps.length).toBeGreaterThanOrEqual(4);
    }
  });

  it('every step opens an existing page or article', () => {
    for (const g of GOAL_JOURNEYS) {
      for (const s of g.steps) {
        const path = s.path.split(/[?#]/)[0];
        const article = path.match(/^\/articles\/([^/]+)\/$/)?.[1];
        if (article) {
          expect(ARTICLES.has(article) && EN_ARTICLES.has(article), `${g.id}: ${s.path}`).toBe(true);
        } else {
          expect(ROUTES, `${g.id}: ${s.path}`).toContain(path);
        }
      }
    }
  });

  it('makes no promises about results', () => {
    const text = JSON.stringify(GOAL_JOURNEYS);
    for (const banned of [/\d+\s*(kg|كيلو|كغم)/i, /guarantee(d)? (results|loss)/i, /مضمون(ة)? النتائج/, /خلال \d+ (يوم|أيام|أسبوع)/]) {
      expect(banned.test(text), String(banned)).toBe(false);
    }
  });
});

describe('library filters', () => {
  const index = exercises.map(toLite);

  it('parses comma-separated and repeated params', () => {
    const f = filtersFromParams(new URLSearchParams('category=chest,back&equipment=cable&equipment=machine'));
    expect(f.category).toEqual(['chest', 'back']);
    expect(f.equipment).toEqual(['cable', 'machine']);
  });

  it('ORs within a group and ANDs across groups', () => {
    const f = { ...emptyFilters(), category: ['biceps'], difficulty: ['beginner'] };
    const hits = index.filter((e) => matchesFilters(e, f));
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.every((e) => e.groups.includes('biceps') && e.difficulty === 'beginner')).toBe(true);
  });

  it('era filter separates classic and modern', () => {
    const classic = index.filter((e) => matchesFilters(e, { ...emptyFilters(), era: ['classic'] }));
    const modern = index.filter((e) => matchesFilters(e, { ...emptyFilters(), era: ['modern'] }));
    expect(classic.length).toBeGreaterThan(0);
    expect(modern.length).toBeGreaterThan(0);
    expect(classic.some((e) => modern.includes(e))).toBe(false);
  });
});
