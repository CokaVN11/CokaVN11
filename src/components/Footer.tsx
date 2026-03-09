import { cn } from "@/lib/utils";

interface FooterProps {
  type: "PLAY" | "LIST";
  className?: string;
}

export function Footer({ type, className }: FooterProps) {
  const scoreStr = "9999";
  const modeLabel = type === "PLAY" ? "[PLAY MODE]" : "[LIST MODE]";
  return (
    <footer
      className={cn(
        `chrome-bar border-t border-t-(--border-muted) justify-between`,
        className,
      )}
    >
      <span className="color-primary text-micro md:text-label lg:text-ui">
        © 2026 <span className="text-accent">COKA</span>
        {"  ·  "}1 CREDIT{"  ·  "}HI-SCORE {scoreStr}
      </span>

      <button
        onClick={() => {
          const newType = type === "PLAY" ? "LIST" : "PLAY";
          window.dispatchEvent(
            new CustomEvent("mode-change", { detail: newType }),
          );
        }}
        className="cursor-pointer border-0 bg-transparent text-accent text-micro md:text-label lg:text-ui"
        aria-label={`Switch to ${type === "PLAY" ? "LIST" : "PLAY"} mode`}
      >
        {modeLabel}
      </button>
    </footer>
  );
}
