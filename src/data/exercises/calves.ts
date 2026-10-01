import type { Exercise } from './types';

export const calves: Exercise[] = [
  {
    slug: 'standing-calf-raise',
    name: 'Standing Calf Raise',
    arabicName: 'رفع الكعبين واقفاً',
    aliases: ['Machine Standing Calf Raise', 'Calf Raise'],
    arabicAliases: ['كالف', 'كالف واقف', 'سمانة واقف', 'ستاندنج كالف ريز'],
    category: 'calves',
    primaryMuscles: ['calves'],
    secondaryMuscles: [],
    equipment: ['machine'],
    difficulty: 'beginner',
    exerciseType: 'isolation',
    era: 'classic',
    alternatives: ['seated-calf-raise', 'single-leg-calf-raise', 'leg-press-calf-raise', 'donkey-calf-raise'],
    tags: ['calf machine', 'جهاز الكالف', 'بطة الساق'],
    content: {
      en: {
        setup: [
          'Step into the standing calf machine with the shoulder pads resting on your shoulders.',
          'Place the balls of your feet on the edge of the platform, feet about hip-width apart, with your heels free to drop.',
        ],
        steps: [
          'Stand tall with your knees straight but not locked.',
          'Lower your heels slowly until you feel a stretch in your calves.',
          'Push through the balls of your feet and rise as high as you can.',
          'Pause briefly at the top, then lower under control.',
        ],
        breathing: 'Breathe out as you rise onto your toes, and breathe in as you lower your heels.',
        mistakes: [
          'Bouncing quickly at the bottom.',
          'Using only a small part of the range.',
          'Bending the knees to help push the weight up.',
        ],
        tips: [
          'Pause for a second at the bottom stretch and at the top of every rep.',
          'Keep your weight over the big toe and second toe rather than rolling to the outside of the foot.',
        ],
      },
      ar: {
        setup: [
          'ادخل في جهاز الكالف الواقف مع إسناد وسادتي الكتف على كتفيك.',
          'ضع مقدمة قدميك على حافة المنصة والقدمان بعرض الورك، مع ترك الكعبين حرّين للنزول.',
        ],
        steps: [
          'قف منتصباً والركبتان مستقيمتان دون قفلهما بقوة.',
          'أنزل الكعبين ببطء حتى تشعر بشدّ في السمانة.',
          'ادفع بمقدمة القدمين وارتفع لأعلى نقطة ممكنة.',
          'توقف لحظة في الأعلى، ثم انزل بتحكم.',
        ],
        breathing: 'أخرج النفس أثناء الارتفاع على أصابع القدم، وخذ نفساً أثناء إنزال الكعبين.',
        mistakes: [
          'الارتداد السريع في الأسفل.',
          'استخدام جزء صغير فقط من مدى الحركة.',
          'ثني الركبتين للمساعدة في دفع الوزن.',
        ],
        tips: [
          'توقف ثانية عند الشدّ في الأسفل وفي الأعلى في كل تكرار.',
          'أبقِ وزنك فوق إصبع القدم الكبير والإصبع الذي يليه بدلاً من الميل إلى الحافة الخارجية للقدم.',
        ],
      },
    },
  },
  {
    slug: 'seated-calf-raise',
    name: 'Seated Calf Raise',
    arabicName: 'رفع الكعبين جالساً',
    aliases: ['Machine Seated Calf Raise'],
    arabicAliases: ['كالف جالس', 'سمانة جالس', 'سيتد كالف ريز'],
    category: 'calves',
    primaryMuscles: ['calves'],
    secondaryMuscles: [],
    equipment: ['machine'],
    difficulty: 'beginner',
    exerciseType: 'isolation',
    era: 'classic',
    alternatives: ['standing-calf-raise', 'leg-press-calf-raise', 'single-leg-calf-raise'],
    tags: ['soleus', 'calf machine', 'جهاز الكالف', 'بطة الساق'],
    content: {
      en: {
        setup: [
          'Sit in the machine and place the balls of your feet on the foot plate, heels free to drop.',
          'Adjust the knee pad so it sits firmly on your lower thighs just above the knees.',
        ],
        steps: [
          'Push up slightly and release the safety lever.',
          'Lower your heels slowly until you feel a stretch in your calves.',
          'Push through the balls of your feet and raise your heels as high as you can.',
          'Pause at the top, lower under control, and re-engage the safety lever after the last rep.',
        ],
        breathing: 'Breathe out as you raise your heels, and breathe in as you lower them.',
        mistakes: [
          'Bouncing at the bottom of each rep.',
          'Moving through only a small range.',
          'Rocking the upper body to move the weight.',
        ],
        tips: [
          'With bent knees, this version places more of the work on the lower, deeper part of the calf (soleus).',
          'Use a slow, controlled tempo with a short pause at the top and bottom.',
        ],
      },
      ar: {
        setup: [
          'اجلس في الجهاز وضع مقدمة قدميك على منصة القدم، مع ترك الكعبين حرّين للنزول.',
          'اضبط وسادة الركبة لتستقر بثبات على أسفل الفخذين فوق الركبتين مباشرة.',
        ],
        steps: [
          'ادفع للأعلى قليلاً وحرّر ذراع الأمان.',
          'أنزل الكعبين ببطء حتى تشعر بشدّ في السمانة.',
          'ادفع بمقدمة القدمين وارفع الكعبين لأعلى نقطة ممكنة.',
          'توقف في الأعلى، ثم انزل بتحكم، وأعد قفل ذراع الأمان بعد آخر تكرار.',
        ],
        breathing: 'أخرج النفس أثناء رفع الكعبين، وخذ نفساً أثناء إنزالهما.',
        mistakes: [
          'الارتداد في أسفل كل تكرار.',
          'التحرك في مدى صغير فقط.',
          'هزّ الجزء العلوي من الجسم لتحريك الوزن.',
        ],
        tips: [
          'مع ثني الركبتين يركز هذا النوع العمل أكثر على الجزء السفلي العميق من السمانة (العضلة النعلية).',
          'استخدم إيقاعاً بطيئاً ومتحكماً مع توقف قصير في الأعلى والأسفل.',
        ],
      },
    },
  },
  {
    slug: 'donkey-calf-raise',
    name: 'Donkey Calf Raise',
    arabicName: 'رفع الكعبين بوضعية الانحناء (دونكي)',
    aliases: ['Machine Donkey Calf Raise'],
    arabicAliases: ['دونكي كالف', 'كالف دونكي', 'كالف منحني'],
    category: 'calves',
    primaryMuscles: ['calves'],
    secondaryMuscles: [],
    equipment: ['machine'],
    difficulty: 'beginner',
    exerciseType: 'isolation',
    era: 'classic',
    alternatives: ['standing-calf-raise', 'leg-press-calf-raise', 'single-leg-calf-raise'],
    tags: ['old school', 'اولد سكول', 'بطة الساق'],
    content: {
      en: {
        setup: [
          'Step into the donkey calf machine and bend forward at the hips so the pad rests on your lower back and hips, holding the handles in front of you.',
          'Place the balls of your feet on the edge of the platform with your heels free to drop and your knees almost straight.',
        ],
        steps: [
          'Keep your back flat and your hips bent throughout the set.',
          'Lower your heels slowly until you feel a deep stretch in your calves.',
          'Push through the balls of your feet and rise as high as you can.',
          'Pause briefly at the top, then lower under control.',
        ],
        breathing: 'Breathe out as you rise, and breathe in as you lower your heels.',
        mistakes: [
          'Bouncing out of the bottom stretch.',
          'Bending the knees to help lift the weight.',
          'Rounding the back while leaning forward.',
        ],
        tips: [
          'If your gym has no donkey machine, doing calf raises on a step while bending forward with your hands on a bench gives a similar position.',
        ],
      },
      ar: {
        setup: [
          'ادخل في جهاز الكالف دونكي وانحنِ للأمام من الورك بحيث تستقر الوسادة على أسفل ظهرك ووركك، وامسك المقابض أمامك.',
          'ضع مقدمة قدميك على حافة المنصة مع ترك الكعبين حرّين للنزول، والركبتان شبه مستقيمتين.',
        ],
        steps: [
          'أبقِ ظهرك مستقيماً والورك منثنياً طوال المجموعة.',
          'أنزل الكعبين ببطء حتى تشعر بشدّ عميق في السمانة.',
          'ادفع بمقدمة القدمين وارتفع لأعلى نقطة ممكنة.',
          'توقف لحظة في الأعلى، ثم انزل بتحكم.',
        ],
        breathing: 'أخرج النفس أثناء الارتفاع، وخذ نفساً أثناء إنزال الكعبين.',
        mistakes: [
          'الارتداد من وضعية الشدّ في الأسفل.',
          'ثني الركبتين للمساعدة في رفع الوزن.',
          'تدوير الظهر أثناء الانحناء للأمام.',
        ],
        tips: [
          'إذا لم يكن في الصالة جهاز دونكي، فإن رفع الكعبين على درجة مع الانحناء للأمام ووضع اليدين على مسطبة يعطي وضعية مشابهة.',
        ],
      },
    },
  },
  {
    slug: 'leg-press-calf-raise',
    name: 'Leg Press Calf Raise',
    arabicName: 'رفع الكعبين على جهاز دفع الأرجل',
    aliases: ['Calf Press', 'Leg Press Calf Press'],
    arabicAliases: ['كالف على الليك برس', 'كالف بجهاز الرجل', 'كالف برس', 'سمانة على الليك برس'],
    category: 'calves',
    primaryMuscles: ['calves'],
    secondaryMuscles: [],
    equipment: ['machine'],
    difficulty: 'beginner',
    exerciseType: 'isolation',
    era: 'classic',
    alternatives: ['standing-calf-raise', 'seated-calf-raise', 'donkey-calf-raise'],
    tags: ['leg press', 'ليك برس', 'بطة الساق'],
    content: {
      en: {
        setup: [
          'Sit in the leg press with your back flat on the pad and place only the balls of your feet on the bottom edge of the platform, hip-width apart.',
          'Press the platform up until your legs are straight but not locked, and keep the safety handles engaged if your machine allows it.',
        ],
        steps: [
          'Keep your knees in the same slightly soft position for the whole set.',
          'Let the platform push your toes back toward you until you feel a stretch in your calves.',
          'Push the platform away with the balls of your feet as far as you can.',
          'Pause briefly, then return slowly to the stretch.',
        ],
        breathing: 'Breathe out as you push the platform away, and breathe in as you let it come back.',
        mistakes: [
          'Bending and straightening the knees, which turns it into a small leg press.',
          'Placing the feet too low so they slip off the platform.',
          'Bouncing at the bottom of the range.',
        ],
        tips: [
          'Start with a lighter weight than you use for leg press and focus on a full, controlled range.',
        ],
        safety: 'Keep your feet secure on the platform at all times; if they start to slip, stop the set and re-engage the safety handles.',
      },
      ar: {
        setup: [
          'اجلس في جهاز دفع الأرجل وظهرك على المسند، وضع مقدمة قدميك فقط على الحافة السفلية للمنصة بعرض الورك.',
          'ادفع المنصة حتى تستقيم رجلاك دون قفل الركبتين، وأبقِ مقابض الأمان مفعّلة إذا كان جهازك يسمح بذلك.',
        ],
        steps: [
          'حافظ على نفس الانثناء الخفيف في الركبتين طوال المجموعة.',
          'اترك المنصة تدفع أصابع قدميك نحوك حتى تشعر بشدّ في السمانة.',
          'ادفع المنصة بمقدمة القدمين لأبعد نقطة ممكنة.',
          'توقف لحظة، ثم عد ببطء إلى وضعية الشدّ.',
        ],
        breathing: 'أخرج النفس أثناء دفع المنصة، وخذ نفساً أثناء عودتها.',
        mistakes: [
          'ثني الركبتين وفردهما، مما يحوّل الحركة إلى دفع أرجل صغير.',
          'وضع القدمين في مكان منخفض جداً حتى تنزلقا عن المنصة.',
          'الارتداد في أسفل المدى.',
        ],
        tips: [
          'ابدأ بوزن أخف مما تستخدمه في دفع الأرجل، وركّز على مدى كامل ومتحكم به.',
        ],
        safety: 'أبقِ قدميك ثابتتين على المنصة دائماً، وإذا بدأتا بالانزلاق أوقف المجموعة وأعد قفل مقابض الأمان.',
      },
    },
  },
  {
    slug: 'single-leg-calf-raise',
    name: 'Single-Leg Calf Raise',
    arabicName: 'رفع الكعب برجل واحدة',
    aliases: ['One-Leg Calf Raise', 'Single-Leg Standing Calf Raise'],
    arabicAliases: ['كالف رجل واحدة', 'كالف برجل وحدة', 'سمانة رجل واحدة'],
    category: 'calves',
    primaryMuscles: ['calves'],
    secondaryMuscles: [],
    equipment: ['bodyweight', 'box'],
    difficulty: 'beginner',
    exerciseType: 'isolation',
    era: 'classic',
    alternatives: ['standing-calf-raise', 'leg-press-calf-raise', 'seated-calf-raise'],
    tags: ['single leg', 'dumbbell', 'home workout', 'بطة الساق'],
    content: {
      en: {
        setup: [
          'Stand on a step or box with the ball of one foot on the edge and the heel free to drop; hook the other foot behind your ankle.',
          'Hold a wall or rack lightly for balance. Once bodyweight feels easy, hold a dumbbell in the free hand.',
        ],
        steps: [
          'Keep your working knee straight but not locked.',
          'Lower your heel slowly below the step until you feel a stretch in your calf.',
          'Push through the ball of your foot and rise as high as you can.',
          'Pause at the top, lower under control, and finish all reps before switching legs.',
        ],
        breathing: 'Breathe out as you rise, and breathe in as you lower.',
        mistakes: [
          'Rushing the reps and bouncing at the bottom.',
          'Pulling yourself up with the hand that holds the support.',
          'Rolling onto the outside edge of the foot.',
        ],
        tips: [
          'Start with your weaker leg and match the reps on the other side.',
          'Useful when no calf machine is free — a single step is enough.',
        ],
      },
      ar: {
        setup: [
          'قف على درجة أو صندوق بمقدمة قدم واحدة على الحافة والكعب حرّ للنزول، وضع القدم الأخرى خلف كاحل الرجل العاملة.',
          'امسك الحائط أو الحامل بخفة للتوازن. عندما يصبح وزن الجسم سهلاً امسك دمبلاً باليد الحرة.',
        ],
        steps: [
          'أبقِ ركبة الرجل العاملة مستقيمة دون قفلها بقوة.',
          'أنزل الكعب ببطء تحت مستوى الدرجة حتى تشعر بشدّ في السمانة.',
          'ادفع بمقدمة القدم وارتفع لأعلى نقطة ممكنة.',
          'توقف في الأعلى، ثم انزل بتحكم، وأكمل جميع التكرارات قبل تبديل الرجل.',
        ],
        breathing: 'أخرج النفس أثناء الارتفاع، وخذ نفساً أثناء النزول.',
        mistakes: [
          'الاستعجال في التكرارات والارتداد في الأسفل.',
          'سحب نفسك للأعلى باليد التي تمسك المسند.',
          'الميل إلى الحافة الخارجية للقدم.',
        ],
        tips: [
          'ابدأ بالرجل الأضعف واجعل عدد التكرارات متساوياً للرجل الأخرى.',
          'مفيد عندما لا يكون جهاز الكالف متاحاً، فدرجة واحدة تكفي.',
        ],
      },
    },
  },
  {
    slug: 'tibialis-raise',
    name: 'Tibialis Raise',
    arabicName: 'رفع مقدمة القدم (تمرين القصبة)',
    aliases: ['Tib Raise', 'Wall Tibialis Raise'],
    arabicAliases: ['تيبياليس رايز', 'تيب رايز', 'تمرين القصبة', 'رفع أصابع القدم'],
    category: 'calves',
    primaryMuscles: ['tibialis'],
    secondaryMuscles: [],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    exerciseType: 'isolation',
    era: 'modern',
    alternatives: ['ankle-knee-to-wall', 'single-leg-calf-raise'],
    tags: ['shin', 'ساق امامي', 'قصبة'],
    content: {
      en: {
        setup: [
          'Stand with your back and hips leaning against a wall and your feet about one foot-length or more in front of you, hip-width apart.',
        ],
        steps: [
          'Keep your legs straight and your heels on the floor.',
          'Lift the front of your feet and toes up toward your shins as high as you can.',
          'Pause briefly at the top.',
          'Lower your toes slowly back toward the floor without letting them slap down.',
        ],
        breathing: 'Breathe out as you lift your toes, and breathe in as you lower them.',
        mistakes: [
          'Bending the knees or moving the hips away from the wall.',
          'Letting the feet slap down instead of lowering them.',
          'Using only a small part of the range.',
        ],
        tips: [
          'Move your feet further from the wall to make it harder, closer to make it easier.',
          'Start with bodyweight only and build up the reps gradually.',
        ],
      },
      ar: {
        setup: [
          'قف مسنداً ظهرك ووركك على الحائط، وقدماك أمامك بمسافة طول قدم أو أكثر وبعرض الورك.',
        ],
        steps: [
          'أبقِ رجليك مستقيمتين والكعبين على الأرض.',
          'ارفع مقدمة القدمين وأصابعهما نحو الساقين لأعلى نقطة ممكنة.',
          'توقف لحظة في الأعلى.',
          'أنزل أصابع القدمين ببطء نحو الأرض دون أن تضربها.',
        ],
        breathing: 'أخرج النفس أثناء رفع أصابع القدمين، وخذ نفساً أثناء إنزالها.',
        mistakes: [
          'ثني الركبتين أو إبعاد الورك عن الحائط.',
          'ترك القدمين تضربان الأرض بدلاً من إنزالهما.',
          'استخدام جزء صغير فقط من مدى الحركة.',
        ],
        tips: [
          'أبعد قدميك عن الحائط لزيادة الصعوبة، وقرّبهما لتسهيل التمرين.',
          'ابدأ بوزن الجسم فقط وزِد عدد التكرارات تدريجياً.',
        ],
      },
    },
  },
];
