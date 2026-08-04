import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { posts, shop, type Post } from "@/lib/content";
import { SplitText, Rise } from "@/components/motion/SplitText";
import { Frame } from "@/components/motion/Frame";
import { count } from "@/lib/words";

/* ------------------------------------------------------------------
   content.ts owns the words and the image paths. What it does not carry
   (the description of each photograph, the counting, and the two lines
   of house voice that belong to this page and nowhere else) is derived
   here. All of it is pure: no dates read at render, no randomness, so
   the server and the client always agree on the same markup.
   ------------------------------------------------------------------ */


const TOTAL_MINUTES = posts.reduce((sum, p) => sum + p.readMinutes, 0);
const CATEGORIES = Array.from(new Set(posts.map((p) => p.category)));
const CATEGORY_LINE = CATEGORIES.map((c) => c.toLowerCase()).join(", ");

/** The newest entry runs full width; everything behind it sits two-up. */
const [lead, ...rest] = posts;

export const metadata: Metadata = {
  title: "Журнал",
  description: `Заметки из кресла «${shop.name}» ${shop.cityIn}. ${count(
    posts.length,
    "запись",
    "записи",
    "записей"
  )}: ${CATEGORY_LINE}. ${count(
    TOTAL_MINUTES,
    "минута",
    "минуты",
    "минут"
  )} чтения в сумме.`,
};

export default function JournalPage() {
  return (
    <>
      {/* ---------------- Espresso: one word, dropped a third of a screen ---------------- */}
      <section data-tone="paper" className="relative lamp bg-espresso text-paper">
        <div className="edge pt-[30svh] pb-[clamp(4rem,9vw,9rem)]">
          <Rise className="border-t border-current/20 pt-4">
            <p className="label">Заметки из кресла</p>
          </Rise>

          {/* "Журнал" measures 3.01em wide in Playfair italic at the mega
              tracking, so the column's own inline size divided by 3.04 runs it
              gutter to gutter at every width. `cqw` rather than `vw` because a
              desktop scrollbar is part of `vw` and left the word 90px short. */}
          <div
            style={{ containerType: "inline-size" }}
            className="mt-[clamp(1.5rem,3vw,2.5rem)] overflow-x-clip"
          >
            <div style={{ "--text-mega": "calc(100cqw / 3.04)" } as CSSProperties}>
              <SplitText
                as="h1"
                delay={0.1}
                stagger={0.06}
                className="mega -ml-[0.015em] block"
                segments={[{ text: "Журнал" }]}
              />
            </div>
          </div>

          {/* One sentence. The strip of counts under it named the categories
              each post already carries and totted up minutes nobody reads as
              a sum. */}
          <Rise delay={0.28} className="mt-[clamp(3rem,9vw,7rem)] flex md:justify-end">
            {/* `.note`, not `.label`: this is running copy, and DESIGN.md keeps
                `.label` for eyebrows, meta and captions. */}
            <p className="note max-w-[32ch] md:text-right">
              Всё, что мы рассказали бы вам в кресле, если бы хватало времени
              рассказать это как следует.
            </p>
          </Rise>
        </div>
      </section>

      {/* ---------------- Paper: the lead, then the rest two-up ---------------- */}
      <section data-tone="ink" className="slab bg-paper text-ink">
        {/* ---- the lead ---- */}
        <article>
          <Link
            href={`/journal/${lead.slug}`}
            className="group block rounded-[10px]"
          >
            <Frame
              src={lead.image}
              alt={lead.imageAlt}
              priority
              sizes="100vw"
              parallax={7}
              /* 21:9 across a 350px column is a 150px letterbox, shorter than
                 the two posts underneath it, which is backwards for the lead. */
              className="aspect-[16/9] w-full md:aspect-[21/9]"
              objectPosition="center 45%"
            />

            <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-8 md:mt-14 md:grid-cols-12">
              <div className="md:col-span-7">
                <Meta post={lead} />

                <h2 className="display relative mt-5 max-w-[17ch] pb-3 text-xl italic md:mt-7">
                  {lead.title}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-out-expo group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  />
                </h2>
              </div>

              <div className="md:col-span-4 md:col-start-9 md:pt-2">
                <p className="max-w-[40ch] text-[1rem] leading-[1.65] text-ash">
                  {lead.excerpt}
                </p>
              </div>
            </div>
          </Link>
        </article>

        {/* ---- everything behind it ---- */}
        <ul className="m-0 mt-20 grid list-none grid-cols-1 gap-x-10 gap-y-16 p-0 md:mt-32 md:grid-cols-2 md:items-start md:gap-x-16">
          {rest.map((post, i) => (
            <li key={post.slug} className={i === 1 ? "md:mt-28" : ""}>
              <Rise delay={i * 0.08}>
                <Link
                  href={`/journal/${post.slug}`}
                  className="group block rounded-[10px]"
                >
                  <Frame
                    src={post.image}
                    alt={post.imageAlt}
                    sizes="(min-width: 768px) 44vw, 100vw"
                    parallax={6}
                    className="aspect-[3/2] w-full md:aspect-[4/5]"
                    objectPosition="center 45%"
                  />

                  <div className="mt-7 md:mt-9">
                    <Meta post={post} />

                    <h2 className="display relative mt-4 max-w-[18ch] pb-3 text-lg">
                      {post.title}
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-out-expo group-hover:scale-x-100 group-focus-visible:scale-x-100"
                      />
                    </h2>

                    <p className="mt-5 max-w-[38ch] text-[0.95rem] leading-[1.65] text-ash">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </Rise>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */

/**
 * Category and date. The read time went with the index numeral and the brass
 * dot that used to hold them apart: three numbers around a headline is a
 * dashboard, not a journal.
 */
function Meta({ post }: { post: Post }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-4">
      <span className="label">{post.category}</span>
      <span className="label text-ash">{post.date}</span>
    </div>
  );
}
