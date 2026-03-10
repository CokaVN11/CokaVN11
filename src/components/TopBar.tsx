import { toggleTheme } from "@/lib/theme";
import type { Screen } from "@/lib/types";
import { BackButton } from "./ui/back-button";

interface TopBarProps {
  screen: Screen;
}

const DEFAULT_NAV = [
  { key: "B", label: "BLOG", href: "#" },
  { key: "E", label: "EVENTS", href: "#" },
  { key: "G", label: "GITHUB", href: "https://github.com/coka" },
  { key: "C", label: "CONSOLE", href: "#" },
];

const CV_NAV = [
  { key: "G", label: "GITHUB", href: "https://github.com/coka" },
  { key: "L", label: "LINKEDIN", href: "https://linkedin.com/in/coka" },
  { key: "D", label: "DOWNLOAD CV", href: "/cv.pdf" },
];

export function TopBar({ screen }: TopBarProps) {
  const navItems = screen === "cv-list" ? CV_NAV : DEFAULT_NAV;
  // current path
  const path = window.location.pathname;

  return (
    <header className="chrome-bar border-b border-b-(--border-muted) w-full max-w-dvh">
      {path !== "/" && (
        <BackButton onBack={() => window.history.back()} label={"Return"} />
      )}
      {/* Left: logo */}
      <span className="text-micro whitespace-nowrap color-primary">
        <span className="text-accent">[P]</span>
        {" PORTFOLIO OS"}
      </span>

      {/* Center: nav links */}
      <nav className="flex gap-4">
        {navItems.map(({ key, label, href }) => (
          <a
            key={key}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="text-micro color-primary no-underline transition-colors hover:text-accent"
          >
            <span className="text-accent">[{key}]</span> {label}
          </a>
        ))}
      </nav>

      {/* Right: theme toggle */}
      <button
        onClick={toggleTheme}
        className="cursor-pointer border-0 bg-transparent text-micro whitespace-nowrap text-accent"
        aria-label="Toggle theme"
      >
        [T]
      </button>
    </header>
  );
}
