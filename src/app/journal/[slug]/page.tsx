import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, barbers, shop, type Post } from "@/lib/content";
import { SplitText, Rise } from "@/components/motion/SplitText";
import { Frame } from "@/components/motion/Frame";

/* ------------------------------------------------------------------
   content.ts owns every word of the post. This file owns the things it
   does not carry: the description of each photograph and which chair
   wrote which entry. Both are static lookups keyed by slug; nothing is
   generated at render time, so the server and the client agree exactly.
   ------------------------------------------------------------------ */


/** Who was holding the clippers. Keyed to the barber ids in content.ts. */
const WRITTEN_BY: Record<string, string> = {
  "kak-chasto-strichsya": "artem",
  "otrastit-eshchyo-mesyats": "roman",
  "vsyo-o-goryachem-polotence": "gleb",
};

const authorFor = (post: Post) =>
  barbers.find((b) => b.id === WRITTEN_BY[post.slug]) ?? barbers[0];

const findPost = (slug: string) => posts.find((p) => p.slug === slug);

/* ------------------------------------------------------------------ */

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost(slug);

  if (!post) {
    return { title: "Журнал" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} · ${shop.name}`,
      description: post.excerpt,
      type: "article",
      images: [post.image],
    },
  };
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = findPost(slug);

  if (!post) notFound();

  const author = authorFor(post);
  const [standfirst, ...body] = post.body;
  const others = posts.filter((p) => p.slug !== post.slug);

  return (
    <>
      {/* ---------------- Espresso: the masthead ---------------- */}
      <section data-tone="paper" className="relative lamp bg-espresso text-paper">
        <div className="edge pt-[28svh] pb-[clamp(2.5rem,6vw,5rem)]">
          <Rise className="flex flex-wrap items-baseline gap-x-6 border-t border-current/20 pt-4">
            <span className="label">{post.category}</span>
            <span className="label opacity-70">{post.date}</span>
          </Rise>

          {/* Roman, not italic. This headline is being read, not looked at. */}
          <SplitText
            as="h1"
            delay={0.12}
            className="display mt-[clamp(1.75rem,3.5vw,3rem)] max-w-[20ch] text-xl"
            segments={[{ text: post.title }]}
          />
        </div>
      </section>

      {/* ---------------- The photograph, straddling the two slabs ----------------
          Top half of this band is espresso, bottom half is paper, so the frame
          sits across the seam without either slab having to know about it.
          Both halves are light, so the header stays `ink` throughout. */}
      <div data-tone="ink" className="edge relative">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1/2 bg-espresso" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-paper" />
        <Frame
          src={post.image}
          alt={post.imageAlt}
          priority
          sizes="100vw"
          parallax={6}
          className="relative aspect-[16/9] w-full"
          objectPosition="center 45%"
        />
      </div>

      {/* ---------------- Paper: the only real prose on the site ---------------- */}
      <section
        data-tone="ink"
        className="edge bg-paper pt-[clamp(3rem,7vw,6rem)] pb-[clamp(5rem,11vw,12rem)] text-ink"
      >
        {/* `ch` resolves against the element's own font-size, so the measure
            is set at the size the prose is actually read at. */}
        <div className="mx-auto max-w-[62ch] text-[1.15rem]">
          <div className="border-t border-current/20 pt-4">
            <span className="label">
              Текст: {author.name}, кресло {author.chair}
            </span>
          </div>

          <Rise className="mt-12 md:mt-16">
            <article>
              <p className="font-sans text-[clamp(1.35rem,2vw,1.6rem)] leading-[1.45]">
                {standfirst}
              </p>

              {body.map((paragraph, i) => (
                <p
                  key={i}
                  className="mt-7 font-sans text-[1.15rem] leading-[1.7] md:mt-8"
                >
                  {paragraph}
                </p>
              ))}
            </article>
          </Rise>
        </div>
      </section>

      {/* ---------------- Espresso: the other two ---------------- */}
      <section data-tone="paper" className="slab lamp bg-espresso text-paper">
        <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3 border-t border-current/20 pt-4">
          <h2 className="label">Ещё из журнала</h2>
          <Link
            href="/journal"
            className="ui border-b border-current/30 pb-1 transition-colors duration-500 ease-out-expo hover:border-current"
          >
            Все записи
          </Link>
        </div>

        <ul className="m-0 mt-14 grid list-none grid-cols-1 gap-x-16 gap-y-14 p-0 md:mt-20 md:grid-cols-2 md:items-start">
          {others.map((other, i) => (
            <li key={other.slug} className={i === 1 ? "md:mt-20" : ""}>
              <Rise delay={i * 0.08}>
                <Link
                  href={`/journal/${other.slug}`}
                  className="group block rounded-[10px]"
                >
                  <Frame
                    src={other.image}
                    alt={other.imageAlt}
                    sizes="(min-width: 768px) 42vw, 100vw"
                    parallax={6}
                    className="aspect-[3/2] w-full"
                    objectPosition="center 45%"
                  />

                  <p className="label mt-6">{other.category}</p>

                  <h3 className="display relative mt-4 max-w-[18ch] pb-3 text-lg italic">
                    {other.title}
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-out-expo group-hover:scale-x-100 group-focus-visible:scale-x-100"
                    />
                  </h3>
                </Link>
              </Rise>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
