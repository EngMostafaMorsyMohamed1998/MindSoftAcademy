import { CHAPTERS } from "@/lib/curriculum";
import { explainsForLesson, type LessonExplain } from "@/lib/lesson-explains";
import { LESSON_NOTES, type LessonNote } from "@/lib/lessons";

export type TextbookRow = {
  cellsAr: string[];
  cellsEn: string[];
  exampleAr?: string;
  exampleEn?: string;
};

export type TextbookPage = {
  id: string;
  titleAr: string;
  titleEn: string;
  pageNo: number;
  questionAr: string;
  questionEn: string;
  sectionAr: string;
  sectionEn: string;
  introAr: string;
  introEn: string;
  photo?: string;
  art: string;
  headersAr: string[];
  headersEn: string[];
  rows: TextbookRow[];
  pointsAr: string[];
  pointsEn: string[];
  explains: LessonExplain[];
  takeawayAr: string;
  takeawayEn: string;
};

const ARTS: Record<string, string> = {
  "1-1": "lab",
  "1-2": "nest",
  "1-3": "life",
  "1-4": "ethics",
  "2-1": "lock",
  "2-2": "firewall",
  "2-3": "incident",
  "3-1": "web",
  "3-2": "http",
  "3-3": "html",
  "4-1": "media",
  "4-2": "ux",
  "4-3": "ux",
  "4-4": "ux",
  "5-1": "data",
  "5-2": "clean",
  "5-3": "api",
  "6-1": "chart",
  "6-2": "regress",
  "6-3": "chart",
  "7-1": "ml",
  "7-2": "neural",
  "7-3": "llm",
};

const PAGE_1_1: TextbookPage = {
  id: "1-1",
  titleAr: "تطور تكنولوجيا المعلومات والتحول الاجتماعي",
  titleEn: "Development of IT and social change",
  pageNo: 5,
  questionAr: "كيف تطورت تكنولوجيا المعلومات عبر مراحلها الرئيسية، وكيف غيّرت كل مرحلة المجتمع؟",
  questionEn: "How did IT grow through its main stages, and how did each stage change society?",
  sectionAr: "تاريخ تكنولوجيا المعلومات",
  sectionEn: "A short history of IT",
  introAr: "الجدول يلخص مراحل التقنية. بعدها خمس تحولات اجتماعية، ثم تقنيات ناشئة.",
  introEn: "The table sums up the IT stages. Then come five social changes, then emerging technologies.",
  art: "lab",
  headersAr: ["الفترة الزمنية", "التقنيات والأحداث الرئيسية", "التأثير على المجتمع"],
  headersEn: ["Period", "Key technologies and events", "Effect on society"],
  pointsAr: [
    "خمس تحولات اجتماعية: شبكات التواصل، التجارة الإلكترونية، العمل عن بُعد، التعلّم عبر الإنترنت، والدفع بلا نقد.",
    "القيادة الذاتية تحتاج حوسبة طرفية لأن تأخير جزء من الثانية خطر.",
    "قانون مور: عدد الترانزستورات يتضاعف تقريبًا كل سنتين، واقترب من حد فيزيائي؛ لذلك تظهر المعالجة المتوازية والبت الكمومي.",
  ],
  pointsEn: [
    "Five social changes: SNS, e-commerce, remote work, online learning, and cashless payment.",
    "Autonomous driving needs edge computing because a 0.1 second delay can cause an accident.",
    "Moore's Law: transistors roughly double every two years and are near a physical limit, so parallel cores and qubits appear.",
  ],
  explains: explainsForLesson("1-1"),
  takeawayAr: "التقنية لا تقفز مرة واحدة؛ كل مرحلة تغيّر كيف نتواصل ونعمل وندفع.",
  takeawayEn: "IT did not jump once; each stage changed how we communicate, work, and pay.",
  rows: [
    {
      cellsAr: [
        "الأربعينيات–الخمسينيات",
        "ظهور الحاسوب الإلكتروني، ومنه إينياك، باستخدام الأنابيب المفرغة.",
        "استخدام أساسًا للأغراض العسكرية والحسابات العلمية.",
      ],
      cellsEn: [
        "1940s–1950s",
        "Electronic computers appear, including ENIAC, using vacuum tubes.",
        "Used mainly for military and scientific calculation.",
      ],
    },
    {
      cellsAr: [
        "الثمانينيات",
        "انتشار الحاسوب الشخصي.",
        "بداية استخدام الأفراد والمؤسسات للحاسوب في العمل والتعليم بدل الطرق التقليدية.",
      ],
      cellsEn: [
        "1980s",
        "The personal computer (PC) spreads.",
        "People and offices start using a computer for daily work and learning.",
      ],
    },
    {
      cellsAr: [
        "التسعينيات",
        "إتاحة الإنترنت للاستخدام التجاري، وظهور الويب.",
        "انتشار الوصول العالمي للمعلومات والبريد الإلكتروني.",
      ],
      cellsEn: [
        "1990s",
        "The Internet opens to business, and the web appears.",
        "Worldwide access to information and email.",
      ],
    },
    {
      cellsAr: ["العقد الأول من الألفية", "ظهور الهواتف الذكية (آيفون وغيره).", "انتشار سريع وواسع للإنترنت عبر المحمول."],
      cellsEn: ["2000s", "Smartphones appear (iPhone and others).", "Fast, wide access to the Internet from a pocket."],
    },
    {
      cellsAr: [
        "من العقد الثاني فصاعدًا",
        "انتشار الحوسبة السحابية.",
        "تحليل البيانات الضخمة والذكاء الاصطناعي؛ تقديم موارد تكنولوجيا المعلومات في صورة خدمات عبر الإنترنت.",
      ],
      cellsEn: [
        "2010s onward",
        "Cloud computing spreads.",
        "Big-data analysis and AI; IT arrives as a service over the Internet.",
      ],
    },
  ],
};

function fromNote(note: LessonNote): TextbookPage {
  const lesson = CHAPTERS.flatMap((chapter) => chapter.lessons).find((item) => item.id === note.id);
  return {
    id: note.id,
    titleAr: lesson?.titleAr ?? note.id,
    titleEn: lesson?.titleEn ?? note.id,
    pageNo: lesson?.bookPage ?? 1,
    questionAr: `ما الفكرة الأساسية في «${lesson?.titleAr ?? note.id}»؟`,
    questionEn: `What is the core idea of “${lesson?.titleEn ?? note.id}”?`,
    sectionAr: lesson?.titleAr ?? note.id,
    sectionEn: lesson?.titleEn ?? note.id,
    introAr: note.bodyAr[0] ?? note.takeawayAr,
    introEn: note.bodyEn[0] ?? note.takeawayEn,
    art: ARTS[note.id] ?? "lab",
    headersAr: ["المصطلح", "المعنى"],
    headersEn: ["Term", "Meaning"],
    rows: note.termsAr.map((term, index) => {
      const en = note.termsEn[index] ?? term;
      return {
        cellsAr: [term.term, term.meaning],
        cellsEn: [en.term, en.meaning],
      };
    }),
    pointsAr: note.bodyAr.slice(1),
    pointsEn: note.bodyEn.slice(1),
    explains: explainsForLesson(note.id),
    takeawayAr: note.takeawayAr,
    takeawayEn: note.takeawayEn,
  };
}

const PAGES: TextbookPage[] = LESSON_NOTES.map((note) => (note.id === "1-1" ? PAGE_1_1 : fromNote(note)));

export function textbookPageFor(id: string): TextbookPage | undefined {
  return PAGES.find((page) => page.id === id);
}

export function textbookPagesForChapter(chapterId: string): TextbookPage[] {
  return PAGES.filter((page) => page.id.startsWith(`${chapterId}-`));
}
