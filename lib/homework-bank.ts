import { EXTRA_HOMEWORK } from "@/lib/homework-extra";
import { LESSON_NOTES } from "@/lib/lessons";
import type { ChapterId } from "@/lib/curriculum";
import { expandNotesToHomework } from "@/lib/question-bank/expand";
import { shuffled } from "@/lib/shuffle";

export type HomeworkKind = "mcq" | "tf";

export type HomeworkQuestion = {
  id: string;
  lessonId: string;
  chapterId: ChapterId;
  kind: HomeworkKind;
  promptAr: string;
  promptEn: string;
  optionsAr: string[];
  optionsEn: string[];
  correctIndex: number;
};

export const LESSON_HOMEWORK_SIZE = 15;
export const MAKEUP_HOMEWORK_SIZE = 5;

function pushQuestion(bank: HomeworkQuestion[], question: HomeworkQuestion) {
  bank.push(question);
}

function otherTerms(
  termsAr: { term: string; meaning: string }[],
  termsEn: { term: string; meaning: string }[],
  index: number,
) {
  return termsAr
    .map((item, otherIndex) => ({
      ar: item,
      en: termsEn[otherIndex] ?? item,
      otherIndex,
    }))
    .filter((row) => row.otherIndex !== index);
}

function buildBank(): HomeworkQuestion[] {
  const bank: HomeworkQuestion[] = [];

  for (const note of LESSON_NOTES) {
    const termsAr = note.termsAr;
    const termsEn = note.termsEn;
    termsAr.forEach((term, index) => {
      const en = termsEn[index] ?? { term: term.term, meaning: term.meaning };
      const others = otherTerms(termsAr, termsEn, index);

      pushQuestion(bank, {
        id: `${note.id}-tf-${index}`,
        lessonId: note.id,
        chapterId: note.chapterId,
        kind: "tf",
        promptAr: `هل صحيح أن «${term.term}» يعني: ${term.meaning}؟`,
        promptEn: `Is it true that “${en.term}” means: ${en.meaning}?`,
        optionsAr: ["صح", "غلط"],
        optionsEn: ["True", "False"],
        correctIndex: 0,
      });

      const other = others[0];
      if (other) {
        pushQuestion(bank, {
          id: `${note.id}-tf-x-${index}`,
          lessonId: note.id,
          chapterId: note.chapterId,
          kind: "tf",
          promptAr: `هل صحيح أن «${term.term}» يعني: ${other.ar.meaning}؟`,
          promptEn: `Is it true that “${en.term}” means: ${other.en.meaning}?`,
          optionsAr: ["صح", "غلط"],
          optionsEn: ["True", "False"],
          correctIndex: 1,
        });
      }

      if (others.length >= 3) {
        pushQuestion(bank, {
          id: `${note.id}-mcq-${index}`,
          lessonId: note.id,
          chapterId: note.chapterId,
          kind: "mcq",
          promptAr: `ما معنى «${term.term}» حسب المنهج؟`,
          promptEn: `What does “${en.term}” mean in this lesson?`,
          optionsAr: [term.meaning, ...others.slice(0, 3).map((row) => row.ar.meaning)],
          optionsEn: [en.meaning, ...others.slice(0, 3).map((row) => row.en.meaning)],
          correctIndex: 0,
        });
        pushQuestion(bank, {
          id: `${note.id}-mcq-term-${index}`,
          lessonId: note.id,
          chapterId: note.chapterId,
          kind: "mcq",
          promptAr: `أي مصطلح من المنهج يطابق هذا المعنى: «${term.meaning}»؟`,
          promptEn: `Which lesson term matches this meaning: “${en.meaning}”?`,
          optionsAr: [term.term, ...others.slice(0, 3).map((row) => row.ar.term)],
          optionsEn: [en.term, ...others.slice(0, 3).map((row) => row.en.term)],
          correctIndex: 0,
        });
      }

      const farther = others[1];
      if (farther) {
        pushQuestion(bank, {
          id: `${note.id}-tf-x2-${index}`,
          lessonId: note.id,
          chapterId: note.chapterId,
          kind: "tf",
          promptAr: `هل صحيح أن «${term.term}» يعني: ${farther.ar.meaning}؟`,
          promptEn: `Is it true that “${en.term}” means: ${farther.en.meaning}?`,
          optionsAr: ["صح", "غلط"],
          optionsEn: ["True", "False"],
          correctIndex: 1,
        });
      }
    });

    pushQuestion(bank, {
      id: `${note.id}-take-tf`,
      lessonId: note.id,
      chapterId: note.chapterId,
      kind: "tf",
      promptAr: `هل هذه الخلاصة صحيحة حسب المنهج؟ ${note.takeawayAr}`,
      promptEn: `Is this takeaway true for the lesson? ${note.takeawayEn}`,
      optionsAr: ["صح", "غلط"],
      optionsEn: ["True", "False"],
      correctIndex: 0,
    });

    const otherNote = LESSON_NOTES.find((item) => item.chapterId === note.chapterId && item.id !== note.id);
    if (otherNote) {
      pushQuestion(bank, {
        id: `${note.id}-take-x`,
        lessonId: note.id,
        chapterId: note.chapterId,
        kind: "tf",
        promptAr: `هل هذه خلاصة هذا الدرس؟ ${otherNote.takeawayAr}`,
        promptEn: `Is this the takeaway of this lesson? ${otherNote.takeawayEn}`,
        optionsAr: ["صح", "غلط"],
        optionsEn: ["True", "False"],
        correctIndex: 1,
      });
    }

    note.bodyAr.forEach((line, index) => {
      const lineEn = note.bodyEn[index] ?? line;
      pushQuestion(bank, {
        id: `${note.id}-body-${index}`,
        lessonId: note.id,
        chapterId: note.chapterId,
        kind: "tf",
        promptAr: `هل هذا صحيح حسب منهج الدرس؟ ${line}`,
        promptEn: `Is this true according to the lesson? ${lineEn}`,
        optionsAr: ["صح", "غلط"],
        optionsEn: ["True", "False"],
        correctIndex: 0,
      });
    });
  }

  for (const extra of EXTRA_HOMEWORK) {
    pushQuestion(bank, extra);
  }

  for (const extra of expandNotesToHomework()) {
    pushQuestion(bank, extra);
  }

  return bank;
}

const BANK = buildBank();
const EXTRA_IDS = new Set(EXTRA_HOMEWORK.map((row) => row.id));

export function homeworkBankSize(): number {
  return BANK.length;
}

export function questionsForLesson(lessonId: string): HomeworkQuestion[] {
  return BANK.filter((item) => item.lessonId === lessonId);
}

export function questionsForChapter(chapterId: ChapterId): HomeworkQuestion[] {
  return BANK.filter((item) => item.chapterId === chapterId);
}

function isCurriculumMcq(question: HomeworkQuestion): boolean {
  return (
    question.kind === "mcq" &&
    (EXTRA_IDS.has(question.id) || question.id.includes("-mcq-") || question.id.includes("-n-best-") || question.id.includes("-x"))
  );
}

export function pickLessonHomework(
  lessonId: string,
  seed: number,
  size = LESSON_HOMEWORK_SIZE,
  extras: HomeworkQuestion[] = [],
): HomeworkQuestion[] {
  const classQs = extras.filter((question) => question.lessonId === lessonId).slice(0, 2);
  const want = Math.max(0, size - classQs.length);
  const pool = questionsForLesson(lessonId);
  const preferred = shuffled(pool.filter(isCurriculumMcq), seed);
  const otherMcq = shuffled(
    pool.filter((question) => question.kind === "mcq" && !preferred.includes(question)),
    seed + 11,
  );
  const tf = shuffled(
    pool.filter((question) => question.kind === "tf"),
    seed + 41,
  );
  const picked = [...preferred];
  if (picked.length < Math.ceil(want * 0.75)) {
    picked.push(...otherMcq.slice(0, Math.ceil(want * 0.75) - picked.length));
  }
  picked.push(...tf.slice(0, Math.max(0, want - picked.length)));
  if (picked.length < want) {
    picked.push(...otherMcq.slice(0, want - picked.length));
  }
  return shuffled([...classQs, ...picked.slice(0, want)], seed + 7).slice(0, Math.min(size, classQs.length + want));
}

export function withShuffledOptions(
  question: HomeworkQuestion,
  seed: number,
): HomeworkQuestion {
  if (question.kind === "tf") return question;
  const order = shuffled(
    question.optionsAr.map((_, index) => index),
    seed + question.id.length,
  );
  return {
    ...question,
    optionsAr: order.map((index) => question.optionsAr[index]!),
    optionsEn: order.map((index) => question.optionsEn[index]!),
    correctIndex: order.indexOf(question.correctIndex),
  };
}
