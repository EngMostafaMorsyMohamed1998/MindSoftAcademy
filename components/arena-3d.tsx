"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { awardArenaXp } from "@/app/actions/study";
import {
  ARENA_LIVES,
  ARENA_ROUNDS,
  ARENA_XP,
  arenaScore,
  arenaSeconds,
  buildArenaRounds,
  type ArenaRound,
  type ArenaTheme,
} from "@/lib/arena";
import {
  BowArt,
  CAR_COLORS,
  CarArt,
  ConeArt,
  DOLL_DRESSES,
  DOLL_HAIR,
  DollArt,
  DressArt,
  TireArt,
} from "@/components/arena-art";
import { bookletLetters, bookletOptions } from "@/lib/booklet-pack";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import { newAttemptSeed } from "@/lib/shuffle";

type Phase = "ready" | "run" | "won" | "lost";

export function Arena3D({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const [seed, setSeed] = useState(1);
  const [theme, setTheme] = useState<ArenaTheme | null>(null);
  const [phase, setPhase] = useState<Phase>("ready");
  const rounds = useMemo(
    () => (phase === "ready" ? [] : buildArenaRounds(seed)),
    [phase, seed],
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

  function start(next: ArenaTheme) {
    busyRef.current = false;
    setSeed(newAttemptSeed());
    setTheme(next);
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
    setTheme(null);
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
        className={`arena-stage is-${theme ?? "cars"} ${phase === "run" ? "is-run" : ""} ${flash === "ok" ? "is-ok" : ""} ${flash === "bad" ? "is-bad" : ""}`}
        style={{ "--heat": `${heat}` } as CSSProperties}
      >
        <ThemeWorld theme={theme ?? "cars"} rushing={phase === "run"} />
        <ThemeRig theme={theme ?? "cars"} />

        <div className="arena-hud">
          <p className="arena-hearts">{"♥".repeat(Math.max(0, lives))}{"♡".repeat(Math.max(0, ARENA_LIVES - lives))}</p>
          <p>
            {phase === "run" ? room + 1 : 0}/{phase === "ready" ? ARENA_ROUNDS : rounds.length}
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
            <p className="arena-kicker">3D</p>
            <h2>{t(locale, "arenaAsk")}</h2>
            <p>{t(locale, "arenaHint")}</p>
            <div className="arena-pick">
              <button
                type="button"
                className="arena-pick-card is-boy"
                onClick={() => start("cars")}
              >
                <span className="arena-pick-icon" aria-hidden="true">
                  <CarArt color="#dc2626" className="arena-pick-art" />
                </span>
                <strong>{t(locale, "arenaBoy")}</strong>
                <em>{t(locale, "arenaBoyTheme")}</em>
                <small>{t(locale, "arenaBoyLead")}</small>
              </button>
              <button
                type="button"
                className="arena-pick-card is-girl"
                onClick={() => start("dolls")}
              >
                <span className="arena-pick-icon" aria-hidden="true">
                  <DollArt className="arena-pick-art is-doll" />
                </span>
                <strong>{t(locale, "arenaGirl")}</strong>
                <em>{t(locale, "arenaGirlTheme")}</em>
                <small>{t(locale, "arenaGirlLead")}</small>
              </button>
            </div>
          </div>
        ) : null}

        {phase === "run" && current ? (
          <QuestionBoard
            locale={locale}
            theme={theme ?? "cars"}
            round={current}
            picked={picked}
            locked={busy}
            onPick={choose}
          />
        ) : null}

        {phase === "won" || phase === "lost" ? (
          <div className="arena-panel">
            <p className="arena-kicker">{phase === "won" ? "XP" : theme === "dolls" ? "STOP" : "CRASH"}</p>
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

function ThemeWorld({ theme, rushing }: { theme: ArenaTheme; rushing: boolean }) {
  return (
    <div className={`arena-world3 ${rushing ? "is-rush" : ""} is-${theme}`} aria-hidden="true">
      <div className="arena-sky" />
      <span className="arena-wall is-left" />
      <span className="arena-wall is-right" />
      <div className="arena-grid" />
      <div className="arena-side is-left">
        {Array.from({ length: 6 }, (_, index) => (
          <span key={`l${index}`} className="arena-prop" style={{ "--d": `${index * 0.55}` } as CSSProperties}>
            <WorldRacer theme={theme} index={index} />
          </span>
        ))}
      </div>
      <div className="arena-side is-right">
        {Array.from({ length: 6 }, (_, index) => (
          <span key={`r${index}`} className="arena-prop" style={{ "--d": `${index * 0.55 + 0.28}` } as CSSProperties}>
            <WorldRacer theme={theme} index={index + 2} />
          </span>
        ))}
      </div>
      <div className="arena-gear is-left">
        {Array.from({ length: 5 }, (_, index) => (
          <span key={`gl${index}`} className="arena-prop is-gear" style={{ "--d": `${index * 0.7}` } as CSSProperties}>
            <WorldGear theme={theme} index={index} />
          </span>
        ))}
      </div>
      <div className="arena-gear is-right">
        {Array.from({ length: 5 }, (_, index) => (
          <span key={`gr${index}`} className="arena-prop is-gear" style={{ "--d": `${index * 0.7 + 0.35}` } as CSSProperties}>
            <WorldGear theme={theme} index={index + 1} />
          </span>
        ))}
      </div>
      {rushing ? <div className="arena-streaks" /> : null}
    </div>
  );
}

function WorldRacer({ theme, index }: { theme: ArenaTheme; index: number }) {
  if (theme === "cars") {
    return <CarArt color={CAR_COLORS[index % CAR_COLORS.length]} className="arena-side-art" />;
  }
  return (
    <DollArt
      dress={DOLL_DRESSES[index % DOLL_DRESSES.length]}
      hair={DOLL_HAIR[index % DOLL_HAIR.length]}
      className="arena-side-art is-doll"
    />
  );
}

function WorldGear({ theme, index }: { theme: ArenaTheme; index: number }) {
  if (theme === "cars") {
    return index % 2 === 0 ? <TireArt className="arena-gear-art" /> : <ConeArt className="arena-gear-art" />;
  }
  return index % 2 === 0 ? (
    <DressArt color={DOLL_DRESSES[index % DOLL_DRESSES.length]} className="arena-gear-art" />
  ) : (
    <BowArt className="arena-gear-art" />
  );
}

function ThemeRig({ theme }: { theme: ArenaTheme }) {
  if (theme === "dolls") {
    return (
      <div className="arena-rig is-dolls" aria-hidden="true">
        <DollArt className="arena-player-art is-doll" />
        <span className="arena-cart" />
      </div>
    );
  }
  return (
    <div className="arena-rig is-cars" aria-hidden="true">
      <CarArt color="#dc2626" className="arena-player-art" />
    </div>
  );
}

function QuestionBoard({
  locale,
  theme,
  round,
  picked,
  locked,
  onPick,
}: {
  locale: Locale;
  theme: ArenaTheme;
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
              className={`arena-gate is-${theme} ${state}`}
              onClick={() => onPick(index)}
            >
              {theme === "cars" ? (
                <CarArt color={CAR_COLORS[index] ?? "#dc2626"} className="arena-gate-art" />
              ) : (
                <DollArt
                  dress={DOLL_DRESSES[index] ?? "#db2777"}
                  hair={DOLL_HAIR[index] ?? "#431407"}
                  className="arena-gate-art is-doll"
                />
              )}
              <span className="arena-gate-letter">{letters[index]}</span>
              <span className="arena-gate-text">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
