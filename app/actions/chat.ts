"use server";

import { revalidatePath } from "next/cache";
import {
  appendChatMessage,
  getCodeById,
  markChatRead,
  type ChatMessage,
} from "@/lib/access-store";
import { getCurrentUser } from "@/lib/current-user";
import { isTeacher } from "@/lib/teacher-session";

function refreshChat() {
  revalidatePath("/dashboard/chat-to-teacher");
  revalidatePath("/admin");
  revalidatePath("/admin/chat");
  revalidatePath("/admin/chat/[studentId]", "page");
}

export type ChatState = { error: string | null; ok?: boolean; message?: ChatMessage };

function read(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function sendStudentChat(
  _prev: ChatState,
  formData: FormData,
): Promise<ChatState> {
  const user = await getCurrentUser();
  if (!user) return { error: "AUTH" };
  const body = read(formData, "body");
  if (!body) return { error: "EMPTY" };
  const saved = await appendChatMessage({
    studentId: user.id,
    studentName: user.name,
    from: "student",
    body,
  });
  if (!saved) return { error: "EMPTY" };
  refreshChat();
  return { error: null, ok: true, message: saved };
}

export async function sendTeacherChat(
  _prev: ChatState,
  formData: FormData,
): Promise<ChatState> {
  if (!(await isTeacher())) return { error: "AUTH" };
  const studentId = read(formData, "studentId");
  const body = read(formData, "body");
  if (!studentId || !body) return { error: "EMPTY" };
  const record = await getCodeById(studentId);
  const saved = await appendChatMessage({
    studentId,
    studentName: record?.name ?? read(formData, "studentName") ?? "Student",
    from: "teacher",
    body,
  });
  if (!saved) return { error: "EMPTY" };
  refreshChat();
  return { error: null, ok: true, message: saved };
}

export async function markStudentChatRead() {
  const user = await getCurrentUser();
  if (!user) return;
  await markChatRead(user.id, "student");
}

export async function markTeacherChatRead(studentId: string) {
  if (!(await isTeacher()) || !studentId) return;
  await markChatRead(studentId, "teacher");
}
