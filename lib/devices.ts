export const DEFAULT_DEVICE_LIMIT = 2;

export type DeviceLimit = 1 | 2;

export type StudentDevice = {
  id: string;
  studentId: string;
  deviceId: string;
  label: string;
  firstAt: string;
  lastAt: string;
};

export function parseDeviceLimit(value: unknown): DeviceLimit {
  return value === 1 || value === "1" ? 1 : 2;
}

export function isDeviceId(value: string | undefined | null): value is string {
  return Boolean(value && /^[a-zA-Z0-9-]{16,64}$/.test(value));
}

export function newDeviceId(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

export function parseDevices(value: unknown): StudentDevice[] {
  if (!Array.isArray(value)) return [];
  const rows: StudentDevice[] = [];
  const seen = new Set<string>();
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const row = item as StudentDevice;
    if (!row.studentId || !isDeviceId(row.deviceId)) continue;
    const key = `${row.studentId}:${row.deviceId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    rows.push({
      id: row.id || key,
      studentId: row.studentId,
      deviceId: row.deviceId,
      label: typeof row.label === "string" && row.label.trim() ? row.label.trim() : "جهاز",
      firstAt: row.firstAt || new Date().toISOString(),
      lastAt: row.lastAt || row.firstAt || new Date().toISOString(),
    });
  }
  return rows;
}

export function deviceLabel(userAgent: string): string {
  if (/iPhone|iPad/i.test(userAgent)) return "iPhone";
  if (/Android/i.test(userAgent)) return "Android";
  if (/Mac OS X|Macintosh/i.test(userAgent)) return "Mac";
  if (/Windows/i.test(userAgent)) return "Windows";
  if (/Linux/i.test(userAgent)) return "Linux";
  return "جهاز";
}

export function devicesForStudent(rows: StudentDevice[], studentId: string): StudentDevice[] {
  return rows.filter((row) => row.studentId === studentId);
}
