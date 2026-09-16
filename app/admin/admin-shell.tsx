"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Award, ClipboardCheck, Copy, KeyRound, LoaderCircle, Printer, Send, Smartphone, Users, Wallet } from "lucide-react";
import {
  createManyStudentCodes,
  createStudentCode,
  deleteWeekSlot,
  markStudentAttendance,
  markStudentFee,
  openClassExam,
  openMixedMock,
  openSurprise,
  saveAnnouncement,
  saveMonthlyFee,
  saveWeekSlot,
  stopClassExam,
  stopSurprise,
  removeStudentDevice,
  saveDeviceLimit,
  toggleStudentSuspend,
  unlockStudentChapter,
  type FormState,
} from "@/app/actions/access";
import { gradeEssayForm } from "@/app/actions/study";
import {
  activateTelegramWebhook,
  sendTelegramAllReports,
  sendTelegramStudentReport,
  type TelegramState,
} from "@/app/actions/telegram";
import { BRAND } from "@/lib/brand";
import { cairoClock, type ExamMode } from "@/lib/class-clock";
import { buildMonthProfits, cairoMonthLabel, type MonthPayment } from "@/lib/fees";
import { absenteeWhatsappText, sessionsInMonth, type ClassSession } from "@/lib/class-session";
import { codeWhatsappText, feesWhatsappText, parentWeeklyWhatsappText, whatsappHref, type ClassRow } from "@/lib/class-roster";
import { starLabel } from "@/lib/week-stars";
import { CHAPTERS } from "@/lib/curriculum";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import type { AccessCode, CourseCertificate, DeviceLimit, EssayGrade, ExamSubmission, StudentDevice, TelegramLink } from "@/lib/access-store";
import { CertificateCard } from "@/components/certificate-card";
import { CertificatePrintButton } from "@/components/certificate-print-button";
import { PresenceBoard } from "@/components/presence-board";
import { SurpriseBoard } from "@/components/surprise-board";
import { ESSAY_MARKS, markForGrade } from "@/lib/essay-marks";
import { surpriseOpen, surpriseRemaining, type SurpriseAnswer, type SurpriseQuestion } from "@/lib/surprise";
import { weekdayName, type WeekSlot } from "@/lib/week-plan";

const initial: FormState = { error: null };

type Tab = "class" | "codes" | "roster" | "grades" | "certificates" | "profit";

export function AdminShell({
  locale,
  codes,
  exams,
  roster,
  announcement,
  examWindow,
  weekPlan,
  sessions,
  essayGrades,
  payments,
  monthlyFee,
  surprise,
  surpriseAnswers,
  certificates,
  telegramLinks,
  telegramConfigured,
  telegramHref,
  devices,
  deviceLimit,
  today,
  weekday,
  month,
  initialTab = "class",
}: {
  locale: Locale;
  codes: AccessCode[];
  exams: ExamSubmission[];
  roster: ClassRow[];
  announcement: string;
  examWindow: { chapterId: string; closesAt: string; mode?: ExamMode } | null;
  weekPlan: WeekSlot[];
  sessions: ClassSession[];
  essayGrades: EssayGrade[];
  payments: MonthPayment[];
  monthlyFee: number;
  surprise: SurpriseQuestion | null;
  surpriseAnswers: SurpriseAnswer[];
  certificates: CourseCertificate[];
  telegramLinks: TelegramLink[];
  telegramConfigured: boolean;
  telegramHref: string | null;
  devices: StudentDevice[];
  deviceLimit: DeviceLimit;
  today: string;
  weekday: number;
  month: string;
  initialTab?: Tab;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const router = useRouter();
  const [issueState, issueAction, issuePending] = useActionState(createStudentCode, initial);
  const [bulkState, bulkAction, bulkPending] = useActionState(createManyStudentCodes, initial);
  const [unlockState, unlockAction, unlockPending] = useActionState(unlockStudentChapter, initial);
  const [announceState, announceAction, announcePending] = useActionState(saveAnnouncement, initial);
  const [examState, examAction, examPending] = useActionState(openClassExam, initial);
  const [mixState, mixAction, mixPending] = useActionState(openMixedMock, initial);
  const [closeState, closeAction, closePending] = useActionState(stopClassExam, initial);
  const [slotState, slotAction, slotPending] = useActionState(saveWeekSlot, initial);
  const [feeState, feeAction, feePending] = useActionState(saveMonthlyFee, initial);
  const [surpriseState, surpriseAction, surprisePending] = useActionState(openSurprise, initial);
  const [surpriseCloseState, surpriseCloseAction, surpriseClosePending] = useActionState(stopSurprise, initial);
  const telegramInitial: TelegramState = { error: null };
  const [telegramHookState, telegramHookAction, telegramHookPending] = useActionState(
    activateTelegramWebhook,
    telegramInitial,
  );
  const [telegramOneState, telegramOneAction, telegramOnePending] = useActionState(
    sendTelegramStudentReport,
    telegramInitial,
  );
  const [telegramAllState, telegramAllAction, telegramAllPending] = useActionState(
    sendTelegramAllReports,
    telegramInitial,
  );
  const [deviceLimitState, deviceLimitAction, deviceLimitPending] = useActionState(saveDeviceLimit, initial);
  const [deviceForgetState, deviceForgetAction, deviceForgetPending] = useActionState(removeStudentDevice, initial);
  const [slotDeleteState, slotDeleteAction, slotDeletePending] = useActionState(deleteWeekSlot, initial);
  const [windowOverride, setWindowOverride] = useState<"open" | "closed" | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (issueState.code || bulkState.ok || announceState.ok || examState.ok || mixState.ok || closeState.ok || unlockState.ok || slotState.ok || slotDeleteState.ok || feeState.ok || surpriseState.ok || surpriseCloseState.ok || telegramHookState.ok || telegramOneState.ok || telegramAllState.ok || deviceLimitState.ok || deviceForgetState.ok) {
      router.refresh();
    }
  }, [issueState.code, bulkState.ok, announceState.ok, examState.ok, mixState.ok, closeState.ok, unlockState.ok, slotState.ok, slotDeleteState.ok, feeState.ok, surpriseState.ok, surpriseCloseState.ok, telegramHookState.ok, telegramOneState.ok, telegramAllState.ok, deviceLimitState.ok, deviceForgetState.ok, router]);

  useEffect(() => {
    if (examState.examChapterId || mixState.examChapterId) setWindowOverride("open");
  }, [examState.examChapterId, examState.examClosesAt, mixState.examChapterId, mixState.examClosesAt]);

  useEffect(() => {
    if (closeState.examClosed) setWindowOverride("closed");
  }, [closeState.examClosed, closeState.ok]);

  const liveWindow =
    windowOverride === "closed"
      ? null
      : windowOverride === "open" && (examState.examChapterId || mixState.examChapterId)
        ? {
            chapterId: examState.examChapterId ?? mixState.examChapterId ?? "",
            closesAt: examState.examClosesAt ?? mixState.examClosesAt ?? "",
            mode: examState.examMode ?? mixState.examMode,
          }
        : examWindow;

  const pendingEssays = exams.reduce((sum, exam) => {
    return (
      sum +
      exam.essays.filter(
        (item) => !essayGrades.some((grade) => grade.examId === exam.id && grade.questionId === item.id),
      ).length
    );
  }, 0);
  const declined = roster.filter((row) => row.declined);
  const unpaid = roster.filter((row) => !row.monthPaid);
  const rankedRoster = [...roster].sort(
    (a, b) => Number(a.monthPaid) - Number(b.monthPaid) || Number(b.declined) - Number(a.declined),
  );
  const monthSessions = sessionsInMonth(sessions, month);
  const latest = sessions[0] ?? null;
  const profits = buildMonthProfits({
    payments,
    studentIds: roster.map((row) => row.id),
    monthlyFee,
    currentMonth: month,
  });
  const thisMonth = profits[0];
  const sampleYear = today.slice(0, 4);
  const sampleCertificate = {
    serial: `MSA-${sampleYear}-0000`,
    studentId: "preview",
    name: locale === "ar" ? "اسم الطالب" : "Student name",
    issuedAt: `${today}T12:00:00.000Z`,
    average: 92,
    verifyCode: "SAMPLE",
    year: sampleYear,
  };
  const shownCertificates = certificates.length ? certificates : [sampleCertificate];

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
          `<tr><td>${row.name}</td><td>${row.phone}</td><td>${starLabel(row.week.stars)}</td><td>${row.standing === "done" ? "—" : row.standing}</td><td>${row.lastPercent ?? "—"}%</td><td>${row.attendancePresent}/${row.attendanceTotal}</td><td>${row.monthPaid ? t(locale, "monthPaid") : t(locale, "monthDue")}</td><td>${row.suspended ? "stop" : "ok"}</td></tr>`,
      )
      .join("");
    win.document.write(`<!doctype html><html lang="${locale}" dir="${locale === "ar" ? "rtl" : "ltr"}"><head><meta charset="utf-8"><title>${t(locale, "printGrades")}</title>
      <style>body{font-family:system-ui;padding:24px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:8px;text-align:start}h1{font-size:20px}</style></head><body>
      <p>${locale === "ar" ? BRAND.nameAr : BRAND.nameEn}</p>
      <h1>${t(locale, "printGrades")}</h1>
      <table><thead><tr><th>${t(locale, "student")}</th><th>${t(locale, "phone")}</th><th>${t(locale, "weekStars")}</th><th>${t(locale, "standing")}</th><th>${t(locale, "lastPercent")}</th><th>${t(locale, "attendance")}</th><th>${t(locale, "monthFees")}</th><th>${t(locale, "suspend")}</th></tr></thead><tbody>${rows}</tbody></table>
      </body></html>`);
    win.document.close();
    win.focus();
    win.print();
  }

  function printMonth() {
    const win = window.open("", "_blank");
    if (!win) return;
    const blocks = monthSessions
      .map((session) => {
        const rows = session.students
          .map(
            (row) =>
              `<tr><td>${row.name}</td><td>${row.present === true ? t(locale, "present") : row.present === false ? t(locale, "absent") : "—"}</td><td>${row.examScore ?? "—"}</td><td>${row.examPercent ?? "—"}</td></tr>`,
          )
          .join("");
        return `<h2>${session.date}${session.chapterId ? ` · ${t(locale, "chapterExam")} ${session.chapterId}` : ""}</h2>
          <p>${t(locale, "presentCount")} ${session.presentCount} · ${t(locale, "absentCount")} ${session.absentCount} · ${t(locale, "examCount")} ${session.examCount} · ${t(locale, "classAverage")} ${session.averagePercent ?? "—"}%</p>
          <table><thead><tr><th>${t(locale, "student")}</th><th>${t(locale, "attendance")}</th><th>${t(locale, "results")}</th><th>${t(locale, "lastPercent")}</th></tr></thead><tbody>${rows}</tbody></table>`;
      })
      .join("");
    win.document.write(`<!doctype html><html lang="${locale}" dir="${locale === "ar" ? "rtl" : "ltr"}"><head><meta charset="utf-8"><title>${t(locale, "printMonth")} ${month}</title>
      <style>body{font-family:system-ui;padding:24px}table{width:100%;border-collapse:collapse;margin-bottom:24px}th,td{border:1px solid #ccc;padding:8px;text-align:start}h1{font-size:20px}h2{font-size:16px;margin-top:24px}</style></head><body>
      <p>${locale === "ar" ? BRAND.nameAr : BRAND.nameEn}</p>
      <h1>${t(locale, "printMonth")} · ${month}</h1>
      ${blocks || `<p>${t(locale, "noSession")}</p>`}
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
    { id: "certificates", label: t(locale, "tabCertificates"), icon: Award, count: certificates.length },
    { id: "profit", label: t(locale, "tabProfit"), icon: Wallet, count: thisMonth?.revenue || undefined },
  ];

  return (
    <div className="mt-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <button
          type="button"
          onClick={() => setTab("class")}
          className="rounded-2xl bg-white p-4 text-start ring-1 ring-primary/10"
        >
          <p className="text-xs text-foreground/55">{t(locale, "examStatus")}</p>
          <p className={`mt-1 text-sm font-semibold ${liveWindow ? "text-emerald-700" : "text-foreground/70"}`}>
            {liveWindow
              ? `${t(locale, "examWindowOpen")} · ${
                  liveWindow.chapterId === "mix" ? t(locale, "mixedMock") : liveWindow.chapterId
                }${liveWindow.mode === "ministry" ? ` · ${t(locale, "ministryExam")}` : ""}`
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
        <button
          type="button"
          onClick={() => setTab("certificates")}
          className="rounded-2xl bg-white p-4 text-start ring-1 ring-primary/10"
        >
          <p className="text-xs text-foreground/55">{t(locale, "tabCertificates")}</p>
          <p className="mt-1 text-sm font-semibold">{certificates.length}</p>
        </button>
        <button
          type="button"
          onClick={() => setTab("profit")}
          className="rounded-2xl bg-white p-4 text-start ring-1 ring-primary/10"
        >
          <p className="text-xs text-foreground/55">{t(locale, "monthProfit")}</p>
          <p className="mt-1 text-sm font-semibold tabular-nums" dir="ltr">
            {thisMonth?.revenue ?? 0} {t(locale, "currency")}
          </p>
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
          <section className="rounded-3xl bg-white p-5 ring-1 ring-primary/10 lg:col-span-2">
            <h2 className="text-lg font-semibold">{t(locale, "presenceTitle")}</h2>
            <p className="mt-1 text-sm text-foreground/60">{t(locale, "presenceHint")}</p>
            <div className="mt-4">
              <PresenceBoard locale={locale} />
            </div>
          </section>
          <section className="rounded-3xl bg-white p-5 ring-1 ring-primary/10 lg:col-span-2">
            <h2 className="text-lg font-semibold">{t(locale, "telegramTitle")}</h2>
            <p className="mt-1 text-sm text-foreground/60">{t(locale, "telegramLead")}</p>
            <p className="mt-2 text-sm font-semibold">
              {t(locale, "telegramCount")}: {telegramLinks.length}
            </p>
            {!telegramConfigured ? (
              <p className="mt-3 text-sm text-amber-800">{t(locale, "telegramMissingToken")}</p>
            ) : (
              <p className="mt-3 text-sm text-emerald-800">{t(locale, "telegramReady")}</p>
            )}
            {codes.length === 0 ? (
              <p className="mt-3 text-sm text-amber-800">{t(locale, "telegramNeedStudent")}</p>
            ) : null}
            <form action={telegramHookAction} className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
              <label className="grid gap-1 text-sm">
                <span className="font-medium">{t(locale, "telegramTokenLabel")}</span>
                <input
                  name="token"
                  type="password"
                  required={!telegramConfigured}
                  autoComplete="off"
                  placeholder="123456:ABC..."
                  className="h-11 rounded-2xl border border-primary/15 px-3 text-sm"
                />
                <span className="text-xs text-foreground/55">{t(locale, "telegramTokenHint")}</span>
              </label>
              <button
                type="submit"
                disabled={telegramHookPending}
                className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-white disabled:opacity-50"
              >
                {t(locale, "telegramActivate")}
              </button>
            </form>
            {telegramHookState.error === "TOKEN" ? (
              <p className="mt-2 text-sm text-amber-800">{t(locale, "telegramBadToken")}</p>
            ) : null}
            {telegramHookState.error === "WEBHOOK" ? (
              <p className="mt-2 text-sm text-amber-800">{t(locale, "telegramHookFail")}</p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              {telegramHref ? (
                <a
                  href={telegramHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-sky-600 px-4 text-sm font-semibold text-white"
                >
                  <Send className="size-4" />
                  {t(locale, "telegramOpen")}
                </a>
              ) : null}
              <form action={telegramAllAction}>
                <button
                  type="submit"
                  disabled={telegramAllPending || telegramLinks.length === 0}
                  className="inline-flex h-11 items-center rounded-full bg-primary-dark px-4 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {t(locale, "telegramSendAll")}
                </button>
              </form>
            </div>
            {telegramHookState.ok || telegramAllState.ok || telegramOneState.ok ? (
              <p className="mt-3 text-sm text-emerald-700">{t(locale, "telegramSent")}</p>
            ) : null}
            {telegramLinks.length === 0 ? (
              <p className="mt-3 text-sm text-foreground/55">{t(locale, "telegramNone")}</p>
            ) : (
              <ul className="mt-3 space-y-1 text-sm">
                {telegramLinks.map((link) => {
                  const student = roster.find((row) => row.id === link.studentId);
                  return (
                    <li key={link.chatId}>
                      {student?.name || link.phone}
                      {link.parentName ? ` · ${link.parentName}` : ""}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
          <section className="rounded-3xl bg-white p-5 ring-1 ring-primary/10 lg:col-span-2">
            <h2 className="text-lg font-semibold">{t(locale, "deviceTitle")}</h2>
            <p className="mt-1 text-sm text-foreground/60">{t(locale, "deviceLead")}</p>
            <p className="mt-3 text-sm font-semibold">
              {t(locale, "deviceLimit")}: {deviceLimit === 1 ? t(locale, "deviceLimit1") : t(locale, "deviceLimit2")}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <form action={deviceLimitAction}>
                <input type="hidden" name="limit" value="1" />
                <button
                  type="submit"
                  disabled={deviceLimitPending}
                  className={`inline-flex h-11 items-center rounded-full px-4 text-sm font-semibold ${
                    deviceLimit === 1 ? "bg-primary text-white" : "bg-primary/10 text-primary"
                  }`}
                >
                  {t(locale, "deviceLimit1")}
                </button>
              </form>
              <form action={deviceLimitAction}>
                <input type="hidden" name="limit" value="2" />
                <button
                  type="submit"
                  disabled={deviceLimitPending}
                  className={`inline-flex h-11 items-center rounded-full px-4 text-sm font-semibold ${
                    deviceLimit === 2 ? "bg-primary text-white" : "bg-primary/10 text-primary"
                  }`}
                >
                  {t(locale, "deviceLimit2")}
                </button>
              </form>
            </div>
          </section>
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
                  defaultValue={60}
                  className="h-11 rounded-2xl border border-primary/15 px-3 text-sm"
                />
              </label>
              <label className="flex items-start gap-2 rounded-2xl bg-primary/5 px-3 py-3 text-sm">
                <input type="checkbox" name="ministry" value="1" className="mt-1" />
                <span>
                  <span className="font-semibold">{t(locale, "ministryExam")}</span>
                  <span className="mt-1 block text-xs text-foreground/60">{t(locale, "ministryExamHint")}</span>
                </span>
              </label>
              <button
                type="submit"
                disabled={examPending}
                className="h-12 rounded-full bg-primary text-sm font-semibold text-white"
              >
                {t(locale, "startClassExam")}
              </button>
            </form>
            <form action={mixAction} className="mt-4 grid gap-3 rounded-2xl bg-accent/15 p-3">
              <p className="text-sm font-semibold">{t(locale, "mixedMock")}</p>
              <p className="text-xs text-foreground/60">{t(locale, "mixedMockHint")}</p>
              <label className="grid gap-1 text-sm font-medium">
                {t(locale, "examMinutes")}
                <input
                  name="minutes"
                  type="number"
                  min={30}
                  max={180}
                  step={5}
                  defaultValue={90}
                  className="h-11 rounded-2xl border border-primary/15 bg-white px-3 text-sm"
                />
              </label>
              <button
                type="submit"
                disabled={mixPending}
                className="h-12 rounded-full bg-primary-dark text-sm font-semibold text-white"
              >
                {t(locale, "startMixedMock")}
              </button>
            </form>
            <form action={closeAction} className="mt-3">
              <button
                type="submit"
                disabled={closePending}
                className="h-12 w-full rounded-full bg-red-600 text-sm font-semibold text-white"
              >
                {t(locale, "closeClassSave")}
              </button>
            </form>
            <p className={`mt-3 rounded-2xl px-3 py-2 text-sm ${liveWindow ? "bg-emerald-50 text-emerald-800" : "bg-primary/5 text-foreground/65"}`}>
              {liveWindow
                ? `${t(locale, "examStarted")} ${
                    liveWindow.chapterId === "mix"
                      ? t(locale, "mixedMock")
                      : `${t(locale, "chapterExam")} ${liveWindow.chapterId}`
                  }${
                    liveWindow.closesAt
                      ? ` · ${cairoClock(liveWindow.closesAt)}`
                      : ""
                  }`
                : t(locale, "examClosedNow")}
            </p>
            {examState.error || mixState.error || closeState.error ? (
              <p className="mt-2 text-sm text-red-700">{examState.error || mixState.error || closeState.error}</p>
            ) : null}
            {closeState.sessionSaved ? (
              <p className="mt-2 text-sm text-emerald-700">{t(locale, "sessionReport")} ✓</p>
            ) : null}
          </section>

          <section className="rounded-3xl bg-white p-5 ring-1 ring-primary/10">
            <h2 className="text-lg font-semibold">{t(locale, "surpriseTitle")}</h2>
            <p className="mt-1 text-sm text-foreground/60">{t(locale, "surpriseHint")}</p>
            <form action={surpriseAction} className="mt-4 grid gap-3">
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
              <button
                type="submit"
                disabled={surprisePending}
                className="h-12 rounded-full bg-amber-600 text-sm font-semibold text-white"
              >
                {t(locale, "startSurprise")}
              </button>
            </form>
            {surpriseOpen(surprise) ? (
              <form action={surpriseCloseAction} className="mt-3">
                <button
                  type="submit"
                  disabled={surpriseClosePending}
                  className="h-11 w-full rounded-full bg-primary-dark text-sm font-semibold text-white"
                >
                  {t(locale, "closeSurprise")}
                </button>
              </form>
            ) : null}
            <div className="mt-4">
              <SurpriseBoard
                locale={locale}
                initial={{
                  open: surpriseOpen(surprise),
                  remaining: surpriseRemaining(surprise),
                  chapterId: surprise?.chapterId,
                  promptAr: surprise?.promptAr,
                  answered: surpriseAnswers.length,
                  correct: surpriseAnswers.filter((row) => row.correct).length,
                  rows: roster.map((row) => {
                    const hit = surpriseAnswers.find((item) => item.studentId === row.id);
                    return {
                      id: row.id,
                      name: row.name,
                      answered: Boolean(hit),
                      correct: hit?.correct ?? null,
                      seconds: hit && surprise
                        ? Math.max(0, Math.round((Date.parse(hit.answeredAt) - Date.parse(surprise.opensAt)) / 1000))
                        : null,
                    };
                  }),
                }}
              />
            </div>
            {surpriseState.error || surpriseCloseState.error ? (
              <p className="mt-2 text-sm text-red-700">{surpriseState.error || surpriseCloseState.error}</p>
            ) : null}
          </section>

          <section className="rounded-3xl bg-white p-5 ring-1 ring-primary/10">
            <h2 className="text-lg font-semibold">{t(locale, "weekPlan")}</h2>
            <p className="mt-1 text-sm text-foreground/60">{t(locale, "weekPlanHint")}</p>
            <form action={slotAction} className="mt-4 grid gap-3 sm:grid-cols-[8rem_7rem_1fr_auto]">
              <select name="weekday" defaultValue={String(weekday)} className="h-11 rounded-2xl border border-primary/15 px-3 text-sm">
                {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                  <option key={day} value={day}>
                    {weekdayName(locale, day)}
                  </option>
                ))}
              </select>
              <input name="startTime" type="time" required defaultValue="17:00" className="h-11 rounded-2xl border border-primary/15 px-3 text-sm" />
              <input name="topic" required minLength={2} placeholder={t(locale, "slotTopic")} className="h-11 rounded-2xl border border-primary/15 px-3 text-sm" />
              <button type="submit" disabled={slotPending} className="h-11 rounded-full bg-primary px-4 text-sm font-semibold text-white">
                {t(locale, "addSlot")}
              </button>
            </form>
            {slotState.error ? <p className="mt-2 text-sm text-red-700">{slotState.error}</p> : null}
            {weekPlan.length === 0 ? (
              <p className="mt-3 text-sm text-foreground/55">{t(locale, "noWeekPlan")}</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {weekPlan.map((slot) => (
                  <li key={slot.id} className="flex items-center justify-between gap-2 rounded-2xl bg-primary/5 px-3 py-2 text-sm">
                    <span>
                      <strong>{weekdayName(locale, slot.weekday)}</strong>
                      <span className="mx-2 text-foreground/55">{slot.startTime}</span>
                      {slot.topic}
                    </span>
                    <form action={slotDeleteAction}>
                      <input type="hidden" name="slotId" value={slot.id} />
                      <button type="submit" disabled={slotDeletePending} className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                        {t(locale, "removeSlot")}
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-3xl bg-white p-5 ring-1 ring-primary/10 lg:col-span-2">
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

          <section className="rounded-3xl bg-white p-5 ring-1 ring-primary/10 lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold">{t(locale, "sessionReport")}</h2>
                <p className="mt-1 text-sm text-foreground/60">{t(locale, "sessionHint")}</p>
              </div>
              <button
                type="button"
                onClick={printMonth}
                className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white"
              >
                {t(locale, "printMonth")}
              </button>
            </div>
            {latest ? (
              <div className="mt-4 space-y-3">
                <p className="text-sm font-semibold">
                  {latest.date}
                  {latest.chapterId ? ` · ${t(locale, "chapterExam")} ${latest.chapterId}` : ""}
                </p>
                <div className="grid gap-2 sm:grid-cols-4">
                  <p className="rounded-2xl bg-emerald-50 px-3 py-2 text-sm">
                    {t(locale, "presentCount")}: <strong>{latest.presentCount}</strong>
                  </p>
                  <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm">
                    {t(locale, "absentCount")}: <strong>{latest.absentCount}</strong>
                  </p>
                  <p className="rounded-2xl bg-primary/5 px-3 py-2 text-sm">
                    {t(locale, "examCount")}: <strong>{latest.examCount}</strong>
                  </p>
                  <p className="rounded-2xl bg-primary/5 px-3 py-2 text-sm">
                    {t(locale, "classAverage")}: <strong>{latest.averagePercent ?? "—"}%</strong>
                  </p>
                </div>
                <ul className="space-y-2">
                  {latest.students.map((row) => (
                    <li key={row.studentId} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-primary/5 px-3 py-2 text-sm">
                      <span>
                        <strong>{row.name}</strong>
                        <span className="mx-2 text-foreground/55">
                          {row.present === true
                            ? t(locale, "present")
                            : row.present === false
                              ? t(locale, "absent")
                              : t(locale, "unmarkedCount")}
                        </span>
                        {row.examScore ? `${row.examScore} (${row.examPercent}%)` : "—"}
                      </span>
                      {row.present === false ? (
                        <a
                          href={whatsappHref(row.phone, absenteeWhatsappText(row.name, latest.date, locale))}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white"
                        >
                          {t(locale, "whatsappAbsent")}
                        </a>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-3 text-sm text-foreground/55">{t(locale, "noSession")}</p>
            )}
            <h3 className="mt-6 text-sm font-semibold">{t(locale, "sessionArchive")}</h3>
            {monthSessions.length === 0 ? (
              <p className="mt-2 text-sm text-foreground/55">{t(locale, "noSession")}</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {monthSessions.map((session) => (
                  <li key={session.id} className="rounded-2xl bg-primary/5 px-3 py-2 text-sm">
                    <strong>{session.date}</strong>
                    {session.chapterId ? ` · ${t(locale, "chapterExam")} ${session.chapterId}` : ""}
                    <span className="mx-2 text-foreground/55">
                      {t(locale, "presentCount")} {session.presentCount} · {t(locale, "absentCount")} {session.absentCount} · {t(locale, "classAverage")} {session.averagePercent ?? "—"}%
                    </span>
                  </li>
                ))}
              </ul>
            )}
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
                <LoaderCircle
                  className={`size-4 shrink-0 animate-spin ${issuePending ? "" : "invisible"}`}
                  aria-hidden="true"
                />
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
            <p className="mt-2 text-xs text-foreground/55">
              {t(locale, "monthFees")} · {cairoMonthLabel(month, locale)} · {t(locale, "monthFeesHint")}
            </p>
            {unpaid.length > 0 ? (
              <p className="mt-3 rounded-2xl bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">
                {t(locale, "monthFeesAlert")}: {unpaid.map((row) => row.name).join(" · ")}
              </p>
            ) : null}
            {declined.length > 0 ? (
              <p className="mt-3 rounded-2xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-800">
                {t(locale, "declinedAlert")}: {declined.map((row) => row.name).join(" · ")}
              </p>
            ) : null}
            {roster.length === 0 ? (
              <p className="mt-3 text-sm text-foreground/55">{t(locale, "noCodes")}</p>
            ) : (
              <div className="mt-3 overflow-x-auto rounded-2xl bg-white ring-1 ring-primary/10">
                <table className="w-full min-w-[64rem] text-sm">
                  <thead className="bg-primary/5 text-start">
                    <tr>
                      <th className="px-3 py-2 font-semibold">{t(locale, "student")}</th>
                      <th className="px-3 py-2 font-semibold">{t(locale, "weekStars")}</th>
                      <th className="px-3 py-2 font-semibold">{t(locale, "standing")}</th>
                      <th className="px-3 py-2 font-semibold">{t(locale, "lastPercent")}</th>
                      <th className="px-3 py-2 font-semibold">{t(locale, "attendance")}</th>
                      <th className="px-3 py-2 font-semibold">{t(locale, "monthFees")}</th>
                      <th className="px-3 py-2 font-semibold">{t(locale, "suspend")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankedRoster.map((row) => (
                      <tr
                        key={row.id}
                        className={`border-t border-primary/8 ${
                          !row.monthPaid ? "bg-amber-50" : row.declined ? "bg-red-50" : ""
                        }`}
                      >
                        <td className="px-3 py-2">
                          <p className="font-medium">{row.name}</p>
                          <p className="font-mono text-xs text-foreground/55">{row.phone}</p>
                          <a
                            href={whatsappHref(row.phone, parentWeeklyWhatsappText(row, locale))}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-flex rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white"
                          >
                            {t(locale, "parentReport")}
                          </a>
                          {telegramLinks.some((link) => link.studentId === row.id) ? (
                            <form action={telegramOneAction} className="mt-1">
                              <input type="hidden" name="studentId" value={row.id} />
                              <button
                                type="submit"
                                disabled={telegramOnePending}
                                className="inline-flex rounded-full bg-sky-600 px-2 py-0.5 text-xs font-semibold text-white disabled:opacity-50"
                              >
                                {t(locale, "telegramReport")}
                              </button>
                            </form>
                          ) : (
                            <p className="mt-1 text-xs text-foreground/45">{t(locale, "telegramNotLinked")}</p>
                          )}
                          <div className="mt-2 space-y-1">
                            {devices.filter((device) => device.studentId === row.id).length === 0 ? (
                              <p className="text-xs text-foreground/45">{t(locale, "deviceNone")}</p>
                            ) : (
                              devices
                                .filter((device) => device.studentId === row.id)
                                .map((device) => (
                                  <form key={device.id} action={deviceForgetAction} className="flex flex-wrap items-center gap-1">
                                    <input type="hidden" name="deviceId" value={device.id} />
                                    <span className="inline-flex items-center gap-1 text-xs text-foreground/70">
                                      <Smartphone className="size-3" />
                                      {device.label}
                                    </span>
                                    <button
                                      type="submit"
                                      disabled={deviceForgetPending}
                                      className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary disabled:opacity-50"
                                    >
                                      {t(locale, "deviceForget")}
                                    </button>
                                  </form>
                                ))
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <p className="tracking-wide text-accent">{starLabel(row.week.stars)}</p>
                          <p className="text-xs text-foreground/55">{row.week.score}</p>
                        </td>
                        <td className="px-3 py-2">
                          {row.standing === "done" ? t(locale, "finishedAll") : `${t(locale, "chapterExam")} ${row.standing}`}
                        </td>
                        <td className="px-3 py-2">
                          {row.lastPercent === null ? "—" : `${row.lastPercent}%`}
                          {row.declined && row.previousPercent !== null ? (
                            <span className="ms-2 rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
                              {t(locale, "declinedBadge")} {row.previousPercent}→{row.lastPercent}
                            </span>
                          ) : null}
                        </td>
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
                          <div className="flex flex-wrap items-center gap-1">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                row.monthPaid ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"
                              }`}
                            >
                              {row.monthPaid ? t(locale, "monthPaid") : t(locale, "monthDue")}
                            </span>
                            <form
                              action={async (formData) => {
                                await markStudentFee({ error: null }, formData);
                                router.refresh();
                              }}
                            >
                              <input type="hidden" name="studentId" value={row.id} />
                              <input type="hidden" name="paid" value="1" />
                              <button type="submit" className="rounded-full bg-emerald-600 px-2 py-1 text-xs text-white">
                                {t(locale, "monthPaid")}
                              </button>
                            </form>
                            <form
                              action={async (formData) => {
                                await markStudentFee({ error: null }, formData);
                                router.refresh();
                              }}
                            >
                              <input type="hidden" name="studentId" value={row.id} />
                              <input type="hidden" name="paid" value="0" />
                              <button type="submit" className="rounded-full bg-amber-600 px-2 py-1 text-xs text-white">
                                {t(locale, "monthDue")}
                              </button>
                            </form>
                            {!row.monthPaid && !row.suspended ? (
                              <form
                                action={async (formData) => {
                                  await toggleStudentSuspend({ error: null }, formData);
                                  router.refresh();
                                }}
                              >
                                <input type="hidden" name="studentId" value={row.id} />
                                <input type="hidden" name="suspended" value="1" />
                                <input type="hidden" name="reason" value="اشتراك" />
                                <button type="submit" className="rounded-full bg-primary px-2 py-1 text-xs font-semibold text-white">
                                  {t(locale, "suspend")}
                                </button>
                              </form>
                            ) : null}
                            {!row.monthPaid ? (
                              <a
                                href={whatsappHref(row.phone, feesWhatsappText(row, locale))}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full bg-emerald-700 px-2 py-1 text-xs font-semibold text-white"
                              >
                                {t(locale, "feesWhatsapp")}
                              </a>
                            ) : null}
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

      {tab === "certificates" ? (
        <section className="mt-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold">{t(locale, "tabCertificates")}</h2>
            <p className="mt-1 text-sm text-foreground/60">
              {certificates.length === 0 ? t(locale, "certificatePreview") : t(locale, "certificateLead")}
            </p>
          </div>
          {shownCertificates.map((row) => (
            <CertificateCard
              key={row.serial}
              locale={locale}
              certificate={row}
              preview={certificates.length === 0}
            />
          ))}
          {certificates.length === 0 ? (
            <p className="text-sm text-foreground/55">{t(locale, "certificateNone")}</p>
          ) : null}
          <CertificatePrintButton
            locale={locale}
            certificates={shownCertificates}
            preview={certificates.length === 0}
            label={t(locale, "printCertificate")}
          />
        </section>
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
                    {exam.essays.map((item) => {
                      const grade = essayGrades.find(
                        (row) => row.examId === exam.id && row.questionId === item.id,
                      );
                      const selected = grade ? markForGrade(grade.score, grade.note) : null;
                      return (
                        <li key={item.id} className="rounded-xl bg-primary/4 p-3">
                          <p className="font-medium">{item.prompt}</p>
                          <p className="mt-1 whitespace-pre-wrap text-foreground/75">{item.answer || "—"}</p>
                          {grade ? (
                            <p className="mt-2 text-xs font-semibold text-primary">
                              {t(locale, "essayMarked")} · {grade.score}/8
                              {grade.note ? ` · ${grade.note}` : ""}
                            </p>
                          ) : null}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {ESSAY_MARKS.map((mark) => (
                              <form key={mark.id} action={gradeEssayForm}>
                                <input type="hidden" name="examId" value={exam.id} />
                                <input type="hidden" name="studentId" value={exam.studentId} />
                                <input type="hidden" name="questionId" value={item.id} />
                                <input type="hidden" name="score" value={mark.score} />
                                <input
                                  type="hidden"
                                  name="note"
                                  value={locale === "ar" ? mark.noteAr : mark.noteEn}
                                />
                                <button
                                  type="submit"
                                  className={`h-10 rounded-full px-4 text-xs font-semibold ${
                                    selected === mark.id
                                      ? "bg-primary text-white"
                                      : "bg-white text-primary ring-1 ring-primary/20"
                                  }`}
                                >
                                  {t(locale, mark.labelKey)}
                                </button>
                              </form>
                            ))}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : null}

      {tab === "profit" ? (
        <section className="mt-6 space-y-4">
          <div className="rounded-3xl bg-primary-dark p-5 text-white">
            <p className="text-xs text-white/60">{cairoMonthLabel(month, locale)}</p>
            <p className="mt-1 font-serif text-3xl tabular-nums" dir="ltr">
              {thisMonth?.revenue ?? 0} {t(locale, "currency")}
            </p>
            <p className="mt-2 text-sm text-white/75">
              {t(locale, "collected")} · {thisMonth?.paid ?? 0} {t(locale, "paidCount")}
              {" · "}
              {t(locale, "outstanding")}{" "}
              <span className="tabular-nums" dir="ltr">
                {thisMonth?.outstanding ?? 0}
              </span>{" "}
              {t(locale, "currency")}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-5 ring-1 ring-primary/10">
            <h2 className="text-lg font-semibold">{t(locale, "monthlyFee")}</h2>
            <p className="mt-1 text-sm text-foreground/60">{t(locale, "profitHint")}</p>
            <form action={feeAction} className="mt-4 flex flex-wrap items-end gap-2">
              <label className="grid gap-1 text-sm font-medium">
                {t(locale, "monthlyFee")}
                <input
                  name="monthlyFee"
                  type="number"
                  min={0}
                  step={1}
                  key={monthlyFee}
                  defaultValue={monthlyFee}
                  className="h-11 w-32 rounded-2xl border border-primary/15 px-3 text-sm tabular-nums"
                />
              </label>
              <button
                type="submit"
                disabled={feePending}
                className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white disabled:opacity-70"
              >
                <LoaderCircle
                  className={`size-4 shrink-0 animate-spin ${feePending ? "" : "invisible"}`}
                  aria-hidden="true"
                />
                {t(locale, "saveFee")}
              </button>
            </form>
          </div>

          <div className="overflow-x-auto rounded-3xl bg-white ring-1 ring-primary/10">
            <table className="min-w-full text-sm">
              <thead className="bg-primary/5 text-start">
                <tr>
                  <th className="px-3 py-2 font-semibold">{t(locale, "monthProfit")}</th>
                  <th className="px-3 py-2 font-semibold">{t(locale, "paidCount")}</th>
                  <th className="px-3 py-2 font-semibold">{t(locale, "dueCount")}</th>
                  <th className="px-3 py-2 font-semibold">{t(locale, "collected")}</th>
                  <th className="px-3 py-2 font-semibold">{t(locale, "outstanding")}</th>
                </tr>
              </thead>
              <tbody>
                {profits.map((row) => (
                  <tr key={row.month} className="border-t border-primary/8">
                    <td className="px-3 py-2 font-medium">{cairoMonthLabel(row.month, locale)}</td>
                    <td className="px-3 py-2 tabular-nums" dir="ltr">
                      {row.paid}/{row.students}
                    </td>
                    <td className="px-3 py-2 tabular-nums" dir="ltr">
                      {row.due}
                    </td>
                    <td className="px-3 py-2 font-semibold tabular-nums" dir="ltr">
                      {row.revenue} {t(locale, "currency")}
                    </td>
                    <td className="px-3 py-2 tabular-nums" dir="ltr">
                      {row.outstanding} {t(locale, "currency")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  );
}
