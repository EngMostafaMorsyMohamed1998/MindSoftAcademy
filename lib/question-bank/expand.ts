import type { ChapterId } from "@/lib/curriculum";
import { LESSON_NOTES } from "@/lib/lessons";
import type { BankFact } from "@/lib/question-bank/types";

export type ExpandedMcq = {
  id: string;
  lessonId: string;
  chapterId: ChapterId;
  kind: "mcq";
  promptAr: string;
  promptEn: string;
  optionsAr: string[];
  optionsEn: string[];
  correctIndex: number;
};

function uniqueTerms(
  facts: BankFact[],
  lessonId: string,
  take: number,
  skip: string,
): string[] {
  const seen = new Set<string>();
  const terms: string[] = [];
  for (const fact of facts) {
    if (fact.lessonId !== lessonId) continue;
    if (fact.termAr === skip || seen.has(fact.termAr)) continue;
    seen.add(fact.termAr);
    terms.push(fact.termAr);
    if (terms.length >= take) break;
  }
  return terms;
}

function uniqueWhys(
  facts: BankFact[],
  lessonId: string,
  take: number,
  skip: string,
): { ar: string; en: string }[] {
  const seen = new Set<string>();
  const rows: { ar: string; en: string }[] = [];
  for (const fact of facts) {
    if (fact.lessonId !== lessonId) continue;
    if (fact.whyAr === skip || seen.has(fact.whyAr)) continue;
    seen.add(fact.whyAr);
    rows.push({ ar: fact.whyAr, en: fact.whyEn });
    if (rows.length >= take) break;
  }
  return rows;
}

function uniqueScenes(
  facts: BankFact[],
  lessonId: string,
  take: number,
  skip: string,
): { ar: string; en: string }[] {
  const seen = new Set<string>();
  const rows: { ar: string; en: string }[] = [];
  for (const fact of facts) {
    if (fact.lessonId !== lessonId) continue;
    if (fact.sceneAr === skip || seen.has(fact.sceneAr)) continue;
    seen.add(fact.sceneAr);
    rows.push({ ar: fact.sceneAr, en: fact.sceneEn });
    if (rows.length >= take) break;
  }
  return rows;
}

function termEnFor(facts: BankFact[], lessonId: string, termAr: string): string {
  return facts.find((fact) => fact.lessonId === lessonId && fact.termAr === termAr)?.termEn ?? termAr;
}

export function expandFactsToHomework(facts: BankFact[]): ExpandedMcq[] {
  const bank: ExpandedMcq[] = [];

  for (const fact of facts) {
    bank.push({
      id: `${fact.id}-c`,
      lessonId: fact.lessonId,
      chapterId: fact.chapterId,
      kind: "mcq",
      promptAr: `الموقف: ${fact.sceneAr} ما التصرف الصحيح؟`,
      promptEn: `Situation: ${fact.sceneEn} What is the right move?`,
      optionsAr: [fact.claimAr, ...fact.wrongAr],
      optionsEn: [fact.claimEn, ...fact.wrongEn],
      correctIndex: 0,
    });

    bank.push({
      id: `${fact.id}-w`,
      lessonId: fact.lessonId,
      chapterId: fact.chapterId,
      kind: "mcq",
      promptAr: `الموقف: ${fact.sceneAr} أي تصرف خطأ؟`,
      promptEn: `Situation: ${fact.sceneEn} Which move is wrong?`,
      optionsAr: [fact.wrongAr[0], fact.claimAr, fact.wrongAr[1], fact.wrongAr[2]],
      optionsEn: [fact.wrongEn[0], fact.claimEn, fact.wrongEn[1], fact.wrongEn[2]],
      correctIndex: 0,
    });

    const otherTerms = uniqueTerms(facts, fact.lessonId, 3, fact.termAr);
    if (otherTerms.length === 3) {
      bank.push({
        id: `${fact.id}-t`,
        lessonId: fact.lessonId,
        chapterId: fact.chapterId,
        kind: "mcq",
        promptAr: `الموقف: ${fact.sceneAr} ما المصطلح الأنسب؟`,
        promptEn: `Situation: ${fact.sceneEn} Which term fits best?`,
        optionsAr: [fact.termAr, otherTerms[0]!, otherTerms[1]!, otherTerms[2]!],
        optionsEn: [
          fact.termEn,
          termEnFor(facts, fact.lessonId, otherTerms[0]!),
          termEnFor(facts, fact.lessonId, otherTerms[1]!),
          termEnFor(facts, fact.lessonId, otherTerms[2]!),
        ],
        correctIndex: 0,
      });
    }

    const otherWhys = uniqueWhys(facts, fact.lessonId, 3, fact.whyAr);
    if (otherWhys.length === 3) {
      bank.push({
        id: `${fact.id}-y`,
        lessonId: fact.lessonId,
        chapterId: fact.chapterId,
        kind: "mcq",
        promptAr: `لماذا نختار هذا الحل: «${fact.claimAr}»؟`,
        promptEn: `Why choose this solution: “${fact.claimEn}”?`,
        optionsAr: [fact.whyAr, otherWhys[0]!.ar, otherWhys[1]!.ar, otherWhys[2]!.ar],
        optionsEn: [fact.whyEn, otherWhys[0]!.en, otherWhys[1]!.en, otherWhys[2]!.en],
        correctIndex: 0,
      });
    }

    const otherScenes = uniqueScenes(facts, fact.lessonId, 3, fact.sceneAr);
    if (otherScenes.length === 3) {
      bank.push({
        id: `${fact.id}-s`,
        lessonId: fact.lessonId,
        chapterId: fact.chapterId,
        kind: "mcq",
        promptAr: `أي موقف يناسب مصطلح «${fact.termAr}»؟`,
        promptEn: `Which situation matches “${fact.termEn}”?`,
        optionsAr: [fact.sceneAr, otherScenes[0]!.ar, otherScenes[1]!.ar, otherScenes[2]!.ar],
        optionsEn: [fact.sceneEn, otherScenes[0]!.en, otherScenes[1]!.en, otherScenes[2]!.en],
        correctIndex: 0,
      });
    }
  }

  return bank;
}

export function expandNotesToHomework(): ExpandedMcq[] {
  const bank: ExpandedMcq[] = [];

  for (const note of LESSON_NOTES) {
    note.termsAr.forEach((term, index) => {
      const en = note.termsEn[index] ?? { term: term.term, meaning: term.meaning };
      const others = note.termsAr
        .map((item, otherIndex) => ({
          ar: item,
          en: note.termsEn[otherIndex] ?? item,
          otherIndex,
        }))
        .filter((row) => row.otherIndex !== index);
      if (others.length < 3) return;
      const pick = others.slice(0, 3);

      bank.push({
        id: `${note.id}-n-best-${index}`,
        lessonId: note.id,
        chapterId: note.chapterId,
        kind: "mcq",
        promptAr: `أي اختيار يصف «${term.term}» بدقة؟`,
        promptEn: `Which choice describes “${en.term}” accurately?`,
        optionsAr: [term.meaning, ...pick.map((row) => row.ar.meaning)],
        optionsEn: [en.meaning, ...pick.map((row) => row.en.meaning)],
        correctIndex: 0,
      });

      bank.push({
        id: `${note.id}-n-not-${index}`,
        lessonId: note.id,
        chapterId: note.chapterId,
        kind: "mcq",
        promptAr: `أي معنى لا يناسب «${term.term}»؟`,
        promptEn: `Which meaning does not fit “${en.term}”?`,
        optionsAr: [pick[0]!.ar.meaning, term.meaning, pick[1]!.ar.meaning, pick[2]!.ar.meaning],
        optionsEn: [pick[0]!.en.meaning, en.meaning, pick[1]!.en.meaning, pick[2]!.en.meaning],
        correctIndex: 0,
      });
    });
  }

  return bank;
}

