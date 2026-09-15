"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createManyStudentCodes,
  markStudentAttendance,
  openClassExam,
  saveAnnouncement,
  toggleStudentSuspend,
  type FormState,
} from "@/app/actions/access";
import { CHAPTERS } from "@/lib/curriculum";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import type { ClassRow } from "@/lib/class-roster";
import { cairoDate } from "@/lib/class-clock";
import { BRAND } from "@/lib/brand";

const initial: FormState = { error: null };

export function ClassTools({
  locale,
  roster,
  announcement,
  examWindow,
}: {
  locale: Locale;
  roster: ClassRow[];
  announcement: string;
  examWindow: { chapterId: string; closesAt: string } | null;
}) {
  const router = useRouter();
  const [bulkState, bulkAction, bulkPending] = useActionState(createManyStudentCodes, initial);
  const [announceState, announceAction, announcePending] = useActionState(saveAnnouncement, initial);
  const [examState, examAction, examPending] = useActionState(openClassExam, initial);
  const today = cairoDate();

  useEffect(() => {
    if (bulkState.ok || announceState.ok || examState.ok) router.refresh();
  }, [bulkState.ok, announceState.ok, examState.ok, router]);

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

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-lg font-semibold">{t(locale, "bulkIssue")}</h2>
        <form action={bulkAction} className="mt-3 grid gap-3 rounded-3xl bg-white p-5 ring-1 ring-primary/10">
          <textarea
            name="bulk"
            required
            rows={6}
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
        <h2 className="text-lg font-semibold">{t(locale, "startClassExam")}</h2>
        <form action={examAction} className="mt-3 flex flex-wrap gap-3 rounded-3xl bg-white p-5 ring-1 ring-primary/10">
          <select name="chapterId" className="h-11 min-w-52 rounded-2xl border border-primary/15 px-3 text-sm" defaultValue="1">
            {CHAPTERS.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>
                {chapter.id}. {locale === "ar" ? chapter.titleAr : chapter.titleEn}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={examPending}
            className="h-11 rounded-full bg-primary px-5 text-sm font-semibold text-white"
          >
            {t(locale, "startClassExam")}
          </button>
          {examWindow ? (
            <p className="w-full text-sm text-emerald-700">
              {t(locale, "examWindowOpen")}: {examWindow.chapterId} · {examWindow.closesAt.replace("T", " ").slice(11, 16)}
            </p>
          ) : null}
        </form>
      </section>

      <section>
        <h2 className="text-lg font-semibold">{t(locale, "announce")}</h2>
        <form action={announceAction} className="mt-3 grid gap-3 rounded-3xl bg-white p-5 ring-1 ring-primary/10">
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
  );
}
