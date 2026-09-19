import { termArt } from "../lib/booklet-lang";
import { explainsForLesson } from "../lib/lesson-explains";
import { LESSON_NOTES } from "../lib/lessons";
import { CHAPTER_1_FACTS } from "../lib/question-bank/chapter-1";
import { expandFactsToHomework } from "../lib/question-bank/expand";

const EXPECTED: Record<string, string> = {
  AI: "ai",
  "الذكاء الاصطناعي": "ai",
  "Machine learning": "ml",
  "التعلم الآلي": "ml",
  "Deep learning": "neural",
  "التعلم العميق": "neural",
  "Generative AI": "llm",
  "الذكاء التوليدي": "llm",
  "Moore's Law": "lab",
  "قانون مور": "lab",
  "Cloud computing": "cloud",
  "الحوسبة السحابية": "cloud",
  "Edge computing": "edge",
  "الحوسبة الطرفية": "edge",
  "AR / VR": "arvr",
  "الواقع المعزز / الافتراضي": "arvr",
  Bias: "ethics",
  التحيز: "ethics",
  Encryption: "lock",
  التشفير: "lock",
  Firewall: "firewall",
  "جدار الحماية": "firewall",
  HTML: "html",
  "هيكل الصفحة": "html",
  Database: "data",
  "قاعدة البيانات": "data",
  UX: "ux",
  "تجربة المستخدم": "ux",
  LLM: "llm",
  "نموذج لغة كبير": "llm",
};

let failed = 0;

for (const note of LESSON_NOTES) {
  note.termsEn.forEach((term, index) => {
    const ar = note.termsAr[index];
    const enArt = termArt(term.term, term.meaning);
    const arArt = ar ? termArt(ar.term, ar.meaning) : enArt;
    if (enArt === "chart" && /\b(machine learning|neural|deep learning|\bai\b|ذكاء|تعلم)\b/i.test(`${term.term} ${term.meaning}`)) {
      console.error(`ML/AI term mapped to chart: ${term.term}`);
      failed += 1;
    }
    if (EXPECTED[term.term] && EXPECTED[term.term] !== enArt) {
      console.error(`${term.term}: got ${enArt}, expected ${EXPECTED[term.term]}`);
      failed += 1;
    }
    if (ar && EXPECTED[ar.term] && EXPECTED[ar.term] !== arArt) {
      console.error(`${ar.term}: got ${arArt}, expected ${EXPECTED[ar.term]}`);
      failed += 1;
    }
    if (ar && enArt !== arArt) {
      console.error(`AR/EN art mismatch for ${term.term} / ${ar.term}: ${enArt} vs ${arArt}`);
      failed += 1;
    }
  });
  const explains = explainsForLesson(note.id);
  for (const term of note.termsAr) {
    if (!explains.some((item) => item.termAr === term.term)) {
      console.error(`${note.id}: missing explanation for ${term.term}`);
      failed += 1;
    }
  }
  for (const term of note.termsEn) {
    if (!explains.some((item) => item.termEn === term.term)) {
      console.error(`${note.id}: missing explanation for ${term.term}`);
      failed += 1;
    }
  }
}

const termQuestion = expandFactsToHomework(CHAPTER_1_FACTS).find((row) => row.id === "1-1-f07-t");
if (!termQuestion) {
  console.error("missing 1-1-f07-t");
  failed += 1;
} else {
  const answer = termQuestion.optionsEn[termQuestion.correctIndex];
  if (answer !== "Moore's Law") {
    console.error(`1-1-f07-t answer is ${answer}`);
    failed += 1;
  }
  if (!/stronger|laptop|transistor/i.test(termQuestion.promptEn)) {
    console.error("1-1-f07-t prompt is still unclear");
    failed += 1;
  }
  const moveQuestion = expandFactsToHomework(CHAPTER_1_FACTS).find((row) => row.id === "1-1-f07-c");
  if (!moveQuestion || !/Moore's Law/i.test(moveQuestion.optionsEn[moveQuestion.correctIndex] ?? "")) {
    console.error("1-1-f07-c correct answer is unclear");
    failed += 1;
  }
}

const moore = explainsForLesson("1-1").find((item) => item.termAr === "قانون مور");
if (!moore || !/ترانزستور|كل سنتين/.test(moore.bodyAr)) {
  console.error("lesson 1-1 is missing a full Moore's Law explanation");
  failed += 1;
}

if (failed) {
  console.error(`failed: ${failed}`);
  process.exit(1);
}

console.log(`ok: ${LESSON_NOTES.length} lessons, Moore's Law explained, 1-1-f07-t has Moore's Law`);
