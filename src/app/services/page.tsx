import type { Metadata } from "next";
import Link from "next/link";
import { services, combos, shop, type Service } from "@/lib/content";
import { SplitText, Rise } from "@/components/motion/SplitText";
import { Frame } from "@/components/motion/Frame";

/* ------------------------------------------------------------------
   Derived locally — content.ts owns the words, this file owns the maths.
   Everything here is pure and deterministic: same output on the server
   and the client, no dates, no randomness.
   ------------------------------------------------------------------ */

const COUNT_WORDS = [
  "Zero",
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
] as const;

function spell(n: number) {
  return COUNT_WORDS[n] ?? String(n);
}

const prices = [...services.map((s) => s.price), ...combos.map((c) => c.price)];
const minutes = [...services.map((s) => s.minutes), ...combos.map((c) => c.minutes)];

const LOW = Math.min(...prices);
const HIGH = Math.max(...prices);
const SHORTEST = Math.min(...minutes);
const LONGEST = Math.max(...minutes);

const money = (n: number) => `$${n}`;

/**
 * Alt text for the six service photographs. content.ts carries the paths,
 * not the descriptions, so the descriptions live here — one real sentence
 * per photograph, never "image of".
 */
const ALT: Record<string, string> = {
  "signature-cut":
    "A barber cutting scissor-over-comb, a section of hair held between two fingers above the ear",
  "skin-fade":
    "A clipper worked up the nape of a client's neck, the shortest section blended away to nothing",
  "beard-sculpt":
    "A straight razor drawing the cheek line of a full beard, the edge held flat to the skin",
  "hot-towel-shave":
    "A steaming towel folded over a reclined client's jaw before the first pass of the razor",
  "wash-and-style":
    "A client's head tipped back into the basin, lather worked through the hair under running water",
  "le-petit":
    "A young client sitting straight in the barber chair, cape fastened, watching himself in the mirror",
};

const altFor = (s: Service) => ALT[s.id] ?? `${s.name} at ${shop.name}`;

/**
 * The four notes on the ink slab. House voice: flat, unapologetic, a little
 * dry. Written here because they are policy, not catalogue.
 */
const POLICIES = [
  {
    n: "01",
    title: "Cancellation",
    body: "Free to move or cancel up to six hours before. Inside six hours, or a no-show, we charge fifty percent of the service. The chair was held for you and nobody else could have it.",
  },
  {
    n: "02",
    title: "Walk-ins",
    body: "Always welcome, chair permitting. A booking guarantees you a barber and a time. A walk-in gets whoever is free, which on a Saturday afternoon may be nobody.",
  },
  {
    n: "03",
    title: "Payment",
    body: "Card, tap or cash. Pre-pay online or settle in the chair — you choose at the last step. Tips are never expected and always noticed.",
  },
  {
    n: "04",
    title: "Lateness",
    body: "After fifteen minutes we may need to shorten the service or move the appointment. Call us before you arrive. Traffic on Saint-Denis is nobody's fault.",
  },
] as const;

/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: "Services",
  description: `Every service at ${shop.name} in ${shop.city}, in full: ${spell(
    services.length
  ).toLowerCase()} services and ${spell(
    combos.length
  ).toLowerCase()} combinations, from ${money(LOW)}. Cuts, skin fades, beard sculpts and hot towel shaves, with the duration and the price of each.`,
};

export default function ServicesPage() {
  return (
    <>
      {/* ---------------- Ember: the title ---------------- */}
      <section data-tone="ink" className="relative bg-ember text-ink">
        <div className="edge pt-[32svh] pb-[clamp(5rem,11vw,12rem)] md:pt-[36svh]">
          <Rise className="border-t border-current/20 pt-4">
            <p className="label">Services &amp; prices</p>
          </Rise>

          <SplitText
            as="h1"
            className="display mt-8 max-w-[14ch] text-hero md:mt-12"
            segments={[
              { text: `${spell(services.length)} services.` },
              { text: "One of them is yours.", italic: true },
            ]}
          />

          <Rise
            delay={0.2}
            className="mt-[14svh] flex flex-wrap items-baseline gap-x-10 gap-y-2 border-t border-current/20 pt-5 md:mt-[20svh]"
          >
            <span className="label">{services.length} services</span>
            <span className="label">{combos.length} combinations</span>
            <span className="label">
              {money(LOW)} — {money(HIGH)}
            </span>
            <span className="label">
              {SHORTEST} — {LONGEST} minutes
            </span>
          </Rise>

          <Rise delay={0.3} className="mt-10 flex md:mt-14 md:justify-end">
            <p className="note max-w-[32ch] md:text-right">
              Every price includes the consultation, the hot towel and the time
              it actually takes. Nothing on this page is an upsell.
            </p>
          </Rise>
        </div>
      </section>

      {/* ---------------- Paper: the six, in full ---------------- */}
      <section data-tone="ink" className="slab bg-paper text-ink">
        <div className="flex items-center justify-between gap-6 border-t border-current/20 pt-4">
          <span className="label">
            {services[0].index} — {services[services.length - 1].index}
          </span>
          <span
            className="display flex size-[clamp(2.6rem,4.6vw,4.75rem)] shrink-0 items-center justify-center rounded-full bg-ember text-[clamp(1.1rem,2vw,2.1rem)] text-ink italic"
            aria-hidden="true"
          >
            {services.length}
          </span>
        </div>

        <ul className="m-0 mt-16 list-none p-0 md:mt-24">
          {services.map((service, i) => (
            <ServiceRow key={service.id} service={service} imageLeft={i % 2 === 0} />
          ))}
        </ul>
      </section>

      {/* ---------------- Ember: combinations ---------------- */}
      <section data-tone="ink" className="relative bg-ember text-ink">
        <div className="edge py-[clamp(5rem,11vw,12rem)]">
          <div className="flex items-baseline justify-between gap-6 border-t border-current/20 pt-4">
            <span className="label">Combinations</span>
            <span className="label">{spell(combos.length)} of them</span>
          </div>

          {/* "Together" measures 3.48em wide in Bodoni italic at the mega
              tracking. 25vw is the size that runs it gutter to gutter without
              ever clipping — the binding case is 375px, where the 20px gutter
              leaves 335px and the word draws 326. */}
          <SplitText
            as="h2"
            className="mega mt-6 text-[clamp(3.25rem,25vw,30rem)] md:mt-10"
            segments={[{ text: "Together" }]}
          />

          <Rise delay={0.15} className="mt-10 flex md:mt-16 md:justify-end">
            <p className="note max-w-[30ch] md:text-right">
              Two services, one sitting, one price. Booked as a single
              appointment, so nobody is waiting on anybody.
            </p>
          </Rise>

          <ul className="m-0 mt-16 list-none p-0 md:mt-24">
            {combos.map((combo, i) => (
              <li
                key={combo.name}
                className="border-t border-current/20 py-6 md:py-9"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="label">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="label">{combo.minutes} min</span>
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-6 md:mt-5">
                  <h3 className="display text-lg italic">{combo.name}</h3>
                  <span className="display shrink-0 text-lg">
                    {money(combo.price)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- Ink: good to know ---------------- */}
      <section data-tone="paper" className="slab bg-ink text-paper">
        <div className="flex items-baseline justify-between gap-6 border-t border-current/20 pt-4">
          <span className="label">Good to know</span>
          <span className="label opacity-60">
            {spell(POLICIES.length)} notes
          </span>
        </div>

        <SplitText
          as="h2"
          className="display mt-8 max-w-[13ch] text-hero md:mt-12"
          segments={[
            { text: "Four things worth" },
            { text: "knowing first.", italic: true },
          ]}
        />

        <div className="mt-16 grid grid-cols-1 gap-x-16 gap-y-14 md:mt-28 md:grid-cols-2 md:gap-x-24 md:gap-y-24">
          {POLICIES.map((p, i) => (
            <Rise
              key={p.n}
              delay={i * 0.06}
              className="border-t border-current/20 pt-5"
            >
              <span className="label opacity-60">{p.n}</span>
              <h3 className="display mt-5 text-lg italic">{p.title}</h3>
              <p className="note mt-5 max-w-[34ch] opacity-80">{p.body}</p>
            </Rise>
          ))}
        </div>
      </section>

      {/* ---------------- Paper: the close ---------------- */}
      <section data-tone="ink" className="slab bg-paper text-ink">
        <div className="flex items-baseline justify-between gap-6 border-t border-current/20 pt-4">
          <span className="label">Reserve</span>
          <span className="label text-ash">Two minutes, no phone call</span>
        </div>

        <Link href="/book" className="group mt-10 block rounded-[10px] md:mt-16">
          <SplitText
            as="p"
            stagger={0.06}
            className="display text-[clamp(2.75rem,10.5vw,11rem)]"
            segments={[
              { text: "Now pick yours." },
              { text: "The chair is held.", italic: true },
            ]}
          />

          <Rise
            delay={0.2}
            className="mt-12 flex items-center justify-between gap-6 md:mt-20"
          >
            <span className="ui">Choose a service, a chair, a time</span>
            <span
              className="display flex size-[clamp(5.5rem,10vw,9rem)] shrink-0 items-center justify-center rounded-full bg-ember text-[clamp(1.05rem,1.8vw,1.75rem)] text-ink italic transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[14deg]"
              aria-hidden="true"
            >
              Book
            </span>
          </Rise>
        </Link>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */

/**
 * One service, one generous row. Odd rows put the photograph on the left,
 * even rows on the right, so the eye zig-zags down the slab instead of
 * running a list. Both cells are pinned to row 1 explicitly — with only a
 * column start, grid auto-placement would push the second cell down a row.
 */
function ServiceRow({
  service,
  imageLeft,
}: {
  service: Service;
  imageLeft: boolean;
}) {
  const textPlace = imageLeft
    ? "md:col-start-7 md:col-span-6 md:row-start-1"
    : "md:col-start-1 md:col-span-6 md:row-start-1";
  const imagePlace = imageLeft
    ? "md:col-start-1 md:col-span-5 md:row-start-1"
    : "md:col-start-8 md:col-span-5 md:row-start-1";

  return (
    <li
      id={service.id}
      /* scroll-mt keeps the fixed header off the anchor when the home page
         deep-links here with /services#skin-fade */
      className="scroll-mt-28 border-t border-current/20 pt-5 pb-20 md:pt-7 md:pb-32 lg:pb-40"
    >
      <div className="grid grid-cols-1 gap-y-10 md:grid-cols-12 md:items-start md:gap-x-6 lg:gap-x-8">
        <div className={textPlace}>
          <span className="label">{service.index}</span>

          <SplitText
            as="h2"
            className="display mt-4 text-xl md:mt-6"
            segments={[{ text: service.name, italic: true }]}
          />

          {/* The blurb and the price share one 46ch measure. `ch` resolves
              against the font-size of the box it is written on, so the measure
              is set once here — put it on both children and the two right
              edges land in different places. */}
          <div className="mt-7 max-w-[46ch] text-md md:mt-10">
            <Rise delay={0.12}>
              <p className="font-sans leading-[1.38]">{service.blurb}</p>
            </Rise>

            <Rise delay={0.2} className="mt-8 md:mt-12">
              <div className="flex items-baseline justify-between gap-6 border-t border-current/20 pt-4">
                <span className="display text-lg">{service.minutes} min</span>
                <span className="display text-lg italic">
                  {money(service.price)}
                </span>
              </div>
            </Rise>
          </div>
        </div>

        <div className={imagePlace}>
          <Frame
            src={service.image}
            alt={altFor(service)}
            parallax={8}
            sizes="(min-width: 768px) 42vw, 100vw"
            className="aspect-[4/3] w-full"
            objectPosition="center 40%"
          />
        </div>
      </div>
    </li>
  );
}
