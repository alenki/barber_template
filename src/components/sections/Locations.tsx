import type { CSSProperties } from "react";
import { locations, shop } from "@/lib/content";
import { SplitText, Rise } from "@/components/motion/SplitText";
import { Frame } from "@/components/motion/Frame";

/** See the note on the heading. 2.473em measured, 2.50 with slack. */
const MEGA_FIT = { "--text-mega": "calc(100cqw / 2.5)" } as CSSProperties;
const MEGA_CONTAINER = { containerType: "inline-size" } as CSSProperties;

/**
 * Locations: espresso slab.
 * One mega word, then the three rooms as tall 3:4 portraits over their hours.
 * The whole card is the map link; the `+` disc is the only thing that moves
 * on hover.
 *
 * content.ts carries the image paths but not their alt text, so the
 * photograph descriptions are derived here.
 */
const ALT: Record<string, string> = {
  patriki:
    "Зал на Патриарших вечером: пять хромированных кресел с чёрной кожей напротив зеркал в рамах вдоль стены в белой плитке",
  oktyabr:
    "Два винтажных кресла из чёрной кожи под промышленными подвесными лампами в сером зале с высоким потолком",
  danilovsky:
    "Хромированное кресло с тёмной кожей стоит в одиночестве перед высоким арочным зеркалом в латунной раме",
};

/** Deep-links straight into Yandex Maps rather than to a pinned coordinate. */
function mapsUrl(address: string, city: string) {
  return `https://yandex.ru/maps/?text=${encodeURIComponent(
    address + ", " + city
  )}`;
}

export function Locations() {
  return (
    <section data-tone="paper" className="slab lamp bg-espresso text-paper">
      {/* Every other mega word on the site runs gutter to gutter. This one was
          held to about 60% of the measure to leave the corner free for a count
          badge, and the badge is gone, so all that was left of the reason was a
          third of an empty slab beside a six-letter word.

          Fitted the way the rest of them are: `100cqw / N`, N being the word's
          measured em width (2.473 at `.mega`'s tracking) plus a little slack for
          the italic overhang. `cqw` rather than `vw` — `vw` counts the desktop
          scrollbar and leaves the word ~90px short of the gutter. */}
      <div style={MEGA_CONTAINER}>
        <div style={MEGA_FIT}>
          <SplitText
            as="h2"
            className="mega -ml-[0.015em] block"
            segments={[{ text: "Адреса" }]}
            stagger={0.06}
          />
        </div>
      </div>

      <ul className="m-0 mt-12 grid list-none grid-cols-1 gap-x-8 gap-y-16 p-0 md:mt-20 md:grid-cols-3 lg:gap-x-12">
        {locations.map((loc, i) => (
          <li key={loc.id}>
            <Rise delay={i * 0.08}>
              <a
                href={mapsUrl(loc.address, loc.city)}
                target="_blank"
                rel="noreferrer"
                className="group block"
              >
                <Frame
                  src={loc.image}
                  alt={ALT[loc.id] ?? `Зал «${loc.name}» в «${shop.name}»`}
                  className="aspect-[3/4] w-full"
                  sizes="(min-width: 768px) 31vw, 100vw"
                  parallax={7}
                  delay={i * 0.06}
                />

                <h3 className="display m-0 mt-6 text-lg italic">
                  {loc.name}
                  <span
                    aria-hidden="true"
                    className="ml-2 inline-flex size-[clamp(1.15rem,1.9vw,1.85rem)] items-center justify-center rounded-full bg-brass align-middle font-sans text-[clamp(0.62rem,0.95vw,0.9rem)] leading-none font-bold text-ink transition-transform duration-500 ease-out-expo group-hover:rotate-90 group-focus-visible:rotate-90 md:ml-3"
                  >
                    +
                  </span>
                </h3>

                <p className="label m-0 mt-3">{loc.address}</p>

                {/* Nine hairline rows across three cards, drawing a table on a
                    poster. The same hours, set as three plain lines, say the
                    same thing and draw nothing. */}
                <dl className="m-0 mt-5">
                  {loc.hours.map((h) => (
                    <div
                      key={h.days}
                      className="flex items-baseline justify-between gap-4"
                    >
                      <dt className="label m-0 opacity-70">{h.days}</dt>
                      <dd className="label m-0 text-right tabular-nums opacity-70">
                        {h.time}
                      </dd>
                    </div>
                  ))}
                </dl>

                <span className="sr-only">
                  Открыть «{loc.name}» в Яндекс Картах, в новой вкладке
                </span>
              </a>
            </Rise>
          </li>
        ))}
      </ul>
    </section>
  );
}
