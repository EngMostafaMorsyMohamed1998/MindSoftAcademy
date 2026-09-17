import { getLesson, type ChapterId } from "@/lib/curriculum";
import type { HomeworkQuestion } from "@/lib/homework-bank";
import { LESSON_NOTES } from "@/lib/lessons";

export type ClassLessonExample = {
  id: string;
  lessonId: string;
  bodyAr: string;
  bodyEn: string;
  createdAt: string;
};

const PAD_AR = [
  "السحابة أسرع من الجهاز نفسه في كل الحالات.",
  "التشفير يعني تلوين الشاشة.",
  "الواجب يتسلم من غير ما تقرأ الدرس.",
];

const PAD_EN = [
  "The cloud is always faster than the device itself.",
  "Encryption means colouring the screen.",
  "Homework can be submitted without reading the lesson.",
];

export function parseClassExamples(value: unknown): ClassLessonExample[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item, index) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Partial<ClassLessonExample>;
    const bodyAr = String(row.bodyAr || "").replace(/\s+/g, " ").trim();
    if (!bodyAr) return [];
    const lessonId = String(row.lessonId || "").trim();
    if (!getLesson(lessonId)) return [];
    const bodyEn = String(row.bodyEn || "").replace(/\s+/g, " ").trim() || bodyAr;
    return [
      {
        id: typeof row.id === "string" && row.id ? row.id : `example-${index}`,
        lessonId,
        bodyAr: bodyAr.slice(0, 220),
        bodyEn: bodyEn.slice(0, 220),
        createdAt: String(row.createdAt || new Date().toISOString()),
      },
    ];
  });
}

function distractors(examples: ClassLessonExample[], current: ClassLessonExample, ar: boolean): string[] {
  const fromClass = examples
    .filter((row) => row.id !== current.id)
    .map((row) => (ar ? row.bodyAr : row.bodyEn || row.bodyAr));
  const fromNotes = LESSON_NOTES.filter((note) => note.id !== current.lessonId).flatMap((note) =>
    ar ? [note.takeawayAr, note.bodyAr[0] ?? ""] : [note.takeawayEn, note.bodyEn[0] ?? ""],
  );
  const pad = ar ? PAD_AR : PAD_EN;
  const uniq = [...new Set([...fromClass, ...fromNotes, ...pad])].filter(
    (line) => line && line !== (ar ? current.bodyAr : current.bodyEn || current.bodyAr),
  );
  return uniq.slice(0, 3);
}

export function questionsFromExamples(
  examples: ClassLessonExample[],
  lessonId: string,
): HomeworkQuestion[] {
  const lesson = getLesson(lessonId);
  if (!lesson) return [];
  const chapterId = lesson.chapterId as ChapterId;
  const latest = examples
    .filter((row) => row.lessonId === lessonId)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))[0];
  if (!latest) return [];

  const tf: HomeworkQuestion = {
    id: `ex-${latest.id}-tf`,
    lessonId,
    chapterId,
    kind: "tf",
    promptAr: `المدرس قال في الحصة: «${latest.bodyAr}» — هل هذا من درس اليوم؟`,
    promptEn: `The teacher said in class: “${latest.bodyEn || latest.bodyAr}” — is this from today’s lesson?`,
    optionsAr: ["صح", "غلط"],
    optionsEn: ["True", "False"],
    correctIndex: 0,
  };

  const wrongAr = distractors(examples, latest, true);
  const wrongEn = distractors(examples, latest, false);
  if (wrongAr.length < 3 || wrongEn.length < 3) return [tf];

  const mcq: HomeworkQuestion = {
    id: `ex-${latest.id}-mcq`,
    lessonId,
    chapterId,
    kind: "mcq",
    promptAr: "أي جملة قالها المدرس في الحصة عن هذا الدرس؟",
    promptEn: "Which sentence did the teacher say in class about this lesson?",
    optionsAr: [latest.bodyAr, ...wrongAr],
    optionsEn: [latest.bodyEn || latest.bodyAr, ...wrongEn],
    correctIndex: 0,
  };

  return [mcq, tf];
}
