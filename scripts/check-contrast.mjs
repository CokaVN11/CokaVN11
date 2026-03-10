/**
 * WCAG 2.2 AA/AAA contrast checker for folio-site design tokens.
 * Uses: accessible-colors (npm i -D accessible-colors)
 * Run:  node scripts/check-contrast.mjs
 */

import {
  getContrast,
  isAAContrast,
  isAAAContrast,
  suggestAAColorVariant,
} from "accessible-colors";

// ── Design tokens ──────────────────────────────────────────────────────────

const DARK = {
  bg:          "#000000",
  textPrimary: "#ffffff",
  textMuted:   "#757575", // was #555555 (2.82:1 ❌) → suggested fix
  textDim:     "#333333",
  accent:      "#ff8c00",
  border:      "#ff8c00",
  borderMuted: "#333333",
};

const LIGHT = {
  bg:          "#f5f0e8",
  sidebar:     "#ede8df",
  textPrimary: "#1a0a00",
  textMuted:   "#7b6456", // was #8a7060 (4.05:1 ❌) → must pass on both bg + sidebar
  textDim:     "#c4b8a8",
  accent:      "#ac4d09", // was #c4580a (3.9:1 ❌) → must pass on both bg + sidebar
  border:      "#1a0a00",
  borderMuted: "#c4b8a8",
};

// ── Color pairs to audit ───────────────────────────────────────────────────
// { label, fg, bg, usage, isLargeText, isUIComponent }

const PAIRS = [
  // Dark theme — readable text
  { label: "dark / text-primary",  fg: DARK.textPrimary, bg: DARK.bg,   usage: "body/heading text" },
  { label: "dark / text-muted",    fg: DARK.textMuted,   bg: DARK.bg,   usage: "secondary labels" },
  { label: "dark / text-dim",      fg: DARK.textDim,     bg: DARK.bg,   usage: "dot dividers (decorative)" },
  { label: "dark / accent",        fg: DARK.accent,      bg: DARK.bg,   usage: "accent text / headings" },

  // Dark theme — UI components (threshold 3:1)
  { label: "dark / border",        fg: DARK.border,      bg: DARK.bg,   usage: "borders", isUIComponent: true },
  { label: "dark / border-muted",  fg: DARK.borderMuted, bg: DARK.bg,   usage: "muted borders", isUIComponent: true },

  // Light theme — readable text
  { label: "light / text-primary", fg: LIGHT.textPrimary, bg: LIGHT.bg,      usage: "body/heading text" },
  { label: "light / text-muted",   fg: LIGHT.textMuted,   bg: LIGHT.bg,      usage: "secondary labels" },
  { label: "light / text-dim",     fg: LIGHT.textDim,     bg: LIGHT.bg,      usage: "dot dividers (decorative)" },
  { label: "light / accent",       fg: LIGHT.accent,      bg: LIGHT.bg,      usage: "accent text / headings" },

  // Light theme — sidebar
  { label: "light sidebar / text-primary", fg: LIGHT.textPrimary, bg: LIGHT.sidebar, usage: "sidebar text" },
  { label: "light sidebar / text-muted",   fg: LIGHT.textMuted,   bg: LIGHT.sidebar, usage: "sidebar labels" },
  { label: "light sidebar / accent",       fg: LIGHT.accent,      bg: LIGHT.sidebar, usage: "sidebar accent" },

  // Light theme — UI components (threshold 3:1)
  { label: "light / border",        fg: LIGHT.border,      bg: LIGHT.bg, usage: "borders", isUIComponent: true },
  { label: "light / border-muted",  fg: LIGHT.borderMuted, bg: LIGHT.bg, usage: "muted borders", isUIComponent: true },
];

// ── Reporter ───────────────────────────────────────────────────────────────

const PASS = "✅ PASS";
const FAIL = "❌ FAIL";
const COL  = { label: 40, fg: 10, bg: 10, ratio: 8, aa: 9, aaa: 9, usage: 30 };

function pad(str, len) {
  return String(str).padEnd(len);
}

function header() {
  console.log(
    "\n" +
    pad("Pair", COL.label) +
    pad("FG", COL.fg) +
    pad("BG", COL.bg) +
    pad("Ratio", COL.ratio) +
    pad("AA", COL.aa) +
    pad("AAA", COL.aaa) +
    "Usage"
  );
  console.log("─".repeat(130));
}

function checkPair({ label, fg, bg, usage, isUIComponent = false }) {
  const ratio   = getContrast(fg, bg, 2);
  // For UI components, WCAG uses 3:1 (treated as "large text" threshold in isAAContrast)
  const aaPass  = isUIComponent
    ? isAAContrast(fg, bg, true)   // large=true → 3:1 threshold
    : isAAContrast(fg, bg);        // normal → 4.5:1 threshold
  const aaaPass = isUIComponent
    ? isAAAContrast(fg, bg, true)  // large=true → 4.5:1 threshold
    : isAAAContrast(fg, bg);       // normal → 7:1 threshold

  const aaLabel  = aaPass  ? PASS : FAIL;
  const aaaLabel = aaaPass ? PASS : FAIL;

  console.log(
    pad(label, COL.label) +
    pad(fg, COL.fg) +
    pad(bg, COL.bg) +
    pad(`${ratio}:1`, COL.ratio) +
    pad(aaLabel, COL.aa) +
    pad(aaaLabel, COL.aaa) +
    usage
  );

  if (!aaPass) {
    const suggestion = suggestAAColorVariant(fg, bg, isUIComponent);
    const suggestedRatio = getContrast(suggestion, bg, 2);
    console.log(
      `${"".padEnd(COL.label)}  → suggested fix: ${suggestion} (${suggestedRatio}:1)`
    );
  }
}

// ── Run ────────────────────────────────────────────────────────────────────

console.log("╔══════════════════════════════════════════════════╗");
console.log("║  folio-site — WCAG 2.2 AA/AAA Contrast Checker   ║");
console.log("╚══════════════════════════════════════════════════╝");

header();
for (const pair of PAIRS) {
  checkPair(pair);
}

console.log("\nThresholds: AA normal ≥4.5:1 · AA large/UI ≥3:1 · AAA normal ≥7:1 · AAA large/UI ≥4.5:1");
console.log("Note: purely decorative elements (text-dim, border-muted) are WCAG-exempt per SC 1.4.3\n");