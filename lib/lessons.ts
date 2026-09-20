import type { ChapterId } from "@/lib/curriculum";

export type LessonNote = {
  id: string;
  chapterId: ChapterId;
  termsAr: { term: string; meaning: string }[];
  termsEn: { term: string; meaning: string }[];
  bodyAr: string[];
  bodyEn: string[];
  takeawayAr: string;
  takeawayEn: string;
};

export const LESSON_NOTES: LessonNote[] = [
  {
    id: "1-1",
    chapterId: "1",
    termsAr: [
      { term: "الحاسوب الإلكتروني", meaning: "ظهر في الأربعينيات–الخمسينيات بأنابيب مفرغة، مثل إينياك، للحساب العسكري والعلمي." },
      { term: "الحاسوب الشخصي", meaning: "انتشر في الثمانينيات للعمل والتعليم اليومي بدل الطرق التقليدية." },
      { term: "الإنترنت والويب", meaning: "أُتيح تجاريًا في التسعينيات؛ وصول عالمي للمعلومات والبريد الإلكتروني." },
      { term: "الهواتف الذكية", meaning: "ظهرت في العقد الأول من الألفية ووسّعت الإنترنت عبر المحمول." },
      { term: "قانون مور", meaning: "عدد الترانزستورات على الشريحة يتضاعف تقريبًا كل سنتين." },
      { term: "الحوسبة السحابية", meaning: "تقديم تقنية المعلومات كخدمة عبر الإنترنت." },
      { term: "الحوسبة الطرفية", meaning: "معالجة البيانات على الجهاز نفسه فورًا بدل إرسالها للسحابة." },
      { term: "الواقع المعزز / الافتراضي", meaning: "المعزز يضيف طبقة رقمية على الواقع، والافتراضي يستبدله بعالم محاكى." },
      {
        term: "التحولات الاجتماعية الناتجة عن تكنولوجيا المعلومات",
        meaning: "خمس تحولات معًا: شبكات التواصل، التجارة الإلكترونية، العمل عن بُعد، التعلّم عبر الإنترنت، والدفع بلا نقد.",
      },
      { term: "القيادة الذاتية", meaning: "قيادة مركبة بالذكاء الاصطناعي من غير تدخل بشري، وتحتاج حوسبة طرفية." },
      { term: "البت الكمومي", meaning: "وحدة معلومات كمومية تمثل 0 و 1 معًا بالتراكب، بخلاف البت التقليدي." },
    ],
    termsEn: [
      { term: "Electronic computer", meaning: "Appeared in the 1940s–1950s with vacuum tubes, such as ENIAC, for military and scientific calculation." },
      { term: "Personal computer", meaning: "Spread in the 1980s for daily work and learning instead of older methods." },
      { term: "Internet and the web", meaning: "Opened to business in the 1990s; worldwide access to information and email." },
      { term: "Smartphones", meaning: "Appeared in the 2000s and spread the Internet from a pocket." },
      { term: "Moore's Law", meaning: "Transistors on a chip roughly double about every two years." },
      { term: "Cloud computing", meaning: "IT delivered as a service over the Internet." },
      { term: "Edge computing", meaning: "Process data on the device instantly instead of sending it to the cloud." },
      { term: "AR / VR", meaning: "AR overlays digital info on the real world; VR replaces it with a virtual space." },
      {
        term: "Social changes resulting from information technology",
        meaning: "Five changes together: SNS, e-commerce, remote work, online learning, and cashless payment.",
      },
      { term: "Autonomous driving", meaning: "AI drives a vehicle without a human; it needs edge computing." },
      { term: "Qubit", meaning: "A quantum bit that can hold 0 and 1 at once, unlike a classical bit." },
    ],
    bodyAr: [
      "مرت تقنية المعلومات بمراحل: حواسيب الغرف (الأربعينيات–الستينيات) ثم الحاسوب الشخصي ثم الإنترنت ثم الهواتف ثم السحابة والذكاء الاصطناعي كخدمة.",
      "قانون مور ملاحظة من 1965: عدد الترانزستورات على الشريحة يتضاعف تقريبًا كل سنتين. اليوم اقترب التصغير من حد فيزيائي فتظهر المعالجة المتوازية والحوسبة الكمومية.",
      "الحوسبة السحابية تقدّم التخزين والبرامج كخدمة عبر الإنترنت. الحوسبة الطرفية تعالج البيانات على الجهاز عندما يكون التأخير خطرًا، كما في القيادة الذاتية.",
      "الواقع المعزز يضيف طبقة رقمية على العالم الحقيقي. الواقع الافتراضي يستبدله بعالم محاكى. كل مرحلة من التقنية غيّرت المجتمع: البريد، العمل عن بُعد، التعلّم عبر الإنترنت، والدفع بلا نقد.",
    ],
    bodyEn: [
      "IT moved in stages: room-sized computers, personal computers, the Internet, smartphones, then cloud and AI as a service.",
      "Moore's Law is a 1965 observation: transistors on a chip roughly double every two years. Shrinking is near a physical limit, so parallel cores and quantum computing appear.",
      "Cloud computing delivers storage and software as a service over the Internet. Edge computing processes data on the device when delay is dangerous, as in self-driving cars.",
      "AR overlays the real world; VR replaces it with a simulated space. Each IT stage changed society: email, remote work, online learning, and cashless payment.",
    ],
    takeawayAr: "التقنية لا تتطور قفزة واحدة؛ كل مرحلة تغيّر كيف نتواصل ونعمل وندفع.",
    takeawayEn: "IT did not jump once; each stage changed how we communicate, work, and pay.",
  },
  {
    id: "1-2",
    chapterId: "1",
    termsAr: [
      { term: "الذكاء الاصطناعي", meaning: "التقنية التي تمكّن الحواسيب من أداء مهام تحتاج عادةً إلى ذكاء بشري." },
      { term: "التعلم الآلي", meaning: "يتعلم أنماطًا من البيانات للتنبؤ والحكم." },
      { term: "التعلم العميق", meaning: "تعلم آلي متقدم يستخدم شبكات عصبية وبيانات ضخمة." },
      { term: "الذكاء التوليدي", meaning: "ينتج نصًا أو صورة أو صوتًا جديدًا اعتمادًا على التعلم العميق." },
      { term: "الهلوسة", meaning: "نص يبدو صحيحًا وهو خطأ." },
    ],
    termsEn: [
      { term: "Artificial Intelligence (AI)", meaning: "The technology that enables computers to perform tasks that normally require human intelligence." },
      { term: "Machine learning", meaning: "Learns patterns from data to predict and judge." },
      { term: "Deep learning", meaning: "Advanced ML that uses neural networks and large-scale data." },
      { term: "Generative AI", meaning: "Creates new text, images, or audio using deep learning." },
      { term: "Hallucination", meaning: "Text that sounds right and is still wrong." },
    ],
    bodyAr: [
      "العلاقة متداخلة: ذكاء اصطناعي ثم تعلم آلي ثم تعلم عميق ثم ذكاء توليدي.",
      "فلتر الرسائل المزعجة وتوصية المنتجات تعلم آلي؛ توليد صورة من جملة ذكاء توليدي.",
      "الهلوسة: النص يبدو صحيحًا وهو خطأ.",
    ],
    bodyEn: [
      "Nested fields: AI, then machine learning, then deep learning, then generative AI.",
      "A spam filter is machine learning; an image generated from a sentence is generative AI.",
      "Hallucination: the text sounds right and is still wrong.",
    ],
    takeawayAr: "ليست أربع تقنيات منفصلة، بل مجال واحد بدرجات تخصص.",
    takeawayEn: "Not four separate technologies — one field at different depths.",
  },
  {
    id: "1-3",
    chapterId: "1",
    termsAr: [
      { term: "الذكاء الضيق", meaning: "نظام يتقن مهمة واحدة فقط، وهذا شكل معظم أنظمة اليوم." },
      { term: "التحيز", meaning: "أخطاء متكررة لأن بيانات التدريب غير عادلة أو ناقصة." },
      { term: "نظام توصية", meaning: "يقترح محتوى أو منتجًا من أنماط سابقة." },
      { term: "صيانة تنبؤية", meaning: "توقع عطل الآلة قبل حدوثه من بيانات الحساسات." },
    ],
    termsEn: [
      { term: "Narrow AI", meaning: "Expert at one task only — the form of most systems today." },
      { term: "Bias", meaning: "Repeated errors because training data is unfair or incomplete." },
      { term: "Recommender", meaning: "Suggests content or a product from past patterns." },
      { term: "Predictive maintenance", meaning: "Forecast a machine fault from sensor data before it happens." },
    ],
    bodyAr: [
      "أمثلة يومية: ترجمة، توصيات، فلترة بريد، تشخيص طبي مساعد، صيانة تنبؤية في المصانع.",
      "الذكاء الاصطناعي قوي في الأنماط المتكررة والبيانات الكثيرة، وضعيف في السياق الجديد والمسؤولية الأخلاقية.",
      "استخدمه كمساعد: يسرّع البحث، وأنت تتحقق من المصدر والمعنى.",
    ],
    bodyEn: [
      "Daily uses: translation, recommendations, spam filters, assistive diagnosis, predictive maintenance.",
      "AI is strong on repeated patterns and large data, weak on new context and moral responsibility.",
      "Treat it as an assistant: it speeds research; you check the source and the meaning.",
    ],
    takeawayAr: "الذكاء الاصطناعي أداة في يد الإنسان، لا بديلًا عن حكمه.",
    takeawayEn: "AI is a tool in a human hand, not a replacement for judgement.",
  },
  {
    id: "1-4",
    chapterId: "1",
    termsAr: [
      { term: "الخصوصية", meaning: "حق الشخص في السيطرة على بياناته." },
      { term: "الشفافية", meaning: "أن نفهم لماذا اتخذ النظام قرارًا." },
      { term: "المساءلة", meaning: "وجود مسؤول بشري عن أثر القرار." },
      { term: "التزييف العميق", meaning: "صوت أو صورة مُصنَّعة تبدو حقيقية." },
    ],
    termsEn: [
      { term: "Privacy", meaning: "A person's right to control their data." },
      { term: "Transparency", meaning: "Being able to understand why a system decided." },
      { term: "Accountability", meaning: "A human remains responsible for the decision's effect." },
      { term: "Deepfake", meaning: "A fabricated voice or image that looks real." },
    ],
    bodyAr: [
      "قضايا أخلاقية: التحيز، انتهاك الخصوصية، التزييف العميق، فقدان وظائف، الاعتماد الأعمى على النموذج.",
      "قاعدة الصف: استخدم الذكاء الاصطناعي لفهم الفكرة، ثم اكتب إجابتك أنت.",
      "لا تشارك بيانات زميل أو أسرة مع نموذج عام.",
    ],
    bodyEn: [
      "Ethical issues: bias, privacy loss, deepfakes, job disruption, blind trust in the model.",
      "Class rule: use AI to understand an idea, then write your own answer.",
      "Never share a classmate's or family's private data with a public model.",
    ],
    takeawayAr: "القدرة التقنية لا تعني الإذن الأخلاقي.",
    takeawayEn: "Technical power is not moral permission.",
  },
  {
    id: "2-1",
    chapterId: "2",
    termsAr: [
      { term: "التشفير", meaning: "تحويل النص إلى صورة لا تُقرأ بغير المفتاح." },
      { term: "التشفير المتماثل", meaning: "مفتاح واحد للتشفير وفك التشفير." },
      { term: "التشفير غير المتماثل", meaning: "زوج مفاتيح: عام للتشفير وخاص للفك." },
      { term: "المصادقة", meaning: "التأكد أن الطرف هو من يدّعي أنه هو." },
      { term: "المصادقة متعددة العوامل", meaning: "شيء تعرفه + شيء تملكه + شيء أنت عليه." },
      { term: "التجزئة", meaning: "دالة اتجاه واحد: نقارن البصمة ولا نسترجع السر." },
    ],
    termsEn: [
      { term: "Encryption", meaning: "Turn readable data into a form that needs a key." },
      { term: "Symmetric", meaning: "The same key encrypts and decrypts." },
      { term: "Asymmetric", meaning: "A public key encrypts; a private key decrypts." },
      { term: "Authentication", meaning: "Proving a party is who they claim to be." },
      { term: "MFA", meaning: "Something you know + have + are." },
      { term: "Hash", meaning: "A one-way function: we compare the fingerprint and do not recover the secret." },
    ],
    bodyAr: [
      "كلمة المرور وحدها ضعيفة. أضف عاملًا ثانيًا: رسالة أو تطبيق أو مفتاح.",
      "التجزئة اتجاه واحد: نقارن البصمة لا نسترجع السر.",
      "الشهادة الرقمية تربط المفتاح العام بهوية موثوقة.",
    ],
    bodyEn: [
      "A password alone is weak. Add a second factor: SMS, an app, or a key.",
      "A hash is one-way: we compare the fingerprint; we do not recover the secret.",
      "A digital certificate binds a public key to a trusted identity.",
    ],
    takeawayAr: "السرية بلا مصادقة تترك الباب مفتوحًا لمن ينتحل الهوية.",
    takeawayEn: "Secrecy without authentication leaves the door open to impersonation.",
  },
  {
    id: "2-2",
    chapterId: "2",
    termsAr: [
      { term: "جدار الحماية", meaning: "يفلتر حركة الشبكة حسب قواعد." },
      { term: "شبكة خاصة افتراضية", meaning: "نفق مشفّر عبر شبكة عامة." },
      { term: "تقسيم الشبكة", meaning: "عزل أجزاء الشبكة حتى لا ينتشر الاختراق." },
      { term: "مبدأ أقل صلاحية", meaning: "أعطِ كل مستخدم أقل ما يكفي لعمله." },
    ],
    termsEn: [
      { term: "Firewall", meaning: "Filters network traffic by rules." },
      { term: "VPN", meaning: "An encrypted tunnel across a public network." },
      { term: "Segmentation", meaning: "Isolate network parts so a breach does not spread." },
      { term: "Least privilege", meaning: "Give each user only what their job needs." },
    ],
    bodyAr: [
      "التصميم الآمن طبقات: محيط، شبكة داخلية، أجهزة، بيانات.",
      "لا تعتمد على جدار واحد. المهاجم إن تجاوز طبقة يقابل التالية.",
      "حدّث الأنظمة وأغلق المنافذ غير المستخدمة.",
    ],
    bodyEn: [
      "Secure design is layered: perimeter, internal network, devices, data.",
      "Do not trust one firewall. If an attacker passes a layer, the next must stop them.",
      "Patch systems and close unused ports.",
    ],
    takeawayAr: "الأمن تصميم من البداية، لا إضافة في آخر المشروع.",
    takeawayEn: "Security is designed in from the start, not bolted on at the end.",
  },
  {
    id: "2-3",
    chapterId: "2",
    termsAr: [
      { term: "الحادث", meaning: "حدث يهدد سرية أو سلامة أو إتاحة المعلومات." },
      { term: "إدارة المخاطر", meaning: "تحديد الخطر، تقديره، ثم قبوله أو تخفيفه أو نقله." },
      { term: "خطة الاستجابة", meaning: "خطوات جاهزة: اكتشاف، احتواء، إزالة، تعافٍ، مراجعة." },
      { term: "الاحتواء", meaning: "عزل الجهاز أو الحساب حتى لا يتسع الضرر." },
    ],
    termsEn: [
      { term: "Incident", meaning: "An event that threatens confidentiality, integrity, or availability." },
      { term: "Risk management", meaning: "Identify, estimate, then accept, reduce, or transfer the risk." },
      { term: "Response plan", meaning: "Ready steps: detect, contain, eradicate, recover, review." },
      { term: "Containment", meaning: "Isolate the device or account so the damage does not spread." },
    ],
    bodyAr: [
      "لا تخفِ الحادث. الوقت الضائع يوسّع الضرر.",
      "سجّل الأدلة قبل مسح الجهاز حتى يمكن التعلّم لاحقًا.",
      "بعد التعافي: ما الذي فشل في التصميم؟ أصلح السبب لا العرض.",
    ],
    bodyEn: [
      "Do not hide an incident. Lost time widens the damage.",
      "Preserve evidence before wiping a device so the team can learn.",
      "After recovery: what failed in the design? Fix the cause, not the symptom.",
    ],
    takeawayAr: "الاستجابة خطة مكتوبة تُدرَّب، لا ارتجال وقت الهلع.",
    takeawayEn: "Response is a written, rehearsed plan — not improvisation in a panic.",
  },
  {
    id: "3-1",
    chapterId: "3",
    termsAr: [
      { term: "الواجهة الأمامية", meaning: "ما يراه المستخدم في المتصفح: هيكل الصفحة وتنسيقها ولغة التفاعل." },
      { term: "الخادم / الخلفية", meaning: "المنطق، قواعد البيانات، والصلاحيات على الخادم." },
      { term: "قاعدة البيانات", meaning: "تخزين دائم للبيانات المنظمة." },
      { term: "العميل-الخادم", meaning: "المتصفح يطلب، والخادم يرد." },
    ],
    termsEn: [
      { term: "Frontend", meaning: "What the user sees in the browser: HTML, CSS, JavaScript." },
      { term: "Backend", meaning: "Logic, databases, and permissions on the server." },
      { term: "Database", meaning: "Persistent structured storage." },
      { term: "Client–server", meaning: "The browser requests; the server replies." },
    ],
    bodyAr: [
      "تطبيق الويب طبقات: عرض، تطبيق، بيانات.",
      "فصل الواجهة عن الخادم يسهّل الصيانة وفريقين يعملان معًا.",
      "لا تضع سرًا (مفتاح واجهة برمجية أو كلمة مرور) داخل كود الواجهة؛ المتصفح مكشوف.",
    ],
    bodyEn: [
      "A web app has layers: presentation, application, data.",
      "Splitting frontend and backend lets two teams work and makes maintenance easier.",
      "Never put a secret (API key, password) in frontend code; the browser is public.",
    ],
    takeawayAr: "المتصفح يعرض ويطلب؛ الخادم يقرر ويحفظ.",
    takeawayEn: "The browser displays and asks; the server decides and stores.",
  },
  {
    id: "3-2",
    chapterId: "3",
    termsAr: [
      { term: "بروتوكول الويب", meaning: "بروتوكول طلب واستجابة بين المتصفح والخادم." },
      { term: "بروتوكول ويب آمن", meaning: "بروتوكول الويب فوق قناة مشفّرة." },
      { term: "واجهة برمجية", meaning: "اتفاق يتفق عليه برنامجان لتبادل البيانات." },
      { term: "موارد ونص بيانات", meaning: "نمط شائع: موارد وعناوين، وغالبًا نص بيانات منظم." },
    ],
    termsEn: [
      { term: "HTTP", meaning: "Request–response protocol between browser and server." },
      { term: "HTTPS", meaning: "HTTP over an encrypted TLS channel." },
      { term: "API", meaning: "A contract two programs use to exchange data." },
      { term: "REST / JSON", meaning: "A common style: resources and URLs, often JSON payloads." },
    ],
    bodyAr: [
      "الطرق الشائعة: القراءة للجلب، الإرسال للإنشاء، التعديل الكامل أو الجزئي للتحديث، والحذف بعد إذن الخادم.",
      "رمز الحالة يخبر النتيجة: نجاح، غير موجود، أو خطأ خادم.",
      "ملفات الجلسة تحفظ حالة تسجيل الدخول بعد الطلب.",
    ],
    bodyEn: [
      "Common methods: GET to read, POST to create, PUT/PATCH to update, DELETE to remove.",
      "Status codes report the result: 200 success, 404 missing, 500 server error.",
      "Cookies and sessions keep a login alive across requests.",
    ],
    takeawayAr: "بلا اتفاق واضح على الطلب والرد، التطبيقان لا يفهمان بعضهما.",
    takeawayEn: "Without a clear request–response contract, two apps cannot understand each other.",
  },
  {
    id: "3-3",
    chapterId: "3",
    termsAr: [
      { term: "هيكل الصفحة", meaning: "معنى الصفحة: العناوين والجداول والقوائم." },
      { term: "تنسيق الصفحة", meaning: "المظهر: الألوان، الشبكة، التجاوب." },
      { term: "لغة التفاعل", meaning: "السلوك والتفاعل بعد التحميل." },
      { term: "إتاحة الوصول", meaning: "تصميم يصلح لوحة المفاتيح وقارئ الشاشة." },
    ],
    termsEn: [
      { term: "HTML", meaning: "The structure and meaning of the page." },
      { term: "CSS", meaning: "Look: colour, layout, responsiveness." },
      { term: "JavaScript", meaning: "Behaviour and interaction after load." },
      { term: "Accessibility", meaning: "A design that works with a keyboard and a screen reader." },
    ],
    bodyAr: [
      "ابدأ بالمعنى الصحيح للعناصر: عنوان، زر، قائمة؛ لا تجعل كل شيء مربع شكل بلا معنى.",
      "التصميم المتجاوب يخدم الهاتف قبل أن يخدم الشاشة الكبيرة أحيانًا.",
      "اختبر الصفحة من غير فأرة.",
    ],
    bodyEn: [
      "Start with the right elements: heading, button, list — not empty boxes with no meaning.",
      "Responsive design often serves the phone before the wide screen.",
      "Test the page without a mouse.",
    ],
    takeawayAr: "الواجهة الجيدة واضحة للإنسان وللآلة المساعدة.",
    takeawayEn: "A good frontend is clear to a human and to an assistive machine.",
  },
  {
    id: "4-1",
    chapterId: "4",
    termsAr: [
      { term: "وسائط متعددة", meaning: "نص، صورة، صوت، فيديو، رسوم متحركة." },
      { term: "ضغط الملفات", meaning: "تقليل الحجم مع أو بغير فقد في الجودة." },
      { term: "النص البديل", meaning: "وصف الصورة لمن لا يراها أو يستخدم قارئ شاشة." },
      { term: "الدقة مقابل الحجم", meaning: "موازنة وضوح الوسيط وسرعة التحميل." },
    ],
    termsEn: [
      { term: "Multimedia", meaning: "Text, image, audio, video, animation." },
      { term: "Compression", meaning: "Shrink file size, with or without quality loss." },
      { term: "Alt text", meaning: "A description of the image for someone who cannot see it." },
      { term: "Quality vs size", meaning: "Balance how sharp a medium is against how fast it loads." },
    ],
    bodyAr: [
      "كل وسيط يناسب رسالة: جدول للأرقام، فيديو للحركة، أيقونة للفعل السريع.",
      "الصورة الثقيلة تبطئ الموقع على شبكة ضعيفة؛ اختر الحجم المناسب.",
      "النص البديل للصورة واجب لا تجميل.",
    ],
    bodyEn: [
      "Each medium fits a message: a table for numbers, video for motion, an icon for a quick action.",
      "A heavy image slows a weak network; choose the right size.",
      "Alt text is a duty, not decoration.",
    ],
    takeawayAr: "الوسيط خادم للمعنى، لا زينة فوق صفحة مزدحمة.",
    takeawayEn: "The medium serves the meaning; it is not decoration on a crowded page.",
  },
  {
    id: "4-2",
    chapterId: "4",
    termsAr: [
      { term: "تجربة المستخدم", meaning: "سهولة ووضوح الرحلة حتى يحقق المستخدم هدفه." },
      { term: "واجهة المستخدم", meaning: "العناصر المرئية التي يلمسها." },
      { term: "التسلسل البصري", meaning: "العين تعرف أين تبدأ وأين تضغط." },
      { term: "عدد النقرات", meaning: "كم خطوة يحتاجها المستخدم حتى يتم المهمة." },
    ],
    termsEn: [
      { term: "UX", meaning: "How easy and clear the journey is until the user reaches a goal." },
      { term: "UI", meaning: "The visible controls the user touches." },
      { term: "Visual hierarchy", meaning: "The eye knows where to start and where to click." },
      { term: "Click count", meaning: "How many steps the user needs to finish the task." },
    ],
    bodyAr: [
      "صمّم للمهمة: يسجّل الطالب حضوره في أقل خطوات.",
      "الاتساق أهم من المفاجأة: نفس مكان القائمة ونفس لون الزر الرئيسي.",
      "اختبر مع زميل صامت يشاهد أين يتوه.",
    ],
    bodyEn: [
      "Design for the task: a student marks attendance in the fewest steps.",
      "Consistency beats surprise: same menu place, same primary button colour.",
      "Watch a silent classmate and see where they get lost.",
    ],
    takeawayAr: "الموقع الناجح هو الذي يُفهم في ثانية، لا الذي يُعجب في صورة.",
    takeawayEn: "A successful site is understood in a second, not only admired in a screenshot.",
  },
  {
    id: "4-3",
    chapterId: "4",
    termsAr: [
      { term: "قابلية الاستخدام", meaning: "هل ينجز المستخدم المهمة بسرعة وبلا أخطاء؟" },
      { term: "اختبار أ/ب", meaning: "مقارنة نسختين وقياس أيهما أفضل." },
      { term: "زمن المهمة", meaning: "كم يستغرق المستخدم حتى ينهي الهدف." },
      { term: "رضا المستخدم", meaning: "هل يشعر أن التجربة واضحة ومريحة." },
    ],
    termsEn: [
      { term: "Usability", meaning: "Can the user finish the task quickly with few errors?" },
      { term: "A/B test", meaning: "Compare two versions and measure which works better." },
      { term: "Task time", meaning: "How long the user takes to finish the goal." },
      { term: "Satisfaction", meaning: "Whether the experience feels clear and comfortable." },
    ],
    bodyAr: [
      "قيّم بمعايير: وضوح الهدف، زمن المهمة، عدد الأخطاء، رضا المستخدم.",
      "لا تعتمد على ذوقك وحدك؛ اجمع ملاحظات حقيقية.",
      "إتاحة الوصول جزء من التقييم لا ملحق.",
    ],
    bodyEn: [
      "Score a site on goal clarity, task time, errors, and satisfaction.",
      "Do not trust your taste alone; collect real notes.",
      "Accessibility is part of the score, not an appendix.",
    ],
    takeawayAr: "التقييم قياس، لا انطباع عابر.",
    takeawayEn: "Evaluation is a measurement, not a passing impression.",
  },
  {
    id: "4-4",
    chapterId: "4",
    termsAr: [
      { term: "التكرار", meaning: "صمّم → اختبر → تعلّم → حسّن → أعد." },
      { term: "النموذج الأولي", meaning: "نسخة رخيصة سريعة للاختبار قبل البناء الكامل." },
      { term: "معدل الخروج", meaning: "أين يغادر الزائر الصفحة قبل إتمام المهمة." },
      { term: "دليل القرار", meaning: "سبب مكتوب للتغيير مبني على ملاحظة لا ذوق فقط." },
    ],
    termsEn: [
      { term: "Iteration", meaning: "Design → test → learn → improve → repeat." },
      { term: "Prototype", meaning: "A cheap, fast version used to test before full build." },
      { term: "Drop-off", meaning: "Where a visitor leaves the page before finishing the task." },
      { term: "Decision record", meaning: "A written reason for a change, based on evidence not taste alone." },
    ],
    bodyAr: [
      "الموقع لا يُنشر مرة ويُنسى. راقب أين يغادر الزائر.",
      "غيّر شيئًا واحدًا في كل دورة حتى تعرف السبب.",
      "وثّق القرار: لماذا نقلنا الزر؟ أي دليل؟",
    ],
    bodyEn: [
      "A site is not published once and forgotten. Watch where visitors leave.",
      "Change one thing per cycle so you know the cause.",
      "Record the decision: why did we move the button? What evidence?",
    ],
    takeawayAr: "التحسين حلقة مغلقة بالدليل، لا قائمة أمنيات.",
    takeawayEn: "Improvement is a closed loop of evidence, not a wish list.",
  },
  {
    id: "5-1",
    chapterId: "5",
    termsAr: [
      { term: "بيانات أولية", meaning: "تجمعها أنت لغرض محدد." },
      { term: "بيانات ثانوية", meaning: "جمعها غيرك ونشرها." },
      { term: "مجتمع / عينة", meaning: "الكل المستهدف / الجزء الذي تسأله فعليًا." },
      { term: "تحيز العينة", meaning: "اختيار غير عادل يجعل النتيجة واثقة وخاطئة." },
    ],
    termsEn: [
      { term: "Primary data", meaning: "You gather it fresh for your purpose." },
      { term: "Secondary data", meaning: "Already collected and published by others." },
      { term: "Population / sample", meaning: "The whole group / the part you actually ask." },
      { term: "Sampling bias", meaning: "An unfair pick that makes a confident wrong answer." },
    ],
    bodyAr: [
      "التحليل: جمع → تنظيم → تحليل. إن فسد الجمع لن ينقذ الحساب.",
      "عينة عشوائية بسيطة بالقرعة؛ طبقية تقسم ثم تسحب من كل شريحة.",
      "تحيز الاختيار الذاتي: من يهتم فقط هو من يرد على استطلاع الويب.",
    ],
    bodyEn: [
      "Analysis flows collect → organise → analyse. Bad collection cannot be saved by later maths.",
      "Simple random sampling draws by chance; stratified sampling draws from each stratum.",
      "Self-selection: only the keen answer a web poll.",
    ],
    takeawayAr: "العينة العادلة صورة مصغّرة للمجتمع، لا أسهل ناس تلاقيهم.",
    takeawayEn: "A fair sample is a miniature of the population, not whoever is easiest to reach.",
  },
  {
    id: "5-2",
    chapterId: "5",
    termsAr: [
      { term: "قيمة مفقودة", meaning: "خلية فارغة؛ احذف أو املأ أو علّم حسب المعنى." },
      { term: "قيمة شاذة", meaning: "بعيدة جدًا؛ قد تكون خطأ أو حقيقة نادرة." },
      { term: "تطبيع / تقييس", meaning: "0–1 للمقارنة / متوسط 0 وانحراف 1." },
      { term: "تكرار", meaning: "صفّان متشابهان قد يكونان خطأ نسخ أو عمليتين حقيقيتين." },
    ],
    termsEn: [
      { term: "Missing value", meaning: "A blank; delete, impute, or flag by meaning." },
      { term: "Outlier", meaning: "Far from the rest; error or a rare truth." },
      { term: "Normalise / standardise", meaning: "Scale to 0–1 / mean 0 and SD 1." },
      { term: "Duplicate", meaning: "Two similar rows that may be a copy error or two real events." },
    ],
    bodyAr: [
      "مدخلات سيئة = مخرجات سيئة، حتى لو كان الحساب أنيقًا.",
      "لا تحذف صفًا فيه شراءان متشابهان في نفس اليوم قبل أن تتأكد أنهما تكرار لا عمليتان.",
      "وحّد كتابة التاريخ والجنس قبل أي مجموع.",
    ],
    bodyEn: [
      "Bad inputs give bad outputs, even when the maths looks neat.",
      "Do not merge two same-day purchases until you know they are a duplicate, not two sales.",
      "Unify date and gender spellings before any total.",
    ],
    takeawayAr: "التنظيف حكم هندسي، لا زر سحري واحد.",
    takeawayEn: "Cleaning is an engineering judgement, not one magic button.",
  },
  {
    id: "5-3",
    chapterId: "5",
    termsAr: [
      { term: "بيانات مفتوحة", meaning: "بيانات عامة يمكن إعادة استخدامها بشروط واضحة." },
      { term: "واجهة برمجة", meaning: "طلب منظّم لجلب بيانات محدّثة من مصدر." },
      { term: "الترخيص", meaning: "شروط إعادة استخدام البيانات: هل يجوز النسخ والنشر." },
      { term: "تاريخ التحديث", meaning: "متى جُمعت الأرقام آخر مرة حتى لا تعتمد رقمًا قديمًا." },
    ],
    termsEn: [
      { term: "Open data", meaning: "Public data that can be reused under a clear licence." },
      { term: "API", meaning: "A structured way to fetch fresh data from a source." },
      { term: "Licence", meaning: "The reuse rules: whether you may copy and publish." },
      { term: "Update date", meaning: "When the numbers were last collected, so you do not trust a stale figure." },
    ],
    bodyAr: [
      "البيانات المفتوحة تختصر الوقت، لكن راجع الترخيص وتاريخ التحديث والتحيز المحتمل.",
      "الواجهة البرمجية تعطيك شريحة حية؛ الملف المحمّل قد يكون قديمًا.",
      "وثّق المصدر: الجهة والتاريخ والرابط.",
    ],
    bodyEn: [
      "Open data saves time, but check the licence, update date, and possible bias.",
      "An API gives a live slice; a downloaded file may be stale.",
      "Cite the source: agency, date, and link.",
    ],
    takeawayAr: "المصدر المفتوح ليس مصدرًا بريئًا تلقائيًا؛ اسأله كما تسأل استطلاعك.",
    takeawayEn: "Open is not automatically innocent; question it as you would your own survey.",
  },
  {
    id: "6-1",
    chapterId: "6",
    termsAr: [
      { term: "إحصاء وصفي", meaning: "يلخّص العينة: متوسط، وسيط، تباين." },
      { term: "استدلال", meaning: "تعميم حذر من العينة إلى المجتمع مع مقدار عدم اليقين." },
      { term: "فرضية", meaning: "ادعاء نختبره بالبيانات لا بالشعور." },
      { term: "فترة ثقة", meaning: "مدى نضع فيه تقدير المجتمع مع مقدار عدم اليقين." },
    ],
    termsEn: [
      { term: "Descriptive stats", meaning: "Summarise the sample: mean, median, spread." },
      { term: "Inference", meaning: "A cautious generalisation from sample to population, with uncertainty." },
      { term: "Hypothesis", meaning: "A claim we test with data, not with feeling." },
      { term: "Confidence interval", meaning: "A range for the population estimate, with uncertainty." },
    ],
    bodyAr: [
      "المتوسط يخدع إن وُجدت قيمة شاذة؛ انظر الوسيط أيضًا.",
      "عينة صغيرة تعطي فترة ثقة واسعة: لا تصرخ بنتيجة قاطعة.",
      "الارتباط ليس سببية.",
    ],
    bodyEn: [
      "The mean lies when an outlier sits in the set; look at the median too.",
      "A small sample gives a wide interval: do not shout a final truth.",
      "Correlation is not causation.",
    ],
    takeawayAr: "الاستدلال يقول: إلى أي حد يجوز أن نعمّم؟ لا: احفظ الرقم.",
    takeawayEn: "Inference asks how far we may generalise — it does not ask you to memorise a number.",
  },
  {
    id: "6-2",
    chapterId: "6",
    termsAr: [
      { term: "انحدار خطي", meaning: "خط يصف علاقة تقريبية بين متغيرين." },
      { term: "بواقي", meaning: "فرق الواقع عن الخط؛ إن كبرت فالخط ضعيف." },
      { term: "استكمال", meaning: "التنبؤ خارج مدى البيانات التي بنيت عليها الخط." },
      { term: "متغير تفسيري", meaning: "المتغير الذي نستخدمه لشرح أو توقع الآخر." },
    ],
    termsEn: [
      { term: "Linear regression", meaning: "A line that roughly describes a relationship between two variables." },
      { term: "Residuals", meaning: "Reality minus the line; large residuals mean a weak fit." },
      { term: "Extrapolation", meaning: "Predicting outside the data range the line was built on." },
      { term: "Explanatory variable", meaning: "The variable we use to explain or predict the other." },
    ],
    bodyAr: [
      "استخدم الانحدار عندما تتوقع اتجاهًا، لا عندما تكون النقاط سحابة بلا شكل.",
      "لا تتنبأ خارج مدى البيانات (استكمال خطر).",
      "اسأل: هل المتغير التفسيري منطقي أم مجرد صدفة؟",
    ],
    bodyEn: [
      "Use regression when you expect a trend, not when the points are a shapeless cloud.",
      "Do not predict far outside the data range.",
      "Ask: is the explanatory variable sensible, or only a coincidence?",
    ],
    takeawayAr: "الخط أداة وصف، لا برهان أن س يسبب ص.",
    takeawayEn: "The line is a description, not proof that X causes Y.",
  },
  {
    id: "6-3",
    chapterId: "6",
    termsAr: [
      { term: "رسم أعمدة", meaning: "مقارنة فئات." },
      { term: "خط زمني", meaning: "تتبع التغير عبر الوقت." },
      { term: "دائرة", meaning: "أجزاء من كل — بحذر إن كثرت الشرائح." },
      { term: "المصدر", meaning: "من أين جاءت الأرقام، ويُذكر تحت الرسم." },
    ],
    termsEn: [
      { term: "Bar chart", meaning: "Compare categories." },
      { term: "Line chart", meaning: "Track change over time." },
      { term: "Pie", meaning: "Parts of a whole — weak when there are many slices." },
      { term: "Source", meaning: "Where the numbers came from; cited under the chart." },
    ],
    bodyAr: [
      "اختر الرسم الذي يخدم السؤال لا الذي يبدو أجمل.",
      "اكتب عنوانًا يقول الادعاء، وسمّ المحاور، واذكر المصدر.",
      "لا تقطع المحور الرأسي ليضخّم فرقًا تافهًا.",
    ],
    bodyEn: [
      "Pick the chart that serves the question, not the prettiest one.",
      "Title the claim, label the axes, cite the source.",
      "Do not crop the y-axis to inflate a tiny gap.",
    ],
    takeawayAr: "الرسم الصادق يحترم عين القارئ.",
    takeawayEn: "An honest chart respects the reader's eye.",
  },
  {
    id: "7-1",
    chapterId: "7",
    termsAr: [
      { term: "تعلم بإشراف", meaning: "أمثلة معلّمة: مدخل ومخرج معروف." },
      { term: "تعلم بلا إشراف", meaning: "بحث عن تجمعات أو أنماط بلا تسمية جاهزة." },
      { term: "تدريب / اختبار", meaning: "تعلّم على جزء، وقِس على جزء لم يره النموذج." },
      { term: "تصنيف", meaning: "التنبؤ بفئة مثل ناجح أو راسب." },
    ],
    termsEn: [
      { term: "Supervised", meaning: "Labeled examples: known input and output." },
      { term: "Unsupervised", meaning: "Find clusters or patterns without ready labels." },
      { term: "Train / test", meaning: "Learn on one split; measure on a split the model has not seen." },
      { term: "Classification", meaning: "Predict a class such as pass or fail." },
    ],
    bodyAr: [
      "جودة النموذج = جودة البيانات + مناسبة الخوارزمية + تقييم صادق.",
      "إن اختبرته على بيانات التدريب فستحصل على درجة متفائلة كاذبة.",
      "التصنيف: فئة. الانحدار: رقم.",
    ],
    bodyEn: [
      "Model quality = data quality + a fitting algorithm + honest evaluation.",
      "Testing on the training set gives a falsely optimistic score.",
      "Classification predicts a class; regression predicts a number.",
    ],
    takeawayAr: "النموذج يحفظ ما أطعمته؛ إن أطعمته انحيازًا أخرجه انحيازًا.",
    takeawayEn: "A model remembers what you fed it; biased food becomes biased output.",
  },
  {
    id: "7-2",
    chapterId: "7",
    termsAr: [
      { term: "عصبون اصطناعي", meaning: "وحدة تجمع مدخلات موزونة ثم تفعّل خرجًا." },
      { term: "وزن", meaning: "قوة الصلة؛ التعلم يعدّل الأوزان." },
      { term: "طبقة", meaning: "مجموعة عصبونات؛ العمق = طبقات مخفية أكثر." },
      { term: "الصندوق الأسود", meaning: "نموذج يصعب شرح لماذا اتخذ قرارًا." },
    ],
    termsEn: [
      { term: "Artificial neuron", meaning: "A unit that combines weighted inputs then activates an output." },
      { term: "Weight", meaning: "Connection strength; learning adjusts weights." },
      { term: "Layer", meaning: "A group of neurons; depth means more hidden layers." },
      { term: "Black box", meaning: "A model that is hard to explain after it decides." },
    ],
    bodyAr: [
      "الشبكة تتعلم تمثيلات: الحواف ثم الأشكال ثم الوجه في صور القيادة الذاتية.",
      "تحتاج بيانات كثيرة وحسابًا؛ ليست دائمًا الخيار الأول لمسألة صغيرة.",
      "الصندوق الأسود مشكلة عندما يمس القرار حياة إنسان.",
    ],
    bodyEn: [
      "A network learns representations: edges, then shapes, then a face in driving images.",
      "It needs lots of data and compute; it is not always the first choice for a small problem.",
      "A black box is a problem when a decision touches a human life.",
    ],
    takeawayAr: "العمق قوة إذا وُجدت بيانات كافية وتفسير يكفي للمساءلة.",
    takeawayEn: "Depth is power when you have enough data and enough explanation for accountability.",
  },
  {
    id: "7-3",
    chapterId: "7",
    termsAr: [
      { term: "نموذج لغة كبير", meaning: "شبكة تدربت على نص هائل لتوقع الكلمة التالية." },
      { term: "توجيه الأوامر", meaning: "صياغة السؤال تؤثر على جودة الرد." },
      { term: "هلوسة", meaning: "جملة فصيحة بلا سند." },
      { term: "رمز / توكن", meaning: "وحدة النص التي يتوقعها النموذج كلمةً بعد كلمة." },
    ],
    termsEn: [
      { term: "LLM", meaning: "A network trained on huge text to predict the next token." },
      { term: "Prompting", meaning: "How you ask changes the quality of the reply." },
      { term: "Hallucination", meaning: "Fluent text with no grounding." },
      { term: "Token", meaning: "The text unit the model predicts, one after another." },
    ],
    bodyAr: [
      "النموذج لا «يعرف» كالإنسان؛ يحسب أرجح تكملة.",
      "استخدمه للشرح والتمرين، ثم أغلقه واكتب من فهمك.",
      "لا تُدخل أسرارًا: درجات زملاء، عنوان بيت، صور بطاقة.",
    ],
    bodyEn: [
      "The model does not «know» as a person does; it scores the next likely token.",
      "Use it to explain and drill, then close it and write from your understanding.",
      "Do not paste secrets: classmates' marks, a home address, an ID photo.",
    ],
    takeawayAr: "اللغة السلسة ليست دليل صدق.",
    takeawayEn: "Fluent language is not proof of truth.",
  },
];

export function notesForLesson(id: string): LessonNote | undefined {
  return LESSON_NOTES.find((note) => note.id === id);
}

export function notesForChapter(chapterId: ChapterId): LessonNote[] {
  return LESSON_NOTES.filter((note) => note.chapterId === chapterId);
}
