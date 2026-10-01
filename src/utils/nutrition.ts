/**
 * Energy & macro estimates. Pure functions — used by the calculator page and
 * covered by unit tests.
 *
 * BMR: Mifflin-St Jeor (1990), doi:10.1093/ajcn/51.2.241
 * Protein ranges: ISSN position stand (Jäger et al., 2017), doi:10.1186/s12970-017-0177-8
 * Fat 20–35 % of energy: ACSM/AND/DC joint position (Thomas et al., 2016), doi:10.1249/MSS.0000000000000852
 * Goal ranges are deliberately moderate (no crash diets, no extreme surpluses).
 */

export type Sex = 'male' | 'female';
export type Activity = 'sedentary' | 'light' | 'moderate' | 'high' | 'veryHigh';
export type CalorieGoal = 'loss' | 'maintain' | 'gain';

export const ACTIVITY_FACTORS: Record<Activity, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  high: 1.725,
  veryHigh: 1.9,
};

/** Accepted input ranges (adults only). */
export const LIMITS = {
  age: { min: 18, max: 80 },
  heightCm: { min: 120, max: 230 },
  weightKg: { min: 35, max: 250 },
} as const;

/** Multipliers of TDEE for each goal: [low, high]. */
export const GOAL_FACTORS: Record<CalorieGoal, [number, number]> = {
  loss: [0.8, 0.9],
  maintain: [0.95, 1.05],
  gain: [1.05, 1.1],
};

/** General lower bound below which intake should be professionally supervised. */
export const CALORIE_FLOOR: Record<Sex, number> = { male: 1500, female: 1200 };

export interface Person {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
}

export type FieldError = 'age' | 'heightCm' | 'weightKg';

export function validatePerson(p: Partial<Person>): FieldError[] {
  const errors: FieldError[] = [];
  for (const key of ['age', 'heightCm', 'weightKg'] as const) {
    const v = p[key];
    const { min, max } = LIMITS[key];
    if (typeof v !== 'number' || !Number.isFinite(v) || v < min || v > max) errors.push(key);
  }
  return errors;
}

/** Mifflin-St Jeor resting energy expenditure, kcal/day. */
export function bmr({ sex, age, heightCm, weightKg }: Person): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
}

export function tdee(bmrKcal: number, activity: Activity): number {
  return bmrKcal * ACTIVITY_FACTORS[activity];
}

const round10 = (n: number) => Math.round(n / 10) * 10;

export interface CalorieRange {
  min: number;
  max: number;
  target: number;
  /** True when the lower bound was raised to the safety floor. */
  floored: boolean;
}

export function calorieRange(tdeeKcal: number, goal: CalorieGoal, sex: Sex): CalorieRange {
  const [lo, hi] = GOAL_FACTORS[goal];
  const floor = CALORIE_FLOOR[sex];
  let min = round10(tdeeKcal * lo);
  let max = round10(tdeeKcal * hi);
  let floored = false;
  if (min < floor) {
    min = floor;
    floored = true;
  }
  if (max < min) max = min;
  return { min, max, target: round10((min + max) / 2), floored };
}

/** Protein in g per kg body weight: [low, high, default]. */
export const PROTEIN_G_PER_KG: Record<CalorieGoal, [number, number, number]> = {
  loss: [1.8, 2.2, 2.0],
  maintain: [1.4, 2.0, 1.6],
  gain: [1.6, 2.2, 1.8],
};

/** Fat as a share of energy: [low, high, default]. */
export const FAT_SHARE: [number, number, number] = [0.25, 0.35, 0.3];

/** Protein is capped at this share of energy so carbs/fat stay reasonable at high body weights. */
const MAX_PROTEIN_SHARE = 0.35;

export interface Macros {
  kcal: number;
  protein: { g: number; min: number; max: number; perKg: number; capped: boolean };
  fat: { g: number; min: number; max: number; share: number };
  carbs: { g: number };
}

export function macros(kcal: number, weightKg: number, goal: CalorieGoal): Macros {
  const [pLo, pHi, pDef] = PROTEIN_G_PER_KG[goal];
  const [fLo, fHi, fDef] = FAT_SHARE;
  const proteinCap = (kcal * MAX_PROTEIN_SHARE) / 4;
  const rawProtein = pDef * weightKg;
  const proteinG = Math.min(rawProtein, proteinCap);
  const fatG = (kcal * fDef) / 9;
  const carbsG = Math.max(0, (kcal - proteinG * 4 - fatG * 9) / 4);
  return {
    kcal: Math.round(kcal),
    protein: {
      g: Math.round(proteinG),
      min: Math.round(Math.min(pLo * weightKg, proteinCap)),
      max: Math.round(Math.min(pHi * weightKg, proteinCap)),
      perKg: Math.round((proteinG / weightKg) * 10) / 10,
      capped: rawProtein > proteinCap,
    },
    fat: {
      g: Math.round(fatG),
      min: Math.round((kcal * fLo) / 9),
      max: Math.round((kcal * fHi) / 9),
      share: Math.round(fDef * 100),
    },
    carbs: { g: Math.round(carbsG) },
  };
}

export interface CalculatorResult {
  bmr: number;
  tdee: number;
  ranges: Record<CalorieGoal, CalorieRange>;
  goal: CalorieGoal;
  macros: Macros;
}

export function calculate(person: Person, activity: Activity, goal: CalorieGoal): CalculatorResult {
  const b = bmr(person);
  const t = tdee(b, activity);
  const ranges = {
    loss: calorieRange(t, 'loss', person.sex),
    maintain: calorieRange(t, 'maintain', person.sex),
    gain: calorieRange(t, 'gain', person.sex),
  };
  return {
    bmr: Math.round(b),
    tdee: Math.round(t),
    ranges,
    goal,
    macros: macros(ranges[goal].target, person.weightKg, goal),
  };
}
