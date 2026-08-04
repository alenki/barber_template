"use client";

import type { CSSProperties, ReactNode } from "react";

/**
 * One choice: a hairline, an italic Bodoni name and a generous hit target.
 * Hovering or focusing wipes a brass bar in from the left; choosing leaves it
 * there, so a made decision reads as the one lit row on a dark page. Three
 * things at most on a row — a name, one qualifier, one number — because the
 * question being asked is already at the top of the screen.
 */

/**
 * The brass fill bleeds past the column so the type has air inside it; the row
 * itself does not, so every hairline lands on the same line as the step rule
 * above the list.
 */
const PAD = "clamp(0.9rem, 1.6vw, 1.5rem)";
const FILL_BLEED: CSSProperties = { insetInline: `calc(${PAD} * -1)` };

const EASE_CLASS = "ease-[cubic-bezier(0.16,1,0.3,1)]";

export function OptionRow({
  index,
  media,
  title,
  detail,
  value,
  selected,
  onSelect,
}: {
  /** Small typewriter number on the left: chair, service index, position. */
  index?: string;
  /** Optional thumbnail block. */
  media?: ReactNode;
  title: string;
  /** One qualifying line, never two. */
  detail?: string;
  /** The number that matters, set in Bodoni on the right. */
  value?: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <li className="border-t border-current/20">
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={`group relative flex w-full items-center gap-[clamp(0.85rem,2vw,1.75rem)] py-[clamp(1.15rem,2.4vw,1.9rem)] text-left transition-colors duration-500 ${EASE_CLASS} ${
          selected ? "text-ink" : "hover:text-ink focus-visible:text-ink"
        }`}
      >
        <span
          aria-hidden="true"
          style={FILL_BLEED}
          className={`absolute inset-y-0 origin-left bg-brass transition-transform duration-[600ms] ${EASE_CLASS} ${
            selected
              ? "scale-x-100"
              : "scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100"
          }`}
        />

        {index ? (
          <span className="label relative z-10 w-[2.5ch] shrink-0">
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
            <span className="label mt-2 block opacity-75">{detail}</span>
          ) : null}
        </span>

        {value ? (
          <span className="display relative z-10 shrink-0 text-right text-[clamp(1.2rem,2.1vw,1.9rem)] leading-none whitespace-nowrap">
            {value}
          </span>
        ) : null}
      </button>
    </li>
  );
}
