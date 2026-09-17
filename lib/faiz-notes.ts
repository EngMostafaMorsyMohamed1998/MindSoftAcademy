import { FAIZ_UNITS } from "@/lib/faiz";

export type FaizUnitId = (typeof FAIZ_UNITS)[number]["id"];

export type FaizUnitNote = {
  id: FaizUnitId;
  titleAr: string;
  titleEn: string;
  sections: {
    headingAr: string;
    headingEn: string;
    bodyAr: string[];
    bodyEn: string[];
  }[];
  termsAr: { term: string; meaning: string }[];
  termsEn: { term: string; meaning: string }[];
  takeawayAr: string;
  takeawayEn: string;
};

export const FAIZ_NOTES: FaizUnitNote[] = [
  {
    id: "f1",
    titleAr: "تكنولوجيا المعلومات والمجتمع",
    titleEn: "IT and Society",
    sections: [
      {
        headingAr: "تطور التقنية",
        headingEn: "How IT developed",
        bodyAr: [
          "مرت تقنية المعلومات بمراحل: حاسوب الغرفة، ثم الحاسوب الشخصي، ثم الإنترنت، ثم الهاتف المحمول، ثم السحابة والذكاء الاصطناعي كخدمة.",
          "كل مرحلة غيّرت الشغل والتعلم والتواصل والدفع. ده اسمه تحول اجتماعي، مش مجرد شراء جهاز جديد.",
        ],
        bodyEn: [
          "IT moved in stages: room-sized computers, personal computers, the Internet, mobile phones, then cloud and AI as a service.",
          "Each stage changed work, learning, communication, and payment. That is social transformation, not only buying a new machine.",
        ],
      },
      {
        headingAr: "الذكاء الاصطناعي والتعلم",
        headingEn: "AI and learning",
        bodyAr: [
          "الذكاء الاصطناعي: قدرة الآلة على أداء مهام تحتاج عادة ذكاءً بشريًا.",
          "العلاقة: ذكاء اصطناعي ⊃ تعلم آلي ⊃ تعلم عميق ⊃ ذكاء توليدي.",
          "التعلم الآلي يتعلم نمطًا من أمثلة وبيانات. التعلم العميق طبقات كثيرة من العصبونات. التوليدي ينتج نصًا أو صورة أو صوتًا جديدًا.",
          "بيانات التدريب لو منحازة، النموذج يكرر الانحياز. مجموعة الاختبار لازم تكون بيانات ما شافهاش النموذج وهو بيتدرّب.",
        ],
        bodyEn: [
          "AI is a machine’s ability to do tasks that usually need human intelligence.",
          "Nested fields: AI ⊃ machine learning ⊃ deep learning ⊃ generative AI.",
          "Machine learning learns a pattern from examples. Deep learning uses many neuron layers. Generative AI creates new text, images, or audio.",
          "Biased training data repeats the bias. The test set must be data the model did not see while training.",
        ],
      },
      {
        headingAr: "في الحياة والصناعة والأخلاق",
        headingEn: "Daily life, industry, and ethics",
        bodyAr: [
          "مثال يومي: مقترح فيديوهات حسب مشاهداتك. في الصناعة: فرز العيوب أو توقع العطل قبل ما يحصل.",
          "التحيز في البيانات يظلم فئة من الناس. الخصوصية: متجمعش ومتنشرش بيانات شخصية من غير حاجة وموافقة.",
          "المساعد الذكي ممكن يهلوس: شكل الإجابة صح وهي غلط. راجع من الكتاب قبل ما تسلّم.",
          "الصورة المزيفة (Deepfake) خطرها إنها تبدو حقيقية وقد تخدع الناس.",
        ],
        bodyEn: [
          "Everyday example: video suggestions from what you watched. In industry: spotting defects or predicting a fault.",
          "Bias in data can harm a group. Privacy means not collecting or sharing personal data without need and consent.",
          "An AI helper may hallucinate: the answer looks right and is wrong. Check the book before you submit.",
          "A deepfake looks real and may be used to deceive people.",
        ],
      },
    ],
    termsAr: [
      { term: "التحول الاجتماعي", meaning: "تغير طريقة العمل والتعلم والتواصل بسبب أدوات جديدة." },
      { term: "التعلم الآلي", meaning: "يتعلم نمطًا من بيانات ليتنبأ أو يحكم." },
      { term: "الهلوسة", meaning: "نص شكله صحيح وهو خطأ." },
    ],
    termsEn: [
      { term: "Social transformation", meaning: "Work, learning, and communication change because of new tools." },
      { term: "Machine learning", meaning: "Learns a pattern from data to predict or judge." },
      { term: "Hallucination", meaning: "Text that looks correct and is wrong." },
    ],
    takeawayAr: "التقنية مراحل، والذكاء درجات تخصص. راجع المخرجات واحمِ البيانات.",
    takeawayEn: "IT comes in stages, and AI has depths. Check outputs and protect data.",
  },
  {
    id: "f2",
    titleAr: "الأمن السيبراني",
    titleEn: "Cybersecurity",
    sections: [
      {
        headingAr: "التشفير والمصادقة",
        headingEn: "Encryption and authentication",
        bodyAr: [
          "التشفير يجعل الرسالة غير مفهومة لمن لا يملك المفتاح.",
          "المصادقة تجاوب: هل أنت حقًا من تدّعي؟ كلمة مرور قوية: طويلة ومتنوعة ومش مستخدمة في موقع تاني.",
          "المصادقة بعاملين: شيء تعرفه + شيء تملكه أو أنت عليه. متكتبش باسورد الصف في جروب عام.",
          "التوقيع الرقمي يتأكد أن الرسالة من صاحبها وما اتعدّلتش. HTTPS يشفر الخط بين المتصفح والخادم.",
        ],
        bodyEn: [
          "Encryption makes a message unreadable to anyone without the key.",
          "Authentication asks: are you really who you claim to be? A strong password is long, mixed, and not reused.",
          "Two-factor means something you know plus something you have or are. Do not put the class password in a public group.",
          "A digital signature confirms the sender and that the message was not altered. HTTPS encrypts the browser–server link.",
        ],
      },
      {
        headingAr: "الشبكة والحادثة",
        headingEn: "Network and incidents",
        bodyAr: [
          "جدار الحماية يفلتر الحركة حسب قواعد مسموحة وممنوعة. في التصميم نفصل الشبكة الداخلية عن الضيوف وعن الأجهزة الحساسة.",
          "التصيد يخدع المستخدم يفتح رابطًا أو يدّي بياناته.",
          "أول خطوة بعد حادثة: احتواء الضرر، تسجيل ما حصل، ثم الإبلاغ حسب الخطة. متمسحش الأدلة فورًا.",
          "النسخ الاحتياطي يحمي من فقدان البيانات بعد عطل أو هجوم. إدارة المخاطر: حدّد التهديد واحتماله وأثره، بعدين عالجه أو اقبله بوعي.",
        ],
        bodyEn: [
          "A firewall filters traffic by allow/deny rules. Design separates the internal network from guests and from sensitive devices.",
          "Phishing tricks the user into opening a link or giving data.",
          "After an incident: contain the damage, record what happened, then report. Do not wipe evidence at once.",
          "Backups protect against data loss. Risk management names the threat, its likelihood and impact, then treats or accepts it knowingly.",
        ],
      },
    ],
    termsAr: [
      { term: "التشفير", meaning: "جعل الرسالة غير مفهومة بغير المفتاح." },
      { term: "التصيد", meaning: "خداع المستخدم ليفتح رابطًا أو يعطي بياناته." },
      { term: "الاحتواء", meaning: "وقف انتشار الضرر مع الإبقاء على الأدلة." },
    ],
    termsEn: [
      { term: "Encryption", meaning: "Make the message unreadable without the key." },
      { term: "Phishing", meaning: "Trick the user into a link or into giving data." },
      { term: "Containment", meaning: "Stop the damage spreading while keeping evidence." },
    ],
    takeawayAr: "اقفل الباب بالمفتاح والمصادقة، ولو حصل هجوم: احتوِ وسجّل بعدين بلّغ.",
    takeawayEn: "Lock the door with keys and authentication. If attacked: contain, record, then report.",
  },
  {
    id: "f3",
    titleAr: "تطبيقات الويب",
    titleEn: "Web Applications",
    sections: [
      {
        headingAr: "الأجزاء الثلاثة",
        headingEn: "The three parts",
        bodyAr: [
          "تطبيق الويب: واجهة أمامية + خادم/خلفية + بيانات.",
          "المتصفح مكان الواجهة أمام المستخدم. الخادم مسؤول عن المنطق والقواعد والبيانات والصلاحيات.",
          "فصل الواجهة عن الخادم يخلي كل جزء يتطور ويتأمن ويتوسع أوضح.",
        ],
        bodyEn: [
          "A web app is a frontend + a server/backend + data.",
          "The browser is where the frontend runs. The server holds logic, rules, data, and permissions.",
          "Separating frontend from backend makes each part clearer to build, secure, and scale.",
        ],
      },
      {
        headingAr: "الطلب والصفحة",
        headingEn: "Requests and the page",
        bodyAr: [
          "HTTP بروتوكول تواصل بين المتصفح والخادم. GET يجلب بيانات من غير تغيير مقصود. POST يرسل بيانات عشان الخادم ينشئ أو يعالج.",
          "HTML بنية الصفحة: عناوين وفقرات وروابط. CSS الشكل: ألوان وخطوط وتنسيق. JavaScript يخلي الصفحة تتفاعل بعد التحميل.",
          "API طريقة متفق عليها تطلب بيها بيانات أو خدمة من نظام تاني.",
        ],
        bodyEn: [
          "HTTP is the browser–server protocol. GET fetches data without intending to change the server. POST sends data so the server can create or process something.",
          "HTML is structure. CSS is look. JavaScript makes the page interactive after load.",
          "An API is an agreed way to request data or a service from another system.",
        ],
      },
    ],
    termsAr: [
      { term: "GET", meaning: "طلب جلب صفحة أو بيانات." },
      { term: "POST", meaning: "طلب إرسال بيانات للمعالجة أو الإنشاء." },
      { term: "API", meaning: "اتفاق لطلب خدمة أو بيانات من نظام آخر." },
    ],
    termsEn: [
      { term: "GET", meaning: "A request that fetches a page or data." },
      { term: "POST", meaning: "A request that sends data to create or process." },
      { term: "API", meaning: "An agreed way to ask another system for a service or data." },
    ],
    takeawayAr: "المتصفح يعرض، والخادم يقرر ويحفظ، والطلب GET أو POST له شغل مختلف.",
    takeawayEn: "The browser shows, the server decides and stores, and GET is not the same job as POST.",
  },
  {
    id: "f4",
    titleAr: "تصميم الويب والوسائط",
    titleEn: "Web and Media Design",
    sections: [
      {
        headingAr: "تجربة المستخدم والوصول",
        headingEn: "UX and access",
        bodyAr: [
          "تجربة المستخدم تهتم بسهولة الوصول للمطلوب ووضوح الخطوات وراحة الاستخدام. الموقع البطيء يضيّع التركيز والمهمة.",
          "تصميم المعلومات: رتّب المحتوى عشان يتفهم بسرعة. إمكانية الوصول: نص بديل للصور، تباين كافٍ، ولوحة مفاتيح.",
          "تقييم الموقع: اختبر مهمة حقيقية (احجز حصة) وشوف كمّل ولا، بكام خطوة، وأين اتعثر. التحسين التكراري: جرّب، قيس، عدّل، وأعد الدورة.",
        ],
        bodyEn: [
          "UX cares about reaching the goal easily, clear steps, and comfort. A very slow page makes the user drop the task.",
          "Information design arranges content so it is understood quickly. Accessibility needs alt text, contrast, and keyboard use.",
          "Evaluate with a real task: did they finish, in how many steps, where did they struggle? Iterate: try, measure, adjust, repeat.",
        ],
      },
      {
        headingAr: "الصور والفيديو والنص",
        headingEn: "Images, video, and text",
        bodyAr: [
          "JPEG مناسب للصور الفوتوغرافية. PNG مفيد لما تحتاج شفافية وحواف أوضح للرسوم.",
          "الفيديو يحتاج ضغط مناسب عشان التحميل ما يثقلش والجودة تفضل مقبولة. النص مناسب لما المعلومة محتاجة دقة ومراجعة ورجوع سريع.",
          "اختيار الرسم البياني يعتمد على السؤال: مقارنة، جزء من كل، ولا تغيّر عبر الزمن.",
        ],
        bodyEn: [
          "JPEG suits photographs. PNG suits graphics that need transparency and clearer edges.",
          "Video needs sensible compression. Written text suits information that must be exact and easy to look up.",
          "The right chart depends on the question: comparison, part-to-whole, or change over time.",
        ],
      },
    ],
    termsAr: [
      { term: "تجربة المستخدم", meaning: "سهولة ووضوح وراحة الوصول للمطلوب." },
      { term: "إمكانية الوصول", meaning: "الموقع يشتغل لأكبر عدد: نص بديل وتباين ولوحة مفاتيح." },
      { term: "التحسين التكراري", meaning: "تجربة ثم قياس ثم تعديل ثم إعادة." },
    ],
    termsEn: [
      { term: "UX", meaning: "Ease, clarity, and comfort in reaching the goal." },
      { term: "Accessibility", meaning: "The site works for more people: alt text, contrast, keyboard." },
      { term: "Iteration", meaning: "Try, measure, adjust, and repeat." },
    ],
    takeawayAr: "التصميم مش لون بس: مهمة واضحة، وسيط مناسب، وقياس بعد التجريب.",
    takeawayEn: "Design is not only colour: a clear task, the right medium, and measurement after a trial.",
  },
];

export function getFaizNote(id: string): FaizUnitNote | undefined {
  return FAIZ_NOTES.find((row) => row.id === id);
}

export function isFaizUnitId(id: string): id is FaizUnitId {
  return FAIZ_NOTES.some((row) => row.id === id);
}
