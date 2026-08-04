import type { CSSProperties } from "react";
import { manifesto, shop } from "@/lib/content";
import { SplitText, Rise, type Segment } from "@/components/motion/SplitText";
import { Frame } from "@/components/motion/Frame";

/**
 * The italic run is always the closing beat of the headline. Derived from the
 * string rather than written out, so swapping content.ts keeps the roman/italic
 * mix intact. Deterministic: same result on the server and the client.
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
 * The height the photograph and the text column are both cut to, so the two
 * are one object rather than two stacked ones. Carried as a custom property
 * rather than interpolated into the class names: Tailwind scans the source for
 * literal strings, and `h-[${SPREAD}]` is not one.
 */
const SPREAD = { "--spread": "clamp(30rem, 78svh, 50rem)" } as CSSProperties;

/**
 * Espresso slab. One idea: the forty minutes are yours.
 *
 * This used to drop the headline most of a screen and shove it past the centre
 * line, leaving a diagonal of empty slab that was meant to read as composition.
 * On a wide monitor it read as a bug — half a screen of nothing with type
 * floating in the other half — and the photograph that answered the claim was
 * parked underneath where nobody saw the two together.
 *
 * So they share a spread: the photograph takes the space the void used to be,
 * and the claim sits against it as one centred block rather than two objects
 * with weather between them. The column is a third of the measure so the frame
 * keeps a portrait proportion at any width — a half-and-half split cropped it
 * square, which threw away most of a picture that is composed top to bottom.
 */
export function Manifesto() {
  return (
    <section data-tone="paper" className="relative lamp bg-espresso text-paper">
      <div
        style={SPREAD}
        className="slab grid items-start gap-[clamp(2.5rem,4.5vw,5rem)] md:grid-cols-[minmax(0,34%)_minmax(0,1fr)]"
      >
        <Frame
          src="/img/manifesto.jpg"
          alt={`Мастер «${shop.name}» ведёт опасную бритву по намыленной челюсти, белое полотенце сложено у него на плече`}
          /* Two thirds of the frame is the client's jaw and the barber's
             hands; the crop holds those and lets the room go. */
          sizes="(min-width: 768px) 34vw, 100vw"
          parallax={8}
          className="aspect-[3/4] w-full md:aspect-auto md:h-[var(--spread)]"
          objectPosition="52% 46%"
        />

        {/* Cut to the frame's height and centred inside it, so the block reads
            as set against the photograph however tall the viewport is. Below md
            the frame is above it and there is nothing to centre on, so the
            height and the centring both drop away. */}
        <div className="flex flex-col justify-center md:h-[var(--spread)]">
          {/* `xl` collides with a Tailwind default size key, so `text-xl` drags
              its stock 1.4 line-height in over `.display`'s .86. Restating the
              leading here is the fix. Sized off the column rather than the
              viewport: at `text-xl` the headline broke to five lines in a
              half-width measure. */}
          <SplitText
            as="h2"
            className="display w-full text-[clamp(2.1rem,4.1vw,6.5rem)] leading-[0.92]"
            segments={emphasise(manifesto.headline)}
          />

          {/* The only General Sans on the slab, and the only brass on it: one
              short rule, carrying the break between the claim and the way it
              is kept. */}
          <Rise delay={0.2} className="mt-[clamp(2rem,3.5vw,3.25rem)]">
            <span
              aria-hidden="true"
              className="mb-[clamp(1.75rem,3vw,2.5rem)] block h-px w-[clamp(3.5rem,7vw,7rem)] bg-brass"
            />
            <p className="m-0 w-full max-w-[34ch] font-sans text-md leading-[1.38]">
              {manifesto.body}
            </p>
          </Rise>
        </div>
      </div>
    </section>
  );
}
