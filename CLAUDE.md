# coka-portfolio

Personal portfolio site — React 19 + TanStack Start (SSR) + TanStack Router (file-based) + Tailwind v4. Deployed to Cloudflare Workers via `pnpm deploy`.

## Stack
- **Framework**: TanStack Start (Vite SSR)
- **Routing**: TanStack Router (file-based, `src/routes/`)
- **Styling**: Tailwind CSS v4 + tw-animate-css
- **UI**: Radix UI + CVA + lucide-react
- **State**: Zustand
- **Deploy**: Cloudflare Workers (`wrangler`)
- **Package manager**: pnpm

## Commands
```
pnpm dev       # dev server on :3000
pnpm build     # production build
pnpm test      # vitest run
pnpm deploy    # build + wrangler deploy
```

---

<!-- ooo:START -->
<!-- ooo:VERSION:0.21.0 -->
# Ouroboros — Specification-First AI Development

> Before telling AI what to build, define what should be built.
> As Socrates asked 2,500 years ago — "What do you truly know?"
> Ouroboros turns that question into an evolutionary AI workflow engine.

Most AI coding fails at the input, not the output. Ouroboros fixes this by
**exposing hidden assumptions before any code is written**.

1. **Socratic Clarity** — Question until ambiguity ≤ 0.2
2. **Ontological Precision** — Solve the root problem, not symptoms
3. **Evolutionary Loops** — Each evaluation cycle feeds back into better specs

```
Interview → Seed → Execute → Evaluate
    ↑                           ↓
    └─── Evolutionary Loop ─────┘
```

## ooo Commands

Each command loads its agent/MCP on-demand. Details in each skill file.

| Command | Loads |
|---------|-------|
| `ooo` | — |
| `ooo interview` | `ouroboros:socratic-interviewer` |
| `ooo seed` | `ouroboros:seed-architect` |
| `ooo run` | MCP required |
| `ooo evolve` | MCP: `evolve_step` |
| `ooo evaluate` | `ouroboros:evaluator` |
| `ooo unstuck` | `ouroboros:{persona}` |
| `ooo status` | MCP: `session_status` |
| `ooo setup` | — |
| `ooo help` | — |

## Agents

Loaded on-demand — not preloaded.

**Core**: socratic-interviewer, ontologist, seed-architect, evaluator,
wonder, reflect, advocate, contrarian, judge
**Support**: hacker, simplifier, researcher, architect
<!-- ooo:END -->
