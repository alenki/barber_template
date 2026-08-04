import { Playfair, IBM_Plex_Mono, Onest } from "next/font/google";

/**
 * Display: Playfair.
 * A Didone: hairline thins against heavy stems. Chosen because a straight razor
 * makes exactly that shape. Used enormous, tight, and freely mixed roman/italic.
 *
 * Not Bodoni Moda, which the Latin build used: Bodoni ships no Cyrillic, and a
 * Russian headline set in it falls back to Times mid-word. Playfair carries the
 * same Didone contrast, a real italic, and a `cyrillic` subset drawn by the
 * same hand as the Latin. Its `opsz` axis runs to 1200; the higher it goes the
 * thinner the hairlines get, which is the whole reason for the choice.
 */
export const display = Playfair({
  subsets: ["cyrillic", "latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-display",
});

/**
 * Typewriter: IBM Plex Mono. Small uppercase copy, labels, running text in
 * the margins.
 *
 * Cousine is the closer Courier match and was the first choice, but it has no
 * ₽, so every price in a `.label` fell back to Arial for one glyph. Plex carries
 * it, which on a site quoting roubles in the margins is the deciding vote.
 *
 * Regular roman only. The Latin build declared 400/700 × roman/italic out of
 * habit and never set a single word in three of them; with a Cyrillic subset
 * added those three unused files cost more than they did in Latin, and every
 * one of them was being fetched.
 */
export const typewriter = IBM_Plex_Mono({
  subsets: ["cyrillic", "latin"],
  weight: ["400"],
  style: ["normal"],
  display: "swap",
  variable: "--font-typewriter",
});

/**
 * UI: Onest. Geometric with a little warmth. Nav, buttons, body.
 * Russian-drawn, so the Cyrillic is the design rather than an afterthought,
 * and variable, so the four weights General Sans needed four files for cost
 * one request.
 */
export const sans = Onest({
  subsets: ["cyrillic", "latin"],
  display: "swap",
  variable: "--font-sans",
});
