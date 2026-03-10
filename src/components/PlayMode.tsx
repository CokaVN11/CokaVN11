import { useCallback, useEffect, useRef } from "react";
import { useGameStore } from "@/stores/gameStore";
import { NAV_SECTIONS } from "@/lib/resume/types";
import { DotDivider } from "@/components/ui/dot-divider";
import { SectionUnlockedOverlay } from "@/components/SectionUnlockedOverlay";
import {
  destroyGame,
  dismissUnlock,
  initGame,
  launch,
  movePaddleLeft,
  movePaddleRight,
  resetGame,
  setPaddleTarget,
} from "@/lib/game/engine";

interface PlayModeProps {
  onViewSection: (section: string) => void;
}

// ── HUD strip (task 11.5) ─────────────────────────────────────────────────────

function HUDStrip() {
  const score = useGameStore((s) => s.score);
  const highScore = useGameStore((s) => s.highScore);
  const lives = useGameStore((s) => s.lives);
  const stage = useGameStore((s) => s.stage);
  const speed = useGameStore((s) => s.speed);

  const scoreStr = String(score).padStart(6, "0");
  const hiStr = String(highScore).padStart(6, "0");

  const heartsMax = 3;
  const speedPipsMax = 5;

  return (
    <div
      className="flex items-start justify-between px-2 py-1"
      style={{ fontSize: "var(--text-micro)" }}
    >
      {/* Left: HI-SC + SCORE */}
      <div className="flex flex-col gap-1">
        <span style={{ color: "var(--text-muted)" }}>HI-SC</span>
        <span style={{ color: "var(--accent)" }} className="score-glow">
          {hiStr}
        </span>
        <span style={{ color: "var(--text-muted)" }}>SCORE</span>
        <span style={{ color: "var(--text-primary)" }}>{scoreStr}</span>
      </div>

      {/* Center: STAGE */}
      <div className="flex flex-col items-center gap-1">
        <span style={{ color: "var(--text-muted)" }}>P·1</span>
        <span style={{ color: "var(--text-muted)" }}>STAGE</span>
        <span style={{ color: "var(--text-primary)" }}>{String(stage).padStart(2, "0")}/06</span>
      </div>

      {/* Right: LIVES + SPEED */}
      <div className="flex flex-col items-end gap-1">
        <span style={{ color: "var(--text-muted)" }}>LIVES</span>
        <span style={{ color: "var(--text-primary)" }}>
          {Array.from({ length: heartsMax }, (_, i) => (i < lives ? "♥" : "♡")).join("")}
        </span>
        <span style={{ color: "var(--text-muted)" }}>SPEED</span>
        <span style={{ color: "var(--accent)" }}>
          {Array.from({ length: speedPipsMax }, (_, i) => (i < speed ? "●" : "○")).join("")}
        </span>
      </div>
    </div>
  );
}

// ── Section nav row (task 11.8) ───────────────────────────────────────────────

function SectionNav({ onViewSection }: { onViewSection: (section: string) => void }) {
  const unlockedSections = useGameStore((s) => s.unlockedSections);
  const justUnlocked = useGameStore((s) => s.justUnlocked);

  return (
    <div className="flex justify-center gap-4 py-2">
      {NAV_SECTIONS.map((section) => {
        const isUnlocked = unlockedSections.includes(section);
        const isActive = justUnlocked === section;
        return (
          <button
            key={section}
            onClick={() => isUnlocked && onViewSection(section)}
            className="cursor-pointer border-0 bg-transparent text-micro"
            style={{
              color: isUnlocked ? "var(--text-primary)" : "var(--text-muted)",
              textDecoration: "none",
            }}
            disabled={!isUnlocked}
          >
            {isActive ? "►" : " "} {section}
          </button>
        );
      })}
    </div>
  );
}

// ── Canvas container (task 11.6) ──────────────────────────────────────────────

function CanvasContainer({
  canvasRef,
  status,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  status: string;
}) {
  return (
    <div className="relative">
      {/* Top divider */}
      <DotDivider count={20} />

      {/* Canvas frame */}
      <div
        className="relative"
        style={{
          border: "2px solid var(--border)",
          boxShadow: "0 0 16px var(--border)",
        }}
      >
        {/* Corner accents */}
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

        <canvas
          ref={canvasRef}
          className="block"
          style={{ display: "block", background: "var(--bg-canvas)" }}
        />

        {/* Idle overlay */}
        {status === "idle" && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.4)" }}
          >
            <span className="insert-coin-blink text-ui" style={{ color: "var(--text-primary)" }}>
              PRESS [SPACE] TO LAUNCH
            </span>
          </div>
        )}

        {/* Game over overlay */}
        {status === "gameover" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4"
            style={{ background: "rgba(0,0,0,0.75)" }}
          >
            <span className="text-name" style={{ color: "var(--accent)" }}>
              GAME OVER
            </span>
            <span className="text-ui" style={{ color: "var(--text-muted)" }}>
              PRESS [ESC] TO RESET
            </span>
          </div>
        )}
      </div>

      {/* Bottom divider */}
      <DotDivider count={20} />
    </div>
  );
}

// ── Root (task 11.1) ──────────────────────────────────────────────────────────

export function PlayMode({ onViewSection }: PlayModeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const status = useGameStore((s) => s.status);
  const justUnlocked = useGameStore((s) => s.justUnlocked);
  const onViewRef = useRef(onViewSection);

  useEffect(() => {
    onViewRef.current = onViewSection;
  });

  // Task 11.1 — init game engine on mount
  useEffect(() => {
    if (!canvasRef.current) return;
    initGame(canvasRef.current);
    return () => destroyGame();
  }, []);

  // Task 11.2 — canvas sizing: maintain 4:3 ratio
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const maxW = container.clientWidth;
    const maxH = container.clientHeight;
    let w = maxW;
    let h = Math.round(w * (3 / 4));
    if (h > maxH) {
      h = maxH;
      w = Math.round(h * (4 / 3));
    }
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
  }, []);

  useEffect(() => {
    resizeCanvas();
    const obs = new ResizeObserver(resizeCanvas);
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [resizeCanvas]);

  // Task 11.3 — mouse move → set paddle target
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handler = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setPaddleTarget(e.clientX - rect.left);
    };
    canvas.addEventListener("mousemove", handler);
    return () => canvas.removeEventListener("mousemove", handler);
  }, []);

  // Task 11.4 — keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
        case "a":
          movePaddleLeft();
          break;
        case "ArrowRight":
        case "d":
          movePaddleRight();
          break;
        case " ":
          e.preventDefault();
          if (status === "idle") launch();
          break;
        case "Enter":
          if (status === "section_unlocked") {
            const section = useGameStore.getState().justUnlocked;
            if (section) onViewRef.current(section);
            dismissUnlock();
          }
          break;
        case "Escape":
          resetGame();
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [status]);

  return (
    <div className="flex h-full flex-col px-4 py-2">
      {/* Task 11.5 — HUD strip */}
      <HUDStrip />

      {/* Task 11.6 — Canvas */}
      <div ref={containerRef} className="flex flex-1 flex-col justify-center">
        <CanvasContainer canvasRef={canvasRef} status={status} />
      </div>

      {/* Task 11.8 — Section nav */}
      <SectionNav onViewSection={onViewSection} />

      {/* Task 11.7 — Section unlocked overlay */}
      {status === "section_unlocked" && justUnlocked && (
        <SectionUnlockedOverlay
          section={justUnlocked}
          onDismiss={dismissUnlock}
          onViewSection={() => {
            onViewRef.current(justUnlocked);
            dismissUnlock();
          }}
        />
      )}
    </div>
  );
}
