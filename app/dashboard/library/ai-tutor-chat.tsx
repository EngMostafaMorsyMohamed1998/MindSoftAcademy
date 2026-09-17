"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle, Send, Sparkles } from "lucide-react";
import type { Book } from "@/lib/library";
import { SUBJECT } from "@/lib/library";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const SUGGESTIONS = [
  { label: "Explain this lesson", prompt: "اشرح لي الفكرة الأساسية في هذا الدرس بأسلوب بسيط." },
  { label: "Summarize", prompt: "لخّص هذا الجزء من الكتاب في نقاط قصيرة." },
  { label: "Quiz me", prompt: "اختبرني بسؤالين قصيرين من منهج هذا الكتاب." },
];

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function errorFromResponse(status: number, body: { error?: string; code?: string }) {
  if (body.error) return body.error;
  if (status === 429) {
    return "جرّب بعد دقيقة.";
  }
  return "حصل خطأ. اسأل تاني بجملة أقصر.";
}

export function AiTutorChat({
  book,
  currentTopic,
}: {
  book: Book;
  currentTopic?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const bookContext = [
    `${SUBJECT.title} / ${SUBJECT.titleEn}`,
    `${book.title} / ${book.titleEn}`,
    `Language: ${book.language === "ar" ? "Arabic" : "English"}`,
    `Part ${book.part}`,
    currentTopic ? `Topic: ${currentTopic}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, pending]);

  async function sendMessage(text: string) {
    const message = text.trim();
    if (!message || pending) return;

    setDraft("");
    setError(null);
    setMessages((prev) => [
      ...prev,
      { id: newId(), role: "user", content: message },
    ]);
    setPending(true);

    try {
      const response = await fetch("/api/chat-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          bookSlug: book.slug,
          bookContext,
          currentTopic,
        }),
      });

      const body = (await response.json().catch(() => ({}))) as {
        reply?: string;
        error?: string;
        code?: string;
      };

      if (!response.ok || !body.reply) {
        setError(errorFromResponse(response.status, body));
        return;
      }

      setMessages((prev) => [
        ...prev,
        { id: newId(), role: "assistant", content: body.reply! },
      ]);
    } catch {
      setError("تعذّر الاتصال بالمعلم الذكي. تحقق من الشبكة ثم أعد المحاولة.");
    } finally {
      setPending(false);
    }
  }

  return (
    <aside className="flex h-[75vh] min-h-125 flex-col overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-sm shadow-primary/5">
      <header className="border-b border-primary/8 px-4 py-3">
        <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-primary uppercase">
          <Sparkles className="size-3.5" aria-hidden="true" />
          AI Tutor
        </p>
        <h2 className="mt-1 text-sm font-semibold text-primary-dark">
          اسأل عن الدرس
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-foreground/55">
          بيرد من منهج الكتاب جوّه المنصة.
        </p>
      </header>

      <div
        ref={scrollerRef}
        className="flex-1 space-y-3 overflow-y-auto px-4 py-3"
      >
        {messages.length === 0 && !pending ? (
          <div className="rounded-2xl bg-primary/5 px-3 py-3 text-sm leading-relaxed text-foreground/70">
            مرحباً — اسأل عن تعريف، مثال، أو ملخص سريع من «{book.title}».
          </div>
        ) : null}

        {messages.map((item) => (
          <div
            key={item.id}
            className={`max-w-[95%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
              item.role === "user"
                ? "ml-auto bg-primary text-white"
                : "bg-background text-foreground"
            }`}
          >
            {item.content}
          </div>
        ))}

        {pending ? (
          <p className="inline-flex items-center gap-2 text-xs text-primary/70">
            <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
            المعلم يكتب…
          </p>
        ) : null}
      </div>

      {error ? (
        <p
          role="alert"
          className="mx-4 mb-2 rounded-xl bg-red-50 px-3 py-2 text-xs leading-relaxed text-red-800"
        >
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-1.5 border-t border-primary/8 px-3 py-2">
        {SUGGESTIONS.map((item) => (
          <button
            key={item.label}
            type="button"
            disabled={pending}
            onClick={() => void sendMessage(item.prompt)}
            className="rounded-full border border-primary/15 px-2.5 py-1 text-[11px] font-medium text-primary hover:bg-primary/5 disabled:opacity-50"
          >
            {item.label}
          </button>
        ))}
      </div>

      <form
        className="flex items-end gap-2 border-t border-primary/8 p-3"
        onSubmit={(event) => {
          event.preventDefault();
          void sendMessage(draft);
        }}
      >
        <label htmlFor="tutor-message" className="sr-only">
          Ask the AI tutor
        </label>
        <textarea
          id="tutor-message"
          rows={2}
          value={draft}
          disabled={pending}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void sendMessage(draft);
            }
          }}
          placeholder="Ask a question about this lesson…"
          className="min-h-11 flex-1 resize-none rounded-2xl border border-primary/15 bg-background px-3 py-2 text-sm outline-none focus:border-primary/40 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={pending || !draft.trim()}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-muted disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send className="size-4" aria-hidden="true" />
          <span className="sr-only">Send</span>
        </button>
      </form>
    </aside>
  );
}
