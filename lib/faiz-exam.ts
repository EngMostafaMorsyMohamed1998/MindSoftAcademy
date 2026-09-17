import { FAIZ_PAPER_ID } from "@/lib/faiz";
import { shuffled } from "@/lib/shuffle";
import type { ChapterExam, EssayQuestion, ObjectiveQuestion } from "@/lib/exams";

const FAIZ_OBJECTIVE_COUNT = 48;
const FAIZ_ESSAY_COUNT = 2;

function mcq(
  id: string,
  promptAr: string,
  promptEn: string,
  optionsAr: [string, string, string, string],
  optionsEn: [string, string, string, string],
  correctIndex: 0 | 1 | 2 | 3,
): ObjectiveQuestion {
  return { id, kind: "mcq", promptAr, promptEn, optionsAr, optionsEn, correctIndex, points: 1 };
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

const FAIZ_OBJECTIVES: ObjectiveQuestion[] = [
  mcq("faiz-1", "أي ترتيب يصف تطور تقنية المعلومات بشكل أصح؟", "Which order best describes the development of IT?", ["الهاتف الذكي ثم الحاسوب ثم الإنترنت", "الحاسوب ثم الإنترنت ثم الهواتف المحمولة ثم السحابة", "السحابة ثم الإنترنت ثم الحاسوب", "الإنترنت ثم الآلة الكاتبة ثم الحاسوب"], ["Smartphone then computer then Internet", "Computer then Internet then mobile phones then cloud", "Cloud then Internet then computer", "Internet then typewriter then computer"], 1),
  mcq("faiz-2", "الذكاء الاصطناعي في أبسط تعريف هو:", "Artificial intelligence, in its simplest definition, is:", ["روبوت يشبه الإنسان فقط", "قدرة الآلة على أداء مهام تحتاج عادة ذكاءً بشريًا", "برنامج يحفظ الدرجات", "شبكة واي فاي سريعة"], ["A human-looking robot only", "A machine’s ability to do tasks that usually need human intelligence", "A program that stores grades", "A fast Wi-Fi network"], 1),
  mcq("faiz-3", "العلاقة الصحيحة:", "The correct relationship is:", ["التعلم العميق جزء من التعلم الآلي، والتعلم الآلي جزء من الذكاء الاصطناعي", "الذكاء الاصطناعي جزء من التعلم العميق فقط", "التعلم الآلي والذكاء الاصطناعي مترادفان دائمًا", "التعلم العميق لا علاقة له بالذكاء الاصطناعي"], ["Deep learning is part of machine learning, which is part of AI", "AI is only a part of deep learning", "Machine learning and AI are always synonyms", "Deep learning is unrelated to AI"], 0),
  mcq("faiz-4", "التعلم الآلي يعتمد أساسًا على:", "Machine learning mainly depends on:", ["حفظ جملة واحدة في الكتاب", "أمثلة وبيانات يتعلم منها النموذج نمطًا", "إيقاف الإنترنت", "تغيير لون الشاشة"], ["Memorising one sentence from the book", "Examples and data from which the model learns a pattern", "Turning the Internet off", "Changing the screen colour"], 1),
  mcq("faiz-5", "التعلم العميق يتميز بأنه:", "Deep learning is characterised by:", ["طبقات كثيرة من العصبونات الاصطناعية", "زر واحد في الآلة الحاسبة", "جدول درجات الورق", "كابل شبكة فقط"], ["Many layers of artificial neurons", "One button on a calculator", "A paper grade sheet", "A network cable only"], 0),
  mcq("faiz-6", "الذكاء التوليدي ينتج غالبًا:", "Generative AI often produces:", ["نصًا أو صورة أو صوتًا جديدًا من أنماط سابقة", "فاتورة كهرباء", "ختم وزارة", "قرص صلب فارغ"], ["New text, image, or audio from earlier patterns", "An electricity bill", "A ministry stamp", "An empty hard disk"], 0),
  mcq("faiz-7", "مثال يومي صحيح على الذكاء الاصطناعي:", "A valid everyday example of AI is:", ["مقترح فيديوهات حسب مشاهداتك", "ممحاة على المكتب", "سبورة طباشير", "مفتاح الفصل"], ["Video suggestions based on what you watched", "An eraser on the desk", "A chalk board", "The classroom key"], 0),
  mcq("faiz-8", "في الصناعة، يُستخدم الذكاء الاصطناعي غالبًا لـ:", "In industry, AI is often used to:", ["فرز العيوب أو توقع العطل قبل حدوثه", "استبدال المدير قانونيًا", "إلغاء الصيانة كلها", "إطفاء المصنع نهائيًا"], ["Spot defects or predict a fault before it happens", "Replace the manager legally", "Cancel all maintenance", "Shut the factory forever"], 0),
  mcq("faiz-9", "قضية أخلاقية أساسية مع الذكاء الاصطناعي:", "A core ethical issue with AI is:", ["التحيز في البيانات يظلم فئة من الناس", "لون أيقونة التطبيق", "سمك غلاف الكتاب", "طول الكابل"], ["Bias in the data can harm a group of people", "The app icon colour", "The book cover thickness", "The cable length"], 0),
  mcq("faiz-10", "لماذا نراجع إجابة المساعد الذكي من الكتاب؟", "Why check an AI helper’s answer against the book?", ["لأنه قد يهلوس ويكتب معلومة شكلها صحيح وهي غلط", "لأن الكتاب ممنوع", "لأن النموذج لا يخطئ أبدًا", "لأن المراجعة تضيع الوقت فقط"], ["It may hallucinate and write something that looks right but is wrong", "Because the book is forbidden", "Because the model never errs", "Because checking only wastes time"], 0),
  mcq("faiz-11", "الخصوصية تعني:", "Privacy means:", ["عدم جمع أو نشر بيانات شخصية بلا حاجة وموافقة", "نشر كشف الأسماء في الجروب", "تصوير كراسات الزملاء", "مشاركة الرقم السري"], ["Not collecting or sharing personal data without need and consent", "Posting the name list in the group", "Photographing classmates’ notebooks", "Sharing the secret PIN"], 0),
  mcq("faiz-12", "التحول الاجتماعي مع التقنية يظهر حين:", "Social transformation with technology appears when:", ["تتغير طريقة العمل والتعلم والتواصل بسبب أدوات جديدة", "نشتري سبورة فقط", "نغلق المدرسة", "نلغي القراءة"], ["Work, learning, and communication change because of new tools", "We only buy a whiteboard", "We close the school", "We cancel reading"], 0),
  mcq("faiz-13", "التشفير هدفه الأساسي:", "The main goal of encryption is:", ["جعل الرسالة غير مفهومة لمن لا يملك المفتاح", "تلوين الشاشة", "تسريع المروحة", "زيادة حجم الملف عشوائيًا"], ["Make the message unreadable to anyone without the key", "Colour the screen", "Speed up the fan", "Increase file size at random"], 0),
  mcq("faiz-14", "المصادقة تجيب عن سؤال:", "Authentication answers the question:", ["هل أنت حقًا من تدّعي؟", "ما لون القميص؟", "كم سعر الاشتراك؟", "أين السبورة؟"], ["Are you really who you claim to be?", "What colour is the shirt?", "How much is the fee?", "Where is the board?"], 0),
  mcq("faiz-15", "كلمة مرور قوية غالبًا:", "A strong password is usually:", ["طويلة ومتنوعة وغير مستخدمة في مواقع تانية", "123456", "اسم الطالب فقط", "سنة الميلاد وحدها"], ["Long, mixed, and not reused on other sites", "123456", "The student name only", "The birth year alone"], 0),
  mcq("faiz-16", "المصادقة بعاملين تعني:", "Two-factor authentication means:", ["شيء تعرفه + شيء تملكه أو أنت عليه", "كلمتين مرور متطابقتين فقط", "إغلاق الهاتف", "إيقاف الواي فاي"], ["Something you know plus something you have or are", "Two identical passwords only", "Locking the phone", "Turning Wi-Fi off"], 0),
  mcq("faiz-17", "جدار الحماية (Firewall) يعمل على:", "A firewall works by:", ["فلترة حركة الشبكة حسب قواعد مسموحة وممنوعة", "طباعة الملزمة", "شحن البطارية", "تصحيح الإملاء"], ["Filtering network traffic by allow/deny rules", "Printing the booklet", "Charging the battery", "Correcting spelling"], 0),
  mcq("faiz-18", "عند اكتشاف حادثة سيبرانية أول خطوة صحيحة:", "After spotting a cyber incident, a correct first step is:", ["احتواء الضرر وتسجيل ما حدث ثم الإبلاغ حسب الخطة", "مسح كل الأدلة فورًا", "نشر الخبر في جروب الصف", "تجاهل الأمر لأنه محرج"], ["Contain the damage, record what happened, then report per the plan", "Wipe all evidence immediately", "Post the news in the class group", "Ignore it because it is embarrassing"], 0),
  mcq("faiz-19", "التصيد (Phishing) يعتمد على:", "Phishing relies on:", ["خداع المستخدم ليفتح رابطًا أو يعطي بياناته", "تحديث رسمي من الوزارة فقط", "كسر الباب الحديدي", "عطل المروحة"], ["Tricking the user into opening a link or giving data", "An official ministry update only", "Breaking an iron door", "A fan fault"], 0),
  mcq("faiz-20", "إدارة المخاطر تعني:", "Risk management means:", ["تحديد التهديد واحتماله وأثره ثم معالجته أو قبوله بوعي", "إغلاق المعمل إلى الأبد", "حذف المنهج", "منع الطلاب من الدراسة"], ["Identify a threat, its likelihood and impact, then treat or accept it knowingly", "Close the lab forever", "Delete the syllabus", "Stop students from studying"], 0),
  mcq("faiz-21", "النسخ الاحتياطي يحمي من:", "Backups protect against:", ["فقدان البيانات بعد عطل أو هجوم", "لون الخط", "بطء الممحاة", "طول الحصة"], ["Losing data after a fault or attack", "Font colour", "A slow eraser", "A long class"], 0),
  mcq("faiz-22", "في تصميم أمن الشبكة نفصل غالبًا:", "In secure network design we often separate:", ["الشبكة الداخلية عن الضيوف وعن الأجهزة الحساسة", "كل الطلاب في باسورد واحد", "الإنترنت عن الكهرباء فقط", "السبورة عن الطباشير"], ["The internal network from guests and from sensitive devices", "All students on one password", "The Internet from electricity only", "The board from the chalk"], 0),
  mcq("faiz-23", "تطبيق الويب يتكون أساسًا من:", "A web application is mainly made of:", ["واجهة أمامية + خادم/خلفية + بيانات", "طابعة فقط", "كابل HDMI", "سبورة ذكية بلا متصفح"], ["A frontend + a server/backend + data", "A printer only", "An HDMI cable", "A smart board with no browser"], 0),
  mcq("faiz-24", "المتصفح في تطبيق الويب هو مكان:", "In a web app the browser is where:", ["الواجهة الأمامية تعمل أمام المستخدم", "قاعدة البيانات تُحفظ للأبد فقط", "نظام التشغيل يُحذف", "الكهرباء تُولَّد"], ["The frontend runs in front of the user", "The database is stored forever only", "The OS is deleted", "Electricity is generated"], 0),
  mcq("faiz-25", "HTTP هو:", "HTTP is:", ["بروتوكول تواصل بين المتصفح والخادم", "لغة تلوين فقط", "نوع بطارية", "اسم طابعة"], ["A communication protocol between browser and server", "A colouring language only", "A battery type", "A printer name"], 0),
  mcq("faiz-26", "طلب GET يستخدم عادة لـ:", "A GET request is usually used to:", ["جلب صفحة أو بيانات بلا تغيير مقصود على الخادم", "حذف قاعدة البيانات", "إطفاء الراوتر", "طباعة الشهادة"], ["Fetch a page or data without intending to change the server", "Delete the database", "Turn the router off", "Print the certificate"], 0),
  mcq("faiz-27", "طلب POST يستخدم عادة لـ:", "A POST request is usually used to:", ["إرسال بيانات ليُنشئ الخادم شيئًا أو يعالجه", "قراءة الوقت فقط", "تغيير لون الكابل", "قياس الحرارة"], ["Send data so the server can create or process something", "Read the time only", "Change the cable colour", "Measure temperature"], 0),
  mcq("faiz-28", "HTML يصف:", "HTML describes:", ["بنية الصفحة: عناوين وفقرات وروابط", "سرعة المعالج", "حجم الرام", "حرارة الغرفة"], ["The page structure: headings, paragraphs, and links", "CPU speed", "RAM size", "Room temperature"], 0),
  mcq("faiz-29", "CSS يتحكم في:", "CSS controls:", ["شكل الصفحة: الألوان والخطوط والتنسيق", "كلمة مرور الراوتر", "سعة البطارية", "اسم الطالب في الكشف"], ["The page look: colours, fonts, and layout", "The router password", "Battery capacity", "The student name on the register"], 0),
  mcq("faiz-30", "JavaScript في الواجهة الأمامية يجعل الصفحة:", "Frontend JavaScript makes the page:", ["تتفاعل بعد التحميل: قوائم، تحقق، تحديث جزء منها", "كتابًا مطبوعًا فقط", "كبل شبكة", "امتحانًا ورقيًا"], ["Interactive after load: menus, checks, partial updates", "A printed book only", "A network cable", "A paper exam"], 0),
  mcq("faiz-31", "واجهة برمجة التطبيقات (API) تفيد في:", "An API is useful for:", ["طلب بيانات أو خدمة من نظام آخر بطريقة متفق عليها", "طلاء الحائط", "قص الورق", "شحن القلم"], ["Requesting data or a service from another system in an agreed way", "Painting the wall", "Cutting paper", "Charging the pen"], 0),
  mcq("faiz-32", "فصل الواجهة عن الخادم يفيد لأنه:", "Separating frontend from backend helps because:", ["يمكن تطوير كل جزء وتأمينه وتوسيعه بشكل أوضح", "يمنع أي تحديث", "يلغي الحاجة لكلمة مرور", "يحذف قاعدة البيانات تلقائيًا"], ["Each part can be developed, secured, and scaled more clearly", "It blocks any update", "It removes the need for a password", "It deletes the database automatically"], 0),
  mcq("faiz-33", "ملف صورة JPEG مناسب غالبًا لـ:", "A JPEG image is usually suitable for:", ["صور فوتوغرافية بتفاصيل كثيرة", "شعار يحتاج شفافية حادة", "ملف صوتي", "جدول درجات"], ["Photographs with lots of detail", "A logo that needs sharp transparency", "An audio file", "A grade table"], 0),
  mcq("faiz-34", "صيغة PNG مفيدة عندما:", "PNG is useful when:", ["تحتاج شفافية وحواف أوضح للرسوم", "تريد أغنية", "تريد فيديو طويل فقط", "تريد كلمة مرور"], ["You need transparency and clearer edges for graphics", "You want a song", "You want a long video only", "You want a password"], 0),
  mcq("faiz-35", "تجربة المستخدم (UX) تهتم بـ:", "User experience (UX) cares about:", ["سهولة الوصول للمطلوب ووضوح الخطوات وراحة الاستخدام", "لون السبورة في المعمل فقط", "سعر الكابل", "ارتفاع السقف"], ["How easily the user reaches the goal, how clear the steps are, and how comfortable it feels", "Only the lab board colour", "Cable price", "Ceiling height"], 0),
  mcq("faiz-36", "تصميم المعلومات الجيد يعني:", "Good information design means:", ["ترتيب المحتوى بحيث يُفهم بسرعة ويُوجد المطلوب", "حشر كل النصوص في فقرة واحدة", "إخفاء القائمة", "تصغير الخط لأصغر حجم"], ["Arranging content so it is understood quickly and what is needed can be found", "Cramming all text into one paragraph", "Hiding the menu", "Making the font as small as possible"], 0),
  mcq("faiz-37", "إمكانية الوصول (Accessibility) تشمل:", "Accessibility includes:", ["نص بديل للصور وتباين كافٍ وإمكانية استخدام لوحة المفاتيح", "منع ضعاف البصر من الموقع", "إزالة العناوين", "تشغيل صوت عالٍ إجبارًا"], ["Alt text for images, enough contrast, and keyboard use", "Banning visually impaired users from the site", "Removing headings", "Forcing loud sound"], 0),
  mcq("faiz-38", "تقييم موقع إلكتروني يمكن أن يعتمد على:", "Evaluating a website can rely on:", ["اختبار مهام حقيقية مع مستخدمين وملاحظة أين يتعثرون", "لون حذاء المصمم", "طول اسم النطاق فقط", "عدد الكراسي في المعمل"], ["Testing real tasks with users and watching where they struggle", "The designer’s shoe colour", "Domain name length only", "The number of chairs in the lab"], 0),
  mcq("faiz-39", "التحسين التكراري يعني:", "Iterative improvement means:", ["نجرّب، نقيس، نعدّل، ونعيد الدورة", "نصمّم مرة ونقفل الملف للأبد", "نمنع أي ملاحظة", "نحذف الموقع بعد يوم"], ["Try, measure, adjust, and repeat the cycle", "Design once and lock the file forever", "Block any feedback", "Delete the site after one day"], 0),
  mcq("faiz-40", "وسائط الفيديو تحتاج غالبًا إلى:", "Video media often needs:", ["ضغط مناسب حتى لا يثقل التحميل مع بقاء الجودة مقبولة", "تحويلها إلى كلمة مرور", "طباعتها على ورق A4 فقط", "حذف الصوت دائمًا"], ["Sensible compression so loading is not heavy while quality stays acceptable", "Turning it into a password", "Printing it on A4 only", "Always deleting the audio"], 0),
  mcq("faiz-41", "النص المكتوب وسيط مناسب عندما:", "Written text is a suitable medium when:", ["المعلومة تحتاج دقة ومراجعة ورجوع سريع", "نريد أغنية فقط", "نريد ظلًا متحركًا بلا معنى", "نريد إخفاء التعليمات"], ["The information needs accuracy, review, and quick lookup", "We only want a song", "We want a moving shadow with no meaning", "We want to hide the instructions"], 0),
  mcq("faiz-42", "اختيار الرسم البياني الصحيح يعتمد على:", "Choosing the right chart depends on:", ["نوع السؤال: مقارنة، جزء من كل، أم تغيّر عبر الزمن", "أجمل لون عند الطالب", "أول أيقونة في البرنامج", "ارتفاع الشاشة فقط"], ["The kind of question: comparison, part-to-whole, or change over time", "The student’s favourite colour", "The first icon in the program", "Screen height only"], 0),
  mcq("faiz-43", "بيانات التدريب في التعلم الآلي إذا كانت منحازة فإن النموذج:", "If training data is biased, the model:", ["يكرر الانحياز على حالات جديدة", "يصبح عادلًا تلقائيًا", "يمحو البيانات", "يتوقف عن العمل قانونيًا"], ["Repeats the bias on new cases", "Becomes fair automatically", "Erases the data", "Stops working by law"], 0),
  mcq("faiz-44", "مجموعة الاختبار يجب أن تكون:", "The test set should be:", ["بيانات لم يرها النموذج أثناء التدريب", "نفس أمثلة التدريب حرفًا بحرف فقط", "ورقة فارغة", "اسم المدرس"], ["Data the model did not see while training", "The training examples copied letter for letter only", "A blank sheet", "The teacher’s name"], 0),
  mcq("faiz-45", "لماذا لا نضع كلمة مرور الصف في جروب عام؟", "Why not put the class password in a public group?", ["لأن أي شخص يدخل الجروب يقدر يستخدم الحساب", "لأن الجروب يبطئ النت", "لأن الواتساب يمسح المنهج", "لأن الرسالة تطبع نفسها"], ["Anyone in the group can use the account", "Because the group slows the Internet", "Because WhatsApp deletes the syllabus", "Because the message prints itself"], 0),
  mcq("faiz-46", "التوقيع الرقمي يفيد في:", "A digital signature helps to:", ["التأكد أن الرسالة من صاحبها ولم تُعدَّل", "تلوين الأيقونة", "زيادة سطوع الشاشة", "تقصير الكابل"], ["Confirm the message is from its owner and was not altered", "Colour the icon", "Increase screen brightness", "Shorten the cable"], 0),
  mcq("faiz-47", "HTTPS يختلف عن HTTP بأنه:", "HTTPS differs from HTTP in that it:", ["يشفر الاتصال بين المتصفح والخادم", "يمنع فتح أي موقع", "يحذف الصور", "يغيّر لغة الصفحة إجباريًا"], ["Encrypts the connection between browser and server", "Blocks every site", "Deletes images", "Forces a language change"], 0),
  mcq("faiz-48", "الخادم في تطبيق الويب مسؤول غالبًا عن:", "The server in a web app is often responsible for:", ["المنطق والقواعد والبيانات والصلاحيات", "اختيار لون الحذاء", "تهوية الفصل", "طباعة الغلاف فقط"], ["Logic, rules, data, and permissions", "Choosing a shoe colour", "Ventilating the classroom", "Printing the cover only"], 0),
  mcq("faiz-49", "واجهة أمامية بطيئة جدًا تضر تجربة المستخدم لأنها:", "A very slow frontend harms UX because:", ["المستخدم يفقد التركيز ويترك المهمة", "تزيد ذكاء النموذج", "تحسّن التشفير تلقائيًا", "تطبع الملزمة"], ["The user loses focus and drops the task", "It increases model intelligence", "It improves encryption automatically", "It prints the booklet"], 0),
  mcq("faiz-50", "عند تقييم موقع لمهمة «احجز حصة» نقيس:", "When evaluating a site for the task “book a class”, we measure:", ["هل أكمل المستخدم المهمة وبكم خطوة وبأي أخطاء", "لون شعار المدرسة فقط", "عدد كراسي المعمل", "سمك الكتاب"], ["Whether the user finished the task, in how many steps, and with which errors", "Only the school logo colour", "The number of lab chairs", "The book’s thickness"], 0),
  mcq("faiz-51", "الصورة المزيفة (Deepfake) خطرها أنها:", "A deepfake is dangerous because it:", ["تبدو حقيقية وقد تُستخدم لخداع الناس", "تطيل عمر البطارية", "تحسن خط الطالب", "تغلق الواي فاي"], ["Looks real and may be used to deceive people", "Extends battery life", "Improves the student’s handwriting", "Turns Wi-Fi off"], 0),
  mcq("faiz-52", "البيانات المفتوحة تفيد عندما:", "Open data is useful when:", ["يمكن للجميع استخدامها مع ذكر المصدر والقيود", "نسرقها بلا ذكر", "نخفيها عن البحث", "نبيع أسماء الطلاب"], ["Anyone can use it while citing the source and respecting limits", "We steal it with no credit", "We hide it from research", "We sell student names"], 0),
  mcq("faiz-53", "تنظيف البيانات يشمل غالبًا:", "Data cleaning often includes:", ["توحيد شكل التاريخ وإصلاح القيم الناقصة والشاذة", "تلوين الجدول عشوائيًا", "حذف العمود الصحيح", "إخفاء المصدر"], ["Unifying date formats and fixing missing or odd values", "Colouring the table at random", "Deleting the correct column", "Hiding the source"], 0),
  mcq("faiz-54", "عينة منحازة في استطلاع الصف تحدث إذا:", "A biased class survey sample happens if:", ["سألنا مجموعة واحدة فقط ثم عمّمنا على الكل", "اخترنا عشوائيًا من كل المجموعات", "سجّلنا حجم العينة", "ذكرنا حدود التعميم"], ["We asked one group only then generalised to everyone", "We picked randomly from every group", "We recorded the sample size", "We stated the limits of generalisation"], 0),
  mcq("faiz-55", "الارتباط بين متغيرين لا يعني دائمًا:", "A correlation between two variables does not always mean:", ["أن أحدهما سبب للآخر", "أن هناك رقمين", "أن الجدول موجود", "أن الرسم ملوّن"], ["That one causes the other", "That there are two numbers", "That a table exists", "That the chart is coloured"], 0),
  mcq("faiz-56", "بعد تسليم امتحان الفائز، الدرجة الموضوعية تُحسب من:", "After submitting the Al-Faiz exam, the objective score is calculated from:", ["الأسئلة المغلقة فقط، والتحليل للمدرس", "لون الغلاف", "سرعة النت يوم الامتحان", "طول الاسم"], ["Closed questions only; analysis is for the teacher", "Cover colour", "Internet speed on exam day", "Name length"], 0),
];

const FAIZ_ESSAYS: EssayQuestion[] = [
  essay(
    "faiz-e1",
    "اشرح الفرق بين التعلم الآلي والتعلم العميق، ومثّل بمثال مدرسي واحد لكل منهما. اذكر خطرًا أخلاقيًا واحدًا إذا اعتمدنا على نموذج بلا مراجعة.",
    "Explain the difference between machine learning and deep learning, and give one school example of each. State one ethical risk if we trust a model with no review.",
    "فرّق: تعلم آلي من أمثلة؛ تعلم عميق طبقات. مثال لكل. خطر: تحيز أو هلوسة أو خصوصية.",
    "Distinguish: ML from examples; deep learning uses layers. One example each. Risk: bias, hallucination, or privacy.",
  ),
  essay(
    "faiz-e2",
    "صف حادثة تصيد وصلت لمجموعة الصف. ما خطوتان فوريتان لحماية الحسابات؟ ولماذا لا نعيد إرسال الرابط «للتحذير»؟",
    "Describe a phishing message that reached the class group. What two immediate steps protect the accounts? Why should we not forward the link as a warning?",
    "احتواء + تغيير كلمة المرور/إبلاغ. إعادة الإرسال تنشر الخطر.",
    "Contain + change password/report. Forwarding spreads the risk.",
  ),
  essay(
    "faiz-e3",
    "ارسم بالكلمات مسار طلب من المتصفح إلى الخادم ثم إلى قاعدة البيانات والعودة. حدّد أين تضع التحقق من الصلاحيات ولماذا.",
    "In words, sketch a request path from the browser to the server then the database and back. Say where you check permissions and why.",
    "متصفح → خادم يتحقق ثم قاعدة ثم رد. الصلاحيات على الخادم لا في الواجهة وحدها.",
    "Browser → server checks then database then response. Permissions on the server, not the frontend alone.",
  ),
  essay(
    "faiz-e4",
    "اقترح تحسينًا تكراريًا لصفحة حجز حصة: مهمة تقيسها، ملاحظة متوقعة من الطالب، وتعديل واحد بعد القياس.",
    "Propose an iterative improvement for a class-booking page: a task you measure, a likely student observation, and one change after measuring.",
    "مهمة: إكمال الحجز. ملاحظة: زر غير واضح. تعديل: تسمية أوضح وإعادة القياس.",
    "Task: complete a booking. Observation: unclear button. Change: clearer label, then measure again.",
  ),
];

export function faizExam(seed: number): ChapterExam {
  const objectives = shuffled(FAIZ_OBJECTIVES, seed).slice(0, FAIZ_OBJECTIVE_COUNT);
  const essays = shuffled(FAIZ_ESSAYS, seed + 91).slice(0, FAIZ_ESSAY_COUNT);
  return {
    chapterId: FAIZ_PAPER_ID,
    objectives,
    essays,
  };
}
