import type { ReactNode } from "react";
import type { Locale } from "@/lib/locale";

function Frame({
  locale,
  titleAr,
  titleEn,
  captionAr,
  captionEn,
  color,
  children,
}: {
  locale: Locale;
  titleAr: string;
  titleEn: string;
  captionAr: string;
  captionEn: string;
  color: string;
  children: ReactNode;
}) {
  const ar = locale === "ar";
  return (
    <figure className="overflow-hidden rounded-3xl bg-white ring-1 ring-primary/10">
      <p className="px-3 pt-3 text-xs font-semibold" style={{ color }}>
        {ar ? titleAr : titleEn}
      </p>
      <div className="p-3" dir="ltr">
        {children}
      </div>
      <figcaption className="px-3 pb-3 text-[11px] leading-relaxed text-foreground/65">
        {ar ? captionAr : captionEn}
      </figcaption>
    </figure>
  );
}

function Pill({
  label,
  color,
  dark,
  dir,
}: {
  label: string;
  color: string;
  dark?: boolean;
  dir?: "rtl" | "ltr";
}) {
  return (
    <span
      dir={dir}
      className="inline-flex min-h-10 items-center justify-center rounded-2xl px-3 py-2 text-center text-xs font-semibold leading-snug text-white"
      style={{ background: dark ? "#111827" : color }}
    >
      {label}
    </span>
  );
}

function Arrow() {
  return (
    <span className="px-1 text-sm font-bold text-foreground/40" aria-hidden>
      →
    </span>
  );
}

function Draw({ children, tall }: { children: ReactNode; tall?: boolean }) {
  return (
    <svg viewBox="0 0 220 90" className={tall ? "h-28 w-full" : "h-24 w-full"} aria-hidden>
      {children}
    </svg>
  );
}

export function BookletFigure({
  id,
  locale,
  color,
}: {
  id: string;
  locale: Locale;
  color: string;
}) {
  const ar = locale === "ar";
  const rtl: "rtl" | "ltr" = ar ? "rtl" : "ltr";

  if (id === "it-timeline") {
    const steps = ar
      ? ["حاسوب", "إنترنت", "محمول", "سحابة", "ذكاء"]
      : ["Computer", "Internet", "Mobile", "Cloud", "AI"];
    return (
      <Frame locale={locale} color={color} titleAr="شكل 1 — خط الزمن" titleEn="Fig 1 — Timeline" captionAr="كل مرحلة غيّرت الشغل والتعلم، مش بس شكل الجهاز." captionEn="Each stage changed work and learning, not only the machine’s look.">
        <div className="flex items-center justify-between gap-1">
          {steps.map((step, index) => (
            <div key={step} className="flex flex-1 items-center">
              <Pill label={step} color={color} dir={rtl} />
              {index < steps.length - 1 ? <Arrow /> : null}
            </div>
          ))}
        </div>
      </Frame>
    );
  }

  if (id === "ai-nest") {
    const rings = ar
      ? ["ذكاء اصطناعي", "تعلم آلي", "تعلم عميق", "توليدي"]
      : ["AI", "Machine learning", "Deep learning", "Generative"];
    return (
      <Frame locale={locale} color={color} titleAr="شكل 2 — درجات الذكاء" titleEn="Fig 2 — AI nest" captionAr="توليدي جزء من العميق، والعميق جزء من الآلي، والآلي جزء من الذكاء الاصطناعي." captionEn="Generative sits inside deep learning, inside machine learning, inside AI.">
        <div className="space-y-1.5">
          {rings.map((ring, index) => (
            <div
              key={ring}
              className="rounded-2xl px-3 py-2 text-center text-xs font-semibold text-white"
              style={{ background: color, opacity: 1 - index * 0.12, marginInline: `${index * 12}px` }}
              dir={rtl}
            >
              {ring}
            </div>
          ))}
        </div>
      </Frame>
    );
  }

  if (id === "ai-life") {
    const cards = ar
      ? ["اقتراح فيديو", "فرز المصنع", "مراجعة الكتاب"]
      : ["Video suggest", "Factory sort", "Check the book"];
    return (
      <Frame locale={locale} color={color} titleAr="شكل 3 — أين يظهر الذكاء" titleEn="Fig 3 — Where AI appears" captionAr="مثال يومي، مثال صناعي، وقاعدة: راجع المخرج من الكتاب." captionEn="A daily example, an industry example, and the rule: check the output.">
        <div className="grid grid-cols-3 gap-2">
          {cards.map((card) => (
            <Pill key={card} label={card} color={color} dir={rtl} />
          ))}
        </div>
      </Frame>
    );
  }

  if (id === "encrypt") {
    return (
      <Frame locale={locale} color={color} titleAr="شكل 4 — التشفير" titleEn="Fig 4 — Encryption" captionAr="الرسالة واضحة عند صاحب المفتاح فقط." captionEn="Only the key holder can read the message.">
        <div className="flex items-center justify-center gap-2">
          <Pill label={ar ? "نص واضح" : "Plain text"} color={color} dir={rtl} />
          <Arrow />
          <Pill label={ar ? "المفتاح" : "Key"} color={color} dark dir={rtl} />
          <Arrow />
          <Pill label={ar ? "نص مشفّر" : "Cipher"} color={color} dir={rtl} />
        </div>
      </Frame>
    );
  }

  if (id === "auth") {
    const bits = ar ? ["تعرفه", "تملكه", "أنت عليه"] : ["Know", "Have", "Are"];
    return (
      <Frame locale={locale} color={color} titleAr="شكل 5 — المصادقة" titleEn="Fig 5 — Authentication" captionAr="المصادقة بعاملين: شيء تعرفه + شيء تملكه أو أنت عليه." captionEn="Two factors: something you know plus something you have or are.">
        <div className="flex flex-col items-center gap-2">
          <Pill label="2FA" color={color} dark />
          <div className="grid w-full grid-cols-3 gap-2">
            {bits.map((bit) => (
              <Pill key={bit} label={bit} color={color} dir={rtl} />
            ))}
          </div>
        </div>
      </Frame>
    );
  }

  if (id === "firewall") {
    return (
      <Frame locale={locale} color={color} titleAr="شكل 6 — الجدار والشبكة" titleEn="Fig 6 — Firewall" captionAr="الجدار يفلتر الحركة. افصل الضيوف عن الأجهزة الحساسة." captionEn="The firewall filters traffic. Keep guests off sensitive devices.">
        <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1">
          <Pill label={ar ? "إنترنت" : "Internet"} color={color} dir={rtl} />
          <Arrow />
          <Pill label={ar ? "جدار الحماية" : "Firewall"} color={color} dark dir={rtl} />
          <Arrow />
          <div className="grid gap-1">
            <Pill label={ar ? "داخلية" : "LAN"} color={color} dir={rtl} />
            <Pill label={ar ? "ضيوف" : "Guest"} color={color} dir={rtl} />
            <Pill label={ar ? "حساسة" : "Secure"} color={color} dir={rtl} />
          </div>
        </div>
      </Frame>
    );
  }

  if (id === "web-stack") {
    const layers = ar
      ? ["واجهة أمامية — المتصفح", "خادم / خلفية — المنطق", "بيانات — التخزين"]
      : ["Frontend — browser", "Server / backend — logic", "Data — storage"];
    return (
      <Frame locale={locale} color={color} titleAr="شكل 7 — طبقات التطبيق" titleEn="Fig 7 — App layers" captionAr="المتصفح يعرض. الخادم يقرر ويحفظ." captionEn="The browser shows. The server decides and stores.">
        <div className="space-y-2">
          {layers.map((layer) => (
            <Pill key={layer} label={layer} color={color} dir={rtl} />
          ))}
        </div>
      </Frame>
    );
  }

  if (id === "http") {
    return (
      <Frame locale={locale} color={color} titleAr="شكل 8 — GET و POST" titleEn="Fig 8 — GET and POST" captionAr="GET يجلب من غير تغيير مقصود. POST يرسل عشان ينشئ أو يعالج." captionEn="GET fetches without intending to change. POST sends data to create or process.">
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Pill label={ar ? "المتصفح" : "Browser"} color={color} dir={rtl} />
            <span className="text-xs font-bold" style={{ color }}>
              GET →
            </span>
            <Pill label={ar ? "الخادم" : "Server"} color={color} dark dir={rtl} />
          </div>
          <div className="flex items-center justify-center gap-2">
            <Pill label={ar ? "المتصفح" : "Browser"} color={color} dir={rtl} />
            <span className="text-xs font-bold" style={{ color }}>
              POST →
            </span>
            <Pill label={ar ? "الخادم" : "Server"} color={color} dark dir={rtl} />
          </div>
        </div>
      </Frame>
    );
  }

  if (id === "html-css-js") {
    const trio = ar
      ? [
          { label: "HTML — البنية", hint: "عناوين وفقرات" },
          { label: "CSS — الشكل", hint: "ألوان وتنسيق" },
          { label: "JavaScript — التفاعل", hint: "بعد التحميل" },
        ]
      : [
          { label: "HTML — structure", hint: "Headings and links" },
          { label: "CSS — look", hint: "Colour and layout" },
          { label: "JavaScript — action", hint: "After load" },
        ];
    return (
      <Frame locale={locale} color={color} titleAr="شكل 9 — ثلاثية الصفحة" titleEn="Fig 9 — Page trio" captionAr="الهيكل، بعدين الشكل، بعدين الحركة." captionEn="Structure, then look, then motion.">
        <div className="grid grid-cols-3 gap-2">
          {trio.map((item) => (
            <div key={item.label} className="rounded-2xl px-2 py-3 text-center text-white" style={{ background: color }}>
              <p className="text-xs font-semibold" dir={rtl}>
                {item.label}
              </p>
              <p className="mt-1 text-[10px] text-white/80" dir={rtl}>
                {item.hint}
              </p>
            </div>
          ))}
        </div>
      </Frame>
    );
  }

  if (id === "media") {
    const items = ar
      ? [
          { label: "JPEG", hint: "صور فوتوغرافية" },
          { label: "PNG", hint: "شفافية وحواف" },
          { label: "النص", hint: "دقة ومراجعة" },
        ]
      : [
          { label: "JPEG", hint: "Photographs" },
          { label: "PNG", hint: "Transparency" },
          { label: "Text", hint: "Exact review" },
        ];
    return (
      <Frame locale={locale} color={color} titleAr="شكل 10 — اختيار الوسيط" titleEn="Fig 10 — Pick the medium" captionAr="JPEG للصورة، PNG للرسوم الشفافة، والنص لما تحتاج ترجع بسرعة." captionEn="JPEG for photos, PNG for sharp graphics, text when you need to look up.">
        <div className="grid grid-cols-3 gap-2">
          {items.map((item) => (
            <div key={item.label} className="rounded-2xl bg-primary/5 px-2 py-3 text-center">
              <p className="text-sm font-bold" style={{ color }}>
                {item.label}
              </p>
              <p className="mt-1 text-[11px] text-foreground/65" dir={rtl}>
                {item.hint}
              </p>
            </div>
          ))}
        </div>
      </Frame>
    );
  }

  if (id === "ux") {
    const steps = ar ? ["هدف", "خطوات", "قياس", "تعديل"] : ["Goal", "Steps", "Measure", "Change"];
    return (
      <Frame locale={locale} color={color} titleAr="شكل 11 — دورة التجربة" titleEn="Fig 11 — UX cycle" captionAr="التحسين التكراري: جرّب، قيس، عدّل، وأعد." captionEn="Iterate: try, measure, adjust, repeat.">
        <div className="flex items-center justify-between gap-1">
          {steps.map((step, index) => (
            <div key={step} className="flex flex-1 items-center">
              <Pill label={step} color={color} dir={rtl} />
              {index < steps.length - 1 ? <Arrow /> : null}
            </div>
          ))}
        </div>
      </Frame>
    );
  }

  if (id === "collect") {
    return (
      <Frame locale={locale} color={color} titleAr="شكل 12 — جمع البيانات" titleEn="Fig 12 — Collecting data" captionAr="أولية من المصدر. ثانوية من مصدر جاهز. احذر العينة المنحازة." captionEn="Primary from the source. Secondary from a ready source. Watch biased samples.">
        <div className="grid grid-cols-2 gap-2">
          <Pill label={ar ? "أولية: استطلاع أو قياس" : "Primary: survey"} color={color} dir={rtl} />
          <Pill label={ar ? "ثانوية: تقرير جاهز" : "Secondary: report"} color={color} dark dir={rtl} />
        </div>
      </Frame>
    );
  }

  if (id === "clean") {
    const bits = ar ? ["تواريخ موحّدة", "قيم ناقصة", "قيم شاذة"] : ["Unified dates", "Missing values", "Outliers"];
    return (
      <Frame locale={locale} color={color} titleAr="شكل 13 — تنظيف الجدول" titleEn="Fig 13 — Cleaning" captionAr="وحّد الشكل، أصلح الناقص، وراجع الشاذ." captionEn="Unify formats, fix missing values, review outliers.">
        <div className="grid grid-cols-3 gap-2">
          {bits.map((bit) => (
            <Pill key={bit} label={bit} color={color} dir={rtl} />
          ))}
        </div>
      </Frame>
    );
  }

  if (id === "api") {
    return (
      <Frame locale={locale} color={color} titleAr="شكل 14 — البيانات المفتوحة و API" titleEn="Fig 14 — Open data & API" captionAr="اطلب الخدمة بطريقة متفق عليها، واذكر المصدر." captionEn="Ask in an agreed way, and cite the source.">
        <div className="flex items-center justify-center gap-2">
          <Pill label={ar ? "تطبيقك" : "Your app"} color={color} dir={rtl} />
          <Arrow />
          <Pill label="API" color={color} dark />
          <Arrow />
          <Pill label={ar ? "البيانات" : "Data"} color={color} dir={rtl} />
        </div>
      </Frame>
    );
  }

  if (id === "charts") {
    return (
      <Frame locale={locale} color={color} titleAr="شكل 15 — اختر الرسم" titleEn="Fig 15 — Choose the chart" captionAr="أعمدة للمقارنة، خط للزمن، ودائرة لجزء من كل." captionEn="Bars for comparison, a line for time, a pie for part-to-whole.">
        <div className="grid grid-cols-3 gap-3">
          <div className="flex h-20 items-end justify-center gap-1 rounded-2xl bg-primary/5 px-2 pb-2">
            <span className="w-3 rounded-t" style={{ height: "28%", background: color }} />
            <span className="w-3 rounded-t" style={{ height: "55%", background: color }} />
            <span className="w-3 rounded-t" style={{ height: "80%", background: color }} />
          </div>
          <div className="flex h-20 items-center justify-center rounded-2xl bg-primary/5">
            <svg viewBox="0 0 80 40" className="h-10 w-16">
              <polyline points="4,32 22,22 40,26 58,10 76,14" fill="none" stroke={color} strokeWidth="3" />
            </svg>
          </div>
          <div className="flex h-20 items-center justify-center rounded-2xl bg-primary/5">
            <span className="size-12 rounded-full" style={{ background: `conic-gradient(${color} 0 70%, #111827 70% 100%)` }} />
          </div>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2 text-center text-[10px] font-semibold text-foreground/60">
          <span dir={rtl}>{ar ? "مقارنة" : "Compare"}</span>
          <span dir={rtl}>{ar ? "عبر الزمن" : "Over time"}</span>
          <span dir={rtl}>{ar ? "جزء من كل" : "Part of whole"}</span>
        </div>
      </Frame>
    );
  }

  if (id === "regress") {
    return (
      <Frame locale={locale} color={color} titleAr="شكل 16 — خط الانحدار" titleEn="Fig 16 — Regression" captionAr="الخط يقرّب العلاقة. الارتباط مش معناها سببية." captionEn="The line approximates a relationship. Correlation is not causation.">
        <svg viewBox="0 0 320 110" className="h-24 w-full">
          <line x1="28" y1="92" x2="300" y2="92" stroke="#111827" />
          <line x1="28" y1="92" x2="28" y2="16" stroke="#111827" />
          <line x1="40" y1="80" x2="290" y2="28" stroke={color} strokeWidth="3" />
          {[
            [58, 74],
            [100, 66],
            [148, 58],
            [196, 46],
            [248, 38],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill={color} />
          ))}
        </svg>
      </Frame>
    );
  }

  if (id === "ml-types") {
    const kinds = ar ? ["تعلم بإشراف", "تعلم بلا إشراف", "تعلم تعزيز"] : ["Supervised", "Unsupervised", "Reinforcement"];
    return (
      <Frame locale={locale} color={color} titleAr="شكل 17 — أنواع التعلم" titleEn="Fig 17 — ML types" captionAr="النوع يتبع شكل البيانات والهدف." captionEn="The type follows the data and the goal.">
        <div className="grid grid-cols-3 gap-2">
          {kinds.map((kind) => (
            <Pill key={kind} label={kind} color={color} dir={rtl} />
          ))}
        </div>
      </Frame>
    );
  }

  if (id === "neural") {
    return (
      <Frame locale={locale} color={color} titleAr="شكل 18 — شبكة عصبونية" titleEn="Fig 18 — Neural net" captionAr="طبقات كثيرة = تعلم عميق. الاختبار غير التدريب." captionEn="Many layers = deep learning. The test set is not the training set.">
        <svg viewBox="0 0 320 110" className="h-24 w-full">
          {[36, 118, 200, 282].map((x, col) =>
            [28, 55, 82].slice(0, col === 0 || col === 3 ? 2 : 3).map((y) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="8" fill={color} />
            )),
          )}
          <line x1="44" y1="28" x2="110" y2="28" stroke={color} />
          <line x1="44" y1="28" x2="110" y2="55" stroke={color} />
          <line x1="44" y1="82" x2="110" y2="55" stroke={color} />
          <line x1="126" y1="55" x2="192" y2="28" stroke={color} />
          <line x1="126" y1="55" x2="192" y2="82" stroke={color} />
          <line x1="208" y1="55" x2="274" y2="28" stroke={color} />
          <line x1="208" y1="55" x2="274" y2="82" stroke={color} />
        </svg>
        <div className="mt-1 grid grid-cols-4 text-center text-[10px] font-semibold text-foreground/60">
          <span dir={rtl}>{ar ? "مدخل" : "Input"}</span>
          <span dir={rtl}>{ar ? "طبقة" : "Layer"}</span>
          <span dir={rtl}>{ar ? "طبقة" : "Layer"}</span>
          <span dir={rtl}>{ar ? "مخرج" : "Output"}</span>
        </div>
      </Frame>
    );
  }

  if (id === "llm") {
    return (
      <Frame locale={locale} color={color} titleAr="شكل 19 — راجع المساعد" titleEn="Fig 19 — Check the helper" captionAr="الجملة المرتبة ممكن تطلع غلط. راجع الكتاب قبل التسليم." captionEn="A tidy sentence can still be wrong. Check the book before you submit.">
        <div className="flex items-center justify-center gap-2">
          <Pill label={ar ? "سؤال الطالب" : "Question"} color={color} dir={rtl} />
          <Arrow />
          <Pill label={ar ? "النموذج" : "Model"} color={color} dark dir={rtl} />
          <Arrow />
          <Pill label={ar ? "الكتاب" : "Book"} color={color} dir={rtl} />
        </div>
      </Frame>
    );
  }

  return null;
}

export const CHAPTER_FIGURES: Record<string, string[]> = {
  "1": ["it-timeline", "ai-nest", "ai-life"],
  "2": ["encrypt", "auth", "firewall"],
  "3": ["web-stack", "http", "html-css-js"],
  "4": ["media", "ux"],
  "5": ["collect", "clean", "api"],
  "6": ["charts", "regress"],
  "7": ["ml-types", "neural", "llm"],
  f1: ["it-timeline", "ai-nest", "llm"],
  f2: ["encrypt", "auth", "firewall"],
  f3: ["web-stack", "http", "html-css-js"],
  f4: ["media", "ux"],
};

type SceneKind = "lab" | "cloud" | "phone" | "lock" | "factory" | "browser" | "table" | "class";

function sceneKind(term: string, scene: string): SceneKind {
  const hay = `${term} ${scene}`.toLowerCase();
  if (/سحاب|cloud|رابط|مجلد/.test(hay)) return "cloud";
  if (/تشفير|مفتاح|encrypt|password|مرور|مصادق|تصيد|phishing|جدار|firewall/.test(hay)) return "lock";
  if (/مصنع|صناع|عيوب|factory|فرز/.test(hay)) return "factory";
  if (/متصفح|ويب|html|css|http|واجهة|صفحة|موقع|browser/.test(hay)) return "browser";
  if (/جدول|بيانات|عينه|عيّنة|تنظيف|api|استطلاع|data/.test(hay)) return "table";
  if (/هاتف|واتس|جروب|محمول|phone|whatsapp/.test(hay)) return "phone";
  if (/حصة|طالب|صف|معلم|معمل|حاسوب|مور|شريحة|lab|moore/.test(hay)) return "lab";
  return "class";
}

function SceneArt({ kind, color }: { kind: SceneKind; color: string }) {
  if (kind === "cloud") {
    return (
      <Draw>
        <rect width="220" height="90" fill={`${color}14`} />
        <ellipse cx="110" cy="48" rx="48" ry="22" fill={color} />
        <ellipse cx="86" cy="50" rx="22" ry="16" fill={color} />
        <ellipse cx="136" cy="50" rx="20" ry="15" fill={color} />
        <rect x="78" y="50" width="64" height="18" fill={color} />
        <rect x="98" y="68" width="24" height="8" rx="2" fill="#111827" />
      </Draw>
    );
  }
  if (kind === "lock") {
    return (
      <Draw>
        <rect width="220" height="90" fill={`${color}14`} />
        <rect x="88" y="40" width="44" height="34" rx="6" fill={color} />
        <path d="M96 40 v-10 a14 14 0 0 1 28 0 v10" fill="none" stroke={color} strokeWidth="6" />
        <circle cx="110" cy="56" r="5" fill="#fff" />
        <rect x="108" y="56" width="4" height="10" fill="#fff" />
      </Draw>
    );
  }
  if (kind === "factory") {
    return (
      <Draw>
        <rect width="220" height="90" fill={`${color}14`} />
        <rect x="40" y="48" width="90" height="28" fill={color} />
        <polygon points="40,48 70,30 100,48" fill={color} />
        <rect x="136" y="36" width="18" height="40" fill="#111827" />
        <rect x="160" y="24" width="18" height="52" fill="#111827" />
        <circle cx="70" cy="62" r="6" fill="#fff" />
        <circle cx="94" cy="62" r="6" fill="#fff" />
      </Draw>
    );
  }
  if (kind === "browser") {
    return (
      <Draw>
        <rect width="220" height="90" fill={`${color}14`} />
        <rect x="36" y="18" width="148" height="54" rx="8" fill={color} />
        <rect x="44" y="26" width="132" height="10" rx="4" fill="#fff" opacity="0.35" />
        <rect x="44" y="42" width="80" height="22" rx="4" fill="#fff" />
        <rect x="130" y="42" width="46" height="22" rx="4" fill="#111827" />
      </Draw>
    );
  }
  if (kind === "table") {
    return (
      <Draw>
        <rect width="220" height="90" fill={`${color}14`} />
        <rect x="40" y="20" width="140" height="52" rx="6" fill="#fff" stroke={color} strokeWidth="3" />
        <line x1="40" y1="36" x2="180" y2="36" stroke={color} strokeWidth="2" />
        <line x1="90" y1="20" x2="90" y2="72" stroke={color} strokeWidth="2" />
        <line x1="140" y1="20" x2="140" y2="72" stroke={color} strokeWidth="2" />
        <rect x="48" y="42" width="30" height="6" rx="2" fill={color} />
        <rect x="98" y="54" width="30" height="6" rx="2" fill={color} />
      </Draw>
    );
  }
  if (kind === "phone") {
    return (
      <Draw>
        <rect width="220" height="90" fill={`${color}14`} />
        <rect x="88" y="10" width="44" height="70" rx="8" fill={color} />
        <rect x="94" y="20" width="32" height="44" rx="3" fill="#fff" />
        <circle cx="110" cy="72" r="3" fill="#fff" />
      </Draw>
    );
  }
  if (kind === "lab") {
    return (
      <Draw>
        <rect width="220" height="90" fill={`${color}14`} />
        <rect x="48" y="28" width="70" height="42" rx="6" fill={color} />
        <rect x="56" y="36" width="54" height="26" fill="#e5e7eb" />
        <rect x="70" y="70" width="26" height="6" fill="#111827" />
        <rect x="138" y="34" width="36" height="36" rx="18" fill={color} />
        <circle cx="156" cy="46" r="7" fill="#fff" />
        <rect x="146" y="54" width="20" height="12" rx="6" fill="#fff" />
      </Draw>
    );
  }
  return (
    <Draw>
      <rect width="220" height="90" fill={`${color}14`} />
      <rect x="50" y="40" width="120" height="28" rx="6" fill={color} />
      <rect x="70" y="22" width="18" height="18" rx="9" fill={color} />
      <rect x="101" y="22" width="18" height="18" rx="9" fill={color} />
      <rect x="132" y="22" width="18" height="18" rx="9" fill={color} />
    </Draw>
  );
}

export function SceneCard({
  locale,
  color,
  scene,
  term,
}: {
  locale: Locale;
  color: string;
  scene: string;
  term: string;
}) {
  const kind = sceneKind(term, scene);
  return (
    <article className="overflow-hidden rounded-3xl bg-white ring-1 ring-primary/10">
      <SceneArt kind={kind} color={color} />
      <div className="px-3 pb-3">
        <p className="text-[11px] font-semibold" style={{ color }}>
          {term}
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-foreground/70">{scene}</p>
      </div>
    </article>
  );
}
