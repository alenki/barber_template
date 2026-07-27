"use client";

import type { CSSProperties, ReactNode } from "react";

/**
 * One choice: a hairline, an italic Bodoni name and a generous hit target.
 * Hovering or focusing wipes an ink bar in from the left; choosing leaves it
 * there, so a made decision reads as ink filled with ember.
 */

/** Rows bleed a little past the column so the ink fill has air around the type. */
const PAD = "clamp(0.9rem, 1.6vw, 1.5rem)";
export const ROW_PAD_CLASS = "px-[clamp(0.9rem,1.6vw,1.5rem)]";
export const ROW_BLEED: CSSProperties = { marginInline: `calc(${PAD} * -1)` };

const EASE_CLASS = "ease-[cubic-bezier(0.16,1,0.3,1)]";

export function OptionRow({
  index,
  media,
  title,
  detail,
  aside,
  value,
  valueNote,
  selected,
  onSelect,
}: {
  /** Small typewriter number on the left — chair, service index, position. */
  index?: string;
  /** Optional thumbnail block. */
  media?: ReactNode;
  title: string;
  detail?: string;
  /** Secondary line, hidden on small screens where the row must stay short. */
  aside?: string;
  /** The number that matters, set in Bodoni on the right. */
  value?: string;
  valueNote?: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <li className="border-t border-current/20">
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={`group relative flex w-full items-center gap-[clamp(0.85rem,2vw,1.75rem)] py-[clamp(1.15rem,2.4vw,1.9rem)] text-left transition-colors duration-500 ${EASE_CLASS} ${ROW_PAD_CLASS} ${
          selected ? "text-ember" : "hover:text-ember focus-visible:text-ember"
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute inset-0 origin-left bg-ink transition-transform duration-[600ms] ${EASE_CLASS} ${
            selected
              ? "scale-x-100"
              : "scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100"
          }`}
        />

        {index ? (
          <span className="label relative z-10 w-[2.5ch] shrink-0 opacity-60">
            {index}
          </span>
        ) : null}

        {media ? (
          <span className="relative z-10 shrink-0">{media}</span>
        ) : null}

        <span className="relative z-10 min-w-0 flex-1">
          <span className="display block text-[clamp(1.45rem,2.9vw,2.6rem)] leading-[0.95] italic">
            {title}
          </span>
          {detail ? (
            <span className="label mt-2 block opacity-65">{detail}</span>
          ) : null}
          {aside ? (
            <span className="label mt-1 hidden opacity-45 md:block">{aside}</span>
          ) : null}
        </span>

        {value || valueNote ? (
          <span className="relative z-10 shrink-0 text-right">
            {value ? (
              <span className="display block text-[clamp(1.2rem,2.1vw,1.9rem)] leading-none">
                {value}
              </span>
            ) : null}
            {valueNote ? (
              <span className="label mt-2 block opacity-60">{valueNote}</span>
            ) : null}
          </span>
        ) : null}

        <span
          aria-hidden="true"
          className={`relative z-10 grid size-[clamp(1.6rem,2.7vw,2.3rem)] shrink-0 place-items-center rounded-full transition-colors duration-500 ${EASE_CLASS} ${
            selected ? "bg-ember" : "border border-current/35"
          }`}
        >
          <span
            className={`display text-[clamp(0.85rem,1.4vw,1.2rem)] leading-none transition-opacity duration-300 ${
              selected ? "opacity-0" : "opacity-100"
            }`}
          >
            +
          </span>
        </span>
      </button>
    </li>
  );
}
