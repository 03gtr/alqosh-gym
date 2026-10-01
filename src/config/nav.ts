import type { UIKey } from '../i18n/ui';
import type { IconName } from '../components/icons';

export interface NavItem {
  key: UIKey;
  /** Language-neutral, root-relative path. */
  path: string;
  icon: IconName;
}

/** Desktop header (spec order). */
export const desktopNav: NavItem[] = [
  { key: 'nav.home', path: '/', icon: 'home' },
  { key: 'nav.exercises', path: '/exercises/', icon: 'dumbbell' },
  { key: 'nav.muscles', path: '/muscles/', icon: 'muscle' },
  { key: 'nav.workouts', path: '/workouts/', icon: 'bolt' },
  { key: 'nav.calculator', path: '/calculator/', icon: 'calculator' },
  { key: 'nav.nutrition', path: '/nutrition/', icon: 'nutrition' },
  { key: 'nav.health', path: '/health/', icon: 'heart' },
  { key: 'nav.gym', path: '/gym/', icon: 'clock' },
  { key: 'nav.about', path: '/about/', icon: 'info' },
];

/** Mobile bottom bar: 4 links + "More". */
export const bottomNav: NavItem[] = [
  { key: 'nav.home', path: '/', icon: 'home' },
  { key: 'nav.exercises', path: '/exercises/', icon: 'dumbbell' },
  { key: 'nav.calculator', path: '/calculator/', icon: 'calculator' },
  { key: 'nav.nutrition', path: '/nutrition/', icon: 'nutrition' },
];

/** Items inside the mobile "More" sheet. */
export const moreNav: NavItem[] = [
  { key: 'nav.gym', path: '/gym/', icon: 'clock' },
  { key: 'nav.muscles', path: '/muscles/', icon: 'muscle' },
  { key: 'nav.workouts', path: '/workouts/', icon: 'bolt' },
  { key: 'nav.health', path: '/health/', icon: 'heart' },
  { key: 'nav.meals', path: '/nutrition/meals/', icon: 'nutrition' },
  { key: 'nav.beginner', path: '/beginner/', icon: 'user' },
  { key: 'nav.advanced', path: '/advanced/', icon: 'bolt' },
  { key: 'nav.eras', path: '/classic-vs-modern/', icon: 'book' },
  { key: 'nav.qr', path: '/qr/', icon: 'qr' },
  { key: 'nav.about', path: '/about/', icon: 'info' },
];

/** Is `current` (language-neutral path) inside the section `path`? */
export function isActive(path: string, current: string): boolean {
  if (path === '/') return current === '/';
  return current.startsWith(path);
}
