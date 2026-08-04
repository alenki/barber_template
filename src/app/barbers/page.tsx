import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { barbers, shop, type Barber } from "@/lib/content";
import { SplitText, Rise } from "@/components/motion/SplitText";
import { Frame } from "@/components/motion/Frame";
import { count, plural, spellNone, years as spellYears } from "@/lib/words";

export const metadata: Metadata = {
  title: "Кресла",
  description: `${count(
    barbers.length,
    "мастер",
    "мастера",
    "мастеров"
  )} «${shop.name}» ${shop.cityIn}: кто в каком кресле, кто в чём силён и как записаться к конкретному.`,
};

/* Everything below is derived from content.ts. Nothing is counted by hand and
   nothing is generated at render time, so the server and the client always
   agree on the same markup. */


/* "Кресло 06" when there are five; the one we are hiring for. */
const NEXT_CHAIR = String(barbers.length + 1).padStart(
  barbers[0].chair.length,
  "0"
);

/* The one line on the page that is not a name, a number or a bio. */
const APPROACH =
  "Кресло здесь не строчка в графике, а человек, который помнит форму вашей головы.";

const firstName = (name: string) => name.trim().split(/\s+/)[0];
const surname = (name: string) => name.trim().split(/\s+/).slice(1).join(" ");
const roleReadable = (role: string) => role.replace(" · ", ", ");

export default function BarbersPage() {
  return (
    <>
      {/* ── the espresso opener: one sentence, dropped a third of a screen ── */}
      <section data-tone="paper" className="relative lamp bg-espresso text-paper">
        <div className="edge pt-[30svh] pb-[clamp(4rem,9vw,9rem)]">
          <Rise className="border-t border-current/20 pt-4">
            <p className="label">
              {spellNone(barbers.length, "n")}{" "}
              {plural(barbers.length, "кресло", "кресла", "кресел")}
            </p>
          </Rise>

          {/* `text-hero` is a registered utility; never text-[var(--…)]. */}
          <SplitText
            as="h1"
            delay={0.12}
            className="display mt-[clamp(1.5rem,3vw,2.5rem)] max-w-[14ch] text-hero"
            segments={[
              { text: "Здесь никто не" },
              { text: "взаимозаменяем", italic: true },
            ]}
          />
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
      <section data-tone="paper" className="lamp bg-espresso text-paper">
        <div className="edge py-[clamp(5rem,11vw,12rem)]">
          <Rise className="ml-auto max-w-[34ch] border-t border-current/20 pt-5">
            <p className="label">Кресло {NEXT_CHAIR} · свободно</p>
            <p className="note mt-4">
              Мы берём людей раз в год, медленно и только через разговор. Если
              вы стрижёте так, будто последние два миллиметра имеют значение,
              напишите на{" "}
              <a
                href={`mailto:${shop.email}`}
                className="underline underline-offset-4 transition-colors duration-300 hover:text-paper"
              >
                {shop.email}
              </a>{" "}
              и расскажите, где учились.
            </p>
          </Rise>
        </div>
      </section>
    </>
  );
}

/**
 * A barber gets a whole screen. Portrait on the outer edge, everything else
 * held in a narrow column across the gap: odd chairs left, even chairs right,
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
                alt={`Портрет: ${barber.name}, ${roleReadable(
                  barber.role
                )}, у кресла ${barber.chair} в зале «${shop.name}»`}
                parallax={8}
                /* Chair 01 is the page's largest paint on a phone. */
                priority={index === 0}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="aspect-[4/5] w-full md:min-h-[70svh]"
                objectPosition="center 30%"
              />

              {/* The sticker: a brass disc on the outer corner of the photo,
                  alternating sides so five of them zig-zag down the page. */}
              <span
                aria-hidden="true"
                className={`absolute top-[clamp(0.85rem,1.8vw,1.75rem)] flex size-[clamp(2.75rem,5vw,4.5rem)] items-center justify-center rounded-full bg-brass text-ink ${
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
                <span className="label">Кресло {barber.chair}</span>
                <span className="label text-right text-ash">
                  {spellYears(barber.years)}
                </span>
              </Rise>

              {/* `text-xl` collides with a Tailwind default size key and drags
                  its stock leading in over `.display`'s .86, so restate it. */}
              <SplitText
                as="h2"
                delay={0.08}
                className="display mt-[clamp(1.25rem,2.5vw,2.25rem)] text-xl leading-[0.92]"
                segments={
                  last
                    ? [{ text: first }, { text: last, italic: true }]
                    : [{ text: first }]
                }
              />

              {/* Name, then the paragraph. The role, the years and the row of
                  speciality pills were four separate captions on one person,
                  and the paragraph says all of it in sentences. */}
              <Rise delay={0.22} className="mt-[clamp(1.75rem,3vw,2.75rem)]">
                <p className="max-w-[44ch] font-sans text-md leading-[1.42]">
                  {barber.bio}
                </p>
              </Rise>

              <Rise delay={0.34} className="mt-[clamp(2.5rem,5vw,4rem)]">
                <Link
                  href={`/book?barber=${barber.id}`}
                  className="ui tap-reach group inline-flex items-center gap-3 border-b border-current/30 pb-2 transition-colors duration-300 hover:text-brass-deep"
                >
                  {/* "Записаться к Артёму" would need the dative of a name
                      content.ts only carries in the nominative, and Russian
                      first names do not all bend the same way. The chair
                      number sidesteps the case entirely and is the metaphor
                      the whole page is built on. */}
                  Записаться в кресло {barber.chair}
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
    <section data-tone="paper" className="lamp bg-ink text-paper">
      <div className="edge py-[clamp(6rem,15vw,15rem)]">
        <SplitText
          as="p"
          className="display max-w-[20ch] text-xl leading-[0.95] md:ml-[28%]"
          segments={[{ text: APPROACH, italic: true }]}
        />
      </div>
    </section>
  );
}
