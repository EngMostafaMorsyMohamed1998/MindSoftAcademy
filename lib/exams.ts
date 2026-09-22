import { CHAPTERS, isChapterId, type ChapterId } from "@/lib/curriculum";
import { faizExam } from "@/lib/faiz-exam";
import { questionsForChapter, type HomeworkQuestion } from "@/lib/homework-bank";
import { syllabusAnalysisForChapter } from "@/lib/question-bank";
import { shuffled } from "@/lib/shuffle";

export type ObjectiveKind = "mcq" | "tf";

export type ObjectiveQuestion = {
  id: string;
  kind: ObjectiveKind;
  promptAr: string;
  promptEn: string;
  optionsAr?: string[];
  optionsEn?: string[];
  correctIndex: 0 | 1 | 2 | 3;
  points: number;
  whyAr?: string;
  whyEn?: string;
};

export type EssayQuestion = {
  id: string;
  promptAr: string;
  promptEn: string;
  guideAr: string;
  guideEn: string;
  points: number;
};

export type ExamPaperId = ChapterId | "mix" | "faiz";

export type ChapterExam = {
  chapterId: ExamPaperId;
  objectives: ObjectiveQuestion[];
  essays: EssayQuestion[];
};

export const EXAM_SIZE = 50;
export const EXAM_ESSAY_COUNT = 2;
export const EXAM_OBJECTIVE_COUNT = EXAM_SIZE - EXAM_ESSAY_COUNT;

function mcq(
  id: string,
  promptAr: string,
  promptEn: string,
  optionsAr: [string, string, string, string],
  optionsEn: [string, string, string, string],
  correctIndex: 0 | 1 | 2 | 3,
): ObjectiveQuestion {
  return { id, kind: "mcq", promptAr, promptEn, optionsAr, optionsEn, correctIndex, points: 2 };
}

function tf(
  id: string,
  promptAr: string,
  promptEn: string,
  truth: boolean,
): ObjectiveQuestion {
  return {
    id,
    kind: "tf",
    promptAr,
    promptEn,
    optionsAr: ["صح", "غلط"],
    optionsEn: ["True", "False"],
    correctIndex: truth ? 0 : 1,
    points: 2,
  };
}

function essay(
  id: string,
  promptAr: string,
  promptEn: string,
  guideAr: string,
  guideEn: string,
): EssayQuestion {
  return { id, promptAr, promptEn, guideAr, guideEn, points: 8 };
}

export const CHAPTER_EXAMS: ChapterExam[] = [
  {
    chapterId: "1",
    objectives: [
      mcq(
        "1-m1",
        "ما الترتيب الزمني الصحيح لمراحل تقنية المعلومات؟",
        "What is the correct chronological order of IT stages?",
        [
          "الهواتف → الإنترنت → الحاسوب → السحابة",
          "الحاسوب → الإنترنت → الهواتف → السحابة",
          "السحابة → الهواتف → الإنترنت → الحاسوب",
          "الإنترنت → الحاسوب → السحابة → الهواتف",
        ],
        [
          "Smartphones → Internet → computer → cloud",
          "Computer → Internet → smartphones → cloud",
          "Cloud → smartphones → Internet → computer",
          "Internet → computer → cloud → smartphones",
        ],
        1,
      ),
      mcq(
        "1-m2",
        "أي ترتيب يصف المجالات من الأوسع إلى الأخص؟",
        "Which order goes from the widest field to the narrowest?",
        [
          "تعلم عميق، ثم تعلم آلي، ثم ذكاء اصطناعي",
          "ذكاء اصطناعي، ثم تعلم آلي، ثم تعلم عميق، ثم ذكاء توليدي",
          "ذكاء توليدي، ثم ذكاء اصطناعي، ثم تعلم آلي",
          "التعلم الآلي والذكاء الاصطناعي اسمان لشيء واحد",
        ],
        [
          "Deep learning, then machine learning, then AI",
          "AI, then machine learning, then deep learning, then generative AI",
          "Generative AI, then AI, then machine learning",
          "Machine learning and AI are two names for one thing",
        ],
        1,
      ),
      mcq(
        "1-m3",
        "لماذا تحتاج السيارة ذاتية القيادة حوسبة طرفية؟",
        "Why do self-driving cars need edge computing?",
        [
          "لأن السحابة أرخص دائمًا",
          "لأن القرار يجب أن يتم فورًا على المركبة",
          "لأن الصور لا تُخزَّن",
          "لأن القانون يمنع الإنترنت",
        ],
        [
          "Because the cloud is always cheaper",
          "Because the decision must happen instantly on the vehicle",
          "Because images are never stored",
          "Because the law forbids the Internet",
        ],
        1,
      ),
      mcq(
        "1-m4",
        "أي مما يلي مثال على ذكاء توليدي؟",
        "Which is an example of generative AI?",
        [
          "فلتر البريد المزعج",
          "توصية منتج من تاريخ الشراء",
          "توليد صورة من وصف نصي",
          "حساب المتوسط في جدول",
        ],
        [
          "A spam filter",
          "A product recommendation from purchase history",
          "An image generated from a text prompt",
          "Computing a mean in a spreadsheet",
        ],
        2,
      ),
      tf("1-t1", "قانون مور يقول إن عدد الترانزستورات يتضاعف تقريبًا كل سنتين.", "Moore's Law says transistor count roughly doubles about every two years.", true),
      tf("1-t2", "التجارة الإلكترونية تعني الشراء النقدي من محل فعلي فقط.", "E-commerce means paying cash in a physical shop only.", false),
      tf("1-t3", "الواقع المعزز يستبدل العالم الحقيقي بالكامل بعالم محاكى.", "Augmented reality fully replaces the real world with a virtual one.", false),
      tf("1-t4", "مشاركة بيانات زميل مع نموذج عام تُعد مشكلة خصوصية.", "Sharing a classmate's data with a public model is a privacy problem.", true),
      mcq(
        "1-m5",
        "ماذا يعني الذكاء الضيق، وهو شكل معظم أنظمة اليوم؟",
        "What does narrow AI, the form of most systems today, mean?",
        [
          "نظام يفهم كل المجالات مثل الإنسان",
          "نظام يتقن مهمة واحدة فقط",
          "برنامج يعمل من غير بيانات تدريب",
          "بديل كامل عن المدرس في كل المواد",
        ],
        [
          "A system that understands every domain like a person",
          "A system that is expert at one task only",
          "A program that works with no training data",
          "A full replacement for the teacher in every subject",
        ],
        1,
      ),
      mcq(
        "1-m6",
        "ماذا تعني هلوسة النموذج؟",
        "What does a model hallucination mean?",
        [
          "الجهاز سخن أثناء التشغيل",
          "نص يبدو صحيحًا وهو خطأ",
          "النموذج لا يكتب بالعربية",
          "الرد أقصر من المطلوب دائمًا",
        ],
        [
          "The machine overheated while running",
          "Text that sounds right and is still wrong",
          "The model cannot write in Arabic",
          "The reply is always shorter than needed",
        ],
        1,
      ),
      tf("1-t5", "التحيز في النظام يأتي غالبًا من بيانات تدريب غير عادلة أو ناقصة.", "Bias in a system often comes from unfair or incomplete training data.", true),
      tf("1-t6", "المساءلة تعني أن الحاسوب وحده يتحمل أثر القرار.", "Accountability means the computer alone bears the effect of the decision.", false),
    ],
    essays: [
      essay(
        "1-e1",
        "حلّل كيف غيّرت الحوسبة السحابية (منذ العقد 2010) طريقة استخدام التقنية. اذكر تحليل البيانات واسع النطاق، والذكاء الاصطناعي، و«التقنية كخدمة».",
        "Analyse how cloud computing (from the 2010s) changed the way IT is used. Refer to large-scale data analysis, AI, and IT as a service.",
        "المصطلح: الحوسبة السحابية.\nالسبب: من العقد 2010 بقت التقنية خدمة عبر الإنترنت: تخزين، تحليل بيانات كبير، وذكاء اصطناعي من غير ما تشتري الجهاز كله.\nالمثال: الطالب يفتح البريد والملفات من أي جهاز، والمدرسة تستخدم نماذج كخدمة.",
        "Term: cloud computing.\nReason: From the 2010s IT became a service over the Internet: storage, large-scale analysis, and AI without buying the whole machine.\nExample: a student opens mail and files from any device, and the school uses models as a service.",
      ),
      essay(
        "1-e2",
        "اشرح العلاقة المتداخلة بين الذكاء الاصطناعي والتعلم الآلي والتعلم العميق والذكاء التوليدي، وأعطِ مثالًا لكل مستوى.",
        "Explain the nested relationship between AI, machine learning, deep learning, and generative AI, with one example each.",
        "المصطلح: ذكاء اصطناعي، ثم تعلم آلي، ثم تعلم عميق، ثم ذكاء توليدي.\nالسبب: كل مستوى أخص من الذي يسبقه. التوليدي ينتج نصًا أو صورة وقد يهلوس.\nالمثال: نظام خبير قديم ذكاء اصطناعي، فلتر البريد تعلم آلي، التعرف على الوجوه تعلم عميق، وصورة من جملة ذكاء توليدي.",
        "Term: AI, then machine learning, then deep learning, then generative AI.\nReason: each level is narrower than the one before it. Generative AI makes new text or images and can hallucinate.\nExample: an old expert system is AI, a spam filter is machine learning, face recognition is deep learning, and an image from a sentence is generative AI.",
      ),
    ],
  },
  {
    chapterId: "2",
    objectives: [
      mcq(
        "2-m1",
        "ماذا يستخدم التشفير غير المتماثل؟",
        "What does asymmetric encryption use?",
        [
          "مفتاحًا واحدًا للطرفين",
          "زوج مفاتيح: عام وخاص",
          "كلمة مرور فقط بلا مفاتيح",
          "جدار حماية بدل المفاتيح",
        ],
        [
          "One shared key for both sides",
          "A public and a private key pair",
          "A password with no keys",
          "A firewall instead of keys",
        ],
        1,
      ),
      mcq(
        "2-m2",
        "ماذا تجمع المصادقة متعددة العوامل عادة؟",
        "What does multi-factor authentication usually combine?",
        [
          "ثلاث كلمات مرور مختلفة",
          "شيء تعرفه وشيء تملكه و/أو شيء أنت عليه",
          "عنوان البريد ولون الخلفية",
          "اسم المستخدم فقط مرتين",
        ],
        [
          "Three different passwords",
          "Something you know, have, and/or are",
          "An email address and a wallpaper colour",
          "The username typed twice",
        ],
        1,
      ),
      mcq(
        "2-m3",
        "ماذا يعني مبدأ أقل صلاحية؟",
        "What does least privilege mean?",
        [
          "كل الموظفين يحصلون على صلاحية المدير",
          "إعطاء كل مستخدم أقل ما يكفي لعمله",
          "إغلاق الإنترنت نهائيًا",
          "تعطيل جدار الحماية لتسهيل العمل",
        ],
        [
          "Every staff member gets admin rights",
          "Give each user only what their job needs",
          "Turn the Internet off forever",
          "Disable the firewall to work faster",
        ],
        1,
      ),
      mcq(
        "2-m4",
        "ما التسلسل الصحيح بعد اكتشاف الاختراق؟",
        "What is the right sequence after a breach is found?",
        [
          "مسح كل الأجهزة فورًا بلا توثيق",
          "إخفاء الأمر عن الإدارة",
          "احتواء الضرر ثم جمع الأدلة والتعافي",
          "نشر كلمات المرور في مجموعة الصف",
        ],
        [
          "Wipe every device immediately with no notes",
          "Hide it from management",
          "Contain the damage, then preserve evidence and recover",
          "Post passwords in the class chat",
        ],
        2,
      ),
      tf("2-t1", "التجزئة عملية يمكن عكسها بسهولة لاسترجاع كلمة المرور.", "A hash is easily reversed to recover the password.", false),
      tf("2-t2", "الشبكة الخاصة الافتراضية تنشئ نفقًا مشفّرًا عبر شبكة عامة.", "A VPN creates an encrypted tunnel across a public network.", true),
      tf("2-t3", "تقسيم الشبكة يساعد على منع انتشار الاختراق.", "Network segmentation helps stop a breach from spreading.", true),
      tf("2-t4", "إدارة المخاطر تعني تجاهل كل خطر لأنه نادر.", "Risk management means ignoring every risk because it is rare.", false),
      mcq(
        "2-m5",
        "كلمة المرور مع تطبيق على الهاتف مثال على ماذا؟",
        "A password plus an authenticator app is an example of what?",
        ["تشفير الملف فقط", "مصادقة متعددة العوامل", "بيانات مفتوحة", "انحدار خطي"],
        ["File encryption only", "Multi-factor authentication", "Open data", "Linear regression"],
        1,
      ),
      mcq(
        "2-m6",
        "أي تصرف يجب تجنبه فور اكتشاف الاختراق؟",
        "Which action must you avoid as soon as a breach is found?",
        [
          "عزل الجهاز عن الشبكة",
          "مسح القرص قبل أي تسجيل",
          "تصوير حالة الجهاز",
          "إبلاغ مسؤول المعمل",
        ],
        [
          "Isolate the device from the network",
          "Wipe the disk before any record",
          "Image the device state",
          "Tell the lab supervisor",
        ],
        1,
      ),
      tf("2-t5", "مبدأ أقل صلاحية يعني إعطاء كل مستخدم أقل ما يكفي لعمله.", "Least privilege means giving each user only what their job needs.", true),
      tf("2-t6", "الشهادة الرقمية تربط المفتاح العام بهوية موثوقة.", "A digital certificate binds a public key to a trusted identity.", true),
    ],
    essays: [
      essay(
        "2-e1",
        "قارن التشفير المتماثل وغير المتماثل: المفاتيح، الاستخدام المناسب، ومثال واحد لكل منهما في الحياة الرقمية.",
        "Compare symmetric and asymmetric encryption: keys, a suitable use, and one digital-life example of each.",
        "المصطلح: التشفير المتماثل وغير المتماثل.\nالسبب: المتماثل مفتاح واحد سريع للطرفين اللي اتفقوا قبل كده. غير المتماثل زوج عام وخاص لما الطرفين ما تبادلوش سراً.\nالمثال: نسخة المعمل بمفتاح واحد، وشكوى ولي الأمر تتشفر بالمفتاح العام.",
        "Term: symmetric and asymmetric encryption.\nReason: symmetric uses one fast shared key when both sides already met. Asymmetric uses a public/private pair when they did not share a secret.\nExample: a lab backup with one key; a parent complaint encrypted with the public key.",
      ),
      essay(
        "2-e2",
        "مدرسة اكتشفت برمجية خبيثة على جهاز معامل. اكتب خطة استجابة من خمس خطوات، واذكر قرارًا واحدًا لا يجب اتخاذه في أول عشر دقائق.",
        "A school finds malware on a lab PC. Write a five-step response plan and one action that must not be taken in the first ten minutes.",
        "المصطلح: خطة الاستجابة.\nالسبب: الخطوات: اكتشف، احتوِ، أزل، استعد، راجع. أول عشر دقايق متسمحش القرص عشان الأدلة تضيع.\nالمثال: جهاز المعمل المصاب يتفصل عن الشبكة ويتصور، وبعدين يتنظف.",
        "Term: response plan.\nReason: the steps are detect, contain, eradicate, recover, review. Do not wipe the disk in the first ten minutes or the evidence is gone.\nExample: isolate the infected lab PC, image it, then clean it.",
      ),
    ],
  },
  {
    chapterId: "3",
    objectives: [
      mcq(
        "3-m1",
        "ما وظيفة طبقة الواجهة الأمامية؟",
        "What is the job of the frontend layer?",
        [
          "حفظ كلمات المرور في قاعدة بيانات الخادم",
          "ما يراه المستخدم ويتفاعل معه في المتصفح",
          "تشغيل الموجّه في غرفة الخادم فقط",
          "تشفير القرص الصلب للمدرسة",
        ],
        [
          "Storing passwords in the server database",
          "What the user sees and uses in the browser",
          "Running only the school router",
          "Encrypting the school's hard disk",
        ],
        1,
      ),
      mcq(
        "3-m2",
        "أي طريقة HTTP تقرأ قائمة من غير أن تغيّرها؟",
        "Which HTTP method reads a list without changing it?",
        ["POST (إرسال)", "DELETE (حذف)", "GET (جلب)", "PUT (استبدال)"],
        ["POST", "DELETE", "GET", "PUT"],
        2,
      ),
      mcq(
        "3-m3",
        "ماذا يعني HTTPS؟",
        "What does HTTPS mean?",
        [
          "بروتوكول ويب أسرع بلا أمان",
          "بروتوكول الويب فوق قناة مشفّرة",
          "بروتوكول بريد فقط",
          "لغة تنسيق الصفحات",
        ],
        [
          "Faster HTTP with no security",
          "HTTP over an encrypted channel",
          "An email protocol only",
          "A page-styling language",
        ],
        1,
      ),
      mcq(
        "3-m4",
        "لماذا لا نضع مفتاحًا سريًا داخل جافاسكربت الواجهة؟",
        "Why must a secret key not sit in frontend JavaScript?",
        [
          "لأن المتصفح مكشوف لأي زائر",
          "لأن جافاسكربت لا تعمل في الهاتف",
          "لأن هيكل الصفحة يمنع الأرقام",
          "لأن الخادم لا يفهم المفاتيح",
        ],
        [
          "Because the browser is visible to any visitor",
          "Because JavaScript never runs on phones",
          "Because HTML forbids numbers",
          "Because servers cannot read keys",
        ],
        0,
      ),
      tf("3-t1", "قاعدة البيانات جزء من طبقة البيانات الدائمة.", "The database belongs to the persistent data layer.", true),
      tf("3-t2", "رمز الحالة 404 يعني أن الخادم وجد المورد بنجاح.", "Status 404 means the server found the resource successfully.", false),
      tf("3-t3", "HTML يعطي معنى الصفحة وهيكلها، وCSS يعطي المظهر.", "HTML gives the page its meaning and structure; CSS gives the appearance.", true),
      tf("3-t4", "إتاحة الوصول تعني تجاهل لوحة المفاتيح وقارئ الشاشة.", "Accessibility means ignoring the keyboard and screen readers.", false),
      mcq(
        "3-m5",
        "ماذا يعني رمز الحالة 500 غالبًا؟",
        "What does status 500 usually mean?",
        ["المورد غير موجود", "خطأ على الخادم", "نجاح القراءة", "الطلب يحتاج صورة فقط"],
        ["The resource is missing", "A server error", "A successful read", "The request needs a photo only"],
        1,
      ),
      mcq(
        "3-m6",
        "ما ترتيب أدوار HTML ثم CSS ثم JavaScript؟",
        "In order, what are the jobs of HTML, then CSS, then JavaScript?",
        [
          "مظهر، هيكل، سلوك",
          "هيكل ومعنى، مظهر، سلوك",
          "قاعدة بيانات، تشفير، جدار",
          "ضغط، عينة، انحدار",
        ],
        [
          "Look, structure, behaviour",
          "Structure and meaning, look, behaviour",
          "Database, encryption, firewall",
          "Compression, sample, regression",
        ],
        1,
      ),
      tf("3-t5", "HTTPS هو HTTP فوق قناة مشفّرة.", "HTTPS is HTTP over an encrypted channel.", true),
      tf("3-t6", "ملفات الارتباط (cookies) قد تحفظ حالة تسجيل الدخول بين الطلبات.", "Cookies can keep a login alive across requests.", true),
    ],
    essays: [
      essay(
        "3-e1",
        "ارسم بالكلمات بنية تطبيق ويب من ثلاث طبقات (واجهة، تطبيق، بيانات) وبيّن مسؤولية كل طبقة عند تسجيل دخول طالب.",
        "In words, sketch a three-layer web app (presentation, application, data) and the job of each layer when a student logs in.",
        "المصطلح: طبقات التطبيق.\nالسبب: الواجهة تعرض وتجمع الطلب. التطبيق يقرر الصلاحية. البيانات تحفظ المستخدم.\nالمثال: تسجيل دخول طالب: المتصفح يرسل، الخادم يتحقق، القاعدة تقرأ الحساب، والرد يرجع آمناً.",
        "Term: application layers.\nReason: the frontend shows and collects the request. The application layer checks rights. The data layer stores the user.\nExample: a student login: the browser sends, the server checks, the database reads the account, and a safe reply returns.",
      ),
      essay(
        "3-e2",
        "اشرح الفرق بين بروتوكول الويب وبروتوكول الويب الآمن، ومتى ترفض إدخال كلمة مرور في صفحة غير مشفّرة. اذكر دور رمز الحالة في تشخيص عطل.",
        "Explain HTTP versus HTTPS, when you refuse to type a password on an unencrypted page, and how a status code helps diagnose a fault.",
        "المصطلح: بروتوكول ويب آمن.\nالسبب: بروتوكول الويب العادي مكشوف. الآمن يشفّر الطريق بشهادة الموقع. لو مفيش قفل متعملش كلمة مرور.\nالمثال: 404 الصفحة مش موجودة، 500 الخادم وقع؛ الرمز يساعد التشخيص.",
        "Term: secure web protocol.\nReason: plain web traffic is visible. The secure version encrypts the path with a site certificate. If there is no lock, do not type a password.\nExample: 404 means the page is missing; 500 means the server failed; the code helps diagnosis.",
      ),
    ],
  },
  {
    chapterId: "4",
    objectives: [
      mcq(
        "4-m1",
        "ما أنسب تمثيل بصري لتغيّر درجات الصف عبر الشهور؟",
        "What is the best visual for class scores changing over months?",
        ["أيقونة واحدة", "رسم خط زمني", "مقطع صوتي بلا أرقام", "خلفية متحركة فقط"],
        ["A single icon", "A line chart over time", "Audio with no numbers", "A moving background only"],
        1,
      ),
      mcq(
        "4-m2",
        "تجربة المستخدم تهتم أساسًا بماذا؟",
        "What is user experience mainly about?",
        [
          "لون شعار الشركة فقط",
          "سهولة إتمام المهمة بوضوح",
          "أكبر عدد من الإعلانات",
          "إخفاء القائمة عمدًا",
        ],
        [
          "Only the company logo colour",
          "How easily the user completes a clear task",
          "The maximum number of ads",
          "Hiding the menu on purpose",
        ],
        1,
      ),
      mcq(
        "4-m3",
        "ماذا يعني اختبار أ/ب؟",
        "What does an A/B test mean?",
        [
          "مقارنة نسختين وقياس النتيجة",
          "حذف الموقع بالكامل",
          "تغيير كل شيء دفعة واحدة بلا قياس",
          "السؤال عن اللون المفضل فقط",
        ],
        [
          "Comparing two versions and measuring the result",
          "Deleting the whole site",
          "Changing everything at once with no measure",
          "Asking only about a favourite colour",
        ],
        0,
      ),
      mcq(
        "4-m4",
        "التحسين التكراري يبدأ بماذا؟",
        "What does iterative improvement start with?",
        [
          "النشر النهائي دون اختبار",
          "نموذج أولي رخيص ثم اختبار فتعلم",
          "شراء أغلى برنامج تصميم",
          "نسخ موقع مشهور بلا فهم المهمة",
        ],
        [
          "A final launch with no tests",
          "A cheap prototype, then test and learn",
          "Buying the most expensive design tool",
          "Copying a famous site with no task in mind",
        ],
        1,
      ),
      tf("4-t1", "النص البديل للصورة يساعد من يستخدم قارئ الشاشة.", "Alt text helps someone using a screen reader.", true),
      tf("4-t2", "الصورة الضخمة غير المضغوطة لا تؤثر على شبكة ضعيفة.", "A huge uncompressed image never affects a weak network.", false),
      tf("4-t3", "الاتساق في مكان القائمة أهم من مفاجأة شكل جديد كل صفحة.", "A consistent menu placement beats a surprise layout on every page.", true),
      tf("4-t4", "قطع محور الرسم ليضخّم فرقًا صغيرًا ممارسة صادقة.", "Cropping a chart axis to inflate a tiny gap is honest practice.", false),
      mcq(
        "4-m5",
        "ماذا يعني اختبار أ/ب لموقع الحضور؟",
        "What does an A/B test for an attendance site mean?",
        [
          "نختار الزر الأجمل بالذوق فقط",
          "نجرّب نسختين ونقيس زمن المهمة أو الأخطاء",
          "نحذف الموقع أسبوعًا",
          "نعتمد أول لون للشعار",
        ],
        [
          "We pick the prettier button by taste only",
          "We try two versions and measure task time or errors",
          "We take the site down for a week",
          "We trust the first logo colour",
        ],
        1,
      ),
      mcq(
        "4-m6",
        "لماذا نغيّر عنصرًا واحدًا في كل دورة تحسين؟",
        "Why change one element per improvement cycle?",
        [
          "حتى يطول المشروع",
          "حتى نعرف أي تغيير صنع الفرق",
          "حتى نلغي التوثيق",
          "حتى نزيد حجم الصور",
        ],
        [
          "So the project lasts longer",
          "So we know which change made the difference",
          "So we can skip recording decisions",
          "So images get larger",
        ],
        1,
      ),
      tf("4-t5", "النموذج الأولي نسخة رخيصة سريعة تُختبر قبل البناء الكامل.", "A prototype is a cheap, fast version tested before full build.", true),
      tf("4-t6", "تجربة المستخدم هي شكل الزر فقط، وواجهة المستخدم هي رحلة المستخدم كلها.", "UX is only the button look, and UI is the whole user journey.", false),
    ],
    essays: [
      essay(
        "4-e1",
        "موقع تسجيل حصص يعرض زر «حضور» بلون باهت في أسفل صفحة مزدحمة. انتقد التصميم من زاوية تجربة المستخدم واقترح تحسينين قابلين للقياس.",
        "An attendance site hides a faint «Present» button at the bottom of a crowded page. Critique the UX and propose two measurable improvements.",
        "المصطلح: تجربة المستخدم.\nالسبب: الزر الباهت تحت الصفحة المزدحمة يخفي المهمة. حسّن التسلسل البصري وقلّل النقرات.\nالمثال: قيس زمن تسجيل الحضور قبل وبعد ما الزر يبقى واضح فوق.",
        "Term: user experience.\nReason: a faint button at the bottom of a crowded page hides the task. Improve visual order and cut clicks.\nExample: measure attendance time before and after the button is large and near the top.",
      ),
      essay(
        "4-e2",
        "صف دورة تحسين تكراري لموقع مدرسي بعد ملاحظة أن الطلاب يغادرون من صفحة الدفع. اذكر ماذا تقيس في كل دورة.",
        "Describe an iterative loop for a school site after students leave the payment page. State what you measure in each cycle.",
        "المصطلح: دورة التحسين.\nالسبب: صمّم، اختبر، قِس، غيّر عنصراً واحداً. لو غيّرت كل حاجة مرة واحدة مش هتعرف السبب.\nالمثال: الطلاب يغادروا صفحة الدفع؛ غيّر خانة كلمة المرور وحدها وقيس نسبة الإتمام.",
        "Term: improvement loop.\nReason: design, test, measure, change one element. If you change everything at once you cannot see the cause.\nExample: students leave the payment page; change only the password field and measure completion.",
      ),
    ],
  },
  {
    chapterId: "5",
    objectives: [
      mcq(
        "5-m1",
        "ما البيانات الأولية؟",
        "What is primary data?",
        [
          "إحصاء حكومي حمّلته كما هو",
          "بيانات تجمعها أنت لغرضك",
          "أي ملف وجدته على الإنترنت",
          "صورة من كتاب بلا مصدر",
        ],
        [
          "A government table you downloaded as-is",
          "Data you gather yourself for your purpose",
          "Any file found online",
          "A textbook photo with no source",
        ],
        1,
      ),
      mcq(
        "5-m2",
        "ماذا تعني العينة الطبقية؟",
        "What does stratified sampling mean?",
        [
          "تختار من يسهل الوصول إليه فقط",
          "تقسم المجتمع ثم تسحب عشوائيًا من كل شريحة",
          "تسأل المارة عصر الجمعة أمام المحطة وتعمم على المدينة",
          "تستبعد شريحة كاملة عمدًا",
        ],
        [
          "Picks whoever is easiest to reach",
          "Splits the population then draws at random from each stratum",
          "Asks Friday-afternoon passers-by and speaks for the whole city",
          "Drops a whole group on purpose",
        ],
        1,
      ),
      mcq(
        "5-m3",
        "إذا كانت القيمة الشاذة ناتجة عن خطأ إدخال، ماذا تفعل؟",
        "If an outlier is an input error, what do you do?",
        [
          "نتركها دائمًا لأنها «واقع»",
          "نصححها أو نحذفها بعد التأكد من السبب",
          "نضاعفها",
          "نحوّل كل العمود إلى صفر",
        ],
        [
          "Always keep it because it is «real»",
          "Correct or delete it after confirming the cause",
          "Double it",
          "Set the whole column to zero",
        ],
        1,
      ),
      mcq(
        "5-m4",
        "متى يفيد التطبيع إلى المدى من 0 إلى 1؟",
        "When does normalising to 0–1 help?",
        [
          "المتغيرات بوحدات ومديات مختلفة",
          "كل القيم نصوصًا",
          "لا توجد بيانات",
          "نريد إخفاء المصدر",
        ],
        [
          "Variables have different units and ranges",
          "Every value is text",
          "There is no data",
          "We want to hide the source",
        ],
        0,
      ),
      tf("5-t1", "تحيز العينة يجعل نتيجة الحساب تبدو واثقة وهي لا تمثل المجتمع.", "Sampling bias can make a calculation look confident while it fails to represent the population.", true),
      tf("5-t2", "البيانات الثانوية أسرع غالبًا لكنها قد لا تطابق غرضك تمامًا.", "Secondary data is often faster but may not match your purpose exactly.", true),
      tf("5-t3", "حذف كل صف فيه خلية فارغة هو القرار الصحيح دائمًا.", "Deleting every row with a blank cell is always the right decision.", false),
      tf("5-t4", "واجهة البرمجة تسمح بجلب بيانات محدّثة من مصدر وفق عقد واضح.", "An API lets you fetch fresh data from a source under a clear contract.", true),
      mcq(
        "5-m5",
        "استطلاع يردّ عليه المهتمون فقط يعاني غالبًا من ماذا؟",
        "A poll answered only by the keen often suffers from what?",
        ["عينة عشوائية كاملة", "تحيز الاختيار الذاتي", "انحدار بلا بيانات", "هلوسة لغوية"],
        ["A complete random sample", "Self-selection bias", "Regression with no data", "A language hallucination"],
        1,
      ),
      mcq(
        "5-m6",
        "قبل أن تستخدم رقمًا من بوابة بيانات مفتوحة، ماذا تفعل؟",
        "Before you use a number from an open-data portal, what do you do?",
        [
          "اخفِ المصدر",
          "راجع الترخيص وتاريخ التحديث",
          "افترض أنها بلا تحيز",
          "احذف العمود كله",
        ],
        [
          "Hide the source",
          "Check the licence and the update date",
          "Assume it has no bias",
          "Delete the whole column",
        ],
        1,
      ),
      tf("5-t5", "البيانات الأولية تجمعها أنت لغرض محدد.", "Primary data is what you gather fresh for your purpose.", true),
      tf("5-t6", "العينة الطبقية تسحب من كل شريحة بعد تقسيم المجتمع.", "A stratified sample draws from each stratum after the population is split.", true),
    ],
    essays: [
      essay(
        "5-e1",
        "لماذا قد تصبح التحليلات بلا قيمة رغم صحة الحساب إذا كانت العينة متحيزة؟ اشرح بفكرة «العينة صورة مصغّرة للمجتمع» ومثال من المدرسة.",
        "Why can an analysis be worthless even when the maths is correct if the sample is biased? Use the idea of a sample as a miniature of the population and a school example.",
        "المصطلح: تحيز العينة.\nالسبب: الحساب ممكن يبقى صح والعينة مش صورة المجتمع، فالنتيجة تكذب.\nالمثال: استطلاع جروب المتفوقين بس يميل المتوسط لفوق ويغفل باقي الصف.",
        "Term: sampling bias.\nReason: the maths can be correct while the sample is not a miniature of the population, so the result lies.\nExample: a poll in the honour-roll group only tilts the mean up and misses the rest of the school.",
      ),
      essay(
        "5-e2",
        "جدول حضور فيه خلايا فارغة، درجة 250 من 100، وصفان متطابقان. قرّر لكل مشكلة: حذف أو ملء أو تعليم أو تصحيح، وبرّر.",
        "An attendance table has blanks, a mark of 250/100, and two identical rows. For each problem choose delete, impute, flag, or correct, and justify.",
        "المصطلح: تنظيف البيانات.\nالسبب: الخلية الفارغة قد تكون رفض إجابة، فتُعلَّم ولا تُملأ بصفر. 250 من 100 خطأ إدخال يُصحَّح أو يُحذف بعد التأكد. الصفان المتطابقان نسخة مكررة، فيُحذف أحدهما بعد التأكد أنهما نفس الحدث.\nالمثال: علّم الغياب الفارغ، صحّح الدرجة المستحيلة، واحذف الصف المنسوخ.",
        "Term: data cleaning.\nReason: a blank may be a refused answer, so flag it instead of filling zero. 250/100 is an input error to correct or delete after you confirm it. Two identical rows are a copy, so delete one after you confirm they are the same event.\nExample: flag the blank absence, fix the impossible mark, and delete the pasted duplicate row.",
      ),
    ],
  },
  {
    chapterId: "6",
    objectives: [
      mcq(
        "6-m1",
        "إلى ماذا يهدف الاستدلال الإحصائي؟",
        "What does statistical inference aim to do?",
        [
          "نسخ أرقام العينة كما هي بلا تعميم",
          "تعميم حذر من العينة إلى المجتمع مع عدم يقين",
          "حذف كل القيم الشاذة تلقائيًا",
          "رسم أجمل صورة بلا محور",
        ],
        [
          "Copy sample numbers with no generalisation",
          "Cautiously generalise from sample to population, with uncertainty",
          "Delete every outlier automatically",
          "Draw the prettiest picture with no axis",
        ],
        1,
      ),
      mcq(
        "6-m2",
        "إذا وُجدت قيمة شاذة كبيرة، أي مقياس مركز أكثر ثباتًا؟",
        "If a large outlier is present, which centre is more robust?",
        ["المتوسط فقط", "الوسيط", "أكبر قيمة", "عدد الصفوف"],
        ["The mean only", "The median", "The maximum", "The row count"],
        1,
      ),
      mcq(
        "6-m3",
        "متى يناسب الانحدار الخطي؟",
        "When does linear regression fit?",
        [
          "سحابة نقاط بلا اتجاه",
          "اتجاه تقريبي بين متغيرين كميين",
          "أسماء الطلاب فقط",
          "ألوان الشعار",
        ],
        [
          "A shapeless cloud of points",
          "An approximate trend between two quantitative variables",
          "Student names only",
          "Logo colours",
        ],
        1,
      ),
      mcq(
        "6-m4",
        "ما أفضل رسم لمقارنة عدد الطلاب في ثلاث شعب؟",
        "What is the best chart to compare student counts in three classes?",
        ["دائرة بعشرين شريحة", "أعمدة", "خريطة حرارية بلا أرقام", "نص شعري"],
        ["A pie with twenty slices", "Bars", "A heatmap with no numbers", "A poem"],
        1,
      ),
      tf("6-t1", "الارتباط بين متغيرين يثبت أن أحدهما سبب للآخر.", "A correlation between two variables proves that one causes the other.", false),
      tf("6-t2", "عينة صغيرة تعطي غالبًا فترة ثقة أوسع.", "A small sample usually gives a wider confidence interval.", true),
      tf("6-t3", "البواقي الكبيرة تعني أن الخط يصف البيانات جيدًا جدًا.", "Large residuals mean the line describes the data extremely well.", false),
      tf("6-t4", "عنوان الرسم يجب أن يقول الادعاء، مع تسمية المحاور وذكر المصدر.", "A chart title should state the claim, with labelled axes and a source.", true),
      mcq(
        "6-m5",
        "ماذا يُسمّى التنبؤ خارج مدى بيانات الخط؟",
        "What do we call predicting outside the line's data range?",
        ["تطبيعًا", "استكمالًا خارجيًا", "عينة طبقية", "جدار حماية"],
        ["Normalising", "Extrapolation (outside the data range)", "Stratified sampling", "A firewall"],
        1,
      ),
      mcq(
        "6-m6",
        "عند وجود قيمة شاذة في الدرجات، ماذا تفعل؟",
        "When marks include an outlier, what do you do?",
        ["المتوسط يكفي وحده دائمًا", "انظر الوسيط أيضًا", "أعلن السببية فورًا", "اختر دائرة بعشرين شريحة"],
        ["The mean is always enough", "Look at the median too", "Announce cause immediately", "Pick a twenty-slice pie"],
        1,
      ),
      tf("6-t5", "الإحصاء الوصفي يلخّص العينة: متوسط ووسيط وانتشار.", "Descriptive stats summarise the sample: mean, median, spread.", true),
      tf("6-t6", "البواقي الصغيرة تعني أن الخط غالبًا يصف البيانات أفضل من البواقي الكبيرة.", "Small residuals usually mean the line describes the data better than large residuals do.", true),
    ],
    essays: [
      essay(
        "6-e1",
        "مدرسة تقول: «من يستخدم التطبيق أكثر يحصل على درجات أعلى، إذن التطبيق يرفع الدرجة». فنّد الادعاء، واقترح تصميمًا أبسط يفصل الارتباط عن السببية.",
        "A school says: «Heavier app users get higher marks, so the app raises marks.» Challenge the claim and suggest a simpler design that separates correlation from cause.",
        "المصطلح: ارتباط وليس سببية.\nالسبب: الاستخدام العالي والدرجة العالية ممكن ييجوا من الالتزام السابق، مش إن التطبيق هو السبب.\nالمثال: قارن شعبة تستخدم التطبيق بشعبة مشابهة من غير التطبيق، أو قيس قبل وبعد.",
        "Term: correlation is not causation.\nReason: heavy use and high marks may both come from earlier effort, not from the app causing the mark.\nExample: compare a class that uses the app with a similar class that does not, or measure before and after.",
      ),
      essay(
        "6-e2",
        "اختر رسمًا لعرض نسبة نجاح ثلاث مواد عبر أربعة امتحانات. برّر الاختيار، واذكر خطأين بصريين يجب تجنبهما.",
        "Choose a chart for pass rates of three subjects across four exams. Justify the choice and name two visual mistakes to avoid.",
        "المصطلح: اختيار الرسم.\nالسبب: نسب النجاح عبر أربعة امتحانات تتتابع مع الزمن، فالخط أو الأعمدة المجمّعة أوضح من الدائرة.\nالمثال: ابدأ المحور من صفر، واكتب المصدر، ومتعملش دائرة ثلاثية الأبعاد.",
        "Term: chart choice.\nReason: pass rates across four exams are a time series, so a line or grouped bars beat a pie.\nExample: start the axis at zero, name the source, and avoid a 3D pie.",
      ),
    ],
  },
  {
    chapterId: "7",
    objectives: [
      mcq(
        "7-m1",
        "ماذا يحتاج التعلم بإشراف؟",
        "What does supervised learning typically need?",
        [
          "أمثلة بلا أي تسميات",
          "أمثلة معلّمة: مدخل ومخرج معروف",
          "مروحة أسرع للمعالج",
          "إغلاق قاعدة البيانات",
        ],
        [
          "Examples with no labels at all",
          "Labeled examples: known input and output",
          "A faster cooling fan",
          "Turning the database off",
        ],
        1,
      ),
      mcq(
        "7-m2",
        "لماذا نفصل مجموعة اختبار عن التدريب؟",
        "Why keep a test set apart from training?",
        [
          "لنجعل الدرجة تبدو أعلى دائمًا",
          "لنقيس الأداء على بيانات لم يرها النموذج",
          "لأن القانون يمنع التدريب",
          "لأن الصور لا تُخزَّن",
        ],
        [
          "To make the score look higher every time",
          "To measure performance on data the model has not seen",
          "Because the law forbids training",
          "Because images cannot be stored",
        ],
        1,
      ),
      mcq(
        "7-m3",
        "كيف تتعلم الشبكة العصبية أساسًا؟",
        "How does a neural network mainly learn?",
        [
          "تغيير دقة الشاشة",
          "تعديل أوزان الروابط من البيانات",
          "حذف نظام التشغيل",
          "إعادة تسمية الملف فقط",
        ],
        [
          "Changing screen resolution",
          "Adjusting connection weights from data",
          "Deleting the operating system",
          "Only renaming the file",
        ],
        1,
      ),
      mcq(
        "7-m4",
        "ماذا يفعل نموذج اللغة الكبير في جوهره؟",
        "At its core, what does a large language model do?",
        [
          "يتنبأ بأرجح الكلمة/الرمز التالي",
          "يفهم كالإنسان تمامًا",
          "يضمن صحة كل جملة",
          "يستغني عن أي بيانات تدريب",
        ],
        [
          "Predicts the next most likely token",
          "Understands exactly as a human does",
          "Guarantees every sentence is true",
          "Needs no training data",
        ],
        0,
      ),
      tf("7-t1", "التصنيف يتنبأ بفئة، والانحدار يتنبأ برقم.", "Classification predicts a class; regression predicts a number.", true),
      tf("7-t2", "اختبار النموذج على بيانات التدريب يعطي تقديرًا صادقًا دائمًا.", "Testing a model on its training data always gives an honest estimate.", false),
      tf("7-t3", "التعلم العميق يحتاج عادة بيانات أكبر من مسألة خطية صغيرة.", "Deep learning usually needs more data than a small linear problem.", true),
      tf("7-t4", "هلوسة النموذج تعني جملة فصيحة قد تكون بلا سند.", "A hallucination is fluent text that may have no grounding.", true),
      mcq(
        "7-m5",
        "التنبؤ بعدد ساعات المذاكرة (رقم) أقرب إلى أي نوع؟",
        "Predicting study hours (a number) is closer to which type?",
        ["تصنيف", "انحدار", "جدار حماية", "ضغط ملفات"],
        ["Classification", "Regression", "A firewall", "Compression"],
        1,
      ),
      mcq(
        "7-m6",
        "ما الاستخدام السليم لنموذج اللغة في الواجب؟",
        "What is a sound use of a language model for homework?",
        [
          "لصق الإجابة النهائية من غير فهم",
          "شرح الفكرة ثم الكتابة من فهمك أنت",
          "إرسال صورة البطاقة",
          "نشر درجات الزملاء",
        ],
        [
          "Paste the final answer with no understanding",
          "Explain the idea, then write from your understanding",
          "Send an ID photo",
          "Publish classmates' marks",
        ],
        1,
      ),
      tf("7-t5", "التعلم بلا إشراف يبحث عن تجمعات بلا تسمية جاهزة.", "Unsupervised learning looks for clusters without ready labels.", true),
      tf("7-t6", "الصندوق الأسود مشكلة عندما يمس القرار حياة إنسان.", "A black box is a problem when the decision touches a human life.", true),
    ],
    essays: [
      essay(
        "7-e1",
        "مزارع يريد نموذجًا يفرّق صورة نبات سليم من مريض. أي نوع تعلم تختار؟ ماذا يحتاج النموذج أن يتعلم منه؟ اذكر سببًا واحدًا قد يخطئ الحكم.",
        "A farmer wants a model that tells healthy plants from diseased ones in photos. Which learning type do you choose? What must it learn from? Give one reason its judgement might be wrong.",
        "المصطلح: التعلم بإشراف.\nالسبب: المهمة فئتان معلّمتان: سليم ومريض. النموذج يتعلم من صور وعليها النتيجة.\nالمثال: لو كل الصور في شمس الظهر، الحكم يغلط بالليل أو في بيت مختلف.",
        "Term: supervised learning.\nReason: the task has two labeled classes: healthy and diseased. The model learns from photos that already carry the result.\nExample: if every photo is midday sun, the judgement fails at night or in another greenhouse.",
      ),
      essay(
        "7-e2",
        "هل تسمح لمدرستك باستخدام نموذج توليدي في الواجب؟ اكتب قاعدة واحدة وسببين، وتناول الهلوسة والمسؤولية الأكاديمية.",
        "Should your school allow a generative model for homework? State one rule and two reasons, addressing hallucination and academic honesty.",
        "المصطلح: الهلوسة والمسؤولية.\nالسبب: النموذج قد يكتب كلاماً فصيحاً وهو غلط. القاعدة: افهم منه ثم اكتب بنفسك وراجع المصدر.\nالمثال: واجب المدرسه يتسلم بصوت الطالب، مش بلصق فقرة الشات.",
        "Term: hallucination and responsibility.\nReason: the model can write fluent text that is still false. The rule is: understand with it, then write yourself and check the source.\nExample: school homework is handed in in the student's voice, not as a pasted chat paragraph.",
      ),
    ],
  },
];

const EXAM_WHY: Record<string, { ar: string; en: string }> = {
  "1-m1": {
    ar: "الترتيب الذي ندرسه: الحاسوب، ثم الإنترنت، ثم الهواتف، ثم السحابة.",
    en: "The order we study is computer, then the Internet, then phones, then the cloud.",
  },
  "1-m2": {
    ar: "الذكاء الاصطناعي هو الأوسع. داخله التعلم الآلي، وداخله التعلم العميق، وداخله الذكاء التوليدي.",
    en: "AI is the widest field. Machine learning sits inside it, deep learning inside that, and generative AI inside deep learning.",
  },
  "1-m3": {
    ar: "قرار القيادة لا ينتظر رحلة إلى السحابة. الحوسبة الطرفية تعالج البيانات على المركبة فورًا.",
    en: "A driving decision cannot wait for a round trip to the cloud. Edge computing decides on the vehicle at once.",
  },
  "1-m4": {
    ar: "الذكاء التوليدي ينشئ محتوى جديدًا. فلتر البريد والتوصية تعلم آلي، والمتوسط حساب عادي.",
    en: "Generative AI creates new content. A spam filter and a recommender are machine learning; a mean is ordinary arithmetic.",
  },
  "1-m5": {
    ar: "الذكاء الضيق يتقن مهمة واحدة. معظم أنظمة اليوم من هذا النوع، وليست ذكاءً عامًا.",
    en: "Narrow AI is expert at one task. Most systems today are this kind, not general intelligence.",
  },
  "1-m6": {
    ar: "الهلوسة نص فصيح يبدو صحيحًا وهو خطأ. ليست سخونة الجهاز ولا قصر الرد.",
    en: "A hallucination is fluent text that sounds right and is still wrong. It is not heat or a short reply.",
  },
  "1-t1": {
    ar: "قانون مور ملاحظة من 1965: عدد الترانزستورات يتضاعف تقريبًا كل سنتين، وهو ليس قانونًا فيزيائيًا ثابتًا.",
    en: "Moore's Law is a 1965 observation: transistor count roughly doubles about every two years. It is not a fixed physical law.",
  },
  "1-t2": {
    ar: "التجارة الإلكترونية شراء وبيع عبر الشبكة، لا الدفع النقدي في محل فقط.",
    en: "E-commerce is buying and selling over the network, not cash in a shop only.",
  },
  "1-t3": {
    ar: "الواقع المعزز يضيف طبقة على العالم الحقيقي. الذي يستبدله بعالم محاكى هو الواقع الافتراضي.",
    en: "Augmented reality adds a layer on the real world. Virtual reality is what replaces it with a simulation.",
  },
  "1-t4": {
    ar: "بيانات الزميل ليست لك. إرسالها إلى نموذج عام خرق للخصوصية.",
    en: "A classmate's data is not yours. Sending it to a public model breaks privacy.",
  },
  "1-t5": {
    ar: "التحيز يتكرر لأن بيانات التدريب ناقصة أو غير عادلة، فيتعلم النموذج الخطأ نفسه.",
    en: "Bias repeats because the training data is incomplete or unfair, so the model learns the same error.",
  },
  "1-t6": {
    ar: "المساءلة تُبقي إنسانًا مسؤولًا عن أثر القرار. الحاسوب لا يتحمل المسؤولية وحده.",
    en: "Accountability keeps a human responsible for the effect of a decision. The computer does not carry it alone.",
  },
  "2-m1": {
    ar: "غير المتماثل زوج: مفتاح عام ومفتاح خاص. المفتاح الواحد هو التشفير المتماثل.",
    en: "Asymmetric encryption uses a pair: a public key and a private key. One shared key is symmetric encryption.",
  },
  "2-m2": {
    ar: "متعددة العوامل تجمع فئات مختلفة: شيء تعرفه، أو تملكه، أو أنت عليه. ثلاث كلمات مرور كلها معرفة، فليست عوامل متعددة.",
    en: "Multi-factor authentication mixes different categories: something you know, have, or are. Three passwords are all knowledge, so they are not multiple factors.",
  },
  "2-m3": {
    ar: "أقل صلاحية تعني أن كل مستخدم يأخذ فقط ما يحتاجه عمله، لا صلاحية المدير للجميع.",
    en: "Least privilege means each user gets only what the job needs, not admin rights for everyone.",
  },
  "2-m4": {
    ar: "بعد الاكتشاف: احتوِ الضرر، ثم احفظ الأدلة، ثم أزل السبب وتعافَ. المسح الفوري يضيع الدليل.",
    en: "After detection: contain the damage, preserve evidence, then eradicate and recover. Wiping at once destroys the evidence.",
  },
  "2-m5": {
    ar: "كلمة المرور شيء تعرفه، وتطبيق الهاتف شيء تملكه. فئتان مختلفتان، فهذه مصادقة متعددة العوامل.",
    en: "A password is something you know, and a phone app is something you have. Two different categories make this multi-factor authentication.",
  },
  "2-m6": {
    ar: "مسح القرص قبل التسجيل يمحو الدليل. العزل والتصوير والإبلاغ تحفظ الحادث.",
    en: "Wiping the disk before a record erases the evidence. Isolation, imaging, and reporting preserve the incident.",
  },
  "2-t1": {
    ar: "التجزئة اتجاه واحد. نقارن البصمة ولا نسترجع كلمة المرور منها.",
    en: "A hash is one-way. We compare the fingerprint and do not recover the password from it.",
  },
  "2-t2": {
    ar: "الشبكة الخاصة الافتراضية نفق مشفّر يعبر شبكة عامة مثل الإنترنت.",
    en: "A VPN is an encrypted tunnel across a public network such as the Internet.",
  },
  "2-t3": {
    ar: "تقسيم الشبكة يعزل الأجزاء، فإذا اخترق المهاجم جزءًا لم ينتشر بسهولة إلى الباقي.",
    en: "Segmentation isolates parts, so a breach in one part does not spread easily to the rest.",
  },
  "2-t4": {
    ar: "إدارة المخاطر تحدد الخطر وتقدّره ثم تقبله أو تخففه أو تنقله. التجاهل ليس إدارة.",
    en: "Risk management identifies and estimates a risk, then accepts, reduces, or transfers it. Ignoring it is not management.",
  },
  "2-t5": {
    ar: "أقل صلاحية: أقل ما يكفي للعمل، لا أكثر.",
    en: "Least privilege is the least access the job needs, not more.",
  },
  "2-t6": {
    ar: "الشهادة تربط المفتاح العام بهوية موثوقة، حتى لا نسلم السر لموقع منتحل.",
    en: "A certificate binds a public key to a trusted identity, so we do not hand a secret to a fake site.",
  },
  "3-m1": {
    ar: "الواجهة الأمامية ما يراه المستخدم في المتصفح. حفظ كلمات المرور عمل الخادم وقاعدة البيانات.",
    en: "The frontend is what the user sees in the browser. Storing passwords is the server and the database.",
  },
  "3-m2": {
    ar: "GET تطلب موردًا للقراءة. POST ترسل بيانات جديدة، وPUT تستبدل، وDELETE تحذف.",
    en: "GET asks for a resource to read. POST sends new data, PUT replaces, and DELETE removes.",
  },
  "3-m3": {
    ar: "HTTPS هو HTTP نفسه فوق قناة TLS مشفّرة. السرعة وحدها ليست أمانًا.",
    en: "HTTPS is HTTP over an encrypted TLS channel. Speed by itself is not security.",
  },
  "3-m4": {
    ar: "كود الواجهة يصل إلى زائر المتصفح. أي مفتاح داخل JavaScript يصبح مكشوفًا.",
    en: "Frontend code reaches the visitor's browser. A key inside JavaScript is exposed.",
  },
  "3-m5": {
    ar: "500 يعني أن الخادم فشل. 404 تعني أن المورد غير موجود، و200 تعني نجاحًا.",
    en: "500 means the server failed. 404 means the resource is missing, and 200 means success.",
  },
  "3-m6": {
    ar: "HTML يبني المعنى والهيكل، وCSS المظهر، وJavaScript السلوك بعد التحميل.",
    en: "HTML builds meaning and structure, CSS the look, and JavaScript the behaviour after load.",
  },
  "3-t1": {
    ar: "قاعدة البيانات طبقة التخزين الدائم، لا طبقة العرض.",
    en: "The database is the persistent storage layer, not the presentation layer.",
  },
  "3-t2": {
    ar: "404 تعني أن المورد غير موجود على هذا العنوان، لا أنه وُجد بنجاح.",
    en: "404 means the resource is not at that address, not that it was found.",
  },
  "3-t3": {
    ar: "HTML للمعنى والهيكل، وCSS للمظهر. لا نعكس الدورين.",
    en: "HTML is meaning and structure; CSS is appearance. Do not swap the two jobs.",
  },
  "3-t4": {
    ar: "إتاحة الوصول تعني أن الصفحة تعمل بلوحة المفاتيح وقارئ الشاشة، لا أن نتجاهلهما.",
    en: "Accessibility means the page works with a keyboard and a screen reader, not that we ignore them.",
  },
  "3-t5": {
    ar: "HTTPS = HTTP + تشفير TLS. من غير القفل لا تكتب كلمة المرور.",
    en: "HTTPS is HTTP plus TLS encryption. Without the lock, do not type a password.",
  },
  "3-t6": {
    ar: "ملف الارتباط يحمل معرّف الجلسة، فيبقى تسجيل الدخول بعد الطلب التالي.",
    en: "A cookie can carry the session id, so the login survives the next request.",
  },
  "4-m1": {
    ar: "التغيّر عبر الشهور خط زمني. الأيقونة والصوت والخلفية لا تعرض الأرقام.",
    en: "Change over months is a line. An icon, audio, or a moving background does not show the numbers.",
  },
  "4-m2": {
    ar: "تجربة المستخدم هي إتمام المهمة بوضوح. لون الشعار وحده واجهة، لا رحلة.",
    en: "User experience is finishing a clear task. Logo colour alone is interface, not the journey.",
  },
  "4-m3": {
    ar: "اختبار أ/ب يقارن نسختين بمقياس محدد، لا بالذوق ولا بتغيير كل شيء معًا.",
    en: "An A/B test compares two versions on a set measure, not by taste and not by changing everything at once.",
  },
  "4-m4": {
    ar: "التحسين يبدأ بنموذج رخيص يُختبر، ثم نتعلم ونغيّر. النشر بلا اختبار لا يخبرنا ما الذي فشل.",
    en: "Improvement starts with a cheap prototype that is tested, then we learn and change. A launch with no test does not show what failed.",
  },
  "4-m5": {
    ar: "في موقع الحضور نقيس زمن المهمة أو عدد الأخطاء، لا أي زر أجمل.",
    en: "On an attendance site we measure task time or errors, not which button looks prettier.",
  },
  "4-m6": {
    ar: "تغيير عنصر واحد يجعل السبب واضحًا. تغيير عشرين عنصرًا معًا يخلط الأثر.",
    en: "Changing one element makes the cause clear. Changing twenty at once mixes the effects.",
  },
  "4-t1": {
    ar: "النص البديل يصف الصورة لمن يستخدم قارئ الشاشة أو لا يراها.",
    en: "Alt text describes the image for someone using a screen reader or who cannot see it.",
  },
  "4-t2": {
    ar: "الصورة الضخمة تبطئ التحميل على شبكة ضعيفة. الحجم جزء من التصميم.",
    en: "A huge image slows loading on a weak network. Size is part of the design.",
  },
  "4-t3": {
    ar: "مكان القائمة الثابت يقلل الضياع. المفاجأة في كل صفحة تبطئ المهمة.",
    en: "A stable menu place reduces getting lost. A surprise layout on every page slows the task.",
  },
  "4-t4": {
    ar: "قطع المحور يضخّم فرقًا صغيرًا ويضلّل القارئ. الرسم الصادق لا يفعل ذلك.",
    en: "Cropping the axis inflates a tiny gap and misleads the reader. An honest chart does not do that.",
  },
  "4-t5": {
    ar: "النموذج الأولي نسخة سريعة رخيصة للاختبار قبل البناء الكامل.",
    en: "A prototype is a fast, cheap version used to test before the full build.",
  },
  "4-t6": {
    ar: "العكس هو الصحيح: تجربة المستخدم هي الرحلة كلها، وواجهة المستخدم هي العناصر الظاهرة.",
    en: "The reverse is true: user experience is the whole journey, and the user interface is the visible controls.",
  },
  "5-m1": {
    ar: "الأولية تجمعها أنت لغرضك. الجدول الجاهز الذي حمّلته بيانات ثانوية.",
    en: "Primary data is what you gather for your purpose. A table you downloaded is secondary data.",
  },
  "5-m2": {
    ar: "الطبقية تقسّم المجتمع إلى شرائح ثم تسحب عشوائيًا من كل شريحة، فلا تُسقط مجموعة.",
    en: "Stratified sampling splits the population into groups, then draws at random from each, so no group is dropped.",
  },
  "5-m3": {
    ar: "إذا تأكدت أن الشذوذ خطأ إدخال، صحّحه أو احذفه. لا تضاعفه ولا تصفّر العمود.",
    en: "Once you confirm the outlier is an input error, correct or delete it. Do not double it or zero the column.",
  },
  "5-m4": {
    ar: "التطبيع إلى 0–1 يضع متغيرات بوحدات مختلفة على مقياس واحد يمكن مقارنته.",
    en: "Normalising to 0–1 puts variables with different units on one scale that can be compared.",
  },
  "5-m5": {
    ar: "من يردّ فقط هو المهتم. هذا تحيز اختيار ذاتي، والعينة ليست عشوائية كاملة.",
    en: "Only the keen reply. That is self-selection bias, and the sample is not a complete random one.",
  },
  "5-m6": {
    ar: "البيانات المفتوحة تحتاج ترخيصًا وتاريخ تحديث. المصدر المفتوح ليس بريئًا تلقائيًا.",
    en: "Open data still needs a licence and an update date. Open does not mean innocent.",
  },
  "5-t1": {
    ar: "العينة المتحيزة تعطي رقمًا واثقًا لا يمثّل المجتمع.",
    en: "A biased sample gives a confident number that does not represent the population.",
  },
  "5-t2": {
    ar: "الثانوية أسرع لأنها جاهزة، لكنها قد لا تطابق سؤالك.",
    en: "Secondary data is faster because it already exists, but it may not match your question.",
  },
  "5-t3": {
    ar: "الفراغ قد يكون رفض إجابة. الحذف الدائم يضيع صفوفًا لها معنى.",
    en: "A blank may be a refused answer. Always deleting it throws away rows that still mean something.",
  },
  "5-t4": {
    ar: "واجهة البرمجة عقد لجلب بيانات محدّثة، بدل ملف قديم محمول.",
    en: "An API is a contract for fetching fresh data, instead of an old downloaded file.",
  },
  "5-t5": {
    ar: "أنت تجمع الأولية الآن لغرض محدد.",
    en: "You gather primary data now for a specific purpose.",
  },
  "5-t6": {
    ar: "بعد التقسيم، السحب يكون من كل شريحة لا من شريحة واحدة.",
    en: "After the split, the draw comes from every stratum, not from one group only.",
  },
  "6-m1": {
    ar: "الاستدلال يعمّم بحذر من العينة إلى المجتمع، ويُظهر عدم اليقين. ليس نسخ الرقم ولا حذف الشواذ تلقائيًا.",
    en: "Inference generalises carefully from sample to population and shows uncertainty. It is not copying the number or deleting outliers automatically.",
  },
  "6-m2": {
    ar: "الوسيط يقاوم القيمة الشاذة الكبيرة. المتوسط ينجذب إليها.",
    en: "The median resists a large outlier. The mean is pulled toward it.",
  },
  "6-m3": {
    ar: "الانحدار الخطي يصف اتجاهًا تقريبيًا بين متغيرين كميين. سحابة بلا اتجاه لا يناسبها خط.",
    en: "Linear regression describes an approximate trend between two quantitative variables. A shapeless cloud does not fit a line.",
  },
  "6-m4": {
    ar: "مقارنة ثلاث شعب أعمدة. الدائرة الكثيرة الشرائح والخريطة بلا أرقام لا تقارن الفئات.",
    en: "Comparing three classes is bars. A pie with many slices, or a map with no numbers, does not compare the categories.",
  },
  "6-m5": {
    ar: "التنبؤ خارج مدى البيانات استكمال خارجي. التطبيع والعينة الطبقية وجدار الحماية مواضيع أخرى.",
    en: "Predicting outside the data range is extrapolation. Normalising, stratified sampling, and a firewall are other topics.",
  },
  "6-m6": {
    ar: "انظر الوسيط مع المتوسط. الشذوذ لا يثبت سببية، ولا يُعالج باختيار رسم خاطئ.",
    en: "Look at the median as well as the mean. An outlier does not prove cause, and a wrong chart does not fix it.",
  },
  "6-t1": {
    ar: "الارتباط علاقة رقمية. لا يثبت وحده أن أحد المتغيرين سبب للآخر.",
    en: "Correlation is a numerical link. By itself it does not prove that one variable causes the other.",
  },
  "6-t2": {
    ar: "العينة الصغيرة تجعل فترة الثقة أوسع، فلا نعلن نتيجة قاطعة.",
    en: "A small sample makes the confidence interval wider, so we do not announce a final result.",
  },
  "6-t3": {
    ar: "البواقي الكبيرة تعني أن النقاط بعيدة عن الخط، فالوصف ضعيف لا ممتاز.",
    en: "Large residuals mean the points sit far from the line, so the fit is weak, not excellent.",
  },
  "6-t4": {
    ar: "العنوان يقول الادعاء، والمحاور تُسمّى، والمصدر يُكتب تحت الرسم.",
    en: "The title states the claim, the axes are labelled, and the source is written under the chart.",
  },
  "6-t5": {
    ar: "الوصفي يلخّص العينة التي بين يديك: متوسط ووسيط وانتشار. التعميم استدلال.",
    en: "Descriptive stats summarise the sample you have: mean, median, and spread. Generalising is inference.",
  },
  "6-t6": {
    ar: "البواقي الصغيرة تعني أن الخط أقرب إلى النقاط من خط بواقيه كبيرة.",
    en: "Small residuals mean the line sits closer to the points than a line with large residuals.",
  },
  "7-m1": {
    ar: "التعلم بإشراف يحتاج أمثلة معلّمة: مدخل معروف ومخرج معروف.",
    en: "Supervised learning needs labeled examples: a known input and a known output.",
  },
  "7-m2": {
    ar: "مجموعة الاختبار لم يرها النموذج، فالقياس صادق. الاختبار على التدريب يضخّم الدرجة.",
    en: "The test set is data the model has not seen, so the measure is honest. Testing on the training set inflates the score.",
  },
  "7-m3": {
    ar: "الشبكة تتعلم بتعديل أوزان الروابط من البيانات، لا بتغيير اسم الملف.",
    en: "A network learns by adjusting connection weights from data, not by renaming a file.",
  },
  "7-m4": {
    ar: "نموذج اللغة يتنبأ بالرمز التالي الأرجح. لا يفهم كإنسان ولا يضمن صحة الجملة.",
    en: "A language model predicts the next most likely token. It does not understand as a person does, and it does not guarantee the sentence is true.",
  },
  "7-m5": {
    ar: "التنبؤ برقم انحدار. التنبؤ بفئة تصنيف.",
    en: "Predicting a number is regression. Predicting a class is classification.",
  },
  "7-m6": {
    ar: "استخدم النموذج لفهم الفكرة، ثم اكتب أنت وراجع المصدر. اللصق ونشر الدرجات وصور البطاقات ممنوعة.",
    en: "Use the model to understand the idea, then write yourself and check the source. Pasting, publishing marks, and sending ID photos are not allowed.",
  },
  "7-t1": {
    ar: "التصنيف فئة مثل ناجح أو راسب. الانحدار رقم مثل درجة متوقعة.",
    en: "Classification is a class such as pass or fail. Regression is a number such as a predicted mark.",
  },
  "7-t2": {
    ar: "الاختبار على بيانات التدريب يعيد ما حفظه النموذج، فيكون التقدير متفائلًا كاذبًا.",
    en: "Testing on the training data repeats what the model memorised, so the estimate is falsely optimistic.",
  },
  "7-t3": {
    ar: "التعلم العميق يحتاج عادة بيانات وحسابًا أكثر من خط بسيط لمسألة صغيرة.",
    en: "Deep learning usually needs more data and compute than a simple line on a small problem.",
  },
  "7-t4": {
    ar: "الهلوسة جملة فصيحة بلا سند. سلاسة اللغة ليست دليل صدق.",
    en: "A hallucination is fluent text with no grounding. Smooth language is not proof of truth.",
  },
  "7-t5": {
    ar: "بلا إشراف نبحث عن تجمعات من غير تسمية جاهزة لكل مثال.",
    en: "Unsupervised learning looks for clusters without a ready label on every example.",
  },
  "7-t6": {
    ar: "إذا مسّ القرار حياة إنسان أو درجته، فالصندوق الذي لا يُشرح مشكلة مساءلة.",
    en: "When a decision touches a human life or a mark, a model that cannot be explained is an accountability problem.",
  },
};

for (const exam of CHAPTER_EXAMS) {
  for (const question of exam.objectives) {
    const why = EXAM_WHY[question.id];
    if (!why) continue;
    question.whyAr = why.ar;
    question.whyEn = why.en;
  }
}

export function examPaperSeed(chapterId: string, opensAt?: string | null): number {
  const text = `${chapterId}:${opensAt ?? "open"}`;
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0 || 1;
}

function uniqueById<T extends { id: string }>(rows: T[]): T[] {
  const seen = new Set<string>();
  const next: T[] = [];
  for (const row of rows) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    next.push(row);
  }
  return next;
}

function asObjective(question: HomeworkQuestion): ObjectiveQuestion {
  const correctIndex = Math.min(3, Math.max(0, question.correctIndex)) as 0 | 1 | 2 | 3;
  return {
    id: question.id,
    kind: question.kind,
    promptAr: question.promptAr,
    promptEn: question.promptEn,
    optionsAr: question.optionsAr,
    optionsEn: question.optionsEn,
    correctIndex,
    points: 1,
  };
}

function asEssay(row: {
  id: string;
  promptAr: string;
  promptEn: string;
  guideAr: string;
  guideEn: string;
}): EssayQuestion {
  return {
    id: row.id,
    promptAr: row.promptAr,
    promptEn: row.promptEn,
    guideAr: row.guideAr,
    guideEn: row.guideEn,
    points: 8,
  };
}

function chapterObjectivePool(chapterId: ChapterId): ObjectiveQuestion[] {
  const official = CHAPTER_EXAMS.find((exam) => exam.chapterId === chapterId)?.objectives ?? [];
  return uniqueById([
    ...official.map((question) => ({ ...question, points: 1 })),
    ...questionsForChapter(chapterId).map(asObjective),
  ]);
}

function chapterEssayPool(chapterId: ChapterId): EssayQuestion[] {
  const official = CHAPTER_EXAMS.find((exam) => exam.chapterId === chapterId)?.essays ?? [];
  return uniqueById([...official, ...syllabusAnalysisForChapter(chapterId).map(asEssay)]);
}

function pickObjectives(pool: ObjectiveQuestion[], seed: number): ObjectiveQuestion[] {
  const mcq = shuffled(
    pool.filter((question) => question.kind === "mcq"),
    seed,
  );
  const tf = shuffled(
    pool.filter((question) => question.kind === "tf"),
    seed + 17,
  );
  const picked = [...mcq.slice(0, EXAM_OBJECTIVE_COUNT)];
  if (picked.length < EXAM_OBJECTIVE_COUNT) {
    picked.push(...tf.slice(0, EXAM_OBJECTIVE_COUNT - picked.length));
  }
  return shuffled(picked, seed + 3).slice(0, EXAM_OBJECTIVE_COUNT);
}

function pickEssays(pool: EssayQuestion[], seed: number): EssayQuestion[] {
  return shuffled(pool, seed + 91).slice(0, EXAM_ESSAY_COUNT);
}

export function mixedMinistryExam(seed = examPaperSeed("mix")): ChapterExam {
  return (
    examForChapter("mix", seed) ?? {
      chapterId: "mix",
      objectives: [],
      essays: [],
    }
  );
}

export function examForChapter(id: string, seed = examPaperSeed(id)): ChapterExam | undefined {
  if (id === "faiz") {
    const paper = faizExam(seed);
    if (paper.objectives.length < EXAM_OBJECTIVE_COUNT || paper.essays.length < EXAM_ESSAY_COUNT) {
      return undefined;
    }
    return paper;
  }
  if (id === "mix") {
    const objectives = pickObjectives(
      uniqueById(CHAPTERS.flatMap((chapter) => chapterObjectivePool(chapter.id))),
      seed,
    );
    const essays = pickEssays(
      uniqueById([
        ...CHAPTER_EXAMS.flatMap((exam) => exam.essays),
        ...CHAPTERS.flatMap((chapter) => syllabusAnalysisForChapter(chapter.id).map(asEssay)),
      ]),
      seed,
    );
    if (objectives.length < EXAM_OBJECTIVE_COUNT || essays.length < EXAM_ESSAY_COUNT) return undefined;
    return { chapterId: "mix", objectives, essays };
  }
  if (!isChapterId(id)) return undefined;
  const objectives = pickObjectives(chapterObjectivePool(id), seed);
  const essays = pickEssays(chapterEssayPool(id), seed);
  if (objectives.length < EXAM_OBJECTIVE_COUNT || essays.length < EXAM_ESSAY_COUNT) return undefined;
  return { chapterId: id, objectives, essays };
}

export function objectiveTotal(exam: ChapterExam): number {
  return exam.objectives.reduce((sum, question) => sum + question.points, 0);
}

export function essayTotal(exam: ChapterExam): number {
  return exam.essays.reduce((sum, question) => sum + question.points, 0);
}
