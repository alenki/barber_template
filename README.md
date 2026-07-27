# Maison Fade

A barbershop website. Fictional shop, real build — meant to be shown to barbershops as
an example, or rebranded into an actual client site in an afternoon.

Montréal, three rooms, five chairs, six services. None of it exists.

---

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

Node 20.19+ / 22.13+ recommended.

## Stack

| | |
| --- | --- |
| Framework | Next.js 16, App Router, TypeScript |
| Styling | Tailwind CSS v4 (`@theme` tokens in `src/app/globals.css`) |
| Motion | [Motion](https://motion.dev) (`motion/react`) |
| Fonts | Bodoni Moda + Courier Prime via `next/font/google`, General Sans self-hosted in `public/fonts` |
| Images | Pexels, downloaded to `public/img` — free for commercial use, no attribution required |

## Rebranding it

Almost everything a shop would want to change lives in **one file**: `src/lib/content.ts`.
Shop name, city, contact details, services and prices, barbers, locations and hours,
testimonials, FAQs and journal posts all come from there. No copy is hardcoded in a
component.

To change the look, `src/app/globals.css` holds the entire design system as tokens —
three colours and three typefaces. Swapping `--color-ember` recolours the whole site.

`DESIGN.md` documents the rules the site is built to. Read it before adding anything.

## Structure

```
src/
  app/
    page.tsx              home — the long scroll
    services/             full price list and policies
    barbers/              the five chairs
    book/                 five-step booking flow
    journal/              index + [slug] post template
  components/
    chrome/               header, footer, sticky book pill, wordmark
    motion/               SplitText, Frame, Marquee — the shared primitives
    sections/             the home page slabs
    book/                 the booking flow
  lib/
    content.ts            every word and price on the site
    fonts.ts              the type stack
```

## Notes

- The booking flow is a front-end demonstration. It validates input and produces a
  deterministic reference code, but nothing is submitted anywhere and no appointment
  is made. Wiring it to a real system means replacing one submit handler.
- Photography is placeholder. A real shop should shoot its own room and its own barbers —
  it is the single biggest upgrade available to any barbershop site.
- The logo mark is a fade drawn literally: bars stepping from solid to hairline.
