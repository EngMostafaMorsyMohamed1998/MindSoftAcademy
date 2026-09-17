"use client";

import { useState } from "react";
import { KeyRound, LoaderCircle } from "lucide-react";
import { activateAccess } from "@/app/actions/access";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";

const ERRORS: Record<string, { ar: string; en: string }> = {
  MISSING: { ar: "اكتب الاسم والرقم والكود.", en: "Enter name, phone, and code." },
  NOT_FOUND: { ar: "الكود غير موجود. راجع الورقة اللي أداها المدرس.", en: "That code was not found. Check the slip from class." },
  PHONE_MISMATCH: { ar: "الرقم لا يطابق الكود. استخدم نفس رقم التليفون المسجّل.", en: "The phone does not match this code." },
  NAME_MISMATCH: { ar: "الاسم لا يطابق الكود. اكتبه كما سجّله المدرس.", en: "The name does not match this code." },
  FAILED: { ar: "تعذر التفعيل. حاول مرة أخرى.", en: "Could not activate. Try again." },
  SUSPENDED: { ar: "الاشتراك متوقف. راجع المدرس بعد الدفع.", en: "This subscription is paused. See the teacher after payment." },
  DEVICE_LIMIT: { ar: "جرّب تاني بنفس الكود. لو نفس الموبايل الحساب هيفتح هنا.", en: "Try again with the same code. On this phone the account should open here." },
};

export function ActivateForm({ locale }: { locale: Locale }) {
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const error = errorKey ? ERRORS[errorKey] ?? ERRORS.FAILED : null;

  async function onSubmit(formData: FormData) {
    setPending(true);
    setErrorKey(null);
    const result = await activateAccess({ error: null }, formData);
    if (result.error) {
      setErrorKey(result.error);
      setPending(false);
      return;
    }
    window.location.assign("/dashboard");
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-white/70">{t(locale, "fullName")}</span>
        <input
          name="name"
          required
          minLength={3}
          autoComplete="name"
          className="h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 text-sm outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-white/70">{t(locale, "phone")}</span>
        <input
          name="phone"
          required
          inputMode="tel"
          autoComplete="tel"
          placeholder="01xxxxxxxxx"
          className="h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 text-sm outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-white/70">{t(locale, "accessCode")}</span>
        <input
          name="code"
          required
          autoCapitalize="characters"
          placeholder="MOST-XXXXXX"
          className="h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 font-mono text-sm uppercase outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
        />
      </label>
      {error ? (
        <p className="rounded-2xl bg-red-500/15 px-3 py-2 text-sm text-red-100" role="alert">
          {error[locale]}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="keep-white inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white text-sm font-semibold text-primary disabled:opacity-70"
      >
        <span className="relative size-4 shrink-0">
          <LoaderCircle
            className={`absolute inset-0 size-4 animate-spin ${pending ? "" : "invisible"}`}
            aria-hidden="true"
          />
          <KeyRound
            className={`size-4 ${pending ? "invisible" : ""}`}
            aria-hidden="true"
          />
        </span>
        {t(locale, "activateBtn")}
      </button>
    </form>
  );
}
