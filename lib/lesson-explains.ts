export type LessonExplain = {
  termAr: string;
  termEn: string;
  bodyAr: string;
  bodyEn: string;
  exampleAr: string;
  exampleEn: string;
};

const EXPLAINS: Record<string, LessonExplain[]> = {
  "1-1": [
    {
      termAr: "قانون مور",
      termEn: "Moore's Law",
      bodyAr:
        "قانون مور ملاحظة قالها جوردون مور سنة 1965، مش قانون فيزيائي ولا قرار وزاري. يقول إن عدد الترانزستورات على الشريحة يتضاعف تقريبًا كل سنتين. الترانزستور مفتاح إلكتروني صغير؛ كل ما زاد عدده على نفس المساحة، الجهاز يبقى أسرع وأقدر على الحساب. نتيجة التضاعف عبر العقود: أجهزة أصغر وأرخص ووصلت من غرفة كاملة إلى جيب الطالب. اليوم التصغير اقترب من حد فيزيائي، عشان كده ظهرت أفكار زي المعالجة المتوازية (أنوية كتير تشتغل مع بعض) والحوسبة الكمومية.",
      bodyEn:
        "Moore's Law is an observation Gordon Moore made in 1965 — not a physics law and not a ministry order. It says the number of transistors on a chip roughly doubles about every two years. A transistor is a tiny electronic switch; more of them on the same area make a machine faster. Across decades that doubling made computers smaller and cheaper, from a whole room to a student's pocket. Shrinking is now near a physical limit, so new paths appear: parallel cores and quantum computing.",
      exampleAr: "معمل المدرسة اشترى لابتوب جديد أصغر من جهاز الستينيات لأن الشريحة فيها ترانزستورات أكثر بكتير.",
      exampleEn: "The school lab bought a laptop smaller than a 1960s machine because the chip now holds far more transistors.",
    },
    {
      termAr: "الحوسبة السحابية",
      termEn: "Cloud computing",
      bodyAr:
        "الحوسبة السحابية تعني إن موارد تكنولوجيا المعلومات — تخزين، برامج، قوة حساب — تتقدم كخدمة عبر الإنترنت. المدرسة مش مضطرة تشتري سيرفر غالي وتقعد تصونه في أوضة مغلقة. تفتح المتصفح، تدخل الحساب، وتشتغل. السحابة مناسبة للملفات المشتركة والنسخ الاحتياطي والبرامج اللي بتتحدث لوحدها. عيوبها: محتاجة إنترنت، والبيانات بتخرج بره الجهاز، فلازم نسأل مين يستضيفها وإيه سياسة الخصوصية.",
      bodyEn:
        "Cloud computing means IT resources — storage, software, compute — arrive as a service over the Internet. A school does not have to buy and nurse a server in a locked room. You open a browser, sign in, and work. The cloud fits shared files, backups, and software that updates itself. The cost: you need a network, and data leaves the device, so ask who hosts it and what the privacy policy says.",
      exampleAr: "درجات الطلاب على منصة ويب تتفتح من البيت والمدرسة من غير فلاشة.",
      exampleEn: "Student marks live on a web platform that opens at home and at school with no flash drive.",
    },
    {
      termAr: "الحوسبة الطرفية",
      termEn: "Edge computing",
      bodyAr:
        "الحوسبة الطرفية تعالج البيانات على الجهاز نفسه أو قريب جدًا منه، بدل ما تبعتها للسحابة وتستنى الرد. مفيدة لما التأخير خطر أو الشبكة ضعيفة. السيارة الذاتية لو استنت كل قرار يروح السحابة ويرجع، جزء من الثانية ممكن يعمل حادث. كمان الكاميرا في المصنع أو الحساس في المعمل يقدر يقرر محليًا. السحابة والطرفية يكملوا بعض: القرار السريع هنا، والتحليل الثقيل هناك.",
      bodyEn:
        "Edge computing processes data on the device itself, or very near it, instead of sending every bit to the cloud and waiting. It matters when delay is dangerous or the network is weak. A self-driving car cannot wait for a round trip to the cloud; a tenth of a second can cause a crash. A factory camera or a lab sensor can decide locally. Cloud and edge work together: fast decisions here, heavy analysis there.",
      exampleAr: "كاميرا عبور المدرسة تكتشف طالب قرب من الطريق وتطلق تنبيه فورًا من غير انتظار سيرفر بعيد.",
      exampleEn: "A crossing camera spots a student near the road and alerts at once, without waiting for a distant server.",
    },
    {
      termAr: "الواقع المعزز / الافتراضي",
      termEn: "AR / VR",
      bodyAr:
        "الواقع المعزز يضيف طبقة رقمية فوق العالم الحقيقي: الكاميرا تفضل تشوف الشارع، والتطبيق يحط سهم أو اسم أو معلومة فوق الصورة. الواقع الافتراضي يستبدل الواقع بعالم محاكى: النظارة تغطي العين وتوديك مكان تاني. الغلط الشائع إن الاتنين نفس الحاجة. المعزز يخدم التجول والتعليم في المكان الحقيقي. الافتراضي يخدم التدريب والمحاكاة لما التجربة الحقيقية خطرة أو غالية.",
      bodyEn:
        "Augmented reality (AR) adds a digital layer on the real world: the camera still sees the street, and the app draws an arrow, a name, or a fact on top. Virtual reality (VR) replaces the real world with a simulated space: a headset covers the eyes and takes you elsewhere. A common mistake is treating them as the same thing. AR helps navigation and on-the-spot learning. VR helps training when the real experience is dangerous or expensive.",
      exampleAr: "تطبيق يوري أسماء المعالم وأنت ماشي في الشارع. نظارة تدريب على معمل كيمياء من غير مواد خطرة.",
      exampleEn: "An app names landmarks while you walk. A headset trains a chemistry lab without hazardous chemicals.",
    },
    {
      termAr: "مراحل تطور تقنية المعلومات",
      termEn: "Stages of IT",
      bodyAr:
        "تقنية المعلومات اتطورت على مراحل مش قفزة واحدة: حواسيب الغرف بالأنابيب المفرغة (الأربعينيات–الستينيات) للحساب العسكري والعلمي، بعدين الحاسوب الشخصي في الثمانينيات دخل المكتب والفصل، بعدين الإنترنت والويب في التسعينيات فتحوا البريد والبحث العالمي، بعدين الهواتف الذكية خلّت الشبكة في الجيب، وبعدين السحابة والذكاء الاصطناعي كخدمة. كل مرحلة غيّرت المجتمع: شغل عن بُعد، تعلّم أونلاين، تجارة ودفع من غير كاش.",
      bodyEn:
        "IT grew in stages, not one jump: room-sized vacuum-tube machines for military and scientific work, then the personal computer in offices and classrooms, then the Internet and the web for email and global search, then smartphones that put the network in a pocket, then cloud and AI as a service. Each stage changed society: remote work, online learning, e-commerce, and cashless payment.",
      exampleAr: "جدك كان يحجز تذكرة من مكتب. أنت بتحجز من الموبايل لأن المرحلة اتغيّرت.",
      exampleEn: "A grandparent booked a ticket at a desk. You book on a phone because the stage changed.",
    },
  ],
  "1-2": [
    {
      termAr: "الذكاء الاصطناعي",
      termEn: "Artificial Intelligence (AI)",
      bodyAr:
        "الذكاء الاصطناعي هو التقنية التي تمكّن الحواسيب من أداء مهام تحتاج عادةً إلى ذكاء بشري. يتعلم من أمثلة، يستدل، ويحكم. مش شرط يكون واعي أو يفهم زي المدرس. هو برامج وأجهزة تتدرّب أو تُضبط عشان تخرج قرارًا أو توقعًا. الذكاء الاصطناعي هو المظلة الكبيرة اللي تحتها التعلم الآلي والتعلم العميق والذكاء التوليدي.",
      bodyEn:
        "Artificial Intelligence (AI) is the technology that enables computers to perform tasks that normally require human intelligence. It can learn from examples, reason, and judge. It does not have to be conscious or understand like a teacher. These are programs trained or tuned to output a decision or a prediction. AI is the wide umbrella; machine learning, deep learning, and generative AI sit under it.",
      exampleAr: "برنامج يفرّق صورة قطة عن كلب بعد ما شاف آلاف الصور.",
      exampleEn: "A program that tells a cat from a dog after seeing thousands of pictures.",
    },
    {
      termAr: "التعلم الآلي",
      termEn: "Machine learning",
      bodyAr:
        "التعلم الآلي فرع من الذكاء الاصطناعي. بدل ما المبرمج يكتب قاعدة لكل حالة، النموذج يتعلم أنماطًا من بيانات كثيرة ويتوقع أو يصنّف حالات جديدة. فلتر الرسائل المزعجة وتوصية فيديو على المنصة أمثلة شائعة. جودة النموذج مربوطة بجودة البيانات: لو البيانات ناقصة أو منحازة، الحكم يطلع غلط وهو واثق.",
      bodyEn:
        "Machine learning is a branch of AI. Instead of a programmer writing a rule for every case, the model learns patterns from lots of data and then predicts or classifies new cases. A spam filter and a video recommender are everyday examples. Model quality follows data quality: incomplete or biased data produces a confident wrong judgement.",
      exampleAr: "البريد يحط رسالة في «مزعج» لأن نفس الكلمات ظهرت قبل كده في رسائل احتيال.",
      exampleEn: "Mail moves a message to spam because the same words showed up in earlier fraud.",
    },
    {
      termAr: "التعلم العميق",
      termEn: "Deep learning",
      bodyAr:
        "التعلم العميق تعلم آلي متقدم يستخدم شبكات عصبية بطبقات كتير وبيانات ضخمة. الطبقات بتستخرج ملامح لوحدها: في الصورة تبدأ بالحواف بعدين الأشكال بعدين الوجه. مناسب للصوت والصورة واللغة لما يكون عندك بيانات حساب كافية. مش لازم يكون أول اختيار لمسألة صغيرة بجدول درجات بسيط.",
      bodyEn:
        "Deep learning is advanced machine learning that uses neural networks with many layers and huge data. Layers extract features on their own: in a photo they start with edges, then shapes, then a face. It fits speech, images, and language when you have enough data and compute. It is not the first choice for a small marks table.",
      exampleAr: "تطبيق يحوّل كلام المدرس في الحصة إلى نص مكتوب.",
      exampleEn: "An app that turns the teacher's speech in class into written text.",
    },
    {
      termAr: "الذكاء التوليدي",
      termEn: "Generative AI",
      bodyAr:
        "الذكاء التوليدي ينتج نصًا أو صورة أو صوتًا جديدًا بعد تدريب عميق على أمثلة كثيرة. مش بيسحب جملة محفوظة وبس؛ بيكمّل الأرجح كلمة بعد كلمة. عشان كده ممكن يهلوس: الكلام فصيح وهو غلط. استخدمه عشان تفهم الفكرة، بعدين اكتب إجابتك أنت وراجع المصدر.",
      bodyEn:
        "Generative AI creates new text, images, or audio after deep training on many examples. It does not only fetch a stored sentence; it completes the next likely word. That is why it can hallucinate: fluent language that is wrong. Use it to understand an idea, then write your own answer and check the source.",
      exampleAr: "طالب طلب صورة «معمل حاسوب في الستينيات» فطلع رسم جديد، مش صورة أرشيف جاهزة.",
      exampleEn: "A student asks for a 1960s computer lab picture and gets a new drawing, not a ready archive photo.",
    },
    {
      termAr: "الهلوسة",
      termEn: "Hallucination",
      bodyAr:
        "هلوسة النموذج معناها إنه يطلع جملة تبدو صحيحة ومتماسكة، وهي خطأ أو مالهاش سند. ده مش كذب بشري؛ النموذج بيحسب أرجح تكملة لغوية. عشان كده مينفعش تلزق رده في تقرير أو واجب من غير مراجعة كتاب أو مصدر موثوق.",
      bodyEn:
        "A hallucination is fluent, well-shaped text that is false or ungrounded. It is not a human lie; the model scores the next likely words. That is why you must not paste a reply into a report or homework without checking a book or a trusted source.",
      exampleAr: "النموذج اخترع اسم عالم وقانون وهمي في إجابة تبدو أكاديمية.",
      exampleEn: "The model invents a scientist and a fake law in an answer that sounds academic.",
    },
  ],
  "1-3": [
    {
      termAr: "الذكاء الضيق",
      termEn: "Narrow AI",
      bodyAr:
        "الذكاء الضيق نظام يتقن مهمة واحدة أو مجموعة مهام قريبة: ترجمة، توصية، فلترة بريد. ده شكل معظم أنظمة اليوم، حتى لو البرنامج مشهور وقوي. الذكاء العام اللي يفهم أي مهمة زي الإنسان لسه مش شكل الأنظمة المنتشرة. الغلط إنك تعتبر شات يكتب كويس إنه بقى ذكاء عام.",
      bodyEn:
        "Narrow AI is expert at one task or a tight family of tasks: translation, recommendation, spam filtering. That is the form of most systems today, even famous strong ones. General AI (AGI) that handles any task like a person is not the form of systems in daily use. A fluent chat is not proof of general intelligence.",
      exampleAr: "فلتر البريد ممتاز في الرسائل المزعجة، ويفشل لو سألته يرتب جدول الحصص.",
      exampleEn: "A spam filter is excellent at junk mail and fails if you ask it to build a timetable.",
    },
    {
      termAr: "التحيز",
      termEn: "Bias",
      bodyAr:
        "التحيز أخطاء متكررة لأن بيانات التدريب ناقصة أو غير عادلة. النموذج يكرّر اللي شافه أكثر. لو الصور اللي اتدرّب عليها من فئة واحدة، الحكم على الباقي يضعف. الحل مش إننا نثق في الرقم؛ الحل نراجع مين اتمثّل في البيانات ومين اتغيب.",
      bodyEn:
        "Bias is repeated error because training data is incomplete or unfair. The model repeats what it saw most. If the photos came from one group, judgement of the rest gets weaker. The fix is not to trust the score; it is to ask who was represented and who was missing.",
      exampleAr: "نظام قبول يتدرّب على ملفات قديمة فيها ذكور أكثر، فيقلل فرص البنات من غير سبب علمي.",
      exampleEn: "An admissions model trained on old files with more males quietly ranks girls lower.",
    },
    {
      termAr: "نظام توصية",
      termEn: "Recommender",
      bodyAr:
        "نظام التوصية يقترح فيديو أو منتج أو درس من أنماط سابقة: إيه اللي شفته، وإيه اللي شاف زيّه ناس تانيين. مفيد عشان يوفّر وقت. خطره إنه يحبسك في دائرة ضيقة وما يورّيش رأي مختلف، ولو البيانات منحازة الاقتراح يتكرر غلط.",
      bodyEn:
        "A recommender suggests a video, a product, or a lesson from past patterns: what you watched and what similar people watched. It saves time. The risk is a narrow loop that hides other views, and biased data repeats a wrong suggestion.",
      exampleAr: "منصة الدروس تقترح فيديو الجبر بعد ما خلصت فيديو المعادلات.",
      exampleEn: "A lesson platform suggests an algebra video after you finish equations.",
    },
    {
      termAr: "صيانة تنبؤية",
      termEn: "Predictive maintenance",
      bodyAr:
        "الصيانة التنبؤية تستخدم بيانات الحساسات عشان تتوقع العطل قبل ما يحصل. المصنع يغيّر قطعة في وقت مناسب بدل ما يستنى المكنة تقف في نص اليوم. ده استخدام صناعي واضح للذكاء الضيق: مهمة واحدة، بيانات متكررة، وقرار يساعد المهندس مش يستبدله.",
      bodyEn:
        "Predictive maintenance uses sensor data to forecast a fault before it happens. A factory replaces a part at a sensible time instead of waiting for the machine to stop at midday. It is a clear industrial use of narrow AI: one job, repeated data, and a decision that helps the engineer rather than replacing them.",
      exampleAr: "حساس حرارة على طابعة المعمل ينبّه قبل ما الموتور يحرق.",
      exampleEn: "A heat sensor on the lab printer warns before the motor burns.",
    },
  ],
  "1-4": [
    {
      termAr: "الخصوصية",
      termEn: "Privacy",
      bodyAr:
        "الخصوصية حق الشخص يسيطر على بياناته: مين يجمعها، ليه، وإلى متى. الدرجة ورقم التليفون وصورة البطاقة مش مادة تدريب لنموذج عام. حتى لو الخدمة «مجانية»، أنت بتدفع بالبيانات. القاعدة: متشاركش بيانات زميل أو أسرة مع نموذج على الإنترنت.",
      bodyEn:
        "Privacy is a person's right to control their data: who collects it, why, and for how long. Marks, a phone number, and an ID photo are not training material for a public model. Even a “free” service is paid for with data. Rule: never share a classmate's or family's data with an online model.",
      exampleAr: "طالب لزق كشف درجات الفصل في شات عام عشان «يلخّص النتيجة» — ده انتهاك خصوصية.",
      exampleEn: "A student pastes the class mark sheet into a public chat to “summarise results” — that is a privacy breach.",
    },
    {
      termAr: "الشفافية",
      termEn: "Transparency",
      bodyAr:
        "الشفافية تعني إننا نقدر نفهم ليه النظام اتخذ قرارًا، أو على الأقل نعرف على أي بيانات اعتمد. الصندوق الأسود مشكلة لما القرار يمس درجة أو قبول أو صحة. اسأل: ينفع نراجع القرار؟ فيه سجل؟ ولا الجملة «الكمبيوتر قال كده» بس؟",
      bodyEn:
        "Transparency means we can understand why a system decided, or at least which data it used. A black box is a problem when the decision touches a mark, an admission, or health. Ask: can we review the decision? Is there a log? Or only the sentence “the computer said so”?",
      exampleAr: "نظام غياب يخصم درجة من غير ما يوري إن الكاميرا اتعمت في الطابور.",
      exampleEn: "An attendance system docks a mark without showing that the camera went dark in the line-up.",
    },
    {
      termAr: "المساءلة",
      termEn: "Accountability",
      bodyAr:
        "المساءلة تعني إن فيه مسؤول بشري عن أثر القرار. النموذج أداة. لو اقتراح العلاج أو درجة المشروع ظلمت طالب، المدرسة أو الطبيب أو المعلم هم اللي يردّوا، مش «الذكاء الاصطناعي». من غير مساءلة، الغلط يتكرر ومفيش حد يصلّح.",
      bodyEn:
        "Accountability means a human remains responsible for the effect of a decision. The model is a tool. If a treatment hint or a project mark harms a student, the school, the doctor, or the teacher must answer — not “the AI”. Without accountability, the error repeats and nobody repairs it.",
      exampleAr: "المعلم يراجع درجة صححها برنامج قبل ما تتسجل في الكشف.",
      exampleEn: "The teacher reviews a mark a program scored before it goes into the sheet.",
    },
    {
      termAr: "التزييف العميق",
      termEn: "Deepfake",
      bodyAr:
        "التزييف العميق صوت أو صورة أو فيديو مصنوع يبان حقيقي. ممكن يتشهّر بحد أو يزوّر اعتراف. التعامل الصح: متصدّقش فيديو حساس من غير مصدر، ومتنشرش شائعة. القدرة التقنية هنا مش إذن أخلاقي إنك تركّب وش زميل على مشهد.",
      bodyEn:
        "A deepfake is a fabricated voice, image, or video that looks real. It can smear someone or fake a confession. The right move: do not trust a sensitive clip without a source, and do not spread a rumour. Technical power is not moral permission to paste a classmate's face onto a scene.",
      exampleAr: "فيديو يظهر المدير بيقول كلام ميتقالش؛ تتأكد من الصفحة الرسمية قبل ما تشارك.",
      exampleEn: "A clip shows the head teacher saying words they never said; check the official page before you share.",
    },
  ],
  "2-1": [
    {
      termAr: "التشفير",
      termEn: "Encryption",
      bodyAr:
        "التشفير يحوّل النص المقروء إلى صورة لا تُفهم إلا بالمفتاح الصحيح. لو الرسالة اتسرقت في الطريق، السارق يشوف رموز مش المعنى. التشفير يحمي السرية وهو في الطريق وعلى الجهاز. من غير مفتاح، فك التشفير يبقى صعب جدًا بالطرق العادية.",
      bodyEn:
        "Encryption turns readable data into a form that only the right key can open. If the message is stolen on the way, the thief sees symbols, not the meaning. Encryption protects secrecy in transit and at rest. Without the key, ordinary cracking is impractical.",
      exampleAr: "رسالة درجات على واتساب بتتشفر في الطريق؛ اللي على الشبكة العامة مش بيقرأ الكشف.",
      exampleEn: "A marks message is encrypted in transit; someone on the public network cannot read the sheet.",
    },
    {
      termAr: "التشفير المتماثل",
      termEn: "Symmetric",
      bodyAr:
        "التشفير المتماثل يستخدم نفس المفتاح للتشفير وفك التشفير. سريع ومناسب لملفات كبيرة. المشكلة: لازم الطرفين يتشاركوا المفتاح في سرية. لو المفتاح اتسرب، كل الرسائل القديمة والجديدة تنفضح.",
      bodyEn:
        "Symmetric encryption uses the same key to lock and unlock. It is fast and fits large files. The problem: both sides must share that key in secret. If the key leaks, old and new messages open.",
      exampleAr: "مجلد المعمل يتقفل بكلمة مرور واحدة يعرفها أمين المعمل والمعلم بس.",
      exampleEn: "The lab folder is locked with one password that only the lab keeper and the teacher know.",
    },
    {
      termAr: "التشفير غير المتماثل",
      termEn: "Asymmetric",
      bodyAr:
        "التشفير غير المتماثل يستخدم زوج مفاتيح: العام يتشفر به أي حد، والخاص يفك به صاحبه فقط. مناسب لتبادل مفتاح الجلسة وللتوقيع الرقمي. أبطأ من المتماثل، عشان كده الأنظمة غالبًا تمزج الاتنين: غير متماثل في البداية، بعدين متماثل للبيانات الثقيلة.",
      bodyEn:
        "Asymmetric encryption uses a key pair: the public key encrypts for anyone, the private key decrypts for the owner only. It fits exchanging a session key and digital signatures. It is slower than symmetric crypto, so systems often mix both: asymmetric at the start, then symmetric for the heavy data.",
      exampleAr: "موقع المدرسة يعرض مفتاحًا عامًا؛ المتصفح يشفّر به، والخادم وحده يفك بالمفتاح الخاص.",
      exampleEn: "The school site shows a public key; the browser encrypts with it, and only the server unlocks with the private key.",
    },
    {
      termAr: "المصادقة",
      termEn: "Authentication",
      bodyAr:
        "المصادقة تتأكد إن الطرف هو اللي بيدّعي إنه هو. السرية من غير مصادقة تسيب الباب لمحتال يعرف الرقم السري المسروق. كلمة المرور وحدها ضعيفة لو اتسرقت أو اتتخمنت. المصادقة تجاوب سؤال: مين أنت؟ مش بس: الرسالة متشفرة؟",
      bodyEn:
        "Authentication proves a party is who they claim to be. Secrecy without authentication leaves the door open to someone who stole a password. A password alone is weak if it is stolen or guessed. Authentication answers “who are you?”, not only “is the message encrypted?”.",
      exampleAr: "بوابة الدرجات تطلب كود الطالب قبل ما تفتح الكشف، حتى لو الرابط اتشفر.",
      exampleEn: "The marks portal asks for the student code before it opens the sheet, even if the link is encrypted.",
    },
    {
      termAr: "المصادقة متعددة العوامل",
      termEn: "MFA",
      bodyAr:
        "المصادقة متعددة العوامل تجمع أكثر من نوع إثبات: حاجة تعرفها (كلمة مرور)، حاجة تملكها (تليفون أو مفتاح)، وحاجة أنت عليها (بصمة أو وجه). لو عامل واحد اتسرق، التاني يوقف المحتال. متبعتش صورة البصمة على جروب، ومتخلّيش البصمة وحدها من غير مراجعة.",
      bodyEn:
        "Multi-factor authentication combines more than one kind of proof: something you know (a password), something you have (a phone or a key), and something you are (a fingerprint or a face). If one factor is stolen, the second stops the thief. Do not send fingerprint photos to a group chat, and do not rely on biometrics alone with no review.",
      exampleAr: "دخول حساب المدرس: كلمة مرور + رمز من التطبيق على الموبايل.",
      exampleEn: "Teacher login: a password plus a code from the phone app.",
    },
    {
      termAr: "التجزئة",
      termEn: "Hash",
      bodyAr:
        "التجزئة دالة اتجاه واحد: تدخل السر وتطلع بصمة ثابتة الطول. نقارن البصمة، ومش بنرجع الكلمة الأصلية من البصمة. لو اتنين نفس البصمة، غالبًا نفس المدخل. مفيدة لتخزين كلمات المرور والتحقق إن الملف ماتغيّرش.",
      bodyEn:
        "A hash is a one-way function: you feed a secret and get a fixed-length fingerprint. We compare fingerprints; we do not recover the original word from the hash. The same input should give the same hash. It fits storing passwords and checking that a file was not changed.",
      exampleAr: "الموقع يحفظ بصمة كلمة المرور، مش الكلمة نفسها، فلو قاعدة البيانات اتسرقت السر مش ظاهر.",
      exampleEn: "The site stores a password hash, not the password, so a leaked table does not show the secret.",
    },
  ],
  "2-2": [
    {
      termAr: "جدار الحماية",
      termEn: "Firewall",
      bodyAr:
        "جدار الحماية يفلتر حركة الشبكة حسب قواعد: مين يدخل، من أي منفذ، وإلى أي خدمة. طبقة واحدة مش كافية؛ المهاجم لو عدّاها لازم يقابل الطبقة اللي بعدها. حدّث القواعد وأقفل المنافذ اللي مفيش خدمة عليها.",
      bodyEn:
        "A firewall filters network traffic by rules: who may enter, on which port, to which service. One wall is not enough; if an attacker passes it, the next layer must stop them. Update the rules and close ports that host no service.",
      exampleAr: "معمل الحاسوب يمنع أجهزة الضيوف من الوصول لجهاز الكنترول يوم النتيجة.",
      exampleEn: "The computer lab blocks guest devices from the control PC on results day.",
    },
    {
      termAr: "شبكة خاصة افتراضية",
      termEn: "VPN",
      bodyAr:
        "الشبكة الخاصة الافتراضية نفق مشفّر عبر شبكة عامة زي شبكة البيت أو المقهى. الجهاز يبان كأنه داخل شبكة المدرسة وهو بره. مفيدة للشغل عن بُعد. مش سحر: لو الجهاز نفسه مصاب، النفق يوصل الإصابة لجوه.",
      bodyEn:
        "A VPN is an encrypted tunnel across a public network such as home Wi-Fi or a café. The device looks as if it sits inside the school network while it is outside. It helps remote work. It is not magic: if the device itself is infected, the tunnel carries the infection inside.",
      exampleAr: "المعلم يصحح من البيت عبر نفق المدرسة بدل ما يفتح قاعدة الدرجات على شبكة مفتوحة.",
      exampleEn: "The teacher marks from home through the school tunnel instead of opening the marks database on open Wi-Fi.",
    },
    {
      termAr: "تقسيم الشبكة",
      termEn: "Segmentation",
      bodyAr:
        "تقسيم الشبكة يعزل أجزاءها: شبكة الطلاب، شبكة الإدارة، شبكة الضيوف. لو جهاز في الفناء اتصاب، الاختراق مينتشرش للكنترول. التقسيم يقلل حركة المهاجم بعد أول نجاح.",
      bodyEn:
        "Segmentation isolates parts of the network: students, office, guests. If a device in the yard is infected, the breach does not walk into the control room. Segmentation shrinks how far an attacker can move after the first success.",
      exampleAr: "يوم توزيع النتائج: شبكة الضيوف مفصولة عن جهاز إدخال الدرجات.",
      exampleEn: "On results day the guest Wi-Fi is cut off from the marks-entry PC.",
    },
    {
      termAr: "مبدأ أقل صلاحية",
      termEn: "Least privilege",
      bodyAr:
        "أقل صلاحية تعني إن كل مستخدم ياخد بس اللي شغله محتاجه. سكرتير الظهور مش محتاج يمسح قاعدة الطلاب كلها. الحساب الإداري الواسع لو اتسحب، الضرر أكبر. راجع الصلاحيات كل ترم.",
      bodyEn:
        "Least privilege means each user gets only what the job needs. An attendance clerk does not need to wipe the whole student database. A wide admin account, if stolen, does more damage. Review rights every term.",
      exampleAr: "حساب الطالب يفتح واجبه وبس، ومفيش زر حذف لدرجات الزملاء.",
      exampleEn: "A student account opens their homework only, with no delete button for classmates' marks.",
    },
  ],
  "2-3": [
    {
      termAr: "الحادث",
      termEn: "Incident",
      bodyAr:
        "الحادث حدث يهدد سرية أو سلامة أو إتاحة المعلومات: تسريب كشف، فيروس، أو موقع المدرسة وقع. إخفاء الحادث يوسّع مين شاف البيان ومين اتصرف غلط. بلّغ فورًا حسب الخطة، ومتستناش «الأمور تهدأ».",
      bodyEn:
        "An incident is an event that threatens confidentiality, integrity, or availability: a leaked sheet, malware, or the school site going down. Hiding it widens who saw the data and who acted badly. Report at once by the plan; do not wait until “things calm down”.",
      exampleAr: "فلاشة مجهولة في المعمل شغّلت برنامج غريب — ده حادث، مش مزحة.",
      exampleEn: "An unknown flash drive in the lab launched a strange program — that is an incident, not a joke.",
    },
    {
      termAr: "إدارة المخاطر",
      termEn: "Risk management",
      bodyAr:
        "إدارة المخاطر: حدّد الخطر، قدّر احتمال وقوعه وأثره، بعدين قرر تقبله أو تخفّفه أو تنقله (تأمين مثلًا). مش كل خطر يتقفل بنفس التكلفة. اكتب المخاطر قبل ما المشروع يكبر.",
      bodyEn:
        "Risk management: name the risk, estimate how likely it is and how bad it would be, then accept it, reduce it, or transfer it (for example with insurance). Not every risk is closed at the same cost. Write the risks down before the project grows.",
      exampleAr: "خطر تسريب درجات أعلى من خطر بطء الطابعة؛ نركّز الفلوس على الحسابات والصلاحيات.",
      exampleEn: "A marks leak is a bigger risk than a slow printer; spend first on accounts and rights.",
    },
    {
      termAr: "خطة الاستجابة",
      termEn: "Response plan",
      bodyAr:
        "خطة الاستجابة خطوات جاهزة ومُتدرَّب عليها: اكتشاف، احتواء، إزالة، تعافٍ، ثم مراجعة. الارتجال وقت الهلع يمسح الأدلة ويوسّع الضرر. بعد التعافي اسأل: إيه اللي فشل في التصميم؟ صلّح السبب مش العرض.",
      bodyEn:
        "A response plan is a written, rehearsed sequence: detect, contain, eradicate, recover, then review. Panic improvisation wipes evidence and widens damage. After recovery ask: what failed in the design? Fix the cause, not the symptom.",
      exampleAr: "ورقة على الحائط في المعمل: مين يتصل، أي جهاز يتقفل، ومين يسجّل الوقت.",
      exampleEn: "A sheet on the lab wall: who to call, which PC to isolate, and who logs the time.",
    },
    {
      termAr: "الاحتواء",
      termEn: "Containment",
      bodyAr:
        "الاحتواء يعزل الجهاز أو الحساب المصاب عشان الضرر ما يكبرش: افصل الشبكة، أوقف الحساب، وقف الخدمة. متمسحش القرص قبل ما تسجّل الأدلة لو المراجعة هتحتاجها. الاحتواء أول فعل عملي بعد الاكتشاف.",
      bodyEn:
        "Containment isolates the infected device or account so the damage does not grow: unplug the network, freeze the account, stop the service. Do not wipe the disk before evidence is saved if a review will need it. Containment is the first practical act after detection.",
      exampleAr: "جهاز الطالب اتصاب: اقلع الكابل واتساب الكنترول، ومتوصلوش بفلاشة الزملاء.",
      exampleEn: "A student PC is infected: pull the cable and tell the control room; do not pass classmates a flash drive.",
    },
  ],
  "3-1": [
    {
      termAr: "الواجهة الأمامية",
      termEn: "Frontend",
      bodyAr:
        "الواجهة الأمامية ما يشوفه المستخدم في المتصفح: هيكل الصفحة وتنسيقها ولغة التفاعل. بتطلب من الخادم وتعرض الرد. متتحطش فيها أسرار: أي حد يفتح أدوات المطوّر يشوف الكود.",
      bodyEn:
        "The frontend is what the user sees in the browser: HTML structure, CSS look, and JavaScript behaviour. It asks the server and shows the reply. Do not put secrets in it: anyone can open developer tools and read the code.",
      exampleAr: "صفحة تسجيل الحضور: صندوق الاسم وزر «حضر» دي واجهة أمامية.",
      exampleEn: "The attendance page — a name box and a Present button — is frontend.",
    },
    {
      termAr: "الخادم / الخلفية",
      termEn: "Backend",
      bodyAr:
        "الخلفية المنطق والصلاحيات وقواعد البيانات على الخادم. هي اللي تقرر ينفع الطالب يشوف درجته ولا لأ، وهي اللي تحفظ. المتصفح يعرض ويطلب؛ الخادم يقرر ويخزّن.",
      bodyEn:
        "The backend is logic, permissions, and databases on the server. It decides whether a student may see a mark, and it stores the data. The browser displays and asks; the server decides and keeps.",
      exampleAr: "لما تدوس حفظ الواجب، الخادم يتأكد إن الكود بتاعك قبل ما يكتب في القاعدة.",
      exampleEn: "When you save homework, the server checks it is your code before it writes to the database.",
    },
    {
      termAr: "قاعدة البيانات",
      termEn: "Database",
      bodyAr:
        "قاعدة البيانات تخزين دائم منظّم: جداول أو مجموعات تفضل بعد ما تقفل المتصفح. من غير قاعدة، كل طلب يبدأ من صفر. صمّم الحقول بدقة (درجة رقم، تاريخ تاريخ) عشان التحليل بعدين يبقى سليم.",
      bodyEn:
        "A database is persistent structured storage: tables or collections that remain after the browser closes. Without it, every request starts from zero. Design fields carefully (a mark is a number, a date is a date) so later analysis stays honest.",
      exampleAr: "جدول الطلاب: الاسم، الكود، الشعبة، النقاط.",
      exampleEn: "A students table: name, code, stream, points.",
    },
    {
      termAr: "العميل-الخادم",
      termEn: "Client–server",
      bodyAr:
        "نموذج العميل-الخادم: المتصفح (العميل) يطلب موردًا، والخادم يرد بنتيجة أو خطأ. طبقات التطبيق غالبًا عرض، تطبيق، بيانات. فصل الواجهة عن الخادم يخلي فريقين يشتغلوا وصيانة أسهل.",
      bodyEn:
        "Client–server: the browser (client) requests a resource, and the server replies with a result or an error. App layers are often presentation, application, and data. Splitting frontend and backend lets two teams work and makes maintenance easier.",
      exampleAr: "الموبايل يطلب قائمة الامتحانات؛ الخادم يرجّعها بعد ما يتأكد من جلسة الطالب.",
      exampleEn: "The phone asks for the exam list; the server returns it after it checks the student session.",
    },
  ],
  "3-2": [
    {
      termAr: "بروتوكول الويب",
      termEn: "HTTP",
      bodyAr:
        "بروتوكول الويب طلب واستجابة: العميل يقول الطريقة والعنوان، والخادم يرد بجسم ورمز حالة. الطرق الشائعة: الجلب للقراءة من غير تعديل، الإرسال للإنشاء، البديل الكامل أو التعديل الجزئي للتحديث، والحذف بعد إذن. من غير الاتفاق ده التطبيقان مش هيفهموا بعض.",
      bodyEn:
        "HTTP is a request–response protocol: the client names a method and a URL, and the server replies with a body and a status code. Common methods: GET to read, POST to create, PUT to replace, PATCH to change part, DELETE to remove after permission. Without that contract two apps cannot understand each other.",
      exampleAr: "فتح صفحة الدرس جلب. تسجيل واجب جديد إرسال.",
      exampleEn: "Opening a lesson page is GET. Submitting new homework is POST.",
    },
    {
      termAr: "بروتوكول ويب آمن",
      termEn: "HTTPS",
      bodyAr:
        "بروتوكول الويب الآمن هو نفس الطلب والاستجابة فوق قناة مشفّرة. العنوان والمتصفح يظهروا قفل. من غير القفل كلمة المرور والدرجة ممكن تتقرأ على الشبكة العامة. أي بوابة درجات أو حضور لازم تكون مشفّرة.",
      bodyEn:
        "HTTPS is HTTP over an encrypted TLS channel. The address bar shows a lock. Without HTTPS a password or a mark can be read on a public network. Any marks or attendance portal must use HTTPS.",
      exampleAr: "ادخل موقع المدرسة بالقفل ظاهر؛ لو المتصفح حذّر إن الشهادة بايظة، متكتبش كلمة السر.",
      exampleEn: "Use https:// for the school site; if the browser warns the certificate is broken, do not type the password.",
    },
    {
      termAr: "واجهة برمجية",
      termEn: "API",
      bodyAr:
        "الواجهة البرمجية اتفاق بين برنامجين: إيه العنوان، إيه الطريقة، وإيه شكل البيانات. التطبيق مش محتاج يعرف تفاصيل قاعدة البيانات، بس العقد. وثّق الردود والأخطاء عشان الفريق الثاني يبني عليها.",
      bodyEn:
        "An API is a contract between two programs: which URL, which method, and which data shape. The app does not need the database internals, only the contract. Document replies and errors so the other team can build on them.",
      exampleAr: "تطبيق الحضور يطلب قائمة الحضور من الواجهة البرمجية ويرجع نص بيانات منظّم.",
      exampleEn: "The attendance app calls /api/attendance and gets a JSON list.",
    },
    {
      termAr: "موارد ونص بيانات",
      termEn: "REST / JSON",
      bodyAr:
        "نمط شائع: كل مورد له عنوان، والطرق تتصرف عليه. نص البيانات المنظّم سهل للمتصفح والخادم. رمز الحالة جزء من العقد: 200 نجاح، 404 المورد مش على العنوان، 500 الخادم فشل. ملفات الجلسة تحفظ تسجيل الدخول بعد الطلب.",
      bodyEn:
        "REST is a common style: each resource has a URL, and methods act on it. JSON is structured text both browser and server can read. Status codes are part of the contract: 200 success, 404 not at that address, 500 the server failed. Cookies keep a login alive across requests.",
      exampleAr: "جلب سجل الطالب رقم 12 يقرأ الطالب. 404 يعني مفيش طالب بالرقم ده.",
      exampleEn: "GET /students/12 reads one student. 404 means no student with that id.",
    },
  ],
  "3-3": [
    {
      termAr: "هيكل الصفحة",
      termEn: "HTML",
      bodyAr:
        "هيكل الصفحة يعطي معناها: عنوان، فقرة، زر، قائمة، جدول. ابدأ بالعنصر الصحيح، متخلّيش الصفحة كلها مربعات شكل من غير معنى. المعنى الصح يساعد قارئ الشاشة ومحركات البحث والطالب اللي بيتصفح بلوحة المفاتيح.",
      bodyEn:
        "HTML gives the page its meaning: heading, paragraph, button, list, table. Start with the right element; do not build a page of empty boxes. Correct meaning helps a screen reader, search, and a student who browses with a keyboard.",
      exampleAr: "عنوان الدرس عنصر عنوان، وزر الإرسال زر حقيقي، مش صورة زر مزيفة.",
      exampleEn: "The lesson title is an h1, and submit is a button, not a fake picture of a button.",
    },
    {
      termAr: "تنسيق الصفحة",
      termEn: "CSS",
      bodyAr:
        "تنسيق الصفحة مسؤول عن المظهر: لون، شبكة، مسافات، وتجاوب الشاشات. التصميم المتجاوب يخدم الموبايل قبل الشاشة العريضة أحيانًا. الاتساق أهم من المفاجأة: نفس مكان القائمة ونفس لون الزر الرئيسي.",
      bodyEn:
        "CSS controls look: colour, grid, spacing, and how the page fits screens. Responsive design often serves the phone before the wide monitor. Consistency beats surprise: same menu place, same primary button colour.",
      exampleAr: "الزر الرئيسي كحلي في كل الصفحات، مش لون عشوائي كل مرة.",
      exampleEn: "The primary button stays navy on every page, not a random colour each time.",
    },
    {
      termAr: "لغة التفاعل",
      termEn: "JavaScript",
      bodyAr:
        "لغة التفاعل تضيف السلوك بعد التحميل: التحقق من النموذج، فتح قائمة، تحديث جزء من الصفحة من غير إعادة تحميل كاملة. متستخدمهاش بديلًا عن معنى الهيكل، ومتحطش فيها مفتاح سري.",
      bodyEn:
        "JavaScript adds behaviour after load: checking a form, opening a menu, updating part of the page without a full reload. Do not use it as a substitute for HTML meaning, and do not put a secret key in it.",
      exampleAr: "صندوق البحث يفلتر أسماء الطلاب وأنت بتكتب.",
      exampleEn: "A search box filters student names as you type.",
    },
    {
      termAr: "إتاحة الوصول",
      termEn: "Accessibility",
      bodyAr:
        "إتاحة الوصول تصميم يشتغل مع لوحة المفاتيح وقارئ الشاشة وتباين الألوان. مش تجميل في الآخر. اختبر الصفحة من غير فأرة. الدرجة في التقييم تحسب مين يقدر يقرأ ويكمل، مش التصفيق على اللون.",
      bodyEn:
        "Accessibility is a design that works with a keyboard, a screen reader, and enough colour contrast. It is not last-minute decoration. Test the page without a mouse. The evaluation score counts who can read and finish, not applause for colour.",
      exampleAr: "طالب يستخدم لوحة المفاتيح يوصل لزر الحفظ بنفس سهولة الزميل بالفأرة.",
      exampleEn: "A student using only a keyboard reaches Save as easily as a classmate with a mouse.",
    },
  ],
  "4-1": [
    {
      termAr: "وسائط متعددة",
      termEn: "Multimedia",
      bodyAr:
        "الوسائط المتعددة تجمع نص وصورة وصوت وفيديو ورسوم. كل وسيط يخدم رسالة: جدول للأرقام، فيديو للحركة، أيقونة للفعل السريع. الوسيط خادم للمعنى، مش زينة تزحم الصفحة.",
      bodyEn:
        "Multimedia combines text, image, audio, video, and animation. Each medium fits a message: a table for numbers, video for motion, an icon for a quick action. The medium serves the meaning; it is not decoration on a crowded page.",
      exampleAr: "شرح دورة الماء: رسم بسيط أوضح من فقرة طويلة من غير صورة.",
      exampleEn: "The water cycle is clearer as a simple diagram than as a long paragraph with no picture.",
    },
    {
      termAr: "ضغط الملفات",
      termEn: "Compression",
      bodyAr:
        "ضغط الملفات يقلل الحجم. فيه ضغط بفقد جودة (صورة ويب خفيفة) وضغط من غير فقد (ملف يجب أن يبقى مطابقًا). اختَر حسب الغرض: واجب للطباعة عالي الجودة، وصورة الموقع خفيفة على شبكة ضعيفة.",
      bodyEn:
        "Compression shrinks file size. Some compression loses quality (a light web image); some keeps an exact copy. Choose by purpose: a print homework file stays sharp, a site image stays light on a weak network.",
      exampleAr: "صورة الغلاف 8 ميجا تبطّئ الصفحة؛ نسخة مضغوطة أوضح وأسرع.",
      exampleEn: "An 8 MB cover photo stalls the page; a compressed copy is clearer and faster.",
    },
    {
      termAr: "النص البديل",
      termEn: "Alt text",
      bodyAr:
        "النص البديل وصف للصورة لمن لا يراها أو يستخدم قارئ شاشة. واجب مش تجميل. اكتب المعنى اللي الصورة بتوصّله، مش جملة «صورة1». لو الصورة للزينة بس، النص البديل يفضل فاضي عن قصد.",
      bodyEn:
        "Alt text describes an image for someone who cannot see it or who uses a screen reader. It is a duty, not decoration. Write the meaning the picture carries, not “image1”. If the picture is purely decorative, leave alt empty on purpose.",
      exampleAr: "صورة قانون مور: «شريحة فيها ترانزستورات أكتر عبر السنين».",
      exampleEn: "A Moore's Law figure: “a chip with more transistors across the years”.",
    },
    {
      termAr: "الدقة مقابل الحجم",
      termEn: "Quality vs size",
      bodyAr:
        "كل ما زادت الدقة زاد الحجم وبطؤ التحميل. وازن وضوح الوسيط وسرعة الشبكة اللي طالب البيت عليها. متفرضش فيديو 4K على واجب يتفتح من خط ضعيف.",
      bodyEn:
        "Higher resolution means a heavier file and a slower load. Balance how sharp the medium is against the home network a student has. Do not force a 4K video on homework that opens on a weak line.",
      exampleAr: "فيديو شرح دقيقتين بحجم مناسب أوضح من فيلم ثقيل محدش يقدر يحمّله.",
      exampleEn: "A two-minute lesson clip at a sensible size beats a heavy film nobody can download.",
    },
  ],
  "4-2": [
    {
      termAr: "تجربة المستخدم",
      termEn: "UX",
      bodyAr:
        "تجربة المستخدم سهولة ووضوح الرحلة لحد ما المستخدم يوصل هدفه. الموقع الناجح يتفهم في ثانية، مش يتُعجب في صورة بس. صمّم للمهمة: الطالب يسجّل حضوره بأقل خطوات.",
      bodyEn:
        "UX is how easy and clear the journey is until the user reaches a goal. A successful site is understood in a second, not only admired in a screenshot. Design for the task: a student marks attendance in the fewest steps.",
      exampleAr: "تسجيل الحضور: كود + زر واحد، مش خمس صفحات أسئلة.",
      exampleEn: "Attendance: a code plus one button, not five pages of questions.",
    },
    {
      termAr: "واجهة المستخدم",
      termEn: "UI",
      bodyAr:
        "واجهة المستخدم العناصر المرئية اللي المستخدم يلمسها: أزرار، قوائم، حقول. الواجهة جزء من تجربة المستخدم. واجهة جميلة من غير رحلة واضحة تفضل فاشلة. الاتساق: نفس مكان القائمة ونفس لون الزر الرئيسي.",
      bodyEn:
        "UI is the visible controls the user touches: buttons, menus, fields. UI is part of UX. A pretty interface with a confusing journey still fails. Keep consistency: same menu place, same primary colour.",
      exampleAr: "زر الحفظ دايمًا أسفل النموذج بنفس اللون.",
      exampleEn: "Save always sits at the bottom of the form in the same colour.",
    },
    {
      termAr: "التسلسل البصري",
      termEn: "Visual hierarchy",
      bodyAr:
        "التسلسل البصري يخلي العين تعرف تبدأ منين وتضغط فين: العنوان أكبر، الزر الرئيسي أوضح، التفاصيل أهدى. من غير تسلسل الصفحة تبقى ضوضاء.",
      bodyEn:
        "Visual hierarchy tells the eye where to start and where to click: the title is larger, the primary button is clearer, details stay quieter. Without hierarchy the page is noise.",
      exampleAr: "عنوان «الامتحان» كبير، وزر «ابدأ» ظاهر، وملحوظة الوقت أصغر.",
      exampleEn: "The word Exam is large, Start is obvious, and the time note is smaller.",
    },
    {
      termAr: "عدد النقرات",
      termEn: "Click count",
      bodyAr:
        "عدد النقرات كم خطوة لحد ما المهمة تخلّص. كل خطوة زيادة فرصة إن الطالب يسيب الصفحة. اختبر مع زميل صامت وشوف يتوه فين.",
      bodyEn:
        "Click count is how many steps the user needs to finish the task. Extra steps raise the chance a student leaves. Watch a silent classmate and see where they get lost.",
      exampleAr: "تحميل الملزمة: درس → زر تحميل. مش قائمة مدفونة في الإعدادات.",
      exampleEn: "Download the booklet: lesson → Download. Not a menu buried in settings.",
    },
  ],
  "4-3": [
    {
      termAr: "قابلية الاستخدام",
      termEn: "Usability",
      bodyAr:
        "قابلية الاستخدام: هل المستخدم يخلّص المهمة بسرعة وبأخطاء قليلة؟ قيّم بوضوح الهدف، زمن المهمة، عدد الأخطاء، ورضا المستخدم. ذوق المصمم وحده مش مقياس.",
      bodyEn:
        "Usability asks whether the user finishes the task quickly with few errors. Score goal clarity, task time, errors, and satisfaction. The designer's taste alone is not a measure.",
      exampleAr: "عشرة طلاب جرّبوا بوابة الغياب؛ لو أربعة تاهوا يبقى التصميم مش جاهز.",
      exampleEn: "Ten students try the attendance portal; if four get lost, the design is not ready.",
    },
    {
      termAr: "اختبار أ/ب",
      termEn: "A/B test",
      bodyAr:
        "اختبار أ/ب يقارن نسختين ويقيس أنهي أفضل على مقياس مكتوب وعدد كافٍ. عينة صديقين في الفسحة ذوق متنكّر، مش اختبار. متعلنش فوز لون من غير ما تقيس إتمام المهمة.",
      bodyEn:
        "An A/B test compares two versions and measures which works better on a written metric and a large enough count. A two-friend sample at break is taste in disguise, not a test. Do not declare a colour the winner until task completion is measured.",
      exampleAr: "نسخة زر «دخول» أعلى الصفحة مقابل أسفلها، ونعد مين كمّل تسجيل الدخول.",
      exampleEn: "A Log in button at the top versus the bottom, and we count who finishes sign-in.",
    },
    {
      termAr: "زمن المهمة",
      termEn: "Task time",
      bodyAr:
        "زمن المهمة كام دقيقة أو ثانية لحد ما الهدف يخلّص. زمن أطول من غير سبب يعني احتكاك في الواجهة. قيس قبل وبعد أي تغيير.",
      bodyEn:
        "Task time is how long the user takes to finish the goal. Extra time with no reason means friction. Measure before and after every change.",
      exampleAr: "تسجيل كود الفصل كان بياخد دقيقة؛ بعد تبسيط الحقل بقى عشر ثوانٍ.",
      exampleEn: "Entering the class code took a minute; after simplifying the field it took ten seconds.",
    },
    {
      termAr: "رضا المستخدم",
      termEn: "Satisfaction",
      bodyAr:
        "الرضا: هل التجربة واضحة ومريحة، مش بس المهمة اتنفذت. اسأل المستخدم جملة قصيرة بعد التجربة. إتاحة الوصول جزء من التقييم، حتى لو المدير مدح الخط.",
      bodyEn:
        "Satisfaction is whether the experience feels clear and comfortable, not only whether the task finished. Ask a short question after the trial. Accessibility stays part of the score even if the head teacher praised the font.",
      exampleAr: "استمارة قصيرة: «قدرت تلاقي درجتك بسهولة؟» نعم / لا / فين المشكلة.",
      exampleEn: "A short form: “Did you find your mark easily?” yes / no / where it broke.",
    },
  ],
  "4-4": [
    {
      termAr: "التكرار",
      termEn: "Iteration",
      bodyAr:
        "التكرار حلقة: صمّم → اختبر → تعلّم → حسّن → أعد. الموقع مش بيتنشر مرة ويتنسي. غيّر حاجة واحدة في كل دورة عشان تعرف السبب. التحسين دليل، مش قائمة أمنيات.",
      bodyEn:
        "Iteration is a loop: design → test → learn → improve → repeat. A site is not published once and forgotten. Change one thing per cycle so you know the cause. Improvement is evidence, not a wish list.",
      exampleAr: "نقلنا زر الواجب بعد ما شفنا الطلاب بيدوروا عليه تحت؛ الدورة الجاية نقيس تاني.",
      exampleEn: "We moved the homework button after we saw students hunt for it at the bottom; the next cycle we measure again.",
    },
    {
      termAr: "النموذج الأولي",
      termEn: "Prototype",
      bodyAr:
        "النموذج الأولي نسخة رخيصة سريعة للاختبار قبل البناء الكامل: ورقة، شاشة فجما، أو رابط تجريبي. أرخص تكتشف الغلط بدري من بعد أسبوع برمجة.",
      bodyEn:
        "A prototype is a cheap, fast version used to test before the full build: paper, a Figma screen, or a trial link. Finding the mistake early is cheaper than a week of coding.",
      exampleAr: "رسمنا شاشة الامتحان على ورقة وجرّبناها مع ثلاثة طلاب قبل ما نكتب كود.",
      exampleEn: "We sketched the exam screen on paper and tried it with three students before writing code.",
    },
    {
      termAr: "معدل الخروج",
      termEn: "Drop-off",
      bodyAr:
        "معدل الخروج: فين الزائر يسيب الصفحة قبل ما يخلّص المهمة. راقب الخطوة اللي الناس بتختفي عندها. هناك مكان التحسين.",
      bodyEn:
        "Drop-off is where a visitor leaves the page before finishing the task. Watch the step where people vanish. That is where you improve.",
      exampleAr: "نصف الطلاب يقفلوا صفحة الدفع قبل التأكيد — راجع وضوح السعر والزر.",
      exampleEn: "Half the students close the payment page before confirm — check price clarity and the button.",
    },
    {
      termAr: "دليل القرار",
      termEn: "Decision record",
      bodyAr:
        "دليل القرار سبب مكتوب للتغيير مبني على ملاحظة، مش ذوق بس: ليه نقلنا الزر؟ أنهي رقم؟ مين اتفرج؟ السجل يمنع إن الفريق يرجع لنفس الجدال كل أسبوع.",
      bodyEn:
        "A decision record is a written reason for a change, based on evidence not taste alone: why did we move the button? which number? who watched? The record stops the team repeating the same argument every week.",
      exampleAr: "ملاحظة 12 سبتمبر: 8 من 10 داسوا «رجوع» بدل «إرسال» — نقلنا الإرسال لليمين.",
      exampleEn: "Note 12 Sep: 8 of 10 hit Back instead of Send — we moved Send to the right.",
    },
  ],
  "5-1": [
    {
      termAr: "بيانات أولية",
      termEn: "Primary data",
      bodyAr:
        "البيانات الأولية تجمعها أنت لغرض محدد: استبيان، تجربة، عدّ في الفناء. مكلفة في الوقت، بس تعرف بالظبط إزاي اتجمعت. إن فسد الجمع، الحساب بعدين مش هينقذ التحليل.",
      bodyEn:
        "Primary data is gathered fresh for your purpose: a survey, an experiment, a count in the yard. It costs time, but you know exactly how it was collected. If collection is bad, later maths cannot save the analysis.",
      exampleAr: "عدّت عدد الطلاب اللي بيستخدموا الأتوبيس لمدة أسبوع بنفس الاستمارة.",
      exampleEn: "You count how many students use the bus for a week on the same form.",
    },
    {
      termAr: "بيانات ثانوية",
      termEn: "Secondary data",
      bodyAr:
        "البيانات الثانوية جمعها غيرك ونشرها: جهاز إحصاء، وزارة، بحث قديم. بتوفّر وقت. لازم تراجع الترخيص، تاريخ التحديث، وتعريف المتغير. المصدر المفتوح مش بريء تلقائيًا.",
      bodyEn:
        "Secondary data was already collected and published by others: a statistics office, a ministry, an older study. It saves time. Check the licence, the update date, and how the variable was defined. Open is not automatically innocent.",
      exampleAr: "تستخدم جدول وزارة التربية عن نسب النجاح، وتكتب السنة والمصدر تحت الرسم.",
      exampleEn: "You use a ministry table of pass rates and write the year and source under the chart.",
    },
    {
      termAr: "مجتمع / عينة",
      termEn: "Population / sample",
      bodyAr:
        "المجتمع كل المجموعة المستهدفة. العينة الجزء اللي بتسأله فعلًا. العينة العادلة صورة مصغّرة للمجتمع، مش أسهل ناس تلاقيهم. عشوائية بسيطة بالقرعة؛ طبقية تقسم شرائح بعدين تسحب من كل شريحة.",
      bodyEn:
        "The population is the whole target group. The sample is the part you actually ask. A fair sample is a miniature of the population, not whoever is easiest to reach. Simple random sampling draws by chance; stratified sampling draws from each stratum.",
      exampleAr: "المجتمع: كل طلاب تانية ثانوي في المدرسة. العينة: 40 طالب بالقرعة من كل شعبة.",
      exampleEn: "Population: every Year 11 student in the school. Sample: 40 students drawn by lot from each stream.",
    },
    {
      termAr: "تحيز العينة",
      termEn: "Sampling bias",
      bodyAr:
        "تحيز العينة اختيار غير عادل يخلي النتيجة واثقة وهي غلط. تحيز الاختيار الذاتي: اللي مهتم بس هو اللي يرد على استطلاع الويب. متعمّمش من جروب واتساب على «كل الأسرة المصرية».",
      bodyEn:
        "Sampling bias is an unfair pick that makes a confident wrong answer. Self-selection: only the keen answer a web poll. Do not generalise from a WhatsApp group to “every Egyptian family”.",
      exampleAr: "استطلاع على نادي الشطرنج عن «حب الرياضيات» مش بيمثل المدرسة كلها.",
      exampleEn: "A chess-club poll about “liking maths” does not represent the whole school.",
    },
  ],
  "5-2": [
    {
      termAr: "قيمة مفقودة",
      termEn: "Missing value",
      bodyAr:
        "القيمة المفقودة خلية فاضية. الحل مش زر واحد: احذف الصف لو المعنى يضيع، أو عبّي بحذر، أو علّم إنها ناقصة. اسأل ليه فاضية: الطالب غاب، ولا الاستمارة باظت.",
      bodyEn:
        "A missing value is a blank cell. There is no single magic button: drop the row if meaning is lost, impute carefully, or flag it as missing. Ask why it is blank: the student was absent, or the form broke.",
      exampleAr: "خانة درجة الامتحان فاضية لأن الطالب معذور — متخلّهاش صفر من غير ما تكتب السبب.",
      exampleEn: "An exam cell is empty because the student had an excuse — do not write zero without recording why.",
    },
    {
      termAr: "قيمة شاذة",
      termEn: "Outlier",
      bodyAr:
        "القيمة الشاذة بعيدة جدًا عن الباقي: ممكن غلط كتابة (درجة 250 من 100) أو حقيقة نادرة (طالب متفوق جدًا). متمسحهوش تلقائيًا. راجع المصدر الأول.",
      bodyEn:
        "An outlier sits far from the rest: a typing error (a mark of 250 out of 100) or a rare truth (an outstanding student). Do not delete it on sight. Check the original source.",
      exampleAr: "مصروف 5000 جنيه لطالب واحد في استبيان الجيب — غالبًا صفر زيادة، راجع الورقة.",
      exampleEn: "One student reports 5000 pounds pocket money — likely an extra zero; check the paper.",
    },
    {
      termAr: "تطبيع / تقييس",
      termEn: "Normalise / standardise",
      bodyAr:
        "التطبيع يحوّل القيم إلى مدى 0–1 عشان المقارنة. التقييس يخلّي المتوسط 0 والانحراف 1. من غير توحيد، مادة درجتها من 20 تتغلب ظلمًا على مادة من 100 في مجموع ساذج.",
      bodyEn:
        "Normalising scales values to 0–1 for comparison. Standardising sets mean 0 and standard deviation 1. Without a common scale, a subject marked out of 20 unfairly loses to a subject out of 100 in a naive total.",
      exampleAr: "نحوّل درجات القصير والطويل لنفس السلم قبل ما نقارن الشعبتين.",
      exampleEn: "We put short-test and long-exam marks on the same scale before we compare streams.",
    },
    {
      termAr: "تكرار",
      termEn: "Duplicate",
      bodyAr:
        "صفّان متشابهان ممكن يكونوا نسخ غلط أو عمليتين حقيقيتين في نفس اليوم. متدمجوش قبل ما تتأكد. وحّد كتابة التاريخ والجنس قبل أي مجموع، لأن «١٢/٣» و«2026-03-12» يتعدّوا اتنين بالغلط.",
      bodyEn:
        "Two similar rows may be a copy error or two real events on the same day. Do not merge until you know. Unify date and gender spellings before any total, because 12/3 and 2026-03-12 can be counted as two by mistake.",
      exampleAr: "شراءان لنفس القلم في نفس الدقيقة غالبًا ضغط زر مرتين، مش عميل اشترى مرتين.",
      exampleEn: "Two sales of the same pen in the same minute are often a double click, not two customers.",
    },
  ],
  "5-3": [
    {
      termAr: "بيانات مفتوحة",
      termEn: "Open data",
      bodyAr:
        "البيانات المفتوحة بيانات عامة ينفع تعيد استخدامها بشروط واضحة. تختصر وقت الجمع. اسأل الترخيص والتحيز المحتمل وتعريف العمود. وثّق المصدر في أي تقرير مدرسي.",
      bodyEn:
        "Open data is public data you may reuse under a clear licence. It saves collection time. Ask about the licence, possible bias, and column definitions. Cite the source in any school report.",
      exampleAr: "ملف أسعار الخضار من بوابة حكومية، وتحت الجدول تكتب الرابط وتاريخ الزيارة.",
      exampleEn: "A vegetable-price file from a government portal, with the link and visit date under the table.",
    },
    {
      termAr: "واجهة برمجة",
      termEn: "API",
      bodyAr:
        "واجهة البرمجة هنا طريقة منظّمة تجيب بيانات محدّثة من المصدر: تطلب، يردّ بنص منظّم. الملف المحمّل مرة ممكن يقديم. الواجهة البرمجية تديك شريحة حية لو المصدر لسه بيحدّث.",
      bodyEn:
        "Here an API is a structured way to fetch fresh data from a source: you request, it replies with structured text. A file downloaded once can go stale. An API gives a live slice if the source still updates.",
      exampleAr: "تطبيق الطقس في الإذاعة المدرسية يسحب درجة الحرارة كل صباح من واجهة الرصد.",
      exampleEn: "The school radio weather slot pulls the morning temperature from the weather API.",
    },
    {
      termAr: "الترخيص",
      termEn: "Licence",
      bodyAr:
        "الترخيص شروط إعادة الاستخدام: هل يجوز النسخ، التعديل، والنشر التجاري. «موجود على النت» مش إذن. لو الرخصة تمنع إعادة النشر، استخدم الرقم في البحث واذكر المصدر من غير ما تعيد توزيع الملف.",
      bodyEn:
        "A licence states the reuse rules: whether you may copy, change, and publish commercially. “It is on the internet” is not permission. If the licence blocks republication, use the number in your research and cite the source without redistributing the file.",
      exampleAr: "جدول بترخيص «للعرض فقط» مينفعش يتحط كامل في ملزمة للبيع.",
      exampleEn: "A “display only” table must not be copied in full into a booklet for sale.",
    },
    {
      termAr: "تاريخ التحديث",
      termEn: "Update date",
      bodyAr:
        "تاريخ التحديث يقول امتى الأرقام اتلمّت آخر مرة. رقم قديم يبني قرار غلط: كثافة سكان، أسعار، أو نسب نجاح لسنة فاتت. اكتب التاريخ جنب المصدر.",
      bodyEn:
        "The update date says when the numbers were last collected. A stale figure builds a wrong decision: population density, prices, or last year's pass rate. Write the date next to the source.",
      exampleAr: "خريطة مواصلات 2018 مش تنفع تخطط بيها خط الأتوبيس النهاردة.",
      exampleEn: "A 2018 transport map is the wrong base for today's bus route.",
    },
  ],
  "6-1": [
    {
      termAr: "إحصاء وصفي",
      termEn: "Descriptive stats",
      bodyAr:
        "الإحصاء الوصفي يلخّص العينة اللي قدامك: متوسط، وسيط، مدى، تباين. مش بيعمّم على المجتمع. المتوسط يخدع لو فيه قيمة شاذة؛ شوف الوسيط كمان.",
      bodyEn:
        "Descriptive statistics summarise the sample in front of you: mean, median, range, spread. They do not generalise to the population. The mean lies when an outlier sits in the set; look at the median too.",
      exampleAr: "متوسط درجات الفصل 14، والوسيط 16، لأن درجتين صفر سحبوا المتوسط لتحت.",
      exampleEn: "The class mean is 14 and the median is 16, because two zeros pulled the mean down.",
    },
    {
      termAr: "استدلال",
      termEn: "Inference",
      bodyAr:
        "الاستدلال تعميم حذر من العينة إلى المجتمع مع مقدار عدم اليقين. السؤال: إلى أي حد يجوز نعمّم؟ مش: احفظ الرقم. عينة صغيرة تخلّي التعميم أضعف.",
      bodyEn:
        "Inference is a cautious generalisation from sample to population, with uncertainty. The question is how far we may generalise, not “memorise this number”. A small sample makes the claim weaker.",
      exampleAr: "40 طالب من مدرسة واحدة مش يكفي نقول إن كل تانية ثانوي في المحافظة بتحب البرمجة.",
      exampleEn: "Forty students in one school are not enough to say every Year 11 in the governorate likes programming.",
    },
    {
      termAr: "فرضية",
      termEn: "Hypothesis",
      bodyAr:
        "الفرضية ادعاء نختبره بالبيانات مش بالشعور. نكتبها قبل ما نبص على النتيجة عشان منركّبش الحكاية بعد ما نشوف الرقم. النتيجة إما تدعم الفرضية أو تضعفها، نادرًا ما «تثبت للأبد».",
      bodyEn:
        "A hypothesis is a claim we test with data, not with feeling. Write it before you look at the result so you do not invent the story afterwards. The result supports or weakens the claim; it rarely “proves it forever”.",
      exampleAr: "فرضية: طلاب الشعبة الإنجليزية يكملوا الواجب أسرع. بعدين نقيس، منغير ما نغيّر الفرضية بعد الجدول.",
      exampleEn: "Hypothesis: the English-stream students finish homework faster. Then we measure, without rewriting the claim after the table.",
    },
    {
      termAr: "فترة ثقة",
      termEn: "Confidence interval",
      bodyAr:
        "فترة الثقة مدى نحط فيه تقدير المجتمع مع عدم اليقين. عينة صغيرة → فترة واسعة → متصرخش بنتيجة قاطعة. الارتباط بين متغيرين مش معناه إن واحد سبّب التاني.",
      bodyEn:
        "A confidence interval is a range for the population estimate, with uncertainty. A small sample gives a wide interval — do not shout a final truth. Correlation between two variables is not proof that one caused the other.",
      exampleAr: "نسبة الغياب «بين 8٪ و18٪» أصدق من جملة «الغياب 12٪ بالضبط».",
      exampleEn: "An absence rate “between 8% and 18%” is more honest than “absence is exactly 12%”.",
    },
  ],
  "6-2": [
    {
      termAr: "انحدار خطي",
      termEn: "Linear regression",
      bodyAr:
        "الانحدار الخطي خط يوصف علاقة تقريبية بين متغيرين. استخدمه لما تتوقع اتجاه، مش لما النقاط سحابة بلا شكل. الخط أداة وصف، مش برهان إن س يسبب ص.",
      bodyEn:
        "Linear regression is a line that roughly describes a relationship between two variables. Use it when you expect a trend, not when the points are a shapeless cloud. The line is a description, not proof that X causes Y.",
      exampleAr: "ساعات المذاكرة في الأسبوع مقابل درجة الواجب — خط يميل لطيف، مش ضمان سببية.",
      exampleEn: "Hours of study versus homework mark — a gentle slope, not a proof of cause.",
    },
    {
      termAr: "بواقي",
      termEn: "Residuals",
      bodyAr:
        "الباقي فرق الواقع عن الخط: القيمة الحقيقية ناقص القيمة المتوقعة. لو البواقي كبيرة ومبعثرة، الخط ضعيف ومش ينفع للتنبؤ.",
      bodyEn:
        "A residual is reality minus the line: actual value minus predicted value. Large scattered residuals mean a weak fit that should not be used to predict.",
      exampleAr: "كل النقاط بعيدة عن الخط بمقدار كبير — ندور علاقة تانية أو نوقف الادعاء.",
      exampleEn: "Every point sits far from the line — look for another relationship or drop the claim.",
    },
    {
      termAr: "استكمال",
      termEn: "Extrapolation",
      bodyAr:
        "الاستكمال تنبؤ خارج مدى البيانات اللي الخط اتبنى عليها. خطر: الخط ممكن ينكسر بره العينة. متستخدمش درجات الشهر الأول عشان تتوقع مجموع السنة من غير دليل جديد.",
      bodyEn:
        "Extrapolation predicts outside the data range the line was built on. It is risky: the pattern may break beyond the sample. Do not use the first month's marks to forecast the year's total with no new evidence.",
      exampleAr: "خط طول الطلاب من 12 لـ 15 سنة مش يتسحب عشان تتوقع طولهم في الستين.",
      exampleEn: "A height line from ages 12 to 15 must not be pulled to predict height at sixty.",
    },
    {
      termAr: "متغير تفسيري",
      termEn: "Explanatory variable",
      bodyAr:
        "المتغير التفسيري اللي بنستخدمه نشرح أو نتوقع به المتغير الآخر. اسأل: هل منطقي ولا صدفة؟ متخلّيش لون الشنطة متغير تفسيري لدرجة الرياضيات من غير قصة سببية.",
      bodyEn:
        "The explanatory variable is the one we use to explain or predict the other. Ask: is it sensible, or only a coincidence? Do not make bag colour an explanatory variable for a maths mark with no causal story.",
      exampleAr: "عدد الحصص المحضورة أوضح كمتغير تفسيري للدرجة من برج الطالب.",
      exampleEn: "Lessons attended is a clearer explanatory variable for a mark than a student's star sign.",
    },
  ],
  "6-3": [
    {
      termAr: "رسم أعمدة",
      termEn: "Bar chart",
      bodyAr:
        "رسم الأعمدة يقارن فئات: شعب، مواد، أيام. كل عمود فئة. اختَر الرسم اللي يخدم السؤال، مش الأجمل. متقطعش المحور الرأسي عشان تضخّم فرق تافه.",
      bodyEn:
        "A bar chart compares categories: streams, subjects, days. Each bar is a category. Pick the chart that serves the question, not the prettiest one. Do not crop the y-axis to inflate a tiny gap.",
      exampleAr: "أعمدة عدد الغياب في كل يوم من أيام الأسبوع.",
      exampleEn: "Bars for absences on each weekday.",
    },
    {
      termAr: "خط زمني",
      termEn: "Line chart",
      bodyAr:
        "الخط الزمني يتتبع التغير عبر الوقت: شهور، أسابيع، سنين. النقطة تتوصل بالتالي عشان العين تشوف الاتجاه. مش مناسب لفئات مالهاش ترتيب زمني.",
      bodyEn:
        "A line chart tracks change over time: months, weeks, years. Points join so the eye sees the trend. It is a poor fit for categories with no time order.",
      exampleAr: "متوسط درجة الواجب من أسبوع 1 لـ أسبوع 8.",
      exampleEn: "Mean homework mark from week 1 to week 8.",
    },
    {
      termAr: "دائرة",
      termEn: "Pie",
      bodyAr:
        "الدائرة أجزاء من كل. ضعيفة لو الشرائح كتير أو الفروقات صغيرة. العين تقارن أطوال أسهل من زوايا. لو عندك أكثر من خمس فئات، الأعمدة أوضح.",
      bodyEn:
        "A pie shows parts of a whole. It is weak when there are many slices or tiny differences. The eye compares lengths more easily than angles. With more than five categories, bars are clearer.",
      exampleAr: "نصيب ثلاث شعب من عدد الفصل — دائرة مقبولة. عشر مواد — أعمدة.",
      exampleEn: "Three streams as a share of the class — a pie can work. Ten subjects — use bars.",
    },
    {
      termAr: "المصدر",
      termEn: "Source",
      bodyAr:
        "المصدر منين جت الأرقام، ويتكتب تحت الرسم مع التاريخ. عنوان الرسم يقول الادعاء، والمحاور تتسمّى. رسم من غير مصدر رسم ناقص حتى لو الألوان حلوة.",
      bodyEn:
        "The source is where the numbers came from; cite it under the chart with the date. Title the claim and label the axes. A chart with no source is unfinished even if the colours look good.",
      exampleAr: "تحت الأعمدة: «سجلات الحضور، مدرسة المنصة، سبتمبر 2026».",
      exampleEn: "Under the bars: “Attendance logs, platform school, September 2026.”",
    },
  ],
  "7-1": [
    {
      termAr: "تعلم بإشراف",
      termEn: "Supervised",
      bodyAr:
        "التعلم بإشراف أمثلة معلّمة: مدخل معروف ومخرج معروف. النموذج يتعلم الربط بعدين يتوقع لمثال جديد. جودة النموذج = جودة البيانات + خوارزمية مناسبة + تقييم صادق.",
      bodyEn:
        "Supervised learning uses labeled examples: a known input and a known output. The model learns the mapping, then predicts for a new example. Quality = data quality + a fitting algorithm + honest evaluation.",
      exampleAr: "صور تفاح مكتوب عليها «تفاح» و«برتقال» عشان النموذج يصنّف صورة جديدة.",
      exampleEn: "Apple and orange photos labeled so the model can classify a new photo.",
    },
    {
      termAr: "تعلم بلا إشراف",
      termEn: "Unsupervised",
      bodyAr:
        "التعلم بلا إشراف يدور تجمعات أو أنماط من غير تسمية جاهزة. مفيد لما ماتعرفش الفئات مقدمًا. النتيجة «مجموعة أ ومجموعة ب» محتاجة تفسير بشري بعدين.",
      bodyEn:
        "Unsupervised learning looks for clusters or patterns without ready labels. It helps when you do not know the classes in advance. “Group A and group B” still need a human explanation afterwards.",
      exampleAr: "تجميع إجابات الاستبيان إلى مجموعات اهتمام من غير ما نسمّيها قبل التشغيل.",
      exampleEn: "Clustering survey answers into interest groups without naming them before the run.",
    },
    {
      termAr: "تدريب / اختبار",
      termEn: "Train / test",
      bodyAr:
        "تقسّم البيانات: جزء يتعلم عليه النموذج، وجزء ماشفوش عشان تقيس بصدق. لو اختبرت على بيانات التدريب الدرجة تبقى متفائلة كاذبة. النموذج يحفظ اللي أطعمته؛ لو أطعمته انحياز يطلّع انحياز.",
      bodyEn:
        "Split the data: one part to learn on, one part the model has not seen so you can measure honestly. Testing on the training set gives a falsely optimistic score. A model remembers what you fed it; biased food becomes biased output.",
      exampleAr: "80٪ من كشوف السنوات السابقة للتدريب، و20٪ لامتحان ما اتشافش.",
      exampleEn: "80% of past mark sheets for training, 20% for a test the model has not seen.",
    },
    {
      termAr: "تصنيف",
      termEn: "Classification",
      bodyAr:
        "التصنيف يتوقع فئة: ناجح/راسب، مزعج/سليم، تفاح/برتقال. الانحدار يتوقع رقم. متخلطش الاتنين في نفس جملة التقييم.",
      bodyEn:
        "Classification predicts a class: pass/fail, spam/ham, apple/orange. Regression predicts a number. Do not mix the two in the same evaluation sentence.",
      exampleAr: "«هل الرسالة احتيال؟» تصنيف. «كام درجة متوقعة؟» انحدار.",
      exampleEn: "“Is this message fraud?” is classification. “What mark is predicted?” is regression.",
    },
  ],
  "7-2": [
    {
      termAr: "عصبون اصطناعي",
      termEn: "Artificial neuron",
      bodyAr:
        "العصبون الاصطناعي وحدة تجمع مدخلات موزونة بعدين تمرّر الناتج من دالة تفعيل وتطلع خرج. مش نسخة بيولوجية دقيقة؛ استعارة حسابية. شبكة من العصبونات تتعلم تمثيلات: حواف ثم أشكال ثم وجه.",
      bodyEn:
        "An artificial neuron combines weighted inputs, passes the sum through an activation, and emits an output. It is not an exact biological copy; it is a computing metaphor. A network of neurons learns representations: edges, then shapes, then a face.",
      exampleAr: "ثلاث درجات مواد تدخل العصبون، والخرج «خطر الرسوب» أو لا حسب الأوزان.",
      exampleEn: "Three subject marks enter a neuron; the output is “risk of fail” or not, according to the weights.",
    },
    {
      termAr: "وزن",
      termEn: "Weight",
      bodyAr:
        "الوزن قوة الصلة بين وحدتين. التعلم يعدّل الأوزان عشان الخطأ يقل. وزن كبير يعني المدخل ده مؤثر. الأوزان مش معناها إن النموذج «فهم» القصة الإنسانية.",
      bodyEn:
        "A weight is the strength of a connection. Learning adjusts weights so error falls. A large weight means that input matters more. Weights do not mean the model “understood” the human story.",
      exampleAr: "وزن درجة الرياضيات أعلى من وزن لون الغلاف لما نتوقع النجاح.",
      exampleEn: "The maths-mark weight is larger than the cover-colour weight when we predict a pass.",
    },
    {
      termAr: "طبقة",
      termEn: "Layer",
      bodyAr:
        "الطبقة مجموعة عصبونات تشتغل مع بعض. العمق يعني طبقات مخفية أكثر. العمق قوة لو فيه بيانات وحساب كافيين. لمسألة صغيرة جدول بسيط أوضح وأرخص.",
      bodyEn:
        "A layer is a group of neurons that work together. Depth means more hidden layers. Depth is power when you have enough data and compute. For a small problem a simple table is clearer and cheaper.",
      exampleAr: "شبكة بثلاث طبقات مخفية لتمييز أرقام مكتوبة بخط اليد.",
      exampleEn: "A net with three hidden layers that reads handwritten digits.",
    },
    {
      termAr: "الصندوق الأسود",
      termEn: "Black box",
      bodyAr:
        "الصندوق الأسود نموذج يصعب شرح ليه قرر كده بعد ما قرر. مشكلة لما القرار يمس حياة أو درجة. العمق من غير تفسير يكفي للمساءلة قرار خطر في المدرسة والمستشفى.",
      bodyEn:
        "A black box is a model that is hard to explain after it decides. That is a problem when the decision touches a life or a mark. Depth without enough explanation for accountability is a risky choice in a school or a hospital.",
      exampleAr: "نظام حرمان من النشاط من غير ما نقدر نقول أنهي خانة حرّكت القرار.",
      exampleEn: "A system bans a student from an activity and nobody can say which field moved the decision.",
    },
  ],
  "7-3": [
    {
      termAr: "نموذج لغة كبير",
      termEn: "LLM",
      bodyAr:
        "نموذج اللغة الكبير شبكة اتدرّبت على نص هائل عشان تتوقع الوحدة التالية من النص. مش «تعرف» كالإنسان؛ بتحسب أرجح تكملة. اللغة السلسة مش دليل صدق.",
      bodyEn:
        "A large language model is a network trained on huge text to predict the next token. It does not “know” as a person does; it scores the next likely piece. Fluent language is not proof of truth.",
      exampleAr: "يسأل الطالب عن قانون مور فيرد بفقرة فصيحة؛ لسه لازم تتراجع من الملزمة أو الكتاب.",
      exampleEn: "A student asks about Moore's Law and gets a fluent paragraph; it still needs a check against the booklet or the book.",
    },
    {
      termAr: "توجيه الأوامر",
      termEn: "Prompting",
      bodyAr:
        "توجيه الأوامر صياغة السؤال. سؤال غامض يرد رد عام. سؤال فيه الدور والسياق والمطلوب يرد أوضح. الصياغة جزء من المهارة، مش غش لو أنت اللي بتراجع وتكتب في الآخر.",
      bodyEn:
        "Prompting is how you ask. A vague question gets a vague reply. A prompt that names the role, the context, and the job gets a clearer reply. Wording is a skill, not cheating, if you still review and write the final work.",
      exampleAr: "«اشرح قانون مور لطالب تانية ثانوي بجملة التعريف ومثال معمل» أوضح من «مور إيه؟».",
      exampleEn: "“Explain Moore's Law to a Year 11 student with the definition and a lab example” beats “what's Moore?”.",
    },
    {
      termAr: "هلوسة",
      termEn: "Hallucination",
      bodyAr:
        "الهلوسة جملة فصيحة من غير سند. استخدم النموذج للشرح والتمرين، بعدين أقفله واكتب من فهمك. متلزقش رده في الامتحان.",
      bodyEn:
        "A hallucination is fluent text with no grounding. Use the model to explain and drill, then close it and write from your understanding. Do not paste the reply into an exam.",
      exampleAr: "النموذج ذكر صفحة كتاب مش موجودة؛ تفتح الكتاب وتتأكد.",
      exampleEn: "The model cites a book page that does not exist; you open the book and check.",
    },
    {
      termAr: "رمز / توكن",
      termEn: "Token",
      bodyAr:
        "التوكن وحدة النص اللي النموذج بيتوقعها واحدة ورا التانية: كلمة أو جزء كلمة. طول الرد محدود بعدد التوكنات. تقطيع غريب أحيانًا يطلع من طريقة التوكن مش من «تفكير».",
      bodyEn:
        "A token is the text unit the model predicts one after another: a word or part of a word. Reply length is limited by token count. Odd splits sometimes come from tokenisation, not from “thinking”.",
      exampleAr: "كلمة إنجليزية طويلة تتقسم توكنين؛ النموذج يكمل الجزء الثاني لوحده.",
      exampleEn: "A long English word may split into two tokens; the model completes the second piece on its own.",
    },
  ],
};

export function explainsForLesson(id: string): LessonExplain[] {
  return EXPLAINS[id] ?? [];
}

export function allLessonExplains(): { lessonId: string; items: LessonExplain[] }[] {
  return Object.entries(EXPLAINS).map(([lessonId, items]) => ({ lessonId, items }));
}
