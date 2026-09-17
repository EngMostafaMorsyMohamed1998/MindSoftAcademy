import { getChapter, getLesson, type ChapterId } from "@/lib/curriculum";
import { getFaizNote, type FaizUnitId } from "@/lib/faiz-notes";
import { notesForChapter } from "@/lib/lessons";

export type MindNode = {
  id: string;
  labelAr: string;
  labelEn: string;
  hintAr?: string;
  hintEn?: string;
  children: MindNode[];
};

export type MapRound = {
  nodeId: string;
  promptAr: string;
  promptEn: string;
  choicesAr: [string, string, string];
  choicesEn: [string, string, string];
  correct: 0 | 1 | 2;
};

export function mindMapForChapter(chapterId: ChapterId): MindNode | null {
  const chapter = getChapter(chapterId);
  if (!chapter) return null;
  const notes = notesForChapter(chapterId);
  return {
    id: `ch-${chapterId}`,
    labelAr: chapter.titleAr,
    labelEn: chapter.titleEn,
    hintAr: chapter.blurbAr,
    hintEn: chapter.blurbEn,
    children: notes.map((note) => {
      const lesson = getLesson(note.id);
      return {
        id: note.id,
        labelAr: lesson?.titleAr ?? note.id,
        labelEn: lesson?.titleEn ?? note.id,
        hintAr: note.takeawayAr,
        hintEn: note.takeawayEn,
        children: note.termsAr.map((term, index) => ({
          id: `${note.id}-t${index}`,
          labelAr: term.term,
          labelEn: note.termsEn[index]?.term ?? term.term,
          hintAr: term.meaning,
          hintEn: note.termsEn[index]?.meaning ?? term.meaning,
          children: [],
        })),
      };
    }),
  };
}

export function mindMapForFaiz(id: FaizUnitId): MindNode | null {
  const note = getFaizNote(id);
  if (!note) return null;
  return {
    id: `faiz-${id}`,
    labelAr: note.titleAr,
    labelEn: note.titleEn,
    hintAr: note.takeawayAr,
    hintEn: note.takeawayEn,
    children: note.sections.map((section, index) => ({
      id: `${id}-s${index}`,
      labelAr: section.headingAr,
      labelEn: section.headingEn,
      hintAr: section.bodyAr[0],
      hintEn: section.bodyEn[0],
      children:
        index === 0
          ? note.termsAr.map((term, termIndex) => ({
              id: `${id}-t${termIndex}`,
              labelAr: term.term,
              labelEn: note.termsEn[termIndex]?.term ?? term.term,
              hintAr: term.meaning,
              hintEn: note.termsEn[termIndex]?.meaning ?? term.meaning,
              children: [],
            }))
          : section.bodyAr.slice(0, 3).map((line, lineIndex) => ({
              id: `${id}-s${index}-l${lineIndex}`,
              labelAr: line.slice(0, 42),
              labelEn: (section.bodyEn[lineIndex] ?? line).slice(0, 42),
              hintAr: line,
              hintEn: section.bodyEn[lineIndex] ?? line,
              children: [],
            })),
    })),
  };
}

export function mindLeaves(root: MindNode): MindNode[] {
  const leaves: MindNode[] = [];
  for (const branch of root.children) {
    leaves.push(...branch.children);
  }
  return leaves;
}

function rotate<T>(items: T[], start: number): T[] {
  if (!items.length) return [];
  const index = ((start % items.length) + items.length) % items.length;
  return [...items.slice(index), ...items.slice(0, index)];
}

export function buildMapRounds(chapterId: ChapterId, size = 6): MapRound[] {
  const root = mindMapForChapter(chapterId);
  if (!root) return [];
  const leaves = mindLeaves(root);
  if (leaves.length < 3) return [];
  return rotate(leaves, chapterId.charCodeAt(0)).slice(0, Math.min(size, leaves.length)).map((leaf, round) => {
    const others = leaves.filter((item) => item.id !== leaf.id);
    const distractors = rotate(others, round + 1).slice(0, 2);
    const pool = rotate([leaf, ...distractors], round);
    const correct = pool.findIndex((item) => item.id === leaf.id) as 0 | 1 | 2;
    return {
      nodeId: leaf.id,
      promptAr: leaf.hintAr ? `إيه المصطلح؟ ${leaf.hintAr}` : "إيه المصطلح الناقص على الخريطة؟",
      promptEn: leaf.hintEn ? `Which term? ${leaf.hintEn}` : "Which term is missing on the map?",
      choicesAr: [pool[0]!.labelAr, pool[1]!.labelAr, pool[2]!.labelAr],
      choicesEn: [pool[0]!.labelEn, pool[1]!.labelEn, pool[2]!.labelEn],
      correct,
    };
  });
}
