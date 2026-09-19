import type { Locale } from "@/lib/locale";

const ARABIC = /[\u0600-\u06FF]/;
const LATIN_WORD = /[A-Za-z]{2,}/g;

const AR_SWAPS: [RegExp, string][] = [
  [/JavaScript/gi, "لغة التفاعل"],
  [/\bHTML\b/g, "هيكل الصفحة"],
  [/\bCSS\b/g, "تنسيق الصفحة"],
  [/\bAPIs?\b/g, "واجهة برمجية"],
  [/\bHTTPS\b/g, "بروتوكول ويب آمن"],
  [/\bHTTP\b/g, "بروتوكول الويب"],
  [/\bGET\b/g, "الجلب"],
  [/\bPOST\b/g, "الإرسال"],
  [/\bPUT\b/g, "الاستبدال الكامل"],
  [/\bPATCH\b/g, "التعديل الجزئي"],
  [/\bDELETE\b/g, "الحذف"],
  [/\bREST\b/g, "موارد بعنوان"],
  [/\bJSON\b/g, "نص بيانات منظم"],
  [/\bTLS\b/g, "قناة مشفّرة"],
  [/\bPDF\b/g, "ملف مطبوع"],
  [/\bVPN\b/g, "شبكة خاصة افتراضية"],
  [/\b2FA\b/g, "تحقق بخطوتين"],
  [/JPEGs?/gi, "صورة مضغوطة"],
  [/PNGs?/gi, "صورة شفافة"],
  [/\bWAV\b/g, "تسجيل غير مضغوط"],
  [/\bdiv\b/gi, "مربع شكل"],
  [/\bspan\b/gi, "نص بلا معنى"],
  [/\bSTEM\b/g, "العلوم والهندسة"],
  [/Excel/gi, "جدول إلكتروني"],
  [/\bhttp\b/g, "بروتوكول الويب"],
  [/type=hidden/g, "الحقل المخفي"],
  [/IMG_\d+/g, "اسم الملف الخام"],
  [/\bHash\b/gi, "تجزئة"],
  [/\bAGI\b/g, "ذكاء عام"],
  [/\bLLMs?\b/g, "نموذج لغة كبير"],
  [/\bUX\b/g, "تجربة المستخدم"],
  [/\bUI\b/g, "واجهة المستخدم"],
  [/\bAI\b/g, "ذكاء اصطناعي"],
  [/\bIT\b/g, "تكنولوجيا المعلومات"],
  [/\bPCs?\b/g, "حاسوب شخصي"],
  [/\bURL\b/g, "عنوان الصفحة"],
  [/\bWi-?Fi\b/gi, "واي فاي"],
  [/ENIAC/gi, "إينياك"],
  [/Al-?Faiz/gi, "الفائز"],
];

export function hasArabic(text: string): boolean {
  return ARABIC.test(text);
}

export function bookletLine(locale: Locale, arabic: string, english: string): string {
  if (locale === "ar") return cleanArabic(arabic || english);
  return cleanEnglish(english || arabic);
}

export function cleanArabic(text: string): string {
  let next = text;
  for (const [pattern, swap] of AR_SWAPS) next = next.replace(pattern, swap);
  next = next
    .replace(LATIN_WORD, "")
    .replace(/\(\s*\)/g, "")
    .replace(/[^\S\n]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[^\S\n]+([،.:])/g, "$1")
    .trim();
  return next;
}

export function cleanEnglish(text: string): string {
  return text
    .replace(/[\u0600-\u06FF]+/g, "")
    .replace(/[^\S\n]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[^\S\n]+([,.])/g, "$1")
    .trim();
}

export function bookletSafe(locale: Locale, text: string): string {
  return locale === "ar" ? cleanArabic(text) : cleanEnglish(text);
}

function foldArabicArticle(text: string): string {
  return text.toLowerCase().replace(/(^|[^\u0600-\u06FF])ال(?=[\u0600-\u06FF])/g, "$1");
}

export function termArt(term: string, meaning = ""): string {
  const t = foldArabicArticle(term);
  const m = foldArabicArticle(meaning);
  const onTerm = (pattern: RegExp) => pattern.test(t);
  const onMeaning = (pattern: RegExp) => pattern.test(m);

  if (onTerm(/تزييف|deepfake/)) return "fake";
  if (onTerm(/هلوسة|hallucin/)) return "incident";
  if (onTerm(/توليدي|generative|\bllms?\b|نموذج لغة|توكن|\btoken\b|توجيه|\bprompt/)) return "llm";
  if (onTerm(/تعلم عميق|عميق|deep learning|عصب|neuron|neural|\bweight\b|وزن|طبقة|\blayer\b|صندوق|black box/)) {
    return "neural";
  }
  if (onTerm(/تعلم آلي|machine learning|بإشراف|بلا إشراف|supervised|unsupervised|تعزيز|reinforcement|تصنيف|classif|تدريب|\btrain\b/)) {
    return "ml";
  }
  if (onTerm(/ضيق|narrow/)) return "narrow";
  if (onTerm(/توصية|recommend/)) return "rec";
  if (onTerm(/صيانة|maintenance/)) return "maintain";
  if (onTerm(/^ai$|الذكاء الاصطناعي|ذكاء اصطناعي/)) return "ai";
  if (onTerm(/تصيد|phish|حادث|\bincident\b|احتواء|containment|مخاطر|risk management|خطة استجابة|استجابة|response plan/)) {
    return "incident";
  }
  if (onTerm(/تشفير|مفتاح|مصادق|encrypt|cipher|password|symmetric|asymmetric|\bmfa\b|auth|خصوصية|privacy|\bvpn\b|شبكة خاصة/)) {
    return "lock";
  }
  if (onTerm(/جدار|firewall|تقسيم|segment|صلاحية|privilege/)) return "firewall";
  if (onTerm(/عينه|عيّنة|مجتمع|\bsample\b|population|أولية|ثانوية|primary|secondary|تحيز عينة|تحيز العينة|sampling bias/)) {
    return "sample";
  }
  if (onTerm(/واقع معزز|واقع افتراضي|معزز|افتراضي|augmented|\bvr\b|virtual reality|\bar\s*\/\s*vr\b/)) return "arvr";
  if (onTerm(/شفاف|transpar/)) return "glass";
  if (onTerm(/مساءل|accountab/)) return "account";
  if (onTerm(/أخلاق|تحيز|ethic|\bbias\b/)) return "ethics";
  if (onTerm(/طرفية|\bedge\b/)) return "edge";
  if (onTerm(/سحاب|\bcloud\b/)) return "cloud";
  if (onTerm(/وسائط|ضغط ملفات|ضغط الملفات|نص بديل|multimedia|compress|alt text|دقة|quality vs|جودة مقابل/)) {
    return "media";
  }
  if (onTerm(/صفّان|صفان|\bduplicate\b/)) return "clean";
  if (onTerm(/تكرار/) && onMeaning(/صف|نسخ|duplicate|error/)) return "clean";
  if (
    onTerm(
      /تجربة مستخدم|تجربة المستخدم|\bux\b|واجهة مستخدم|واجهة المستخدم|\bui\b|تسلسل|hierarchy|نقر|usability|قابلية|أ\/ب|a\/b|رضا|satisfaction|أولي|prototype|خروج|drop-off|زمن مهمة|زمن المهمة|task time|iteration|تكرار|دليل قرار|دليل القرار|decision|click count/,
    )
  ) {
    return "ux";
  }
  if (onTerm(/هيكل صفحة|هيكل الصفحة|\bhtml\b|تنسيق صفحة|تنسيق الصفحة|\bcss\b|لغة تفاعل|لغة التفاعل|javascript|إتاحة|accessib/)) {
    return "html";
  }
  if (onTerm(/بروتوكول|\bhttps?\b|طلب قراءة|طلب إرسال/)) return "http";
  if (onTerm(/أمامية|خلفية|frontend|backend|عميل|client–server|client-server/)) return "web";
  if (onTerm(/واجهة برمج|واجهة برمجة|\bapis?\b|بيانات مفتوحة|open data|ترخيص|licence|تاريخ تحديث|تاريخ التحديث|update date|\brest\b|\bjson\b|موارد/)) {
    return "api";
  }
  if (onTerm(/انحدار|بواقي|residual|regress|استكمال|extrapola|تفسيري|explanatory/)) return "regress";
  if (
    onTerm(
      /أعمدة|دائرة|خط زمني|bar chart|line chart|\bpie\b|إحصاء|descriptive|inference|استدلال|فرضية|hypothesis|ثقة|confidence|\bsource\b|مصدر/,
    )
  ) {
    return "chart";
  }
  if (onTerm(/مفقود|شاذ|outlier|missing|تطبيع|تقييس|normali|standardis|\bduplicate\b/)) return "clean";
  if (onTerm(/جدول|بيانات|\bdata\b|\bdatabase\b|قاعدة بيانات|csv/)) return "data";
  if (onTerm(/مور|moore|حاسوب|مختبر|\blab\b|computer|transistor/)) return "lab";

  if (onMeaning(/هلوسة|hallucin/)) return "incident";
  if (onMeaning(/توليدي|generative|\bllms?\b/)) return "llm";
  if (onMeaning(/تعلم عميق|deep learning|neural|عصبون/)) return "neural";
  if (onMeaning(/تعلم آلي|machine learning|supervised/)) return "ml";
  if (onMeaning(/ترانزستور|transistor|قانون مور|moore's law/)) return "lab";
  if (onTerm(/تجزئة|\bhash/)) return "lock";
  if (onMeaning(/تشفير|encrypt|مفتاح خاص|password|تجزئة|\bhash/)) return "lock";
  if (onMeaning(/جدار حماية|firewall/)) return "firewall";
  if (onMeaning(/واقع معزز|واقع افتراضي|augmented|virtual reality/)) return "arvr";
  if (onMeaning(/طرفية|edge computing/)) return "edge";
  if (onMeaning(/سحاب|cloud service/)) return "cloud";
  if (onMeaning(/متصفح|browser|frontend|html, css/)) return "web";
  return "note";
}
