## ADDED Requirements

### Requirement: Attract mode cycles three screens automatically
The INSERT COIN screen SHALL cycle through three attract screens every 4 seconds when the user takes no action. The cycle SHALL loop indefinitely: Title → Demo Reel → How to Play → Title.

#### Scenario: Automatic cycle with no input
- **WHEN** the INSERT COIN screen is displayed and 4 seconds elapse
- **THEN** the content area transitions to the next attract screen
- **WHEN** the third screen (How to Play) has shown for 4 seconds
- **THEN** the cycle returns to the first screen (Title)

### Requirement: Title screen shows PLAYER labels, PORTFOLIO OS title, and INSERT COIN CTA
The title screen SHALL display "PLAYER 1 / COKA" and "PLAYER 2 / CLIENT" at `--text-label` and 16px respectively, "PORTFOLIO OS" at `--text-hero` in `--accent` color, and "► INSERT COIN ◄" blinking at 600ms using class `insert-coin-blink` at `--text-name` in `--accent`. See `docs/screens/insert-coin.md`.

#### Scenario: INSERT COIN text blinks
- **WHEN** the title screen is displayed
- **THEN** the "► INSERT COIN ◄" text alternates between visible and invisible every 600ms with a hard cut

#### Scenario: PLAYER names flicker on entry
- **WHEN** the title screen first appears
- **THEN** "COKA" and "CLIENT" use the `textFlicker` animation (opacity 0 → 1 in a stuttered sequence over ~500ms)

### Requirement: Hi-score counts up from 0 to 9,001 on mount
The INSERT COIN screen SHALL animate the hi-score display from 0 to 9,001 over 800ms using an ease-out curve when the component first mounts.

#### Scenario: Hi-score count-up on load
- **WHEN** the INSERT COIN screen mounts
- **THEN** the hi-score value animates from 0 to 9001 over 800ms
- **THEN** the final value displays with phosphor glow (class `score-glow-pulse`)

### Requirement: Any keypress or click transitions to PLAY MODE
The INSERT COIN screen SHALL listen for any `keydown` event (excluding `[T]`, `[B]`, `[E]`, `[G]`, `[C]` shortcut keys) and any click event, and call the `onEnter` callback to transition to PLAY MODE.

#### Scenario: Keypress enters play mode
- **WHEN** user presses any key that is not a top-bar shortcut
- **THEN** `onEnter` is called and the screen transitions to PLAY MODE

#### Scenario: Shortcut keys do not enter play mode
- **WHEN** user presses `T`, `B`, `E`, `G`, or `C`
- **THEN** the shortcut action fires (theme toggle, nav, etc.) and PLAY MODE is NOT entered
