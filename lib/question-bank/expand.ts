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
  skipWhy: string,
  skipTerm: string,
): { ar: string; en: string }[] {
  const seen = new Set<string>();
  const rows: { ar: string; en: string }[] = [];
  for (const fact of facts) {
    if (fact.lessonId !== lessonId) continue;
    if (fact.termAr === skipTerm) continue;
    if (fact.whyAr === skipWhy || seen.has(fact.whyAr)) continue;
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
  skipScene: string,
  skipTerm: string,
): { ar: string; en: string }[] {
  const seen = new Set<string>();
  const rows: { ar: string; en: string }[] = [];
  for (const fact of facts) {
    if (fact.lessonId !== lessonId) continue;
    if (fact.termAr === skipTerm) continue;
    if (fact.sceneAr === skipScene || seen.has(fact.sceneAr)) continue;
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
      promptAr: `${fact.sceneAr} ما الإجابة الصحيحة؟`,
      promptEn: `${fact.sceneEn} What is the correct answer?`,
      optionsAr: [fact.claimAr, ...fact.wrongAr],
      optionsEn: [fact.claimEn, ...fact.wrongEn],
      correctIndex: 0,
    });

    bank.push({
      id: `${fact.id}-w`,
      lessonId: fact.lessonId,
      chapterId: fact.chapterId,
      kind: "mcq",
      promptAr: `${fact.sceneAr} أي إجابة خطأ؟`,
      promptEn: `${fact.sceneEn} Which answer is wrong?`,
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
        promptAr: `${fact.sceneAr} ما المصطلح الصحيح؟`,
        promptEn: `${fact.sceneEn} Which term is correct?`,
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

    const otherWhys = uniqueWhys(facts, fact.lessonId, 3, fact.whyAr, fact.termAr);
    if (otherWhys.length === 3) {
      bank.push({
        id: `${fact.id}-y`,
        lessonId: fact.lessonId,
        chapterId: fact.chapterId,
        kind: "mcq",
        promptAr: `لماذا الإجابة الصحيحة: «${fact.claimAr}»؟`,
        promptEn: `Why is this the correct answer: “${fact.claimEn}”?`,
        optionsAr: [fact.whyAr, otherWhys[0]!.ar, otherWhys[1]!.ar, otherWhys[2]!.ar],
        optionsEn: [fact.whyEn, otherWhys[0]!.en, otherWhys[1]!.en, otherWhys[2]!.en],
        correctIndex: 0,
      });
    }

    const otherScenes = uniqueScenes(facts, fact.lessonId, 3, fact.sceneAr, fact.termAr);
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
        promptAr: `ما المعنى الصحيح لمصطلح «${term.term}»؟`,
        promptEn: `What is the correct meaning of “${en.term}”?`,
        optionsAr: [term.meaning, ...pick.map((row) => row.ar.meaning)],
        optionsEn: [en.meaning, ...pick.map((row) => row.en.meaning)],
        correctIndex: 0,
      });
    });
  }

  return bank;
}

