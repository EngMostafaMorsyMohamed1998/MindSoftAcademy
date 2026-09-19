import type { Locale } from "@/lib/locale";

export function AiNestDiagram({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-[17rem] rounded-2xl bg-[#1e3a8a] p-4 text-center text-white shadow-md">
        <p className="text-xs font-extrabold tracking-wide text-blue-200">{ar ? "ذكاء اصطناعي" : "AI"}</p>
        <div className="mt-3 rounded-xl bg-[#2563eb] p-3.5">
          <p className="text-xs font-bold text-blue-50">{ar ? "تعلم آلي" : "Machine learning"}</p>
          <div className="mt-2.5 rounded-lg bg-[#3b82f6] p-2.5">
            <p className="text-xs font-semibold text-white">{ar ? "تعلم عميق" : "Deep learning"}</p>
            <div className="mt-2 rounded-md bg-[#f59e0b] px-2 py-2 text-xs font-extrabold text-slate-900">
              {ar ? "توليدي" : "Generative"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
