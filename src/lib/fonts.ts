import { Bodoni_Moda, Courier_Prime } from "next/font/google";
import localFont from "next/font/local";

/**
 * Display — Bodoni Moda.
 * A Didone: hairline thins against heavy stems. Chosen because a straight razor
 * makes exactly that shape. Used enormous, tight, and freely mixed roman/italic.
 */
export const display = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-display",
});

/** Typewriter — small uppercase copy, labels, running text in the margins. */
export const typewriter = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-typewriter",
});

/** UI — General Sans. Geometric with a little warmth. Nav, buttons, body. */
export const sans = localFont({
  src: [
    { path: "../../public/fonts/GeneralSans-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/GeneralSans-500.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/GeneralSans-600.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/GeneralSans-700.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-sans",
});
