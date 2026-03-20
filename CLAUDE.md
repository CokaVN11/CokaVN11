<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **folio-site** (544 symbols, 1180 relationships, 35 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## When Debugging

1. `gitnexus_query({query: "<error or symptom>"})` — find execution flows related to the issue
2. `gitnexus_context({name: "<suspect function>"})` — see all callers, callees, and process participation
3. `READ gitnexus://repo/folio-site/process/{processName}` — trace the full execution flow step by step
4. For regressions: `gitnexus_detect_changes({scope: "compare", base_ref: "main"})` — see what your branch changed

## When Refactoring

- **Renaming**: MUST use `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` first. Review the preview — graph edits are safe, text_search edits need manual review. Then run with `dry_run: false`.
- **Extracting/Splitting**: MUST run `gitnexus_context({name: "target"})` to see all incoming/outgoing refs, then `gitnexus_impact({target: "target", direction: "upstream"})` to find all external callers before moving code.
- After any refactor: run `gitnexus_detect_changes({scope: "all"})` to verify only expected files changed.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Tools Quick Reference

| Tool | When to use | Command |
|------|-------------|---------|
| `query` | Find code by concept | `gitnexus_query({query: "auth validation"})` |
| `context` | 360-degree view of one symbol | `gitnexus_context({name: "validateUser"})` |
| `impact` | Blast radius before editing | `gitnexus_impact({target: "X", direction: "upstream"})` |
| `detect_changes` | Pre-commit scope check | `gitnexus_detect_changes({scope: "staged"})` |
| `rename` | Safe multi-file rename | `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` |
| `cypher` | Custom graph queries | `gitnexus_cypher({query: "MATCH ..."})` |

## Impact Risk Levels

| Depth | Meaning | Action |
|-------|---------|--------|
| d=1 | WILL BREAK — direct callers/importers | MUST update these |
| d=2 | LIKELY AFFECTED — indirect deps | Should test |
| d=3 | MAY NEED TESTING — transitive | Test if critical path |

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/folio-site/context` | Codebase overview, check index freshness |
| `gitnexus://repo/folio-site/clusters` | All functional areas |
| `gitnexus://repo/folio-site/processes` | All execution flows |
| `gitnexus://repo/folio-site/process/{name}` | Step-by-step execution trace |

## Self-Check Before Finishing

Before completing any code modification task, verify:
1. `gitnexus_impact` was run for all modified symbols
2. No HIGH/CRITICAL risk warnings were ignored
3. `gitnexus_detect_changes()` confirms changes match expected scope
4. All d=1 (WILL BREAK) dependents were updated

## Keeping the Index Fresh

After committing code changes, the GitNexus index becomes stale. Re-run analyze to update it:

```bash
npx gitnexus analyze
```

If the index previously included embeddings, preserve them by adding `--embeddings`:

```bash
npx gitnexus analyze --embeddings
```

To check whether embeddings exist, inspect `.gitnexus/meta.json` — the `stats.embeddings` field shows the count (0 means no embeddings). **Running analyze without `--embeddings` will delete any previously generated embeddings.**

> Claude Code users: A PostToolUse hook handles this automatically after `git commit` and `git merge`.

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->

---

# Project: folio-site

Portfolio site for **Khanh Nguyen (Coka)** — full-stack engineer. Next.js 16 monorepo, actively being redesigned from an animated/colorful aesthetic to a restrained editorial/technical-manual look.

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router), React 19, TypeScript 5 |
| Styling | Tailwind CSS 4, shadcn/ui (radix primitives) |
| Animation | Framer Motion 12, GSAP 3 |
| 3D | Three.js + @react-three/fiber (graduation microsite only) |
| Forms | React Hook Form + Zod |
| DB/ORM | Prisma + MongoDB |
| Email | Resend |
| Deploy | Vercel (analytics + speed insights included) |
| Linter | Oxlint (NOT ESLint) |
| Package manager | pnpm (workspace monorepo) |

## Architecture

```
apps/web/src/
├── app/               App Router pages (page.tsx, layout.tsx, projects/[slug], job/[slug], graduation/)
├── components/
│   ├── sections/      Old section components (HeroSection, AboutSection, etc.) — being phased out
│   ├── portfolio-*.tsx  New navbar + hero components
│   ├── feature-work-*.tsx  New featured work section/card
│   ├── experience-*.tsx    New experience card/section
│   ├── education-capabilities-section.tsx  New combined education+skills
│   ├── project-grid-card.tsx  New compact grid card
│   └── ui/            33 primitives (SectionHeader, PatternSeparator, BlurFade, etc.)
├── data/
│   └── resume.ts      ← SINGLE SOURCE OF TRUTH for all content (name, work, projects, education, contact)
├── lib/               utils, seo-utils, email, prisma, types
└── styles/globals.css  CSS tokens (being migrated to oklch)
```

## Active Refactor — Technical Manual Aesthetic

**Status**: In progress. See `docs/design-system-refactor.md` (full spec) and `docs/ascii-layout.md` (wireframes).

**Goal**: Replace animated, sparkle-heavy UI with an editorial look: Space Mono + Lora, oklch color tokens, borders over shadows, 150ms transitions max.

**Homepage page.tsx is currently using the NEW components** (`PortfolioNavbar`, `PortfolioHero`, `FeaturedWorkSection`, `ExperienceTrustSection`, `EducationCapabilitiesSection`). Old section imports are still present but unused/commented.

### Refactor implementation order (from spec)
1. `styles/globals.css` — oklch tokens, font vars, remove shadow vars
2. `app/layout.tsx` — Space Mono + Lora via next/font
3. `ui/section-header.tsx` — editorial section header primitive ✓ (exists)
4. `sections/HeroSection.tsx` — remove TypingAnimation
5. `ui/project-card.tsx` — FIG label, bordered plate, mono tags
6–11. Remaining sections (ProjectsSection, ExperienceSection, SkillsSection, ContactSection, AboutSection, EducationSection)
12. `Navbar.tsx` — restyle dock, remove glows
13. `app/page.tsx` — replace separators, increase spacing

### Design tokens (target)
- Background: `oklch(0.988 0 0)` warm off-white
- Foreground: `oklch(0.178 0 0)` near-black ink
- Primary: `oklch(0.573 0.223 267.8)` periwinkle blue
- Radius: `0.375rem` (6px) everywhere
- Font display: `Space Mono`
- Font body: `Lora`

## Key Conventions

- **Content changes**: edit `data/resume.ts` only — all components read from `RESUME`
- **New components**: all go into `components/sections/` (kebab-case filenames). Do NOT create subfolders inside `sections/` until it reaches ~15 files OR a single domain grows to 3+ co-located files that a new contributor cannot tell apart by name alone.
- **Motion**: max 150–180ms, only `transition-colors` / `transition-opacity` / subtle `translateY`; no spring physics, no sparkles
- **Borders over shadows**: `border border-border` not `shadow-lg`
- **No glassmorphism**, no `rounded-full` pills
- **Lint**: `pnpm lint` uses Oxlint, not ESLint

## DO NOT TOUCH

- `app/graduation/` — 3D microsite, entirely separate, leave as-is
- `/projects/[slug]` and `/job/[slug]` detail pages — not in scope for refactor
- All data files, schemas, API routes, MDX config

## Commands

```bash
pnpm dev          # dev server
pnpm build:web    # production build (runs prisma generate first)
pnpm lint         # oxlint
pnpm type-check   # tsc across workspace
pnpm fmt          # prettier
pnpm analyze      # ANALYZE=true build (bundle analysis)
```

## Docs

| File | Purpose |
|------|---------|
| `docs/design-system-refactor.md` | Full visual redesign spec with component-by-component guide |
| `docs/ascii-layout.md` | Desktop + mobile wireframes, component breakdown |
| `docs/makingsoftware-style.md` | Design inspiration reference |
