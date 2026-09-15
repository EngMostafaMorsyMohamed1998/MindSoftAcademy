import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { listStudentMakeups } from "@/lib/access-store";
import { getCurrentUser } from "@/lib/current-user";
import { getLesson } from "@/lib/curriculum";
import { t } from "@/lib/i18n";
import { notesForLesson } from "@/lib/lessons";
import { getLocale } from "@/lib/locale";
import { MAKEUP_SIZE, openMakeups } from "@/lib/makeup";
import { HomeworkPlayer } from "@/app/dashboard/homework/[id]/homework-player";

export default async function MakeupPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/activate");
  const { date } = await params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound();
  const locale = await getLocale();
  const task = openMakeups(await listStudentMakeups(user.id), user.id).find((item) => item.date === date);
  if (!task) redirect("/dashboard");
  const lesson = getLesson(task.lessonId);
  const note = notesForLesson(task.lessonId);
  const lessonHint = note ? (locale === "ar" ? note.takeawayAr : note.takeawayEn) : "";
  const dueLabel = new Date(`${task.dueDate}T12:00:00`).toLocaleDateString(
    locale === "ar" ? "ar-EG" : "en-GB",
    { day: "numeric", month: "long" },
  );

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Link href="/dashboard" className="text-sm font-medium text-primary">
        {t(locale, "back")}
      </Link>
      <h1 className="mt-3 font-serif text-3xl">{t(locale, "makeupTitle")}</h1>
      <p className="mt-1 text-sm text-foreground/65">{t(locale, "makeupLead")}</p>
      <p className="mt-3 text-sm font-semibold">
        {lesson
          ? `${lesson.id} · ${locale === "ar" ? lesson.titleAr : lesson.titleEn}`
          : task.lessonId}
      </p>
      {lessonHint ? <p className="mt-2 text-sm text-foreground/70">{lessonHint}</p> : null}
      <p className="mt-2 text-sm text-primary">
        {t(locale, "makeupDue")}: {dueLabel} · {t(locale, "makeupQuestions")}
      </p>
      <HomeworkPlayer
        locale={locale}
        lessonId={task.lessonId}
        chapterId={task.chapterId}
        lessonHint={lessonHint}
        size={MAKEUP_SIZE}
        makeupDate={task.date}
        dueDate={dueLabel}
      />
    </div>
  );
}
