import { LESSON_NOTES } from "@/lib/lessons";
import type { ChapterId } from "@/lib/curriculum";
import { explainsForLesson } from "@/lib/lesson-explains";
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
  if (bank.some((row) => row.id === question.id)) return;
  bank.push(question);
}

function firstClause(text: string): string {
  const cut = text.split(/(?<=[.!?؟])\s+/)[0]?.trim() ?? text.trim();
  return cut;
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
          promptAr: `ما معنى «${term.term}»؟`,
          promptEn: `What does “${en.term}” mean?`,
          optionsAr: [term.meaning, ...others.slice(0, 3).map((row) => row.ar.meaning)],
          optionsEn: [en.meaning, ...others.slice(0, 3).map((row) => row.en.meaning)],
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
      promptAr: `هل هذه الخلاصة صحيحة؟ ${note.takeawayAr}`,
      promptEn: `Is this takeaway true? ${note.takeawayEn}`,
      optionsAr: ["صح", "غلط"],
      optionsEn: ["True", "False"],
      correctIndex: 0,
    });

    note.bodyAr.forEach((line, index) => {
      const en = note.bodyEn[index] ?? line;
      pushQuestion(bank, {
        id: `${note.id}-body-tf-${index}`,
        lessonId: note.id,
        chapterId: note.chapterId,
        kind: "tf",
        promptAr: `هل هذه الجملة من المنهج صحيحة؟ ${line}`,
        promptEn: `Is this syllabus sentence true? ${en}`,
        optionsAr: ["صح", "غلط"],
        optionsEn: ["True", "False"],
        correctIndex: 0,
      });
    });
  }

  for (const note of LESSON_NOTES) {
    const explains = explainsForLesson(note.id);
    explains.forEach((item, index) => {
      pushQuestion(bank, {
        id: `${note.id}-ex-tf-${index}`,
        lessonId: note.id,
        chapterId: note.chapterId,
        kind: "tf",
        promptAr: `هل صحيح أن «${item.termAr}» يعني: ${firstClause(item.bodyAr)}؟`,
        promptEn: `Is it true that “${item.termEn}” means: ${firstClause(item.bodyEn)}?`,
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

export function questionsForChapter(chapterId: ChapterId): HomeworkQuestion[] {
  return BANK.filter((item) => item.chapterId === chapterId);
}

function isCurriculumMcq(question: HomeworkQuestion): boolean {
  return question.kind === "mcq" && /[-]mcq-\d+$/.test(question.id);
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
  let mix = seed + 17;
  for (const ch of question.id) mix = (mix * 33 + ch.charCodeAt(0)) >>> 0;
  const order = shuffled(
    question.optionsAr.map((_, index) => index),
    mix,
  );
  return {
    ...question,
    optionsAr: order.map((index) => question.optionsAr[index]!),
    optionsEn: order.map((index) => question.optionsEn[index]!),
    correctIndex: order.indexOf(question.correctIndex),
  };
}
