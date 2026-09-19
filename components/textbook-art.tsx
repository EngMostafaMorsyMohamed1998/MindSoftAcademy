import type { ReactNode } from "react";
import type { Locale } from "@/lib/locale";

function Bg() {
  return <rect width="320" height="200" fill="#e8eef6" />;
}

function Label({
  x,
  y,
  text,
  fill = "#ffffff",
}: {
  x: number;
  y: number;
  text: string;
  fill?: string;
}) {
  return (
    <text x={x} y={y} textAnchor="middle" fill={fill} fontSize="13" fontWeight="800" fontFamily="ui-sans-serif, system-ui">
      {text}
    </text>
  );
}

function Move({ className, children }: { className?: string; children: ReactNode }) {
  return <g className={className}>{children}</g>;
}

export function TextbookArt({ art, locale, compact }: { art: string; locale: Locale; compact?: boolean }) {
  const ar = locale === "ar";
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden>
      <Bg />
      {draw(art, ar, Boolean(compact))}
    </svg>
  );
}

function draw(art: string, ar: boolean, compact: boolean) {
  const move = compact ? undefined : true;
  if (art === "nest") {
    return (
      <>
        <rect x="28" y="18" width="264" height="164" rx="22" fill="#0c2d6b" />
        <rect x="52" y="48" width="216" height="118" rx="18" fill="#1d4ed8" />
        <rect x="76" y="78" width="168" height="74" rx="14" fill="#3b82f6" />
        <Move className={move ? "art-pulse" : undefined}>
          <rect x="100" y="108" width="120" height="32" rx="10" fill="#c4a35a" />
        </Move>
        {compact ? null : (
          <>
            <Label x={160} y={40} text={ar ? "ذكاء اصطناعي" : "AI"} />
            <Label x={160} y={70} text={ar ? "تعلم آلي" : "Machine learning"} />
            <Label x={160} y={100} text={ar ? "تعلم عميق" : "Deep learning"} />
            <Label x={160} y={130} text={ar ? "توليدي" : "Generative"} fill="#111827" />
          </>
        )}
      </>
    );
  }
  if (art === "ai") {
    return (
      <>
        <Move className={move ? "art-bob" : undefined}>
          <rect x="118" y="36" width="84" height="72" rx="20" fill="#0c2d6b" />
          <circle cx="144" cy="66" r="8" fill="#fde68a" />
          <circle cx="176" cy="66" r="8" fill="#fde68a" />
          <rect x="146" y="86" width="28" height="8" rx="4" fill="#c4a35a" />
          <rect x="146" y="108" width="28" height="16" fill="#0c2d6b" />
          <rect x="108" y="124" width="104" height="36" rx="12" fill="#1d4ed8" />
          <circle cx="108" cy="72" r="8" fill="#c4a35a" />
          <circle cx="212" cy="72" r="8" fill="#c4a35a" />
        </Move>
      </>
    );
  }
  if (art === "neural") {
    return (
      <>
        <rect x="18" y="56" width="52" height="88" rx="10" fill="#0c2d6b" />
        <circle cx="36" cy="80" r="8" fill="#fde68a" />
        <path d="M28 108 q16 18 32 0" fill="#93c5fd" />
        <line className={move ? "art-dash" : undefined} x1="70" y1="80" x2="150" y2="40" stroke="#94a3b8" strokeWidth="3" />
        <line className={move ? "art-dash" : undefined} x1="70" y1="80" x2="150" y2="100" stroke="#94a3b8" strokeWidth="3" />
        <line className={move ? "art-dash" : undefined} x1="70" y1="132" x2="150" y2="100" stroke="#94a3b8" strokeWidth="3" />
        <line className={move ? "art-dash" : undefined} x1="70" y1="132" x2="150" y2="160" stroke="#94a3b8" strokeWidth="3" />
        <line className={move ? "art-dash" : undefined} x1="150" y1="40" x2="240" y2="70" stroke="#94a3b8" strokeWidth="3" />
        <line className={move ? "art-dash" : undefined} x1="150" y1="100" x2="240" y2="100" stroke="#94a3b8" strokeWidth="3" />
        <line className={move ? "art-dash" : undefined} x1="150" y1="160" x2="240" y2="130" stroke="#94a3b8" strokeWidth="3" />
        <Move className={move ? "art-pulse" : undefined}>
          <circle cx="150" cy="40" r="13" fill="#1d4ed8" />
        </Move>
        <Move className={move ? "art-pulse art-delay-1" : undefined}>
          <circle cx="150" cy="100" r="13" fill="#1d4ed8" />
        </Move>
        <Move className={move ? "art-pulse art-delay-2" : undefined}>
          <circle cx="150" cy="160" r="13" fill="#1d4ed8" />
        </Move>
        <circle cx="70" cy="80" r="11" fill="#0c2d6b" />
        <circle cx="70" cy="132" r="11" fill="#0c2d6b" />
        <Move className={move ? "art-glow" : undefined}>
          <circle cx="248" cy="70" r="16" fill="#c4a35a" />
          <circle cx="248" cy="130" r="16" fill="#c4a35a" />
        </Move>
        {compact ? null : <Label x={44} y={178} text={ar ? "صورة" : "Image"} fill="#111827" />}
      </>
    );
  }
  if (art === "ml") {
    return (
      <>
        <rect x="22" y="40" width="86" height="120" rx="12" fill="#0c2d6b" />
        <rect x="34" y="54" width="62" height="10" rx="4" fill="#fca5a5" />
        <rect x="34" y="72" width="62" height="10" rx="4" fill="#86efac" />
        <rect x="34" y="90" width="62" height="10" rx="4" fill="#fca5a5" />
        <rect x="34" y="108" width="62" height="10" rx="4" fill="#86efac" />
        <path className={move ? "art-dash" : undefined} d="M108 100 H128" stroke="#64748b" strokeWidth="6" />
        <Move className={move ? "art-glow" : undefined}>
          <rect x="128" y="36" width="72" height="128" rx="12" fill="#1d4ed8" />
        </Move>
        <path className={move ? "art-dash" : undefined} d="M200 100 H220" stroke="#64748b" strokeWidth="6" />
        <rect x="220" y="64" width="78" height="72" rx="12" fill="#c4a35a" />
        {compact ? null : (
          <>
            <Label x={65} y={156} text={ar ? "بريد" : "Mail"} />
            <Label x={164} y={106} text={ar ? "نموذج" : "Model"} />
            <Label x={259} y={106} text={ar ? "حكم" : "Judge"} fill="#111827" />
          </>
        )}
      </>
    );
  }
  if (art === "llm") {
    return (
      <>
        <rect x="16" y="78" width="92" height="62" rx="10" fill="#0c2d6b" />
        <rect x="28" y="90" width="68" height="8" rx="4" fill="#93c5fd" />
        <rect x="28" y="106" width="48" height="8" rx="4" fill="#bfdbfe" />
        <circle cx="40" cy="70" r="14" fill="#1d4ed8" />
        <rect x="28" y="82" width="24" height="8" rx="4" fill="#1d4ed8" />
        <Move className={move ? "art-sparkle" : undefined}>
          <path d="M122 46 l6 14 16 2-12 10 4 15-14-8-14 8 4-15-12-10 16-2z" fill="#f59e0b" />
          <path d="M156 28 l4 10 11 1-8 7 2 11-9-6-9 6 2-11-8-7 11-1z" fill="#fde68a" />
        </Move>
        <Move className={move ? "art-bob" : undefined}>
          <rect x="176" y="28" width="128" height="144" rx="16" fill="#fff" stroke="#c4a35a" strokeWidth="4" />
          <circle cx="228" cy="78" r="20" fill="#fde68a" />
          <path d="M188 156 q32 -52 80 0" fill="#16a34a" />
          <path d="M248 118 q18 -20 36 8" fill="#1d4ed8" />
        </Move>
        {compact ? null : <Label x={62} y={168} text={ar ? "اكتب" : "Type"} fill="#111827" />}
      </>
    );
  }
  if (art === "lock") {
    return (
      <>
        <rect x="36" y="58" width="88" height="64" rx="10" fill="#fff" stroke="#0c2d6b" strokeWidth="4" />
        <rect x="48" y="72" width="64" height="8" rx="3" fill="#94a3b8" />
        <rect x="48" y="88" width="48" height="8" rx="3" fill="#cbd5e1" />
        <Move className={move ? "art-pulse" : undefined}>
          <path d="M196 78 v-16 a28 28 0 0 1 56 0 v16" fill="none" stroke="#111827" strokeWidth="10" />
          <rect x="176" y="78" width="96" height="70" rx="12" fill="#7f1d1d" />
          <circle cx="224" cy="108" r="8" fill="#fde68a" />
          <rect x="220" y="108" width="8" height="20" fill="#fde68a" />
        </Move>
      </>
    );
  }
  if (art === "firewall") {
    return (
      <>
        <Move className={move ? "art-pulse" : undefined}>
          <rect x="20" y="40" width="78" height="48" rx="10" fill="#7f1d1d" />
          <path d="M40 52 h38 M40 64 h26" stroke="#fecaca" strokeWidth="4" />
        </Move>
        <rect x="214" y="40" width="78" height="48" rx="10" fill="#16a34a" />
        <Move className={move ? "art-glow" : undefined}>
          <rect x="70" y="108" width="180" height="56" rx="10" fill="#0c2d6b" />
        </Move>
        <path d="M106 88 V108 M214 88 V108" stroke="#334155" strokeWidth="6" />
        {compact ? null : (
          <>
            <Label x={59} y={70} text={ar ? "خطر" : "Risk"} />
            <Label x={253} y={70} text={ar ? "آمن" : "Safe"} />
            <Label x={160} y={142} text={ar ? "جدار" : "Firewall"} />
          </>
        )}
      </>
    );
  }
  if (art === "web") {
    return (
      <>
        <rect x="36" y="28" width="248" height="144" rx="14" fill="#fff" stroke="#cbd5e1" />
        <rect x="36" y="28" width="248" height="32" fill="#0c2d6b" />
        <circle cx="54" cy="44" r="5" fill="#f87171" />
        <circle cx="70" cy="44" r="5" fill="#fbbf24" />
        <circle cx="86" cy="44" r="5" fill="#34d399" />
        <Move className={move ? "art-bob" : undefined}>
          <rect x="54" y="80" width="140" height="12" rx="6" fill="#94a3b8" />
          <rect x="54" y="104" width="200" height="10" rx="5" fill="#cbd5e1" />
          <rect x="54" y="126" width="168" height="10" rx="5" fill="#cbd5e1" />
        </Move>
      </>
    );
  }
  if (art === "http") {
    return (
      <>
        <rect x="28" y="58" width="96" height="84" rx="12" fill="#0c2d6b" />
        <rect x="196" y="58" width="96" height="84" rx="12" fill="#1d4ed8" />
        <path className={move ? "art-dash" : undefined} d="M132 90 H188" stroke="#c4a35a" strokeWidth="8" fill="none" />
        <path d="M176 76 l16 14 -16 14" fill="#c4a35a" />
        {compact ? null : (
          <>
            <Label x={76} y={106} text={ar ? "متصفح" : "Browser"} />
            <Label x={244} y={106} text={ar ? "خادم" : "Server"} />
          </>
        )}
      </>
    );
  }
  if (art === "html") {
    return (
      <>
        <rect x="36" y="28" width="248" height="144" rx="14" fill="#fff" stroke="#cbd5e1" />
        <rect x="52" y="48" width="72" height="104" rx="10" fill="#0c2d6b" />
        <Move className={move ? "art-bob" : undefined}>
          <rect x="132" y="48" width="72" height="104" rx="10" fill="#1d4ed8" />
        </Move>
        <Move className={move ? "art-pulse" : undefined}>
          <rect x="212" y="48" width="56" height="104" rx="10" fill="#c4a35a" />
        </Move>
        {compact ? null : (
          <>
            <Label x={88} y={106} text={ar ? "هيكل" : "HTML"} />
            <Label x={168} y={106} text={ar ? "شكل" : "CSS"} />
            <Label x={240} y={106} text={ar ? "فعل" : "JS"} fill="#111827" />
          </>
        )}
      </>
    );
  }
  if (art === "arvr") {
    return (
      <>
        <Move className={move ? "art-glow" : undefined}>
          <rect x="16" y="44" width="132" height="88" rx="22" fill="#111827" />
          <rect x="32" y="60" width="46" height="40" rx="10" fill="#60a5fa" />
          <rect x="86" y="60" width="46" height="40" rx="10" fill="#60a5fa" />
          <rect x="74" y="74" width="16" height="12" rx="3" fill="#c4a35a" />
        </Move>
        <rect x="168" y="78" width="36" height="70" rx="8" fill="#94a3b8" />
        <circle cx="186" cy="64" r="14" fill="#1d4ed8" />
        <Move className={move ? "art-bob" : undefined}>
          <rect x="214" y="36" width="90" height="136" rx="16" fill="#0c2d6b" />
          <rect x="226" y="50" width="66" height="96" rx="8" fill="#93c5fd" />
          <ellipse cx="259" cy="118" rx="18" ry="10" fill="#16a34a" />
          <circle cx="248" cy="108" r="8" fill="#111827" />
          <rect x="268" y="78" width="10" height="28" rx="3" fill="#c4a35a" />
        </Move>
        {compact ? null : (
          <>
            <Label x={82} y={156} text="VR" />
            <Label x={259} y={184} text="AR" fill="#111827" />
          </>
        )}
      </>
    );
  }
  if (art === "edge") {
    return (
      <>
        <Move className={move ? "art-bob" : undefined}>
          <rect x="20" y="88" width="148" height="46" rx="16" fill="#0c2d6b" />
          <circle cx="52" cy="142" r="16" fill="#111827" />
          <circle cx="136" cy="142" r="16" fill="#111827" />
          <rect x="40" y="52" width="100" height="44" rx="10" fill="#1d4ed8" />
          <rect x="72" y="64" width="36" height="22" rx="4" fill="#c4a35a" />
        </Move>
        <path className={move ? "art-dash" : undefined} d="M172 92 H214" stroke="#cbd5e1" strokeWidth="5" fill="none" />
        <ellipse cx="250" cy="58" rx="42" ry="24" fill="#94a3b8" />
        <ellipse cx="228" cy="66" rx="20" ry="16" fill="#94a3b8" />
        <ellipse cx="270" cy="66" rx="18" ry="14" fill="#94a3b8" />
        <Move className={move ? "art-pulse" : undefined}>
          <path d="M236 44 l28 28 M264 44 l-28 28" stroke="#7f1d1d" strokeWidth="6" />
        </Move>
        {compact ? null : <Label x={94} y={180} text={ar ? "على الجهاز" : "On device"} fill="#111827" />}
      </>
    );
  }
  if (art === "cloud") {
    return (
      <>
        <Move className={move ? "art-bob" : undefined}>
          <ellipse cx="168" cy="58" rx="74" ry="30" fill="#0c2d6b" />
          <ellipse cx="126" cy="64" rx="30" ry="20" fill="#0c2d6b" />
          <ellipse cx="210" cy="64" rx="28" ry="18" fill="#0c2d6b" />
        </Move>
        <rect x="36" y="122" width="70" height="44" rx="8" fill="#1d4ed8" />
        <rect x="48" y="134" width="46" height="8" rx="3" fill="#93c5fd" />
        <rect x="126" y="118" width="56" height="52" rx="10" fill="#111827" />
        <rect x="136" y="130" width="36" height="22" rx="4" fill="#93c5fd" />
        <rect x="210" y="122" width="70" height="44" rx="8" fill="#1d4ed8" />
        <path className={move ? "art-dash" : undefined} d="M71 122 V90 M154 118 V86 M245 122 V90" stroke="#c4a35a" strokeWidth="4" fill="none" />
        {compact ? null : <Label x={168} y={50} text={ar ? "سحابة" : "Cloud"} />}
      </>
    );
  }
  if (art === "ux") {
    return (
      <>
        <rect x="28" y="70" width="58" height="60" rx="12" fill="#0c2d6b" />
        <Move className={move ? "art-bob" : undefined}>
          <rect x="96" y="54" width="58" height="76" rx="12" fill="#1d4ed8" />
        </Move>
        <rect x="164" y="40" width="58" height="90" rx="12" fill="#3b82f6" />
        <rect x="232" y="70" width="58" height="60" rx="12" fill="#c4a35a" />
        <path d="M86 100 H96 M154 100 H164 M222 100 H232" stroke="#64748b" strokeWidth="6" />
      </>
    );
  }
  if (art === "chart") {
    return (
      <>
        <rect x="44" y="28" width="232" height="144" rx="12" fill="#fff" />
        <rect x="68" y="118" width="32" height="36" fill="#0c2d6b" />
        <Move className={move ? "art-bob" : undefined}>
          <rect x="114" y="88" width="32" height="66" fill="#1d4ed8" />
          <rect x="160" y="58" width="32" height="96" fill="#c4a35a" />
        </Move>
        <rect x="206" y="78" width="32" height="76" fill="#0c2d6b" />
        <line x1="60" y1="154" x2="252" y2="154" stroke="#94a3b8" strokeWidth="3" />
      </>
    );
  }
  if (art === "regress") {
    return (
      <>
        <rect x="36" y="24" width="248" height="152" rx="12" fill="#fff" />
        <line x1="60" y1="152" x2="260" y2="152" stroke="#111827" strokeWidth="3" />
        <line x1="60" y1="152" x2="60" y2="40" stroke="#111827" strokeWidth="3" />
        <line className={move ? "art-dash" : undefined} x1="72" y1="136" x2="248" y2="52" stroke="#1d4ed8" strokeWidth="5" />
        <circle cx="96" cy="128" r="7" fill="#0c2d6b" />
        <circle cx="132" cy="110" r="7" fill="#0c2d6b" />
        <circle cx="168" cy="92" r="7" fill="#0c2d6b" />
        <circle cx="204" cy="74" r="7" fill="#0c2d6b" />
        <Move className={move ? "art-pulse" : undefined}>
          <circle cx="236" cy="62" r="8" fill="#c4a35a" />
        </Move>
      </>
    );
  }
  if (art === "data") {
    return (
      <>
        <rect x="52" y="32" width="216" height="136" rx="12" fill="#fff" stroke="#0c2d6b" strokeWidth="4" />
        <rect x="52" y="32" width="216" height="28" fill="#0c2d6b" />
        <line x1="124" y1="32" x2="124" y2="168" stroke="#93c5fd" strokeWidth="3" />
        <line x1="196" y1="32" x2="196" y2="168" stroke="#93c5fd" strokeWidth="3" />
        <Move className={move ? "art-pulse" : undefined}>
          <rect x="68" y="100" width="40" height="12" rx="3" fill="#c4a35a" />
        </Move>
        <line x1="52" y1="88" x2="268" y2="88" stroke="#cbd5e1" strokeWidth="3" />
        <line x1="52" y1="128" x2="268" y2="128" stroke="#cbd5e1" strokeWidth="3" />
      </>
    );
  }
  if (art === "clean") {
    return (
      <>
        <rect x="44" y="36" width="160" height="128" rx="10" fill="#fff" stroke="#0c2d6b" strokeWidth="4" />
        <line x1="44" y1="68" x2="204" y2="68" stroke="#0c2d6b" strokeWidth="3" />
        <line x1="44" y1="108" x2="204" y2="108" stroke="#cbd5e1" strokeWidth="3" />
        <Move className={move ? "art-pulse" : undefined}>
          <circle cx="246" cy="86" r="28" fill="#16a34a" />
          <path d="M232 86 l10 10 20-22" fill="none" stroke="#fff" strokeWidth="6" />
        </Move>
      </>
    );
  }
  if (art === "sample") {
    return (
      <>
        <circle cx="88" cy="70" r="18" fill="#94a3b8" />
        <Move className={move ? "art-pulse" : undefined}>
          <circle cx="160" cy="54" r="18" fill="#0c2d6b" />
          <circle cx="160" cy="128" r="22" fill="#c4a35a" />
        </Move>
        <circle cx="232" cy="70" r="18" fill="#94a3b8" />
        <circle cx="70" cy="140" r="18" fill="#94a3b8" />
        <circle cx="250" cy="140" r="18" fill="#94a3b8" />
      </>
    );
  }
  if (art === "api") {
    return (
      <>
        <rect x="24" y="64" width="80" height="72" rx="12" fill="#0c2d6b" />
        <Move className={move ? "art-glow" : undefined}>
          <rect x="120" y="52" width="80" height="96" rx="12" fill="#111827" />
        </Move>
        <rect x="216" y="64" width="80" height="72" rx="12" fill="#c4a35a" />
        <path className={move ? "art-dash" : undefined} d="M104 100 H120 M200 100 H216" stroke="#64748b" strokeWidth="6" fill="none" />
        {compact ? null : (
          <>
            <Label x={64} y={106} text={ar ? "تطبيق" : "App"} />
            <Label x={160} y={106} text={ar ? "باب" : "API"} />
            <Label x={256} y={106} text={ar ? "بيانات" : "Data"} fill="#111827" />
          </>
        )}
      </>
    );
  }
  if (art === "ethics") {
    return (
      <>
        <Move className={move ? "art-tilt" : undefined}>
          <rect x="150" y="18" width="20" height="100" fill="#0c2d6b" />
          <rect x="52" y="62" width="216" height="12" fill="#111827" />
          <rect x="44" y="74" width="76" height="48" rx="8" fill="#c4a35a" />
          <rect x="200" y="74" width="76" height="48" rx="8" fill="#7f1d1d" />
        </Move>
        <circle cx="82" cy="152" r="12" fill="#0c2d6b" />
        <rect x="66" y="166" width="32" height="18" rx="8" fill="#0c2d6b" />
        <circle cx="238" cy="152" r="12" fill="#7f1d1d" />
        <rect x="222" y="166" width="32" height="18" rx="8" fill="#7f1d1d" />
        {compact ? null : (
          <>
            <Label x={82} y={104} text={ar ? "عادل" : "Fair"} fill="#111827" />
            <Label x={238} y={104} text={ar ? "منحاز" : "Bias"} />
          </>
        )}
      </>
    );
  }
  if (art === "incident" || art === "phish") {
    return (
      <>
        <Move className={move ? "art-pulse" : undefined}>
          <polygon points="160,28 256,168 64,168" fill="#f59e0b" />
          <rect x="150" y="78" width="20" height="50" fill="#111827" />
          <circle cx="160" cy="146" r="9" fill="#111827" />
        </Move>
      </>
    );
  }
  if (art === "fake") {
    return (
      <>
        <circle cx="160" cy="96" r="58" fill="#0c2d6b" />
        <Move className={move ? "art-pulse" : undefined}>
          <rect x="160" y="38" width="58" height="116" fill="#7f1d1d" />
        </Move>
        <circle cx="138" cy="86" r="8" fill="#fde68a" />
        <circle cx="182" cy="86" r="8" fill="#94a3b8" />
        <rect x="136" y="118" width="48" height="8" rx="4" fill="#e2e8f0" />
      </>
    );
  }
  if (art === "life") {
    return (
      <>
        <rect x="28" y="44" width="80" height="112" rx="12" fill="#0c2d6b" />
        <Move className={move ? "art-bob" : undefined}>
          <rect x="120" y="44" width="80" height="112" rx="12" fill="#1d4ed8" />
          <rect x="140" y="70" width="40" height="50" fill="#111827" />
        </Move>
        <rect x="212" y="44" width="80" height="112" rx="12" fill="#c4a35a" />
        <rect x="48" y="64" width="40" height="28" rx="4" fill="#93c5fd" />
        <rect x="228" y="70" width="48" height="36" rx="4" fill="#fff" />
      </>
    );
  }
  if (art === "media") {
    return (
      <>
        <Move className={move ? "art-pulse" : undefined}>
          <rect x="28" y="40" width="120" height="80" rx="10" fill="#0c2d6b" />
          <polygon points="68,60 118,80 68,100" fill="#fde68a" />
        </Move>
        <rect x="168" y="40" width="124" height="18" rx="6" fill="#1d4ed8" />
        <rect x="168" y="70" width="96" height="14" rx="6" fill="#93c5fd" />
        <rect x="168" y="96" width="80" height="14" rx="6" fill="#cbd5e1" />
        <rect x="28" y="136" width="264" height="28" rx="8" fill="#c4a35a" />
      </>
    );
  }
  if (art === "lab") {
    return (
      <>
        <rect x="36" y="52" width="100" height="70" rx="8" fill="#0c2d6b" />
        <rect x="48" y="64" width="76" height="42" fill="#dbeafe" />
        <rect x="70" y="122" width="32" height="10" fill="#111827" />
        <Move className={move ? "art-bob" : undefined}>
          <rect x="184" y="40" width="100" height="82" rx="8" fill="#1d4ed8" />
          <rect x="196" y="52" width="76" height="50" fill="#e0e7ff" />
        </Move>
        <rect x="218" y="122" width="32" height="10" fill="#111827" />
        <rect x="0" y="164" width="320" height="36" fill="#94a3b8" />
      </>
    );
  }
  return (
    <>
      <rect x="70" y="40" width="180" height="120" rx="10" fill="#fff" stroke="#0c2d6b" strokeWidth="5" />
      <rect x="88" y="58" width="144" height="12" rx="6" fill="#0c2d6b" />
      <rect x="88" y="84" width="110" height="10" rx="5" fill="#94a3b8" />
      <rect x="88" y="108" width="128" height="10" rx="5" fill="#cbd5e1" />
    </>
  );
}
