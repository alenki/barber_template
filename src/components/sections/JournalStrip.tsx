"use client";

import Link from "next/link";
import { posts } from "@/lib/content";
import { SplitText, Rise } from "@/components/motion/SplitText";
import { Frame } from "@/components/motion/Frame";

/**
 * Journal — paper slab.
 * One mega word, a typewriter note pinned to the far edge, and three posts
 * that step down the page instead of sitting in a tidy row.
 *
 * Photograph descriptions are derived here because content.ts carries the
 * image paths but not their alt text.
 */
const ALT: Record<string, string> = {
  "how-often-should-you-cut-your-hair":
    "A badger shaving brush resting in a silver lather bowl beside two open straight razors and a row of clipper guards on a dark towel",
  "growing-it-out-one-more-month":
    "An illuminated red, white and blue barber pole mounted on a stone shopfront wall",
  "everything-about-the-hot-towel":
    "Clippers, a gold trimmer, shears, a straight razor, a comb and a neck brush laid out in a row on a black towel",
};

export function JournalStrip() {
  return (
    <section data-tone="ink" className="slab bg-paper text-ink">
      {/* Title row: the word, and the note pushed to the opposite edge. */}
      <div className="flex items-start justify-between gap-6">
        <SplitText
          as="h2"
          className="mega -ml-[0.015em]"
          segments={[{ text: "Journal" }]}
          stagger={0.06}
        />
        <Rise delay={0.2} className="shrink-0 pt-[0.6em]">
          <p className="label max-w-[14ch] text-right">Notes from the chair</p>
        </Rise>
      </div>

      <div className="mt-10 border-t border-current/20 md:mt-14" />

      <ul className="m-0 mt-12 grid list-none grid-cols-1 gap-x-8 gap-y-16 p-0 md:mt-16 md:grid-cols-3 md:items-start md:gap-x-10">
        {posts.map((post, i) => (
          <li
            key={post.slug}
            className={i === 1 ? "md:mt-16" : i === 2 ? "md:mt-32" : ""}
          >
            <Rise delay={i * 0.08}>
              <Link href={`/journal/${post.slug}`} className="group block">
                {/* The one hover idea: the photograph lifts, the title draws its rule. */}
                <div className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-1.5 group-focus-visible:-translate-y-1.5">
                  <Frame
                    src={post.image}
                    alt={ALT[post.slug] ?? `Photograph from the ${post.category} journal`}
                    className="aspect-[3/2] w-full"
                    sizes="(min-width: 768px) 30vw, 100vw"
                    parallax={6}
                  />
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <span className="label">{post.category}</span>
                  <span
                    aria-hidden="true"
                    className="inline-block size-[5px] shrink-0 rounded-full bg-ember"
                  />
                  <span className="label">{post.readMinutes} min read</span>
                </div>

                <h3 className="display relative mt-4 pb-3 text-lg">
                  {post.title}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-out-expo group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  />
                </h3>

                <p className="mt-5 max-w-[40ch] text-[0.95rem] leading-[1.65] text-ash">
                  {post.excerpt}
                </p>

                <span className="ui mt-6 inline-block underline underline-offset-[6px]">
                  Read
                </span>
              </Link>
            </Rise>
          </li>
        ))}
      </ul>

      <Rise className="mt-16 flex justify-end md:mt-24">
        <Link
          href="/journal"
          className="ui inline-flex items-center gap-3 border-b border-current/30 pb-1.5 transition-colors duration-500 ease-out-expo hover:border-current"
        >
          The whole journal <span aria-hidden="true">→</span>
        </Link>
      </Rise>
    </section>
  );
}
