"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { shop } from "@/lib/content";
import { SplitText, Rise } from "@/components/motion/SplitText";
import { Frame } from "@/components/motion/Frame";
import { clock, money } from "./schedule";
import type { Details } from "./DetailsForm";

const EASE_CLASS = "ease-[cubic-bezier(0.16,1,0.3,1)]";

/**
 * "Готово." set to the exact width of the column. The word draws roughly
 * 2.833em wide in Playfair italic at the `.mega` tracking, so dividing the
 * container's inline size by 2.87 fills the line edge to edge. Overriding the
 * token keeps the `.mega` utility itself intact, and `cqw` rather than `vw`
 * means a desktop scrollbar can never push the line wide.
 */
const MEGA_FIT = { "--text-mega": "calc(100cqw / 2.87)" } as CSSProperties;
const MEGA_CONTAINER = { containerType: "inline-size" } as CSSProperties;

export type Booking = {
  room: string;
  roomAddress: string;
  roomImage: string;
  service: string;
  chair: string;
  dateLabel: string;
  start: number;
  price: number;
  minutes: number;
  reference: string;
  details: Details;
};

export function Confirmation({
  booking,
  onRestart,
}: {
  booking: Booking;
  onRestart: () => void;
}) {
  /**
   * Six lines, not ten. The email and telephone number were typed thirty
   * seconds ago on the screen before this one, and reciting them back is not
   * confirmation, it is filler.
   */
  const lines: { label: string; value: string }[] = [
    { label: "Услуга", value: booking.service },
    { label: "Кресло", value: booking.chair },
    {
      label: "Когда",
      value: `${booking.dateLabel}, ${clock(booking.start)}`,
    },
    { label: "Зал", value: booking.room },
    { label: "Адрес", value: booking.roomAddress },
    { label: "Имя", value: booking.details.name },
  ];

  return (
    <div>
      <div style={MEGA_CONTAINER}>
        <div style={MEGA_FIT}>
          <SplitText
            as="h2"
            animateOnMount
            stagger={0.08}
            duration={1.1}
            className="mega whitespace-nowrap"
            segments={[{ text: "Готово." }]}
          />
        </div>
      </div>

      <div className="mt-[clamp(3rem,7vw,6rem)] grid grid-cols-1 gap-y-[clamp(3rem,6vw,5rem)] md:grid-cols-12 md:gap-x-[clamp(1.5rem,3vw,3.5rem)]">
        {/* ------------------------------------------------ the choices */}
        <Rise animateOnMount delay={0.15} className="md:col-span-7">
          <dl className="m-0 grid grid-cols-[7.5rem_1fr] gap-0 sm:grid-cols-[10rem_1fr]">
            {lines.map((line) => (
              <div key={line.label} className="contents">
                <dt className="label py-3 opacity-75">{line.label}</dt>
                {/* min-w-0 + break-words: a long unbroken value sets the
                    1fr track's min-content width and pushed the whole grid
                    16px past a 375px viewport, where body{overflow-x:hidden}
                    then made the text unrecoverable. */}
                <dd className="m-0 min-w-0 py-3">
                  <span className="display block [overflow-wrap:anywhere] text-[clamp(1.05rem,1.7vw,1.5rem)] leading-tight italic">
                    {line.value}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-[clamp(2rem,4vw,3rem)] flex items-baseline justify-between gap-6 border-t border-current/20 pt-5">
            <span className="label opacity-75">Итого</span>
            <span className="display text-[clamp(2rem,4.5vw,3.5rem)] leading-none whitespace-nowrap">
              {money(booking.price)}
            </span>
          </div>
        </Rise>

        {/* -------------------------------------------------- the sticker */}
        <Rise
          animateOnMount
          delay={0.28}
          className="md:col-span-4 md:col-start-9"
        >
          <div className="flex size-[clamp(11rem,20vw,16rem)] flex-col items-center justify-center gap-2 rounded-full bg-brass text-ink">
            <span className="label opacity-75">Номер брони</span>
            <span className="display text-[clamp(1.25rem,2.4vw,2rem)] italic">
              {booking.reference}
            </span>
          </div>

          <a
            href={shop.phoneHref}
            className="ui mt-[clamp(2rem,4vw,3rem)] inline-block border-b border-current/30 pb-1 transition-opacity duration-500 hover:opacity-60"
          >
            {shop.phone}
          </a>
        </Rise>
      </div>

      {/* ------------------------------------------------- where to go */}
      <div className="mt-[clamp(3rem,7vw,6rem)]">
        <Frame
          src={booking.roomImage}
          alt={`Зал «${booking.room}» в «${shop.name}», ${booking.roomAddress}`}
          animateOnMount
          delay={0.35}
          parallax={6}
          sizes="100vw"
          className="h-[clamp(13rem,36svh,26rem)] w-full"
          objectPosition="center 45%"
        />
      </div>

      {/* ------------------------------------------------------ the truth */}
      <Rise
        animateOnMount
        delay={0.4}
        className="mt-[clamp(2.5rem,5vw,4rem)] border-t border-current/20 pt-5"
      >
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-16">
          <p className="note max-w-[44ch] opacity-75">
            Это демонстрация: запись не создана, барбершоп «{shop.name}»
            вымышленный.
          </p>

          <div className="flex shrink-0 flex-wrap items-center gap-8">
            <button
              type="button"
              onClick={onRestart}
              className="ui tap-reach group inline-flex items-center gap-3 border-b border-current/30 pb-2 transition-opacity duration-500 hover:opacity-60"
            >
              Записаться ещё
              <span
                aria-hidden="true"
                className={`inline-block transition-transform duration-500 ${EASE_CLASS} group-hover:translate-x-1`}
              >
                →
              </span>
            </button>
            <Link
              href="/"
              className="ui border-b border-current/30 pb-2 transition-opacity duration-500 hover:opacity-60"
            >
              На главную
            </Link>
          </div>
        </div>
      </Rise>
    </div>
  );
}
