import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isDeviceId, newDeviceId } from "@/lib/devices";
import { AREA_HEADER } from "@/lib/locale";
import { DEVICE_COOKIE, DEVICE_COOKIE_MAX_AGE, STUDENT_COOKIE, TEACHER_COOKIE } from "@/lib/session-cookies";
import { readStudentToken } from "@/lib/student-token";
import { isTeacherToken } from "@/lib/teacher-token";

const PUBLIC_EXACT = new Set([
  "/",
  "/logout",
  "/activate",
  "/favicon.ico",
  "/admin/login",
  "/verify",
]);
const PUBLIC_PREFIXES = ["/_next", "/api", "/public"];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_EXACT.has(pathname)) return true;
  if (pathname.startsWith("/activate/") || pathname.startsWith("/verify/")) return true;
  return PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isTeacherPath(pathname: string): boolean {
  return pathname.startsWith("/admin") && pathname !== "/admin/login";
}

function isStudentPath(pathname: string): boolean {
  return pathname.startsWith("/dashboard") || pathname.startsWith("/exam");
}

function nextWithArea(
  request: { cookies: { get(name: string): { value: string } | undefined }; headers: Headers },
  area: "teacher" | "student" | "public",
) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(AREA_HEADER, area);
  return withDeviceCookie(request, NextResponse.next({ request: { headers: requestHeaders } }));
}

function withDeviceCookie(request: { cookies: { get(name: string): { value: string } | undefined } }, response: NextResponse) {
  const existing = request.cookies.get(DEVICE_COOKIE)?.value;
  if (!isDeviceId(existing)) {
    response.cookies.set(DEVICE_COOKIE, newDeviceId(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: DEVICE_COOKIE_MAX_AGE,
    });
  }
  return response;
}

function clearAuthCookies(response: NextResponse) {
  const names = [
    "authjs.session-token",
    "authjs.callback-url",
    "authjs.csrf-token",
    "__Secure-authjs.session-token",
    "__Host-authjs.csrf-token",
    STUDENT_COOKIE,
  ];
  for (const name of names) {
    response.cookies.set(name, "", { path: "/", maxAge: 0 });
  }
  return response;
}

async function sessionBelongsToUser(
  userId: string | undefined,
  email: string | null | undefined,
): Promise<boolean> {
  try {
    if (userId) {
      const byId = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });
      if (byId) return true;
    }

    const normalized = email?.trim().toLowerCase();
    if (!normalized) return false;

    const byEmail = await prisma.user.findUnique({
      where: { email: normalized },
      select: { id: true },
    });
    return Boolean(byEmail);
  } catch {
    return false;
  }
}

export const proxy = auth(async (request) => {
  const { pathname } = request.nextUrl;
  const userId = request.auth?.user?.id;
  const email = request.auth?.user?.email;
  const hasSessionCookie = Boolean(userId || email);
  const student = readStudentToken(request.cookies.get(STUDENT_COOKIE)?.value);
  const teacher = isTeacherToken(request.cookies.get(TEACHER_COOKIE)?.value);

  if (pathname === "/login" || pathname.startsWith("/login/") || pathname === "/signup" || pathname.startsWith("/signup/")) {
    return NextResponse.redirect(new URL("/activate", request.nextUrl.origin));
  }

  if (isPublicPath(pathname) && pathname !== "/admin/login") {
    return nextWithArea(request, pathname.startsWith("/admin") ? "teacher" : "public");
  }

  const validAccount =
    hasSessionCookie && (await sessionBelongsToUser(userId, email));
  const hasAccess = Boolean(student) || validAccount;

  if (isTeacherPath(pathname)) {
    if (teacher) return nextWithArea(request, "teacher");
    return NextResponse.redirect(new URL("/admin/login", request.nextUrl.origin));
  }

  if (isStudentPath(pathname)) {
    if (hasAccess) return nextWithArea(request, "student");
    const activate = new URL("/activate", request.nextUrl.origin);
    activate.searchParams.set("next", pathname);
    const response = NextResponse.redirect(activate);
    if (hasSessionCookie && !student) {
      clearAuthCookies(response);
    }
    return response;
  }

  if (pathname === "/activate" && hasAccess) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin));
  }

  if (pathname === "/admin/login") {
    if (teacher) return NextResponse.redirect(new URL("/admin", request.nextUrl.origin));
    return nextWithArea(request, "teacher");
  }

  return nextWithArea(request, "public");
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|_next/data|favicon.ico|.*\\..*).*)",
  ],
};
