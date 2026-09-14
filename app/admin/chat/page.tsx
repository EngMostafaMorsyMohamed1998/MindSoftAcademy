import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { HeaderTools } from "@/components/header-tools";
import { LogoutButton } from "@/app/dashboard/logout-button";
import { listChatThreads } from "@/lib/access-store";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { getTheme } from "@/lib/theme";
import { isTeacher } from "@/lib/teacher-session";

export default async function TeacherChatInboxPage() {
  if (!(await isTeacher())) redirect("/admin/login");
  const locale = await getLocale();
  const theme = await getTheme();
  const threads = await listChatThreads();

  return (
    <div className="min-h-full bg-background text-foreground">
      <header className="border-b-2 border-accent bg-nav text-nav-fg shadow-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
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
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="font-serif text-3xl">{t(locale, "chatTeacherInbox")}</h1>
        <p className="mt-2 text-sm text-foreground/65">{t(locale, "chatTeacherLead")}</p>
        {threads.length === 0 ? (
          <p className="mt-8 text-sm text-foreground/55">{t(locale, "chatNoThreads")}</p>
        ) : (
          <ul className="mt-6 space-y-2">
            {threads.map((thread) => {
              const last = thread.messages.at(-1);
              return (
                <li key={thread.studentId}>
                  <Link
                    href={`/admin/chat/${thread.studentId}`}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-primary/10"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold">{thread.studentName}</p>
                      <p className="truncate text-sm text-foreground/55">
                        {last?.body ?? t(locale, "chatEmpty")}
                      </p>
                    </div>
                    {thread.unreadForTeacher > 0 ? (
                      <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-primary-dark">
                        {thread.unreadForTeacher}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
