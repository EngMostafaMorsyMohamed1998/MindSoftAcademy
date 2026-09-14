import Link from "next/link";
import { BookOpen, ClipboardCheck, Gamepad2, MessageCircle, Printer } from "lucide-react";
import { HeroRobot } from "@/components/hero-robot";
import { CHAPTERS } from "@/lib/curriculum";
import { getCurrentUser } from "@/lib/current-user";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { levelFromPoints } from "@/lib/student-profile";
import { QuestMap } from "./quest-map";

export default async function DashboardHomePage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const locale = await getLocale();
  const firstName = user.name.trim().split(/\s+/)[0] || user.name;
  const { level } = levelFromPoints(user.points);

  const shortcuts = [
    { href: "/dashboard/chapters", label: t(locale, "navChapters"), icon: BookOpen },
    { href: "/dashboard/exams", label: t(locale, "navExams"), icon: ClipboardCheck },
    { href: "/dashboard/games", label: t(locale, "navGames"), icon: Gamepad2 },
    { href: "/dashboard/booklet", label: t(locale, "navBooklet"), icon: Printer },
    { href: "/dashboard/chat-to-teacher", label: t(locale, "navChat"), icon: MessageCircle },
  ];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <section className="relative overflow-hidden rounded-3xl bg-primary-dark p-6 text-white sm:p-8">
        <div className="relative z-10 max-w-xl pe-28 sm:pe-40">
          <p className="text-sm text-white/60">{t(locale, "welcome")}</p>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl">{firstName}</h1>
          <p className="mt-2 text-sm text-white/70">{t(locale, "dashboardHint")}</p>
          <p className="mt-4 text-sm">
            {user.points} {t(locale, "points")} · L{level}
          </p>
        </div>
        <div className="pointer-events-none absolute inset-y-0 end-0 flex w-36 items-end sm:w-44">
          <HeroRobot alt={t(locale, "robotAlt")} size="compact" />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {shortcuts.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-primary/8 bg-white p-4 text-sm font-semibold shadow-sm"
            >
              <Icon className="size-5 text-primary" />
              <span className="mt-3 block">{item.label}</span>
            </Link>
          );
        })}
      </section>

      <section className="rounded-3xl border border-primary/8 bg-white p-5 sm:p-6">
        <h2 className="font-serif text-2xl">{t(locale, "samplePath")}</h2>
        <QuestMap locale={locale} chapters={CHAPTERS} />
      </section>
    </div>
  );
}
