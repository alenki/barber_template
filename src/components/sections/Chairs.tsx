"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { barbers, locations, shop, type Barber } from "@/lib/content";
import { SplitText, Rise } from "@/components/motion/SplitText";
import { Frame } from "@/components/motion/Frame";
import { count, years as spellYears } from "@/lib/words";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The composition. A tidy five-up would read as a team page; this is a poster.
 * Each chair gets its own span and its own drop so the eye falls diagonally
 * across the slab. Index-matched to `barbers`; below md it is all ignored and
 * the cards stack into one clean column.
 */
const PLACEMENT = [
  "md:col-start-1 md:col-span-5",
  "md:col-start-9 md:col-span-4 md:mt-[9rem] lg:mt-[15rem]",
  "md:col-start-2 md:col-span-4",
  "md:col-start-8 md:col-span-5 md:mt-[7rem] lg:mt-[11rem]",
  "md:col-start-3 md:col-span-5",
];

/* "Кресла" sets 2.487em wide in Playfair italic at the mega tracking, so these
   are the sizes that run it flush to both gutters on one line. The gutter is
   itself clamped, which is why the ratio changes at md — below 500px it is a
   flat 1.25rem and the line would otherwise overrun a 375px screen. */
const MEGA = "text-[clamp(3.25rem,35vw,40rem)] md:text-[clamp(10rem,36.8vw,44rem)]";

export function Chairs() {
  const years = barbers.reduce((total, b) => total + b.years, 0);
  const first = barbers[0].chair;
  const last = barbers[barbers.length - 1].chair;

  return (
    <section data-tone="ink" className="slab bg-paper text-ink">
      <div className="flex items-center justify-between gap-6 border-t border-current/20 pt-4">
        <span className="label">
          Кресла {first} — {last}
        </span>
        <span
          className="display flex size-[clamp(2.6rem,4.6vw,4.75rem)] shrink-0 items-center justify-center rounded-full bg-ember text-[clamp(1.1rem,2vw,2.1rem)] text-ink italic"
          aria-hidden="true"
        >
          {barbers.length}
        </span>
      </div>

      <SplitText
        as="h2"
        className={`mega ${MEGA} mt-6 md:mt-10`}
        segments={[{ text: "Кресла" }]}
      />

      <Rise className="mt-8 flex justify-end md:mt-12" delay={0.15}>
        <p className="note max-w-[30ch] text-ash md:text-right">
          {spellYears(years)} опыта, {count(barbers.length, "кресло", "кресла", "кресел")} и{" "}
          {count(locations.length, "зал", "зала", "залов")} {shop.cityIn}.
        </p>
      </Rise>

      <div className="mt-20 grid grid-cols-1 gap-x-6 gap-y-20 md:mt-28 md:grid-cols-12 md:gap-y-20 lg:gap-x-8">
        {barbers.map((barber, i) => (
          <Chair
            key={barber.id}
            barber={barber}
            place={PLACEMENT[i % PLACEMENT.length]}
          />
        ))}
      </div>
    </section>
  );
}

function Chair({ barber, place }: { barber: Barber; place: string }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial="rest"
      animate={open ? "open" : "rest"}
      className={place}
    >
      <Link
        href={`/barbers#${barber.id}`}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="block rounded-[10px]"
      >
        <div className="flex items-baseline justify-between gap-4 border-t border-current/20 pt-3 pb-4">
          <span className="label">Кресло {barber.chair}</span>
          <span className="label text-ash">{spellYears(barber.years)}</span>
        </div>

        <div className="relative overflow-hidden rounded-[10px]">
          <Frame
            src={barber.image}
            alt={`Портрет: ${barber.name}, ${barber.role.replace(
              " · ",
              ", "
            )}, в зале «${shop.name}»`}
            parallax={7}
            sizes="(min-width: 1024px) 42vw, (min-width: 768px) 45vw, 100vw"
            className="aspect-[4/5] w-full"
            objectPosition="center 30%"
          />

          {/* aria-hidden: this panel is a hover-only teaser that a touch user
              never sees, and leaving it in the tree gave the card link a
              250-character accessible name. The full bio lives on /barbers,
              which is exactly where the link goes. */}
          <motion.div
            aria-hidden="true"
            variants={{ rest: { y: "101%" }, open: { y: "0%" } }}
            transition={{ duration: 0.8, ease: EASE }}
            className="absolute inset-x-0 bottom-0 z-10 min-h-[34%] bg-ink px-5 pt-5 pb-6 text-paper"
          >
            <p className="font-typewriter text-[0.78rem] leading-[1.6] tracking-[0.02em]">
              {barber.bio}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {barber.specialties.map((s) => (
                <li
                  key={s}
                  className="label rounded-full border border-paper/30 px-3 py-1"
                >
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <h3 className="display mt-5 text-lg italic">
          {barber.name}
          <span className="ml-3 inline-flex size-[1.75rem] items-center justify-center rounded-full bg-ember align-middle text-ink not-italic md:size-[2rem]">
            <motion.span
              variants={{ rest: { rotate: 0 }, open: { rotate: 45 } }}
              transition={{ duration: 0.7, ease: EASE }}
              className="ui block leading-none"
              aria-hidden="true"
            >
              +
            </motion.span>
          </span>
        </h3>

        <p className="label mt-2 text-ash">{barber.role}</p>
      </Link>
    </motion.div>
  );
}
