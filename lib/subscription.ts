export const WALLET_NUMBER = "01111185786";

export const SUBSCRIPTION_PLANS = [
  { id: "term", label: "ترم", amount: 450 },
  { id: "month", label: "شهر", amount: 150 },
  { id: "year", label: "سنة كاملة", amount: 950 },
] as const;

export type PlanId = (typeof SUBSCRIPTION_PLANS)[number]["id"];
export type WalletId = "vodafone" | "instapay";
export type SubscriptionStatus = "pending" | "reviewed";

export type SubscriptionRequestView = {
  id: string;
  plan: PlanId;
  amount: number;
  wallet: WalletId;
  senderPhone: string;
  studentName: string;
  studentId: string | null;
  status: SubscriptionStatus;
  createdAt: string;
  reviewedAt: string | null;
};

const PLAN_IDS = new Set<string>(SUBSCRIPTION_PLANS.map((plan) => plan.id));

export function planById(value: string) {
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === value) ?? null;
}

export function isPlanId(value: string): value is PlanId {
  return PLAN_IDS.has(value);
}

export function isWalletId(value: string): value is WalletId {
  return value === "vodafone" || value === "instapay";
}

export function isSubscriptionId(value: string): boolean {
  return /^sub_[a-f0-9]{16}$/.test(value);
}

export function parseSenderPhone(value: string): string | null {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("0020")) digits = `0${digits.slice(4)}`;
  else if (digits.startsWith("20") && digits.length >= 12) digits = `0${digits.slice(2)}`;
  return /^01\d{9}$/.test(digits) ? digits : null;
}

export function walletLabel(wallet: WalletId): string {
  return wallet === "vodafone" ? "فودافون كاش" : "إنستاباي";
}

export function walletInstructions(wallet: WalletId): string {
  return `حوّل المبلغ على رقم ${walletLabel(wallet)} ${WALLET_NUMBER}، وبعدين اكتب رقم الموبايل اللي حوّلت منه وارفع صورة سكرين شوت من التحويل.`;
}

export function sniffImage(bytes: Uint8Array): "image/jpeg" | "image/png" | "image/webp" | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return "image/png";
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  return null;
}
