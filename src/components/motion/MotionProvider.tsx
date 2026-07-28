"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * The CSS `prefers-reduced-motion` block in globals.css only zeroes CSS
 * animations. Motion writes inline transforms, which that rule cannot touch,
 * so every SplitText mask and Rise kept running for users who had asked for
 * stillness. `reducedMotion="user"` drops transform and layout animation for
 * those users while leaving opacity crossfades intact.
 *
 * It does not cover scroll-driven transforms, which are not animations at all:
 * `Frame` reads the preference itself and flattens its own parallax.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
