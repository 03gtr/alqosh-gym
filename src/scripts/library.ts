/** Exercise library: instant search + filters over server-rendered cards. */
import { loadIndex, searchIndex } from './exercise-index';
import { activeCount, emptyFilters, FILTER_KEYS, filtersFromParams, matchesFilters, type FilterState } from './filters';
import type { ExerciseLite } from '../utils/exercise-index';
import { load, save } from './progress-store';
import { setPrefs } from '../utils/progress';

const root = document.querySelector<HTMLElement>('[data-library]');
if (root) void init(root);

async function init(root: HTMLElement) {
  const lang = root.dataset.lang === 'en' ? 'en' : 'ar';
  const grid = root.querySelector<HTMLElement>('#exercise-grid')!;
  const items = new Map([...grid.querySelectorAll<HTMLElement>('.ex-item')].map((el) => [el.dataset.slug!, el]));
  const originalOrder = [...items.keys()];
  const form = root.querySelector<HTMLFormElement>('[data-filters]')!;
  const qInput = root.querySelector<HTMLInputElement>('.search-input')!;
  const qForm = qInput.form!;
  const countEl = root.querySelector<HTMLElement>('[data-result-count]')!;
  const empty = root.querySelector<HTMLElement>('[data-empty]')!;
  const activeEl = root.querySelector<HTMLElement>('[data-active-count]');
  const panel = root.querySelector<HTMLDetailsElement>('[data-filter-panel]');
  const reset = root.querySelector<HTMLAnchorElement>('[data-reset]');
  const sortSel = root.querySelector<HTMLSelectElement>('[data-sort]');
  const activeBox = root.querySelector<HTMLElement>('[data-active-filters]');
  const chipList = root.querySelector<HTMLElement>('[data-chips]');
  const activeLabel = root.querySelector<HTMLElement>('[data-active-label]');
  const labels = JSON.parse(root.dataset.labels ?? '{}') as { active?: string; remove?: string };

  let index: ExerciseLite[];
  try {
    index = await loadIndex();
  } catch {
    return; // without the index every card simply stays visible
  }
  const bySlug = new Map(index.map((e) => [e.slug, e]));

  // Restore state from the URL.
  const params = new URLSearchParams(location.search);
  qInput.value = params.get('q') ?? '';
  const initial = filtersFromParams(params);
  for (const key of FILTER_KEYS) {
    for (const box of form.querySelectorAll<HTMLInputElement>(`input[name="${key}"]`)) {
      box.checked = initial[key].includes(box.value);
    }
  }
  if (sortSel && params.get('sort') === 'name') sortSel.value = 'name';

  // Beginner mode: start with beginner-friendly exercises (a normal, removable
  // filter) unless the URL already asks for something specific.
  const banner = root.querySelector<HTMLElement>('[data-bm-banner]');
  const levelBoxes = () => form.querySelectorAll<HTMLInputElement>('input[name="difficulty"]');
  const syncBanner = () => {
    if (!banner || banner.hidden) return;
    const onlyBeginner = [...levelBoxes()].every((b) => b.checked === (b.value === 'beginner'));
    banner.querySelector<HTMLElement>('[data-bm-text]')!.textContent = (onlyBeginner ? banner.dataset.filtered : banner.dataset.all) ?? '';
    banner.querySelector<HTMLElement>('[data-bm-all]')!.hidden = !onlyBeginner;
    banner.querySelector<HTMLElement>('[data-bm-only]')!.hidden = onlyBeginner;
  };
  if (banner && load().state.prefs.beginnerMode) {
    banner.hidden = false;
    if (![...params.keys()].length) for (const box of levelBoxes()) box.checked = box.value === 'beginner';
    banner.querySelector('[data-bm-all]')?.addEventListener('click', () => {
      for (const box of levelBoxes()) box.checked = false;
      apply();
    });
    banner.querySelector('[data-bm-only]')?.addEventListener('click', () => {
      for (const box of levelBoxes()) box.checked = box.value === 'beginner';
      apply();
    });
    banner.querySelector('[data-bm-off]')?.addEventListener('click', () => {
      save(setPrefs(load().state, { beginnerMode: false }));
      banner.hidden = true;
      for (const box of levelBoxes()) box.checked = false;
      apply();
    });
  }

  const readFilters = (): FilterState => {
    const f = emptyFilters();
    for (const key of FILTER_KEYS) {
      f[key] = [...form.querySelectorAll<HTMLInputElement>(`input[name="${key}"]:checked`)].map((b) => b.value);
    }
    return f;
  };

  const apply = (push = true) => {
    const q = qInput.value.trim();
    const f = readFilters();
    const sortByName = sortSel?.value === 'name';
    let ordered: string[];
    if (q) {
      ordered = searchIndex(index, q).filter((e) => matchesFilters(e, f)).map((e) => e.slug);
      if (sortByName) ordered.sort((a, b) => name(a).localeCompare(name(b), lang));
    } else {
      ordered = originalOrder.filter((s) => {
        const e = bySlug.get(s);
        return e ? matchesFilters(e, f) : true;
      });
      if (sortByName) ordered.sort((a, b) => name(a).localeCompare(name(b), lang));
    }
    const visible = new Set(ordered);
    for (const [slug, el] of items) el.hidden = !visible.has(slug);
    // Re-order visible cards (search relevance / name) without re-rendering.
    const frag = document.createDocumentFragment();
    for (const slug of ordered) {
      const el = items.get(slug);
      if (el) frag.appendChild(el);
    }
    for (const slug of originalOrder) if (!visible.has(slug)) frag.appendChild(items.get(slug)!);
    grid.appendChild(frag);

    countEl.textContent = lang === 'ar' ? `${ordered.length} تمرين` : `${ordered.length} exercises`;
    empty.hidden = ordered.length > 0;
    const n = activeCount(f);
    if (activeEl) activeEl.textContent = n ? String(n) : '';
    for (const key of FILTER_KEYS) {
      const c = form.querySelector<HTMLElement>(`[data-count-for="${key}"]`);
      if (c) c.textContent = f[key].length ? String(f[key].length) : '';
    }
    renderChips(n);
    syncBanner();

    if (push) {
      const next = new URLSearchParams();
      if (q) next.set('q', q);
      for (const key of FILTER_KEYS) if (f[key].length) next.set(key, f[key].join(','));
      if (sortByName) next.set('sort', 'name');
      const qs = next.toString();
      history.replaceState(null, '', qs ? `${location.pathname}?${qs}` : location.pathname);
    }
  };

  // Active filters as removable chips, visible without opening the panel.
  const renderChips = (n: number) => {
    if (!activeBox || !chipList) return;
    activeBox.hidden = n === 0;
    if (activeLabel) activeLabel.textContent = (labels.active ?? '').replace('{n}', String(n));
    chipList.replaceChildren(
      ...[...form.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:checked')].map((box) => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'af-chip';
        const text = box.closest('label')?.textContent?.trim() ?? box.value;
        btn.textContent = `${text} ✕`;
        btn.setAttribute('aria-label', `${labels.remove ?? ''} ${text}`.trim());
        btn.addEventListener('click', () => {
          box.checked = false;
          apply();
        });
        li.append(btn);
        return li;
      }),
    );
  };

  const name = (slug: string) => {
    const e = bySlug.get(slug);
    return e ? (lang === 'ar' ? e.ar : e.name) : slug;
  };

  let timer: number | undefined;
  qInput.addEventListener('input', () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => apply(), 120);
  });
  qForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    apply();
    qInput.blur();
  });
  form.addEventListener('change', () => apply());
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    apply();
    if (panel && window.matchMedia('(max-width: 1023px)').matches) panel.open = false;
    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  sortSel?.addEventListener('change', () => apply());
  const clearFilters = (keepQuery: boolean) => (ev: Event) => {
    ev.preventDefault();
    for (const box of form.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')) box.checked = false;
    if (!keepQuery) qInput.value = '';
    apply();
  };
  reset?.addEventListener('click', clearFilters(false));
  // The chip row's "clear all" removes filters but keeps the search text.
  root.querySelector('[data-clear]')?.addEventListener('click', clearFilters(true));

  apply(false);
  root.classList.add('is-ready');
}
