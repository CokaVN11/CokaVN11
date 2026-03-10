# Design System — Coka Portfolio

## Typography

**Font**: `Press Start 2P` (Google Fonts) — used exclusively throughout.
No mixing with other fonts. All text uppercase.

### Scale

| Token            | Size | Usage                                     |
| ---------------- | ---- | ----------------------------------------- |
| `--text-hero`    | 28px | Screen titles (GAME OVER, Coka Portfolio) |
| `--text-name`    | 20px | Player name (COKA) on INSERT COIN         |
| `--text-heading` | 14px | Section headings (/ OVERVIEW, EXPERIENCE) |
| `--text-body`    | 11px | Nav labels, job titles                    |
| `--text-ui`      | 9px  | HUD values, nav shortcuts                 |
| `--text-label`   | 8px  | HUD labels, muted meta                    |
| `--text-micro`   | 7px  | Footer, copyright                         |

## Color Tokens

```css
:root[data-theme="dark"] {
  /* Backgrounds */
  --bg: #000000; /* Pure black — main background */
  --bg-sidebar: #000000; /* Sidebar/panel background */
  --bg-canvas: #000000; /* Game canvas background */

  /* Text */
  --text-primary: #ffffff; /* Main body text */
  --text-muted: #555555; /* HUD labels, inactive nav, meta */
  --text-dim: #333333; /* Dot dividers */

  /* Accents */
  --accent: #ff8c00; /* Orange — primary accent, cursor ►, active nav */
  --score: #39ff14; /* Neon green — score, status LED, SECTION_UNLOCKED */

  /* Bricks */
  --brick-1: #00e5ff; /* Cyan — row 1 (100pts) */
  --brick-2: #ff4081; /* Pink — row 2 (200pts) */
  --brick-3: #ff8c00; /* Orange — row 3 (300pts) */

  /* Game elements */
  --ball: #00e5ff; /* Ball color */
  --paddle: #ffffff; /* Paddle color */

  /* Borders */
  --border: #ff8c00; /* Canvas border, active elements */
  --border-muted: #333333; /* Inactive borders */

  /* Overlays */
  --unlock-border: #39ff14; /* SECTION_UNLOCKED box border */
  --scanline: rgba(0, 0, 0, 0.08);
  --vignette: rgba(0, 0, 0, 0.6);
}

:root[data-theme="light"] {
  /* Backgrounds */
  --bg: #f5f0e8; /* Warm cream — aged arcade marquee */
  --bg-sidebar: #ede8df; /* Slightly darker cream */
  --bg-canvas: #f5f0e8;

  /* Text */
  --text-primary: #1a0a00; /* Near-black warm brown */
  --text-muted: #8a7060; /* Muted brown */
  --text-dim: #c4b8a8; /* Dot dividers */

  /* Accents */
  --accent: #c4580a; /* Darker orange (readable on cream) */
  --score: #1a7a00; /* Dark green */

  /* Bricks */
  --brick-1: #0891b2; /* Teal */
  --brick-2: #be185d; /* Rose */
  --brick-3: #c4580a; /* Amber */

  /* Game elements */
  --ball: #1a0a00;
  --paddle: #1a0a00;

  /* Borders */
  --border: #1a0a00;
  --border-muted: #c4b8a8;

  /* Overlays */
  --unlock-border: #1a7a00;
  --scanline: rgba(0, 0, 0, 0.04);
  --vignette: rgba(180, 160, 140, 0.3);
}
```

## Spacing System

Base unit: **8px**

| Token       | Value | Usage                                 |
| ----------- | ----- | ------------------------------------- |
| `--space-1` | 8px   | Tight gaps, brick internal padding    |
| `--space-2` | 16px  | Standard gap (HUD→canvas, canvas→nav) |
| `--space-3` | 24px  | Section separation                    |
| `--space-4` | 32px  | Large gaps                            |
| `--space-5` | 40px  | Bar heights (top bar, footer)         |

## Shared Chrome Components

### Top Bar (40px height)

```
[P] Coka Portfolio    [B] BLOG  [E] EVENTS  [G] GITHUB    [C] CONSOLE
```

- Full bleed, no margin
- `--text-accent` for logo `[P]`
- `--text-muted` for shortcut brackets `[B]`
- `--text-primary` for shortcut labels

### Footer Bar (40px height)

```
© 2025  COKA  ·  1 CREDIT  ·  HI-SC 9,001              [LIST MODE]
```

- Full bleed
- All 7px `--text-micro`
- `[LIST MODE]` / `[PLAY MODE]` toggle right-aligned

### Dot Divider

```
· · · · · · · · · · · · · · · · · · · · · · · · · · · ·
```

- 16px margin top and bottom
- Color: `--text-dim`
- Light mode uses `▪` instead of `·`

### Theme Toggle

```
[◐] DARK   [◑] LIGHT
```

- Top-right corner of top bar, or keyboard `[T]`

## CRT Scanline System

```css
/* Scanlines overlay — applied via ::after on .game-canvas */
.game-canvas::after {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    var(--scanline) 2px,
    var(--scanline) 4px
  );
  pointer-events: none;
  z-index: 10;
}

/* Corner vignette */
.game-canvas::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 60%,
    var(--vignette) 100%
  );
  pointer-events: none;
  z-index: 9;
}

/* Phosphor glow on score */
.score-value {
  text-shadow:
    0 0 8px var(--score),
    0 0 16px color-mix(in srgb, var(--score) 40%, transparent);
}

/* Screen flicker — dark mode only */
@keyframes crtFlicker {
  0%,
  100% {
    opacity: 1;
  }
  92% {
    opacity: 0.98;
  }
  94% {
    opacity: 1;
  }
  96% {
    opacity: 0.97;
  }
}

[data-theme="dark"] .game-canvas {
  animation: crtFlicker 4s infinite;
}
```
