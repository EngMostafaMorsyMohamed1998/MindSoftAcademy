import type { BookLanguage } from "@/lib/library";

export type ChapterId = "1" | "2" | "3" | "4" | "5" | "6" | "7";

export type Lesson = {
  id: string;
  chapterId: ChapterId;
  titleAr: string;
  titleEn: string;
  bookPage: number;
  pdfPage: number;
  part: 1 | 2;
};

export type Chapter = {
  id: ChapterId;
  part: 1 | 2;
  color: string;
  accent: string;
  icon: "globe" | "shield" | "code" | "palette" | "database" | "chart" | "brain";
  titleAr: string;
  titleEn: string;
  blurbAr: string;
  blurbEn: string;
  gameAr: string;
  gameEn: string;
  lessons: Lesson[];
};

export const CHAPTERS: Chapter[] = [
  {
    id: "1",
    part: 1,
    color: "#0c2d6b",
    accent: "#c4a35a",
    icon: "globe",
    titleAr: "تكنولوجيا المعلومات والمجتمع",
    titleEn: "Information Technology and Society",
    blurbAr: "كيف تطورت التقنية، وكيف يعمل الذكاء الاصطناعي، وأين يظهر في حياتنا، وما حدوده الأخلاقية.",
    blurbEn: "How IT developed, how AI works, where it shows up in life, and the ethical limits we must keep.",
    gameAr: "سباق الزمن والتقنية",
    gameEn: "Tech Timeline Rush",
    lessons: [
      {
        id: "1-1",
        chapterId: "1",
        titleAr: "تطور تكنولوجيا المعلومات والتحول الاجتماعي",
        titleEn: "Development of IT and Social Transformation",
        bookPage: 4,
        pdfPage: 5,
        part: 1,
      },
      {
        id: "1-2",
        chapterId: "1",
        titleAr: "كيف يعمل الذكاء الاصطناعي",
        titleEn: "How AI Works",
        bookPage: 12,
        pdfPage: 13,
        part: 1,
      },
      {
        id: "1-3",
        chapterId: "1",
        titleAr: "الذكاء الاصطناعي في الحياة اليومية والصناعة",
        titleEn: "AI in Daily Life and Industry",
        bookPage: 19,
        pdfPage: 20,
        part: 1,
      },
      {
        id: "1-4",
        chapterId: "1",
        titleAr: "القضايا الأخلاقية للذكاء الاصطناعي",
        titleEn: "Ethical Issues with AI",
        bookPage: 26,
        pdfPage: 27,
        part: 1,
      },
    ],
  },
  {
    id: "2",
    part: 1,
    color: "#7f1d1d",
    accent: "#f59e0b",
    icon: "shield",
    titleAr: "الأمن السيبراني",
    titleEn: "Cybersecurity",
    blurbAr: "التشفير، المصادقة، تصميم أمن الشبكة، والاستجابة للحوادث قبل أن تتفاقم.",
    blurbEn: "Cryptography, authentication, secure network design, and incident response before damage spreads.",
    gameAr: "حارس الشبكة",
    gameEn: "Network Guard",
    lessons: [
      {
        id: "2-1",
        chapterId: "2",
        titleAr: "تقنيات التشفير والمصادقة",
        titleEn: "Cryptographic Technologies and Authentication",
        bookPage: 33,
        pdfPage: 34,
        part: 1,
      },
      {
        id: "2-2",
        chapterId: "2",
        titleAr: "تصميم أمن الشبكات",
        titleEn: "Network Security Design",
        bookPage: 41,
        pdfPage: 42,
        part: 1,
      },
      {
        id: "2-3",
        chapterId: "2",
        titleAr: "الاستجابة للحوادث وإدارة المخاطر",
        titleEn: "Incident Response and Risk Management",
        bookPage: 48,
        pdfPage: 49,
        part: 1,
      },
    ],
  },
  {
    id: "3",
    part: 1,
    color: "#134e4a",
    accent: "#2dd4bf",
    icon: "code",
    titleAr: "تطبيقات الويب",
    titleEn: "Web Applications",
    blurbAr: "بنية الواجهة والخادم، طرق الاتصال، وأساسيات الواجهة الأمامية.",
    blurbEn: "Frontend and backend structure, how browsers talk to servers, and frontend fundamentals.",
    gameAr: "ركّب التطبيق",
    gameEn: "Stack Builder",
    lessons: [
      {
        id: "3-1",
        chapterId: "3",
        titleAr: "البنية العامة لتطبيقات الويب",
        titleEn: "The Overall Structure of Web Applications",
        bookPage: 55,
        pdfPage: 56,
        part: 1,
      },
      {
        id: "3-2",
        chapterId: "3",
        titleAr: "طرق الاتصال في تطبيقات الويب",
        titleEn: "Web Application Communication Methods",
        bookPage: 62,
        pdfPage: 63,
        part: 1,
      },
      {
        id: "3-3",
        chapterId: "3",
        titleAr: "أساسيات تقنية الواجهة الأمامية",
        titleEn: "Fundamentals of Frontend Technology",
        bookPage: 68,
        pdfPage: 69,
        part: 1,
      },
    ],
  },
  {
    id: "4",
    part: 1,
    color: "#4a1942",
    accent: "#e879f9",
    icon: "palette",
    titleAr: "تصميم الويب والوسائط",
    titleEn: "Web and Media Design",
    blurbAr: "أنواع الوسائط، تجربة المستخدم، تقييم الموقع، والتحسين بالتكرار.",
    blurbEn: "Media types, user experience, website evaluation, and iterative improvement.",
    gameAr: "مخبر التجربة",
    gameEn: "UX Detective",
    lessons: [
      {
        id: "4-1",
        chapterId: "4",
        titleAr: "أنواع الوسائط وخصائصها",
        titleEn: "Types and Characteristics of Media",
        bookPage: 75,
        pdfPage: 76,
        part: 1,
      },
      {
        id: "4-2",
        chapterId: "4",
        titleAr: "تصميم المعلومات وتجربة المستخدم للمواقع",
        titleEn: "Information Design and UX for Websites",
        bookPage: 81,
        pdfPage: 82,
        part: 1,
      },
      {
        id: "4-3",
        chapterId: "4",
        titleAr: "أساليب تقييم المواقع الإلكترونية",
        titleEn: "Methods for Evaluating Websites",
        bookPage: 88,
        pdfPage: 89,
        part: 1,
      },
      {
        id: "4-4",
        chapterId: "4",
        titleAr: "عملية التحسين التكراري للمواقع",
        titleEn: "The Iterative Improvement Process for Websites",
        bookPage: 95,
        pdfPage: 96,
        part: 1,
      },
    ],
  },
  {
    id: "5",
    part: 2,
    color: "#1e3a5f",
    accent: "#38bdf8",
    icon: "database",
    titleAr: "جمع البيانات وتنقيتها",
    titleEn: "Data Collection and Cleaning",
    blurbAr: "بيانات أولية وثانوية، العينة والتحيز، التنظيف، والبيانات المفتوحة وواجهات البرمجة.",
    blurbEn: "Primary vs secondary data, sampling bias, cleaning, open data, and APIs.",
    gameAr: "نظّف الجدول",
    gameEn: "Clean the Table",
    lessons: [
      {
        id: "5-1",
        chapterId: "5",
        titleAr: "طرق جمع البيانات",
        titleEn: "Methods of Data Collection",
        bookPage: 4,
        pdfPage: 5,
        part: 2,
      },
      {
        id: "5-2",
        chapterId: "5",
        titleAr: "تنقية البيانات وتحويلها",
        titleEn: "Data Cleaning and Transformation",
        bookPage: 12,
        pdfPage: 13,
        part: 2,
      },
      {
        id: "5-3",
        chapterId: "5",
        titleAr: "البيانات المفتوحة وواجهات برمجة التطبيقات",
        titleEn: "Open Data and APIs",
        bookPage: 21,
        pdfPage: 22,
        part: 2,
      },
    ],
  },
  {
    id: "6",
    part: 2,
    color: "#3f2d14",
    accent: "#fbbf24",
    icon: "chart",
    titleAr: "التحليل والتواصل",
    titleEn: "Analysis and Communication",
    blurbAr: "الاستدلال الإحصائي، الانحدار، واختيار الرسم المناسب لإيصال المعنى.",
    blurbEn: "Statistical inference, regression, and choosing the right chart to communicate meaning.",
    gameAr: "اختَر الرسم",
    gameEn: "Pick the Chart",
    lessons: [
      {
        id: "6-1",
        chapterId: "6",
        titleAr: "الاستدلال الإحصائي",
        titleEn: "Statistical Inference",
        bookPage: 29,
        pdfPage: 30,
        part: 2,
      },
      {
        id: "6-2",
        chapterId: "6",
        titleAr: "استخدام تحليل الانحدار وتقييمه",
        titleEn: "Use and Evaluation of Regression Analysis",
        bookPage: 39,
        pdfPage: 40,
        part: 2,
      },
      {
        id: "6-3",
        chapterId: "6",
        titleAr: "التمثيل المرئي للبيانات والتواصل",
        titleEn: "Data Visualization and Communication",
        bookPage: 48,
        pdfPage: 49,
        part: 2,
      },
    ],
  },
  {
    id: "7",
    part: 2,
    color: "#312e81",
    accent: "#a78bfa",
    icon: "brain",
    titleAr: "التعلم الآلي والذكاء الاصطناعي",
    titleEn: "Machine Learning and Artificial Intelligence",
    blurbAr: "أنواع التعلم الآلي، الشبكات العصبية، ونماذج اللغة الكبيرة بحذر ومسؤولية.",
    blurbEn: "Types of machine learning, neural networks, and large language models used with care.",
    gameAr: "درّب النموذج",
    gameEn: "Train the Model",
    lessons: [
      {
        id: "7-1",
        chapterId: "7",
        titleAr: "أساسيات التعلم الآلي",
        titleEn: "The Basics of Machine Learning",
        bookPage: 57,
        pdfPage: 58,
        part: 2,
      },
      {
        id: "7-2",
        chapterId: "7",
        titleAr: "الشبكات العصبية والتعلم العميق",
        titleEn: "Neural Networks and Deep Learning",
        bookPage: 68,
        pdfPage: 69,
        part: 2,
      },
      {
        id: "7-3",
        chapterId: "7",
        titleAr: "نماذج اللغة الكبيرة والذكاء الاصطناعي التوليدي",
        titleEn: "Large Language Models and Generative AI",
        bookPage: 77,
        pdfPage: 78,
        part: 2,
      },
    ],
  },
];

export const EXAM_DURATION_SECONDS = 60 * 60;
export const EXAM_OBJECTIVE_POINTS = 48;
export const EXAM_ESSAY_POINTS = 16;
export const EXAM_TOTAL_POINTS = 64;

export function isChapterId(value: string): value is ChapterId {
  return CHAPTERS.some((chapter) => chapter.id === value);
}

export function getChapter(id: string): Chapter | undefined {
  return CHAPTERS.find((chapter) => chapter.id === id);
}

export function getLesson(id: string): Lesson | undefined {
  for (const chapter of CHAPTERS) {
    const lesson = chapter.lessons.find((item) => item.id === id);
    if (lesson) return lesson;
  }
  return undefined;
}

export function bookSlugFor(part: 1 | 2, language: BookLanguage): string {
  return `programming-ai-${language}-part${part}`;
}

export function chapterTitle(chapter: Chapter, locale: "ar" | "en"): string {
  return locale === "ar" ? chapter.titleAr : chapter.titleEn;
}

export function lessonTitle(lesson: Lesson, locale: "ar" | "en"): string {
  return locale === "ar" ? lesson.titleAr : lesson.titleEn;
}
