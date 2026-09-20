import { lessonArtMap, termArt } from "../lib/booklet-lang";
import { bookletLessonPack, bookletLessonScenes } from "../lib/booklet-pack";
import { explainsForLesson } from "../lib/lesson-explains";
import { LESSON_NOTES } from "../lib/lessons";
import { CHAPTER_1_FACTS } from "../lib/question-bank/chapter-1";
import { expandFactsToHomework } from "../lib/question-bank/expand";

const EXPECTED: Record<string, string> = {
  AI: "ai",
  "Artificial Intelligence (AI)": "ai",
  "الذكاء الاصطناعي": "ai",
  "Machine learning": "ml",
  "التعلم الآلي": "ml",
  "Deep learning": "neural",
  "التعلم العميق": "neural",
  "Generative AI": "llm",
  "الذكاء التوليدي": "llm",
  Hallucination: "incident",
  الهلوسة: "incident",
  "Moore's Law": "lab",
  "قانون مور": "lab",
  "Electronic computer": "lab",
  "الحاسوب الإلكتروني": "lab",
  "Personal computer": "lab",
  "الحاسوب الشخصي": "lab",
  "Internet and the web": "web",
  "الإنترنت والويب": "web",
  Smartphones: "arvr",
  "الهواتف الذكية": "arvr",
  "Stages of IT": "lab",
  "مراحل تطور تقنية المعلومات": "lab",
  "Cloud computing": "cloud",
  "الحوسبة السحابية": "cloud",
  "Edge computing": "edge",
  "الحوسبة الطرفية": "edge",
  "AR / VR": "arvr",
  "الواقع المعزز / الافتراضي": "arvr",
  Bias: "ethics",
  التحيز: "ethics",
  "Narrow AI": "narrow",
  "الذكاء الضيق": "narrow",
  Recommender: "rec",
  "نظام توصية": "rec",
  "Predictive maintenance": "maintain",
  "صيانة تنبؤية": "maintain",
  Privacy: "lock",
  الخصوصية: "lock",
  Transparency: "glass",
  الشفافية: "glass",
  Accountability: "account",
  المساءلة: "account",
  Hallucination: "incident",
  هلوسة: "incident",
  الهلوسة: "incident",
  Deepfake: "fake",
  "التزييف العميق": "fake",
  Impersonation: "mask",
  "انتحال الهوية": "mask",
  Asymmetric: "asymmetric",
  "غير متماثل": "asymmetric",
  "Digital certificate": "cert",
  "شهادة رقمية": "cert",
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

for (const note of LESSON_NOTES) {
  if (!bookletLessonPack(note.id)) {
    console.error(`missing lesson pack ${note.id}`);
    failed += 1;
  }
  const scenes = bookletLessonScenes(note.id);
  const terms = scenes.map((scene) => scene.termEn);
  if (new Set(terms).size !== terms.length) {
    console.error(`lesson ${note.id} repeats a scene term: ${terms.join(", ")}`);
    failed += 1;
  }
  if (note.id === "2-1" && scenes.length < 4) {
    console.error(`lesson 2-1 has ${scenes.length} scenes: ${terms.join(", ")}`);
    failed += 1;
  }
}

for (const note of LESSON_NOTES) {
  const map = lessonArtMap(note.termsEn.map((term) => ({ term: term.term, meaning: term.meaning })));
  const arts = note.termsEn.map((term) => `${term.term}:${map.get(term.term.trim().toLowerCase())}`);
  const kinds = arts.map((row) => row.split(":")[1]);
  if (new Set(kinds).size !== kinds.length) {
    console.error(`${note.id} shares a picture on the same page: ${arts.join(" | ")}`);
    failed += 1;
  }
}

const pairs: [string, string][] = [
  ["Generative AI", "Hallucination"],
  ["Cloud computing", "Edge computing"],
  ["Privacy", "Accountability"],
  ["Privacy", "Transparency"],
  ["Accountability", "Transparency"],
  ["Bias", "Privacy"],
  ["Impersonation", "Encryption"],
  ["Impersonation", "Incident"],
  ["Impersonation", "Symmetric encryption"],
  ["Symmetric encryption", "Asymmetric encryption"],
  ["Digital certificate", "Impersonation"],
];

if (termArt("Impersonation", "An encrypted message claims to be from the class tutor") !== "mask") {
  console.error("Impersonation scene still uses the lock picture");
  failed += 1;
}
for (const [left, right] of pairs) {
  const a = termArt(left);
  const b = termArt(right);
  if (a === b) {
    console.error(`${left} and ${right} share picture ${a}`);
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
