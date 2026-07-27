"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The image block. Wipes open from the bottom edge while the photograph
 * itself drifts against the wipe — the two-speed reveal that makes a still
 * feel like footage.
 */
export function Frame({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "100vw",
  parallax = 12,
  delay = 0,
  animateOnMount = false,
  rounded = true,
  objectPosition,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** Vertical drift in percent across the full scroll of the element. */
  parallax?: number;
  delay?: number;
  animateOnMount?: boolean;
  rounded?: boolean;
  objectPosition?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`-${parallax}%`, `${parallax}%`]);

  const trigger = animateOnMount
    ? { animate: { clipPath: "inset(0% 0% 0% 0%)" } }
    : {
        whileInView: { clipPath: "inset(0% 0% 0% 0%)" },
        viewport: { once: true, margin: "-8% 0px -8% 0px" },
      };

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
      {...trigger}
      transition={{ duration: 1.25, delay, ease: EASE }}
      className={`relative overflow-hidden bg-ink/10 ${rounded ? "rounded-[10px]" : ""} ${className}`}
    >
      <motion.div style={{ y }} className="absolute inset-[-14%_0]">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
          style={objectPosition ? { objectPosition } : undefined}
        />
      </motion.div>
    </motion.div>
  );
}
