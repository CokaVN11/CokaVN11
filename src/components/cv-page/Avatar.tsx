import { useEffect, useState } from "react";

export function Avatar() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="relative flex shrink-0 flex-col items-center justify-center"
      style={{
        width: 80,
        height: 80,
        border: "1px solid var(--border)",
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

      <span className={`text-heading color-accent${mounted ? " text-flicker" : ""}`}>◈</span>
      <span className="mt-1 text-micro color-muted">PLAYER 1</span>
    </div>
  );
}
