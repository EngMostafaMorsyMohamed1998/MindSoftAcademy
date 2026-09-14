"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { setTheme } from "@/app/actions/theme";
import type { Theme } from "@/lib/theme";

export function ThemeToggle({
  theme,
  className = "",
}: {
  theme: Theme;
  className?: string;
}) {
  const [current, setCurrent] = useState(theme);

  useEffect(() => {
    setCurrent(theme);
  }, [theme]);

  const next = current === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className={className}
      aria-label={next === "dark" ? "Dark mode" : "Light mode"}
      onClick={async () => {
        setCurrent(next);
        document.documentElement.classList.toggle("dark", next === "dark");
        await setTheme(next);
      }}
    >
      {current === "dark" ? (
        <Sun className="size-4" aria-hidden="true" />
      ) : (
        <Moon className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}
