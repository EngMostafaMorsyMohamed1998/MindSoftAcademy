import type { ReactNode } from "react";
import { AiNestDiagram } from "@/components/ai-nest-diagram";
import { TextbookArt } from "@/components/textbook-art";
import { termArt } from "@/lib/booklet-lang";
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
    <figure className="overflow-hidden rounded-xl bg-white ring-1 ring-slate-300">
      <p className="ink-brand px-4 pt-4 text-base font-extrabold" style={{ color }}>
        {ar ? titleAr : titleEn}
      </p>
      <div className="p-4" dir={ar ? "rtl" : "ltr"} style={{ unicodeBidi: "isolate" }}>
        {children}
      </div>
      <figcaption className="px-4 pb-4 text-sm font-semibold leading-7 text-[#111827]">
        {ar ? captionAr : captionEn}
      </figcaption>
    </figure>
  );
}

function Pill({
  label,
  color,
  dark,
}: {
  label: string;
  color: string;
  dark?: boolean;
}) {
  const arabic = /[\u0600-\u06FF]/.test(label);
  return (
    <span
      dir={arabic ? "rtl" : "ltr"}
      className="inline-flex min-h-11 items-center justify-center rounded-lg px-3 py-2 text-center text-sm font-extrabold leading-6 text-white"
      style={{ background: dark ? "#111827" : color, unicodeBidi: "isolate" }}
    >
      {label}
    </span>
  );
}

function Arrow({ flip }: { flip?: boolean }) {
  return (
    <span className="px-1 text-sm font-bold text-foreground/40" aria-hidden>
      {flip ? "←" : "→"}
    </span>
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
      ? [
          { label: "حاسوب", year: "1940" },
          { label: "إنترنت", year: "1990" },
          { label: "محمول", year: "2007" },
          { label: "سحابة", year: "2010" },
          { label: "ذكاء", year: "الآن" },
        ]
      : [
          { label: "Computer", year: "1940" },
          { label: "Internet", year: "1990" },
          { label: "Mobile", year: "2007" },
          { label: "Cloud", year: "2010" },
          { label: "AI", year: "now" },
        ];
    return (
      <Frame locale={locale} color={color} titleAr="شكل 1 — خط الزمن" titleEn="Fig 1 — Timeline" captionAr="من اليمين لليسار: الأقدم ثم الأحدث. كل مرحلة غيّرت الشغل والتعلم." captionEn="Oldest to newest. Each stage changed work and learning, not only the machine.">
        <div className="flex items-stretch justify-between gap-1">
          {steps.map((step, index) => (
            <div key={step.label} className="flex flex-1 items-center">
              <div className="min-w-0 flex-1 text-center">
                <Pill label={step.label} color={color} />
                <p className="mt-1 text-[10px] font-semibold text-foreground/55">{step.year}</p>
              </div>
              {index < steps.length - 1 ? <Arrow flip={ar} /> : null}
            </div>
          ))}
        </div>
      </Frame>
    );
  }

  if (id === "ai-nest") {
    return (
      <Frame locale={locale} color={color} titleAr="شكل 2 — درجات الذكاء" titleEn="Fig 2 — AI nest" captionAr="توليدي جزء من العميق، والعميق جزء من الآلي، والآلي جزء من الذكاء الاصطناعي." captionEn="Generative sits inside deep learning, inside machine learning, inside AI.">
        <div className="rounded-2xl bg-slate-50 p-4">
          <AiNestDiagram locale={locale} />
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
            <Pill key={card} label={card} color={color} />
          ))}
        </div>
      </Frame>
    );
  }

  if (id === "encrypt") {
    return (
      <Frame locale={locale} color={color} titleAr="شكل 4 — التشفير" titleEn="Fig 4 — Encryption" captionAr="الرسالة واضحة عند صاحب المفتاح فقط." captionEn="Only the key holder can read the message.">
        <div className="flex items-center justify-center gap-2">
          <Pill label={ar ? "نص واضح" : "Plain text"} color={color} />
          <Arrow flip={ar} />
          <Pill label={ar ? "المفتاح" : "Key"} color={color} dark />
          <Arrow flip={ar} />
          <Pill label={ar ? "نص مشفّر" : "Cipher"} color={color} />
        </div>
      </Frame>
    );
  }

  if (id === "auth") {
    const bits = ar ? ["تعرفه", "تملكه", "أنت عليه"] : ["Know", "Have", "Are"];
    return (
      <Frame locale={locale} color={color} titleAr="شكل 5 — المصادقة" titleEn="Fig 5 — Authentication" captionAr="المصادقة بعاملين: شيء تعرفه + شيء تملكه أو أنت عليه." captionEn="Two factors: something you know plus something you have or are.">
        <div className="flex flex-col items-center gap-2">
          <Pill label={ar ? "تحقق بخطوتين" : "Two-step check"} color={color} dark />
          <div className="grid w-full grid-cols-3 gap-2">
            {bits.map((bit) => (
              <Pill key={bit} label={bit} color={color} />
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
          <Pill label={ar ? "إنترنت" : "Internet"} color={color} />
          <Arrow flip={ar} />
          <Pill label={ar ? "جدار الحماية" : "Firewall"} color={color} dark />
          <Arrow flip={ar} />
          <div className="grid gap-1">
            <Pill label={ar ? "داخلية" : "LAN"} color={color} />
            <Pill label={ar ? "ضيوف" : "Guest"} color={color} />
            <Pill label={ar ? "حساسة" : "Secure"} color={color} />
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
            <Pill key={layer} label={layer} color={color} />
          ))}
        </div>
      </Frame>
    );
  }

  if (id === "http") {
    return (
      <Frame locale={locale} color={color} titleAr="شكل 8 — طلب قراءة وطلب إرسال" titleEn="Fig 8 — Read and send" captionAr="طلب القراءة يجلب من غير تغيير مقصود. طلب الإرسال يرسل عشان ينشئ أو يعالج." captionEn="A read request fetches without intending to change. A send request creates or processes.">
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Pill label={ar ? "المتصفح" : "Browser"} color={color} />
            <span className="ink-brand text-xs font-bold" style={{ color }}>
              {ar ? "← قراءة" : "Read →"}
            </span>
            <Pill label={ar ? "الخادم" : "Server"} color={color} dark />
          </div>
          <div className="flex items-center justify-center gap-2">
            <Pill label={ar ? "المتصفح" : "Browser"} color={color} />
            <span className="ink-brand text-xs font-bold" style={{ color }}>
              {ar ? "← إرسال" : "Send →"}
            </span>
            <Pill label={ar ? "الخادم" : "Server"} color={color} dark />
          </div>
        </div>
      </Frame>
    );
  }

  if (id === "html-css-js") {
    const trio = ar
      ? [
          { label: "هيكل الصفحة — البنية", hint: "عناوين وفقرات" },
          { label: "تنسيق الصفحة — الشكل", hint: "ألوان وتنسيق" },
          { label: "لغة التفاعل", hint: "بعد التحميل" },
        ]
      : [
          { label: "Page structure", hint: "Headings and links" },
          { label: "Page style", hint: "Colour and layout" },
          { label: "Page action", hint: "After load" },
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
          { label: "صورة مضغوطة", hint: "صور فوتوغرافية" },
          { label: "صورة شفافة", hint: "شفافية وحواف" },
          { label: "النص", hint: "دقة ومراجعة" },
        ]
      : [
          { label: "Compressed photo", hint: "Photographs" },
          { label: "Clear-background photo", hint: "Transparency" },
          { label: "Text", hint: "Exact review" },
        ];
    return (
      <Frame locale={locale} color={color} titleAr="شكل 10 — اختيار الوسيط" titleEn="Fig 10 — Pick the medium" captionAr="الصورة المضغوطة للتصوير، والصورة الشفافة للرسوم، والنص لما تحتاج ترجع بسرعة." captionEn="Use a compressed photo for pictures, a clear-background image for graphics, and text when you need to look up.">
        <div className="grid grid-cols-3 gap-2">
          {items.map((item) => (
            <div key={item.label} className="rounded-2xl bg-primary/5 px-2 py-3 text-center">
              <p className="ink-brand text-sm font-bold" style={{ color }}>
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
              <Pill label={step} color={color} />
              {index < steps.length - 1 ? <Arrow flip={ar} /> : null}
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
          <Pill label={ar ? "أولية: استطلاع أو قياس" : "Primary: survey"} color={color} />
          <Pill label={ar ? "ثانوية: تقرير جاهز" : "Secondary: report"} color={color} dark />
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
            <Pill key={bit} label={bit} color={color} />
          ))}
        </div>
      </Frame>
    );
  }

  if (id === "api") {
    return (
      <Frame locale={locale} color={color} titleAr="شكل 14 — البيانات المفتوحة والواجهة البرمجية" titleEn="Fig 14 — Open data and the data door" captionAr="اطلب الخدمة بطريقة متفق عليها، واذكر المصدر." captionEn="Ask in an agreed way, and cite the source.">
        <div className="flex items-center justify-center gap-2">
          <Pill label={ar ? "تطبيقك" : "Your app"} color={color} />
          <Arrow flip={ar} />
          <Pill label={ar ? "واجهة برمجية" : "Data door"} color={color} dark />
          <Arrow flip={ar} />
          <Pill label={ar ? "البيانات" : "Data"} color={color} />
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
            <Pill key={kind} label={kind} color={color} />
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
          <Pill label={ar ? "سؤال الطالب" : "Question"} color={color} />
          <Arrow flip={ar} />
          <Pill label={ar ? "النموذج" : "Model"} color={color} dark />
          <Arrow flip={ar} />
          <Pill label={ar ? "الكتاب" : "Book"} color={color} />
        </div>
      </Frame>
    );
  }

  return null;
}

export const CHAPTER_FIGURES: Record<string, string[]> = {
  "1": ["it-timeline", "ai-nest", "ai-life", "llm"],
  "2": ["encrypt", "auth", "firewall"],
  "3": ["web-stack", "http", "html-css-js"],
  "4": ["media", "ux", "html-css-js"],
  "5": ["collect", "clean", "api"],
  "6": ["charts", "regress", "collect"],
  "7": ["ml-types", "neural", "llm", "ai-nest"],
  f1: ["it-timeline", "ai-nest", "ai-life", "llm"],
  f2: ["encrypt", "auth", "firewall"],
  f3: ["web-stack", "http", "html-css-js"],
  f4: ["media", "ux", "charts"],
};

export function SceneCard({
  locale,
  color,
  scene,
  term,
  art,
  photo,
}: {
  locale: Locale;
  color: string;
  scene: string;
  term: string;
  art?: string;
  photo?: string;
}) {
  const picture = art ?? termArt(term, scene);
  return (
    <article className="concept-card overflow-hidden rounded-2xl bg-white">
      <div className="booklet-scene-art aspect-[5/3] bg-slate-50">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt={term} className="size-full object-contain bg-white" />
        ) : (
          <TextbookArt art={picture} locale={locale} />
        )}
      </div>
      <div className="px-3 py-3">
        <p className="text-sm font-extrabold" style={{ color }}>
          {term}
        </p>
        <p className="mt-1 text-xs font-semibold leading-6 text-[#334155]">{scene}</p>
      </div>
    </article>
  );
}
