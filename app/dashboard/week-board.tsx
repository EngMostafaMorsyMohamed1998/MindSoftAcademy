import { cairoWeekday } from "@/lib/class-clock";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import { weekdayName, type WeekSlot } from "@/lib/week-plan";

export function WeekBoard({ locale, slots }: { locale: Locale; slots: WeekSlot[] }) {
  const today = cairoWeekday();
  return (
    <section className="rounded-3xl border border-primary/10 bg-surface p-5 sm:p-6">
      <h2 className="font-serif text-2xl">{t(locale, "weekPlan")}</h2>
      {slots.length === 0 ? (
        <p className="mt-3 text-sm text-foreground/55">{t(locale, "noWeekPlan")}</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {slots.map((slot) => {
            const todaySlot = slot.weekday === today;
            return (
              <li
                key={slot.id}
                className={`flex flex-wrap items-center justify-between gap-2 rounded-2xl px-3 py-3 text-sm ${
                  todaySlot ? "bg-accent/20 ring-1 ring-accent" : "bg-primary/5"
                }`}
              >
                <span>
                  <strong>{weekdayName(locale, slot.weekday)}</strong>
                  <span className="mx-2 text-foreground/55">{slot.startTime}</span>
                  {slot.topic}
                </span>
                {todaySlot ? (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                    {t(locale, "todaySlot")}
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
