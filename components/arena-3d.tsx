"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { awardArenaXp } from "@/app/actions/study";
import { HeroRobot } from "@/components/hero-robot";
import {
  ARENA_LIVES,
  ARENA_ROUNDS,
  ARENA_XP,
  arenaKmh,
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
  const [seed, setSeed] = useState(1);
  const [phase, setPhase] = useState<Phase>("ready");
  const rounds = useMemo(
    () => (phase === "ready" ? [] : buildArenaRounds(seed, locale === "ar")),
    [phase, seed, locale],
  );
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
  const kmh = arenaKmh(combo);
  const lead = correct - (ARENA_LIVES - lives);

  function start() {
    busyRef.current = false;
    setSeed(newAttemptSeed());
    setRoom(0);
    setLives(ARENA_LIVES);
    setCorrect(0);
    setCombo(0);
    setScore(0);
    setBusy(false);
    setFlash(null);
    setPicked(null);
    setLeft(arenaSeconds(0));
    setPhase("run");
  }

  function restart() {
    busyRef.current = false;
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

  function finishRight(nextRoom: number) {
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
  }

  function choose(index: number) {
    if (phase !== "run" || busyRef.current || !current) return;
    busyRef.current = true;
    setBusy(true);
    const hit = index === current.correctIndex;
    setPicked(index < 0 ? 1 : index);
    setFlash(hit ? "ok" : "bad");
    if (hit) {
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setCorrect((value) => value + 1);
      setScore((value) => value + arenaScore(nextCombo, left));
      window.setTimeout(() => finishRight(room + 1), 640);
      return;
    }
    const nextLives = lives - 1;
    setLives(nextLives);
    setCombo(0);
    window.setTimeout(() => finishWrong(nextLives), 520);
  }

  useEffect(() => {
    if (phase !== "run" || busy) return;
    const started = Date.now();
    const total = arenaSeconds(combo);
    setLeft(total);
    const tick = window.setInterval(() => {
      const remain = Math.max(0, total - (Date.now() - started) / 1000);
      setLeft(remain);
      if (remain <= 0) {
        window.clearInterval(tick);
        choose(-1);
      }
    }, 60);
    return () => window.clearInterval(tick);
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

  return (
    <div className="arena-shell">
      <div
        className={`arena-stage is-robot ${phase === "run" ? "is-run" : ""} ${flash === "ok" ? "is-ok" : ""} ${flash === "bad" ? "is-bad" : ""}`}
        style={{ ["--heat" as string]: String(Math.min(1, combo / 8)), ["--lead" as string]: String(lead) }}
      >
        <div className={`arena-world3 is-robot ${phase === "run" ? "is-rush" : ""}`}>
          <div className="arena-sky" />
          <div className="arena-grid" />
          <div className="arena-streaks" />
          {phase !== "ready" ? (
            <div className={`arena-racer is-rival ${lead >= 0 ? "is-behind" : "is-close"}`} aria-hidden>
              <span className="arena-racer-glow" />
              <Image src="/mascots/hero-robot.png" alt="" width={320} height={428} className="arena-racer-img" />
            </div>
          ) : null}
          <div className="arena-racer is-hero" aria-hidden>
            <span className="arena-racer-glow" />
            <Image src="/mascots/hero-robot.png" alt="" width={420} height={560} priority className="arena-racer-img" />
          </div>
        </div>

        <div className="arena-hud">
          <p className="arena-hearts">{"♥".repeat(Math.max(0, lives))}{"♡".repeat(Math.max(0, ARENA_LIVES - lives))}</p>
          <p>
            {phase === "run" ? room + 1 : 0}/{phase === "ready" ? ARENA_ROUNDS : rounds.length}
          </p>
          <p>
            {t(locale, "arenaCombo")} ×{combo}
          </p>
          <p className="arena-speed" dir="ltr">
            {kmh} {t(locale, "arenaSpeed")}
          </p>
          <p dir="ltr">{score}</p>
          <p>
            {t(locale, "arenaRival")} {lead >= 0 ? "▼" : "▲"}
          </p>
        </div>
        {phase === "run" ? (
          <div className="arena-timer" style={{ "--left": `${left / limit}` } as CSSProperties}>
            <span />
          </div>
        ) : null}

        {phase === "ready" ? (
          <div className="arena-panel arena-panel-hero">
            <div className="arena-ready-bot">
              <HeroRobot alt={t(locale, "robotAlt")} size="compact" />
            </div>
            <p className="arena-kicker">MINDSOFT</p>
            <h2>{t(locale, "arenaAsk")}</h2>
            <p>{t(locale, "arenaHint")}</p>
            <button type="button" className="arena-cta" onClick={start}>
              {t(locale, "arenaStart")}
            </button>
          </div>
        ) : null}

        {phase === "run" && current ? (
          <QuestionBoard locale={locale} round={current} picked={picked} locked={busy} onPick={choose} />
        ) : null}

        {phase === "won" || phase === "lost" ? (
          <div className="arena-panel">
            <p className="arena-kicker">{phase === "won" ? "XP" : "STOP"}</p>
            <h2>{phase === "won" ? t(locale, "arenaWin") : t(locale, "arenaLose")}</h2>
            <p className="font-serif text-4xl">
              {phase === "won" ? `+${ARENA_XP}` : score} {t(locale, "points")}
            </p>
            <p>
              {ar ? "صحّحت" : "Solved"} {correct}/{rounds.length} · {kmh} {t(locale, "arenaSpeed")} · {t(locale, "arenaCombo")} ×{combo}
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
              className={`arena-gate is-robot ${state}`}
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
