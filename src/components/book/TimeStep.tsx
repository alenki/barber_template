"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import {
  clock,
  dayLabel,
  freeCount,
  nowSnapshot,
  openingFor,
  serverSnapshot,
  slotsFor,
  subscribeNever,
  WEEKDAY,
  type Day,
  type Room,
  type Treatment,
} from "./schedule";

const EASE_CLASS = "ease-[cubic-bezier(0.16,1,0.3,1)]";

/**
 * The diary. Fourteen days built from a date captured upstairs, and the free
 * hours in each of them derived from the room's opening times in content.ts and
 * the length of the service. Nothing here is invented at render time; the
 * booked-out hours come from a hash of the day and the slot, so they are the
 * same on every reload.
 *
 * A tile says a weekday and a number, and an hour says an hour. The month, the
 * opening times and the count of what is left were all captions on things the
 * reader can already see; the one line under the grid names the chosen day in
 * full and that is the whole of it.
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
    return <p className="label opacity-75">Открываем запись…</p>;
  }

  return (
    <div>
      {/* ---------------------------------------------------------- days */}
      <ul className="m-0 grid list-none grid-cols-4 gap-[6px] p-0 sm:grid-cols-5 md:grid-cols-7">
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
                    ? "border-brass bg-brass text-ink"
                    : unavailable
                      ? "cursor-not-allowed border-current/15 opacity-40"
                      : "border-current/25 hover:border-brass hover:bg-brass hover:text-ink focus-visible:border-brass"
                }`}
              >
                <span className="label leading-none opacity-75">
                  {WEEKDAY[d.weekday]}
                </span>
                <span className="display text-[clamp(1.35rem,2.4vw,2rem)] leading-none">
                  {String(d.dayOfMonth).padStart(2, "0")}
                </span>
                <span className="sr-only">
                  {dayLabel(d)}
                  {i === 0 ? ", сегодня" : ""}
                  {unavailable ? ", свободных часов нет" : ""}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* --------------------------------------------------------- hours */}
      <div className="mt-[clamp(2.5rem,5vw,4rem)]">
        <p className="label" role="status">
          {day ? dayLabel(day) : "Выберите день"}
        </p>

        {slots.length === 0 ? (
          <p className="note mt-6 max-w-[36ch] opacity-75">
            В этот день зал не работает.
          </p>
        ) : (
          <ul className="m-0 mt-5 grid list-none grid-cols-3 gap-[6px] p-0 sm:grid-cols-4 md:grid-cols-6">
            {slots.map((slot) => {
              const chosen = slot.start === time;
              return (
                <li key={slot.start}>
                  <button
                    type="button"
                    disabled={slot.taken}
                    aria-pressed={chosen}
                    onClick={() => onPickTime(slot.start)}
                    className={`display flex w-full items-center justify-center rounded-[10px] border py-3 text-[clamp(1.15rem,1.9vw,1.65rem)] leading-none transition-colors duration-500 ${EASE_CLASS} ${
                      chosen
                        ? "border-brass bg-brass text-ink"
                        : slot.taken
                          ? "cursor-not-allowed border-current/15 line-through opacity-40"
                          : "border-current/25 hover:border-brass hover:bg-brass hover:text-ink focus-visible:border-brass"
                    }`}
                  >
                    {clock(slot.start)}
                    {slot.taken ? (
                      <span className="sr-only">, занято</span>
                    ) : null}
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
