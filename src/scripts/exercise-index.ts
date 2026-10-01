/** Browser-side loader for the lightweight exercise index (cached per page). */
import type { ExerciseLite } from '../utils/exercise-index';
import { scoreDoc } from '../utils/search';

let cache: Promise<ExerciseLite[]> | null = null;

export function loadIndex(): Promise<ExerciseLite[]> {
  if (!cache) {
    const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
    cache = fetch(`${base}search-index.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`index ${r.status}`);
        return r.json() as Promise<ExerciseLite[]>;
      })
      .catch((err) => {
        cache = null; // allow a retry
        throw err;
      });
  }
  return cache;
}

export function searchIndex(index: ExerciseLite[], query: string): ExerciseLite[] {
  return index
    .map((e) => ({ e, s: scoreDoc(e.doc, query) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s || a.e.name.localeCompare(b.e.name))
    .map((r) => r.e);
}

export function exerciseHref(lang: string, slug: string): string {
  const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  return `${base}${lang === 'ar' ? '' : `${lang}/`}exercises/${slug}/`;
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);
}
