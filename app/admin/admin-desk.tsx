"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, LoaderCircle, Printer } from "lucide-react";
import { createStudentCode, unlockStudentChapter, type FormState } from "@/app/actions/access";
import { gradeEssayForm } from "@/app/actions/study";
import { CHAPTERS } from "@/lib/curriculum";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import type { AccessCode, ExamSubmission } from "@/lib/access-store";
import { BRAND } from "@/lib/brand";
import { codeWhatsappText, whatsappHref } from "@/lib/class-roster";

const initial: FormState = { error: null };

export function AdminDesk({
  locale,
  codes,
  exams,
}: {
  locale: Locale;
  codes: AccessCode[];
  exams: ExamSubmission[];
}) {
  const [state, action, pending] = useActionState(createStudentCode, initial);
  const [unlockState, unlockAction, unlockPending] = useActionState(unlockStudentChapter, initial);
  const [copied, setCopied] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (state.code) router.refresh();
  }, [state.code, router]);

  function copy(value: string) {
    void navigator.clipboard.writeText(value);
    setCopied(value);
    window.setTimeout(() => setCopied(null), 1500);
  }

  function printSlip(code: AccessCode) {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!doctype html><html lang="${locale}" dir="${locale === "ar" ? "rtl" : "ltr"}"><head><meta charset="utf-8"><title>${code.code}</title>
      <style>body{font-family:system-ui;padding:32px;max-width:420px}h1{font-size:22px}code{font-size:28px;letter-spacing:2px;display:block;margin:16px 0;padding:12px;border:2px dashed #0c2d6b;text-align:center}p{line-height:1.6}</style></head><body>
      <p>${locale === "ar" ? BRAND.nameAr : BRAND.nameEn} · ${locale === "ar" ? BRAND.teacherAr : BRAND.teacherEn}</p>
      <h1>${locale === "ar" ? "كود اشتراك الحصة" : "Class access code"}</h1>
      <p>${locale === "ar" ? "الاسم" : "Name"}: <strong>${code.name}</strong></p>
      <p>${locale === "ar" ? "الرقم" : "Phone"}: <strong>${code.phone}</strong></p>
      <code>${code.code}</code>
      <p>${locale === "ar" ? "يُستخدم مرة واحدة بالاسم والرقم معًا. لا تشارك الكود." : "One-time use with this name and phone. Do not share."}</p>
      </body></html>`);
    win.document.close();
    win.focus();
    win.print();
  }

  return (
    <div className="mt-8 space-y-10">
      <form action={action} className="grid gap-3 rounded-3xl bg-white p-5 ring-1 ring-primary/10 sm:grid-cols-[1fr_1fr_auto]">
        <input
          name="name"
          required
          minLength={3}
          placeholder={t(locale, "fullName")}
          className="h-11 rounded-2xl border border-primary/15 px-3 text-sm"
        />
        <input
          name="phone"
          required
          inputMode="tel"
          placeholder={t(locale, "phone")}
          className="h-11 rounded-2xl border border-primary/15 px-3 text-sm"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white"
        >
          {pending ? <LoaderCircle className="size-4 animate-spin" /> : null}
          {t(locale, "generate")}
        </button>
        {state.code ? (
          <p className="sm:col-span-3 rounded-2xl bg-accent/15 px-3 py-2 font-mono text-sm">
            {state.code}
          </p>
        ) : null}
        {state.error ? (
          <p className="sm:col-span-3 text-sm text-red-700">{state.error}</p>
        ) : null}
      </form>

      <section>
        <h2 className="text-lg font-semibold">{t(locale, "accessCode")}</h2>
        {codes.length === 0 ? (
          <p className="mt-3 text-sm text-foreground/55">{t(locale, "noCodes")}</p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-2xl bg-white ring-1 ring-primary/10">
            <table className="w-full min-w-[45rem] text-sm">
              <thead className="bg-primary/5 text-start">
                <tr>
                  <th className="px-3 py-2 font-semibold">{t(locale, "student")}</th>
                  <th className="px-3 py-2 font-semibold">{t(locale, "phone")}</th>
                  <th className="px-3 py-2 font-semibold">{t(locale, "accessCode")}</th>
                  <th className="px-3 py-2 font-semibold">{t(locale, "used")}</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {codes.map((code) => (
                  <tr key={code.id} className="border-t border-primary/8">
                    <td className="px-3 py-2">{code.name}</td>
                    <td className="px-3 py-2 font-mono text-xs">{code.phone}</td>
                    <td className="px-3 py-2 font-mono">{code.code}</td>
                    <td className="px-3 py-2">
                      {code.usedAt ? t(locale, "used") : t(locale, "unused")}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => copy(code.code)}
                          className="inline-flex items-center gap-1 rounded-full bg-primary/8 px-2 py-1 text-xs"
                        >
                          <Copy className="size-3" />
                          {copied === code.code ? "OK" : t(locale, "copy")}
                        </button>
                        <button
                          type="button"
                          onClick={() => printSlip(code)}
                          className="inline-flex items-center gap-1 rounded-full bg-primary/8 px-2 py-1 text-xs"
                        >
                          <Printer className="size-3" />
                          {t(locale, "printSlip")}
                        </button>
                        <a
                          href={whatsappHref(code.phone, codeWhatsappText(code.name, code.code, locale))}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center rounded-full bg-emerald-600 px-2 py-1 text-xs font-semibold text-white"
                        >
                          {t(locale, "sendWhatsapp")}
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold">{t(locale, "unlockChapter")}</h2>
        <form action={unlockAction} className="mt-3 grid gap-3 rounded-3xl bg-white p-5 ring-1 ring-primary/10 sm:grid-cols-2">
          <input
            name="name"
            required
            placeholder={t(locale, "fullName")}
            className="h-11 rounded-2xl border border-primary/15 px-3 text-sm"
          />
          <input
            name="phone"
            required
            inputMode="tel"
            placeholder={t(locale, "phone")}
            className="h-11 rounded-2xl border border-primary/15 px-3 text-sm"
          />
          <select
            name="chapterId"
            className="h-11 rounded-2xl border border-primary/15 px-3 text-sm"
            defaultValue="1"
          >
            {CHAPTERS.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>
                {chapter.id}. {locale === "ar" ? chapter.titleAr : chapter.titleEn}
              </option>
            ))}
          </select>
          <input
            name="reason"
            placeholder={t(locale, "unlockReason")}
            className="h-11 rounded-2xl border border-primary/15 px-3 text-sm"
          />
          <button
            type="submit"
            disabled={unlockPending}
            className="sm:col-span-2 inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-white"
          >
            {t(locale, "unlockBtn")}
          </button>
          {unlockState.ok ? (
            <p className="sm:col-span-2 text-sm text-emerald-700">{t(locale, "unlockBtn")} ✓</p>
          ) : null}
        </form>
      </section>

      <section>
        <h2 className="text-lg font-semibold">{t(locale, "results")}</h2>
        {exams.length === 0 ? (
          <p className="mt-3 text-sm text-foreground/55">{t(locale, "noResults")}</p>
        ) : (
          <div className="mt-3 space-y-3">
            {exams.slice(0, 40).map((exam) => (
              <article key={exam.id} className="rounded-2xl bg-white p-4 ring-1 ring-primary/10">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <strong>{exam.name}</strong>
                  <span className="text-foreground/55">
                    {t(locale, "chapterExam")} {exam.chapterId} · {exam.objectiveScore}/{exam.objectiveTotal}
                  </span>
                </div>
                <p className="mt-1 text-xs text-foreground/45">
                  {exam.submittedAt.replace("T", " ").slice(0, 16)}
                </p>
                <ol className="mt-3 space-y-2 text-sm">
                  {exam.essays.map((item) => (
                    <li key={item.id} className="rounded-xl bg-primary/4 p-3">
                      <p className="font-medium">{item.prompt}</p>
                      <p className="mt-1 whitespace-pre-wrap text-foreground/75">
                        {item.answer || "—"}
                      </p>
                      <form action={gradeEssayForm} className="mt-3 grid gap-2 sm:grid-cols-[6rem_1fr_auto]">
                        <input type="hidden" name="examId" value={exam.id} />
                        <input type="hidden" name="studentId" value={exam.studentId} />
                        <input type="hidden" name="questionId" value={item.id} />
                        <input
                          name="score"
                          type="number"
                          min={0}
                          max={16}
                          step={1}
                          placeholder={t(locale, "essayScore")}
                          className="h-10 rounded-xl border border-primary/15 px-2 text-sm"
                        />
                        <input
                          name="note"
                          placeholder={t(locale, "essayNote")}
                          className="h-10 rounded-xl border border-primary/15 px-2 text-sm"
                        />
                        <button
                          type="submit"
                          className="h-10 rounded-full bg-primary px-3 text-xs font-semibold text-white"
                        >
                          {t(locale, "gradeEssay")}
                        </button>
                      </form>
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
