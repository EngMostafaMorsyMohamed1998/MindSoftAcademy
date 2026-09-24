"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, MessageSquare, Phone, Search, Users } from "lucide-react";
import { ChatThread } from "@/components/chat-thread";
import type { ChatThread as ChatThreadType } from "@/lib/access-store";
import { whatsappHref } from "@/lib/class-roster";
import type { Locale } from "@/lib/locale";
import { initials } from "@/lib/student-profile";

export function TeacherChatWorkspace({
  locale,
  threads,
  initialStudentId,
}: {
  locale: Locale;
  threads: ChatThreadType[];
  initialStudentId?: string;
}) {
  const ar = locale === "ar";
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "active">("all");
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    if (initialStudentId) return initialStudentId;
    const firstUnread = threads.find((t) => t.unreadForTeacher > 0);
    if (firstUnread) return firstUnread.studentId;
    const firstActive = threads.find((t) => t.messages.length > 0);
    if (firstActive) return firstActive.studentId;
    return threads[0]?.studentId ?? null;
  });

  const [mobilePane, setMobilePane] = useState<"list" | "chat">(
    initialStudentId ? "chat" : "list",
  );

  const filteredThreads = useMemo(() => {
    const q = search.trim().toLowerCase();
    return threads.filter((thread) => {
      if (filter === "unread" && thread.unreadForTeacher === 0) return false;
      if (filter === "active" && thread.messages.length === 0) return false;
      if (!q) return true;
      const name = thread.studentName.toLowerCase();
      const phone = (thread.phone || "").toLowerCase();
      return name.includes(q) || phone.includes(q);
    });
  }, [threads, search, filter]);

  const selectedThread = useMemo(() => {
    return threads.find((t) => t.studentId === selectedId) ?? null;
  }, [threads, selectedId]);

  const totalUnread = useMemo(() => {
    return threads.reduce((sum, t) => sum + t.unreadForTeacher, 0);
  }, [threads]);

  function selectStudent(studentId: string) {
    setSelectedId(studentId);
    setMobilePane("chat");
  }

  const BackIcon = ar ? ArrowRight : ArrowLeft;

  return (
    <div className="flex h-[calc(100vh-8.5rem)] min-h-[34rem] w-full flex-col overflow-hidden rounded-3xl border border-primary/10 bg-surface shadow-sm md:flex-row">
      {/* Sidebar: Student list arranged on the side */}
      <aside
        className={`flex w-full shrink-0 flex-col border-e border-primary/10 bg-surface/70 md:w-80 lg:w-96 ${
          mobilePane === "chat" ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="border-b border-primary/10 p-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-serif text-lg font-bold">
              <Users className="size-5 text-primary" />
              {ar ? "محادثات الطلاب" : "Student Chats"}
            </h2>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
              {threads.length} {ar ? "طالب" : "students"}
            </span>
          </div>

          {/* Search box */}
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={ar ? "ابحث باسم الطالب أو الرقم..." : "Search by student name or phone..."}
              className="h-10 w-full rounded-2xl border border-primary/15 bg-background pe-3 ps-9 text-xs outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Filters */}
          <div className="mt-2.5 flex items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-full px-3 py-1 font-medium transition ${
                filter === "all" ? "bg-primary text-white" : "bg-primary/5 text-foreground/70 hover:bg-primary/10"
              }`}
            >
              {ar ? "الكل" : "All"} ({threads.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-medium transition ${
                filter === "unread" ? "bg-accent text-primary-dark font-bold" : "bg-primary/5 text-foreground/70 hover:bg-primary/10"
              }`}
            >
              {ar ? "غير مقروء" : "Unread"}
              {totalUnread > 0 ? (
                <span className="rounded-full bg-red-600 px-1.5 py-0.2 text-[10px] text-white">
                  {totalUnread}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              onClick={() => setFilter("active")}
              className={`rounded-full px-3 py-1 font-medium transition ${
                filter === "active" ? "bg-primary text-white" : "bg-primary/5 text-foreground/70 hover:bg-primary/10"
              }`}
            >
              {ar ? "نشطة" : "Active"}
            </button>
          </div>
        </div>

        {/* Scrollable conversation items */}
        <div className="flex-1 space-y-1 overflow-y-auto p-2">
          {filteredThreads.length === 0 ? (
            <p className="py-12 text-center text-xs text-foreground/50">
              {ar ? "لا يوجد طلاب يطابقون البحث." : "No students match your search."}
            </p>
          ) : (
            filteredThreads.map((thread) => {
              const active = thread.studentId === selectedId;
              const lastMsg = thread.messages.at(-1);
              return (
                <button
                  key={thread.studentId}
                  type="button"
                  onClick={() => selectStudent(thread.studentId)}
                  className={`flex w-full items-start gap-3 rounded-2xl p-3 text-start transition ${
                    active
                      ? "bg-primary/10 ring-1 ring-primary/25"
                      : "hover:bg-primary/5"
                  }`}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {initials(thread.studentName)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="truncate text-xs font-semibold">{thread.studentName}</p>
                      {lastMsg ? (
                        <span className="text-[10px] text-foreground/40">
                          {lastMsg.createdAt.slice(11, 16)}
                        </span>
                      ) : null}
                    </div>
                    {thread.phone ? (
                      <p className="font-mono text-[10px] text-foreground/45" dir="ltr">
                        {thread.phone}
                      </p>
                    ) : null}
                    <p className="mt-1 truncate text-xs text-foreground/60">
                      {lastMsg ? (
                        <span className={lastMsg.from === "teacher" ? "text-primary/70" : ""}>
                          {lastMsg.from === "teacher" ? (ar ? "أنت: " : "You: ") : ""}
                          {lastMsg.body}
                        </span>
                      ) : (
                        <span className="italic text-foreground/40">{ar ? "لا توجد رسائل بعد" : "No messages yet"}</span>
                      )}
                    </p>
                  </div>
                  {thread.unreadForTeacher > 0 ? (
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-primary-dark">
                      {thread.unreadForTeacher}
                    </span>
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* Main Area: Active Chat or Placeholder */}
      <main
        className={`flex flex-1 flex-col min-w-0 bg-background/30 ${
          mobilePane === "list" ? "hidden md:flex" : "flex"
        }`}
      >
        {selectedThread ? (
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Chat header bar */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-primary/10 bg-surface px-4 py-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobilePane("list")}
                  className="rounded-full p-2 text-foreground/60 hover:bg-primary/5 md:hidden"
                  aria-label={ar ? "رجوع للقائمة" : "Back to list"}
                >
                  <BackIcon className="size-5" />
                </button>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {initials(selectedThread.studentName)}
                </span>
                <div>
                  <h3 className="font-serif text-base font-bold leading-tight">
                    {selectedThread.studentName}
                  </h3>
                  {selectedThread.phone ? (
                    <p className="font-mono text-xs text-foreground/55" dir="ltr">
                      {selectedThread.phone}
                    </p>
                  ) : null}
                </div>
              </div>

              {selectedThread.phone ? (
                <a
                  href={whatsappHref(
                    selectedThread.phone,
                    ar ? `أهلاً ${selectedThread.studentName} معك م. مصطفى محمد` : `Hello ${selectedThread.studentName}`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-emerald-600/25 bg-emerald-50 px-3 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100"
                >
                  <Phone className="size-3.5" />
                  <span className="hidden sm:inline">{ar ? "واتساب" : "WhatsApp"}</span>
                </a>
              ) : null}
            </div>

            {/* Embedded interactive chat thread */}
            <div className="flex-1 overflow-hidden p-2 sm:p-4">
              <ChatThread
                locale={locale}
                role="teacher"
                messages={selectedThread.messages}
                studentId={selectedThread.studentId}
                studentName={selectedThread.studentName}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-foreground/50">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MessageSquare className="size-8" />
            </div>
            <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">
              {ar ? "اختر طالباً من القائمة للبدء بالمحادثة" : "Select a student from the list to start chatting"}
            </h3>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-foreground/60">
              {ar
                ? "يمكنك مراقبة جميع استفسارات الطلاب هنا والرد المباشر عليهم، أو اختيار أي طالب من القائمة الجانبية."
                : "You can monitor all student inquiries here and reply directly, or pick any student from the sidebar."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
