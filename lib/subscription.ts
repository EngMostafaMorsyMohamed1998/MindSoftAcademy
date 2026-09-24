export const SUBSCRIPTION_PLANS = [
  { id: "term", label: "ترم", amount: 450 },
  { id: "month", label: "شهر", amount: 150 },
  { id: "year", label: "سنة كاملة", amount: 950 },
] as const;

export type PlanId = (typeof SUBSCRIPTION_PLANS)[number]["id"];

const PLAN_IDS = new Set<string>(SUBSCRIPTION_PLANS.map((plan) => plan.id));

export function planById(value: string) {
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === value) ?? null;
}

export function isPlanId(value: string): value is PlanId {
  return PLAN_IDS.has(value);
}

export function planMonthCount(plan: PlanId): number {
  return plan === "year" ? 12 : plan === "term" ? 4 : 1;
}

export function paidMonthsForPlan(plan: PlanId, startMonth: string): string[] {
  const count = planMonthCount(plan);
  const [year, month] = startMonth.split("-").map(Number);
  const startYear = Number.isFinite(year) ? year : new Date().getFullYear();
  const start = Number.isFinite(month) ? month : 1;
  return Array.from({ length: count }, (_, index) => {
    const total = start - 1 + index;
    const nextYear = startYear + Math.floor(total / 12);
    const nextMonth = (total % 12) + 1;
    return `${nextYear}-${String(nextMonth).padStart(2, "0")}`;
  });
}

export function parseStudentPhone(value: string): string | null {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("0020")) digits = `0${digits.slice(4)}`;
  else if (digits.startsWith("20") && digits.length >= 12) digits = `0${digits.slice(2)}`;
  return /^01\d{9}$/.test(digits) ? digits : null;
}
