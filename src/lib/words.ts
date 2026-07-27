/**
 * The house voice spells small numbers out. This lived in four files with two
 * different answers for zero ("Zero" in two, "No" in the others), so it now
 * lives here once.
 */
const WORDS = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
] as const;

/** `spell(3)` → "Three". Anything past twelve falls back to the numeral. */
export const spell = (n: number): string => WORDS[n] ?? String(n);

/** `spell` but reading naturally in a sentence: "No chairs" rather than "Zero chairs". */
export const spellNone = (n: number): string => (n === 0 ? "No" : spell(n));
