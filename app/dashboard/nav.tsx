"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Home,
  Trophy,
  type LucideIcon,
} from "lucide-react";

const navItems: {
  href: string;
  label: string;
  /** Shown in the mobile tab bar, where space is tight. */
  shortLabel: string;
  icon: LucideIcon;
}[] = [
  { href: "/dashboard", label: "Home", shortLabel: "Home", icon: Home },
  {
    href: "/dashboard/courses",
    label: "Courses",
    shortLabel: "Courses",
    icon: BookOpen,
  },
  {
    href: "/dashboard/exam-simulator",
    label: "Exam Simulator",
    shortLabel: "Exams",
    icon: ClipboardCheck,
  },
  {
    href: "/dashboard/leaderboard",
    label: "Leaderboard",
    shortLabel: "Ranking",
    icon: Trophy,
  },
];

function isActive(href: string, pathname: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname.startsWith(href);
}

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-primary-dark text-white md:flex">
        <div className="flex h-16 items-center gap-2 px-5">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
              <GraduationCap className="size-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tracking-tight">Lumina</span>
          </Link>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-4" aria-label="Dashboard">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-white text-primary shadow-sm"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="size-5" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-2xl bg-white/8 px-3 py-3 ring-1 ring-white/10">
            <span className="flex size-10 items-center justify-center rounded-full bg-accent/20 text-sm font-semibold text-accent">
              AH
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                Amira Hassan
              </p>
              <p className="text-xs text-white/55">Level 8 · Scholar</p>
            </div>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-primary/10 bg-white/90 px-4 backdrop-blur-md md:hidden">
        <Link href="/" className="flex items-center gap-2 text-primary">
          <GraduationCap className="size-5" aria-hidden="true" />
          <span className="font-semibold">Lumina</span>
        </Link>
        <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          AH
        </span>
      </header>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-primary/10 bg-white/95 px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden"
        aria-label="Dashboard"
      >
        <ul className="grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, pathname);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] font-medium ${
                    active ? "text-primary" : "text-foreground/50"
                  }`}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  <span className="truncate">{item.shortLabel}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
