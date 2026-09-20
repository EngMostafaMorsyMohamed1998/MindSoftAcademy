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
  [/3D/gi, "مجسّم"],
  [/\bAR\b/g, "واقع معزز"],
  [/\bVR\b/g, "واقع افتراضي"],
];

export function hasArabic(text: string): boolean {
  return ARABIC.test(text);
}

export function bookletLine(locale: Locale, arabic: string, english: string): string {
  if (locale === "ar") return cleanArabic(arabic || english);
  return cleanEnglish(english || arabic);
}

function readableMarks(text: string): string {
  return text
    .replace(/[⊃⊂⊆⊇]/g, ">")
    .replace(/[→←⇒▸►➔➜]/g, ">")
    .replace(/\s*>\s*/g, " > ");
}

export function cleanArabic(text: string): string {
  let next = readableMarks(text);
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
  return readableMarks(text)
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
  if (onTerm(/توكن|\btoken\b/)) return "token";
  if (onTerm(/توجيه|\bprompt/)) return "prompt";
  if (onTerm(/توليدي|generative|\bllms?\b|نموذج لغة/)) return "llm";
  if (onTerm(/صندوق|black box/)) return "box";
  if (onTerm(/وزن|\bweight\b/)) return "weight";
  if (onTerm(/طبقة|\blayer\b/)) return "layer";
  if (onTerm(/عصب|neuron|artificial neuron/)) return "neuron";
  if (onTerm(/تعلم عميق|عميق|deep learning|neural/)) return "neural";
  if (onTerm(/بلا إشراف|unsupervised/)) return "unsupervised";
  if (onTerm(/بإشراف|supervised/)) return "supervised";
  if (onTerm(/تدريب|\btrain\b|train \/ test|train\/test/)) return "split";
  if (onTerm(/تصنيف|classif/)) return "classif";
  if (onTerm(/تعلم آلي|machine learning|تعزيز|reinforcement/)) return "ml";
  if (onTerm(/ضيق|narrow/)) return "narrow";
  if (onTerm(/توصية|recommend/)) return "rec";
  if (onTerm(/صيانة|maintenance/)) return "maintain";
  if (onTerm(/إينياك|eniac|أنابيب|vacuum|حاسوب إلكتروني|electronic computer/)) return "lab";
  if (onTerm(/حاسوب شخصي|personal computer/)) return "lab";
  if (onTerm(/هواتف ذكية|smartphone|آيفون|iphone/)) return "arvr";
  if (onTerm(/إنترنت|ويب|internet|the web/)) return "web";
  if (onTerm(/مراحل|stages of it|تحول اجتماعي/)) return "lab";
  if (onTerm(/^ai$|artificial intelligence|الذكاء الاصطناعي|ذكاء اصطناعي/)) return "ai";
  if (onTerm(/انتحال|impersonat|منتحل|مدعي/)) return "mask";
  if (onTerm(/شهادة رقمية|شهادة رقم|digital certificate|\bcertificate\b/)) return "cert";
  if (onTerm(/غير متماثل|asymmetric|مفتاح عام|مفتاح خاص|public key|private key/)) return "asymmetric";
  if (onTerm(/حفظ الأدلة|حفظ الدليل|preserving evidence|\bevidence\b/)) return "preserve";
  if (onTerm(/احتواء|containment/)) return "contain";
  if (onTerm(/مخاطر|risk management|\brisk\b/)) return "risk";
  if (onTerm(/خطة استجابة|response plan|خطة الاستجابة/)) return "plan";
  if (onTerm(/تصيد|phish|حادث|\bincident\b/)) return "incident";
  if (onTerm(/تجزئة|\bhash/)) return "hash";
  if (onTerm(/متعددة العوامل|متعددة عوامل|multi-factor|\bmfa\b/)) return "mfa";
  if (onTerm(/مصادق|authentication|\bauth\b/)) return "auth";
  if (onTerm(/متماثل|symmetric/)) return "symmetric";
  if (onTerm(/شبكة خاصة|\bvpn\b/)) return "vpn";
  if (onTerm(/تقسيم|segment/)) return "segment";
  if (onTerm(/صلاحية|privilege|أقل صلاحية|least privilege/)) return "privilege";
  if (onTerm(/تشفير|encrypt|cipher|password|خصوصية|privacy/)) return "lock";
  if (onTerm(/جدار|firewall/)) return "firewall";
  if (onTerm(/تحيز عينة|تحيز العينة|sampling bias/)) return "bias-sample";
  if (onTerm(/ثانوية|secondary/)) return "secondary";
  if (onTerm(/أولية|primary data|^primary$/)) return "primary";
  if (onTerm(/عينه|عيّنة|مجتمع|\bsample\b|population/)) return "sample";
  if (onTerm(/واقع معزز|واقع افتراضي|معزز|افتراضي|augmented|\bvr\b|virtual reality|\bar\s*\/\s*vr\b/)) return "arvr";
  if (onTerm(/شفاف|transpar/)) return "glass";
  if (onTerm(/مساءل|accountab/)) return "account";
  if (onTerm(/أخلاق|تحيز|ethic|\bbias\b/)) return "ethics";
  if (onTerm(/طرفية|\bedge\b/)) return "edge";
  if (onTerm(/سحاب|\bcloud\b/)) return "cloud";
  if (onTerm(/ضغط ملفات|ضغط الملفات|compress/)) return "compress";
  if (onTerm(/نص بديل|alt text/)) return "alt";
  if (onTerm(/دقة|quality vs|جودة مقابل/)) return "quality";
  if (onTerm(/وسائط|multimedia/)) return "media";
  if (onTerm(/صفّان|صفان|\bduplicate\b/)) return "clean";
  if (onTerm(/تكرار/) && onMeaning(/صف|نسخ|duplicate|error/)) return "clean";
  if (onTerm(/^تكرار$|iteration/)) return "loop";
  if (onTerm(/واجهة مستخدم|واجهة المستخدم|\bui\b/)) return "ui";
  if (onTerm(/تسلسل|hierarchy/)) return "hierarchy";
  if (onTerm(/نقر|click count/)) return "clicks";
  if (onTerm(/أ\/ب|a\/b/)) return "ab";
  if (onTerm(/زمن مهمة|زمن المهمة|task time/)) return "clock";
  if (onTerm(/رضا|satisfaction/)) return "smile";
  if (onTerm(/أولي|prototype/)) return "proto";
  if (onTerm(/خروج|drop-off/)) return "drop";
  if (onTerm(/دليل قرار|دليل القرار|decision/)) return "decide";
  if (onTerm(/iteration|تكرار تحسين|تحسين تكراري/)) return "loop";
  if (onTerm(/قابلية|usability/)) return "use";
  if (onTerm(/تجربة مستخدم|تجربة المستخدم|\bux\b/)) return "ux";
  if (onTerm(/تنسيق صفحة|تنسيق الصفحة|\bcss\b/)) return "css";
  if (onTerm(/لغة تفاعل|لغة التفاعل|javascript/)) return "js";
  if (onTerm(/إتاحة|accessib/)) return "a11y";
  if (onTerm(/هيكل صفحة|هيكل الصفحة|\bhtml\b/)) return "html";
  if (onTerm(/بروتوكول ويب آمن|\bhttps\b/)) return "https";
  if (onTerm(/بروتوكول|\bhttp\b|طلب قراءة|طلب إرسال/)) return "http";
  if (onTerm(/سر أمامي|frontend secret/)) return "secret";
  if (onTerm(/أمامية|frontend/)) return "front";
  if (onTerm(/خلفية|backend/)) return "backend";
  if (onTerm(/عميل|client–server|client-server/)) return "web";
  if (onTerm(/ترخيص|licence|license/)) return "license";
  if (onTerm(/تاريخ تحديث|تاريخ التحديث|update date/)) return "date";
  if (onTerm(/بيانات مفتوحة|open data/)) return "open";
  if (onTerm(/\brest\b|\bjson\b|موارد ونص|موارد/)) return "json";
  if (onTerm(/مفتاح واجهة|api key/)) return "key";
  if (onTerm(/عقد واجهة|api contract/)) return "license";
  if (onTerm(/واجهة برمج|واجهة برمجة|\bapis?\b/)) return "api";
  if (onTerm(/بواقي|residual/)) return "residual";
  if (onTerm(/استكمال|extrapola/)) return "extra";
  if (onTerm(/تفسيري|explanatory/)) return "explan";
  if (onTerm(/انحدار|regress/)) return "regress";
  if (onTerm(/أعمدة|bar chart/)) return "bar";
  if (onTerm(/خط زمني|line chart/)) return "line";
  if (onTerm(/دائرة|\bpie\b/)) return "pie";
  if (onTerm(/مصدر|\bsource\b/)) return "source";
  if (onTerm(/فرضية|hypothesis/)) return "hypo";
  if (onTerm(/ثقة|confidence/)) return "conf";
  if (onTerm(/استدلال|inference/)) return "infer";
  if (onTerm(/إحصاء|descriptive/)) return "chart";
  if (onTerm(/مفقود|missing/)) return "missing";
  if (onTerm(/شاذ|outlier/)) return "outlier";
  if (onTerm(/تطبيع|تقييس|normali|standardis/)) return "scale";
  if (onTerm(/جدول|بيانات|\bdata\b|\bdatabase\b|قاعدة بيانات|csv/)) return "data";
  if (onTerm(/مور|moore|حاسوب|مختبر|\blab\b|computer|transistor/)) return "lab";

  if (onMeaning(/هلوسة|hallucin/)) return "incident";
  if (onMeaning(/توليدي|generative|\bllms?\b/)) return "llm";
  if (onMeaning(/تعلم عميق|deep learning|neural|عصبون/)) return "neural";
  if (onMeaning(/تعلم آلي|machine learning|supervised/)) return "ml";
  if (onMeaning(/ترانزستور|transistor|قانون مور|moore's law/)) return "lab";
  if (onMeaning(/تجزئة|\bhash/)) return "hash";
  if (onMeaning(/تشفير|encrypt|مفتاح خاص|password/)) return "lock";
  if (onMeaning(/جدار حماية|firewall/)) return "firewall";
  if (onMeaning(/واقع معزز|واقع افتراضي|augmented|virtual reality/)) return "arvr";
  if (onMeaning(/طرفية|edge computing/)) return "edge";
  if (onMeaning(/سحاب|cloud service/)) return "cloud";
  if (onMeaning(/متصفح|browser|frontend|html, css/)) return "web";
  return "note";
}

const ART_FALLBACKS = [
  "note",
  "lab",
  "data",
  "chart",
  "web",
  "cloud",
  "edge",
  "lock",
  "firewall",
  "ml",
  "neural",
  "llm",
  "ux",
  "html",
  "media",
  "sample",
  "api",
  "regress",
  "clean",
  "incident",
  "arvr",
  "mask",
  "asymmetric",
  "cert",
  "preserve",
  "hash",
  "mfa",
  "auth",
  "vpn",
  "css",
  "js",
  "https",
  "token",
  "prompt",
  "glass",
  "account",
  "ethics",
] as const;

function namesMatch(left: string, right: string): boolean {
  const a = left.trim().toLowerCase();
  const b = right.trim().toLowerCase();
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.length < 3 || b.length < 3) return false;
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  if (
    long.startsWith(`${short} `) &&
    /^(encryption|computing|learning|authentication|hashing)$/.test(long.slice(short.length + 1))
  ) {
    return true;
  }
  if ((a === "hash" && b === "hashing") || (b === "hash" && a === "hashing")) return true;
  if ((a === "mfa" && b.includes("factor")) || (b === "mfa" && a.includes("factor"))) return true;
  if (a.replace(/[^a-z\u0600-\u06FF]/g, "").startsWith("rest") && b.replace(/[^a-z\u0600-\u06FF]/g, "").startsWith("rest")) {
    return true;
  }
  return false;
}

export function lessonArtMap(entries: { term: string; meaning?: string }[]): Map<string, string> {
  const owner = new Map<string, string>();
  const map = new Map<string, string>();
  for (const entry of entries) {
    const key = entry.term.trim().toLowerCase();
    if (!key || map.has(key)) continue;
    let art = termArt(entry.term, entry.meaning);
    const first = owner.get(art);
    if (first && !namesMatch(first, key)) {
      const taken = new Set(owner.keys());
      const next = ART_FALLBACKS.find((name) => !taken.has(name));
      art = next ?? `${art}-${map.size}`;
    }
    if (!owner.has(art)) owner.set(art, key);
    map.set(key, art);
  }
  return map;
}

export function artFor(map: Map<string, string>, term: string, meaning = ""): string {
  return map.get(term.trim().toLowerCase()) ?? termArt(term, meaning);
}
