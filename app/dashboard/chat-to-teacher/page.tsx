import { ChatThread } from "@/components/chat-thread";
import { listStudentMessages } from "@/lib/access-store";
import { getCurrentUser } from "@/lib/current-user";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export default async function ChatToTeacherPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const locale = await getLocale();
  const messages = await listStudentMessages(user.id);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <div>
        <p className="text-xs font-semibold tracking-wide text-accent uppercase">
          {t(locale, "navChat")}
        </p>
        <h1 className="mt-1 font-serif text-3xl">{t(locale, "chatTitle")}</h1>
        <p className="mt-1 text-sm text-foreground/65">{t(locale, "chatLead")}</p>
      </div>
      <ChatThread
        locale={locale}
        role="student"
        messages={messages}
        studentId={user.id}
        studentName={user.name}
      />
    </div>
  );
}
