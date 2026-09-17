import Link from "next/link";
import { Cpu } from "lucide-react";
import { BRAND } from "@/lib/brand";
import type { Locale } from "@/lib/locale";

export function BrandMark({
  locale,
  href = "/",
  light = false,
}: {
  locale: Locale;
  href?: string;
  light?: boolean;
}) {
  return (
    <Link href={href} className="flex items-center gap-2">
      <span
        className={`flex size-9 items-center justify-center rounded-xl ring-1 ${
          light
            ? "bg-white/10 text-white ring-white/15"
            : "bg-accent/20 text-accent ring-accent/40"
        }`}
      >
        <Cpu className="size-5" aria-hidden="true" />
      </span>
      <span className="leading-tight">
        <span className="block text-lg font-semibold tracking-tight">
          {locale === "ar" ? BRAND.nameAr : BRAND.nameEn}
        </span>
        <span className={`block text-[11px] ${light ? "text-white/55" : "text-foreground/50"}`}>
          {locale === "ar" ? BRAND.teacherAr : BRAND.teacherEn}
        </span>
        <span className={`block text-[11px] font-semibold tracking-wide ${light ? "text-white/70" : "text-foreground/60"}`} dir="ltr">
          {BRAND.phone}
        </span>
      </span>
    </Link>
  );
}
