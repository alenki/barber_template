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


export { spell, money } from "@/lib/words";

export const duration = (min: number) => {
  if (min < 60) return `${min} мин`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} ч ${m} мин` : `${h} ч`;
};

/**
 * The one option that is not in content.ts: no preference. Kept here so the
 * barber step can treat it as just another row.
 */
export const ANY_CHAIR = {
  id: "any",
  chair: "—",
  name: "Кто свободен",
  role: "Без предпочтений",
  detail: "Дадим кресло, которое лучше подходит под выбранную услугу.",
} as const;

/* ------------------------------------------------------------------ dates */

export const DAY_COUNT = 14;

export const WEEKDAY = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"] as const;

/**
 * How an hours label in content.ts names each weekday. Russian abbreviations
 * are not prefixes of the full words — "суббота" does not contain "сб" — so a
 * single key per day is not enough and each one carries its alternates. The
 * English keys are kept so an untranslated hours table still parses.
 */
const WEEKDAY_KEY: readonly (readonly string[])[] = [
  ["воскрес", "вс", "sun"],
  ["понедельн", "пн", "mon"],
  ["вторн", "вт", "tue"],
  ["сред", "ср", "wed"],
  ["четв", "чт", "thu"],
  ["пятн", "пт", "fri"],
  ["суббот", "сб", "sat"],
];

const MONTH = [
  "янв",
  "фев",
  "мар",
  "апр",
  "мая",
  "июн",
  "июл",
  "авг",
  "сен",
  "окт",
  "ноя",
  "дек",
] as const;

/** What a room shows on a day it does not open. */
export const CLOSED = "Выходной";

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
 * either a single day ("Суббота") or a range ("Пн — Пт"); both resolve to
 * the set of weekday numbers they cover.
 */
function weekdaysOf(label: string): number[] {
  const l = label.toLowerCase();
  const hits = WEEKDAY_KEY.map((keys, i) => {
    /* The earliest alternate that appears is where this day sits in the
       label, which is what orders the two ends of a range. */
    const at = keys
      .map((k) => l.indexOf(k))
      .filter((n) => n >= 0)
      .sort((a, b) => a - b)[0];
    return { i, at: at ?? -1 };
  }).filter((h) => h.at >= 0);

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

/** "10:00 — 20:00" → [600, 1200]. "Выходной" → null. */
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
  if (!entry) return { time: CLOSED, window: null };
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

/**
 * Minutes past midnight, local. Used only to hide hours that have already
 * gone — never called during render.
 */
export function minutesNow(): number {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

/* --------------------------------------------------------- client clock --
   Both readings come through `useSyncExternalStore`: the server snapshot is
   null and the client snapshot is the real value, so there is no hydration
   mismatch and no setState firing out of an effect. `getSnapshot` has to
   return the same reference every call, hence the module-level caches. */

let cachedToday: string | null = null;
let cachedNow: number | null = null;

export const todaySnapshot = () => (cachedToday ??= isoOf(new Date()));
export const nowSnapshot = () => (cachedNow ??= minutesNow());
export const serverSnapshot = () => null;
export const subscribeNever = () => () => {};

/** No same-day booking inside this window; there is a chair to prepare. */
export const LEAD_MINUTES = 60;

export function slotsFor(
  room: Room,
  day: Day,
  dayIndex: number,
  serviceMinutes: number,
  /** Minutes past midnight, passed only for today. Omit for any later day. */
  earliest?: number | null
): Slot[] {
  const open = openingFor(room, day.weekday).window;
  if (!open) return [];

  /* Today's diary must not offer this morning. Without this the flow happily
     confirmed appointments twelve hours in the past. */
  const floor =
    dayIndex === 0 && earliest != null ? earliest + LEAD_MINUTES : -Infinity;

  const step = gridFor(serviceMinutes);
  const out: Slot[] = [];
  let i = 0;
  for (let t = open[0]; t + serviceMinutes <= open[1]; t += step, i += 1) {
    if (t < floor) continue;
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

/* Cyrillic, because the code gets read down a phone. О, З and Ч are left out —
   they are heard as nought, three and four. */
const CODE_LETTERS = "АБВГДЕЖКЛМНПРСТУФХЦШЭЮЯ";

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
  return `МЛ-${a}${b}-${String(h % 10000).padStart(4, "0")}`;
}
