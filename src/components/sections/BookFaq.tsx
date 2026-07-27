"use client";

import { useId, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { faqs, locations, shop } from "@/lib/content";
import { SplitText, Rise } from "@/components/motion/SplitText";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * "Book now" is set to the exact width of the gutter-to-gutter column.
 * The headline measures 3.7375em wide in Bodoni Moda italic at the `.mega`
 * tracking, so dividing the container's inline size by 3.8 fills the line
 * edge to edge with roughly one percent of slack for the italic overhang.
 * Overriding `--text-mega` keeps the `.mega` utility intact; `cqw` is used
 * rather than `vw` so a desktop scrollbar can never push the line wide.
 */
const MEGA_FIT = { "--text-mega": "calc(100cqw / 3.8)" } as CSSProperties;
const MEGA_CONTAINER = { containerType: "inline-size" } as CSSProperties;

export function BookFaq() {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      data-tone="paper"
      className="relative bg-ink text-paper py-[clamp(5rem,11vw,12rem)]"
    >
      {/* ---------------------------------------------------------- book */}

      <Rise className="edge flex items-baseline justify-between gap-6">
        <span className="label text-paper/55">Booking</span>
        <a
          href={shop.phoneHref}
          className="label text-paper/55 transition-colors duration-500 hover:text-paper"
        >
          {shop.phone}
        </a>
      </Rise>

      <div className="edge mt-[clamp(2rem,4vw,3.5rem)]" style={MEGA_CONTAINER}>
        <div style={MEGA_FIT}>
          <SplitText
            as="h2"
            stagger={0.09}
            duration={1.15}
            className="mega whitespace-nowrap text-paper"
            segments={[{ text: "Book now", italic: true }]}
          />
        </div>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
          transition={{ duration: 1.4, delay: 0.25, ease: EASE }}
          className="mt-[clamp(1rem,1.6vw,2.5rem)] h-px w-full origin-left bg-white/20"
        />
      </div>

      <div className="edge mt-[clamp(3.5rem,8vw,8rem)] grid gap-y-16 md:grid-cols-12 md:gap-x-8">
        <Rise className="md:col-span-6">
          <Link
            href="/book"
            className="ease-[cubic-bezier(0.16,1,0.3,1)] flex aspect-square w-[clamp(11rem,16vw,13rem)] items-center justify-center rounded-full bg-ember text-ink transition-transform duration-700 hover:scale-[1.06] focus-visible:scale-[1.06]"
          >
            <span className="display max-w-[7ch] text-center text-[clamp(1.35rem,2.3vw,1.85rem)] italic">
              Book a chair
            </span>
          </Link>
        </Rise>

        <Rise
          delay={0.1}
          className="md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9"
        >
          <p className="note max-w-[40ch] text-paper/70">
            Booking online takes under a minute. Choose the room, the service and
            the barber, or leave the chair to us.
          </p>
          <p className="note mt-5 max-w-[40ch] text-paper/70">
            Pay now or settle at the end, whichever you prefer. Cancellation is
            free up to six hours before.
          </p>
        </Rise>
      </div>

      <div className="edge mt-[clamp(4rem,9vw,9rem)]">
        <div className="h-px w-full bg-white/20" />
        <div className="grid gap-y-10 pt-8 md:grid-cols-3 md:gap-x-8 md:pt-10">
          {locations.map((location, i) => (
            <Rise key={location.id} delay={i * 0.08}>
              <p className="display text-[clamp(1.5rem,2.6vw,2.4rem)] italic">
                {location.name}
              </p>
              <div className="mt-4 grid grid-cols-[10ch_1fr] gap-x-3">
                {location.hours.map((h) => (
                  <div key={h.days} className="contents">
                    <span className="label text-paper/45">{h.days}</span>
                    <span className="label text-paper/70">{h.time}</span>
                  </div>
                ))}
              </div>
            </Rise>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------- faq */}

      <div className="edge mt-[clamp(6rem,14vw,14rem)] md:grid md:grid-cols-12 md:gap-x-8">
        <Rise className="md:col-span-3 md:self-start md:sticky md:top-28">
          <p className="label text-paper/55">Questions</p>
          <p className="note mt-6 max-w-[24ch] text-paper/45">
            Anything else, write to us.
          </p>
          <a
            href={`mailto:${shop.email}`}
            className="note mt-2 inline-block text-paper/70 underline-offset-4 transition-colors duration-500 hover:text-paper hover:underline"
          >
            {shop.email}
          </a>
        </Rise>

        <ul className="mt-10 border-t border-white/20 md:col-span-9 md:mt-0">
          {faqs.map((faq, i) => (
            <FaqRow
              key={faq.q}
              baseId={baseId}
              index={i}
              question={faq.q}
              answer={faq.a}
              open={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

function FaqRow({
  baseId,
  index,
  question,
  answer,
  open,
  onToggle,
}: {
  baseId: string;
  index: number;
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  const buttonId = `${baseId}-q${index}`;
  const panelId = `${baseId}-a${index}`;

  return (
    <li className="border-b border-white/20">
      <h3 className="m-0">
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="group flex w-full items-start justify-between gap-5 py-7 text-left md:gap-12 md:py-9"
        >
          <span
            className={`display min-w-0 flex-1 text-lg transition-opacity duration-500 ${
              open ? "" : "group-hover:opacity-55"
            }`}
          >
            {question}
          </span>
          <span
            aria-hidden="true"
            className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/40 transition-colors duration-500 group-hover:border-white/80 md:mt-2"
          >
            <motion.span
              animate={{ rotate: open ? 45 : 0 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="block text-[0.95rem] leading-none"
            >
              +
            </motion.span>
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.55, ease: EASE },
              opacity: { duration: 0.45, ease: EASE },
            }}
            className="overflow-hidden"
          >
            <p className="note max-w-[60ch] pb-9 text-paper/65 md:pr-16">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
