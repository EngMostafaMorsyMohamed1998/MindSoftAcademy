import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  Gamepad2,
  Printer,
  Wallet,
} from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { HeaderTools } from "@/components/header-tools";
import { HeroRobot } from "@/components/hero-robot";
import { BRAND } from "@/lib/brand";
import { CHAPTERS } from "@/lib/curriculum";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { getCurrentUser } from "@/lib/current-user";
import { getTheme } from "@/lib/theme";

export default async function Page() {
  const locale = await getLocale();
  const theme = await getTheme();
  const user = await getCurrentUser();
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  const features = [
    { title: t(locale, "featBook"), description: t(locale, "featBookD"), icon: BookOpen },
    { title: t(locale, "featExam"), description: t(locale, "featExamD"), icon: ClipboardCheck },
    { title: t(locale, "featGame"), description: t(locale, "featGameD"), icon: Gamepad2 },
    { title: t(locale, "featBooklet"), description: t(locale, "featBookletD"), icon: Printer },
  ];

  const steps = [
    t(locale, "how1"),
    t(locale, "how2"),
    t(locale, "how3"),
    t(locale, "how4"),
  ];

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b-2 border-accent bg-nav text-nav-fg shadow-[0_10px_28px_rgba(7,18,37,0.14)]">
        <div className="mx-auto flex h-[4.25rem] w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <BrandMark locale={locale} />
          <div className="flex items-center gap-2">
            <HeaderTools locale={locale} theme={theme} />
            <Link
              href={user ? "/dashboard" : "/activate"}
              className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm dark:bg-accent dark:text-primary-dark"
            >
              {user ? t(locale, "goDashboard") : t(locale, "login")}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden bg-primary-dark text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(26,74,158,0.55),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(196,163,90,0.18),transparent_40%)]"
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-white/80">
                {t(locale, "heroKicker")}
              </p>
              <h1 className="font-serif text-4xl leading-tight tracking-tight text-balance sm:text-5xl">
                {t(locale, "heroTitle")}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
                {t(locale, "heroLead")}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={user ? "/dashboard" : "/activate"}
                  className="keep-white inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-base font-semibold text-primary"
                >
                  {t(locale, "ctaActivate")}
                  <Arrow className="size-4" aria-hidden="true" />
                </Link>
                <a
                  href="#chapters"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-6 text-base font-medium text-white/90 hover:bg-white/10"
                >
                  {t(locale, "ctaExplore")}
                </a>
              </div>
              <p className="mt-6 flex max-w-xl items-start gap-2 text-sm text-white/65">
                <Wallet className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                {t(locale, "payNote")}
              </p>
            </div>

            <div className="relative">
              <HeroRobot
                alt={t(locale, "robotAlt")}
                caption={t(locale, "robotCaption")}
              />
              <article className="relative z-10 mx-auto -mt-2 max-w-md rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-md sm:p-6">
                <p className="text-xs font-semibold tracking-wide text-accent uppercase">
                  {t(locale, "teacherCard")}
                </p>
                <div className="mt-3 flex items-center gap-4">
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-accent/20 font-serif text-2xl text-accent">
                    M
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold">
                      {locale === "ar" ? BRAND.teacherAr : BRAND.teacherEn}
                    </h2>
                    <p className="text-sm text-white/65">
                      {locale === "ar" ? BRAND.titleAr : BRAND.titleEn}
                    </p>
                  </div>
                </div>
                <ul className="mt-4 space-y-1.5 text-sm text-white/75">
                  <li>{locale === "ar" ? BRAND.subjectAr : BRAND.subjectEn}</li>
                  <li>{locale === "ar" ? BRAND.trackAr : BRAND.trackEn}</li>
                  <li>7 {locale === "ar" ? "فصول" : "chapters"} · 23 {t(locale, "lessons")}</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-primary/8 bg-white p-6 shadow-sm"
                >
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary/8 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/65">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="chapters" className="border-t border-primary/8 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="font-serif text-3xl tracking-tight">
              {t(locale, "navChapters")}
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {CHAPTERS.map((chapter) => (
                <article
                  key={chapter.id}
                  className="rounded-2xl border border-primary/10 p-5"
                  style={{ borderTopColor: chapter.accent, borderTopWidth: 4 }}
                >
                  <p className="text-xs font-semibold text-primary/60">
                    {chapter.part === 1 ? t(locale, "part1") : t(locale, "part2")} · {chapter.id}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">
                    {locale === "ar" ? chapter.titleAr : chapter.titleEn}
                  </h3>
                  <p className="mt-2 text-sm text-foreground/65">
                    {locale === "ar" ? chapter.blurbAr : chapter.blurbEn}
                  </p>
                  <p className="mt-3 text-xs font-medium text-accent">
                    {chapter.lessons.length} {t(locale, "lessons")} ·{" "}
                    {locale === "ar" ? chapter.gameAr : chapter.gameEn}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-serif text-3xl tracking-tight">{t(locale, "howTitle")}</h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step} className="rounded-2xl bg-white p-5 ring-1 ring-primary/10">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {index + 1}
                </span>
                <p className="mt-3 text-sm leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/activate"
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white"
            >
              {t(locale, "ctaActivate")}
            </Link>
            <Link
              href="/admin/login"
              className="inline-flex h-12 items-center justify-center rounded-full border border-primary/20 px-6 text-sm font-semibold text-primary"
            >
              {t(locale, "teacherDesk")}
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-primary-dark text-white/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {locale === "ar" ? BRAND.nameAr : BRAND.nameEn} ·{" "}
            {locale === "ar" ? BRAND.teacherAr : BRAND.teacherEn}
          </p>
          <p>{locale === "ar" ? BRAND.subjectAr : BRAND.subjectEn}</p>
        </div>
      </footer>
    </div>
  );
}
