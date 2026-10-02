/**
 * Goal journeys ("هدفي"): a data-driven navigation layer over the existing
 * tools — the calculator, meal planner, workout builders, exercise library,
 * guides and articles. Adding a goal = adding one object here (plus its id in
 * ./goal-ids.ts). No personalised coaching is implied and no results are
 * promised: every step simply points to a real page of the site.
 */
import type { IconName } from '../components/icons';
import type { Localized } from '../i18n/types';
import type { Exercise } from './exercises/types';
import { POWERLIFTING_GROUPS, isConditioning, isHomeBodyweight, isHomeFriendly } from './programs';
import type { GoalId } from './goal-ids';

export { GOAL_IDS, type GoalId } from './goal-ids';

export interface JourneyStep {
  title: Localized;
  text: Localized;
  /** Language-neutral path, optionally with a query string / hash. */
  path: string;
  cta: Localized;
}

/** A short list of exercises shown on the journey page (resolved at build time). */
export interface ExerciseGroup {
  title: Localized;
  /** Curated slugs (must exist), in display order… */
  slugs?: string[];
  /** …or a rule over the exercise data. */
  match?: (e: Exercise) => boolean;
  limit?: number;
  /** Library link that shows the whole group. */
  more?: string;
}

export interface GoalJourney {
  id: GoalId;
  icon: IconName;
  title: Localized;
  /** One-line summary for the goal picker. */
  short: Localized;
  /** Heading of the journey page. */
  heading: Localized;
  intro: Localized;
  steps: JourneyStep[];
  /** Show the beginner-mode switch on the journey page. */
  beginnerMode?: boolean;
  /** Feature the home-workout builder on the journey page. */
  homeBuilder?: boolean;
  exerciseGroups?: ExerciseGroup[];
}

const technique: JourneyStep = {
  title: { ar: 'تعلّم الأداء الصحيح', en: 'Learn correct technique' },
  text: { ar: 'كل تمرين له شرح خطوة بخطوة، والأخطاء الشائعة، والعضلة المستهدفة باللون الأخضر.', en: 'Every exercise has step-by-step instructions, common mistakes and the target muscle in green.' },
  path: '/articles/proper-technique/',
  cta: { ar: 'أساسيات التقنية', en: 'Technique basics' },
};

const recoveryGuide: JourneyStep = {
  title: { ar: 'التعافي والنوم', en: 'Recovery and sleep' },
  text: { ar: 'الراحة والنوم والإحماء وإدارة الحمل التدريبي جزء من الخطة، وليست وقتاً ضائعاً.', en: 'Rest, sleep, warm-ups and managing training load are part of the plan, not wasted time.' },
  path: '/learn/recovery/',
  cta: { ar: 'دليل التعافي', en: 'Recovery guide' },
};

const warmUp: JourneyStep = {
  title: { ar: 'ابدأ بالإحماء الصحيح', en: 'Warm up properly' },
  text: { ar: 'لماذا الإحماء مهم وكيف تسويه.', en: 'Why warming up matters and how to do it.' },
  path: '/articles/warm-up/',
  cta: { ar: 'اقرأ عن الإحماء', en: 'Read about warming up' },
};

const trackProgress: JourneyStep = {
  title: { ar: 'سجّل تقدّمك', en: 'Track your progress' },
  text: { ar: 'احفظ تمارينك المفضلة وسجّل ما أكملته — يُحفظ على جهازك بدون حساب.', en: 'Save favourite exercises and record what you complete — kept on your device, no account needed.' },
  path: '/progress/',
  cta: { ar: 'تقدّمي', en: 'My progress' },
};

const PREP = ['warm-up', 'mobility', 'stretching', 'cool-down'];

export const GOAL_JOURNEYS: GoalJourney[] = [
  {
    id: 'weight-loss',
    icon: 'flame',
    title: { ar: 'خسارة الوزن', en: 'Weight loss' },
    short: { ar: 'سعرات، وجبات، وخطة تدريب', en: 'Calories, meals and a training plan' },
    heading: { ar: 'ابدأ رحلة خسارة الوزن', en: 'Start your weight-loss journey' },
    intro: {
      ar: 'خسارة الوزن تعتمد على عجز معتدل في السعرات مع تمرين منتظم ونوم كافٍ. اتبع الخطوات بالترتيب — كل خطوة تفتح أداة من أدوات الموقع. النتائج تختلف من شخص لآخر، ولا توجد أرقام مضمونة.',
      en: 'Weight loss comes from a moderate calorie deficit, regular training and enough sleep. Follow the steps in order — each one opens a tool on this site. Results differ from person to person; there are no guaranteed numbers.',
    },
    steps: [
      {
        title: { ar: 'افهم الأساس: خسارة الوزن بشكل تدريجي', en: 'Understand the basics: gradual weight loss' },
        text: { ar: 'دليل مبسّط: توازن الطاقة، العجز المعتدل، البروتين، الحركة، النوم، ومتابعة التقدّم.', en: 'A simple guide: energy balance, a moderate deficit, protein, activity, sleep and tracking progress.' },
        path: '/learn/weight-loss/',
        cta: { ar: 'اقرأ الدليل', en: 'Read the guide' },
      },
      {
        title: { ar: 'احسب BMR و TDEE', en: 'Calculate your BMR and TDEE' },
        text: { ar: 'الحاسبة تعطيك نطاقاً تقديرياً لخسارة الدهون بعجز معتدل وآمن.', en: 'The calculator gives an estimated fat-loss range with a moderate, safe deficit.' },
        path: '/calculator/?goal=loss',
        cta: { ar: 'احسب سعراتك', en: 'Calculate calories' },
      },
      {
        title: { ar: 'افهم احتياجك من السعرات', en: 'Understand your calorie needs' },
        text: { ar: 'ما هي السعرة، ولماذا تختلف احتياجات كل شخص.', en: 'What a calorie is and why everyone’s needs differ.' },
        path: '/articles/calories/',
        cta: { ar: 'اقرأ عن السعرات', en: 'Read about calories' },
      },
      {
        title: { ar: 'حدّد هدفاً واقعياً', en: 'Set a realistic target' },
        text: { ar: 'توازن الطاقة: لماذا العجز المعتدل أفضل من الحرمان الشديد.', en: 'Energy balance: why a moderate deficit beats extreme restriction.' },
        path: '/articles/energy-balance/',
        cta: { ar: 'توازن الطاقة', en: 'Energy balance' },
      },
      {
        title: { ar: 'اختر وجباتك', en: 'Choose your meals' },
        text: { ar: 'وجبات بسيطة من أكل نعرفه، مع حصص بطريقة اليد.', en: 'Simple meals from familiar foods, with hand-sized portions.' },
        path: '/nutrition/meals/?goal=loss',
        cta: { ar: 'خطط وجباتك', en: 'Plan meals' },
      },
      {
        title: { ar: 'ابنِ خطة تدريب حسب مستواك', en: 'Build a plan for your level' },
        text: { ar: 'اختر خبرتك وعدد الأيام والمعدات، وخذ أسبوعاً كاملاً من التمارين.', en: 'Pick your experience, days and equipment and get a full week of training.' },
        path: '/workouts/?goal=fat-loss#builder',
        cta: { ar: 'ابنِ برنامجك', en: 'Build a plan' },
      },
      {
        title: { ar: 'يوم ما تكدر تروح للجم', en: 'On days you can’t get to the gym' },
        text: { ar: 'جلسة منزلية قصيرة بوقتك ومعداتك.', en: 'A short home session for your time and equipment.' },
        path: '/workouts/home/?goal=fat-loss',
        cta: { ar: 'تمرّن من البيت', en: 'Train at home' },
      },
      {
        title: { ar: 'اختر تمارين مناسبة', en: 'Find suitable exercises' },
        text: { ar: 'تمارين المكتبة المناسبة لهدف خسارة الدهون.', en: 'Library exercises that suit a fat-loss goal.' },
        path: '/exercises/?goal=fat-loss',
        cta: { ar: 'تصفّح التمارين', en: 'Browse exercises' },
      },
      technique,
    ],
  },
  {
    id: 'muscle-gain',
    icon: 'dumbbell',
    title: { ar: 'بناء العضلات', en: 'Build muscle' },
    short: { ar: 'تدريب مقاومة وبروتين كافٍ', en: 'Resistance training and enough protein' },
    heading: { ar: 'ابدأ رحلة بناء العضلات', en: 'Start building muscle' },
    intro: {
      ar: 'بناء العضلات يحتاج تدريب مقاومة منتظماً بتقنية صحيحة، وزيادة تدريجية في الحمل، وبروتين وسعرات كافية، ونوماً جيداً.',
      en: 'Building muscle takes regular resistance training with good technique, gradual progression, enough protein and calories, and good sleep.',
    },
    steps: [
      {
        title: { ar: 'افهم الأساس: بناء العضلات بشكل طبيعي', en: 'Understand the basics: building muscle naturally' },
        text: { ar: 'التحميل التدريجي، الحجم التدريبي، البروتين، السعرات، والنوم — بدون وعود غير واقعية.', en: 'Progressive overload, training volume, protein, calories and sleep — without unrealistic promises.' },
        path: '/learn/muscle-gain/',
        cta: { ar: 'اقرأ الدليل', en: 'Read the guide' },
      },
      {
        title: { ar: 'احسب سعراتك', en: 'Calculate your calories' },
        text: { ar: 'نطاق تقديري لفائض صغير يدعم البناء بدون زيادة دهون كبيرة.', en: 'An estimated small-surplus range that supports gaining without excess fat.' },
        path: '/calculator/?goal=gain',
        cta: { ar: 'احسب سعراتك', en: 'Calculate calories' },
      },
      {
        title: { ar: 'البروتين', en: 'Protein' },
        text: { ar: 'كم تحتاج، ومن أين تحصل عليه من أكل متوفر.', en: 'How much you need and where to get it from everyday food.' },
        path: '/articles/protein/',
        cta: { ar: 'اقرأ عن البروتين', en: 'Read about protein' },
      },
      {
        title: { ar: 'اختر وجباتك', en: 'Choose your meals' },
        text: { ar: 'وجبات بسيطة مع حصص مناسبة لهدف البناء.', en: 'Simple meals with portions suited to building muscle.' },
        path: '/nutrition/meals/?goal=gain',
        cta: { ar: 'خطط وجباتك', en: 'Plan meals' },
      },
      {
        title: { ar: 'ابنِ خطة تدريب', en: 'Build a training plan' },
        text: { ar: 'أسبوع تدريب كامل حسب خبرتك وأيامك ومعداتك.', en: 'A full training week for your experience, days and equipment.' },
        path: '/workouts/?goal=muscle-gain#builder',
        cta: { ar: 'ابنِ برنامجك', en: 'Build a plan' },
      },
      {
        title: { ar: 'تمارين البناء', en: 'Muscle-building exercises' },
        text: { ar: 'تمارين المكتبة المناسبة لهدف بناء العضلات.', en: 'Library exercises suited to building muscle.' },
        path: '/exercises/?goal=muscle-gain',
        cta: { ar: 'تصفّح التمارين', en: 'Browse exercises' },
      },
      technique,
      recoveryGuide,
      trackProgress,
    ],
  },
  {
    id: 'maintain',
    icon: 'scale',
    title: { ar: 'المحافظة على الوزن', en: 'Maintain weight' },
    short: { ar: 'توازن في الأكل والحركة', en: 'Balance food and activity' },
    heading: { ar: 'حافظ على وزنك بثبات', en: 'Keep your weight steady' },
    intro: {
      ar: 'المحافظة على الوزن تعني توازن ما تأكله مع ما تحرقه، مع تمرين منتظم يحافظ على القوة واللياقة.',
      en: 'Maintaining weight means balancing what you eat with what you burn, plus regular training to keep strength and fitness.',
    },
    steps: [
      {
        title: { ar: 'احسب سعرات المحافظة', en: 'Calculate maintenance calories' },
        text: { ar: 'نطاق تقديري يحافظ على وزنك الحالي.', en: 'An estimated range that keeps your current weight.' },
        path: '/calculator/?goal=maintain',
        cta: { ar: 'احسب سعراتك', en: 'Calculate calories' },
      },
      {
        title: { ar: 'أكل صحي متوازن', en: 'Balanced, healthy eating' },
        text: { ar: 'قواعد بسيطة للأكل اليومي بدون حرمان.', en: 'Simple everyday eating rules without restriction.' },
        path: '/articles/healthy-eating/',
        cta: { ar: 'اقرأ المقال', en: 'Read the article' },
      },
      {
        title: { ar: 'اختر وجباتك', en: 'Choose your meals' },
        text: { ar: 'وجبات بسيطة بحصص للمحافظة.', en: 'Simple meals with maintenance portions.' },
        path: '/nutrition/meals/?goal=maintain',
        cta: { ar: 'خطط وجباتك', en: 'Plan meals' },
      },
      {
        title: { ar: 'ابنِ خطة تدريب', en: 'Build a training plan' },
        text: { ar: 'برنامج لياقة عامة يناسب وقتك.', en: 'A general-fitness plan that fits your schedule.' },
        path: '/workouts/?goal=general-fitness#builder',
        cta: { ar: 'ابنِ برنامجك', en: 'Build a plan' },
      },
      {
        title: { ar: 'الحركة اليومية', en: 'Daily movement' },
        text: { ar: 'المشي والحركة خارج القاعة لهما أثر كبير.', en: 'Walking and moving outside the gym matter a lot.' },
        path: '/articles/daily-movement/',
        cta: { ar: 'اقرأ المقال', en: 'Read the article' },
      },
      recoveryGuide,
    ],
  },
  {
    id: 'fitness',
    icon: 'heart',
    title: { ar: 'تحسين اللياقة', en: 'Improve fitness' },
    short: { ar: 'تحمّل، كارديو، وحركة أفضل', en: 'Endurance, cardio and better movement' },
    heading: { ar: 'حسّن لياقتك خطوة بخطوة', en: 'Improve your fitness step by step' },
    intro: {
      ar: 'اللياقة تتحسن بالتدرّج: كارديو منتظم، تمارين قوة أساسية، وإحماء جيد قبل كل تمرين.',
      en: 'Fitness improves gradually: regular cardio, basic strength work and a good warm-up before every session.',
    },
    steps: [
      warmUp,
      {
        title: { ar: 'ابنِ خطة لياقة', en: 'Build a conditioning plan' },
        text: { ar: 'برنامج يجمع القوة والكارديو حسب مستواك.', en: 'A plan that combines strength and cardio for your level.' },
        path: '/workouts/?goal=conditioning#builder',
        cta: { ar: 'ابنِ برنامجك', en: 'Build a plan' },
      },
      {
        title: { ar: 'تمارين الكارديو', en: 'Cardio exercises' },
        text: { ar: 'مشي، جري، دراجة، تجديف ونط الحبل — مع الشرح.', en: 'Walking, running, cycling, rowing and jump rope — explained.' },
        path: '/exercises/?category=cardio',
        cta: { ar: 'تمارين الكارديو', en: 'Cardio exercises' },
      },
      {
        title: { ar: 'الحركة اليومية', en: 'Daily movement' },
        text: { ar: 'خطوات بسيطة لنشاط أكثر خلال اليوم.', en: 'Simple ways to be more active through the day.' },
        path: '/articles/daily-movement/',
        cta: { ar: 'اقرأ المقال', en: 'Read the article' },
      },
      {
        title: { ar: 'احسب سعراتك', en: 'Calculate your calories' },
        text: { ar: 'اعرف احتياجك اليومي التقديري.', en: 'Know your estimated daily needs.' },
        path: '/calculator/',
        cta: { ar: 'احسب سعراتك', en: 'Calculate calories' },
      },
      recoveryGuide,
    ],
  },
  {
    id: 'beginner',
    icon: 'user',
    title: { ar: 'أنا مبتدئ', en: 'I’m a beginner' },
    short: { ar: 'وضع المبتدئ، تمارين سهلة، وخطة آمنة', en: 'Beginner mode, easy exercises and a safe plan' },
    heading: { ar: 'ابدأ كمبتدئ بثقة', en: 'Start with confidence as a beginner' },
    intro: {
      ar: 'فعّل وضع المبتدئ ليعرض لك الموقع التمارين المناسبة للمبتدئين أولاً — من نفس مكتبة التمارين، ويمكنك عرض كل التمارين متى ما شئت. ثم اتبع الخطوات بالترتيب.',
      en: 'Turn on beginner mode and the site shows beginner-friendly exercises first — from the same exercise library, and you can show every exercise whenever you like. Then follow the steps in order.',
    },
    beginnerMode: true,
    steps: [
      {
        title: { ar: 'اقرأ دليل المبتدئ', en: 'Read the beginner guide' },
        text: { ar: 'كم يوماً تتمرن، كيف تختار الوزن، الراحة، والتقدّم — بشكل بسيط.', en: 'How many days to train, choosing weights, rest and progress — simply explained.' },
        path: '/beginner/',
        cta: { ar: 'دليل المبتدئ', en: 'Beginner guide' },
      },
      warmUp,
      {
        title: { ar: 'تمارين مناسبة للمبتدئين', en: 'Beginner-friendly exercises' },
        text: { ar: 'نفس المكتبة مع تصفية المستوى: مناسب للمبتدئين.', en: 'The same library, filtered to beginner-friendly exercises.' },
        path: '/exercises/?difficulty=beginner',
        cta: { ar: 'تصفّح التمارين', en: 'Browse exercises' },
      },
      {
        title: { ar: 'ابنِ أول برنامج', en: 'Build your first plan' },
        text: { ar: 'جسم كامل 2–3 أيام بالأسبوع، والتقنية أولاً.', en: 'Full body 2–3 days a week, technique first.' },
        path: '/workouts/?goal=beginner-fitness#builder',
        cta: { ar: 'ابنِ برنامجك', en: 'Build a plan' },
      },
      technique,
      {
        title: { ar: 'أخطاء شائعة عند البداية', en: 'Common beginner mistakes' },
        text: { ar: 'أخطاء بسيطة تبطئ التقدّم وكيف تتجنبها.', en: 'Simple mistakes that slow progress and how to avoid them.' },
        path: '/articles/beginner-mistakes/',
        cta: { ar: 'اقرأ المقال', en: 'Read the article' },
      },
      recoveryGuide,
      trackProgress,
    ],
    exerciseGroups: [
      {
        title: { ar: 'تمارين أساسية للبداية', en: 'Starter exercises' },
        slugs: ['goblet-squat', 'leg-press', 'push-up', 'dumbbell-bench-press', 'lat-pulldown', 'seated-cable-row', 'dumbbell-shoulder-press', 'glute-bridge', 'plank', 'dead-bug'],
        more: '/exercises/?difficulty=beginner',
      },
    ],
  },
  {
    id: 'powerlifting',
    icon: 'barbell',
    title: { ar: 'باورلفتنك', en: 'Powerlifting' },
    short: { ar: 'سكوات، بنش، وديدلفت', en: 'Squat, bench press and deadlift' },
    heading: { ar: 'مسار الباورلفتنك', en: 'Powerlifting pathway' },
    intro: {
      ar: 'الباورلفتنك رياضة قوة تقوم على ثلاث رفعات: القرفصاء (سكوات)، ضغط البنش، والرفعة الميتة (ديدلفت). هذا المسار أداة تعليمية وتخطيطية تجمع الرفعات وتمارينها الداعمة من مكتبتنا، وليس تدريباً معتمداً ولا يرتبط بأي اتحاد. تعلّم التقنية مع المدرب قبل رفع أوزان ثقيلة.',
      en: 'Powerlifting is a strength sport built on three lifts: the squat, the bench press and the deadlift. This pathway is an educational planning tool that gathers the lifts and their supporting exercises from our library; it is not certified coaching and is not affiliated with any federation. Learn the technique with a coach before lifting heavy.',
    },
    steps: [
      technique,
      warmUp,
      {
        title: { ar: 'ابنِ خطة باورلفتنك', en: 'Build a powerlifting plan' },
        text: { ar: '2–4 أيام بالأسبوع حول الرفعات الثلاث، مع تمارين داعمة حسب خبرتك ومعداتك.', en: '2–4 days a week around the three lifts, with supporting exercises for your experience and equipment.' },
        path: '/workouts/?goal=powerlifting#builder',
        cta: { ar: 'ابنِ برنامجك', en: 'Build a plan' },
      },
      {
        title: { ar: 'كل تمارين المسار', en: 'All pathway exercises' },
        text: { ar: 'الرفعات الأساسية وتنويعاتها والتمارين الداعمة في المكتبة.', en: 'The main lifts, their variations and supporting exercises in the library.' },
        path: '/exercises/?program=powerlifting',
        cta: { ar: 'تصفّح التمارين', en: 'Browse exercises' },
      },
      {
        title: { ar: 'محتوى PRO', en: 'PRO content' },
        text: { ar: 'مفاهيم متقدمة مثل الحمل التدريجي وإدارة التعب.', en: 'Advanced concepts such as progression and fatigue management.' },
        path: '/advanced/',
        cta: { ar: 'محتوى المتقدمين', en: 'Advanced content' },
      },
      recoveryGuide,
      trackProgress,
    ],
    exerciseGroups: POWERLIFTING_GROUPS.map((g) => ({ title: g.title, slugs: g.slugs, more: '/exercises/?program=powerlifting' })),
  },
  {
    id: 'conditioning',
    icon: 'bolt',
    title: { ar: 'اللياقة والرشاقة', en: 'Fitness & conditioning' },
    short: { ar: 'كارديو، دوائر تدريب، وحركة أخف', en: 'Cardio, circuits and lighter movement' },
    heading: { ar: 'مسار اللياقة والرشاقة', en: 'Fitness & conditioning pathway' },
    intro: {
      ar: 'تدريب وظيفي (Functional) ودوائر لياقة وكارديو وتمارين مرونة، من نفس مكتبة التمارين. يناسب من يريد نفساً أطول وحركة أخف. ابدأ بشدة معتدلة وزِد تدريجياً.',
      en: 'Functional training, conditioning circuits, cardio and mobility work, from the same exercise library. For anyone who wants better stamina and lighter movement. Start at a moderate intensity and build up gradually.',
    },
    steps: [
      warmUp,
      {
        title: { ar: 'ابنِ خطة لياقة أسبوعية', en: 'Build a weekly conditioning plan' },
        text: { ar: 'قوة + دوائر تحمل حسب مستواك وأيامك.', en: 'Strength plus conditioning circuits for your level and days.' },
        path: '/workouts/?goal=conditioning#builder',
        cta: { ar: 'ابنِ برنامجك', en: 'Build a plan' },
      },
      {
        title: { ar: 'دائرة سريعة من البيت', en: 'A quick circuit at home' },
        text: { ar: '10–45 دقيقة بدون معدات أو بمعدات بسيطة.', en: '10–45 minutes with no or simple equipment.' },
        path: '/workouts/home/?goal=conditioning',
        cta: { ar: 'تمرّن من البيت', en: 'Train at home' },
      },
      {
        title: { ar: 'تمارين المسار', en: 'Pathway exercises' },
        text: { ar: 'كارديو، تمارين الجسم كامل، وتمارين القوة الانفجارية.', en: 'Cardio, full-body and power exercises.' },
        path: '/exercises/?program=conditioning',
        cta: { ar: 'تصفّح التمارين', en: 'Browse exercises' },
      },
      {
        title: { ar: 'المرونة الحركية', en: 'Mobility' },
        text: { ar: 'حركة أسهل ومدى أفضل للمفاصل.', en: 'Easier movement and better joint range.' },
        path: '/exercises/?category=mobility',
        cta: { ar: 'تمارين المرونة', en: 'Mobility exercises' },
      },
      recoveryGuide,
    ],
    exerciseGroups: [
      { title: { ar: 'كارديو', en: 'Cardio' }, match: (e) => e.category === 'cardio', limit: 8, more: '/exercises/?category=cardio' },
      { title: { ar: 'الجسم كامل وقوة انفجارية', en: 'Full body & power' }, match: (e) => isConditioning(e) && e.category !== 'cardio' && !PREP.includes(e.category), limit: 10, more: '/exercises/?program=conditioning' },
      { title: { ar: 'مرونة حركية', en: 'Mobility' }, match: (e) => e.category === 'mobility', limit: 8, more: '/exercises/?category=mobility' },
    ],
  },
  {
    id: 'home',
    icon: 'home',
    title: { ar: 'التمارين المنزلية', en: 'Home training' },
    short: { ar: 'ما كدرت تروح للجم؟ تمرّن من البيت', en: 'Can’t make it to the gym? Train at home' },
    heading: { ar: 'تمرّن من البيت', en: 'Train at home' },
    intro: {
      ar: 'ما كدرت تروح للجم اليوم؟ ولا يهمك. اختر الوقت والمعدات والهدف، وخذ جلسة جاهزة من تمارين المكتبة نفسها — بدون معدات أو بمعدات بسيطة.',
      en: 'Couldn’t make it to the gym today? No problem. Choose your time, equipment and goal and get a ready session from the same exercise library — with no equipment or simple equipment.',
    },
    homeBuilder: true,
    steps: [
      {
        title: { ar: 'جهّز جلسة اليوم', en: 'Set up today’s session' },
        text: { ar: 'اختر 10 أو 20 أو 30 أو 45 دقيقة، ومعداتك، وهدفك.', en: 'Choose 10, 20, 30 or 45 minutes, your equipment and your goal.' },
        path: '/workouts/home/',
        cta: { ar: 'ابدأ الجلسة', en: 'Start a session' },
      },
      {
        title: { ar: 'بدون معدات', en: 'No equipment' },
        text: { ar: 'تمارين بوزن الجسم فقط.', en: 'Bodyweight-only exercises.' },
        path: '/exercises/?program=home-bodyweight',
        cta: { ar: 'تصفّح التمارين', en: 'Browse exercises' },
      },
      {
        title: { ar: 'بمعدات بسيطة', en: 'Simple equipment' },
        text: { ar: 'دمبلز، حبل مطاطي، كيتل بيل أو حبل قفز.', en: 'Dumbbells, a resistance band, a kettlebell or a jump rope.' },
        path: '/exercises/?program=home-equipment',
        cta: { ar: 'تصفّح التمارين', en: 'Browse exercises' },
      },
      {
        title: { ar: 'خطة أسبوعية في البيت', en: 'A weekly plan at home' },
        text: { ar: 'نفس منشئ البرامج مع معدات البيت.', en: 'The same plan builder with home equipment.' },
        path: '/workouts/?location=home#builder',
        cta: { ar: 'ابنِ برنامجك', en: 'Build a plan' },
      },
      recoveryGuide,
      trackProgress,
    ],
    exerciseGroups: [
      { title: { ar: 'بدون معدات', en: 'No equipment' }, match: (e) => isHomeBodyweight(e) && !PREP.includes(e.category) && e.difficulty !== 'advanced', limit: 10, more: '/exercises/?program=home-bodyweight' },
      { title: { ar: 'بمعدات بسيطة', en: 'Simple equipment' }, match: (e) => isHomeFriendly(e) && !isHomeBodyweight(e) && !PREP.includes(e.category), limit: 10, more: '/exercises/?program=home-equipment' },
    ],
  },
];

export function getJourney(id: string): GoalJourney | undefined {
  return GOAL_JOURNEYS.find((g) => g.id === id);
}
