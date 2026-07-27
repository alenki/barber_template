/**
 * The booking flow's arithmetic. No React, no randomness, no clock.
 *
 * Everything here is a pure function of its arguments, so the same choices
 * always produce the same days, the same free hours and the same reference
 * code. The only real date on the page is captured once inside an effect and
 * handed to `buildDays` — nothing calls `new Date()` while rendering.
 */

import { locations, services, barbers } from "@/lib/content";

export type Room = (typeof locations)[number];
export type Chair = (typeof barbers)[number];
export type Treatment = (typeof services)[number];

/* ------------------------------------------------------------------ words */

const COUNT_WORDS = [
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
  "Thirteen",
  "Fourteen",
] as const;

export const spell = (n: number): string => COUNT_WORDS[n] ?? String(n);

export const money = (n: number) => `$${n}`;

export const duration = (min: number) => {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
};

/**
 * The one option that is not in content.ts: no preference. Kept here so the
 * barber step can treat it as just another row.
 */
export const ANY_CHAIR = {
  id: "any",
  chair: "Any",
  name: "Whoever is free",
  role: "No preference",
  detail: "We give you the chair best suited to the service you picked.",
} as const;

/* ------------------------------------------------------------------ dates */

export const DAY_COUNT = 14;

export const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const WEEKDAY_KEY = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
const MONTH = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export type Day = {
  iso: string;
  weekday: number;
  dayOfMonth: number;
  month: number;
};

const pad = (n: number) => String(n).padStart(2, "0");

/** Today, as `YYYY-MM-DD`. Only ever called from inside an effect. */
export const isoOf = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** `count` consecutive days from `startISO`. Same input, same output, always. */
export function buildDays(startISO: string, count = DAY_COUNT): Day[] {
  const [y, m, d] = startISO.split("-").map(Number);
  const out: Day[] = [];
  for (let i = 0; i < count; i += 1) {
    const t = new Date(Date.UTC(y, m - 1, d + i));
    out.push({
      iso: t.toISOString().slice(0, 10),
      weekday: t.getUTCDay(),
      dayOfMonth: t.getUTCDate(),
      month: t.getUTCMonth(),
    });
  }
  return out;
}

export const dayLabel = (day: Day) =>
  `${WEEKDAY[day.weekday]} ${pad(day.dayOfMonth)} ${MONTH[day.month]}`;

export const monthShort = (day: Day) => MONTH[day.month];

/* ------------------------------------------------------------------ hours */

/**
 * Reads the hours table in content.ts rather than restating it. A label is
 * either a single day ("Saturday") or a range ("Mon — Fri"); both resolve to
 * the set of weekday numbers they cover.
 */
function weekdaysOf(label: string): number[] {
  const l = label.toLowerCase();
  const hits = WEEKDAY_KEY.map((k, i) => ({ i, at: l.indexOf(k) })).filter(
    (h) => h.at >= 0
  );
  if (hits.length === 2 && /[—–-]/.test(l)) {
    hits.sort((a, b) => a.at - b.at);
    const out: number[] = [];
    for (let i = hits[0].i; ; i = (i + 1) % 7) {
      out.push(i);
      if (i === hits[1].i) break;
    }
    return out;
  }
  return hits.map((h) => h.i);
}

/** "10:00 — 20:00" → [600, 1200]. "Closed" → null. */
function windowOf(time: string): [number, number] | null {
  const m = time.match(/(\d{1,2}):(\d{2})\D+(\d{1,2}):(\d{2})/);
  if (!m) return null;
  return [
    Number(m[1]) * 60 + Number(m[2]),
    Number(m[3]) * 60 + Number(m[4]),
  ];
}

export type Opening = { time: string; window: [number, number] | null };

export function openingFor(room: Room, weekday: number): Opening {
  const entry =
    room.hours.find((h) => weekdaysOf(h.days).includes(weekday)) ?? null;
  if (!entry) return { time: "Closed", window: null };
  return { time: entry.time, window: windowOf(entry.time) };
}

export const clock = (minutes: number) =>
  `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;

/* ------------------------------------------------------------------ slots */

/** Appointments start on a grid derived from how long the service takes. */
const gridFor = (serviceMinutes: number) =>
  Math.max(30, Math.ceil(serviceMinutes / 15) * 15);

export type Slot = { start: number; end: number; taken: boolean };

/**
 * A stable 32-bit hash of two small integers. Used instead of `Math.random`
 * so the same day always shows the same booked-out hours — on the server, on
 * the client, and on a reload.
 */
function hash2(a: number, b: number) {
  let h = ((a + 1) * 73856093) ^ ((b + 1) * 19349663);
  h ^= h >>> 13;
  h = Math.imul(h, 1274126177);
  return (h ^ (h >>> 16)) >>> 0;
}

/** Tomorrow is nearly full; a fortnight out is wide open. */
function pressure(dayIndex: number) {
  if (dayIndex <= 1) return 62;
  if (dayIndex <= 4) return 46;
  if (dayIndex <= 8) return 33;
  return 21;
}

export function slotsFor(
  room: Room,
  day: Day,
  dayIndex: number,
  serviceMinutes: number
): Slot[] {
  const open = openingFor(room, day.weekday).window;
  if (!open) return [];

  const step = gridFor(serviceMinutes);
  const out: Slot[] = [];
  let i = 0;
  for (let t = open[0]; t + serviceMinutes <= open[1]; t += step, i += 1) {
    out.push({
      start: t,
      end: t + serviceMinutes,
      taken: hash2(dayIndex, i) % 100 < pressure(dayIndex),
    });
  }
  /* A room is never completely gone — the last hour of the day survives. */
  if (out.length && out.every((s) => s.taken)) out[out.length - 1].taken = false;
  return out;
}

export const freeCount = (slots: Slot[]) => slots.filter((s) => !s.taken).length;

/* -------------------------------------------------------------- reference */

const CODE_LETTERS = "ACDEFHJKLMNPRTUVWXY";

/**
 * FNV-1a over the choices. Not random, not sequential — the same booking
 * always produces the same code, which is what makes it quotable back to us.
 */
export function referenceCode(parts: (string | number | null)[]) {
  const seed = parts.filter((p) => p !== null && p !== "").join("|").toUpperCase();
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h >>>= 0;
  const a = CODE_LETTERS[h % CODE_LETTERS.length];
  const b = CODE_LETTERS[Math.floor(h / CODE_LETTERS.length) % CODE_LETTERS.length];
  return `MF-${a}${b}-${String(h % 10000).padStart(4, "0")}`;
}
