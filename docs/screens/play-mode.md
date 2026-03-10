# Play Mode — Design Spec

## Purpose

The core portfolio experience. A Breakout-style arcade game where each row of bricks represents a CV section. Breaking all bricks in a row unlocks that section. The game IS the navigation — not a gimmick layered on top of it.

## Key Principle: Same Chrome as INSERT COIN

The play mode is the same screen as INSERT COIN with the content area replaced by the game. No sidebar. No separate nav panel. The top bar and footer are identical.

## Layout

```
╔═════════════════════════════════════════════════════════════════╗
║  [P] Coka Portfolio    [B] BLOG  [E] EVENTS  [G] GITHUB  [C] CONSOLE  ║
╠═════════════════════════════════════════════════════════════════╣
║                                                                 ║
║    HI-SC  00009001          P·1          LIVES  ♥ ♥ ♡           ║
║    SCORE  00001250       STAGE 01/06     SPEED  ●●○○○           ║
║                                                                 ║
║  · · · · · · · · · · · · · · · · · · · · · · · · · · · · · ·   ║
║                                                                 ║
║  ┌─────────────────────────────────────────────────────────┐   ║
║  │  ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░    │   ║  ← cyan row
║  │  ████ ████ ████ ████ ████ ████ ████ ████ ████ ████    │   ║  ← pink row
║  │    ▓▓▓▓▓  ▓▓▓▓▓     ▓▓▓▓▓  ▓▓▓▓▓      ▓▓▓▓▓         │   ║  ← orange row
║  │                                                        │   ║
║  │                                                        │   ║
║  │                       ·  ← ball                       │   ║
║  │                                                        │   ║
║  │                                                        │   ║
║  │                    ══════════  ← paddle                │   ║
║  └─────────────────────────────────────────────────────────┘   ║
║                                                                 ║
║  · · · · · · · · · · · · · · · · · · · · · · · · · · · · · ·   ║
║                                                                 ║
║  ► PROJECTS    ABOUT    EXPERIENCE    SKILLS    EDUCATION       ║
║                                                                 ║
╠═════════════════════════════════════════════════════════════════╣
║  © 2025  COKA  ·  1 CREDIT  ·  HI-SC 9,001          [LIST MODE] ║
╚═════════════════════════════════════════════════════════════════╝
```

## HUD Row

Two-line strip between top bar and game canvas. Replaces the sidebar entirely.

```
HI-SC  00009001          P·1          LIVES  ♥ ♥ ♡
SCORE  00001250       STAGE 01/06     SPEED  ●●○○○
```

### Left cluster — score data

- `HI-SC` label: 7px, `--text-muted`
- `00009001` value: 9px, `--text-primary`
- `SCORE` label: 7px, `--text-muted`
- `00001250` value: 9px, `--score` (#39FF14) + phosphor glow

### Center cluster — game state

- `P·1` player tag: 9px, `--accent`
- `STAGE 01/06`: 9px, `--text-primary`

### Right cluster — status

- `LIVES` label: 7px, `--text-muted`
- `♥ ♥ ♡`: 11px — filled `#FF0000`, empty `--text-muted`
- `SPEED` label: 7px, `--text-muted`
- `●●○○○`: filled `--accent`, empty `--text-dim`

## Game Canvas

- Aspect ratio: `4:3` — authentic arcade proportion
- Border: `2px solid var(--border)` with orange glow (dark mode)
- Corner accents: pixel art `┌ ┐ └ ┘` at each corner, 8px
- CRT scanline overlay: `::after` pseudo-element
- Corner vignette: `::before` pseudo-element
- Screen flicker: `crtFlicker` animation (dark mode only)

## Brick Grid

### Row-to-Section Mapping

| Row   | Color (dark)     | Color (light)        | Points | Section Unlocked |
| ----- | ---------------- | -------------------- | ------ | ---------------- |
| Row 1 | `#00E5FF` cyan   | `#0891B2` teal       | 100    | OVERVIEW         |
| Row 2 | `#FF4081` pink   | `#BE185D` rose       | 200    | EXPERIENCE       |
| Row 3 | `#FF8C00` orange | `#C4580A` amber      | 300    | STACK            |
| Row 4 | `#A855F7` purple | `#7C3AED` violet     | 500    | PROJECTS         |
| Row 5 | `#39FF14` green  | `#1A7A00` dark green | 800    | EDUCATION        |

### Brick dimensions

- Width: dynamic (canvas width / brick count with gaps)
- Height: 20px
- Gap x: 8px
- Gap y: 6px
- Top padding from canvas: 24px

## Ball & Paddle

- Ball: 6×6px square (not circle — pixel art)
- Ball color: `--ball`
- Paddle: 80px wide × 8px tall
- Paddle color: `--paddle`
- Paddle movement: mouse X or `[←][→]` keys

## Section Nav (below canvas)

```
► PROJECTS    ABOUT    EXPERIENCE    SKILLS    EDUCATION
```

- Single horizontal row
- `►` cursor: `--accent`, indicates current/active section
- Active label: `--text-primary`
- Inactive labels: `--text-muted`
- Spacing between items: 24px
- Navigate with `[←][→]` or click

When a section is unlocked, its nav label changes color:

- Locked: `--text-muted`
- Unlocked: `--text-primary`
- Active (viewing): `--accent` with `►`

## SECTION_UNLOCKED Overlay

Fullscreen centered overlay — NOT inside the canvas.

```
╔══════════════════════════════════════════╗
║                                          ║
║    ★  S E C T I O N  U N L O C K E D  ★ ║  ← green border, pulse
║                                          ║
║    P R O J E C T S  &  C A S E  S T U D ║  ← white 14px
║                                          ║
║    · · · · · · · · · · · · · · · · ·     ║
║                                          ║
║       P R E S S  [ E N T E R ]           ║  ← blinking
║           T O  V I E W                   ║
║                                          ║
╚══════════════════════════════════════════╝
```

- Border: `2px solid var(--unlock-border)` = `#39FF14`
- Box shadow: outer glow 20px + inner glow 6px (green)
- Canvas dims to 20% opacity behind overlay
- Auto-dismiss after 4s if no input

## Keyboard Controls

| Key       | Action                   |
| --------- | ------------------------ |
| `[←][→]`  | Move paddle              |
| `[SPACE]` | Launch ball / pause      |
| `[ENTER]` | Confirm SECTION_UNLOCKED |
| `[ESC]`   | Pause menu               |
| `[T]`     | Toggle theme             |
| `[C]`     | Console overlay          |
| `[P]`     | Return to INSERT COIN    |

## Stage Progression

```
Stage 01: 3 rows (cyan, pink, orange) — sections: OVERVIEW, EXPERIENCE, STACK
Stage 02: 4 rows — adds purple row — PROJECTS
Stage 03: 5 rows — full grid — EDUCATION
Stage 04–06: Same layout, faster ball, narrower paddle
```

`STAGE X/6` label in HUD tracks progression.

## Typography

| Element              | Size | Color (dark)     | Color (light)    |
| -------------------- | ---- | ---------------- | ---------------- |
| HUD labels           | 7px  | `#555555`        | `#8A7060`        |
| HUD values           | 9px  | `#FFFFFF`        | `#1A0A00`        |
| SCORE value          | 9px  | `#39FF14` + glow | `#1A7A00`        |
| Section nav          | 9px  | `#FF8C00` active | `#C4580A` active |
| Overlay title        | 14px | `#39FF14`        | `#1A7A00`        |
| Overlay section name | 14px | `#FFFFFF`        | `#1A0A00`        |
| Footer               | 7px  | `#FFFFFF`        | `#1A0A00`        |

## Dual Theme Notes

**Dark mode**: Canvas border orange glow, CRT flicker enabled, score green phosphor
**Light mode**: Canvas border dark brown, no flicker, score dark green, cream background, dot dividers `▪` style

## Animations

See `../animations.md`:

- Ball movement + wall bounce
- Brick break sequence (fragment scatter + score float)
- Score digit roll
- Stage clear sequence
- SECTION_UNLOCKED fanfare
- Lives lost flash
- Game over sequence
