"use client";

import { money } from "./schedule";

export type SummaryRow = {
  key: string;
  /** Typewriter caption: "Зал", "Услуга", "Кресло". */
  label: string;
  /** The choice itself, or null while it is still unmade. */
  value: string | null;
  /** Which step this row was decided on, for the jump-back. */
  step: number;
};

/**
 * What has been chosen so far. Only decisions that exist are drawn: an empty
 * rail is nothing at all rather than five captions against five dots. Rows
 * already behind you are buttons; the fastest way back to a choice you regret.
 */
export function SummaryRail({
  rows,
  total,
  currentStep,
  onJump,
}: {
  rows: SummaryRow[];
  total: number | null;
  currentStep: number;
  onJump: (step: number) => void;
}) {
  const filled = rows.filter((r) => r.value !== null);
  if (filled.length === 0) return null;

  return (
    <aside
      aria-label="Ваша запись"
      className="hidden md:col-span-4 md:col-start-9 md:block"
    >
      <div className="sticky top-[clamp(6rem,11vh,8rem)]">
        <ul className="m-0 list-none p-0">
          {filled.map((row) => {
            const value = row.value as string;
            const jumpable = row.step < currentStep;

            return (
              <li key={row.key}>
                {jumpable ? (
                  <button
                    type="button"
                    onClick={() => onJump(row.step)}
                    aria-label={`Изменить: ${row.label.toLowerCase()}, сейчас ${value}`}
                    className="flex w-full items-baseline justify-between gap-4 py-2 text-left transition-opacity duration-500 hover:opacity-55"
                  >
                    <RowText label={row.label} value={value} />
                  </button>
                ) : (
                  <div className="flex items-baseline justify-between gap-4 py-2">
                    <RowText label={row.label} value={value} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {total !== null && (
          <div className="mt-6 flex items-baseline justify-between gap-4 border-t border-current/20 pt-4">
            <span className="label">Итого</span>
            <span className="display text-[clamp(1.35rem,2.2vw,2rem)] leading-none whitespace-nowrap italic">
              {money(total)}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}

function RowText({ label, value }: { label: string; value: string }) {
  return (
    <>
      <span className="label shrink-0 opacity-75">{label}</span>
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
  if (filled.length === 0) return null;

  /* A <section>, not a <div>; `aria-label` is prohibited on the implicit
     generic role, so on a phone this running summary had no name at all. */
  return (
    <section aria-label="Ваша запись" className="mt-5 md:hidden">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {filled.map((row) => (
          <span key={row.key} className="label">
            {row.value}
          </span>
        ))}
        {total === null ? null : (
          <span className="label ml-auto whitespace-nowrap">{money(total)}</span>
        )}
      </div>
    </section>
  );
}
