"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The one element that never leaves. Bottom-right, always reachable,
 * never competing with the page. On hover the label slides up and the
 * ember arrives underneath it.
 */
export function StickyBook() {
  const pathname = usePathname();
  if (pathname === "/book") return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 1.1, ease: EASE }}
      className="fixed bottom-5 right-5 z-50 md:bottom-8 md:right-8"
    >
      <Link
        href="/book"
        className="group relative flex h-14 items-center justify-center overflow-hidden rounded-full bg-ink px-8 text-paper shadow-[0_10px_40px_-12px_rgba(10,9,8,0.7)] md:h-16 md:px-10"
      >
        <span className="absolute inset-0 translate-y-full bg-ember transition-transform duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
        <span className="ui relative z-10 block h-[14px] overflow-hidden leading-[14px]">
          <span className="block transition-transform duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[14px]">
            <span className="block h-[14px] whitespace-nowrap">Book now</span>
            <span className="block h-[14px] whitespace-nowrap text-ink">Book now</span>
          </span>
        </span>
      </Link>
    </motion.div>
  );
}
