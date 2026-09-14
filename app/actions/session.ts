"use server";

import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import { clearStudentCookie } from "@/lib/student-session";
import { clearTeacherCookie } from "@/lib/teacher-session";

export async function signOutStudent() {
  await clearStudentCookie();
  await clearTeacherCookie();
  try {
    await signOut({ redirect: false });
  } catch {
    // Code sessions have no Auth.js cookie.
  }
  redirect("/");
}
