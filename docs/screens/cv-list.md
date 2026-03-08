# CV List Mode — Design Spec

## Purpose
Terminal-style CV viewer. Entered after a SECTION_UNLOCKED event in play mode (or via [LIST MODE] toggle). Displays portfolio content as a structured data dump — like reading a character sheet in an RPG or a technical readout on an arcade machine.

## Layout

```
╔═════════════════════════════════════════════════════════════════╗
║  [P] PORTFOLIO OS    [B] BLOG  [E] EVENTS  [G] GITHUB  [C] CONSOLE  ║
╠═══════════════╦═════════════════════════════════════════════════╣
║               ║                                                 ║
║  IDENTIFIER   ║  ┌──────────┐  VER: 2024.01 // STATUS: ACTIVE  ║
║               ║  │          │                                   ║
║  ► / OVERVIEW ║  │   ◈      │  C O K A                         ║  ← orange 20px
║               ║  │          │                                   ║
║    / EXPERIENCE║  │ PLAYER 1 │  FULL-STACK ENGINEER //          ║  ← white 11px
║               ║  └──────────┘  SYSTEMS ARCHITECT                ║
║    / STACK    ║                                                 ║
║               ║  hello@coka.dev · github · linkedin             ║
║    / PROJECTS ║  // HO CHI MINH CITY, VN                       ║
║               ║                                                 ║
║    / EDUCATION║  · · · · · · · · · · · · · · · · · · · ·       ║
║               ║                                                 ║
║               ║  / OVERVIEW                                     ║
║               ║                                                 ║
║               ║  FULL-STACK ENGINEER WITH 5+ YEARS BUILDING     ║
║               ║  SCALABLE WEB SYSTEMS AND DEVELOPER TOOLING.    ║
║               ║                                                 ║
║               ║  · · · · · · · · · · · · · · · · · · · ·       ║
║               ║                                                 ║
║               ║  / EXPERIENCE                                   ║
║               ║                                                 ║
║               ║  FIG.01                      [ 2022 — NOW ]    ║
║               ║  SENIOR FRONTEND ENGINEER                       ║
║               ║  ► ACME TECHNOLOGIES                            ║  ← orange
║               ║                                                 ║
║               ║  01  LED MIGRATION OF MONOLITHIC REACT...       ║
║               ║  02  DESIGNED REAL-TIME COLLAB FEATURES...      ║
║               ║  03  ESTABLISHED COMPONENT DESIGN SYSTEM...     ║
╠═══════════════╩═════════════════════════════════════════════════╣
║  © 2025  COKA  ·  1 CREDIT  ·  HI-SC 9,001           [PLAY MODE] ║
╚═════════════════════════════════════════════════════════════════╝
```

## Sidebar Nav

```
IDENTIFIER      ← label, not a link (--text-muted, 8px)

► / OVERVIEW    ← active: orange ►, white text
  / EXPERIENCE  ← inactive: no bullet, --text-muted
  / STACK
  / PROJECTS
  / EDUCATION
```

- `►` cursor blinks when idle 2s+
- Click or `[↑][↓]` to navigate
- Active section scrolls into view in content pane

## Header Block (top of content pane)

```
┌──────────────┐  VER: 2024.01 // STATUS: ACTIVE ●
│              │  ────────────────────────────────
│     ◈        │  C O K A
│              │
│   PLAYER 1   │  FULL-STACK ENGINEER // SYSTEMS ARCHITECT
└──────────────┘
                  hello@coka.dev · github.com/coka
                  linkedin.com/in/coka · // HO CHI MINH CITY, VN
```

- Avatar box: 2px border `--border`, corner accents `┌ ┐ └ ┘`
- `◈` icon centered, 24px, `--accent` color
- `PLAYER 1` label: 7px, `--text-muted`
- `STATUS: ACTIVE ●` — green dot `#39FF14` with phosphor glow
- Name `COKA`: 20px, `--accent`
- Title: 11px, `--text-primary`
- Contact row: 9px, `--text-muted`

## Content Sections

### Section Header
```
/ OVERVIEW
```
- 14px, `--accent`
- No border or underline — the `/` prefix is the visual anchor

### Dot Divider between sections
```
· · · · · · · · · · · · · · · · · · · · ·
```
- 16px margin above and below

### Experience Entry
```
FIG.01                           ┌ 2022 — NOW ┐
SENIOR FRONTEND ENGINEER         └────────────┘
► ACME TECHNOLOGIES

01  LED MIGRATION OF...
02  DESIGNED AND IMPLEMENTED...
```

- `FIG.01`: 8px, `--text-muted`
- Date badge: 2px border `--border`, 9px text, no fill
- Job title: 14px, `--text-primary`
- Company: 11px, `--accent`, preceded by `►`
- Bullet numbers `01` `02`: 8px, `--text-muted`
- Bullet text: 9px, `--text-primary`

### Stack Section
```
TYPESCRIPT  REACT  NEXT.JS  NODE.JS  GO  PYTHON
POSTGRESQL  DYNAMODB  REDIS  AWS  TERRAFORM
DOCKER  KUBERNETES  GRAPHQL  REST  WEBSOCKETS
```
- Tags: 9px, `--text-primary`
- Separated by 2 spaces (no tag chips/badges — plain text)

### Project Entry
```
PROJ_01 // OPEN SOURCE
ARCADEOS PORTFOLIO FRAMEWORK
────────────────────────────────────────────────
A RETRO ARCADE-THEMED DEVELOPER PORTFOLIO...

NEXT.JS  TYPESCRIPT  TAILWIND  CANVAS API
```

- `PROJ_01 // OPEN SOURCE`: 8px, `--text-muted`
- Project name: 14px, `--text-primary`
- Horizontal rule: `────` in `--text-dim`
- Description: 9px, `--text-primary`
- Tech tags: 9px, `--accent`

## Typography

| Element | Size | Color (dark) | Color (light) |
|---|---|---|---|
| Sidebar label `IDENTIFIER` | 8px | `#555555` | `#8A7060` |
| Sidebar nav item | 9px | `#FFFFFF` active, `#555` inactive | `#1A0A00` / `#8A7060` |
| `►` cursor | 9px | `#FF8C00` | `#C4580A` |
| Name `COKA` | 20px | `#FF8C00` | `#C4580A` |
| Job title | 11px | `#FFFFFF` | `#1A0A00` |
| Contact row | 9px | `#555555` | `#8A7060` |
| Section header `/` | 14px | `#FF8C00` | `#C4580A` |
| `FIG.01` labels | 8px | `#555555` | `#8A7060` |
| Job title in entry | 14px | `#FFFFFF` | `#1A0A00` |
| Company `►` | 11px | `#FF8C00` | `#C4580A` |
| Bullet `01` | 8px | `#555555` | `#8A7060` |
| Bullet text | 9px | `#FFFFFF` | `#1A0A00` |
| Date badge | 9px | `#FFFFFF` | `#1A0A00` |

## Top Bar Actions

```
[G] GITHUB   [L] LINKEDIN   [D] DOWNLOAD CV →
```
These replace `[B] BLOG [E] EVENTS` in CV list mode — contextual shortcuts.

## Theme Toggle
- `[T]` — same CRT power cycle animation as all other screens
- Light mode uses `▪` dividers instead of `·`
- Light mode background: `--bg-sidebar` for sidebar, `--bg` for content

## Scroll Behavior
- Sidebar: fixed, no scroll
- Content pane: overflow-y scroll, no scrollbar (hidden, scroll via `[↑][↓]`)
- Active nav item tracks scroll position (Intersection Observer)

## Entry Animation
Scanline wipe from INSERT COIN / play mode → CV layout fades in.
See `../animations.md` — "Screen entry".
