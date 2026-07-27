import { manifesto, shop } from "@/lib/content";
import { SplitText, Rise, type Segment } from "@/components/motion/SplitText";
import { Frame } from "@/components/motion/Frame";

/**
 * The italic run is always the closing beat of the headline. Derived from the
 * string rather than written out, so swapping content.ts keeps the roman/italic
 * mix intact. Deterministic — same result on the server and the client.
 */
function emphasise(line: string, tail = 2): Segment[] {
  const words = line.trim().split(/\s+/).filter(Boolean);
  const n = Math.min(tail, Math.max(words.length - 1, 1));
  const roman = words.slice(0, words.length - n).join(" ");
  const italic = words.slice(words.length - n).join(" ");
  return roman
    ? [{ text: roman }, { text: italic, italic: true }]
    : [{ text: italic, italic: true }];
}

/**
 * Ember slab. One idea: the forty minutes are yours.
 *
 * The note sits top-left under a hairline; the headline drops most of a screen
 * and shoves itself past the centre line toward the right gutter. What is left
 * between them is a diagonal of nothing, which is the point.
 */
export function Manifesto() {
  return (
    <section data-tone="ink" className="relative bg-ember text-ink">
      <div className="edge pt-[clamp(5rem,11vw,12rem)] pb-[clamp(4rem,9vw,9rem)]">
        {/* Typewriter copy alone in a large empty field, pinned left. */}
        <Rise className="w-full max-w-[34ch] border-t border-current/20 pt-5 md:pt-7">
          <p className="note">{manifesto.note}</p>
        </Rise>

        {/* The grid break: dropped down, pushed right, running to the edge. */}
        <div className="mt-[16svh] md:mt-[27svh] md:pl-[36%] lg:pl-[42%]">
          {/* `xl` collides with a Tailwind default size key, so `text-xl` drags
              its stock 1.4 line-height in over `.display`'s .86. Restating the
              leading here is the fix. */}
          <SplitText
            as="h2"
            className="display w-full text-xl leading-[0.86]"
            segments={emphasise(manifesto.headline)}
          />

          {/* The only General Sans on the slab. Narrow, and held to the right. */}
          <Rise delay={0.2} className="mt-10 md:mt-14">
            <p className="w-full max-w-[34ch] font-sans text-md leading-[1.38] md:ml-auto">
              {manifesto.body}
            </p>
          </Rise>
        </div>
      </div>

      {/* Gutter to gutter, tall enough to become the whole screen. */}
      <div className="edge pb-[clamp(5rem,11vw,12rem)]">
        <Frame
          src="/img/manifesto.jpg"
          alt={`Мастер «${shop.name}» ведёт опасную бритву по намыленной челюсти, белое полотенце сложено у него на плече`}
          sizes="100vw"
          parallax={10}
          className="h-[62svh] w-full md:h-[70svh]"
          objectPosition="60% 56%"
        />
      </div>
    </section>
  );
}
