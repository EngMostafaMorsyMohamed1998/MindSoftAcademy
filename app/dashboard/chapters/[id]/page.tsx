import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { BookOpen, ClipboardCheck, Gamepad2, Network } from "lucide-react";
import { ChapterMindMap } from "@/components/chapter-mind-map";
import { chapterHomeworkDone, isChapterUnlocked } from "@/lib/chapter-progress";
import { studentProgress } from "@/lib/student-progress";
import { bookSlugFor, getChapter, isChapterId } from "@/lib/curriculum";
import { gamesForChapter } from "@/lib/games";
import { notesForChapter } from "@/lib/lessons";
import { mindMapForChapter } from "@/lib/mind-maps";
import { bookletSafe } from "@/lib/booklet-lang";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { BOOKS } from "@/lib/library";

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isChapterId(id)) notFound();
  const chapter = getChapter(id);
  if (!chapter) notFound();
  const { completed, unlocks, homework } = await studentProgress();
  if (!isChapterUnlocked(completed, id, unlocks)) {
    redirect("/dashboard/chapters");
  }
  const examReady = chapterHomeworkDone(id, homework);
  const locale = await getLocale();
  const notes = notesForChapter(id);
  const games = gamesForChapter(id);
  const mindMap = mindMapForChapter(id);
  const mapGame = games.find((game) => game.data.kind === "map");
  const playGames = games.filter((game) => game.data.kind !== "map");
  const book = BOOKS.find((item) => item.slug === bookSlugFor(chapter.part, locale));

  return (
    <div className="mx-auto w-full max-w-4xl">
      <Link href="/dashboard/chapters" className="text-sm font-medium text-primary">
        {t(locale, "back")}
      </Link>
      <p className="mt-4 text-xs font-semibold text-primary/60">
        {chapter.part === 1 ? t(locale, "part1") : t(locale, "part2")}
      </p>
      <h1 className="mt-1 font-serif text-3xl">
        {chapter.id}. {locale === "ar" ? chapter.titleAr : chapter.titleEn}
      </h1>
      <p className="mt-2 text-sm text-foreground/65">
        {locale === "ar" ? chapter.blurbAr : chapter.blurbEn}
      </p>

      {mindMap ? (
        <section className="mt-6">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="font-serif text-2xl">{t(locale, "mindMap")}</h2>
              <p className="mt-1 text-sm text-foreground/60">{t(locale, "mindMapHint")}</p>
            </div>
            {mapGame ? (
              <Link
                href={`/dashboard/games/${mapGame.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
              >
                <Network className="size-4" />
                {t(locale, "playMindMap")}
              </Link>
            ) : null}
          </div>
          <ChapterMindMap
            locale={locale}
            root={mindMap}
            color={chapter.color}
            accent={chapter.accent}
          />
        </section>
      ) : null}

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {examReady ? (
          <Link
            href={`/dashboard/exam/${chapter.id}`}
            className="rounded-2xl bg-primary p-4 text-sm font-semibold text-white"
          >
            <ClipboardCheck className="size-5" />
            <span className="mt-2 block">{t(locale, "chapterExam")}</span>
            <span className="text-xs font-normal text-white/70">{t(locale, "examSize")}</span>
          </Link>
        ) : (
          <div className="rounded-2xl bg-primary/40 p-4 text-sm font-semibold text-white">
            <ClipboardCheck className="size-5" />
            <span className="mt-2 block">{t(locale, "chapterExam")}</span>
            <span className="text-xs font-normal text-white/80">{t(locale, "homeworkLockedExam")}</span>
          </div>
        )}
        {playGames.map((game) => (
          <Link
            key={game.id}
            href={`/dashboard/games/${game.id}`}
            className="rounded-2xl bg-white p-4 text-sm font-semibold ring-1 ring-primary/10"
          >
            <Gamepad2 className="size-5 text-primary" />
            <span className="mt-2 block">{t(locale, "playGame")}</span>
            <span className="text-xs font-normal text-foreground/55">
              {locale === "ar" ? game.titleAr : game.titleEn}
            </span>
          </Link>
        ))}
        {book ? (
          <Link
            href={`/dashboard/courses/${book.slug}?page=${chapter.lessons[0]?.pdfPage ?? 5}`}
            className="rounded-2xl bg-white p-4 text-sm font-semibold ring-1 ring-primary/10"
          >
            <BookOpen className="size-5 text-primary" />
            <span className="mt-2 block">{t(locale, "openBook")}</span>
          </Link>
        ) : null}
      </div>

      <div className="mt-8 space-y-6">
        {notes.map((note) => {
          const lesson = chapter.lessons.find((item) => item.id === note.id);
          const body = locale === "ar" ? note.bodyAr : note.bodyEn;
          const terms = locale === "ar" ? note.termsAr : note.termsEn;
          return (
            <article key={note.id} className="rounded-3xl border border-primary/8 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">
                  {note.id} · {locale === "ar" ? lesson?.titleAr : lesson?.titleEn}
                </h2>
                {book && lesson ? (
                  <Link
                    href={`/dashboard/courses/${book.slug}?page=${lesson.pdfPage}`}
                    className="text-xs font-semibold text-primary"
                  >
                    {t(locale, "openBook")} p.{lesson.bookPage}
                  </Link>
                ) : null}
              </div>
              <ul className="mt-3 list-disc space-y-2 ps-5 text-sm leading-relaxed">
                {body.map((paragraph) => (
                  <li key={paragraph}>{bookletSafe(locale, paragraph)}</li>
                ))}
              </ul>
              <h3 className="mt-4 text-xs font-semibold tracking-wide text-primary/60 uppercase">
                {t(locale, "keyTerms")}
              </h3>
              <dl className="mt-2 grid gap-2 sm:grid-cols-2">
                {terms.map((term) => (
                  <div key={term.term} className="rounded-xl bg-primary/5 px-3 py-2">
                    <dt className="text-sm font-semibold">{bookletSafe(locale, term.term)}</dt>
                    <dd className="text-xs text-foreground/65">{bookletSafe(locale, term.meaning)}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 rounded-xl bg-accent/15 px-3 py-2 text-sm">
                <strong>{t(locale, "takeaway")}: </strong>
                {bookletSafe(locale, locale === "ar" ? note.takeawayAr : note.takeawayEn)}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/dashboard/cards/${note.id}`}
                  className="inline-flex rounded-full bg-accent px-4 py-2 text-xs font-semibold text-primary-dark"
                >
                  {t(locale, "flashcards")}
                </Link>
                <Link
                  href={`/dashboard/homework/${note.id}`}
                  className="inline-flex rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white"
                >
                  {homework.includes(note.id)
                    ? t(locale, "homeworkPassed")
                    : t(locale, "startHomework")}
                </Link>
                <Link
                  href={`/dashboard/analyze/${note.id}`}
                  className="inline-flex rounded-full border border-primary/20 px-4 py-2 text-xs font-semibold text-primary"
                >
                  {t(locale, "startAnalyze")}
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
