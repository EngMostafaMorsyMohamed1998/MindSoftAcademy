import { cairoMonth } from "@/lib/class-clock";

export const DEFAULT_MONTHLY_FEE = 200;

export type MonthPayment = {
  studentId: string;
  month: string;
  paid: boolean;
  updatedAt: string;
};

export type MonthProfit = {
  month: string;
  students: number;
  paid: number;
  due: number;
  revenue: number;
  outstanding: number;
};

export function parseMonthlyFee(value: unknown): number {
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount) || amount < 0) return DEFAULT_MONTHLY_FEE;
  return Math.round(amount);
}

export function buildMonthProfits(input: {
  payments: MonthPayment[];
  studentIds: string[];
  monthlyFee: number;
  currentMonth?: string;
}): MonthProfit[] {
  const current = input.currentMonth ?? cairoMonth();
  const months = new Set<string>([current, ...input.payments.map((row) => row.month)]);
  const fee = Math.max(0, input.monthlyFee);
  const roster = new Set(input.studentIds);
  return [...months]
    .sort((a, b) => b.localeCompare(a))
    .map((month) => {
      const rows = input.payments.filter((row) => row.month === month && roster.has(row.studentId));
      const paidIds = new Set(rows.filter((row) => row.paid).map((row) => row.studentId));
      const students = month === current ? roster.size : Math.max(roster.size, new Set(rows.map((row) => row.studentId)).size);
      const paid = paidIds.size;
      const due = Math.max(0, students - paid);
      return {
        month,
        students,
        paid,
        due,
        revenue: paid * fee,
        outstanding: due * fee,
      };
    });
}

export function parsePayments(value: unknown): MonthPayment[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as MonthPayment;
    if (typeof row.studentId !== "string" || typeof row.month !== "string") return [];
    return [
      {
        studentId: row.studentId,
        month: row.month,
        paid: Boolean(row.paid),
        updatedAt: typeof row.updatedAt === "string" ? row.updatedAt : new Date().toISOString(),
      },
    ];
  });
}

export function paidThisMonth(
  payments: MonthPayment[],
  studentId: string,
  month = cairoMonth(),
): boolean {
  return payments.some((row) => row.studentId === studentId && row.month === month && row.paid);
}

const MONTHS_AR = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function cairoMonthLabel(month = cairoMonth(), locale: "ar" | "en" = "ar"): string {
  const [year, mon] = month.split("-").map(Number);
  const index = Math.min(11, Math.max(0, (mon ?? 1) - 1));
  const name = locale === "ar" ? MONTHS_AR[index] : MONTHS_EN[index];
  return locale === "ar" ? `${name} ${year}` : `${name} ${year}`;
}
