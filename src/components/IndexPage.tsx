import { useCallback, useEffect, useState } from "react";
import { useGameStore } from "@/stores/gameStore";
import { toggleTheme } from "@/lib/theme";
import type { NavSection } from "@/lib/resume/types";
import { TopBar } from "@/components/TopBar";
import { Footer } from "@/components/Footer";
import { InsertCoin } from "@/components/InsertCoin";
import { PlayMode } from "@/components/PlayMode";
import { CVList } from "@/components/CVList";

export default function IndexPage() {
  const currentScreen = useGameStore((s) => s.currentScreen);
  const setScreen = useGameStore((s) => s.setScreen);
  const [cvSection, setCvSection] = useState<NavSection>("OVERVIEW");

  // Task 12.4 — screen callbacks
  const handleEnterCoin = useCallback(() => {
    setScreen("play-mode");
  }, [setScreen]);

  const handleViewSection = useCallback(
    (section: string) => {
      setCvSection(section as NavSection);
      setScreen("cv-list");
    },
    [setScreen],
  );

  const handleBackToPlay = useCallback(() => {
    setScreen("play-mode");
  }, [setScreen]);

  const handleModeToggle = useCallback(() => {
    if (currentScreen === "play-mode") {
      setScreen("cv-list");
    } else if (currentScreen === "cv-list") {
      setScreen("play-mode");
    }
  }, [currentScreen, setScreen]);

  // Task 12.5 — global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "t":
          toggleTheme();
          break;
        case "g":
          window.open("https://github.com/coka", "_blank", "noopener,noreferrer");
          break;
        case "p":
          setScreen("insert-coin");
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setScreen]);

  return (
    <div
      className="crt-canvas crt-flicker flex flex-col"
      style={{ minHeight: "100vh", background: "var(--bg)" }}
    >
      {/* Task 12.2 — persistent chrome (never unmounts) */}
      <TopBar screen={currentScreen} />

      {/* Task 12.3 — screen content swap */}
      <main className="flex-1 overflow-hidden">
        {currentScreen === "insert-coin" && <InsertCoin onEnter={handleEnterCoin} />}
        {currentScreen === "play-mode" && <PlayMode onViewSection={handleViewSection} />}
        {currentScreen === "cv-list" && (
          <CVList initialSection={cvSection} onBack={handleBackToPlay} />
        )}
      </main>

      <Footer screen={currentScreen} onToggleMode={handleModeToggle} />
    </div>
  );
}
