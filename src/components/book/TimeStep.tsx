"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import {
  clock,
  CLOSED,
  dayLabel,
  freeCount,
  monthShort,
  nowSnapshot,
  openingFor,
  serverSnapshot,
  slotsFor,
  spell,
  subscribeNever,
  WEEKDAY,
  type Day,
  type Room,
  type Treatment,
} from "./schedule";
import { plural } from "@/lib/words";

const EASE_CLASS = "ease-[cubic-bezier(0.16,1,0.3,1)]";

/**
 * The diary. Fourteen days built from a date captured in an effect upstairs,
 * and the free hours in each of them derived from the room's opening times in
 * content.ts and the length of the service. Nothing here is invented at
 * render time; the booked-out hours come from a hash of the day and the slot,
 * so they are the same on every reload.
 */
export function TimeStep({
  room,
  service,
  days,
  date,
  time,
  onPickDay,
  onPickTime,
}: {
  room: Room;
  service: Treatment;
  days: Day[];
  date: string | null;
  time: number | null;
  onPickDay: (iso: string) => void;
  onPickTime: (minutes: number) => void;
}) {
  const dayIndex = days.findIndex((d) => d.iso === date);
  const day = dayIndex >= 0 ? days[dayIndex] : null;

  /* The wall clock, read on the client only. Today's hours that have already
     gone are dropped rather than offered; booking this morning at 23:05 is
     not a thing the diary should allow. */
  const now = useSyncExternalStore(subscribeNever, nowSnapshot, serverSnapshot);

  const slots = useMemo(
    () => (day ? slotsFor(room, day, dayIndex, service.minutes, now) : []),
    [room, day, dayIndex, service.minutes, now]
  );

  /* Land on the first day that has an hour going spare, so the step opens
     with something to read rather than an instruction. */
  const firstOpen = useMemo(() => {
    for (let i = 0; i < days.length; i += 1) {
      if (freeCount(slotsFor(room, days[i], i, service.minutes, now)) > 0) {
        return days[i].iso;
      }
    }
    return null;
  }, [days, room, service.minutes, now]);

  useEffect(() => {
    if (!date && firstOpen) onPickDay(firstOpen);
  }, [date, firstOpen, onPickDay]);

  if (!days.length) {
    return (
      <p className="label opacity-75">Открываем запись…</p>
    );
  }

  const opening = day ? openingFor(room, day.weekday) : null;
  const free = freeCount(slots);

  return (
    <div>
      {/* ---------------------------------------------------------- days */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-current/20 pt-4">
        <span className="label">
          Ближайшие {spell(days.length, "m").toLowerCase()}{" "}
          {plural(days.length, "день", "дня", "дней")}
        </span>
        <span className="label opacity-75">{room.name}</span>
      </div>

      <ul className="m-0 mt-6 grid list-none grid-cols-4 gap-[6px] p-0 sm:grid-cols-5 md:mt-8 md:grid-cols-7">
        {days.map((d, i) => {
          const closed = !openingFor(room, d.weekday).window;
          const spare = closed
            ? 0
            : freeCount(slotsFor(room, d, i, service.minutes, now));
          const chosen = d.iso === date;
          const unavailable = closed || spare === 0;

          return (
            <li key={d.iso}>
              <button
                type="button"
                disabled={unavailable}
                aria-pressed={chosen}
                onClick={() => onPickDay(d.iso)}
                className={`flex w-full flex-col items-center gap-1 rounded-[10px] border py-3 transition-colors duration-500 ${EASE_CLASS} ${
                  chosen
                    ? "border-ink bg-ink text-ember"
                    : unavailable
                      ? "cursor-not-allowed border-current/15 opacity-40"
                      : "border-current/25 hover:border-ink hover:bg-ink hover:text-ember focus-visible:border-ink"
                }`}
              >
                <span className="label leading-none opacity-75">
                  {WEEKDAY[d.weekday]}
                </span>
                <span className="display text-[clamp(1.35rem,2.4vw,2rem)] leading-none">
                  {String(d.dayOfMonth).padStart(2, "0")}
                </span>
                <span className="label leading-none opacity-75">
                  {closed ? CLOSED : monthShort(d)}
                </span>
                {i === 0 ? <span className="sr-only">Сегодня</span> : null}
              </button>
            </li>
          );
        })}
      </ul>

      {/* --------------------------------------------------------- hours */}
      <div className="mt-[clamp(2.5rem,5vw,4rem)]">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-current/20 pt-4">
          <span className="label">
            {day ? dayLabel(day) : "Выберите день"}
            {opening?.window ? ` · ${opening.time}` : ""}
          </span>
          <span className="label opacity-75" role="status">
            {day
              ? free === 0
                ? "Свободных часов нет"
                : `Свободно ${free} из ${slots.length}`
              : ""}
          </span>
        </div>

        {slots.length === 0 ? (
          <p className="note mt-6 max-w-[36ch] opacity-75">
            В этот день зал не работает. Выберите другой день или другой зал.
          </p>
        ) : (
          <ul className="m-0 mt-6 grid list-none grid-cols-3 gap-[6px] p-0 sm:grid-cols-4 md:mt-8 md:grid-cols-5">
            {slots.map((slot) => {
              const chosen = slot.start === time;
              return (
                <li key={slot.start}>
                  <button
                    type="button"
                    disabled={slot.taken}
                    aria-pressed={chosen}
                    onClick={() => onPickTime(slot.start)}
                    className={`flex w-full flex-col items-start gap-1 rounded-[10px] border px-3 py-3 text-left transition-colors duration-500 ${EASE_CLASS} ${
                      chosen
                        ? "border-ink bg-ink text-ember"
                        : slot.taken
                          ? "cursor-not-allowed border-current/15 opacity-40"
                          : "border-current/25 hover:border-ink hover:bg-ink hover:text-ember focus-visible:border-ink"
                    }`}
                  >
                    <span
                      className={`display text-[clamp(1.15rem,1.9vw,1.65rem)] leading-none ${
                        slot.taken ? "line-through" : ""
                      }`}
                    >
                      {clock(slot.start)}
                    </span>
                    <span className="label leading-none opacity-75">
                      {slot.taken ? "Занято" : `до ${clock(slot.end)}`}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
