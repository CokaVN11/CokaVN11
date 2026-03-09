## ADDED Requirements

### Requirement: CSS custom property tokens for both themes
The system SHALL define all color, typography, and spacing values as CSS custom properties on the `[data-theme]` attribute of the `<html>` element. No hardcoded color values SHALL appear in component files.

#### Scenario: Dark theme tokens applied by default
- **WHEN** the page loads with `data-theme="dark"` on `<html>`
- **THEN** all `--bg`, `--accent`, `--score`, `--text-primary`, `--text-muted`, `--text-dim`, `--border`, `--border-muted`, `--brick-1` through `--brick-5`, `--ball`, `--paddle`, `--unlock-border`, `--scanline`, `--vignette` tokens resolve to their dark values

#### Scenario: Light theme tokens applied on toggle
- **WHEN** `data-theme` is changed to `"light"` on `<html>`
- **THEN** all tokens resolve to their light-mode values without any component re-render

### Requirement: Typography scale via CSS custom properties
The system SHALL define seven named font-size tokens — `--text-hero` (28px) through `--text-micro` (7px) — and apply `Press Start 2P` as the sole font via `--font-arcade`.

#### Scenario: Press Start 2P renders on all text
- **WHEN** any text element uses `font-family: var(--font-arcade)`
- **THEN** the rendered font is `Press Start 2P`, not a system fallback

### Requirement: All animation keyframes defined in globals.css
The system SHALL define all animation keyframes in `src/styles/globals.css` matching the exact names and timing values in `docs/animations.md`. No inline `style` animation values SHALL be used.

#### Scenario: INSERT COIN blink animation
- **WHEN** an element has class `insert-coin-blink`
- **THEN** it blinks at 600ms intervals using `step-end` timing (hard cut, not fade)

#### Scenario: CRT theme switch animation
- **WHEN** `animation: themeSwitch 400ms` is applied to `<html>`
- **THEN** the page opacity drops to 0 at 10%, holds at 0 through 90%, then returns to 1 at 100%

### Requirement: CRT scanline and vignette effects via pseudo-elements
The system SHALL implement CRT scanlines via `::after` and a corner vignette via `::before` on elements with class `crt-canvas`. Dark mode SHALL also apply a `crtFlicker` animation on elements with class `crt-flicker`.

#### Scenario: Scanlines render over canvas
- **WHEN** a canvas element has class `crt-canvas`
- **THEN** repeating horizontal lines at 4px intervals overlay it via `::after`, using `var(--scanline)` color

#### Scenario: Flicker only in dark mode
- **WHEN** `data-theme="dark"` and an element has class `crt-flicker`
- **THEN** the element periodically dips to 97-98% opacity on a 4s cycle
- **WHEN** `data-theme="light"`
- **THEN** no flicker animation runs
