# Миллиметр · design system

The whole site is **three colours, three typefaces, and one enormous gesture per screen.**
Restraint everywhere except scale. If a section has more than one idea in it, it is wrong.

---

## Colour

| Token | Value | Use |
| --- | --- | --- |
| `ember` | `#ff5a1f` | Full-slab backgrounds. The signal colour. Never a small accent on white; it either owns the whole section or appears as a circular sticker/badge. |
| `ember-deep` | `#d63f0c` | **Ember when it has to be type on paper.** Nothing else. |
| `ink` | `#0a0908` | Type on ember and on paper. Full-slab background for testimonials, the book/FAQ section and the footer. |
| `paper` | `#ffffff` | Full-slab background. Type on ink. |
| `ash` | `#6b6560` | Only for genuinely secondary metadata on paper. Use sparingly. |

Tailwind classes: `bg-ember`, `text-ink`, `bg-ink`, `text-paper`, `text-ash`, `text-ember-deep`.

**No gradients** (the footer's scrim over the photograph is the single exception).
**No drop shadows** (the sticky Book pill is the single exception).
**No borders except hairlines**: `border-t border-current/20`.

### Contrast floors, measured not guessed

A three-colour palette leaves opacity as the only obvious way to build hierarchy,
and on ember it runs out of room long before it looks like it has. Measured
against the slab behind them:

| Pair | Ratio |
| --- | --- |
| ink on ember | 6.4 |
| ember on ink | 6.4 |
| **ember on paper** | **3.1, fails. Use `ember-deep` (4.6).** |
| ink at 70% on ember | 4.2, fails |
| **ink at 75% on ember** | **4.6, the floor** |
| paper at 45% on ink | 4.5, borderline |
| paper at 55% on ink | 6.3 |
| ash on paper | 5.7 |

So: **nothing on an ember slab dims below `opacity-75`**, and **ember is never
type on paper**. Where a row flips between ink-on-ember and ember-on-ink, as
`OptionRow` does, no single opacity clears both, so it uses none at all and
lets family and size carry the hierarchy instead. Anything dimmer than the
floor must be `aria-hidden` decoration (a placeholder dash, a separator) or a
`disabled` control.

### Slabs

Sections are **full-bleed slabs** that alternate:

```
ember (hero) → ember (manifesto, split by a full-bleed photograph)
  → paper (services) → ember (ritual) → paper (chairs)
  → ink (testimonials) → ember (locations) → paper (journal)
  → ink (book + faq) → photograph (footer)
```

Never two of the same colour in a row without a photograph between them.

Every slab must carry `data-tone="ink" | "paper"`, naming the colour the
floating chrome should draw itself in while that slab is under it. Ember and
paper slabs are `data-tone="ink"`; ink slabs and photo slabs are
`data-tone="paper"`. The chrome also reads the slab's *computed background* so
it can lay an opaque bar in the slab's own colour; no extra attribute needed,
but a slab whose background comes from an ancestor must not be transparent all
the way up.

## Type

| Role | Family | Class | Notes |
| --- | --- | --- | --- |
| Display | Playfair | `.display` | Didone hairlines. `line-height: .86`, tracking `-.038em`. Mix roman and *italic* inside one headline; the italic run is the emphasis. |
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
> they drag Tailwind's stock line-height in over `.display`'s `0.86`. Whenever you put one
> of those on display type, restate the leading: `className="display text-xl leading-[0.86]"`.
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
| Адреса | 2.49 | deliberately short of the gutter, to leave room for the count badge |

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
- Content is deliberately **asymmetric**. Small text blocks float in large empty
  areas, offset left or right, never centred in a tidy column. Copy the reference's
  habit: a 30ch typewriter paragraph pinned to one side of an otherwise empty screen.
- Emptiness is only a gesture if the things in it are large. A field of nothing
  around 12px type reads as a rendering failure; the same field around a 200px
  numeral reads as a poster. If a section looks empty, the fix is bigger, not more.
- Every floating object needs an anchor: a hairline, a rule, an edge. A badge
  pinned to nothing looks like a bug even when the coordinates are deliberate.
- Section headers share one grammar: a hairline, a label at one end, and the
  count badge at the other.
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

- **Circular ember sticker**: an ember disc with a short italic Bodoni label inside,
  used as a secondary call to action floating in empty space.
- **Ember count badge**: small ember disc with a number, anchored to a section
  header's hairline or riding a mega title's corner. Never floating free.
- **`+` disc**: small ember disc with a `+`, sits inline after an italic card title.
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
   44px target. The ring is `outline`-only on ember and paper, where ink already
   measures 6.4:1; the paper halo it used to carry turned every focused input
   into a white box. Ink slabs keep a halo because they also carry photographs.
5. Respect `prefers-reduced-motion` (see Motion above, but do not fight it).
6. Nothing may cause horizontal overflow at 375px.
7. Nothing important rests in the bottom-right corner of a first screen. That
   corner belongs to the Book pill.
