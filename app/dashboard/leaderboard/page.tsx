import type { Metadata } from "next";
import { Award, Crown, Medal, TrendingUp } from "lucide-react";
import { getLeaderboard, type LeaderboardRow } from "@/lib/leaderboard";

export const metadata: Metadata = {
  title: "Leaderboard — Lumina",
  description: "Top Baccalaureate students by points earned.",
};

export const dynamic = "force-dynamic";

const PODIUM_STYLES = [
  {
    // 1st
    ring: "ring-accent",
    badge: "bg-accent/20 text-accent",
    label: "Gold",
    icon: Crown,
    order: "sm:order-2",
    lift: "sm:-mt-4",
  },
  {
    // 2nd
    ring: "ring-zinc-300",
    badge: "bg-zinc-100 text-zinc-600",
    label: "Silver",
    icon: Medal,
    order: "sm:order-1",
    lift: "",
  },
  {
    // 3rd
    ring: "ring-amber-300",
    badge: "bg-amber-100 text-amber-700",
    label: "Bronze",
    icon: Award,
    order: "sm:order-3",
    lift: "",
  },
] as const;

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

function Podium({ rows }: { rows: LeaderboardRow[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3 sm:items-end">
      {rows.map((row, index) => {
        const style = PODIUM_STYLES[index];
        const Icon = style.icon;
        return (
          <article
            key={row.id}
            className={`flex flex-col items-center rounded-3xl border border-primary/8 bg-white p-6 text-center shadow-sm shadow-primary/5 ring-1 ${style.ring} ${style.order} ${style.lift}`}
          >
            <span
              className={`flex size-9 items-center justify-center rounded-full ${style.badge}`}
            >
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span className="mt-4 flex size-14 items-center justify-center rounded-full bg-primary/8 text-base font-semibold text-primary">
              {initials(row.name)}
            </span>
            <p className="mt-3 font-semibold tracking-tight">{row.name}</p>
            <p className="text-xs text-foreground/50">
              {style.label} · rank {row.rank}
            </p>
            <p className="mt-3 text-2xl font-semibold tabular-nums text-primary">
              {row.points.toLocaleString()}
            </p>
            <p className="text-xs text-foreground/50">
              points · {row.completedCapsules} capsules
            </p>
          </article>
        );
      })}
    </div>
  );
}

export default async function LeaderboardPage() {
  let data: Awaited<ReturnType<typeof getLeaderboard>> | null = null;
  let failed = false;

  try {
    data = await getLeaderboard(10);
  } catch {
    // The dashboard should still render if the database is unreachable.
    failed = true;
  }

  if (failed || !data) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="font-serif text-3xl tracking-tight">Leaderboard</h1>
        <p className="mt-2 text-sm text-foreground/65">
          Class ranking this term.
        </p>
        <div className="mt-8 rounded-2xl border border-primary/8 bg-white p-6 text-sm text-foreground/65 shadow-sm shadow-primary/5">
          Could not reach the database. Start Postgres and run{" "}
          <code className="rounded bg-primary/8 px-1.5 py-0.5 font-mono text-xs text-primary">
            npx prisma migrate deploy && npx prisma db seed
          </code>
          , then reload.
        </div>
      </div>
    );
  }

  const { top, currentUser, totalStudents } = data;
  const podium = top.slice(0, 3);
  const rest = top.slice(3);

  return (
    <div className="mx-auto w-full max-w-5xl">
      <h1 className="font-serif text-3xl tracking-tight">Leaderboard</h1>
      <p className="mt-2 text-sm text-foreground/65">
        Top {top.length} of {totalStudents} students, ranked by points earned
        this term.
      </p>

      {currentUser ? (
        <section className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-primary-dark p-5 text-white shadow-lg shadow-primary/20">
          <div className="flex items-center gap-4">
            <span className="flex size-12 items-center justify-center rounded-full bg-white/10 text-sm font-semibold ring-1 ring-white/15">
              {initials(currentUser.name)}
            </span>
            <div>
              <p className="text-xs font-medium tracking-wide text-white/55 uppercase">
                Your rank
              </p>
              <p className="mt-0.5 font-semibold">{currentUser.name}</p>
              <p className="text-xs text-white/60">
                {currentUser.completedCapsules} capsules completed
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-2xl font-semibold tabular-nums">
                #{currentUser.rank}
              </p>
              <p className="text-xs text-white/55">of {totalStudents}</p>
            </div>
            <div className="text-right">
              <p className="inline-flex items-center gap-1.5 text-2xl font-semibold tabular-nums text-accent">
                <TrendingUp className="size-4" aria-hidden="true" />
                {currentUser.points.toLocaleString()}
              </p>
              <p className="text-xs text-white/55">points</p>
            </div>
          </div>
        </section>
      ) : null}

      {podium.length > 0 ? <div className="mt-8">{<Podium rows={podium} />}</div> : null}

      {rest.length > 0 ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-primary/8 bg-white shadow-sm shadow-primary/5">
          <table className="w-full text-sm">
            <caption className="sr-only">
              Students ranked {rest[0].rank} to {rest[rest.length - 1].rank}
            </caption>
            <thead>
              <tr className="border-b border-primary/8 text-left text-xs tracking-wide text-foreground/50 uppercase">
                <th scope="col" className="px-5 py-3 font-medium">
                  Rank
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Student
                </th>
                <th scope="col" className="px-5 py-3 text-right font-medium">
                  Capsules
                </th>
                <th scope="col" className="px-5 py-3 text-right font-medium">
                  Points
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/8">
              {rest.map((row) => (
                <tr
                  key={row.id}
                  className={row.isCurrentUser ? "bg-primary/5" : undefined}
                >
                  <td className="px-5 py-4 font-semibold text-primary tabular-nums">
                    {row.rank}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-medium">{row.name}</span>
                    {row.isCurrentUser ? (
                      <span className="ml-2 rounded-full bg-accent/20 px-2 py-0.5 text-[11px] font-semibold text-primary">
                        You
                      </span>
                    ) : null}
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums text-foreground/60">
                    {row.completedCapsules}
                  </td>
                  <td className="px-5 py-4 text-right font-semibold tabular-nums">
                    {row.points.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {top.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-primary/8 bg-white p-6 text-sm text-foreground/65 shadow-sm shadow-primary/5">
          No students yet. Run{" "}
          <code className="rounded bg-primary/8 px-1.5 py-0.5 font-mono text-xs text-primary">
            npx prisma db seed
          </code>{" "}
          to load the demo class.
        </p>
      ) : null}
    </div>
  );
}
