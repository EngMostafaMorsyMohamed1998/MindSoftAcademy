export type ClassRank = {
  id: string;
  name: string;
  points: number;
  rank: number;
};

export function buildClassRanks(
  codes: {
    id: string;
    name: string;
    points: number;
    usedAt?: string | null;
    suspendedAt?: string | null;
  }[],
): ClassRank[] {
  return codes
    .filter((row) => row.usedAt && !row.suspendedAt)
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name, "ar"))
    .map((row, index) => ({
      id: row.id,
      name: row.name,
      points: Math.max(0, row.points),
      rank: index + 1,
    }));
}

export function rankForStudent(rows: ClassRank[], studentId: string): ClassRank | null {
  return rows.find((row) => row.id === studentId) ?? null;
}
