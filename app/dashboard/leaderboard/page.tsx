import { Crown, Medal, Trophy } from "lucide-react";
import { listClassGroups, listCodes } from "@/lib/access-store";
import { groupsForStudent } from "@/lib/class-groups";
import { getCurrentUser } from "@/lib/current-user";
import { t } from "@/lib/i18n";
import { buildGroupRanks, type ClassRank } from "@/lib/leaderboard";
import { getLocale } from "@/lib/locale";
import { initials } from "@/lib/student-profile";
import { weekdayName } from "@/lib/week-plan";

export const dynamic = "force-dynamic";

const PODIUM = [
  { icon: Crown, ring: "ring-accent", badge: "bg-accent text-primary-dark" },
  { icon: Medal, ring: "ring-zinc-300", badge: "bg-zinc-200 text-zinc-700" },
  { icon: Trophy, ring: "ring-amber-300", badge: "bg-amber-100 text-amber-800" },
] as const;

function GroupBoard({
  locale,
  title,
  hint,
  ranks,
  studentId,
}: {
  locale: "ar" | "en";
  title: string;
  hint: string;
  ranks: ClassRank[];
  studentId: string;
}) {
  const me = ranks.find((row) => row.id === studentId) ?? null;
  const top = ranks.slice(0, 3);
  const rest = ranks.slice(3);

  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-xs text-foreground/50">{hint}</p>
      {me ? (
        <div className="mt-4 rounded-3xl bg-primary-dark p-5 text-white">
          <p className="text-xs text-white/60">{t(locale, "boardRank")}</p>
          <p className="mt-1 font-serif text-3xl" dir="ltr">
            #{me.rank} <span className="text-lg text-white/70">/ {ranks.length}</span>
          </p>
          <p className="mt-2 text-sm">
            {me.points} {t(locale, "points")}
          </p>
        </div>
      ) : null}

      {top.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-3 sm:items-end">
          {top.map((row, index) => {
            const style = PODIUM[index] ?? PODIUM[2];
            const Icon = style.icon;
            const mine = row.id === studentId;
            return (
              <article
                key={row.id}
                className={`rounded-3xl bg-surface p-5 text-center ring-1 ${style.ring} ${
                  index === 0 ? "sm:-mt-2" : ""
                } ${mine ? "bg-accent/15" : ""}`}
              >
                <span className={`inline-flex size-9 items-center justify-center rounded-full ${style.badge}`}>
                  <Icon className="size-4" />
                </span>
                <p className="mt-3 text-sm font-semibold">{row.name}</p>
                {mine ? <p className="text-xs text-primary">{t(locale, "boardYou")}</p> : null}
                <p className="mt-2 text-2xl font-semibold tabular-nums" dir="ltr">
                  {row.points}
                </p>
                <p className="text-xs text-foreground/55" dir="ltr">
                  #{row.rank}
                </p>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="mt-4 rounded-3xl bg-surface p-5 text-sm text-foreground/60">{t(locale, "boardEmpty")}</p>
      )}

      {rest.length > 0 ? (
        <ol className="mt-4 overflow-hidden rounded-3xl bg-surface ring-1 ring-primary/10">
          {rest.map((row) => {
            const mine = row.id === studentId;
            return (
              <li
                key={row.id}
                className={`flex items-center justify-between gap-3 border-t border-primary/8 px-4 py-3 first:border-t-0 ${
                  mine ? "bg-accent/15" : ""
                }`}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="w-8 font-semibold text-primary" dir="ltr">
                    #{row.rank}
                  </span>
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {initials(row.name)}
                  </span>
                  <span className="truncate font-medium">
                    {row.name}
                    {mine ? <span className="ms-2 text-xs text-primary">{t(locale, "boardYou")}</span> : null}
                  </span>
                </span>
                <span className="shrink-0 font-semibold tabular-nums" dir="ltr">
                  {row.points} {t(locale, "points")}
                </span>
              </li>
            );
          })}
        </ol>
      ) : null}
    </section>
  );
}

export default async function ClassBoardPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const locale = await getLocale();
  const [codes, groups] = await Promise.all([listCodes(), listClassGroups()]);
  const mine = groupsForStudent(groups, user.id);

  return (
    <div className="mx-auto w-full max-w-4xl">
      <h1 className="font-serif text-3xl">{t(locale, "boardTitle")}</h1>
      <p className="mt-2 text-sm text-foreground/65">{t(locale, "boardLead")}</p>
      <p className="mt-1 text-xs text-foreground/50">{t(locale, "boardHow")}</p>

      {mine.length === 0 ? (
        <p className="mt-6 rounded-3xl bg-surface p-5 text-sm text-foreground/70">{t(locale, "boardNoGroup")}</p>
      ) : (
        mine.map((group) => (
          <GroupBoard
            key={group.id}
            locale={locale}
            studentId={user.id}
            title={`${group.name} · ${weekdayName(locale, group.weekday)} ${group.startTime}`}
            hint={t(locale, "boardGroupHint")}
            ranks={buildGroupRanks(codes, group.studentIds)}
          />
        ))
      )}
    </div>
  );
}
