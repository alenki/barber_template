"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    const slabs = Array.from(
      document.querySelectorAll<HTMLElement>("[data-tone]")
    );
    if (!slabs.length) return;

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

    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [offset]);

  return tone;
}
