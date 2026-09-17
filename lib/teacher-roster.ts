import { cookies } from "next/headers";
import {
  codeForStudent,
  idForStudent,
  listCodes,
  normalizeName,
  normalizePhone,
  phonesMatch,
  type AccessCode,
} from "@/lib/access-store";
import { signToken, verifyToken } from "@/lib/crypto-token";

export const ROSTER_COOKIE = "morsy_roster";
const ROSTER_LIMIT = 80;

type RosterRow = {
  name: string;
  phone: string;
  createdAt: string;
};

function toRecord(row: RosterRow): AccessCode {
  const phone = normalizePhone(row.phone);
  return {
    id: idForStudent(row.name, phone),
    code: codeForStudent(row.name, phone),
    name: row.name,
    phone,
    createdAt: row.createdAt,
    usedAt: null,
    usedById: null,
    points: 0,
    suspendedAt: null,
    suspendReason: "",
    track: "ar",
  };
}

async function readRoster(): Promise<RosterRow[]> {
  const store = await cookies();
  const token = store.get(ROSTER_COOKIE)?.value;
  if (!token) return [];
  const parsed = verifyToken<RosterRow[]>(token);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(
    (row) =>
      row &&
      typeof row.name === "string" &&
      typeof row.phone === "string" &&
      typeof row.createdAt === "string",
  );
}

async function writeRoster(rows: RosterRow[]): Promise<void> {
  const store = await cookies();
  store.set(ROSTER_COOKIE, signToken(rows.slice(0, ROSTER_LIMIT)), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });
}

export async function rememberIssuedCode(record: AccessCode): Promise<void> {
  const rows = await readRoster();
  const next = rows.filter(
    (row) =>
      !(
        phonesMatch(row.phone, record.phone) &&
        normalizeName(row.name) === normalizeName(record.name)
      ),
  );
  next.unshift({
    name: record.name,
    phone: record.phone,
    createdAt: record.createdAt,
  });
  await writeRoster(next);
}

export async function listVisibleCodes(): Promise<AccessCode[]> {
  const [roster, stored] = await Promise.all([readRoster(), listCodes()]);
  const byId = new Map<string, AccessCode>();
  for (const row of roster) {
    const record = toRecord(row);
    byId.set(record.id, record);
  }
  for (const record of stored) {
    const current = byId.get(record.id);
    byId.set(
      record.id,
      current
        ? {
            ...record,
            ...current,
            usedAt: record.usedAt ?? current.usedAt,
            suspendedAt: record.suspendedAt ?? current.suspendedAt,
            suspendReason: record.suspendReason || current.suspendReason,
            track: record.track ?? current.track,
          }
        : record,
    );
  }
  return [...byId.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
