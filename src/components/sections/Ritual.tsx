import { ritual } from "@/lib/content";
import { SplitText, Rise } from "@/components/motion/SplitText";

/**
 * Espresso slab. A giant roman/italic headline, then the three beats of a visit
 * (before, during, after) measured off a rule.
 *
 * The beats used to fall diagonally across the slab — left, right, then left
 * but deeper in — on the theory that a large empty field reads as a poster. It
 * does, but only around large objects, and these are a 110px numeral and a 12px
 * line of typewriter copy. On a wide monitor the section was most of a screen
 * of nothing with three small things adrift in it, which is the one thing this
 * design system's own layout rules tell you not to do.
 *
 * So they are measured instead. The rule is the shop's own name drawn out —
 * Миллиметр, whose mark is six bars stepping from solid to hairline — and the
 * beats stand on it at equal intervals like readings off a scale. The numbering
 * was always the point here, this being the only content on the site that is
 * genuinely a sequence; now the order is carried by the line rather than by
 * three numerals hoping to be read in the right order.
 *
 * `gap-x-0` is load-bearing: each beat draws its own segment of rule, and only
 * touching segments read as one line running the width of the slab. The copy
 * carries its own right padding instead, so the columns still breathe.
 */
export function Ritual() {
  return (
    <section data-tone="paper" className="relative lamp bg-espresso text-paper">
      <div className="edge pt-[clamp(5rem,11vw,12rem)] pb-[clamp(5rem,11vw,12rem)]">
        {/* Capped in em so it breaks after "Наш" at every viewport. */}
        <SplitText
          as="h2"
          className="display max-w-[3.2em] text-[clamp(3.5rem,13.5vw,15rem)]"
          segments={[{ text: "Наш" }, { text: "ритуал", italic: true }]}
        />

        <ol className="m-0 mt-[clamp(3.5rem,9vw,8rem)] grid list-none grid-cols-1 gap-y-[clamp(2.75rem,5vw,4rem)] p-0 md:grid-cols-3 md:gap-y-0">
          {ritual.map((step) => (
            <li key={step.n}>
              {/* The numeral stands on the rule rather than beside the copy: it
                  is the reading, and the line under it is the scale. */}
              <SplitText
                as="div"
                className="display text-[clamp(4rem,8.5vw,12rem)] leading-[0.78] italic"
                segments={[{ text: step.n }]}
              />

              <div
                aria-hidden="true"
                className="ruler mt-[clamp(1.25rem,2.5vw,2rem)]"
              />

              <Rise delay={0.18} y={16}>
                <p className="note mt-[clamp(1.25rem,2.5vw,2rem)] max-w-[30ch] pr-[clamp(1.25rem,3vw,3rem)]">
                  {step.text}
                </p>
              </Rise>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
