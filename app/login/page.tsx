import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { HeaderTools } from "@/components/header-tools";
import { getCurrentUser } from "@/lib/current-user";
import { getLocale } from "@/lib/locale";
import { getTheme } from "@/lib/theme";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "دخول — MindSoft Academy",
};

function safeCallback(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/dashboard";
  }
  if (raw === "/login" || raw.startsWith("/login/") || raw.startsWith("/signup")) {
    return "/dashboard";
  }
  return raw;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string | string[] }>;
}) {
  const params = await searchParams;
  const callbackUrl = safeCallback(params.callbackUrl);
  const user = await getCurrentUser();
  if (user) {
    redirect(callbackUrl);
  }
  const locale = await getLocale();
  const theme = await getTheme();

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden bg-primary-dark text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(26,74,158,0.55),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(196,163,90,0.18),transparent_40%)]"
      />

      <header className="relative z-10 border-b-2 border-accent bg-nav text-nav-fg shadow-md">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <BrandMark locale={locale} />
          <HeaderTools locale={locale} theme={theme} />
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 pb-16">
        <div className="rounded-3xl border border-white/15 bg-white/8 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
          <p className="text-xs font-semibold tracking-wide text-accent uppercase">
            {locale === "ar" ? "دخول بالإيميل" : "Email sign-in"}
          </p>
          <h1 className="mt-2 font-serif text-3xl tracking-tight">
            {locale === "ar" ? "حساب المدرس" : "Teacher account"}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            {locale === "ar"
              ? "الطالب يدخل بكود الحصة. الصفحة دي لحساب الإيميل فقط."
              : "Students unlock with a class code. This page is for email accounts only."}
          </p>
          <p className="mt-3 text-sm">
            <Link href="/activate" className="font-semibold text-accent underline-offset-2 hover:underline">
              {locale === "ar" ? "تفعيل كود الحصة" : "Activate a class code"}
            </Link>
          </p>
          <div className="mt-6">
            <LoginForm callbackUrl={callbackUrl} />
          </div>
        </div>
      </main>
    </div>
  );
}
