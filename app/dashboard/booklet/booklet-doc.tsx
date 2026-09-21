import type { ReactNode } from "react";
import { BookletFigure, CHAPTER_FIGURES } from "@/components/booklet-figures";
import { BookletMindMap } from "@/components/booklet-mind-map";
import { TextbookLesson } from "@/components/textbook-page";
import { assessBlocksForLesson, periodLabelAr } from "@/lib/assessments-bank";
import { assessLessonTitle, assessmentsPages } from "@/lib/assessments";
import { bookletSafe } from "@/lib/booklet-lang";
import { BRAND } from "@/lib/brand";
import {
  bookletAnswerMark,
  bookletChapterPack,
  bookletHomeworkForChapter,
  bookletLessonEssays,
  bookletLessonPack,
  bookletLessonPractice,
  bookletLessonTf,
  bookletLetters,
  bookletOptions,
  bookletPrompt,
  buildBookletDocument,
  type BookletChapterPack,
  type BookletEssay,
  type BookletHomeworkPack,
  type BookletMcq,
} from "@/lib/booklet-pack";
import { getChapter, getLesson, type ChapterId } from "@/lib/curriculum";
import { LESSON_NOTES } from "@/lib/lessons";
import type { Locale } from "@/lib/locale";
import { mindMapForChapter, mindMapForFaiz } from "@/lib/mind-maps";
import { textbookPageFor } from "@/lib/textbook-pages";

function PrintSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="booklet-section mt-8">
      <p className="booklet-section-title mb-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-extrabold text-white">
        {title}
      </p>
      <div>{children}</div>
    </section>
  );
}

function Field({ label }: { label: string }) {
  return (
    <label className="block text-base">
      <span className="font-extrabold">{label}</span>
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
          <li key={row.id} className="booklet-q rounded-xl p-5">
            <p className="text-lg font-bold leading-9 text-[#111827]">
              <span className="ms-1 font-extrabold text-primary">{index + 1}.</span> {bookletPrompt(locale, row.promptAr, row.promptEn)}
            </p>
            <ul className="mt-4 space-y-3">
              {options.map((option, optionIndex) => (
                <li key={`${row.id}-${optionIndex}`} className="flex items-start gap-3 text-base font-semibold leading-8 text-[#111827]">
                  <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-primary text-sm font-extrabold text-primary">
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
        <article key={row.id} className="print-keep rounded-xl border-2 border-dashed border-primary/30 p-5">
          <p className="text-base font-extrabold text-primary">
            {ar ? "مقالي" : "Essay"} {index + 1}
          </p>
          <p className="mt-2 text-lg font-bold leading-9 text-[#111827]">{bookletPrompt(locale, row.promptAr, row.promptEn)}</p>
          <WriteLines count={5} />
        </article>
      ))}
    </div>
  );
}

function EssayAnswers({ locale, title, rows }: { locale: Locale; title: string; rows: BookletEssay[] }) {
  const ar = locale === "ar";
  if (!rows.length) return null;
  return (
    <div className="mt-4 space-y-3">
      <p className="text-lg font-extrabold text-[#0c2d6b]">{title}</p>
      {rows.map((row, index) => (
        <article key={row.id} className="print-keep rounded-xl bg-white p-4 ring-1 ring-slate-300">
          <p className="text-sm font-extrabold text-primary">
            {ar ? "مقالي" : "Essay"} {index + 1}
          </p>
          <div className="mt-2 space-y-1 text-base font-semibold leading-8 text-[#111827] whitespace-pre-line">
            {bookletSafe(locale, ar ? row.guideAr : row.guideEn)}
          </div>
        </article>
      ))}
    </div>
  );
}

function AnswerKeyList({
  locale,
  title,
  answers,
}: {
  locale: Locale;
  title: string;
  answers: { id: string; index: number; promptAr: string; promptEn: string; choiceAr: string; choiceEn: string }[];
}) {
  const ar = locale === "ar";
  if (!answers.length) return null;
  return (
    <div className="mt-4">
      <p className="text-base font-extrabold text-[#0c2d6b]">{title}</p>
      <ol className="mt-2 space-y-2">
        {answers.map((row, index) => (
          <li key={row.id} className="text-base font-bold leading-8 text-[#111827]">
            <span className="text-primary">
              {index + 1}-{bookletAnswerMark(locale, row.index)}
            </span>
            <span className="ms-2 font-extrabold">
              {bookletSafe(locale, ar ? row.choiceAr : row.choiceEn)}
            </span>
            <span className="ms-2 font-semibold text-[#374151]">
              — {bookletSafe(locale, ar ? row.promptAr : row.promptEn)}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function HomeworkBlock({ locale, pack }: { locale: Locale; pack: BookletHomeworkPack }) {
  const ar = locale === "ar";
  return (
    <section className="print-break mt-8 rounded-xl bg-[#fff4cc] p-6 ring-1 ring-[#d4a017]/50">
      <p className="text-sm font-extrabold text-[#92400e]">{ar ? "واجب نهاية الفصل — سلّمه في الحصة" : "End-of-chapter homework — hand it in class"}</p>
      <h3 className="mt-2 font-serif text-3xl">{ar ? pack.titleAr : pack.titleEn}</h3>
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
    <section className="border-t border-primary/10 pt-6">
      <p className="text-sm font-extrabold text-primary">
        {chapter.part === 1 ? (ar ? "الجزء الأول" : "Part 1") : ar ? "الجزء الثاني" : "Part 2"}
      </p>
      <h3 className="mt-2 text-3xl font-extrabold">
        {chapter.id}. {bookletSafe(locale, ar ? chapter.titleAr : chapter.titleEn)}
      </h3>
      <p className="mt-3 text-lg font-semibold leading-9 text-[#111827]">{bookletSafe(locale, ar ? chapter.blurbAr : chapter.blurbEn)}</p>

      {map ? (
        <PrintSection title={ar ? "الخريطة الذهنية" : "Mind map"}>
          <BookletMindMap locale={locale} root={map} color={chapter.color} accent={chapter.accent} />
        </PrintSection>
      ) : null}

      {figures.length ? (
        <PrintSection title={ar ? "الرسوم والأشكال" : "Figures"}>
          <div className="grid gap-4 md:grid-cols-2">
            {figures.map((id) => (
              <BookletFigure key={id} id={id} locale={locale} color={chapter.color} />
            ))}
          </div>
        </PrintSection>
      ) : null}

      {notes.map((note, noteIndex) => {
        const page = textbookPageFor(note.id);
        if (!page) return null;
        const drills = bookletLessonPractice(note.id);
        const tf = bookletLessonTf(note.id);
        const essays = bookletLessonEssays(note.id);
        return (
          <div key={note.id} className={noteIndex === 0 ? undefined : "print-break"}>
            <TextbookLesson locale={locale} page={page} />
            <LessonDrills locale={locale} lessonId={page.id} drills={drills} tf={tf} essays={essays} />
          </div>
        );
      })}

      <PrintSection title={ar ? "حلّل واكتب" : "Analyse and write"}>
        <EssayBlock locale={locale} rows={pack.essays} />
      </PrintSection>
    </section>
  );
}

export function BookletCover({
  locale,
  teacher,
  brand,
  kicker,
  title,
  color = "#0c2d6b",
}: {
  locale: Locale;
  teacher: string;
  brand: string;
  kicker: string;
  title: string;
  color?: string;
}) {
  const ar = locale === "ar";
  return (
    <section className="booklet-cover mb-6 overflow-hidden rounded-xl bg-white ring-1 ring-slate-300" style={{ background: color }}>
      <div className="booklet-cover-band px-7 py-8 text-white sm:px-10 sm:py-10" style={{ background: color }}>
        <p className="text-sm font-extrabold tracking-[0.18em] text-white/80">{brand}</p>
        <p className="mt-5 text-sm font-extrabold uppercase tracking-wide text-[#f5d78a]">{kicker}</p>
        <h2 className="mt-2 font-serif text-4xl leading-tight text-white sm:text-5xl">
          {ar ? "ملزمة الطالب" : "Student booklet"}
        </h2>
        <p className="mt-3 max-w-2xl text-2xl font-extrabold leading-10 text-white">{title}</p>
        <p className="mt-4 text-lg font-bold text-white/90">{ar ? BRAND.subjectAr : BRAND.subjectEn}</p>
        <p className="mt-1 text-base font-semibold text-white/75">{ar ? BRAND.gradeAr : BRAND.gradeEn}</p>
      </div>
      <div className="booklet-cover-card mx-4 mb-4 rounded-xl bg-white px-6 py-6 sm:mx-6 sm:mb-6 sm:px-8">
        <p className="text-xl font-extrabold text-[#111827]">{teacher}</p>
        <p className="mt-1 text-lg font-extrabold tracking-wide text-primary" dir="ltr">
          {BRAND.phone}
        </p>
        <p className="mt-1 text-base font-semibold text-[#374151]">{BRAND.year}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <Field label={ar ? "الاسم" : "Name"} />
          <Field label={ar ? "رقم التليفون" : "Phone"} />
          <Field label={ar ? "المجموعة" : "Group"} />
        </div>
        <p className="mt-6 text-base font-semibold leading-8 text-[#111827]">
          {ar
            ? "شرح الدرس، اختيار من متعدد، صح وغلط، مقالي، ومفتاح الإجابة في الآخر."
            : "The lesson, multiple choice, true or false, essays, and the answer key at the end."}
        </p>
      </div>
    </section>
  );
}

function LessonDrills({
  locale,
  lessonId,
  drills,
  tf,
  essays,
}: {
  locale: Locale;
  lessonId: string;
  drills: BookletMcq[];
  tf: BookletMcq[];
  essays: BookletEssay[];
}) {
  const ar = locale === "ar";
  return (
    <>
      {drills.length ? (
        <PrintSection title={ar ? `اختيار من متعدد — الدرس ${lessonId}` : `Multiple choice — lesson ${lessonId}`}>
          <p className="text-base font-semibold text-[#374151]">
            {ar ? "ظلل الاختيار. الأسئلة من المنهج. المفتاح أسفل الصفحة." : "Mark a choice. Questions follow the syllabus. The key is below on this page."}
          </p>
          <McqBlock locale={locale} rows={drills} />
        </PrintSection>
      ) : null}
      {tf.length ? (
        <PrintSection title={ar ? "صح وغلط" : "True or false"}>
          <p className="text-base font-semibold text-[#374151]">
            {ar ? "اختَر صح أو غلط من تعريف المنهج." : "Choose true or false from the syllabus definition."}
          </p>
          <McqBlock locale={locale} rows={tf} />
        </PrintSection>
      ) : null}
      {essays.length ? (
        <PrintSection title={ar ? "أسئلة مقالي" : "Essay questions"}>
          <p className="text-base font-semibold text-[#374151]">
            {ar ? "اشرح من المنهج. دليل الإجابة أسفل الصفحة." : "Explain from the syllabus. The guide is below on this page."}
          </p>
          <EssayBlock locale={locale} rows={essays} />
        </PrintSection>
      ) : null}
    </>
  );
}

export function BookletLessonPane({ locale, lessonId }: { locale: Locale; lessonId: string }) {
  const ar = locale === "ar";
  const pack = bookletLessonPack(lessonId);
  const page = textbookPageFor(lessonId);
  if (!pack || !page) return null;
  return (
    <div className="booklet-paper print-sheet rounded-xl bg-white p-5 ring-1 ring-slate-300 sm:p-8">
      <BookletCover
        locale={locale}
        teacher={ar ? BRAND.teacherAr : BRAND.teacherEn}
        brand={ar ? BRAND.nameAr : BRAND.nameEn}
        kicker={ar ? `الفصل ${pack.chapter.id} · الدرس ${lessonId}` : `Chapter ${pack.chapter.id} · Lesson ${lessonId}`}
        title={ar ? pack.titleAr : pack.titleEn}
        color={pack.chapter.color}
      />
      <TextbookLesson locale={locale} page={page} />
      <LessonDrills locale={locale} lessonId={page.id} drills={pack.practice} tf={pack.tf} essays={pack.essays} />
      <section className="mt-8 rounded-xl bg-primary/5 p-6">
        <h4 className="font-serif text-2xl">{ar ? "مفتاح الإجابة" : "Answer key"}</h4>
        <AnswerKeyList
          locale={locale}
          title={ar ? `اختيار من متعدد — الدرس ${lessonId}` : `Multiple choice — lesson ${lessonId}`}
          answers={pack.practice.map((row) => ({
            id: row.id,
            index: row.correctIndex,
            promptAr: row.promptAr,
            promptEn: row.promptEn,
            choiceAr: row.optionsAr[row.correctIndex] ?? "",
            choiceEn: row.optionsEn[row.correctIndex] ?? "",
          }))}
        />
        <AnswerKeyList
          locale={locale}
          title={ar ? "صح وغلط" : "True or false"}
          answers={pack.tf.map((row) => ({
            id: row.id,
            index: row.correctIndex,
            promptAr: row.promptAr,
            promptEn: row.promptEn,
            choiceAr: row.optionsAr[row.correctIndex] ?? "",
            choiceEn: row.optionsEn[row.correctIndex] ?? "",
          }))}
        />
        <EssayAnswers locale={locale} title={ar ? "المقالي" : "Essays"} rows={pack.essays} />
      </section>
    </div>
  );
}

export function BookletHomeworkPane({ locale, chapterId }: { locale: Locale; chapterId: ChapterId }) {
  const ar = locale === "ar";
  const chapter = getChapter(chapterId);
  if (!chapter) return null;
  const pack = bookletHomeworkForChapter(chapter);
  return (
    <div className="booklet-paper print-sheet rounded-xl bg-white p-5 ring-1 ring-slate-300 sm:p-8">
      <BookletCover
        locale={locale}
        teacher={ar ? BRAND.teacherAr : BRAND.teacherEn}
        brand={ar ? BRAND.nameAr : BRAND.nameEn}
        kicker={ar ? `الفصل ${chapter.id}` : `Chapter ${chapter.id}`}
        title={ar ? pack.titleAr : pack.titleEn}
        color={chapter.color}
      />
      <HomeworkBlock locale={locale} pack={pack} />
      <section className="mt-8 rounded-xl bg-primary/5 p-6">
        <h4 className="font-serif text-2xl">{ar ? "مفتاح الإجابة" : "Answer key"}</h4>
        <AnswerKeyList locale={locale} title={ar ? pack.titleAr : pack.titleEn} answers={pack.answers} />
        <EssayAnswers locale={locale} title={ar ? "مقالي الواجب" : "Homework essays"} rows={pack.essays} />
      </section>
    </div>
  );
}

export function BookletFaizUnitPane({ locale, unitId }: { locale: Locale; unitId: string }) {
  const ar = locale === "ar";
  const pack = buildBookletDocument().faiz.find((row) => row.note.id === unitId);
  if (!pack) return null;
  const map = mindMapForFaiz(pack.note.id);
  const figures = CHAPTER_FIGURES[pack.note.id] ?? [];
  const color =
    pack.note.id === "f2" ? "#7f1d1d" : pack.note.id === "f3" ? "#134e4a" : pack.note.id === "f4" ? "#4a1942" : "#0c2d6b";
  const accent =
    pack.note.id === "f2" ? "#f59e0b" : pack.note.id === "f3" ? "#2dd4bf" : pack.note.id === "f4" ? "#e879f9" : "#c4a35a";
  return (
    <div className="booklet-paper print-sheet rounded-xl bg-white p-5 ring-1 ring-slate-300 sm:p-8">
      <BookletCover
        locale={locale}
        teacher={ar ? BRAND.teacherAr : BRAND.teacherEn}
        brand={ar ? BRAND.nameAr : BRAND.nameEn}
        kicker={ar ? "كتاب الفائز" : "Al-Faiz"}
        title={ar ? pack.note.titleAr : pack.note.titleEn}
        color={color}
      />
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
          <div key={section.headingAr} className="rounded-xl bg-primary/5 p-5">
            <p className="text-lg font-extrabold text-[#0c2d6b]">{bookletSafe(locale, ar ? section.headingAr : section.headingEn)}</p>
            {(ar ? section.bodyAr : section.bodyEn).map((line) => (
              <p key={line} className="mt-3 text-base font-semibold leading-8 text-[#111827]">
                {bookletSafe(locale, line)}
              </p>
            ))}
          </div>
        ))}
      </div>
      <h5 className="mt-5 text-lg font-semibold">{ar ? "أسئلة الوحدة" : "Unit questions"}</h5>
      <McqBlock locale={locale} rows={pack.practice} />
      <section className="mt-8 rounded-xl bg-primary/5 p-6">
        <h4 className="font-serif text-2xl">{ar ? "مفتاح الإجابة" : "Answer key"}</h4>
        <AnswerKeyList locale={locale} title={ar ? pack.note.titleAr : pack.note.titleEn} answers={pack.answers} />
      </section>
    </div>
  );
}

export function BookletFaizHomeworkPane({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const pack = buildBookletDocument().faizHomework;
  return (
    <div className="booklet-paper print-sheet rounded-xl bg-white p-5 ring-1 ring-slate-300 sm:p-8">
      <BookletCover
        locale={locale}
        teacher={ar ? BRAND.teacherAr : BRAND.teacherEn}
        brand={ar ? BRAND.nameAr : BRAND.nameEn}
        kicker={ar ? "كتاب الفائز" : "Al-Faiz"}
        title={ar ? pack.titleAr : pack.titleEn}
        color="#92400e"
      />
      <HomeworkBlock locale={locale} pack={pack} />
      <section className="mt-8 rounded-xl bg-primary/5 p-6">
        <h4 className="font-serif text-2xl">{ar ? "مفتاح الإجابة" : "Answer key"}</h4>
        <AnswerKeyList locale={locale} title={ar ? pack.titleAr : pack.titleEn} answers={pack.answers} />
        <EssayAnswers locale={locale} title={ar ? "مقالي واجب الفائز" : "Al-Faiz essays"} rows={pack.essays} />
      </section>
    </div>
  );
}

export function BookletChapterPane({ locale, chapterId }: { locale: Locale; chapterId: ChapterId }) {
  const ar = locale === "ar";
  const chapter = getChapter(chapterId);
  if (!chapter) return null;
  const pack = bookletChapterPack(chapter);
  const homework = bookletHomeworkForChapter(chapter);
  return (
    <div className="booklet-paper print-sheet rounded-xl bg-white p-5 ring-1 ring-slate-300 sm:p-8">
      <BookletCover
        locale={locale}
        teacher={ar ? BRAND.teacherAr : BRAND.teacherEn}
        brand={ar ? BRAND.nameAr : BRAND.nameEn}
        kicker={ar ? `الفصل ${chapter.id}` : `Chapter ${chapter.id}`}
        title={ar ? chapter.titleAr : chapter.titleEn}
        color={chapter.color}
      />
      <ChapterBlock locale={locale} pack={pack} />
      <HomeworkBlock locale={locale} pack={homework} />
      <section className="mt-8 rounded-xl bg-primary/5 p-6">
        <h4 className="font-serif text-2xl">{ar ? "مفتاح الإجابة" : "Answer key"}</h4>
        {pack.answerGroups.map((group) => (
          <AnswerKeyList
            key={group.titleAr}
            locale={locale}
            title={ar ? group.titleAr : group.titleEn}
            answers={group.answers}
          />
        ))}
        <AnswerKeyList locale={locale} title={ar ? homework.titleAr : homework.titleEn} answers={homework.answers} />
        <EssayAnswers locale={locale} title={ar ? "مقالي التدريبات" : "Practice essays"} rows={pack.essays} />
        <EssayAnswers locale={locale} title={ar ? "مقالي الواجب" : "Homework essays"} rows={homework.essays} />
      </section>
    </div>
  );
}

export function BookletFaizPane({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const { faiz, faizHomework } = buildBookletDocument();
  return (
    <div className="booklet-paper print-sheet rounded-xl bg-white p-5 ring-1 ring-slate-300 sm:p-8">
      <BookletCover
        locale={locale}
        teacher={ar ? BRAND.teacherAr : BRAND.teacherEn}
        brand={ar ? BRAND.nameAr : BRAND.nameEn}
        kicker={ar ? "كتاب الفائز" : "Al-Faiz"}
        title={ar ? "ملزمة كتاب الفائز" : "Al-Faiz booklet"}
        color="#0c2d6b"
      />
      <h3 className="font-serif text-3xl">{ar ? "كتاب الفائز" : "Al-Faiz"}</h3>
      {faiz.map((pack) => {
        const map = mindMapForFaiz(pack.note.id);
        const figures = CHAPTER_FIGURES[pack.note.id] ?? [];
        const color =
          pack.note.id === "f2" ? "#7f1d1d" : pack.note.id === "f3" ? "#134e4a" : pack.note.id === "f4" ? "#4a1942" : "#0c2d6b";
        const accent =
          pack.note.id === "f2" ? "#f59e0b" : pack.note.id === "f3" ? "#2dd4bf" : pack.note.id === "f4" ? "#e879f9" : "#c4a35a";
        return (
          <article key={pack.note.id} className="print-break mt-6">
            <h4 className="text-2xl font-extrabold">{bookletSafe(locale, ar ? pack.note.titleAr : pack.note.titleEn)}</h4>
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
                <div key={section.headingAr} className="rounded-xl bg-primary/5 p-5">
                  <p className="text-lg font-extrabold text-[#0c2d6b]">{bookletSafe(locale, ar ? section.headingAr : section.headingEn)}</p>
                  {(ar ? section.bodyAr : section.bodyEn).map((line) => (
                    <p key={line} className="mt-3 text-base font-semibold leading-8 text-[#111827]">
                      {bookletSafe(locale, line)}
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
      <section className="mt-8 rounded-xl bg-primary/5 p-6">
        <h4 className="font-serif text-2xl">{ar ? "مفتاح الإجابة" : "Answer key"}</h4>
        {faiz.map((unit) => (
          <AnswerKeyList
            key={unit.note.id}
            locale={locale}
            title={ar ? unit.note.titleAr : unit.note.titleEn}
            answers={unit.answers}
          />
        ))}
        <AnswerKeyList locale={locale} title={ar ? faizHomework.titleAr : faizHomework.titleEn} answers={faizHomework.answers} />
        <EssayAnswers locale={locale} title={ar ? "مقالي واجب الفائز" : "Al-Faiz essays"} rows={faizHomework.essays} />
      </section>
    </div>
  );
}

const ASSESS_LETTERS = ["أ", "ب", "ج", "د"];

function DateBlanks() {
  return (
    <div className="mt-3 grid gap-3 sm:grid-cols-3 text-sm font-semibold text-[#111827]">
      <p>
        الأسبوع <span className="ms-2 inline-block w-16 border-b border-primary/30" />
      </p>
      <p>
        التاريخ <span className="ms-2 inline-block w-28 border-b border-primary/30" />
      </p>
      <p>......../......../........</p>
    </div>
  );
}

export function BookletAssessPane({ lessonId }: { lessonId: string }) {
  const lesson = getLesson(lessonId);
  const chapter = lesson ? getChapter(lesson.chapterId) : undefined;
  const title = assessLessonTitle(lessonId);
  const pages = assessmentsPages(lessonId);
  const blocks = assessBlocksForLesson(lessonId);
  return (
    <div className="booklet-paper print-sheet rounded-xl bg-white p-5 ring-1 ring-slate-300 sm:p-8" lang="ar" dir="rtl">
      <BookletCover
        locale="ar"
        teacher={BRAND.teacherAr}
        brand={BRAND.nameAr}
        kicker="الأداءات والتقييمات"
        title={`${lessonId} — ${title.titleAr}`}
        color={chapter?.color ?? "#0c2d6b"}
      />
      <p className="text-sm font-semibold leading-8 text-[#374151]">
        صفحات كتاب الوزارة كما طُبعت. النص تحتها للكتابة فقط، من غير تغيير صياغة السؤال.
      </p>
      <div className="mt-6 space-y-6">
        {pages.map((page) => (
          <figure key={page} className="print-keep keep-white overflow-hidden rounded-xl ring-1 ring-slate-200">
            <img
              src={`/api/book-page?book=assess&page=${page}`}
              alt={`صفحة ${page} — الأداءات والتقييمات`}
              className="w-full bg-white"
              loading="lazy"
            />
            <figcaption className="bg-slate-50 px-3 py-2 text-xs font-semibold text-[#374151]">
              الصفحة {page} من كتاب الأداءات والتقييمات
            </figcaption>
          </figure>
        ))}
      </div>
      {blocks.length ? (
        <section className="mt-10">
          <h3 className="font-serif text-3xl">نسخة للكتابة</h3>
          <p className="mt-2 text-sm font-semibold text-[#374151]">نفس أسئلة الوزارة. سطور فارغة للحل.</p>
          {blocks.map((block) => (
            <div key={block.key} className="print-break mt-8">
              <p className="text-sm font-extrabold text-primary">{periodLabelAr(block.period)}</p>
              <p className="mt-1 text-xl font-extrabold text-[#0c2d6b]">{block.titleAr}</p>
              <DateBlanks />
              {block.essays.length ? (
                <PrintSection title="الأسئلة المقالية">
                  <div className="mt-4 space-y-4">
                    {block.essays.map((row, index) => (
                      <article key={row.id} className="print-keep rounded-xl border-2 border-dashed border-primary/30 p-5">
                        <p className="text-lg font-bold leading-9 text-[#111827]">
                          <span className="ms-1 font-extrabold text-primary">{index + 1}-</span>
                          {row.promptAr}
                        </p>
                        <WriteLines count={5} />
                      </article>
                    ))}
                  </div>
                </PrintSection>
              ) : null}
              {block.mcq.length ? (
                <PrintSection title="الأسئلة الموضوعية (اختيار من متعدد)">
                  <ol className="mt-4 list-none space-y-6">
                    {block.mcq.map((row, index) => (
                      <li key={row.id} className="booklet-q rounded-xl p-5">
                        <p className="text-lg font-bold leading-9 text-[#111827]">
                          <span className="ms-1 font-extrabold text-primary">{index + 1}-</span>
                          {row.promptAr}
                        </p>
                        <ul className="mt-4 space-y-3">
                          {(row.optionsAr ?? []).map((option, optionIndex) => (
                            <li key={`${row.id}-${optionIndex}`} className="flex items-start gap-3 text-base font-semibold leading-8 text-[#111827]">
                              <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-primary text-sm font-extrabold text-primary">
                                {ASSESS_LETTERS[optionIndex]}
                              </span>
                              <span>{option}</span>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ol>
                </PrintSection>
              ) : null}
            </div>
          ))}
        </section>
      ) : (
        <p className="mt-8 text-sm font-semibold text-[#374151]">نسخة الكتابة للدرس 1-1 جاهزة. باقي الدروس صفحات الوزارة كما هي إلى أن تُكتب بنفس النص.</p>
      )}
    </div>
  );
}
