import { listCodes } from "@/lib/access-store";
import { getCurrentUser } from "@/lib/current-user";
import { t } from "@/lib/i18n";
import { buildClassRanks, type ClassRank } from "@/lib/leaderboard";
import { getLocale } from "@/lib/locale";
import { initials } from "@/lib/student-profile";

export const dynamic = "force-dynamic";

function GroupBoard({
  locale,
  ranks,
  studentId,
}: {
  locale: "ar" | "en";
  ranks: ClassRank[];
  studentId: string;
}) {
  const me = ranks.find((row) => row.id === studentId) ?? null;

  if (!ranks.length) {
    return <p className="mt-6 rounded-3xl bg-surface p-5 text-sm text-foreground/70">{t(locale, "boardEmpty")}</p>;
  }

  return (
    <section className="mt-6">
      {me ? (
        <div className="rounded-3xl bg-primary-dark p-5 text-white">
          <p className="text-xs text-white/60">{t(locale, "boardRank")}</p>
          <p className="mt-1 font-serif text-3xl" dir="ltr">
            #{me.rank} <span className="text-lg text-white/70">/ {ranks.length}</span>
          </p>
        </div>
      ) : null}

      <ol className="mt-4 overflow-hidden rounded-3xl bg-surface ring-1 ring-primary/10">
        {ranks.map((row) => {
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
                {row.points}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default async function ClassBoardPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const locale = await getLocale();
  const codes = await listCodes();
  const roster = codes.some((row) => row.id === user.id)
    ? codes
    : [
        {
          id: user.id,
          name: user.name,
          points: user.points,
          usedAt: new Date().toISOString(),
          suspendedAt: null,
        },
        ...codes,
      ];

  return (
    <div className="mx-auto w-full max-w-4xl">
      <h1 className="font-serif text-3xl">{t(locale, "boardTitle")}</h1>
      <GroupBoard locale={locale} studentId={user.id} ranks={buildClassRanks(roster, { requireUsed: false })} />
    </div>
  );
}
