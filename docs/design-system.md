# Design System — PORTFOLIO OS

## Typography

**Font**: `Press Start 2P` (Google Fonts) — used exclusively throughout.
No mixing with other fonts. All text uppercase.

### Scale

| Token | Size | Usage |
|---|---|---|
| `--text-hero` | 28px | Screen titles (GAME OVER, PORTFOLIO OS) |
| `--text-name` | 20px | Player name (COKA) on INSERT COIN |
| `--text-heading` | 14px | Section headings (/ OVERVIEW, EXPERIENCE) |
| `--text-body` | 11px | Nav labels, job titles |
| `--text-ui` | 9px | HUD values, nav shortcuts |
| `--text-label` | 8px | HUD labels, muted meta |
| `--text-micro` | 7px | Footer, copyright |

## Color Tokens

```css
:root[data-theme="dark"] {
  /* Backgrounds */
  --bg:            #000000;  /* Pure black — main background */
  --bg-sidebar:    #000000;  /* Sidebar/panel background */
  --bg-canvas:     #000000;  /* Game canvas background */

  /* Text */
  --text-primary:  #FFFFFF;  /* Main body text */
  --text-muted:    #555555;  /* HUD labels, inactive nav, meta */
  --text-dim:      #333333;  /* Dot dividers */

  /* Accents */
  --accent:        #FF8C00;  /* Orange — primary accent, cursor ►, active nav */
  --score:         #39FF14;  /* Neon green — score, status LED, SECTION_UNLOCKED */

  /* Bricks */
  --brick-1:       #00E5FF;  /* Cyan — row 1 (100pts) */
  --brick-2:       #FF4081;  /* Pink — row 2 (200pts) */
  --brick-3:       #FF8C00;  /* Orange — row 3 (300pts) */

  /* Game elements */
  --ball:          #00E5FF;  /* Ball color */
  --paddle:        #FFFFFF;  /* Paddle color */

  /* Borders */
  --border:        #FF8C00;  /* Canvas border, active elements */
  --border-muted:  #333333;  /* Inactive borders */

  /* Overlays */
  --unlock-border: #39FF14;  /* SECTION_UNLOCKED box border */
  --scanline:      rgba(0,0,0,0.08);
  --vignette:      rgba(0,0,0,0.6);
}

:root[data-theme="light"] {
  /* Backgrounds */
  --bg:            #F5F0E8;  /* Warm cream — aged arcade marquee */
  --bg-sidebar:    #EDE8DF;  /* Slightly darker cream */
  --bg-canvas:     #F5F0E8;

  /* Text */
  --text-primary:  #1A0A00;  /* Near-black warm brown */
  --text-muted:    #8A7060;  /* Muted brown */
  --text-dim:      #C4B8A8;  /* Dot dividers */

  /* Accents */
  --accent:        #C4580A;  /* Darker orange (readable on cream) */
  --score:         #1A7A00;  /* Dark green */

  /* Bricks */
  --brick-1:       #0891B2;  /* Teal */
  --brick-2:       #BE185D;  /* Rose */
  --brick-3:       #C4580A;  /* Amber */

  /* Game elements */
  --ball:          #1A0A00;
  --paddle:        #1A0A00;

  /* Borders */
  --border:        #1A0A00;
  --border-muted:  #C4B8A8;

  /* Overlays */
  --unlock-border: #1A7A00;
  --scanline:      rgba(0,0,0,0.04);
  --vignette:      rgba(180,160,140,0.3);
}
```

## Spacing System

Base unit: **8px**

| Token | Value | Usage |
|---|---|---|
| `--space-1` | 8px | Tight gaps, brick internal padding |
| `--space-2` | 16px | Standard gap (HUD→canvas, canvas→nav) |
| `--space-3` | 24px | Section separation |
| `--space-4` | 32px | Large gaps |
| `--space-5` | 40px | Bar heights (top bar, footer) |

## Shared Chrome Components

### Top Bar (40px height)
```
[P] PORTFOLIO OS    [B] BLOG  [E] EVENTS  [G] GITHUB    [C] CONSOLE
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
  content: '';
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
  content: '';
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
  0%, 100% { opacity: 1 }
  92%       { opacity: 0.98 }
  94%       { opacity: 1 }
  96%       { opacity: 0.97 }
}

[data-theme="dark"] .game-canvas {
  animation: crtFlicker 4s infinite;
}
```
