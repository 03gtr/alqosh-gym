import type { Exercise } from './types';

export const warmUp: Exercise[] = [
  {
    slug: 'general-warm-up',
    name: 'General Warm-Up',
    arabicName: 'الإحماء العام',
    aliases: ['Warm-Up', 'Light Cardio Warm-Up'],
    arabicAliases: ['احماء', 'تسخين', 'وارم اب'],
    category: 'warm-up',
    primaryMuscles: ['cardio-system'],
    secondaryMuscles: ['quads', 'glutes', 'calves'],
    equipment: ['cardio-machine'],
    difficulty: 'beginner',
    movementPattern: 'locomotion',
    exerciseType: 'cardio',
    alternatives: ['jumping-jacks', 'high-knees', 'walking', 'stationary-bike'],
    tags: ['before workout', 'قبل التمرين'],
    content: {
      en: {
        setup: [
          'Pick any cardio machine you are comfortable with — treadmill, bike, elliptical or rower — or simply walk briskly.',
        ],
        steps: [
          'Start at a very easy pace for the first 1–2 minutes.',
          'Gradually raise the pace or resistance so your breathing and heart rate rise.',
          'Aim to feel warm and lightly sweaty, not tired.',
          'Move on to dynamic drills or light warm-up sets of your first exercise.',
        ],
        breathing: 'Breathe naturally. You should easily be able to talk in full or short sentences the whole time — this is not a workout.',
        mistakes: [
          'Skipping the warm-up and going straight to heavy sets.',
          'Going so hard that you are tired before the main workout.',
          'Using only static stretching as a warm-up.',
        ],
        tips: [
          'Finish with 1–2 lighter sets of your first lift before working sets.',
          'On cold days or early mornings, take a little longer.',
        ],
        prescription: '5–10 minutes of light cardio at an easy, conversational effort.',
      },
      ar: {
        setup: [
          'اختر أي جهاز كارديو تشعر بالراحة عليه — جهاز المشي أو الدراجة أو الإليبتيكال أو التجديف — أو امشِ بسرعة فقط.',
        ],
        steps: [
          'ابدأ بسرعة سهلة جداً في أول دقيقة أو دقيقتين.',
          'زِد السرعة أو المقاومة تدريجياً حتى يرتفع تنفسك ونبضك.',
          'الهدف أن تشعر بالدفء وتعرق خفيف، لا بالتعب.',
          'انتقل بعدها إلى حركات الإحماء الديناميكية أو مجموعات خفيفة من أول تمرين.',
        ],
        breathing: 'تنفّس بشكل طبيعي. يجب أن تستطيع الكلام بسهولة بجمل كاملة أو قصيرة طوال الوقت — فهذا ليس تمريناً رئيسياً.',
        mistakes: [
          'إهمال الإحماء والبدء مباشرة بمجموعات ثقيلة.',
          'الإحماء بجهد عالٍ حتى تتعب قبل التمرين الرئيسي.',
          'الاعتماد على الإطالة الثابتة وحدها كإحماء.',
        ],
        tips: [
          'اختم بمجموعة أو مجموعتين أخف من أول تمرين قبل المجموعات الأساسية.',
          'في الأيام الباردة أو التمرين الصباحي الباكر، أطِل مدة الإحماء قليلاً.',
        ],
        prescription: 'من 5 إلى 10 دقائق كارديو خفيف بجهد سهل يسمح بالكلام.',
      },
    },
  },
  {
    slug: 'jumping-jacks',
    name: 'Jumping Jacks',
    arabicName: 'القفز مع فتح الذراعين والرجلين',
    aliases: ['Star Jumps'],
    arabicAliases: ['جمبنغ جاك', 'جامبينج جاك', 'فتح وغلق'],
    category: 'warm-up',
    primaryMuscles: ['cardio-system'],
    secondaryMuscles: ['calves', 'side-delts', 'glute-med'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    movementPattern: 'locomotion',
    exerciseType: 'cardio',
    alternatives: ['high-knees', 'jump-rope', 'general-warm-up'],
    tags: ['calisthenics', 'no equipment', 'بدون ادوات'],
    content: {
      en: {
        setup: [
          'Stand tall with your feet together and your arms by your sides.',
        ],
        steps: [
          'Jump your feet out to slightly wider than shoulder-width while raising your arms out to the sides and overhead.',
          'Land softly on the balls of your feet with your knees slightly bent.',
          'Jump your feet back together while lowering your arms to your sides.',
          'Keep a steady, comfortable rhythm.',
        ],
        breathing: 'Breathe steadily and naturally in time with the rhythm. Slow down if you cannot talk in short sentences.',
        mistakes: [
          'Landing heavily on the heels with straight knees.',
          'Letting the knees cave inward on landing.',
          'Going too fast and losing rhythm.',
        ],
        tips: [
          'For a no-impact version, step one foot out at a time instead of jumping.',
        ],
        prescription: '2–3 rounds of 20–30 seconds as part of a warm-up.',
      },
      ar: {
        setup: [
          'قف مستقيماً والقدمان متلاصقتان والذراعان بجانب الجسم.',
        ],
        steps: [
          'اقفز وافتح القدمين لعرض أوسع قليلاً من الكتفين مع رفع الذراعين جانباً حتى فوق الرأس.',
          'اهبط بنعومة على مقدمة القدمين مع ثني الركبتين قليلاً.',
          'اقفز وأعِد القدمين معاً مع إنزال الذراعين إلى الجانبين.',
          'حافظ على إيقاع ثابت ومريح.',
        ],
        breathing: 'تنفّس بشكل ثابت وطبيعي مع الإيقاع. خفّف السرعة إذا لم تستطع الكلام بجمل قصيرة.',
        mistakes: [
          'الهبوط بقوة على الكعبين والركبتان مستقيمتان.',
          'دخول الركبتين للداخل عند الهبوط.',
          'السرعة الزائدة وفقدان الإيقاع.',
        ],
        tips: [
          'لنسخة بدون قفز، افتح رجلاً واحدة في كل مرة بخطوة جانبية.',
        ],
        prescription: 'من 2 إلى 3 جولات مدة كل منها 20–30 ثانية ضمن الإحماء.',
      },
    },
  },
  {
    slug: 'arm-circles',
    name: 'Arm Circles',
    arabicName: 'تدوير الذراعين',
    aliases: [],
    arabicAliases: ['تدوير الاكتاف', 'دوائر الذراعين', 'ارم سيركلز'],
    category: 'warm-up',
    primaryMuscles: ['side-delts'],
    secondaryMuscles: ['front-delts', 'rear-delts', 'rotator-cuff'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    exerciseType: 'mobility',
    alternatives: ['band-pull-apart', 'band-shoulder-pass-through', 'wall-slide'],
    tags: ['shoulder warm-up', 'احماء الكتف'],
    content: {
      en: {
        setup: [
          'Stand tall with your feet hip-width apart and raise your arms straight out to the sides at shoulder height.',
        ],
        steps: [
          'Make small forward circles with your arms.',
          'Gradually make the circles bigger while keeping your shoulders relaxed and away from your ears.',
          'After the set time, reverse and circle backward, starting small and getting bigger.',
          'Lower your arms and shake them out.',
        ],
        breathing: 'Breathe slowly and naturally — do not hold your breath.',
        mistakes: [
          'Shrugging the shoulders up toward the ears.',
          'Arching the lower back as the circles get bigger.',
          'Swinging wildly instead of moving with control.',
        ],
        tips: [
          'Only go as big as feels comfortable for your shoulders.',
        ],
        prescription: '10–15 circles forward and 10–15 backward, 1–2 rounds.',
      },
      ar: {
        setup: [
          'قف مستقيماً والقدمان بعرض الورك، وارفع ذراعيك مستقيمتين إلى الجانبين بمستوى الكتفين.',
        ],
        steps: [
          'ارسم دوائر صغيرة بالذراعين للأمام.',
          'كبّر الدوائر تدريجياً مع إرخاء الكتفين وإبعادهما عن الأذنين.',
          'بعد انتهاء الوقت، اعكس الاتجاه وارسم الدوائر للخلف، من الصغير إلى الكبير.',
          'أنزل ذراعيك وهزّهما بخفة.',
        ],
        breathing: 'تنفّس ببطء وبشكل طبيعي — لا تحبس نفسك.',
        mistakes: [
          'رفع الكتفين نحو الأذنين.',
          'تقويس أسفل الظهر مع كِبر الدوائر.',
          'التأرجح بعشوائية بدلاً من الحركة المتحكَّم بها.',
        ],
        tips: [
          'كبّر الدوائر فقط بالقدر المريح لكتفيك.',
        ],
        prescription: 'من 10 إلى 15 دائرة للأمام ومثلها للخلف، جولة أو جولتان.',
      },
    },
  },
  {
    slug: 'leg-swings',
    name: 'Leg Swings',
    arabicName: 'أرجحة الرجل',
    aliases: ['Front-to-Back Leg Swings', 'Lateral Leg Swings'],
    arabicAliases: ['ارجحة الرجل', 'مرجحة الرجل', 'ليغ سوينغ'],
    category: 'warm-up',
    primaryMuscles: ['hip-flexors', 'hamstrings'],
    secondaryMuscles: ['adductors', 'glutes', 'glute-med'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    exerciseType: 'mobility',
    alternatives: ['worlds-greatest-stretch', 'hip-90-90', 'high-knees'],
    tags: ['hip warm-up', 'dynamic stretch', 'احماء الورك', 'اطالة ديناميكية'],
    content: {
      en: {
        setup: [
          'Stand side-on to a wall or rack and hold it with one hand for balance.',
          'Stand tall on the inside leg with a soft knee.',
        ],
        steps: [
          'Swing the outside leg forward and back like a pendulum, starting with small swings.',
          'Gradually increase the range while keeping your upper body tall and still.',
          'Face the wall, hold it with both hands, and swing the leg side to side across your body.',
          'Switch sides and repeat.',
        ],
        breathing: 'Breathe naturally and rhythmically with the swings — do not hold your breath.',
        mistakes: [
          'Kicking the leg up as high as possible from the first swing.',
          'Leaning or twisting the upper body to get more range.',
          'Locking the standing knee.',
        ],
        tips: [
          'Keep the swings smooth and controlled — range comes gradually.',
        ],
        prescription: '10–15 swings forward–back and 10–15 side-to-side per leg.',
      },
      ar: {
        setup: [
          'قف بجانب حائط أو حامل وأمسكه بيد واحدة للتوازن.',
          'قف مستقيماً على الرجل القريبة من الحائط مع ثني الركبة قليلاً.',
        ],
        steps: [
          'أرجح الرجل البعيدة للأمام والخلف مثل البندول، وابدأ بأرجحات صغيرة.',
          'زِد المدى تدريجياً مع إبقاء الجزء العلوي مستقيماً وثابتاً.',
          'استدر لتواجه الحائط وأمسكه بيديك، ثم أرجح الرجل من جانب إلى جانب أمام جسمك.',
          'بدّل الرجل وكرر.',
        ],
        breathing: 'تنفّس بشكل طبيعي ومنتظم مع الأرجحة — لا تحبس نفسك.',
        mistakes: [
          'رفع الرجل لأعلى ارتفاع ممكن من أول أرجحة.',
          'ميل الجزء العلوي أو لفّه للحصول على مدى أكبر.',
          'قفل ركبة الرجل الثابتة.',
        ],
        tips: [
          'اجعل الأرجحة سلسة ومتحكَّماً بها — المدى يزداد تدريجياً.',
        ],
        prescription: 'من 10 إلى 15 أرجحة للأمام والخلف ومثلها من جانب لجانب لكل رجل.',
      },
    },
  },
  {
    slug: 'band-pull-apart',
    name: 'Band Pull-Apart',
    arabicName: 'فتح الحبل المطاطي',
    aliases: ['Resistance Band Pull-Apart'],
    arabicAliases: ['باند بول أبارت', 'فتح المطاط', 'سحب المطاط للجانبين'],
    category: 'warm-up',
    primaryMuscles: ['rear-delts', 'upper-back'],
    secondaryMuscles: ['traps', 'rotator-cuff'],
    equipment: ['band'],
    difficulty: 'beginner',
    movementPattern: 'pull',
    exerciseType: 'isolation',
    era: 'modern',
    alternatives: ['face-pull', 'rear-delt-fly', 'reverse-pec-deck', 'scapular-push-up'],
    tags: ['shoulder warm-up', 'posture', 'احماء الكتف', 'كتف خلفي'],
    content: {
      en: {
        setup: [
          'Stand tall and hold a light band in front of your chest at shoulder height, hands about shoulder-width apart, palms down.',
          'Keep your arms almost straight with a slight bend in the elbows.',
        ],
        steps: [
          'Pull the band apart by moving your hands out to the sides.',
          'Squeeze your shoulder blades together as the band reaches your chest.',
          'Pause briefly without shrugging your shoulders.',
          'Return slowly to the start, keeping tension on the band.',
        ],
        breathing: 'Breathe out as you pull the band apart and breathe in as you return.',
        mistakes: [
          'Shrugging the shoulders up toward the ears.',
          'Arching the lower back and pushing the ribs forward.',
          'Using a band so strong that you have to bend your elbows a lot.',
        ],
        tips: [
          'Use a light band — this is a warm-up, not a max effort.',
          'A narrower grip makes it harder; a wider grip makes it easier.',
        ],
        prescription: '2 sets of 15–20 controlled reps before upper-body training.',
      },
      ar: {
        setup: [
          'قف مستقيماً وأمسك حبلاً مطاطياً خفيفاً أمام صدرك بمستوى الكتفين، واليدان بعرض الكتفين تقريباً وراحتا اليد للأسفل.',
          'أبقِ الذراعين شبه مستقيمتين مع ثني بسيط في المرفقين.',
        ],
        steps: [
          'افتح الحبل بتحريك اليدين إلى الجانبين.',
          'اضغط لوحي الكتف معاً عندما يقترب الحبل من صدرك.',
          'توقف لحظة دون رفع الكتفين.',
          'ارجع ببطء إلى البداية مع إبقاء الحبل مشدوداً.',
        ],
        breathing: 'أخرج النفس أثناء فتح الحبل، وخذ نفساً أثناء الرجوع.',
        mistakes: [
          'رفع الكتفين نحو الأذنين.',
          'تقويس أسفل الظهر ودفع الأضلاع للأمام.',
          'استخدام حبل قوي جداً يجبرك على ثني المرفقين كثيراً.',
        ],
        tips: [
          'استخدم حبلاً خفيفاً — فهذا إحماء وليس أقصى جهد.',
          'القبضة الأضيق تزيد الصعوبة، والأعرض تجعله أسهل.',
        ],
        prescription: 'مجموعتان من 15 إلى 20 تكراراً متحكَّماً به قبل تمارين الجزء العلوي.',
      },
    },
  },
  {
    slug: 'inchworm',
    name: 'Inchworm',
    arabicName: 'تمرين الدودة',
    aliases: ['Inchworm Walkout', 'Walkout'],
    arabicAliases: ['انش وورم', 'الدودة', 'المشي باليدين'],
    category: 'warm-up',
    primaryMuscles: ['hamstrings'],
    secondaryMuscles: ['deep-core', 'front-delts', 'calves', 'lower-back'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    movementPattern: 'hinge',
    exerciseType: 'mobility',
    alternatives: ['standing-hamstring-stretch', 'worlds-greatest-stretch', 'plank'],
    tags: ['dynamic stretch', 'full body warm-up', 'اطالة ديناميكية'],
    content: {
      en: {
        setup: [
          'Stand tall with your feet hip-width apart.',
        ],
        steps: [
          'Hinge at the hips and reach your hands to the floor, bending your knees as much as you need.',
          'Walk your hands forward until you are in a high plank with your body in a straight line.',
          'Pause briefly, keeping your hips level and your core tight.',
          'Walk your hands back toward your feet, then roll up to standing.',
        ],
        breathing: 'Breathe out as you fold down and walk out; breathe in as you walk back and stand up. Keep breathing during the plank.',
        mistakes: [
          'Letting the hips sag in the plank position.',
          'Forcing straight legs when the hamstrings are tight.',
          'Rushing the walk-out and back.',
        ],
        tips: [
          'Bend your knees freely — the goal is to warm up, not to force a stretch.',
        ],
        prescription: '1–2 sets of 5–8 slow reps.',
      },
      ar: {
        setup: [
          'قف مستقيماً والقدمان بعرض الورك.',
        ],
        steps: [
          'انثنِ من الورك ومدّ يديك إلى الأرض، واثنِ ركبتيك بالقدر الذي تحتاجه.',
          'امشِ بيديك للأمام حتى تصل إلى وضع البلانك العالي والجسم في خط مستقيم.',
          'توقف لحظة مع إبقاء الورك مستوياً وشدّ عضلات الجذع.',
          'امشِ بيديك للخلف نحو قدميك، ثم ارتفع تدريجياً إلى الوقوف.',
        ],
        breathing: 'أخرج النفس أثناء النزول والمشي للأمام، وخذ نفساً أثناء الرجوع والوقوف. استمر بالتنفس أثناء البلانك.',
        mistakes: [
          'هبوط الورك في وضع البلانك.',
          'إجبار الرجلين على الاستقامة عندما تكون عضلات الفخذ الخلفية مشدودة.',
          'الاستعجال في المشي للأمام والخلف.',
        ],
        tips: [
          'اثنِ ركبتيك بحرية — الهدف الإحماء وليس إجبار الإطالة.',
        ],
        prescription: 'مجموعة أو مجموعتان من 5 إلى 8 تكرارات بطيئة.',
      },
    },
  },
  {
    slug: 'bodyweight-squat',
    name: 'Bodyweight Squat',
    arabicName: 'القرفصاء بوزن الجسم',
    aliases: ['Air Squat'],
    arabicAliases: ['سكوات بوزن الجسم', 'سكوات بدون وزن', 'اير سكوات', 'قرفصاء'],
    category: 'warm-up',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['adductors', 'hamstrings', 'deep-core'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    movementPattern: 'squat',
    exerciseType: 'compound',
    era: 'classic',
    alternatives: ['goblet-squat', 'deep-squat-hold', 'back-squat', 'wall-sit'],
    tags: ['leg warm-up', 'no equipment', 'احماء الرجل', 'بدون ادوات'],
    content: {
      en: {
        setup: [
          'Stand with your feet about shoulder-width apart and your toes turned out slightly.',
          'Hold your arms out in front or keep your hands together at your chest for balance.',
        ],
        steps: [
          'Sit your hips back and down while bending your knees.',
          'Keep your chest up and your knees moving in the same direction as your toes.',
          'Lower as deep as you can while keeping your heels down and your back straight.',
          'Push through your whole foot to stand back up tall.',
        ],
        breathing: 'Breathe in as you lower and breathe out as you stand up.',
        mistakes: [
          'Lifting the heels off the floor.',
          'Letting the knees cave inward.',
          'Rounding the back at the bottom.',
        ],
        tips: [
          'Squat to a bench behind you if you are still learning the depth.',
          'Move slowly — this is a warm-up for your joints and muscles.',
        ],
        prescription: '1–2 sets of 10–15 slow, controlled reps as part of your warm-up.',
      },
      ar: {
        setup: [
          'قف والقدمان بعرض الكتفين تقريباً مع توجيه أصابع القدمين للخارج قليلاً.',
          'مدّ ذراعيك للأمام أو اجمع يديك أمام صدرك للتوازن.',
        ],
        steps: [
          'أرجع الورك للخلف والأسفل مع ثني الركبتين.',
          'أبقِ الصدر مرفوعاً والركبتين في نفس اتجاه أصابع القدمين.',
          'انزل لأعمق نقطة تستطيعها مع بقاء الكعبين على الأرض والظهر مستقيماً.',
          'ادفع بالقدم كاملة لتقف مستقيماً من جديد.',
        ],
        breathing: 'خذ نفساً أثناء النزول، وأخرجه أثناء الصعود.',
        mistakes: [
          'رفع الكعبين عن الأرض.',
          'دخول الركبتين للداخل.',
          'تقويس الظهر في أسفل الحركة.',
        ],
        tips: [
          'انزل حتى تلامس مسطبة خلفك إذا كنت ما زلت تتعلم العمق المناسب.',
          'تحرّك ببطء — فهذا إحماء للمفاصل والعضلات.',
        ],
        prescription: 'مجموعة أو مجموعتان من 10 إلى 15 تكراراً بطيئاً ومتحكَّماً به ضمن الإحماء.',
      },
    },
  },
  {
    slug: 'high-knees',
    name: 'High Knees',
    arabicName: 'رفع الركبتين عالياً',
    aliases: ['High Knee Run'],
    arabicAliases: ['هاي نيز', 'رفع الركب'],
    category: 'warm-up',
    primaryMuscles: ['cardio-system'],
    secondaryMuscles: ['hip-flexors', 'quads', 'calves', 'deep-core'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    movementPattern: 'locomotion',
    exerciseType: 'cardio',
    alternatives: ['jumping-jacks', 'mountain-climber', 'jump-rope'],
    tags: ['no equipment', 'بدون ادوات', 'قفز'],
    content: {
      en: {
        setup: [
          'Stand tall with your feet hip-width apart and your arms bent at your sides.',
        ],
        steps: [
          'Drive one knee up toward hip height while the opposite arm swings forward.',
          'Land softly on the ball of the foot and switch legs quickly.',
          'Keep your chest up and your body tall — do not lean back.',
          'Continue at a steady rhythm for the set time, then slow to a march.',
        ],
        breathing: 'Breathe steadily and rhythmically. Slow down or march if you cannot talk in short sentences.',
        mistakes: [
          'Leaning back to lift the knees higher.',
          'Landing heavily on the heels.',
          'Rounding the shoulders forward.',
        ],
        tips: [
          'For a low-impact version, march in place lifting the knees with control.',
        ],
        prescription: '2–3 rounds of 20–30 seconds with short rests, as part of a warm-up.',
      },
      ar: {
        setup: [
          'قف مستقيماً والقدمان بعرض الورك والذراعان مثنيتان بجانب الجسم.',
        ],
        steps: [
          'ارفع ركبة واحدة نحو مستوى الورك مع تحريك الذراع المعاكسة للأمام.',
          'اهبط بنعومة على مقدمة القدم وبدّل الرجل بسرعة.',
          'أبقِ الصدر مرفوعاً والجسم مستقيماً — لا تمِل للخلف.',
          'استمر بإيقاع ثابت للوقت المحدد، ثم خفّف إلى المشي في المكان.',
        ],
        breathing: 'تنفّس بشكل ثابت ومنتظم. خفّف السرعة أو امشِ في المكان إذا لم تستطع الكلام بجمل قصيرة.',
        mistakes: [
          'الميل للخلف لرفع الركبتين أعلى.',
          'الهبوط بقوة على الكعبين.',
          'تقويس الكتفين للأمام.',
        ],
        tips: [
          'لنسخة بدون قفز، امشِ في المكان مع رفع الركبتين بتحكم.',
        ],
        prescription: 'من 2 إلى 3 جولات مدة كل منها 20–30 ثانية مع راحة قصيرة، ضمن الإحماء.',
      },
    },
  },
  {
    slug: 'scapular-push-up',
    name: 'Scapular Push-Up',
    arabicName: 'الضغط بلوحي الكتف',
    aliases: ['Scap Push-Up'],
    arabicAliases: ['سكابولار بوش اب', 'ضغط الكتف', 'سكاب بوش اب'],
    category: 'warm-up',
    primaryMuscles: ['upper-back'],
    secondaryMuscles: ['chest', 'deep-core', 'front-delts'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    movementPattern: 'push',
    exerciseType: 'isolation',
    era: 'classic',
    alternatives: ['push-up', 'band-pull-apart', 'wall-slide', 'plank'],
    tags: ['shoulder blade', 'shoulder warm-up', 'لوح الكتف', 'احماء الكتف'],
    content: {
      en: {
        setup: [
          'Get into a high plank with your hands under your shoulders, arms straight and body in a straight line.',
        ],
        steps: [
          'Keeping your arms straight, let your chest sink slightly so your shoulder blades move together.',
          'Push the floor away so your shoulder blades spread apart and your upper back rounds slightly.',
          'Pause for a moment at the top.',
          'Lower back to the start with control and repeat.',
        ],
        breathing: 'Breathe in as your shoulder blades come together and breathe out as you push the floor away.',
        mistakes: [
          'Bending the elbows and turning it into a regular push-up.',
          'Letting the hips sag or pike up.',
          'Moving the head and neck instead of the shoulder blades.',
        ],
        tips: [
          'The movement is small — only the shoulder blades should move.',
          'Do it from your knees or against a wall if a full plank is too hard.',
        ],
        prescription: '1–2 sets of 10–15 slow reps before upper-body training.',
      },
      ar: {
        setup: [
          'اتخذ وضع البلانك العالي واليدان تحت الكتفين، والذراعان مستقيمتان والجسم في خط مستقيم.',
        ],
        steps: [
          'مع إبقاء الذراعين مستقيمتين، دع صدرك ينزل قليلاً حتى يقترب لوحا الكتف من بعضهما.',
          'ادفع الأرض بعيداً حتى يتباعد لوحا الكتف ويتقوس أعلى الظهر قليلاً.',
          'توقف لحظة في الأعلى.',
          'ارجع إلى البداية بتحكم وكرر.',
        ],
        breathing: 'خذ نفساً عندما يقترب لوحا الكتف، وأخرجه عندما تدفع الأرض بعيداً.',
        mistakes: [
          'ثني المرفقين وتحويله إلى تمرين ضغط عادي.',
          'هبوط الورك أو رفعه للأعلى.',
          'تحريك الرأس والرقبة بدلاً من لوحي الكتف.',
        ],
        tips: [
          'الحركة صغيرة — يجب أن يتحرك لوحا الكتف فقط.',
          'أدّه على الركبتين أو مستنداً على حائط إذا كان البلانك الكامل صعباً.',
        ],
        prescription: 'مجموعة أو مجموعتان من 10 إلى 15 تكراراً بطيئاً قبل تمارين الجزء العلوي.',
      },
    },
  },
];
