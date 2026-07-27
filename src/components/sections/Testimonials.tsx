"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import type { PanInfo } from "motion/react";
import { shop, testimonials } from "@/lib/content";
import { Rise } from "@/components/motion/SplitText";
import { Frame } from "@/components/motion/Frame";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Derived here rather than in content.ts: every review below is a five-star one. */
const RATING = "5.0";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Client reviews as a two-up slider on a paper slab.
 * Grayscale portrait on the left, name in ember italic Bodoni on the right,
 * the quote underneath it with ember quotation marks. Arrows, drag and a
 * hairline progress rule all read the same index.
 */
export function Testimonials() {
  const count = testimonials.length;

  const viewportRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const x = useMotionValue(0);
  const reduce = useReducedMotion();

  /* Mobile-first defaults so the server render and the first client render agree. */
  const [perView, setPerView] = useState(1);
  const [slideW, setSlideW] = useState(0);
  const [index, setIndex] = useState(0);

  const maxIndex = Math.max(0, count - perView);
  const pages = maxIndex + 1;
  const draggable = maxIndex > 0;

  /* One slide is always exactly the viewport divided by however many we show. */
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const mq = window.matchMedia("(min-width: 768px)");
    const measure = () => {
      const per = mq.matches ? 2 : 1;
      setPerView(per);
      setSlideW(el.clientWidth / per);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    mq.addEventListener("change", measure);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", measure);
    };
  }, []);

  /* Re-seat the track without animating whenever the measurements change. */
  useEffect(() => {
    const clamped = Math.min(indexRef.current, maxIndex);
    indexRef.current = clamped;
    setIndex(clamped);
    x.set(-clamped * slideW);
  }, [slideW, maxIndex, x]);

  const goTo = useCallback(
    (n: number) => {
      const clamped = Math.max(0, Math.min(n, maxIndex));
      indexRef.current = clamped;
      setIndex(clamped);
      animate(
        x,
        -clamped * slideW,
        reduce
          ? { duration: 0 }
          : { type: "spring", stiffness: 210, damping: 32, mass: 0.9 }
      );
    },
    [maxIndex, slideW, x, reduce]
  );

  const onDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = Math.max(44, slideW * 0.18);
    let next = indexRef.current;
    if (info.offset.x < -threshold || info.velocity.x < -520) next += 1;
    else if (info.offset.x > threshold || info.velocity.x > 520) next -= 1;
    goTo(next); /* always animates, so a short drag snaps back */
  };

  return (
    <section
      data-tone="ink"
      aria-labelledby="testimonials-eyebrow"
      className="slab bg-paper text-ink"
    >
      {/* Eyebrow, rating badge, arrows */}
      <div className="flex items-start justify-between gap-5">
        <Rise className="flex min-w-0 items-center gap-4 md:gap-6">
          <span
            aria-hidden="true"
            className="display flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ember italic text-[clamp(1.3rem,2.2vw,1.9rem)] text-ink md:h-20 md:w-20"
          >
            {RATING}
          </span>
          <span className="flex min-w-0 flex-col">
            <span id="testimonials-eyebrow" className="label">
              What people say
            </span>
            {/* Deliberately not "on Google": the shop is invented, and a
                template should not ship a fabricated third-party rating that
                a real barbershop might publish unchanged. */}
            <span className="label text-ash">
              {RATING} average · {count} reviews
            </span>
          </span>
        </Rise>

        <Rise delay={0.08} className="flex shrink-0 items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Previous review"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/25 leading-none transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] enabled:hover:border-ink enabled:hover:bg-ink enabled:hover:text-paper disabled:opacity-20 md:h-14 md:w-14"
          >
            <span aria-hidden="true" className="text-[1.05rem]">
              ←
            </span>
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            disabled={index >= maxIndex}
            aria-label="Next review"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/25 leading-none transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] enabled:hover:border-ink enabled:hover:bg-ink enabled:hover:text-paper disabled:opacity-20 md:h-14 md:w-14"
          >
            <span aria-hidden="true" className="text-[1.05rem]">
              →
            </span>
          </button>
        </Rise>
      </div>

      {/* Track */}
      <div
        ref={viewportRef}
        className="mt-16 overflow-hidden md:mt-28"
        role="group"
        aria-roledescription="carousel"
        aria-label="Client reviews"
      >
        <motion.div
          style={{ x }}
          drag={draggable ? "x" : false}
          dragConstraints={{ left: -maxIndex * slideW, right: 0 }}
          dragElastic={0.08}
          dragMomentum={false}
          onDragEnd={onDragEnd}
          className={`flex items-start ${draggable ? "cursor-grab active:cursor-grabbing" : ""}`}
        >
          {testimonials.map((t, i) => (
            <article
              key={t.name}
              role="group"
              aria-roledescription="slide"
              aria-label={`Review ${i + 1} of ${count}`}
              className="flex shrink-0 grow-0 basis-full flex-col gap-6 pr-[var(--gutter)] md:basis-1/2 md:flex-row md:items-start md:gap-8"
            >
              <Frame
                src={t.image}
                alt={`Black and white portrait of ${t.name}, a client of ${shop.name}`}
                sizes="(min-width: 768px) 200px, 46vw"
                parallax={7}
                delay={i * 0.06}
                className="aspect-[3/4] w-[46%] max-w-[190px] shrink-0 grayscale md:w-[clamp(120px,13vw,200px)] md:max-w-none"
              />

              <div className="min-w-0 flex-1">
                <p className="display text-lg italic text-ember">{t.name}</p>
                <blockquote className="mt-4 md:mt-6">
                  <p className="text-md font-semibold leading-[1.35]">
                    <span aria-hidden="true" className="text-ember">
                      “
                    </span>
                    {t.quote}
                    <span aria-hidden="true" className="text-ember">
                      ”
                    </span>
                  </p>
                </blockquote>
              </div>
            </article>
          ))}
        </motion.div>
      </div>

      {/* Position */}
      <Rise delay={0.1} className="mt-12 flex items-center gap-5 md:mt-16 md:gap-8">
        <span className="label shrink-0 tabular-nums">
          {pad(index + 1)} / {pad(pages)}
        </span>
        <span className="relative block h-px flex-1 bg-ink/15">
          <motion.span
            className="absolute inset-y-0 left-0 block bg-ember"
            style={{ width: `${100 / pages}%` }}
            animate={{ x: `${index * 100}%` }}
            transition={reduce ? { duration: 0 } : { duration: 0.7, ease: EASE }}
          />
        </span>
      </Rise>

      <p aria-live="polite" className="sr-only">
        Showing review {index + 1} of {count}
      </p>
    </section>
  );
}
