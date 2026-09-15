"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardCheck, Copy, KeyRound, LoaderCircle, Printer, Users } from "lucide-react";
import {
  createManyStudentCodes,
  createStudentCode,
  markStudentAttendance,
  openClassExam,
  saveAnnouncement,
  stopClassExam,
  toggleStudentSuspend,
  unlockStudentChapter,
  type FormState,
} from "@/app/actions/access";
import { gradeEssayForm } from "@/app/actions/study";
import { BRAND } from "@/lib/brand";
import { cairoDate } from "@/lib/class-clock";
import { codeWhatsappText, whatsappHref, type ClassRow } from "@/lib/class-roster";
import { CHAPTERS } from "@/lib/curriculum";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import type { AccessCode, ExamSubmission } from "@/lib/access-store";

const initial: FormState = { error: null };

type Tab = "class" | "codes" | "roster" | "grades";

export function AdminShell({
  locale,
  codes,
  exams,
  roster,
  announcement,
  examWindow,
}: {
  locale: Locale;
  codes: AccessCode[];
  exams: ExamSubmission[];
  roster: ClassRow[];
  announcement: string;
  examWindow: { chapterId: string; closesAt: string } | null;
}) {
  const [tab, setTab] = useState<Tab>("class");
  const router = useRouter();
  const [issueState, issueAction, issuePending] = useActionState(createStudentCode, initial);
  const [bulkState, bulkAction, bulkPending] = useActionState(createManyStudentCodes, initial);
  const [unlockState, unlockAction, unlockPending] = useActionState(unlockStudentChapter, initial);
  const [announceState, announceAction, announcePending] = useActionState(saveAnnouncement, initial);
  const [examState, examAction, examPending] = useActionState(openClassExam, initial);
  const [closeState, closeAction, closePending] = useActionState(stopClassExam, initial);
  const [windowOverride, setWindowOverride] = useState<"open" | "closed" | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const today = cairoDate();

  useEffect(() => {
    if (issueState.code || bulkState.ok || announceState.ok || examState.ok || closeState.ok || unlockState.ok) {
      router.refresh();
    }
  }, [issueState.code, bulkState.ok, announceState.ok, examState.ok, closeState.ok, unlockState.ok, router]);

  useEffect(() => {
    if (examState.examChapterId) setWindowOverride("open");
  }, [examState.examChapterId, examState.examClosesAt]);

  useEffect(() => {
    if (closeState.examClosed) setWindowOverride("closed");
  }, [closeState.examClosed, closeState.ok]);

  const liveWindow =
    windowOverride === "closed"
      ? null
      : windowOverride === "open" && examState.examChapterId
        ? { chapterId: examState.examChapterId, closesAt: examState.examClosesAt ?? "" }
        : examWindow;

  const pendingEssays = exams.reduce((sum, exam) => sum + exam.essays.length, 0);

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

  function printGrades() {
    const win = window.open("", "_blank");
    if (!win) return;
    const rows = roster
      .map(
        (row) =>
          `<tr><td>${row.name}</td><td>${row.phone}</td><td>${row.standing === "done" ? "—" : row.standing}</td><td>${row.lastPercent ?? "—"}%</td><td>${row.attendancePresent}/${row.attendanceTotal}</td><td>${row.suspended ? "stop" : "ok"}</td></tr>`,
      )
      .join("");
    win.document.write(`<!doctype html><html lang="${locale}" dir="${locale === "ar" ? "rtl" : "ltr"}"><head><meta charset="utf-8"><title>${t(locale, "printGrades")}</title>
      <style>body{font-family:system-ui;padding:24px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:8px;text-align:start}h1{font-size:20px}</style></head><body>
      <p>${locale === "ar" ? BRAND.nameAr : BRAND.nameEn}</p>
      <h1>${t(locale, "printGrades")}</h1>
      <table><thead><tr><th>${t(locale, "student")}</th><th>${t(locale, "phone")}</th><th>${t(locale, "standing")}</th><th>${t(locale, "lastPercent")}</th><th>${t(locale, "attendance")}</th><th>${t(locale, "suspend")}</th></tr></thead><tbody>${rows}</tbody></table>
      </body></html>`);
    win.document.close();
    win.focus();
    win.print();
  }

  const tabs: { id: Tab; label: string; icon: typeof KeyRound; count?: number }[] = [
    { id: "class", label: t(locale, "tabClass"), icon: ClipboardCheck },
    { id: "codes", label: t(locale, "tabCodes"), icon: KeyRound, count: codes.length },
    { id: "roster", label: t(locale, "tabRoster"), icon: Users, count: roster.length },
    { id: "grades", label: t(locale, "tabGrades"), icon: Printer, count: pendingEssays || undefined },
  ];

  return (
    <div className="mt-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => setTab("class")}
          className="rounded-2xl bg-white p-4 text-start ring-1 ring-primary/10"
        >
          <p className="text-xs text-foreground/55">{t(locale, "examStatus")}</p>
          <p className={`mt-1 text-sm font-semibold ${liveWindow ? "text-emerald-700" : "text-foreground/70"}`}>
            {liveWindow
              ? `${t(locale, "examWindowOpen")} · ${liveWindow.chapterId}`
              : t(locale, "examClosedNow")}
          </p>
        </button>
        <button
          type="button"
          onClick={() => setTab("roster")}
          className="rounded-2xl bg-white p-4 text-start ring-1 ring-primary/10"
        >
          <p className="text-xs text-foreground/55">{t(locale, "classRoster")}</p>
          <p className="mt-1 text-sm font-semibold">{roster.length}</p>
        </button>
        <button
          type="button"
          onClick={() => setTab("grades")}
          className="rounded-2xl bg-white p-4 text-start ring-1 ring-primary/10"
        >
          <p className="text-xs text-foreground/55">{t(locale, "results")}</p>
          <p className="mt-1 text-sm font-semibold">{exams.length}</p>
        </button>
      </div>

      <div className="sticky top-0 z-20 mt-5 flex gap-2 overflow-x-auto rounded-2xl bg-primary/5 p-2">
        {tabs.map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${
                active ? "bg-primary text-white" : "text-primary"
              }`}
            >
              <Icon className="size-4" />
              {item.label}
              {item.count !== undefined ? (
                <span className={`rounded-full px-1.5 text-xs ${active ? "bg-white/20" : "bg-primary/10"}`}>
                  {item.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {tab === "class" ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl bg-white p-5 ring-1 ring-primary/10">
            <h2 className="text-lg font-semibold">{t(locale, "startClassExam")}</h2>
            <p className="mt-1 text-sm text-foreground/60">{t(locale, "examWindowHint")}</p>
            <form action={examAction} className="mt-4 grid gap-3">
              <label className="grid gap-1 text-sm font-medium">
                {t(locale, "chapterExam")}
                <select name="chapterId" className="h-11 rounded-2xl border border-primary/15 px-3 text-sm" defaultValue="1">
                  {CHAPTERS.map((chapter) => (
                    <option key={chapter.id} value={chapter.id}>
                      {chapter.id}. {locale === "ar" ? chapter.titleAr : chapter.titleEn}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-sm font-medium">
                {t(locale, "examMinutes")}
                <input
                  name="minutes"
                  type="number"
                  min={5}
                  max={180}
                  step={5}
                  defaultValue={30}
                  className="h-11 rounded-2xl border border-primary/15 px-3 text-sm"
                />
              </label>
              <button
                type="submit"
                disabled={examPending}
                className="h-12 rounded-full bg-primary text-sm font-semibold text-white"
              >
                {t(locale, "startClassExam")}
              </button>
            </form>
            <form action={closeAction} className="mt-3">
              <button
                type="submit"
                disabled={closePending}
                className="h-12 w-full rounded-full bg-red-600 text-sm font-semibold text-white"
              >
                {t(locale, "closeClassExam")}
              </button>
            </form>
            <p className={`mt-3 rounded-2xl px-3 py-2 text-sm ${liveWindow ? "bg-emerald-50 text-emerald-800" : "bg-primary/5 text-foreground/65"}`}>
              {liveWindow
                ? `${t(locale, "examStarted")} ${t(locale, "chapterExam")} ${liveWindow.chapterId}${
                    liveWindow.closesAt
                      ? ` · ${new Date(liveWindow.closesAt).toLocaleTimeString(locale === "ar" ? "ar-EG" : "en-GB", { hour: "2-digit", minute: "2-digit" })}`
                      : ""
                  }`
                : t(locale, "examClosedNow")}
            </p>
            {examState.error || closeState.error ? (
              <p className="mt-2 text-sm text-red-700">{examState.error || closeState.error}</p>
            ) : null}
          </section>

          <section className="rounded-3xl bg-white p-5 ring-1 ring-primary/10">
            <h2 className="text-lg font-semibold">{t(locale, "announce")}</h2>
            <p className="mt-1 text-sm text-foreground/60">{t(locale, "announceHint")}</p>
            <form action={announceAction} className="mt-4 grid gap-3">
              <input
                name="body"
                defaultValue={announcement}
                placeholder={t(locale, "announceHint")}
                className="h-11 rounded-2xl border border-primary/15 px-3 text-sm"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={announcePending}
                  className="h-11 rounded-full bg-primary px-5 text-sm font-semibold text-white"
                >
                  {t(locale, "announce")}
                </button>
                <button
                  type="submit"
                  name="body"
                  value=""
                  className="h-11 rounded-full bg-primary/10 px-5 text-sm font-semibold"
                >
                  {t(locale, "clearAnnounce")}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      {tab === "codes" ? (
        <div className="mt-6 space-y-6">
          <section className="rounded-3xl bg-white p-5 ring-1 ring-primary/10">
            <h2 className="text-lg font-semibold">{t(locale, "generate")}</h2>
            <form action={issueAction} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
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
                disabled={issuePending}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white"
              >
                {issuePending ? <LoaderCircle className="size-4 animate-spin" /> : null}
                {t(locale, "generate")}
              </button>
              {issueState.code ? (
                <p className="sm:col-span-3 rounded-2xl bg-accent/15 px-3 py-2 font-mono text-sm">{issueState.code}</p>
              ) : null}
              {issueState.error ? <p className="sm:col-span-3 text-sm text-red-700">{issueState.error}</p> : null}
            </form>
          </section>

          <section className="rounded-3xl bg-white p-5 ring-1 ring-primary/10">
            <h2 className="text-lg font-semibold">{t(locale, "bulkIssue")}</h2>
            <form action={bulkAction} className="mt-4 grid gap-3">
              <textarea
                name="bulk"
                required
                rows={5}
                placeholder={t(locale, "bulkHint")}
                className="rounded-2xl border border-primary/15 p-3 text-sm"
              />
              <button
                type="submit"
                disabled={bulkPending}
                className="h-11 rounded-full bg-primary px-5 text-sm font-semibold text-white"
              >
                {t(locale, "generate")}
              </button>
              {bulkState.ok ? (
                <p className="text-sm text-emerald-700">
                  {t(locale, "bulkDone")}: {bulkState.code}
                </p>
              ) : null}
            </form>
          </section>

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
                        <td className="px-3 py-2">{code.usedAt ? t(locale, "used") : t(locale, "unused")}</td>
                        <td className="px-3 py-2">
                          <div className="flex flex-wrap gap-2">
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
        </div>
      ) : null}

      {tab === "roster" ? (
        <div className="mt-6 space-y-6">
          <section className="rounded-3xl bg-white p-5 ring-1 ring-primary/10">
            <h2 className="text-lg font-semibold">{t(locale, "unlockChapter")}</h2>
            <form action={unlockAction} className="mt-4 grid gap-3 sm:grid-cols-2">
              <input name="name" required placeholder={t(locale, "fullName")} className="h-11 rounded-2xl border border-primary/15 px-3 text-sm" />
              <input name="phone" required inputMode="tel" placeholder={t(locale, "phone")} className="h-11 rounded-2xl border border-primary/15 px-3 text-sm" />
              <select name="chapterId" className="h-11 rounded-2xl border border-primary/15 px-3 text-sm" defaultValue="1">
                {CHAPTERS.map((chapter) => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.id}. {locale === "ar" ? chapter.titleAr : chapter.titleEn}
                  </option>
                ))}
              </select>
              <input name="reason" placeholder={t(locale, "unlockReason")} className="h-11 rounded-2xl border border-primary/15 px-3 text-sm" />
              <button
                type="submit"
                disabled={unlockPending}
                className="sm:col-span-2 h-11 rounded-full bg-primary text-sm font-semibold text-white"
              >
                {t(locale, "unlockBtn")}
              </button>
              {unlockState.ok ? <p className="sm:col-span-2 text-sm text-emerald-700">{t(locale, "unlockBtn")} ✓</p> : null}
            </form>
          </section>

          <section>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">{t(locale, "classRoster")}</h2>
              <button
                type="button"
                onClick={printGrades}
                className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white"
              >
                {t(locale, "printGrades")}
              </button>
            </div>
            {roster.length === 0 ? (
              <p className="mt-3 text-sm text-foreground/55">{t(locale, "noCodes")}</p>
            ) : (
              <div className="mt-3 overflow-x-auto rounded-2xl bg-white ring-1 ring-primary/10">
                <table className="w-full min-w-[56rem] text-sm">
                  <thead className="bg-primary/5 text-start">
                    <tr>
                      <th className="px-3 py-2 font-semibold">{t(locale, "student")}</th>
                      <th className="px-3 py-2 font-semibold">{t(locale, "standing")}</th>
                      <th className="px-3 py-2 font-semibold">{t(locale, "lastPercent")}</th>
                      <th className="px-3 py-2 font-semibold">{t(locale, "attendance")}</th>
                      <th className="px-3 py-2 font-semibold">{t(locale, "suspend")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roster.map((row) => (
                      <tr key={row.id} className="border-t border-primary/8">
                        <td className="px-3 py-2">
                          <p className="font-medium">{row.name}</p>
                          <p className="font-mono text-xs text-foreground/55">{row.phone}</p>
                        </td>
                        <td className="px-3 py-2">
                          {row.standing === "done" ? t(locale, "finishedAll") : `${t(locale, "chapterExam")} ${row.standing}`}
                        </td>
                        <td className="px-3 py-2">{row.lastPercent === null ? "—" : `${row.lastPercent}%`}</td>
                        <td className="px-3 py-2">
                          <div className="flex flex-wrap items-center gap-1">
                            <span>
                              {row.attendancePresent}/{row.attendanceTotal}
                            </span>
                            <form
                              action={async (formData) => {
                                await markStudentAttendance({ error: null }, formData);
                                router.refresh();
                              }}
                            >
                              <input type="hidden" name="studentId" value={row.id} />
                              <input type="hidden" name="date" value={today} />
                              <input type="hidden" name="present" value="1" />
                              <button type="submit" className="rounded-full bg-emerald-600 px-2 py-1 text-xs text-white">
                                {t(locale, "present")}
                              </button>
                            </form>
                            <form
                              action={async (formData) => {
                                await markStudentAttendance({ error: null }, formData);
                                router.refresh();
                              }}
                            >
                              <input type="hidden" name="studentId" value={row.id} />
                              <input type="hidden" name="date" value={today} />
                              <input type="hidden" name="present" value="0" />
                              <button type="submit" className="rounded-full bg-red-600 px-2 py-1 text-xs text-white">
                                {t(locale, "absent")}
                              </button>
                            </form>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <form
                            action={async (formData) => {
                              await toggleStudentSuspend({ error: null }, formData);
                              router.refresh();
                            }}
                          >
                            <input type="hidden" name="studentId" value={row.id} />
                            <input type="hidden" name="suspended" value={row.suspended ? "0" : "1"} />
                            <button
                              type="submit"
                              className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                row.suspended ? "bg-accent text-primary-dark" : "bg-primary/10"
                              }`}
                            >
                              {row.suspended ? t(locale, "resume") : t(locale, "suspend")}
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      ) : null}

      {tab === "grades" ? (
        <section className="mt-6">
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
                  <p className="mt-1 text-xs text-foreground/45">{exam.submittedAt.replace("T", " ").slice(0, 16)}</p>
                  <ol className="mt-3 space-y-2 text-sm">
                    {exam.essays.map((item) => (
                      <li key={item.id} className="rounded-xl bg-primary/4 p-3">
                        <p className="font-medium">{item.prompt}</p>
                        <p className="mt-1 whitespace-pre-wrap text-foreground/75">{item.answer || "—"}</p>
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
                          <button type="submit" className="h-10 rounded-full bg-primary px-3 text-xs font-semibold text-white">
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
      ) : null}
    </div>
  );
}
