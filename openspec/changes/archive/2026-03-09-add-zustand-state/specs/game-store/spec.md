## ADDED Requirements

### Requirement: Game store holds current screen
The system SHALL provide a vanilla Zustand store (`gameStore`) with a `currentScreen` field representing the active view in the INSERT COIN → PLAY MODE → CV LIST flow.

#### Scenario: Store initializes at INSERT COIN screen
- **WHEN** the page loads
- **THEN** `gameStore.currentScreen` is `"insert-coin"`

#### Scenario: Navigate to PLAY MODE
- **WHEN** `gameStore.setScreen("play-mode")` is called
- **THEN** `currentScreen` becomes `"play-mode"` and all subscribers re-render

#### Scenario: Navigate to CV LIST MODE
- **WHEN** `gameStore.setScreen("cv-list")` is called
- **THEN** `currentScreen` becomes `"cv-list"` and all subscribers re-render

### Requirement: Game store tracks unlocked CV sections
The system SHALL maintain a `unlockedSections` set of section identifiers that have been unlocked by breaking bricks in PLAY MODE. Unlocked sections SHALL persist to localStorage across page reloads.

#### Scenario: No sections unlocked at start
- **WHEN** a new user loads the page for the first time
- **THEN** `gameStore.unlockedSections` is an empty array

#### Scenario: Brick break unlocks a section
- **WHEN** `gameStore.unlockSection("experience")` is called
- **THEN** `"experience"` is added to `unlockedSections`

#### Scenario: Unlocking the same section twice is idempotent
- **WHEN** `gameStore.unlockSection("experience")` is called twice
- **THEN** `unlockedSections` contains `"experience"` exactly once

#### Scenario: Unlocked sections survive page reload
- **WHEN** the user unlocks `"experience"` and reloads the page
- **THEN** `gameStore.unlockedSections` still contains `"experience"`

### Requirement: Game store tracks player score and high score
The system SHALL maintain a numeric `score` for the current session and a `highScore` that persists across reloads. `score` resets on every page load; `highScore` does not.

#### Scenario: Score starts at zero each session
- **WHEN** the page loads
- **THEN** `gameStore.score` is `0`

#### Scenario: Score increments
- **WHEN** `gameStore.addScore(100)` is called
- **THEN** `gameStore.score` increases by `100`

#### Scenario: High score updates when session score exceeds it
- **WHEN** `gameStore.addScore(points)` causes `score` to exceed the current `highScore`
- **THEN** `gameStore.highScore` is updated to the new score value

#### Scenario: High score survives page reload
- **WHEN** the user achieves `highScore` of `500` and reloads the page
- **THEN** `gameStore.highScore` is `500` and `gameStore.score` is `0`

### Requirement: Game store uses persist middleware with selective persistence
The system SHALL use Zustand's `persist` middleware with `partialize` to write only `unlockedSections` and `highScore` to `localStorage` under the key `"folio-game"`. `currentScreen` and `score` SHALL NOT be persisted.

#### Scenario: Only selected fields written to localStorage
- **WHEN** `unlockSection("skills")` and `addScore(200)` are called
- **THEN** `localStorage["folio-game"]` contains `unlockedSections` and `highScore` but NOT `score` or `currentScreen`

### Requirement: Game store is consumable from React via hook
The system SHALL export a `useGameStore` React hook for consuming game state in React islands.

#### Scenario: React component reads current screen
- **WHEN** a React component calls `useGameStore(state => state.currentScreen)`
- **THEN** it receives the current screen value and re-renders on screen changes
