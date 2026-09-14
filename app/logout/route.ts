import { NextResponse } from "next/server";
import { signOut } from "@/auth";
import { STUDENT_COOKIE, TEACHER_COOKIE } from "@/lib/session-cookies";

function cleared(url: URL) {
  const response = NextResponse.redirect(url);
  response.cookies.set(STUDENT_COOKIE, "", { path: "/", maxAge: 0 });
  response.cookies.set(TEACHER_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}

export async function GET(request: Request) {
  try {
    await signOut({ redirect: false });
  } catch {
    // no Auth.js session
  }
  return cleared(new URL("/", request.url));
}

export async function POST(request: Request) {
  return GET(request);
}
