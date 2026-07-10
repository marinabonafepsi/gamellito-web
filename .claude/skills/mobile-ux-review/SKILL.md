---
name: mobile-ux-review
description: Reviews and designs mobile information architecture and navigation for the Gamellito app (familia/profissional/educador/instituicao/admin portals), so mobile layouts are rethought — not just shrunk — and stay forward-compatible with an eventual native app port. Use this proactively whenever building or editing any page, dashboard, or nav component, whenever a responsive/mobile breakpoint is touched, and whenever the user mentions mobile, celular, navegação, menu, sidebar, or how something looks/works "no celular" — even if they don't explicitly ask for a "mobile review."
---

# Mobile UX & IA Review (Gamellito)

## Why this exists

Most Gamellito usage happens on a phone, not a laptop — a parent logging their kid's glicemia in the middle of a meal, a professional checking a patient list between appointments. The team also plans to eventually wrap this into a native app once the ecosystem monetizes. That means the mobile-web navigation/IA decisions made today aren't just a responsive nicety — they're the shape the native app will inherit later. Bottom tab bars, sheets, and thumb-reachable actions chosen now save a rebuild later; ad-hoc "just hide it below 680px" fixes don't.

## The failure mode to catch

The most common and most damaging mistake in this codebase is **removing a desktop nav pattern at a breakpoint without replacing it with anything.** This already happened once and is worth knowing by name:

`src/components/dashboard/DashboardShell.module.css:150` —
```css
@media(max-width:680px){.side{display:none}...}
```
This hides the dashboard's left sidebar below 680px with no bottom tab bar, no hamburger, nothing — so every dashboard user (família, educador, profissional) loses primary navigation on mobile. Treat any `display:none` (or `hidden md:flex` / similar Tailwind pattern) applied to a *navigation* element as a bug until you've confirmed something replaces it below that breakpoint. This is the single highest-value check this skill performs — always check for it first.

Contrast with `src/components/Navbar.tsx`, which already does this correctly: the desktop link row (`hidden md:flex`) is paired with a hamburger button (`md:hidden`) that opens a mobile dropdown panel. That's the reference pattern for "hide desktop nav → mobile replacement exists."

## What "mobile IA" means here (not just responsive CSS)

Making text wrap and buttons stack is necessary but not sufficient. A real mobile pass asks, for the specific screen in front of you:

- **What's primary vs. secondary right now?** On a phone you have room for one clear next action, not a dashboard's worth of panels. What does this user need first when they open this screen on a phone — and does the layout put that first, or does it require scrolling past three other things?
- **What collapses, and into what?** Secondary content shouldn't just shrink — it should move into a sheet, a drawer, a "ver mais" expansion, or a separate tab, so the primary content gets the space and attention it needs.
- **Does this need a bottom tab bar, a hamburger, or nothing?** See the decision guide in `references/navigation-patterns.md`. Getting this wrong (e.g., a hamburger for the app's 4-5 core sections) adds friction to the most frequent actions.
- **Are the primary actions thumb-reachable?** For flows used one-handed or under stress — registering a glicemia reading is the clearest example — the primary CTA belongs in the bottom half of the screen, not top-right where a top-right-placed button forces a hand-shift or two-handed use. See the thumb-zone section in the reference file.
- **Does anything only work with a mouse?** Hover-only tooltips, hover-revealed action buttons, hover states as the *only* affordance — these are invisible on touch. Anything interactive needs a touch-visible equivalent.

## How to run the review

1. **Grep the breakpoints** — `@media`, `md:`, `sm:`, `lg:` etc. in the component/CSS module. For each one, ask: what disappears or rearranges here, and — if it's a *navigation* element — what replaces it below that breakpoint? (This is the nav-removal failure mode above; it's the highest-severity, most common issue, so resolve it for every breakpoint before moving on.)
2. **Walk the screen mobile-first**, even if the code was written desktop-first: what's the first thing a phone user sees, what do they tap first, what's below the fold, what needed a hover that now needs a tap.
3. **Check thumb reachability** for any screen where the primary action is used one-handed or urgently (see reference file for the concrete list of Gamellito flows this applies to).
4. **Cross-check against the existing design system** before proposing new components — reuse the palette (`--color-sun`, `--color-orange`, `--color-purple-soft`, `--game-red/blue/green/magenta/pink`, `--color-lilac`), the `shadow-pop` rounded-border visual language, Baloo 2 for display text and Nunito for body, and existing patterns like `Navbar.tsx`'s hamburger/dropdown. New mobile nav should look like it belongs next to what's already there, not like a bolted-on library default.
5. **Keep scope to mobile-web, not native.** Don't design onboarding flows, push notifications, or app-store concerns — that's out of scope until there's an actual native app project. The goal is a mobile-web IA that *would* port cleanly, not building the port itself.

## Output format

When reviewing an existing screen, report findings as a short list, ordered by severity:

```
1. [Nav loss] <file:line> — <what disappears, at what breakpoint, what replaces it (or "nothing")>
2. [IA] <file:line> — <what's buried that should be primary, or vice versa>
3. [Reachability] <file:line> — <primary action placement vs. thumb zone>
4. [Touch-only] <file:line> — <hover-dependent affordance with no touch equivalent>
```
For each finding, give a concrete fix — a specific component/pattern to add or CSS to change, referencing `references/navigation-patterns.md` where relevant — not general advice like "make it more mobile-friendly."

When building new UI, apply the same questions from the start rather than writing a desktop layout and patching it afterward — mobile-first mockups (even ASCII/described ones) before implementation catch IA problems far cheaper than a CSS retrofit.

See `references/navigation-patterns.md` for the bottom-tab-bar vs. hamburger decision guide, thumb-zone specifics, and a concrete bottom-nav pattern sketch that matches the existing `DashboardShell` and `Navbar` visual language.

See `docs/MOBILE-UX-GUIDELINES.md` (repo root) for the standing site-wide audit — what's already fixed, what's audited and fine, and what's intentionally out of scope. Update that doc, not just this skill, whenever a mobile nav decision is made — it's the durable record future sessions should read first.
