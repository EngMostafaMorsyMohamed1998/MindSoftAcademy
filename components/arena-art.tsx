function tone(hex: string, amount: number) {
  const raw = hex.replace("#", "");
  const value = Number.parseInt(raw.length === 3 ? raw.split("").map((part) => part + part).join("") : raw, 16);
  const shift = (channel: number) => Math.max(0, Math.min(255, channel + amount));
  const r = shift((value >> 16) & 255);
  const g = shift((value >> 8) & 255);
  const b = shift(value & 255);
  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

export function CarArt({ color = "#c2410c", className = "" }: { color?: string; className?: string }) {
  const id = `car-${color.replace("#", "")}`;
  return (
    <svg className={className} viewBox="0 0 240 100" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={tone(color, 46)} />
          <stop offset="0.45" stopColor={color} />
          <stop offset="1" stopColor={tone(color, -38)} />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e0f2fe" />
          <stop offset="1" stopColor="#0369a1" />
        </linearGradient>
      </defs>
      <ellipse cx="52" cy="86" rx="30" ry="6" fill="rgba(0,0,0,0.38)" />
      <ellipse cx="182" cy="86" rx="30" ry="6" fill="rgba(0,0,0,0.38)" />
      <path d="M22 62 C34 34 62 16 98 14 H156 C190 14 208 32 226 54 L232 68 H16 Z" fill={`url(#${id}-body)`} />
      <path d="M74 20 H154 L174 50 H58 Z" fill={`url(#${id}-glass)`} />
      <path d="M114 20 V50" stroke="rgba(15,23,42,0.35)" strokeWidth="2" />
      <path d="M40 58 H210" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
      <rect x="16" y="62" width="208" height="10" rx="3" fill="#111827" />
      <path d="M200 36 L214 48 L208 56 H196 Z" fill={tone(color, -20)} />
      <rect x="218" y="52" width="14" height="9" rx="2" fill="#fde68a" />
      <rect x="18" y="52" width="12" height="9" rx="2" fill="#ef4444" />
      <circle cx="56" cy="76" r="17" fill="#111" />
      <circle cx="56" cy="76" r="10" fill="#d1d5db" />
      <circle cx="56" cy="76" r="4" fill="#111" />
      <circle cx="184" cy="76" r="17" fill="#111" />
      <circle cx="184" cy="76" r="10" fill="#d1d5db" />
      <circle cx="184" cy="76" r="4" fill="#111" />
    </svg>
  );
}

export function DollArt({ dress = "#db2777", hair = "#431407", className = "" }: { dress?: string; hair?: string; className?: string }) {
  const id = `doll-${dress.replace("#", "")}`;
  return (
    <svg className={className} viewBox="0 0 96 150" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-dress`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={tone(dress, 40)} />
          <stop offset="1" stopColor={tone(dress, -28)} />
        </linearGradient>
      </defs>
      <ellipse cx="48" cy="142" rx="24" ry="5" fill="rgba(0,0,0,0.28)" />
      <path d="M20 46 Q48 18 76 46 L70 102 Q48 124 26 102 Z" fill={`url(#${id}-dress)`} />
      <path d="M34 46 H62 L58 70 H38 Z" fill={tone(dress, 20)} />
      <circle cx="48" cy="28" r="17" fill="#f8d0b0" />
      <path d="M30 24 Q48 2 66 24 Q62 14 48 12 Q34 14 30 24 Z" fill={hair} />
      <path d="M31 22 Q24 40 34 44" fill={hair} />
      <path d="M65 22 Q72 40 62 44" fill={hair} />
      <circle cx="42" cy="28" r="2" fill="#1f2937" />
      <circle cx="54" cy="28" r="2" fill="#1f2937" />
      <circle cx="42.6" cy="27.4" r="0.6" fill="#fff" />
      <circle cx="54.6" cy="27.4" r="0.6" fill="#fff" />
      <path d="M43 35 Q48 39 53 35" fill="none" stroke="#b45309" strokeWidth="1.3" />
      <circle cx="48" cy="16" r="6" fill="#f472b6" />
      <path d="M38 16 Q32 10 38 8 Q44 12 48 16 Q52 12 58 8 Q64 10 58 16" fill="#fb7185" />
      <rect x="30" y="102" width="8" height="22" rx="3" fill="#f8d0b0" />
      <rect x="58" y="102" width="8" height="22" rx="3" fill="#f8d0b0" />
      <rect x="28" y="120" width="13" height="7" rx="2" fill="#fb7185" />
      <rect x="55" y="120" width="13" height="7" rx="2" fill="#fb7185" />
    </svg>
  );
}

export const CAR_COLORS = ["#dc2626", "#2563eb", "#ca8a04", "#059669"];
export const DOLL_DRESSES = ["#db2777", "#7c3aed", "#ea580c", "#0d9488"];
export const DOLL_HAIR = ["#431407", "#1c1917", "#7c2d12", "#44403c"];

export function TireArt({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 70 70" aria-hidden="true">
      <circle cx="35" cy="35" r="28" fill="#111" />
      <circle cx="35" cy="35" r="16" fill="#6b7280" />
      <circle cx="35" cy="35" r="8" fill="#111" />
      <circle cx="35" cy="18" r="3" fill="#9ca3af" />
      <circle cx="35" cy="52" r="3" fill="#9ca3af" />
      <circle cx="18" cy="35" r="3" fill="#9ca3af" />
      <circle cx="52" cy="35" r="3" fill="#9ca3af" />
    </svg>
  );
}

export function ConeArt({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 64" aria-hidden="true">
      <ellipse cx="24" cy="58" rx="18" ry="4" fill="rgba(0,0,0,0.3)" />
      <path d="M10 56 L20 8 H28 L38 56 Z" fill="#f97316" />
      <rect x="14" y="28" width="20" height="8" fill="#fff7ed" />
    </svg>
  );
}

export function DressArt({ color = "#db2777", className = "" }: { color?: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 70 90" aria-hidden="true">
      <path d="M22 10 H48 L42 22 H28 Z" fill="#fde68a" />
      <path d="M28 22 L42 22 L56 78 H14 Z" fill={color} />
      <path d="M14 78 Q35 90 56 78" fill={color} />
    </svg>
  );
}

export function BowArt({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 40" aria-hidden="true">
      <path d="M8 20 Q20 4 32 20 Q20 36 8 20 Z" fill="#f472b6" />
      <path d="M56 20 Q44 4 32 20 Q44 36 56 20 Z" fill="#f472b6" />
      <circle cx="32" cy="20" r="6" fill="#fde68a" />
    </svg>
  );
}
