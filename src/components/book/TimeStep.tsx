"use client";

import { useEffect, useMemo } from "react";
import {
  clock,
  dayLabel,
  freeCount,
  monthShort,
  openingFor,
  slotsFor,
  spell,
  WEEKDAY,
  type Day,
  type Room,
  type Treatment,
} from "./schedule";

const EASE_CLASS = "ease-[cubic-bezier(0.16,1,0.3,1)]";

/**
 * The diary. Fourteen days built from a date captured in an effect upstairs,
 * and the free hours in each of them derived from the room's opening times in
 * content.ts and the length of the service. Nothing here is invented at
 * render time — the booked-out hours come from a hash of the day and the slot,
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

  const slots = useMemo(
    () => (day ? slotsFor(room, day, dayIndex, service.minutes) : []),
    [room, day, dayIndex, service.minutes]
  );

  /* Land on the first day that has an hour going spare, so the step opens
     with something to read rather than an instruction. */
  const firstOpen = useMemo(() => {
    for (let i = 0; i < days.length; i += 1) {
      if (freeCount(slotsFor(room, days[i], i, service.minutes)) > 0) {
        return days[i].iso;
      }
    }
    return null;
  }, [days, room, service.minutes]);

  useEffect(() => {
    if (!date && firstOpen) onPickDay(firstOpen);
  }, [date, firstOpen, onPickDay]);

  if (!days.length) {
    return (
      <p className="label opacity-55">Opening the diary…</p>
    );
  }

  const opening = day ? openingFor(room, day.weekday) : null;
  const free = freeCount(slots);

  return (
    <div>
      {/* ---------------------------------------------------------- days */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-current/20 pt-4">
        <span className="label">Next {spell(days.length).toLowerCase()} days</span>
        <span className="label opacity-55">{room.name}</span>
      </div>

      <ul className="m-0 mt-6 grid list-none grid-cols-4 gap-[6px] p-0 sm:grid-cols-5 md:mt-8 md:grid-cols-7">
        {days.map((d, i) => {
          const closed = !openingFor(room, d.weekday).window;
          const spare = closed
            ? 0
            : freeCount(slotsFor(room, d, i, service.minutes));
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
                <span className="label leading-none opacity-70">
                  {WEEKDAY[d.weekday]}
                </span>
                <span className="display text-[clamp(1.35rem,2.4vw,2rem)] leading-none">
                  {String(d.dayOfMonth).padStart(2, "0")}
                </span>
                <span className="label leading-none opacity-55">
                  {closed ? "Closed" : monthShort(d)}
                </span>
                {i === 0 ? <span className="sr-only">Today</span> : null}
              </button>
            </li>
          );
        })}
      </ul>

      {/* --------------------------------------------------------- hours */}
      <div className="mt-[clamp(2.5rem,5vw,4rem)]">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-current/20 pt-4">
          <span className="label">
            {day ? dayLabel(day) : "Pick a day"}
            {opening?.window ? ` · ${opening.time}` : ""}
          </span>
          <span className="label opacity-55" role="status">
            {day
              ? free === 0
                ? "No hours left"
                : `${free} of ${slots.length} hours free`
              : ""}
          </span>
        </div>

        {slots.length === 0 ? (
          <p className="note mt-6 max-w-[34ch] opacity-70">
            This room is closed that day. Choose another, or try a different
            room.
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
                    <span className="label leading-none opacity-60">
                      {slot.taken ? "Taken" : `— ${clock(slot.end)}`}
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
