/**
 * General rep / duration guidance shown on exercise pages when an exercise
 * does not define its own `prescription`. Educational defaults, not a program.
 */
import type { Exercise } from '../data/exercises/types';
import type { Lang } from '../i18n/types';

export function suggestedReps(e: Exercise, lang: Lang): string[] {
  const own = e.content[lang].prescription;
  if (own) return [own];
  const ar = lang === 'ar';
  switch (e.exerciseType) {
    case 'compound':
      return ar
        ? ['بناء العضلات: 3–4 مجموعات × 6–12 تكرار', 'القوة (لأصحاب الخبرة): 3–5 مجموعات × 3–6 تكرار', 'المبتدئ: 2–3 مجموعات × 8–12 تكرار بوزن مريح']
        : ['Muscle gain: 3–4 sets × 6–12 reps', 'Strength (experienced): 3–5 sets × 3–6 reps', 'Beginners: 2–3 sets × 8–12 reps with a comfortable weight'];
    case 'isolation':
      return ar
        ? ['2–4 مجموعات × 10–15 تكرار', 'اترك 1–3 تكرارات احتياطية بتقنية صحيحة']
        : ['2–4 sets × 10–15 reps', 'Leave 1–3 reps in reserve with good technique'];
    case 'isometric':
      return ar ? ['2–3 جولات × ثبات 20–40 ثانية'] : ['2–3 rounds × 20–40 second holds'];
    case 'plyometric':
      return ar
        ? ['3–4 مجموعات × 3–6 تكرارات بجودة عالية', 'راحة كاملة بين المجموعات']
        : ['3–4 sets × 3–6 high-quality reps', 'Full rest between sets'];
    case 'cardio':
      return ar ? ['20–40 دقيقة بشدة متوسطة'] : ['20–40 minutes at a moderate intensity'];
    case 'mobility':
      return ar ? ['1–2 جولة × 6–10 تكرارات بهدوء'] : ['1–2 rounds × 6–10 slow reps'];
    case 'stretch':
      return ar ? ['ثبات 20–30 ثانية × 2–3 مرات'] : ['Hold 20–30 seconds × 2–3 times'];
  }
}
