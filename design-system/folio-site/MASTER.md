# Design System Master — folio-site

> **Usage:** When building a specific page, first check `design-system/folio-site/pages/[page-name].md`.
> If that file exists, its rules **override** this Master. Otherwise, follow this file exclusively.

**Style**: Editorial Technical Manual (inspired by makingsoftware.com)
**Stack**: Next.js 16, Tailwind CSS 4, shadcn/ui, DepartureMono + Lora

---

## Color Palette (oklch)

| Token | Value | Role |
|-------|-------|------|
| `--background` | `oklch(0.988 0 0)` | Warm off-white paper |
| `--foreground` | `oklch(0.178 0 0)` | Near-black ink |
| `--card` | `oklch(1 0 0)` | White figure plate |
| `--primary` | `oklch(0.573 0.223 267.8)` | Periwinkle blue — use sparingly |
| `--muted` | `oklch(0.97 0.003 264.5)` | Subtle tinted surface |
| `--muted-foreground` | `oklch(0.528 0 0)` | Secondary / caption text |
| `--accent` | `oklch(0.76 0.112 271.2)` | Hover surface tint |
| `--border` | `oklch(0.858 0 0)` | Panel borders |
| `--radius` | `0.375rem` | 6px — print-like, never pill |

**Rule**: 85–90% neutral surfaces. Blue (`--primary`) is reserved for FIG labels, links, hover
emphasis, and the thin hero rule only. No extra saturated colors outside project content.

### Dark mode tokens
| Token | Value |
|-------|-------|
| `--background` | `oklch(0.145 0 0)` |
| `--foreground` | `oklch(0.963 0 0)` |
| `--card` | `oklch(0.18 0 0)` |
| `--border` | `oklch(0.28 0 0)` |
| `--primary` | `oklch(0.573 0.223 267.8)` (unchanged) |

---

## Typography

| Role | Font | Tailwind class | Usage |
|------|------|----------------|-------|
| Display / Labels | DepartureMono (local woff2) | `font-mono-display` | h1, h2, section names, FIG labels, nav, captions, metadata |
| Body / Serif | Lora (Google Fonts) | `font-serif` | Paragraphs, descriptions, all reading text |
| UI only | Inter (Google Fonts) | `font-sans` | Form inputs only |

**Rules**:
- `font-mono-display` for all structural labels and titles
- `font-serif` for all reading/body text — body tag uses `font-serif` class
- Uppercase labels: `text-[10px] uppercase tracking-widest` only for short metadata strings
- Never bold body text. Never mix fonts on the same line.
- No giant marketing headings — restrained editorial sizing (`text-2xl` / `text-3xl` max on h2)

---

## Shape Language

- **Radius**: `rounded-md` (6px) everywhere — **never** `rounded-full` or `rounded-xl`
- **Borders**: `border border-border` defines panels — NOT shadows
- **Shadows**: `shadow-none` — flat, printed feel everywhere
- **Cards**: white sheets (`bg-card`) on paper background (`bg-background`)
- **Buttons**: `rounded-md`, flat/outline variants only, no shadow

---

## Motion

- **Max duration**: 150–180ms
- **Allowed**: `transition-colors duration-150`, `transition-opacity duration-150`, subtle `translateY`
- **Forbidden**:
  - `group-hover:scale-*` on images or cards
  - spring physics / bounce easing
  - sparkle, aurora, typing animation, marquee (on main page sections)
  - `shadow-lg` on hover
- **Always use** `motion-safe:` prefix on animated classes
- **Always respect** `prefers-reduced-motion`

---

## Component Patterns

### Section Header
```
SECTION LABEL              ← font-mono-display text-[10px] uppercase tracking-widest text-muted-foreground
Section Title              ← font-mono-display text-2xl sm:text-3xl text-foreground
Description sentence.      ← font-serif text-sm sm:text-base text-muted-foreground max-w-xl
```

### Figure Plate (project card)
```
FIG_01 · FEATURED          ← font-mono-display text-[10px] uppercase tracking-widest text-primary
CATEGORY                   ← font-mono-display text-[10px] uppercase tracking-widest text-muted-foreground
─ bordered image plate ─   ← border border-border, no rounded-t, no shadow
Project Title              ← font-mono-display text-foreground
Description text           ← font-serif text-sm leading-relaxed text-muted-foreground
[tag] [tag] [tag]          ← Badge variant="outline" font-mono text-[10px] uppercase
[View Case Study →]        ← Button variant="outline" font-mono-display text-xs uppercase tracking-widest
```
Hover: `hover:border-primary` border color change only — no shadow, no scale.

### Dated Note Entry (experience card)
```
MAY 2023 · FULL-TIME       ← font-mono-display text-[10px] uppercase tracking-widest text-muted-foreground
COMPANY NAME               ← font-mono-display text-[10px] uppercase tracking-widest text-foreground
Role / Position            ← font-mono-display text-sm text-foreground
Summary...                 ← font-serif text-xs leading-relaxed text-muted-foreground line-clamp-2
```

### PatternSeparator
- ASCII `░` characters as SVG pattern — the signature section divider
- Used between every major section
- Replaces all blue gradient glows and `<Separator>` elements

### Contact Form Inputs
- Underline-only style: `rounded-none border-0 border-b border-border focus-visible:ring-0 px-0 bg-transparent`
- Labels: `font-mono-display text-[10px] uppercase tracking-widest`

---

## Layout

- Page container: `max-w-(--breakpoint-2xl) mx-auto p-4 sm:p-6 md:p-10`
- Reading width: `max-w-2xl` for text blocks
- Section spacing: `pb-10 sm:pb-14` between sections
- Left-aligned content blocks (not center-heavy)
- `min-h-dvh` not `min-h-screen`

### Anchor IDs
| Section | `id` | Navbar href |
|---------|------|-------------|
| Hero | `hero` | `#hero` |
| Featured Work | `featured-work` | `#featured-work` |
| Experience | `experience` | — |
| Education/Capabilities | `education-capabilities` | — |
| Contact | `contact` | `#contact` |

---

## Anti-Patterns — NEVER USE

- ❌ `shadow-lg`, `shadow-sm`, `shadow-md` on cards or buttons
- ❌ `rounded-full` pill shapes on badges or avatars
- ❌ `group-hover:scale-*` on any card or image
- ❌ Gradient separator (`bg-linear-to-r from-transparent via-primary to-transparent`)
- ❌ Blue (`--primary`) used as a background fill for sections
- ❌ `font-sans` on body text (use `font-serif`)
- ❌ Sparkle, aurora, typing, or marquee animations on main page
- ❌ Glassmorphism / backdrop-blur decoration
- ❌ Emoji as icons — use Lucide SVG only
- ❌ Raw hex values in component className — use semantic tokens

---

## Pre-Delivery Checklist

- [ ] Body tag has `font-serif` class (not `font-sans`)
- [ ] No `shadow-*` on cards or buttons
- [ ] No `rounded-full` anywhere on main page
- [ ] No `group-hover:scale-*` on images
- [ ] Blue used sparingly (FIG labels, links, hover borders only)
- [ ] All labels: `font-mono-display text-[10px] uppercase tracking-widest`
- [ ] All body text: `font-serif`
- [ ] Transitions ≤ 150ms — `transition-colors` or `transition-opacity` only
- [ ] `motion-safe:` prefix on all animated classes
- [ ] FIG_## prefix on all project figure cards
- [ ] PatternSeparator (`░`) between sections
- [ ] Anchor IDs match navbar `href` targets exactly
- [ ] `pnpm type-check` passes with 0 errors
- [ ] `pnpm lint` passes with 0 errors