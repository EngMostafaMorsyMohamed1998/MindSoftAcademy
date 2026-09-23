"use server";

import { revalidatePath } from "next/cache";
import { cairoMonth } from "@/lib/class-clock";
import { issueCode, setMonthsPaid } from "@/lib/access-store";
import { rememberIssuedCode } from "@/lib/teacher-roster";
import { getStudentSession } from "@/lib/student-session";
import { isTeacher } from "@/lib/teacher-session";
import {
  isPlanId,
  isWalletId,
  paidMonthsForPlan,
  parseSenderPhone,
  planById,
  sniffImage,
  isSubscriptionId,
  type PlanId,
} from "@/lib/subscription";
import { addSubscriptionRequest, listSubscriptionRequests, reviewSubscriptionRequest } from "@/lib/subscription-store";

export type SubscriptionFormState = {
  error: string | null;
  ok?: boolean;
  code?: string;
  studentName?: string;
  phone?: string;
};

async function grantPaidAccess(input: {
  name: string;
  phone: string;
  plan: PlanId;
  extraStudentId?: string | null;
}) {
  const record = await issueCode({ name: input.name, phone: input.phone, track: "ar" });
  await rememberIssuedCode(record);
  const months = paidMonthsForPlan(input.plan, cairoMonth());
  await setMonthsPaid({ studentId: record.id, months });
  if (input.extraStudentId && input.extraStudentId !== record.id) {
    await setMonthsPaid({ studentId: input.extraStudentId, months });
  }
  return record;
}

export async function submitWalletSubscription(
  _prev: SubscriptionFormState,
  formData: FormData,
): Promise<SubscriptionFormState> {
  const plan = planById(String(formData.get("plan") || ""));
  const wallet = String(formData.get("wallet") || "");
  if (!plan || !isWalletId(wallet)) return { error: "اختار الباقة وطريقة الدفع." };

  const studentName = String(formData.get("studentName") || "")
    .replace(/\s+/g, " ")
    .trim();
  if (studentName.length < 2 || studentName.length > 80) return { error: "اكتب اسم الطالب." };

  const senderPhone = parseSenderPhone(String(formData.get("senderPhone") || ""));
  if (!senderPhone) return { error: "اكتب رقم الموبايل اللي حوّلت منه. 11 رقم ويبدأ بـ 01." };

  const proof = formData.get("proof");
  if (!(proof instanceof File) || proof.size < 32) return { error: "ارفع صورة التحويل." };
  if (proof.size > 2_000_000) return { error: "صورة التحويل كبيرة. صوّر الشاشة تاني أو قصّها." };

  const bytes = Buffer.from(await proof.arrayBuffer());
  const mime = sniffImage(bytes);
  if (!mime) return { error: "ارفع صورة JPG أو PNG." };

  let studentId: string | null = null;
  try {
    studentId = (await getStudentSession())?.id ?? null;
  } catch {
    studentId = null;
  }

  try {
    await addSubscriptionRequest({
      plan: plan.id,
      amount: plan.amount,
      wallet,
      senderPhone,
      studentName,
      studentId,
      proofMime: mime,
      proof: bytes,
    });
  } catch (error) {
    console.error("subscription request failed", error);
    const message = error instanceof Error ? error.message.trim() : "";
    return {
      error:
        message && !/^[A-Z_]+$/.test(message)
          ? message
          : "حفظ الطلب وقف. حدّث الصفحة وحاول تاني.",
    };
  }

  revalidatePath("/admin");
  return { error: null, ok: true };
}

export async function markSubscriptionReviewed(
  _prev: SubscriptionFormState,
  formData: FormData,
): Promise<SubscriptionFormState> {
  if (!(await isTeacher())) return { error: "المراجعة للمدرس فقط." };
  const id = String(formData.get("id") || "");
  if (!isSubscriptionId(id)) return { error: "الطلب مش موجود." };
  const row = (await listSubscriptionRequests()).find((item) => item.id === id);
  if (!row) return { error: "الطلب مش موجود." };

  const studentName = row.studentName.replace(/\s+/g, " ").trim();
  const phone = parseSenderPhone(row.senderPhone);
  if (studentName.length < 3) return { error: "اسم الطالب قصير. عدّله من سجل الأكواد." };
  if (!phone) return { error: "رقم التحويل مش مظبوط." };

  try {
    const record = await grantPaidAccess({
      name: studentName,
      phone,
      plan: row.plan,
      extraStudentId: row.studentId,
    });
    if (row.status === "pending") {
      const ok = await reviewSubscriptionRequest(id);
      if (!ok) return { error: "الطلب مش موجود." };
    }
    revalidatePath("/admin");
    revalidatePath("/dashboard");
    return {
      error: null,
      ok: true,
      code: record.code,
      studentName: record.name,
      phone: record.phone,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "NAME") return { error: "اكتب اسم الطالب كامل." };
    if (message === "PHONE") return { error: "اكتب رقم الموبايل صح." };
    return { error: "تأكيد الدفع وقف. حاول تاني." };
  }
}

export async function confirmClassCashPayment(
  _prev: SubscriptionFormState,
  formData: FormData,
): Promise<SubscriptionFormState> {
  if (!(await isTeacher())) return { error: "التأكيد للمدرس فقط." };
  const studentName = String(formData.get("studentName") || "")
    .replace(/\s+/g, " ")
    .trim();
  const phone = parseSenderPhone(String(formData.get("senderPhone") || ""));
  const plan = String(formData.get("plan") || "");
  if (studentName.length < 3) return { error: "اكتب اسم الطالب كامل." };
  if (!phone) return { error: "اكتب رقم الموبايل. 11 رقم ويبدأ بـ 01." };
  if (!isPlanId(plan)) return { error: "اختار الباقة." };

  try {
    const record = await grantPaidAccess({ name: studentName, phone, plan });
    revalidatePath("/admin");
    revalidatePath("/dashboard");
    return {
      error: null,
      ok: true,
      code: record.code,
      studentName: record.name,
      phone: record.phone,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "NAME") return { error: "اكتب اسم الطالب كامل." };
    if (message === "PHONE") return { error: "اكتب رقم الموبايل صح." };
    return { error: "تأكيد الدفع وقف. حاول تاني." };
  }
}
