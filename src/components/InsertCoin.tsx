import { memo, useEffect, useRef, useState } from "react";
import { DotDivider } from "@/components/ui/dot-divider";

interface InsertCoinProps {
  onEnter: () => void;
}

// Keys used as global shortcuts — must not trigger onEnter
const RESERVED_KEYS = new Set(["t", "b", "e", "g", "c"]);

// Task 8.2 — eased count-up from 0 to target over duration ms
function useCountUp(target: number, duration = 800, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let rafId: number;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (start === null) start = ts;
      const elapsed = ts - start;
      const t = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) rafId = requestAnimationFrame(tick);
    };
    const timeoutId = setTimeout(() => {
      rafId = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
    };
  }, [target, duration, delay]);
  return value;
}

// ── Attract screens ───────────────────────────────────────────────────────────

// Task 8.3 — Title screen
const AttractTitle = memo(function AttractTitle({
  hiScore,
  flickerNames,
}: {
  hiScore: number;
  flickerNames: boolean;
}) {
  const hiScoreStr = String(hiScore).padStart(4, "0");

  return (
    <div className="arcade-stack text-center">
      {/* HI-SCORE row */}
      <div className="mb-4 flex justify-center gap-16">
        <div className="flex flex-col items-center gap-1">
          <span className="text-micro" style={{ color: "var(--text-muted)" }}>
            1ST
          </span>
          <span
            className={
              flickerNames
                ? "score-glow-pulse text-flicker text-label"
                : "score-glow-pulse text-label"
            }
            style={{ color: "var(--accent)" }}
          >
            PLAYER 1
          </span>
          <span className="score-glow text-label" style={{ color: "var(--accent)" }}>
            {hiScoreStr}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-micro" style={{ color: "var(--text-muted)" }}>
            2ND
          </span>
          <span
            className={
              flickerNames
                ? "score-glow-pulse text-flicker text-label"
                : "score-glow-pulse text-label"
            }
            style={{ color: "var(--accent)", animationDelay: "0.2s" }}
          >
            PLAYER 2
          </span>
          <span className="score-glow text-label" style={{ color: "var(--accent)" }}>
            {hiScoreStr}
          </span>
        </div>
      </div>

      {/* Stars row */}
      <div className="flex justify-center gap-2 text-hero" style={{ color: "var(--accent)" }}>
        {"★ ★ ★".split("").map((c, i) => (
          <span key={i} style={{ animationDelay: `${i * 0.2}s` }} className="star-twinkle">
            {c}
          </span>
        ))}
      </div>

      <h1 className="text-flicker text-name" style={{ color: "var(--accent)" }}>
        PORTFOLIO OS
      </h1>

      <DotDivider />

      <p className="insert-coin-blink text-name" style={{ color: "var(--accent)" }}>
        ► INSERT COIN ◄
      </p>

      <DotDivider />
    </div>
  );
});

// Task 8.4 — Demo Reel screen
const AttractDemo = memo(function AttractDemo() {
  const brickColors = ["--brick-1", "--brick-2", "--brick-3"];
  return (
    <div className="arcade-stack text-center">
      <p className="text-label" style={{ color: "var(--text-muted)" }}>
        - - DEMO - -
      </p>

      {/* Preview box */}
      <div
        className="relative mx-auto px-4 py-4"
        style={{
          width: 200,
          border: "1px solid var(--border-muted)",
        }}
      >
        <span className="corner-accent" style={{ top: -1, left: -1 }}>
          ┌
        </span>
        <span className="corner-accent" style={{ top: -1, right: -1 }}>
          ┐
        </span>
        <span className="corner-accent" style={{ bottom: -1, left: -1 }}>
          └
        </span>
        <span className="corner-accent" style={{ bottom: -1, right: -1 }}>
          ┘
        </span>

        {brickColors.map((cssVar) => (
          <div key={cssVar} className="mb-1 flex justify-center gap-1">
            {Array.from({ length: 5 }).map((_, colIdx) => (
              <div
                key={colIdx}
                style={{
                  width: 28,
                  height: 8,
                  background: `var(${cssVar})`,
                  opacity: 0.85,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <p className="text-micro" style={{ color: "var(--text-muted)" }}>
        BREAK BRICKS — UNLOCK YOUR CV
      </p>
    </div>
  );
});

// Task 8.5 — How to Play screen
const AttractHowTo = memo(function AttractHowTo() {
  const controls = [
    { key: "← →", action: "MOVE PADDLE" },
    { key: "SPACE", action: "LAUNCH BALL" },
    { key: "ENTER", action: "VIEW SECTION" },
    { key: "[T]", action: "TOGGLE THEME" },
    { key: "[G]", action: "GITHUB" },
  ];

  return (
    <div className="arcade-stack text-center">
      <p className="text-label" style={{ color: "var(--accent)" }}>
        H O W &nbsp; T O &nbsp; P L A Y
      </p>
      <div className="mt-4 flex flex-col gap-3">
        {controls.map(({ key, action }) => (
          <div key={key} className="flex justify-between gap-8">
            <span className="text-micro" style={{ color: "var(--accent)" }}>
              {key}
            </span>
            <span className="text-micro" style={{ color: "var(--text-muted)" }}>
              {action}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

// ── Root ──────────────────────────────────────────────────────────────────────

export const InsertCoin = memo(function InsertCoin({ onEnter }: InsertCoinProps) {
  const [attractIndex, setAttractIndex] = useState(0);
  const [flickerNames, setFlickerNames] = useState(false);
  const onEnterRef = useRef(onEnter);

  useEffect(() => {
    onEnterRef.current = onEnter;
  });

  // Task 8.2 — hi-score count-up from 0 → 9001 over 800ms with 0ms delay
  const hiScore = useCountUp(9001, 800, 0);

  // Task 8.2 — add text-flicker to PLAYER names after 200ms
  useEffect(() => {
    const t = setTimeout(() => setFlickerNames(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Task 8.1 — attract cycle with setInterval(4000)
  useEffect(() => {
    const interval = setInterval(() => {
      setAttractIndex((i) => (i + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Task 8.6 — keydown: skip reserved keys, call onEnter for all others
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (RESERVED_KEYS.has(e.key.toLowerCase())) return;
      onEnterRef.current();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      className="flex flex-1 cursor-pointer items-center justify-center"
      onClick={() => onEnterRef.current()}
    >
      {attractIndex === 0 && <AttractTitle hiScore={hiScore} flickerNames={flickerNames} />}
      {attractIndex === 1 && <AttractDemo />}
      {attractIndex === 2 && <AttractHowTo />}
    </div>
  );
});
