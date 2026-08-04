"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { marqueeWords, services, shop } from "@/lib/content";
import { Rise, SplitText } from "@/components/motion/SplitText";
import { Marquee } from "@/components/motion/Marquee";
import { money } from "@/lib/words";

const EASE = [0.16, 1, 0.3, 1] as const;

/** The word that spans the slab, and how wide it draws. See TITLE_FILL. */
const TITLE = "Услуги";

/**
 * "Услуги" set in Playfair italic at the .mega tracking (-0.022em) measures
 * 2.427x its own font-size. Dividing the container's own inline size by that
 * lands the word flush against both gutters at every width, but only if the
 * container IS the gutter-to-gutter column, hence `containerType` on the .edge
 * div rather than on a full-bleed parent. cqw, not vw, keeps a desktop
 * scrollbar out of the sum. 2.46 rather than 2.427 leaves a hair of slack so
 * the italic overhang on the final "и" is never clipped.
 */
const TITLE_FILL = "calc(100cqw / 2.46)";

const PREVIEW_W = 320;
const PREVIEW_H = 420;

const altFor = (name: string) => `«${name}» в работе в «${shop.name}»`;

/**
 * The cursor preview is a mouse-only idea. Touch devices get thumbnails
 * instead and must never inherit a hover state they cannot leave.
 * Starts false so the server markup and the first client render agree.
 */
function usePointerFine() {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const read = () => setFine(mq.matches);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);

  return fine;
}

export function Services() {
  const fine = usePointerFine();
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [warm, setWarm] = useState(false);
  const reduced = useReducedMotion();

  const active = hovered ?? focused;
  const preview = fine && hovered !== null ? services[hovered] : null;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  /* The lag *is* the interaction: soft and heavy, so the image swims after
     the cursor and settles late. Flattened to a near-snap if motion is off. */
  const spring = useMemo(
    () =>
      reduced
        ? { stiffness: 1200, damping: 90, mass: 0.2 }
        : { stiffness: 110, damping: 20, mass: 0.9 },
    [reduced]
  );
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  return (
    <section
      data-tone="ink"
      className="relative bg-paper text-ink py-[clamp(5rem,11vw,12rem)]"
      onMouseEnter={fine ? () => setWarm(true) : undefined}
    >
      {/* ── the word ────────────────────────────────────────────── */}
      {/* No eyebrow, no count badge: the price range and the number of
          services are both legible from the list six inches below, and a
          caption that repeats the thing it captions is just more ink. */}
      <div>
        <div
          className="edge overflow-x-clip"
          style={{ containerType: "inline-size" }}
        >
          <div style={{ ["--text-mega" as string]: TITLE_FILL }}>
            <SplitText
              as="h2"
              duration={1.15}
              className="mega -ml-[0.015em] block"
              segments={[{ text: TITLE }]}
            />
          </div>
        </div>
      </div>

      {/* ── the list ────────────────────────────────────────────── */}
      <Rise
        delay={0.1}
        className="mt-[clamp(4rem,9vw,9rem)] border-b border-current/20"
      >
        <ul
          onMouseEnter={
            fine
              ? (e) => {
                  x.jump(e.clientX);
                  y.jump(e.clientY);
                  sx.jump(e.clientX);
                  sy.jump(e.clientY);
                }
              : undefined
          }
          onMouseMove={
            fine
              ? (e) => {
                  x.set(e.clientX);
                  y.set(e.clientY);
                }
              : undefined
          }
          onMouseLeave={fine ? () => setHovered(null) : undefined}
        >
          {services.map((service, i) => {
            const on = active === i;
            const dim = active !== null && !on;
            const shift =
              "transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] " +
              (on ? "translate-x-[clamp(0.5rem,1.2vw,1.25rem)]" : "translate-x-0");

            return (
              <li key={service.id} className="border-t border-current/20">
                <Link
                  href={`/services#${service.id}`}
                  onMouseEnter={fine ? () => setHovered(i) : undefined}
                  onFocus={() => setFocused(i)}
                  onBlur={() => setFocused(null)}
                  className={`edge grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-x-[clamp(0.85rem,2.5vw,2.5rem)] py-9 transition-[opacity,color] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:grid-cols-[5rem_minmax(0,1fr)_auto] md:py-[clamp(2.5rem,4vw,4rem)] lg:grid-cols-[7rem_minmax(0,1fr)_auto] lg:py-[clamp(3rem,4.6vw,5rem)] ${
                    on ? "text-brass-deep" : ""
                  } ${dim ? "opacity-[0.55]" : "opacity-100"}`}
                >
                  {/* mobile thumbnail: the cursor preview's stand-in.
                      alt="" on purpose: it is decorative here, and a real alt
                      made screen readers announce the service name twice
                      inside the same link. */}
                  <span className="col-start-1 row-start-1 block h-14 w-14 self-center overflow-hidden rounded-[10px] bg-ink/10 md:hidden">
                    <Image
                      src={service.image}
                      alt=""
                      width={112}
                      height={112}
                      sizes="56px"
                      className="h-full w-full object-cover"
                    />
                  </span>

                  {/* The minute count came off this row: it is on /services
                      against every one of these names, and here it was a third
                      number competing with the price for the same glance. */}
                  <span
                    className={`label col-start-2 row-start-1 hidden md:col-start-1 md:block ${shift}`}
                  >
                    {service.index}
                  </span>

                  <span
                    className={`display col-start-2 row-start-1 text-lg italic md:col-start-2 ${shift}`}
                  >
                    {service.name}
                  </span>

                  <span className="display col-start-3 row-start-1 text-right text-lg whitespace-nowrap md:col-start-3">
                    {money(service.price)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Rise>

      {/* ── marquee + link ──────────────────────────────────────── */}
      <Marquee duration={44} className="mt-[clamp(4rem,9vw,9rem)]">
        {marqueeWords.map((word) => (
          <span key={word} className="flex shrink-0 items-center">
            <span className="display text-xl italic whitespace-nowrap">
              {word}
            </span>
            <span className="mx-[clamp(1.25rem,3vw,3.25rem)] block h-2.5 w-2.5 shrink-0 rounded-full bg-brass lg:h-3.5 lg:w-3.5" />
          </span>
        ))}
      </Marquee>

      <div className="edge mt-[clamp(3rem,6vw,5rem)] flex justify-end">
        <Link
          href="/services"
          className="ui tap-reach group inline-flex items-center gap-3 border-b border-current/30 pb-2 transition-colors duration-300 hover:text-brass-deep"
        >
          Все услуги и цены
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>

      {/* ── the signature: a preview that lags behind the cursor ── */}
      {fine && (
        <motion.div
          aria-hidden="true"
          style={{ x: sx, y: sy }}
          className="pointer-events-none fixed left-0 top-0 z-30 hidden lg:block"
        >
          <div
            className="relative -translate-x-1/2 -translate-y-1/2"
            style={{ width: PREVIEW_W, height: PREVIEW_H }}
          >
            {/* warmed on first pointer entry so the first hover is instant */}
            {warm && (
              <div className="absolute inset-0 -z-10 overflow-hidden opacity-0">
                {services.map((s) => (
                  <Image
                    key={s.id}
                    src={s.image}
                    alt=""
                    width={PREVIEW_W}
                    height={PREVIEW_H}
                    sizes="320px"
                    /* stacked, not flowed; every one has to be on screen or
                       the browser will not bother fetching it */
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ))}
              </div>
            )}

            <AnimatePresence>
              {preview && (
                <motion.div
                  key={preview.id}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.55, ease: EASE }}
                  className="absolute inset-0 overflow-hidden rounded-[10px] bg-ink/10"
                >
                  <Image
                    src={preview.image}
                    alt={altFor(preview.name)}
                    fill
                    sizes="320px"
                    className="object-cover"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </section>
  );
}
