# Миллиметр · design system

The whole site is **two dark fields, one light one, one metal, three typefaces,
and one enormous gesture per screen.** Restraint everywhere except scale. If a
section has more than one idea in it, it is wrong.

---

## Colour

Dark-dominant with a single metal accent, which is the register a barbershop
owner already reads as expensive. The metal is never a field; it is spent on
rules, numerals, discs and one hovered word at a time.

| Token | Value | Use |
| --- | --- | --- |
| `espresso` | `#241d17` | The opening slab of every route. Stained wood and old leather; warm enough that the photography sits inside it rather than on top of it. |
| `ink` | `#141210` | The floor. Warm near-black, not true black, so shadow detail in the photographs does not fall off a cliff at the frame edge. Full-slab for testimonials, the book/FAQ section and the footer. |
| `brass` | `#c2a06b` | The accent, **on dark slabs only.** Rules, numerals, discs, selected rows, hover. On bone it measures 2.1:1 — see `brass-deep`. |
| `brass-deep` | `#6d5228` | **Brass when it has to be type on bone.** Nothing else. |
| `paper` | `#f0eae0` | Bone, not white. Full-slab background; type on the dark slabs. |
| `ash` | `#6b6055` | Only for genuinely secondary metadata on bone. Use sparingly. |

Tailwind classes: `bg-espresso`, `bg-ink`, `bg-brass`, `text-paper`, `text-ink`,
`text-brass`, `text-brass-deep`, `text-ash`.

`espresso` and `ink` are deliberately close. They are one material at two
depths, not two colours; if you can name the boundary between two dark slabs
without looking for it, one of them is wrong.

**No gradients used as decoration.** Three exceptions, all of them doing a job:
the footer's scrim over its photograph, and the two layers inside `lamp`
(below), which are what stop a screen-tall dark slab reading as a wall of paint.
**No drop shadows** (the sticky Book pill is the single exception).
**No borders except hairlines**: `border-t border-current/20`.
**No drop shadows** (the sticky Book pill is the single exception).
**No borders except hairlines**: `border-t border-current/20`.

### Contrast floors, measured not guessed

A palette this small leaves opacity as the only obvious way to build hierarchy.
On the dark slabs there is room for it; on brass there is almost none. Measured
against the slab behind them:

| Pair | Ratio |
| --- | --- |
| bone on espresso | 13.9 |
| bone on ink | 15.6 |
| ink on bone | 15.6 |
| brass on espresso | 6.8 |
| brass on ink | 7.6 |
| ink on brass | 7.6 |
| **brass on bone** | **2.1, fails. Use `brass-deep` (6.1).** |
| **brass-deep on espresso** | **2.3, fails. Use `brass`.** |
| ash on bone | 5.1 |
| bone at 65% on espresso | 6.6 |
| bone at 70% on ink | 8.0 |

So: **brass is type on dark slabs only, `brass-deep` on bone only**, and the two
are not interchangeable in either direction — the hover state that reads on the
services list is invisible on the 404 page and vice versa. The dark slabs have
enough headroom that `opacity-65` still clears AA, which is where the dimmed
addresses and hours sit. Anything below that must be `aria-hidden` decoration (a
placeholder dash, a separator) or a `disabled` control.

Those ratios are against the flat token. `lamp` lifts the top of a dark slab by
11% brass, so measure the worst case there too — at the brightest point of the
pool, espresso reads `#352b20` and the numbers fall to bone 11.6, brass 5.6,
bone-at-65% 5.8. All still clear. **Push `lamp` any brighter and that last one
goes under 4.5**, which is the reason it is pitched where it is.

### Slabs

Sections are **full-bleed slabs** that alternate:

```
espresso (hero) → espresso (manifesto) → bone (services)
  → espresso (ritual) → bone (chairs) → ink (testimonials)
  → espresso (locations) → bone (journal) → ink (book + faq)
  → photograph (footer)
```

Never two of the same colour in a row without a photograph between them. Hero
and manifesto are the one place two espresso slabs meet, and the manifesto's
frame is what divides them.

Every dark slab carries **`lamp`** alongside its background class. That utility
lays a warm pool falling from above the top edge and a vignette closing the
corners, both as background-images so they compose onto the flat colour with no
extra element and no change to anything's stacking. It is what makes a
screen-tall dark field read as a lit room rather than as a wall of paint, and it
is pitched below the threshold where it reads as a gradient — if you can see
where it ends, it is too strong. Not on the footer, which has a photograph and a
scrim of its own, and not on small fills.

Every slab must carry `data-tone="ink" | "paper"`, naming the colour the
floating chrome should draw itself in while that slab is under it. Bone slabs
are `data-tone="ink"`; espresso, ink and photo slabs are `data-tone="paper"`.
The chrome also reads the slab's *computed background* so it can lay an opaque
bar in the slab's own colour; no extra attribute needed, but a slab whose
background comes from an ancestor must not be transparent all the way up.

## Type

| Role | Family | Class | Notes |
| --- | --- | --- | --- |
| Display | Playfair | `.display` | Didone hairlines. `line-height: .92`, tracking `-.016em` — both a step looser than the Latin build, because Cyrillic lowercase is a flat band of repeated stems with almost no ascenders. Mix roman and *italic* inside one headline; the italic run is the emphasis. |
| Mega | Playfair italic | `.mega` | Single-word section titles. Spans the entire column, gutter to gutter. |
| Label | IBM Plex Mono | `.label` | Uppercase, tracked. Eyebrows, meta, captions. |
| Note | IBM Plex Mono | `.note` | Uppercase running copy in narrow margin columns. Never wider than ~34ch. |
| UI | Onest 700 | `.ui` | Uppercase nav, buttons, small links. |

Fluid sizes available as Tailwind font-size utilities: `text-mega`, `text-hero`,
`text-xl`, `text-lg`, `text-md`.

> **Trap 1:** never write `text-[var(--text-hero)]`; Tailwind reads a bare `var()` as a
> *colour*. Use the registered utility (`text-hero`) or a literal `clamp()`.
>
> **Trap 2:** `text-xl`, `text-lg` and `text-md` collide with Tailwind's own size keys, so
> they drag Tailwind's stock line-height in over `.display`'s `0.92`. Whenever you put one
> of those on display type, restate the leading: `className="display text-xl leading-[0.92]"`.
> They are display sizes: `text-lg` is up to 3rem, so it is never the right size
> for a phone number or an email address.
>
> **Trap 3:** a `clamp()` whose middle term is a bare `Nvw` reaches its maximum
> only at `max ÷ N` pixels wide. `clamp(0.68rem, 0.82vw, 0.82rem)` therefore sat
> at its *minimum* on every screen narrower than 1600px: fluid in theory,
> 10.88px in practice. `.label` and `.note` now use a `vw + rem` middle term so
> the ramp does its work across the range the site is actually read at.

### Fitting a `.mega` word

The single-word titles are hand-fitted to the column, because how wide a word
draws depends on the word. Measure it, then divide the column by the measurement:

```
--text-mega: calc(100cqw / N)      on a wrapper with containerType: inline-size
```

`cqw`, never `vw`; `vw` includes the desktop scrollbar and leaves the word
~90px short of the gutter. `N` = the word's measured em width × 1.01 for slack
on the italic overhang. Set a probe span to `class="mega"` at a known
font-size, read `getBoundingClientRect().width`, divide.

| Word | em width | `N` |
| --- | --- | --- |
| Услуги | 2.289 | 2.32 |
| Журнал | 2.87 | 2.90 |
| Вместе | 2.85 | 2.88 |
| Записаться | 4.4925 | 4.55 |
| Кресла | 2.487 | sized in `vw`, see `Chairs.tsx` |
| Адреса | 2.473 | 2.50 |

Change the word and the fit is wrong. Re-measure before you re-word.

Body copy in Onest is rare and always short. Long-form prose only appears in
the Journal. Everything else is either enormous display type or small typewriter copy.

## Language

The site is Russian, and Russian costs the layout things English did not.

- **Grammar lives in `src/lib/words.ts`, never in a component.** `spell(n, gender)`
  for numerals that agree ("Одна услуга", "Одно кресло"), `plural(n, …)` and
  `count(n, …)` for the three noun forms a number can take, `money(n)` for
  roubles, `decimal(n)` for a rating ("5,0", a comma, not a point). A component
  that hardcodes "5 кресел" breaks the moment content.ts changes.
- **Never build a sentence that needs a declined proper noun.** content.ts holds
  names in the nominative only. "Записаться к Артёму" needs a dative the data
  does not have, so the barbers page says "Записаться в кресло 01" instead.
  `shop.cityIn` exists for the same reason; it carries "в Москве" so nothing
  has to bend "Москва" at runtime.
- **Non-breaking spaces are load-bearing.** `count()` binds the numeral to its
  noun and `money()` binds the number to `₽`, both with no-break spaces, so
  neither can be split across a line. Prose binds the space *before* an em dash
  the same way, so a dash can never start a line. The hours labels are exempt:
  `book/schedule.ts` parses them.
- **Every typeface must carry the `cyrillic` subset**, and every fallback in
  `globals.css` must too. Check new glyphs before you rely on them: ₽ is absent
  from more Latin-first monos than you would expect.
- Quotation marks are «», never “”.
- Russian runs roughly 15% longer than English. Measures written in `ch`
  (`max-w-[34ch]`) absorb that; measures written in `em` or `rem` do not.

## Layout

- `.edge`: horizontal gutter (`clamp(1.25rem, 4vw, 4.5rem)`).
- `.slab`: gutter + vertical rhythm `clamp(5rem, 11vw, 12rem)`.
- Content is deliberately **asymmetric**. Blocks are offset left or right, never
  centred in a tidy column.
- **Emptiness is only a gesture if the things in it are large, and it has to
  survive a 2560px monitor.** This is the rule the build broke twice, in both
  cases at a width nobody was designing at. A field of nothing around a 12px
  line of typewriter copy reads as a rendering failure; the same field around a
  200px numeral reads as a poster. Manifesto put its headline in one half of the
  screen and nothing in the other; Ritual scattered three small beats across a
  screen-tall slab. Both were fixed the same way — by giving the emptiness
  something to be *against*: a photograph in one, a measured rule in the other.
  **If a section looks empty at 1920px, open it at 2560px before you decide it
  is composition.**
- Every floating object needs an anchor: a hairline, a rule, an edge. A badge
  pinned to nothing looks like a bug even when the coordinates are deliberate.
  A block pinned to *one* other block is not anchored either; two objects with a
  screen of weather between them read as two accidents, not as a relationship.
- Section headers share one grammar: a hairline with a label at one end.
- Images are `rounded-[10px]`, full-bleed to the gutters, and often bleed past the fold.
- Breakpoints: `md` is 768px and `lg` is 1024px. A two-up layout that needs a
  real column on each side belongs at `lg`; a table that only needs a bit more
  width belongs at `md`. Check the 768-1024px band; it is the one nobody looks at.

## Chrome

The header and the Book pill both float over the slabs, and both answer to one
rule read once in `useChromeReveal`: **away while you read forward, back the
moment you look for them.**

- **Header.** Transparent at the top of a page. Leaves upward on scroll-down.
  On scroll-up it returns carrying an opaque bar in the current slab's own
  colour plus a hairline; the only way small nav type survives over a mega
  title or a photograph. It also carries `Записаться`, because the pill is not
  on screen at the top of a page and booking is the only thing this business
  sells.
- **Book pill.** Arrives once the reader is half a screen past the hero, so it
  never covers whatever the hero put in the bottom-right corner. Inverts to
  paper-on-ink over ink slabs. Hidden entirely while the mobile menu is open
  (`body[data-menu="open"]`, so neither component has to know about the other).
- **Nothing else may be `position: fixed`.** Two floating objects is the budget.

## Motion

Import from `motion/react`. Easing is always `[0.16, 1, 0.3, 1]`.

| Primitive | File | Use |
| --- | --- | --- |
| `<SplitText segments={[{text}, {text, italic:true}]} />` | `@/components/motion/SplitText` | Every display headline. Words rise out of masks on a stagger. Pass `animateOnMount` only in the hero. |
| `<Rise>` | same file | Anything that is not a headline. |
| `<Frame src alt />` | `@/components/motion/Frame` | Every photograph. Wipes open from the bottom while the image drifts against the wipe. |
| `<Marquee>` | `@/components/motion/Marquee` | CSS-only ticker. |

One orchestrated reveal per section. Do not add hover micro-interactions to
everything; pick the one element per section that deserves it.

**Reduced motion has three layers, and each catches what the others cannot.**
The CSS block in `globals.css` zeroes CSS animations. `MotionConfig
reducedMotion="user"` drops Motion's transform and layout *animations*. Neither
sees `Frame`'s parallax, which is a scroll-driven transform rather than an
animation, and reading the preference in JS would resolve differently on the
server and the client, which is a hydration mismatch. So the parallax is killed
in CSS: `[data-parallax] { transform: none !important }` inside the
reduced-motion query, where an author `!important` beats the inline style
Motion writes.

## Signature components

- **The millimetre rule** (`.ruler`): a brass scale with minor and major ticks,
  drawn in three background layers pinned to the bottom edge. It is the shop's
  own name unrolled — the mark is six bars stepping from solid to hairline — and
  it is what the three beats of `Ritual` stand on. Use it where content is
  genuinely *measured* or *ordered*, never as a divider; a hairline is the
  divider. Segments in adjacent grid columns must touch (`gap-x-0`, padding on
  the copy instead) or the line stops reading as one line.
- **Brass disc**: a small brass disc with a numeral, a `+` or a rating inside,
  in ink. Sits inline after an italic card title, or pinned to the corner of a
  photograph. Anchored to something, never floating free.
- **Brass fill**: the bar that wipes in under a chosen booking row, and the fill
  of a selected day or time. Selection on this site is always *brass filled with
  ink*, never a border or a tick.
- **Sticky Book pill**: already built, always present once you are reading,
  never duplicated.

## Content

Everything lives in `src/lib/content.ts`. Never hardcode copy, prices, names or
hours in a component; import them. Swapping that one file rebrands the site.

The hours table is *parsed*, not just printed: `book/schedule.ts` turns
"Пн-Пт" and "Суббота" into weekday numbers and "Выходной" into a closed day.
Invent a new label format and the booking diary stops finding the room's hours.

**Nothing may promise a step the booking flow does not have.** The flow asks for
room, service, chair, time and contact details; it never asks how you want to
pay, so no copy anywhere may say it does.

## Non-negotiables

1. No emoji anywhere.
2. No `dark:` variants; the slabs are the theme.
3. Every image needs a real `alt` describing the photograph.
4. Interactive elements are reachable by keyboard, show a focus ring, and have a
   44px target. The ring is `outline`-only on bone, where ink already measures
   15.6:1; the halo it used to carry turned every focused input into a white
   box. `data-tone="paper"` slabs — espresso, ink and the photo slabs — keep the
   halo, because those are the ones carrying photographs under the type.
5. Respect `prefers-reduced-motion` (see Motion above, but do not fight it).
6. Nothing may cause horizontal overflow at 375px.
7. Nothing important rests in the bottom-right corner of a first screen. That
   corner belongs to the Book pill.
8. `tap` sets `display: inline-flex` to hold the 44px floor, which means `w-fit`
   and vertical margins do nothing to it. Two `tap` links that need to stack
   have to sit in a flex column, or they will run together on one line.
