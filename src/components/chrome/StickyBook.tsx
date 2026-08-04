"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BOOK_LABEL } from "@/lib/content";
import { useChromeSlab } from "./useChromeTone";
import { useChromeReveal } from "./useChromeReveal";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The bottom-right corner of a resting first screen belongs to whatever the
 * hero put there, so the pill waits until the reader has left the hero before
 * it arrives. Half a screen is far enough that it never flickers on a nudge.
 */
const ARRIVE = 0.5;

/**
 * Bottom-right, always reachable, never competing with the page. On hover the
 * label slides up and the brass arrives underneath it.
 *
 * It answers to the header's rule: away while you read forward, back the
 * moment you look for it, because a fixed pill parked over the last two lines
 * of a phone-width article is not "always reachable", it is in the way. The
 * nav carries «Записаться» for the whole time the pill is gone.
 *
 * It reads the slab under it the same way the header does: an ink pill on an
 * ink slab is a shadow with a word floating in it, which is what the bottom of
 * every page used to look like. Hover always resolves to brass on ink, so the
 * one interaction is identical whichever way the pill is drawn.
 */
export function StickyBook() {
  const pathname = usePathname();
  /* Negative: measured at the pill's own height off the bottom edge of the
     viewport rather than at the header's baseline. */
  const { tone } = useChromeSlab(-56);
  const { up } = useChromeReveal();
  const [past, setPast] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * ARRIVE);
    /* Deferred a frame: a reload restores the scroll position after mount. */
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  if (pathname === "/book") return null;

  const shown = past && up;
  const light = tone === "paper";

  return (
    <motion.div
      initial={false}
      animate={
        shown
          ? { opacity: 1, y: 0, scale: 1, pointerEvents: "auto" }
          : { opacity: 0, y: 24, scale: 0.94, pointerEvents: "none" }
      }
      transition={{ duration: 0.55, ease: EASE }}
      data-sticky-book=""
      /* The one permanently fixed thing on the site, parked in the corner an
         iPhone reserves for the home indicator and — with `viewport-fit=cover`
         — inside the region a sideways notch cuts out. Both offsets are
         `max()`ed against the live inset rather than added to it, so on a
         device with no cutout the pill sits exactly where it always did. */
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-50 md:bottom-[max(2rem,env(safe-area-inset-bottom))] md:right-[max(2rem,env(safe-area-inset-right))]"
    >
      <Link
        href="/book"
        tabIndex={shown ? undefined : -1}
        aria-hidden={shown ? undefined : true}
        className={`group relative flex h-14 items-center justify-center overflow-hidden rounded-full px-8 transition-colors duration-500 ease-out-expo md:h-16 md:px-10 ${
          light
            ? "bg-paper text-ink shadow-[0_10px_40px_-14px_rgba(240,234,224,0.3)]"
            : "bg-ink text-paper shadow-[0_10px_40px_-12px_rgba(20,18,16,0.75)]"
        }`}
      >
        <span className="absolute inset-0 translate-y-full bg-brass transition-transform duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
        <span className="ui relative z-10 block h-[14px] overflow-hidden leading-[14px]">
          <span className="block transition-transform duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[14px]">
            <span className="block h-[14px] whitespace-nowrap">{BOOK_LABEL}</span>
            <span className="block h-[14px] whitespace-nowrap text-ink">
              {BOOK_LABEL}
            </span>
          </span>
        </span>
      </Link>
    </motion.div>
  );
}
