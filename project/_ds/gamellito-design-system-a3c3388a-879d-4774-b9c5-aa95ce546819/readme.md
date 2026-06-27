# Gamellito — Design System

> Ecossistema que auxilia a vida de pessoas com doenças crônicas, deixando menos
> complicada a vida de quem tem **diabetes tipo 1**.

Gamellito is a friendly, game-flavored education brand for kids, families and
caregivers living with **type 1 diabetes (T1D)**. The mascot **Gamellito** (a
round, orange cartoon character illustrated by *Roger*) turns an intimidating,
clinical topic into a warm, playful adventure. The visual world looks like a
children's storybook crossed with a board game: sunny yellows, chunky rounded
lettering, thick ink outlines, and clusters of colorful "game" dots.

This design system captures that world so any agent can produce on-brand
slides, mockups, prints and prototypes.

---

## Sources

- **`uploads/Template_Gamellito.pptx`** — a 16:9 PowerPoint presentation template
  (the "Template_Gamellito"). The deck ships with placeholder copy in Brazilian
  Portuguese and references *"[ ilustração do Gamellito — Roger ]"* on the cover,
  plus a footer tag *"Projeto Gamellito • Educação em Diabetes Tipo 1"*. It is a
  blank structural template (Office theme colors, no embedded brand media), so the
  **color & type system here was derived from the brand description + the
  Gamellito illustration language**, not from theme XML. The slide *structure*
  (title → agenda → section → content+illustration → highlights → numbers →
  closing) is taken from the template and recreated in `slides/`.

> ⚠️ **No source brand assets were provided** (no logo file, no Roger
> illustrations, no real screens of the app/platform). Imagery in this system uses
> labeled placeholders. See **Caveats** at the bottom — please share the real
> logo, mascot art and any product screens so we can replace placeholders and
> lock the palette to the official values.

---

## Language

Everything is written in **Brazilian Portuguese (pt-BR)**. The product domain is
type-1-diabetes education for children and families.

---

## CONTENT FUNDAMENTALS

How Gamellito writes and talks.

- **Tone:** warm, encouraging, playful — a friend who happens to know a lot about
  diabetes. Never clinical, never alarmist, never condescending. Turns the hard
  parts into an "aventura" (adventure / game).
- **Person:** speaks *to* the reader as **"você"** and rallies together with
  **"a gente" / "vamos" / "bora"**. Inclusive and side-by-side ("vamos juntos"),
  not top-down instruction.
- **Casing:** sentence case in body and UI. Big display lettering is the only
  place that gets loud. Avoid ALL-CAPS except tiny eyebrow/kicker labels
  (e.g. `SEÇÃO 01`, `EDUCATIVO`).
- **Length:** short. One idea per card / per slide. Lots of white space
  ("respiro"). Prefer a punchy line over a paragraph.
- **Voice examples:**
  - "Bora, Gamellito!"
  - "Diabetes tipo 1 não precisa dar medo."
  - "A gente transforma o difícil em aventura."
  - "Vamos juntos nessa jornada."
- **Vocabulary:** game/adventure metaphors (jornada, missão, fase, conquista,
  aventura) paired with plain-language T1D terms (glicemia, insulina, carboidrato,
  bomba, sensor). Keep medical words accurate but always explained simply.
- **Emoji:** used **sparingly and only playfully** in casual/kid-facing contexts
  — never in clinical or formal copy. The colorful "game dots" motif does most of
  the playful decoration, so reach for emoji rarely. Prefer the dot/badge system.
- **Numbers:** when used, make them celebratory and human ("+200 famílias
  acompanhadas"), never dense data-dumps.

---

## VISUAL FOUNDATIONS

The look: a sunny cartoon storybook with a board-game wink.

### Color
- **Dominant:** Amarelo-sol `#FFC400` — the cover/energy color. Big yellow fields
  are the brand's signature background.
- **Character:** Laranja Gamellito `#F26A00` — the mascot's color; used for
  primary buttons and key accents.
- **Scene/secondary:** Lilás `#9B8CF0` and Roxo `#6E59C9` — section backgrounds,
  dividers, and text on cream/yellow.
- **Neutral/respiro:** Creme `#FFF3C9` (halos, cards, breathing room over yellow),
  Branco `#FFFFFF`, and Tinta `#2B2233` (the cartoon outline + main text).
- **Game accents:** red/blue/green/pink/magenta dots — used in **small doses only**
  (the colored bullets/dots motif). Never large flat fields.
- **Rule of thumb (60-30-10):** one dominant color per piece, one support color,
  then small accents + the character orange. Don't give every color equal weight.

### Type
- **Display:** **Baloo 2** — heavy, rounded, friendly. Used for titles and big
  lettering (stand-in for Roger's hand-lettering). Weights 600–800.
- **Body:** **Nunito** — clean, round-terminal sans. Airy line-height (1.55).
- Big weighty titles, generous body spacing. **Never center long paragraphs** —
  only titles and short lines get centered.

### Shape & line
- **Corners:** round everything — radii 10/16/24/32 and full pills. Never sharp.
- **Outline:** a **thick ink contour** (`3–4px solid #2B2233`) around shapes,
  cards and buttons — this is the cartoon line and it's essential.
- **Shadows:** a **hard "pop" shadow** — a solid ink-colored offset with *no blur*
  (`4px 4px 0`). On press it collapses and the element nudges down/right. A soft
  blurred shadow exists only for floating UI (menus/toasts) and is used rarely.

### Surfaces, backgrounds & motifs
- Backgrounds are **flat color fields** (yellow / lilac / cream) — **no gradients**,
  no photographic textures. Optional subtle dot/confetti scatter is acceptable.
- The **cream "halo"** — a lighter inset panel behind content placed over a yellow
  field — gives breathing room and focus.
- The **game-dots cluster** (3–5 outlined colored circles) is the recurring
  signature, dropped near a corner or along a divider.
- Cards = white (or cream/sun/lilac) fill + ink outline + pop shadow + round
  corners. Optionally a halo inset and a corner dot cluster.

### Motion
- Springy and friendly. Hover **lifts** an element (translate -1px, bigger pop
  shadow); press **collapses** it (translate +3px, shadow shrinks). Use the
  `--ease-bounce` curve for entrances, `--ease-out` for state changes. Keep it
  quick (120–200ms). No long, infinite, distracting loops on content.
- Hover state = lift + slightly deeper color; press state = squash + shadow
  collapse. Disabled = 50% opacity, no motion.

### Layout
- Generous outer padding (the "respiro"). Content sits on clear flat fields with
  one focal element. Footers carry the project tag line. Touch targets ≥ 44px.

---

## ICONOGRAPHY

- **No source icon set was provided** in the template. The system standardizes on
  **Lucide** (https://lucide.dev) as the default icon library — its rounded joins
  and even stroke weight match the friendly, rounded brand line better than sharp
  or filled icon sets. Load from CDN; render icons in **Tinta `#2B2233`** at a
  **2–2.5px** stroke to echo the cartoon outline. *(Flagged substitution — replace
  with the brand's own icons if they exist.)*
- The **colored "game dots"** are the brand's true native iconography — clusters
  of outlined circles in the game-accent palette. Prefer them over generic icons
  for decoration, bullets, progress and "signature" flourishes.
- **Emoji:** only in casual/kid contexts, sparingly (see Content Fundamentals).
- **Unicode arrows** (→) are fine inside buttons/links.
- Avoid hand-rolled decorative SVG illustration — the mascot and scene art is
  Roger's domain; use placeholders until real art is supplied.

---

## Tokens

Linked through the root **`styles.css`** (consumers link only this file):

| File | Concern |
|---|---|
| `tokens/fonts.css` | Webfont `@import` (Baloo 2 + Nunito via Google Fonts) |
| `tokens/colors.css` | Palette + semantic aliases |
| `tokens/typography.css` | Families, weights, scale, line-height, tracking |
| `tokens/spacing.css` | 8-based spacing, containers, control heights |
| `tokens/effects.css` | Radii, ink outline, pop shadows, motion |

---

## Index / manifest

**Root**
- `styles.css` — global entry (import this).
- `readme.md` — this guide.
- `SKILL.md` — Agent-Skill front-matter wrapper.
- `tokens/` — `fonts · colors · typography · spacing · effects`.

**Components** (`window.GamellitoDesignSystem_a3c338.*`)
- `components/core/` — **Button**, **Badge**, **Card**, **StatNumber**.

**Guidelines / specimen cards** (`guidelines/*.card.html`)
- Colors: primary · support · game accents · 60-30-10 rule
- Type: display · body · scale
- Spacing: scale · radii · outline+shadow
- Brand: recurring motifs

**Slides** (`slides/`)
- A **meeting-deck template library** — 14 editable models in `slides/index.html`
  (interactive deck): Capa · Pauta · Contexto & objetivo · Onde estamos hoje
  (big numbers + gráfico) · Ponto de decisão (A vs. B) · Plano de ação (tabela
  com status) · Resumo & encaminhamentos · Divisor de tema · Subcapa · Texto +
  subtexto · Texto em colunas · Gráficos · OKRs & metas · Casinha de metas
  (house/temple of macro goals). Each slide is a small JSX file; props are
  editable. Charts live in `slides/_charts.jsx`; shared parts in `slides/_parts.jsx`.

---

## Caveats / open questions

- **Fonts are substitutes.** Headlines use **Baloo 2**, body uses **Nunito**
  (Google Fonts). If Gamellito has official/hand-lettered type, please send it.
- **Colors are derived** from the brand description and illustration language —
  the PPTX itself carried only default Office theme colors. Please confirm the
  official hex values (especially the exact yellow/orange).
- **No real assets** (logo, mascot art by Roger, app/platform screens) were
  provided — placeholders are used throughout. **Please share them** so we can
  replace placeholders and build a proper product UI kit.
- **Icons substituted** with Lucide — swap if a brand set exists.
