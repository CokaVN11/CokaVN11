## ADDED Requirements

### Requirement: Breakout game runs on HTML5 Canvas at 60fps
The PLAY MODE screen SHALL render the Breakout game on an HTML5 Canvas element using `requestAnimationFrame`. The canvas SHALL maintain a 4:3 aspect ratio and resize to fill the available container. See `docs/screens/play-mode.md`.

#### Scenario: Canvas maintains 4:3 ratio on any screen size
- **WHEN** the browser window is resized
- **THEN** the canvas width and height recalculate to maintain 4:3 while fitting the container

#### Scenario: Game loop runs continuously while status is "playing"
- **WHEN** game status is `"playing"`
- **THEN** `requestAnimationFrame` fires each frame, updating ball position and redrawing the canvas
- **WHEN** game status changes to any other value
- **THEN** the animation frame loop is cancelled

### Requirement: Ball physics — constant velocity with wall and paddle reflection
The ball SHALL move at constant speed (base 4px/frame, increasing 0.6px/frame per stage). It SHALL reflect off the left, right, and top walls. It SHALL reflect off the paddle with an angle based on where it hits (center = straight up, edges = sharp angle). See `docs/animations.md` §Ball movement.

#### Scenario: Ball reflects off left wall
- **WHEN** the ball's left edge reaches x=0
- **THEN** `dx` becomes positive (ball moves right)

#### Scenario: Paddle angle control
- **WHEN** the ball hits the left quarter of the paddle
- **THEN** the ball deflects to the left
- **WHEN** the ball hits the right quarter of the paddle
- **THEN** the ball deflects to the right

### Requirement: Breaking all bricks in a row unlocks a CV section
Five brick rows map to five CV sections. When all bricks in a row are destroyed, the corresponding section SHALL be marked as unlocked and the SECTION_UNLOCKED overlay SHALL appear.

| Row | Color token | Section |
|-----|------------|---------|
| 1 | `--brick-1` | OVERVIEW |
| 2 | `--brick-2` | EXPERIENCE |
| 3 | `--brick-3` | STACK |
| 4 | `--brick-4` | PROJECTS |
| 5 | `--brick-5` | EDUCATION |

#### Scenario: Row cleared triggers unlock overlay
- **WHEN** the last alive brick in a row is destroyed
- **THEN** game status changes to `"section_unlocked"`, `justUnlocked` is set to the section name, and the overlay appears

#### Scenario: Already-unlocked section does not re-trigger
- **WHEN** a row's section is already in `unlockedSections`
- **THEN** no overlay is shown on subsequent brick hits in that row

### Requirement: SECTION_UNLOCKED overlay types out title and auto-dismisses
The overlay SHALL display with a green border (`--unlock-border`), type out "★ SECTION UNLOCKED ★" at 40ms per character, fade in the section name at 800ms, show a blinking "PRESS [ENTER] TO VIEW" prompt at 1200ms, and auto-dismiss after 4 seconds if no input. See `docs/animations.md` §fanfare.

#### Scenario: Title types out character by character
- **WHEN** the overlay appears
- **THEN** "★ SECTION UNLOCKED ★" renders one character every 40ms until complete

#### Scenario: ENTER key navigates to CV List
- **WHEN** the overlay is visible and user presses `[ENTER]`
- **THEN** `onViewSection` is called with the section name and the overlay dismisses

#### Scenario: Auto-dismiss after 4 seconds
- **WHEN** 4 seconds elapse with no input
- **THEN** the overlay dismisses and game status returns to `"playing"`

### Requirement: HUD displays score, hi-score, stage, lives, and speed
The two-line HUD strip above the canvas SHALL show: left cluster (HI-SC + SCORE), center cluster (P·1 + STAGE XX/06), right cluster (LIVES ♥♥♡ + SPEED ●●○○○). SCORE SHALL use `--score` color with phosphor glow. See `docs/screens/play-mode.md` §HUD Row.

#### Scenario: Score updates on brick break
- **WHEN** a brick is destroyed
- **THEN** the SCORE value in the HUD increments by the brick's point value within the same frame

#### Scenario: Lives decrement on ball lost
- **WHEN** the ball exits below the canvas bottom edge
- **THEN** the filled heart count decrements by 1 and game status becomes `"lost_life"`

### Requirement: Paddle controlled by mouse and keyboard
The paddle SHALL follow the mouse X position within the canvas bounds. Arrow keys (`←` `→`) SHALL also move the paddle. SPACE SHALL launch the ball when status is `"idle"`.

#### Scenario: Mouse moves paddle
- **WHEN** user moves the mouse over the canvas
- **THEN** the paddle center tracks the mouse X position, clamped to canvas bounds

#### Scenario: Keyboard moves paddle
- **WHEN** user holds `ArrowLeft` or `ArrowRight`
- **THEN** the paddle moves 20px in the corresponding direction per keydown event
