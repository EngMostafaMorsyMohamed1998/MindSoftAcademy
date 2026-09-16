import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { HeaderTools } from "@/components/header-tools";
import { AdminShell } from "./admin-shell";
import { getAnnouncement, getDeviceLimit, getExamWindow, getMonthlyFee, getSurprise, getWeekPlan, listAllEssayGrades, listAttendance, listCertificates, listClassSessions, listDevices, listExams, listHomeworkResults, listPayments, listSurpriseAnswers, listTelegramLinks } from "@/lib/access-store";
import { fetchTelegramBotUsername, setTelegramWebhook, telegramBotHref, telegramConfigured } from "@/lib/telegram";
import { buildClassRoster, siteUrl } from "@/lib/class-roster";
import { cairoDate, cairoMonth, cairoWeekday } from "@/lib/class-clock";
import { listVisibleCodes } from "@/lib/teacher-roster";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { getTheme } from "@/lib/theme";
import { LogoutButton } from "@/app/dashboard/logout-button";
import { connection } from "next/server";

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
    tab === "certificates" || tab === "class" || tab === "codes" || tab === "roster" || tab === "grades" || tab === "profit"
      ? tab
      : "class";
  const [codes, exams, homework, attendance, payments, announcement, examWindow, weekPlan, sessions, essayGrades, monthlyFee, surprise, certificates, telegramLinks, devices, deviceLimit, telegramUsername] = await Promise.all([
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
    listCertificates(),
    listTelegramLinks(),
    listDevices(),
    getDeviceLimit(),
    fetchTelegramBotUsername(),
  ]);
  const surpriseAnswers = surprise ? await listSurpriseAnswers(surprise.id) : [];
  const roster = buildClassRoster(codes, exams, homework, attendance, payments);
  if (telegramConfigured()) {
    await setTelegramWebhook(`${siteUrl()}/api/telegram/webhook`);
  }

  return (
    <div className="min-h-full bg-background text-foreground">
      <header className="border-b-2 border-accent bg-nav text-nav-fg shadow-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <BrandMark locale={locale} href="/admin" />
          <div className="flex items-center gap-2">
            <HeaderTools locale={locale} theme={theme} />
            <Link href="/admin?tab=certificates" className="text-xs font-semibold text-primary">
              {t(locale, "tabCertificates")}
            </Link>
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
          initialTab={initialTab}
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
          certificates={certificates}
          telegramLinks={telegramLinks}
          telegramConfigured={telegramConfigured()}
          telegramHref={telegramUsername ? `https://t.me/${telegramUsername}` : telegramBotHref()}
          devices={devices}
          deviceLimit={deviceLimit}
          today={cairoDate()}
          weekday={cairoWeekday()}
          month={cairoMonth()}
        />
      </main>
    </div>
  );
}
