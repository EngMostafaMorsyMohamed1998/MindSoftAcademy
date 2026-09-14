import { redirect } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { HeaderTools } from "@/components/header-tools";
import { TeacherLoginForm } from "./teacher-login-form";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { isTeacher } from "@/lib/teacher-session";
import { getTheme } from "@/lib/theme";

export default async function TeacherLoginPage() {
  const locale = await getLocale();
  const theme = await getTheme();
  if (await isTeacher()) redirect("/admin");

  return (
    <div className="relative flex min-h-full flex-1 flex-col bg-primary-dark text-white">
      <header className="border-b-2 border-accent bg-nav text-nav-fg shadow-md">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4">
          <BrandMark locale={locale} />
          <HeaderTools locale={locale} theme={theme} />
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 pb-16">
        <div className="rounded-3xl border border-white/15 bg-white/8 p-6 sm:p-8">
          <h1 className="font-serif text-3xl">{t(locale, "teacherLogin")}</h1>
          <p className="mt-2 text-sm text-white/65">{t(locale, "adminLead")}</p>
          <div className="mt-6">
            <TeacherLoginForm locale={locale} />
          </div>
        </div>
      </main>
    </div>
  );
}
