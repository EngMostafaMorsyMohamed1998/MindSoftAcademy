export type ClassGroup = {
  id: string;
  name: string;
  weekday: number;
  startTime: string;
  place: string;
  nextLesson: string;
  studentIds: string[];
  remindedOn: string;
};

export function parseClassGroups(value: unknown): ClassGroup[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item, index) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Partial<ClassGroup> & { studentIds?: unknown };
    const name = String(row.name || "").trim();
    const weekday = Number(row.weekday);
    const startTime = String(row.startTime || "").trim();
    const place = String(row.place || "").trim();
    const nextLesson = String(row.nextLesson || "").trim();
    if (!name || !Number.isInteger(weekday) || weekday < 0 || weekday > 6 || !startTime) return [];
    const studentIds = parseStudentIds(row.studentIds);
    return [
      {
        id: typeof row.id === "string" && row.id ? row.id : `group-${index}`,
        name: name.slice(0, 80),
        weekday,
        startTime,
        place: place.slice(0, 80),
        nextLesson: nextLesson.slice(0, 160),
        studentIds,
        remindedOn: String(row.remindedOn || ""),
      },
    ];
  });
}

export function sortClassGroups(groups: ClassGroup[]): ClassGroup[] {
  return [...groups].sort((a, b) => a.weekday - b.weekday || a.startTime.localeCompare(b.startTime) || a.name.localeCompare(b.name, "ar"));
}

export function groupsOnWeekday(groups: ClassGroup[], weekday: number): ClassGroup[] {
  return sortClassGroups(groups.filter((row) => row.weekday === weekday));
}

export function groupsForStudent(groups: ClassGroup[], studentId: string): ClassGroup[] {
  return sortClassGroups(groups.filter((row) => row.studentIds.includes(studentId)));
}

function parseStudentIds(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((id) => String(id || "").trim()).filter(Boolean);
  if (typeof value !== "string" || !value.trim()) return [];
  const raw = value.trim();
  if (raw.startsWith("[")) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map((id) => String(id || "").trim()).filter(Boolean);
    } catch {
      // Fall through to comma-separated ids.
    }
  }
  return raw.split(",").map((id) => id.trim()).filter(Boolean);
}
