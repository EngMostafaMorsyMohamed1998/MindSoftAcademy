import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

export type LeaderboardRow = {
  id: string;
  rank: number;
  name: string;
  points: number;
  /** Distinct capsules the student has attempted at least once. */
  completedCapsules: number;
  isCurrentUser: boolean;
};

export type LeaderboardData = {
  top: LeaderboardRow[];
  /** The signed-in student, even when they fall outside the top list. */
  currentUser: LeaderboardRow | null;
  totalStudents: number;
};

/** Distinct capsule counts keyed by user id. */
async function completedCapsulesByUser(
  userIds: string[],
): Promise<Map<string, number>> {
  if (userIds.length === 0) return new Map();

  // groupBy on the pair gives one row per (user, capsule), which is exactly
  // the distinct count we want once tallied per user.
  const pairs = await prisma.quizResult.groupBy({
    by: ["userId", "capsuleId"],
    where: { userId: { in: userIds } },
  });

  const counts = new Map<string, number>();
  for (const pair of pairs as { userId: string }[]) {
    counts.set(pair.userId, (counts.get(pair.userId) ?? 0) + 1);
  }
  return counts;
}

export async function getLeaderboard(limit = 10): Promise<LeaderboardData> {
  const [top, current, totalStudents] = await Promise.all([
    prisma.user.findMany({
      where: { role: "STUDENT" },
      orderBy: [{ points: "desc" }, { name: "asc" }],
      take: limit,
      select: { id: true, name: true, points: true },
    }),
    getCurrentUser(),
    prisma.user.count({ where: { role: "STUDENT" } }),
  ]);

  const ids = [...new Set([...top.map((user: { id: string }) => user.id), current?.id].filter(
    (id): id is string => typeof id === "string",
  ))];
  const completed = await completedCapsulesByUser(ids);

  const rows: LeaderboardRow[] = top.map((user: { id: string; name: string; points: number }, index: number) => ({
    id: user.id,
    rank: index + 1,
    name: user.name,
    points: user.points,
    completedCapsules: completed.get(user.id) ?? 0,
    isCurrentUser: user.id === current?.id,
  }));

  let currentRow = rows.find((row) => row.isCurrentUser) ?? null;

  if (!currentRow && current) {
    // Outside the top list: rank is everyone strictly ahead of them, plus one.
    const ahead = await prisma.user.count({
      where: { role: "STUDENT", points: { gt: current.points } },
    });
    currentRow = {
      id: current.id,
      rank: ahead + 1,
      name: current.name,
      points: current.points,
      completedCapsules: completed.get(current.id) ?? 0,
      isCurrentUser: true,
    };
  }

  return { top: rows, currentUser: currentRow, totalStudents };
}
