import type { Localized } from '../i18n/types';

/** Daily tips — short, practical, no medical claims. Rotates by calendar day. */
export const tips: Localized[] = [
  { ar: 'لا تطارد الوزن على حساب التقنية.', en: 'Don’t chase weight at the expense of technique.' },
  { ar: 'الاستشفاء جزء من التدريب.', en: 'Recovery is part of training.' },
  { ar: 'الاستمرارية أهم من محاولة الوصول إلى نتائج سريعة.', en: 'Consistency beats chasing fast results.' },
  { ar: 'ابدأ كل حصة بإحماء 5–10 دقائق.', en: 'Start every session with a 5–10 minute warm-up.' },
  { ar: 'سجّل أوزانك وتكراراتك حتى تعرف إذا كنت تتقدم.', en: 'Log your weights and reps so you know you’re progressing.' },
  { ar: 'الألم الحاد إشارة توقف، وليس شيئاً تتجاهله.', en: 'Sharp pain is a stop signal, not something to push through.' },
  { ar: 'اشرب الماء خلال اليوم، وليس فقط أثناء التمرين.', en: 'Drink water through the day, not only during training.' },
  { ar: 'النوم الجيد من أقوى أدوات الاستشفاء.', en: 'Good sleep is one of the strongest recovery tools.' },
  { ar: 'تحكّم بالوزن أثناء النزول — لا تتركه يسقط.', en: 'Control the weight on the way down — don’t let it drop.' },
  { ar: 'أضف تكراراً واحداً أو وزناً بسيطاً — هذا هو التحميل التدريجي.', en: 'Add one rep or a little weight — that’s progressive overload.' },
  { ar: 'وزّع البروتين على وجباتك خلال اليوم.', en: 'Spread your protein across your meals.' },
  { ar: 'إذا ما متأكد من الحركة، اسأل الكابتن قبل ما تزيد الوزن.', en: 'Not sure about a movement? Ask the coach before adding weight.' },
  { ar: 'المشي اليومي يدعم لياقتك واستشفاءك.', en: 'Daily walking supports your fitness and recovery.' },
  { ar: 'خطة بسيطة تلتزم بها أفضل من خطة مثالية تتركها.', en: 'A simple plan you follow beats a perfect plan you quit.' },
  { ar: 'رجّع الأوزان لمكانها بعد التمرين — احترام للقاعة وللزملاء.', en: 'Re-rack your weights — respect the gym and fellow members.' },
  { ar: 'لا تقارن بدايتك بنتائج غيرك بعد سنوات.', en: 'Don’t compare your day one to someone else’s year five.' },
  { ar: 'الخضار والفاكهة يومياً تدعم صحتك العامة.', en: 'Vegetables and fruit every day support your overall health.' },
  { ar: 'التنفس الصحيح يساعدك على ثبات الجذع أثناء الرفع.', en: 'Correct breathing helps you brace your trunk while lifting.' },
  { ar: 'أيام الراحة مهمة مثل أيام التمرين.', en: 'Rest days matter as much as training days.' },
  { ar: 'المدى الحركي الكامل بتحكم أفضل من نصف حركة بوزن ثقيل.', en: 'A controlled full range of motion beats half reps with heavy weight.' },
  { ar: 'جهّز وجباتك مسبقاً لتسهّل الالتزام.', en: 'Prepare meals ahead to make consistency easier.' },
];

/** Index of the tip for a given date (same tip all day, changes daily). */
export function tipIndexFor(date: Date, count = tips.length): number {
  const start = Date.UTC(date.getFullYear(), 0, 0);
  const today = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const dayOfYear = Math.floor((today - start) / 86_400_000);
  return (dayOfYear + date.getFullYear()) % count;
}
