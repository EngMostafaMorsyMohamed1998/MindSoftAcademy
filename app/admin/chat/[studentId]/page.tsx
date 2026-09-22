import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { ChatThread } from "@/components/chat-thread";
import { HeaderTools } from "@/components/header-tools";
import { LogoutButton } from "@/app/dashboard/logout-button";
import { getCodeById, listStudentMessages } from "@/lib/access-store";
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
  const [record, messages] = await Promise.all([
    getCodeById(studentId),
    listStudentMessages(studentId),
  ]);
  const studentName = record?.name ?? messages[0]?.studentName ?? t(locale, "student");

  return (
    <div className="min-h-full bg-background text-foreground">
      <header className="border-b-2 border-accent bg-nav text-nav-fg shadow-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <BrandMark locale={locale} href="/admin" />
          <div className="flex items-center gap-2">
            <HeaderTools locale={locale} theme={theme} />
            <Link href="/admin/chat" className="text-xs font-semibold text-primary">
              {t(locale, "back")}
            </Link>
            <LogoutButton
              label={t(locale, "logout")}
              className="inline-flex items-center gap-1 rounded-full border-2 border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary"
            />
          </div>
        </div>
      </header>
      <main className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-8">
        <div>
          <h1 className="font-serif text-3xl">{studentName}</h1>
          {record?.phone ? (
            <p className="mt-1 font-mono text-sm text-foreground/55">{record.phone}</p>
          ) : null}
        </div>
        <ChatThread
          locale={locale}
          role="teacher"
          messages={messages}
          studentId={studentId}
          studentName={studentName}
        />
      </main>
    </div>
  );
}
