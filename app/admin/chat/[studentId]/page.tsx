import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { HeaderTools } from "@/components/header-tools";
import { LogoutButton } from "@/app/dashboard/logout-button";
import { TeacherChatWorkspace } from "@/components/teacher-chat-workspace";
import { listChatThreads } from "@/lib/access-store";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { getTheme } from "@/lib/theme";
import { isTeacher } from "@/lib/teacher-session";

export const dynamic = "force-dynamic";

export default async function TeacherChatThreadPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  if (!(await isTeacher())) redirect("/admin/login");
  const { studentId } = await params;
  const locale = await getLocale();
  const theme = await getTheme();
  const threads = await listChatThreads();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b-2 border-accent bg-nav text-nav-fg shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <BrandMark locale={locale} href="/admin" />
          <div className="flex items-center gap-2">
            <HeaderTools locale={locale} theme={theme} />
            <Link href="/admin" className="text-xs font-semibold text-primary">
              {t(locale, "back")}
            </Link>
            <LogoutButton
              label={t(locale, "logout")}
              className="inline-flex items-center gap-1 rounded-full border-2 border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary"
            />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 p-3 sm:p-4">
        <TeacherChatWorkspace
          locale={locale}
          threads={threads}
          initialStudentId={studentId}
        />
      </main>
    </div>
  );
}
