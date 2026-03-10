import { useEffect, useRef, useState } from "react";

interface SectionUnlockedOverlayProps {
  section: string;
  onDismiss: () => void;
  onViewSection: () => void;
}

export function SectionUnlockedOverlay({
  section,
  onDismiss,
  onViewSection,
}: SectionUnlockedOverlayProps) {
  const TITLE = "★ SECTION UNLOCKED ★";
  const [typedTitle, setTypedTitle] = useState("");
  const [showSection, setShowSection] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const onDismissRef = useRef(onDismiss);
  const onViewRef = useRef(onViewSection);

  useEffect(() => {
    onDismissRef.current = onDismiss;
    onViewRef.current = onViewSection;
  });

  // Typewriter effect for title
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedTitle(TITLE.slice(0, i));
      if (i >= TITLE.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Show section name at 800ms
  useEffect(() => {
    const t = setTimeout(() => setShowSection(true), 800);
    return () => clearTimeout(t);
  }, []);

  // Show prompt at 1200ms
  useEffect(() => {
    const t = setTimeout(() => setShowPrompt(true), 1200);
    return () => clearTimeout(t);
  }, []);

  // Auto-dismiss at 4000ms
  useEffect(() => {
    const t = setTimeout(() => onDismissRef.current(), 4000);
    return () => clearTimeout(t);
  }, []);

  // Keyboard listeners
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") onViewRef.current();
      if (e.key === "Escape") onDismissRef.current();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onDismiss}
    >
      <div
        className="flex flex-col items-center gap-4 border-2 px-10 py-8 text-center"
        style={{
          borderColor: "var(--unlock-border)",
          boxShadow: "0 0 24px var(--unlock-border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-name" style={{ color: "var(--accent)", minHeight: "1.5em" }}>
          {typedTitle}
        </p>

        {showSection && <p className="text-heading text-accent">{section}</p>}

        {showPrompt && (
          <p className="insert-coin-blink text-ui" style={{ color: "var(--text-muted)" }}>
            PRESS [ENTER] TO VIEW
          </p>
        )}
      </div>
    </div>
  );
}
