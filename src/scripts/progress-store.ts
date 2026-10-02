/**
 * Browser side of local progress: reads/writes localStorage and shows short
 * toasts. All rules live in ../utils/progress.ts. If storage is unavailable
 * (private mode, blocked site data) everything degrades to "not saved"
 * without breaking the page.
 */
import { localDate, parseStored, STORAGE_KEY, type LoadStatus, type LocalState } from '../utils/progress';
import { motivationFor, type MotivationEvent } from '../utils/motivation';

export const lang: 'ar' | 'en' = document.documentElement.lang === 'en' ? 'en' : 'ar';
const gymId = document.documentElement.dataset.gym ?? 'unknown';

export function today(): string {
  return localDate();
}

export function storageAvailable(): boolean {
  try {
    const k = `${STORAGE_KEY}.probe`;
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

export function load(): { state: LocalState; status: LoadStatus } {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    /* unavailable */
  }
  const res = parseStored(raw, gymId);
  // Persist a repaired/reset copy so the warning is shown only once.
  if (res.status === 'repaired' || res.status === 'reset') save(res.state);
  return res;
}

export function save(state: LocalState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

/** Apply a change, save it, and return [before, after]. */
export function update(fn: (s: LocalState) => LocalState): [LocalState, LocalState] {
  const before = load().state;
  const after = fn(before);
  save(after);
  return [before, after];
}

export function clearAll(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nothing to clear */
  }
}

let toastTimer: number | undefined;
/** One polite, auto-dismissing status message at a time. */
export function toast(text: string): void {
  let el = document.querySelector<HTMLElement>('[data-toast]');
  if (!el) {
    el = document.createElement('p');
    el.className = 'toast';
    el.dataset.toast = '';
    el.setAttribute('role', 'status');
    document.body.append(el);
  }
  el.hidden = false;
  el.textContent = text;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    if (el) el.hidden = true;
  }, 3500);
}

/** Show the encouragement for an event (respects the user's setting). */
export function encourage(before: LocalState, after: LocalState, event: MotivationEvent): void {
  const m = motivationFor(before, after, event, today());
  if (m) toast(m[lang]);
}
