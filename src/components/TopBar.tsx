import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { getTheme, toggleTheme } from "@/lib/theme";
import type { Screen } from "@/lib/types";
import { BackButton } from "./ui/back-button";

interface TopBarProps {
  screen: Screen;
}

const DEFAULT_NAV = [
  { key: "G", label: "GITHUB", href: "https://github.com/CokaVN11" },
  {
    key: "L",
    label: "LINKEDIN",
    href: "https://www.linkedin.com/in/ngckhanh/",
  },
  { key: "C", label: "CV", href: "/cv" },
];

const CV_NAV = [
  { key: "G", label: "GITHUB", href: "https://github.com/CokaVN11" },
  {
    key: "L",
    label: "LINKEDIN",
    href: "https://www.linkedin.com/in/ngckhanh/",
  },
  { key: "D", label: "DOWNLOAD CV", href: "/cv.pdf" },
];

export function TopBar({ screen }: TopBarProps) {
  const navItems = screen === "cv-list" ? CV_NAV : DEFAULT_NAV;
  const location = useLocation();
  const path = location.pathname;
  const [theme, setTheme] = useState<"dark" | "light">(getTheme);

  useEffect(() => {
    const handler = (e: Event) =>
      setTheme((e as CustomEvent<"dark" | "light">).detail);
    document.addEventListener("theme-change", handler);
    return () => document.removeEventListener("theme-change", handler);
  }, []);

  return (
    <header className="chrome-bar border-b border-b-(--border-muted) w-full">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-6">
          {path === "/cv" && (
            <BackButton onBack={() => window.history.back()} label={"Return"} />
          )}
          {/* Left: logo */}
          <span className="text-micro whitespace-nowrap score-glow shrink-0 flex items-center gap-1">
            COKA.EXE
          </span>

          {/* Separator */}
          <span
            className="self-stretch w-px shrink-0"
            style={{ background: "var(--border-muted)" }}
          />

          {/* Nav links */}
          <nav className="flex gap-4">
            {navItems.map(({ key, label, href }) => {
              const isActive = !href.startsWith("http") && path === href;
              return (
                <a
                  key={key}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  className={`text-micro no-underline transition-colors px-1 ${
                    isActive
                      ? "bg-foreground text-background"
                      : "color-primary hover:color-accent"
                  }`}
                >
                  <span className={isActive ? "" : "text-accent"}>[{key}]</span>{" "}
                  {label}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Right: theme toggle */}
        <button
          onClick={toggleTheme}
          className="cursor-pointer border-0 bg-transparent text-label text-accent whitespace-nowrap flex items-center"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
