/**
 * Simple meal examples from familiar, easy-to-find foods in Iraq.
 * Educational examples only — not a medical diet and not suitable for everyone.
 * No calorie numbers are attached to individual meals on purpose: portions
 * vary, and the planner uses the hand-portion estimation method instead.
 */
import type { Localized } from '../i18n/types';

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type Contains = 'meat' | 'fish' | 'dairy' | 'eggs';

export interface Meal {
  id: string;
  slot: MealSlot;
  icon: string;
  name: Localized;
  items: Localized<string[]>;
  contains: Contains[];
}

export const meals: Meal[] = [
  // ---------------------------------------------------------------- breakfast
  {
    id: 'eggs-bread-veg', slot: 'breakfast', icon: '🍳',
    name: { ar: 'بيض وخبز أسمر وخضار', en: 'Eggs, whole-grain bread & vegetables' },
    items: { ar: ['بيض مسلوق أو مقلي بقليل زيت', 'خبز أسمر أو صمون', 'خيار وطماطة', 'حبة فاكهة'], en: ['Boiled or lightly fried eggs', 'Whole-grain bread or samoon', 'Cucumber & tomato', 'A piece of fruit'] },
    contains: ['eggs'],
  },
  {
    id: 'labneh-cheese-eggs', slot: 'breakfast', icon: '🧀',
    name: { ar: 'لبنة أو جبن مع بيض', en: 'Labneh or cheese with eggs' },
    items: { ar: ['لبنة أو جبن أبيض', 'بيضة أو بيضتان', 'خبز', 'زيتون وخضار'], en: ['Labneh or white cheese', '1–2 eggs', 'Bread', 'Olives & vegetables'] },
    contains: ['dairy', 'eggs'],
  },
  {
    id: 'oats-milk-banana', slot: 'breakfast', icon: '🥣',
    name: { ar: 'شوفان بالحليب وموز', en: 'Oats with milk & banana' },
    items: { ar: ['شوفان مطبوخ بالحليب', 'موز أو تمر', 'حفنة صغيرة من المكسرات'], en: ['Oats cooked in milk', 'Banana or dates', 'A small handful of nuts'] },
    contains: ['dairy'],
  },
  {
    id: 'bagilla-eggs', slot: 'breakfast', icon: '🫘',
    name: { ar: 'باقلاء (باجلة) مع بيض', en: 'Fava beans (bagilla) with eggs' },
    items: { ar: ['باقلاء مسلوقة بقليل زيت', 'بيضة', 'خبز', 'بصل أخضر وخضار'], en: ['Boiled fava beans with a little oil', 'An egg', 'Bread', 'Spring onion & vegetables'] },
    contains: ['eggs'],
  },
  {
    id: 'yogurt-dates', slot: 'breakfast', icon: '🥛',
    name: { ar: 'لبن وتمر وبيض', en: 'Yogurt, dates & eggs' },
    items: { ar: ['لبن (زبادي)', 'بضع حبات تمر', 'بيض مسلوق', 'خبز'], en: ['Plain yogurt', 'A few dates', 'Boiled eggs', 'Bread'] },
    contains: ['dairy', 'eggs'],
  },
  {
    id: 'hummus-veg-bread', slot: 'breakfast', icon: '🥙',
    name: { ar: 'حمص وخضار وخبز', en: 'Hummus, vegetables & bread' },
    items: { ar: ['حمص بالطحينة', 'خبز أسمر', 'خيار وطماطة وخس', 'حبة فاكهة'], en: ['Hummus with tahini', 'Whole-grain bread', 'Cucumber, tomato & lettuce', 'A piece of fruit'] },
    contains: [],
  },
  // ---------------------------------------------------------------- lunch
  {
    id: 'rice-chicken-stew', slot: 'lunch', icon: '🍗',
    name: { ar: 'تمن ودجاج ومرق خضار', en: 'Rice, chicken & vegetable stew' },
    items: { ar: ['تمن', 'دجاج مشوي أو مسلوق', 'مرق خضار (فاصوليا خضراء أو بامية)', 'سلطة'], en: ['Rice', 'Grilled or boiled chicken', 'Vegetable stew (green beans or okra)', 'Salad'] },
    contains: ['meat'],
  },
  {
    id: 'rice-fish-salad', slot: 'lunch', icon: '🐟',
    name: { ar: 'تمن وسمك مشوي', en: 'Rice & grilled fish' },
    items: { ar: ['تمن', 'سمك مشوي (مثل المسكوف)', 'سلطة خضار', 'ليمون'], en: ['Rice', 'Grilled fish (e.g. masgouf)', 'Vegetable salad', 'Lemon'] },
    contains: ['fish'],
  },
  {
    id: 'bulgur-meat', slot: 'lunch', icon: '🥩',
    name: { ar: 'برغل ولحم وسلطة', en: 'Bulgur, meat & salad' },
    items: { ar: ['برغل', 'لحم قليل الدهن', 'سلطة', 'لبن'], en: ['Bulgur', 'Lean meat', 'Salad', 'Yogurt'] },
    contains: ['meat', 'dairy'],
  },
  {
    id: 'rice-beans', slot: 'lunch', icon: '🫘',
    name: { ar: 'تمن ومرق فاصوليا يابسة', en: 'Rice & white-bean stew' },
    items: { ar: ['تمن', 'مرق فاصوليا يابسة', 'سلطة', 'لبن'], en: ['Rice', 'White-bean stew', 'Salad', 'Yogurt'] },
    contains: ['dairy'],
  },
  {
    id: 'lentil-soup-eggs', slot: 'lunch', icon: '🍲',
    name: { ar: 'شوربة عدس وبيض', en: 'Lentil soup & eggs' },
    items: { ar: ['شوربة عدس', 'خبز', 'بيض مسلوق', 'سلطة'], en: ['Lentil soup', 'Bread', 'Boiled eggs', 'Salad'] },
    contains: ['eggs'],
  },
  {
    id: 'potato-chicken-veg', slot: 'lunch', icon: '🥔',
    name: { ar: 'بطاطا ودجاج وخضار', en: 'Potatoes, chicken & vegetables' },
    items: { ar: ['بطاطا مشوية أو مسلوقة', 'صدر دجاج', 'خضار مشوية أو سلطة'], en: ['Baked or boiled potatoes', 'Chicken breast', 'Roasted vegetables or salad'] },
    contains: ['meat'],
  },
  // ---------------------------------------------------------------- dinner
  {
    id: 'chicken-bread-salad', slot: 'dinner', icon: '🥗',
    name: { ar: 'دجاج مشوي وخبز وسلطة', en: 'Grilled chicken, bread & salad' },
    items: { ar: ['دجاج مشوي', 'خبز', 'سلطة', 'لبن'], en: ['Grilled chicken', 'Bread', 'Salad', 'Yogurt'] },
    contains: ['meat', 'dairy'],
  },
  {
    id: 'fish-potato-veg', slot: 'dinner', icon: '🐠',
    name: { ar: 'سمك وبطاطا وخضار', en: 'Fish, potatoes & vegetables' },
    items: { ar: ['سمك مشوي', 'بطاطا', 'خضار'], en: ['Grilled fish', 'Potatoes', 'Vegetables'] },
    contains: ['fish'],
  },
  {
    id: 'kebab-bread-salad', slot: 'dinner', icon: '🍢',
    name: { ar: 'لحم مشوي وخبز وسلطة', en: 'Grilled meat, bread & salad' },
    items: { ar: ['لحم أو كباب مشوي (حصة معتدلة)', 'خبز', 'سلطة وبصل وطماطة مشوية'], en: ['Grilled meat or kebab (moderate portion)', 'Bread', 'Salad, onion & grilled tomato'] },
    contains: ['meat'],
  },
  {
    id: 'hummus-eggs-veg', slot: 'dinner', icon: '🥚',
    name: { ar: 'حمص وبيض وخضار', en: 'Hummus, eggs & vegetables' },
    items: { ar: ['حمص', 'بيض مسلوق', 'خبز', 'خضار'], en: ['Hummus', 'Boiled eggs', 'Bread', 'Vegetables'] },
    contains: ['eggs'],
  },
  {
    id: 'veg-omelette', slot: 'dinner', icon: '🍳',
    name: { ar: 'عجة بيض بالخضار', en: 'Vegetable omelette' },
    items: { ar: ['بيض مع خضار (بصل، طماطة، فلفل)', 'خبز', 'لبن'], en: ['Eggs with vegetables (onion, tomato, pepper)', 'Bread', 'Yogurt'] },
    contains: ['eggs', 'dairy'],
  },
  {
    id: 'lentils-rice-salad', slot: 'dinner', icon: '🍛',
    name: { ar: 'عدس وتمن وسلطة', en: 'Lentils, rice & salad' },
    items: { ar: ['عدس مطبوخ مع تمن أو برغل (مجدرة)', 'سلطة', 'خيار ولبن (جاجيك)'], en: ['Lentils cooked with rice or bulgur (mujaddara)', 'Salad', 'Cucumber yogurt (jajik)'] },
    contains: ['dairy'],
  },
  // ---------------------------------------------------------------- snacks
  {
    id: 'fruit-nuts', slot: 'snack', icon: '🍎',
    name: { ar: 'فاكهة ومكسرات', en: 'Fruit & nuts' },
    items: { ar: ['حبة فاكهة موسمية', 'حفنة صغيرة من المكسرات غير المملحة'], en: ['A piece of seasonal fruit', 'A small handful of unsalted nuts'] },
    contains: [],
  },
  {
    id: 'yogurt-dates-snack', slot: 'snack', icon: '🥛',
    name: { ar: 'لبن وتمر', en: 'Yogurt & dates' },
    items: { ar: ['لبن (زبادي)', '2–3 حبات تمر'], en: ['Plain yogurt', '2–3 dates'] },
    contains: ['dairy'],
  },
  {
    id: 'boiled-eggs-cucumber', slot: 'snack', icon: '🥚',
    name: { ar: 'بيض مسلوق وخيار', en: 'Boiled eggs & cucumber' },
    items: { ar: ['بيضتان مسلوقتان', 'خيار'], en: ['Two boiled eggs', 'Cucumber'] },
    contains: ['eggs'],
  },
  {
    id: 'lablabi', slot: 'snack', icon: '🫛',
    name: { ar: 'لبلبي (حمص مسلوق)', en: 'Lablabi (boiled chickpeas)' },
    items: { ar: ['حمص مسلوق', 'ليمون وكمون'], en: ['Boiled chickpeas', 'Lemon & cumin'] },
    contains: [],
  },
  {
    id: 'cheese-bread-fruit', slot: 'snack', icon: '🧀',
    name: { ar: 'جبن وخبز صغير وفاكهة', en: 'Cheese, small bread & fruit' },
    items: { ar: ['قطعة جبن', 'نصف رغيف أو صمونة صغيرة', 'فاكهة'], en: ['A piece of cheese', 'Half a flatbread or small samoon', 'Fruit'] },
    contains: ['dairy'],
  },
];

/* --------------------------------------------------------------- planner */

export type MealGoal = 'loss' | 'maintain' | 'gain';
export type PortionSex = 'male' | 'female';

export interface HandPortions {
  palm: number;   // protein
  fist: number;   // vegetables
  cupped: number; // carbohydrates
  thumb: number;  // fats
}

/** Meal-slot order for a given number of meals per day. */
export function slotsFor(count: number): MealSlot[] {
  if (count <= 3) return ['breakfast', 'lunch', 'dinner'];
  if (count === 4) return ['breakfast', 'lunch', 'snack', 'dinner'];
  return ['breakfast', 'snack', 'lunch', 'snack', 'dinner'];
}

const roundHalf = (n: number) => Math.max(0.5, Math.round(n * 2) / 2);

/**
 * Hand-portion estimate per meal. Daily baseline ≈ 8 portions of each type
 * for men and 4 for women (the common "2 or 1 per meal, ~4 meals" rule of
 * thumb), spread over the chosen meals (snacks count as half a meal) and
 * nudged by goal (carbs/fats only).
 */
export function portionsFor(slot: MealSlot, count: number, sex: PortionSex, goal: MealGoal): HandPortions {
  const base = sex === 'male' ? 2 : 1;
  const mainMeals = slotsFor(count).filter((s) => s !== 'snack').length;
  const snacks = slotsFor(count).length - mainMeals;
  const daily = base * 4;
  // Snacks count as half a meal.
  const perMain = daily / (mainMeals + snacks * 0.5);
  const scale = slot === 'snack' ? perMain / 2 : perMain;
  const adj = goal === 'loss' ? -0.5 : goal === 'gain' ? 0.5 : 0;
  return {
    palm: roundHalf(scale),
    fist: roundHalf(scale),
    cupped: roundHalf(scale + adj * (slot === 'snack' ? 0.5 : 1)),
    thumb: roundHalf(scale + adj * (slot === 'snack' ? 0.5 : 1) * 0.5),
  };
}

export interface MealFilters {
  noFish?: boolean;
  noMeat?: boolean;
  noDairy?: boolean;
}

export function allowedMeals(filters: MealFilters, pool: Meal[] = meals): Meal[] {
  return pool.filter((m) => {
    if (filters.noMeat && (m.contains.includes('meat') || m.contains.includes('fish'))) return false;
    if (filters.noFish && m.contains.includes('fish')) return false;
    if (filters.noDairy && m.contains.includes('dairy')) return false;
    return true;
  });
}
