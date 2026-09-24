import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { HeaderTools } from "@/components/header-tools";
import { AdminShell } from "./admin-shell";
import { getAnnouncement, getDeviceLimit, getExamWindow, getMonthlyFee, getSurprise, getTeacherTelegramChatId, getWeekPlan, listAllEssayGrades, listAllMisses, listAttendance, listCertificates, listClassGroups, listClassSessions, listDevices, listExams, listHomeworkResults, listLessonExamples, listPayments, listSurpriseAnswers, listTelegramLinks } from "@/lib/access-store";
import { getStoredTelegramToken } from "@/lib/access-store";
import { cacheTelegramBotToken, fetchTelegramBotUsername, telegramBotHref } from "@/lib/telegram";
import { ensureTelegramReceiver } from "@/lib/telegram-inbox";
import { notifyUpcomingGroups } from "@/lib/telegram-notify";
import { buildMissBoard } from "@/lib/miss-board";
import { buildClassRoster } from "@/lib/class-roster";
import { cairoDate, cairoMonth, cairoWeekday } from "@/lib/class-clock";
import { listVisibleCodes } from "@/lib/teacher-roster";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { getTheme } from "@/lib/theme";
import { LogoutButton } from "@/app/dashboard/logout-button";
import { connection } from "next/server";
import { listSubscriptionRequests } from "@/lib/subscription-store";
import { checkSystemHealth } from "@/app/actions/system-health";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  await connection();
  const locale = await getLocale();
  const theme = await getTheme();
  const { tab } = await searchParams;
  const initialTab =
    tab === "certificates" || tab === "class" || tab === "groups" || tab === "codes" || tab === "roster" || tab === "grades" || tab === "profit" || tab === "tools"
      ? tab
      : "roster";
  const [codes, exams, homework, attendance, payments, announcement, examWindow, weekPlan, classGroups, misses, sessions, essayGrades, monthlyFee, surprise, certificates, telegramLinks, devices, deviceLimit, telegramUsername, teacherChatId, examples, subscriptionRequests, healthReport] = await Promise.all([
    listVisibleCodes(),
    listExams(),
    listHomeworkResults(),
    listAttendance(),
    listPayments(),
    getAnnouncement(),
    getExamWindow(),
    getWeekPlan(),
    listClassGroups(),
    listAllMisses(),
    listClassSessions(),
    listAllEssayGrades(),
    getMonthlyFee(),
    getSurprise(),
    listCertificates(),
    listTelegramLinks(),
    listDevices(),
    getDeviceLimit(),
    fetchTelegramBotUsername(),
    getTeacherTelegramChatId(),
    listLessonExamples(),
    listSubscriptionRequests(),
    checkSystemHealth(),
  ]);
  const surpriseAnswers = surprise ? await listSurpriseAnswers(surprise.id) : [];
  const roster = buildClassRoster(codes, exams, homework, attendance, payments);
  const storedTelegramToken = await getStoredTelegramToken();
  cacheTelegramBotToken(storedTelegramToken);
  if (storedTelegramToken) {
    await ensureTelegramReceiver();
    await notifyUpcomingGroups();
  }

  return (
    <div className="min-h-full bg-background text-foreground">
      <header className="border-b-2 border-accent bg-nav text-nav-fg shadow-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <BrandMark locale={locale} href="/admin" />
          <div className="flex items-center gap-2">
            <HeaderTools locale={locale} theme={theme} />
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
        <nav className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-primary">
          <Link href="/admin/booklet">{t(locale, "openBookletAdmin")}</Link>
          <Link href="/admin/chat">{t(locale, "chatTeacherInbox")}</Link>
          <Link href="/admin/community">{t(locale, "tabCommunity")}</Link>
        </nav>
        <AdminShell
          initialTab={initialTab}
          locale={locale}
          codes={codes}
          exams={exams}
          roster={roster}
          announcement={announcement?.body ?? ""}
          examWindow={examWindow}
          weekPlan={weekPlan}
          classGroups={classGroups}
          missBoard={buildMissBoard(misses, locale)}
          teacherTelegramLinked={Boolean(teacherChatId)}
          sessions={sessions}
          essayGrades={essayGrades}
          payments={payments}
          monthlyFee={monthlyFee}
          surprise={surprise}
          surpriseAnswers={surpriseAnswers}
          certificates={certificates}
          telegramLinks={telegramLinks}
          telegramConfigured={Boolean(storedTelegramToken)}
          telegramHref={telegramUsername ? `https://t.me/${telegramUsername}` : telegramBotHref()}
          devices={devices}
          deviceLimit={deviceLimit}
          today={cairoDate()}
          weekday={cairoWeekday()}
          month={cairoMonth()}
          homework={homework}
          examples={examples}
          subscriptionRequests={subscriptionRequests}
          healthReport={healthReport}
        />
      </main>
    </div>
  );
}
