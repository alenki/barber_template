import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { barbers, shop, type Barber } from "@/lib/content";
import { SplitText, Rise } from "@/components/motion/SplitText";
import { Frame } from "@/components/motion/Frame";

export const metadata: Metadata = {
  title: "The Chairs",
  description: `The ${barbers.length} barbers at ${shop.name} in ${shop.city} — who sits in which chair, what they are best at, and how to book them by name.`,
};

/* Everything below is derived from content.ts. Nothing is counted by hand and
   nothing is generated at render time, so the server and the client always
   agree on the same markup. */

const COUNT_WORDS = [
  "No",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
];

const countWord = (n: number) => COUNT_WORDS[n] ?? String(n);

const TOTAL_YEARS = barbers.reduce((sum, b) => sum + b.years, 0);
const FIRST_CHAIR = barbers[0].chair;
const LAST_CHAIR = barbers[barbers.length - 1].chair;
/* "Chair 06" when there are five — the one we are hiring for. */
const NEXT_CHAIR = String(barbers.length + 1).padStart(FIRST_CHAIR.length, "0");

/* The one line on the page that is not a name, a number or a bio. */
const APPROACH =
  "A chair here is not a slot in a rota — it is one person who remembers the shape of your head.";

const firstName = (name: string) => name.trim().split(/\s+/)[0];
const surname = (name: string) => name.trim().split(/\s+/).slice(1).join(" ");
const roleReadable = (role: string) => role.replace(" · ", " and ");

export default function BarbersPage() {
  return (
    <>
      {/* ── the ember opener: one sentence, dropped a third of a screen ── */}
      <section data-tone="ink" className="relative bg-ember text-ink">
        <div className="edge pt-[30svh] pb-[clamp(4rem,9vw,9rem)]">
          <Rise>
            <p className="label">{countWord(barbers.length)} chairs</p>
          </Rise>

          {/* `text-hero` is a registered utility — never text-[var(--…)]. */}
          <SplitText
            as="h1"
            delay={0.12}
            className="display mt-[clamp(1.5rem,3vw,2.5rem)] max-w-[13ch] text-hero"
            segments={[
              { text: "Nobody here is" },
              { text: "interchangeable", italic: true },
            ]}
          />

          <Rise
            delay={0.3}
            className="mt-[clamp(4rem,12vw,9rem)] flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2 border-t border-current/20 pt-4"
          >
            <span className="label">
              Chairs {FIRST_CHAIR} — {LAST_CHAIR}
            </span>
            <span className="label">{TOTAL_YEARS} years between them</span>
            <span className="label">{shop.city}</span>
          </Rise>
        </div>
      </section>

      {/* ── one paper slab per barber, portrait sides alternating ── */}
      {barbers.map((barber, i) => (
        <Chair key={barber.id} barber={barber} index={i}>
          {/* The rhythm break lands after the third chair. */}
          {i === 2 ? <Approach /> : null}
        </Chair>
      ))}

      {/* ── the sixth chair ── */}
      <section data-tone="ink" className="bg-ember text-ink">
        <div className="edge py-[clamp(5rem,11vw,12rem)]">
          <Rise className="ml-auto max-w-[34ch] border-t border-current/20 pt-5">
            <p className="label">Chair {NEXT_CHAIR} — unclaimed</p>
            <p className="note mt-4">
              We hire once a year, slowly, and only ever by conversation. If you
              cut hair like the last two millimetres matter, write to{" "}
              <a
                href={`mailto:${shop.email}`}
                className="underline underline-offset-4 transition-colors duration-300 hover:text-paper"
              >
                {shop.email}
              </a>{" "}
              and tell us where you learned.
            </p>
          </Rise>
        </div>
      </section>
    </>
  );
}

/**
 * A barber gets a whole screen. Portrait on the outer edge, everything else
 * held in a narrow column across the gap — odd chairs left, even chairs right,
 * so the eye walks down the page instead of marching.
 *
 * `children` is the slab that follows this one, kept inside the map so the
 * ink break can sit between two chairs without duplicating the list.
 */
function Chair({
  barber,
  index,
  children,
}: {
  barber: Barber;
  index: number;
  children?: ReactNode;
}) {
  const portraitLeft = index % 2 === 0;
  const first = firstName(barber.name);
  const last = surname(barber.name);

  return (
    <>
      <section
        id={barber.id}
        data-tone="ink"
        className="scroll-mt-28 bg-paper text-ink"
      >
        <div className="edge py-[clamp(4.5rem,10vw,10rem)]">
          <div className="grid grid-cols-1 gap-y-10 md:grid-cols-12 md:items-stretch md:gap-x-[clamp(1.5rem,3vw,3.5rem)] md:gap-y-0">
            {/* ── portrait ──
                `md:row-start-1` on both children is load-bearing: the portrait
                comes first in the DOM, so when it is placed on the right the
                text column's earlier column-start would otherwise auto-place
                it on a second row and drop it under the photograph. */}
            <div
              className={
                portraitLeft
                  ? "relative md:col-span-6 md:col-start-1 md:row-start-1"
                  : "relative md:col-span-6 md:col-start-7 md:row-start-1"
              }
            >
              <Frame
                src={barber.image}
                alt={`Portrait of ${barber.name}, ${roleReadable(
                  barber.role
                )}, at chair ${barber.chair} in the ${shop.name} shop`}
                parallax={8}
                /* Chair 01 is the page's largest paint on a phone. */
                priority={index === 0}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="aspect-[4/5] w-full md:min-h-[70svh]"
                objectPosition="center 30%"
              />

              {/* The sticker: an ember disc on the outer corner of the photo,
                  alternating sides so five of them zig-zag down the page. */}
              <span
                aria-hidden="true"
                className={`absolute top-[clamp(0.85rem,1.8vw,1.75rem)] flex size-[clamp(2.75rem,5vw,4.5rem)] items-center justify-center rounded-full bg-ember text-ink ${
                  portraitLeft
                    ? "left-[clamp(0.85rem,1.8vw,1.75rem)]"
                    : "right-[clamp(0.85rem,1.8vw,1.75rem)]"
                }`}
              >
                <span className="display text-[clamp(1rem,1.9vw,1.6rem)] italic">
                  {barber.chair}
                </span>
              </span>
            </div>

            {/* ── everything you can read ── */}
            <div
              className={`flex flex-col ${
                portraitLeft
                  ? "md:col-span-5 md:col-start-8 md:row-start-1 md:justify-end md:pb-[clamp(1.5rem,4vw,4rem)]"
                  : "md:col-span-5 md:col-start-1 md:row-start-1 md:justify-start md:pt-[clamp(1.5rem,4vw,4rem)]"
              }`}
            >
              <Rise className="flex items-baseline justify-between gap-4 border-t border-current/20 pt-4">
                <span className="label">Chair {barber.chair}</span>
                <span className="label text-right text-ash">{barber.role}</span>
              </Rise>

              {/* `text-xl` collides with a Tailwind default size key and drags
                  its stock leading in over `.display`'s .86 — restate it. */}
              <SplitText
                as="h2"
                delay={0.08}
                className="display mt-[clamp(1.25rem,2.5vw,2.25rem)] text-xl leading-[0.86]"
                segments={
                  last
                    ? [{ text: first }, { text: last, italic: true }]
                    : [{ text: first }]
                }
              />

              <Rise delay={0.16} className="mt-4">
                <p className="label text-ash">
                  {barber.years} years behind the chair
                </p>
              </Rise>

              <Rise delay={0.22} className="mt-[clamp(1.75rem,3vw,2.75rem)]">
                <p className="max-w-[44ch] font-sans text-md leading-[1.42]">
                  {barber.bio}
                </p>
              </Rise>

              <Rise delay={0.28} className="mt-[clamp(1.75rem,3vw,2.5rem)]">
                <ul className="flex flex-wrap gap-2">
                  {barber.specialties.map((s) => (
                    <li
                      key={s}
                      className="label rounded-full border border-current/25 px-3 py-1"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </Rise>

              <Rise delay={0.34} className="mt-[clamp(2.5rem,5vw,4rem)]">
                <Link
                  href={`/book?barber=${barber.id}`}
                  className="ui group inline-flex items-center gap-3 border-b border-current/30 pb-2 transition-colors duration-300 hover:text-ember"
                >
                  Book with {first}
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </Rise>
            </div>
          </div>
        </div>
      </section>

      {children}
    </>
  );
}

/** The break in the rhythm: black, one italic line, nothing else on it. */
function Approach() {
  return (
    <section data-tone="paper" className="bg-ink text-paper">
      <div className="edge py-[clamp(6rem,15vw,15rem)]">
        <SplitText
          as="p"
          className="display max-w-[20ch] text-xl leading-[0.9] md:ml-[28%]"
          segments={[{ text: APPROACH, italic: true }]}
        />
      </div>
    </section>
  );
}
