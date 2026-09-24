"use server";

import { isTeacher } from "@/lib/teacher-session";
import { prisma } from "@/lib/prisma";
import { readStore } from "@/lib/access-store-io";

export type SystemHealthReport = {
  dbConnected: boolean;
  dbLatencyMs: number | null;
  dbError: string | null;
  blobConfigured: boolean;
  studentCount: number;
  paidCount: number;
  messageCount: number;
  checkedAt: string;
};

export async function checkSystemHealth(): Promise<SystemHealthReport | null> {
  if (!(await isTeacher())) return null;

  let dbConnected = false;
  let dbLatencyMs: number | null = null;
  let dbError: string | null = null;

  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbConnected = true;
    dbLatencyMs = Date.now() - start;
  } catch (error) {
    dbConnected = false;
    dbError = error instanceof Error ? error.message.slice(0, 120) : "تعذر الاتصال بقاعدة البيانات";
  }

  const store = await readStore().catch(() => null);

  return {
    dbConnected,
    dbLatencyMs,
    dbError,
    blobConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    studentCount: store?.codes?.length ?? 0,
    paidCount: store?.payments?.filter((row) => row.paid).length ?? 0,
    messageCount: store?.messages?.length ?? 0,
    checkedAt: new Date().toISOString(),
  };
}

export async function exportFullDataBackup(): Promise<{
  ok: boolean;
  data?: string;
  filename?: string;
  error?: string;
}> {
  if (!(await isTeacher())) return { ok: false, error: "المراجعة للمدرس فقط" };
  try {
    const store = await readStore();

    const backup = {
      exportedAt: new Date().toISOString(),
      platform: "MindSoft Academy",
      codes: store.codes,
      payments: store.payments,
      homework: store.homework,
      exams: store.exams,
      messages: store.messages,
      attendance: store.attendance,
      certificates: store.certificates,
    };

    const dateStr = new Date().toISOString().slice(0, 10);
    return {
      ok: true,
      data: JSON.stringify(backup, null, 2),
      filename: `mindsoft-backup-${dateStr}.json`,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "فشل إنشاء النسخة الاحتياطية",
    };
  }
}
