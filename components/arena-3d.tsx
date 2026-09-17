"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { awardArenaXp } from "@/app/actions/study";
import { ARENA_LIVES, ARENA_XP, buildArenaRounds, type ArenaRound } from "@/lib/arena";
import { bookletLetters, bookletOptions } from "@/lib/booklet-pack";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import { newAttemptSeed } from "@/lib/shuffle";

type Phase = "ready" | "run" | "won" | "lost";

export function Arena3D({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const [seed, setSeed] = useState(() => newAttemptSeed());
  const rounds = useMemo(() => buildArenaRounds(seed), [seed]);
  const [phase, setPhase] = useState<Phase>("ready");
  const [room, setRoom] = useState(0);
  const [lives, setLives] = useState(ARENA_LIVES);
  const [correct, setCorrect] = useState(0);
  const [combo, setCombo] = useState(0);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<"ok" | "bad" | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const current = rounds[room];

  function restart() {
    setSeed(newAttemptSeed());
    setPhase("ready");
    setRoom(0);
    setLives(ARENA_LIVES);
    setCorrect(0);
    setCombo(0);
    setBusy(false);
    setFlash(null);
    setPicked(null);
  }

  async function choose(index: number) {
    if (phase !== "run" || busy || !current) return;
    setBusy(true);
    setPicked(index);
    const hit = index === current.correctIndex;
    setFlash(hit ? "ok" : "bad");
    if (hit) {
      const nextCombo = combo + 1;
      const nextCorrect = correct + 1;
      setCombo(nextCombo);
      setCorrect(nextCorrect);
      window.setTimeout(() => {
        if (room + 1 >= rounds.length) {
          setPhase("won");
          void awardArenaXp();
        } else {
          setRoom((value) => value + 1);
          setPicked(null);
          setFlash(null);
          setBusy(false);
        }
      }, 720);
      return;
    }
    const nextLives = lives - 1;
    setLives(nextLives);
    setCombo(0);
    window.setTimeout(() => {
      if (nextLives <= 0) {
        setPhase("lost");
        return;
      }
      setPicked(null);
      setFlash(null);
      setBusy(false);
    }, 640);
  }

  return (
    <div className="arena-shell">
      <div
        className={`arena-stage ${phase === "run" ? "is-run" : ""} ${flash === "ok" ? "is-ok" : ""} ${flash === "bad" ? "is-bad" : ""}`}
      >
        <div
          className="arena-world"
          style={{ "--cam": `${room * 430}` } as CSSProperties}
        >
          <div className="arena-floor" />
          <div className="arena-ceiling" />
          {rounds.map((row, index) => (
            <Hall key={row.id} row={row} index={index} />
          ))}
        </div>
        <div className="arena-fog" />
        <div className="arena-runner" aria-hidden="true">
          <span className="arena-head" />
          <span className="arena-body" />
        </div>

        <div className="arena-hud">
          <p>{t(locale, "arenaLives")} {"♥".repeat(Math.max(0, lives))}</p>
          <p>
            {t(locale, "arenaRoom")} {Math.min(room + 1, rounds.length)} / {rounds.length}
          </p>
          <p>
            {t(locale, "arenaCombo")} ×{combo}
          </p>
        </div>

        {phase === "ready" ? (
          <div className="arena-panel">
            <p className="arena-kicker">3D</p>
            <h2>{t(locale, "arenaTitle")}</h2>
            <p>{t(locale, "arenaLead")}</p>
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
            <p className="arena-kicker">{phase === "won" ? "XP" : "3D"}</p>
            <h2>{phase === "won" ? t(locale, "arenaWin") : t(locale, "arenaLose")}</h2>
            <p className="font-serif text-4xl">
              {phase === "won" ? `+${ARENA_XP}` : correct} {t(locale, "points")}
            </p>
            <p>
              {ar ? "صحّحت" : "Solved"} {correct} / {rounds.length}
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

function Hall({ row, index }: { row: ArenaRound; index: number }) {
  return (
    <div
      className="arena-hall"
      style={
        {
          "--room": row.color,
          "--glow": row.accent,
          "--z": `${index * 430}`,
        } as CSSProperties
      }
    >
      <span className="arena-wall is-left" />
      <span className="arena-wall is-right" />
      <span className="arena-pillar is-left" />
      <span className="arena-pillar is-right" />
      <span className="arena-arch" />
      <span className="arena-lamp" />
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
    <div className="arena-board" dir={ar ? "rtl" : "ltr"}>
      <p className="arena-gate-title">{ar ? round.titleAr : round.titleEn}</p>
      <p className="arena-ask">{ar ? round.promptAr : round.promptEn}</p>
      <div className="arena-cubes">
        {options.map((option, index) => {
          const state =
            picked === null ? "" : index === round.correctIndex ? "is-right" : picked === index ? "is-wrong" : "";
          return (
            <button
              key={`${round.id}-${index}`}
              type="button"
              disabled={locked}
              className={`arena-cube ${state}`}
              style={{ "--room": round.color, "--glow": round.accent } as CSSProperties}
              onClick={() => onPick(index)}
            >
              <span className="arena-cube-letter">{letters[index]}</span>
              <span className="arena-cube-text">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
