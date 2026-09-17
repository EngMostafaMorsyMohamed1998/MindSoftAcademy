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
  options?: { requireUsed?: boolean },
): ClassRank[] {
  const requireUsed = options?.requireUsed !== false;
  return codes
    .filter((row) => !row.suspendedAt && (!requireUsed || row.usedAt))
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

export function buildGroupRanks(
  codes: {
    id: string;
    name: string;
    points: number;
    usedAt?: string | null;
    suspendedAt?: string | null;
  }[],
  studentIds: string[],
): ClassRank[] {
  const allowed = new Set(studentIds);
  return buildClassRanks(
    codes.filter((row) => allowed.has(row.id)),
    { requireUsed: false },
  );
}
