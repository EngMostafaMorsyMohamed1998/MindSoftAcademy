export const PRESENCE_STALE_MS = 45_000;

export type PresenceScreen = "exam" | "game" | "elsewhere";

export type PresencePing = {
  studentId: string;
  name: string;
  path: string;
  screen: PresenceScreen;
  at: string;
};

export function screenFromPath(path: string): PresenceScreen {
  if (/\/dashboard\/exam(\/|$)/.test(path) || path.includes("exam-simulator")) return "exam";
  if (path.includes("/dashboard/games") || path.includes("/dashboard/arena")) return "game";
  return "elsewhere";
}

export function parsePresence(value: unknown): PresencePing[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as PresencePing;
    if (typeof row.studentId !== "string" || typeof row.path !== "string") return [];
    return [
      {
        studentId: row.studentId,
        name: typeof row.name === "string" ? row.name : row.studentId,
        path: row.path.slice(0, 180),
        screen: row.screen === "exam" || row.screen === "game" ? row.screen : "elsewhere",
        at: typeof row.at === "string" ? row.at : new Date().toISOString(),
      },
    ];
  });
}

export function presenceFresh(at: string, now = Date.now()): boolean {
  const then = Date.parse(at);
  return Number.isFinite(then) && now - then < PRESENCE_STALE_MS;
}

export function presenceLabel(path: string): string {
  const game = path.match(/\/dashboard\/games\/([^/?#]+)/);
  if (game?.[1]) return game[1];
  const exam = path.match(/\/dashboard\/exam\/([^/?#]+)/);
  if (exam?.[1]) return exam[1];
  return "";
}
