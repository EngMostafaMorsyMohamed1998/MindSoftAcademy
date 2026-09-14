import type { ChapterId } from "@/lib/curriculum";

export type GameKind = "sort" | "match" | "spot" | "pick";

export type SortGame = {
  kind: "sort";
  introAr: string;
  introEn: string;
  items: { id: string; labelAr: string; labelEn: string; order: number }[];
};

export type MatchGame = {
  kind: "match";
  introAr: string;
  introEn: string;
  pairs: { id: string; leftAr: string; leftEn: string; rightAr: string; rightEn: string }[];
};

export type SpotGame = {
  kind: "spot";
  introAr: string;
  introEn: string;
  cards: {
    id: string;
    textAr: string;
    textEn: string;
    threat: boolean;
    whyAr: string;
    whyEn: string;
  }[];
};

export type PickGame = {
  kind: "pick";
  introAr: string;
  introEn: string;
  rounds: {
    id: string;
    promptAr: string;
    promptEn: string;
    choicesAr: [string, string, string];
    choicesEn: [string, string, string];
    correct: 0 | 1 | 2;
  }[];
};

export type ChapterGame = {
  chapterId: ChapterId;
  titleAr: string;
  titleEn: string;
  xp: number;
  data: SortGame | MatchGame | SpotGame | PickGame;
};

export const CHAPTER_GAMES: ChapterGame[] = [
  {
    chapterId: "1",
    titleAr: "سباق الزمن والتقنية",
    titleEn: "Tech Timeline Rush",
    xp: 20,
    data: {
      kind: "sort",
      introAr: "رتّب مراحل تقنية المعلومات من الأقدم إلى الأحدث. كل ترتيب صحيح يقرّبك من فتح امتحان الفصل.",
      introEn: "Put the IT stages in order from oldest to newest. A clean run unlocks chapter momentum.",
      items: [
        { id: "a", labelAr: "ولادة الحاسوب (ENIAC / أنابيب مفرغة)", labelEn: "Birth of the computer (ENIAC / vacuum tubes)", order: 0 },
        { id: "b", labelAr: "انتشار الحاسوب الشخصي", labelEn: "Spread of personal computers", order: 1 },
        { id: "c", labelAr: "تسويق الإنترنت والويب", labelEn: "Commercial Internet and the Web", order: 2 },
        { id: "d", labelAr: "صعود الهواتف الذكية", labelEn: "Rise of smartphones", order: 3 },
        { id: "e", labelAr: "السحابة والذكاء الاصطناعي كخدمة", labelEn: "Cloud and AI as a service", order: 4 },
      ],
    },
  },
  {
    chapterId: "2",
    titleAr: "حارس الشبكة",
    titleEn: "Network Guard",
    xp: 20,
    data: {
      kind: "spot",
      introAr: "رسالة دخلت صندوق المدرسة. علّم التهديد واترك الرسالة السليمة. الحارس اليقظ لا يحذف الدليل.",
      introEn: "Mail landed in the school inbox. Flag the threat and leave the safe message. A good guard does not wipe evidence.",
      cards: [
        {
          id: "p1",
          textAr: "«حسابك سيُغلق خلال ساعة. أرسل كلمة المرور فورًا إلى هذا الرابط.»",
          textEn: "«Your account closes in an hour. Send your password to this link now.»",
          threat: true,
          whyAr: "تصيّد: يستعجل ويطلب السر.",
          whyEn: "Phishing: urgency plus a request for the secret.",
        },
        {
          id: "p2",
          textAr: "نشرة رسمية من المدرس عبر المنصة المعروفة: ميعاد امتحان الفصل الثاني.",
          textEn: "A notice from your teacher on the known platform: chapter 2 exam time.",
          threat: false,
          whyAr: "قناة معروفة ومحتوى متوقع بلا طلب أسرار.",
          whyEn: "Known channel, expected content, no secrets requested.",
        },
        {
          id: "p3",
          textAr: "ملف «كشف_درجات.exe» من بريد غريب يطلب تشغيله لرؤية النتيجة.",
          textEn: "A «grades.exe» file from a strange address that must be run to see marks.",
          threat: true,
          whyAr: "ملف تنفيذي من مصدر مجهول.",
          whyEn: "An executable from an unknown sender.",
        },
        {
          id: "p4",
          textAr: "تحديث جدار الحماية من مسؤول التقنية في وقت الصيانة المعلن.",
          textEn: "A firewall update from IT during the announced maintenance window.",
          threat: false,
          whyAr: "مصدر داخلي ووقت معلن.",
          whyEn: "Internal source and a announced window.",
        },
        {
          id: "p5",
          textAr: "«لقد ربحت جهازًا. ادفع رسوم الشحن بكود بطاقتك.»",
          textEn: "«You won a laptop. Pay shipping with your card code.»",
          threat: true,
          whyAr: "جائزة مفاجئة + طلب بيانات دفع.",
          whyEn: "Surprise prize plus a request for payment data.",
        },
        {
          id: "p6",
          textAr: "تذكير من المكتبة بإرجاع كتاب، من البريد الرسمي للمدرسة، بلا مرفقات.",
          textEn: "A library reminder from the official school address, no attachment.",
          threat: false,
          whyAr: "عنوان رسمي ومهمة عادية.",
          whyEn: "Official address and an ordinary task.",
        },
      ],
    },
  },
  {
    chapterId: "3",
    titleAr: "ركّب التطبيق",
    titleEn: "Stack Builder",
    xp: 20,
    data: {
      kind: "match",
      introAr: "صل كل جزء من تطبيق الويب بوظيفته. التطبيق لا يقف إلا إذا اكتملت الطبقات.",
      introEn: "Match each web-app piece to its job. The stack only stands when every layer is placed.",
      pairs: [
        { id: "1", leftAr: "HTML", leftEn: "HTML", rightAr: "هيكل الصفحة ومعناها", rightEn: "Page structure and meaning" },
        { id: "2", leftAr: "CSS", leftEn: "CSS", rightAr: "المظهر والشبكة والتجاوب", rightEn: "Look, layout, responsiveness" },
        { id: "3", leftAr: "الخادم", leftEn: "Backend", rightAr: "المنطق والصلاحيات", rightEn: "Logic and permissions" },
        { id: "4", leftAr: "قاعدة البيانات", leftEn: "Database", rightAr: "تخزين دائم للسجلات", rightEn: "Persistent records" },
        { id: "5", leftAr: "HTTPS", leftEn: "HTTPS", rightAr: "قناة مشفّرة للطلب", rightEn: "Encrypted request channel" },
        { id: "6", leftAr: "GET", leftEn: "GET", rightAr: "قراءة مورد بلا تعديل", rightEn: "Read a resource without changing it" },
      ],
    },
  },
  {
    chapterId: "4",
    titleAr: "مخبر التجربة",
    titleEn: "UX Detective",
    xp: 20,
    data: {
      kind: "pick",
      introAr: "اختر القرار الأصدق لتجربة المستخدم. المخبر يبحث عن المهمة لا عن الزينة.",
      introEn: "Pick the more honest UX decision. The detective follows the task, not the decoration.",
      rounds: [
        {
          id: "r1",
          promptAr: "زر الحضور يجب أن يكون:",
          promptEn: "The attendance button should be:",
          choicesAr: ["باهتًا في ذيل صفحة مزدحمة", "واضحًا قرب المهمة الأولى", "مخفيًا داخل قائمة من عشر طبقات"],
          choicesEn: ["Faint at the bottom of a crowded page", "Clear next to the first task", "Buried ten menus deep"],
          correct: 1,
        },
        {
          id: "r2",
          promptAr: "صورة توضيحية كبيرة على شبكة ضعيفة:",
          promptEn: "A huge decorative image on a weak network:",
          choicesAr: ["نتركها كما هي لتبدو أفخم", "نضغطها ونضع نصًا بديلًا", "نحذف كل النص ونبقي الصورة فقط"],
          choicesEn: ["Leave it huge to look premium", "Compress it and add alt text", "Delete all text and keep only the image"],
          correct: 1,
        },
        {
          id: "r3",
          promptAr: "أفضل طريقة لمعرفة أي تصميم يعمل:",
          promptEn: "The best way to learn which design works:",
          choicesAr: ["ذوق المصمم وحده", "اختبار أ/ب مع قياس زمن المهمة", "تغيير الموقع كله كل يوم"],
          choicesEn: ["The designer's taste alone", "An A/B test that measures task time", "Rebuild the whole site every day"],
          correct: 1,
        },
        {
          id: "r4",
          promptAr: "في كل دورة تحسين غيّر:",
          promptEn: "In each improvement cycle, change:",
          choicesAr: ["عنصرًا واحدًا وتابع الدليل", "عشرين عنصرًا معًا", "لا شيء وانتظر الحظ"],
          choicesEn: ["One element and follow the evidence", "Twenty elements at once", "Nothing and wait for luck"],
          correct: 0,
        },
        {
          id: "r5",
          promptAr: "اتساق مكان القائمة:",
          promptEn: "Keeping the menu in the same place:",
          choicesAr: ["ملل يجب كسره كل صفحة", "يقلل الضياع ويسرّع المهمة", "يمنع إتاحة الوصول"],
          choicesEn: ["Boredom you must break on every page", "Reduces getting lost and speeds the task", "Blocks accessibility"],
          correct: 1,
        },
      ],
    },
  },
  {
    chapterId: "5",
    titleAr: "نظّف الجدول",
    titleEn: "Clean the Table",
    xp: 20,
    data: {
      kind: "spot",
      introAr: "صفوف وصلت من استطلاع الصف. علّم الصفوف الملوثة واترك السليمة قبل التحليل.",
      introEn: "Rows arrived from a class survey. Flag dirty rows and leave clean ones before analysis.",
      cards: [
        {
          id: "d1",
          textAr: "عمر = 17، درجة = 86، التاريخ = 2026-04-01 — صف مكتمل معقول.",
          textEn: "Age = 17, score = 86, date = 2026-04-01 — a complete, plausible row.",
          threat: false,
          whyAr: "قيم في مدى منطقي.",
          whyEn: "Values sit in a sensible range.",
        },
        {
          id: "d2",
          textAr: "درجة = 250 من 100.",
          textEn: "Score = 250 out of 100.",
          threat: true,
          whyAr: "قيمة شاذة أقرب لخطأ إدخال.",
          whyEn: "An outlier that looks like an input error.",
        },
        {
          id: "d3",
          textAr: "خلية العمر فارغة وسبب الفراغ: رفض الإجابة.",
          textEn: "Age is blank because the student refused to answer.",
          threat: true,
          whyAr: "مفقود له معنى؛ يُعلَّم لا يُملأ بمتوسط أعمى.",
          whyEn: "A meaningful missing value — flag it; do not blindly impute the mean.",
        },
        {
          id: "d4",
          textAr: "صفان بنفس الرقم والوقت والمنتج؛ أحدهما نسخة لصق بالخطأ.",
          textEn: "Two rows with the same id, time, and product; one is a paste duplicate.",
          threat: true,
          whyAr: "تكرار حقيقي يفسد المجموع.",
          whyEn: "A true duplicate that would break the total.",
        },
        {
          id: "d5",
          textAr: "التاريخ مكتوب 01/04/2026 بعد توحيد الصيغة في الملف كله.",
          textEn: "The date is 01/04/2026 after the whole file was unified to one format.",
          threat: false,
          whyAr: "الصيغة موحّدة.",
          whyEn: "The format is already aligned.",
        },
        {
          id: "d6",
          textAr: "استطلاع ويب ردّ عليه فقط من يحب المادة، ثم عُمِّم على كل المدرسة.",
          textEn: "A web poll answered only by fans of the subject, then generalised to the whole school.",
          threat: true,
          whyAr: "تحيز اختيار ذاتي.",
          whyEn: "Self-selection bias.",
        },
      ],
    },
  },
  {
    chapterId: "6",
    titleAr: "اختَر الرسم",
    titleEn: "Pick the Chart",
    xp: 20,
    data: {
      kind: "pick",
      introAr: "لكل سؤال رسم واحد صادق. المضلل يخرج من اللوحة.",
      introEn: "Each question has one honest chart. The misleading option leaves the board.",
      rounds: [
        {
          id: "c1",
          promptAr: "تغير درجة الفصل أسبوعيًا:",
          promptEn: "Weekly change in the class mark:",
          choicesAr: ["خط زمني", "دائرة بعشر شرائح", "أيقونات عشوائية"],
          choicesEn: ["A line over time", "A ten-slice pie", "Random icons"],
          correct: 0,
        },
        {
          id: "c2",
          promptAr: "مقارنة عدد الغياب في ثلاث شعب:",
          promptEn: "Compare absences in three classes:",
          choicesAr: ["أعمدة", "خريطة العالم", "نص بلا أرقام"],
          choicesEn: ["Bars", "A world map", "Text with no numbers"],
          correct: 0,
        },
        {
          id: "c3",
          promptAr: "أجزاء ميزانية نشاط من أصل واحد:",
          promptEn: "Parts of one activity budget:",
          choicesAr: ["دائرة بثلاث أو أربع شرائح", "خط بلا محور زمن", "صورة المدرس"],
          choicesEn: ["A pie with three or four slices", "A line with no time axis", "The teacher's photo"],
          correct: 0,
        },
        {
          id: "c4",
          promptAr: "خطأ بصري يجب رفضه:",
          promptEn: "A visual mistake you must reject:",
          choicesAr: ["تسمية المحاور", "قطع المحور الرأسي ليضخّم فرقًا تافهًا", "ذكر المصدر"],
          choicesEn: ["Labelling the axes", "Cropping the y-axis to inflate a tiny gap", "Citing the source"],
          correct: 1,
        },
        {
          id: "c5",
          promptAr: "ارتباط قوي بين ساعات المذاكرة والدرجة يعني:",
          promptEn: "A strong correlation between study hours and marks means:",
          choicesAr: ["سببًا مؤكدًا بلا شك", "علاقة رقمية تحتاج تفسيرًا لا قفزًا للسببية", "أن الرسم بلا فائدة"],
          choicesEn: ["Certain cause with no doubt", "A numerical link that still needs explanation, not a leap to cause", "That the chart is useless"],
          correct: 1,
        },
      ],
    },
  },
  {
    chapterId: "7",
    titleAr: "درّب النموذج",
    titleEn: "Train the Model",
    xp: 20,
    data: {
      kind: "match",
      introAr: "صل نوع التعلم أو المفهوم بالمثال الصحيح. النموذج الجيد لا يُختبر على ورقة التدريب وحدها.",
      introEn: "Match each learning idea to the right example. A fair model is not tested on the training sheet alone.",
      pairs: [
        { id: "m1", leftAr: "تعلم بإشراف", leftEn: "Supervised", rightAr: "صور نبات معلّمة: سليم / مريض", rightEn: "Labeled plant photos: healthy / diseased" },
        { id: "m2", leftAr: "تعلم بلا إشراف", leftEn: "Unsupervised", rightAr: "تجميع زبائن بلا تسمية جاهزة", rightEn: "Clustering customers with no ready labels" },
        { id: "m3", leftAr: "مجموعة اختبار", leftEn: "Test set", rightAr: "بيانات لم يرها النموذج أثناء التعلم", rightEn: "Data the model did not see while learning" },
        { id: "m4", leftAr: "شبكة عصبية", leftEn: "Neural net", rightAr: "تعديل أوزان الروابط", rightEn: "Adjusting connection weights" },
        { id: "m5", leftAr: "نموذج لغة", leftEn: "Language model", rightAr: "توقع الرمز التالي", rightEn: "Predicting the next token" },
        { id: "m6", leftAr: "هلوسة", leftEn: "Hallucination", rightAr: "نص فصيح بلا سند", rightEn: "Fluent text with no grounding" },
      ],
    },
  },
];

export function gameForChapter(id: string): ChapterGame | undefined {
  return CHAPTER_GAMES.find((game) => game.chapterId === id);
}
