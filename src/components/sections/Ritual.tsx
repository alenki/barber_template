import { ritual } from "@/lib/content";
import { SplitText, Rise } from "@/components/motion/SplitText";

/**
 * Where each step lands in the empty field: left, right, then left but deeper
 * in. Index-driven and fixed, so the scatter is identical on every render.
 */
const ANCHOR = [
  "md:mr-auto",
  "md:ml-auto md:mr-[3%]",
  "md:ml-[13%] md:mr-auto",
] as const;

/**
 * Ember slab. A giant roman/italic headline, then the three beats of a visit
 * (before, during, after) falling diagonally across the slab.
 *
 * The numbering is not decoration: this is the only genuinely ordered content
 * on the site, and the order is what the section is about. Each beat sits
 * under its own hairline like everything else here, which is what keeps three
 * small objects in a very large field reading as a composition rather than as
 * three things that got lost.
 */
export function Ritual() {
  return (
    <section data-tone="ink" className="relative bg-ember text-ink">
      <div className="edge pt-[clamp(5rem,11vw,12rem)] pb-[clamp(5rem,11vw,12rem)]">
        {/* Capped in em so it breaks after "Наш" at every viewport. */}
        <SplitText
          as="h2"
          className="display max-w-[3.2em] text-[clamp(3.5rem,13.5vw,15rem)]"
          segments={[{ text: "Наш" }, { text: "ритуал", italic: true }]}
        />

        <ol className="m-0 mt-[clamp(3rem,8vw,7rem)] list-none p-0">
          {ritual.map((step, i) => (
            <li
              key={step.n}
              className={`w-full border-t border-current/20 pt-6 md:w-[min(34rem,48%)] md:pt-8 ${
                i === 0 ? "" : "mt-[clamp(2.5rem,5vw,4.5rem)]"
              } ${ANCHOR[i % ANCHOR.length]}`}
            >
              <div className="flex flex-col items-start md:flex-row md:items-end md:gap-[clamp(1.25rem,3vw,3rem)]">
                {/* The numeral carries the section's scale; the note is the
                    only small thing on the slab, so it hangs off the numeral's
                    baseline rather than floating on its own. Stacked below md,
                    where a numeral beside a 26ch column leaves neither room. */}
                <SplitText
                  as="div"
                  className="display shrink-0 text-[clamp(5rem,15vw,11rem)] leading-[0.72] italic"
                  segments={[{ text: step.n }]}
                />
                <Rise
                  delay={0.18}
                  y={16}
                  className="mt-5 min-w-0 md:mt-0 md:pb-[0.35em]"
                >
                  <p className="note max-w-[26ch]">{step.text}</p>
                </Rise>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
