"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  confirmClassCashPayment,
  markSubscriptionReviewed,
  type SubscriptionFormState,
} from "@/app/actions/subscription";
import { codeWhatsappText, whatsappHref } from "@/lib/class-roster";
import { SUBSCRIPTION_PLANS, walletLabel, type SubscriptionRequestView } from "@/lib/subscription";
import type { Locale } from "@/lib/locale";

const initial: SubscriptionFormState = { error: null };

const PLAN_LABEL = {
  month: "شهر",
  term: "ترم",
  year: "سنة كاملة",
} as const;

function ActivationCard({
  code,
  name,
  phone,
  locale,
}: {
  code: string;
  name: string;
  phone: string;
  locale: Locale;
}) {
  const ar = locale === "ar";
  const href = whatsappHref(phone, codeWhatsappText(name, code, locale));
  return (
    <div className="mt-3 rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
      <p className="text-sm font-semibold text-emerald-900">
        {ar ? "اتأكد الدفع واتعمل كود التفعيل" : "Payment confirmed and activation code issued"}
      </p>
      <p className="mt-2 font-mono text-lg font-bold tracking-wide" dir="ltr">
        {code}
      </p>
      <p className="mt-1 text-sm text-emerald-900/80">
        {name} · <span dir="ltr">{phone}</span>
      </p>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex h-11 items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white"
      >
        {ar ? "ابعت الكود واتساب" : "Send code on WhatsApp"}
      </a>
    </div>
  );
}

export function SubscriptionInbox({
  requests,
  locale,
}: {
  requests: SubscriptionRequestView[];
  locale: Locale;
}) {
  const router = useRouter();
  const [walletState, walletAction, walletPending] = useActionState(markSubscriptionReviewed, initial);
  const [cashState, cashAction, cashPending] = useActionState(confirmClassCashPayment, initial);
  const [copied, setCopied] = useState(false);
  const openedCode = useRef<string | null>(null);
  const ar = locale === "ar";
  const pendingRows = requests.filter((row) => row.status === "pending");
  const reviewed = requests.filter((row) => row.status === "reviewed").slice(0, 8);
  const issued = walletState.code
    ? { code: walletState.code, name: walletState.studentName || "", phone: walletState.phone || "" }
    : cashState.code
      ? { code: cashState.code, name: cashState.studentName || "", phone: cashState.phone || "" }
      : null;

  useEffect(() => {
    if (walletState.ok || cashState.ok) router.refresh();
  }, [walletState.ok, cashState.ok, router]);

  useEffect(() => {
    if (!issued?.code || !issued.phone) return;
    const key = `${issued.code}:${issued.phone}`;
    if (openedCode.current === key) return;
    openedCode.current = key;
    const href = whatsappHref(issued.phone, codeWhatsappText(issued.name, issued.code, locale));
    window.open(href, "_blank", "noopener,noreferrer");
  }, [issued?.code, issued?.name, issued?.phone, locale]);

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
      <h2 className="text-lg font-semibold">{ar ? "تأكيد الدفع وكود التفعيل" : "Confirm payment and send code"}</h2>
      <p className="mt-1 text-sm text-foreground/60">
        {ar
          ? "بعد ما تتأكد إن التحويل أو الكاش وصل، أكد الدفع من هنا. الكود يتبعت للطالب على واتساب."
          : "After you confirm the transfer or cash, mark it paid here. The activation code opens on WhatsApp."}
      </p>
      {walletState.error || cashState.error ? (
        <p className="mt-3 text-sm text-red-700">{walletState.error || cashState.error}</p>
      ) : null}
      {issued ? (
        <div>
          <ActivationCard code={issued.code} name={issued.name} phone={issued.phone} locale={locale} />
          <button
            type="button"
            onClick={() => void copyCode(issued.code)}
            className="mt-2 text-sm font-semibold text-primary"
          >
            {copied ? (ar ? "تم نسخ الكود" : "Code copied") : ar ? "نسخ الكود" : "Copy code"}
          </button>
        </div>
      ) : null}

      {pendingRows.length === 0 ? (
        <p className="mt-4 text-sm text-foreground/60">{ar ? "مفيش طلبات تحويل معلّقة." : "No pending transfers."}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {pendingRows.map((row) => (
            <li key={row.id} className="rounded-2xl border border-primary/10 p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{row.studentName}</p>
                  <p className="mt-1 text-sm text-foreground/70">
                    {PLAN_LABEL[row.plan]} · {walletLabel(row.wallet)} ·{" "}
                    <span className="tabular-nums" dir="ltr">
                      {row.amount} {ar ? "جنيه" : "EGP"}
                    </span>
                  </p>
                  <p className="mt-1 text-sm tabular-nums" dir="ltr">
                    {row.senderPhone}
                  </p>
                  <p className="mt-1 text-xs text-foreground/50">
                    {new Date(row.createdAt).toLocaleString(ar ? "ar-EG" : "en-GB", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <form action={walletAction}>
                  <input type="hidden" name="id" value={row.id} />
                  <button
                    type="submit"
                    disabled={walletPending}
                    className="h-10 rounded-full bg-primary px-4 text-sm font-semibold text-white disabled:opacity-70"
                  >
                    {walletPending ? (ar ? "جارٍ التأكيد" : "Confirming") : ar ? "تأكيد الدفع وإرسال الكود" : "Confirm and send code"}
                  </button>
                </form>
              </div>
              <a href={`/api/subscription-proof/${row.id}`} target="_blank" rel="noreferrer" className="mt-3 block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/subscription-proof/${row.id}`}
                  alt={ar ? "صورة التحويل" : "Transfer screenshot"}
                  className="max-h-48 rounded-xl border border-primary/10 object-contain"
                />
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 rounded-2xl bg-primary/5 p-4">
        <h3 className="text-sm font-semibold">{ar ? "الدفع في الحصة" : "Pay in class"}</h3>
        <p className="mt-1 text-xs text-foreground/60">
          {ar ? "كاش معاك في الحصة. أكد السداد وابعت كود التفعيل." : "Cash in class. Confirm payment and send the activation code."}
        </p>
        <form action={cashAction} className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_8rem_auto]">
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
          <select name="plan" defaultValue="month" className="h-11 rounded-xl border border-primary/15 bg-white px-3 text-sm">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.label} · {plan.amount}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={cashPending}
            className="h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-white disabled:opacity-70"
          >
            {cashPending ? (ar ? "جارٍ التأكيد" : "Confirming") : ar ? "أكد وابعت الكود" : "Confirm and send"}
          </button>
        </form>
      </div>

      {reviewed.length ? (
        <div className="mt-5">
          <p className="text-xs font-semibold text-foreground/55">{ar ? "اتأكد قبل كده" : "Already confirmed"}</p>
          <ul className="mt-2 space-y-2">
            {reviewed.map((row) => (
              <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span>
                  {row.studentName}
                  <span className="ms-2 text-foreground/50" dir="ltr">
                    {row.senderPhone}
                  </span>
                </span>
                <form action={walletAction}>
                  <input type="hidden" name="id" value={row.id} />
                  <button
                    type="submit"
                    disabled={walletPending}
                    className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-70"
                  >
                    {ar ? "ابعت الكود تاني" : "Send code again"}
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
