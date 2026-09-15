"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ClipboardCheck,
  Gamepad2,
  Home,
  Library,
  MessageCircle,
  Printer,
  RotateCcw,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { LanguageToggle } from "@/components/language-toggle";
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
  return [
    { href: "/dashboard", label: t(locale, "navHome"), icon: Home },
    { href: "/dashboard/leaderboard", label: t(locale, "navLeaderboard"), icon: Trophy },
    { href: "/dashboard/chapters", label: t(locale, "navChapters"), icon: BookOpen },
    { href: "/dashboard/courses", label: t(locale, "navBook"), icon: Library },
    { href: "/dashboard/exams", label: t(locale, "navExams"), icon: ClipboardCheck },
    { href: "/dashboard/games", label: t(locale, "navGames"), icon: Gamepad2 },
    { href: "/dashboard/booklet", label: t(locale, "navBooklet"), icon: Printer },
    { href: "/dashboard/chat-to-teacher", label: t(locale, "navChat"), icon: MessageCircle },
    { href: "/dashboard/review", label: t(locale, "reviewMistakes"), icon: RotateCcw },
  ];
}

function mobileItems(locale: Locale) {
  return items(locale).filter((item) => item.href !== "/dashboard/courses");
}

function isActive(href: string, pathname: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

export function DashboardNav({
  initialUser,
  locale,
  theme,
}: {
  initialUser: CurrentUser;
  locale: Locale;
  theme: Theme;
}) {
  const pathname = usePathname();
  const user = initialUser;
  const { level } = levelFromPoints(user.points);
  const navItems = items(locale);

  return (
    <div className="contents">
      <aside className="fixed inset-y-0 start-0 z-40 hidden w-64 flex-col border-e border-white/10 bg-primary-dark text-white md:flex">
        <div className="flex h-16 items-center px-4">
          <BrandMark locale={locale} href="/dashboard" light />
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
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
        <div className="space-y-2 border-t border-white/10 p-4">
          <div className="grid grid-cols-2 gap-2">
            <ThemeToggle
              theme={theme}
              className="inline-flex items-center justify-center rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold"
            />
            <LanguageToggle
              locale={locale}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold"
            />
          </div>
          <Link
            href="/dashboard/leaderboard"
            className="flex items-center gap-3 rounded-2xl bg-white/8 px-3 py-3 hover:bg-white/12"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-accent/20 text-sm font-semibold text-accent">
              {initials(user.name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="flex items-center gap-1 text-xs text-white/55">
                <Trophy className="size-3 text-accent" />
                {user.points} {t(locale, "points")} · L{level}
              </p>
            </div>
          </Link>
          <LogoutButton
            label={t(locale, "logout")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold"
          />
        </div>
      </aside>

      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b-2 border-accent bg-nav px-4 text-nav-fg shadow-md md:hidden">
        <BrandMark locale={locale} href="/dashboard" />
        <div className="flex items-center gap-1.5">
          <ThemeToggle
            theme={theme}
            className="inline-flex size-9 items-center justify-center rounded-full border-2 border-primary/20 bg-primary text-white dark:border-accent/40 dark:bg-accent dark:text-primary-dark"
          />
          <LanguageToggle
            locale={locale}
            className="inline-flex items-center gap-1 rounded-full border-2 border-primary/20 bg-primary px-2.5 py-1.5 text-[11px] font-semibold text-white dark:border-accent/40 dark:bg-accent dark:text-primary-dark"
          />
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-accent bg-nav px-1 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-nav-fg md:hidden">
        <ul className="grid grid-cols-4 gap-0.5">
          {mobileItems(locale).map((item) => {
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
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
