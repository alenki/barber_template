"use client";

import { useEffect, useState } from "react";

/** Below this the page still reads as "the top". */
const TOP = 24;
/** Ignore the jitter a trackpad emits while the finger is resting. */
const NUDGE = 6;

export type Reveal = {
  /** The page has not moved yet. */
  atTop: boolean;
  /** The last meaningful scroll was upward, or the page is at the top. */
  up: boolean;
};

/**
 * Both pieces of floating chrome answer to the same rule: they get out of the
 * way while you are reading forward and come back the moment you look for
 * them. Sharing one reading of the scroll keeps them in step with each other
 * instead of arriving and leaving on their own schedules.
 */
export function useChromeReveal(): Reveal {
  const [state, setState] = useState<Reveal>({ atTop: true, up: true });

  useEffect(() => {
    let last = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setState((prev) => {
        const atTop = y < TOP;
        let up = prev.up;
        if (atTop) up = true;
        else if (y > last + NUDGE) up = false;
        else if (y < last - NUDGE) up = true;
        last = y;
        return atTop === prev.atTop && up === prev.up ? prev : { atTop, up };
      });
    };

    /* Deferred a frame rather than run inline: a reload restores the scroll
       position *after* mount, and reading it synchronously would report the
       top of a page that is already halfway down. */
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return state;
}
