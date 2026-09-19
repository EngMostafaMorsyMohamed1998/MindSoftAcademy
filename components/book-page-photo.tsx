"use client";

import { lessonBookView } from "@/lib/book-pages";
import type { Locale } from "@/lib/locale";

export function BookPagePhoto({
  locale,
  lessonId,
  offset = 0,
  alt,
  className,
}: {
  locale: Locale;
  lessonId: string;
  offset?: number;
  alt: string;
  className?: string;
}) {
  const view = lessonBookView(locale, lessonId, offset);
  if (!view) return null;
  return (
    <iframe
      src={view.href}
      title={alt}
      className={className}
    />
  );
}
