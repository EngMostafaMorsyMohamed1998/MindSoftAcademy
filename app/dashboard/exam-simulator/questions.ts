import { BOOKS, type Book } from "@/lib/library";

export type ExamQuestion = {
  id: string;
  bookSlug: string;
  topic: string;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
};

export const EXAM_SECONDS_PER_QUESTION = 3 * 60;

export function examDurationSeconds(questionCount: number) {
  return Math.max(EXAM_SECONDS_PER_QUESTION, questionCount * EXAM_SECONDS_PER_QUESTION);
}

const BANK: ExamQuestion[] = [
  // الجزء الأول — عربي
  {
    id: "ar1-q1",
    bookSlug: "programming-ai-ar-part1",
    topic: "الخوارزميات",
    prompt: "الخوارزمية هي:",
    options: [
      "برنامج جاهز يعمل دون خطوات",
      "مجموعة خطوات مرتبة ومنتهية لحل مسألة",
      "جهاز حاسوب متخصص في الذكاء الاصطناعي",
      "لغة برمجة عالية المستوى",
    ],
    correctIndex: 1,
  },
  {
    id: "ar1-q2",
    bookSlug: "programming-ai-ar-part1",
    topic: "المتغيرات",
    prompt: "المتغير في البرمجة يُستخدم لـ:",
    options: [
      "تخزين قيمة يمكن أن تتغير أثناء التنفيذ",
      "طباعة النتيجة فقط",
      "إيقاف البرنامج نهائيًا",
      "رسم مخطط انسيابي",
    ],
    correctIndex: 0,
  },
  {
    id: "ar1-q3",
    bookSlug: "programming-ai-ar-part1",
    topic: "جمل التحكم",
    prompt: "جملة الشرط (if) تسمح للبرنامج بـ:",
    options: [
      "تكرار الأوامر عددًا غير معروف من المرات فقط",
      "تنفيذ أوامر مختلفة حسب تحقق شرط",
      "تعريف دالة جديدة",
      "حفظ الملف على القرص",
    ],
    correctIndex: 1,
  },
  {
    id: "ar1-q4",
    bookSlug: "programming-ai-ar-part1",
    topic: "أنواع البيانات",
    prompt: "أيٌّ مما يلي نوع بيانات صحيح لتخزين العدد 17؟",
    options: ["منطقي (Boolean)", "نصي فقط", "صحيح (Integer)", "صورة"],
    correctIndex: 2,
  },
  {
    id: "ar1-q5",
    bookSlug: "programming-ai-ar-part1",
    topic: "مقدمة في الذكاء الاصطناعي",
    prompt: "الذكاء الاصطناعي يسعى أساسًا إلى:",
    options: [
      "جعل الحاسوب يحاكي بعض قدرات التفكير واتخاذ القرار",
      "زيادة سرعة المعالج فقط",
      "استبدال لوحة المفاتيح",
      "تحويل النص إلى صورة دون بيانات",
    ],
    correctIndex: 0,
  },
  // Part 1 — English
  {
    id: "en1-q1",
    bookSlug: "programming-ai-en-part1",
    topic: "Algorithms",
    prompt: "An algorithm must be:",
    options: [
      "Infinite and random",
      "A finite, ordered set of steps that solves a problem",
      "A compiled executable file",
      "A computer hardware component",
    ],
    correctIndex: 1,
  },
  {
    id: "en1-q2",
    bookSlug: "programming-ai-en-part1",
    topic: "Variables",
    prompt: "A variable is best described as:",
    options: [
      "A named memory location whose value can change",
      "A comment in the source code",
      "The name of the programming language",
      "A printer setting",
    ],
    correctIndex: 0,
  },
  {
    id: "en1-q3",
    bookSlug: "programming-ai-en-part1",
    topic: "Control flow",
    prompt: "A loop is used when you need to:",
    options: [
      "Declare a new data type",
      "Repeat a block of instructions",
      "End the program immediately",
      "Store a file path",
    ],
    correctIndex: 1,
  },
  {
    id: "en1-q4",
    bookSlug: "programming-ai-en-part1",
    topic: "Input and output",
    prompt: "Which pair is a typical input / output example?",
    options: [
      "Keyboard / screen",
      "CPU / RAM only",
      "Compiler / linker only",
      "Pixel / byte",
    ],
    correctIndex: 0,
  },
  {
    id: "en1-q5",
    bookSlug: "programming-ai-en-part1",
    topic: "Introduction to AI",
    prompt: "Artificial intelligence is mainly about systems that can:",
    options: [
      "Perform tasks that normally require human intelligence",
      "Charge a battery faster",
      "Increase screen brightness",
      "Replace the operating system installer",
    ],
    correctIndex: 0,
  },
  // الجزء الثاني — عربي
  {
    id: "ar2-q1",
    bookSlug: "programming-ai-ar-part2",
    topic: "المصفوفات",
    prompt: "المصفوفة (Array) تُستخدم لـ:",
    options: [
      "تخزين مجموعة قيم من النوع نفسه تحت اسم واحد",
      "إيقاف التنفيذ عند أول خطأ",
      "رسم واجهة المستخدم فقط",
      "تشفير كلمة المرور",
    ],
    correctIndex: 0,
  },
  {
    id: "ar2-q2",
    bookSlug: "programming-ai-ar-part2",
    topic: "الدوال",
    prompt: "فائدة الدالة (Function) في البرنامج:",
    options: [
      "تجميع أوامر متكررة وإعادة استخدامها",
      "حذف نظام التشغيل",
      "زيادة حجم الملف دائمًا",
      "منع استخدام المتغيرات",
    ],
    correctIndex: 0,
  },
  {
    id: "ar2-q3",
    bookSlug: "programming-ai-ar-part2",
    topic: "التعلم الآلي",
    prompt: "التعلم الآلي يعتمد أساسًا على:",
    options: [
      "تعلّم الأنماط من البيانات لتحسين الأداء",
      "كتابة كل قاعدة يدويًا دون بيانات",
      "تعطيل الذاكرة",
      "تغيير لون الشاشة",
    ],
    correctIndex: 0,
  },
  {
    id: "ar2-q4",
    bookSlug: "programming-ai-ar-part2",
    topic: "الشبكات العصبية",
    prompt: "الشبكة العصبية الاصطناعية مستوحاة من:",
    options: [
      "طريقة عمل الخلايا العصبية في الدماغ",
      "دائرة الطابعة فقط",
      "بروتوكول البريد الإلكتروني",
      "نظام الألوان RGB",
    ],
    correctIndex: 0,
  },
  {
    id: "ar2-q5",
    bookSlug: "programming-ai-ar-part2",
    topic: "أخلاقيات الذكاء الاصطناعي",
    prompt: "من المخاطر الأخلاقية للذكاء الاصطناعي:",
    options: [
      "التحيز في القرارات إذا كانت بيانات التدريب غير عادلة",
      "زيادة دقة الجمع الحسابي",
      "تسريع حفظ الملف",
      "تقليل عدد الألوان في الصورة",
    ],
    correctIndex: 0,
  },
  // Part 2 — English
  {
    id: "en2-q1",
    bookSlug: "programming-ai-en-part2",
    topic: "Data structures",
    prompt: "An array is useful because it:",
    options: [
      "Stores many values of the same type under one name",
      "Compiles the program automatically",
      "Connects to the internet",
      "Draws 3D graphics by default",
    ],
    correctIndex: 0,
  },
  {
    id: "en2-q2",
    bookSlug: "programming-ai-en-part2",
    topic: "Functions",
    prompt: "A function parameter is:",
    options: [
      "A value passed into the function when it is called",
      "The name of the source file",
      "The computer’s IP address",
      "A type of computer virus",
    ],
    correctIndex: 0,
  },
  {
    id: "en2-q3",
    bookSlug: "programming-ai-en-part2",
    topic: "Machine learning",
    prompt: "Supervised learning typically needs:",
    options: [
      "Labeled examples so the model can learn the mapping",
      "No data at all",
      "Only a random number generator",
      "A faster cooling fan",
    ],
    correctIndex: 0,
  },
  {
    id: "en2-q4",
    bookSlug: "programming-ai-en-part2",
    topic: "Neural networks",
    prompt: "A neural network learns mainly by:",
    options: [
      "Adjusting connection weights from training data",
      "Changing the monitor resolution",
      "Deleting unused files",
      "Rewriting the BIOS",
    ],
    correctIndex: 0,
  },
  {
    id: "en2-q5",
    bookSlug: "programming-ai-en-part2",
    topic: "AI ethics",
    prompt: "A responsible use of AI in school work is:",
    options: [
      "Using it to understand a concept, then writing your own answer",
      "Submitting generated text as your own without review",
      "Sharing classmates’ private data with a public model",
      "Ignoring biased outputs because the score looks high",
    ],
    correctIndex: 0,
  },
];

export function questionsForBook(slug: string): ExamQuestion[] {
  return BANK.filter((question) => question.bookSlug === slug);
}

export function questionsForAllBooks(): ExamQuestion[] {
  return [...BANK];
}

export function examBooks(): Book[] {
  return BOOKS.filter((book) => questionsForBook(book.slug).length > 0);
}

export function examTitle(bookSlug: string | "all"): string {
  if (bookSlug === "all") {
    return "Programming & AI — full course";
  }
  const book = BOOKS.find((item) => item.slug === bookSlug);
  return book ? book.titleEn : "Programming & AI";
}
