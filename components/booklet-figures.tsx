import type { ReactNode } from "react";
import type { Locale } from "@/lib/locale";

type FigureProps = {
  locale: Locale;
  titleAr: string;
  titleEn: string;
  captionAr: string;
  captionEn: string;
  color: string;
  children: ReactNode;
};

function Frame({ locale, titleAr, titleEn, captionAr, captionEn, color, children }: FigureProps) {
  const ar = locale === "ar";
  return (
    <figure className="overflow-hidden rounded-3xl bg-white ring-1 ring-primary/10">
      <p className="px-3 pt-3 text-xs font-semibold" style={{ color }}>
        {ar ? titleAr : titleEn}
      </p>
      <div className="px-2 py-2">{children}</div>
      <figcaption className="px-3 pb-3 text-[11px] leading-relaxed text-foreground/60">
        {ar ? captionAr : captionEn}
      </figcaption>
    </figure>
  );
}

function Chip({ x, y, w, h, fill, text, textFill = "#fff" }: { x: number | string; y: number | string; w: number | string; h: number | string; fill: string; text: string; textFill?: string }) {
  const nx = Number(x);
  const ny = Number(y);
  const nw = Number(w);
  const nh = Number(h);
  return (
    <g>
      <rect x={nx} y={ny} width={nw} height={nh} rx="10" fill={fill} />
      <text x={nx + nw / 2} y={ny + nh / 2 + 4} textAnchor="middle" fill={textFill} fontSize="11" fontWeight="700">
        {text}
      </text>
    </g>
  );
}

let arrowSeq = 0;

function Arrow({ x1, y1, x2, y2, color }: { x1: number | string; y1: number | string; x2: number | string; y2: number | string; color: string }) {
  arrowSeq += 1;
  const id = `bk-arrow-${arrowSeq}`;
  return (
    <g>
      <defs>
        <marker id={id} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={color} />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2" markerEnd={`url(#${id})`} />
    </g>
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
  const accent = `${color}22`;

  if (id === "it-timeline") {
    const steps = ar
      ? ["حاسوب", "إنترنت", "محمول", "سحابة", "ذكاء"]
      : ["Computer", "Internet", "Mobile", "Cloud", "AI"];
    return (
      <Frame locale={locale} color={color} titleAr="شكل 1 — خط الزمن" titleEn="Fig 1 — Timeline" captionAr="كل مرحلة غيّرت الشغل والتعلم، مش بس شكل الجهاز." captionEn="Each stage changed work and learning, not only the machine’s look.">
        <svg viewBox="0 0 360 120" className="h-28 w-full">
          <rect width="360" height="120" rx="16" fill={accent} />
          <line x1="24" y1="64" x2="336" y2="64" stroke={color} strokeWidth="3" />
          {steps.map((step, index) => {
            const x = 36 + index * 72;
            return (
              <g key={step}>
                <circle cx={x} cy="64" r="10" fill={color} />
                <Chip x={x - 28} y={index % 2 === 0 ? 18 : 80} w={56} h={22} fill={color} text={step} />
              </g>
            );
          })}
        </svg>
      </Frame>
    );
  }

  if (id === "ai-nest") {
    return (
      <Frame locale={locale} color={color} titleAr="شكل 2 — درجات الذكاء" titleEn="Fig 2 — AI nest" captionAr="توليدي ⊂ عميق ⊂ آلي ⊂ ذكاء اصطناعي." captionEn="Generative ⊂ deep ⊂ machine learning ⊂ AI.">
        <svg viewBox="0 0 360 150" className="h-36 w-full">
          <rect width="360" height="150" rx="16" fill={accent} />
          <ellipse cx="180" cy="78" rx="150" ry="60" fill={color} opacity="0.2" />
          <ellipse cx="180" cy="78" rx="112" ry="44" fill={color} opacity="0.35" />
          <ellipse cx="180" cy="78" rx="74" ry="28" fill={color} opacity="0.55" />
          <ellipse cx="180" cy="78" rx="40" ry="16" fill={color} />
          <text x="180" y="82" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">
            {ar ? "توليدي" : "Gen AI"}
          </text>
        </svg>
      </Frame>
    );
  }

  if (id === "ai-life") {
    const cards = ar
      ? ["اقتراح فيديو", "فرز المصنع", "مراجعة الكتاب"]
      : ["Video suggest", "Factory sort", "Check the book"];
    return (
      <Frame locale={locale} color={color} titleAr="شكل 3 — أين يظهر الذكاء" titleEn="Fig 3 — Where AI appears" captionAr="مثال يومي، مثال صناعي، وقاعدة أخلاقية: راجع المخرج." captionEn="A daily example, an industry example, and the rule: check the output.">
        <svg viewBox="0 0 360 120" className="h-28 w-full">
          <rect width="360" height="120" rx="16" fill={accent} />
          {cards.map((card, index) => (
            <Chip key={card} x={18 + index * 116} y={40} w={104} h={40} fill={color} text={card} />
          ))}
        </svg>
      </Frame>
    );
  }

  if (id === "encrypt") {
    return (
      <Frame locale={locale} color={color} titleAr="شكل 4 — التشفير" titleEn="Fig 4 — Encryption" captionAr="الرسالة واضحة عند صاحب المفتاح فقط." captionEn="Only the key holder can read the message.">
        <svg viewBox="0 0 360 130" className="h-32 w-full">
          <rect width="360" height="130" rx="16" fill={accent} />
          <Chip x="16" y="46" w="88" h="36" fill={color} text={ar ? "نص واضح" : "Plain"} />
          <Arrow x1="110" y1="64" x2="148" y2="64" color={color} />
          <Chip x="150" y="40" w="60" h="48" fill="#111827" text={ar ? "مفتاح" : "Key"} />
          <Arrow x1="216" y1="64" x2="254" y2="64" color={color} />
          <Chip x="256" y="46" w="88" h="36" fill={color} text={ar ? "نص مشفّر" : "Cipher"} />
        </svg>
      </Frame>
    );
  }

  if (id === "auth") {
    const bits = ar ? ["تعرفه", "تملكه", "أنت عليه"] : ["Know", "Have", "Are"];
    return (
      <Frame locale={locale} color={color} titleAr="شكل 5 — المصادقة" titleEn="Fig 5 — Authentication" captionAr="عاملان = شيء تعرفه + شيء تملكه أو أنت عليه." captionEn="Two factors: something you know plus something you have or are.">
        <svg viewBox="0 0 360 120" className="h-28 w-full">
          <rect width="360" height="120" rx="16" fill={accent} />
          <circle cx="180" cy="60" r="28" fill={color} />
          <text x="180" y="64" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">
            2FA
          </text>
          {bits.map((bit, index) => {
            const angle = (index * 120 - 90) * (Math.PI / 180);
            const x = 180 + Math.cos(angle) * 110;
            const y = 60 + Math.sin(angle) * 36;
            return <Chip key={bit} x={x - 36} y={y - 12} w={72} h={24} fill={color} text={bit} />;
          })}
        </svg>
      </Frame>
    );
  }

  if (id === "firewall") {
    return (
      <Frame locale={locale} color={color} titleAr="شكل 6 — الجدار والشبكة" titleEn="Fig 6 — Firewall" captionAr="فلترة الحركة، وفصل الضيوف عن الأجهزة الحساسة." captionEn="Filter traffic and keep guests off sensitive devices.">
        <svg viewBox="0 0 360 130" className="h-32 w-full">
          <rect width="360" height="130" rx="16" fill={accent} />
          <Chip x="16" y="48" w="80" h="34" fill={color} text={ar ? "إنترنت" : "Internet"} />
          <Chip x="140" y="36" w="80" h="58" fill="#111827" text={ar ? "جدار" : "Firewall"} />
          <Chip x="264" y="20" w="80" h="28" fill={color} text={ar ? "داخلية" : "LAN"} />
          <Chip x="264" y="54" w="80" h="28" fill={color} text={ar ? "ضيوف" : "Guest"} />
          <Chip x="264" y="88" w="80" h="28" fill={color} text={ar ? "حساسة" : "Secure"} />
          <Arrow x1="100" y1="65" x2="136" y2="65" color={color} />
          <Arrow x1="224" y1="65" x2="260" y2="65" color={color} />
        </svg>
      </Frame>
    );
  }

  if (id === "web-stack") {
    const layers = ar
      ? ["واجهة أمامية", "خادم / خلفية", "بيانات"]
      : ["Frontend", "Server / backend", "Data"];
    return (
      <Frame locale={locale} color={color} titleAr="شكل 7 — طبقات التطبيق" titleEn="Fig 7 — App layers" captionAr="المتصفح يعرض، والخادم يقرر ويحفظ." captionEn="The browser shows; the server decides and stores.">
        <svg viewBox="0 0 360 140" className="h-32 w-full">
          <rect width="360" height="140" rx="16" fill={accent} />
          {layers.map((layer, index) => (
            <Chip key={layer} x={70} y={16 + index * 40} w={220} h={32} fill={color} text={layer} />
          ))}
        </svg>
      </Frame>
    );
  }

  if (id === "http") {
    return (
      <Frame locale={locale} color={color} titleAr="شكل 8 — GET و POST" titleEn="Fig 8 — GET and POST" captionAr="GET يجلب. POST يرسل لينشئ أو يعالج." captionEn="GET fetches. POST sends data to create or process.">
        <svg viewBox="0 0 360 120" className="h-28 w-full">
          <rect width="360" height="120" rx="16" fill={accent} />
          <Chip x="20" y="40" w="90" h="40" fill={color} text={ar ? "متصفح" : "Browser"} />
          <text x="180" y="38" textAnchor="middle" fill={color} fontSize="11" fontWeight="700">
            GET →
          </text>
          <text x="180" y="92" textAnchor="middle" fill={color} fontSize="11" fontWeight="700">
            ← POST
          </text>
          <Chip x="250" y="40" w="90" h="40" fill="#111827" text={ar ? "خادم" : "Server"} />
        </svg>
      </Frame>
    );
  }

  if (id === "html-css-js") {
    const trio = [
      { ar: "HTML بنية", en: "HTML structure" },
      { ar: "CSS شكل", en: "CSS look" },
      { ar: "JS تفاعل", en: "JS action" },
    ];
    return (
      <Frame locale={locale} color={color} titleAr="شكل 9 — ثلاثية الصفحة" titleEn="Fig 9 — Page trio" captionAr="الهيكل، الشكل، ثم الحركة بعد التحميل." captionEn="Structure, look, then motion after load.">
        <svg viewBox="0 0 360 110" className="h-24 w-full">
          <rect width="360" height="110" rx="16" fill={accent} />
          {trio.map((item, index) => (
            <Chip key={item.en} x={16 + index * 116} y={35} w={104} h={40} fill={color} text={ar ? item.ar : item.en} />
          ))}
        </svg>
      </Frame>
    );
  }

  if (id === "media") {
    return (
      <Frame locale={locale} color={color} titleAr="شكل 10 — اختيار الوسيط" titleEn="Fig 10 — Pick the medium" captionAr="JPEG للصورة، PNG للشفافية، والنص للمراجعة." captionEn="JPEG for photos, PNG for transparency, text for review.">
        <svg viewBox="0 0 360 120" className="h-28 w-full">
          <rect width="360" height="120" rx="16" fill={accent} />
          <rect x="24" y="28" width="90" height="64" rx="12" fill={color} />
          <circle cx="52" cy="50" r="10" fill="#fbbf24" />
          <text x="69" y="80" textAnchor="middle" fill="#fff" fontSize="10">JPEG</text>
          <rect x="135" y="28" width="90" height="64" rx="12" fill={color} opacity="0.7" />
          <polygon points="150,78 175,40 200,78" fill="#fff" />
          <text x="180" y="80" textAnchor="middle" fill="#111827" fontSize="10">PNG</text>
          <rect x="246" y="28" width="90" height="64" rx="12" fill="#111827" />
          <text x="291" y="64" textAnchor="middle" fill="#fff" fontSize="11">{ar ? "نص" : "Text"}</text>
        </svg>
      </Frame>
    );
  }

  if (id === "ux") {
    const steps = ar ? ["هدف", "خطوات", "قياس", "تعديل"] : ["Goal", "Steps", "Measure", "Change"];
    return (
      <Frame locale={locale} color={color} titleAr="شكل 11 — دورة التجربة" titleEn="Fig 11 — UX cycle" captionAr="التحسين التكراري: جرّب، قيس، عدّل." captionEn="Iterate: try, measure, adjust.">
        <svg viewBox="0 0 360 110" className="h-24 w-full">
          <rect width="360" height="110" rx="16" fill={accent} />
          {steps.map((step, index) => (
            <g key={step}>
              <Chip x={16 + index * 88} y={36} w={72} h={36} fill={color} text={step} />
              {index < steps.length - 1 ? <Arrow x1={90 + index * 88} y1="54" x2={102 + index * 88} y2="54" color={color} /> : null}
            </g>
          ))}
        </svg>
      </Frame>
    );
  }

  if (id === "collect") {
    return (
      <Frame locale={locale} color={color} titleAr="شكل 12 — جمع البيانات" titleEn="Fig 12 — Collecting data" captionAr="أولية من المصدر، ثانوية من مصدر جاهز. احذر العينة المنحازة." captionEn="Primary from the source, secondary from a ready source. Watch biased samples.">
        <svg viewBox="0 0 360 120" className="h-28 w-full">
          <rect width="360" height="120" rx="16" fill={accent} />
          <Chip x="20" y="24" w="140" h="72" fill={color} text={ar ? "أولية: استطلاع" : "Primary: survey"} />
          <Chip x="200" y="24" w="140" h="72" fill="#111827" text={ar ? "ثانوية: تقرير" : "Secondary: report"} />
        </svg>
      </Frame>
    );
  }

  if (id === "clean") {
    const bits = ar ? ["تواريخ موحّدة", "قيم ناقصة", "قيم شاذة"] : ["Dates unified", "Missing", "Outliers"];
    return (
      <Frame locale={locale} color={color} titleAr="شكل 13 — تنظيف الجدول" titleEn="Fig 13 — Cleaning" captionAr="وحّد الشكل، أصلح الناقص، وراجع الشاذ." captionEn="Unify formats, fix missing values, review outliers.">
        <svg viewBox="0 0 360 110" className="h-24 w-full">
          <rect width="360" height="110" rx="16" fill={accent} />
          {bits.map((bit, index) => (
            <Chip key={bit} x={16 + index * 116} y={36} w={104} h={38} fill={color} text={bit} />
          ))}
        </svg>
      </Frame>
    );
  }

  if (id === "api") {
    return (
      <Frame locale={locale} color={color} titleAr="شكل 14 — البيانات المفتوحة و API" titleEn="Fig 14 — Open data & API" captionAr="اطلب الخدمة بطريقة متفق عليها، واذكر المصدر." captionEn="Ask in an agreed way, and cite the source.">
        <svg viewBox="0 0 360 120" className="h-28 w-full">
          <rect width="360" height="120" rx="16" fill={accent} />
          <Chip x="16" y="42" w="100" h="36" fill={color} text={ar ? "تطبيقك" : "Your app"} />
          <Arrow x1="122" y1="60" x2="158" y2="60" color={color} />
          <Chip x="160" y="34" w="50" h="52" fill="#111827" text="API" />
          <Arrow x1="216" y1="60" x2="252" y2="60" color={color} />
          <Chip x="254" y="42" w="90" h="36" fill={color} text={ar ? "بيانات" : "Data"} />
        </svg>
      </Frame>
    );
  }

  if (id === "charts") {
    return (
      <Frame locale={locale} color={color} titleAr="شكل 15 — اختر الرسم" titleEn="Fig 15 — Choose the chart" captionAr="مقارنة، جزء من كل، أو تغيّر عبر الزمن." captionEn="Comparison, part-to-whole, or change over time.">
        <svg viewBox="0 0 360 130" className="h-32 w-full">
          <rect width="360" height="130" rx="16" fill={accent} />
          <rect x="28" y="70" width="18" height="36" fill={color} />
          <rect x="52" y="48" width="18" height="58" fill={color} />
          <rect x="76" y="30" width="18" height="76" fill={color} />
          <path d="M140,90 L170,60 L200,72 L230,40" fill="none" stroke={color} strokeWidth="3" />
          <circle cx="300" cy="64" r="34" fill={color} />
          <path d="M300,64 L334,64 A34,34 0 0 0 300,30 Z" fill="#111827" />
        </svg>
      </Frame>
    );
  }

  if (id === "regress") {
    return (
      <Frame locale={locale} color={color} titleAr="شكل 16 — خط الانحدار" titleEn="Fig 16 — Regression" captionAr="الخط يقرّب العلاقة. الارتباط مش شرط سببية." captionEn="The line approximates a relationship. Correlation is not causation.">
        <svg viewBox="0 0 360 130" className="h-32 w-full">
          <rect width="360" height="130" rx="16" fill={accent} />
          <line x1="40" y1="100" x2="320" y2="100" stroke="#111827" />
          <line x1="40" y1="100" x2="40" y2="24" stroke="#111827" />
          <line x1="50" y1="90" x2="310" y2="36" stroke={color} strokeWidth="3" />
          {[
            [70, 82],
            [120, 70],
            [170, 64],
            [220, 50],
            [270, 44],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill={color} />
          ))}
        </svg>
      </Frame>
    );
  }

  if (id === "ml-types") {
    const kinds = ar ? ["بإشراف", "بلا إشراف", "تعزيز"] : ["Supervised", "Unsupervised", "RL"];
    return (
      <Frame locale={locale} color={color} titleAr="شكل 17 — أنواع التعلم" titleEn="Fig 17 — ML types" captionEn="The type follows the data and the goal." captionAr="النوع يتبع البيانات والهدف.">
        <svg viewBox="0 0 360 110" className="h-24 w-full">
          <rect width="360" height="110" rx="16" fill={accent} />
          {kinds.map((kind, index) => (
            <Chip key={kind} x={16 + index * 116} y={36} w={104} h={38} fill={color} text={kind} />
          ))}
        </svg>
      </Frame>
    );
  }

  if (id === "neural") {
    return (
      <Frame locale={locale} color={color} titleAr="شكل 18 — شبكة عصبونية" titleEn="Fig 18 — Neural net" captionAr="طبقات كثيرة = تعلم عميق. مجموعة الاختبار غير مجموعة التدريب." captionEn="Many layers = deep learning. The test set is not the training set.">
        <svg viewBox="0 0 360 130" className="h-32 w-full">
          <rect width="360" height="130" rx="16" fill={accent} />
          {[40, 130, 220, 310].map((x, col) =>
            [36, 66, 96].slice(0, col === 0 || col === 3 ? 2 : 3).map((y) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="9" fill={color} />
            )),
          )}
          <line x1="49" y1="36" x2="121" y2="36" stroke={color} />
          <line x1="49" y1="36" x2="121" y2="66" stroke={color} />
          <line x1="49" y1="96" x2="121" y2="66" stroke={color} />
          <line x1="139" y1="66" x2="211" y2="36" stroke={color} />
          <line x1="139" y1="66" x2="211" y2="96" stroke={color} />
          <line x1="229" y1="66" x2="301" y2="36" stroke={color} />
          <line x1="229" y1="66" x2="301" y2="96" stroke={color} />
        </svg>
      </Frame>
    );
  }

  if (id === "llm") {
    return (
      <Frame locale={locale} color={color} titleAr="شكل 19 — راجع المساعد" titleEn="Fig 19 — Check the helper" captionAr="الشكل الصح مش معناها المعلومة صح. راجع الكتاب." captionEn="A tidy sentence can still be wrong. Check the book.">
        <svg viewBox="0 0 360 120" className="h-28 w-full">
          <rect width="360" height="120" rx="16" fill={accent} />
          <Chip x="16" y="40" w="110" h="40" fill={color} text={ar ? "سؤال" : "Question"} />
          <Arrow x1="132" y1="60" x2="164" y2="60" color={color} />
          <Chip x="166" y="40" w="80" h="40" fill="#111827" text={ar ? "نموذج" : "Model"} />
          <Arrow x1="252" y1="60" x2="284" y2="60" color={color} />
          <Chip x="286" y="40" w="58" h="40" fill={color} text={ar ? "كتاب" : "Book"} />
        </svg>
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
  return (
    <article className="overflow-hidden rounded-3xl bg-white ring-1 ring-primary/10">
      <svg viewBox="0 0 220 90" className="h-20 w-full">
        <rect width="220" height="90" fill={`${color}18`} />
        <rect x="18" y="28" width="54" height="38" rx="6" fill={color} />
        <rect x="24" y="34" width="42" height="22" rx="3" fill="#e5e7eb" />
        <circle cx="100" cy="48" r="16" fill={color} />
        <circle cx="100" cy="42" r="6" fill="#fff" />
        <rect x="88" y="56" width="24" height="14" rx="6" fill="#fff" />
        <rect x="130" y="30" width="70" height="10" rx="4" fill={color} opacity="0.7" />
        <rect x="130" y="46" width="54" height="8" rx="4" fill={color} opacity="0.4" />
        <rect x="130" y="60" width="40" height="8" rx="4" fill={color} opacity="0.25" />
      </svg>
      <div className="px-3 pb-3">
        <p className="text-[11px] font-semibold" style={{ color }}>
          {term}
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-foreground/70">{scene}</p>
      </div>
    </article>
  );
}
