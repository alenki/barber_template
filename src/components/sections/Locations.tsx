import { locations, shop } from "@/lib/content";
import { SplitText, Rise } from "@/components/motion/SplitText";
import { Frame } from "@/components/motion/Frame";

/**
 * Locations: ember slab.
 * One mega word with an inverted (ink-on-ember) count badge, then the three
 * rooms as tall 3:4 portraits over a hairline hours table. The whole card is
 * the map link; the `+` disc is the only thing that moves on hover.
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

const WALK_IN = "Без записи, если есть свободное кресло.";

export function Locations() {
  return (
    <section data-tone="ink" className="slab bg-ember text-ink">
      {/* The word, with the count riding its top-right corner. */}
      <div className="relative block w-fit max-w-full">
        {/* "Адреса" is six letters where "Locations" was nine, so the stock
            `--text-mega` clamp would leave it sitting at about 40% of the
            slab. 24vw restores the proportion the section was drawn at
            (roughly two thirds of the column) without ever reaching the
            gutter, which is what keeps room for the count badge. */}
        <SplitText
          as="h2"
          className="mega -ml-[0.015em] text-[clamp(3.5rem,24vw,26rem)]"
          segments={[{ text: "Адреса" }]}
          stagger={0.06}
        />

        {/* "Адреса" ends on an x-height "а", so a badge pinned tight to the
            word's corner lands on the letter. It is pushed clear of both the
            ascender line and the right edge instead. */}
        <Rise
          delay={0.45}
          y={14}
          className="absolute top-[-0.9rem] right-[-1.1rem] md:top-[-2.1rem] md:right-[-2.6rem]"
        >
          <span
            className="flex size-[clamp(2.6rem,5.6vw,5.5rem)] items-center justify-center rounded-full bg-ink text-ember"
            aria-hidden="true"
          >
            <span className="display pl-[0.04em] text-[clamp(1.1rem,2.4vw,2.4rem)] leading-none italic">
              {locations.length}
            </span>
          </span>
        </Rise>
      </div>

      <div className="mt-10 border-t border-current/20 md:mt-14" />

      <ul className="m-0 mt-12 grid list-none grid-cols-1 gap-x-8 gap-y-16 p-0 md:mt-16 md:grid-cols-3 lg:gap-x-12">
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
                    className="ml-2 inline-flex size-[clamp(1.15rem,1.9vw,1.85rem)] items-center justify-center rounded-full bg-ink align-middle font-sans text-[clamp(0.62rem,0.95vw,0.9rem)] leading-none font-bold text-ember transition-transform duration-500 ease-out-expo group-hover:rotate-90 group-focus-visible:rotate-90 md:ml-3"
                  >
                    +
                  </span>
                </h3>

                <p className="label m-0 mt-3">
                  {loc.address}
                  <br />
                  {loc.city}
                </p>

                <dl className="m-0 mt-6 border-b border-current/20">
                  {loc.hours.map((h) => (
                    <div
                      key={h.days}
                      className="flex items-baseline justify-between gap-4 border-t border-current/20 py-2"
                    >
                      <dt className="label m-0">{h.days}</dt>
                      <dd className="label m-0 text-right tabular-nums">
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

      <Rise className="mt-16 flex justify-end md:mt-24">
        <p className="note m-0 max-w-[34ch] text-right">
          {WALK_IN}
          <br />
          {/* whitespace-nowrap so the number cannot wrap into a two-line,
              33px-tall tap target the way it did at 375px. */}
          <a
            href={shop.phoneHref}
            className="inline-block py-2 whitespace-nowrap underline underline-offset-[5px] transition-opacity duration-500 ease-out-expo hover:opacity-60"
          >
            {shop.phone}
          </a>
        </p>
      </Rise>
    </section>
  );
}
