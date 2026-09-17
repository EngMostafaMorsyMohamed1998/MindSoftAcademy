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
  [/\bGET\b/g, "طلب قراءة"],
  [/\bPOST\b/g, "طلب إرسال"],
  [/\b2FA\b/g, "تحقق بخطوتين"],
  [/JPEGs?/gi, "صورة مضغوطة"],
  [/PNGs?/gi, "صورة شفافة"],
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
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([،.:])/g, "$1")
    .trim();
  return next;
}

export function cleanEnglish(text: string): string {
  return text
    .replace(/[\u0600-\u06FF]+/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.])/g, "$1")
    .trim();
}

export function bookletSafe(locale: Locale, text: string): string {
  return locale === "ar" ? cleanArabic(text) : cleanEnglish(text);
}

export function termArt(term: string, meaning = ""): string {
  const hay = `${term} ${meaning}`.toLowerCase();
  if (/تشفير|مفتاح|lock|encrypt|cipher|password/.test(hay)) return "lock";
  if (/جدار|firewall|شبكة|راوتر/.test(hay)) return "firewall";
  if (/تصيد|phishing|احتيال/.test(hay)) return "phish";
  if (/تزييف|deepfake|صورة مفتع/.test(hay)) return "fake";
  if (/سحاب|cloud/.test(hay)) return "cloud";
  if (/عينه|عيّنة|مجتمع|sample|population/.test(hay)) return "sample";
  if (/نظيف|شاذ|مفقود|outlier|missing|clean/.test(hay)) return "clean";
  if (/واجهة برمج|api/.test(hay)) return "api";
  if (/جدول|بيانات|data|csv/.test(hay)) return "data";
  if (/أعمدة|رسم|chart|انحدار|regress/.test(hay)) return "chart";
  if (/ويب|متصفح|صفحة|html|http|browser/.test(hay)) return "web";
  if (/تجربة|ux|مستخدم/.test(hay)) return "ux";
  if (/تعلم|عصب|نموذج|ml|neural|llm/.test(hay)) return "ml";
  if (/ذكاء|ai/.test(hay)) return "ai";
  if (/أخلاق|تحيز|ethic|bias/.test(hay)) return "ethics";
  if (/حاسوب|مختبر|lab|computer/.test(hay)) return "lab";
  return "note";
}
