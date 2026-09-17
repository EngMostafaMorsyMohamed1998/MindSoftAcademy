"use server";

import { cookies } from "next/headers";
import { getStudentSession } from "@/lib/student-session";
import { LANG_COOKIE, isLocale, type Locale } from "@/lib/locale";

export async function setLocale(locale: Locale) {
  if (!isLocale(locale)) return;
  const student = await getStudentSession();
  if (student) return;
  const store = await cookies();
  store.set(LANG_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
