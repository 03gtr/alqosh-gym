/**
 * Goal journeys ("هدفي"): a navigation layer over the existing tools — the
 * calculator, meal planner, workout builder, exercise library and articles.
 * No personalised coaching is implied, and no results are promised: every
 * step simply points to a real page of the site in a sensible order.
 */
import type { IconName } from '../components/icons';
import type { Localized } from '../i18n/types';

export type GoalId = 'weight-loss' | 'muscle-gain' | 'maintain' | 'fitness';

export interface JourneyStep {
  title: Localized;
  text: Localized;
  /** Language-neutral path, optionally with a query string / hash. */
  path: string;
  cta: Localized;
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
}

const technique: JourneyStep = {
  title: { ar: 'تعلّم الأداء الصحيح', en: 'Learn correct technique' },
  text: { ar: 'كل تمرين له شرح خطوة بخطوة، والأخطاء الشائعة، والعضلة المستهدفة باللون الأخضر.', en: 'Every exercise has step-by-step instructions, common mistakes and the target muscle in green.' },
  path: '/articles/proper-technique/',
  cta: { ar: 'أساسيات التقنية', en: 'Technique basics' },
};

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
        title: { ar: 'افهم احتياجك من السعرات', en: 'Understand your calorie needs' },
        text: { ar: 'ما هي السعرة، ولماذا تختلف احتياجات كل شخص.', en: 'What a calorie is and why everyone’s needs differ.' },
        path: '/articles/calories/',
        cta: { ar: 'اقرأ عن السعرات', en: 'Read about calories' },
      },
      {
        title: { ar: 'احسب BMR و TDEE', en: 'Calculate your BMR and TDEE' },
        text: { ar: 'الحاسبة تعطيك نطاقاً تقديرياً لخسارة الدهون بعجز معتدل وآمن.', en: 'The calculator gives an estimated fat-loss range with a moderate, safe deficit.' },
        path: '/calculator/?goal=loss',
        cta: { ar: 'احسب سعراتك', en: 'Calculate calories' },
      },
      {
        title: { ar: 'حدّد هدفاً واقعياً', en: 'Set a realistic target' },
        text: { ar: 'توازن الطاقة: لماذا العجز المعتدل أفضل من الحرمان الشديد.', en: 'Energy balance: why a moderate deficit beats extreme restriction.' },
        path: '/articles/energy-balance/',
        cta: { ar: 'توازن الطاقة', en: 'Energy balance' },
      },
      {
        title: { ar: 'أساسيات التغذية', en: 'Nutrition basics' },
        text: { ar: 'البروتين، الكربوهيدرات، الدهون، الألياف والماء — بشكل مبسّط.', en: 'Protein, carbs, fats, fibre and water — simply explained.' },
        path: '/nutrition/',
        cta: { ar: 'دليل التغذية', en: 'Nutrition guide' },
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
      {
        title: { ar: 'الاستشفاء والنوم', en: 'Recovery and sleep' },
        text: { ar: 'العضلة تُبنى في الراحة، وليس في التمرين فقط.', en: 'Muscle is built during rest, not only in training.' },
        path: '/articles/recovery/',
        cta: { ar: 'اقرأ عن الاستشفاء', en: 'Read about recovery' },
      },
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
      {
        title: { ar: 'ابدأ بالإحماء الصحيح', en: 'Warm up properly' },
        text: { ar: 'لماذا الإحماء مهم وكيف تسويه.', en: 'Why warming up matters and how to do it.' },
        path: '/articles/warm-up/',
        cta: { ar: 'اقرأ عن الإحماء', en: 'Read about warming up' },
      },
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
    ],
  },
];

export function getJourney(id: string): GoalJourney | undefined {
  return GOAL_JOURNEYS.find((g) => g.id === id);
}
