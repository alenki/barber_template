/**
 * The house voice spells small numbers out. In Russian that costs more than it
 * did in English: "один" agrees with the gender of what it counts, and every
 * noun behind a numeral takes one of three forms. Both rules live here once,
 * so no component has to know them.
 */

/** Grammatical gender of the noun the numeral is counting. */
export type Gender = "m" | "f" | "n";

const WORDS = [
  "Ноль",
  "Один",
  "Два",
  "Три",
  "Четыре",
  "Пять",
  "Шесть",
  "Семь",
  "Восемь",
  "Девять",
  "Десять",
  "Одиннадцать",
  "Двенадцать",
  "Тринадцать",
  "Четырнадцать",
] as const;

/** Only one and two decline for gender; everything above three is invariant. */
const GENDERED: Record<Gender, Record<number, string>> = {
  m: { 1: "Один", 2: "Два" },
  f: { 1: "Одна", 2: "Две" },
  n: { 1: "Одно", 2: "Два" },
};

/**
 * `spell(3)` → "Три". `spell(1, "f")` → "Одна".
 * Anything past fourteen falls back to the numeral.
 */
export const spell = (n: number, gender: Gender = "m"): string =>
  GENDERED[gender][n] ?? WORDS[n] ?? String(n);

/** `spell` but reading naturally in a sentence: "Ни одного" rather than "Ноль". */
export const spellNone = (n: number, gender: Gender = "m"): string =>
  n === 0
    ? { m: "Ни одного", f: "Ни одной", n: "Ни одного" }[gender]
    : spell(n, gender);

/**
 * The noun behind the numeral. Russian picks between three forms by the last
 * digit, with the teens as the exception that swallows all of them:
 * `plural(1, "кресло", "кресла", "кресел")` → "кресло", `plural(5, …)` → "кресел".
 */
export function plural(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(n) % 100;
  if (abs >= 11 && abs <= 14) return many;
  const last = abs % 10;
  if (last === 1) return one;
  if (last >= 2 && last <= 4) return few;
  return many;
}

/** `count(5, "кресло", "кресла", "кресел")` → "5 кресел". */
export const count = (n: number, one: string, few: string, many: string): string =>
  `${n} ${plural(n, one, few, many)}`;

/**
 * Roubles, grouped the Russian way: a narrow no-break space every three
 * digits and the sign after the number. Written by hand rather than through
 * `toLocaleString` because the server and the client must agree exactly and
 * an ICU-less runtime would quietly group it differently.
 */
export const money = (n: number) =>
  `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽`;

/* The three nouns the site counts often enough to be worth naming once. */
export const years = (n: number) => count(n, "год", "года", "лет");
export const chairs = (n: number) => count(n, "кресло", "кресла", "кресел");
export const minutes = (n: number) => count(n, "минута", "минуты", "минут");
