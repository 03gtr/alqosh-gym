import type { Exercise } from './types';

export const coolDown: Exercise[] = [
  {
    slug: 'cool-down-walk',
    name: 'Cool-Down Walk',
    arabicName: 'مشي التهدئة',
    aliases: ['Cool-Down', 'Easy Walk'],
    arabicAliases: ['تهدئة', 'كول داون', 'مشي خفيف'],
    category: 'cool-down',
    primaryMuscles: ['cardio-system'],
    secondaryMuscles: ['calves', 'quads'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    movementPattern: 'locomotion',
    exerciseType: 'cardio',
    alternatives: ['walking', 'stationary-bike', 'diaphragmatic-breathing'],
    tags: ['after workout', 'recovery', 'بعد التمرين', 'استشفاء'],
    content: {
      en: {
        setup: [
          'After your last set, walk at an easy pace around the gym, on a treadmill, or pedal gently on a stationary bike.',
        ],
        steps: [
          'Start at a relaxed pace that feels easy.',
          'Gradually slow down over the next few minutes.',
          'Let your shoulders drop and your arms swing loosely.',
          'Finish when your breathing has settled and you can talk comfortably.',
        ],
        breathing: 'Breathe slowly and let your breathing return toward normal. You should be able to talk easily the whole time.',
        mistakes: [
          'Stopping suddenly and sitting or lying down straight after hard training.',
          'Walking or pedalling too fast to count as a cool-down.',
          'Skipping it after intense cardio or leg training.',
        ],
        tips: [
          'A good moment to drink water and follow with a few stretches.',
        ],
        prescription: '5–10 minutes of easy walking or cycling after training.',
        safety: 'If you feel dizzy or unwell after training, keep moving gently, sit down if needed, and tell a coach.',
      },
      ar: {
        setup: [
          'بعد آخر مجموعة، امشِ بسرعة سهلة في الصالة أو على جهاز المشي، أو دوّس بهدوء على الدراجة الثابتة.',
        ],
        steps: [
          'ابدأ بسرعة مريحة تشعر أنها سهلة.',
          'خفّف السرعة تدريجياً خلال الدقائق التالية.',
          'أرخِ كتفيك ودع ذراعيك تتحركان بحرية.',
          'انتهِ عندما يهدأ تنفسك وتستطيع الكلام براحة.',
        ],
        breathing: 'تنفّس ببطء ودع تنفسك يعود تدريجياً إلى طبيعته. يجب أن تستطيع الكلام بسهولة طوال الوقت.',
        mistakes: [
          'التوقف فجأة والجلوس أو الاستلقاء مباشرة بعد تمرين شديد.',
          'المشي أو التدويس بسرعة كبيرة لا تناسب التهدئة.',
          'إهمال التهدئة بعد كارديو شديد أو تمرين أرجل.',
        ],
        tips: [
          'وقت مناسب لشرب الماء، ثم أداء بعض تمارين الإطالة.',
        ],
        prescription: 'من 5 إلى 10 دقائق مشي أو تدويس سهل بعد التمرين.',
        safety: 'إذا شعرت بدوار أو توعك بعد التمرين، استمر بالحركة بهدوء، واجلس إذا احتجت، وأخبر المدرب.',
      },
    },
  },
  {
    slug: 'diaphragmatic-breathing',
    name: 'Diaphragmatic Breathing',
    arabicName: 'التنفس الحجابي',
    aliases: ['Belly Breathing', 'Deep Breathing'],
    arabicAliases: ['التنفس من البطن', 'تنفس عميق', 'تنفس بطني'],
    category: 'cool-down',
    primaryMuscles: ['deep-core'],
    secondaryMuscles: [],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    exerciseType: 'mobility',
    alternatives: ['childs-pose', 'cool-down-walk', 'supine-spinal-twist'],
    tags: ['relax', 'breath', 'recovery', 'استرخاء', 'تنفس', 'استشفاء'],
    content: {
      en: {
        setup: [
          'Lie on your back with your knees bent and feet flat on the floor, or sit comfortably.',
          'Place one hand on your chest and the other on your belly.',
        ],
        steps: [
          'Breathe in slowly through your nose so the hand on your belly rises while the hand on your chest stays mostly still.',
          'Pause briefly at the top of the breath without straining.',
          'Breathe out slowly through your mouth or nose, letting your belly fall.',
          'Repeat at a slow, relaxed pace.',
        ],
        breathing: 'This exercise is the breathing itself: a slow breath in through the nose that fills the belly, then a longer, relaxed breath out. Try breathing in for about 4 counts and out for about 6 counts.',
        mistakes: [
          'Lifting the shoulders and chest to breathe in.',
          'Forcing very big breaths until you feel light-headed.',
          'Rushing the breath out.',
        ],
        tips: [
          'A simple way to slow down and settle at the end of a session.',
          'If you feel dizzy, return to normal breathing.',
        ],
        prescription: '2–5 minutes of slow breathing at the end of your workout.',
      },
      ar: {
        setup: [
          'استلقِ على ظهرك مع ثني الركبتين والقدمان على الأرض، أو اجلس بوضعية مريحة.',
          'ضع يداً على صدرك والأخرى على بطنك.',
        ],
        steps: [
          'خذ نفساً بطيئاً من الأنف بحيث ترتفع اليد التي على البطن وتبقى اليد التي على الصدر شبه ثابتة.',
          'توقف لحظة قصيرة في نهاية الشهيق دون إجهاد.',
          'أخرج النفس ببطء من الفم أو الأنف ودع بطنك ينزل.',
          'كرر بإيقاع بطيء ومريح.',
        ],
        breathing: 'هذا التمرين هو التنفس نفسه: شهيق بطيء من الأنف يملأ البطن، ثم زفير أطول ومريح. جرّب الشهيق لنحو 4 عدّات والزفير لنحو 6 عدّات.',
        mistakes: [
          'رفع الكتفين والصدر عند الشهيق.',
          'أخذ أنفاس كبيرة جداً بالإجبار حتى تشعر بخفة في الرأس.',
          'الاستعجال في الزفير.',
        ],
        tips: [
          'طريقة بسيطة لتهدئة جسمك والاسترخاء في نهاية التمرين.',
          'إذا شعرت بدوار، ارجع إلى التنفس الطبيعي.',
        ],
        prescription: 'من 2 إلى 5 دقائق من التنفس البطيء في نهاية التمرين.',
      },
    },
  },
  {
    slug: 'foam-rolling',
    name: 'Foam Rolling',
    arabicName: 'التدليك بالفوم رولر',
    aliases: ['Self-Myofascial Release', 'SMR', 'Foam Roller Massage'],
    arabicAliases: ['فوم رولر', 'رول', 'مساج بالرول', 'فوم رولنغ'],
    category: 'cool-down',
    primaryMuscles: ['quads', 'hamstrings', 'calves', 'glutes'],
    secondaryMuscles: ['upper-back', 'lats'],
    equipment: ['foam-roller'],
    difficulty: 'beginner',
    exerciseType: 'mobility',
    alternatives: ['standing-quad-stretch', 'standing-hamstring-stretch', 'childs-pose'],
    tags: ['massage', 'recovery', 'مساج', 'استشفاء', 'تدليك'],
    content: {
      en: {
        setup: [
          'Place the foam roller on the floor and position the muscle you want to roll on top of it (for example, the front of the thighs).',
          'Support your body weight with your hands, forearms or the other leg to control the pressure.',
        ],
        steps: [
          'Roll slowly along the muscle, a few centimetres at a time.',
          'When you find a tender spot, pause and breathe for a few seconds.',
          'Keep the pressure at a level that is uncomfortable at most, never painful.',
          'Move on to the next muscle group.',
        ],
        breathing: 'Breathe slowly and steadily the whole time. If you find yourself holding your breath, reduce the pressure.',
        mistakes: [
          'Rolling fast back and forth.',
          'Rolling directly over joints, bones or the lower back.',
          'Using so much pressure that you tense up.',
        ],
        tips: [
          'Take some weight off by supporting yourself with your hands or the other leg.',
          'For the upper back, cross your arms over your chest and keep your hips on the floor.',
        ],
        prescription: '30–60 seconds per muscle area, slowly, 1 round.',
        safety: 'Avoid rolling over bruises, injuries, swelling or varicose veins. If you have a medical condition, ask a qualified health professional first.',
      },
      ar: {
        setup: [
          'ضع الفوم رولر على الأرض واجعل العضلة التي تريد تدليكها فوقه (مثل مقدمة الفخذين).',
          'احمل وزن جسمك باليدين أو الساعدين أو الرجل الأخرى للتحكم بالضغط.',
        ],
        steps: [
          'تدحرج ببطء على طول العضلة، بضعة سنتيمترات في كل مرة.',
          'عندما تجد نقطة حساسة، توقف وتنفّس لبضع ثوانٍ.',
          'اجعل الضغط مزعجاً في أقصى حد، وليس مؤلماً أبداً.',
          'انتقل إلى المجموعة العضلية التالية.',
        ],
        breathing: 'تنفّس ببطء وبانتظام طوال الوقت. إذا وجدت نفسك تحبس النفس، فخفّف الضغط.',
        mistakes: [
          'التدحرج بسرعة ذهاباً وإياباً.',
          'التدحرج مباشرة فوق المفاصل أو العظام أو أسفل الظهر.',
          'استخدام ضغط كبير يجعلك تتشنج.',
        ],
        tips: [
          'خفّف الوزن عن الرول بالاستناد على يديك أو الرجل الأخرى.',
          'لأعلى الظهر، اعقد ذراعيك على صدرك وأبقِ الورك على الأرض.',
        ],
        prescription: 'من 30 إلى 60 ثانية لكل منطقة عضلية، ببطء، جولة واحدة.',
        safety: 'تجنّب التدحرج فوق الكدمات أو الإصابات أو التورمات أو الدوالي. إذا كانت لديك حالة صحية، فاستشر مختصاً صحياً مؤهلاً أولاً.',
      },
    },
  },
  {
    slug: 'supine-spinal-twist',
    name: 'Supine Spinal Twist',
    arabicName: 'لفّ العمود الفقري مستلقياً',
    aliases: ['Lying Spinal Twist', 'Supine Twist', 'Lying Knee Drop Twist'],
    arabicAliases: ['اطالة لف الظهر', 'ستريتش لف', 'لف الظهر مستلقي'],
    category: 'cool-down',
    primaryMuscles: ['lower-back', 'obliques'],
    secondaryMuscles: ['glutes', 'chest', 'upper-back'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    movementPattern: 'rotation',
    exerciseType: 'stretch',
    alternatives: ['thoracic-open-book', 'childs-pose', 'figure-four-glute-stretch'],
    tags: ['back stretch', 'twist', 'relax', 'ظهر', 'استرخاء'],
    content: {
      en: {
        setup: [
          'Lie on your back with your arms out to the sides at shoulder height.',
          'Bend one or both knees with your feet on the floor.',
        ],
        steps: [
          'Let your bent knees fall slowly to one side while keeping both shoulders on the floor.',
          'Turn your head gently to the opposite side if comfortable.',
          'Relax and hold, feeling the stretch along your back and side.',
          'Bring the knees back to the middle with control and repeat on the other side.',
        ],
        breathing: 'Breathe slowly and deeply into your belly and sides. Let your body relax a little more with each breath out.',
        mistakes: [
          'Lifting the opposite shoulder off the floor.',
          'Forcing the knees down to the floor.',
          'Twisting quickly.',
        ],
        tips: [
          'Place a cushion under your knees if they do not reach the floor.',
        ],
        prescription: 'Hold 20–30 seconds, 2–3 times per side. Never bounce or force into pain.',
        safety: 'If you feel sharp pain in your back, come out of the stretch slowly and ask a coach or a qualified health professional.',
      },
      ar: {
        setup: [
          'استلقِ على ظهرك والذراعان ممدودتان إلى الجانبين بمستوى الكتفين.',
          'اثنِ ركبة واحدة أو الركبتين والقدمان على الأرض.',
        ],
        steps: [
          'دع الركبتين المثنيتين تنزلان ببطء إلى جهة واحدة مع إبقاء الكتفين على الأرض.',
          'أدِر رأسك بلطف إلى الجهة المعاكسة إذا كان ذلك مريحاً.',
          'استرخِ واثبت، مع الشعور بالإطالة على طول الظهر والجانب.',
          'أعِد الركبتين إلى المنتصف بتحكم وكرر على الجهة الأخرى.',
        ],
        breathing: 'تنفّس ببطء وبعمق نحو البطن والجانبين. دع جسمك يرتخي قليلاً أكثر مع كل زفير.',
        mistakes: [
          'رفع الكتف المعاكس عن الأرض.',
          'إجبار الركبتين على النزول إلى الأرض.',
          'اللف بسرعة.',
        ],
        tips: [
          'ضع وسادة تحت ركبتيك إذا لم تصلا إلى الأرض.',
        ],
        prescription: 'اثبت من 20 إلى 30 ثانية، 2–3 مرات لكل جهة. لا ترتد ولا تُجبر الإطالة حتى الألم.',
        safety: 'إذا شعرت بألم حاد في الظهر، اخرج من الإطالة ببطء واستشر مدرباً أو مختصاً صحياً مؤهلاً.',
      },
    },
  },
];
