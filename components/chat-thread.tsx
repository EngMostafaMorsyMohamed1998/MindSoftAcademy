"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Send } from "lucide-react";
import {
  sendStudentChat,
  sendTeacherChat,
  markStudentChatRead,
  markTeacherChatRead,
} from "@/app/actions/chat";
import type { ChatMessage } from "@/lib/access-store";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";

export function ChatThread({
  locale,
  role,
  messages,
  studentId,
  studentName,
}: {
  locale: Locale;
  role: "student" | "teacher";
  messages: ChatMessage[];
  studentId?: string;
  studentName?: string;
}) {
  const router = useRouter();
  const scroller = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [drafts, setDrafts] = useState<ChatMessage[]>([]);
  const [sent, setSent] = useState(false);
  const shown = [
    ...messages,
    ...drafts.filter((item) => !messages.some((message) => message.id === item.id)),
  ];
  const lastShownId = shown.at(-1)?.id;

  useEffect(() => {
    const box = scroller.current;
    if (box) box.scrollTop = box.scrollHeight;
  }, [shown.length, lastShownId]);

  useEffect(() => {
    if (role === "student") void markStudentChatRead();
    else if (studentId) void markTeacherChatRead(studentId);
  }, [role, studentId, messages.length]);

  useEffect(() => {
    const timer = window.setInterval(() => router.refresh(), 4000);
    return () => window.clearInterval(timer);
  }, [router]);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setSent(false);
    try {
    const result =
      role === "student"
        ? await sendStudentChat({ error: null }, formData)
        : await sendTeacherChat({ error: null }, formData);
    if (result.ok && result.message) {
      setDrafts((current) => [
        ...current,
        result.message!,
      ]);
      formRef.current?.reset();
      setSent(true);
      window.setTimeout(() => setSent(false), 2500);
      router.refresh();
      return;
    }
    window.alert(t(locale, "chatError"));
    } catch {
      window.alert(t(locale, "chatError"));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-[28rem] flex-1 flex-col overflow-hidden rounded-3xl border border-primary/10 bg-surface shadow-sm">
      <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
        {shown.length === 0 ? (
          <p className="py-16 text-center text-sm text-foreground/55">
            {t(locale, "chatEmpty")}
          </p>
        ) : (
          shown.map((message) => {
            const mine = message.from === role;
            return (
              <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    mine
                      ? "bg-primary text-white"
                      : "bg-primary/8 text-foreground"
                  }`}
                >
                  <p className="mb-1 text-[11px] font-semibold opacity-70">
                    {mine
                      ? t(locale, "chatYou")
                      : message.from === "teacher"
                        ? t(locale, "teacherCard")
                        : message.studentName}
                  </p>
                  <p className="whitespace-pre-wrap break-words">{message.body}</p>
                  <p className="mt-1 text-[10px] opacity-60">
                    {message.createdAt.replace("T", " ").slice(11, 16)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form
        ref={formRef}
        action={onSubmit}
        className="flex min-w-0 items-end gap-2 border-t border-primary/10 p-3"
      >
        {role === "teacher" ? (
          <>
            <input type="hidden" name="studentId" value={studentId ?? ""} />
            <input type="hidden" name="studentName" value={studentName ?? ""} />
          </>
        ) : null}
        <textarea
          name="body"
          required
          maxLength={800}
          rows={2}
          placeholder={t(locale, "chatPlaceholder")}
          className="min-h-12 min-w-0 flex-1 resize-none rounded-2xl border border-primary/15 bg-background px-3 py-2.5 text-sm outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/25"
        />
        <button
          type="submit"
          disabled={pending}
          aria-label={t(locale, "chatSend")}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-white disabled:opacity-70"
        >
          <span className="relative size-4 shrink-0">
            <LoaderCircle
              className={`absolute inset-0 size-4 animate-spin ${pending ? "" : "invisible"}`}
              aria-hidden="true"
            />
            <Send className={`size-4 ${pending ? "invisible" : ""}`} aria-hidden="true" />
          </span>
          <span className="hidden sm:inline">{t(locale, "chatSend")}</span>
        </button>
      </form>
      {sent ? (
        <p className="px-4 pb-3 text-xs font-semibold text-emerald-700" role="status">
          {locale === "ar" ? "تم إرسال الرسالة وحفظها." : "Message sent and saved."}
        </p>
      ) : null}
    </div>
  );
}
