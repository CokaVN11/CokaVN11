# Lessons Learned

## iOS Mobile Scroll with Vaul Drawer

Four compounding issues caused nav links to fail scrolling on real iOS (iPhone Brave) — not reproducible in DevTools mobile simulation:

1. **`preventScrollRestoration` on `Drawer.Root`** — vaul resets `history.scrollRestoration = 'auto'` on each drawer close. On second navigation, iOS uses this to restore the previous scroll position, overriding `window.scrollTo`. Fix: add `preventScrollRestoration` prop to `<Drawer.Root>`.

2. **`window.scrollTo` over `scrollIntoView`** — After a first smooth scroll, iOS Safari/Brave can cancel subsequent `scrollIntoView({ behavior: 'smooth' })` calls. `window.scrollTo({ top, behavior: 'smooth' })` with an explicit pixel offset is more reliably honored.

3. **`scroll-padding-top` on `html`** — Fixed navbar is out of document flow. Without `scroll-padding-top`, scroll-to-element lands with the target hidden behind the navbar. Set `scroll-padding-top: 5rem` on `html`.

4. **`padding-top` on `<main>`** — Fixed navbar overlaps content starting at y=0. Add `pt-20 sm:pt-24 md:pt-28` to the main container.

**Vaul controlled mode note**: In controlled mode (`open` + `onOpenChange`), calling `setOpen(false)` programmatically does NOT fire vaul's `onOpenChange`, `onClose`, or `onAnimationEnd` callbacks. Use `useEffect([open])` to react to all open-state changes regardless of source. Delay scroll by `500ms` (vaul's `TRANSITIONS.DURATION`).
