import type { ChapterId } from "@/lib/curriculum";

export type GameKind = "sort" | "match" | "spot" | "pick" | "map";

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

export type MapGame = {
  kind: "map";
  introAr: string;
  introEn: string;
};

export type ChapterGame = {
  id: string;
  chapterId: ChapterId;
  titleAr: string;
  titleEn: string;
  xp: number;
  data: SortGame | MatchGame | SpotGame | PickGame | MapGame;
};

const MAP_GAMES: ChapterGame[] = (
  [
    ["1", "ركّب خريطة التقنية", "Build the tech map"],
    ["2", "ركّب خريطة الأمن", "Build the security map"],
    ["3", "ركّب خريطة الويب", "Build the web map"],
    ["4", "ركّب خريطة التصميم", "Build the design map"],
    ["5", "ركّب خريطة البيانات", "Build the data map"],
    ["6", "ركّب خريطة التحليل", "Build the analysis map"],
    ["7", "ركّب خريطة التعلّم الآلي", "Build the ML map"],
  ] as const
).map(([chapterId, titleAr, titleEn]) => ({
  id: `${chapterId}m`,
  chapterId,
  titleAr,
  titleEn,
  xp: 20,
  data: {
    kind: "map" as const,
    introAr: "الخريطة ناقصة. اقرأ المعنى واختَر المصطلح اللي يتقفل في المكان الفاضي.",
    introEn: "The map is missing a term. Read the meaning and put the right chip back.",
  },
}));

export const CHAPTER_GAMES: ChapterGame[] = [
  {
    id: "1",
    chapterId: "1",
    titleAr: "سباق الزمن والتقنية",
    titleEn: "Tech Timeline Rush",
    xp: 20,
    data: {
      kind: "sort",
      introAr: "رتّب مراحل تقنية المعلومات من الأقدم إلى الأحدث. كل ترتيب صحيح يقرّبك من فتح امتحان الفصل.",
      introEn: "Put the IT stages in order from oldest to newest. A clean run unlocks chapter momentum.",
      items: [
        { id: "a", labelAr: "ولادة الحاسوب (إينياك / أنابيب مفرغة)", labelEn: "Birth of the computer (ENIAC / vacuum tubes)", order: 0 },
        { id: "b", labelAr: "انتشار الحاسوب الشخصي", labelEn: "Spread of personal computers", order: 1 },
        { id: "c", labelAr: "تسويق الإنترنت والويب", labelEn: "Commercial Internet and the Web", order: 2 },
        { id: "d", labelAr: "صعود الهواتف الذكية", labelEn: "Rise of smartphones", order: 3 },
        { id: "e", labelAr: "السحابة والذكاء الاصطناعي كخدمة", labelEn: "Cloud and AI as a service", order: 4 },
      ],
    },
  },
  {
    id: "2",
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
    id: "3",
    chapterId: "3",
    titleAr: "ركّب التطبيق",
    titleEn: "Stack Builder",
    xp: 20,
    data: {
      kind: "match",
      introAr: "صل كل جزء من تطبيق الويب بوظيفته. التطبيق لا يقف إلا إذا اكتملت الطبقات.",
      introEn: "Match each web-app piece to its job. The stack only stands when every layer is placed.",
      pairs: [
        { id: "1", leftAr: "هيكل الصفحة", leftEn: "HTML", rightAr: "معنى الصفحة وعناوينها", rightEn: "Page structure and meaning" },
        { id: "2", leftAr: "تنسيق الصفحة", leftEn: "CSS", rightAr: "المظهر والشبكة والتجاوب", rightEn: "Look, layout, responsiveness" },
        { id: "3", leftAr: "الخادم", leftEn: "Backend", rightAr: "المنطق والصلاحيات", rightEn: "Logic and permissions" },
        { id: "4", leftAr: "قاعدة البيانات", leftEn: "Database", rightAr: "تخزين دائم للسجلات", rightEn: "Persistent records" },
        { id: "5", leftAr: "بروتوكول ويب آمن", leftEn: "HTTPS", rightAr: "قناة مشفّرة للطلب", rightEn: "Encrypted request channel" },
        { id: "6", leftAr: "الجلب", leftEn: "GET", rightAr: "قراءة مورد بلا تعديل", rightEn: "Read a resource without changing it" },
      ],
    },
  },
  {
    id: "4",
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
          promptAr: "كيف يجب أن يظهر زر الحضور؟",
          promptEn: "How should the attendance button appear?",
          choicesAr: ["باهتًا في ذيل صفحة مزدحمة", "واضحًا قرب المهمة الأولى", "مخفيًا داخل قائمة من عشر طبقات"],
          choicesEn: ["Faint at the bottom of a crowded page", "Clear next to the first task", "Buried ten menus deep"],
          correct: 1,
        },
        {
          id: "r2",
          promptAr: "ماذا تفعل بصورة توضيحية كبيرة على شبكة ضعيفة؟",
          promptEn: "What do you do with a huge decorative image on a weak network?",
          choicesAr: ["نتركها كما هي لتبدو أفخم", "نضغطها ونضع نصًا بديلًا", "نحذف كل النص ونبقي الصورة فقط"],
          choicesEn: ["Leave it huge to look premium", "Compress it and add alt text", "Delete all text and keep only the image"],
          correct: 1,
        },
        {
          id: "r3",
          promptAr: "ما أفضل طريقة لمعرفة أي تصميم يعمل؟",
          promptEn: "What is the best way to learn which design works?",
          choicesAr: ["ذوق المصمم وحده", "اختبار أ/ب مع قياس زمن المهمة", "تغيير الموقع كله كل يوم"],
          choicesEn: ["The designer's taste alone", "An A/B test that measures task time", "Rebuild the whole site every day"],
          correct: 1,
        },
        {
          id: "r4",
          promptAr: "في كل دورة تحسين، ماذا تغيّر؟",
          promptEn: "In each improvement cycle, what do you change?",
          choicesAr: ["عنصرًا واحدًا وتابع الدليل", "عشرين عنصرًا معًا", "لا شيء وانتظر الحظ"],
          choicesEn: ["One element and follow the evidence", "Twenty elements at once", "Nothing and wait for luck"],
          correct: 0,
        },
        {
          id: "r5",
          promptAr: "ماذا يفعل ثبات مكان القائمة؟",
          promptEn: "What does keeping the menu in the same place do?",
          choicesAr: ["ملل يجب كسره كل صفحة", "يقلل الضياع ويسرّع المهمة", "يمنع إتاحة الوصول"],
          choicesEn: ["Boredom you must break on every page", "Reduces getting lost and speeds the task", "Blocks accessibility"],
          correct: 1,
        },
      ],
    },
  },
  {
    id: "5",
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
    id: "6",
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
          promptAr: "ما أفضل رسم لتغيّر درجة الفصل أسبوعيًا؟",
          promptEn: "What is the best chart for weekly change in the class mark?",
          choicesAr: ["خط زمني", "دائرة بعشر شرائح", "أيقونات عشوائية"],
          choicesEn: ["A line over time", "A ten-slice pie", "Random icons"],
          correct: 0,
        },
        {
          id: "c2",
          promptAr: "ما أفضل رسم لمقارنة عدد الغياب في ثلاث شعب؟",
          promptEn: "What is the best chart to compare absences in three classes?",
          choicesAr: ["أعمدة", "خريطة العالم", "نص بلا أرقام"],
          choicesEn: ["Bars", "A world map", "Text with no numbers"],
          correct: 0,
        },
        {
          id: "c3",
          promptAr: "ما أفضل رسم لأجزاء ميزانية نشاط من أصل واحد؟",
          promptEn: "What is the best chart for parts of one activity budget?",
          choicesAr: ["دائرة بثلاث أو أربع شرائح", "خط بلا محور زمن", "صورة المدرس"],
          choicesEn: ["A pie with three or four slices", "A line with no time axis", "The teacher's photo"],
          correct: 0,
        },
        {
          id: "c4",
          promptAr: "أي خطأ بصري يجب رفضه؟",
          promptEn: "Which visual mistake must you reject?",
          choicesAr: ["تسمية المحاور", "قطع المحور الرأسي ليضخّم فرقًا تافهًا", "ذكر المصدر"],
          choicesEn: ["Labelling the axes", "Cropping the y-axis to inflate a tiny gap", "Citing the source"],
          correct: 1,
        },
        {
          id: "c5",
          promptAr: "ماذا يعني ارتباط قوي بين ساعات المذاكرة والدرجة؟",
          promptEn: "What does a strong correlation between study hours and marks mean?",
          choicesAr: ["سببًا مؤكدًا بلا شك", "علاقة رقمية تحتاج تفسيرًا لا قفزًا للسببية", "أن الرسم بلا فائدة"],
          choicesEn: ["Certain cause with no doubt", "A numerical link that still needs explanation, not a leap to cause", "That the chart is useless"],
          correct: 1,
        },
      ],
    },
  },
  {
    id: "7",
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
  {
    id: "1b",
    chapterId: "1",
    titleAr: "صلّ المصطلح",
    titleEn: "Match the Term",
    xp: 20,
    data: {
      kind: "match",
      introAr: "صل كل مصطلح بمعناه. لو المصطلح اتلخبط، القرار في الحصة بيتلخبط.",
      introEn: "Match each term to its meaning. A mixed term makes a mixed classroom decision.",
      pairs: [
        { id: "t1", leftAr: "ذكاء ضيق", leftEn: "Narrow AI", rightAr: "نظام يتقن مهمة واحدة فقط", rightEn: "A system that masters one task only" },
        { id: "t2", leftAr: "ذكاء توليدي", leftEn: "Generative AI", rightAr: "يصنع نصًا أو صورة من وصف", rightEn: "Makes text or an image from a prompt" },
        { id: "t3", leftAr: "خصوصية", leftEn: "Privacy", rightAr: "لا تشارك بيانات زميل مع نموذج عام", rightEn: "Do not send a classmate’s data to a public model" },
        { id: "t4", leftAr: "مساءلة", leftEn: "Accountability", rightAr: "الإنسان يتحمل أثر القرار", rightEn: "A person owns the effect of the decision" },
        { id: "t5", leftAr: "تحيز", leftEn: "Bias", rightAr: "بيانات تدريب غير عادلة أو ناقصة", rightEn: "Unfair or incomplete training data" },
        { id: "t6", leftAr: "حوسبة طرفية", leftEn: "Edge computing", rightAr: "القرار يتم فورًا على الجهاز", rightEn: "The decision happens at once on the device" },
      ],
    },
  },
  {
    id: "1c",
    chapterId: "1",
    titleAr: "قرار أخلاقي",
    titleEn: "Ethical Call",
    xp: 20,
    data: {
      kind: "pick",
      introAr: "اختر التصرف الأأمن في الحصة. الذكاء الاصطناعي أداة، والمسؤولية عليك.",
      introEn: "Pick the safer classroom move. AI is a tool; the responsibility is yours.",
      rounds: [
        {
          id: "e1",
          promptAr: "زميل طلب منك تلصق رد النموذج في التقرير من غير قراءة. ماذا تفعل؟",
          promptEn: "A classmate asks you to paste the model’s reply into the report unread. What do you do?",
          choicesAr: ["ألصق الرد بسرعة عشان نخلّص", "أقرأ الفكرة وأكتب كلامي أنا", "أبعت عنوان البيت للنموذج عشان يوضح"],
          choicesEn: ["Paste it fast so we finish", "Read the idea and write it in my words", "Send my home address so the model is clearer"],
          correct: 1,
        },
        {
          id: "e2",
          promptAr: "النموذج كتب جملة فصيحة. هل ده دليل إنها صحيحة؟",
          promptEn: "The model wrote a fluent sentence. Is that proof it is true?",
          choicesAr: ["أيوه، الفصاحة معناها صدق", "لا، لازم أراجع المصدر والمعنى", "أضغط صح من غير تفكير"],
          choicesEn: ["Yes — fluent language means it is true", "No — I still check the meaning and the source", "I tap True without thinking"],
          correct: 1,
        },
        {
          id: "e3",
          promptAr: "عايز تساعد النموذج يفهم الفصل. أي بيانات ممنوع ترفعها؟",
          promptEn: "You want the model to understand the class. Which data must you never upload?",
          choicesAr: ["سؤال الواجب بعد ما تمسحه من الأسماء", "كشف درجات الزملاء وأرقام تليفونهم", "تعريف مصطلح من الملزمة"],
          choicesEn: ["A homework question with names removed", "Classmates’ marks and phone numbers", "A term definition from the booklet"],
          correct: 1,
        },
        {
          id: "e4",
          promptAr: "سيارة ذاتية القيادة لازم تقرر في جزء من الثانية. أين يتم الحساب؟",
          promptEn: "A self-driving car must decide in a split second. Where should the computation run?",
          choicesAr: ["على السحابة فقط ولو النت قطع", "على المركبة نفسها (حوسبة طرفية)", "في بيت المهندس بعد أسبوع"],
          choicesEn: ["Only in the cloud, even if the network drops", "On the car itself (edge computing)", "At the engineer’s house a week later"],
          correct: 1,
        },
        {
          id: "e5",
          promptAr: "نظام التوظيف رفض معظم المتقدمات. أول حاجة تفحصها؟",
          promptEn: "A hiring system rejected most women applicants. What do you inspect first?",
          choicesAr: ["شكل شعار الشركة", "بيانات التدريب: هل كانت عادلة؟", "سرعة المعالج فقط"],
          choicesEn: ["The company logo", "The training data: was it fair?", "Processor speed only"],
          correct: 1,
        },
      ],
    },
  },
  {
    id: "2b",
    chapterId: "2",
    titleAr: "رتّب الاستجابة",
    titleEn: "Incident Order",
    xp: 20,
    data: {
      kind: "sort",
      introAr: "رسالة مشبوهة وصلت. رتّب خطوات الحماية من أول تصرف لآخره.",
      introEn: "A suspicious message arrived. Put the protection steps in order from first to last.",
      items: [
        { id: "s1", labelAr: "لا تضغط الرابط ولا تحمّل المرفق", labelEn: "Do not click the link or open the attachment", order: 0 },
        { id: "s2", labelAr: "أخبر المدرس أو مسؤول التقنية فورًا", labelEn: "Tell the teacher or IT at once", order: 1 },
        { id: "s3", labelAr: "غيّر كلمة المرور من الموقع الرسمي فقط", labelEn: "Change the password only on the official site", order: 2 },
        { id: "s4", labelAr: "فعّل التحقق بخطوتين إن كان متاحًا", labelEn: "Turn on two-step verification if it is available", order: 3 },
        { id: "s5", labelAr: "راجع الأجهزة المتصلة واقطع الغريب", labelEn: "Review signed-in devices and drop the unknown one", order: 4 },
      ],
    },
  },
  ...MAP_GAMES,
];

export function getGame(id: string): ChapterGame | undefined {
  return CHAPTER_GAMES.find((game) => game.id === id);
}

export function gameForChapter(id: string): ChapterGame | undefined {
  return getGame(id) ?? CHAPTER_GAMES.find((game) => game.chapterId === id);
}

export function gamesForChapter(chapterId: ChapterId): ChapterGame[] {
  return CHAPTER_GAMES.filter((game) => game.chapterId === chapterId);
}
