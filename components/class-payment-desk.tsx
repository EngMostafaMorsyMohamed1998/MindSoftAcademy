"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { confirmClassCashPayment, type SubscriptionFormState } from "@/app/actions/subscription";
import { codeWhatsappText, whatsappHref } from "@/lib/class-roster";
import { SUBSCRIPTION_PLANS } from "@/lib/subscription";
import type { Locale } from "@/lib/locale";

const initial: SubscriptionFormState = { error: null };

export function ClassPaymentDesk({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(confirmClassCashPayment, initial);
  const [copied, setCopied] = useState(false);
  const openedCode = useRef<string | null>(null);
  const ar = locale === "ar";

  const issued = useMemo(
    () =>
      state.code && state.phone
        ? { code: state.code, name: state.studentName || "", phone: state.phone }
        : null,
    [state.code, state.phone, state.studentName],
  );

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  useEffect(() => {
    if (!issued) return;
    const key = `${issued.code}:${issued.phone}`;
    if (openedCode.current === key) return;
    openedCode.current = key;
    const href = whatsappHref(issued.phone, codeWhatsappText(issued.name, issued.code, locale));
    window.open(href, "_blank", "noopener,noreferrer");
  }, [issued, locale]);

  async function copyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const field = document.createElement("textarea");
      field.value = code;
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section className="rounded-3xl bg-white p-5 ring-1 ring-primary/10">
      <h2 className="text-lg font-semibold">{ar ? "سداد الحصة وكود التفعيل" : "Class payment and activation code"}</h2>
      <p className="mt-1 text-sm text-foreground/60">
        {ar
          ? "التحصيل كاش في الحصة. اكتب بيانات الطالب والباقة، والكود يتعمل ويتبعت على واتساب."
          : "Fees are collected in class. Enter the student and plan, then the code opens on WhatsApp."}
      </p>

      {state.error ? <p className="mt-3 text-sm text-red-700">{state.error}</p> : null}

      {issued ? (
        <div className="mt-4 rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
          <p className="text-sm font-semibold text-emerald-900">
            {ar ? "اتسجل السداد واتعمل كود التفعيل" : "Payment recorded and activation code issued"}
          </p>
          <p className="mt-2 font-mono text-lg font-bold tracking-wide" dir="ltr">
            {issued.code}
          </p>
          <p className="mt-1 text-sm text-emerald-900/80">
            {issued.name} · <span dir="ltr">{issued.phone}</span>
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <a
              href={whatsappHref(issued.phone, codeWhatsappText(issued.name, issued.code, locale))}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white"
            >
              {ar ? "ابعت الكود واتساب" : "Send code on WhatsApp"}
            </a>
            <button
              type="button"
              onClick={() => void copyCode(issued.code)}
              className="text-sm font-semibold text-primary"
            >
              {copied ? (ar ? "تم نسخ الكود" : "Code copied") : ar ? "نسخ الكود" : "Copy code"}
            </button>
          </div>
        </div>
      ) : null}

      <form action={action} className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_8rem_auto]">
        <input
          name="studentName"
          required
          minLength={3}
          placeholder={ar ? "اسم الطالب" : "Student name"}
          className="h-11 rounded-xl border border-primary/15 bg-white px-3 text-sm"
        />
        <input
          name="senderPhone"
          required
          inputMode="numeric"
          placeholder="01xxxxxxxxx"
          dir="ltr"
          className="h-11 rounded-xl border border-primary/15 bg-white px-3 text-sm tabular-nums"
        />
        <select
          name="plan"
          defaultValue="month"
          className="h-11 rounded-xl border border-primary/15 bg-white px-3 text-sm"
        >
          {SUBSCRIPTION_PLANS.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.label} · {plan.amount}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-white disabled:opacity-70"
        >
          {pending ? (ar ? "جارٍ التسجيل" : "Recording") : ar ? "سجّل وابعت الكود" : "Record and send"}
        </button>
      </form>
    </section>
  );
}
