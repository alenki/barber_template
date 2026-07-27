# Maison Fade — design system

The whole site is **three colours, three typefaces, and one enormous gesture per screen.**
Restraint everywhere except scale. If a section has more than one idea in it, it is wrong.

---

## Colour

| Token | Value | Use |
| --- | --- | --- |
| `ember` | `#ff5a1f` | Full-slab backgrounds. The signal colour. Never a small accent on white — it either owns the whole section or appears as a circular sticker/badge. |
| `ink` | `#0a0908` | Type on ember and on paper. Full-slab background for the book/FAQ section and the footer. |
| `paper` | `#ffffff` | Full-slab background. Type on ink. |
| `ash` | `#6b6560` | Only for genuinely secondary metadata on paper. Use sparingly. |

Tailwind classes: `bg-ember`, `text-ink`, `bg-ink`, `text-paper`, `text-ash`.

**No gradients. No drop shadows** (the sticky Book pill is the single exception).
**No borders except hairlines** — `border-t border-current/20`.

Sections are **full-bleed slabs** that alternate: ember → paper → ember → ink.
Every slab must carry `data-tone="ink" | "paper"`, naming the colour the fixed header
should draw itself in while that slab is under it. Ember and paper slabs are
`data-tone="ink"`; ink slabs and photo slabs are `data-tone="paper"`.

## Type

| Role | Family | Class | Notes |
| --- | --- | --- | --- |
| Display | Bodoni Moda | `.display` | Didone hairlines. `line-height: .86`, tracking `-.038em`. Mix roman and *italic* inside one headline — the italic run is the emphasis. |
| Mega | Bodoni Moda italic | `.mega` | Single-word section titles at `clamp(3.5rem, 15.5vw, 17rem)`. Spans the entire viewport width, edge to edge. |
| Label | Courier Prime | `.label` | Uppercase, tracked. Eyebrows, meta, captions. |
| Note | Courier Prime | `.note` | Uppercase running copy in narrow margin columns. Never wider than ~34ch. |
| UI | General Sans 700 | `.ui` | Uppercase nav, buttons, small links. |

Fluid sizes available as Tailwind font-size utilities: `text-mega`, `text-hero`,
`text-xl`, `text-lg`, `text-md`.

> **Trap:** never write `text-[var(--text-hero)]` — Tailwind reads a bare `var()` as a
> *colour*. Use the registered utility (`text-hero`) or a literal `clamp()`.

Body copy in General Sans is rare and always short. Long-form prose only appears in
the Journal. Everything else is either enormous display type or small typewriter copy.

## Layout

- `.edge` — horizontal gutter (`clamp(1.25rem, 4vw, 4.5rem)`).
- `.slab` — gutter + vertical rhythm `clamp(5rem, 11vw, 12rem)`.
- Content is deliberately **asymmetric**. Small text blocks float in large empty
  areas, offset left or right, never centred in a tidy column. Copy the reference's
  habit: a 30ch typewriter paragraph pinned to one side of an otherwise empty screen.
- Images are `rounded-[10px]`, full-bleed to the gutters, and often bleed past the fold.

## Motion

Import from `motion/react`. Easing is always `[0.16, 1, 0.3, 1]`.

| Primitive | File | Use |
| --- | --- | --- |
| `<SplitText segments={[{text}, {text, italic:true}]} />` | `@/components/motion/SplitText` | Every display headline. Words rise out of masks on a stagger. Pass `animateOnMount` only in the hero. |
| `<Rise>` | same file | Anything that is not a headline. |
| `<Frame src alt />` | `@/components/motion/Frame` | Every photograph. Wipes open from the bottom while the image drifts against the wipe. |
| `<Marquee>` | `@/components/motion/Marquee` | CSS-only ticker. |

One orchestrated reveal per section. Do not add hover micro-interactions to
everything — pick the one element per section that deserves it.

## Signature components

- **Circular ember sticker** — an ember disc with a short italic Bodoni label inside,
  used as a secondary call to action floating in empty space.
- **Ember count badge** — small ember disc with a number, top-right of a mega title.
- **`+` disc** — small ember disc with a `+`, sits inline after an italic card title.
- **Sticky Book pill** — already built, always present, never duplicated.

## Content

Everything lives in `src/lib/content.ts`. Never hardcode copy, prices, names or
hours in a component — import them. Swapping that one file rebrands the site.

## Non-negotiables

1. No emoji anywhere.
2. No `dark:` variants — the slabs are the theme.
3. Every image needs a real `alt` describing the photograph.
4. Interactive elements are reachable by keyboard and show a focus ring.
5. Respect `prefers-reduced-motion` (handled globally, but do not fight it).
6. Nothing may cause horizontal overflow at 375px.
