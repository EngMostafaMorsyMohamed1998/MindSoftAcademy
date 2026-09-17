import type { Locale } from "@/lib/locale";

export function AnswerGuide({ locale, text }: { locale: Locale; text: string }) {
  const title = locale === "ar" ? "دليل الإجابة" : "Answer guide";
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  return (
    <div className="mt-4 space-y-2 rounded-xl bg-[#fff4cc] px-5 py-4 text-[#111827] ring-1 ring-amber-300">
      <p className="text-base font-extrabold text-[#92400e]">{title}</p>
      {lines.map((line) => (
        <p key={line} className="text-base font-semibold leading-8">
          {line}
        </p>
      ))}
    </div>
  );
}
