"use server";

import { cookies } from "next/headers";
import { LANG_COOKIE, isLocale, type Locale } from "@/lib/locale";

export async function setLocale(locale: Locale) {
  if (!isLocale(locale)) return;
  const store = await cookies();
  store.set(LANG_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
