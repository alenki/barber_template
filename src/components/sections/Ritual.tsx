import { ritual } from "@/lib/content";
import { SplitText, Rise } from "@/components/motion/SplitText";

/**
 * Where each step lands in the empty field: left, right, then left but deeper
 * in. Index-driven and fixed, so the scatter is identical on every render.
 */
const ANCHOR = ["md:ml-0", "md:ml-auto", "md:ml-[16%]"] as const;

/** The gap above each step. Roughly a quarter of the screen on desktop. */
const GAP = ["mt-[16svh] md:mt-[26svh]", "mt-[18svh] md:mt-[25svh]"] as const;

/**
 * Ember slab. A giant roman/italic headline, then three tiny typewriter blocks
 * scattered down a very tall, very empty column. The emptiness is the section.
 */
export function Ritual() {
  return (
    <section data-tone="ink" className="relative bg-ember text-ink">
      <div className="edge pt-[clamp(5rem,11vw,12rem)] pb-[clamp(6rem,13vw,14rem)]">
        {/* Capped in em so it breaks after "Наш" at every viewport. */}
        <SplitText
          as="h2"
          className="display max-w-[3.2em] text-[clamp(3.5rem,13.5vw,15rem)]"
          segments={[{ text: "Наш" }, { text: "ритуал", italic: true }]}
        />

        <ol className="m-0 list-none p-0">
          {ritual.map((step, i) => (
            <li
              key={step.n}
              className={`w-fit max-w-full ${i === 0 ? GAP[0] : GAP[1]} ${ANCHOR[i % ANCHOR.length]}`}
            >
              {/* leading restated: `text-xl` otherwise reimposes Tailwind's
                  stock 1.4 over `.display`'s .86. */}
              <SplitText
                as="div"
                className="display text-xl leading-[0.86]"
                segments={[{ text: step.n }]}
              />
              <Rise delay={0.18} y={16} className="mt-5 md:mt-7">
                <p className="note max-w-[28ch]">{step.text}</p>
              </Rise>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
