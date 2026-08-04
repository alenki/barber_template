import Link from "next/link";
import type { CSSProperties } from "react";
import { posts } from "@/lib/content";
import { SplitText, Rise } from "@/components/motion/SplitText";
import { Frame } from "@/components/motion/Frame";

/**
 * "Журнал" measures 3.01em wide in Playfair italic at the `.mega` tracking, so
 * dividing the column's own inline size by 3.04 runs it gutter to gutter with a
 * hair of slack for the italic overhang. Without the fit it fell back to the
 * stock `--text-mega` clamp and drew at under half the column; the one section
 * title on the site that read as a subhead.
 */
const MEGA_FIT = { "--text-mega": "calc(100cqw / 3.04)" } as CSSProperties;
const MEGA_CONTAINER = { containerType: "inline-size" } as CSSProperties;

/**
 * Journal: paper slab.
 * One mega word and three posts that step down the page instead of sitting in
 * a tidy row.
 *
 * A server component: SplitText, Rise and Frame each carry their own
 * "use client", so nothing here needs to ship the posts to the browser.
 */
export function JournalStrip() {
  return (
    <section data-tone="ink" className="slab bg-paper text-ink">
      <div style={MEGA_CONTAINER} className="overflow-x-clip">
        <div style={MEGA_FIT}>
          <SplitText
            as="h2"
            className="mega -ml-[0.015em] block"
            segments={[{ text: "Журнал" }]}
            stagger={0.06}
          />
        </div>
      </div>

      <ul className="m-0 mt-12 grid list-none grid-cols-1 gap-x-8 gap-y-16 p-0 md:mt-20 md:grid-cols-3 md:items-start md:gap-x-10">
        {posts.map((post, i) => (
          <li
            key={post.slug}
            className={i === 1 ? "md:mt-10" : i === 2 ? "md:mt-20" : ""}
          >
            <Rise delay={i * 0.08}>
              <Link href={`/journal/${post.slug}`} className="group block">
                {/* The one hover idea: the photograph lifts, the title draws its rule. */}
                <div className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-1.5 group-focus-visible:-translate-y-1.5">
                  <Frame
                    src={post.image}
                    alt={post.imageAlt}
                    className="aspect-[3/2] w-full"
                    sizes="(min-width: 768px) 30vw, 100vw"
                    parallax={6}
                  />
                </div>

                <p className="label mt-6">{post.category}</p>

                <h3 className="display relative mt-4 pb-3 text-lg">
                  {post.title}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-out-expo group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  />
                </h3>

                {/* No "Читать" under each one: the whole card is the link,
                    and the rule under the title is what says so. */}
                <p className="mt-5 max-w-[40ch] text-[0.95rem] leading-[1.65] text-ash">
                  {post.excerpt}
                </p>
              </Link>
            </Rise>
          </li>
        ))}
      </ul>

      <Rise className="mt-16 flex justify-end md:mt-24">
        <Link
          href="/journal"
          className="ui tap-reach inline-flex items-center gap-3 border-b border-current/30 pb-1.5 transition-colors duration-500 ease-out-expo hover:border-current"
        >
          Весь журнал <span aria-hidden="true">→</span>
        </Link>
      </Rise>
    </section>
  );
}
