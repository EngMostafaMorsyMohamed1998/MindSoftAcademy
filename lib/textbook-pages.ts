import { CHAPTERS } from "@/lib/curriculum";
import { LESSON_NOTES, type LessonNote } from "@/lib/lessons";

export type TextbookRow = {
  cellsAr: [string, string, string];
  cellsEn: [string, string, string];
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
  headersAr: [string, string, string];
  headersEn: [string, string, string];
  rows: TextbookRow[];
};

const HEADERS: Record<string, { ar: [string, string, string]; en: [string, string, string] }> = {
  "1": { ar: ["الفكرة", "المعنى", "أثرها"], en: ["Idea", "Meaning", "Effect"] },
  "2": { ar: ["التقنية", "ماذا تفعل", "تذكّر"], en: ["Technique", "What it does", "Remember"] },
  "3": { ar: ["الجزء", "دوره", "خطأ شائع"], en: ["Part", "Role", "Common slip"] },
  "4": { ar: ["العنصر", "وظيفته", "نصيحة"], en: ["Element", "Job", "Tip"] },
  "5": { ar: ["الخطوة", "لماذا", "مثال"], en: ["Step", "Why", "Example"] },
  "6": { ar: ["الأداة", "متى", "انتبه"], en: ["Tool", "When", "Watch out"] },
  "7": { ar: ["النوع", "ماذا يفعل", "مثال"], en: ["Type", "What it does", "Example"] },
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
  sectionAr: "تاريخ تكنولوجيا المعلومات (IT)",
  sectionEn: "A short history of IT",
  introAr: "الجدول يلخص المحطات الرئيسية: من حاسوب يملأ غرفة، إلى خدمات سحابية تصل للهاتف.",
  introEn: "The table sums up the main stops: from a room-sized computer to cloud services on a phone.",
  photo: "/booklet/it-computer-room.jpg",
  art: "lab",
  headersAr: ["الفترة الزمنية", "التقنيات والأحداث الرئيسية", "التأثير على المجتمع"],
  headersEn: ["Period", "Key technologies and events", "Effect on society"],
  rows: [
    {
      cellsAr: [
        "الأربعينيات–الخمسينيات",
        "ظهور الحاسوب الإلكتروني، ومنه ENIAC، باستخدام الأنابيب المفرغة.",
        "استخدام أساسًا للأغراض العسكرية والحسابات العلمية.",
      ],
      cellsEn: [
        "1940s–1950s",
        "Electronic computers appear, including ENIAC, using vacuum tubes.",
        "Used mainly for military and scientific calculation.",
      ],
      exampleAr: "مثال: استخدمت القوات العسكرية حاسب ENIAC لإجراء حسابات معقدة، مما أظهر أهمية الحاسوب في العمل العلمي والعسكري قبل أن يصل إلى البيوت.",
      exampleEn: "Example: Armies used machines such as ENIAC for hard calculations, so computers mattered in labs and defence long before homes had one.",
    },
    {
      cellsAr: [
        "الثمانينيات",
        "انتشار الحاسوب الشخصي (PC).",
        "بداية استخدام الأفراد والمؤسسات للحاسوب في العمل والتعليم بدل الطرق التقليدية.",
      ],
      cellsEn: [
        "1980s",
        "The personal computer (PC) spreads.",
        "People and offices start using a computer for daily work and learning.",
      ],
      exampleAr: "مثال: أصبح الحاسوب الشخصي متاحًا للأفراد والمؤسسات، مما أدى إلى استخدامه في الأعمال اليومية والتعليم.",
      exampleEn: "Example: A PC on a desk replaced paper files in many offices and school rooms.",
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
      exampleAr: "مثال: استخدم الطلاب والموظفون الإنترنت للبحث عن المعلومات وإرسال الرسائل الإلكترونية، فأصبح تبادل المعرفة والتواصل بين الدول أسرع.",
      exampleEn: "Example: Students and staff used the web to search and send email, so sharing knowledge across countries became faster.",
    },
    {
      cellsAr: ["العقد الأول من الألفية", "ظهور الهواتف الذكية (آيفون وغيره).", "انتشار سريع وواسع للإنترنت عبر المحمول."],
      cellsEn: ["2000s", "Smartphones appear (iPhone and others).", "Fast, wide access to the Internet from a pocket."],
      exampleAr: "مثال: استخدام الأشخاص الهواتف الذكية لتصفح الإنترنت وتواصل التطبيقات، مما غيّر طريقة الحصول على المعلومات والخدمات اليومية.",
      exampleEn: "Example: People used smartphones to browse and chat, which changed how daily news and services arrived.",
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
      exampleAr:
        "مثال: استخدمت شركة منصة سحابية لتخزين بياناتها، وتشغّلت الذكاء الاصطناعي لتحليل بيانات العملاء، مما ساعدها على تحسين خدماتها واتخاذ قرارات أفضل.",
      exampleEn:
        "Example: A firm stored data on a cloud platform and used AI to study customer patterns, then improved its service and decisions.",
    },
  ],
};

function fromNote(note: LessonNote): TextbookPage {
  const lesson = CHAPTERS.flatMap((chapter) => chapter.lessons).find((item) => item.id === note.id);
  const headers = HEADERS[note.chapterId] ?? HEADERS["1"]!;
  const extra = (note.bodyAr[1] ?? note.takeawayAr).trim();
  const extraEn = (note.bodyEn[1] ?? note.takeawayEn).trim();
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
    headersAr: headers.ar,
    headersEn: headers.en,
    rows: note.termsAr.map((term, index) => {
      const en = note.termsEn[index] ?? term;
      const tip = note.bodyAr[Math.min(index + 1, note.bodyAr.length - 1)] ?? note.takeawayAr;
      const tipEn = note.bodyEn[Math.min(index + 1, note.bodyEn.length - 1)] ?? note.takeawayEn;
      return {
        cellsAr: [term.term, term.meaning, tip] as [string, string, string],
        cellsEn: [en.term, en.meaning, tipEn] as [string, string, string],
        exampleAr: index === 0 ? `مثال: ${extra}` : undefined,
        exampleEn: index === 0 ? `Example: ${extraEn}` : undefined,
      };
    }),
  };
}

const PAGES: TextbookPage[] = LESSON_NOTES.map((note) => (note.id === "1-1" ? PAGE_1_1 : fromNote(note)));

export function textbookPageFor(id: string): TextbookPage | undefined {
  return PAGES.find((page) => page.id === id);
}

export function textbookPagesForChapter(chapterId: string): TextbookPage[] {
  return PAGES.filter((page) => page.id.startsWith(`${chapterId}-`));
}
