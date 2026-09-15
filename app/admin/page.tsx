import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { HeaderTools } from "@/components/header-tools";
import { AdminShell } from "./admin-shell";
import { getAnnouncement, getExamWindow, getMonthlyFee, getSurprise, getWeekPlan, listAllEssayGrades, listAttendance, listClassSessions, listExams, listHomeworkResults, listPayments, listSurpriseAnswers } from "@/lib/access-store";
import { buildClassRoster } from "@/lib/class-roster";
import { listVisibleCodes } from "@/lib/teacher-roster";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { getTheme } from "@/lib/theme";
import { LogoutButton } from "@/app/dashboard/logout-button";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const locale = await getLocale();
  const theme = await getTheme();
  const [codes, exams, homework, attendance, payments, announcement, examWindow, weekPlan, sessions, essayGrades, monthlyFee, surprise] = await Promise.all([
    listVisibleCodes(),
    listExams(),
    listHomeworkResults(),
    listAttendance(),
    listPayments(),
    getAnnouncement(),
    getExamWindow(),
    getWeekPlan(),
    listClassSessions(),
    listAllEssayGrades(),
    getMonthlyFee(),
    getSurprise(),
  ]);
  const surpriseAnswers = surprise ? await listSurpriseAnswers(surprise.id) : [];
  const roster = buildClassRoster(codes, exams, homework, attendance, payments);

  return (
    <div className="min-h-full bg-background text-foreground">
      <header className="border-b-2 border-accent bg-nav text-nav-fg shadow-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <BrandMark locale={locale} href="/admin" />
          <div className="flex items-center gap-2">
            <HeaderTools locale={locale} theme={theme} />
            <Link href="/admin/chat" className="text-xs font-semibold text-primary">
              {t(locale, "chatTeacherInbox")}
            </Link>
            <Link href="/" className="text-xs font-semibold text-primary">
              {t(locale, "back")}
            </Link>
            <LogoutButton
              label={t(locale, "logout")}
              className="inline-flex items-center gap-1 rounded-full border-2 border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary"
            />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="font-serif text-3xl">{t(locale, "adminTitle")}</h1>
        <p className="mt-2 text-sm text-foreground/65">{t(locale, "adminLead")}</p>
        <AdminShell
          locale={locale}
          codes={codes}
          exams={exams}
          roster={roster}
          announcement={announcement?.body ?? ""}
          examWindow={examWindow}
          weekPlan={weekPlan}
          sessions={sessions}
          essayGrades={essayGrades}
          payments={payments}
          monthlyFee={monthlyFee}
          surprise={surprise}
          surpriseAnswers={surpriseAnswers}
        />
      </main>
    </div>
  );
}
