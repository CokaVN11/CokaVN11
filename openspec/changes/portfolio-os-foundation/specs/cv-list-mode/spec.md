## ADDED Requirements

### Requirement: Sidebar nav with active cursor and keyboard navigation
The CV LIST MODE SHALL display a fixed sidebar with five nav items (OVERVIEW, EXPERIENCE, STACK, PROJECTS, EDUCATION). The active item SHALL be indicated by a `►` cursor in `--accent` color. The cursor SHALL blink (class `cursor-blink`) after 2 seconds of inactivity. `[↑][↓]` SHALL move the active section. See `docs/screens/cv-list.md` §Sidebar Nav.

#### Scenario: Active section marked with cursor
- **WHEN** a nav section is active
- **THEN** a `►` character in `--accent` color appears to its left

#### Scenario: Cursor blinks after 2s idle
- **WHEN** no navigation input has occurred for 2 seconds
- **THEN** the `►` cursor begins blinking at 600ms intervals (class `cursor-blink`)
- **WHEN** any navigation occurs
- **THEN** blinking stops immediately

#### Scenario: Keyboard navigates sections
- **WHEN** user presses `ArrowUp` or `ArrowLeft`
- **THEN** the active section moves to the previous item (if not already first)
- **WHEN** user presses `ArrowDown` or `ArrowRight`
- **THEN** the active section moves to the next item (if not already last)

### Requirement: Header block shows identity, status, and contact
The content pane SHALL open with a header block containing: avatar box (80×80, `--border` border, `◈` icon, "PLAYER 1" label), name "COKA" at `--text-name` in `--accent`, job title at `--text-body`, contact row at `--text-ui` in `--text-muted`, status indicator with green dot (`--score` with glow), and version/status metadata. See `docs/screens/cv-list.md` §Header Block.

#### Scenario: Avatar flickers in on mount
- **WHEN** the CV LIST screen mounts
- **THEN** the `◈` icon uses the `textFlicker` animation over ~400ms

#### Scenario: Status LED glows green
- **WHEN** the header block is visible
- **THEN** the `●` STATUS indicator uses `--score` color with `box-shadow` glow

### Requirement: Content sections use dot dividers and section headers
Each section SHALL begin with a `/ SECTION_NAME` header at `--text-heading` in `--accent`. Sections SHALL be separated by dot dividers (class `dot-divider`). See `docs/screens/cv-list.md` §Content Sections.

#### Scenario: Section header format
- **WHEN** a section renders
- **THEN** its header displays as `/ OVERVIEW` (or equivalent) in `--accent` at 14px

#### Scenario: Dot dividers between sections
- **WHEN** two sections are adjacent in the content pane
- **THEN** a row of animated `·` characters separates them with `--space-2` margin above and below

### Requirement: Content pane scrolls without visible scrollbar, sidebar stays fixed
The content pane SHALL be `overflow-y: scroll` with the scrollbar hidden (class `no-scrollbar`). The sidebar SHALL not scroll. Scroll SHALL track the active section via Intersection Observer or `scrollIntoView`.

#### Scenario: Active section scrolls into view on nav change
- **WHEN** the active nav section changes
- **THEN** the corresponding content section scrolls into view smoothly

#### Scenario: Scrollbar not visible
- **WHEN** the content pane has more content than fits vertically
- **THEN** the scrollbar is hidden while scroll remains functional

### Requirement: ESC returns to PLAY MODE
The CV LIST screen SHALL call `onBack` when `[ESC]` is pressed.

#### Scenario: ESC exits to play mode
- **WHEN** user presses `Escape` while CV LIST is visible
- **THEN** `onBack` is called and the screen transitions to PLAY MODE
