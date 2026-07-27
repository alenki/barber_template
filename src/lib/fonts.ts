import { Playfair, IBM_Plex_Mono, Onest } from "next/font/google";

/**
 * Display — Playfair.
 * A Didone: hairline thins against heavy stems. Chosen because a straight razor
 * makes exactly that shape. Used enormous, tight, and freely mixed roman/italic.
 *
 * Not Bodoni Moda, which the Latin build used: Bodoni ships no Cyrillic, and a
 * Russian headline set in it falls back to Times mid-word. Playfair carries the
 * same Didone contrast, a real italic, and a `cyrillic` subset drawn by the
 * same hand as the Latin. Its `opsz` axis runs to 1200 — the higher it goes the
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
 * Typewriter — IBM Plex Mono. Small uppercase copy, labels, running text in
 * the margins. Same 400/700 roman-and-italic palette Courier Prime gave the
 * Latin build, with Cyrillic drawn to match.
 *
 * Cousine is the closer Courier match and was the first choice, but it has no
 * ₽ — every price in a `.label` fell back to Arial for one glyph. Plex carries
 * it, which on a site quoting roubles in the margins is the deciding vote.
 */
export const typewriter = IBM_Plex_Mono({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-typewriter",
});

/**
 * UI — Onest. Geometric with a little warmth. Nav, buttons, body.
 * Russian-drawn, so the Cyrillic is the design rather than an afterthought,
 * and variable, so the four weights General Sans needed four files for cost
 * one request.
 */
export const sans = Onest({
  subsets: ["cyrillic", "latin"],
  display: "swap",
  variable: "--font-sans",
});
