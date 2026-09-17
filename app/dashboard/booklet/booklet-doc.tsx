import type { ReactNode } from "react";
import { BookletFigure, CHAPTER_FIGURES, SceneCard } from "@/components/booklet-figures";
import { BookletMindMap } from "@/components/booklet-mind-map";
import { TextbookLesson } from "@/components/textbook-page";
import {
  bookletChapterPack,
  bookletHomeworkForChapter,
  bookletLetters,
  bookletOptions,
  buildBookletDocument,
  type BookletChapterPack,
  type BookletEssay,
  type BookletHomeworkPack,
  type BookletMcq,
} from "@/lib/booklet-pack";
import { getChapter, type ChapterId } from "@/lib/curriculum";
import { LESSON_NOTES } from "@/lib/lessons";
import type { Locale } from "@/lib/locale";
import { mindMapForChapter, mindMapForFaiz } from "@/lib/mind-maps";
import { textbookPageFor } from "@/lib/textbook-pages";

function PrintSection({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section className="booklet-section mt-7">
      <p className="booklet-section-title mb-3 inline-flex rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
        {n} — {title}
      </p>
      <div>{children}</div>
    </section>
  );
}

function Field({ label }: { label: string }) {
  return (
    <label className="block text-sm">
      <span className="font-semibold">{label}</span>
      <span className="mt-2 block h-8 border-b border-primary/30" />
    </label>
  );
}

function WriteLines({ count = 4 }: { count?: number }) {
  return (
    <div className="mt-3 space-y-3">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="h-7 border-b border-dashed border-primary/25" />
      ))}
    </div>
  );
}

function McqBlock({ locale, rows }: { locale: Locale; rows: BookletMcq[] }) {
  const ar = locale === "ar";
  const letters = bookletLetters(locale);
  return (
    <ol className="mt-4 list-none space-y-6">
      {rows.map((row, index) => {
        const options = bookletOptions(locale, row.optionsAr, row.optionsEn);
        return (
          <li key={row.id} className="booklet-q rounded-2xl border border-primary/15 bg-primary/[0.04] p-4">
            <p className="text-sm font-semibold leading-7">
              <span className="ms-1 font-bold text-primary">{index + 1}.</span> {ar ? row.promptAr : row.promptEn}
            </p>
            <ul className="mt-3 space-y-2.5">
              {options.map((option, optionIndex) => (
                <li key={`${row.id}-${optionIndex}`} className="flex items-start gap-2 text-sm leading-6">
                  <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-primary/30 text-[11px] font-bold text-primary">
                    {letters[optionIndex]}
                  </span>
                  <span dir="auto">{option}</span>
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ol>
  );
}

function EssayBlock({ locale, rows }: { locale: Locale; rows: BookletEssay[] }) {
  const ar = locale === "ar";
  return (
    <div className="mt-4 space-y-4">
      {rows.map((row, index) => (
        <article key={row.id} className="print-keep rounded-2xl border border-dashed border-primary/25 p-3">
          <p className="text-sm font-semibold">
            {ar ? "مقالي" : "Essay"} {index + 1}
          </p>
          <p className="mt-2 text-sm leading-relaxed">{ar ? row.promptAr : row.promptEn}</p>
          <WriteLines count={5} />
        </article>
      ))}
    </div>
  );
}

function HomeworkBlock({ locale, pack }: { locale: Locale; pack: BookletHomeworkPack }) {
  const ar = locale === "ar";
  return (
    <section className="print-break mt-8 rounded-3xl bg-[#fff8e8] p-5 ring-1 ring-[#d4a017]/40">
      <p className="text-xs font-semibold text-primary/70">{ar ? "واجب نهاية الجزء — سلّمه في الحصة" : "End-of-part homework — hand it in class"}</p>
      <h3 className="mt-1 font-serif text-2xl">{ar ? pack.titleAr : pack.titleEn}</h3>
      <McqBlock locale={locale} rows={pack.mcq} />
      <EssayBlock locale={locale} rows={pack.essays} />
    </section>
  );
}

function ChapterBlock({ locale, pack }: { locale: Locale; pack: BookletChapterPack }) {
  const ar = locale === "ar";
  const { chapter } = pack;
  const map = mindMapForChapter(chapter.id);
  const figures = CHAPTER_FIGURES[chapter.id] ?? [];
  const notes = LESSON_NOTES.filter((note) => note.chapterId === chapter.id);

  return (
    <section className="print-break border-t border-primary/10 pt-6">
      <p className="text-xs font-semibold text-primary/60">
        {chapter.part === 1 ? (ar ? "الجزء الأول" : "Part 1") : ar ? "الجزء الثاني" : "Part 2"}
      </p>
      <h3 className="mt-1 text-2xl font-semibold">
        {chapter.id}. {ar ? chapter.titleAr : chapter.titleEn}
      </h3>
      <p className="mt-1 text-sm leading-7 text-foreground/65">{ar ? chapter.blurbAr : chapter.blurbEn}</p>

      {map ? (
        <PrintSection n="1" title={ar ? "الخريطة الذهنية" : "Mind map"}>
          <BookletMindMap locale={locale} root={map} color={chapter.color} accent={chapter.accent} />
        </PrintSection>
      ) : null}

      {figures.length ? (
        <PrintSection n="2" title={ar ? "الرسوم والأشكال" : "Figures"}>
          <div className="grid gap-4 md:grid-cols-2">
            {figures.map((id) => (
              <BookletFigure key={id} id={id} locale={locale} color={chapter.color} />
            ))}
          </div>
        </PrintSection>
      ) : null}

      {pack.scenes.length ? (
        <PrintSection n="3" title={ar ? "مواقف من الحياة" : "Real-life scenes"}>
          <div className="grid gap-4 sm:grid-cols-3">
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
        </PrintSection>
      ) : null}

      <PrintSection n="4" title={ar ? "شرح الدروس" : "Lesson notes"}>
        {notes.map((note) => {
          const page = textbookPageFor(note.id);
          if (!page) return null;
          return <TextbookLesson key={note.id} locale={locale} page={page} />;
        })}
      </PrintSection>

      <PrintSection n="5" title={ar ? "تدريبات الفصل" : "Chapter practice"}>
        <p className="text-xs text-foreground/55">
          {ar ? "ظلّل الاختيار. الإجابات في آخر الملزمة." : "Mark a choice. Answers are at the end of this booklet."}
        </p>
        <McqBlock locale={locale} rows={pack.practice} />
      </PrintSection>

      <PrintSection n="6" title={ar ? "حلّل واكتب" : "Analyse and write"}>
        <EssayBlock locale={locale} rows={pack.essays} />
      </PrintSection>
    </section>
  );
}

export function BookletCover({
  locale,
  teacher,
  brand,
}: {
  locale: Locale;
  teacher: string;
  brand: string;
}) {
  const ar = locale === "ar";
  const doc = buildBookletDocument();
  return (
    <header className="print-keep mb-6 rounded-3xl bg-white p-6 ring-1 ring-primary/10 sm:p-8">
      <p className="text-xs font-semibold tracking-wide text-primary/60">{brand}</p>
      <h2 className="mt-1 font-serif text-3xl">{ar ? "ملزمة الطالب" : "Student booklet"}</h2>
      <p className="mt-1 text-sm text-foreground/65">{teacher} · 2026–2027 · 2Bac</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Field label={ar ? "الاسم" : "Name"} />
        <Field label={ar ? "رقم التليفون" : "Phone"} />
        <Field label={ar ? "المجموعة" : "Group"} />
      </div>
      <p className="mt-5 text-sm leading-relaxed text-foreground/70">
        {ar
          ? "كل فصل ملزمة لوحده: خريطة، رسوم، شرح، أسئلة، واجب، وإجابات. اختار التبويب ونزّل. هنجمع الملازم بعدين."
          : "Each chapter is its own booklet: map, figures, notes, questions, homework, and answers. Pick a tab and download. We will bind them later."}
      </p>
      <ol className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        {doc.parts.flatMap(({ chapters }) =>
          chapters.map((pack) => (
            <li key={pack.chapter.id} className="rounded-2xl px-3 py-2 text-white" style={{ background: pack.chapter.color }}>
              {pack.chapter.id}. {ar ? pack.chapter.titleAr : pack.chapter.titleEn}
            </li>
          )),
        )}
        <li className="rounded-2xl bg-primary px-3 py-2 text-white">{ar ? "كتاب الفائز + واجبه" : "Al-Faiz + homework"}</li>
      </ol>
    </header>
  );
}

export function BookletChapterPane({ locale, chapterId }: { locale: Locale; chapterId: ChapterId }) {
  const ar = locale === "ar";
  const chapter = getChapter(chapterId);
  if (!chapter) return null;
  const pack = bookletChapterPack(chapter);
  const homework = bookletHomeworkForChapter(chapter);
  return (
    <div className="print-sheet rounded-3xl bg-white p-5 ring-1 ring-primary/10 sm:p-7">
      <ChapterBlock locale={locale} pack={pack} />
      <HomeworkBlock locale={locale} pack={homework} />
      <section className="mt-8 rounded-3xl bg-primary/5 p-5">
        <h4 className="font-serif text-xl">{ar ? "مفتاح الإجابة" : "Answer key"}</h4>
        <p className="mt-3 text-sm leading-8">
          <strong>{ar ? "تدريبات:" : "Practice:"}</strong>{" "}
          {pack.answers.map((row, index) => (
            <span key={row.id} className="ms-2 inline-block">
              {index + 1}
              {row.letter}
            </span>
          ))}
        </p>
        <p className="mt-2 text-sm leading-8">
          <strong>{ar ? "واجب:" : "Homework:"}</strong>{" "}
          {homework.answers.map((row, index) => (
            <span key={row.id} className="ms-2 inline-block">
              {index + 1}
              {row.letter}
            </span>
          ))}
        </p>
      </section>
    </div>
  );
}

export function BookletFaizPane({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const { faiz, faizHomework } = buildBookletDocument();
  return (
    <div className="print-sheet rounded-3xl bg-white p-5 ring-1 ring-primary/10 sm:p-7">
      <h3 className="font-serif text-2xl">{ar ? "كتاب الفائز" : "Al-Faiz"}</h3>
      {faiz.map((pack) => {
        const map = mindMapForFaiz(pack.note.id);
        const figures = CHAPTER_FIGURES[pack.note.id] ?? [];
        const color =
          pack.note.id === "f2" ? "#7f1d1d" : pack.note.id === "f3" ? "#134e4a" : pack.note.id === "f4" ? "#4a1942" : "#0c2d6b";
        const accent =
          pack.note.id === "f2" ? "#f59e0b" : pack.note.id === "f3" ? "#2dd4bf" : pack.note.id === "f4" ? "#e879f9" : "#c4a35a";
        return (
          <article key={pack.note.id} className="print-break mt-6">
            <h4 className="text-xl font-semibold">{ar ? pack.note.titleAr : pack.note.titleEn}</h4>
            {map ? (
              <div className="mt-4">
                <BookletMindMap locale={locale} root={map} color={color} accent={accent} />
              </div>
            ) : null}
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {figures.map((id) => (
                <BookletFigure key={`${pack.note.id}-${id}`} id={id} locale={locale} color={color} />
              ))}
            </div>
            <div className="mt-4 space-y-3">
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
      <HomeworkBlock locale={locale} pack={faizHomework} />
      <section className="mt-8 rounded-3xl bg-primary/5 p-5">
        <h4 className="font-serif text-xl">{ar ? "مفتاح الإجابة" : "Answer key"}</h4>
        {faiz.map((pack) => (
          <p key={pack.note.id} className="mt-3 text-sm leading-8">
            <strong>{ar ? pack.note.titleAr : pack.note.titleEn}:</strong>{" "}
            {pack.answers.map((row, index) => (
              <span key={row.id} className="ms-2 inline-block">
                {index + 1}
                {row.letter}
              </span>
            ))}
          </p>
        ))}
        <p className="mt-2 text-sm leading-8">
          <strong>{ar ? "واجب:" : "Homework:"}</strong>{" "}
          {faizHomework.answers.map((row, index) => (
            <span key={row.id} className="ms-2 inline-block">
              {index + 1}
              {row.letter}
            </span>
          ))}
        </p>
      </section>
    </div>
  );
}
