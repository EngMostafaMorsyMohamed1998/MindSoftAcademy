"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Box,
  ClipboardCheck,
  Gamepad2,
  Home,
  LayoutGrid,
  Library,
  MessageCircle,
  Printer,
  RotateCcw,
  Share2,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoutButton } from "./logout-button";
import type { CurrentUser } from "@/lib/current-user";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import type { Theme } from "@/lib/theme";
import { initials, levelFromPoints } from "@/lib/student-profile";

function items(locale: Locale): {
  href: string;
  label: string;
  icon: LucideIcon;
}[] {
  const all = [
    { href: "/dashboard", label: t(locale, "navHome"), icon: Home },
    { href: "/dashboard/community", label: t(locale, "navCommunity"), icon: Share2 },
    { href: "/dashboard/leaderboard", label: t(locale, "navLeaderboard"), icon: Trophy },
    { href: "/dashboard/chapters", label: t(locale, "navChapters"), icon: BookOpen },
    { href: "/dashboard/courses", label: t(locale, "navBook"), icon: Library },
    { href: "/dashboard/faiz", label: t(locale, "navFaiz"), icon: BookOpen },
    { href: "/dashboard/exams", label: t(locale, "navExams"), icon: ClipboardCheck },
    { href: "/dashboard/games", label: t(locale, "navGames"), icon: Gamepad2 },
    { href: "/dashboard/arena", label: t(locale, "navArena"), icon: Box },
    { href: "/dashboard/booklet", label: t(locale, "navBooklet"), icon: Printer },
    { href: "/dashboard/chat-to-teacher", label: t(locale, "navChat"), icon: MessageCircle },
    { href: "/dashboard/review", label: t(locale, "reviewMistakes"), icon: RotateCcw },
  ];
  return locale === "en" ? all.filter((item) => item.href !== "/dashboard/faiz") : all;
}

const MOBILE_PRIMARY = ["/dashboard", "/dashboard/chapters", "/dashboard/exams"];

function isActive(href: string, pathname: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  if (href === "/dashboard/exams" && pathname.startsWith("/dashboard/exam")) return true;
  return pathname.startsWith(href);
}

export function DashboardNav({
  initialUser,
  locale,
  theme,
  track = "ar",
}: {
  initialUser: CurrentUser;
  locale: Locale;
  theme: Theme;
  track?: "ar" | "en";
}) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const user = initialUser;
  const [points, setPoints] = useState(user.points);
  useEffect(() => {
    setPoints(user.points);
  }, [user.points]);
  useEffect(() => {
    const onPoints = (event: Event) => {
      const next = (event as CustomEvent<number>).detail;
      if (typeof next === "number" && Number.isFinite(next)) setPoints((current) => Math.max(current, next));
    };
    window.addEventListener("msa-points", onPoints);
    return () => window.removeEventListener("msa-points", onPoints);
  }, []);
  const { level } = levelFromPoints(points);
  const navItems = items(locale);
  const mobilePrimary = MOBILE_PRIMARY.map((href) => navItems.find((item) => item.href === href)).filter(
    (item): item is (typeof navItems)[number] => Boolean(item),
  );
  const mobileExtra = navItems.filter((item) => !MOBILE_PRIMARY.includes(item.href));
  const moreActive = mobileExtra.some((item) => isActive(item.href, pathname));

  return (
    <div className="contents">
      <aside className="no-print fixed inset-y-0 start-0 z-40 hidden w-64 flex-col border-e border-white/10 bg-primary-dark text-white md:flex">
        <div className="flex h-16 shrink-0 items-center px-4">
          <BrandMark locale={locale} href="/dashboard" light />
        </div>
        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                  active ? "keep-white bg-white text-primary" : "text-white/75 hover:bg-white/10"
                }`}
              >
                <Icon className="size-5" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="shrink-0 border-t border-white/10 px-3 py-2">
          <div className="flex items-center gap-2">
            <ThemeToggle
              theme={theme}
              locale={locale}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white"
            />
            <p className="min-w-0 flex-1 truncate text-[10px] leading-4 text-white/45" title={t(locale, "trackLocked")}>
              {t(locale, "trackLabel")}: {t(locale, track === "en" ? "trackEn" : "trackAr")}
            </p>
          </div>
          <div className="mt-1.5 flex items-center gap-1.5">
            <Link
              href="/dashboard/leaderboard"
              className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-white/8 px-2 py-1.5 hover:bg-white/12"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent/20 text-[11px] font-semibold text-accent">
                {initials(user.name)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xs font-semibold leading-4">{user.name}</span>
                <span className="flex items-center gap-1 text-[10px] leading-4 text-white/55">
                  <Trophy className="size-3 shrink-0 text-accent" aria-hidden="true" />
                  <span className="truncate">
                    L{level} · {points} {t(locale, "points")}
                  </span>
                </span>
              </span>
            </Link>
            <LogoutButton
              label={t(locale, "logout")}
              className="inline-flex shrink-0 items-center justify-center gap-1 rounded-lg bg-white/10 px-2 py-1.5 text-[10px] font-semibold"
            />
          </div>
        </div>
      </aside>

      <header className="no-print sticky top-0 z-40 flex h-16 min-w-0 items-center justify-between gap-2 border-b-2 border-accent bg-nav px-4 text-nav-fg shadow-md md:hidden">
        <BrandMark locale={locale} href="/dashboard" compact />
        <div className="flex shrink-0 items-center gap-1.5">
          <ThemeToggle
            theme={theme}
            locale={locale}
            className="inline-flex size-9 items-center justify-center rounded-full border-2 border-primary/20 bg-primary text-white dark:border-accent/40 dark:bg-accent dark:text-primary-dark"
          />
          <p className="rounded-full border border-primary/15 bg-primary/80 px-2.5 py-1.5 text-[11px] font-medium text-white dark:border-accent/30 dark:bg-accent/80 dark:text-primary-dark">
            {t(locale, track === "en" ? "trackEn" : "trackAr")}
          </p>
        </div>
      </header>

      {moreOpen ? (
        <div className="no-print fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-primary-dark/50"
            aria-label={t(locale, "navMore")}
            onClick={() => setMoreOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] max-h-[70dvh] overflow-y-auto rounded-t-3xl bg-surface p-3 shadow-xl">
            <p className="px-2 py-1 text-sm font-semibold">{t(locale, "navMore")}</p>
            <ul className="mt-2 grid grid-cols-2 gap-2">
              {mobileExtra.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href, pathname);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className={`flex min-h-11 items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium ${
                        active ? "bg-primary text-white" : "bg-primary/5 text-foreground"
                      }`}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden="true" />
                      <span className="min-w-0 truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}

      <nav className="no-print fixed inset-x-0 bottom-0 z-40 border-t-2 border-accent bg-nav px-1 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-nav-fg md:hidden">
        <ul className="grid grid-cols-4 gap-0.5">
          {mobilePrimary.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, pathname);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex flex-col items-center gap-1 rounded-xl px-0.5 py-2 text-[10px] font-medium ${
                    active ? "text-primary" : "text-foreground/45"
                  }`}
                >
                  <Icon className="size-4" />
                  <span className="max-w-full truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen((open) => !open)}
              className={`flex w-full flex-col items-center gap-1 rounded-xl px-0.5 py-2 text-[10px] font-medium ${
                moreOpen || moreActive ? "text-primary" : "text-foreground/45"
              }`}
            >
              <LayoutGrid className="size-4" />
              <span className="max-w-full truncate">{t(locale, "navMore")}</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
