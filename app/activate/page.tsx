import { redirect } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { HeaderTools } from "@/components/header-tools";
import { HeroRobot } from "@/components/hero-robot";
import { ActivateForm } from "./activate-form";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { getCurrentUser } from "@/lib/current-user";
import { getTheme } from "@/lib/theme";

export default async function ActivatePage() {
  const locale = await getLocale();
  const theme = await getTheme();
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden bg-primary-dark text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(26,74,158,0.55),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(196,163,90,0.18),transparent_40%)]"
      />
      <header className="relative z-10 border-b-2 border-accent bg-nav text-nav-fg shadow-md">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4">
          <BrandMark locale={locale} />
          <HeaderTools locale={locale} theme={theme} />
        </div>
      </header>
      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 pb-16">
        <div className="mb-2">
          <HeroRobot alt={t(locale, "robotAlt")} size="compact" />
        </div>
        <div className="rounded-3xl border border-white/15 bg-white/8 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <p className="text-xs font-semibold tracking-wide text-accent uppercase">
            {t(locale, "codeOnce")}
          </p>
          <h1 className="mt-2 font-serif text-3xl tracking-tight">
            {t(locale, "activateTitle")}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            {t(locale, "activateLead")}
          </p>
          <div className="mt-6">
            <ActivateForm locale={locale} />
          </div>
        </div>
      </main>
    </div>
  );
}
