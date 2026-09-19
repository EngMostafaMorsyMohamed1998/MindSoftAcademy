"use server";

import { cookies } from "next/headers";
import { getRequestArea, LANG_COOKIE, TEACHER_LANG_COOKIE, isLocale, type Locale } from "@/lib/locale";

export async function setLocale(locale: Locale) {
  if (!isLocale(locale)) return;
  const store = await cookies();
  const name = (await getRequestArea()) === "teacher" ? TEACHER_LANG_COOKIE : LANG_COOKIE;
  store.set(name, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
