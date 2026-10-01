/** Exercise library: instant search + filters over server-rendered cards. */
import { loadIndex, searchIndex } from './exercise-index';
import { activeCount, emptyFilters, FILTER_KEYS, filtersFromParams, matchesFilters, type FilterState } from './filters';
import type { ExerciseLite } from '../utils/exercise-index';

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

    if (push) {
      const next = new URLSearchParams();
      if (q) next.set('q', q);
      for (const key of FILTER_KEYS) if (f[key].length) next.set(key, f[key].join(','));
      if (sortByName) next.set('sort', 'name');
      const qs = next.toString();
      history.replaceState(null, '', qs ? `${location.pathname}?${qs}` : location.pathname);
    }
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
  reset?.addEventListener('click', (ev) => {
    ev.preventDefault();
    for (const box of form.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')) box.checked = false;
    qInput.value = '';
    apply();
  });

  apply(false);
  root.classList.add('is-ready');
}
