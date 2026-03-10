# Coka Portfolio — Design Research

## Overview

Coka Portfolio is a personal portfolio presented as a retro arcade machine. The visitor is the player. The portfolio is the game.

## Design Philosophy

- Every screen is a continuous arcade experience — not a website with game elements bolted on
- The outer chrome (top bar, footer) never changes between screens — only the content swaps
- All text is `UPPERCASE` — arcade displays don't do lowercase
- Font: `Press Start 2P` throughout — no exceptions
- Background: `#000000` pure black (dark) / `#F5F0E8` warm cream (light)
- Primary accent: `#FF8C00` orange (dark) / `#C4580A` amber (light)

## Screens

| Screen                      | File                     | Status   |
| --------------------------- | ------------------------ | -------- |
| INSERT COIN (intro/attract) | `screens/insert-coin.md` | Designed |
| CV List Mode                | `screens/cv-list.md`     | Designed |
| Play Mode (Breakout game)   | `screens/play-mode.md`   | Designed |

## Shared Systems

| System                                      | File               |
| ------------------------------------------- | ------------------ |
| Design tokens (colors, typography, spacing) | `design-system.md` |
| Animation states                            | `animations.md`    |

## Screen Flow

```
INSERT COIN  →  [press any key / INSERT COIN]
     ↓
PLAY MODE  (Breakout game — break bricks to unlock sections)
     ↓
[SECTION_UNLOCKED popup]  →  [press ENTER]
     ↓
CV LIST MODE  (view unlocked section content)
     ↓
[← Return to Game]
     ↓
PLAY MODE  (continue)
```

## Keyboard Shortcuts (global)

| Key      | Action                        |
| -------- | ----------------------------- |
| `[B]`    | Blog                          |
| `[E]`    | Events                        |
| `[G]`    | GitHub                        |
| `[C]`    | Console overlay               |
| `[T]`    | Toggle dark/light theme       |
| `[←][→]` | Navigate sections (play mode) |
| `[ESC]`  | Return to previous screen     |
