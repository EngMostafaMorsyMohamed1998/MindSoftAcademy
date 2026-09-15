"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function PresenceBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    async function ping() {
      if (cancelled || document.visibilityState === "hidden") return;
      try {
        await fetch("/api/presence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: pathname }),
        });
      } catch {
        // Presence is best-effort while the student is in class.
      }
    }
    void ping();
    const id = window.setInterval(() => void ping(), 8000);
    const onVisible = () => {
      if (document.visibilityState === "visible") void ping();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [pathname]);

  return null;
}
