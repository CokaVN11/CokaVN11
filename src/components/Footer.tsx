import { cn } from "@/lib/utils";
import { useGameStore } from "@/stores/gameStore";
import type { Screen } from "@/lib/types";

interface FooterProps {
  screen: Screen;
  onToggleMode: () => void;
  className?: string;
}

export function Footer({ screen, onToggleMode, className }: FooterProps) {
  const highScore = useGameStore((s) => s.highScore);
  const hiScoreStr = String(highScore).padStart(4, "0");

  const modeLabel = screen === "cv-list" ? "[PLAY MODE]" : "[LIST MODE]";

  return (
    <footer
      className={cn("chrome-bar justify-between border-t border-t-(--border-muted)", className)}
    >
      <span className="text-micro color-primary">
        © 2025 <span className="text-accent">COKA</span>
        {"  ·  "}1 CREDIT{"  ·  "}HI-SC {hiScoreStr}
      </span>

      <button
        onClick={onToggleMode}
        className="cursor-pointer border-0 bg-transparent text-micro text-accent"
        aria-label={`Switch to ${screen === "cv-list" ? "play" : "list"} mode`}
      >
        {modeLabel}
      </button>
    </footer>
  );
}
