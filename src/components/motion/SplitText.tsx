"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export type Segment = { text: string; italic?: boolean };

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Headline reveal. Every word sits in its own overflow-hidden mask and rises
 * from below on a stagger. Word-level (not line-level) so it survives any
 * wrap at any viewport without measuring anything.
 */
export function SplitText({
  segments,
  className = "",
  delay = 0,
  stagger = 0.045,
  duration = 1.05,
  as: Tag = "h2",
  once = true,
  animateOnMount = false,
}: {
  segments: Segment[];
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  once?: boolean;
  /** Hero copy animates on load; everything else waits for the scroll. */
  animateOnMount?: boolean;
}) {
  const words: { word: string; italic: boolean }[] = [];
  segments.forEach((seg) => {
    seg.text
      .split(/\s+/)
      .filter(Boolean)
      .forEach((word) => words.push({ word, italic: !!seg.italic }));
  });

  const trigger = animateOnMount
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport: { once, margin: "-12% 0px -12% 0px" } };

  return (
    <motion.div
      initial="hidden"
      {...trigger}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      className={className}
    >
      <Tag className="m-0">
        {words.map((w, i) => (
          <span
            key={`${w.word}-${i}`}
            className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]"
          >
            <motion.span
              className={`inline-block ${w.italic ? "italic" : ""}`}
              variants={{
                hidden: { y: "110%" },
                visible: { y: "0%" },
              }}
              transition={{ duration, ease: EASE }}
            >
              {w.word}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </Tag>
    </motion.div>
  );
}

/** Generic "rise into place" for anything that isn't a headline. */
export function Rise({
  children,
  className = "",
  delay = 0,
  y = 24,
  duration = 0.9,
  animateOnMount = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  animateOnMount?: boolean;
}) {
  const trigger = animateOnMount
    ? { animate: { opacity: 1, y: 0 } }
    : {
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-10% 0px -10% 0px" },
      };

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      {...trigger}
      transition={{ duration, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
