"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import type { PanInfo } from "motion/react";
import { rating, shop, testimonials } from "@/lib/content";
import { Rise } from "@/components/motion/SplitText";
import { Frame } from "@/components/motion/Frame";
import { decimal } from "@/lib/words";

const EASE = [0.16, 1, 0.3, 1] as const;

const RATING = decimal(rating);

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Client reviews as a two-up slider on an ink slab.
 * Grayscale portrait on the left, name in brass italic Bodoni on the right,
 * the quote underneath it with brass quotation marks. Arrows, drag and a
 * hairline progress rule all read the same index.
 *
 * Ink rather than paper: Chairs above it is already a paper slab, and two in a
 * row erase the boundary between them. It also gives the long scroll its one
 * dark beat before the closing slabs, and grayscale portraits want black.
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
  const draggable = maxIndex > 0;

  /* One slide is always exactly the viewport divided by however many we show. */
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    /* Two-up needs a real column for the quote, and at 768px the pair are 171px
       wide apiece. The split waits for the desktop breakpoint. */
    const mq = window.matchMedia("(min-width: 1024px)");
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
      data-tone="paper"
      aria-labelledby="testimonials-eyebrow"
      className="slab lamp bg-ink text-paper"
    >
      {/* Eyebrow, rating badge, arrows */}
      <div className="flex items-start justify-between gap-5">
        <Rise className="flex min-w-0 items-center gap-4 md:gap-6">
          <span
            aria-hidden="true"
            className="display flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brass italic text-[clamp(1.3rem,2.2vw,1.9rem)] text-ink md:h-20 md:w-20"
          >
            {RATING}
          </span>
          {/* The sub-line under this used to restate the rating that is
              already set in Bodoni inside the disc beside it, and count the
              reviews the position rule counts at the foot of the slab. */}
          <span id="testimonials-eyebrow" className="label">
            Что говорят
          </span>
        </Rise>

        <Rise delay={0.08} className="flex shrink-0 items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Предыдущий отзыв"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/30 leading-none transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] enabled:hover:border-paper enabled:hover:bg-paper enabled:hover:text-ink disabled:opacity-25 md:h-14 md:w-14"
          >
            <span aria-hidden="true" className="text-[1.05rem]">
              ←
            </span>
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            disabled={index >= maxIndex}
            aria-label="Следующий отзыв"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/30 leading-none transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] enabled:hover:border-paper enabled:hover:bg-paper enabled:hover:text-ink disabled:opacity-25 md:h-14 md:w-14"
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
        aria-label="Отзывы клиентов"
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
              aria-label={`Отзыв ${i + 1} из ${count}`}
              /* pl-[3px]: the next slide's box starts exactly on the clip
                 edge, and Playfair's « has enough left side bearing to draw a
                 pixel of brass outside it: a stray gold tick at the right
                 edge of every phone screenshot. */
              className="flex shrink-0 grow-0 basis-full flex-col gap-6 pr-[var(--gutter)] pl-[3px] lg:basis-1/2 lg:flex-row lg:items-start lg:gap-8"
            >
              <Frame
                src={t.image}
                alt={`Чёрно-белый портрет: ${t.name}, клиент «${shop.name}»`}
                sizes="(min-width: 1024px) 200px, 46vw"
                parallax={7}
                delay={i * 0.06}
                className="aspect-[3/4] w-[46%] max-w-[190px] shrink-0 grayscale lg:w-[clamp(120px,13vw,200px)] lg:max-w-none"
              />

              <div className="min-w-0 flex-1">
                <p className="display text-lg italic text-brass">{t.name}</p>
                <blockquote className="mt-4 md:mt-6">
                  <p className="text-md font-semibold leading-[1.35]">
                    <span aria-hidden="true" className="text-brass">
                      «
                    </span>
                    {t.quote}
                    <span aria-hidden="true" className="text-brass">
                      »
                    </span>
                  </p>
                </blockquote>
              </div>
            </article>
          ))}
        </motion.div>
      </div>

      {/* Position. Counted in reviews, not in pages: the eyebrow promises
          three of them, and a rule that read "01 / 02" left a reader looking
          for the one that had apparently gone missing. */}
      <Rise delay={0.1} className="mt-12 flex items-center gap-5 md:mt-16 md:gap-8">
        <span className="label shrink-0 tabular-nums">
          {perView > 1
            ? `${pad(index + 1)}-${pad(index + perView)}`
            : pad(index + 1)}{" "}
          / {pad(count)}
        </span>
        <span className="relative block h-px flex-1 bg-paper/20">
          <motion.span
            className="absolute inset-y-0 left-0 block bg-brass"
            style={{ width: `${(perView / count) * 100}%` }}
            animate={{ x: `${(index / perView) * 100}%` }}
            transition={reduce ? { duration: 0 } : { duration: 0.7, ease: EASE }}
          />
        </span>
      </Rise>

      <p aria-live="polite" className="sr-only">
        Показан отзыв {index + 1} из {count}
      </p>
    </section>
  );
}
