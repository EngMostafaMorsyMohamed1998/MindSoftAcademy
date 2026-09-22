import { randomBytes } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import {
  isPlanId,
  isSubscriptionId,
  isWalletId,
  type PlanId,
  type SubscriptionRequestView,
  type SubscriptionStatus,
  type WalletId,
} from "@/lib/subscription";

const PROOF_LIMIT = 900_000;

type StoredRequest = SubscriptionRequestView & {
  proofMime: string;
};

function skipDatabase(): boolean {
  const url =
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    "";
  return !url || url.includes("build:build@127.0.0.1");
}

function indexPath(): string {
  return path.join(process.cwd(), "data", "subscription-requests.json");
}

function proofPath(id: string): string {
  return path.join(process.cwd(), "data", "subscription-proofs", id);
}

let queue: Promise<unknown> = Promise.resolve();

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function asStatus(value: unknown): SubscriptionStatus {
  return value === "reviewed" ? "reviewed" : "pending";
}

function asView(value: unknown): StoredRequest | null {
  if (!value || typeof value !== "object") return null;
  const row = value as StoredRequest;
  if (!isSubscriptionId(row.id) || !isPlanId(row.plan) || !isWalletId(row.wallet)) return null;
  if (typeof row.studentName !== "string" || typeof row.senderPhone !== "string") return null;
  if (typeof row.createdAt !== "string" || typeof row.proofMime !== "string") return null;
  const amount = Number(row.amount);
  if (!Number.isFinite(amount)) return null;
  return {
    id: row.id,
    plan: row.plan,
    amount,
    wallet: row.wallet,
    senderPhone: row.senderPhone,
    studentName: row.studentName,
    studentId: typeof row.studentId === "string" ? row.studentId : null,
    proofMime: row.proofMime,
    status: asStatus(row.status),
    createdAt: row.createdAt,
    reviewedAt: typeof row.reviewedAt === "string" ? row.reviewedAt : null,
  };
}

async function readLocal(): Promise<StoredRequest[]> {
  try {
    const raw = await readFile(indexPath(), "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item) => {
      const row = asView(item);
      return row ? [row] : [];
    });
  } catch {
    return [];
  }
}

async function writeLocal(rows: StoredRequest[]): Promise<void> {
  const filePath = indexPath();
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(rows), "utf8");
}

let tableReady: Promise<boolean> | null = null;

function ensureTable(): Promise<boolean> {
  if (skipDatabase()) return Promise.resolve(false);
  if (!tableReady) {
    tableReady = prisma
      .$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "ClassSubscriptionRequest" (
          "id" TEXT NOT NULL,
          "plan" TEXT NOT NULL,
          "amount" INTEGER NOT NULL,
          "wallet" TEXT NOT NULL,
          "senderPhone" TEXT NOT NULL,
          "studentName" TEXT NOT NULL,
          "studentId" TEXT,
          "proofMime" TEXT NOT NULL,
          "proofData" TEXT NOT NULL,
          "status" TEXT NOT NULL DEFAULT 'pending',
          "createdAt" TEXT NOT NULL,
          "reviewedAt" TEXT,
          CONSTRAINT "ClassSubscriptionRequest_pkey" PRIMARY KEY ("id")
        )
      `)
      .then(() => true)
      .catch(() => {
        tableReady = null;
        return false;
      });
  }
  return tableReady;
}

function viewOf(row: StoredRequest): SubscriptionRequestView {
  return {
    id: row.id,
    plan: row.plan,
    amount: row.amount,
    wallet: row.wallet,
    senderPhone: row.senderPhone,
    studentName: row.studentName,
    studentId: row.studentId,
    status: row.status,
    createdAt: row.createdAt,
    reviewedAt: row.reviewedAt,
  };
}

async function readDatabase(): Promise<StoredRequest[] | null> {
  if (!(await ensureTable())) return null;
  try {
    const rows = await prisma.$queryRaw<StoredRequest[]>`
      SELECT "id", "plan", "amount", "wallet", "senderPhone", "studentName", "studentId",
             "proofMime", "status", "createdAt", "reviewedAt"
      FROM "ClassSubscriptionRequest"
    `;
    return rows.flatMap((row) => {
      const parsed = asView(row);
      return parsed ? [parsed] : [];
    });
  } catch {
    return null;
  }
}

export async function listSubscriptionRequests(): Promise<SubscriptionRequestView[]> {
  const local = await readLocal();
  const remote = await readDatabase();
  const merged = new Map(local.map((row) => [row.id, row]));
  for (const row of remote ?? []) merged.set(row.id, row);
  return [...merged.values()]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(viewOf);
}

export async function addSubscriptionRequest(input: {
  plan: PlanId;
  amount: number;
  wallet: WalletId;
  senderPhone: string;
  studentName: string;
  studentId: string | null;
  proofMime: string;
  proof: Buffer;
}): Promise<SubscriptionRequestView> {
  if (input.proof.length < 32 || input.proof.length > PROOF_LIMIT) {
    throw new Error("PROOF");
  }
  const record: StoredRequest = {
    id: `sub_${randomBytes(8).toString("hex")}`,
    plan: input.plan,
    amount: input.amount,
    wallet: input.wallet,
    senderPhone: input.senderPhone,
    studentName: input.studentName,
    studentId: input.studentId,
    proofMime: input.proofMime,
    status: "pending",
    createdAt: new Date().toISOString(),
    reviewedAt: null,
  };

  if (await ensureTable()) {
    const proofData = input.proof.toString("base64");
    try {
      await prisma.$executeRaw`
        INSERT INTO "ClassSubscriptionRequest" (
          "id", "plan", "amount", "wallet", "senderPhone", "studentName", "studentId",
          "proofMime", "proofData", "status", "createdAt", "reviewedAt"
        ) VALUES (
          ${record.id}, ${record.plan}, ${record.amount}, ${record.wallet}, ${record.senderPhone},
          ${record.studentName}, ${record.studentId}, ${record.proofMime}, ${proofData},
          ${record.status}, ${record.createdAt}, ${record.reviewedAt}
        )
        ON CONFLICT ("id") DO NOTHING
      `;
      return viewOf(record);
    } catch {
      if (!skipDatabase()) throw new Error("SAVE");
    }
  }

  if (!skipDatabase()) throw new Error("SAVE");
  await enqueue(async () => {
    await mkdir(path.dirname(proofPath(record.id)), { recursive: true });
    await writeFile(proofPath(record.id), input.proof);
    const rows = await readLocal();
    rows.unshift(record);
    await writeLocal(rows);
  });
  return viewOf(record);
}

export async function reviewSubscriptionRequest(id: string): Promise<boolean> {
  if (!isSubscriptionId(id)) return false;
  const reviewedAt = new Date().toISOString();
  const found = await enqueue(async () => {
    const rows = await readLocal();
    const row = rows.find((item) => item.id === id);
    if (!row) return false;
    row.status = "reviewed";
    row.reviewedAt = reviewedAt;
    await writeLocal(rows);
    return true;
  });
  if (await ensureTable()) {
    try {
      await prisma.$executeRaw`
        UPDATE "ClassSubscriptionRequest"
        SET "status" = 'reviewed', "reviewedAt" = ${reviewedAt}
        WHERE "id" = ${id}
      `;
    } catch {
      // Local status still updates when the database is offline.
    }
  }
  if (found) return true;
  const remote = await readDatabase();
  return Boolean(remote?.some((row) => row.id === id));
}

export async function readSubscriptionProof(id: string): Promise<{ mime: string; bytes: Buffer } | null> {
  if (!isSubscriptionId(id)) return null;
  const local = (await readLocal()).find((row) => row.id === id);
  if (local) {
    try {
      const bytes = await readFile(proofPath(id));
      if (bytes.length) return { mime: local.proofMime, bytes };
    } catch {
      // Fall through to the database copy.
    }
  }
  if (!(await ensureTable())) return null;
  try {
    const rows = await prisma.$queryRaw<Array<{ proofMime: string; proofData: string }>>`
      SELECT "proofMime", "proofData" FROM "ClassSubscriptionRequest" WHERE "id" = ${id} LIMIT 1
    `;
    const row = rows[0];
    if (!row?.proofData) return null;
    return { mime: row.proofMime || "image/jpeg", bytes: Buffer.from(row.proofData, "base64") };
  } catch {
    return null;
  }
}
