"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export type Tone = "ink" | "paper";

export type ChromeSlab = {
  /** The colour the chrome should draw *itself* in over this slab. */
  tone: Tone;
  /** The slab's own background, so chrome can lay an opaque bar in it. */
  bg: string;
};

const INITIAL: ChromeSlab = { tone: "ink", bg: "#ff5a1f" };

/**
 * Backgrounds are set with Tailwind utilities, so the only honest source for
 * "what colour is this slab" is the computed style. Photo slabs paint their
 * image over a solid `bg-ink`, which is exactly the colour a bar wants, and a
 * transparent wrapper walks up until it finds something opaque.
 */
function readBackground(el: HTMLElement): string {
  let node: HTMLElement | null = el;
  while (node) {
    const bg = getComputedStyle(node).backgroundColor;
    if (bg && bg !== "transparent" && !bg.startsWith("rgba(0, 0, 0, 0")) {
      return bg;
    }
    node = node.parentElement;
  }
  return INITIAL.bg;
}

/**
 * The header and the Book pill float over slabs that flip between ember, white
 * and black. Rather than tint them, we read whichever slab is currently under
 * the header baseline and let it declare both the ink colour (`data-tone`) and
 * its own background.
 *
 * Backgrounds never change once painted, so they are measured at collect time
 * and the scroll handler only ever reads rects.
 *
 * A negative `offset` measures up from the bottom of the viewport instead:
 * that is where the Book pill sits, and it is often over a different slab than
 * the header is.
 */
export function useChromeSlab(offset = 72): ChromeSlab {
  const [slab, setSlab] = useState<ChromeSlab>(INITIAL);
  /* The chrome lives in the layout and survives route changes. Without the
     pathname in the deps the effect would keep measuring the *previous*
     route's detached slabs, and the header would sit ink-on-ink on any page
     reached by a client-side navigation. */
  const pathname = usePathname();
  const current = useRef<ChromeSlab>(INITIAL);

  useEffect(() => {
    let slabs: { el: HTMLElement; tone: Tone; bg: string }[] = [];

    const collect = () => {
      slabs = Array.from(
        document.querySelectorAll<HTMLElement>("[data-tone]")
      ).map((el) => ({
        el,
        tone: (el.dataset.tone as Tone) ?? "ink",
        bg: readBackground(el),
      }));
    };

    const read = () => {
      const line = offset < 0 ? window.innerHeight + offset : offset;
      let found: ChromeSlab | null = null;
      for (const s of slabs) {
        const r = s.el.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) {
          found = { tone: s.tone, bg: s.bg };
        }
      }
      if (!found) return;
      if (found.tone === current.current.tone && found.bg === current.current.bg) {
        return;
      }
      current.current = found;
      setSlab(found);
    };

    collect();
    read();

    /* Slabs also appear late (a Suspense fallback swapping for the real
       booking flow, for instance), so watch for them rather than assuming
       the first query saw everything. */
    const mo = new MutationObserver(() => {
      collect();
      read();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      mo.disconnect();
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [offset, pathname]);

  return slab;
}

/** Back-compat for callers that only want the ink colour. */
export function useChromeTone(offset = 72): Tone {
  return useChromeSlab(offset).tone;
}
