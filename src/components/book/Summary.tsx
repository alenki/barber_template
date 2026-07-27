"use client";

import { money } from "./schedule";
import { count } from "@/lib/words";

export type SummaryRow = {
  key: string;
  /** Typewriter caption — "Зал", "Услуга", "Кресло". */
  label: string;
  /** The choice itself, or null while it is still unmade. */
  value: string | null;
  /** Which step this row was decided on, for the jump-back. */
  step: number;
};

/**
 * What has been chosen so far, and what it costs. A rail on the right at
 * desktop width; a single wrapped line under the progress on a phone.
 * Filled rows are buttons — the fastest way back to a decision you regret.
 */
export function SummaryRail({
  rows,
  total,
  minutes,
  currentStep,
  onJump,
}: {
  rows: SummaryRow[];
  total: number | null;
  minutes: number | null;
  currentStep: number;
  onJump: (step: number) => void;
}) {
  return (
    <aside
      aria-label="Ваша запись"
      className="hidden md:col-span-4 md:col-start-9 md:block"
    >
      <div className="sticky top-[clamp(6rem,11vh,8rem)] border-t border-current/20 pt-4">
        <p className="label">Пока что</p>

        <ul className="m-0 mt-7 list-none p-0">
          {rows.map((row) => {
            const value = row.value;
            /* A decision already made and already behind you is a way back. */
            const jumpable = value !== null && row.step < currentStep;

            return (
              <li key={row.key} className="border-b border-current/15">
                {jumpable ? (
                  <button
                    type="button"
                    onClick={() => onJump(row.step)}
                    aria-label={`Изменить: ${row.label.toLowerCase()} — сейчас ${value}`}
                    className="flex w-full items-baseline justify-between gap-4 py-3 text-left transition-opacity duration-500 hover:opacity-55"
                  >
                    <RowText label={row.label} value={value} />
                  </button>
                ) : (
                  <div className="flex items-baseline justify-between gap-4 py-3">
                    {value !== null ? (
                      <RowText label={row.label} value={value} />
                    ) : (
                      <>
                        {/* 40% ink on ember measured 2.21:1 — a real label,
                            not decoration, so it has to clear 4.5:1. */}
                        <span className="label shrink-0 opacity-70">
                          {row.label}
                        </span>
                        <span className="label opacity-40" aria-hidden="true">
                          —
                        </span>
                        <span className="sr-only">Ещё не выбрано</span>
                      </>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex items-baseline justify-between gap-4 border-t border-current/20 pt-4">
          <span className="label">Итого</span>
          <span className="display text-[clamp(1.35rem,2.2vw,2rem)] leading-none whitespace-nowrap italic">
            {total === null ? "—" : money(total)}
          </span>
        </div>
        <p className="label mt-2 text-right opacity-50">
          {minutes === null
            ? "Ничего не выбрано"
            : `${count(minutes, "минута", "минуты", "минут")} в кресле`}
        </p>
      </div>
    </aside>
  );
}

function RowText({ label, value }: { label: string; value: string }) {
  return (
    <>
      <span className="label shrink-0 opacity-55">{label}</span>
      <span className="display min-w-0 flex-1 text-right text-[clamp(1rem,1.35vw,1.35rem)] leading-tight italic">
        {value}
      </span>
    </>
  );
}

/** The phone version: one wrapped typewriter line, no rail. */
export function SummaryBar({
  rows,
  total,
}: {
  rows: SummaryRow[];
  total: number | null;
}) {
  const filled = rows.filter((r) => r.value);

  /* A <section>, not a <div> — `aria-label` is prohibited on the implicit
     generic role, so on a phone this running summary had no name at all. */
  return (
    <section
      aria-label="Ваша запись"
      className="mt-6 border-t border-current/20 pt-3 md:hidden"
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="label opacity-50">Пока что</span>
        {filled.length === 0 ? (
          <span className="label opacity-40">Пока пусто</span>
        ) : (
          filled.map((row) => (
            <span key={row.key} className="label">
              <span className="opacity-40">/</span> {row.value}
            </span>
          ))
        )}
        {total === null ? null : (
          <span className="label ml-auto whitespace-nowrap">{money(total)}</span>
        )}
      </div>
    </section>
  );
}
