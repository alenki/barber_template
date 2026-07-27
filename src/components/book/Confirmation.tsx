"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { shop } from "@/lib/content";
import { SplitText, Rise } from "@/components/motion/SplitText";
import { Frame } from "@/components/motion/Frame";
import { clock, duration, money } from "./schedule";
import type { Details } from "./DetailsForm";

const EASE_CLASS = "ease-[cubic-bezier(0.16,1,0.3,1)]";

/**
 * "Held." set to the exact width of the column. The word draws roughly
 * 2.55em wide in Bodoni Moda italic at the `.mega` tracking, so dividing the
 * container's inline size by 2.6 fills the line edge to edge. Overriding the
 * token keeps the `.mega` utility itself intact, and `cqw` rather than `vw`
 * means a desktop scrollbar can never push the line wide.
 */
const MEGA_FIT = { "--text-mega": "calc(100cqw / 2.62)" } as CSSProperties;
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
  const slotWindow = `${clock(booking.start)} — ${clock(
    booking.start + booking.minutes
  )}`;

  const lines: { label: string; value: string }[] = [
    { label: "Room", value: booking.room },
    { label: "Address", value: booking.roomAddress },
    { label: "Service", value: booking.service },
    { label: "Chair", value: booking.chair },
    { label: "Day", value: booking.dateLabel },
    { label: "Hour", value: slotWindow },
    { label: "Name", value: booking.details.name },
    { label: "Email", value: booking.details.email },
    { label: "Phone", value: booking.details.phone },
  ];

  if (booking.details.note) {
    lines.push({ label: "Note", value: booking.details.note });
  }

  return (
    <div>
      <Rise animateOnMount className="border-t border-current/20 pt-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <span className="label">Reference {booking.reference}</span>
          <span className="label opacity-55">
            {booking.dateLabel} · {clock(booking.start)}
          </span>
        </div>
      </Rise>

      <div className="mt-[clamp(1.5rem,3vw,2.5rem)]" style={MEGA_CONTAINER}>
        <div style={MEGA_FIT}>
          <SplitText
            as="h2"
            animateOnMount
            stagger={0.08}
            duration={1.1}
            className="mega whitespace-nowrap"
            segments={[{ text: "Held." }]}
          />
        </div>
      </div>

      <div className="mt-[clamp(3rem,7vw,6rem)] grid grid-cols-1 gap-y-[clamp(3rem,6vw,5rem)] md:grid-cols-12 md:gap-x-[clamp(1.5rem,3vw,3.5rem)]">
        {/* ------------------------------------------------ the choices */}
        <Rise animateOnMount delay={0.15} className="md:col-span-7">
          <dl className="m-0 grid grid-cols-[7.5rem_1fr] gap-0 sm:grid-cols-[10rem_1fr]">
            {lines.map((line) => (
              <div key={line.label} className="contents">
                <dt className="label border-t border-current/15 py-4 opacity-55">
                  {line.label}
                </dt>
                <dd className="m-0 border-t border-current/15 py-4">
                  <span className="display block text-[clamp(1.05rem,1.7vw,1.5rem)] leading-tight italic">
                    {line.value}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-[clamp(2rem,4vw,3rem)] flex items-end justify-between gap-6 border-t border-current/20 pt-5">
            <div>
              <span className="label opacity-55">Total</span>
              <span className="display mt-2 block text-[clamp(2.25rem,5vw,4rem)] leading-none">
                {money(booking.price)}
              </span>
            </div>
            <div className="text-right">
              <span className="label opacity-55">In the chair</span>
              <span className="display mt-2 block text-[clamp(1.35rem,2.4vw,2rem)] leading-none italic">
                {duration(booking.minutes)}
              </span>
            </div>
          </div>

          <p className="label mt-4 opacity-55">
            Nothing charged now. Settle in the chair, card or cash.
          </p>
        </Rise>

        {/* -------------------------------------------------- the sticker */}
        <Rise
          animateOnMount
          delay={0.28}
          className="md:col-span-4 md:col-start-9"
        >
          <div className="flex size-[clamp(11rem,20vw,16rem)] flex-col items-center justify-center gap-2 rounded-full bg-ink text-ember">
            <span className="label opacity-60">Your reference</span>
            <span className="display text-[clamp(1.25rem,2.4vw,2rem)] italic">
              {booking.reference}
            </span>
          </div>

          <p className="note mt-[clamp(2rem,4vw,3rem)] max-w-[32ch] opacity-75">
            Quote it if you need to move the hour. Free to change up to six
            hours before; inside that, the chair was held for you and nobody
            else could have it.
          </p>

          <a
            href={shop.phoneHref}
            className="ui mt-6 inline-block border-b border-current/30 pb-1 transition-opacity duration-500 hover:opacity-60"
          >
            {shop.phone}
          </a>
        </Rise>
      </div>

      {/* ------------------------------------------------- where to go */}
      <div className="mt-[clamp(3rem,7vw,6rem)]">
        <Frame
          src={booking.roomImage}
          alt={`The ${booking.room} room at ${shop.name}, ${booking.roomAddress}`}
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
          <p className="note max-w-[46ch] opacity-70">
            This booking flow is a demonstration. No appointment has been made,
            no email has been sent, and nothing has been charged — the details
            above exist only in this browser tab. {shop.name} is a fictional
            shop in {shop.city}.
          </p>

          <div className="flex shrink-0 flex-wrap items-center gap-8">
            <button
              type="button"
              onClick={onRestart}
              className="ui group inline-flex items-center gap-3 border-b border-current/30 pb-2 transition-opacity duration-500 hover:opacity-60"
            >
              Book another
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
              Back to the shop
            </Link>
          </div>
        </div>
      </Rise>
    </div>
  );
}
