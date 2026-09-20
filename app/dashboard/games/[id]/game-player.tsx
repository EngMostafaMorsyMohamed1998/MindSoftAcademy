"use client";

import { useEffect, useState } from "react";
import { awardGameXp } from "@/app/actions/study";
import { ChapterMindMap } from "@/components/chapter-mind-map";
import type { ChapterGame } from "@/lib/games";
import { getChapter } from "@/lib/curriculum";
import { buildMapRounds, mindMapForChapter } from "@/lib/mind-maps";
import { bookletSafe } from "@/lib/booklet-lang";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";

function gameText(locale: Locale, arabic: string, english: string) {
  return bookletSafe(locale, locale === "ar" ? arabic : english);
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

function useShuffledIds(ids: string[], resetKey: string): string[] {
  const [order, setOrder] = useState(ids);
  useEffect(() => {
    setOrder(shuffle(ids));
    // ids are derived from the chapter; reshuffle only when the game changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);
  return order;
}

export function GamePlayer({ locale, game }: { locale: Locale; game: ChapterGame }) {
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);

  async function finish(correct: number, total: number) {
    setScore(Math.round((correct / total) * game.xp));
    setDone(true);
    await awardGameXp(game.id);
  }

  if (done) {
    return (
      <div className="mt-6 rounded-3xl bg-white p-6 ring-1 ring-primary/10">
        <h2 className="text-xl font-semibold">{t(locale, "gameComplete")}</h2>
        <p className="mt-2 font-serif text-4xl">
          +{score} {t(locale, "points")}
        </p>
      </div>
    );
  }

  if (game.data.kind === "sort") {
    return <SortPlay locale={locale} game={game} onDone={finish} />;
  }
  if (game.data.kind === "match") {
    return <MatchPlay locale={locale} game={game} onDone={finish} />;
  }
  if (game.data.kind === "spot") {
    return <SpotPlay locale={locale} game={game} onDone={finish} />;
  }
  if (game.data.kind === "map") {
    return <MapPlay locale={locale} game={game} onDone={finish} />;
  }
  return <PickPlay locale={locale} game={game} onDone={finish} />;
}

function SortPlay({
  locale,
  game,
  onDone,
}: {
  locale: Locale;
  game: ChapterGame;
  onDone: (correct: number, total: number) => void;
}) {
  const data = game.data.kind === "sort" ? game.data : null;
  const ids = data?.items.map((item) => item.id) ?? [];
  const [order, setOrder] = useState(ids);
  useEffect(() => {
    setOrder(shuffle(ids));
    // Shuffle once after mount so server and client HTML match.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.id]);
  if (!data) return null;

  function move(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= order.length) return;
    const copy = [...order];
    [copy[index], copy[next]] = [copy[next]!, copy[index]!];
    setOrder(copy);
  }

  return (
    <div className="mt-6 rounded-3xl bg-white p-5 ring-1 ring-primary/10">
      <p className="text-sm text-foreground/70">{gameText(locale, data.introAr, data.introEn)}</p>
      <ol className="mt-4 space-y-2">
        {order.map((id, index) => {
          const item = data.items.find((entry) => entry.id === id);
          if (!item) return null;
          return (
            <li key={id} className="flex items-center gap-2 rounded-xl bg-primary/5 px-3 py-2">
              <span className="w-6 text-sm font-bold">{index + 1}</span>
              <span className="flex-1 text-sm">{gameText(locale, item.labelAr, item.labelEn)}</span>
              <button type="button" className="text-xs" onClick={() => move(index, -1)}>
                ↑
              </button>
              <button type="button" className="text-xs" onClick={() => move(index, 1)}>
                ↓
              </button>
            </li>
          );
        })}
      </ol>
      <button
        type="button"
        className="mt-4 h-11 rounded-full bg-primary px-5 text-sm font-semibold text-white"
        onClick={() => {
          const correct = data.items.filter((item) => order[item.order] === item.id).length;
          onDone(correct, data.items.length);
        }}
      >
        {locale === "ar" ? "تم" : "Done"}
      </button>
    </div>
  );
}

function MatchPlay({
  locale,
  game,
  onDone,
}: {
  locale: Locale;
  game: ChapterGame;
  onDone: (correct: number, total: number) => void;
}) {
  const data = game.data.kind === "match" ? game.data : null;
  const pairIds = data?.pairs.map((pair) => pair.id) ?? [];
  const rights = useShuffledIds(pairIds, game.id);
  const [picks, setPicks] = useState<Record<string, string>>({});
  if (!data) return null;

  return (
    <div className="mt-6 rounded-3xl bg-white p-5 ring-1 ring-primary/10">
      <p className="text-sm text-foreground/70">{gameText(locale, data.introAr, data.introEn)}</p>
      <div className="mt-4 space-y-3">
        {data.pairs.map((pair) => (
          <label key={pair.id} className="grid gap-2 sm:grid-cols-2">
            <span className="rounded-xl bg-primary/8 px-3 py-2 text-sm font-medium">
              {gameText(locale, pair.leftAr, pair.leftEn)}
            </span>
            <select
              className="h-11 rounded-xl border border-primary/15 px-3 text-sm"
              value={picks[pair.id] ?? ""}
              onChange={(event) =>
                setPicks((current) => ({ ...current, [pair.id]: event.target.value }))
              }
            >
              <option value="">—</option>
              {rights.map((id) => {
                const other = data.pairs.find((entry) => entry.id === id);
                if (!other) return null;
                return (
                  <option key={id} value={id}>
                    {gameText(locale, other.rightAr, other.rightEn)}
                  </option>
                );
              })}
            </select>
          </label>
        ))}
      </div>
      <button
        type="button"
        className="mt-4 h-11 rounded-full bg-primary px-5 text-sm font-semibold text-white"
        onClick={() => {
          const correct = data.pairs.filter((pair) => picks[pair.id] === pair.id).length;
          onDone(correct, data.pairs.length);
        }}
      >
        {locale === "ar" ? "تم" : "Done"}
      </button>
    </div>
  );
}

function SpotPlay({
  locale,
  game,
  onDone,
}: {
  locale: Locale;
  game: ChapterGame;
  onDone: (correct: number, total: number) => void;
}) {
  const data = game.data.kind === "spot" ? game.data : null;
  const [marks, setMarks] = useState<Record<string, boolean>>({});
  if (!data) return null;

  return (
    <div className="mt-6 rounded-3xl bg-white p-5 ring-1 ring-primary/10">
      <p className="text-sm text-foreground/70">{gameText(locale, data.introAr, data.introEn)}</p>
      <ul className="mt-4 space-y-2">
        {data.cards.map((card) => {
          const flagged = marks[card.id] === true;
          return (
            <li key={card.id}>
              <button
                type="button"
                onClick={() => setMarks((current) => ({ ...current, [card.id]: !flagged }))}
                className={`w-full rounded-xl px-3 py-3 text-start text-sm ring-1 ${
                  flagged ? "bg-red-50 ring-red-400" : "bg-white ring-primary/10"
                }`}
              >
                {gameText(locale, card.textAr, card.textEn)}
              </button>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        className="mt-4 h-11 rounded-full bg-primary px-5 text-sm font-semibold text-white"
        onClick={() => {
          const correct = data.cards.filter((card) => Boolean(marks[card.id]) === card.threat).length;
          onDone(correct, data.cards.length);
        }}
      >
        {locale === "ar" ? "تم" : "Done"}
      </button>
    </div>
  );
}

function PickPlay({
  locale,
  game,
  onDone,
}: {
  locale: Locale;
  game: ChapterGame;
  onDone: (correct: number, total: number) => void;
}) {
  const data = game.data.kind === "pick" ? game.data : null;
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  if (!data) return null;
  const round = data.rounds[index];
  if (!round) return null;
  const choices = (locale === "ar" ? round.choicesAr : round.choicesEn).map((choice) =>
    bookletSafe(locale, choice),
  );

  return (
    <div className="mt-6 rounded-3xl bg-white p-5 ring-1 ring-primary/10">
      <p className="text-sm text-foreground/70">{gameText(locale, data.introAr, data.introEn)}</p>
      <p className="mt-4 text-lg font-semibold">
        {gameText(locale, round.promptAr, round.promptEn)}
      </p>
      <div className="mt-4 grid gap-2">
        {choices.map((choice, choiceIndex) => (
          <button
            key={`${choiceIndex}-${choice}`}
            type="button"
            className="rounded-xl bg-primary/8 px-3 py-3 text-start text-sm font-medium"
            onClick={() => {
              const nextCorrect = correct + (choiceIndex === round.correct ? 1 : 0);
              if (index + 1 >= data.rounds.length) {
                onDone(nextCorrect, data.rounds.length);
              } else {
                setCorrect(nextCorrect);
                setIndex(index + 1);
              }
            }}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}

function MapPlay({
  locale,
  game,
  onDone,
}: {
  locale: Locale;
  game: ChapterGame;
  onDone: (correct: number, total: number) => void;
}) {
  const data = game.data.kind === "map" ? game.data : null;
  const root = mindMapForChapter(game.chapterId);
  const chapter = getChapter(game.chapterId);
  const rounds = buildMapRounds(game.chapterId);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  if (!data || !root || !chapter) return null;
  const round = rounds[index];
  if (!round) return null;
  const choices = (locale === "ar" ? round.choicesAr : round.choicesEn).map((choice) =>
    bookletSafe(locale, choice),
  );

  return (
    <div className="mt-6 space-y-4">
      <p className="text-sm text-foreground/70">{gameText(locale, data.introAr, data.introEn)}</p>
      <ChapterMindMap
        locale={locale}
        root={root}
        color={chapter.color}
        accent={chapter.accent}
        hiddenId={round.nodeId}
      />
      <div className="rounded-3xl bg-white p-5 ring-1 ring-primary/10">
        <p className="text-sm font-semibold">{t(locale, "mindMapMissing")}</p>
        <p className="mt-2 text-sm leading-relaxed">{gameText(locale, round.promptAr, round.promptEn)}</p>
        <div className="mt-4 grid gap-2">
          {choices.map((choice, choiceIndex) => (
            <button
              key={`${round.nodeId}-${choice}`}
              type="button"
              className="rounded-xl bg-primary/8 px-3 py-3 text-start text-sm font-medium"
              onClick={() => {
                const nextCorrect = correct + (choiceIndex === round.correct ? 1 : 0);
                if (index + 1 >= rounds.length) {
                  onDone(nextCorrect, rounds.length);
                } else {
                  setCorrect(nextCorrect);
                  setIndex(index + 1);
                }
              }}
            >
              {choice}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-foreground/50" dir="ltr">
          {index + 1} / {rounds.length}
        </p>
      </div>
    </div>
  );
}
