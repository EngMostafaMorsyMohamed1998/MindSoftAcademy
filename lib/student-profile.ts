export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
  return letters || "?";
}

export function avatarUrlForName(name: string): string {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name.trim() || "Student")}`;
}

const TITLES = ["Newcomer", "Scholar", "Mentor", "Master", "Laureate"] as const;

export function levelFromPoints(points: number): { level: number; title: string } {
  const safe = Number.isFinite(points) ? Math.max(0, points) : 0;
  const level = Math.floor(safe / 300) + 1;
  const title = TITLES[Math.min(TITLES.length - 1, Math.floor((level - 1) / 4))];
  return { level, title };
}
