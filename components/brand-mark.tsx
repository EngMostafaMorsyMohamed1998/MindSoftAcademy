import Link from "next/link";
import { Cpu } from "lucide-react";
import { BRAND } from "@/lib/brand";
import type { Locale } from "@/lib/locale";

export function BrandMark({
  locale,
  href = "/",
  light = false,
  compact = false,
}: {
  locale: Locale;
  href?: string;
  light?: boolean;
  compact?: boolean;
}) {
  return (
    <Link href={href} className="flex min-w-0 items-center gap-2">
      <span
        className={`flex size-9 items-center justify-center rounded-xl ring-1 ${
          light
            ? "bg-white/10 text-white ring-white/15"
            : "bg-accent/20 text-accent ring-accent/40"
        }`}
      >
        <Cpu className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 leading-tight">
        <span className={`block truncate font-semibold tracking-tight ${compact ? "text-sm" : "text-lg"}`}>
          {locale === "ar" ? BRAND.nameAr : BRAND.nameEn}
        </span>
        {compact ? null : (
          <>
            <span className={`block text-[11px] ${light ? "text-white/55" : "text-foreground/50"}`}>
              {locale === "ar" ? BRAND.teacherAr : BRAND.teacherEn}
            </span>
            <span className={`block text-[11px] font-semibold tracking-wide ${light ? "text-white/70" : "text-foreground/60"}`} dir="ltr">
              {BRAND.phone}
            </span>
          </>
        )}
      </span>
    </Link>
  );
}
