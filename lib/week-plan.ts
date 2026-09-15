export type WeekSlot = {
  id: string;
  weekday: number;
  startTime: string;
  topic: string;
};

const DAY_AR = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const DAY_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function weekdayName(locale: "ar" | "en", weekday: number): string {
  const index = ((weekday % 7) + 7) % 7;
  return locale === "ar" ? DAY_AR[index] : DAY_EN[index];
}

export function parseWeekSlots(value: unknown): WeekSlot[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item, index) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Partial<WeekSlot>;
    const weekday = Number(row.weekday);
    const startTime = typeof row.startTime === "string" ? row.startTime : "";
    const topic = typeof row.topic === "string" ? row.topic.trim() : "";
    if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6 || !startTime || !topic) {
      return [];
    }
    return [
      {
        id: typeof row.id === "string" && row.id ? row.id : `slot-${index}`,
        weekday,
        startTime,
        topic,
      },
    ];
  });
}

export function sortWeekSlots(slots: WeekSlot[]): WeekSlot[] {
  return [...slots].sort((a, b) => a.weekday - b.weekday || a.startTime.localeCompare(b.startTime));
}
