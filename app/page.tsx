import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Sparkles,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

const features: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Adaptive Learning",
    description:
      "Lessons that reshape around you. Lumina reads your strengths and gaps, then builds a personal path so every hour of study counts.",
    icon: BrainCircuit,
  },
  {
    title: "Exam Simulator",
    description:
      "Sit timed, syllabus-true mock exams with the same pressure and pacing as the real Baccalaureate — then review every mark with clarity.",
    icon: ClipboardCheck,
  },
  {
    title: "Gamification",
    description:
      "Streaks, badges, and ranked challenges turn revision into momentum. Stay consistent without burning out before exam week.",
    icon: Trophy,
  },
  {
    title: "Study Rooms",
    description:
      "Join live rooms with classmates and mentors. Share problems, quiz each other, and keep accountability when it matters most.",
    icon: Users,
  },
];

export default function Page() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-primary-dark/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#top" className="flex items-center gap-2 text-white">
            <span className="flex size-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
              <GraduationCap className="size-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tracking-tight">Lumina</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm text-white/80 md:flex">
            <a href="#features" className="transition-colors hover:text-white">
              Features
            </a>
            <a href="#trial" className="transition-colors hover:text-white">
              Pricing
            </a>
          </nav>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm transition-colors hover:bg-white/90"
          >
            Start Free Trial
          </Link>
        </div>
      </header>

      <main id="top" className="flex-1">
        <section className="relative overflow-hidden bg-primary-dark text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(26,74,158,0.55),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(196,163,90,0.18),transparent_40%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:48px_48px]"
          />

          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-white/80 uppercase">
                <Sparkles className="size-3.5 text-accent" aria-hidden="true" />
                Built for Baccalaureate students
              </p>
              <h1 className="font-serif text-4xl leading-tight tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Master the Baccalaureate. Own your future.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75 text-pretty">
                Adaptive lessons, realistic exam simulations, and live study
                rooms — the focused platform high school students use to turn
                revision into results.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/dashboard"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-base font-semibold text-primary shadow-lg shadow-black/20 transition-transform hover:bg-white/95 active:scale-[0.98]"
                >
                  Start Free Trial
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-6 text-base font-medium text-white/90 transition-colors hover:bg-white/10"
                >
                  Explore features
                </a>
              </div>
              <ul className="mt-8 flex flex-col gap-2 text-sm text-white/70 sm:flex-row sm:flex-wrap sm:gap-x-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-accent" aria-hidden="true" />
                  No credit card required
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-accent" aria-hidden="true" />
                  14-day full access
                </li>
              </ul>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="rounded-3xl border border-white/15 bg-white/8 p-5 shadow-2xl shadow-black/30 backdrop-blur-sm sm:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium tracking-wide text-white/50 uppercase">
                      Today&apos;s path
                    </p>
                    <p className="mt-1 text-lg font-semibold">Philosophy · Maths</p>
                  </div>
                  <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent">
                    12-day streak
                  </span>
                </div>
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-white/70">Weekly readiness</span>
                    <span className="font-semibold">78%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/15">
                    <div className="h-full w-[78%] rounded-full bg-accent" />
                  </div>
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between rounded-2xl bg-white/8 px-4 py-3 ring-1 ring-white/10">
                    <div>
                      <p className="text-sm font-medium">Mock exam · Literature</p>
                      <p className="text-xs text-white/50">Timed · 4 hours</p>
                    </div>
                    <span className="text-sm font-semibold text-accent">17/20</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/8 px-4 py-3 ring-1 ring-white/10">
                    <div>
                      <p className="text-sm font-medium">Study room · Sciences</p>
                      <p className="text-xs text-white/50">8 classmates online</p>
                    </div>
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium">
                      Live
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-primary">
                    <div>
                      <p className="text-sm font-semibold">Next adaptive set</p>
                      <p className="text-xs text-primary/60">Probability · 18 min</p>
                    </div>
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
        >
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold tracking-wide text-primary-muted uppercase">
              Why Lumina
            </p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight text-balance sm:text-4xl">
              Everything you need to walk into exam day prepared.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-foreground/70 text-pretty">
              Four focused tools. One calm, trustworthy place to study for the
              Baccalaureate.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="group rounded-2xl border border-primary/8 bg-white p-6 shadow-sm shadow-primary/5 transition-shadow hover:shadow-md hover:shadow-primary/10"
                >
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary/8 text-primary ring-1 ring-primary/10">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/65">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section
          id="trial"
          className="border-t border-primary/8 bg-white"
        >
          <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
            <h2 className="font-serif text-3xl tracking-tight text-balance sm:text-4xl">
              Start your free trial today.
            </h2>
            <p className="mt-4 max-w-lg text-base text-foreground/70">
              Fourteen days of full access — adaptive paths, mock exams, and
              study rooms included. Cancel anytime.
            </p>
            <Link
              href="/dashboard"
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-primary-muted"
            >
              Start Free Trial
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-primary-dark text-white/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Lumina. Built for Baccalaureate students.</p>
          <p>Study with confidence.</p>
        </div>
      </footer>
    </div>
  );
}
