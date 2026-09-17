import { ChapterMindMap } from "@/components/chapter-mind-map";
import { BookletFigure, CHAPTER_FIGURES, SceneCard } from "@/components/booklet-figures";
import type { Chapter } from "@/lib/curriculum";
import {
  bookletChapterPack,
  bookletFaizHomework,
  bookletFaizPacks,
  bookletHomeworkForPart,
  bookletParts,
  type BookletEssay,
  type BookletHomeworkPack,
  type BookletMcq,
} from "@/lib/booklet-pack";
import { LESSON_NOTES, type LessonNote } from "@/lib/lessons";
import type { Locale } from "@/lib/locale";
import { mindMapForChapter, mindMapForFaiz } from "@/lib/mind-maps";

function WriteLines({ count = 4 }: { count?: number }) {
  return (
    <div className="mt-3 space-y-4 text-foreground/20">
      {Array.from({ length: count }, (_, index) => (
        <p key={index}>________________________________________________________________</p>
      ))}
    </div>
  );
}

function McqBlock({
  locale,
  rows,
  start = 1,
}: {
  locale: Locale;
  rows: BookletMcq[];
  start?: number;
}) {
  const ar = locale === "ar";
  return (
    <ol className="mt-3 space-y-4" start={start}>
      {rows.map((row, index) => (
        <li key={row.id} className="text-sm leading-relaxed">
          <p className="font-medium">
            {start + index}) {ar ? row.promptAr : row.promptEn}
          </p>
          <ul className="mt-2 grid gap-1 sm:grid-cols-2">
            {row.optionsAr.map((option, optionIndex) => (
              <li key={`${row.id}-${optionIndex}`} className="rounded-xl bg-primary/5 px-2 py-1 text-xs">
                <span className="font-semibold">{["أ", "ب", "ج", "د"][optionIndex] ?? optionIndex + 1})</span>{" "}
                {ar ? option : row.optionsEn[optionIndex]}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

function EssayBlock({ locale, rows }: { locale: Locale; rows: BookletEssay[] }) {
  const ar = locale === "ar";
  return (
    <div className="mt-4 space-y-5">
      {rows.map((row, index) => (
        <article key={row.id} className="rounded-2xl border border-dashed border-primary/25 p-3">
          <p className="text-sm font-semibold">
            {ar ? "سؤال مقالي" : "Essay"} {index + 1}
          </p>
          <p className="mt-2 text-sm leading-relaxed">{ar ? row.promptAr : row.promptEn}</p>
          <WriteLines count={5} />
        </article>
      ))}
    </div>
  );
}

function HomeworkSection({
  locale,
  pack,
}: {
  locale: Locale;
  pack: BookletHomeworkPack;
}) {
  const ar = locale === "ar";
  return (
    <section className="print-break mt-8 rounded-3xl bg-accent/15 p-5 ring-1 ring-accent">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary/70">
        {ar ? "واجب نهاية الجزء" : "End-of-part homework"}
      </p>
      <h3 className="mt-1 font-serif text-2xl">{ar ? pack.titleAr : pack.titleEn}</h3>
      <p className="mt-2 text-sm text-foreground/65">
        {ar
          ? "حل الاختيار من متعدد، وبعدين المقال. سلّم الورقة في الحصة."
          : "Solve the multiple choice, then the essays. Hand the paper in class."}
      </p>
      <McqBlock locale={locale} rows={pack.mcq} />
      <EssayBlock locale={locale} rows={pack.essays} />
    </section>
  );
}

function ChapterSection({
  locale,
  chapter,
  notes,
}: {
  locale: Locale;
  chapter: Chapter;
  notes: LessonNote[];
}) {
  const ar = locale === "ar";
  const pack = bookletChapterPack(chapter);
  const map = mindMapForChapter(chapter.id);
  const figures = CHAPTER_FIGURES[chapter.id] ?? [];
  const chapterNotes = notes.filter((note) => note.chapterId === chapter.id);

  return (
    <section className="print-break border-t border-primary/10 pt-6">
      <p className="text-xs font-semibold text-primary/60">
        {chapter.part === 1 ? (ar ? "الجزء الأول" : "Part 1") : ar ? "الجزء الثاني" : "Part 2"}
      </p>
      <h3 className="text-xl font-semibold">
        {chapter.id}. {ar ? chapter.titleAr : chapter.titleEn}
      </h3>
      <p className="mt-1 text-sm text-foreground/65">{ar ? chapter.blurbAr : chapter.blurbEn}</p>

      {map ? (
        <div className="mt-5">
          <h4 className="mb-2 text-sm font-semibold">{ar ? "الخريطة الذهنية" : "Mind map"}</h4>
          <ChapterMindMap locale={locale} root={map} color={chapter.color} accent={chapter.accent} />
        </div>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {figures.map((id) => (
          <BookletFigure key={id} id={id} locale={locale} color={chapter.color} />
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {pack.scenes.map((scene) => (
          <SceneCard
            key={scene.id}
            locale={locale}
            color={chapter.color}
            term={ar ? scene.termAr : scene.termEn}
            scene={ar ? scene.sceneAr : scene.sceneEn}
          />
        ))}
      </div>

      {chapterNotes.map((note) => {
        const lesson = chapter.lessons.find((item) => item.id === note.id);
        const body = ar ? note.bodyAr : note.bodyEn;
        const terms = ar ? note.termsAr : note.termsEn;
        return (
          <article key={note.id} className="mt-5">
            <h4 className="font-semibold">
              {note.id} {ar ? lesson?.titleAr : lesson?.titleEn}
            </h4>
            <ul className="mt-2 list-disc space-y-1 ps-5 text-sm">
              {body.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-primary/60">
              {ar ? "مصطلحات" : "Key terms"}
            </p>
            <ul className="mt-1 text-sm">
              {terms.map((term) => (
                <li key={term.term}>
                  <strong>{term.term}:</strong> {term.meaning}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-sm">
              <strong>{ar ? "الخلاصة:" : "Takeaway:"}</strong> {ar ? note.takeawayAr : note.takeawayEn}
            </p>
          </article>
        );
      })}

      <div className="mt-6">
        <h4 className="text-lg font-semibold">{ar ? "تدريبات الفصل" : "Chapter practice"}</h4>
        <p className="mt-1 text-xs text-foreground/55">
          {ar ? `${pack.practice.length} سؤال اختيار من متعدد. الإجابات في آخر الملزمة.` : `${pack.practice.length} multiple-choice questions. Answers are at the back.`}
        </p>
        <McqBlock locale={locale} rows={pack.practice} />
        <h4 className="mt-6 text-lg font-semibold">{ar ? "حلّل واكتب" : "Analyse and write"}</h4>
        <EssayBlock locale={locale} rows={pack.essays} />
      </div>
    </section>
  );
}

export function BookletDoc({
  locale,
  notes,
  teacher,
  brand,
}: {
  locale: Locale;
  notes: LessonNote[];
  teacher: string;
  brand: string;
}) {
  const ar = locale === "ar";
  const parts = bookletParts();
  const faizPacks = bookletFaizPacks();
  const faizHomework = bookletFaizHomework();
  const partHomeworks = [bookletHomeworkForPart(1), bookletHomeworkForPart(2)];
  const answerBlocks = [
    ...parts.flatMap(({ chapters }) =>
      chapters.map((chapter) => ({
        title: ar ? `الفصل ${chapter.id}` : `Chapter ${chapter.id}`,
        answers: bookletChapterPack(chapter).answers,
      })),
    ),
    ...partHomeworks.map((pack) => ({ title: ar ? pack.titleAr : pack.titleEn, answers: pack.answers })),
    ...faizPacks.map((pack) => ({
      title: ar ? pack.note.titleAr : pack.note.titleEn,
      answers: pack.answers,
    })),
    { title: ar ? faizHomework.titleAr : faizHomework.titleEn, answers: faizHomework.answers },
  ];

  return (
    <div className="print-sheet space-y-8 rounded-3xl bg-white p-6 ring-1 ring-primary/10 sm:p-8">
      <header className="print-break border-b border-primary/15 pb-4">
        <p className="text-xs font-semibold tracking-wide text-primary/60">{brand}</p>
        <h2 className="mt-1 font-serif text-3xl">
          {ar ? "الملزمة الكبرى — أسئلة وصور وخرائط" : "The large booklet — questions, figures, maps"}
        </h2>
        <p className="mt-1 text-sm text-foreground/65">{teacher} · 2026–2027 · 2Bac</p>
        <p className="mt-3 text-sm">
          {ar
            ? "الاسم: ________________    الرقم: ________________    المجموعة: ______"
            : "Name: ________________    Phone: ________________    Group: ______"}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-foreground/70">
          {ar
            ? "كل فصل: خريطة ذهنية، رسوم، صور مواقف، ملخص، ثم أسئلة. آخر كل جزء واجب كامل. آخر الملزمة مفتاح الإجابة."
            : "Each chapter has a mind map, figures, scene pictures, a summary, then questions. Each part ends with full homework. The answer key is at the back."}
        </p>
        <ol className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          {parts.flatMap(({ chapters }) =>
            chapters.map((chapter) => (
              <li key={chapter.id} className="rounded-2xl px-3 py-2 text-white" style={{ background: chapter.color }}>
                {chapter.id}. {ar ? chapter.titleAr : chapter.titleEn}
              </li>
            )),
          )}
          <li className="rounded-2xl bg-primary px-3 py-2 text-white">
            {ar ? "كتاب الفائز + واجبه" : "Al-Faiz + its homework"}
          </li>
        </ol>
      </header>

      {parts.map(({ part, chapters }) => (
        <div key={part}>
          {chapters.map((chapter) => (
            <ChapterSection key={chapter.id} locale={locale} chapter={chapter} notes={notes} />
          ))}
          <HomeworkSection locale={locale} pack={partHomeworks[part - 1]!} />
        </div>
      ))}

      <section className="print-break border-t border-primary/10 pt-6">
        <h3 className="font-serif text-2xl">{ar ? "كتاب الفائز — مكتوب" : "Al-Faiz — written"}</h3>
        {faizPacks.map((pack) => {
          const map = mindMapForFaiz(pack.note.id);
          const figures = CHAPTER_FIGURES[pack.note.id] ?? [];
          const color = pack.note.id === "f2" ? "#7f1d1d" : pack.note.id === "f3" ? "#134e4a" : pack.note.id === "f4" ? "#4a1942" : "#0c2d6b";
          const accent = pack.note.id === "f2" ? "#f59e0b" : pack.note.id === "f3" ? "#2dd4bf" : pack.note.id === "f4" ? "#e879f9" : "#c4a35a";
          return (
            <article key={pack.note.id} className="mt-6">
              <h4 className="text-xl font-semibold">{ar ? pack.note.titleAr : pack.note.titleEn}</h4>
              {map ? (
                <div className="mt-4">
                  <ChapterMindMap locale={locale} root={map} color={color} accent={accent} />
                </div>
              ) : null}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {figures.map((id) => (
                  <BookletFigure key={`${pack.note.id}-${id}`} id={id} locale={locale} color={color} />
                ))}
              </div>
              <div className="mt-4 space-y-4">
                {pack.note.sections.map((section) => (
                  <div key={section.headingAr} className="rounded-2xl bg-primary/5 p-3">
                    <p className="text-sm font-semibold">{ar ? section.headingAr : section.headingEn}</p>
                    {(ar ? section.bodyAr : section.bodyEn).map((line) => (
                      <p key={line} className="mt-2 text-sm leading-relaxed text-foreground/75">
                        {line}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
              <h5 className="mt-5 text-lg font-semibold">{ar ? "أسئلة الوحدة" : "Unit questions"}</h5>
              <McqBlock locale={locale} rows={pack.practice} />
            </article>
          );
        })}
        <HomeworkSection locale={locale} pack={faizHomework} />
      </section>

      <section className="print-break border-t border-primary/10 pt-6">
        <h3 className="font-serif text-2xl">{ar ? "مفتاح الإجابة" : "Answer key"}</h3>
        <p className="mt-1 text-sm text-foreground/60">
          {ar ? "راجع بعد ما تحل، مش قبل." : "Check after you finish, not before."}
        </p>
        <div className="mt-4 space-y-4">
          {answerBlocks.map((block) => (
            <article key={block.title} className="rounded-2xl bg-primary/5 p-3">
              <p className="text-sm font-semibold">{block.title}</p>
              <p className="mt-2 text-xs leading-7">
                {block.answers.map((row, index) => (
                  <span key={row.id} className="me-3">
                    {index + 1}) {row.letter}
                  </span>
                ))}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
