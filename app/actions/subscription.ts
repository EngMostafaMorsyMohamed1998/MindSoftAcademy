"use server";

import { revalidatePath } from "next/cache";
import { getStudentSession } from "@/lib/student-session";
import { isTeacher } from "@/lib/teacher-session";
import {
  isWalletId,
  parseSenderPhone,
  planById,
  sniffImage,
  isSubscriptionId,
} from "@/lib/subscription";
import { addSubscriptionRequest, reviewSubscriptionRequest } from "@/lib/subscription-store";

export type SubscriptionFormState = {
  error: string | null;
  ok?: boolean;
};

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
  if (proof.size > 900_000) return { error: "صورة التحويل كبيرة. صوّر الشاشة تاني أو قصّها." };

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
  } catch {
    return { error: "حصلت مشكلة في حفظ الطلب. حاول تاني." };
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
  const ok = await reviewSubscriptionRequest(id);
  if (!ok) return { error: "الطلب مش موجود." };
  revalidatePath("/admin");
  return { error: null, ok: true };
}
