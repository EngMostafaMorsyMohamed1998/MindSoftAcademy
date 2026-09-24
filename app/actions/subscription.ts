"use server";

import { revalidatePath } from "next/cache";
import { cairoMonth } from "@/lib/class-clock";
import { issueCode, setMonthsPaid } from "@/lib/access-store";
import { rememberIssuedCode } from "@/lib/teacher-roster";
import { isTeacher } from "@/lib/teacher-session";
import { isPlanId, paidMonthsForPlan, parseStudentPhone } from "@/lib/subscription";

export type SubscriptionFormState = {
  error: string | null;
  ok?: boolean;
  code?: string;
  studentName?: string;
  phone?: string;
};

/** Fees are collected in class, so the teacher records the payment and the code follows. */
export async function confirmClassCashPayment(
  _prev: SubscriptionFormState,
  formData: FormData,
): Promise<SubscriptionFormState> {
  if (!(await isTeacher())) return { error: "التأكيد للمدرس فقط." };
  const studentName = String(formData.get("studentName") || "")
    .replace(/\s+/g, " ")
    .trim();
  const phone = parseStudentPhone(String(formData.get("senderPhone") || ""));
  const plan = String(formData.get("plan") || "");
  if (studentName.length < 3) return { error: "اكتب اسم الطالب كامل." };
  if (!phone) return { error: "اكتب رقم الموبايل. 11 رقم ويبدأ بـ 01." };
  if (!isPlanId(plan)) return { error: "اختار الباقة." };

  try {
    const record = await issueCode({ name: studentName, phone, track: "ar" });
    await rememberIssuedCode(record);
    await setMonthsPaid({
      studentId: record.id,
      months: paidMonthsForPlan(plan, cairoMonth()),
    });
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
    return { error: "تأكيد السداد وقف. حاول تاني." };
  }
}
