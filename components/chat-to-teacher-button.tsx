"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";

export function ChatToTeacherButton({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard/chat-to-teacher")) return null;

  return (
    <Link
      href="/dashboard/chat-to-teacher"
      aria-label={t(locale, "navChat")}
      className="no-print fixed end-4 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-50 inline-flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-bold text-primary-dark shadow-lg shadow-black/20 hover:brightness-105 md:bottom-6"
    >
      <MessageCircle className="size-5 shrink-0" aria-hidden="true" />
      <span className="truncate">{t(locale, "navChat")}</span>
    </Link>
  );
}
