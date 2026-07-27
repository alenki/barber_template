"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export type Tone = "ink" | "paper";

/**
 * The header floats over slabs that flip between ember, white and black.
 * Rather than tint the header, we read whichever slab is currently under it
 * and let it declare the ink colour via `data-tone`.
 *
 * The observer watches a 1px band sitting at the header's baseline.
 */
export function useChromeTone(offset = 72): Tone {
  const [tone, setTone] = useState<Tone>("ink");
  /* The header lives in the layout and survives route changes. Without the
     pathname in the deps the effect would keep measuring the *previous*
     route's detached slabs, and the header would sit ink-on-ink on any page
     reached by a client-side navigation. */
  const pathname = usePathname();

  useEffect(() => {
    let slabs: HTMLElement[] = [];

    const collect = () => {
      slabs = Array.from(document.querySelectorAll<HTMLElement>("[data-tone]"));
    };

    const read = () => {
      let current: Tone | null = null;
      for (const slab of slabs) {
        const r = slab.getBoundingClientRect();
        if (r.top <= offset && r.bottom > offset) {
          current = (slab.dataset.tone as Tone) ?? "ink";
        }
      }
      if (current) setTone(current);
    };

    collect();
    read();

    /* Slabs also appear late — a Suspense fallback swapping for the real
       booking flow, for instance — so watch for them rather than assuming
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

  return tone;
}
