# INSERT COIN Screen — Design Spec

## Purpose

Attract mode / idle screen. The portfolio's entry point. Visitor is invited to "insert coin" (engage) to enter the Coka Portfolio. Cycles through 3 screens automatically when idle.

## Layout

```
╔═════════════════════════════════════════════════════════════════╗
║  [P] Coka Portfolio    [B] BLOG  [E] EVENTS  [G] GITHUB  [C] CONSOLE  ║
╠═════════════════════════════════════════════════════════════════╣
║                                                                 ║
║                                                                 ║
║         P L A Y E R  1       P L A Y E R  2                    ║
║           C  O  K  A           C L I E N T                     ║
║                                                                 ║
║                                                                 ║
║        ★  ★  ★  P O R T F O L I O  O S  ★  ★  ★              ║
║                                                                 ║
║                                                                 ║
║             · · · · · · · · · · · · · · ·                      ║
║                                                                 ║
║               ►  I N S E R T  C O I N  ◄                      ║
║                                                                 ║
║             · · · · · · · · · · · · · · ·                      ║
║                                                                 ║
║                                                                 ║
║   © 2025   1  C R E D I T     H I - S C  9 , 0 0 1             ║
╚═════════════════════════════════════════════════════════════════╝
```

## Attract Mode — 3 Screens

Cycles every ~4s with no input. All 3 screens share the same footer.

### Screen 1 — Title (above)

Default idle state.

### Screen 2 — Demo Reel

```
╔═════════════════════════════════════════════════════════════════╗
║  [P] Coka Portfolio    [B] BLOG  [E] EVENTS  [G] GITHUB  [C] CONSOLE  ║
╠═════════════════════════════════════════════════════════════════╣
║                                                                 ║
║                     - - D E M O - -                             ║
║                                                                 ║
║        ┌───────────────────────────────────────────┐            ║
║        │                                           │            ║
║        │    [ PORTFOLIO PREVIEW SCROLLS HERE ]     │            ║
║        │                                           │            ║
║        └───────────────────────────────────────────┘            ║
║                                                                 ║
║             · · · · · · · · · · · · · · ·                      ║
║               ►  I N S E R T  C O I N  ◄                      ║
║             · · · · · · · · · · · · · · ·                      ║
║                                                                 ║
║   © 2025   1  C R E D I T     H I - S C  9 , 0 0 1             ║
╚═════════════════════════════════════════════════════════════════╝
```

### Screen 3 — How to Play

```
╔═════════════════════════════════════════════════════════════════╗
║  [P] Coka Portfolio    [B] BLOG  [E] EVENTS  [G] GITHUB  [C] CONSOLE  ║
╠═════════════════════════════════════════════════════════════════╣
║                                                                 ║
║                  H O W  T O  P L A Y                            ║
║                                                                 ║
║      [↑][↓][←][→]    N A V I G A T E  P R O J E C T S         ║
║        [ E N T E R ]    O P E N  P R O J E C T                 ║
║          [ E S C ]    G O  B A C K                              ║
║          [ C ]    O P E N  C O N S O L E                       ║
║          [ T ]    T O G G L E  T H E M E                       ║
║                                                                 ║
║             · · · · · · · · · · · · · · ·                      ║
║               ►  I N S E R T  C O I N  ◄                      ║
║             · · · · · · · · · · · · · · ·                      ║
║                                                                 ║
║   © 2025   1  C R E D I T     H I - S C  9 , 0 0 1             ║
╚═════════════════════════════════════════════════════════════════╝
```

## Typography

| Element               | Size | Color (dark) | Color (light) |
| --------------------- | ---- | ------------ | ------------- |
| `PLAYER 1 / 2` labels | 12px | `#FF8C00`    | `#C4580A`     |
| `COKA` / `CLIENT`     | 16px | `#FFFFFF`    | `#1A0A00`     |
| `Coka Portfolio`      | 28px | `#FF8C00`    | `#C4580A`     |
| `INSERT COIN`         | 20px | `#FF8C00`    | `#C4580A`     |
| Footer                | 10px | `#FFFFFF`    | `#1A0A00`     |

## Interactions

- Any keypress or click → transition to PLAY MODE
- `[T]` → toggle theme (CRT power cycle animation, 400ms)
- `[G]` → GitHub (new tab)
- `[B]` → Blog
- `[E]` → Events
- `[C]` → Console overlay

## Animations

See `../animations.md`:

- INSERT COIN blink (600ms)
- Dot scanner left→right
- Hi-score tick on first load
- PLAYER 1/2 name flicker on entry
- Attract mode loop (scanline wipe between screens, every 4s)
