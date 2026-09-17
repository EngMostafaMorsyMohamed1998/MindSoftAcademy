"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { awardArenaXp } from "@/app/actions/study";
import {
  ARENA_LIVES,
  ARENA_XP,
  arenaScore,
  arenaSeconds,
  buildArenaRounds,
  type ArenaRound,
} from "@/lib/arena";
import { bookletLetters, bookletOptions } from "@/lib/booklet-pack";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import { newAttemptSeed } from "@/lib/shuffle";

type Phase = "ready" | "run" | "won" | "lost";

export function Arena3D({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const [seed, setSeed] = useState(2027);
  const rounds = useMemo(() => buildArenaRounds(seed), [seed]);
  useEffect(() => {
    setSeed(newAttemptSeed());
  }, []);
  const [phase, setPhase] = useState<Phase>("ready");
  const [room, setRoom] = useState(0);
  const [lives, setLives] = useState(ARENA_LIVES);
  const [correct, setCorrect] = useState(0);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<"ok" | "bad" | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [left, setLeft] = useState(arenaSeconds(0));
  const busyRef = useRef(false);
  const current = rounds[room];
  const limit = arenaSeconds(combo);

  function restart() {
    busyRef.current = false;
    setSeed(newAttemptSeed());
    setPhase("ready");
    setRoom(0);
    setLives(ARENA_LIVES);
    setCorrect(0);
    setCombo(0);
    setScore(0);
    setBusy(false);
    setFlash(null);
    setPicked(null);
    setLeft(arenaSeconds(0));
  }

  function finishWrong(nextLives: number) {
    if (nextLives <= 0) {
      setPhase("lost");
      return;
    }
    setPicked(null);
    setFlash(null);
    busyRef.current = false;
    setBusy(false);
  }

  function finishRight(nextRoom: number, nextCorrect: number) {
    if (nextRoom >= rounds.length) {
      setPhase("won");
      void awardArenaXp();
      return;
    }
    setRoom(nextRoom);
    setPicked(null);
    setFlash(null);
    busyRef.current = false;
    setBusy(false);
    void nextCorrect;
  }

  function choose(index: number) {
    if (phase !== "run" || busyRef.current || !current) return;
    busyRef.current = true;
    setBusy(true);
    const hit = index === current.correctIndex;
    setPicked(index < 0 ? null : index);
    setFlash(hit ? "ok" : "bad");
    if (hit) {
      const nextCombo = combo + 1;
      const nextCorrect = correct + 1;
      const gained = arenaScore(nextCombo, left);
      setCombo(nextCombo);
      setCorrect(nextCorrect);
      setScore((value) => value + gained);
      window.setTimeout(() => finishRight(room + 1, nextCorrect), 520);
      return;
    }
    const nextLives = lives - 1;
    setLives(nextLives);
    setCombo(0);
    window.setTimeout(() => finishWrong(nextLives), 480);
  }

  useEffect(() => {
    if (phase !== "run" || busy) return;
    const start = Date.now();
    const total = arenaSeconds(combo);
    setLeft(total);
    const tick = window.setInterval(() => {
      const remain = Math.max(0, total - (Date.now() - start) / 1000);
      setLeft(remain);
      if (remain <= 0) {
        window.clearInterval(tick);
        choose(-1);
      }
    }, 60);
    return () => window.clearInterval(tick);
    // Restart the clock only when a new gate opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, room, busy]);

  useEffect(() => {
    if (phase !== "run") return;
    function onKey(event: KeyboardEvent) {
      const map: Record<string, number> = { "1": 0, "2": 1, "3": 2, "4": 3, a: 0, b: 1, c: 2, d: 3, أ: 0, ب: 1, ج: 2, د: 3 };
      const index = map[event.key];
      if (index === undefined) return;
      event.preventDefault();
      choose(index);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, room, current, combo, lives, left]);

  const heat = Math.min(1, combo / 6);

  return (
    <div className="arena-shell">
      <div
        className={`arena-stage ${phase === "run" ? "is-run" : ""} ${flash === "ok" ? "is-ok" : ""} ${flash === "bad" ? "is-bad" : ""}`}
        style={{ "--heat": `${heat}` } as CSSProperties}
      >
        <div className="arena-sky" />
        <div className="arena-streaks" aria-hidden="true" />
        <div className="arena-grid" aria-hidden="true" />
        <div className="arena-rings">
          {rounds.map((row, index) => (
            <span
              key={row.id}
              className={`arena-ring ${index === room ? "is-now" : ""} ${index < room ? "is-done" : ""}`}
              style={{ "--room": row.color, "--glow": row.accent, "--i": `${index - room}` } as CSSProperties}
            />
          ))}
        </div>
        <div className="arena-car" aria-hidden="true">
          <span className="arena-hood" />
          <span className="arena-dash" />
        </div>

        <div className="arena-hud">
          <p className="arena-hearts">{"♥".repeat(Math.max(0, lives))}{"♡".repeat(Math.max(0, ARENA_LIVES - lives))}</p>
          <p>
            {room + (phase === "run" ? 1 : 0)}/{rounds.length}
          </p>
          <p>
            {t(locale, "arenaCombo")} ×{combo}
          </p>
          <p dir="ltr">{score}</p>
        </div>
        {phase === "run" ? (
          <div className="arena-timer" style={{ "--left": `${left / limit}` } as CSSProperties}>
            <span />
          </div>
        ) : null}

        {phase === "ready" ? (
          <div className="arena-panel">
            <p className="arena-kicker">3D RUSH</p>
            <h2>{t(locale, "arenaTitle")}</h2>
            <p>{t(locale, "arenaLead")}</p>
            <p>{t(locale, "arenaHint")}</p>
            <button type="button" className="arena-cta" onClick={() => setPhase("run")}>
              {t(locale, "arenaStart")}
            </button>
          </div>
        ) : null}

        {phase === "run" && current ? (
          <QuestionBoard
            locale={locale}
            round={current}
            picked={picked}
            locked={busy}
            onPick={choose}
          />
        ) : null}

        {phase === "won" || phase === "lost" ? (
          <div className="arena-panel">
            <p className="arena-kicker">{phase === "won" ? "XP" : "CRASH"}</p>
            <h2>{phase === "won" ? t(locale, "arenaWin") : t(locale, "arenaLose")}</h2>
            <p className="font-serif text-4xl">
              {phase === "won" ? `+${ARENA_XP}` : score} {t(locale, "points")}
            </p>
            <p>
              {ar ? "صحّحت" : "Solved"} {correct}/{rounds.length} · {t(locale, "arenaCombo")} ×{combo}
            </p>
            <button type="button" className="arena-cta" onClick={restart}>
              {t(locale, "arenaRetry")}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function QuestionBoard({
  locale,
  round,
  picked,
  locked,
  onPick,
}: {
  locale: Locale;
  round: ArenaRound;
  picked: number | null;
  locked: boolean;
  onPick: (index: number) => void;
}) {
  const ar = locale === "ar";
  const letters = bookletLetters(locale);
  const options = bookletOptions(locale, round.optionsAr, round.optionsEn);
  return (
    <div className="arena-play" dir={ar ? "rtl" : "ltr"}>
      <div className="arena-sign">
        <p className="arena-gate-title">{ar ? round.titleAr : round.titleEn}</p>
        <p className="arena-ask">{ar ? round.promptAr : round.promptEn}</p>
      </div>
      <div className="arena-lanes">
        {options.map((option, index) => {
          const state =
            picked === null ? "" : index === round.correctIndex ? "is-right" : picked === index ? "is-wrong" : "is-dim";
          return (
            <button
              key={`${round.id}-${index}`}
              type="button"
              disabled={locked}
              className={`arena-gate ${state}`}
              style={{ "--room": round.color, "--glow": round.accent, "--lane": `${index}` } as CSSProperties}
              onClick={() => onPick(index)}
            >
              <span className="arena-gate-letter">{letters[index]}</span>
              <span className="arena-gate-text">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
