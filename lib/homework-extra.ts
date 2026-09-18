import type { ChapterId } from "@/lib/curriculum";

export type ExtraHomework = {
  id: string;
  lessonId: string;
  chapterId: ChapterId;
  kind: "mcq" | "tf";
  promptAr: string;
  promptEn: string;
  optionsAr: string[];
  optionsEn: string[];
  correctIndex: number;
};

function mcq(
  id: string,
  lessonId: string,
  chapterId: ChapterId,
  promptAr: string,
  promptEn: string,
  optionsAr: [string, string, string, string],
  optionsEn: [string, string, string, string],
  correctIndex: number,
): ExtraHomework {
  return { id, lessonId, chapterId, kind: "mcq", promptAr, promptEn, optionsAr, optionsEn, correctIndex };
}

function tf(
  id: string,
  lessonId: string,
  chapterId: ChapterId,
  promptAr: string,
  promptEn: string,
  truth: boolean,
): ExtraHomework {
  return {
    id,
    lessonId,
    chapterId,
    kind: "tf",
    promptAr,
    promptEn,
    optionsAr: ["صح", "غلط"],
    optionsEn: ["True", "False"],
    correctIndex: truth ? 0 : 1,
  };
}

export const EXTRA_HOMEWORK: ExtraHomework[] = [
  mcq("1-1-x1", "1-1", "1", "ما أفضل مثال على الحوسبة السحابية؟", "What is the best example of cloud computing?", ["شراء قرص صلب وتخزينه في البيت", "فتح البريد والملفات من أي جهاز عبر الإنترنت", "طباعة ورقة من معمل المدرسة", "إغلاق الواي فاي حتى لا يخرج الجهاز"], ["Buying a hard disk and keeping it at home", "Opening mail and files from any device over the Internet", "Printing a sheet in the school lab", "Turning Wi-Fi off so the device never leaves"], 1),
  mcq("1-1-x2", "1-1", "1", "سيارة تحتاج قرار فرامل في جزء من الثانية. ما الأنسب؟", "A car must decide to brake in a fraction of a second. What is best?", ["إرسال الصورة للسحابة ثم الانتظار", "معالجة الإشارة على السيارة نفسها", "طباعة التقرير بعد أسبوع", "إيقاف كل الحساسات"], ["Send the image to the cloud and wait", "Process the signal on the car itself", "Print a report after a week", "Turn every sensor off"], 1),
  mcq(
    "1-1-x5",
    "1-1",
    "1",
    "المعلم يعرض حاسوب الستينيات جنب لابتوب. ليه اللابتوب أقوى؟",
    "The teacher shows a 1960s room-sized computer next to a laptop. Why is the laptop stronger?",
    [
      "لأن الصندوق الأصغر أقوى دايمًا",
      "لأن عدد الترانزستورات على الشريحة زاد (قانون مور)",
      "لأن اللابتوب خدمة سحابية",
      "لأن الصورتين على السبورة واقع معزز",
    ],
    [
      "Because a smaller box is always stronger",
      "Because the chip now has more transistors (Moore's Law)",
      "Because a laptop is a cloud service",
      "Because two pictures on the board mean AR",
    ],
    1,
  ),
  tf("1-1-x3", "1-1", "1", "قانون مور اقترب من حد فيزيائي؛ لذلك تظهر أفكار مثل المعالجة المتوازية.", "Moore's Law is near a physical limit, so ideas like parallel processing appear.", true),
  tf("1-1-x4", "1-1", "1", "الواقع الافتراضي يضيف طبقة صغيرة فوق الشارع ولا يستبدل العالم.", "Virtual reality only adds a thin layer on the street and never replaces the world.", false),

  mcq("1-2-x1", "1-2", "1", "فلتر الرسائل المزعجة أقرب إلى أي نوع؟", "A spam filter is closest to which type?", ["ذكاء توليدي", "تعلم آلي", "واقع افتراضي", "تشفير متماثل"], ["Generative AI", "Machine learning", "Virtual reality", "Symmetric encryption"], 1),
  mcq("1-2-x2", "1-2", "1", "لماذا لا تلصق رد النموذج في تقرير المدرس كما هو؟", "Why not paste a model reply into a school report as-is?", ["لأن الرد دائمًا أقصر من المطلوب", "لأن النص قد يبدو صحيحًا وهو خطأ", "لأن النماذج ممنوعة من اللغة العربية", "لأن التقرير لا يحتاج مصادر"], ["Because the reply is always too short", "Because the text may sound right and still be wrong", "Because models cannot use Arabic", "Because a report never needs sources"], 1),
  tf("1-2-x3", "1-2", "1", "التعلم العميق جزء من التعلم الآلي، والتعلم الآلي جزء من الذكاء الاصطناعي.", "Deep learning sits inside machine learning, and machine learning sits inside AI.", true),
  tf("1-2-x4", "1-2", "1", "توليد صورة من جملة مثال على فلتر البريد المزعج.", "Generating an image from a sentence is an example of a spam filter.", false),

  mcq("1-3-x1", "1-3", "1", "معظم أنظمة الذكاء الاصطناعي اليوم من أي نوع؟", "Most AI systems today are of which type?", ["ذكاء عام يفهم كل شيء مثل الإنسان", "ذكاء ضيق يتقن مهمة واحدة فقط", "إنسان آلي بلا بيانات", "برنامج لا يحتاج أمثلة"], ["General AI that understands everything like a person", "Narrow AI that is good at one task", "A robot that needs no data", "A program that never needs examples"], 1),
  mcq("1-3-x2", "1-3", "1", "ما أفضل استخدام للذكاء الاصطناعي في المذاكرة؟", "What is the best classroom use of AI?", ["يكتب الواجب كاملًا وأنت تنام", "يسرّع البحث وأنت تراجع المصدر", "يرسل بيانات الأسرة لنموذج عام", "يستبدل حكم المدرس في كل درجة"], ["It writes the whole homework while you sleep", "It speeds research while you check the source", "It sends family data to a public model", "It replaces the teacher's judgement on every mark"], 1),
  tf("1-3-x3", "1-3", "1", "الذكاء الاصطناعي ضعيف في السياق الجديد والمسؤولية الأخلاقية.", "AI is weak on new context and moral responsibility.", true),
  tf("1-3-x4", "1-3", "1", "التحيز يظهر فقط إذا كان الحاسوب قديمًا.", "Bias appears only when the computer is old.", false),

  mcq("1-4-x1", "1-4", "1", "طالب وضع درجات زملائه في نموذج عام. ما المشكلة الأساسية؟", "A student pastes classmates' marks into a public model. What is the main problem?", ["بطء الإنترنت", "انتهاك الخصوصية", "ضعف الألوان في التقرير", "قانون مور"], ["Slow Internet", "A privacy breach", "Weak colours in the report", "Moore's Law"], 1),
  mcq("1-4-x2", "1-4", "1", "ماذا تعني المساءلة؟", "What does accountability mean?", ["لا أحد مسؤول لأن الحاسوب قرر", "وجود إنسان مسؤول عن أثر القرار", "إخفاء سبب القرار", "مشاركة كل البيانات علنًا"], ["Nobody is responsible because the computer decided", "A human stays responsible for the effect of the decision", "Hiding why the decision happened", "Publishing every data field"], 1),
  tf("1-4-x3", "1-4", "1", "القدرة التقنية لا تعني الإذن الأخلاقي.", "Technical power is not moral permission.", true),
  tf("1-4-x4", "1-4", "1", "الشفافية تعني أن النظام يقرر وأنت لا تسأل لماذا.", "Transparency means the system decides and you never ask why.", false),

  mcq("2-1-x1", "2-1", "2", "كلمة المرور مع رسالة على الهاتف مثال على ماذا؟", "A password plus a phone message is an example of what?", ["تشفير متماثل فقط", "مصادقة متعددة العوامل", "جدار حماية", "بيانات مفتوحة"], ["Symmetric encryption only", "Multi-factor authentication", "A firewall", "Open data"], 1),
  mcq("2-1-x2", "2-1", "2", "لماذا نستخدم التجزئة لكلمة المرور؟", "Why hash a password?", ["حتى نسترجع السر بسهولة", "حتى نقارن البصمة من غير حفظ السر واضحًا", "حتى نلغي المصادقة", "حتى نفتح كل الحسابات بمفتاح واحد"], ["So we can recover the secret easily", "So we compare a fingerprint without storing the secret in the clear", "So we can drop authentication", "So every account shares one key"], 1),
  tf("2-1-x3", "2-1", "2", "التشفير غير المتماثل يستخدم زوج مفاتيح: عام وخاص.", "Asymmetric encryption uses a public and a private key.", true),
  tf("2-1-x4", "2-1", "2", "كلمة المرور وحدها كافية دائمًا لحماية حساب المدرسة.", "A password alone is always enough to protect a school account.", false),

  mcq("2-2-x1", "2-2", "2", "ماذا يعني مبدأ أقل صلاحية؟", "What does least privilege mean?", ["أعطِ المدير كل الأسرار لكل الموظفين", "أعطِ كل مستخدم أقل ما يكفي لعمله", "أغلق الإنترنت عن المدرسة كلها", "احذف جدار الحماية لأنه يبطئ الشبكة"], ["Give the manager every secret for every staff member", "Give each user only what their job needs", "Cut the Internet from the whole school", "Delete the firewall because it slows the network"], 1),
  mcq("2-2-x2", "2-2", "2", "ما فائدة تقسيم الشبكة في المعمل؟", "What is a benefit of segmenting the lab network?", ["ينتشر الاختراق أسرع", "عزل الجزء المصاب حتى لا يصل للدرجات", "إلغاء التحديثات", "جعل كلمة المرور واحدة للجميع"], ["A breach spreads faster", "Isolate the infected part so it does not reach grades", "Cancel updates", "Share one password for everyone"], 1),
  tf("2-2-x3", "2-2", "2", "الأمن طبقات: إن سقطت واحدة تبقى التالية.", "Security is layered: if one layer falls the next should still stop the attacker.", true),
  tf("2-2-x4", "2-2", "2", "جدار حماية واحد يكفي ولا داعي لتحديث الأنظمة.", "One firewall is enough and systems never need updates.", false),

  mcq("2-3-x1", "2-3", "2", "ما أول قرار سيئ بعد اكتشاف برمجية خبيثة؟", "What is a bad first move after finding malware?", ["احتواء الجهاز عن الشبكة", "مسح القرص فورًا قبل أي تسجيل", "إخبار المسؤول", "حفظ وقت الاكتشاف"], ["Isolate the machine from the network", "Wipe the disk immediately before any record", "Tell the person in charge", "Note the time of discovery"], 1),
  mcq("2-3-x2", "2-3", "2", "ماذا تشمل إدارة المخاطر؟", "What does risk management include?", ["تجاهل كل خطر نادر", "تحديد الخطر ثم قبوله أو تخفيفه أو نقله", "إخفاء الحادث عن الإدارة", "فتح كل المنافذ"], ["Ignore every rare risk", "Identify the risk then accept, reduce, or transfer it", "Hide the incident from leadership", "Open every port"], 1),
  tf("2-3-x3", "2-3", "2", "بعد التعافي نسأل: ما الذي فشل في التصميم؟", "After recovery we ask: what failed in the design?", true),
  tf("2-3-x4", "2-3", "2", "إخفاء الحادث يوفّر الوقت ويقلل الضرر.", "Hiding an incident saves time and shrinks the damage.", false),

  mcq("3-1-x1", "3-1", "3", "أين نضع مفتاح واجهة برمجة سري؟", "Where should a secret API key live?", ["داخل جافاسكربت الصفحة", "على الخادم بعيدًا عن المتصفح", "في تعليق HTML", "في اسم الصف"], ["Inside page JavaScript", "On the server, away from the browser", "In an HTML comment", "In the class name"], 1),
  mcq("3-1-x2", "3-1", "3", "ما دور المتصفح في نموذج العميل والخادم؟", "In client–server, what does the browser do?", ["يحفظ كل الدرجات سرًا على القرص الداخلي للمدرسة فقط", "يطلب، والخادم يرد ويقرر", "يمنع أي قاعدة بيانات", "يستبدل HTTPS"], ["Stores every grade only on the school internal disk", "Asks, and the server replies and decides", "Forbids any database", "Replaces HTTPS"], 1),
  tf("3-1-x3", "3-1", "3", "فصل الواجهة عن الخادم يسهّل أن يعمل فريقان معًا.", "Splitting frontend and backend makes it easier for two teams to work.", true),
  tf("3-1-x4", "3-1", "3", "قاعدة البيانات جزء مما يراه المستخدم في المتصفح مباشرة.", "The database is what the user sees directly in the browser.", false),

  mcq("3-2-x1", "3-2", "3", "ماذا يعني رمز 404؟", "What does status 404 mean?", ["نجاح كامل", "المورد غير موجود", "الخادم انهار", "الطلب يحتاج كلمة مرور فقط"], ["Full success", "The resource was not found", "The server crashed", "The request only needs a password"], 1),
  mcq("3-2-x2", "3-2", "3", "لماذا نفضّل HTTPS على HTTP؟", "Why prefer HTTPS over HTTP?", ["لأنه أقصر في الكتابة", "لأن القناة مشفّرة", "لأنه يلغي الحاجة لكلمة مرور", "لأنه يمنع قواعد البيانات"], ["Because it is shorter to type", "Because the channel is encrypted", "Because it removes the need for a password", "Because it bans databases"], 1),
  tf("3-2-x3", "3-2", "3", "GET للقراءة وPOST للإنشاء من الطرق الشائعة.", "GET to read and POST to create are common methods.", true),
  tf("3-2-x4", "3-2", "3", "رمز 200 يعني أن الخادم لم يجد الصفحة.", "Status 200 means the server did not find the page.", false),

  mcq("3-3-x1", "3-3", "3", "ماذا يعطي HTML في الصفحة؟", "What does HTML give on a page?", ["الألوان فقط", "الهيكل والمعنى", "كلمة مرور الخادم", "ضغط الفيديو"], ["Colours only", "Structure and meaning", "The server password", "Video compression"], 1),
  mcq("3-3-x2", "3-3", "3", "ما اختبار الإتاحة البسيط؟", "What is a simple accessibility test?", ["استخدام الفأرة فقط", "تجربة الصفحة بلوحة المفاتيح", "حذف العناوين", "تكبير الصور من غير نص بديل"], ["Use the mouse only", "Try the page with a keyboard", "Delete the headings", "Enlarge images with no alt text"], 1),
  tf("3-3-x3", "3-3", "3", "CSS مسؤول عن المظهر والتجاوب.", "CSS is responsible for look and responsiveness.", true),
  tf("3-3-x4", "3-3", "3", "الأفضل أن تكون كل عناصر الصفحة <div> بلا معنى.", "It is best if every element is a meaningless <div>.", false),

  mcq("4-1-x1", "4-1", "4", "ماذا تفعل صورة ضخمة غير مضغوطة على شبكة ضعيفة؟", "What does a huge uncompressed image do on a weak network?", ["لا تغيّر شيئًا", "تبطئ فتح الصفحة", "تحسّن الإتاحة تلقائيًا", "تغني عن النص البديل"], ["Changes nothing", "Slows the page", "Automatically improves accessibility", "Replaces alt text"], 1),
  mcq("4-1-x2", "4-1", "4", "ما دور النص البديل للصورة؟", "What is the job of alt text for an image?", ["زينة اختيارية", "واجب لمن يستخدم قارئ الشاشة", "بديل عن ضغط الملف", "عنوان الموقع فقط"], ["Optional decoration", "A duty for someone using a screen reader", "A substitute for compression", "Only the site title"], 1),
  tf("4-1-x3", "4-1", "4", "الوسيط يُختار حسب الرسالة: جدول للأرقام وفيديو للحركة.", "Pick the medium for the message: a table for numbers, video for motion.", true),
  tf("4-1-x4", "4-1", "4", "ضغط الملفات ممنوع لأنه يحذف المعنى دائمًا.", "Compression is forbidden because it always deletes meaning.", false),

  mcq("4-2-x1", "4-2", "4", "تجربة المستخدم تهتم بماذا؟", "What does UX care about?", ["لون الشعار فقط", "هل يصل المستخدم لهدفه بسهولة", "سرعة المعالج في المعمل", "عدد صفحات الكتاب"], ["Logo colour only", "Whether the user reaches the goal easily", "CPU speed in the lab", "How many book pages there are"], 1),
  mcq("4-2-x2", "4-2", "4", "ما أفضل اختبار سريع لوضوح الموقع؟", "What is a fast test of site clarity?", ["راقب زميلًا صامتًا أين يتوه", "غيّر الألوان كل دقيقة", "اخفِ الزر الرئيسي", "أزل العناوين"], ["Watch a silent classmate and see where they get lost", "Change colours every minute", "Hide the main button", "Remove headings"], 0),
  tf("4-2-x3", "4-2", "4", "الاتساق في مكان القائمة أهم من مفاجأة شكل جديد كل صفحة.", "A consistent menu place beats a surprise layout on every page.", true),
  tf("4-2-x4", "4-2", "4", "واجهة المستخدم UI هي سهولة الرحلة، وتجربة المستخدم UX هي شكل الزر فقط.", "UI is the journey ease, and UX is only the button look.", false),

  mcq("4-3-x1", "4-3", "4", "ماذا يعني اختبار أ/ب؟", "What does an A/B test mean?", ["نختار الأجمل بالذوق فقط", "نقارن نسختين ونقيس أيهما أفضل", "نحذف الموقع أسبوعًا", "نعتمد أول رسم نراه"], ["We pick the prettier one by taste only", "We compare two versions and measure which works", "We take the site down for a week", "We trust the first chart we see"], 1),
  mcq("4-3-x2", "4-3", "4", "ما معيار تقييم موقع تسجيل الحضور؟", "What is a good measure for an attendance site?", ["ذوق المصمم وحده", "زمن إتمام المهمة وعدد الأخطاء", "عدد الخطوط الغريبة", "حجم الشعار"], ["The designer's taste alone", "Task time and number of errors", "How many fancy fonts it uses", "Logo size"], 1),
  tf("4-3-x3", "4-3", "4", "إتاحة الوصول جزء من التقييم لا ملحق في الآخر.", "Accessibility is part of the score, not an appendix.", true),
  tf("4-3-x4", "4-3", "4", "التقييم انطباع عابر ولا يحتاج قياسًا.", "Evaluation is a passing impression and needs no measurement.", false),

  mcq("4-4-x1", "4-4", "4", "لماذا نغيّر شيئًا واحدًا في كل دورة تحسين؟", "Why change one thing per improvement cycle?", ["حتى لا نعرف السبب", "حتى نعرف أي تغيير صنع الفرق", "حتى نطيل المشروع بلا هدف", "حتى نلغي الاختبار"], ["So we never know the cause", "So we know which change made the difference", "So the project lasts with no goal", "So we can skip testing"], 1),
  mcq("4-4-x2", "4-4", "4", "ما النموذج الأولي؟", "What is a prototype?", ["النسخة النهائية الغالية", "نسخة رخيصة سريعة للاختبار", "ملف PDF للكتاب", "جدار الحماية"], ["The expensive final version", "A cheap, fast version used to test", "The book PDF", "The firewall"], 1),
  tf("4-4-x3", "4-4", "4", "وثّق القرار: لماذا نقلنا الزر؟ أي دليل؟", "Record the decision: why did we move the button? What evidence?", true),
  tf("4-4-x4", "4-4", "4", "الموقع يُنشر مرة ثم لا يُراجع أين يغادر الزائر.", "A site is published once and nobody checks where visitors leave.", false),

  mcq("5-1-x1", "5-1", "5", "استطلاع على مجموعة واتساب واحدة فقط يعاني غالبًا من ماذا؟", "A poll only in one WhatsApp group often suffers from what?", ["عينة عشوائية كاملة", "تحيز العينة", "بيانات أولية ممنوعة", "انحدار خطي"], ["A full random sample", "Sampling bias", "Forbidden primary data", "Linear regression"], 1),
  mcq("5-1-x2", "5-1", "5", "بيانات تجمعها أنت لبحث الحصة تُسمّى ماذا؟", "Data you gather yourself for a class project is called what?", ["بيانات ثانوية", "بيانات أولية", "بيانات مفتوحة حتمًا", "هلوسة"], ["Secondary data", "Primary data", "Always open data", "A hallucination"], 1),
  tf("5-1-x3", "5-1", "5", "إن فسد جمع البيانات فالحساب الأنيق لن يصحّح النتيجة.", "If collection is bad, neat maths will not save the result.", true),
  tf("5-1-x4", "5-1", "5", "أسهل ناس تلاقيهم في الشارع هم دائمًا صورة المجتمع كله.", "The easiest people to meet on the street are always a picture of the whole population.", false),

  mcq("5-2-x1", "5-2", "5", "إذا وُجدت خلية فارغة في جدول الدرجات، ماذا تفعل؟", "If a marks table has a blank cell, what do you do?", ["نحذف الصف دائمًا من غير تفكير", "نقرر حسب المعنى: حذف أو ملء أو تعليم", "نضع صفرًا دائمًا", "نترك الجدول من غير توحيد للتاريخ"], ["Always delete the row without thinking", "Decide by meaning: delete, fill, or flag", "Always write zero", "Leave dates in mixed formats"], 1),
  mcq("5-2-x2", "5-2", "5", "ماذا نسمّي قيمة بعيدة جدًا عن الباقي؟", "What do we call a value far from the rest?", ["متوسط", "قيمة شاذة قد تكون خطأ أو حقيقة نادرة", "واجهة برمجة", "جدار حماية"], ["A mean", "An outlier that may be an error or a rare truth", "An API", "A firewall"], 1),
  tf("5-2-x3", "5-2", "5", "مدخلات سيئة تعطي مخرجات سيئة حتى لو كان الحساب أنيقًا.", "Bad inputs give bad outputs even when the maths looks neat.", true),
  tf("5-2-x4", "5-2", "5", "توحيد كتابة التاريخ قبل الجمع خطوة يمكن تأجيلها دائمًا.", "Unifying date spellings before a total can always wait.", false),

  mcq("5-3-x1", "5-3", "5", "قبل استخدام بيانات حكومية مفتوحة في التقرير، ماذا تفعل؟", "Before using open government data in a report, what do you do?", ["لا تذكر المصدر حتى يبدو البحث أصليًا", "راجع الترخيص وتاريخ التحديث", "انسخ الرقم من غير سؤال", "افترض أنها بلا تحيز"], ["Hide the source so the research looks original", "Check the licence and the update date", "Copy the number with no question", "Assume it has no bias"], 1),
  mcq("5-3-x2", "5-3", "5", "لماذا تكون واجهة البرمجة مفيدة؟", "Why is an API useful?", ["يعطيك ملفًا قديمًا فقط", "يجلب شريحة محدّثة وفق عقد واضح", "يحذف الخصوصية تلقائيًا", "يغني عن توثيق المصدر"], ["It only gives an old file", "It fetches a fresh slice under a clear contract", "It automatically deletes privacy", "It replaces citing the source"], 1),
  tf("5-3-x3", "5-3", "5", "المصدر المفتوح يحتاج سؤالًا عن التحيز مثل استطلاعك.", "Open data still needs questions about bias, like your own survey.", true),
  tf("5-3-x4", "5-3", "5", "الملف المحمّل السنة الماضية أحدث دائمًا من واجهة برمجة حية.", "A file downloaded last year is always fresher than a live API.", false),

  mcq("6-1-x1", "6-1", "6", "ماذا يعني ارتباط قوي بين ساعات المذاكرة والدرجة؟", "What does a strong link between study hours and marks mean?", ["الساعات سبب الدرجة قطعًا", "العلاقتان تتحركان معًا، والسبب يحتاج دليلًا آخر", "العينة بلا فائدة", "الرسم دائرة حتمًا"], ["Hours certainly cause the mark", "The two move together; cause needs more evidence", "The sample is useless", "The chart must be a pie"], 1),
  mcq("6-1-x2", "6-1", "6", "عند وجود درجة شاذة عالية جدًا، ماذا تفعل؟", "When one mark is extremely high, what do you do?", ["المتوسط يكفي وحده", "انظر الوسيط أيضًا", "احذف الإحصاء كله", "أعلن النتيجة من غير عينة"], ["The mean is enough alone", "Look at the median too", "Delete all statistics", "Announce a result with no sample"], 1),
  tf("6-1-x3", "6-1", "6", "عينة صغيرة تعطي غالبًا فترة ثقة أوسع.", "A small sample usually gives a wider confidence interval.", true),
  tf("6-1-x4", "6-1", "6", "الفرضية ادعاء نثبته بالشعور قبل البيانات.", "A hypothesis is a claim we prove by feeling before data.", false),

  mcq("6-2-x1", "6-2", "6", "متى ترفض الخط المستقيم؟", "When should you reject a straight line?", ["عندما تتوقع اتجاهًا واضحًا", "عندما تكون النقاط سحابة بلا شكل", "عندما تكون البواقي صغيرة", "عندما يكون المتغير التفسيري منطقيًا"], ["When you expect a clear trend", "When the points are a shapeless cloud", "When residuals are small", "When the explanatory variable makes sense"], 1),
  mcq("6-2-x2", "6-2", "6", "التنبؤ بدرجة طالب خارج مدى بيانات التدريب يُعد ماذا؟", "Predicting a mark far outside the training range is what?", ["آمنًا دائمًا", "استكمالًا خطرًا", "يثبت السببية", "يغني عن البواقي"], ["Always safe", "A risky extrapolation", "Proves cause", "Replaces residuals"], 1),
  tf("6-2-x3", "6-2", "6", "البواقي الكبيرة تعني أن الخط ضعيف.", "Large residuals mean the line is weak.", true),
  tf("6-2-x4", "6-2", "6", "الخط برهان أن س يسبب ص.", "The line proves that X causes Y.", false),

  mcq("6-3-x1", "6-3", "6", "ما أفضل رسم لعدد الغياب أسبوعيًا عبر الترم؟", "What is the best chart for weekly absences across the term?", ["دائرة بعشرين شريحة", "خط زمني", "نص من غير أرقام", "صورة المدرس"], ["A pie with twenty slices", "A line over time", "Text with no numbers", "The teacher's photo"], 1),
  mcq("6-3-x2", "6-3", "6", "قطع المحور الرأسي ليظهر فرقًا تافهًا يُعد ماذا؟", "Cropping the y-axis to show a tiny gap is what?", ["ممارسة صادقة", "تضخيم مضلل", "واجب في كل رسم", "بديل عن ذكر المصدر"], ["Honest practice", "Misleading exaggeration", "Required on every chart", "A substitute for citing the source"], 1),
  tf("6-3-x3", "6-3", "6", "عنوان الرسم يقول الادعاء، مع تسمية المحاور وذكر المصدر.", "The title states the claim, with labelled axes and a source.", true),
  tf("6-3-x4", "6-3", "6", "الدائرة أفضل اختيار كلما زادت الشرائح عن عشرين.", "A pie is the best choice once there are more than twenty slices.", false),

  mcq("7-1-x1", "7-1", "7", "التنبؤ إن كان الطالب ناجحًا أو راسبًا أقرب إلى أي نوع؟", "Predicting whether a student is pass or fail is closer to which type?", ["انحدار", "تصنيف", "ضغط ملفات", "جدار حماية"], ["Regression", "Classification", "Compression", "A firewall"], 1),
  mcq("7-1-x2", "7-1", "7", "ماذا يحدث إن اختبرت النموذج على بيانات التدريب فقط؟", "What happens if you test a model only on its training data?", ["تقدير صادق دائمًا", "درجة متفائلة كاذبة غالبًا", "تعلم بلا إشراف", "هلوسة لغوية"], ["Always an honest estimate", "Often a falsely optimistic score", "Unsupervised learning", "A language hallucination"], 1),
  tf("7-1-x3", "7-1", "7", "التعلم بإشراف يحتاج أمثلة معلّمة: مدخل ومخرج معروف.", "Supervised learning needs labeled examples: known input and output.", true),
  tf("7-1-x4", "7-1", "7", "إن أطعمته بيانات منحازة يخرج حكمًا عادلًا تلقائيًا.", "If you feed it biased data it automatically outputs a fair judgement.", false),

  mcq("7-2-x1", "7-2", "7", "التعلم في الشبكة العصبية يعدّل أساسًا ماذا؟", "Learning in a neural net mainly adjusts what?", ["ألوان الموقع", "الأوزان", "رمز 404", "رخصة البيانات المفتوحة"], ["Site colours", "Weights", "Status 404", "An open-data licence"], 1),
  mcq("7-2-x2", "7-2", "7", "متى يكون الصندوق الأسود مشكلة كبيرة؟", "When is a black box a serious problem?", ["عند اختيار لون الزر", "عندما يمس القرار حياة إنسان", "عند ضغط صورة", "عند رسم أعمدة"], ["When picking a button colour", "When the decision touches a human life", "When compressing an image", "When drawing bars"], 1),
  tf("7-2-x3", "7-2", "7", "التعلم العميق يحتاج عادة بيانات أكبر من مسألة خطية صغيرة.", "Deep learning usually needs more data than a small linear problem.", true),
  tf("7-2-x4", "7-2", "7", "الشبكة دائمًا الخيار الأول لأي جدول من عشر صفوف.", "A deep net is always the first choice for a ten-row table.", false),

  mcq("7-3-x1", "7-3", "7", "ماذا تعني هلوسة النموذج؟", "What does a model hallucination mean?", ["الجهاز سخن", "جملة فصيحة قد تكون بلا سند", "الطالب غاب", "الرسم مقطوع المحور"], ["The machine overheated", "Fluent text that may have no grounding", "The student was absent", "The chart axis was cropped"], 1),
  mcq("7-3-x2", "7-3", "7", "ما الاستخدام السليم لنموذج اللغة في الواجب؟", "What is a sound use of a language model for homework?", ["لصق الإجابة النهائية من غير فهم", "شرح الفكرة ثم إغلاقه والكتابة أنت", "إرسال صورة البطاقة", "نشر درجات الزملاء"], ["Paste the final answer with no understanding", "Let it explain, then close it and write yourself", "Send it an ID photo", "Publish classmates' marks"], 1),
  tf("7-3-x3", "7-3", "7", "النموذج يحسب أرجح تكملة؛ لا «يعرف» كالإنسان.", "The model scores the next likely token; it does not «know» as a person does.", true),
  tf("7-3-x4", "7-3", "7", "اللغة السلسة دليل كافٍ أن الجملة صحيحة.", "Fluent language is enough proof that a sentence is true.", false),
];
