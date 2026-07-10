# Navigation patterns reference

## Bottom tab bar vs. hamburger vs. nothing

Pick based on how many *primary* destinations there are and how often they're visited, not on how much horizontal space is available:

- **Bottom tab bar** — for the 3-5 sections a user moves between constantly within one portal. This is the right call for `DashboardShell`'s mobile nav: each variant (`dm1`/`prof`/`saude`) already defines its core sections in `NAV_BY_VARIANT` in `DashboardShell.tsx`, plus Loja, Conquistas, and Minha conta. A bottom tab bar surfacing those is a one-to-one match for what a native app's tab bar would look like later — this is the pattern to build first when fixing the sidebar gap.
- **Hamburger + dropdown/drawer** — for a mix of frequent and occasional links, or a public/marketing surface where nav isn't the main job of the screen. `Navbar.tsx` already does this correctly for the top-level site nav (`hidden md:flex` desktop row + `md:hidden` hamburger opening a dropdown panel) — reuse this exact pattern for any new top-nav-style component instead of inventing another.
- **Nothing (no nav chrome)** — only appropriate for a single-purpose focused screen reached *from* a tab bar or drawer (e.g. the glicemia entry modal), where back/close is the only navigation needed. Never appropriate for a portal's main dashboard.

Don't mix metaphors on one screen — a bottom tab bar for primary sections *and* a hamburger for secondary/rare actions (conta, sair, configurações) is fine; two competing primary-nav patterns on the same screen is not.

## Sketch: dashboard bottom tab bar (fixes DashboardShell.module.css:150)

Matches the existing shadow-pop / rounded-border / Baloo 2 visual language already used by `.side` and the pill-shaped active states in `Navbar.tsx`:

```
<nav className="fixed bottom-0 inset-x-0 z-40 flex items-center justify-around
                 h-[64px] bg-purple-soft border-t-[3px] border-ink
                 md:hidden">
  {tabs.map((tab) => (
    <Link key={tab.href} href={tab.href}
      className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full
                  font-display font-semibold text-[11px]
                  ${active ? 'text-sun' : 'text-white'}`}>
      <span className="w-2 h-2 rounded-full" style={{ background: tab.color }} />
      {tab.label}
    </Link>
  ))}
</nav>
```

Notes:
- Reuse the `NAV_BY_VARIANT` color-dot convention already in `DashboardShell.tsx` (`s.nd` dots) instead of icon assets that don't exist yet.
- Pair with `.side{display:none}` at the same breakpoint (`max-width:680px`) — the fix isn't removing that line, it's adding the replacement alongside it.
- Add bottom padding to `.main`/`.wrap` at that breakpoint so page content doesn't sit under the fixed bar.
- Cap the tab bar at 5 items max (dashboard's own section + 2-3 from `NAV_BY_VARIANT` + Loja/Conta); if a variant has more links than that, the overflow belongs in a "Mais" sheet, not a 6th cramped tab.

## Thumb zone / one-handed reachability

On a phone held one-handed, the bottom third of the screen is easiest to reach with a thumb; the top corners (especially top-right, where a lot of desktop-first CTAs default to) require a grip shift. This matters concretely for flows in this app that are used one-handed or under time pressure:

- Registering a glicemia reading (`familia/diario`, `RewardModal` flow) — the "Registrar" action should live low on the screen or in/near the bottom tab bar area, not as a top-right button that requires two hands to reach comfortably.
- Confirming/dismissing the reward/celebration modal after saving a reading.
- Any quick-add action reachable from the dashboard (e.g. "+ Registrar glicemia" in `DashboardShell.tsx`).

Concretely: on mobile layouts, prefer a full-width or bottom-anchored primary button for these flows over a small top-corner icon button, even if the desktop version uses a top-corner button. This is one of the few cases where mobile and desktop CTA placement should genuinely differ, not just resize.

## Touch-only checklist

- Any `hover:` Tailwind class that changes an element from invisible/inactive to visible/interactive needs a non-hover equivalent (tap-to-reveal, always-visible affordance, or long-press with a visible fallback).
- Tooltips that only appear on hover need either an always-visible short label on mobile, or a tap-triggered popover.
- Tap targets should be at least ~40px in the smallest dimension — check icon-only buttons (e.g. close/menu buttons) against this, not just text links.
