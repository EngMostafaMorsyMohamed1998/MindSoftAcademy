import { CHAPTERS } from "../lib/curriculum";
import {
  bookletChapterPack,
  bookletFaizPacks,
  bookletHomeworkForChapter,
  bookletLessonPractice,
} from "../lib/booklet-pack";
import { questionsForLesson } from "../lib/homework-bank";
import { FAIZ_OBJECTIVES } from "../lib/faiz-exam";

let failed = 0;

function fail(message: string) {
  failed += 1;
  console.error(message);
}

for (const chapter of CHAPTERS) {
  const pack = bookletChapterPack(chapter);
  const homework = bookletHomeworkForChapter(chapter);
  pack.answerGroups.forEach((group, groupIndex) => {
    const lessonId = chapter.lessons[groupIndex]?.id;
    if (!lessonId) {
      fail(`chapter ${chapter.id} group ${groupIndex} has no lesson`);
      return;
    }
    const drills = bookletLessonPractice(lessonId);
    if (drills.length !== group.answers.length) {
      fail(`chapter ${chapter.id} lesson ${lessonId}: drills ${drills.length} vs key ${group.answers.length}`);
    }
    drills.forEach((row, index) => {
      const source = questionsForLesson(lessonId).find((item) => item.id === row.id);
      if (!source) {
        fail(`missing source ${row.id}`);
        return;
      }
      const sourceCorrect = source.optionsEn[source.correctIndex] ?? "";
      const marked = row.optionsEn[row.correctIndex] ?? "";
      if (marked !== sourceCorrect) {
        fail(`SHUFFLE ${row.id}: marked "${marked}" != source "${sourceCorrect}"`);
      }
      if (group.answers[index]?.id !== row.id) {
        fail(`KEY ORDER ${lessonId} #${index + 1}: ${group.answers[index]?.id} != ${row.id}`);
      }
      if (group.answers[index]?.index !== row.correctIndex) {
        fail(`KEY LETTER ${row.id}: ${group.answers[index]?.index} != ${row.correctIndex}`);
      }
      if (group.answers[index]?.choiceEn !== marked) {
        fail(`KEY CHOICE ${row.id}: "${group.answers[index]?.choiceEn}" != "${marked}"`);
      }
    });
  });
  homework.mcq.forEach((row, index) => {
    if (homework.answers[index]?.id !== row.id || homework.answers[index]?.index !== row.correctIndex) {
      fail(`homework key mismatch ${row.id}`);
    }
  });
}

for (const pack of bookletFaizPacks()) {
  pack.practice.forEach((row, index) => {
    const source = FAIZ_OBJECTIVES.find((item) => item.id === row.id);
    const sourceCorrect = source?.optionsEn?.[source.correctIndex] ?? "";
    const marked = row.optionsEn[row.correctIndex] ?? "";
    if (source && marked !== sourceCorrect) {
      fail(`FAIZ SHUFFLE ${row.id}: marked "${marked}" != source "${sourceCorrect}"`);
    }
    if (pack.answers[index]?.index !== row.correctIndex) {
      fail(`FAIZ KEY ${row.id}`);
    }
  });
}

if (failed) {
  console.error(`failed ${failed}`);
  process.exit(1);
}
console.log("booklet answer keys match their questions");
