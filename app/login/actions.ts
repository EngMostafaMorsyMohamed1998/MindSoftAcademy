"use server";

import { AuthError } from "next-auth";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { hashPassword } from "@/lib/auth-password";
import { prisma } from "@/lib/prisma";
import { avatarUrlForName } from "@/lib/student-profile";

export type AuthFormState = { error: string | null };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function callbackPath(formData: FormData): string {
  const raw = readString(formData, "callbackUrl");
  if (!raw.startsWith("/") || raw.startsWith("//")) {
    return "/dashboard";
  }
  if (raw === "/login" || raw.startsWith("/login/") || raw.startsWith("/signup")) {
    return "/dashboard";
  }
  return raw;
}

export async function loginWithPassword(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = readString(formData, "email").toLowerCase();
  const password = readString(formData, "password");
  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackPath(formData),
    });
    return { error: null };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }
}

export async function registerStudent(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const name = readString(formData, "name");
  const email = readString(formData, "email").toLowerCase();
  const password = readString(formData, "password");

  if (name.length < 2) {
    return { error: "Please enter your full name." };
  }
  if (!EMAIL_RE.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: await hashPassword(password),
        image: avatarUrlForName(name),
        points: 0,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { error: "An account with that email already exists." };
    }
    console.error("registerStudent failed", error);
    return { error: "Could not create your account. Try again." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackPath(formData),
    });
    return { error: null };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Account created, but sign-in failed. Please log in." };
    }
    throw error;
  }
}

export async function signOutStudent() {
  const { clearStudentCookie } = await import("@/lib/student-session");
  const { clearTeacherCookie } = await import("@/lib/teacher-session");
  await clearStudentCookie();
  await clearTeacherCookie();
  try {
    await signOut({ redirect: false });
  } catch {
    // Guest / code sessions have no Auth.js cookie.
  }
  redirect("/");
}
