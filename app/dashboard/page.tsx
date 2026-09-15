import Link from "next/link";
import { BookOpen, ClipboardCheck, Gamepad2, MessageCircle, Printer, RotateCcw, Trophy } from "lucide-react";
import { HeroRobot } from "@/components/hero-robot";
import { StudyProgress } from "@/components/study-progress";
import { allChaptersPassed } from "@/lib/chapter-progress";
import {
  getWeekPlan,
  listAttendance,
  listCodes,
  listExams,
  listHomeworkResults,
  listStudentMakeups,
} from "@/lib/access-store";
import { studentProgress } from "@/lib/student-progress";
import { CHAPTERS, getLesson } from "@/lib/curriculum";
import { getCurrentUser } from "@/lib/current-user";
import { t } from "@/lib/i18n";
import { buildClassRanks, rankForStudent } from "@/lib/leaderboard";
import { getLocale } from "@/lib/locale";
import { openMakeups } from "@/lib/makeup";
import { levelFromPoints } from "@/lib/student-profile";
import { buildWeekStars, starLabel } from "@/lib/week-stars";
import { QuestMap } from "./quest-map";
import { WeekBoard } from "./week-board";

export default async function DashboardHomePage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const locale = await getLocale();
  const [{ completed, unlocks }, weekPlan, makeups, attendance, exams, homework, codes] =
    await Promise.all([
      studentProgress(),
      getWeekPlan(),
      listStudentMakeups(user.id),
      listAttendance(),
      listExams(),
      listHomeworkResults(),
      listCodes(),
    ]);
  const firstName = user.name.trim().split(/\s+/)[0] || user.name;
  const { level } = levelFromPoints(user.points);
  const ranks = buildClassRanks(codes);
  const mine = rankForStudent(ranks, user.id);
  const open = openMakeups(makeups, user.id);
  const week = buildWeekStars({
    attendance: attendance.filter((row) => row.studentId === user.id),
    homework: homework.filter((row) => row.studentId === user.id),
    exams: exams.filter((row) => row.studentId === user.id),
  });

  const shortcuts = [
    { href: "/dashboard/leaderboard", label: t(locale, "navLeaderboard"), icon: Trophy },
    { href: "/dashboard/chapters", label: t(locale, "navChapters"), icon: BookOpen },
    { href: "/dashboard/exams", label: t(locale, "navExams"), icon: ClipboardCheck },
    { href: "/dashboard/games", label: t(locale, "navGames"), icon: Gamepad2 },
    { href: "/dashboard/booklet", label: t(locale, "navBooklet"), icon: Printer },
    { href: "/dashboard/chat-to-teacher", label: t(locale, "navChat"), icon: MessageCircle },
    { href: "/dashboard/review", label: t(locale, "reviewMistakes"), icon: RotateCcw },
  ];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <section className="relative overflow-hidden rounded-3xl bg-primary-dark p-6 text-white sm:p-8">
        <div className="relative z-10 max-w-xl pe-28 sm:pe-40">
          <p className="text-sm text-white/60">{t(locale, "welcome")}</p>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl">{firstName}</h1>
          <p className="mt-2 text-sm text-white/70">{t(locale, "dashboardHint")}</p>
          <p className="mt-4 text-sm">
            <span dir="ltr">
              {user.points} {t(locale, "points")} · L{level}
            </span>
            {mine ? (
              <>
                {" · "}
                {t(locale, "boardRank")}{" "}
                <span dir="ltr">
                  #{mine.rank} / {ranks.length}
                </span>
              </>
            ) : null}
          </p>
          <Link
            href="/dashboard/leaderboard"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-primary-dark"
          >
            <Trophy className="size-4" />
            {t(locale, "navLeaderboard")}
          </Link>
        </div>
        <div className="pointer-events-none absolute inset-y-0 end-0 flex w-36 items-end sm:w-44">
          <HeroRobot alt={t(locale, "robotAlt")} size="compact" />
        </div>
      </section>

      <section className="rounded-3xl border border-accent/40 bg-surface p-5 sm:p-6">
        <h2 className="font-serif text-2xl">{t(locale, "weekStars")}</h2>
        <p className="mt-1 text-sm text-foreground/60">{t(locale, "weekStarsHint")}</p>
        <p className="mt-3 text-3xl tracking-wide text-accent">{starLabel(week.stars)}</p>
        <p className="mt-2 text-sm text-foreground/70">
          {week.score} · {t(locale, "present")} {week.present} · {t(locale, "absent")} {week.absent} ·{" "}
          {t(locale, "homeworkShort")} {week.homework}
          {week.examPercent !== null ? ` · ${week.examPercent}%` : ""}
        </p>
      </section>

      {open.length > 0 ? (
        <section className="rounded-3xl border border-red-200 bg-red-50 p-5 sm:p-6">
          <h2 className="font-serif text-2xl text-red-900">{t(locale, "makeupTitle")}</h2>
          <p className="mt-1 text-sm text-red-800/80">{t(locale, "makeupLead")}</p>
          <ul className="mt-4 space-y-3">
            {open.map((task) => {
              const lesson = getLesson(task.lessonId);
              const dueLabel = new Date(`${task.dueDate}T12:00:00`).toLocaleDateString(
                locale === "ar" ? "ar-EG" : "en-GB",
                { day: "numeric", month: "long" },
              );
              return (
                <li key={`${task.studentId}-${task.date}`} className="rounded-2xl bg-white p-4 ring-1 ring-red-100">
                  <p className="font-semibold text-red-950">
                    {lesson
                      ? `${lesson.id} · ${locale === "ar" ? lesson.titleAr : lesson.titleEn}`
                      : task.lessonId}
                  </p>
                  <p className="mt-1 text-sm text-red-800/80">
                    {t(locale, "makeupQuestions")} · {t(locale, "makeupDue")}: {dueLabel}
                  </p>
                  <Link
                    href={`/dashboard/makeup/${task.date}`}
                    className="mt-3 inline-flex rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white"
                  >
                    {t(locale, "makeupStart")}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <WeekBoard locale={locale} slots={weekPlan} />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shortcuts.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-primary/10 bg-surface p-4 text-sm font-semibold shadow-sm"
            >
              <Icon className="size-5 text-primary" />
              <span className="mt-3 block">{item.label}</span>
            </Link>
          );
        })}
      </section>

      <section className="rounded-3xl border border-primary/10 bg-surface p-5 sm:p-6">
        <StudyProgress locale={locale} completed={completed} />
        <h2 className="mt-6 font-serif text-2xl">{t(locale, "samplePath")}</h2>
        <QuestMap locale={locale} chapters={CHAPTERS} completed={completed} unlocks={unlocks} />
        {allChaptersPassed(completed) ? (
          <Link
            href="/dashboard/certificate"
            className="mt-4 inline-flex rounded-full bg-accent px-4 py-2 text-sm font-semibold text-primary-dark"
          >
            {t(locale, "certificate")}
          </Link>
        ) : null}
      </section>
    </div>
  );
}
