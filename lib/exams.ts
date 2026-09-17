import { CHAPTERS, isChapterId, type ChapterId } from "@/lib/curriculum";
import { faizExam } from "@/lib/faiz-exam";
import { questionsForChapter, type HomeworkQuestion } from "@/lib/homework-bank";
import { analysisForChapter } from "@/lib/question-bank";
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
        "ما العلاقة الصحيحة بين التقنيات؟",
        "What is the correct relationship between the fields?",
        [
          "تعلم عميق ⊃ تعلم آلي ⊃ ذكاء اصطناعي",
          "ذكاء اصطناعي ⊃ تعلم آلي ⊃ تعلم عميق ⊃ ذكاء توليدي",
          "ذكاء توليدي ⊃ ذكاء اصطناعي ⊃ تعلم آلي",
          "تعلم آلي وذكاء اصطناعي معناهما واحد",
        ],
        [
          "Deep learning ⊃ machine learning ⊃ AI",
          "AI ⊃ machine learning ⊃ deep learning ⊃ generative AI",
          "Generative AI ⊃ AI ⊃ machine learning",
          "Machine learning and AI mean the same",
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
        "ماذا يعني الذكاء الضيق؟",
        "What does narrow AI mean?",
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
        "ما أفضل سلوك في الحصة عند استخدام نموذج توليدي؟",
        "What is the best class habit when using a generative model?",
        [
          "لصق الرد في التقرير من غير مراجعة",
          "فهم الفكرة ثم كتابة إجابتك أنت",
          "إرسال عنوان البيت للنموذج",
          "اعتبار اللغة السلسة دليل صدق",
        ],
        [
          "Paste the reply into the report unreviewed",
          "Understand the idea, then write your own answer",
          "Send your home address to the model",
          "Treat fluent language as proof of truth",
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
        "ثلاث أفكار واضحة + مثال واحد من الحياة اليومية.",
        "Three clear ideas plus one everyday example.",
      ),
      essay(
        "1-e2",
        "اشرح العلاقة المتداخلة بين الذكاء الاصطناعي والتعلم الآلي والتعلم العميق والذكاء التوليدي، وأعطِ مثالًا لكل مستوى. ثم بيّن خطر استخدام مخرجات توليدية في تقرير مدرسي كما هي.",
        "Explain the nested relationship between AI, machine learning, deep learning, and generative AI, with one example each. Then state the risk of using generative output as a school report as-is.",
        "تعريف موجز لكل مستوى + مثال + الهلوسة والمراجعة.",
        "A short definition of each level + an example + hallucination and review.",
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
        "ما أولوية الاستجابة بعد اكتشاف اختراق؟",
        "After detecting a breach, what is the first priority?",
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
      tf("2-t1", "التجزئة (Hash) عملية يمكن عكسها بسهولة لاسترجاع كلمة المرور.", "A hash is easily reversed to recover the password.", false),
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
        "بعد اكتشاف اختراق في المعمل، ما القرار الصحيح أولًا؟",
        "After a lab breach, what is the first sound decision?",
        [
          "مسح الأقراص قبل أي تسجيل",
          "احتواء الضرر ثم حفظ الأدلة",
          "نشر كلمات المرور في الجروب",
          "تجاهل الحادث لأنه نادر",
        ],
        [
          "Wipe the disks before any record",
          "Contain the damage then preserve evidence",
          "Post passwords in the group chat",
          "Ignore the incident because it is rare",
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
        "جدول ذهني: عدد المفاتيح / السرعة / توزيع المفتاح / مثال.",
        "A mental table: key count / speed / key distribution / example.",
      ),
      essay(
        "2-e2",
        "مدرسة اكتشفت برمجية خبيثة على جهاز معامل. اكتب خطة استجابة من خمس خطوات، واذكر قرارًا واحدًا لا يجب اتخاذه في أول عشر دقائق.",
        "A school finds malware on a lab PC. Write a five-step response plan and one action that must not be taken in the first ten minutes.",
        "اكتشاف، احتواء، إزالة، تعافٍ، مراجعة + لا تمسح الأدلة.",
        "Detect, contain, eradicate, recover, review + do not wipe evidence.",
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
          "تشغيل الموجّه في غرفة السيرفر فقط",
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
        "ما طريقة HTTP المناسبة لقراءة قائمة من غير تغييرها؟",
        "Which HTTP method is best to read a list without changing it?",
        ["POST", "DELETE", "GET", "PUT"],
        ["POST", "DELETE", "GET", "PUT"],
        2,
      ),
      mcq(
        "3-m3",
        "ماذا يعني HTTPS؟",
        "What does HTTPS mean?",
        [
          "HTTP أسرع بلا أمان",
          "HTTP فوق قناة مشفّرة",
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
          "لأن HTML يمنع الأرقام",
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
      tf("3-t3", "HTML يعطي المعنى والهيكل، وCSS يعطي المظهر.", "HTML gives meaning and structure; CSS gives appearance.", true),
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
        "ما ترتيب أدوار HTML ثم CSS ثم جافاسكربت؟",
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
      tf("3-t6", "الكوكيز قد تحفظ حالة تسجيل الدخول بين الطلبات.", "Cookies can keep a login alive across requests.", true),
    ],
    essays: [
      essay(
        "3-e1",
        "ارسم بالكلمات بنية تطبيق ويب من ثلاث طبقات (واجهة، تطبيق، بيانات) وبيّن مسؤولية كل طبقة عند تسجيل دخول طالب.",
        "In words, sketch a three-layer web app (presentation, application, data) and the job of each layer when a student logs in.",
        "طلب من المتصفح → تحقق في الخادم → قراءة المستخدم من القاعدة → رد آمن.",
        "Browser request → server check → read the user from the database → a safe reply.",
      ),
      essay(
        "3-e2",
        "اشرح الفرق بين HTTP وHTTPS، ومتى ترفض إدخال كلمة مرور في صفحة غير مشفّرة. اذكر دور رمز الحالة في تشخيص عطل.",
        "Explain HTTP versus HTTPS, when you refuse to type a password on an unencrypted page, and how a status code helps diagnose a fault.",
        "التشفير، شهادة الموقع، مثال 401 أو 500.",
        "Encryption, the site certificate, and an example such as 401 or 500.",
      ),
    ],
  },
  {
    chapterId: "4",
    objectives: [
      mcq(
        "4-m1",
        "ما أفضل وسيط لعرض تغيّر درجات الصف عبر الشهور؟",
        "What is the best medium to show class scores changing over months?",
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
      tf("4-t6", "UX هي شكل الزر فقط، وUI هي رحلة المستخدم كلها.", "UX is only the button look, and UI is the whole user journey.", false),
    ],
    essays: [
      essay(
        "4-e1",
        "موقع تسجيل حصص يعرض زر «حضور» بلون باهت في أسفل صفحة مزدحمة. انتقد التصميم من زاوية UX واقترح تحسينين قابلين للقياس.",
        "An attendance site hides a faint «Present» button at the bottom of a crowded page. Critique the UX and propose two measurable improvements.",
        "التسلسل البصري، عدد النقرات، زمن المهمة.",
        "Visual hierarchy, click count, task time.",
      ),
      essay(
        "4-e2",
        "صف دورة تحسين تكراري لموقع مدرسي بعد ملاحظة أن الطلاب يغادرون من صفحة الدفع. اذكر ماذا تقيس في كل دورة.",
        "Describe an iterative loop for a school site after students leave the payment page. State what you measure in each cycle.",
        "صمّم → اختبر → قِس → غيّر عنصرًا واحدًا.",
        "Design → test → measure → change one element.",
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
        "من غاب عن العينة؟ كيف يميل المتوسط؟",
        "Who is missing from the sample? How does the mean tilt?",
      ),
      essay(
        "5-e2",
        "جدول حضور فيه خلايا فارغة، درجة 250 من 100، وصفان متطابقان. قرّر لكل مشكلة: حذف أو ملء أو تعليم أو تصحيح، وبرّر.",
        "An attendance table has blanks, a mark of 250/100, and two identical rows. For each problem choose delete, impute, flag, or correct, and justify.",
        "المفقود / الشاذ / التكرار الحقيقي مقابل عمليتين.",
        "Missing / outlier / true duplicate versus two events.",
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
        ["تطبيعًا", "استكمالًا خطرًا", "عينة طبقية", "جدار حماية"],
        ["Normalising", "Risky extrapolation", "Stratified sampling", "A firewall"],
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
        "متغير ثالث، اتجاه السببية، مجموعة مقارنة.",
        "A third variable, causal direction, a comparison group.",
      ),
      essay(
        "6-e2",
        "اختر رسمًا لعرض نسبة نجاح ثلاث مواد عبر أربعة امتحانات. برّر الاختيار، واذكر خطأين بصريين يجب تجنبهما.",
        "Choose a chart for pass rates of three subjects across four exams. Justify the choice and name two visual mistakes to avoid.",
        "خطوط أو أعمدة مجمّعة + لا تقطع المحور ولا تخفِ المصدر.",
        "Lines or grouped bars + do not crop the axis or hide the source.",
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
        "بإشراف + صور معلّمة + بيانات ناقصة أو إضاءة مختلفة.",
        "Supervised + labeled photos + missing data or different lighting.",
      ),
      essay(
        "7-e2",
        "هل تسمح لمدرستك باستخدام نموذج توليدي في الواجب؟ اكتب قاعدة واحدة وسببين، وتناول الهلوسة والمسؤولية الأكاديمية.",
        "Should your school allow a generative model for homework? State one rule and two reasons, addressing hallucination and academic honesty.",
        "مساعد للفهم لا بديل عن الكتابة + مراجعة المصدر.",
        "A helper for understanding, not a substitute for writing + source checks.",
      ),
    ],
  },
];

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
  return uniqueById([...official, ...analysisForChapter(chapterId).map(asEssay)]);
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
        ...CHAPTERS.flatMap((chapter) => analysisForChapter(chapter.id).map(asEssay)),
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
