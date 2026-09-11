/**
 * Adaptive Learning recommendations from a student's quiz history.
 *
 * Two entry points:
 * - `recommendTopics` ranks topics from a plain list of scores.
 * - `getRecommendedCapsule` reads the course sequence and the student's
 *   history from the database to pick the next capsule to study.
 */
import { prisma } from "@/lib/prisma";

/** A single quiz attempt for one topic. */
export type QuizResult = {
  topic: string;
  /** Score in the range 0–100. */
  scorePercentage: number;
};

export type RecommendationPriority = "high" | "medium" | "low";

export type TopicRecommendation = {
  topic: string;
  averageScore: number;
  attempts: number;
  /** high = below 60%, medium = 60–79%, low = 80%+. */
  priority: RecommendationPriority;
  reason: string;
};

const WEAK_THRESHOLD = 60;
const STRONG_THRESHOLD = 80;

function clampScore(score: number): number {
  if (!Number.isFinite(score)) return 0;
  return Math.min(100, Math.max(0, score));
}

function priorityForAverage(averageScore: number): RecommendationPriority {
  if (averageScore < WEAK_THRESHOLD) return "high";
  if (averageScore < STRONG_THRESHOLD) return "medium";
  return "low";
}

function reasonFor(priority: RecommendationPriority, averageScore: number, attempts: number): string {
  const rounded = Math.round(averageScore);
  if (priority === "high") {
    return `Average ${rounded}% across ${attempts} quiz${attempts === 1 ? "" : "zes"} — below ${WEAK_THRESHOLD}%, so this topic is the next focus.`;
  }
  if (priority === "medium") {
    return `Average ${rounded}% — passing, but still below mastery (${STRONG_THRESHOLD}%). Reinforce before moving on.`;
  }
  return `Average ${rounded}% — mastered. Keep it in rotation for light review only.`;
}

/**
 * Rank topics for the student's next study path.
 *
 * 1. Group every quiz by topic and take the mean score (several weak
 *    attempts on the same topic should not be hidden by one lucky result).
 * 2. Label priority from that mean: below 60% is high, 60–79% medium,
 *    80%+ low.
 * 3. Sort high → medium → low, and within a band sort by lowest average
 *    first so the weakest gap is always at the top of the list.
 */
export function recommendTopics(results: QuizResult[]): TopicRecommendation[] {
  const byTopic = new Map<
    string,
    { topic: string; total: number; attempts: number }
  >();

  for (const result of results) {
    const topic = result.topic.trim();
    if (!topic) continue;

    const key = topic.toLocaleLowerCase();
    const existing = byTopic.get(key);
    const score = clampScore(result.scorePercentage);

    if (existing) {
      existing.total += score;
      existing.attempts += 1;
    } else {
      // Keep the first spelling the student (or curriculum) used.
      byTopic.set(key, { topic, total: score, attempts: 1 });
    }
  }

  const ranked: TopicRecommendation[] = [];

  for (const { topic, total, attempts } of byTopic.values()) {
    const averageScore = total / attempts;
    const priority = priorityForAverage(averageScore);
    ranked.push({
      topic,
      averageScore,
      attempts,
      priority,
      reason: reasonFor(priority, averageScore, attempts),
    });
  }

  const bandOrder: Record<RecommendationPriority, number> = {
    high: 0,
    medium: 1,
    low: 2,
  };

  ranked.sort((a, b) => {
    const band = bandOrder[a.priority] - bandOrder[b.priority];
    if (band !== 0) return band;
    // Same band: weakest average first; tie-break on more evidence of struggle.
    if (a.averageScore !== b.averageScore) {
      return a.averageScore - b.averageScore;
    }
    return b.attempts - a.attempts;
  });

  return ranked;
}

/** Advance to new material, retry the same quiz, or go back and revise. */
export type RecommendationActionType = "ADVANCE" | "RETRY" | "REVISE";

export type CapsuleRecommendation = {
  /** Capsule to study next. `null` only when the course has been finished. */
  nextCapsuleId: string | null;
  recommendationMessage: string;
  actionType: RecommendationActionType;
};

const ADVANCE_THRESHOLD = 80;
const RETRY_THRESHOLD = 50;

/** 80%+ moves on, 50–79% repeats the same capsule, below 50% goes back. */
export function classifyScore(scorePercentage: number): RecommendationActionType {
  const score = clampScore(scorePercentage);
  if (score >= ADVANCE_THRESHOLD) return "ADVANCE";
  if (score >= RETRY_THRESHOLD) return "RETRY";
  return "REVISE";
}

/** Best percentage the student has reached on each capsule of a course. */
async function bestScoresByCapsule(
  userId: string,
  capsuleIds: string[],
): Promise<Map<string, number>> {
  const attempts = await prisma.quizResult.findMany({
    where: { userId, capsuleId: { in: capsuleIds } },
    select: { capsuleId: true, score: true, totalQuestions: true },
  });

  const best = new Map<string, number>();
  for (const attempt of attempts) {
    if (attempt.totalQuestions <= 0) continue;
    const percentage = (attempt.score / attempt.totalQuestions) * 100;
    const previous = best.get(attempt.capsuleId);
    if (previous === undefined || percentage > previous) {
      best.set(attempt.capsuleId, percentage);
    }
  }
  return best;
}

/**
 * Pick the next capsule for a student after an attempt.
 *
 * The course's capsules are treated as an ordered syllabus (creation order).
 * On a weak score we walk *back* through that order and return the earliest
 * capsule the student has not yet mastered, since an unresolved gap earlier
 * in the sequence is usually what caused the low score.
 */
export async function getRecommendedCapsule(
  userId: string,
  currentCapsuleId: string,
  scorePercentage: number,
): Promise<CapsuleRecommendation> {
  const actionType = classifyScore(scorePercentage);

  const capsule = await prisma.capsule.findUnique({
    where: { id: currentCapsuleId },
    select: {
      id: true,
      title: true,
      course: {
        select: {
          title: true,
          capsules: {
            orderBy: { createdAt: "asc" },
            select: { id: true, title: true },
          },
        },
      },
    },
  });

  if (!capsule) {
    return {
      nextCapsuleId: null,
      recommendationMessage:
        "We could not find that capsule, so there is no recommendation to make.",
      actionType,
    };
  }

  const sequence = capsule.course.capsules;
  const index = sequence.findIndex((item) => item.id === capsule.id);

  if (actionType === "ADVANCE") {
    const next = index >= 0 ? sequence[index + 1] : undefined;
    if (!next) {
      return {
        nextCapsuleId: null,
        recommendationMessage: `Excellent — you have finished every capsule in ${capsule.course.title}. Pick a new subject to keep your streak alive.`,
        actionType,
      };
    }
    return {
      nextCapsuleId: next.id,
      recommendationMessage: `Strong pass on "${capsule.title}". You are ready for "${next.title}".`,
      actionType,
    };
  }

  if (actionType === "RETRY") {
    return {
      nextCapsuleId: capsule.id,
      recommendationMessage: `You passed "${capsule.title}" but not comfortably. Review the capsule summary and retake the quiz to lock it in.`,
      actionType,
    };
  }

  // REVISE: look for the earliest unmastered prerequisite before this capsule.
  const earlier = index > 0 ? sequence.slice(0, index) : [];
  const best = await bestScoresByCapsule(
    userId,
    earlier.map((item) => item.id),
  );
  const weakest = earlier.find(
    (item) => (best.get(item.id) ?? 0) < ADVANCE_THRESHOLD,
  );

  if (weakest) {
    return {
      nextCapsuleId: weakest.id,
      recommendationMessage: `"${capsule.title}" needs firmer foundations. Go back to "${weakest.title}" first, then try this quiz again.`,
      actionType,
    };
  }

  return {
    nextCapsuleId: capsule.id,
    recommendationMessage: `This is early in ${capsule.course.title}. Rewatch "${capsule.title}" from the start and work through the examples before retrying.`,
    actionType,
  };
}
