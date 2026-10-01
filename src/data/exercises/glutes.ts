import type { Exercise } from './types';

export const glutes: Exercise[] = [
  {
    slug: 'hip-thrust',
    name: 'Barbell Hip Thrust',
    arabicName: 'دفع الورك بالبار',
    aliases: ['Hip Thrust', 'Barbell Hip Thrusts'],
    arabicAliases: ['هيب ثرست', 'هب ثرست', 'دفع الورك'],
    category: 'glutes',
    primaryMuscles: ['glutes'],
    secondaryMuscles: ['hamstrings', 'quads'],
    equipment: ['barbell', 'bench'],
    difficulty: 'intermediate',
    movementPattern: 'hinge',
    exerciseType: 'compound',
    era: 'modern',
    alternatives: ['glute-bridge', 'single-leg-glute-bridge', 'cable-pull-through', 'romanian-deadlift'],
    tags: ['glute builder', 'hip extension', 'bar pad', 'تمرين المؤخرة'],
    content: {
      en: {
        setup: [
          'Sit on the floor with your upper back against the long side of a flat bench and a padded barbell over the crease of your hips.',
          'Bend your knees and place your feet flat, about hip-width apart, so your shins will be roughly vertical at the top.',
        ],
        steps: [
          'Brace your stomach and tuck your chin slightly, looking forward rather than at the ceiling.',
          'Drive through your whole foot to lift your hips until your body forms a straight line from shoulders to knees.',
          'Squeeze your glutes hard at the top for a moment without arching your lower back.',
          'Lower your hips under control until they are just above the floor, then repeat.',
        ],
        breathing: 'Breathe in and brace before you lift, then breathe out as you reach the top position.',
        mistakes: [
          'Arching the lower back at the top instead of finishing with the glutes.',
          'Placing the feet too far away or too close, so the hamstrings or quads take over.',
          'Letting the knees cave inward as you lift.',
          'Rushing the lowering phase or bouncing off the floor.',
        ],
        tips: [
          'Use a thick bar pad or a folded mat to protect your hips.',
          'Keep your ribs down and your chin slightly tucked — your upper back pivots on the bench.',
        ],
      },
      ar: {
        setup: [
          'اجلس على الأرض وأسند أعلى ظهرك على الحافة الطويلة لمسطبة مستوية، وضع البار مع وسادة فوق ثنية الورك.',
          'اثنِ ركبتيك وضع قدميك على الأرض بعرض الورك تقريباً، بحيث تكون الساقان شبه عموديتين في الأعلى.',
        ],
        steps: [
          'شدّ عضلات البطن وأمِل ذقنك قليلاً للأسفل، وانظر للأمام بدلاً من السقف.',
          'ادفع بكامل القدم لرفع الورك حتى يصبح جسمك خطاً مستقيماً من الكتفين إلى الركبتين.',
          'اعصر الألوية بقوة في الأعلى لحظة واحدة دون تقويس أسفل الظهر.',
          'أنزل الورك بتحكم حتى يقترب من الأرض، ثم كرّر.',
        ],
        breathing: 'خذ نفساً وشدّ الجذع قبل الرفع، ثم أخرج النفس عند الوصول إلى الوضع العلوي.',
        mistakes: [
          'تقويس أسفل الظهر في الأعلى بدلاً من إنهاء الحركة بالألوية.',
          'وضع القدمين بعيداً جداً أو قريباً جداً، فتأخذ الفخذ الخلفية أو الأمامية الحمل.',
          'انهيار الركبتين للداخل أثناء الرفع.',
          'الاستعجال في النزول أو الارتداد عن الأرض.',
        ],
        tips: [
          'استخدم وسادة سميكة للبار أو حصيرة مطوية لحماية الورك.',
          'أبقِ الأضلاع للأسفل والذقن مائلاً قليلاً — أعلى ظهرك يدور على المسطبة.',
        ],
      },
    },
  },
  {
    slug: 'glute-bridge',
    name: 'Glute Bridge',
    arabicName: 'جسر الألوية',
    aliases: ['Hip Bridge', 'Floor Glute Bridge'],
    arabicAliases: ['جلوت بريدج', 'بريدج', 'جسر الورك'],
    category: 'glutes',
    primaryMuscles: ['glutes'],
    secondaryMuscles: ['hamstrings'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    movementPattern: 'hinge',
    exerciseType: 'compound',
    era: 'classic',
    alternatives: ['hip-thrust', 'single-leg-glute-bridge', 'cable-pull-through'],
    tags: ['home workout', 'no equipment', 'hip extension', 'تمرين منزلي'],
    content: {
      en: {
        setup: [
          'Lie on your back with your knees bent, feet flat on the floor about hip-width apart, and arms resting by your sides.',
        ],
        steps: [
          'Brace your stomach gently and press your lower back toward the floor.',
          'Push through your heels and lift your hips until your body forms a straight line from shoulders to knees.',
          'Squeeze your glutes at the top for one to two seconds.',
          'Lower your hips slowly back to the floor and repeat.',
        ],
        breathing: 'Breathe out as you lift your hips, and breathe in as you lower them.',
        mistakes: [
          'Arching the lower back to lift higher.',
          'Pushing mainly through the toes instead of the heels and mid-foot.',
          'Letting the knees fall inward or outward.',
        ],
        tips: [
          'When the bodyweight version feels easy, hold a dumbbell or plate on your hips or move to the single-leg version.',
        ],
      },
      ar: {
        setup: [
          'استلقِ على ظهرك مع ثني الركبتين، وضع القدمين على الأرض بعرض الورك تقريباً، والذراعين بجانب الجسم.',
        ],
        steps: [
          'شدّ البطن بلطف واضغط أسفل ظهرك نحو الأرض.',
          'ادفع بالكعبين وارفع الورك حتى يصبح جسمك خطاً مستقيماً من الكتفين إلى الركبتين.',
          'اعصر الألوية في الأعلى لثانية أو ثانيتين.',
          'أنزل الورك ببطء إلى الأرض ثم كرّر.',
        ],
        breathing: 'أخرج النفس أثناء رفع الورك، وخذ نفساً أثناء إنزاله.',
        mistakes: [
          'تقويس أسفل الظهر للارتفاع أكثر.',
          'الدفع بأصابع القدم بدلاً من الكعب ومنتصف القدم.',
          'سقوط الركبتين للداخل أو للخارج.',
        ],
        tips: [
          'عندما يصبح التمرين سهلاً بوزن الجسم، ضع دمبل أو صحن حديد على الورك أو انتقل إلى النسخة برجل واحدة.',
        ],
      },
    },
  },
  {
    slug: 'single-leg-glute-bridge',
    name: 'Single-Leg Glute Bridge',
    arabicName: 'جسر الألوية برجل واحدة',
    aliases: ['Single-Leg Hip Bridge', 'One-Leg Glute Bridge'],
    arabicAliases: ['سنكل ليك بريدج', 'بريدج برجل واحدة', 'جلوت بريدج برجل وحدة'],
    category: 'glutes',
    primaryMuscles: ['glutes'],
    secondaryMuscles: ['hamstrings', 'glute-med'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    movementPattern: 'hinge',
    exerciseType: 'compound',
    era: 'classic',
    alternatives: ['glute-bridge', 'hip-thrust', 'step-up'],
    tags: ['unilateral', 'home workout', 'balance', 'رجل واحدة'],
    content: {
      en: {
        setup: [
          'Lie on your back with one knee bent and that foot flat on the floor near your hips.',
          'Lift the other leg so it is straight, or hold that knee bent toward your chest, and rest your arms by your sides.',
        ],
        steps: [
          'Brace your stomach and press through the heel of the working foot.',
          'Lift your hips until your body forms a straight line from shoulder to working knee, keeping both hips level.',
          'Pause and squeeze the glute of the working leg.',
          'Lower slowly, finish all reps, then switch legs.',
        ],
        breathing: 'Breathe out as you lift, and breathe in as you lower.',
        mistakes: [
          'Letting the hip of the free leg drop or twist.',
          'Arching the lower back to get higher.',
          'Rushing the reps instead of controlling each one.',
        ],
        tips: [
          'Put your hands on your hip bones to feel whether your hips stay level.',
          'Start with the regular glute bridge if you cannot keep your hips steady.',
        ],
      },
      ar: {
        setup: [
          'استلقِ على ظهرك مع ثني ركبة واحدة ووضع قدمها على الأرض قرب الورك.',
          'ارفع الرجل الأخرى مستقيمة، أو اسحب ركبتها نحو الصدر، والذراعان بجانب الجسم.',
        ],
        steps: [
          'شدّ البطن واضغط بكعب القدم العاملة.',
          'ارفع الورك حتى يصبح جسمك خطاً مستقيماً من الكتف إلى ركبة الرجل العاملة، مع إبقاء جانبي الورك في مستوى واحد.',
          'توقف لحظة واعصر ألوية الرجل العاملة.',
          'أنزل ببطء، وأكمل كل التكرارات ثم بدّل الرجل.',
        ],
        breathing: 'أخرج النفس أثناء الرفع، وخذ نفساً أثناء النزول.',
        mistakes: [
          'سقوط جهة الرجل الحرة من الورك أو دورانها.',
          'تقويس أسفل الظهر للارتفاع أكثر.',
          'الاستعجال في التكرارات بدلاً من التحكم بكل تكرار.',
        ],
        tips: [
          'ضع يديك على عظمتي الورك لتتأكد أن الورك يبقى مستوياً.',
          'ابدأ بجسر الألوية العادي إذا لم تستطع تثبيت الورك.',
        ],
      },
    },
  },
  {
    slug: 'cable-glute-kickback',
    name: 'Cable Glute Kickback',
    arabicName: 'الركلة الخلفية للألوية بالكيبل',
    aliases: ['Glute Kickback', 'Cable Hip Extension'],
    arabicAliases: ['كيك باك', 'جلوت كيك باك', 'كيك باك كيبل'],
    category: 'glutes',
    primaryMuscles: ['glutes'],
    secondaryMuscles: ['hamstrings'],
    equipment: ['cable'],
    difficulty: 'beginner',
    exerciseType: 'isolation',
    era: 'modern',
    alternatives: ['hip-thrust', 'glute-bridge', 'cable-pull-through'],
    tags: ['ankle strap', 'glute isolation', 'unilateral', 'رجل واحدة'],
    content: {
      en: {
        setup: [
          'Attach an ankle strap to a low cable pulley and fasten it around one ankle.',
          'Face the machine, hold the frame for support, and lean your torso slightly forward with a soft bend in the standing knee.',
        ],
        steps: [
          'Brace your stomach and keep your hips square to the machine.',
          'Push the working leg back by extending your hip, keeping the knee slightly bent.',
          'Stop when you feel a strong glute squeeze, before your lower back starts to arch.',
          'Return the leg forward slowly under control, finish your reps, then switch sides.',
        ],
        breathing: 'Breathe out as you kick back, and breathe in as the leg returns.',
        mistakes: [
          'Swinging the leg with momentum.',
          'Arching the lower back to lift the leg higher.',
          'Rotating the hips open toward the working side.',
        ],
        tips: [
          'A short, controlled range with a clear glute squeeze is better than a big swing.',
          'Use a light weight at first — this is a small, focused movement.',
        ],
      },
      ar: {
        setup: [
          'ثبّت حزام الكاحل على بكرة كيبل منخفضة ولفّه حول أحد الكاحلين.',
          'قف مواجهاً للجهاز، وامسك الإطار للثبات، وأمِل جذعك قليلاً للأمام مع ثني بسيط في ركبة رجل الارتكاز.',
        ],
        steps: [
          'شدّ البطن وأبقِ الورك مواجهاً للجهاز.',
          'ادفع الرجل العاملة للخلف بمدّ مفصل الورك، مع إبقاء الركبة مثنية قليلاً.',
          'توقف عندما تشعر بعصر قوي في الألوية، وقبل أن يبدأ أسفل الظهر بالتقوّس.',
          'أرجع الرجل للأمام ببطء وتحكم، وأكمل التكرارات ثم بدّل الجهة.',
        ],
        breathing: 'أخرج النفس أثناء الدفع للخلف، وخذ نفساً أثناء رجوع الرجل.',
        mistakes: [
          'أرجحة الرجل باستخدام الزخم.',
          'تقويس أسفل الظهر لرفع الرجل أعلى.',
          'فتح الورك ودورانه نحو جهة الرجل العاملة.',
        ],
        tips: [
          'مدى قصير ومتحكَّم به مع عصر واضح للألوية أفضل من أرجحة كبيرة.',
          'ابدأ بوزن خفيف — هذه حركة صغيرة ومركّزة.',
        ],
      },
    },
  },
  {
    slug: 'hip-abduction-machine',
    name: 'Hip Abduction Machine',
    arabicName: 'جهاز تبعيد الورك',
    aliases: ['Hip Abduction', 'Seated Hip Abduction', 'Abductor Machine'],
    arabicAliases: ['هيب أبدكشن', 'جهاز أبدكتور', 'تبعيد الورك'],
    category: 'glutes',
    primaryMuscles: ['glute-med'],
    secondaryMuscles: ['glutes'],
    equipment: ['machine'],
    difficulty: 'beginner',
    exerciseType: 'isolation',
    era: 'modern',
    alternatives: ['banded-lateral-walk', 'single-leg-glute-bridge', 'side-plank'],
    tags: ['outer thigh', 'outer hip', 'فخذ خارجي', 'ورك خارجي'],
    content: {
      en: {
        setup: [
          'Sit on the machine with your back against the pad and the outside of your knees against the leg pads.',
          'Set the start position so your legs are together or slightly apart, and hold the handles.',
        ],
        steps: [
          'Sit tall and keep your back against the pad.',
          'Push your knees outward against the pads as far as you can control.',
          'Pause briefly at the widest point.',
          'Let your legs come back together slowly without letting the weight stack touch down.',
        ],
        breathing: 'Breathe out as you push the legs apart, and breathe in as they come back together.',
        mistakes: [
          'Letting the weights slam between reps.',
          'Rocking the torso back and forth to move the weight.',
          'Using a load so heavy that the range becomes very short.',
        ],
        tips: [
          'Leaning your torso slightly forward from the hips is a common variation — keep your back straight if you do it.',
        ],
      },
      ar: {
        setup: [
          'اجلس على الجهاز مع إسناد ظهرك على الوسادة، والجهة الخارجية للركبتين على وسائد الأرجل.',
          'اضبط وضع البداية بحيث تكون الرجلان مضمومتين أو متباعدتين قليلاً، وامسك المقابض.',
        ],
        steps: [
          'اجلس باستقامة وأبقِ ظهرك على الوسادة.',
          'ادفع الركبتين للخارج ضد الوسائد إلى أبعد مدى تتحكم به.',
          'توقف لحظة عند أوسع نقطة.',
          'أرجع الرجلين ببطء دون أن تلمس الأثقال بعضها.',
        ],
        breathing: 'أخرج النفس أثناء فتح الرجلين، وخذ نفساً أثناء إرجاعهما.',
        mistakes: [
          'ترك الأثقال تصطدم بين التكرارات.',
          'تحريك الجذع للأمام والخلف لدفع الوزن.',
          'استخدام وزن ثقيل جداً يجعل مدى الحركة قصيراً.',
        ],
        tips: [
          'إمالة الجذع قليلاً للأمام من الورك نسخة شائعة — حافظ على استقامة ظهرك إذا استخدمتها.',
        ],
      },
    },
  },
  {
    slug: 'banded-lateral-walk',
    name: 'Banded Lateral Walk',
    arabicName: 'المشي الجانبي بالحبل المطاطي',
    aliases: ['Lateral Band Walk', 'Band Side Walk'],
    arabicAliases: ['لاترال باند ووك', 'باند ووك', 'مشي جانبي بالباند'],
    category: 'glutes',
    primaryMuscles: ['glute-med'],
    secondaryMuscles: ['glutes', 'quads'],
    equipment: ['band'],
    difficulty: 'beginner',
    exerciseType: 'isolation',
    era: 'modern',
    alternatives: ['hip-abduction-machine', 'single-leg-glute-bridge', 'lateral-lunge'],
    tags: ['mini band', 'glute activation', 'warm-up', 'تنشيط الألوية'],
    content: {
      en: {
        setup: [
          'Place a loop band around your legs just above the knees or around the ankles.',
          'Stand with your feet hip-width apart, bend your knees slightly and hinge a little at the hips into a quarter-squat.',
        ],
        steps: [
          'Keep tension on the band and your knees pointing over your toes.',
          'Step sideways with the leading foot, about shoulder-width.',
          'Follow with the trailing foot, keeping it apart enough that the band stays tight.',
          'Take all your steps in one direction, then walk back the same number the other way.',
        ],
        breathing: 'Breathe steadily and naturally throughout — do not hold your breath.',
        mistakes: [
          'Letting the feet come fully together so the band goes slack.',
          'Letting the knees collapse inward.',
          'Standing up tall or rocking the upper body side to side.',
        ],
        tips: [
          'A band around the ankles makes it harder than a band above the knees.',
          'Often used as part of a warm-up before lower-body training.',
        ],
        prescription: '2–3 sets of 10–15 steps in each direction.',
      },
      ar: {
        setup: [
          'ضع حبلاً مطاطياً دائرياً حول الرجلين فوق الركبتين مباشرة أو حول الكاحلين.',
          'قف بعرض الورك، واثنِ الركبتين قليلاً مع ثني بسيط من الورك في وضع ربع قرفصاء.',
        ],
        steps: [
          'حافظ على شدّ الحبل، ولتكن الركبتان باتجاه أصابع القدمين.',
          'خطوة جانبية بالقدم الأمامية بعرض الكتفين تقريباً.',
          'اتبعها بالقدم الأخرى مع إبقاء مسافة كافية ليبقى الحبل مشدوداً.',
          'أكمل خطواتك في اتجاه واحد، ثم ارجع بنفس العدد في الاتجاه الآخر.',
        ],
        breathing: 'تنفّس بانتظام وبشكل طبيعي طوال التمرين — لا تحبس النفس.',
        mistakes: [
          'ضمّ القدمين بالكامل فيرتخي الحبل.',
          'انهيار الركبتين للداخل.',
          'الوقوف باستقامة كاملة أو تمايل الجذع من جانب لآخر.',
        ],
        tips: [
          'وضع الحبل حول الكاحلين أصعب من وضعه فوق الركبتين.',
          'يُستخدم غالباً ضمن الإحماء قبل تمارين الجزء السفلي.',
        ],
        prescription: '2–3 مجموعات من 10–15 خطوة في كل اتجاه.',
      },
    },
  },
  {
    slug: 'cable-pull-through',
    name: 'Cable Pull-Through',
    arabicName: 'سحب الكيبل بين الساقين',
    aliases: ['Pull-Through', 'Rope Pull-Through'],
    arabicAliases: ['بول ثرو', 'كيبل بول ثرو'],
    category: 'glutes',
    primaryMuscles: ['glutes', 'hamstrings'],
    secondaryMuscles: ['lower-back', 'forearms'],
    equipment: ['cable'],
    difficulty: 'beginner',
    movementPattern: 'hinge',
    exerciseType: 'compound',
    era: 'modern',
    alternatives: ['kettlebell-swing', 'romanian-deadlift', 'hip-thrust', 'good-morning'],
    tags: ['hip hinge', 'rope attachment', 'learn the hinge', 'تعلم ثني الورك'],
    content: {
      en: {
        setup: [
          'Attach a rope to a low cable pulley and stand facing away from the machine.',
          'Reach between your legs to hold the rope with both hands, then walk forward until the weight lifts, feet a little wider than hip-width.',
        ],
        steps: [
          'With a soft bend in your knees, push your hips back and let the rope travel back between your legs.',
          'Keep your back flat and lower your torso until you feel a stretch in your hamstrings.',
          'Drive your hips forward to stand tall, squeezing your glutes at the top.',
          'Hinge back again under control for the next rep.',
        ],
        breathing: 'Breathe in as you hinge back, and breathe out as you drive your hips forward to stand.',
        mistakes: [
          'Squatting down instead of pushing the hips back.',
          'Pulling the rope with the arms — the arms just hold on.',
          'Leaning back or arching the lower back at the top.',
          'Rounding the back at the bottom.',
        ],
        tips: [
          'A useful way to learn the hip hinge before deadlifts or kettlebell swings.',
          'Finish each rep by standing tall with glutes squeezed, not by leaning backward.',
        ],
      },
      ar: {
        setup: [
          'ثبّت حبلاً على بكرة كيبل منخفضة وقف معطياً ظهرك للجهاز.',
          'مدّ يديك بين ساقيك وامسك الحبل بكلتا اليدين، ثم امشِ للأمام حتى يرتفع الوزن، والقدمان أعرض قليلاً من الورك.',
        ],
        steps: [
          'مع ثني بسيط في الركبتين، ادفع الورك للخلف واترك الحبل يرجع بين ساقيك.',
          'حافظ على استقامة الظهر وأنزل الجذع حتى تشعر بإطالة في الفخذ الخلفية.',
          'ادفع الورك للأمام لتقف باستقامة مع عصر الألوية في الأعلى.',
          'ارجع بالورك للخلف بتحكم للتكرار التالي.',
        ],
        breathing: 'خذ نفساً أثناء ثني الورك للخلف، وأخرج النفس أثناء دفع الورك للأمام والوقوف.',
        mistakes: [
          'النزول بشكل قرفصاء بدلاً من دفع الورك للخلف.',
          'سحب الحبل بالذراعين — الذراعان تمسكان الحبل فقط.',
          'الميل للخلف أو تقويس أسفل الظهر في الأعلى.',
          'تقوّس الظهر (تحدّبه) في الأسفل.',
        ],
        tips: [
          'طريقة مفيدة لتعلم حركة ثني الورك قبل الديدلفت أو أرجحة الكيتل بيل.',
          'أنهِ كل تكرار بالوقوف باستقامة مع عصر الألوية، وليس بالميل للخلف.',
        ],
      },
    },
  },
];
