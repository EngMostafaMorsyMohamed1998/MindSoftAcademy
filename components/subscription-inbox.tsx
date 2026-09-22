"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { markSubscriptionReviewed, type SubscriptionFormState } from "@/app/actions/subscription";
import { walletLabel, type SubscriptionRequestView } from "@/lib/subscription";
import type { Locale } from "@/lib/locale";

const initial: SubscriptionFormState = { error: null };

const PLAN_LABEL = {
  month: "شهر",
  term: "ترم",
  year: "سنة كاملة",
} as const;

export function SubscriptionInbox({
  requests,
  locale,
}: {
  requests: SubscriptionRequestView[];
  locale: Locale;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState(markSubscriptionReviewed, initial);
  const ar = locale === "ar";
  const pendingRows = requests.filter((row) => row.status === "pending");
  const reviewed = requests.filter((row) => row.status === "reviewed").slice(0, 8);

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  return (
    <section className="rounded-3xl bg-white p-5 ring-1 ring-primary/10">
      <h2 className="text-lg font-semibold">{ar ? "طلبات التحويل" : "Transfer requests"}</h2>
      <p className="mt-1 text-sm text-foreground/60">
        {ar
          ? "فودافون كاش وإنستاباي. الدفع في الحصة لسه من سجل الاشتراك، والطلب ده مش بيعلّم الطالب مسدّد لوحده."
          : "Vodafone Cash and Instapay. In-class cash stays on the fee list. A request does not mark the student paid."}
      </p>
      {state.error ? <p className="mt-3 text-sm text-red-700">{state.error}</p> : null}
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
                <form action={action}>
                  <input type="hidden" name="id" value={row.id} />
                  <button
                    type="submit"
                    disabled={pending}
                    className="h-10 rounded-full bg-primary px-4 text-sm font-semibold text-white disabled:opacity-70"
                  >
                    {ar ? "تمت المراجعة" : "Reviewed"}
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
      {reviewed.length ? (
        <p className="mt-4 text-xs text-foreground/50">
          {ar ? "آخر المراجعات:" : "Recently reviewed:"}{" "}
          {reviewed.map((row) => row.studentName).join(ar ? "، " : ", ")}
        </p>
      ) : null}
    </section>
  );
}
