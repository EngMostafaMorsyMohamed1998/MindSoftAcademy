import {
  Award,
  BookCheck,
  Clock,
  Flame,
  Medal,
  Play,
  Sparkles,
  Target,
} from "lucide-react";

const badges = [
  { label: "12-day streak", icon: Flame },
  { label: "Mock exam ace", icon: Medal },
  { label: "Perfect quiz", icon: Sparkles },
  { label: "Focus master", icon: Target },
];

const stats = [
  {
    label: "Completed lessons",
    value: "47",
    hint: "3 this week",
    icon: BookCheck,
  },
  {
    label: "Average quiz score",
    value: "84%",
    hint: "+6% vs last month",
    icon: Award,
  },
  {
    label: "Study hours",
    value: "32h",
    hint: "This month",
    icon: Clock,
  },
];

export default function DashboardHomePage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <section className="relative overflow-hidden rounded-3xl bg-primary-dark p-6 text-white shadow-lg shadow-primary/20 sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(26,74,158,0.7),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(196,163,90,0.2),transparent_45%)]"
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium tracking-wide text-white/60">
              Tuesday · Baccalaureate Term 2
            </p>
            <h1 className="mt-2 font-serif text-3xl tracking-tight sm:text-4xl">
              Welcome back, Amira
            </h1>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/70">
              You&apos;re on a 12-day streak. A short probability capsule will
              lift the topic holding your mock score back.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent">
                Level 8 · Scholar
              </span>
              <span className="text-sm text-white/80">
                <strong className="font-semibold text-white">2,480</strong>{" "}
                points
              </span>
            </div>
            <div className="mt-4 max-w-sm">
              <div className="mb-1.5 flex items-center justify-between text-xs text-white/60">
                <span>Next level · Mentor</span>
                <span>2,480 / 3,000 XP</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/15">
                <div className="h-full w-[83%] rounded-full bg-accent" />
              </div>
            </div>
          </div>

          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {badges.map((badge) => {
              const Icon = badge.icon;
              return (
                <li
                  key={badge.label}
                  className="flex items-center gap-2 rounded-2xl bg-white/8 px-3 py-2.5 ring-1 ring-white/10"
                >
                  <span className="flex size-8 items-center justify-center rounded-full bg-accent/20 text-accent">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-medium text-white/85">
                    {badge.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-primary/8 bg-white shadow-sm shadow-primary/5">
        <div className="grid lg:grid-cols-[1.15fr_1fr]">
          <div className="relative min-h-48 bg-gradient-to-br from-primary to-primary-muted p-6 sm:min-h-56 sm:p-8">
            <span className="absolute top-5 left-5 rounded-full bg-black/25 px-2.5 py-1 text-xs font-semibold text-white">
              15 min capsule
            </span>
            <button
              type="button"
              className="absolute inset-0 flex items-center justify-center"
              aria-label="Play Bayes' Theorem capsule"
            >
              <span className="flex size-16 items-center justify-center rounded-full bg-white text-primary shadow-xl shadow-black/25 transition-transform hover:scale-105">
                <Play className="size-7 fill-current" aria-hidden="true" />
              </span>
            </button>
            <p className="absolute right-5 bottom-5 text-xs font-medium text-white/80">
              Mathematics · Probability
            </p>
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-8">
            <p className="text-xs font-semibold tracking-wide text-primary-muted uppercase">
              Continue learning
            </p>
            <h2 className="mt-2 font-serif text-2xl tracking-tight">
              Bayes&apos; Theorem, without the panic
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/65">
              Your last quiz scored 62% on conditional probability. This
              15-minute video capsule targets that weak point before your next
              mock exam.
            </p>
            <button
              type="button"
              className="mt-6 inline-flex h-11 w-fit items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-muted"
            >
              <Play className="size-4 fill-current" aria-hidden="true" />
              Watch now
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article
              key={stat.label}
              className="rounded-2xl border border-primary/8 bg-white p-5 shadow-sm shadow-primary/5"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/8 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <p className="mt-4 text-3xl font-semibold tracking-tight">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-medium">{stat.label}</p>
              <p className="mt-1 text-xs text-foreground/50">{stat.hint}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
