import { LESSON_NOTES } from "@/lib/lessons";
import type { ChapterId } from "@/lib/curriculum";
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

export const LESSON_HOMEWORK_SIZE = 10;

function pushQuestion(bank: HomeworkQuestion[], question: HomeworkQuestion) {
  bank.push(question);
}

function buildBank(): HomeworkQuestion[] {
  const bank: HomeworkQuestion[] = [];

  for (const note of LESSON_NOTES) {
    const termsAr = note.termsAr;
    const termsEn = note.termsEn;
    termsAr.forEach((term, index) => {
      const en = termsEn[index] ?? { term: term.term, meaning: term.meaning };
      pushQuestion(bank, {
        id: `${note.id}-tf-${index}`,
        lessonId: note.id,
        chapterId: note.chapterId,
        kind: "tf",
        promptAr: `${term.term}: ${term.meaning}`,
        promptEn: `${en.term}: ${en.meaning}`,
        optionsAr: ["صح", "غلط"],
        optionsEn: ["True", "False"],
        correctIndex: 0,
      });
      const other = termsAr[(index + 1) % termsAr.length];
      const otherEn = termsEn[(index + 1) % Math.max(termsEn.length, 1)] ?? other;
      if (other && other.term !== term.term) {
        pushQuestion(bank, {
          id: `${note.id}-tf-x-${index}`,
          lessonId: note.id,
          chapterId: note.chapterId,
          kind: "tf",
          promptAr: `${term.term}: ${other.meaning}`,
          promptEn: `${en.term}: ${otherEn.meaning}`,
          optionsAr: ["صح", "غلط"],
          optionsEn: ["True", "False"],
          correctIndex: 1,
        });
      }
      const wrong = termsAr.filter((_, otherIndex) => otherIndex !== index).slice(0, 3);
      if (wrong.length === 3) {
        const optionsAr = [term.meaning, ...wrong.map((item) => item.meaning)];
        const optionsEn = [
          en.meaning,
          ...wrong.map((item) => {
            const match = termsEn.find((row) => row.term === item.term);
            return match?.meaning ?? item.meaning;
          }),
        ];
        pushQuestion(bank, {
          id: `${note.id}-mcq-${index}`,
          lessonId: note.id,
          chapterId: note.chapterId,
          kind: "mcq",
          promptAr: `ما معنى «${term.term}»؟`,
          promptEn: `What does “${en.term}” mean?`,
          optionsAr,
          optionsEn,
          correctIndex: 0,
        });
      }
    });

    pushQuestion(bank, {
      id: `${note.id}-take-tf`,
      lessonId: note.id,
      chapterId: note.chapterId,
      kind: "tf",
      promptAr: note.takeawayAr,
      promptEn: note.takeawayEn,
      optionsAr: ["صح", "غلط"],
      optionsEn: ["True", "False"],
      correctIndex: 0,
    });

    note.bodyAr.forEach((line, index) => {
      const lineEn = note.bodyEn[index] ?? line;
      pushQuestion(bank, {
        id: `${note.id}-body-${index}`,
        lessonId: note.id,
        chapterId: note.chapterId,
        kind: "tf",
        promptAr: line,
        promptEn: lineEn,
        optionsAr: ["صح", "غلط"],
        optionsEn: ["True", "False"],
        correctIndex: 0,
      });
    });
  }

  return bank;
}

const BANK = buildBank();

export function homeworkBankSize(): number {
  return BANK.length;
}

export function questionsForLesson(lessonId: string): HomeworkQuestion[] {
  return BANK.filter((item) => item.lessonId === lessonId);
}

export function pickLessonHomework(lessonId: string, seed: number): HomeworkQuestion[] {
  const pool = questionsForLesson(lessonId);
  return shuffled(pool, seed).slice(0, Math.min(LESSON_HOMEWORK_SIZE, pool.length));
}

export function withShuffledOptions(
  question: HomeworkQuestion,
  seed: number,
): HomeworkQuestion {
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
