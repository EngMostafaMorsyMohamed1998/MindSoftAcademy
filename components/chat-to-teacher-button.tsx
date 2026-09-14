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
      className="fixed end-4 bottom-20 z-50 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-bold text-primary-dark shadow-lg shadow-black/20 hover:brightness-105 md:bottom-6"
    >
      <MessageCircle className="size-5" aria-hidden="true" />
      {t(locale, "navChat")}
    </Link>
  );
}
