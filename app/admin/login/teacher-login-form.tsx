"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { teacherSignIn } from "@/app/actions/access";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";

export function TeacherLoginForm({ locale }: { locale: Locale }) {
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError(false);
    const result = await teacherSignIn({ error: null }, formData);
    if (result.error) {
      setError(true);
      setPending(false);
      return;
    }
    window.location.assign("/admin");
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-white/70">{t(locale, "teacherPin")}</span>
        <input
          name="pin"
          type="password"
          required
          className="h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 text-sm outline-none focus:ring-2 focus:ring-accent/30"
        />
      </label>
      {error ? (
        <p className="text-sm text-red-200" role="alert">
          {locale === "ar" ? "الرقم السري غير صحيح." : "Wrong PIN."}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="keep-white inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white text-sm font-semibold text-primary"
      >
        <LoaderCircle
          className={`size-4 animate-spin ${pending ? "" : "invisible"}`}
          aria-hidden="true"
        />
        {t(locale, "teacherLogin")}
      </button>
    </form>
  );
}
