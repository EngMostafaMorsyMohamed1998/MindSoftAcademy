import { LESSON_NOTES } from "../lib/lessons";
import { EXTRA_HOMEWORK } from "../lib/homework-extra";
import { questionsForLesson, LESSON_HOMEWORK_SIZE, pickLessonHomework } from "../lib/homework-bank";
import { examForChapter, EXAM_OBJECTIVE_COUNT } from "../lib/exams";
import { CHAPTERS } from "../lib/curriculum";

const problems: string[] = [];

for (const note of LESSON_NOTES) {
  const pool = questionsForLesson(note.id);
  if (pool.length < LESSON_HOMEWORK_SIZE) {
    problems.push(`${note.id}: only ${pool.length} curriculum questions`);
  }
  const picked = pickLessonHomework(note.id, 1);
  if (picked.length < LESSON_HOMEWORK_SIZE) {
    problems.push(`${note.id}: homework pick ${picked.length}`);
  }
  for (const question of pool) {
    if (question.kind === "mcq" && question.optionsAr.length < 2) {
      problems.push(`${question.id}: few options`);
    }
    if (question.correctIndex < 0 || question.correctIndex >= question.optionsAr.length) {
      problems.push(`${question.id}: bad correctIndex`);
    }
    if (/Situation:|ما التصرف|right move|في المنهج|حسب المنهج|in the lesson|خلاصة هذا الدرس/i.test(`${question.promptAr} ${question.promptEn}`)) {
      problems.push(`${question.id}: leftover wording`);
    }
    if (question.id.includes("-n-not-") || question.id.includes("-take-x")) {
      problems.push(`${question.id}: confusing generated question`);
    }
  }
}

for (const extra of EXTRA_HOMEWORK) {
  if (extra.correctIndex < 0 || extra.correctIndex >= extra.optionsAr.length) {
    problems.push(`${extra.id}: bad correctIndex`);
  }
}

for (const chapter of CHAPTERS) {
  const exam = examForChapter(chapter.id, 1);
  if (!exam || exam.objectives.length < EXAM_OBJECTIVE_COUNT) {
    problems.push(`exam ${chapter.id}: ${exam?.objectives.length ?? 0} objectives`);
  }
}

if (problems.length) {
  console.error(problems.join("\n"));
  console.error(`\nfailed: ${problems.length}`);
  process.exit(1);
}

console.log(
  `ok: ${LESSON_NOTES.length} lessons, extras ${EXTRA_HOMEWORK.length}, homework ${LESSON_HOMEWORK_SIZE}`,
);
