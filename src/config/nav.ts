import type { UIKey } from '../i18n/ui';
import type { IconName } from '../components/icons';

export interface NavItem {
  key: UIKey;
  /** Language-neutral, root-relative path. */
  path: string;
  icon: IconName;
}

/** Desktop header. */
export const desktopNav: NavItem[] = [
  { key: 'nav.home', path: '/', icon: 'home' },
  { key: 'nav.exercises', path: '/exercises/', icon: 'dumbbell' },
  { key: 'nav.muscles', path: '/muscles/', icon: 'muscle' },
  { key: 'nav.goals', path: '/goals/', icon: 'target' },
  { key: 'nav.workouts', path: '/workouts/', icon: 'bolt' },
  { key: 'nav.calculator', path: '/calculator/', icon: 'calculator' },
  { key: 'nav.nutrition', path: '/nutrition/', icon: 'nutrition' },
  { key: 'nav.gym', path: '/gym/', icon: 'clock' },
];

/**
 * Mobile bottom bar: the member's main journeys (4 links + "More").
 * The calculator and workout builder live under "My goal" (/goals/).
 */
export const bottomNav: NavItem[] = [
  { key: 'nav.home', path: '/', icon: 'home' },
  { key: 'nav.exercises', path: '/exercises/', icon: 'dumbbell' },
  { key: 'nav.goals', path: '/goals/', icon: 'target' },
  { key: 'nav.nutrition', path: '/nutrition/', icon: 'nutrition' },
];

/** Items inside the mobile "More" sheet. */
export const moreNav: NavItem[] = [
  { key: 'nav.progress', path: '/progress/', icon: 'chart' },
  { key: 'nav.gym', path: '/gym/', icon: 'clock' },
  { key: 'nav.women', path: '/women/', icon: 'user' },
  { key: 'nav.calculator', path: '/calculator/', icon: 'calculator' },
  { key: 'nav.workouts', path: '/workouts/', icon: 'bolt' },
  { key: 'nav.homeWorkout', path: '/workouts/home/', icon: 'home' },
  { key: 'nav.muscles', path: '/muscles/', icon: 'muscle' },
  { key: 'nav.beginner', path: '/beginner/', icon: 'user' },
  { key: 'nav.advanced', path: '/advanced/', icon: 'bolt' },
  { key: 'nav.meals', path: '/nutrition/meals/', icon: 'nutrition' },
  { key: 'nav.health', path: '/health/', icon: 'heart' },
  { key: 'nav.learnRecovery', path: '/learn/recovery/', icon: 'book' },
  { key: 'nav.eras', path: '/classic-vs-modern/', icon: 'book' },
  { key: 'nav.qr', path: '/qr/', icon: 'qr' },
  { key: 'nav.about', path: '/about/', icon: 'info' },
];

/** Is `current` (language-neutral path) inside the section `path`? */
export function isActive(path: string, current: string): boolean {
  if (path === '/') return current === '/';
  // /workouts/home/ has its own item; don't also mark /workouts/ for it.
  if (path === '/workouts/' && current.startsWith('/workouts/home/')) return false;
  return current.startsWith(path);
}
