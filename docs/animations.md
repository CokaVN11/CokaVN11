# Animation States — Coka Portfolio

## Principles

- Animations should feel like **arcade hardware**, not web transitions
- Prefer instant cuts over smooth eases where authenticity requires it
- Blink rate: **600ms** (standard arcade blink)
- Screen transitions: **scanline wipe** top-to-bottom

---

## INSERT COIN Screen

### Attract Mode Loop

Cycles every ~4s through 3 screens with no user input:

1. **Title screen** — PLAYER 1/2, Coka Portfolio, INSERT COIN
2. **Demo reel** — portfolio preview scroll inside canvas
3. **How to play** — keyboard controls list

Transition between screens: scanline wipe top→bottom, 300ms

### INSERT COIN blink

```css
@keyframes insertCoinBlink {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

.insert-coin {
  animation: insertCoinBlink 600ms step-end infinite;
}
```

### Dot scanner (· · · · ·)

```css
@keyframes dotScan {
  0% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}

.dot {
  animation: dotScan 1.2s ease-in-out infinite;
}
.dot:nth-child(2) {
  animation-delay: 0.1s;
}
.dot:nth-child(3) {
  animation-delay: 0.2s;
}
/* etc — stagger left to right */
```

### Hi-score tick on load

```
0ms:    Score displays as 0
0–800ms: Counts up to 9,001 (ease-out timing)
800ms:  Final value, phosphor glow pulse once
```

### PLAYER 1 / PLAYER 2 name flicker on entry

```css
@keyframes textFlicker {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  25% {
    opacity: 0;
  }
  45% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  70% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

---

## Play Mode (Breakout)

### Ball movement

- Constant velocity via JS `requestAnimationFrame`
- No CSS animation — pure canvas/JS physics
- Speed increases each stage: `--ball-speed` CSS var controls visual trail length

### Wall bounce

```
Frame 0:  collision detected
Frame 1:  wall flashes #FFFFFF for 16ms (1 frame at 60fps)
```

### Paddle hit

```css
@keyframes paddleCompress {
  0% {
    transform: scaleY(1);
  }
  30% {
    transform: scaleY(0.6);
  }
  100% {
    transform: scaleY(1);
  }
}
/* Duration: 150ms, ease-out-back */
```

### Brick break sequence

```
0ms:    Brick flashes white (#FFFFFF) — 1 frame
16ms:   Brick disappears
16ms:   4 pixel fragments spawn at brick position, scatter outward
         Fragment velocity: random direction, speed 2–4px/frame
300ms:  Fragments fully faded (opacity 0)
16ms:   Score float spawns: "+100" at brick center
         Float up 40px over 600ms, fade out over last 200ms
16ms:   SCORE counter digits roll (slot machine effect, right→left)
```

### Score digit roll

```css
@keyframes digitRoll {
  0% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-100%);
  }
  41% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
}
/* Duration: 80ms per digit, stagger right→left with 20ms delay */
```

### Stage clear

```
0.0s:  Last brick breaks → score ticks
0.5s:  Canvas border flashes orange 3× (200ms each)
1.0s:  All bricks re-render: flash in staggered left→right
        Each brick: opacity 0 → 1 over 100ms, 20ms stagger
1.5s:  [ STAGE_02 ] label crossfades (old → new)
2.0s:  STAGE counter in HUD increments with digit roll
2.0s:  Ball resets to center, paddle resets to center
2.5s:  Game resumes
```

### SECTION_UNLOCKED fanfare

```
0.0s:  Canvas dims: overlay rgba(0,0,0,0.8) fades in over 200ms
0.1s:  Overlay box scales from 0.8 → 1.0 (ease-out-back, 300ms)
0.2s:  Border draws clockwise (stroke-dashoffset animation, 400ms)
0.4s:  "★ SECTION UNLOCKED ★" types out character by character
        Each char: 40ms interval
0.8s:  Section name fades in (200ms)
1.2s:  "PRESS [ENTER] TO VIEW" blinks on
4.0s:  Auto-dismiss if no input — overlay fades out (300ms), canvas restores
```

SECTION_UNLOCKED box style:

```css
.section-unlocked {
  border: 2px solid var(--unlock-border);
  box-shadow:
    0 0 20px color-mix(in srgb, var(--unlock-border) 40%, transparent),
    0 0 6px var(--unlock-border) inset;
}
```

### Lives lost

```
0.0s:  Ball exits bottom edge
0.1s:  Screen flash: rgba(255,0,0,0.3) overlay, 300ms fade
0.5s:  Last filled ♥ → ♡: scale punch 1.4 → 1.0 (200ms, ease-out)
0.8s:  Ball fades in at center position
1.0s:  Short countdown blink (3…2…1) then ball launches
```

### Game over

```
0.0s:  Last life lost → screen flash red
0.5s:  "G A M E  O V E R" types out center, 28px orange
        Letter interval: 80ms
1.0s:  Score tally: digits count up with roll animation
1.5s:  HI-SC: if beaten → green flash + "NEW RECORD!" blink
3.0s:  "PRESS [ENTER] TO CONTINUE" blinks
```

---

## CV List Mode

### Screen entry (from SECTION_UNLOCKED)

```
0.0s:  Scanline wipe top→bottom covers screen (300ms)
0.3s:  CV layout fades in behind wipe
0.6s:  Wipe completes, CV visible
```

### Section nav cursor (► )

```css
/* Cursor blinks when idle for 2s+ */
@keyframes cursorBlink {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}
.nav-cursor.idle {
  animation: cursorBlink 600ms step-end infinite;
}
```

### Avatar box on entry

```
Character portrait flickers in (textFlicker animation, 400ms)
```

### Scroll behavior

- Sections scroll within the content pane
- Sidebar nav `►` cursor tracks active section (no animation — instant jump)

---

## Theme Toggle

```css
/* [T] keypress */
@keyframes themeSwitch {
  0% {
    opacity: 1;
  }
  10% {
    opacity: 0;
  } /* instant black */
  90% {
    opacity: 0;
  } /* hold black */
  100% {
    opacity: 1;
  } /* fade in new theme */
}
/* Total: 400ms */
```

During the black frame, swap `data-theme` attribute — gives illusion of CRT power cycle.
