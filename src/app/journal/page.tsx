import type { Metadata } from "next";
import Link from "next/link";
import { posts, shop, type Post } from "@/lib/content";
import { SplitText, Rise } from "@/components/motion/SplitText";
import { Frame } from "@/components/motion/Frame";
import { count, plural, spellNone } from "@/lib/words";

/* ------------------------------------------------------------------
   content.ts owns the words and the image paths. What it does not carry
   — the description of each photograph, the counting, and the two lines
   of house voice that belong to this page and nowhere else — is derived
   here. All of it is pure: no dates read at render, no randomness, so
   the server and the client always agree on the same markup.
   ------------------------------------------------------------------ */


const TOTAL_MINUTES = posts.reduce((sum, p) => sum + p.readMinutes, 0);
const CATEGORIES = Array.from(new Set(posts.map((p) => p.category)));
const CATEGORY_LINE = CATEGORIES.map((c) => c.toLowerCase()).join(", ");

/** The newest entry runs full width; everything behind it sits two-up. */
const [lead, ...rest] = posts;

const index = (i: number) => String(i + 1).padStart(2, "0");

export const metadata: Metadata = {
  title: "Журнал",
  description: `Заметки из кресла «${shop.name}» ${shop.cityIn} — ${count(
    posts.length,
    "запись",
    "записи",
    "записей"
  )} — ${CATEGORY_LINE} — и ${count(
    TOTAL_MINUTES,
    "минута",
    "минуты",
    "минут"
  )} чтения в сумме.`,
};

export default function JournalPage() {
  return (
    <>
      {/* ---------------- Ember: one word, dropped a third of a screen ---------------- */}
      <section data-tone="ink" className="relative bg-ember text-ink">
        <div className="edge pt-[30svh] pb-[clamp(4rem,9vw,9rem)]">
          <Rise className="border-t border-current/20 pt-4">
            <p className="label">Заметки из кресла</p>
          </Rise>

          {/* "Журнал" measures 2.87em wide in Playfair italic at the mega
              tracking. 30vw is the size that runs it gutter to gutter
              without ever clipping — the binding case is 375px, where the
              20px gutters leave 335px and the word draws 323. */}
          <SplitText
            as="h1"
            delay={0.1}
            stagger={0.06}
            className="mega -ml-[0.015em] mt-[clamp(1.5rem,3vw,2.5rem)] text-[clamp(3.5rem,30vw,36rem)]"
            segments={[{ text: "Журнал" }]}
          />

          <Rise delay={0.28} className="mt-[clamp(3rem,9vw,7rem)] flex md:justify-end">
            <p className="label max-w-[32ch] md:text-right">
              Всё, что мы рассказали бы вам в кресле, если бы хватало времени
              рассказать это как следует.
            </p>
          </Rise>

          <Rise
            delay={0.36}
            className="mt-[clamp(3rem,8vw,6rem)] flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2 border-t border-current/20 pt-4"
          >
            <span className="label">
              {spellNone(posts.length, "f")}{" "}
              {plural(posts.length, "запись", "записи", "записей")}
            </span>
            <span className="label">{CATEGORIES.join(" · ")}</span>
            <span className="label">{TOTAL_MINUTES} минут в сумме</span>
          </Rise>
        </div>
      </section>

      {/* ---------------- Paper: the lead, then the rest two-up ---------------- */}
      <section data-tone="ink" className="slab bg-paper text-ink">
        <div className="flex items-center justify-between gap-6 border-t border-current/20 pt-4">
          <span className="label">Сначала новое</span>
          <span
            className="display flex size-[clamp(2.6rem,4.6vw,4.75rem)] shrink-0 items-center justify-center rounded-full bg-ember text-[clamp(1.1rem,2vw,2.1rem)] text-ink italic"
            aria-hidden="true"
          >
            {posts.length}
          </span>
        </div>

        {/* ---- the lead ---- */}
        <article className="mt-14 md:mt-24">
          <Link
            href={`/journal/${lead.slug}`}
            className="group block rounded-[10px]"
          >
            <div className="flex items-baseline justify-between gap-6">
              <span className="label">{index(0)}</span>
              <span className="label text-ash">{lead.date}</span>
            </div>

            <Frame
              src={lead.image}
              alt={lead.imageAlt}
              priority
              sizes="100vw"
              parallax={7}
              className="mt-6 aspect-[21/9] w-full md:mt-8"
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
                <span className="ui mt-7 inline-block underline underline-offset-[6px]">
                  Читать целиком
                </span>
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
                  <div className="flex items-baseline justify-between gap-6 border-t border-current/20 pt-4">
                    <span className="label">{index(i + 1)}</span>
                    <span className="label text-ash">{post.date}</span>
                  </div>

                  <Frame
                    src={post.image}
                    alt={post.imageAlt}
                    sizes="(min-width: 768px) 44vw, 100vw"
                    parallax={6}
                    className="mt-6 aspect-[3/2] w-full md:mt-8 md:aspect-[4/5]"
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

                    <span className="ui mt-6 inline-block underline underline-offset-[6px]">
                      Читать
                    </span>
                  </div>
                </Link>
              </Rise>
            </li>
          ))}
        </ul>

        <Rise className="mt-20 flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3 border-t border-current/20 pt-4 md:mt-32">
          <span className="label">Написано в зале</span>
          <span className="label text-ash">
            Каждую запись писал тот, кто держал машинку
          </span>
        </Rise>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */

/** Category and read time, held apart by a small ember dot. */
function Meta({ post }: { post: Post }) {
  return (
    <div className="flex items-center gap-3">
      <span className="label">{post.category}</span>
      <span
        aria-hidden="true"
        className="inline-block size-[5px] shrink-0 rounded-full bg-ember"
      />
      <span className="label">{post.readMinutes} мин чтения</span>
    </div>
  );
}
