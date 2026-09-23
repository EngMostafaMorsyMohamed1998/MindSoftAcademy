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

const PROOF_LIMIT = 2_000_000;
const BLOB_INDEX = "mindsoft-subscription-requests.json";
const PAY_PREFIX = "pay-";

type StoredRequest = SubscriptionRequestView & {
  proofMime: string;
  proofData?: string;
};

function liveDatabaseUrl(): string {
  return (
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    ""
  );
}

function hasLiveDatabase(): boolean {
  const url = liveDatabaseUrl();
  return Boolean(url) && !url.includes("build:build@127.0.0.1");
}

function storeDir(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return "/tmp/mindsoft-subscriptions";
  }
  return path.join(process.cwd(), "data");
}

function indexPath(): string {
  return path.join(storeDir(), "subscription-requests.json");
}

function proofPath(id: string): string {
  return path.join(storeDir(), "subscription-proofs", id);
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
    proofData: typeof row.proofData === "string" ? row.proofData : undefined,
    status: asStatus(row.status),
    createdAt: row.createdAt,
    reviewedAt: typeof row.reviewedAt === "string" ? row.reviewedAt : null,
  };
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

async function writeLocal(rows: StoredRequest[]): Promise<boolean> {
  try {
    await mkdir(path.dirname(indexPath()), { recursive: true });
    await writeFile(indexPath(), JSON.stringify(rows), "utf8");
    return true;
  } catch {
    return false;
  }
}

async function writeLocalProof(id: string, bytes: Buffer): Promise<boolean> {
  try {
    await mkdir(path.dirname(proofPath(id)), { recursive: true });
    await writeFile(proofPath(id), bytes);
    return true;
  } catch {
    return false;
  }
}

async function readBlobIndex(): Promise<StoredRequest[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.VERCEL) return [];
  try {
    const { get } = await import("@vercel/blob");
    const result = await get(BLOB_INDEX, { access: "private", useCache: false });
    if (!result?.stream) return [];
    const parsed = JSON.parse(await new Response(result.stream).text()) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item) => {
      const row = asView(item);
      return row ? [row] : [];
    });
  } catch {
    return [];
  }
}

async function writeBlobIndex(rows: StoredRequest[]): Promise<boolean> {
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.VERCEL) return false;
  try {
    const { put } = await import("@vercel/blob");
    await put(BLOB_INDEX, JSON.stringify(rows.map((row) => ({ ...row, proofData: undefined }))), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
    });
    return true;
  } catch {
    return false;
  }
}

async function writeBlobProof(id: string, mime: string, bytes: Buffer): Promise<boolean> {
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.VERCEL) return false;
  try {
    const { put } = await import("@vercel/blob");
    await put(`mindsoft-subscription-proofs/${id}`, bytes, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: mime,
      cacheControlMaxAge: 0,
    });
    return true;
  } catch {
    return false;
  }
}

async function readBlobProof(id: string): Promise<Buffer | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.VERCEL) return null;
  try {
    const { get } = await import("@vercel/blob");
    const result = await get(`mindsoft-subscription-proofs/${id}`, { access: "private", useCache: false });
    if (!result?.stream) return null;
    return Buffer.from(await new Response(result.stream).arrayBuffer());
  } catch {
    return null;
  }
}

async function ensureRequestTable(): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  try {
    await prisma.$executeRawUnsafe(`
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
    `);
    return true;
  } catch {
    return false;
  }
}

async function insertDedicatedRow(record: StoredRequest, proofData: string): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  await ensureRequestTable();
  try {
    await prisma.classSubscriptionRequest.create({
      data: {
        id: record.id,
        plan: record.plan,
        amount: record.amount,
        wallet: record.wallet,
        senderPhone: record.senderPhone,
        studentName: record.studentName,
        studentId: record.studentId,
        proofMime: record.proofMime,
        proofData,
        status: record.status,
        createdAt: record.createdAt,
        reviewedAt: record.reviewedAt,
      },
    });
    return true;
  } catch {
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
      return true;
    } catch {
      return false;
    }
  }
}

async function insertFallbackRow(record: StoredRequest, proofData: string): Promise<boolean> {
  if (!hasLiveDatabase()) return false;
  const payload = JSON.stringify({ ...record, proofData });
  const id = `${PAY_PREFIX}${record.id}`;
  try {
    await prisma.$executeRaw`
      INSERT INTO "ClassSurprise" ("id", "payload")
      VALUES (${id}, ${payload})
      ON CONFLICT ("id") DO UPDATE SET "payload" = EXCLUDED."payload"
    `;
    return true;
  } catch {
    try {
      await prisma.classSurprise.upsert({
        where: { id },
        create: { id, payload },
        update: { payload },
      });
      return true;
    } catch {
      return false;
    }
  }
}

async function readDedicatedRows(): Promise<StoredRequest[]> {
  if (!hasLiveDatabase()) return [];
  try {
    const rows = await prisma.classSubscriptionRequest.findMany();
    return rows.flatMap((row) => {
      const parsed = asView(row);
      return parsed ? [parsed] : [];
    });
  } catch {
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
      return [];
    }
  }
}

async function readFallbackRows(): Promise<StoredRequest[]> {
  if (!hasLiveDatabase()) return [];
  try {
    const rows = await prisma.$queryRaw<Array<{ id: string; payload: string }>>`
      SELECT "id", "payload" FROM "ClassSurprise" WHERE "id" LIKE ${`${PAY_PREFIX}sub_%`}
    `;
    return rows.flatMap((row) => {
      try {
        const parsed = asView(JSON.parse(row.payload));
        return parsed ? [parsed] : [];
      } catch {
        return [];
      }
    });
  } catch {
    return [];
  }
}

async function mergeStores(): Promise<StoredRequest[]> {
  const [local, blob, dedicated, fallback] = await Promise.all([
    readLocal(),
    readBlobIndex(),
    readDedicatedRows(),
    readFallbackRows(),
  ]);
  const merged = new Map<string, StoredRequest>();
  for (const row of [...local, ...blob, ...fallback, ...dedicated]) {
    merged.set(row.id, row);
  }
  return [...merged.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function withTimeout<T>(task: () => Promise<T>, ms: number): Promise<T | null> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      task(),
      new Promise<null>((resolve) => {
        timer = setTimeout(() => resolve(null), ms);
      }),
    ]);
  } catch {
    return null;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function persistLocal(record: StoredRequest, proof: Buffer): Promise<boolean> {
  await writeLocalProof(record.id, proof);
  return enqueue(async () => writeLocal([record, ...(await readLocal())]));
}

async function persistRemote(record: StoredRequest, proofData: string, proof: Buffer): Promise<boolean> {
  if (await insertFallbackRow(record, proofData)) return true;
  if (await insertDedicatedRow(record, proofData)) return true;
  if (!(await writeBlobProof(record.id, record.proofMime, proof))) return false;
  return writeBlobIndex([record, ...(await readBlobIndex())]);
}

export async function listSubscriptionRequests(): Promise<SubscriptionRequestView[]> {
  return (await mergeStores()).map(viewOf);
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
  if (input.proof.length < 32) {
    throw new Error("ارفع صورة التحويل.");
  }
  if (input.proof.length > PROOF_LIMIT) {
    throw new Error("صورة التحويل كبيرة. صوّر الشاشة تاني أو قصّها.");
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
    proofData: input.proof.toString("base64"),
    status: "pending",
    createdAt: new Date().toISOString(),
    reviewedAt: null,
  };
  const proofData = record.proofData ?? input.proof.toString("base64");
  const localOk = await persistLocal(record, input.proof);
  const remoteOk = await withTimeout(
    () => persistRemote(record, proofData, input.proof),
    4000,
  );

  if (!localOk && !remoteOk) {
    throw new Error("حفظ الطلب وقف. حدّث الصفحة وحاول تاني.");
  }

  return viewOf(record);
}

export async function reviewSubscriptionRequest(id: string): Promise<boolean> {
  if (!isSubscriptionId(id)) return false;
  const reviewedAt = new Date().toISOString();
  let found = false;
  await enqueue(async () => {
    const rows = await readLocal();
    const row = rows.find((item) => item.id === id);
    if (!row) return;
    row.status = "reviewed";
    row.reviewedAt = reviewedAt;
    found = true;
    await writeLocal(rows);
  });
  const blobRows = await readBlobIndex();
  const blobRow = blobRows.find((item) => item.id === id);
  if (blobRow) {
    blobRow.status = "reviewed";
    blobRow.reviewedAt = reviewedAt;
    found = true;
    await writeBlobIndex(blobRows);
  }
  if (hasLiveDatabase()) {
    try {
      await prisma.$executeRaw`
        UPDATE "ClassSubscriptionRequest"
        SET "status" = 'reviewed', "reviewedAt" = ${reviewedAt}
        WHERE "id" = ${id}
      `;
      found = true;
    } catch {
      // Dedicated table may not exist.
    }
    try {
      const rows = await prisma.$queryRaw<Array<{ payload: string }>>`
        SELECT "payload" FROM "ClassSurprise" WHERE "id" = ${`${PAY_PREFIX}${id}`} LIMIT 1
      `;
      const current = rows[0]?.payload ? asView(JSON.parse(rows[0].payload)) : null;
      if (current) {
        current.status = "reviewed";
        current.reviewedAt = reviewedAt;
        await insertFallbackRow(current, current.proofData ?? "");
        found = true;
      }
    } catch {
      // Fallback table may not exist.
    }
  }
  return found || (await mergeStores()).some((row) => row.id === id);
}

export async function readSubscriptionProof(id: string): Promise<{ mime: string; bytes: Buffer } | null> {
  if (!isSubscriptionId(id)) return null;
  const local = (await readLocal()).find((row) => row.id === id);
  try {
    const bytes = await readFile(proofPath(id));
    if (bytes.length) {
      return { mime: local?.proofMime || "image/jpeg", bytes };
    }
  } catch {
    // Fall through.
  }
  if (local?.proofData) {
    return { mime: local.proofMime || "image/jpeg", bytes: Buffer.from(local.proofData, "base64") };
  }
  const fromBlob = await readBlobProof(id);
  if (fromBlob?.length) {
    return { mime: local?.proofMime || "image/jpeg", bytes: fromBlob };
  }
  if (hasLiveDatabase()) {
    try {
      const rows = await prisma.$queryRaw<Array<{ proofMime: string; proofData: string }>>`
        SELECT "proofMime", "proofData" FROM "ClassSubscriptionRequest" WHERE "id" = ${id} LIMIT 1
      `;
      if (rows[0]?.proofData) {
        return { mime: rows[0].proofMime || "image/jpeg", bytes: Buffer.from(rows[0].proofData, "base64") };
      }
    } catch {
      // Dedicated table may not exist.
    }
    try {
      const rows = await prisma.$queryRaw<Array<{ payload: string }>>`
        SELECT "payload" FROM "ClassSurprise" WHERE "id" = ${`${PAY_PREFIX}${id}`} LIMIT 1
      `;
      const parsed = rows[0]?.payload ? asView(JSON.parse(rows[0].payload)) : null;
      if (parsed?.proofData) {
        return { mime: parsed.proofMime || "image/jpeg", bytes: Buffer.from(parsed.proofData, "base64") };
      }
    } catch {
      // Fallback table may not exist.
    }
  }
  return null;
}
