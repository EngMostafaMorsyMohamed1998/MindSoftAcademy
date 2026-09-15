import { EXTRA_HOMEWORK } from "@/lib/homework-extra";
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

export const LESSON_HOMEWORK_SIZE = 15;
export const MAKEUP_HOMEWORK_SIZE = 5;

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
        promptAr: `هل هذا صحيح؟ «${term.term}» ${term.meaning}`,
        promptEn: `Is this true? “${en.term}” ${en.meaning}`,
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
          promptAr: `هل هذا صحيح؟ «${term.term}» ${other.meaning}`,
          promptEn: `Is this true? “${en.term}” ${otherEn.meaning}`,
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
        pushQuestion(bank, {
          id: `${note.id}-mcq-term-${index}`,
          lessonId: note.id,
          chapterId: note.chapterId,
          kind: "mcq",
          promptAr: `أي مصطلح يطابق هذا المعنى: «${term.meaning}»؟`,
          promptEn: `Which term matches this meaning: “${en.meaning}”?`,
          optionsAr: [term.term, ...wrong.map((item) => item.term)],
          optionsEn: [
            en.term,
            ...wrong.map((item) => {
              const match = termsEn.find((row) => row.term === item.term);
              return match?.term ?? item.term;
            }),
          ],
          correctIndex: 0,
        });
      }
      const farther = termsAr[(index + 2) % termsAr.length];
      const fartherEn = termsEn[(index + 2) % Math.max(termsEn.length, 1)] ?? farther;
      if (farther && farther.term !== term.term && farther.term !== other?.term) {
        pushQuestion(bank, {
          id: `${note.id}-tf-x2-${index}`,
          lessonId: note.id,
          chapterId: note.chapterId,
          kind: "tf",
          promptAr: `هل هذا صحيح؟ «${term.term}» ${farther.meaning}`,
          promptEn: `Is this true? “${en.term}” ${fartherEn.meaning}`,
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
      promptAr: note.takeawayAr,
      promptEn: note.takeawayEn,
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
        promptAr: `هل هذه فكرة هذا الدرس؟ ${otherNote.takeawayAr}`,
        promptEn: `Is this the idea of this lesson? ${otherNote.takeawayEn}`,
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
        promptAr: line,
        promptEn: lineEn,
        optionsAr: ["صح", "غلط"],
        optionsEn: ["True", "False"],
        correctIndex: 0,
      });
    });
  }

  for (const extra of EXTRA_HOMEWORK) {
    pushQuestion(bank, extra);
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

export function questionsForChapter(chapterId: ChapterId): HomeworkQuestion[] {
  return BANK.filter((item) => item.chapterId === chapterId);
}

export function pickLessonHomework(
  lessonId: string,
  seed: number,
  size = LESSON_HOMEWORK_SIZE,
): HomeworkQuestion[] {
  const pool = questionsForLesson(lessonId);
  return shuffled(pool, seed).slice(0, Math.min(size, pool.length));
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
