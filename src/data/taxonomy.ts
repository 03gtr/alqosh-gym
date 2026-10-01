/**
 * Controlled vocabularies for the exercise encyclopedia.
 * Every label is bilingual; `search` holds extra colloquial / gym-floor terms
 * (Arabic and English) that make the search engine understand how people
 * actually talk inside the gym.
 */
import type { Localized } from '../i18n/types';

export interface Term {
  label: Localized;
  /** Extra search terms (any language). */
  search?: string[];
}

/* ------------------------------------------------------------------ */
/* Browse categories (muscle groups + training categories)             */
/* ------------------------------------------------------------------ */

export const CATEGORIES = {
  chest: { label: { en: 'Chest', ar: 'صدر' }, icon: 'chest', search: ['pecs', 'pectorals', 'صدر'] },
  back: { label: { en: 'Back', ar: 'ظهر' }, icon: 'back', search: ['lats', 'ظهر', 'جوانح'] },
  shoulders: { label: { en: 'Shoulders', ar: 'أكتاف' }, icon: 'shoulders', search: ['delts', 'deltoids', 'كتف', 'اكتاف', 'دالية'] },
  biceps: { label: { en: 'Biceps', ar: 'بايسبس' }, icon: 'biceps', search: ['bi', 'bis', 'باي', 'بايسبس', 'ذراع امامي', 'العضلة ذات الرأسين'] },
  triceps: { label: { en: 'Triceps', ar: 'ترايسبس' }, icon: 'triceps', search: ['tri', 'tris', 'تراي', 'ترايسبس', 'ذراع خلفي', 'العضلة ثلاثية الرؤوس'] },
  forearms: { label: { en: 'Forearms', ar: 'سواعد' }, icon: 'forearms', search: ['grip', 'ساعد', 'سواعد', 'قبضة', 'فوراورم'] },
  legs: { label: { en: 'Legs', ar: 'أرجل' }, icon: 'legs', search: ['quads', 'hamstrings', 'رجل', 'ارجل', 'فخذ', 'افخاذ'] },
  glutes: { label: { en: 'Glutes', ar: 'الألوية' }, icon: 'glutes', search: ['butt', 'glute', 'الالوية', 'مؤخرة', 'جلوت'] },
  calves: { label: { en: 'Calves', ar: 'السمانة / الكالف' }, icon: 'calves', search: ['calf', 'سمانة', 'كالف', 'بطة الساق'] },
  abs: { label: { en: 'Abs / Core', ar: 'البطن' }, icon: 'abs', search: ['core', 'abdominals', 'six pack', 'بطن', 'معدة', 'كور', 'سكس باك'] },
  'full-body': { label: { en: 'Full Body', ar: 'الجسم كامل' }, icon: 'full-body', search: ['total body', 'functional', 'جسم كامل', 'فنكشنال'] },
  cardio: { label: { en: 'Cardio', ar: 'كارديو' }, icon: 'cardio', search: ['aerobic', 'conditioning', 'كارديو', 'هوائي', 'تحمل', 'ركض'] },
  'warm-up': { label: { en: 'Warm-Up', ar: 'الإحماء' }, icon: 'warm-up', search: ['warmup', 'احماء', 'تسخين'] },
  mobility: { label: { en: 'Mobility', ar: 'المرونة الحركية' }, icon: 'mobility', search: ['mobility', 'موبيليتي', 'مرونة', 'مدى حركي'] },
  stretching: { label: { en: 'Stretching', ar: 'الإطالة' }, icon: 'stretching', search: ['stretch', 'flexibility', 'اطالة', 'استطالة', 'تمدد', 'ستريتش'] },
  'cool-down': { label: { en: 'Cool-Down', ar: 'التهدئة' }, icon: 'cool-down', search: ['cooldown', 'تهدئة', 'تبريد'] },
} as const satisfies Record<string, Term & { icon: string }>;
export type Category = keyof typeof CATEGORIES;

/** Categories that represent resistance-training muscle groups. */
export const MUSCLE_CATEGORIES: Category[] = [
  'chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms',
  'legs', 'glutes', 'calves', 'abs', 'full-body',
];
/** Categories that are training purposes rather than muscle groups. */
export const TRAINING_CATEGORIES: Category[] = ['cardio', 'warm-up', 'mobility', 'stretching', 'cool-down'];

/* ------------------------------------------------------------------ */
/* Muscles (used for primary / secondary muscles)                      */
/* ------------------------------------------------------------------ */

export const MUSCLES = {
  chest: { label: { en: 'Chest (pectorals)', ar: 'الصدر' }, group: 'chest', search: ['pecs', 'صدر'] },
  'upper-chest': { label: { en: 'Upper chest', ar: 'أعلى الصدر' }, group: 'chest', search: ['clavicular', 'صدر علوي', 'صدر عالي'] },
  'lower-chest': { label: { en: 'Lower chest', ar: 'أسفل الصدر' }, group: 'chest', search: ['صدر سفلي', 'صدر واطي'] },
  'front-delts': { label: { en: 'Front delts', ar: 'الكتف الأمامي' }, group: 'shoulders', search: ['anterior deltoid', 'كتف امامي'] },
  'side-delts': { label: { en: 'Side delts', ar: 'الكتف الجانبي' }, group: 'shoulders', search: ['lateral deltoid', 'medial deltoid', 'كتف جانبي'] },
  'rear-delts': { label: { en: 'Rear delts', ar: 'الكتف الخلفي' }, group: 'shoulders', search: ['posterior deltoid', 'كتف خلفي'] },
  'rotator-cuff': { label: { en: 'Rotator cuff', ar: 'الكفة المدورة' }, group: 'shoulders', search: ['الكفة المدورة'] },
  lats: { label: { en: 'Lats', ar: 'الظهر العريض (الجوانح)' }, group: 'back', search: ['latissimus', 'جوانح', 'لاتس'] },
  'upper-back': { label: { en: 'Upper back (rhomboids & mid traps)', ar: 'أعلى الظهر' }, group: 'back', search: ['rhomboids', 'وسط الظهر', 'معينية'] },
  traps: { label: { en: 'Traps', ar: 'الترابيس' }, group: 'back', search: ['trapezius', 'ترابيس', 'رقبة', 'شبه المنحرفة'] },
  'lower-back': { label: { en: 'Lower back (spinal erectors)', ar: 'أسفل الظهر' }, group: 'back', search: ['erectors', 'ظهر سفلي', 'قطنية'] },
  biceps: { label: { en: 'Biceps', ar: 'البايسبس' }, group: 'biceps', search: ['باي', 'بايسبس'] },
  brachialis: { label: { en: 'Brachialis', ar: 'العضدية' }, group: 'biceps', search: ['عضدية'] },
  triceps: { label: { en: 'Triceps', ar: 'الترايسبس' }, group: 'triceps', search: ['تراي', 'ترايسبس'] },
  forearms: { label: { en: 'Forearms & grip', ar: 'السواعد والقبضة' }, group: 'forearms', search: ['brachioradialis', 'grip', 'ساعد', 'قبضة'] },
  quads: { label: { en: 'Quadriceps', ar: 'عضلات الفخذ الأمامية' }, group: 'legs', search: ['quads', 'فخذ امامي', 'رباعية'] },
  hamstrings: { label: { en: 'Hamstrings', ar: 'عضلات الفخذ الخلفية' }, group: 'legs', search: ['hams', 'فخذ خلفي', 'همسترنج'] },
  adductors: { label: { en: 'Adductors (inner thigh)', ar: 'العضلات المقربة (الفخذ الداخلي)' }, group: 'legs', search: ['inner thigh', 'فخذ داخلي'] },
  glutes: { label: { en: 'Glutes', ar: 'الألوية' }, group: 'glutes', search: ['gluteus maximus', 'مؤخرة', 'جلوت'] },
  'glute-med': { label: { en: 'Glute medius (outer hip)', ar: 'الألوية الوسطى (الورك الخارجي)' }, group: 'glutes', search: ['abductors', 'outer thigh', 'فخذ خارجي'] },
  'hip-flexors': { label: { en: 'Hip flexors', ar: 'العضلات المثنية للورك' }, group: 'legs', search: ['iliopsoas', 'مثنيات الورك'] },
  calves: { label: { en: 'Calves', ar: 'السمانة (الكالف)' }, group: 'calves', search: ['gastrocnemius', 'soleus', 'كالف', 'سمانة'] },
  tibialis: { label: { en: 'Tibialis anterior (shin)', ar: 'العضلة الظنبوبية الأمامية' }, group: 'calves', search: ['shin', 'قصبة', 'ساق امامي'] },
  abs: { label: { en: 'Abs (rectus abdominis)', ar: 'عضلات البطن' }, group: 'abs', search: ['six pack', 'بطن', 'سكس باك'] },
  obliques: { label: { en: 'Obliques', ar: 'الخواصر (العضلات المائلة)' }, group: 'abs', search: ['side abs', 'خواصر', 'جوانب البطن'] },
  'deep-core': { label: { en: 'Deep core (transverse abdominis)', ar: 'عضلات الجذع العميقة' }, group: 'abs', search: ['core', 'transverse', 'كور', 'جذع'] },
  neck: { label: { en: 'Neck', ar: 'الرقبة' }, group: 'back', search: ['رقبة'] },
  'cardio-system': { label: { en: 'Heart & lungs (cardiovascular)', ar: 'القلب والرئتين' }, group: 'cardio', search: ['cardiovascular', 'قلب', 'رئة', 'تنفس'] },
} as const satisfies Record<string, Term & { group: Category }>;
export type Muscle = keyof typeof MUSCLES;

/* ------------------------------------------------------------------ */
/* Equipment                                                            */
/* ------------------------------------------------------------------ */

export const EQUIPMENT = {
  barbell: { label: { en: 'Barbell', ar: 'بار حديد' }, search: ['bar', 'بار', 'عمود'] },
  'ez-bar': { label: { en: 'EZ bar', ar: 'بار زكزاك (EZ)' }, search: ['ez', 'curl bar', 'زكزاك', 'بار معوج'] },
  dumbbell: { label: { en: 'Dumbbell', ar: 'دمبل' }, search: ['db', 'dumbbells', 'دمبلص', 'دمبلات', 'دنابل'] },
  cable: { label: { en: 'Cable', ar: 'كيبل' }, search: ['pulley', 'cable machine', 'كيبل', 'بكرة', 'سحب كيبل'] },
  machine: { label: { en: 'Machine', ar: 'جهاز' }, search: ['machine', 'جهاز', 'مكينة', 'ماكينة'] },
  'smith-machine': { label: { en: 'Smith machine', ar: 'جهاز السميث' }, search: ['smith', 'سميث'] },
  kettlebell: { label: { en: 'Kettlebell', ar: 'كيتل بيل' }, search: ['kb', 'كيتلبيل', 'كتلبل'] },
  band: { label: { en: 'Resistance band', ar: 'حبل مطاطي' }, search: ['band', 'resistance band', 'مطاط', 'باند'] },
  bodyweight: { label: { en: 'Bodyweight', ar: 'وزن الجسم' }, search: ['no equipment', 'calisthenics', 'بدون اوزان', 'بدون ادوات', 'كاليسثنكس'] },
  bench: { label: { en: 'Bench', ar: 'مسطبة (بنج)' }, search: ['bench', 'مصطبة', 'مسطبة', 'كرسي'] },
  'pull-up-bar': { label: { en: 'Pull-up bar', ar: 'عقلة' }, search: ['bar', 'chin-up bar', 'عقلة', 'بار علوي'] },
  'dip-station': { label: { en: 'Dip station / parallel bars', ar: 'متوازي' }, search: ['dip bars', 'parallel bars', 'متوازي', 'ديبس'] },
  plate: { label: { en: 'Weight plate', ar: 'صحن حديد' }, search: ['plate', 'صحن', 'قرص'] },
  'cardio-machine': { label: { en: 'Cardio machine', ar: 'جهاز كارديو' }, search: ['treadmill', 'bike', 'elliptical', 'سير', 'دراجة', 'اوبتكال'] },
  'jump-rope': { label: { en: 'Jump rope', ar: 'حبل قفز' }, search: ['skipping rope', 'حبل', 'نط الحبل'] },
  'medicine-ball': { label: { en: 'Medicine ball', ar: 'كرة طبية' }, search: ['med ball', 'كرة طبية'] },
  'ab-wheel': { label: { en: 'Ab wheel', ar: 'عجلة البطن' }, search: ['ab roller', 'عجلة', 'رولر'] },
  'foam-roller': { label: { en: 'Foam roller', ar: 'رول الإسفنج (فوم رولر)' }, search: ['foam roller', 'فوم رولر', 'رول'] },
  'battle-rope': { label: { en: 'Battle rope', ar: 'حبال المعركة' }, search: ['battle ropes', 'حبال'] },
  box: { label: { en: 'Plyo box / step', ar: 'صندوق / درجة' }, search: ['box', 'step', 'صندوق', 'درجة'] },
  landmine: { label: { en: 'Landmine', ar: 'لاندماين' }, search: ['landmine', 'لاندماين'] },
  'trap-bar': { label: { en: 'Trap bar (hex bar)', ar: 'بار سداسي (تراب بار)' }, search: ['hex bar', 'trap bar', 'بار سداسي'] },
  'roman-chair': { label: { en: 'Back-extension bench (Roman chair)', ar: 'جهاز تمديد الظهر (الكرسي الروماني)' }, search: ['hyperextension bench', 'roman chair', 'كرسي روماني', 'جهاز الظهر'] },
  bicycle: { label: { en: 'Bicycle', ar: 'دراجة هوائية' }, search: ['bike', 'دراجة', 'بايسكل'] },
} as const satisfies Record<string, Term>;
export type Equipment = keyof typeof EQUIPMENT;

/** Equipment shown as primary filters (spec list). */
export const PRIMARY_EQUIPMENT_FILTERS: Equipment[] = [
  'barbell', 'dumbbell', 'cable', 'machine', 'smith-machine', 'kettlebell',
  'band', 'bodyweight', 'bench', 'pull-up-bar',
];

/* ------------------------------------------------------------------ */
/* Difficulty (contextual, not a medical classification)               */
/* ------------------------------------------------------------------ */

export const DIFFICULTY = {
  beginner: { label: { en: 'Beginner', ar: 'مبتدئ' }, dot: '🟢', search: ['easy', 'سهل', 'مبتدئ', 'مبتدئين'] },
  intermediate: { label: { en: 'Intermediate', ar: 'متوسط' }, dot: '🟡', search: ['medium', 'متوسط'] },
  advanced: { label: { en: 'Advanced', ar: 'متقدم' }, dot: '🔴', search: ['hard', 'pro', 'صعب', 'متقدم', 'محترف'] },
} as const satisfies Record<string, Term & { dot: string }>;
export type Difficulty = keyof typeof DIFFICULTY;

/* ------------------------------------------------------------------ */
/* Movement patterns                                                    */
/* ------------------------------------------------------------------ */

export const PATTERNS = {
  push: { label: { en: 'Push', ar: 'دفع' }, search: ['press', 'دفع', 'ضغط'] },
  pull: { label: { en: 'Pull', ar: 'سحب' }, search: ['row', 'سحب', 'تجديف'] },
  squat: { label: { en: 'Squat', ar: 'قرفصاء (سكوات)' }, search: ['squat', 'سكوات', 'قرفصاء'] },
  hinge: { label: { en: 'Hinge', ar: 'ثني الورك' }, search: ['hip hinge', 'deadlift', 'ديدلفت', 'رفعة ميتة'] },
  lunge: { label: { en: 'Lunge / single-leg', ar: 'طعن (رجل واحدة)' }, search: ['lunge', 'single leg', 'لانج', 'طعن'] },
  carry: { label: { en: 'Carry', ar: 'حمل ومشي' }, search: ['carry', 'loaded carry', 'حمل', 'مشي بالاوزان'] },
  rotation: { label: { en: 'Rotation', ar: 'دوران' }, search: ['twist', 'دوران', 'لف'] },
  'anti-rotation': { label: { en: 'Anti-rotation', ar: 'مقاومة الدوران' }, search: ['anti rotation', 'مقاومة الدوران'] },
  'anti-extension': { label: { en: 'Anti-extension', ar: 'مقاومة تقوس الظهر' }, search: ['anti extension', 'plank', 'بلانك'] },
  flexion: { label: { en: 'Trunk flexion', ar: 'ثني الجذع' }, search: ['crunch', 'كرنش', 'طحن'] },
  locomotion: { label: { en: 'Locomotion / cyclic', ar: 'حركة متكررة (مشي، ركض، تجديف)' }, search: ['gait', 'مشي', 'ركض'] },
} as const satisfies Record<string, Term>;
export type MovementPattern = keyof typeof PATTERNS;

/* ------------------------------------------------------------------ */
/* Exercise type                                                        */
/* ------------------------------------------------------------------ */

export const EXERCISE_TYPES = {
  compound: { label: { en: 'Compound', ar: 'مركّب' }, search: ['multi-joint', 'مركب', 'متعدد المفاصل'] },
  isolation: { label: { en: 'Isolation', ar: 'عزل' }, search: ['single-joint', 'عزل', 'معزول'] },
  isometric: { label: { en: 'Isometric (hold)', ar: 'ثبات (أيزومتري)' }, search: ['hold', 'static', 'ثبات'] },
  plyometric: { label: { en: 'Plyometric / power', ar: 'بلايومترك / قوة انفجارية' }, search: ['jump', 'explosive', 'power', 'قفز', 'انفجاري'] },
  cardio: { label: { en: 'Cardio', ar: 'كارديو' }, search: ['aerobic', 'كارديو'] },
  mobility: { label: { en: 'Mobility drill', ar: 'تمرين مرونة حركية' }, search: ['mobility', 'موبيليتي'] },
  stretch: { label: { en: 'Stretch', ar: 'إطالة' }, search: ['stretch', 'اطالة'] },
} as const satisfies Record<string, Term>;
export type ExerciseType = keyof typeof EXERCISE_TYPES;

/* ------------------------------------------------------------------ */
/* Training era (browsing aid — no value judgement)                    */
/* ------------------------------------------------------------------ */

export const ERAS = {
  classic: { label: { en: 'Classic / Old school', ar: 'كلاسيك / أولد سكول' }, search: ['old school', 'golden era', 'اولد سكول', 'كلاسيك', 'قديم'] },
  modern: { label: { en: 'Modern', ar: 'حديث' }, search: ['modern', 'new', 'حديث', 'مودرن'] },
} as const satisfies Record<string, Term>;
export type Era = keyof typeof ERAS;

/* ------------------------------------------------------------------ */
/* Training goals                                                       */
/* ------------------------------------------------------------------ */

export const GOALS = {
  'muscle-gain': { label: { en: 'Muscle gain', ar: 'بناء العضلات' }, search: ['hypertrophy', 'bulk', 'تضخيم', 'ضخامة'] },
  'fat-loss': { label: { en: 'Fat loss', ar: 'خسارة الدهون' }, search: ['cut', 'weight loss', 'تنشيف', 'تنحيف', 'حرق'] },
  'general-fitness': { label: { en: 'General fitness', ar: 'لياقة عامة' }, search: ['health', 'لياقة', 'صحة'] },
  strength: { label: { en: 'Strength', ar: 'القوة' }, search: ['power', 'قوة'] },
  conditioning: { label: { en: 'Conditioning', ar: 'التحمل واللياقة القلبية' }, search: ['endurance', 'stamina', 'تحمل', 'نفس'] },
  'beginner-fitness': { label: { en: 'Beginner fitness', ar: 'لياقة المبتدئين' }, search: ['start', 'مبتدئ', 'بداية'] },
  athletic: { label: { en: 'Athletic performance', ar: 'الأداء الرياضي' }, search: ['sport', 'athlete', 'رياضي', 'اداء'] },
  mobility: { label: { en: 'Mobility & flexibility', ar: 'المرونة والحركة' }, search: ['flexibility', 'مرونة'] },
} as const satisfies Record<string, Term>;
export type Goal = keyof typeof GOALS;
